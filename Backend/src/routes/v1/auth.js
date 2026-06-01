const router = require('express').Router();
const { register, login, getMe } = require('../../controllers/authController');
const { registerValidator, loginValidator } = require('../../validators/authValidator');
const handleValidation = require('../../middleware/validate');
const { protect } = require('../../middleware/auth');
const rateLimit = require('express-rate-limit').default;

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: 'Too many attempts. Try again in 15 minutes.' },
});

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authLimiter, registerValidator, handleValidation, register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login and receive JWT
 * @access  Public
 */
router.post('/login', authLimiter, loginValidator, handleValidation, login);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Protected
 */
router.get('/me', protect, getMe);

module.exports = router;