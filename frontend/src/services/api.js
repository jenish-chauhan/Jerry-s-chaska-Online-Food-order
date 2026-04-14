import axios from "axios";
import { API_URL } from "../config/runtime";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Auth endpoints
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        "Registration failed. Please try again.",
    };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        "Login failed. Please check your credentials.",
    };
  }
};

// Menu endpoints (integrated with real backend API)
export const getMenuItems = async () => {
  try {
    const response = await api.get("/menu");
    // Map backend fields to frontend expected fields
    const items = response.data.data.map((item) => ({
      ...item,
      id: item._id || item.id,
      image: item.image_url,
      categoryId: item.category,
      price: parseFloat(item.price),
    }));
    return { data: items };
  } catch (error) {
    console.error("Failed to get menu items", error);
    return { data: [] };
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get("/menu");
    // Extract unique categories from the menu items
    const uniqueCategories = [
      ...new Set(response.data.data.map((item) => item.category)),
    ];
    const categories = uniqueCategories.filter(Boolean).map((cat) => ({
      id: cat,
      name: cat,
    }));
    return { data: categories };
  } catch (error) {
    console.error("Failed to get categories", error);
    return { data: [] };
  }
};

export const getMenuItemsByCategory = async (categoryId) => {
  try {
    if (categoryId === "all") return await getMenuItems();
    const response = await api.get(`/menu/category/${categoryId}`);
    const items = response.data.data.map((item) => ({
      ...item,
      id: item._id || item.id,
      image: item.image_url,
      categoryId: item.category,
      price: parseFloat(item.price),
    }));
    return { data: items };
  } catch (error) {
    console.error("Failed to get menu items by category", error);
    return { data: [] };
  }
};

export const createOrder = async (orderData) => {
  try {
    const headers = getAuthHeaders();
    const response = await api.post("/orders", orderData, { headers });
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || "Failed to place order.",
    };
  }
};

export const getUserOrders = async (userId) => {
  try {
    const headers = getAuthHeaders();
    const response = await api.get(`/orders/user/${userId}`, { headers });
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error("Failed to get user orders", error);
    return { success: false, data: [] };
  }
};

export const getOrderById = async (orderNumber) => {
  try {
    const headers = getAuthHeaders();
    const response = await api.get(`/orders/${orderNumber}`, { headers });
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error("Failed to get order", error);
    return {
      success: false,
      message: error.response?.data?.error || "Failed to fetch order.",
    };
  }
};

export const confirmOrderPickup = async (orderNumber) => {
  try {
    const headers = getAuthHeaders();
    const response = await api.patch(
      `/orders/${orderNumber}/confirm-pickup`,
      {},
      { headers },
    );
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error || "Failed to confirm order pickup.",
    };
  }
};

export default api;
