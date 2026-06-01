import React from 'react';

const statusLabels = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };

const TaskCard = ({ task, onEdit, onDelete }) => (
    <div className="task-card">
        <div className="task-card-header">
            <h3 className="task-title">{task.title}</h3>
            <div className="task-badges">
                <span className={`badge badge-${task.status}`}>{statusLabels[task.status] || task.status}</span>
                <span className={`badge badge-priority-${task.priority}`}>{task.priority}</span>
            </div>
        </div>
        {task.description && <p className="task-description">{task.description}</p>}
        {task.dueDate && (
            <p className="task-due">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
        )}
        <div className="task-actions">
            <button type="button" className="btn btn-sm btn-outline" onClick={() => onEdit(task)}>
                Edit
            </button>
            <button type="button" className="btn btn-sm btn-danger" onClick={() => onDelete(task._id)}>
                Delete
            </button>
        </div>
    </div>
);

export default TaskCard;
