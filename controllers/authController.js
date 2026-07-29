const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Admin = require("../models/admin");

const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const logActivity = require("../utils/logActivity");


// Register
const register = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // Validate Email Format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            return res.status(400).json({

                message: "Please enter a valid email address."

            });

        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({

                message: "User already exists."

            });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        const user = new User({

            name,

            email,

            password: hashedPassword,

            isVerified: false,

            verificationOTP: otp,

            verificationOTPExpires: new Date(

                Date.now() + 10 * 60 * 1000

            )

        });

        await user.save();

        // Send OTP Email
        await sendEmail(

            email,

            "SecureCrypt Email Verification",

            `
                <h2>Welcome to SecureCrypt</h2>

                <p>Your verification code is:</p>

                <h1 style="letter-spacing:5px;color:#1565c0;">
                    ${otp}
                </h1>

                <p>This code will expire in 10 minutes.</p>

                <p>If you did not create this account, please ignore this email.</p>
            `

        );


        console.log("OTP:", otp);



        // await user.save();

        // return res.status(201).json({
        //     message: "Registration successful",
        //     email: user.email
        // });

        res.status(201).json({

            message:
                "Registration successful. Please verify your email.",

            email

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: error.message,

        });

    }

};

// Verify Email
const verifyEmail = async (req, res) => {

    try {

        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        if (user.isVerified) {

            return res.status(400).json({

                message: "Email already verified."

            });

        }

        if (user.verificationOTP !== otp) {

            return res.status(400).json({

                message: "Invalid OTP."

            });

        }

        if (user.verificationOTPExpires < new Date()) {

            return res.status(400).json({

                message: "OTP has expired."

            });

        }

        user.isVerified = true;

        user.verificationOTP = null;

        user.verificationOTPExpires = null;

        await user.save();

        res.json({

            message: "Email verified successfully."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: error.message,

        });

    }

};

// Resend OTP
const resendOTP = async (req, res) => {

    try {

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        if (user.isVerified) {

            return res.status(400).json({

                message: "Email already verified."

            });

        }

        const otp = crypto.randomInt(100000, 999999).toString();

        user.verificationOTP = otp;

        user.verificationOTPExpires = new Date(

            Date.now() + 10 * 60 * 1000

        );

        await user.save();

        await sendEmail(

            user.email,

            "SecureCrypt - New Verification Code",

            `
            <h2>SecureCrypt</h2>

            <p>Your new verification code is:</p>

            <h1 style="letter-spacing:5px;color:#1565c0;">
                ${otp}
            </h1>

            <p>This code will expire in 10 minutes.</p>
            `
        );

        res.json({

            message: "A new OTP has been sent to your email."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: error.message,

        });

    }

};


// Forgot Password
const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        const otp = crypto.randomInt(100000, 999999).toString();

        user.resetOTP = otp;

        user.resetOTPExpires = new Date(

            Date.now() + 10 * 60 * 1000

        );

        await user.save();

        await sendEmail(

            user.email,

            "SecureCrypt - Password Reset OTP",

            `
            <h2>SecureCrypt Password Reset</h2>

            <p>Your password reset code is:</p>

            <h1 style="letter-spacing:5px;color:#d32f2f;">
                ${otp}
            </h1>

            <p>This code will expire in 10 minutes.</p>

            <p>If you did not request this, please ignore this email.</p>
            `
        );

        res.json({

            message: "Password reset OTP has been sent to your email."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: error.message,

        });

    }

};


// Verify Reset OTP
const verifyResetOTP = async (req, res) => {

    try {

        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        if (user.resetOTP !== otp) {

            return res.status(400).json({

                message: "Invalid OTP."

            });

        }

        if (user.resetOTPExpires < new Date()) {

            return res.status(400).json({

                message: "OTP has expired."

            });

        }

        const resetToken = jwt.sign(

            {

                id: user._id,

                purpose: "password-reset",

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "10m",

            }

        );

        res.status(200).json({

            message: "OTP verified successfully.",

            resetToken,

        });


    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: error.message,

        });

    }

};


// Reset Password
const resetPassword = async (req, res) => {

    try {

        const { newPassword, resetToken } = req.body;

        if (!resetToken) {

            return res.status(401).json({

                message: "Reset token is required."

            });

        }

        let decoded;

        try {

            decoded = jwt.verify(

                resetToken,

                process.env.JWT_SECRET

            );

        }

        catch {

            return res.status(401).json({

                message: "Invalid or expired reset token."

            });

        }

        if (decoded.purpose !== "password-reset") {

            return res.status(401).json({

                message: "Invalid reset token."

            });

        }

        const user = await User.findById(decoded.id);

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        if (

            !user.resetOTP ||

            !user.resetOTPExpires ||

            user.resetOTPExpires < new Date()

        ) {

            return res.status(400).json({

                message: "Password reset session has expired."

            });

        }

        const hashedPassword = await bcrypt.hash(

            newPassword,

            10

        );

        user.password = hashedPassword;

        // Clear reset session
        user.resetOTP = undefined;
        user.resetOTPExpires = undefined;

        await user.save();

        res.status(200).json({

            message: "Password reset successfully."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: error.message,

        });

    }

};

// Login
const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Credentials",
            });
        }



        if (!user.isVerified) {

            return res.status(403).json({

                message:
                    "Please verify your email before logging in."

            });

        }


        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        await logActivity(

            user._id,

            "User Login",

            "-",

            req.ip

        );

        res.json({
            message: "Login Successful",
            token,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message,
        });

    }
};

const adminLogin = async (req, res) => {

    try {

        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });

        if (!admin) {

            return res.status(404).json({
                message: "Admin not found",
            });

        }

        const isMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isMatch) {

            return res.status(401).json({
                message: "Invalid Credentials",
            });

        }

        const token = jwt.sign(
            {
                id: admin._id,
                role: "admin",
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        res.json({

            message: "Admin Login Successful",

            token,

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: error.message,

        });

    }

};

module.exports = {
    register,
    verifyEmail,
    resendOTP,
    forgotPassword,
    verifyResetOTP,
    resetPassword,
    login,
    adminLogin,
};