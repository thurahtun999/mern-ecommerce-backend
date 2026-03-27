import Stripe from "stripe";
import Order from "../models/orderModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async(req, res) => {
    
    try{

        const { orderId } = req.body;

        const order = await Order.findById(orderId);

        if(!order) { 
            return res.status(404).json({message: "Order not found"});
        }

        const session = await
        stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                { 
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Order Payment",
                        },
                        unit_amount: order.totalPrice * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
             success_url: "http://localhost:5173/order-success",
             cancel_url: "http://localhost:5173/cart",

            metadata: {
                orderId: order._id.toString()
            }
        });
        res.json ({ url: session.url });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}; 