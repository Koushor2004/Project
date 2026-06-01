require('dotenv').config();
const express = require('express');
const helmet = require('helmet').default;
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit').default;

const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');
const logger = require('./src/utils/logger');


const authRoutes = require('./src/routes/v1/auth');
const taskRoutes = require('./src/routes/v1/tasks');
const adminRoutes = require('./src/routes/v1/admin');

const app = express();


connectDB();


app.use(helmet());


app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));


if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { success: false, message: 'Too many requests from this IP.' },
});
app.use('/api', globalLimiter);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/admin', adminRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', version: 'v1', timestamp: new Date().toISOString() });
});


app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});


app.use(errorHandler);

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}

module.exports = app;