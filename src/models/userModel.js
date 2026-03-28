import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,

    },

    password: {
        type: String,
        required: [true, "Password is required"],
        unique: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    
},{timeStamps: true});

export default mongoose.model("User", userSchema);