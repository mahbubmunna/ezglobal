'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { APPLICATION_STATUSES } from '@/components/dashboard/ApplicationTrackerCard';

export default function AdminAllApplications() {
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

        const fetchAllApplications = async () => {
            try {
                // Fetch all applications unconditionally
                const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/admin/applications`;
                const res = await fetch(url, { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setApplications(data);
                }
            } catch (err) {
                console.error("Failed to fetch all applications", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.role === 'admin') {
            fetchAllApplications();
        }
    }, [user, router]);

    if (!mounted) return null;
    if (user?.role !== 'admin') return null;

    const getStatusInfo = (statusValue: string) => {
        const match = APPLICATION_STATUSES.find(s => s.value === statusValue);
        if (match) return match.label;
        if (statusValue === 'Approved') return 'Approved & Completed';
        if (statusValue === 'Action_Required') return 'Action Required';
        return statusValue;
    };

    return (
        <DashboardLayout>
            <div className="mb-8">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Applications</h1>
                        <p className="text-gray-500">A global directory of every business license package in the system.</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-sm">
                                    <th className="font-bold text-gray-500 py-4 px-6 uppercase tracking-wider">Application</th>
                                    <th className="font-bold text-gray-500 py-4 px-6 uppercase tracking-wider">Entity Type</th>
                                    <th className="font-bold text-gray-500 py-4 px-6 uppercase tracking-wider">Submitted On</th>
                                    <th className="font-bold text-gray-500 py-4 px-6 uppercase tracking-wider">Phase</th>
                                    <th className="font-bold text-gray-500 py-4 px-6 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-gray-400">Loading directory...</td>
                                    </tr>
                                ) : applications.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-gray-500">No applications found in the system.</td>
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
                                                <div className="text-xs text-gray-500 mt-1">{app.jurisdiction === 'Free Zone' ? app.free_zone_name : 'Mainland'}</div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-500">
                                                {new Date(app.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-xs font-bold ${app.status === 'Approved' ? 'bg-green-100 text-green-700' : app.status === 'Action_Required' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                                                    {getStatusInfo(app.status)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    onClick={() => router.push(`/dashboard/admin/applications/${app.id}`)}
                                                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
                                                >
                                                    View Details &rarr;
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
