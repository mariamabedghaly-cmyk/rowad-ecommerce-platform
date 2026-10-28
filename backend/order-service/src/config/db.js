const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_orders_db';
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
        console.log('[Order Service] Dedicated MongoDB Connected (ecommerce_orders_db)');
    } catch (error) {
        console.error('[Order Service] MongoDB Connection Warning:', error.message);
        console.log('[Order Service] Note: Server will continue running to serve health checks.');
    }
};

module.exports = connectDB;
