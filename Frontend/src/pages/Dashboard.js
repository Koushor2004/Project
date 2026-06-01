import React, { useCallback, useEffect, useState } from 'react';
import Alert from '../components/Alert';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import {
    createTask,
    deleteTask,
    fetchTasks,
    prepareTaskPayload,
    updateTask,
} from '../api/tasks';
import { getErrorMessage } from '../utils/errors';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const loadTasks = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 10 };
            if (statusFilter) params.status = statusFilter;
            const res = await fetchTasks(params);
            const { tasks: list, pages: totalPages } = res.data.data;
            setTasks(list);
            setPages(totalPages || 1);
        } catch (err) {
            setMessage({ type: 'error', text: getErrorMessage(err, 'Could not load tasks.') });
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const showSuccess = (text) => setMessage({ type: 'success', text });

    const handleSave = async (form) => {
        const payload = prepareTaskPayload(form);
        if (editingTask) {
            const res = await updateTask(editingTask._id, payload);
            showSuccess(res.data.message || 'Task updated.');
        } else {
            const res = await createTask(payload);
            showSuccess(res.data.message || 'Task created.');
        }
        await loadTasks();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            const res = await deleteTask(id);
            showSuccess(res.data.message || 'Task deleted.');
            await loadTasks();
        } catch (err) {
            setMessage({ type: 'error', text: getErrorMessage(err, 'Could not delete task.') });
        }
    };

    const openCreate = () => {
        setEditingTask(null);
        setModalOpen(true);
    };

    const openEdit = (task) => {
        setEditingTask(task);
        setModalOpen(true);
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>My Tasks</h1>
                    <p className="text-muted">Create and manage your tasks.</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={openCreate}>
                    + New Task
                </button>
            </div>

            <Alert
                type={message.type}
                message={message.text}
                onClose={() => setMessage({ type: '', text: '' })}
            />

            <div className="toolbar">
                <label htmlFor="statusFilter">Filter by status</label>
                <select
                    id="statusFilter"
                    className="form-input filter-select"
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All</option>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
            </div>

            {loading ? (
                <p className="text-muted">Loading tasks...</p>
            ) : tasks.length === 0 ? (
                <p className="empty-state">No tasks yet. Click &quot;New Task&quot; to add one.</p>
            ) : (
                <div className="task-grid">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {pages > 1 && (
                <div className="pagination">
                    <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Previous
                    </button>
                    <span>Page {page} of {pages}</span>
                    <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        disabled={page >= pages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </button>
                </div>
            )}

            {modalOpen && (
                <TaskModal
                    task={editingTask}
                    onSave={handleSave}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;
