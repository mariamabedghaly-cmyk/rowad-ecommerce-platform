const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

// Database Connection
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Health check endpoint for monitoring & probes
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', service: 'auth-user-service', port: 5001 });
});

// Service Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Centralized Error Handling
app.use(errorHandler);

module.exports = app;
