const getRuntimeConfig = () => {
  if (typeof window === "undefined") {
    return {};
  }

  return window.__APP_CONFIG__ || {};
};

const readRuntimeValue = (key) => {
  const value = getRuntimeConfig()[key];

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};

export const API_URL =
  readRuntimeValue("API_URL") ||
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5000/api" : "/api");

export const ADMIN_URL =
  readRuntimeValue("ADMIN_URL") || import.meta.env.VITE_ADMIN_URL || "";
