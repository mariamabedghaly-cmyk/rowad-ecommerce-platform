const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getMyOrders, getOrderById, cancelOrder } = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
