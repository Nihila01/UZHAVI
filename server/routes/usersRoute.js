const router = require('express').Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

// New user registration
router.post("/register", async (req, res) => {
    try {
        // Check if user already exists
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            throw new Error("User already exists");
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        // Save user
        const newUser = new User(req.body);
        await newUser.save();
        res.send({
            success: true,
            message: "User created successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

// User login
router.post("/login", async (req, res) => {
    try {
        // Check if user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            throw new Error("User not found");
        }

        //if user is active
        if (user.status !=="active"){
            throw new Error("the user account is blocked, please contact admin")
        }


        // Compare password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            throw new Error("Invalid password");
        }

        // Create and assign token
        const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, { expiresIn: "1d" });

        // Send response
        res.send({
            success: true,
            message: "User logged in successfully",
            data: token,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});


// Get current user
router.get("/get-current-user", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        res.send({
            success: true,
            message: "User fetched successfully",
            data: user,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});


// get all users
router.get("/get-users",authMiddleware, async(req,res)=>{
    try {
        const users=await User.find();
        res.send({
            success:true,
            message:"Users fetched successfully",
            data:users,
        });
    } catch (error) {
        res.send({
            success:false,
            message:error.message,
        });
    }
});

//update user status
router.put("/update-user-status/:id",authMiddleware,async(req,res)=>{
    try {
        await User.findByIdAndUpdate(req.params.id,req.body);
        res.send({
            success:true,
            message:"User status updated successfully",
        });
    } catch (error) {
        res.send({
            success:false,
            message:error.message,
        });
    }
});

module.exports = router;
