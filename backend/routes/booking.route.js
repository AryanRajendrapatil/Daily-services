const bookingRoute=require("express").Router();
const {createBooking,updateBooking,userCancelBooking,workerCancelBooking}=require("../controllers/booking.controller");

bookingRoute.post("/create",createBooking);
bookingRoute.put("/update",updateBooking);
bookingRoute.put("/user-cancel",userCancelBooking);
bookingRoute.put("/worker-cancel",workerCancelBooking);


module.exports=bookingRoute;