import axios from "axios";

const API_BASE_URL = import.meta.env["VITE_API_URL"] ?? "http://localhost:3001/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
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
