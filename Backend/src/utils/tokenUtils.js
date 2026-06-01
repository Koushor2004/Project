const jwt = require('jsonwebtoken');

/** @returns {string} */
const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables.');
    }
    return secret;
};

/** @returns {import('jsonwebtoken').SignOptions} */
const getSignOptions = () => ({
    expiresIn: /** @type {import('jsonwebtoken').SignOptions['expiresIn']} */ (
        process.env.JWT_EXPIRE || '7d'
    ),
});

const generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, getJwtSecret(), getSignOptions());
};

/**
 * @param {string} token
 * @returns {object}
 */
const verifyToken = (token) => {
    const decoded = jwt.verify(token, getJwtSecret());
    if (typeof decoded === 'string') {
        throw new Error('Invalid token payload.');
    }
    return /** @type {{ id: string, role: string }} */ (decoded);
};

module.exports = { generateToken, verifyToken };
