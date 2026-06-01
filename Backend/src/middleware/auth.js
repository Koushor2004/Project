const { verifyToken } = require('../utils/tokenUtils');
const { sendError } = require('../utils/apiResponse');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return sendError(res, 401, 'Access denied. No token provided.');
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        const user = await User.findById(decoded.id);
        if (!user || !user.isActive) {
            return sendError(res, 401, 'User not found or deactivated.');
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return sendError(res, 401, 'Token expired. Please log in again.');
        }
        return sendError(res, 401, 'Invalid token.');
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return sendError(res, 403, `Role '${req.user.role}' is not authorized for this action.`);
        }
        next();
    };
};

module.exports = { protect, authorize };