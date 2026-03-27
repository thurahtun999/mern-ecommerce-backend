import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import {protect} from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/profile", protect, (req, res) => {
    res.json(req.user);
});

router.get("/admin-test",protect,adminMiddleware,
    (_req, res) => {
        res.json({ message: "Welcome Admin"});
    }
);


router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;