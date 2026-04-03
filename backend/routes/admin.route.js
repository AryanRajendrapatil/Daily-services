const adminRoute=require("express").Router();
const {createAdmin, loginAdmin, logoutAdmin, updateAdmin, deleteAdmin, getAdmin} = require("../controllers/admin.controller");

adminRoute.post("/create",createAdmin);
adminRoute.post("/login",loginAdmin);
adminRoute.post("/logout",logoutAdmin);
adminRoute.put("/update",updateAdmin);
adminRoute.delete("/delete",deleteAdmin);
adminRoute.get("/get",getAdmin);


module.exports=adminRoute;



