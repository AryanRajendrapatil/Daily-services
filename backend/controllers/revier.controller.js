const dotenv=require("dotenv");

dotenv.config();
 
const reviewWorker=async(req,res)=>{
    try{
        const {workerId,rating,comment}=req.body;
        const worker=await Worker.findById(workerId);
        if(!worker){
            return res.status(400).json({message:"Worker not found"});
        }
        const review=new Review({
            workerId,
            rating,
            comment
        });
        await review.save();
        res.status(201).json({
            message:"Review created successfully",
            review:review
        });
    }catch(error){
        errorHandler(error,req,res,next)
    }
    
}
module.exports={reviewWorker}

