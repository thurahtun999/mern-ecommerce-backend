import express from "express";
import Stripe from "stripe";
import { protect} from "../middlewares/authMiddleware.js";
import {createCheckoutSession} from "../controllers/stripeController.js";


const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", protect, createCheckoutSession);

router.post("/create-payment-intent",
    async(req, res) => {
        try{
             const {amount, orderId } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: "usd",
            metadata: {
                orderId: orderId,
            },
    });
    res.json({
        clientSecret: paymentIntent.client_secret,
    });
            
        } catch (error){
            console.log(error);
            res.status(500).json({ error: "Payment failed"});
        }
       
    });

export default router;