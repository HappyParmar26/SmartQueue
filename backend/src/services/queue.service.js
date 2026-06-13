const TokenModel = require("../models/token.model");
const CounterModel = require("../models/counter.model");
const { emitOfficeQueueUpdate, emitTokenUpdate, emitCounterUpdate } = require("../realtime/socket");

const SKIP_HOLD_MINUTES = 20;
const CALL_TIMEOUT_MINUTES = 20;
const SERVING_TIMEOUT_MINUTES = 60;

function getLocalDateKey(date = new Date()) {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
    }).format(date);
}

function getMinutesBetween(from, to = new Date()) {
    const start = from ? new Date(from).getTime() : 0;
    return Math.max(0, Math.floor((to.getTime() - start) / 60000));
}

function tokenToObject(token) {
    return typeof token.toObject === "function"
        ? token.toObject({ versionKey: false })
        : token;
}

function getTokenBookedAt(token) {
    return token?.timestamps?.booked_at || token?.created_at || new Date();
}

function getTokenSource(token) {
    if (token?.queue?.source) {
        return token.queue.source;
    }

    return token?.priority?.is_walkin ? "offline" : "online";
}

function isEligibleForQueue(token, now = new Date()) {
    if (token.status !== "waiting") {
        return false;
    }

    if (!token.queue?.hold_until) {
        return true;
    }

    return new Date(token.queue.hold_until).getTime() <= now.getTime();
}

function compareTokensByBookedAt(a, b) {
    const bookedA = new Date(getTokenBookedAt(a)).getTime();
    const bookedB = new Date(getTokenBookedAt(b)).getTime();

    if (bookedA !== bookedB) {
        return bookedA - bookedB;
    }

    return String(a.token_number).localeCompare(String(b.token_number));
}

function compareTokensWithinSource(a, b) {
    const skipA = !!a.queue?.returned_from_skip_at;
    const skipB = !!b.queue?.returned_from_skip_at;

    if (skipA !== skipB) {
        return skipA ? -1 : 1;
    }

    return compareTokensByBookedAt(a, b);
}

function interleaveTokens(tokens) {
    const onlineTokens = tokens
        .filter((token) => getTokenSource(token) === "online")
        .sort(compareTokensWithinSource);
    const offlineTokens = tokens
        .filter((token) => getTokenSource(token) === "offline")
        .sort(compareTokensWithinSource);

    const ordered = [];
    let onlineIndex = 0;
    let offlineIndex = 0;

    while (onlineIndex < onlineTokens.length || offlineIndex < offlineTokens.length) {
        for (let onlineCount = 0; onlineCount < 2 && onlineIndex < onlineTokens.length; onlineCount += 1) {
            ordered.push(onlineTokens[onlineIndex]);
            onlineIndex += 1;
        }

        if (offlineIndex < offlineTokens.length) {
            ordered.push(offlineTokens[offlineIndex]);
            offlineIndex += 1;
        }
    }

    return ordered;
}

function orderQueueTokens(tokens, now = new Date()) {
    const eligibleTokens = tokens.filter((token) => isEligibleForQueue(token, now));
    const priorityTokens = eligibleTokens.filter((token) => token.priority?.is_priority);
    const regularTokens = eligibleTokens.filter((token) => !token.priority?.is_priority);

    return [
        ...interleaveTokens(priorityTokens),
        ...interleaveTokens(regularTokens),
    ];
}

function scoreTokenForQueue(token, now = new Date()) {
    const bookedAt = getTokenBookedAt(token);
    const waitMinutes = getMinutesBetween(bookedAt, now);

    let score = waitMinutes * 100;

    if (token.queue?.returned_from_skip_at) {
        score += 1_000_000;
    }

    if (token.priority?.is_priority) {
        score += 100_000;
    }

    if (token.status === "called") {
        score -= 1_000_000;
    }

    if (token.status === "serving") {
        score -= 2_000_000;
    }

    return score;
}

function compareQueueTokens(a, b, now = new Date()) {
    const scoreA = scoreTokenForQueue(a, now);
    const scoreB = scoreTokenForQueue(b, now);

    if (scoreA !== scoreB) {
        return scoreB - scoreA;
    }

    const bookedA = new Date(getTokenBookedAt(a)).getTime();
    const bookedB = new Date(getTokenBookedAt(b)).getTime();

    if (bookedA !== bookedB) {
        return bookedA - bookedB;
    }

    return String(a.token_number).localeCompare(String(b.token_number));
}

async function allocateTokenNumber({ office_id, date }) {
    for (let attempt = 0; attempt < 5; attempt += 1) {
        const lastToken = await TokenModel.findOne({
            office_id,
            "booking.date": date,
        })
            .sort({ created_at: -1 })
            .select("token_number")
            .lean();

        const nextNumber = lastToken
            ? parseInt(String(lastToken.token_number).split("-")[1], 10) + 1
            : 1;

        const token_number = `T-${nextNumber}`;
        const exists = await TokenModel.exists({
            office_id,
            "booking.date": date,
            token_number,
        });

        if (!exists) {
            return token_number;
        }
    }

    throw new Error("Unable to allocate a unique token number");
}

async function createTokenRecord({
    citizen_id,
    office_id,
    service_id,
    service_name,
    slot_id,
    date,
    hour,
    slot_time,
    counter_id = null,
    counter_number = null,
    is_priority = false,
    is_walkin = false,
    priority_reason = null,
    queue_source = null,
    note = "Token booked",
}) {
    if (!citizen_id) {
        throw new Error("citizen_id is required");
    }

    const token_number = await allocateTokenNumber({ office_id, date });
    const booked_at = new Date();
    const source = queue_source || (is_walkin ? "offline" : "online");

    // Count only eligible (waiting) tokens to calculate actual queue position
    const eligibleQuery = {
        office_id,
        "booking.date": date,
        status: "waiting",
        $or: [
            { "queue.hold_until": null },
            { "queue.hold_until": { $lte: new Date() } },
        ],
    };

    if (service_id) {
        eligibleQuery["service.service_id"] = service_id;
    }

    const eligibleTokens = await TokenModel.find(eligibleQuery).sort({ created_at: 1 }).lean();
    const tokenPreview = {
        token_number,
        office_id,
        citizen_id,
        service: {
            service_id,
            service_name,
        },
        booking: {
            date,
            hour,
            slot_time,
            slot_id,
        },
        priority: {
            is_priority,
            is_walkin: source === "offline" || is_walkin,
            priority_reason,
        },
        queue: {
            source,
            hold_until: null,
            returned_from_skip_at: null,
            skipped_count: 0,
            last_ranking_refresh_at: booked_at,
        },
        status: "waiting",
        timestamps: {
            booked_at,
        },
    };

    const position = orderQueueTokens([...eligibleTokens, tokenPreview], booked_at)
        .findIndex((token) => String(token.token_number) === token_number) + 1;

    const token = await TokenModel.create({
        token_number,
        office_id,
        citizen_id,
        service: {
            service_id,
            service_name,
        },
        counter: counter_id
            ? {
                  counter_id,
                  counter_number,
              }
            : null,
        booking: {
            date,
            hour,
            slot_time,
            slot_id,
            position,
        },
        priority: {
            is_priority,
            is_walkin: source === "offline" || is_walkin,
            priority_reason,
        },
        queue: {
            source,
            hold_until: null,
            returned_from_skip_at: null,
            skipped_count: 0,
            last_ranking_refresh_at: booked_at,
        },
        timestamps: {
            booked_at,
        },
        history: [
            {
                status: "waiting",
                changed_at: booked_at,
                note,
            },
        ],
    });

    return token;
}

async function sweepOfficeQueueState({ officeId, serviceId = null, date = null, now = new Date() }) {
    const queueDate = date || getLocalDateKey(now);
    const query = {
        office_id: officeId,
        "booking.date": queueDate,
        status: { $in: ["waiting", "called", "serving"] },
    };

    if (serviceId) {
        query["service.service_id"] = serviceId;
    }

    const tokens = await TokenModel.find(query).sort({ created_at: 1 });
    const changedTokens = [];
    const touchedCounters = new Map();

    for (const token of tokens) {
        let changed = false;

        if (token.status === "waiting" && token.queue?.hold_until) {
            const holdUntil = new Date(token.queue.hold_until);
            if (holdUntil.getTime() <= now.getTime()) {
                token.queue.hold_until = null;
                token.queue.returned_from_skip_at = now;
                token.queue.last_ranking_refresh_at = now;
                token.history.push({
                    status: "waiting",
                    changed_at: now,
                    note: "Returned to front of queue after skip delay",
                });
                changed = true;
            }
        }

        if (token.status === "called" && token.timestamps?.called_at) {
            const minutes = getMinutesBetween(token.timestamps.called_at, now);
            if (minutes >= CALL_TIMEOUT_MINUTES) {
                token.status = "no_show";
                token.timestamps.no_show_at = now;
                token.cancel_reason = "Auto no-show after call timeout";
                token.history.push({
                    status: "no_show",
                    changed_at: now,
                    note: "Auto marked no-show after call timeout",
                });
                changed = true;

                if (token.counter?.counter_id) {
                    const counter = await CounterModel.findById(token.counter.counter_id);
                    if (counter && counter.current_token === token.token_number) {
                        counter.current_token = null;
                        counter.status = "active";
                        await counter.save();
                        touchedCounters.set(String(counter._id), tokenToObject(counter));
                    }
                }
            }
        }

        if (token.status === "serving" && token.timestamps?.called_at) {
            const minutes = getMinutesBetween(token.timestamps.called_at, now);
            if (minutes >= SERVING_TIMEOUT_MINUTES) {
                token.status = "no_show";
                token.timestamps.no_show_at = now;
                token.cancel_reason = "Auto no-show after serving timeout";
                token.history.push({
                    status: "no_show",
                    changed_at: now,
                    note: "Auto marked no-show after serving timeout",
                });
                changed = true;
            }
        }

        if (changed) {
            token.queue = token.queue || {};
            token.queue.last_ranking_refresh_at = now;
            await token.save();
            changedTokens.push(tokenToObject(token));
            emitTokenUpdate(token, {
                officeId: token.office_id,
                event: "token.updated",
            });
        }
    }

    if (changedTokens.length > 0 || touchedCounters.size > 0) {
        emitOfficeQueueUpdate(officeId, {
            date: queueDate,
            serviceId,
        });

        for (const counter of touchedCounters.values()) {
            emitCounterUpdate(counter.office_id || officeId, counter);
        }
    }

    return {
        changedTokens,
        queueDate,
    };
}

async function getOfficeQueueSnapshot({ officeId, serviceId = null, date = null, now = new Date() }) {
    const queueDate = date || getLocalDateKey(now);
    await sweepOfficeQueueState({ officeId, serviceId, date: queueDate, now });

    const query = {
        office_id: officeId,
        "booking.date": queueDate,
        status: { $in: ["waiting", "called", "serving"] },
    };

    if (serviceId) {
        query["service.service_id"] = serviceId;
    }

    const [tokens, counters] = await Promise.all([
        TokenModel.find(query).sort({ created_at: 1 }).lean(),
        CounterModel.find({ office_id: officeId }).sort({ counter_number: 1 }).lean(),
    ]);

    const waitingSorted = orderQueueTokens(tokens, now);

    const tokenRanks = new Map();
    waitingSorted.forEach((token, index) => {
        tokenRanks.set(String(token._id), {
            live_position: index + 1,
            tokens_ahead: index,
            queue_score: scoreTokenForQueue(token, now),
        });
    });

    const hydrateToken = (token) => {
        const rank = tokenRanks.get(String(token._id));
        const tokensAhead = rank ? rank.tokens_ahead : 0;
        // Estimate wait time: 5 minutes per token ahead + 2 minutes buffer
        const estimatedWait = Math.max(0, tokensAhead * 5 + 2);
        
        return {
            ...token,
            live: rank || {
                live_position: null,
                tokens_ahead: null,
                queue_score: scoreTokenForQueue(token, now),
            },
            estimated_wait_minutes: estimatedWait,
        };
    };

    return {
        office_id: officeId,
        date: queueDate,
        summary: {
            waiting: waitingSorted.length,
            called: tokens.filter((token) => token.status === "called").length,
            serving: tokens.filter((token) => token.status === "serving").length,
            priority: tokens.filter((token) => token.priority?.is_priority).length,
            offline: tokens.filter((token) => getTokenSource(token) === "offline").length,
        },
        counters,
        waiting_tokens: waitingSorted.map(hydrateToken),
        called_tokens: tokens.filter((token) => token.status === "called").map(hydrateToken),
        serving_tokens: tokens.filter((token) => token.status === "serving").map(hydrateToken),
        all_tokens: tokens.map(hydrateToken),
    };
}

async function getCitizenTokenLiveState({ tokenId, citizenId = null }) {
    const tokenQuery = { _id: tokenId };
    if (citizenId) {
        tokenQuery.citizen_id = citizenId;
    }

    const token = await TokenModel.findOne(tokenQuery).lean();
    if (!token) {
        return null;
    }

    const officeSnapshot = await getOfficeQueueSnapshot({
        officeId: token.office_id,
        serviceId: token.service?.service_id || null,
        date: token.booking?.date || null,
    });

    const liveMatch = officeSnapshot.waiting_tokens.find(
        (item) => String(item._id) === String(token._id)
    );

    const aheadCount = liveMatch?.live?.tokens_ahead ?? null;

    return {
        token,
        office_snapshot: officeSnapshot,
        live: {
            live_position: liveMatch?.live?.live_position ?? null,
            tokens_ahead: aheadCount,
            queue_score: liveMatch?.live?.queue_score ?? scoreTokenForQueue(token),
            estimated_wait_minutes:
                aheadCount === null ? null : Math.max(0, aheadCount * 5),
        },
    };
}

async function selectNextToken({ officeId, serviceId = null, date = null }) {
    const now = new Date();
    const queueDate = date || getLocalDateKey(now);
    await sweepOfficeQueueState({ officeId, serviceId, date: queueDate, now });

    const query = {
        office_id: officeId,
        "booking.date": queueDate,
        status: "waiting",
        $or: [
            { "queue.hold_until": null },
            { "queue.hold_until": { $lte: now } },
        ],
    };

    if (serviceId) {
        query["service.service_id"] = serviceId;
    }

    const tokens = await TokenModel.find(query).sort({ created_at: 1 });
    const eligible = orderQueueTokens(tokens, now);

    return {
        queueDate,
        token: eligible[0] || null,
    };
}

async function refreshCounterState(counterId) {
    const counter = await CounterModel.findById(counterId);
    if (!counter) {
        return null;
    }

    emitCounterUpdate(counter.office_id, tokenToObject(counter));
    return counter;
}

function startQueueJanitor() {
    if (global.__smartqueue_queue_janitor_started) {
        return;
    }

    global.__smartqueue_queue_janitor_started = true;

    const run = async () => {
        try {
            const officeIds = await TokenModel.distinct("office_id", {
                status: { $in: ["waiting", "called", "serving"] },
            });

            for (const officeId of officeIds) {
                await sweepOfficeQueueState({ officeId, now: new Date() });
            }
        } catch (error) {
            console.error("Queue janitor error:", error.message);
        }
    };

    run();
    setInterval(run, 60 * 1000).unref();
}

module.exports = {
    SKIP_HOLD_MINUTES,
    CALL_TIMEOUT_MINUTES,
    SERVING_TIMEOUT_MINUTES,
    getLocalDateKey,
    scoreTokenForQueue,
    compareQueueTokens,
    createTokenRecord,
    getOfficeQueueSnapshot,
    getCitizenTokenLiveState,
    selectNextToken,
    sweepOfficeQueueState,
    refreshCounterState,
    startQueueJanitor,
    tokenToObject,
};
