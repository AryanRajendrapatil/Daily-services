const express = require("express");
const dotenv = require("dotenv");

dotenv.config();


const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

//routes
const userRoute=require("./routes/user.route.js");
const workerRoute=require("./routes/worker.route.js");
const adminRoute=require("./routes/admin.route.js");
const bookingRoute=require("./routes/booking.route.js");


app.use("/user",userRoute);
app.use("/worker",workerRoute);
app.use("/admin",adminRoute);
app.use("/booking",bookingRoute);


app.listen(3000, () => {
    console.log("Server started on port: http://localhost:3000");
});
