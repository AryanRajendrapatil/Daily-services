const dotenv=require("dotenv");
const Review=require("../models/review.model.js");
const Worker=require("../models/worker.model.js");
const User=require("../models/User.model.js");
const errorHandler=require("../middlewares/error.middleware.js");

dotenv.config();
 
const reviewWorker=async(req,res)=>{
    try {
        const { workerId, rating, review } = req.body;
        
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const worker=await Worker.findById(workerId);
        if(!worker){
            return res.status(400).json({message:"Worker not found"});
        }
        const newreview=new Review({
            workerId,
            userId:user._id,
            rating,
            review,
            
        });
        await newreview.save();
        res.status(201).json({
            message:"Review created successfully",
            review:newreview
        });
    }catch(error){
        errorHandler(error,req,res)
    }
    
}
module.exports={reviewWorker}

