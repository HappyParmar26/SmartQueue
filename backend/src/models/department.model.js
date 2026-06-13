const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
    {
        office_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Office",
            required: true,
            index: true,
        },

        department_name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
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

// Prevent duplicate departments in the same office
departmentSchema.index(
    { office_id: 1, department_name: 1 },
    { unique: true }
);

const DepartmentModel = mongoose.model(
    "Department",
    departmentSchema
);

module.exports = DepartmentModel;