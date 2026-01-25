import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

// Use relative path to leverage Next.js rewrites (Same-Origin)
const API_URL = '/api/v1';

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
