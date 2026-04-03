const User = require("../models/user.model");
const errorHandler = require("../middlewares/error.middleware.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const upload = require("../middlewares/upload.middleware.js");
const uploadToCloudinary = require("../middlewares/upload.middleware.js");
const dotenv=require("dotenv");

dotenv.config();



const createUser=async(req,res)=>{
    try{
        const {name,email,password }=req.body;
        const file=req.file;
        const result=await uploadToCloudinary(file.path);
       
        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters long"});
        } 
        if(!file){
            return res.status(400).json({message:"Image is required"});
        }
        const salt=await bcryptjs.genSalt(10);
        const hashedPassword=await bcryptjs.hash(password,salt);
        const newUser=new User({
            name,
            email,
            password:hashedPassword,
            image:result.secure_url
        });
        await newUser.save();
        res.status(201).json({
            message:"User created successfully",
            user:newUser
            
        });
    }catch(error){
        errorHandler(error,req,res,next)
    }
}

const updateUser=async(req,res)=>{
    try {
        

        const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.status(200).json(user);

    } catch (error) {
        errorHandler(error,req,res,next)
    }
}

const deleteUser=async(req,res)=>{
    try {
        const user=await User.findByIdAndDelete(req.params.id);
        res.status(200).json(user);
    } catch (error) {
       errorHandler(error,req,res,next)
    }

}




const getUser=async(req,res)=>{
    try {
        const user=await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
       errorHandler(error,req,res,next)
    }
}

const logoutUser=async(req,res)=>{
    try{
        res.clearCookie("token");
        res.status(200).json({message:"User logged out successfully"});
    }catch(error){
        errorHandler(error,req,res,next)
    }
}
const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const isPasswordValid=await bcryptjs.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid password"});
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1h"});
        res.cookie("token",token,{httpOnly:true,secure:true,sameSite:"strict",maxAge:3600000});
        res.status(200).json({
            message:"User logged in successfully",
            user:user,
            token:token
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
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const isPasswordValid=await bcryptjs.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid password"});
        }
        const salt=await bcryptjs.genSalt(10);
        const hashedPassword=await bcryptjs.hash(password,salt);
        const updatedUser=await User.findByIdAndUpdate(user._id,{password:hashedPassword},{new:true});
        res.status(200).json({
            message:"Password changed successfully",
            user:updatedUser
        });
    }catch(error){
        errorHandler(error,req,res,next)
    }
}
const changeImage=async(req,res)=>{
    try{
        const {email}=req.body;
        if(!email){
            return res.status(400).json({message:"Email is required"});
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const file=req.file;
        if(!file){
            return res.status(400).json({message:"Image is required"});
        }
        const result=await uploadToCloudinary(file.path);
        const updatedUser=await User.findByIdAndUpdate(user._id,{image:result.secure_url},{new:true});
        res.status(200).json({
            message:"Image changed successfully",
            user:updatedUser
        });
    }catch(error){
        errorHandler(error,req,res,next)
    }
}

module.exports={createUser,updateUser,deleteUser,getUser,logoutUser,loginUser,changePassword,changeImage}
