const authRoute=require("express").Router();

authRoute.get("/",(req,res)=>{
    res.send("Auth route");
});





