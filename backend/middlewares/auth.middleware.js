const jwt = require("jsonwebtoken");
const errorHandler = require("../middlewares/error.middleware.js");


const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided, authorization denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains the 'id' of the user
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
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