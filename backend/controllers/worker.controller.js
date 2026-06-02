const Worker = require("../models/worker.model");
const errorHandler = require("../middlewares/error.middleware.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { upload, uploadToCloudinary } = require("../middlewares/upload.middleware.js");
const { loginToken } = require("../middlewares/auth.middleware");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

const createWorker = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }

        const { name, email, password, phone, serviceType, experience, address } = req.body;
        const files = req.files;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All basic fields are required (name, email, password)" });
        }

        const workerExists = await Worker.findOne({ email });
        if (workerExists) {
            return res.status(400).json({ message: "Worker already exists" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const finalPhone = phone || "0000000000";
        const finalServiceType = serviceType || "other";
        const finalExperience = Number(experience) || 1;

        // Upload files to Cloudinary if they exist
        let profileImageUrl = "https://res.cloudinary.com/demo/image/upload/d_avatar.png/avatar.png";
        if (files && files.image) {
            const profileImageResult = await uploadToCloudinary(files.image[0].path);
            profileImageUrl = profileImageResult.secure_url;
            fs.unlinkSync(files.image[0].path);
        }

        const adhar_card_front = (files && files.adhar_card_front) ? (await uploadToCloudinary(files.adhar_card_front[0].path)).secure_url : "";
        const adhar_card_back = (files && files.adhar_card_back) ? (await uploadToCloudinary(files.adhar_card_back[0].path)).secure_url : "";
        const photo = (files && files.photo) ? (await uploadToCloudinary(files.photo[0].path)).secure_url : "";

        if (files && files.adhar_card_front) fs.unlinkSync(files.adhar_card_front[0].path);
        if (files && files.adhar_card_back) fs.unlinkSync(files.adhar_card_back[0].path);
        if (files && files.photo) fs.unlinkSync(files.photo[0].path);

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newWorker = new Worker({
            name,
            email,
            password: hashedPassword,
            phone: finalPhone,
            image: profileImageUrl,
            serviceType: finalServiceType,
            document: {
                adhar_card_front,
                adhar_card_back,
                photo
            },
            experience: finalExperience,
            address: address || {}
        });

        await newWorker.save();
        res.status(201).json({
            message: "Worker created successfully",
            worker: newWorker
        });
    } catch (error) {
        errorHandler(error, req, res);
    }
}

const loginWorker = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const worker = await Worker.findOne({ email });
        if (!worker) {
            return res.status(400).json({ message: "Worker not found" });
        }
        const isPasswordValid = await bcryptjs.compare(password, worker.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ id: worker._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 3600000 });
        res.status(200).json({
            message: "Worker logged in successfully",
            worker: worker,
            token: token
        });
    } catch (error) {
        errorHandler(error, req, res);
    }
}

const logoutWorker = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Worker logged out successfully" });
    } catch (error) {
        errorHandler(error, req, res);
    }
}

const updateWorker = async (req, res) => {
    try {
        const { name, email, password, serviceType, experience, address } = req.body;
        const files = req.files;

        const worker = await Worker.findOne({ email });
        if (!worker) {
            return res.status(400).json({ message: "Worker not found" });
        }

        let updateData = { ...req.body };

        if (files && files.image) {
            const result = await uploadToCloudinary(files.image[0].path);
            updateData.image = result.secure_url;
        }

        if (files && (files.adhar_card_front || files.adhar_card_back || files.photo)) {
             // In a real app, you might want to merge these with existing document data
             updateData.document = { ...worker.document };
             if (files.adhar_card_front) {
                updateData.document.adhar_card_front = (await uploadToCloudinary(files.adhar_card_front[0].path)).secure_url;
             }
             if (files.adhar_card_back) {
                updateData.document.adhar_card_back = (await uploadToCloudinary(files.adhar_card_back[0].path)).secure_url;
             }
             if (files.photo) {
                updateData.document.photo = (await uploadToCloudinary(files.photo[0].path)).secure_url;
             }
        }

        if (password) {
            const salt = await bcryptjs.genSalt(10);
            updateData.password = await bcryptjs.hash(password, salt);
        }

        const updatedWorker = await Worker.findByIdAndUpdate(worker._id, updateData, { new: true });
        res.status(200).json({
            message: "Worker updated successfully",
            worker: updatedWorker
        });
        fs.unlinkSync(files.image[0].path);
        fs.unlinkSync(files.adhar_card_front[0].path);
        fs.unlinkSync(files.adhar_card_back[0].path);
        fs.unlinkSync(files.photo[0].path);
    } catch (error) {
        errorHandler(error, req, res);
    }
}

const deleteWorker = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const worker = await Worker.findOne({ email });
        if (!worker) {
            return res.status(400).json({ message: "Worker not found" });
        }
        await Worker.findByIdAndDelete(worker._id);
        res.status(200).json({ message: "Worker deleted successfully" });
    } catch (error) {
        errorHandler(error, req, res);
    }
}

const changePassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const worker = await Worker.findOne({ email });
        if (!worker) {
            return res.status(400).json({ message: "Worker not found" });
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const updatedWorker = await Worker.findByIdAndUpdate(worker._id, { password: hashedPassword }, { new: true });
        res.status(200).json({
            message: "Password changed successfully",
            worker: updatedWorker
        });
    } catch (error) {
        errorHandler(error, req, res);
    }
}

const getAllWorkers = async (req, res) => {
    try {
        const workers = await Worker.find().select("-password");
        res.status(200).json({ workers });
    } catch (error) {
        errorHandler(error, req, res);
    }
};

const getWorkersByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const workers = await Worker.find({ serviceType: category }).select("-password");
        res.status(200).json({ workers });
    } catch (error) {
        errorHandler(error, req, res);
    }
};

const getWorkerById = async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id).select("-password");
        if (!worker) return res.status(404).json({ message: "Worker not found" });
        res.status(200).json({ worker });
    } catch (error) {
        errorHandler(error, req, res);
    }
};





module.exports={
    createWorker,
    loginWorker,
    logoutWorker,
    updateWorker,
    deleteWorker,
    changePassword,
    getAllWorkers,
    getWorkersByCategory,
    getWorkerById
}
