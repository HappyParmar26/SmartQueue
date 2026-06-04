const mongoose = require("mongoose");

const CrowdPredictionSchema = new mongoose.Schema(
    {
        office_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Office",
            required: true,
        },

        for_date: {
            type: String, // e.g. "2024-10-14"
            required: true,
        },

        for_hour: {
            type: Number,
            required: true,
            min: 0,
            max: 23,
        },

        prediction: {
            crowd_level: {
                type: Number,
                required: true,
            },

            tokens_issued: {
                type: Number,
                required: true,
            },

            wait_time_minutes: {
                type: Number,
                required: true,
            },

            rush_label: {
                type: String,
                enum: ["Low", "Medium", "High"],
                required: true,
            },
        },

        fetched_at: {
            type: Date,
            default: Date.now,
        },
    },
    {
        versionKey: false,
    }
);

// Optional index for faster searching
CrowdPredictionSchema.index({
    office_id: 1,
    for_date: 1,
    for_hour: 1,
});

const CrowdPredictionModel = mongoose.model(
    "CrowdPrediction",
    CrowdPredictionSchema
);

module.exports = CrowdPredictionModel;