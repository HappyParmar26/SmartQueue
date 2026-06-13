const express = require("express");
const queueController = require("../controllers/queue.controller");

const internalRouter = express.Router();

internalRouter.post("/slots/generate", queueController.generateSlots);
internalRouter.post("/observations/sync", queueController.syncObservations);

module.exports = internalRouter;
