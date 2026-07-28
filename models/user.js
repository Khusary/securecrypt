const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "user",
    },


    // Email Verification
    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationOTP: {
      type: String,
    },

    verificationOTPExpires: {
      type: Date,
    },

    // Password Reset
    resetOTP: {
      type: String,
    },

    resetOTPExpires: {
      type: Date,
    },



    // ===== Email Verification =====

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationOTP: {
      type: String,
      default: null,
    },

    verificationOTPExpires: {
      type: Date,
      default: null,
    },

  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);