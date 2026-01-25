import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

// Default to local backend if env var is not set
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Interceptor removed as cookies are handled by browser

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
            // Optional: redirect to login if not handled by component
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default api;
