import { createContext, useContext, useState, useEffect } from 'react';
import { registerUser as apiRegisterUser, loginUser as apiLoginUser } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored user on mount
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Try real API first
        const apiResult = await apiLoginUser({ email, password });
        if (apiResult.success) {
            const { user: userData, token } = apiResult.data;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', token);
            return { success: true };
        }

        // Fallback to mock login for demo
        if (email === 'admin@jerryschaska.com' && password === 'admin123') {
            const adminUser = { id: 1, name: 'Admin', email, role: 'admin' };
            setUser(adminUser);
            localStorage.setItem('user', JSON.stringify(adminUser));
            return { success: true };
        } else if (email === 'user@example.com' && password === 'user123') {
            const normalUser = { id: 2, name: 'User', email, role: 'user' };
            setUser(normalUser);
            localStorage.setItem('user', JSON.stringify(normalUser));
            return { success: true };
        }
        return { success: false, message: apiResult.message || 'Invalid credentials' };
    };

    const register = async (name, email, password) => {
        const result = await apiRegisterUser({ name, email, password });
        if (result.success) {
            const { user: userData, token } = result.data;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', token);
            return { success: true };
        }
        return { success: false, message: result.message };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
