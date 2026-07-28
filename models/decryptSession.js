
const mongoose = require("mongoose");

const decryptSessionSchema = new mongoose.Schema(

    {

        user: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true,

        },

        otp: {

            type: String,

            required: true,

        },

        otpExpires: {

            type: Date,

            required: true,

        },

        verified: {

            type: Boolean,

            default: false,

        },

        sessionExpires: {

            type: Date,

        },

    },

    {

        timestamps: true,

    }

);

module.exports = mongoose.model(

    "DecryptSession",

    decryptSessionSchema

);
