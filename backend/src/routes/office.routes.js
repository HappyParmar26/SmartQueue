const express = require('express');
const officeController = require('../controllers/office.controller');

const officeRouter = express.Router();

/**
 * @route GET /api/offices
 * @description Get all offices
 * @access Public
 */
officeRouter.get("/", officeController.getAllOfficesController);

/**
 * @route GET /api/offices/:id
 * @description Get office by id
 * @access Public
 */
officeRouter.get("/:id", officeController.getOfficeByIdController);

officeRouter.get("/:id/slots", officeController.getOfficeSlotsController);

// This Route is to create the office 
// Note this route is just to create the office for the DB purpose , this rouuute wont be exposed in public 
officeRouter.post("/create", officeController.createOffice);

module.exports = officeRouter;