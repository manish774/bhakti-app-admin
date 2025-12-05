// apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Use proxy path in development
  headers: {
    "Content-Type": "application/json",
  },
  //withCredentials: true, // Include credentials for CORS requests
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear the token but don't force reload in development
      localStorage.removeItem("authToken");
      // Let the React app handle the redirect instead of forcing a page reload
      console.warn("Authentication failed. Token cleared.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
