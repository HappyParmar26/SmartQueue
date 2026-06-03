const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
        },

        dob: {
            type: Date,
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },

        aadhaar_last4: {
            type: String,
            minlength: 4,
            maxlength: 4,
        },

        priority: {
            is_senior: {
                type: Boolean,
                default: false,
            },

            is_disabled: {
                type: Boolean,
                default: false,
            },

            is_pregnent: {
                type: Boolean,
                default: false,
            },

            priority_doc: {
                type: String,
                default: null,
            },
        },

        preferences: {
            language: {
                type: String,
                default: "en",
            },

            notifications: {
                app: {
                    type: Boolean,
                    default: true,
                },

                sms: {
                    type: Boolean,
                    default: true,
                },

                email: {
                    type: Boolean,
                    default: false,
                },
            },
        },

        is_active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;