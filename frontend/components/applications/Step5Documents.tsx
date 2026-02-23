'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApplicationStore } from '@/store/applicationStore';

export default function Step5Documents() {
    const { stakeholders, applicationId, isSubmitting, setIsSubmitting } = useApplicationStore();
    const router = useRouter();
    const [uploadStatuses, setUploadStatuses] = useState<Record<string, boolean>>({});

    const handleFileUpload = async (stakeholderId: number | undefined, documentType: string, index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !applicationId) return;

        const formData = new FormData();
        formData.append('document_type', documentType);
        formData.append('file', file);
        if (stakeholderId) formData.append('stakeholder_id', stakeholderId.toString());

        const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/applications/${applicationId}/documents`;

        try {
            const res = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            if (res.ok) {
                setUploadStatuses(prev => ({ ...prev, [`${index}_${documentType}`]: true }));
            } else {
                alert("Upload failed");
            }
        } catch (err) {
            alert("Upload failed due to network error");
        }
    };

    const submitApplication = async () => {
        setIsSubmitting(true);
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/applications/${applicationId}/submit`;
            const res = await fetch(url, {
                method: 'POST',
                credentials: 'include'
            });
            if (!res.ok) throw new Error("Failed to submit");

            alert("Application submitted successfully!");
            router.push('/dashboard');
        } catch (err) {
            alert("Failed to finalize application");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Required Documents</h2>
                <p className="text-gray-500">Upload the scanned documents for all stakeholders. PDF or structured JPG required.</p>
            </div>

            <div className="space-y-6">
                {stakeholders.map((st, index) => {
                    const requirements = [
                        { type: 'Passport Copy', check: true },
                        { type: 'Passport Photo', check: true },
                        { type: 'Visa / Entry Stamp', check: !st.uae_resident },
                        { type: 'Emirates ID (Front & Back)', check: st.uae_resident },
                        { type: 'NOC Letter', check: st.uae_resident },
                        { type: 'Sample Signature', check: st.roles.includes('Manager') }
                    ];

                    return (
                        <div key={index} className="bg-white border border-gray-200 shadow-xl shadow-gray-200/20 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{st.first_name} {st.last_name}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {requirements.filter(req => req.check).map(req => {
                                    const uidKey = `${index}_${req.type}`;
                                    const isUploaded = uploadStatuses[uidKey];

                                    return (
                                        <div key={req.type} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isUploaded ? 'border-[#10b981] bg-[#10b981]/5' : 'border-gray-200 hover:border-gray-300 bg-gray-50'}`}>
                                            <div>
                                                <div className="font-semibold text-sm text-gray-900">{req.type}</div>
                                                <div className="text-xs text-gray-500 mt-1">{isUploaded ? 'Uploaded' : 'Pending Upload'}</div>
                                            </div>
                                            {isUploaded ? (
                                                <div className="h-8 w-8 rounded-full bg-[#10b981] flex items-center justify-center text-white font-bold">✓</div>
                                            ) : (
                                                <label className="cursor-pointer bg-white border border-gray-200 hover:border-[#494FBB] text-[#494FBB] text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                                                    Upload
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        onChange={(e) => handleFileUpload(st.id, req.type, index, e)}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 px-12 z-20 md:relative md:border-0 md:bg-transparent md:p-0 md:mt-8">
                <div className="flex justify-between max-w-4xl mx-auto">
                    <button type="button" onClick={() => useApplicationStore.getState().setStep(4)} className="text-gray-500 font-bold hover:text-gray-900 px-4 py-3">← Back</button>
                    <button
                        onClick={submitApplication}
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:shadow-none"
                    >
                        {isSubmitting ? 'Submitting...' : 'Finalize Application'}
                    </button>
                </div>
            </div>
        </div>
    );
}
