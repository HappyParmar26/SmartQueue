const OfficeModel = require("../models/office.model");
const SlotModel = require("../models/slot.model");
const TokenModel = require("../models/token.model");
const CounterModel = require("../models/counter.model");
const UserModel = require("../models/user.model");
const ObservationModel = require("../models/observation.model");

const {
    SKIP_HOLD_MINUTES,
    getLocalDateKey,
    createTokenRecord,
    getOfficeQueueSnapshot,
    getCitizenTokenLiveState,
    selectNextToken,
    tokenToObject,
} = require("../services/queue.service");

const {
    emitOfficeQueueUpdate,
    emitTokenUpdate,
    emitCounterUpdate,
    emitPublicDisplayUpdate,
} = require("../realtime/socket");

function resolveOfficeId(req) {
    return (
        req.user?.office_id ||
        req.params?.office_id ||
        req.body?.office_id ||
        req.query?.office_id ||
        null
    );
}

function resolveDate(req) {
    return req.body?.date || req.query?.date || getLocalDateKey();
}

async function resolveCounterForOffice(officeId, payload = {}) {
    if (!officeId) {
        return null;
    }

    if (payload.counter_id) {
        return CounterModel.findOne({
            _id: payload.counter_id,
            office_id: officeId,
        });
    }

    if (payload.counter_number !== undefined && payload.counter_number !== null) {
        return CounterModel.findOne({
            office_id: officeId,
            counter_number: payload.counter_number,
        });
    }

    return null;
}

async function resolveCitizenForWalkIn(payload) {
    const bcryptjs = require('bcryptjs');
    
    if (payload.citizen_id) {
        return payload.citizen_id;
    }

    if (!payload.phone) {
        return null;
    }

    const existing = await UserModel.findOne({ phone: payload.phone });
    if (existing) {
        return existing._id;
    }

    if (!payload.name) {
        return null;
    }

    // Generate a temporary password for walk-in users
    const tempPassword = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcryptjs.hash(tempPassword, 10);

    const user = await UserModel.create({
        name: payload.name,
        phone: payload.phone,
        email: payload.email || `walkin-${payload.phone}@temp.local`,
        password: hashedPassword,
        role: "user",
        priority: payload.priority || undefined,
        preferences: payload.preferences || undefined,
    });

    return user._id;
}

async function getAdminDashboard(req, res) {
    try {
        const officeId = resolveOfficeId(req);
        if (!officeId) {
            return res.status(400).json({
                success: false,
                message: "office_id is required",
            });
        }

        const snapshot = await getOfficeQueueSnapshot({
            officeId,
            serviceId: req.query?.service_id || null,
            date: resolveDate(req),
        });

        const totals = await Promise.all([
            TokenModel.countDocuments({
                office_id: officeId,
                "booking.date": snapshot.date,
                status: "waiting",
            }),
            TokenModel.countDocuments({
                office_id: officeId,
                "booking.date": snapshot.date,
                status: "called",
            }),
            TokenModel.countDocuments({
                office_id: officeId,
                "booking.date": snapshot.date,
                status: "served",
            }),
            TokenModel.countDocuments({
                office_id: officeId,
                "booking.date": snapshot.date,
                "priority.is_priority": true,
            }),
        ]);

        return res.status(200).json({
            success: true,
            message: "Dashboard fetched successfully",
            data: {
                snapshot,
                totals: {
                    waiting: totals[0],
                    called: totals[1],
                    served: totals[2],
                    priority: totals[3],
                },
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function getAdminQueue(req, res) {
    try {
        const officeId = resolveOfficeId(req);
        if (!officeId) {
            return res.status(400).json({
                success: false,
                message: "office_id is required",
            });
        }

        const snapshot = await getOfficeQueueSnapshot({
            officeId,
            serviceId: req.query?.service_id || null,
            date: resolveDate(req),
        });

        return res.status(200).json({
            success: true,
            message: "Queue fetched successfully",
            data: snapshot,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function callNextToken(req, res) {
    try {
        const officeId = resolveOfficeId(req);
        if (!officeId) {
            return res.status(400).json({
                success: false,
                message: "office_id is required",
            });
        }

        const counter = await resolveCounterForOffice(officeId, req.body || {});
        const serviceId =
            req.body?.service_id ||
            counter?.service_id ||
            null;

        const { token } = await selectNextToken({
            officeId,
            serviceId,
            date: resolveDate(req),
        });

        if (!token) {
            return res.status(404).json({
                success: false,
                message: "No eligible token found",
            });
        }

        const now = new Date();
        token.status = "called";
        token.timestamps = token.timestamps || {};
        token.timestamps.called_at = now;
        token.queue = token.queue || {};
        token.queue.hold_until = null;
        token.queue.returned_from_skip_at = null;
        token.history = token.history || [];
        token.history.push({
            status: "called",
            changed_at: now,
            changed_by: req.user?.id || null,
            note: `Called by counter manager${counter ? ` at counter ${counter.counter_number}` : ""}`,
        });

        if (counter) {
            counter.current_token = token.token_number;
            counter.status = "active";
            counter.opened_at = counter.opened_at || now;
            await counter.save();
            emitCounterUpdate(officeId, tokenToObject(counter));
        }

        await token.save();

        emitTokenUpdate(token, {
            officeId,
            event: "token.called",
        });

        emitOfficeQueueUpdate(officeId, {
            date: resolveDate(req),
            serviceId,
        });

        return res.status(200).json({
            success: true,
            message: "Next token called successfully",
            data: token,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function skipQueueToken(req, res) {
    try {
        const { id } = req.params;
        const token = await TokenModel.findById(id);

        if (!token) {
            return res.status(404).json({
                success: false,
                message: "Token not found",
            });
        }

        if (["served", "cancelled", "no_show"].includes(token.status)) {
            return res.status(400).json({
                success: false,
                message: `Token is already ${token.status}`,
            });
        }

        const now = new Date();
        token.status = "waiting";
        token.queue = token.queue || {};
        token.queue.hold_until = new Date(now.getTime() + SKIP_HOLD_MINUTES * 60000);
        token.queue.returned_from_skip_at = null;
        token.queue.skipped_count = (token.queue.skipped_count || 0) + 1;
        token.timestamps = token.timestamps || {};
        token.history = token.history || [];
        token.history.push({
            status: "waiting",
            changed_at: now,
            changed_by: req.user?.id || null,
            note: `Skipped for ${SKIP_HOLD_MINUTES} minutes`,
        });

        if (token.counter?.counter_id) {
            const counter = await CounterModel.findById(token.counter.counter_id);
            if (counter && counter.current_token === token.token_number) {
                counter.current_token = null;
                counter.status = "active";
                await counter.save();
                emitCounterUpdate(token.office_id, tokenToObject(counter));
            }
        }

        await token.save();

        emitTokenUpdate(token, {
            officeId: token.office_id,
            event: "token.skipped",
        });

        emitOfficeQueueUpdate(token.office_id, {
            date: token.booking?.date || resolveDate(req),
            serviceId: token.service?.service_id || null,
        });

        return res.status(200).json({
            success: true,
            message: `Token skipped and held for ${SKIP_HOLD_MINUTES} minutes`,
            data: token,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function serveQueueToken(req, res) {
    try {
        const { id } = req.params;
        const token = await TokenModel.findById(id);

        if (!token) {
            return res.status(404).json({
                success: false,
                message: "Token not found",
            });
        }

        if (token.status === "served") {
            return res.status(400).json({
                success: false,
                message: "Token is already served",
            });
        }

        const now = new Date();
        // Token goes directly from called/waiting to served
        token.status = "served";
        token.timestamps = token.timestamps || {};
        token.timestamps.served_at = now;
        token.history = token.history || [];
        token.history.push({
            status: "served",
            changed_at: now,
            changed_by: req.user?.id || null,
            note: "Token marked served by counter manager",
        });

        if (token.counter?.counter_id) {
            const counter = await CounterModel.findById(token.counter.counter_id);
            if (counter && counter.current_token === token.token_number) {
                counter.current_token = null;
                counter.status = "active";
                await counter.save();
                emitCounterUpdate(token.office_id, tokenToObject(counter));
            }
        }

        await token.save();

        emitTokenUpdate(token, {
            officeId: token.office_id,
            event: "token.served",
        });

        emitOfficeQueueUpdate(token.office_id, {
            date: token.booking?.date || resolveDate(req),
            serviceId: token.service?.service_id || null,
        });

        return res.status(200).json({
            success: true,
            message: "Token marked served successfully",
            data: token,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function transferQueueToken(req, res) {
    try {
        const { id } = req.params;
        const token = await TokenModel.findById(id);

        if (!token) {
            return res.status(404).json({
                success: false,
                message: "Token not found",
            });
        }

        const now = new Date();
        const targetOfficeId = req.body?.office_id || token.office_id;
        const targetServiceId = req.body?.service_id || token.service?.service_id || null;
        let targetCounter = null;
        const previousCounterId = token.counter?.counter_id || null;

        if (req.body?.counter_id || req.body?.counter_number !== undefined) {
            targetCounter = await resolveCounterForOffice(targetOfficeId, req.body || {});
        }

        token.office_id = targetOfficeId;
        if (targetServiceId) {
            token.service = token.service || {};
            token.service.service_id = targetServiceId;
        }
        if (targetCounter) {
            token.counter = {
                counter_id: targetCounter._id,
                counter_number: targetCounter.counter_number,
            };
        }
        token.status = "waiting";
        token.timestamps = token.timestamps || {};
        token.timestamps.transferred_at = now;
        token.queue = token.queue || {};
        token.queue.hold_until = null;
        token.queue.returned_from_skip_at = now;
        token.history = token.history || [];
        token.history.push({
            status: "rescheduled",
            changed_at: now,
            changed_by: req.user?.id || null,
            note: "Token transferred to another queue",
        });

        if (previousCounterId) {
            const counter = await CounterModel.findById(previousCounterId);
            if (counter && counter.current_token === token.token_number) {
                counter.current_token = null;
                await counter.save();
                emitCounterUpdate(targetOfficeId, tokenToObject(counter));
            }
        }

        await token.save();

        emitTokenUpdate(token, {
            officeId: targetOfficeId,
            event: "token.transferred",
        });

        emitOfficeQueueUpdate(targetOfficeId, {
            date: token.booking?.date || resolveDate(req),
            serviceId: targetServiceId,
        });

        return res.status(200).json({
            success: true,
            message: "Token transferred successfully",
            data: token,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function createWalkInToken(req, res) {
    try {
        const officeId = resolveOfficeId(req);
        if (!officeId) {
            return res.status(400).json({
                success: false,
                message: "office_id is required",
            });
        }

        const office = await OfficeModel.findById(officeId);
        if (!office) {
            return res.status(404).json({
                success: false,
                message: "Office not found",
            });
        }

        const counter = await resolveCounterForOffice(officeId, req.body || {});
        const citizenId = await resolveCitizenForWalkIn(req.body || {});

        if (!citizenId) {
            return res.status(400).json({
                success: false,
                message: "citizen_id or citizen details are required for walk-in tokens",
            });
        }

        const serviceId = req.body?.service_id || counter?.service_id;
        if (!serviceId) {
            return res.status(400).json({
                success: false,
                message: "service_id is required for walk-in tokens",
            });
        }

        const date = req.body?.date || getLocalDateKey();
        const hour = req.body?.hour ?? new Date().getHours();
        const slot_time = req.body?.slot_time || `${String(hour).padStart(2, "0")}:00`;
        let slot = null;

        if (req.body?.slot_id) {
            slot = await SlotModel.findById(req.body.slot_id);
        }

        if (!slot) {
            slot = await SlotModel.findOneAndUpdate(
                {
                    office_id: officeId,
                    date,
                    hour,
                    slot_time,
                },
                {
                    $setOnInsert: {
                        office_id: officeId,
                        date,
                        hour,
                        slot_time,
                        slot_label: `${String(((hour + 11) % 12) + 1).padStart(2, "0")}:00 ${hour >= 12 ? "PM" : "AM"}`,
                        capacity: {
                            total: Math.max(1, office.total_counters || 1),
                            booked: 0,
                            remaining: Math.max(1, office.total_counters || 1),
                            walkin_reserved: Math.ceil(Math.max(1, office.total_counters || 1) / 3),
                            online_available: Math.max(0, Math.max(1, office.total_counters || 1) - Math.ceil(Math.max(1, office.total_counters || 1) / 3)),
                        },
                        prediction: {
                            crowd_level: 0,
                            tokens_issued: 0,
                            wait_time_minutes: 0,
                            rush_label: "Low",
                        },
                        status: "available",
                        is_active: true,
                        generated_at: new Date(),
                    },
                },
                { new: true, upsert: true }
            );
        }

        const token = await createTokenRecord({
            citizen_id: citizenId,
            office_id: officeId,
            service_id: serviceId,
            service_name: req.body?.service_name || "Walk-in Service",
            slot_id: slot._id,
            date,
            hour,
            slot_time,
            counter_id: counter?._id || null,
            counter_number: counter?.counter_number || null,
            is_priority: !!req.body?.is_priority,
            is_walkin: true,
            priority_reason: req.body?.priority_reason || "Walk-in token",
            queue_source: "offline",
            note: "Walk-in token created by counter manager",
        });

        if (counter) {
            counter.status = "active";
            await counter.save();
            emitCounterUpdate(officeId, tokenToObject(counter));
        }

        emitTokenUpdate(token, {
            officeId,
            event: "token.created",
        });

        emitOfficeQueueUpdate(officeId, {
            date: token.booking?.date,
            serviceId,
        });

        return res.status(201).json({
            success: true,
            message: "Walk-in token created successfully",
            data: token,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function listCounters(req, res) {
    try {
        const officeId = resolveOfficeId(req);
        if (!officeId) {
            return res.status(400).json({
                success: false,
                message: "office_id is required",
            });
        }

        const counters = await CounterModel.find({ office_id: officeId }).sort({ counter_number: 1 }).lean();
        return res.status(200).json({
            success: true,
            count: counters.length,
            data: counters,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function updateCounter(req, res) {
    try {
        const { id } = req.params;
        const counter = await CounterModel.findById(id);

        if (!counter) {
            return res.status(404).json({
                success: false,
                message: "Counter not found",
            });
        }

        const patch = req.body || {};
        if (patch.counter_name !== undefined) counter.counter_name = patch.counter_name;
        if (patch.status !== undefined) counter.status = patch.status;
        if (patch.current_token !== undefined) counter.current_token = patch.current_token;
        if (patch.service_id !== undefined) counter.service_id = patch.service_id;
        if (patch.staff_id !== undefined) counter.staff_id = patch.staff_id;
        if (patch.opened_at !== undefined) counter.opened_at = patch.opened_at;

        await counter.save();

        emitCounterUpdate(counter.office_id, tokenToObject(counter));

        return res.status(200).json({
            success: true,
            message: "Counter updated successfully",
            data: counter,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function getAdminAnalytics(req, res) {
    try {
        const officeId = resolveOfficeId(req);
        if (!officeId) {
            return res.status(400).json({
                success: false,
                message: "office_id is required",
            });
        }

        const date = resolveDate(req);
        const [waiting, called, served, cancelled, priority, walkin] = await Promise.all([
            TokenModel.countDocuments({ office_id: officeId, "booking.date": date, status: "waiting" }),
            TokenModel.countDocuments({ office_id: officeId, "booking.date": date, status: "called" }),
            TokenModel.countDocuments({ office_id: officeId, "booking.date": date, status: "served" }),
            TokenModel.countDocuments({ office_id: officeId, "booking.date": date, status: "cancelled" }),
            TokenModel.countDocuments({ office_id: officeId, "booking.date": date, "priority.is_priority": true }),
            TokenModel.countDocuments({ office_id: officeId, "booking.date": date, "priority.is_walkin": true }),
        ]);

        return res.status(200).json({
            success: true,
            data: {
                date,
                waiting,
                called,
                served,
                cancelled,
                priority,
                walkin,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function getAiInsights(req, res) {
    try {
        const officeId = resolveOfficeId(req);
        if (!officeId) {
            return res.status(400).json({
                success: false,
                message: "office_id is required",
            });
        }

        const snapshot = await getOfficeQueueSnapshot({
            officeId,
            serviceId: req.query?.service_id || null,
            date: resolveDate(req),
        });

        const rushLabel =
            snapshot.summary.waiting > 30
                ? "Very High"
                : snapshot.summary.waiting > 15
                    ? "High"
                    : snapshot.summary.waiting > 5
                        ? "Moderate"
                        : "Low";

        return res.status(200).json({
            success: true,
            data: {
                rush_label: rushLabel,
                summary: snapshot.summary,
                recommendation:
                    rushLabel === "Very High"
                        ? "Open another counter and prioritize walk-ins carefully."
                        : rushLabel === "High"
                            ? "Keep the counter staffed and watch the priority queue."
                            : "Queue is stable.",
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function getSlots(req, res) {
    try {
        const officeId = resolveOfficeId(req);
        if (!officeId) {
            return res.status(400).json({
                success: false,
                message: "office_id is required",
            });
        }

        const query = { office_id: officeId };
        if (req.query?.date) {
            query.date = req.query.date;
        }

        const slots = await SlotModel.find(query).sort({ date: 1, hour: 1 }).lean();
        return res.status(200).json({
            success: true,
            count: slots.length,
            data: slots,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function updateSlot(req, res) {
    try {
        const { id } = req.params;
        const slot = await SlotModel.findById(id);
        if (!slot) {
            return res.status(404).json({
                success: false,
                message: "Slot not found",
            });
        }

        const patch = req.body || {};
        if (patch.status !== undefined) slot.status = patch.status;
        if (patch.is_active !== undefined) slot.is_active = patch.is_active;
        if (patch.capacity !== undefined) slot.capacity = patch.capacity;
        if (patch.prediction !== undefined) slot.prediction = patch.prediction;
        if (patch.slot_label !== undefined) slot.slot_label = patch.slot_label;

        await slot.save();

        return res.status(200).json({
            success: true,
            message: "Slot updated successfully",
            data: slot,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function generateSlots(req, res) {
    try {
        const { office_id, date } = req.body || {};
        if (!office_id || !date) {
            return res.status(400).json({
                success: false,
                message: "office_id and date are required",
            });
        }

        const office = await OfficeModel.findById(office_id);
        if (!office) {
            return res.status(404).json({
                success: false,
                message: "Office not found",
            });
        }

        const created = [];
        const totalCapacity = Math.max(1, office.total_counters || 1);

        for (let hour = office.hours.open; hour < office.hours.close; hour += 1) {
            const slot_time = `${String(hour).padStart(2, "0")}:00`;
            const slot_label = `${String(((hour + 11) % 12) + 1).padStart(2, "0")}:00 ${hour >= 12 ? "PM" : "AM"}`;
            const result = await SlotModel.updateOne(
                { office_id, date, hour },
                {
                    $setOnInsert: {
                        office_id,
                        date,
                        hour,
                        slot_time,
                        slot_label,
                        capacity: {
                            total: totalCapacity,
                            booked: 0,
                            remaining: totalCapacity,
                            walkin_reserved: Math.ceil(totalCapacity / 3),
                            online_available: Math.max(0, totalCapacity - Math.ceil(totalCapacity / 3)),
                        },
                        prediction: {
                            crowd_level: 0,
                            tokens_issued: 0,
                            wait_time_minutes: 0,
                            rush_label: "Low",
                        },
                        status: "available",
                        is_active: true,
                        generated_at: new Date(),
                    },
                },
                { upsert: true }
            );

            created.push({
                hour,
                slot_time,
                upserted: !!result.upsertedCount,
            });
        }

        return res.status(201).json({
            success: true,
            message: "Slots generated successfully",
            data: created,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function syncObservations(req, res) {
    try {
        const payload = Array.isArray(req.body) ? req.body : [req.body];
        const results = [];

        for (const item of payload) {
            if (!item || !item.office_id || !item.observed_date || item.observed_hour === undefined) {
                continue;
            }

            const updated = await ObservationModel.findOneAndUpdate(
                {
                    office_id: item.office_id,
                    observed_date: item.observed_date,
                    observed_hour: item.observed_hour,
                },
                {
                    $set: {
                        office_id: item.office_id,
                        observed_date: item.observed_date,
                        observed_hour: item.observed_hour,
                        actuals: item.actuals,
                        ml_sync: {
                            sent_to_ml: true,
                            sent_at: new Date(),
                        },
                    },
                },
                {
                    upsert: true,
                    new: true,
                    runValidators: true,
                }
            );

            results.push(updated);
        }

        return res.status(200).json({
            success: true,
            count: results.length,
            data: results,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function getPublicDisplay(req, res) {
    try {
        const { office_id } = req.params;
        const snapshot = await getOfficeQueueSnapshot({
            officeId: office_id,
            serviceId: req.query?.service_id || null,
            date: req.query?.date || null,
        });

        emitPublicDisplayUpdate(office_id, snapshot);

        return res.status(200).json({
            success: true,
            data: snapshot,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function getOfficeLive(req, res) {
    try {
        const { office_id } = req.params;
        const snapshot = await getOfficeQueueSnapshot({
            officeId: office_id,
            serviceId: req.query?.service_id || null,
            date: req.query?.date || null,
        });

        return res.status(200).json({
            success: true,
            data: snapshot,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function getCitizenLiveToken(req, res) {
    try {
        const { id } = req.params;
        const liveState = await getCitizenTokenLiveState({
            tokenId: id,
            citizenId: req.user?.id || null,
        });

        if (!liveState) {
            return res.status(404).json({
                success: false,
                message: "Token not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: liveState,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function getLiveOfficeToken(req, res) {
    try {
        const { office_id } = req.params;
        const snapshot = await getOfficeQueueSnapshot({
            officeId: office_id,
            serviceId: req.query?.service_id || null,
            date: req.query?.date || null,
        });

        return res.status(200).json({
            success: true,
            data: snapshot,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function createWalkInToken(req, res) {
    try {
        const officeId = resolveOfficeId(req);
        if (!officeId) {
            return res.status(400).json({
                success: false,
                message: "office_id is required",
            });
        }

        const citizenId = await resolveCitizenForWalkIn(req.body || {});
        if (!citizenId) {
            return res.status(400).json({
                success: false,
                message: "phone and name are required for walk-in token",
            });
        }

        const token = await createTokenRecord({
            citizen_id: citizenId,
            office_id: officeId,
            service_id: req.body?.service_id || null,
            service_name: req.body?.service_name || "Walk-in Service",
            slot_id: req.body?.slot_id,
            date: resolveDate(req),
            hour: req.body?.hour || new Date().getHours(),
            slot_time: req.body?.slot_time || `${new Date().getHours()}:00`,
            is_priority: req.body?.is_priority || false,
            is_walkin: true,
            priority_reason: req.body?.priority_reason || null,
            queue_source: "offline",
            note: "Walk-in token created by staff",
        });

        emitTokenUpdate(token, { officeId, event: "token.created" });
        emitOfficeQueueUpdate(officeId, { date: resolveDate(req), serviceId: req.body?.service_id });

        return res.status(201).json({
            success: true,
            message: "Walk-in token created successfully",
            data: token,
        });
    } catch (error) {
        console.error("Create Walk-in Token Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function listCounters(req, res) {
    try {
        const officeId = resolveOfficeId(req);
        if (!officeId) {
            return res.status(400).json({
                success: false,
                message: "office_id is required",
            });
        }

        const counters = await CounterModel.find({ office_id: officeId }).sort({ counter_number: 1 }).lean();

        return res.status(200).json({
            success: true,
            count: counters.length,
            data: counters,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function updateCounter(req, res) {
    try {
        const { id } = req.params;
        const counter = await CounterModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!counter) {
            return res.status(404).json({
                success: false,
                message: "Counter not found",
            });
        }

        emitCounterUpdate(counter.office_id, tokenToObject(counter));

        return res.status(200).json({
            success: true,
            message: "Counter updated successfully",
            data: counter,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function getAdminAnalytics(req, res) {
    try {
        const officeId = resolveOfficeId(req);
        if (!officeId) {
            return res.status(400).json({
                success: false,
                message: "office_id is required",
            });
        }

        const date = resolveDate(req);
        const tokens = await TokenModel.find({
            office_id: officeId,
            "booking.date": date,
        }).lean();

        const analytics = {
            total_tokens: tokens.length,
            by_status: {
                waiting: tokens.filter(t => t.status === "waiting").length,
                called: tokens.filter(t => t.status === "called").length,
                served: tokens.filter(t => t.status === "served").length,
                cancelled: tokens.filter(t => t.status === "cancelled").length,
                no_show: tokens.filter(t => t.status === "no_show").length,
            },
            by_source: {
                online: tokens.filter(t => t.queue?.source === "online").length,
                offline: tokens.filter(t => t.queue?.source === "offline").length,
            },
            priority_count: tokens.filter(t => t.priority?.is_priority).length,
            avg_wait_time: tokens.length > 0 
                ? Math.round(tokens.reduce((sum, t) => sum + (t.wait?.actual_mins || 0), 0) / tokens.length)
                : 0,
        };

        return res.status(200).json({
            success: true,
            data: analytics,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function getAiInsights(req, res) {
    try {
        const officeId = resolveOfficeId(req);
        if (!officeId) {
            return res.status(400).json({
                success: false,
                message: "office_id is required",
            });
        }

        // Placeholder for AI insights - should integrate with ML service
        const insights = {
            peak_hours: req.query?.days || "7",
            recommendation: "Consider increasing staff during peak hours",
            predicted_load: "moderate",
            optimization_suggestions: [],
        };

        return res.status(200).json({
            success: true,
            data: insights,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function getSlots(req, res) {
    try {
        const officeId = resolveOfficeId(req);
        if (!officeId) {
            return res.status(400).json({
                success: false,
                message: "office_id is required",
            });
        }

        const date = resolveDate(req);
        const slots = await SlotModel.find({ 
            office_id: officeId,
            date: date 
        }).sort({ hour: 1, slot_time: 1 }).lean();

        return res.status(200).json({
            success: true,
            count: slots.length,
            data: slots,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function updateSlot(req, res) {
    try {
        const { id } = req.params;
        const slot = await SlotModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: "Slot not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Slot updated successfully",
            data: slot,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function generateSlots(req, res) {
    try {
        const officeId = resolveOfficeId(req);
        if (!officeId) {
            return res.status(400).json({
                success: false,
                message: "office_id is required",
            });
        }

        // Placeholder for slot generation logic
        return res.status(200).json({
            success: true,
            message: "Slots generated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = {
    getAdminDashboard,
    getAdminQueue,
    callNextToken,
    skipQueueToken,
    serveQueueToken,
    transferQueueToken,
    createWalkInToken,
    listCounters,
    updateCounter,
    getAdminAnalytics,
    getAiInsights,
    getSlots,
    updateSlot,
    generateSlots,
    syncObservations,
    getPublicDisplay,
    getOfficeLive,
    getCitizenLiveToken,
    getLiveOfficeToken,
};
