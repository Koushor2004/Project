const Task = require('../models/Task');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const getTasks = async (req, res, next) => {
    try {
        const filter = { owner: req.user._id };
        if (req.query.status) filter.status = req.query.status;

        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
        const skip = (page - 1) * limit;

        const [tasks, total] = await Promise.all([
            Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Task.countDocuments(filter),
        ]);

        return sendSuccess(res, 200, 'Tasks fetched.', {
            tasks,
            total,
            page,
            pages: Math.ceil(total / limit) || 1,
        });
    } catch (error) {
        next(error);
    }
};

const getAllTasksAdmin = async (req, res, next) => {
    try {
        const tasks = await Task.find().populate('owner', 'name email').sort({ createdAt: -1 });
        return sendSuccess(res, 200, 'All tasks fetched.', { tasks, total: tasks.length });
    } catch (error) {
        next(error);
    }
};

const getTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return sendError(res, 404, 'Task not found.');
        if (task.owner.toString() !== req.user._id.toString()) {
            return sendError(res, 403, 'Not authorized to access this task.');
        }
        return sendSuccess(res, 200, 'Task fetched.', { task });
    } catch (error) {
        next(error);
    }
};

const createTask = async (req, res, next) => {
    try {
        const task = await Task.create({ ...req.body, owner: req.user._id });
        return sendSuccess(res, 201, 'Task created.', { task });
    } catch (error) {
        next(error);
    }
};

const updateTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return sendError(res, 404, 'Task not found.');
        if (task.owner.toString() !== req.user._id.toString()) {
            return sendError(res, 403, 'Not authorized to update this task.');
        }

        Object.assign(task, req.body);
        await task.save();

        return sendSuccess(res, 200, 'Task updated.', { task });
    } catch (error) {
        next(error);
    }
};

const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return sendError(res, 404, 'Task not found.');
        if (task.owner.toString() !== req.user._id.toString()) {
            return sendError(res, 403, 'Not authorized to delete this task.');
        }

        await task.deleteOne();
        return sendSuccess(res, 200, 'Task deleted.');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    getAllTasksAdmin,
};
