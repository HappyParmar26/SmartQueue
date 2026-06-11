const express = require('express');
const departmentController = require('../controllers/departments.controller');

const departmentRouter = express.Router();

departmentRouter.post("/", departmentController.createDepartment);

module.exports = departmentRouter;