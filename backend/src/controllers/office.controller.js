const OfficeModel = require('../models/office.model');
const SlotModel = require('../models/slot.model');


const createOffice = async (req, res) => {

    try {
        const {
            office_name,
            office_type,
            address,
            location,
            hours,
            open_days,
            total_counters,
            is_active,
        } = req.body;

        // Check for existing office by name to avoid duplicates
        const existingOffice = await OfficeModel.findOne({ office_name });
        if (existingOffice) {
            return res.status(409).json({
                success: false,
                message: 'Office already exists',
            });
        }

        const office = await OfficeModel.create({
            office_name,
            office_type,
            address,
            location,
            hours,
            open_days,
            total_counters,
            is_active,
        });

        return res.status(201).json({
            success: true,
            message: "Office created successfully",
            data: office,
        });
    } 
    catch (error) {
        console.error('ISE > Create Office Failed : ', error);
        res.status(500).json( {
            success: false,
            message: 'ISE > Internal Server Error' + error.message 
        });
    }
}

/**
 * @name getAllOfficesController
 * @description Controller to fetch all offices
 * @access Public
 */

async function getAllOfficesController(req, res){
    try {
        const offices = await OfficeModel.find();
        res.status(200).json({
            message: "Offices fetched successfully",
            offices
        })
    } catch (error) {
        res.status(500).json({
            message: "Error fetching offices",
            error: error.message
        })
    }
}


/**
 * @name getOfficeByIdController
 * @description Controller to fetch office by id
 * @access Public
 */

async function getOfficeByIdController(req, res){
    const officeId = req.params.id;
    try {
        const office = await OfficeModel.findById(officeId);
        if (!office) {
            return res.status(404).json({
                message: "Office not found"
            })
        }
        res.status(200).json({
            message: "Office fetched successfully",
            office
        })
    } catch (error) {
        res.status(500).json({
            message: "Error fetching office",
            error: error.message
        })
    }
}

/**
 * @name getOfficeSlotsController
 * @description Controller to fetch slots of an office by office id
 * @access Public
 */
async function getOfficeSlotsController(req, res){

    const officeId = req.params.id;
    try {
        const slots = await SlotModel.find({ office: officeId });
        res.status(200).json({
            message: "Slots fetched successfully",
            slots
        })
    } catch (error){
        res.status(500).json({
            message: "Error fetching slots",
            error: error.message
        })
    }
    
}

module.exports = {
    createOffice,
    getAllOfficesController,
    getOfficeByIdController,
    getOfficeSlotsController
}
