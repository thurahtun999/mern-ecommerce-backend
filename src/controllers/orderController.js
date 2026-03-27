import Order from "../models/orderModel.js";


//create new order
//route POST/api/orders
//private (user)
export const createOrder = async (req, res) => {
    try {
       const { 
         orderItems,
         shippingInfo,
         totalPrice,
         paymentMethod ,
        isPaid,} = req.body;

       if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({message: "No order items"});
       }
       if (!shippingInfo?.name || !
        shippingInfo?.email || !
        shippingInfo?.address || !
        shippingInfo?.city  
       ) {
        return res.status(400).json({ message: "Shipping info is required"});
       }
       if (!totalPrice) {
        return res.status(400).json({
            success: false,
            message: "Total price is required",
        });
       }

        const order = await Order.create ({
            user: req.user._id,
            orderItems,
            shippingInfo,
            totalPrice,
            paymentMethod: paymentMethod || "Card",
            isPaid: isPaid || false,
            isDelivered: false,
            paidAt: isPaid ? Date.now() : null,
            paymentStatus: "pending",
        });

        res.status(201).json({
            success: true,
            order:  order,
        });

    } catch (error) {
        console.log("full error", error);
        res.status(500).json({ message: error.message});
    }

};

        
export const getAllOrders = async (req, res) => {
    try{
        const orders = await
        Order.find().populate("user", "name email");
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getOrders = async (req, res) => {

    const page = Number(req.query.page) || 1;
    const pageSize = 5;

    const search = req.query.keyword?.trim() || "";

    const keywordFilter = search ? {
        "orderItems": {
            $elemMatch:{
                name:{
            $regex: search,
            $options: "i",
                },
            },    
        },
    }
    : {}

    const count = await Order.countDocuments({ ...keywordFilter });

    const orders = await Order.find({ ...keywordFilter })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

    res.json({
        orders,
        page,
        pages: Math.ceil(count / pageSize),
    });
};

export const getOrderStats = async (_req, res) => {
    const orders = await Order.find();

    const totalOrders = orders.length;

    const totalSales = orders.reduce((acc, order) => {
        return order.isPaid ? acc + (order.totalPrice || 0) : acc;
    }, 0);

    const paidOrders = orders.filter(o => o.isPaid).length;
    const pendingOrders = orders.filter(o => !o.isPaid).length;

    res.json({
        totalOrders,
        totalSales,
        paidOrders,
        pendingOrders,
    })
}
export const getMyOrders = async(req, res) => {
    try {
        const orders = await Order.find({user: req.user._id});
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server error"});
    }
};
export const getOrderById = async (req, res) => {
    const order = await
    Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({ message: "Order not found"});
    }

    //Owner or Admin only
    if (
        order.user.toString() !== req.user._id.toString() &&
        !req.user.isAdmin
    ) {
        return res.status(403).json({ message:
            "Not authorized" });
    }
    res.json(order);
};


export const updateOrderStatus = async(req, res) => {
    try{
        
        const order = await
        Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({message: "Oreder not found"});
        }
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            order.paymentStatus = req.body.status || order.paymentStatus;

            const updated = await order.save();
            console.log("Updated Order", updated);

            res.json({message: "Order delivered"});
        } catch (error) {

            res.status(500).json({message: error.message});

        }
    };

    export const markAsDelivered = async (req, res) => {
        try {

        const order = await Order.findById(req.params.id);

        if(!order) {
            res.status(404);
            throw new Error("Order not found");
        }

        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updateOrder = await order.save();
          res.json(updateOrder);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
     
 };
     
          

export const deleteOrder = async(req, res) => {
    try{
        const order = await
        Order.findById(req.params.id);

        if(!order) {
            return res.status(404).json({ message: "Order not found"});
        }
        await order.deleteOne();
        
        res.status(200).json({message: "Order deleted"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
