const mongoose = require("mongoose");

const { Schema, model } = mongoose;

// ── Sub-schemas ────────────────────────────────────────────────

const CapacitySchema = new Schema(
    {
        total: { 
            type: Number, 
            required: true, 
            min: 0 
        },
        booked: { 
            type: Number, 
            default: 0, 
            min: 0 
        },
        remaining: { 
            type: Number, 
            required: true, 
            min: 0 
        },
        walkin_reserved: { 
            type: Number, 
            default: 0, 
            min: 0 
        },
        online_available: { 
            type: Number, 
            required: true, 
            min: 0 
        
        },
    },
    { _id: false }
);

const PredictionSchema = new Schema(
    {
        crowd_level: { 
            type: Number, 
            required: true, 
            min: 0, 
            max: 100 
        },
        tokens_issued: { 
            type: Number, 
            required: true, 
            min: 0 
        },
        wait_time_minutes: { 
            type: Number, 
            required: true, 
            min: 0 
        },
        rush_label: {
            type: String,
            required: true,
            enum: ["Low", "Moderate", "High", "Very High"],
        },
    },
    { _id: false }
);

// ── Main Schema ────────────────────────────────────────────────

const SlotSchema = new Schema(
    {
        office_id: {
            type: String,
            ref: "Office",
            required: true,
        },
        date: {
            type: String,
            required: true,
            match: [/^\d{4}-\d{2}-\d{2}$/, "date must be in YYYY-MM-DD format"],
        },
        hour: { 
            type: Number, 
            required: true, 
            min: 0, 
            max: 23 
        },
        slot_time: {
            type: String,
            required: true,
            match: [/^\d{2}:\d{2}$/, "slot_time must be in HH:MM format"],
        },
        slot_label: { 
            type: String, 
            required: true, 
            trim: true 
        }, // e.g. "10:30 AM"

        capacity: { 
            type: CapacitySchema, 
            required: true 
        },

        prediction: { 
            type: PredictionSchema, 
            required: true 
        },

        status: {
            type: String,
            required: true,
            enum: ["available", "filling", "full", "closed", "holiday"],
            default: "available",
        },
        is_active: { 
            type: Boolean, 
            default: true 
        },
        generated_at: { 
            type: Date, 
            required: true 
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
        versionKey: false,
    }
);



// Unique slot per office + date + slot_time
SlotSchema.index(
    { office_id: 1, date: 1, slot_time: 1 },
    { unique: true }
);

SlotSchema.index({ office_id: 1, date: 1, hour: 1 });             // hourly slot lookup
SlotSchema.index({ office_id: 1, date: 1, status: 1 });           // available slots query
SlotSchema.index({ office_id: 1, date: 1, is_active: 1 });        // active slot filter
SlotSchema.index({ "prediction.rush_label": 1, date: 1 });        // crowd analytics
SlotSchema.index({ generated_at: 1 });                            // batch generation audits



const SlotModel = model("Slot", SlotSchema);

module.exports = SlotModel;