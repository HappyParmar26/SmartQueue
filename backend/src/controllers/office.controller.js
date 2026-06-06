const officemodel = require('../models/office.model');
const slotmodel = require('../models/slot.model');

/**
 * @name getAllOfficesController
 * @description Controller to fetch all offices
 * @access Public
 */

async function getAllOfficesController(req, res){
    try {
        const offices = await officemodel.find();
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
        const office = await officemodel.findById(officeId);
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
        const slots = await slotmodel.find({ office: officeId });
        res.status(200).json({
            message: "Slots fetched successfully",
            slots
        })
    } catch (error){
        res.status(500).json({
            message: "Error fetching slots",
        })
    }
    
}

module.exports = {
    getAllOfficesController,
    getOfficeByIdController,
    getOfficeSlotsController
}
