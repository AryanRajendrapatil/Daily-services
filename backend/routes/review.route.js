const reviewRoute=require("express").Router();
const { protect } = require("../middlewares/auth.middleware.js");
const {reviewWorker}=require("../controllers/revier.controller.js")


reviewRoute.post("/review-worker", protect, reviewWorker)


module.exports=reviewRoute;