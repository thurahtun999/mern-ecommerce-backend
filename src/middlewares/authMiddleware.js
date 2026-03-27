import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/userModel.js";

export const protect = asyncHandler(async (req, res, next) => {
   
    if (req.headers.authorization && 
       req.headers.authorization.startsWith("Bearer")
    ) {
       try {
         const token = req.headers.authorization.split(" ")[1];
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded", decoded);

        const user = await
        User.findById(decoded.id);

        if(!user){
            return res.status(403).json({message: "User not found"});
        }
        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({message: "Not authorized, token failed"});
    } 
} else {
        res.status(401).json({ message: "Not authorized"});
    }
});
