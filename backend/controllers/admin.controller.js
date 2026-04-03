const userModel = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const errorHandler = require("../middlewares/error.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const { loginToken } = require("../middlewares/auth.middleware");
const dotenv = require("dotenv");
const role=require("../middlewares/role.middleware")

dotenv.config();

const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const admin = await userModel.findOne({ email });
        if (admin) {
            return res.status(400).json({ message: "Admin already exists" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const newAdmin = new userModel({
            name,
            email,
            password: hashedPassword,
            role: "admin"
        });
        await newAdmin.save();
        res.status(201).json({
            message: "Admin created successfully",
            admin: newAdmin
        });
    } catch (error) {
        errorHandler(error, req, res, next)
    }
}

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const admin = await userModel.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Admin not found" });
        }
        const isPasswordValid = await bcryptjs.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        loginToken(req, res, next);
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 3600000 });
        res.status(200).json({
            message: "Admin logged in successfully",
            admin: admin,
            token: token
        });
    } catch (error) {
        errorHandler(error, req, res, next)
    }
}

const logoutAdmin = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Admin logged out successfully" });
    } catch (error) {
        errorHandler(error, req, res, next)
    }
}

const updateAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const admin = await userModel.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Admin not found" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const updatedAdmin = await userModel.findByIdAndUpdate(admin._id, {
            name,
            email,
            password: hashedPassword
        }, { new: true });
        res.status(200).json({
            message: "Admin updated successfully",
            admin: updatedAdmin
        });
    } catch (error) {
        errorHandler(error, req, res, next)
    }
}

const deleteAdmin = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const admin = await userModel.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Admin not found" });
        }
        await userModel.findByIdAndDelete(admin._id);
        res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        errorHandler(error, req, res, next)
    }
}

const getAdmin = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const admin = await userModel.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Admin not found" });
        }
        res.status(200).json({
            message: "Admin found successfully",
            admin: admin
        });
    } catch (error) {
        errorHandler(error, req, res, next)
    }
}

module.exports = {
    createAdmin,
    loginAdmin,
    logoutAdmin,
    updateAdmin,
    deleteAdmin,
    getAdmin    

}
