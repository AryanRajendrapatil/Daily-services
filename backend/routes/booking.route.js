const bookingRoute=require("express").Router();
const {createBooking,updateBooking,userCancelBooking,workerCancelBooking,getUserBookings,getWorkerBookings}=require("../controllers/booking.controller");

bookingRoute.post("/create",createBooking);
bookingRoute.put("/update/:id",updateBooking);
bookingRoute.put("/user-cancel/:id",userCancelBooking);
bookingRoute.delete("/worker-cancel/:id",workerCancelBooking);
bookingRoute.get("/user/:userId", getUserBookings);
bookingRoute.get("/worker/:workerId", getWorkerBookings);


module.exports=bookingRoute;