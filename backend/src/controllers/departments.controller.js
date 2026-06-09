const DepartmentModel = require("../models/Department");
const OfficeModel = require("../models/Office");

const createDepartment = async (req, res) => {
    try {
        const {
            office_id,
            department_name,
            description,
            is_active,
        } = req.body;

        // Check if office exists
        const office = await OfficeModel.findById(office_id);

        if (!office) {
            return res.status(404).json({
                success: false,
                message: "Office not found",
            });
        }

        const department = await DepartmentModel.create({
            office_id,
            department_name,
            description,
            is_active,
        });

        return res.status(201).json({
            success: true,
            message: "Department created successfully",
            data: department,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create department",
            error: error.message,
        });
    }
};

module.exports = {
    createDepartment,
};