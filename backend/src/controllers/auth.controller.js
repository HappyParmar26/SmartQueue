const userModel = require("../models/user.model");
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

/**
 * @name registerUserController
 * @description Controller to handle user registration, expects name, phone, email, password
 * @access Public
 */

async function registerUserController(req, res) {

    try {

        const {
            name,
            phone,
            email,
            password,
            role,
            office_id,
            dob,
            gender,
            aadhaar_last4,
            priority,
            preferences,
        } = req.body;

        // Required fields
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, phone, and password are required",
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long",
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

        // Hash password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create user
        const user = await userModel.create({
            name,
            phone,
            email,
            password: hashedPassword,
            role,
            office_id,
            dob,
            gender,
            aadhaar_last4,
            priority,
            preferences,
        });


        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                role: user.role,
                office_id: user.office_id || null,
            },
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        )
            
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        })

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error('ISE > User Registration Failed : ', error);
        res.status(500).json({
            success: false,
            message: 'ISE > Internal Server Error' + error.message
        });
    }
   
};

/**
 * @name loginUserController
 * @description Controller to handle user login, expects email and phone no
 * @access Public
 */

async function loginUserController(req, res) {

    try {

        const { email, phone , password } = req.body

        if ( !email || !phone ) {
            return res.status(400).json({
                success: false,
                message: "Email or phone are required"
            })
        }

        if ( !password ) {
            return res.status(400).json({
                success: false,
                message: "Password is required"
            })
        }

        const user = await userModel.findOne({ $or: [{ email }, { phone }] }).select('+password')

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or phone"
            })
        }

        // Verify password
        const isPasswordValid = await bcryptjs.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                role: user.role,
                office_id: user.office_id || null,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )
                
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        })

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                role: user.role,
                office_id: user.office_id || null,
            },
        });
    
    }
    catch ( error ) {
        console.error('ISE > User Login Failed : ', error);
        res.status(500).json({
            success: false,
            message: 'ISE > Internal Server Error' + error.message
        });
    }
}
    


/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access Public
 */
async function logoutUserController(req, res) {

    try {

        const token = req.cookies.token
        res.clearCookie("token")

        res.status(200).json({
            success: true,
            message:"user logged out successfully"
        })
    }
    catch (error) {
        console.error('ISE > Logout Failed : ', error);
        res.status(500).json( {
            success: false,
            message: 'ISE > Internal Server Error' + error.message
        });
    }

}


module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController
};
