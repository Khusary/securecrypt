const express = require("express");
const multer = require("multer");
const path = require("path");

const mongoose = require("mongoose");
require("dotenv").config();


const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
const userRoutes = require("./routes/userRoutes");

const adminRoutes = require("./routes/adminRoutes");

const user = require("./models/user");

const File = require("./models/file");
const auth = require("./middlewares/auth");
const app = express();



const dashboardRoutes = require("./routes/dashboardRoutes");

connectDB();

// Middleware
app.use(express.json());

app.use(express.urlencoded({
    extended: true,
}));

// Static files
app.use(express.static("public"));

// Routes
app.use(dashboardRoutes);
app.use(adminRoutes);
app.use(authRoutes);
app.use(fileRoutes);
app.use(userRoutes);


const encryptFile = require("./utils/encrypt");
const encryptAESKey = require("./utils/rsaEncrypt");
const fs = require("fs");


//Decrypting the file
const decryptAESKey = require("./utils/rsaDecrypt");
const decryptFile = require("./utils/decrypt");



PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});