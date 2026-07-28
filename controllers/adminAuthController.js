
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminLogin = async (req, res) => {

    try {

        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });

        if (!admin) {

            return res.status(404).json({

                message: "Admin not found",

            });

        }

        const isMatch = await bcrypt.compare(

            password,

            admin.password

        );

        if (!isMatch) {

            return res.status(401).json({

                message: "Invalid Credentials",

            });

        }

        const token = jwt.sign(

            {

                id: admin._id,

                role: admin.role,

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "1d",

            }

        );

        res.json({

            message: "Admin Login Successful",

            token,

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

    adminLogin,

};