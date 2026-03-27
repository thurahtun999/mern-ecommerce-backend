import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type:
            mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }, 
        orderItems: [],
        shippingInfo:{
            name: { type: String, required: true},
            email: { type: String, required: true},
            address: { type: String, required: true},
            city: { type: String, required: true},
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        isDelivered: Boolean,

        isPaid: {
            type: Boolean,
            dfault: false,
        },
        paidAt: {
            type: Date,
        },
        
        deliveredAt: Date,
        
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "shipped", "delievered"],
            default: "pending",
        },
        stripePaymentId: {
            type: String,
            default: "",
        }
    },
        {timestamp: true}

);
const Order = mongoose.model("Order", orderSchema);

export default Order;
            
        
    
