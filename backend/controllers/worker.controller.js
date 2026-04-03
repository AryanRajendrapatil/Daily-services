const Worker = require("../models/worker.model");
const errorHandler = require("../middlewares/error.middleware.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const upload = require("../middlewares/upload.middleware.js");
const uploadToCloudinary = require("../middlewares/upload.middleware.js");
const {loginToken}=require("../middlewares/auth.middleware");
const dotenv=require("dotenv");

dotenv.config();

const createWorker=async(req,res)=>{
    try{
        const {name,email,password,serviceType,document,experience}=req.body;
        const file=req.file;
        const result=await uploadToCloudinary(file.path);
        const adhar_card_front=await uploadToCloudinary(document.adhar_card_front).secure_url;
        const adhar_card_back=await uploadToCloudinary(document.adhar_card_back).secure_url;
        const photo=await uploadToCloudinary(document.photo).secure_url;
       
        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const worker=await Worker.findOne({email});
        if(worker){
            return res.status(400).json({message:"Worker already exists"});
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters long"});
        } 
        if(!document.adhar_card_front || !document.adhar_card_back || !document.photo){
            return res.status(400).json({message:"All documents are required"});
        }
        if(!experience){
            return res.status(400).json({message:"Experience is required"});
        }
        if(!serviceType){
            return res.status(400).json({message:"Service type is required"});
        }
        if(!address){
            return res.status(400).json({message:"Address is required"});
        }
        if(!file){
            return res.status(400).json({message:"Image is required"});
        }
        const salt=await bcryptjs.genSalt(10);
        const hashedPassword=await bcryptjs.hash(password,salt);
        const newWorker=new Worker({
            name,
            email,
            password:hashedPassword,
            image:result.secure_url,
            serviceType,
            document:{
                adhar_card_front:adhar_card_front,
                adhar_card_back:adhar_card_back,
                photo:photo
            },
            experience,
            address
        });
        await newWorker.save();
        res.status(201).json({
            message:"Worker created successfully",
            worker:newWorker
            
        });
    }catch(error){
        errorHandler(error,req,res,next)
    }
}

const loginWorker=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const worker=await Worker.findOne({email});
        if(!worker){
            return res.status(400).json({message:"Worker not found"});
        }
        const isPasswordValid=await bcryptjs.compare(password,worker.password);
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid password"});
        }
        const token=jwt.sign({id:worker._id},process.env.JWT_SECRET,{expiresIn:"1h"});
        loginToken(req,res,next);
        res.cookie("token",token,{httpOnly:true,secure:true,sameSite:"strict",maxAge:3600000});
        res.status(200).json({
            message:"Worker logged in successfully",
            worker:worker,
            token:token
        });
    }catch(error){
        errorHandler(error,req,res,next)
    }
}

const logoutWorker=async(req,res)=>{
    try{
        res.clearCookie("token");
        res.status(200).json({message:"Worker logged out successfully"});
    }catch(error){
        errorHandler(error,req,res,next)
    }
}

const updateWorker=async(req,res)=>{
    try{
        const {name,email,password,serviceType,document,experience,address}=req.body;
        const file=req.file;
        const result=await uploadToCloudinary(file.path);
        const adhar_card_front=await uploadToCloudinary(document.adhar_card_front).secure_url;
        const adhar_card_back=await uploadToCloudinary(document.adhar_card_back).secure_url;
        const photo=await uploadToCloudinary(document.photo).secure_url;
       
        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const worker=await Worker.findOne({email});
        if(!worker){
            return res.status(400).json({message:"Worker not found"});
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters long"});
        } 
        if(!document.adhar_card_front || !document.adhar_card_back || !document.photo){
            return res.status(400).json({message:"All documents are required"});
        }
        if(!experience){
            return res.status(400).json({message:"Experience is required"});
        }
        if(!serviceType){
            return res.status(400).json({message:"Service type is required"});
        }
        if(!address){
            return res.status(400).json({message:"Address is required"});
        }
        if(!file){
            return res.status(400).json({message:"Image is required"});
        }
        const salt=await bcryptjs.genSalt(10);
        const hashedPassword=await bcryptjs.hash(password,salt);
        const updatedWorker=await Worker.findByIdAndUpdate(worker._id,{
            name,
            email,
            password:hashedPassword,
            image:result.secure_url,
            serviceType,
            document:{
                adhar_card_front:adhar_card_front,
                adhar_card_back:adhar_card_back,
                photo:photo
            },
            experience,
            address
        },{
            new:true
        });
        res.status(200).json({
            message:"Worker updated successfully",
            worker:updatedWorker
        });
    }catch(error){
        errorHandler(error,req,res,next)
    }
}

const deleteWorker=async(req,res)=>{
    try{
        const {email}=req.body;
        if(!email){
            return res.status(400).json({message:"Email is required"});
        }
        const worker=await Worker.findOne({email});
        if(!worker){
            return res.status(400).json({message:"Worker not found"});
        }
        await Worker.findByIdAndDelete(worker._id);
        res.status(200).json({message:"Worker deleted successfully"});
    }catch(error){
        errorHandler(error,req,res,next)
    }
}

const getWorker=async(req,res)=>{
    try{
        const {email}=req.body;
        if(!email){
            return res.status(400).json({message:"Email is required"});
        }
        const worker=await Worker.findOne({email});
        if(!worker){
            return res.status(400).json({message:"Worker not found"});
        }
        res.status(200).json({
            message:"Worker found successfully",
            worker:worker
        });
    }catch(error){
        errorHandler(error,req,res,next)
    }
}
const changePassword=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const worker=await Worker.findOne({email});
        if(!worker){
            return res.status(400).json({message:"Worker not found"});
        }
        const isPasswordValid=await bcryptjs.compare(password,worker.password);
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid password"});
        }
        const salt=await bcryptjs.genSalt(10);
        const hashedPassword=await bcryptjs.hash(password,salt);
        const updatedWorker=await Worker.findByIdAndUpdate(worker._id,{password:hashedPassword},{new:true});
        res.status(200).json({
            message:"Password changed successfully",
            worker:updatedWorker
        });
    }catch(error){
        errorHandler(error,req,res,next)
    }
}

module.exports={
    createWorker,
    loginWorker,
    logoutWorker,
    updateWorker,
    deleteWorker,
    getWorker,
    changePassword
}
