const User=require("../models/user.model");
const Worker=require("../models/worker.model");
const Booking=require("../models/booking.model");

const createBooking=async(req,res)=>{
    try{
        const {userId,workerId,serviceId,bookingDate,bookingTime}=req.body;
        if(!userId || !workerId || !serviceId || !bookingDate || !bookingTime){
            return res.status(400).json({message:"All fields are required"});
        }
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const worker=await Worker.findById(workerId);
        if(!worker){
            return res.status(400).json({message:"Worker not found"});
        }
        if(worker.isAvailable===false){
            return res.status(400).json({message:"Worker is not available"});
        }

        const booking=new Booking({
            userId,
            workerId,
            serviceId,
            bookingDate,
            bookingTime,
            location:user.location,
            bookingStatus:"pending",
            paymentStatus:"pending"
        });
        await booking.save();
        res.status(201).json({
            message:"Booking created successfully",
            booking:booking
        });
    }catch(error){
        errorHandler(error,req,res,next)
    }

}

const updateBooking=async(req,res)=>{
    try{
        const {bookingId,bookingStatus,paymentStatus}=req.body;
        if(!bookingId || !bookingStatus ){
            return res.status(400).json({message:"All fields are required"});
        }
        const booking=await Booking.findById(bookingId);
        if(!booking){
            return res.status(400).json({message:"Booking not found"});
        }
        if(booking.workerId.toString()!==req.user.id.toString() || booking.userId.toString()!==req.user.id.toString()){
            return res.status(400).json({message:"You are not authorized to update this booking"});
        }
        const updatedBooking=await Booking.findByIdAndUpdate(bookingId,{
            bookingStatus
        },{new:true});
        res.status(200).json({
            message:"Booking updated successfully",
            booking:updatedBooking
        });
    }catch(error){
        errorHandler(error,req,res,next)
    }
}

const userCancelBooking=async(req,res)=>{
    try{
        const {bookingId}=req.body;
        if(!bookingId){
            return res.status(400).json({message:"Booking ID is required"});
        }
        const booking=await Booking.findById(bookingId);
        if(!booking){
            return res.status(400).json({message:"Booking not found"});
        }
        if(booking.userId.toString()!==req.user.id.toString() || booking.workerId.toString()!==req.user.id.toString()){
            return res.status(400).json({message:"You are not authorized to cancel this booking"});
        }
        if(booking.bookingStatus==="completed"){
            return res.status(400).json({message:"Booking cannot be cancelled as it is completed"});
        }

        await Booking.findByIdAndUpdate(bookingId,{
            bookingStatus:"cancelled"
        },{new:true});
        res.status(200).json({message:"Booking cancelled successfully"});
    }catch(error){
        errorHandler(error,req,res,next)
    }
}

    const workerCancelBooking=async(req,res)=>{
        try{
            const {bookingId}=req.body;
            if(!bookingId){
                return res.status(400).json({message:"Booking ID is required"});
            }
            const booking=await Booking.findById(bookingId);
            if(!booking){
                return res.status(400).json({message:"Booking not found"});
            }
            if(booking.workerId.toString()!==req.user.id.toString()){
                return res.status(400).json({message:"You are not authorized to cancel this booking"});
            }
            if(booking.bookingStatus==="completed"){
                return res.status(400).json({message:"Booking cannot be cancelled as it is completed"});
            }
            const updatedBooking=await Booking.findByIdAndUpdate(bookingId,{
                bookingStatus:"cancelled"
            },{new:true});
            res.status(200).json({
                message:"Booking cancelled successfully",
                booking:updatedBooking

            });
        }catch(error){
            errorHandler(error,req,res,next)
        }
    }

    const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId });
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWorkerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ workerId: req.params.workerId });
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking, updateBooking, userCancelBooking,
  workerCancelBooking, getUserBookings, getWorkerBookings
};


module.exports={createBooking,updateBooking,userCancelBooking,workerCancelBooking,getUserBookings,getWorkerBookings}