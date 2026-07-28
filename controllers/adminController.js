const User = require("../models/user");
const File = require("../models/file");

const dashboardStats = async (req, res) => {

    try {

        const totalUsers = await User.countDocuments();

        const totalFiles = await File.countDocuments();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const uploadsToday = await File.countDocuments({

            createdAt: {
                $gte: today,
            },

        });

        res.json({

            totalUsers,

            totalFiles,

            uploadsToday,

        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};

const recentUsers = async (req, res) => {

    try {

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 })
            .limit(5);

        res.json(users);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};

const recentFiles = async (req, res) => {

    try {

        const files = await File.find()

            .populate("owner", "name email")

            .sort({ createdAt: -1 })

            .limit(5);

        res.json(files);

    } catch (error) {

        res.status(500).json({

            message: error.message,

        });

    }

};

const getAllUsers = async (req, res) => {

    try {

        const users = await User.find()

            .select("-password")

            .sort({ createdAt: -1 });

        res.json(users);

    } catch (error) {

        res.status(500).json({

            message: error.message,

        });

    }

};


const deleteUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({
                message: "User not found",
            });

        }

        // Kada admin ya goge kansa
        if (user.role === "admin") {

            return res.status(403).json({
                message: "Admin account cannot be deleted",
            });

        }

        // Goge duk files na user
        await File.deleteMany({
            owner: user._id,
        });

        // Goge user
        await User.findByIdAndDelete(user._id);

        res.json({

            message: "User deleted successfully",

        });

    } catch (error) {

        res.status(500).json({

            message: error.message,

        });

    }

};

const getUserDetails = async (req, res) => {

    try {

        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {

            return res.status(404).json({
                message: "User not found",
            });

        }

        const files = await File.find({
            owner: user._id,
        });

        const totalFiles = files.length;

        const totalStorage = files.reduce((sum, file) => {

            return sum + file.size;

        }, 0);

        res.json({

            user,

            totalFiles,

            totalStorage,

        });

    } catch (error) {

        res.status(500).json({

            message: error.message,

        });

    }

};

const getAllFiles = async (req, res) => {

    try {

        const files = await File.find()

            .populate("owner", "name email")

            .sort({ createdAt: -1 });

        res.json(files);

    } catch (error) {

        res.status(500).json({

            message: error.message,

        });

    }

};


const deleteFileByAdmin = async (req, res) => {

    try {

        const file = await File.findById(req.params.id);

        if (!file) {

            return res.status(404).json({
                message: "File not found",
            });

        }

        // Idan kana da Cloudinary public_id
        if (file.cloudinary_id) {

            const cloudinary = require("../config/cloudinary");

            await cloudinary.uploader.destroy(
                file.cloudinary_id,
                {
                    resource_type: "raw",
                }
            );

        }

        await File.findByIdAndDelete(file._id);

        res.json({

            message: "File deleted successfully",

        });

    } catch (error) {

        res.status(500).json({

            message: error.message,

        });

    }

};


const getFileDetails = async (req, res) => {

    try {

        const file = await File.findById(req.params.id)
            .populate("owner", "name email");

        if (!file) {

            return res.status(404).json({
                message: "File not found",
            });

        }

        res.json(file);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};



const Log = require("../models/log");

const getAllLogs = async (req, res) => {

    try {

        const logs = await Log.find()

            .populate("user", "name email")

            .sort({ createdAt: -1 });

        res.json(logs);

    }

    catch(error){

        res.status(500).json({

            message:error.message,

        });

    }

};

const Admin = require("../models/admin");

const getAdminProfile = async (req, res) => {

    try {

        const admin = await Admin.findById(req.admin.id)

            .select("-password");

        res.json(admin);

    }

    catch (error) {

        res.status(500).json({

            message: error.message,

        });

    }

};


const bcrypt = require("bcryptjs");

const updateAdminProfile = async (req, res) => {

    try {

        const admin = await Admin.findById(req.admin.id);

        if (!admin) {

            return res.status(404).json({

                message: "Admin not found",

            });

        }

        admin.name = req.body.name || admin.name;

        admin.email = req.body.email || admin.email;

        if (req.body.password) {

            admin.password = await bcrypt.hash(

                req.body.password,

                10

            );

        }

        await admin.save();

        res.json({

            message: "Profile updated successfully",

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message,

        });

    }

};

module.exports = {

    dashboardStats,

    recentUsers,

    recentFiles,

    getAllUsers,

    deleteUser,

    getUserDetails,

    getAllFiles,

    deleteFileByAdmin,

    getFileDetails,

    getAllLogs,

    getAdminProfile,

    updateAdminProfile,

};