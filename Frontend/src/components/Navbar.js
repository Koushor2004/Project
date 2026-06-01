import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand">TaskManager</Link>
                <div className="navbar-links">
                    {user ? (
                        <>
                            <Link to="/dashboard">Dashboard</Link>
                            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
                            <span className="navbar-user">
                                {user.name}
                                <span className="role-badge">{user.role}</span>
                            </span>
                            <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
