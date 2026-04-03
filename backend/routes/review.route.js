const reviewRoute=require("express").Router();

reviewRoute.get("/",(req,res)=>{
    res.send("Review route");
});


module.exports=reviewRoute;