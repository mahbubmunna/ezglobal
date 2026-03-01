'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { APPLICATION_STATUSES } from '@/components/dashboard/ApplicationTrackerCard';

export default function AdminReviewQueue() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        if (user && user.role !== 'admin') {
            router.push('/dashboard');
            return;
        }

        const fetchReviewQueue = async () => {
            try {
                // Fetch applications pending human review
                const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/admin/applications?status=AI_Review_Completed`;
                const res = await fetch(url, { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setApplications(data);
                }
            } catch (err) {
                console.error("Failed to fetch review queue", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.role === 'admin') {
            fetchReviewQueue();
        }
    }, [user, router]);

    if (!mounted) return null;
    if (user?.role !== 'admin') return null;

    const getStatusLabel = (statusValue: string) => {
        const match = APPLICATION_STATUSES.find(s => s.value === statusValue);
        return match ? match.label : statusValue;
    };

    return (
        <DashboardLayout>
            <div className="mb-8">
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200/50 mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Review Queue</h1>
                        <p className="text-indigo-200 opacity-90">Manage and process business licenses flagged for Agent Review.</p>
                    </div>
                    <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[120px]">
                        <div className="text-3xl font-black">{applications.length}</div>
                        <div className="text-xs uppercase tracking-widest font-bold text-indigo-200 mt-1">Pending</div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Data Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-sm">
                                    <th className="font-bold text-gray-500 py-4 px-6 uppercase tracking-wider">Application</th>
                                    <th className="font-bold text-gray-500 py-4 px-6 uppercase tracking-wider">Entity</th>
                                    <th className="font-bold text-gray-500 py-4 px-6 uppercase tracking-wider">Submitted</th>
                                    <th className="font-bold text-gray-500 py-4 px-6 uppercase tracking-wider">Status</th>
                                    <th className="font-bold text-gray-500 py-4 px-6 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-gray-400">Loading queue...</td>
                                    </tr>
                                ) : applications.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center">
                                            <div className="text-4xl mb-4">🎉</div>
                                            <div className="font-bold text-gray-900 mb-1">Queue is empty!</div>
                                            <div className="text-gray-500 text-sm">You've cleared all the pending reviews.</div>
                                        </td>
                                    </tr>
                                ) : (
                                    applications.map(app => (
                                        <tr key={app.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="font-bold text-gray-900">{app.trade_name_1 || "Untitled Company"}</div>
                                                <div className="text-xs text-gray-500 font-mono mt-0.5">ID: #{app.id}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-sm font-medium text-gray-900">{app.legal_type || 'N/A'}</div>
                                                <div className="text-xs text-indigo-600 bg-indigo-50 inline-block px-2 py-0.5 rounded mt-1 font-medium">{app.jurisdiction === 'Free Zone' ? app.free_zone_name : 'Mainland'}</div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-500">
                                                {new Date(app.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-800">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                                                    Needs Review
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    onClick={() => router.push(`/dashboard/admin/applications/${app.id}`)}
                                                    className="bg-white border border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm group-hover:shadow"
                                                >
                                                    Process Package &rarr;
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
