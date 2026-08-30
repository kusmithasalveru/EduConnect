import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '../config/api';

/**
 * Base API URL - see src/config/api.ts for the single source of truth.
 * Development: http://localhost:8080 (default)
 * Production: set via VITE_API_URL (see .env.production / render.yaml)
 */
const BASE_URL = API_BASE_URL;

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
