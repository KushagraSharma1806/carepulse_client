import axios from "axios";

// Automatically use correct backend based on environment
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://carepulseserver.onrender.com",
});

// Attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
