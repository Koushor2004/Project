import React, { createContext, useContext, useEffect, useState } from 'react';
import { getMe, loginUser, registerUser } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        getMe()
            .then((res) => {
                const profile = res.data.data.user;
                setUser(profile);
                localStorage.setItem('user', JSON.stringify(profile));
            })
            .catch(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    const persistSession = (session) => {
        localStorage.setItem('token', session.token);
        localStorage.setItem('user', JSON.stringify(session.user));
        setUser(session.user);
    };

    const refreshProfile = async (token) => {
        localStorage.setItem('token', token);
        const me = await getMe();
        persistSession({ token, user: me.data.data.user });
    };

    const login = async (credentials) => {
        const res = await loginUser(credentials);
        await refreshProfile(res.data.data.token);
        return res;
    };

    const register = async (data) => {
        const res = await registerUser(data);
        await refreshProfile(res.data.data.token);
        return res;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
