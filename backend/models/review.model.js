const mongoose = require("mongoose");
const Worker = require("./worker.model");
const User = require("./user.model");
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
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    review:{
        type:String,
        required:true
    }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;