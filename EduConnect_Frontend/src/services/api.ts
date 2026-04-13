import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * Base API URL - uses environment variables
 * Development: http://localhost:8080
 * Production: https://educonnect-backend.onrender.com
 */
const BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8080';

/**
 * Create axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
    withCredentials: true,
});

/**
 * Request interceptor - Add auth token to requests
 */
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor - Handle authentication errors
 */
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
