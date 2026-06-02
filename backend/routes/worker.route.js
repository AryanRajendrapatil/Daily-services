const workerRoute=require("express").Router();
const {createWorker,loginWorker,logoutWorker,updateWorker,deleteWorker,changePassword,getAllWorkers,getWorkersByCategory,getWorkerById}=require("../controllers/worker.controller");


const { upload } = require("../middlewares/upload.middleware");

const workerUpload = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "adhar_card_front", maxCount: 1 },
    { name: "adhar_card_back", maxCount: 1 },
    { name: "photo", maxCount: 1 }
]);

workerRoute.post("/create", workerUpload, createWorker);
workerRoute.post("/login", loginWorker);
workerRoute.post("/logout", logoutWorker);
workerRoute.put("/update", workerUpload, updateWorker);
workerRoute.delete("/delete",deleteWorker);

workerRoute.put("/change-password",changePassword);
workerRoute.get("/", getAllWorkers);
workerRoute.get("/category/:category", getWorkersByCategory);
workerRoute.get("/:id", getWorkerById);

module.exports = workerRoute;
