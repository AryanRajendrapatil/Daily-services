const mongoose = require("mongoose");
const User = require("./user.model");
const Worker = require("./worker.model");


const bookingSchema=new mongoose.Schema({
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
        type:String,
        required:true
    },
    bookingDate:{
        type:Date,
        required:true
    },
    bookingTime:{
        type:String,
        required:true
    },
    bookingStatus:{
        type:String,
        enum:["pending","accepted","rejected","completed"],
        default:"pending"
    },
   paymentStatus:{
    type:String,
    enum:["pending","completed","cancled"],
    default:"pending"
   },
   location:{
    type:String,
    required:true
   }
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;