const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cartRoutes = require('./routes/cart.routes');
const { correlationId } = require('./middlewares/auth.middleware');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(correlationId);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', service: 'cart-service', port: 5004 });
});

app.use('/api/cart', cartRoutes);

// Error Handler
app.use((err, req, res, next) => {
    console.error(`[Cart Service Error] ${err.message}`);
    res.status(err.statusCode || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;
