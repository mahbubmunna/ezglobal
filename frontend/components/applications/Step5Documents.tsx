'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApplicationStore } from '@/store/applicationStore';
import CameraCaptureModal from './CameraCaptureModal';

export default function Step5Documents() {
    const { stakeholders, companyBasics, applicationId, isSubmitting, setIsSubmitting } = useApplicationStore();
    const router = useRouter();
    const [uploadStatuses, setUploadStatuses] = useState<Record<string, boolean>>({});

    // State for Camera Modal
    const [activeCamera, setActiveCamera] = useState<{ stakeholderId: number | undefined, index: number, name: string } | null>(null);

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

    const isMainland = companyBasics.jurisdiction === 'Mainland';

    const companyRequirements = isMainland ? [
        { type: 'Trade Name Reservation', check: true },
        { type: 'Initial Approval Certificate', check: true },
        { type: 'Memorandum of Association (MOA)', check: true },
        { type: 'Lease Contract (Ejari)', check: true },
        { type: 'Local Service Agent Agreement (LSA)', check: true },
    ] : [
        { type: 'Business Plan', check: true },
    ];

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Required Documents</h2>
                <p className="text-gray-500">Upload the scanned documents for all stakeholders. PDF or structured JPG required.</p>
            </div>

            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#494FBB]"><path d="M4 10h16" /><path d="M4 14h16" /><path d="M4 18h16" /><path d="M4 6h16" /></svg>
                        Company Documents ({companyBasics.jurisdiction})
                    </h2>

                    <div className="bg-white border border-gray-200 shadow-xl shadow-gray-200/20 rounded-2xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {companyRequirements.filter(req => req.check).map(req => {
                                const uidKey = `company_${req.type}`;
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
                                                    onChange={(e) => handleFileUpload(undefined, req.type, 'company' as unknown as number, e)}
                                                />
                                            </label>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 mt-8 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#494FBB]"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
                        Stakeholder Documents
                    </h2>

                    <div className="space-y-6">
                        {stakeholders.map((st, index) => {
                            const isManagerOrShareholder = st.roles.includes('Manager') || st.roles.includes('Shareholder');

                            const requirements = [
                                { type: 'Passport Copy', check: true },
                                { type: 'Passport Photo', check: true },
                                { type: 'Proof of Address', check: true },
                                { type: 'Visa / Entry Stamp', check: true },
                                { type: 'Emirates ID (Front & Back)', check: st.uae_resident },
                                { type: 'NOC Letter', check: st.uae_resident },
                                { type: 'Sample Signature', check: st.roles.includes('Manager') },
                                { type: 'Live Photo Verification', check: isManagerOrShareholder },
                                { type: 'Detailed CV / Profile', check: !isMainland },
                                { type: 'Registry Identification Code Form', check: !isMainland && st.roles.includes('Manager') }
                            ];

                            return (
                                <div key={index} className="bg-white border border-gray-200 shadow-xl shadow-gray-200/20 rounded-2xl p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{st.first_name} {st.last_name} <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded ml-2">{st.roles.join(', ')}</span></h3>

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
                                                    ) : req.type === 'Live Photo Verification' ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => setActiveCamera({ stakeholderId: st.id, index, name: `${st.first_name} ${st.last_name}` })}
                                                            className="bg-white border border-gray-200 hover:border-[#10b981] hover:bg-[#10b981]/5 text-[#10b981] text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="4" /><path d="M22 8v10a2 20 0 0 1-2 2H4a2 20 0 0 1-2-2V8a2 20 0 0 1 2-2h2l1.3-3.1A2 20 0 0 1 9.1 2h5.8a2 20 0 0 1 1.8 1.9L18 6h2a2 20 0 0 1 2 2z" /></svg>
                                                            Take Photo
                                                        </button>
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
                </div>
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

            {/* Camera Modal */}
            <CameraCaptureModal
                isOpen={!!activeCamera}
                onClose={() => setActiveCamera(null)}
                stakeholderName={activeCamera?.name || ''}
                onCapture={(file) => {
                    if (activeCamera) {
                        // Create a fake event object to reuse the existing handleFileUpload logic
                        const fakeEvent = {
                            target: { files: [file] }
                        } as unknown as React.ChangeEvent<HTMLInputElement>;
                        handleFileUpload(activeCamera.stakeholderId, 'Live Photo Verification', activeCamera.index, fakeEvent);
                    }
                }}
            />
        </div>
    );
}
