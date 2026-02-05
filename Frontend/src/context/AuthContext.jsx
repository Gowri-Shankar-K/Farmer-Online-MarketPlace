import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const api = axios.create({
        baseURL: 'http://localhost:5000/api',
        withCredentials: true
    });

    // Handle Token Refresh
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const { data } = await api.get('/auth/refresh-token');
                    // Update access token in memory or cookies (logic handled by backend set-cookie)
                    return api(originalRequest);
                } catch (refreshError) {
                    setUser(null);
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );

    useEffect(() => {
        // Check if user is logged in on mount
        const fetchUser = async () => {
            try {
                const { data } = await api.get('/auth/me'); // I should add this endpoint
                setUser(data.data);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        setUser(data.data.user);
        return data;
    };

    const register = async (userData) => {
        const { data } = await api.post('/auth/register', userData);
        setUser(data.data.user);
        return data;
    };

    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, api }}>
            {children}
        </AuthContext.Provider>
    );
};
