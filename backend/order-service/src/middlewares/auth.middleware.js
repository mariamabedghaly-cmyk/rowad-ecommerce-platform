const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_auth_key_replace_in_production');
            req.user = { _id: decoded.id, role: decoded.role };
            next();
        } else {
            res.status(401).json({ message: 'Not authorized, no token provided' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
};

const correlationId = (req, res, next) => {
    const correlationHeader = req.headers['x-correlation-id'] || `corr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    req.correlationId = correlationHeader;
    res.setHeader('X-Correlation-ID', correlationHeader);
    next();
};

module.exports = { protect, correlationId };
