import mongoose from "mongoose";
const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        stock: {
            type: Number,
            default: 0
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            //required: true,//
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            //required: true,//
            ref: "User",
        },
        image: {
            type: String,
        },
        public_id: {
            type: String,
        },
    },
    {
        timestamp: true,
    }
);
const Product = mongoose.model("Product", productSchema);

export default Product;