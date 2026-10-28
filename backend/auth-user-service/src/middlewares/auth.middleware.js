const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Blacklist = require('../models/blacklist.model');

const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];

            const isBlacklisted = await Blacklist.findOne({ token });
            if (isBlacklisted) {
                return res.status(401).json({ message: 'Token is invalid or logged out' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

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
