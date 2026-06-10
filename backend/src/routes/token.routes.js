const express = require('express');
const tokenController = require('../controllers/token.controller');
const authMiddleware = require('../middlewares/auth.middleware');


const tokenRouter = express.Router();

tokenRouter.post("/" , authMiddleware, tokenController.createToken )
tokenRouter.get("/my-tokens", authMiddleware, tokenController.getCitizenTokens)

tokenRouter.get("/live/:office_id", authMiddleware, tokenController.getLiveToken)
tokenRouter.get("/:id", authMiddleware, tokenController.getCitizenTokenById)
tokenRouter.post("/:id/cancel", authMiddleware, tokenController.cancelToken)

module.exports = tokenRouter;
