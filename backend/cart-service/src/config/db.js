const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_cart_db';
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
        console.log('[Cart Service] Dedicated MongoDB Connected (ecommerce_cart_db)');
    } catch (error) {
        console.error('[Cart Service] MongoDB Connection Warning:', error.message);
        console.log('[Cart Service] Note: Server will continue running to serve health checks.');
    }
};

module.exports = connectDB;
