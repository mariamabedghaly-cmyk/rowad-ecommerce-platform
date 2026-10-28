const Cart = require('../models/cart.model');
const { getProductById } = require('../services/productClient');

const getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(200).json({ items: [], totalPrice: 0 });
        }
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const qty = parseInt(quantity, 10);
        if (!qty || qty <= 0) {
            return res.status(400).json({ message: 'Quantity must be a positive integer' });
        }

        // Validate product from authoritative Product Service
        const product = await getProductById(productId, req.correlationId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.stock < qty) {
            return res.status(400).json({
                message: `Not enough stock. Requested ${qty}, available: ${product.stock}`
            });
        }

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [{
                    product: productId,
                    title: product.name,
                    quantity: qty,
                    price: product.price, // Trusted price from Product Service
                    image: product.image || 'no-image.jpg'
                }],
                totalPrice: Number((product.price * qty).toFixed(2))
            });
        } else {
            const itemIndex = cart.items.findIndex(item => item.product === productId);
            if (itemIndex > -1) {
                const newQty = cart.items[itemIndex].quantity + qty;
                if (product.stock < newQty) {
                    return res.status(400).json({
                        message: `Not enough stock for updated quantity. Total requested: ${newQty}, available: ${product.stock}`
                    });
                }
                cart.items[itemIndex].quantity = newQty;
                cart.items[itemIndex].price = product.price; // Refresh price
            } else {
                cart.items.push({
                    product: productId,
                    title: product.name,
                    quantity: qty,
                    price: product.price,
                    image: product.image || 'no-image.jpg'
                });
            }

            cart.totalPrice = Number(cart.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2));
            await cart.save();
        }

        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

const updateCartItem = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        const qty = parseInt(quantity, 10);
        const { productId } = req.params;

        if (!qty || qty <= 0) {
            return res.status(400).json({ message: 'Quantity must be greater than zero' });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.product === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // Verify stock against Product Service
        const product = await getProductById(productId, req.correlationId);
        if (product && product.stock < qty) {
            return res.status(400).json({
                message: `Not enough stock. Requested ${qty}, available: ${product.stock}`
            });
        }

        cart.items[itemIndex].quantity = qty;
        if (product) {
            cart.items[itemIndex].price = product.price;
        }

        cart.totalPrice = Number(cart.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2));
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

const removeFromCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.product !== req.params.productId);
        cart.totalPrice = Number(cart.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2));
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

const clearCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(200).json({ message: 'Cart is already empty' });
        }

        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
