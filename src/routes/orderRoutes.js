import express from "express";
import { 
    createOrder,
    getOrderStats,
    getMyOrders,
    getOrderById, 
    getAllOrders,
    getOrders,
    updateOrderStatus,
    markAsDelivered,
    deleteOrder,
     } from "../controllers/orderController.js";
import {protect} from "../middlewares/authMiddleware.js";
import {admin} from "../middlewares/adminMiddleware.js";

const router = express.Router();

//Post/api/orders
router.post("/", protect, createOrder);
router.get("/",protect, admin, getAllOrders);
router.get("/myorders", protect, getMyOrders);
router.get("/search",protect, getOrders);
router.get("/stats",protect, admin, getOrderStats);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, admin, updateOrderStatus);
router.put("/:id/deliver", protect, admin, markAsDelivered);
router.delete("/:id", protect, admin, deleteOrder);

export default router;