const mongoose = require("mongoose");
require("dotenv").config();

const bcrypt = require("bcryptjs");

const Admin = require("./models/admin");

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try{
        const extingAdmin = await Admin.findOne({
            email: "admin@gmail.com"
        });

        if(extingAdmin){
            console.log("Admin already exist!");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash("12345678", 10);

        const admin = new Admin({
            name: "Administrator",
            email:"admin@gmail.com",
            password: hashedPassword
        });

        await admin.save();
        console.log("Admin created successfully");
        process.exit();
    } catch(err) {
    console.log(err);
    process.exit();

  }
}) .catch(err => console.log(err));