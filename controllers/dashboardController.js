const File = require("../models/file");
const User = require("../models/user");

const getDashboard = async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select("-password");

        const files = await File.find({
            owner: req.user.id
        });

        const totalFiles = files.length;

        let storageUsed = 0;

        files.forEach(file => {

            storageUsed += file.size;

        });

        storageUsed = (storageUsed / (1024 * 1024)).toFixed(2);

        const lastUpload = files.length > 0
            ? files[files.length - 1].createdAt
            : null;

        res.json({

            user,

            totalFiles,

            storageUsed,

            lastUpload

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {

    getDashboard

};