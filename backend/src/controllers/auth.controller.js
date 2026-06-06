const userModel = require("../models/user.model");
const jwt = require('jsonwebtoken')

/**
 * @name registerUserController
 * @description Controller to handle user registration, expects name, phone, email, password
 * @access Public
 */

async function registerUserController(req, res) {

        const {
            name,
            phone,
            email,
            role,
            office_id,
            dob,
            gender,
            aadhaar_last4,
            priority,
            preferences,
        } = req.body;

        // Required fields
        if (!email || !phone) {
            return res.status(400).json({
                success: false,
                message: "Email and phone are required",
            });
        }

        // Check existing user
        const existingUser = await userModel.findOne({ $or: [{ phone }, { email }] });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Create user
        const user = await userModel.create({
            name,
            phone,
            email,
            role,
            office_id,
            dob,
            gender,
            aadhaar_last4,
            priority,
            preferences,
        });


        const token = jwt.sign({id: user._id, name:user.name},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        )
            
        res.cookie("token", token)

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
        });
   
};

/**
 * @name loginUserController
 * @description Controller to handle user login, expects email and phone no
 * @access Public
 */

async function loginUserController(req, res) {

    const { email, phone } = req.body

    const user = await userModel.findOne({ $or: [{ email }, { phone }] })

    if (!user) {
        return res.status(400).json({
            message: "inavalid email or phone"
        })
    }

    token = jwt.sign({ id: user._id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
            
    res.cookie("token", token)

    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: user,
    });
}


/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access Public
 */
async function logoutUserController(req, res){

    const token = req.cookies.token

    res.clearCookie("token")

    res.status(200).json({
        message:"user loged out successfully"
    })
}


module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController
};