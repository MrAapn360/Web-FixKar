import axios from "axios";

// Base URL of the Laravel backend (used once the real backend exists).
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// Phase 1 runs on the mock API. Flip this to "false" (or set env var) in Phase 4.
export const USE_MOCK = (process.env.REACT_APP_USE_MOCK ?? "true") !== "false";

const TOKEN_KEY = "fixkar_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Axios instance with the Sanctum token interceptor.
const api = axios.create({
  baseURL: BASE_URL,
  headers: { Accept: "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Auto-logout on 401 (expired/invalid token).
    if (err.response && err.response.status === 401) {
      clearToken();
    }
    return Promise.reject(err);
  }
);

export default api;
