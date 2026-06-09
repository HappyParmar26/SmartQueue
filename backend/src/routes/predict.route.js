const express = require('express');
const predictController = require('../controllers/predict.controller');

const predictRouter = express.Router();

predictRouter.post('/hour', predictController.predict);
predictRouter.get('/day', predictController.predictDay);
predictRouter.get('/week', predictController.predictWeek);

module.exports = predictRouter;
