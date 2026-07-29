const express = require("express");
const multer = require("multer");
const path = require("path");

const fs = require("fs");

if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads", { recursive: true });
}

const auth = require("../middlewares/auth");

const {
    uploadFile,
    decryptUploadedFile,
    myFiles,
    downloadFile,
    deleteFile,
    sendDecryptOTP,
    verifyDecryptOTP,
} = require("../controllers/fileController");

const router = express.Router();

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }

});

const upload = multer({
    storage,
});

router.post("/upload", auth, upload.single("file"), uploadFile);

router.post("/decrypt/send-otp", auth, sendDecryptOTP);

router.post("/decrypt/verify-otp", auth, verifyDecryptOTP);

router.get("/decrypt/:id", auth, decryptUploadedFile);

router.get("/my-files", auth, myFiles);

router.get("/download/:id", auth, downloadFile);

router.delete("/delete/:id", auth, deleteFile);

module.exports = router;