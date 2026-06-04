const mongoose = require("mongoose");

const CounterStatusSchema = new mongoose.Schema(
    {
        counter_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Counter",
            required: true,
        },

        counter_number: {
            type: Number,
            required: true,
        },

        current_token: {
            type: String,
            default: null,
            trim: true,
        },

        service: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ["active", "inactive", "break", "closed"],
            default: "active",
        },
    },
    { _id: false }
);

const QueueDisplaySchema = new mongoose.Schema(
    {
        office_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Office",
            required: true,
        },

        counters: {
            type: [CounterStatusSchema],
            default: [],
        },

        announcement: {
            type: String,
            trim: true,
            default: null,
        },

        updated_at: {
            type: Date,
            default: Date.now,
        },
    },
    {
        versionKey: false,
    }
);

// One display board per office
QueueDisplaySchema.index(
    { office_id: 1 },
    { unique: true }
);

const QueueDisplayModel = mongoose.model(
    "QueueDisplay",
    QueueDisplaySchema
);

module.exports = QueueDisplayModel;