const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
    origin: "http://localhost:5173", // Default Vite port
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Daily Services API is running...");
});

//routes
const userRoute = require("./routes/user.route.js");
const workerRoute = require("./routes/worker.route.js");
const adminRoute = require("./routes/admin.route.js");
const bookingRoute = require("./routes/booking.route.js");

app.use("/api/user", userRoute);
app.use("/api/worker", workerRoute);
app.use("/api/admin", adminRoute);
app.use("/api/booking", bookingRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port: http://localhost:${PORT}`);
});
