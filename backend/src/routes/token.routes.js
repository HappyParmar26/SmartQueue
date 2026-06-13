const express = require('express');
const tokenController = require('../controllers/token.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const tokenRouter = express.Router();

tokenRouter.post("/book", authMiddleware, tokenController.createToken);
tokenRouter.post("/", authMiddleware, tokenController.createToken);
tokenRouter.get("/", authMiddleware, tokenController.getCitizenTokens);
tokenRouter.get("/my-tokens", authMiddleware, tokenController.getCitizenTokens);

// Get live state for a specific token (citizen view)
tokenRouter.get("/:id/live", authMiddleware, tokenController.getLiveToken);
tokenRouter.get("/:id", authMiddleware, tokenController.getCitizenTokenById);
tokenRouter.delete("/:id", authMiddleware, tokenController.cancelToken);
tokenRouter.post("/:id/cancel", authMiddleware, tokenController.cancelToken);

module.exports = tokenRouter;
