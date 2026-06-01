const router = require('express').Router();
const {
    getTasks, getTask, createTask, updateTask, deleteTask, getAllTasksAdmin,
} = require('../../controllers/taskController');
const { taskValidator, updateTaskValidator } = require('../../validators/taskValidator');
const handleValidation = require('../../middleware/validate');
const { protect, authorize } = require('../../middleware/auth');

router.use(protect); // All task routes require auth

/**
 * @route   GET /api/v1/tasks/admin/all
 * @desc    Get all tasks (admin only)
 * @access  Admin
 */
router.get('/admin/all', authorize('admin'), getAllTasksAdmin);

/**
 * @route   GET /api/v1/tasks
 * @desc    Get user's tasks (paginated, filterable)
 * @access  Protected
 */
router.get('/', getTasks);

/**
 * @route   POST /api/v1/tasks
 * @desc    Create a new task
 * @access  Protected
 */
router.post('/', taskValidator, handleValidation, createTask);

/**
 * @route   GET /api/v1/tasks/:id
 * @desc    Get single task
 * @access  Protected (owner only)
 */
router.get('/:id', getTask);

/**
 * @route   PUT /api/v1/tasks/:id
 * @desc    Update a task
 * @access  Protected (owner only)
 */
router.put('/:id', updateTaskValidator, handleValidation, updateTask);

/**
 * @route   DELETE /api/v1/tasks/:id
 * @desc    Delete a task
 * @access  Protected (owner only)
 */
router.delete('/:id', deleteTask);

module.exports = router;