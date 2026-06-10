const CounterModel = require("../models/counter.model");

const createCounter = async (req, res) => {
    try {

        const {
            office_id,
            counter_number,
            counter_name,
            service_id,
            staff_id
        } = req.body;

        // Validation
        if (
            !office_id ||
            !counter_number ||
            !counter_name ||
            !service_id ||
            !staff_id
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if counter number already exists in the office
        const existingCounter = await CounterModel.findOne({
            office_id,
            counter_number
        });

        if (existingCounter) {
            return res.status(409).json({
                success: false,
                message: "Counter number already exists in this office"
            });
        }

        const counter = await CounterModel.create({
            office_id,
            counter_number,
            counter_name,
            service_id,
            staff_id,
            status: "closed",
            current_token: null,
            opened_at: null
        });

        return res.status(201).json({
            success: true,
            message: "Counter created successfully",
            data: counter
        });

    } catch (error) {

        console.error("Create Counter Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}


module.exports = {
    createCounter
}