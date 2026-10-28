const mongoose = require('mongoose');

const orderItemSnapshotSchema = new mongoose.Schema({
    product: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    items: [orderItemSnapshotSchema],
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'EGP'
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        default: 'CreditCard'
    },
    transactionId: {
        type: String,
        default: null
    },
    paymentMessage: {
        type: String,
        default: null
    },
    idempotencyKey: {
        type: String,
        unique: true,
        sparse: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
