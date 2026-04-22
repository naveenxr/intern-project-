import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('smarttask_user');
        if (storedUser) setUser(JSON.parse(storedUser));

        const storedTheme = localStorage.getItem('smarttask_theme');
        const prefersDark = storedTheme
            ? storedTheme === 'dark'
            : window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(prefersDark);
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');

        setLoading(false);
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(prev => {
            const next = !prev;
            document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
            localStorage.setItem('smarttask_theme', next ? 'dark' : 'light');
            return next;
        });
    };

    const login = async (email, password) => {
        const res = await axios.post('/api/auth/login', { email, password });
        setUser(res.data);
        localStorage.setItem('smarttask_user', JSON.stringify(res.data));
        return res.data;
    };

    const register = async (name, email, password) => {
        const res = await axios.post('/api/auth/register', { name, email, password });
        setUser(res.data);
        localStorage.setItem('smarttask_user', JSON.stringify(res.data));
        return res.data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('smarttask_user');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, darkMode, toggleDarkMode }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
