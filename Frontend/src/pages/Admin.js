import React, { useEffect, useState } from 'react';
import Alert from '../components/Alert';
import { fetchAllTasksAdmin } from '../api/tasks';
import { getErrorMessage } from '../utils/errors';

const Admin = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAllTasksAdmin()
            .then((res) => setTasks(res.data.data.tasks || []))
            .catch((err) => setError(getErrorMessage(err, 'Could not load tasks.')))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Admin — All Tasks</h1>
                    <p className="text-muted">View every user&apos;s tasks (admin only).</p>
                </div>
            </div>

            <Alert type="error" message={error} />

            {loading ? (
                <p className="text-muted">Loading...</p>
            ) : tasks.length === 0 ? (
                <p className="empty-state">No tasks in the system.</p>
            ) : (
                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Owner</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Due</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task._id}>
                                    <td>{task.title}</td>
                                    <td>{task.owner?.name || task.owner?.email || '—'}</td>
                                    <td>{task.status}</td>
                                    <td>{task.priority}</td>
                                    <td>
                                        {task.dueDate
                                            ? new Date(task.dueDate).toLocaleDateString()
                                            : '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Admin;
