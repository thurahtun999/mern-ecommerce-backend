import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bcrypt from "bcryptjs";
import cors from  "cors";
import mongoose from "mongoose";


import connectDB from "./src/config/db.js";
import productRoutes from "./src/routes/productRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import stripeRoutes from "./src/routes/stripeRoutes.js";
import {handleWebhook} from "./src/controllers/webhookController.js";
import Order from "./src/models/orderModel.js";
import User from "./src/models/userModel.js";
import { notfound, errorHandler } from "./src/middlewares/errorMiddleware.js";


connectDB();
const app = express();

app.post("/api/stripe/webhook", express.raw ({ type: "*/*"}),
        handleWebhook);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use("uploads", express.static("uploads"))

app.use("/api/stripe",stripeRoutes);
app.use ("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);


app.post("/api/register", async(req, res) => {

    const {name, email, password} = req.body;

    const existingUser = await
    User.findOne({ email});

    if (existingUser) {
        return res.json({message: "User already exists "});
    }

    const hashedPassword = await 
    bcrypt.hash(password, 10);

    const newUser = new User ({
        name,
        email,
        password: hashedPassword,
    });
    await newUser.save();

    res.json({message: "User registered"});
});

app.post("/create-payment-intent", async(req, res) => {
    try{
        const {amount, items} = req.body;

        const order = await Order.create({
            items,
            total: amount,
            paymentStatus: "pending",
        });
        console.log("Created Order:",order._id);

        const paymentIntent = await
        stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            metadata: {
                orderId: newOrder._id.toString(),
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});
app.get("api/orders", async(req, res) => {
    try{
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get("/success", (req, res) => {
    res.send("Payment Successful");
});


app.get("/", (req, res) => {
    res.send("E-commerce API Running...");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



app.use(notfound);
app.use(errorHandler);


 