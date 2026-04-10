const workerRoute=require("express").Router();
const {createWorker,loginWorker,logoutWorker,updateWorker,deleteWorker,changePassword,getAllWorkers,getWorkersByCategory,getWorkerById}=require("../controllers/worker.controller");


workerRoute.post("/create",createWorker);
workerRoute.post("/login",loginWorker);
workerRoute.post("/logout",logoutWorker);
workerRoute.put("/update",updateWorker);
workerRoute.delete("/delete",deleteWorker);

workerRoute.put("/change-password",changePassword);
workerRoute.get("/", getAllWorkers);
workerRoute.get("/:category", getWorkersByCategory);
workerRoute.get("/:id", getWorkerById);

module.exports = workerRoute;
