import Cart from "../models/cartModel.js";


export const addToCart = async (req, res) => {
    try{
        const { productId, quantity} = req.body;

        let cart = await
        Cart.findOne({user: req.user._id});

        if (!cart) {
            cart = new Cart ({
                user: req.user._id,
                items: [{ product:  productId, quantity}]
            });
        } else {
            const itemIndex = cart.items.findIndex(
                item => item.product.toString() === productId
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({
                    product: productId,
                    quantity
                });
            }
        };
        await cart.save();
        res.status(200).json(cart);

    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

//Get cart

export const getCart = async(req, res) => {
    try {
        const cart = await
        Cart.findOne({ user: req.user._id})
        .populate("items.product");

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

// updateCart
export const updateCart = async(req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findOne ({ user:
            req.user._id });

            if (!cart) {
                return
                res.status(404).json({ message: "Cart not found"});
            }
            const item = cart.items.find(item =>
                item.product.toString() === productId
            );
            if (!item) {
                return
                res.status(404).json({ message: "Product not in cart"});
            }
            item.quantity = quantity;

            await cart.save();

            res.json(cart);
            } catch (error) {
                res.status(500).json({ message: error.message});
            }
};
//Remove item
export const removeFromCart = async(req, res) => {
    try{

        const cart = await
        Cart.findOne({ user: req.user._id});

        cart.items = cart.items.filter(
            item => item.product.toString() !== req.params.productId
        );
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};