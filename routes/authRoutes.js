const express = require("express");

const router = express.Router();

const {
    register,
    verifyEmail,
    resendOTP,
    forgotPassword,
    verifyResetOTP,
    resetPassword,
    login,
    adminLogin,
} = require("../controllers/authController");

router.post("/register", register);

router.post("/verify-email", verifyEmail);

router.post("/resend-otp", resendOTP);

router.post("/forgot-password", forgotPassword);

router.post("/verify-reset-otp", verifyResetOTP);


router.post("/reset-password", resetPassword);


router.post("/login", login);

router.post("/admin/login", adminLogin);

module.exports = router;