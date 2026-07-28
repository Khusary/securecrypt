const cloudinary = require("../config/cloudinary");

async function uploadToCloudinary(filePath) {

    try {

        const result = await cloudinary.uploader.upload(filePath, {

            resource_type: "raw",

            folder: "SecureCrypt",

        });

        return result;

    } catch (error) {

        throw error;

    }

}

module.exports = uploadToCloudinary;