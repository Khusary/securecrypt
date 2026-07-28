const fs = require("fs");
const file = require("../models/file");

const user = require("../models/user");

const encryptFile = require("../utils/encrypt");
const encryptAESKey = require("../utils/rsaEncrypt");

const decryptAESKey = require("../utils/rsaDecrypt");
const decryptFile = require("../utils/decrypt");

const generateHash = require("../utils/hashGenerator");
const verifyIntegrity = require("../utils/verifyIntegrity");
const signFile = require("../utils/signFile");
const verifySignature = require("../utils/verifySignature");

const uploadToCloudinary = require("../utils/uploadToCloudinary");

const downloadFromCloudinary = require("../utils/downloadFromCloudinary");
const deleteFromCloudinary = require("../utils/deleteFromCloudinary");

const logActivity = require("../utils/logActivity");


const path = require("path");

// Upload File
const uploadFile = async (req, res) => {
    try {
        const uploadedFile = req.file.path;

        const originalHash = generateHash(uploadedFile);

        const encryptedFile = "encrypted/" + Date.now() + ".enc";

        const aesKey = await encryptFile(uploadedFile, encryptedFile);

        const encryptedHash = generateHash(encryptedFile);

        const digitalSignature = signFile(uploadedFile);

        const encryptedAESKey = encryptAESKey(aesKey);

        fs.writeFileSync(encryptedFile + ".key", encryptedAESKey);

        // Upload encrypted file to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(encryptedFile);

        const file = new File({
            originalName: req.file.originalname,
            encryptedName: encryptedFile,
            keyFile: encryptedFile + ".key",
            originalHash: originalHash,
            encryptedHash: encryptedHash,
            owner: req.user.id,
            size: req.file.size,
            mimeType: req.file.mimetype,
            digitalSignature,
            cloudinaryUrl: cloudinaryResult.secure_url,
            cloudinaryId: cloudinaryResult.public_id,
        });

        await file.save();

        await logActivity(

            req.user.id,

            "Uploaded File",

            file.originalName,

            req.ip

        );

        res.json({
            message: "File uploaded successfully",
            file,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message,
        });

    }
};

// Decrypt File
// Decrypt File
const decryptUploadedFile = async (req, res) => {

    try {

        const file = await File.findOne({
            _id: req.params.id,
            owner: req.user.id,
        });



const session = await DecryptSession.findOne({

    user: req.user.id,

    verified: true,

});

if (

    !session ||

    !session.sessionExpires ||

    session.sessionExpires < new Date()

) {

    return res.status(403).json({

        message: "Please verify OTP before decrypting this file."

    });

}


        if (!file) {

            return res.status(404).json({
                message: "File not found",
            });

        }

        let encryptedFile;

        if (file.cloudinaryUrl) {

            encryptedFile = await downloadFromCloudinary(

                // console.log("Using Cloudinary file:", encryptedFile)

                file.cloudinaryUrl,

                file.encryptedName.split("/").pop()

            );

        } else {

            encryptedFile = file.encryptedName;

            console.log("Using Local File:", encryptedFile);

        }

        const isValid = verifyIntegrity(
            encryptedFile,
            file.encryptedHash
        );

        if (!isValid) {

            return res.status(400).json({
                message: "Integrity verification failed. File may have been tampered with."
            });

        }

        const encryptedKey = file.keyFile;

        const aesKey = decryptAESKey(encryptedKey);

        const outputFile =
            "decrypted/" + file.originalName;

        await decryptFile(
            encryptedFile,
            outputFile,
            aesKey
        );

        const signatureValid = verifySignature(
            outputFile,
            file.digitalSignature
        );

        if (!signatureValid) {

            fs.unlinkSync(outputFile);

            return res.status(400).json({
                message: "Digital signature verification failed."
            });

        }

        const decryptedHash = generateHash(outputFile);

        if (decryptedHash !== file.originalHash) {

            fs.unlinkSync(outputFile);

            return res.status(400).json({
                message: "Original file integrity verification failed."
            });

        }

        await logActivity(

            req.user.id,

            "Downloaded File",

            file.originalName,

            req.ip

        );

        res.download(
            outputFile,
            file.originalName
        );

        res.on("finish", () => {

            try {

                if (

                    file.cloudinaryUrl &&

                    fs.existsSync(encryptedFile)

                ) {

                    fs.unlinkSync(encryptedFile);

                }

                if (fs.existsSync(outputFile)) {

                    fs.unlinkSync(outputFile);

                }

            } catch (err) {

                console.error(err);

            }

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message,
        });

    }

};

// My Files
const myFiles = async (req, res) => {

    try {

        const files = await File.find({
            owner: req.user.id,
        }).sort({ createdAt: -1 });

        res.json(files);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message,
        });

    }

};

// Download File
const downloadFile = async (req, res) => {

    try {

        const file = await File.findOne({
            _id: req.params.id,
            owner: req.user.id,
        });

        if (!file) {
            return res.status(404).json({
                message: "File not found",
            });
        }


        const filePath = path.resolve(file.encryptedName);

        await logActivity(

            req.user.id,

            "Downloaded File",

            file.originalName,

            req.ip

        );

        res.download(filePath,
            file.originalName + ".enc");

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message,
        });

    }

};

// Delete File
const deleteFile = async (req, res) => {

    try {

        const file = await File.findOne({
            _id: req.params.id,
            owner: req.user.id,
        });

        if (!file) {

            return res.status(404).json({
                message: "File not found",
            });

        }

        // Delete from Cloudinary first
        if (file.cloudinaryId) {

            await deleteFromCloudinary(file.cloudinaryId);

        }

        if (fs.existsSync(file.encryptedName)) {

            fs.unlinkSync(file.encryptedName);

        }

        if (fs.existsSync(file.keyFile)) {

            fs.unlinkSync(file.keyFile);

        }


        await logActivity(

            req.user.id,

            "Deleted File",

            file.originalName,

            req.ip

        );

        await File.findByIdAndDelete(file._id);

        res.json({
            message: "File deleted successfully",
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message,
        });

    }

};


const crypto = require("crypto");
const DecryptSession = require("../models/decryptSession");
const sendEmail = require("../utils/sendEmail");

// Send Decryption OTP
const sendDecryptOTP = async (req, res) => {

    try {

        const userId = req.user.id;

        const user = await user.findById(userId);

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        // Delete any previous session
        await DecryptSession.deleteMany({

            user: userId,

        });

        const otp = crypto.randomInt(100000, 999999).toString();

        await DecryptSession.create({

            user: userId,

            otp,

            otpExpires: new Date(

                Date.now() + 10 * 60 * 1000

            ),

        });

        await sendEmail(

            user.email,

            "SecureCrypt - Decryption OTP",

            `
            <h2>SecureCrypt</h2>

            <p>Your Decryption OTP is:</p>

            <h1 style="letter-spacing:5px;color:#1976d2;">
                ${otp}
            </h1>

            <p>This OTP expires in 10 minutes.</p>
            `

        );

        res.json({

            message: "Decryption OTP sent successfully."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: error.message,

        });

    }

};

// Verify Decryption OTP
const verifyDecryptOTP = async (req, res) => {

    try {

        const { otp } = req.body;

        const userId = req.user.id;

        const session = await DecryptSession.findOne({

            user: userId,

        });

        if (!session) {

            return res.status(404).json({

                message: "No decryption session found."

            });

        }

        if (session.otpExpires < new Date()) {

            await DecryptSession.deleteOne({

                _id: session._id

            });

            return res.status(400).json({

                message: "OTP has expired."

            });

        }

        if (session.otp !== otp) {

            return res.status(400).json({

                message: "Invalid OTP."

            });

        }

        session.verified = true;

        session.sessionExpires = new Date(

            Date.now() + 10 * 60 * 1000

        );

        await session.save();

        res.json({

            message: "OTP verified successfully."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: error.message,

        });

    }

};


module.exports = {
    uploadFile,
    decryptUploadedFile,
    myFiles,
    downloadFile,
    deleteFile,
    sendDecryptOTP,
    verifyDecryptOTP,
};