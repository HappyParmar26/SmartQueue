const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
    {
        citizen_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        token_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Token",
            required: true,
        },

        office_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Office",
            required: true,
        },

        type: {
            type: String,
            enum: [
                "approaching",
                "delay",
                "counter_change",
                "confirmed",
                "cancelled",
                "ai_tip",
            ],
            required: true,
        },

        content: {
            title: {
                type: String,
                required: true,
                trim: true,
            },

            message: {
                type: String,
                required: true,
                trim: true,
            },
        },

        channel: {
            type: String,
            enum: ["app", "sms", "email"],
            default: "app",
            required: true,
        },

        is_read: {
            type: Boolean,
            default: false,
        },

        is_sent: {
            type: Boolean,
            default: false,
        },

        sent_at: {
            type: Date,
            default: null,
        },

        read_at: {
            type: Date,
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

// Useful indexes
NotificationSchema.index({ citizen_id: 1, is_read: 1 });
NotificationSchema.index({ token_id: 1 });
NotificationSchema.index({ office_id: 1 });
NotificationSchema.index({ created_at: -1 });

const NotificationModel = mongoose.model(
    "Notification",
    NotificationSchema
);

module.exports = NotificationModel;