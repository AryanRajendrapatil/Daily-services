const mongoose = require("mongoose");
const Worker = require("./worker.model");
const User = require("./User.model");
const Service = require("./worker.model");

const reviewSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    workerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Worker",
        required:true
    },
    serviceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Service",
        
    },
    rating:{
        type:Number,
       
    },
    review:{
        type:String,
        
    }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;