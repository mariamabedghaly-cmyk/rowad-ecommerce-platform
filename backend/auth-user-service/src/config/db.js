const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_auth_db';
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
        console.log('[Auth & User Service] Dedicated MongoDB Connected (ecommerce_auth_db)');
    } catch (error) {
        console.error('[Auth & User Service] MongoDB Connection Warning:', error.message);
        console.log('[Auth & User Service] Note: Server will continue running to serve health checks.');
    }
};

module.exports = connectDB;
