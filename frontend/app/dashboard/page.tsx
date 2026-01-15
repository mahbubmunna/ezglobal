'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (e) {
            console.error("Logout error", e);
        }
        logout();
        router.push('/login');
    };

    if (!isAuthenticated || !user) {
        return null; // Or loading spinner
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold">Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span>Hello, {user.first_name} {user.last_name}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-2">Welcome to your Dashboard</h2>
                            <p>Email: {user.email}</p>
                            <p>Verified: {user.is_verified ? 'Yes' : 'No'}</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
