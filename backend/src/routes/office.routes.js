const express = require('express');
const officeController = require('../controllers/office.controller');

const officeRouter = express.Router();

// This Route is to create the office 
// Note this route is just to create the office for the DB purpose , this rouuute wont be exposed in public 
officeRouter.post("/create", officeController.createOffice);


officeRouter.get("/", officeController.getAllOfficesController);
officeRouter.get("/:id", officeController.getOfficeByIdController);
officeRouter.get("/:id/slots", officeController.getOfficeSlotsController);



module.exports = officeRouter;