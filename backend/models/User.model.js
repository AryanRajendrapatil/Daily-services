const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    address:{
       latitude:{
        type:Number,
        required:true
       },
       longitude:{
        type:Number,
        required:true
       }
    },
    role:{
        type:String,
        enum:["client","admin","provider"],
        default:"client"
    }
});

const User = mongoose.model("User", userSchema);

