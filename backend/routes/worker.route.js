const workerRoute=require("express").Router();
const {createWorker,loginWorker,logoutWorker,updateWorker,deleteWorker,getWorker,changePassword}=require("../controllers/worker.controller");


workerRoute.post("/create",createWorker);
workerRoute.post("/login",loginWorker);
workerRoute.post("/logout",logoutWorker);
workerRoute.put("/update",updateWorker);
workerRoute.delete("/delete",deleteWorker);
workerRoute.get("/get",getWorker);
workerRoute.put("/change-password",changePassword);

module.exports = workerRoute;
