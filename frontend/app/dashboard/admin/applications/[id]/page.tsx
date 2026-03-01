'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { APPLICATION_STATUSES } from '@/components/dashboard/ApplicationTrackerCard';

export default function AdminApplicationReview() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const [application, setApplication] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [reviewNotes, setReviewNotes] = useState("");

    useEffect(() => {
        setMounted(true);
        if (user && user.role !== 'admin') {
            router.push('/dashboard');
            return;
        }

        const fetchApplication = async () => {
            try {
                const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/admin/applications/${params.id}`;
                const res = await fetch(url, { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setApplication(data);
                    setReviewNotes(data.ai_review_notes || "");
                }
            } catch (err) {
                console.error("Failed to fetch application", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.role === 'admin') {
            fetchApplication();
        }
    }, [user, router, params.id]);

    if (!mounted) return null;
    if (user?.role !== 'admin') return null;

    const handleStatusUpdate = async (newStatus: string) => {
        if (!confirm(`Are you sure you want to change the status to ${newStatus}?`)) return;

        setIsUpdating(true);
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/admin/applications/${params.id}/status`;
            const payload = {
                status: newStatus,
                ai_review_notes: reviewNotes
            };

            const res = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setApplication({ ...application, status: newStatus, ai_review_notes: reviewNotes });
                alert("Application updated successfully.");
            } else {
                alert("Failed to update application.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-64">
                    <span className="text-gray-500 font-medium">Loading Application Data...</span>
                </div>
            </DashboardLayout>
        );
    }

    if (!application) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-64">
                    <span className="text-red-500 font-medium text-lg">Application Not Found</span>
                </div>
            </DashboardLayout>
        );
    }

    // Print Layout Styles
    const printStyles = `
        @media print {
            body * { visibility: hidden; }
            #printable-application, #printable-application * { visibility: visible; }
            #printable-application { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
            .no-print { display: none !important; }
            .print-break { page-break-before: always; }
        }
    `;

    return (
        <DashboardLayout>
            <style>{printStyles}</style>

            <div className="mb-6 flex justify-between items-center no-print">
                <button
                    onClick={() => router.back()}
                    className="text-gray-500 hover:text-indigo-600 font-medium transition-colors"
                >
                    &larr; Back to List
                </button>
                <div className="space-x-4">
                    <button
                        onClick={() => window.print()}
                        className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm"
                    >
                        🖨️ Print to PDF
                    </button>
                    {application.status === 'AI_Review_Completed' && (
                        <button
                            disabled={isUpdating}
                            onClick={() => handleStatusUpdate('Human_Review_Completed')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                        >
                            {isUpdating ? 'Processing...' : 'Approve & Send to DET'}
                        </button>
                    )}
                </div>
            </div>

            {/* Admin Assessment Panel (Not Printed) */}
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 mb-8 no-print shadow-sm">
                <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">🛡️</span> Agent Assessment Controls
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-amber-800 mb-2">Internal Notes / AI Review Findings</label>
                        <textarea
                            value={reviewNotes}
                            onChange={(e) => setReviewNotes(e.target.value)}
                            rows={4}
                            placeholder="Enter any compliance notes or review rejection reasons here..."
                            className="w-full rounded-xl border-amber-200 bg-white/60 focus:bg-white focus:ring-2 focus:ring-amber-500 p-3 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-amber-800 mb-2">Quick Actions</label>
                        <div className="space-y-3">
                            <button
                                onClick={() => handleStatusUpdate('Approved')}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg text-sm transition-colors"
                            >
                                Mark as Completed (Approved)
                            </button>
                            <button
                                onClick={() => handleStatusUpdate('Action_Required')}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg text-sm transition-colors"
                            >
                                Reject (Action Required)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Printable Application Sheet */}
            <div id="printable-application" className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-10 print:p-0 print:border-none print:shadow-none max-w-5xl mx-auto">

                {/* Header */}
                <div className="border-b-2 border-indigo-900 pb-6 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">EzGlobal <span className="text-indigo-600">App.</span></h1>
                        <p className="text-gray-500 font-medium mt-1">Official Submittal Document Review</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold font-mono text-gray-900">APP-{String(application.id).padStart(5, '0')}</div>
                        <div className="text-sm font-bold text-indigo-600 uppercase tracking-widest mt-1">{application.status}</div>
                    </div>
                </div>

                {/* Grid 1: Company Profile */}
                <section className="mb-10">
                    <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">1. Company Profile</h2>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                        <div>
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Legal Type</span>
                            <span className="block font-medium text-gray-900">{application.legal_type || '-'}</span>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Jurisdiction & Zone</span>
                            <span className="block font-medium text-gray-900">{application.jurisdiction} {application.jurisdiction === 'Free Zone' ? `- ${application.free_zone_name}` : ''}</span>
                        </div>
                        <div className="col-span-2">
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Proposed Trade Names</span>
                            <div className="flex flex-col gap-1 max-w-md">
                                {application.trade_name_1 && <div className="bg-gray-50 px-3 py-1.5 rounded font-medium border border-gray-100">1. {application.trade_name_1}</div>}
                                {application.trade_name_2 && <div className="bg-gray-50 px-3 py-1.5 rounded font-medium border border-gray-100">2. {application.trade_name_2}</div>}
                                {application.trade_name_3 && <div className="bg-gray-50 px-3 py-1.5 rounded font-medium border border-gray-100">3. {application.trade_name_3}</div>}
                            </div>
                        </div>
                        <div className="col-span-2 mt-2">
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Business Activities</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {application.activities?.map((act: string, idx: number) => (
                                    <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded font-medium border border-indigo-100">{act}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Grid 2: Additional Info */}
                <section className="mb-10">
                    <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">2. Setup Requirements</h2>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                        <div>
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Facility Package</span>
                            <span className="block font-medium text-gray-900">{application.package_type || 'Standard'}</span>
                        </div>
                        {application.jurisdiction === 'Mainland' && (
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Ejari Requirement</span>
                                <span className="block font-medium text-gray-900">{application.wait_for_ejari ? 'User will provide Ejari later' : 'EzGlobal will provide Ejari'}</span>
                            </div>
                        )}
                    </div>
                </section>

                {/* Grid 3: Stakeholders */}
                <section className="print-break mb-10">
                    <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">3. Stakeholders & UBOs</h2>
                    {application.stakeholders?.length > 0 ? (
                        <div className="space-y-6">
                            {application.stakeholders.map((sh: any, i: number) => (
                                <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100 border-l-4 border-l-indigo-500">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-lg text-gray-900">{sh.first_name} {sh.middle_name || ''} {sh.last_name}</h4>
                                            <div className="flex gap-2 mt-1">
                                                {sh.roles?.map((r: string, rIdx: number) => (
                                                    <span key={rIdx} className="bg-white text-xs px-2 py-0.5 rounded border font-medium text-gray-600">{r}</span>
                                                ))}
                                                {sh.is_ubo && (
                                                    <span className="bg-purple-100 text-purple-700 border border-purple-200 text-xs px-2 py-0.5 rounded font-bold">UBO ({sh.ownership_percentage}%)</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right text-sm">
                                            <div className="text-gray-500">{sh.email}</div>
                                            <div className="text-gray-500">{sh.phone_number}</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-400 font-bold uppercase text-[10px] block">Nationality</span>
                                            <span className="font-medium">{sh.nationality || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 font-bold uppercase text-[10px] block">Passport No.</span>
                                            <span className="font-medium tracking-wider">{sh.passport_number || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 font-bold uppercase text-[10px] block">Resident Status</span>
                                            <span className="font-medium">{sh.uae_resident ? `Resident (EID: ${sh.emirates_id_number || 'N/A'})` : 'Non-Resident'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500 bg-gray-50 py-4 px-6 rounded-lg text-sm text-center">No stakeholders attached.</div>
                    )}
                </section>

                {/* Grid 4: Documents Attached */}
                <section className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">4. Reference Documents</h2>
                    {application.documents?.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {application.documents.map((doc: any, i: number) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                                    <div className="text-2xl">📄</div>
                                    <div className="overflow-hidden">
                                        <div className="text-xs font-bold text-gray-700 truncate">{doc.document_type.replace('_', ' ').toUpperCase()}</div>
                                        <a href={`http://localhost:8000/${doc.file_path}`} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline truncate block">View File &rarr;</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500 bg-gray-50 py-4 px-6 rounded-lg text-sm text-center">No documents uploaded.</div>
                    )}
                </section>

                {/* Print Footer */}
                <div className="mt-16 pt-6 border-t border-gray-200 text-center text-xs text-gray-400 font-medium">
                    GENERATED BY EZGLOBAL ADMIN SYSTEM • {new Date().toLocaleString()}
                </div>

            </div>
        </DashboardLayout>
    );
}
