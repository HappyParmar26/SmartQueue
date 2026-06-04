const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const StaffSchema = new Schema(
    {
        emp_id: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
            match: [/^EMP\d{3,}$/, "emp_id must follow format EMP001"],
        },
        name: { type: String, required: true, trim: true },

        phone: {
            type: String,
            required: true,
            unique: true,
            match: [/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"],
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"],
        },

        office_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Office",
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: ["superadmin", "admin", "staff", "reception"],
            default: "staff",
        },
        password_hash: {
            type: String,
            required: true,
            select: false,
        },
        is_active: { type: Boolean, default: true },
        last_login: { type: Date, default: null },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
        versionKey: false,
    }
);

const StaffModel = model("Staff", StaffSchema);

module.exports = StaffModel;