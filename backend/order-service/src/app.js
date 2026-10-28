const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const orderRoutes = require('./routes/order.routes');
const { correlationId } = require('./middlewares/auth.middleware');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(correlationId);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', service: 'order-service', port: 5005 });
});

app.use('/api/orders', orderRoutes);

// Error Handler
app.use((err, req, res, next) => {
    console.error(`[Order Service Error] ${err.message}`);
    res.status(err.statusCode || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;
