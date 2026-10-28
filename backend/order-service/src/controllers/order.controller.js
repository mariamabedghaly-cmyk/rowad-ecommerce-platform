const mongoose = require('mongoose');
const Order = require('../models/order.model');
const { getProductById } = require('../services/productClient');
const { processPayment } = require('../services/paymentClient');
const { getCartForUser, clearCartForUser } = require('../services/cartClient');

// High-speed in-memory order store for standalone execution when MongoDB is not running locally
const memoryOrders = new Map();

const isMongoConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

const createOrder = async (req, res, next) => {
    try {
        const { shippingAddress, paymentMethod, items: directItems } = req.body;
        const idempotencyKey = req.headers['x-idempotency-key'] || req.body.idempotencyKey;

        if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.country) {
            return res.status(400).json({ message: 'Shipping address (street, city, country) is required' });
        }

        // Idempotency check
        if (idempotencyKey) {
            if (isMongoConnected()) {
                const existingOrder = await Order.findOne({ idempotencyKey });
                if (existingOrder) {
                    return res.status(200).json({
                        message: 'Order already processed (idempotent response)',
                        order: existingOrder
                    });
                }
            } else {
                const existingOrder = Array.from(memoryOrders.values()).find(o => o.idempotencyKey === idempotencyKey);
                if (existingOrder) {
                    return res.status(200).json({
                        message: 'Order already processed (idempotent response)',
                        order: existingOrder
                    });
                }
            }
        }

        let orderItems = [];

        if (directItems && Array.isArray(directItems) && directItems.length > 0) {
            // Direct items specified
            for (const item of directItems) {
                const product = await getProductById(item.product, req.correlationId);
                if (!product) {
                    return res.status(404).json({ message: `Product ${item.product} not found in catalog` });
                }
                if (product.stock < item.quantity) {
                    return res.status(400).json({
                        message: `Not enough stock for '${product.name}'. Requested ${item.quantity}, available: ${product.stock}`
                    });
                }
                orderItems.push({
                    product: item.product,
                    title: product.name,
                    quantity: item.quantity,
                    price: product.price // Authoritative price from Product Service
                });
            }
        } else {
            // Retrieve cart from Cart Service
            const authToken = req.headers.authorization;
            const cart = await getCartForUser(authToken, req.correlationId);
            if (!cart || !cart.items || cart.items.length === 0) {
                return res.status(400).json({ message: 'Cart is empty. Add items to cart before placing an order.' });
            }

            for (const item of cart.items) {
                const product = await getProductById(item.product, req.correlationId);
                if (!product) {
                    return res.status(404).json({ message: `Product ${item.product} not found in catalog` });
                }
                if (product.stock < item.quantity) {
                    return res.status(400).json({
                        message: `Not enough stock for '${product.name}'. Requested ${item.quantity}, available: ${product.stock}`
                    });
                }
                orderItems.push({
                    product: item.product,
                    title: product.name,
                    quantity: item.quantity,
                    price: product.price
                });
            }
        }

        const totalPrice = Number(orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2));

        if (isMongoConnected()) {
            const order = await Order.create({
                user: req.user._id,
                items: orderItems,
                totalPrice,
                currency: 'EGP',
                shippingAddress,
                paymentMethod: paymentMethod || 'CreditCard',
                status: 'pending',
                paymentStatus: 'pending',
                idempotencyKey: idempotencyKey || undefined
            });

            // Invoke Payment Service synchronously
            const paymentResult = await processPayment({
                orderId: order._id.toString(),
                userId: req.user._id,
                amount: totalPrice,
                currency: 'EGP',
                paymentMethod: order.paymentMethod
            }, req.correlationId);

            if (paymentResult && paymentResult.status === 'Approved') {
                order.paymentStatus = 'paid';
                order.status = 'processing';
                order.transactionId = paymentResult.transactionId;
                order.paymentMessage = paymentResult.message;
                await order.save();

                if (req.headers.authorization) {
                    clearCartForUser(req.headers.authorization, req.correlationId);
                }

                return res.status(201).json({
                    message: 'Order created and payment processed successfully',
                    order,
                    transactionId: order.transactionId,
                    paymentStatus: order.paymentStatus,
                    status: order.status
                });
            } else {
                order.paymentStatus = 'failed';
                order.paymentMessage = paymentResult ? paymentResult.message : 'Payment declined by processor';
                await order.save();

                return res.status(402).json({
                    message: 'Order created but payment was declined',
                    paymentError: order.paymentMessage,
                    order
                });
            }
        }

        // Fallback in-memory order record
        const orderId = new mongoose.Types.ObjectId().toString();
        const order = {
            _id: orderId,
            user: req.user._id,
            items: orderItems,
            totalPrice,
            currency: 'EGP',
            shippingAddress,
            paymentMethod: paymentMethod || 'CreditCard',
            status: 'pending',
            paymentStatus: 'pending',
            idempotencyKey: idempotencyKey || undefined,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const paymentResult = await processPayment({
            orderId,
            userId: req.user._id,
            amount: totalPrice,
            currency: 'EGP',
            paymentMethod: order.paymentMethod
        }, req.correlationId);

        if (paymentResult && paymentResult.status === 'Approved') {
            order.paymentStatus = 'paid';
            order.status = 'processing';
            order.transactionId = paymentResult.transactionId;
            order.paymentMessage = paymentResult.message;
            memoryOrders.set(orderId, order);

            if (req.headers.authorization) {
                clearCartForUser(req.headers.authorization, req.correlationId);
            }

            return res.status(201).json({
                message: 'Order created and payment processed successfully',
                order,
                transactionId: order.transactionId,
                paymentStatus: order.paymentStatus,
                status: order.status
            });
        } else {
            order.paymentStatus = 'failed';
            order.paymentMessage = paymentResult ? paymentResult.message : 'Payment declined by processor';
            memoryOrders.set(orderId, order);

            return res.status(402).json({
                message: 'Order created but payment was declined',
                paymentError: order.paymentMessage,
                order
            });
        }
    } catch (error) {
        next(error);
    }
};

const getOrders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        if (isMongoConnected()) {
            const total = await Order.countDocuments();
            const orders = await Order.find().skip(skip).limit(limit).sort({ createdAt: -1 });
            return res.status(200).json({
                total,
                page,
                pages: Math.ceil(total / limit) || 1,
                orders
            });
        }

        const allOrders = Array.from(memoryOrders.values());
        const total = allOrders.length;
        const orders = allOrders.slice(skip, skip + limit);
        res.status(200).json({
            total,
            page,
            pages: Math.ceil(total / limit) || 1,
            orders
        });
    } catch (error) {
        next(error);
    }
};

const getMyOrders = async (req, res, next) => {
    try {
        if (isMongoConnected()) {
            const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
            return res.status(200).json(orders);
        }

        const orders = Array.from(memoryOrders.values())
            .filter(o => o.user === req.user._id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        if (isMongoConnected()) {
            const order = await Order.findById(req.params.id);
            if (!order) return res.status(404).json({ message: 'Order not found' });
            return res.status(200).json(order);
        }

        const order = memoryOrders.get(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

const cancelOrder = async (req, res, next) => {
    try {
        if (isMongoConnected()) {
            const order = await Order.findById(req.params.id);
            if (!order) return res.status(404).json({ message: 'Order not found' });
            if (order.status === 'delivered') return res.status(400).json({ message: 'Cannot cancel a delivered order' });
            order.status = 'cancelled';
            await order.save();
            return res.status(200).json({ message: 'Order cancelled successfully', order });
        }

        const order = memoryOrders.get(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (order.status === 'delivered') return res.status(400).json({ message: 'Cannot cancel a delivered order' });
        order.status = 'cancelled';
        memoryOrders.set(req.params.id, order);
        res.status(200).json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        next(error);
    }
};

module.exports = { createOrder, getOrders, getMyOrders, getOrderById, cancelOrder, memoryOrders };
