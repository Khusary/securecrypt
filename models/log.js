const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(

    {

        user:{

            type:mongoose.Schema.Types.ObjectId,

            ref:"User",

            required:true,

        },

        action:{

            type:String,

            required:true,

        },

        file:{

            type:String,

            default:"-",

        },

        ipAddress:{

            type:String,

            default:"Unknown",

        }

    },

    {

        timestamps:true,

    }

);

module.exports=mongoose.model("Log",logSchema);