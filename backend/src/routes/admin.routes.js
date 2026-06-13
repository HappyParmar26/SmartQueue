const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const adminOnly = require("../middlewares/admin.middleware");
const queueController = require("../controllers/queue.controller");

const adminRouter = express.Router();

adminRouter.use(authMiddleware, adminOnly);

adminRouter.get("/dashboard", queueController.getAdminDashboard);
adminRouter.get("/queue", queueController.getAdminQueue);
adminRouter.post("/queue/call-next", queueController.callNextToken);
adminRouter.post("/tokens/walkin", queueController.createWalkInToken);
adminRouter.patch("/queue/:id/skip", queueController.skipQueueToken);
adminRouter.patch("/queue/:id/serve", queueController.serveQueueToken);
adminRouter.patch("/queue/:id/transfer", queueController.transferQueueToken);
adminRouter.get("/counters", queueController.listCounters);
adminRouter.patch("/counters/:id", queueController.updateCounter);
adminRouter.get("/analytics", queueController.getAdminAnalytics);
adminRouter.get("/ai-insights", queueController.getAiInsights);
adminRouter.get("/slots", queueController.getSlots);
adminRouter.patch("/slots/:id", queueController.updateSlot);

module.exports = adminRouter;
