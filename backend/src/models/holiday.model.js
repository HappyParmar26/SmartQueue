const mongoose = require("mongoose");

const HolidaySchema = new mongoose.Schema(
    {
        holiday_date: {
            type: Date,
            required: true,
        },

        holiday_name: {
            type: String,
            required: true,
            trim: true,
        },

        applies_to_all: {
            type: Boolean,
            default: true,
        },

        office_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Office",
            default: null,
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

// Prevent duplicate holiday entries
HolidaySchema.index(
    {
        holiday_date: 1,
        office_id: 1,
    },
    { unique: true }
);

module.exports = mongoose.model("Holiday", HolidaySchema);