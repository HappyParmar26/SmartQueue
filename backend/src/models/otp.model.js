const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        otp_code: {
            type: String,
            required: true,
        },

        is_used: {
            type: Boolean,
            default: false,
        },

        expires_at: {
            type: Date,
            required: true,
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

const OtpModel = mongoose.model("Otp", OtpSchema);

module.exports = OtpModel;