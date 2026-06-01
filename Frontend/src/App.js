import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <main className="main">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/dashboard"
                            element={(
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            )}
                        />
                        <Route
                            path="/admin"
                            element={(
                                <ProtectedRoute adminOnly>
                                    <Admin />
                                </ProtectedRoute>
                            )}
                        />
                    </Routes>
                </main>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
