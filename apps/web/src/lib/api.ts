import axios from "axios";

export const getApiBaseUrl = (): string => {
  if (import.meta.env["VITE_API_URL"]) {
    return (import.meta.env["VITE_API_URL"] as string).replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://localhost:3001/api/v1";
  }
  return "https://polylance-fv-1.onrender.com/api/v1";
};

const API_BASE_URL = getApiBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 12000,
});

// Attach JWT if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("certifiedpass_jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized responses
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("certifiedpass_jwt");
      localStorage.removeItem("certifiedpass_user");
    }
    return Promise.reject(err);
  }
);
