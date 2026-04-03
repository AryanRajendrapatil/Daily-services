const serviceRoute=require("express").Router();

serviceRoute.get("/",(req,res)=>{
    res.send("Service route");
});


module.exports=serviceRoute;