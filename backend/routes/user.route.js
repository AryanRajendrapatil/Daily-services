const userRoute=require("express").Router();
const{createUser,loginUser,logoutUser,updateUser,deleteUser,getUser,changePassword,changeImage}=require("../controllers/user.controller");
const { upload } = require("../middlewares/upload.middleware");

userRoute.post("/create",upload.single("image"),createUser);
userRoute.post("/login",loginUser);
userRoute.post("/logout",logoutUser);
userRoute.put("/update",upload.single("image"),updateUser);
userRoute.delete("/delete",deleteUser);
userRoute.get("/get",getUser);
userRoute.put("/change-password",changePassword);
userRoute.put("/change-image",changeImage);

module.exports=userRoute;