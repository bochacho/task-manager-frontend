import { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token) {
            loadUser();
        } else {
            setLoading (false);
        }
    }, []);

    const loadUser = async () => {
        try {
            const response = await authAPI.getMe();
            setUser(response.data.data);
            setLoading(false);
        } catch (err) {
            localStorage.removeItem('token');
            setLoading(false);
        }
    };


  const login = async (email, password) => {
        try {
            setError(null);
            const response = await authAPI.login({ email, password });
            const { token, user } = response.data.data;
            
            localStorage.setItem('token', token);
            setUser(user);
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    const register = async (name, email, password) => {
        try {
            setError(null);
            const response = await authAPI.register({ name, email, password });
            const { token, user } = response.data.data;
            
            localStorage.setItem('token', token);
            setUser(user);
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };
    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};