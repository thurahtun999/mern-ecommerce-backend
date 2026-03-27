import Stripe from "stripe";
import Order from "../models/orderModel.js";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleWebhook = async (req, res) => {

    console.log("Webhook hit");
    console.log("Type:", typeof req.body);
    console.log("Is Buffer:", Buffer.isBuffer(req.body));
  
        const sig = req.headers["stripe-signature"];
        
        let event;

        try {
             event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
             );

             console.log("Webhook verified:", event.type);
            } catch (error) {
                    return res.status(400).send(`Webhook Error: ${error.message}`);
            }
    
        console.log("Event type:", event.type);

        if (event.type === "payment_intent.succeeded" ||
            event.type === "charge.succeeded"
        ) {
            const paymentIntent = event.data.object;
          console.log("Inside conditon");


          const orderId = paymentIntent.metadata?.orderId;
        

            console.log("Payment success for order:", orderId);
        
            await Order.findByIdAndUpdate(orderId,
                {
                    isPaid: true,
                    paymentStatus: "paid",
                    paidAt: Date.now(),
                });       
        }  
        res.sendStatus(200);
       
    };
