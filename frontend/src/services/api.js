import axios from 'axios';
import { menuItems, categories } from './mockData';

// In Kubernetes, Ingress will route /api to the backend service.
// For local development, VITE_API_URL can be set to http://localhost:3000/api.
const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth endpoints
export const registerUser = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.error || 'Registration failed. Please try again.'
        };
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.error || 'Login failed. Please check your credentials.'
        };
    }
};

// Menu endpoints (using mock data for now)
export const getMenuItems = async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: menuItems };
};

export const getCategories = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: categories };
};

export const getMenuItemsByCategory = async (categoryId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (categoryId === 'all') return { data: menuItems };
    return { data: menuItems.filter(item => item.categoryId === categoryId) };
};

export const createOrder = async (orderData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Order created:', orderData);
    return { data: { success: true, orderId: Math.floor(Math.random() * 1000) } };
};

export default api;
