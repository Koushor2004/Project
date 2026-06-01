import React, { useEffect, useState } from 'react';
import { getErrorMessage } from '../utils/errors';

const emptyForm = {
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
};

const TaskModal = ({ task, onSave, onClose }) => {
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState('');

    useEffect(() => {
        if (task) {
            setForm({
                title: task.title || '',
                description: task.description || '',
                status: task.status || 'todo',
                priority: task.priority || 'medium',
                dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
            });
        } else {
            setForm(emptyForm);
        }
    }, [task]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.title.trim()) {
            setError('Title is required');
            return;
        }
        try {
            await onSave(form);
            onClose();
        } catch (err) {
            setError(getErrorMessage(err, 'Failed to save task'));
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{task ? 'Edit Task' : 'New Task'}</h2>
                    <button type="button" className="modal-close" onClick={onClose}>×</button>
                </div>
                {error && <div className="alert alert-error">{error}</div>}
                <form onSubmit={handleSubmit} className="task-form">
                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            id="title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="form-input"
                            required
                            minLength={3}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="form-input"
                            rows={3}
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select id="status" name="status" value={form.status} onChange={handleChange} className="form-input">
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="priority">Priority</label>
                            <select id="priority" name="priority" value={form.priority} onChange={handleChange} className="form-input">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="dueDate">Due Date</label>
                        <input
                            id="dueDate"
                            type="date"
                            name="dueDate"
                            value={form.dueDate}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
