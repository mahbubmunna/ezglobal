'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ApplicationTrackerCard from '@/components/dashboard/ApplicationTrackerCard';

export default function DashboardPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        const fetchApplications = async () => {
            try {
                const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/applications/user`;
                const res = await fetch(url, { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setApplications(data);
                }
            } catch (err) {
                console.error("Failed to fetch applications", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchApplications();
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
                                <div className="text-2xl font-bold">{applications.filter(a => a.status === 'Approved').length}</div>
                                <div className="text-sm opacity-80">Active Companies</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex-1 border border-white/20">
                                <div className="text-2xl font-bold">{applications.filter(a => a.status !== 'Approved' && a.status !== 'Draft').length}</div>
                                <div className="text-sm opacity-80">Pending Applications</div>
                            </div>
                        </div>
                    </div>

                    {/* Applications Tracker Section */}
                    <div className="mb-8">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Your Applications</h2>
                                <p className="text-gray-500 mt-1">Track the live progress of your business setup.</p>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2].map(i => (
                                    <div key={i} className="w-full h-32 bg-gray-100 animate-pulse rounded-3xl" />
                                ))}
                            </div>
                        ) : applications.length > 0 ? (
                            <div className="space-y-6">
                                {applications.map((app) => (
                                    <ApplicationTrackerCard
                                        key={app.id}
                                        application={app}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100 text-gray-400">
                                    📄
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">No Applications Yet</h3>
                                <p className="text-gray-500 mb-6 max-w-sm mx-auto">You haven't started any business license applications. Click below to begin your journey.</p>
                                <button onClick={() => router.push('/dashboard/setup')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200">
                                    Start Setup Now
                                </button>
                            </div>
                        )}
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
