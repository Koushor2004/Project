import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/errors';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, user } = useAuth();
    const navigate = useNavigate();

    if (user) return <Navigate to="/dashboard" replace />;

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(form);
            navigate('/dashboard');
        } catch (err) {
            setError(getErrorMessage(err, 'Registration failed.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Create account</h1>
                <p className="text-muted">Password must be at least 6 characters and include a number.</p>
                <Alert type="error" message={error} />
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="form-input"
                            required
                            minLength={2}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="form-input"
                            required
                            minLength={6}
                        />
                    </div>
                    <div className="form-group">
                        <label>Account role</label>
                        <div className="role-options">
                            <label className="role-option">
                                <input
                                    type="radio"
                                    name="role"
                                    value="user"
                                    checked={form.role === 'user'}
                                    onChange={handleChange}
                                />
                                <span>
                                    <strong>User</strong>
                                    <small>Manage your own tasks</small>
                                </span>
                            </label>
                            <label className="role-option">
                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    checked={form.role === 'admin'}
                                    onChange={handleChange}
                                />
                                <span>
                                    <strong>Admin</strong>
                                    <small>View all users&apos; tasks</small>
                                </span>
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>
                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
