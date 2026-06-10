const express = require("express");
const authController = require("../controllers/auth.controller");

const authRouter = express.Router();


/**
 * @route POST /api/v1/auth/register
 * @description Register a new user
 * @access Public
 */

authRouter.post('/register',authController.registerUserController)

/**
 * @route POST /api/v1/auth/login
 * @desccription login user with email and phone no
 * @access Public
 */

authRouter.post('/login', authController.loginUserController)

/**
 * @route GET /api/v1/auth/logout
 * @description clear token from user cookie 
 * @access Public
 */
authRouter.get("/logout",authController.logoutUserController)
 


module.exports = authRouter;