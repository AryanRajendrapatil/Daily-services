const jwt = require("jsonwebtoken");
const errorHandler = require("../middlewares/error.middleware.js");


const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  const loginToken=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1h"});
          res.status(200).json({loginToken,user});

  next();
};
const loginToken=async(req,res)=>{
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
        authMiddleware(req,res,next);
        
    }catch(error){
        errorHandler(error,req,res,next)
    }
}

module.exports={protect,loginToken};