const cloudinary = require("../config/cloudinary");

async function deleteFromCloudinary(publicId) {

    try {

        const result = await cloudinary.uploader.destroy(
            publicId,
            {
                resource_type: "raw",
            }
        );

        return result;

    } catch (error) {

        throw error;

    }

}

module.exports = deleteFromCloudinary;