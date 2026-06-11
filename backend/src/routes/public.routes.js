const express = require("express");
const queueController = require("../controllers/queue.controller");

const publicRouter = express.Router();

publicRouter.get("/display/:office_id", queueController.getPublicDisplay);
publicRouter.get("/offices/:office_id/live", queueController.getOfficeLive);

module.exports = publicRouter;
