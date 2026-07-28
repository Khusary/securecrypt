const user = require("../models/user");
const File = require("../models/File");

const getProfile = async (req, res) => {

    try {

        const user = await user.findById(req.user.id).select("-password");

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        const files = await File.find({
            owner: req.user.id
        });

        const totalFiles = files.length;

        const storageUsed = files.reduce((total, file) => {

            return total + file.size;

        }, 0);

        res.json({

            name: user.name,

            email: user.email,

            joined: user.createdAt,

            totalFiles,

            storageUsed

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {

    getProfile

};