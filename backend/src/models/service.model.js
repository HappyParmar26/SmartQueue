const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
    {
        office_id: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },

        service_name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        avg_time_mins: {
            type: Number,
            required: true,
            min: 1,
        },

        is_active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: false,
        },
    }
);

// Optional: Prevent duplicate services in the same office
//serviceSchema.index(
//    { office_id: 1, service_name: 1 },
//    { unique: true }
//);

const ServiceModel = mongoose.model("Service", serviceSchema);

module.exports = ServiceModel;