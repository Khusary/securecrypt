const Log = require("../models/log");

const logActivity = async (

    userId,

    action,

    fileName,

    ip

) => {

    try {

        await Log.create({

            user: userId,

            action,

            file: fileName || "-",

            ipAddress: ip || "Unknown",

        });

    }

    catch (error) {

        console.error("Log Error:", error.message);

    }

};

module.exports = logActivity;