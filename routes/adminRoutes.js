const express = require("express");
const router = express.Router();

const adminAuth = require("../middlewares/adminAuth");

const { adminLogin } = require("../controllers/adminAuthController");

const {
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
} = require("../controllers/adminController");

router.get(
    "/admin/dashboard",
    adminAuth,
    dashboardStats
);

router.get(
    "/admin/recent-users",
    adminAuth,
    recentUsers
);

router.get(

    "/admin/recent-files",

    adminAuth,

    recentFiles

);

router.get(
    "/admin/users",
    adminAuth,
    getAllUsers
);

router.delete(
    "/admin/users/:id",
    adminAuth,
    deleteUser
);

router.get(
    "/admin/users/:id",
    adminAuth,
    getUserDetails
);

router.get(
    "/admin/files",
    adminAuth,
    getAllFiles
);

router.delete(
    "/admin/files/:id",
    adminAuth,
    deleteFileByAdmin
);

router.get(
    "/admin/files/:id",
    adminAuth,
    getFileDetails
);

router.get(
    "/admin/logs",
    adminAuth,
    getAllLogs
);


router.post("/admin/login", adminLogin);

router.get("/admin/profile", adminAuth, getAdminProfile);

router.put("/admin/profile", adminAuth, updateAdminProfile);



module.exports = router;