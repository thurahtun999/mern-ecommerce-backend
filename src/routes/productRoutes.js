import express from "express";
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";

import {protect} from "../middlewares/authMiddleware.js";
import {admin} from "../middlewares/adminMiddleware.js";
import upload from "../middlewares/upload.js";
const router = express.Router();


router.route("/")
    .get(getProducts)
    .post(protect, admin, upload.single("image"), createProduct);

router.route("/:id")
    .get(getProductById)
    .put(protect, admin, upload.single("image"), updateProduct)
    .delete(protect, admin, deleteProduct);

export default router;


