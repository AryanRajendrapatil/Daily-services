const userRoute=require("express").Router();
const{createUser,loginUser,logoutUser,updateUser,deleteUser,getUser,changePassword,changeImage}=require("../controllers/user.controller");


userRoute.post("/create",createUser);
userRoute.post("/login",loginUser);
userRoute.post("/logout",logoutUser);
userRoute.put("/update",updateUser);
userRoute.delete("/delete",deleteUser);
userRoute.get("/get",getUser);
userRoute.put("/change-password",changePassword);
userRoute.put("/change-image",changeImage);

module.exports=userRoute;