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

module.exports = officeRouter;