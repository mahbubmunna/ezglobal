'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import BusinessSetupService from '@/components/dashboard/services/BusinessSetupService';

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    if (!user) return null;

    return (
        <DashboardLayout>
            {/* Overview Content (Default) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="md:col-span-2 lg:col-span-2">
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 mb-8">
                        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.first_name}!</h1>
                        <p className="text-indigo-100 opacity-90">Manage your business setup and global expansion from one place.</p>

                        <div className="mt-8 flex gap-4">
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex-1 border border-white/20">
                                <div className="text-2xl font-bold">0</div>
                                <div className="text-sm opacity-80">Active Companies</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex-1 border border-white/20">
                                <div className="text-2xl font-bold">12</div>
                                <div className="text-sm opacity-80">Pending Steps</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions / Notifications */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-full">
                    <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button onClick={() => router.push('/dashboard/setup')} className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between group">
                            <span className="font-medium text-gray-700">Continue Setup</span>
                            <span className="text-gray-400 group-hover:text-indigo-600 transition-colors">→</span>
                        </button>
                        <button className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between group">
                            <span className="font-medium text-gray-700">Contact Support</span>
                            <span className="text-gray-400 group-hover:text-indigo-600 transition-colors">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
