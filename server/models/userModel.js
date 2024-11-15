const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // Optionally ensure emails are unique
            trim:true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "user",
        },
        status: {
            type: String,
            default: "active",
        },
        profilePicture: {
            type: String,
            default: "",
        },
    },
    { timestamps: true } // This should be in the options object
);

const User = mongoose.model("users", userSchema); // Changed model name to "User" for consistency
module.exports = User;
