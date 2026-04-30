import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user') || localStorage.getItem('artify_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        const syncUser = () => {
            const savedUser = localStorage.getItem('user') || localStorage.getItem('artify_user');
            setUser(savedUser ? JSON.parse(savedUser) : null);
        };

        window.addEventListener('userChanged', syncUser);
        return () => window.removeEventListener('userChanged', syncUser);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('artify_user', JSON.stringify(userData));
        window.dispatchEvent(new Event('userChanged'));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('artify_user');
        window.dispatchEvent(new Event('userChanged'));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
