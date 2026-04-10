const bookingRoute=require("express").Router();
const {createBooking,updateBooking,userCancelBooking,workerCancelBooking,getUserBookings,getWorkerBookings}=require("../controllers/booking.controller");

bookingRoute.post("/create",createBooking);
bookingRoute.put("/update",updateBooking);
bookingRoute.put("/user-cancel",userCancelBooking);
bookingRoute.put("/worker-cancel",workerCancelBooking);
bookingRoute.get("/user/:userId", getUserBookings);
bookingRoute.get("/worker/:workerId", getWorkerBookings);


module.exports=bookingRoute;