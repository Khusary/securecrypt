const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
    {
        originalName: {
            type: String,
            required: true,
        },

        encryptedName: {
            type: String,
            required: true,
        },

        keyFile: {
            type: String,
            required: true,
        },

        size: {
            type: Number,
            required: true,
        },

        mimeType: {
            type: String,
            required: true,
        },

        originalHash: {
            type: String,
            required: true,
        },

        encryptedHash: {
            type: String,
            required: true,
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        digitalSignature: {
            type: String,
            required: true,
        },

        cloudinaryUrl: {
            type: String,
            default: "",
        },

        cloudinaryId: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports =
    mongoose.models.File || mongoose.model("File", fileSchema);