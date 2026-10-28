const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Blacklist = require('../models/blacklist.model');
const { memoryUsers } = require('../controllers/auth.controller');

const isMongoConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];

            if (isMongoConnected()) {
                const isBlacklisted = await Blacklist.findOne({ token });
                if (isBlacklisted) {
                    return res.status(401).json({ message: 'Token is invalid or logged out' });
                }

                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_auth_key_replace_in_production');
                req.user = await User.findById(decoded.id).select('-password');
                if (!req.user) {
                    return res.status(401).json({ message: 'User not found' });
                }
                return next();
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_auth_key_replace_in_production');
            const foundUser = Array.from(memoryUsers.values()).find(u => u._id === decoded.id);
            req.user = foundUser ? { _id: foundUser._id, name: foundUser.name, email: foundUser.email, role: foundUser.role } : { _id: decoded.id, role: decoded.role || 'user' };
            next();
        } else {
            res.status(401).json({ message: 'Not authorized, no token provided' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token validation failed' });
    }
};

const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Admin role required' });
    }
};

module.exports = { protect, authorizeAdmin };
