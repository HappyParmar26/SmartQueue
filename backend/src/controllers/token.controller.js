const TokenModel = require("../models/token.model");
const {
    createTokenRecord,
    getCitizenTokenLiveState,
    getOfficeQueueSnapshot,
    tokenToObject,
} = require("../services/queue.service");
const { emitTokenUpdate, emitOfficeQueueUpdate } = require("../realtime/socket");

async function createToken(req, res) {
    try {
        const citizen_id = req.user.id;

        const {
            office_id,
            service_id,
            service_name,
            slot_id,
            date,
            hour,
            slot_time,
            is_priority = false,
            is_walkin = false,
            priority_reason = null,
            counter_id = null,
            counter_number = null,
        } = req.body;

        if (
            !office_id ||
            !service_id ||
            !service_name ||
            !slot_id ||
            !date ||
            hour === undefined ||
            !slot_time
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }

        const token = await createTokenRecord({
            citizen_id,
            office_id,
            service_id,
            service_name,
            slot_id,
            date,
            hour,
            slot_time,
            counter_id,
            counter_number,
            is_priority,
            is_walkin,
            priority_reason,
            queue_source: is_walkin ? "offline" : "online",
            note: "Token booked",
        });

        emitTokenUpdate(token, {
            officeId: office_id,
            event: "token.created",
        });

        emitOfficeQueueUpdate(office_id, {
            date,
            serviceId: service_id,
        });

        return res.status(201).json({
            success: true,
            message: "Token booked successfully",
            data: token,
        });
    } catch (error) {
        console.error("Create Token Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function getCitizenTokens(req, res) {
    try {
        const citizen_id = req.user.id;

        const tokens = await TokenModel.find({ citizen_id }).sort({ created_at: -1 }).lean();

        return res.status(200).json({
            success: true,
            count: tokens.length,
            data: tokens,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function getCitizenTokenById(req, res) {
    try {
        const citizen_id = req.user.id;
        const { id } = req.params;

        const token = await TokenModel.findOne({
            _id: id,
            citizen_id,
        }).lean();

        if (!token) {
            return res.status(404).json({
                success: false,
                message: "Token not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: token,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function getLiveToken(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Token id is required",
            });
        }

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
        console.error("Get Live Token Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function cancelToken(req, res) {
    try {
        const citizen_id = req.user.id;
        const { id } = req.params;

        const token = await TokenModel.findOne({
            _id: id,
            citizen_id,
        });

        if (!token) {
            return res.status(404).json({
                success: false,
                message: "Token not found",
            });
        }

        if (
            token.status === "served" ||
            token.status === "cancelled" ||
            token.status === "no_show"
        ) {
            return res.status(400).json({
                success: false,
                message: `Token is already ${token.status}`,
            });
        }

        const now = new Date();
        token.status = "cancelled";
        token.cancel_reason = "Cancelled by citizen";
        token.timestamps = token.timestamps || {};
        token.timestamps.cancelled_at = now;
        token.history = token.history || [];
        token.history.push({
            status: "cancelled",
            changed_at: now,
            changed_by: citizen_id,
            note: "Cancelled by citizen",
        });

        await token.save();

        emitTokenUpdate(token, {
            officeId: token.office_id,
            event: "token.cancelled",
        });

        emitOfficeQueueUpdate(token.office_id, {
            date: token.booking?.date,
            serviceId: token.service?.service_id || null,
        });

        return res.status(200).json({
            success: true,
            message: "Token cancelled successfully",
            data: tokenToObject(token),
        });
    } catch (error) {
        console.error("Cancel Token Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = {
    createToken,
    getCitizenTokens,
    getCitizenTokenById,
    getLiveToken,
    cancelToken,
};
