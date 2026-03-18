import { createContext, useContext, useState, useEffect } from 'react';
import { logoutAdmin } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('admin_token');
        const storedUser = sessionStorage.getItem('admin_user');
        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } catch {
                sessionStorage.removeItem('admin_token');
                sessionStorage.removeItem('admin_user');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, jwt) => {
        setUser(userData);
        setToken(jwt);
        sessionStorage.setItem('admin_token', jwt);
        sessionStorage.setItem('admin_user', JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            if (token) {
                await logoutAdmin();
            }
        } catch (error) {
            console.error("Error during server logout", error);
        } finally {
            setUser(null);
            setToken(null);
            sessionStorage.removeItem('admin_token');
            sessionStorage.removeItem('admin_user');
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
