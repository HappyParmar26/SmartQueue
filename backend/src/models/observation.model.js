const mongoose = require("mongoose");

const ActualCrowdDataSchema = new mongoose.Schema(
    {
        office_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Office",
            required: true,
        },

        observed_date: {
            type: Date,
            required: true,
        },

        observed_hour: {
            type: Number,
            required: true,
            min: 0,
            max: 23,
        },

        actuals: {
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
        },

        ml_sync: {
            sent_to_ml: {
                type: Boolean,
                default: false,
            },

            sent_at: {
                type: Date,
                default: null,
            },
        },

        created_at: {
            type: Date,
            default: Date.now,
        },
    },
    {
        versionKey: false,
    }
);

// One record per office, date, and hour
ActualCrowdDataSchema.index(
    {
        office_id: 1,
        observed_date: 1,
        observed_hour: 1,
    },
    { unique: true }
);

const ObservationModel = mongoose.model(
    "ActualCrowdData",
    ActualCrowdDataSchema
);

module.exports = ObservationModel;