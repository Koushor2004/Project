const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        return sendSuccess(res, 200, 'Users fetched.', { users, total: users.length });
    } catch (error) {
        next(error);
    }
};

const toggleUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return sendError(res, 404, 'User not found.');
        if (user._id.toString() === req.user._id.toString()) {
            return sendError(res, 400, 'Cannot deactivate your own account.');
        }
        user.isActive = !user.isActive;
        await user.save();
        return sendSuccess(res, 200, `User ${user.isActive ? 'activated' : 'deactivated'}.`, { user });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllUsers, toggleUserStatus };