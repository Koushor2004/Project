import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user, loading } = useAuth();
    if (loading) return <div className="loading">Loading...</div>;
    return <Navigate to={user ? '/dashboard' : '/login'} replace />;
};

export default Home;
