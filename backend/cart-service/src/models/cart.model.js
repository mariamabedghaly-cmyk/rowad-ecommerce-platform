const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: String, // String representation of Product ObjectId
        required: true
    },
    title: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        default: 'no-image.jpg'
    }
}, { _id: false });

const cartSchema = new mongoose.Schema({
    user: {
        type: String, // String representation of User ObjectId
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
