const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema(
    {
        office_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Office",
            required: true,
        },

        counter_number: {
            type: Number,
            required: true,
            min: 1,
        },

        counter_name: {
            type: String,
            required: true,
            trim: true,
        },

        service_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },

        staff_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Staff",
            required: true,
        },

        status: {
            type: String,
            enum: ["active",  "paused", "closed"],
            default: "closed",
        },

        current_token: {
            type: String,
            default: null,
        },

        opened_at: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: {
            createdAt: false,
            updatedAt: "updated_at",
        },
    }
);

// Ensure counter numbers are unique within an office
//counterSchema.index(
//    { office_id: 1, counter_number: 1 },
//    { unique: true }
//);

const CounterModel = mongoose.model("Counter", counterSchema);

module.exports = CounterModel;