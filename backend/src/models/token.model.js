const mongoose = require("mongoose");

const { Schema, model } = mongoose;

// ── Sub-schemas ────────────────────────────────────────────────

const ServiceSchema = new Schema(
    {
        service_id: { type: Schema.Types.ObjectId, ref: "Service", required: true },
        service_name: { type: String, required: true, trim: true },
    },
    { _id: false }
);

const CounterSchema = new Schema(
    {
        counter_id: { type: Schema.Types.ObjectId, ref: "Counter", required: true },
        counter_number: { type: Number, required: true, min: 1 },
    },
    { _id: false }
);

const BookingSchema = new Schema(
    {
        date: {
            type: String,
            required: true,
            match: [/^\d{4}-\d{2}-\d{2}$/, "date must be in YYYY-MM-DD format"],
        },

        hour: { type: Number, required: true, min: 0, max: 23 },

        slot_time: {
            type: String,
            required: true,
            match: [/^\d{2}:\d{2}$/, "slot_time must be in HH:MM format"],
        },

        slot_id: { type: Schema.Types.ObjectId, ref: "Slot", required: true },
        
        position: { type: Number, required: true, min: 1 },
    },
    { _id: false }
);

const PrioritySchema = new Schema(
    {
        is_priority: { type: Boolean, default: false },
        is_walkin: { type: Boolean, default: false },
        priority_reason: { type: String, default: null, trim: true },
    },
    { _id: false }
);

const WaitSchema = new Schema(
    {
        estimated_mins: { type: Number, default: null, min: 0 },
        actual_mins: { type: Number, default: null, min: 0 },
    },
    { _id: false }
);

const TimestampsSchema = new Schema(
    {
        booked_at: { type: Date, required: true, default: () => new Date() },
        called_at: { type: Date, default: null },
        served_at: { type: Date, default: null },
        cancelled_at: { type: Date, default: null },
    },
    { _id: false }
);

// ── History Entry ──────────────────────────────────────────────

const HistoryEntrySchema = new Schema(
    {
        status: {
            type: String,
            required: true,
            enum: ["waiting", "called", "serving", "served", "cancelled", "no_show", "rescheduled"],
        },
        changed_at: { type: Date, required: true, default: () => new Date() },
        changed_by: { type: Schema.Types.ObjectId, ref: "Staff", default: null },
        note: { type: String, default: null, trim: true },
    },
    { _id: false }
);

// ── Main Schema ────────────────────────────────────────────────

const TokenSchema = new Schema(
    {
        token_number: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
            match: [/^T-\d+$/, "token_number must follow format T-247"],
        },
        office_id: {
            type: Schema.Types.ObjectId,
            ref: "Office",
            required: true,
        },
        citizen_id: {
            type: Schema.Types.ObjectId,
            ref: "Citizen",
            required: true,
        },
        service: { 
            type: ServiceSchema, 
            required: true 
        },
        counter: { 
            type: CounterSchema, 
            default: null 
        },
        booking: { 
            type: BookingSchema, 
            required: true 
        },
        status: {
            type: String,
            required: true,
            enum: ["waiting", "called", "serving", "served", "cancelled", "no_show", "rescheduled"],
            default: "waiting",
        },

        priority: { type: PrioritySchema, default: () => ({}) },

        wait: { type: WaitSchema, default: () => ({}) },

        timestamps: { type: TimestampsSchema, required: true },

        cancel_reason: { type: String, default: null, trim: true },

        history: { type: [HistoryEntrySchema], default: [] },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
        versionKey: false,
    }
);

// ── Indexes ────────────────────────────────────────────────────

// Enforce unique token number per office per day
TokenSchema.index(
    { office_id: 1, token_number: 1, "booking.date": 1 },
    { unique: true }
);

TokenSchema.index({ office_id: 1, status: 1 });                        // live queue dashboard
TokenSchema.index({ office_id: 1, "booking.date": 1, status: 1 });     // daily queue view
TokenSchema.index({ citizen_id: 1, "booking.date": 1 });               // citizen booking history
TokenSchema.index({ "booking.slot_id": 1 });                           // slot-level lookups
TokenSchema.index({ "booking.date": 1, "booking.hour": 1, status: 1 }); // hourly load reports
TokenSchema.index({ "priority.is_priority": 1, status: 1 });           // priority queue filter

const TokenModel = model("Token", TokenSchema);

module.exports = TokenModel;