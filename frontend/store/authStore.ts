import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    is_verified: boolean;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setAuth: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            setAuth: (user) => set({
                user,
                isAuthenticated: true
            }),
            logout: () => set({
                user: null,
                isAuthenticated: false
            }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);
