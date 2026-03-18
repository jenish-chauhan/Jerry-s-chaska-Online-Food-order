import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5000/api" : "/api");

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("admin_token");
      sessionStorage.removeItem("admin_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth
export const loginAdmin = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Login failed");
  }
};

export const logoutAdmin = async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

// Menu / Food Items
export const getMenuItems = async () => {
  try {
    const response = await api.get("/menu");
    const items = (response.data.data || []).map((item) => ({
      ...item,
      id: item._id || item.id,
    }));
    return { data: items };
  } catch (error) {
    console.error("Failed to get menu items", error);
    return { data: [] };
  }
};

export const createMenuItem = async (data) => {
  try {
    const response = await api.post("/menu", data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to create menu item",
    );
  }
};

export const updateMenuItem = async (id, data) => {
  try {
    const response = await api.put(`/menu/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to update menu item",
    );
  }
};

export const deleteMenuItem = async (id) => {
  try {
    await api.delete(`/menu/${id}`);
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to delete menu item",
    );
  }
};

// Orders
export const getAllOrders = async () => {
  try {
    const response = await api.get("/admin/orders");
    return { data: response.data.data || [] };
  } catch (error) {
    console.error("Failed to get orders", error);
    return { data: [] };
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get("/admin/users");
    return { data: response.data.data || [] };
  } catch (error) {
    console.error("Failed to get users", error);
    return { data: [] };
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await api.patch(`/admin/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to update order status",
    );
  }
};

// Analytics
export const getDashboardStats = async () => {
  try {
    const response = await api.get("/analytics/dashboard");
    return { data: response.data.data || {} };
  } catch (error) {
    console.error("Failed to get dashboard stats", error);
    return { data: {} };
  }
};

export const getOrdersOverTime = async () => {
  try {
    const response = await api.get("/analytics/orders-over-time");
    return { data: response.data.data || [] };
  } catch (error) {
    console.error("Failed to get orders over time", error);
    return { data: [] };
  }
};

export const getTopSellingItems = async () => {
  try {
    const response = await api.get("/analytics/top-items");
    return { data: response.data.data || [] };
  } catch (error) {
    console.error("Failed to get top items", error);
    return { data: [] };
  }
};

export const getOrdersByStatus = async () => {
  try {
    const response = await api.get("/analytics/orders-by-status");
    return { data: response.data.data || [] };
  } catch (error) {
    console.error("Failed to get orders by status", error);
    return { data: [] };
  }
};

export default api;
