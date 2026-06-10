const TokenModel = require("../models/token.model");
const citizenModel = require("../models/user.model");


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
            priority_reason = null
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
                message: "All required fields must be provided"
            });
        }

        // Position in queue
        const position =
            (await TokenModel.countDocuments({
                office_id,
                "booking.date": date,
                status: {
                    $in: ["waiting", "called", "serving"]
                }
            })) + 1;

        // Generate token number
        const lastToken = await TokenModel.findOne({
            office_id,
            "booking.date": date
        })
            .sort({ created_at: -1 });

        let nextNumber = 1;

        if (lastToken) {
            nextNumber =
                parseInt(lastToken.token_number.split("-")[1]) + 1;
        }

        const token_number = `T-${nextNumber}`;

        const token = await TokenModel.create({
            token_number,
            office_id,
            citizen_id,

            service: {
                service_id,
                service_name
            },

            booking: {
                date,
                hour,
                slot_time,
                slot_id,
                position
            },

            priority: {
                is_priority,
                is_walkin,
                priority_reason
            },

            timestamps: {
                booked_at: new Date()
            },

            history: [
                {
                    status: "waiting",
                    changed_at: new Date(),
                    note: "Token booked"
                }
            ]
        });

        return res.status(201).json({
            success: true,
            message: "Token booked successfully",
            data: token
        });

    } catch (error) {

        console.error("Create Token Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function getCitizenTokens(req, res) {
    try {

        const citizen_id = req.user.id;

        const tokens = await TokenModel.find({ citizen_id })
            .sort({ created_at: -1 });

        return res.status(200).json({
            success: true,
            count: tokens.length,
            data: tokens
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

async function getCitizenTokenById (req, res) {
    try {

        const citizen_id = req.user.id;
        const { id } = req.params;

        const token = await TokenModel.findOne({
            _id: id,
            citizen_id
        });

        if (!token) {
            return res.status(404).json({
                success: false,
                message: "Token not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: token
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

async function getLiveToken(req, res) {
    try {
        // will implement it later after the service creatron 
        
    } catch (error) {
        console.error("Get Live Token Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

async function cancelToken(req, res) {
    try {

        const citizen_id = req.user.id;
        const { id } = req.params;

        const token = await TokenModel.findOne({
            _id: id,
            citizen_id
        });

        if (!token) {
            return res.status(404).json({
                success: false,
                message: "Token not found"
            });
        }

        if (
            token.status === "served" ||
            token.status === "cancelled" ||
            token.status === "no_show"
        ) {
            return res.status(400).json({
                success: false,
                message: `Token is already ${token.status}`
            });
        }

        token.status = "cancelled";
        token.cancel_reason = "Cancelled by citizen";
        token.timestamps.cancelled_at = new Date();

        token.history.push({
            status: "cancelled",
            changed_at: new Date(),
            note: "Cancelled by citizen"
        });

        await token.save();

        return res.status(200).json({
            success: true,
            message: "Token cancelled successfully",
            data: token
        });

    } catch (error) {
        console.error("Cancel Token Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}


module.exports = {
    createToken,
    getCitizenTokens,
    getCitizenTokenById,
    getLiveToken ,
    cancelToken
};