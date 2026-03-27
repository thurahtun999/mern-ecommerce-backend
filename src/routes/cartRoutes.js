import express from "express";
import {
    addToCart,
    getCart,
    updateCart,
    removeFromCart
} from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/:productId", protect, updateCart);
router.delete("/:productId", protect, removeFromCart);


export default router;

