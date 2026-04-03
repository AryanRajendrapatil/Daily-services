const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const authMiddleware = require("../middlewares/auth.middleware");

const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const isPasswordValid=await bcryptjs.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid password"});
        }
        loginToken(req,res,next);
        
    }catch(error){
        errorHandler(error,req,res,next)
    }
}
const loginWorker=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const worker=await Worker.findOne({email});
        if(!worker){
            return res.status(400).json({message:"Worker not found"});
        }
        const isPasswordValid=await bcryptjs.compare(password,worker.password);
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid password"});
        }
        authMiddleware(req,res,next);
        
    }catch(error){
        errorHandler(error,req,res,next)
    }
}

module.exports={loginUser,loginWorker}




