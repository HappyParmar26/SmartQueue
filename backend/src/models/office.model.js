const mongoose = require('mongoose');

const { Schema, model } = mongoose;

// ── Sub-schemas ────────────────────────────────────────────────

const AddressSchema = new Schema(
    {
        street: { 
            type: String, 
            required: true, 
            trim: true 
        },
        city: { 
            type: String, 
            required: true, 
            trim: true 
        },
        state: { 
            type: String, 
            required: true, 
            trim: true 
        },
        pincode: {
            type: String,
            required: true,
            match: [/^\d{6}$/, "Pincode must be a 6-digit number"],
        },
    },
    { _id: false }
);

const LocationSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
            required: true,
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
            validate: {
                validator: ([lng, lat]) =>
                    lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90,
                message: "Coordinates must be valid [longitude, latitude] values",
            },
        },
    },
    { _id: false }
);

const HoursSchema = new Schema(
    {
        open: { 
            type: Number, 
            required: true, 
            min: 0, 
            max: 23 
        },

        close: { 
            type: Number, 
            required: true, 
            min: 0, 
            max: 23 
        },
    },
    { _id: false }
);

// ── Main Schema ────────────────────────────────────────────────

const OfficeSchema = new Schema(
    {
        _id: {
            type: String, // e.g. "RTO_Ahmedabad_Central"
            required: true,
            trim: true,
        },
        office_name: { 
            type: String, 
            required: true, 
            trim: true 
        },

        office_type: {
            type: String,
            required: true,
        },

        address: { type: AddressSchema, required: true },

        location: { type: LocationSchema, required: true },

        hours: { type: HoursSchema, required: true },

        open_days: {
            type: String,
            required: true,
            trim: true, // e.g. "Mon-Sat", "Mon-Fri"
        },

        total_counters: { type: Number, required: true, min: 1 },

        is_active: { type: Boolean, default: true },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
        versionKey: false,
    }
);

const OfficeModel = model("Office", OfficeSchema);

module.exports = OfficeModel;