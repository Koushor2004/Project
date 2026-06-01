const User = require('../models/User');
const { generateToken } = require('../utils/tokenUtils');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendError(res, 409, 'Email already registered.');
        }

        const userRole = role === 'admin' ? 'admin' : 'user';

        const user = await User.create({
            name,
            email,
            password,
            role: userRole,
        });
        const token = generateToken(user._id, user.role);

        return sendSuccess(res, 201, 'Registration successful.', {
            user: user.toJSON(),
            token,
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return sendError(res, 401, 'Invalid email or password.');
        }
        if (!user.isActive) {
            return sendError(res, 403, 'Account is deactivated.');
        }

        const token = generateToken(user._id, user.role);
        user.password = undefined;

        return sendSuccess(res, 200, 'Login successful.', {
            user: user.toJSON(),
            token,
        });
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        return sendSuccess(res, 200, 'Profile fetched.', { user: req.user.toJSON() });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, getMe };
