'use client';

import { useApplicationStore } from '@/store/applicationStore';

export default function Step4UBO() {
    const { stakeholders, updateStakeholder, currentStep, setStep, applicationId, isSubmitting, setIsSubmitting } = useApplicationStore();

    const handleUboChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const isCheckbox = e.target.type === 'checkbox';
        const data = isCheckbox ? { is_ubo: e.target.checked } : { ownership_percentage: parseFloat(e.target.value) || 0 };
        updateStakeholder(index, data);
    };

    const handleSubmit = async () => {
        // Validate total percentage
        const total = stakeholders.reduce((sum, st) => sum + (st.is_ubo ? (st.ownership_percentage || 0) : 0), 0);

        if (total !== 100) {
            alert(`Total UBO ownership percentage must be exactly 100%. Current total: ${total}%`);
            return;
        }

        setIsSubmitting(true);
        try {
            // Save updated stakeholders data 
            const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/applications/${applicationId}/stakeholders`;
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(stakeholders)
            });
            if (!res.ok) throw new Error("Failed to save UBOs");
            setStep(currentStep + 1);
        } catch (err) {
            console.error(err);
            alert("Error saving UBO data");
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalOwnership = stakeholders.reduce((sum, st) => sum + (st.is_ubo ? (st.ownership_percentage || 0) : 0), 0);
    const isValid = totalOwnership === 100;

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Ultimate Beneficial Owners (UBO)</h2>
                <p className="text-gray-500">Comply with UAE Anti-Money Laundering laws by declaring the ultimate owners.</p>
            </div>

            <div className="bg-white border border-gray-200 shadow-xl shadow-gray-200/20 rounded-2xl p-6">
                <div className="mb-6 flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                    <span className="font-bold text-gray-700">Total Declared Ownership:</span>
                    <span className={`text-xl font-black ${isValid ? 'text-[#10b981]' : 'text-amber-500'}`}>
                        {totalOwnership}% / 100%
                    </span>
                </div>

                <div className="space-y-4">
                    {stakeholders.map((st, index) => (
                        <div key={index} className={`p-4 rounded-xl border ${st.is_ubo ? 'border-[#494FBB] bg-[#494FBB]/5' : 'border-gray-200 bg-white'} transition-colors`}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={st.is_ubo}
                                        onChange={(e) => handleUboChange(index, e)}
                                        className="w-5 h-5 text-[#494FBB] rounded border-gray-300 focus:ring-[#494FBB]"
                                    />
                                    <div>
                                        <div className="font-bold text-gray-900">{st.first_name} {st.last_name}</div>
                                        <div className="text-xs text-gray-500">{st.roles.join(', ')}</div>
                                    </div>
                                </label>

                                {st.is_ubo && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-600">Ownership</span>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="1" max="100"
                                                value={st.ownership_percentage || ''}
                                                onChange={(e) => handleUboChange(index, e)}
                                                className="w-24 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#494FBB] text-right pr-8 font-bold"
                                                placeholder="0"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 px-12 z-20 md:relative md:border-0 md:bg-transparent md:p-0 md:mt-8">
                <div className="flex justify-between max-w-4xl mx-auto">
                    <button type="button" onClick={() => setStep(currentStep - 1)} className="text-gray-500 font-bold hover:text-gray-900 px-4 py-3">← Back</button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !isValid}
                        className="bg-[#494FBB] hover:opacity-90 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#494FBB]/20 disabled:opacity-50 disabled:shadow-none"
                    >
                        {isSubmitting ? 'Saving...' : 'Save & Continue'}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
