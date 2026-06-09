const express = require('express');
const departmentController = require('../controllers/department.controller');

const departmentRouter = express.Router();

departmentRouter.post("/", departmentController.crateDepartment);

module.exports = departmentRouter;