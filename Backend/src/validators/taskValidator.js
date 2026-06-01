const { body } = require('express-validator');

const taskValidator = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters')
        .escape(),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
        .escape(),
    body('status')
        .optional()
        .isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('dueDate')
        .optional({ nullable: true })
        .isISO8601().withMessage('Invalid date format'),
];

const updateTaskValidator = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters')
        .escape(),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
        .escape(),
    body('status')
        .optional()
        .isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('dueDate')
        .optional({ nullable: true })
        .isISO8601().withMessage('Invalid date format'),
];

module.exports = { taskValidator, updateTaskValidator };