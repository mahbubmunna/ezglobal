'use client';

import { useApplicationStore } from '@/store/applicationStore';

export default function Step3Location() {
    const { location, updateLocation, currentStep, setStep, applicationId, companyBasics, isSubmitting, setIsSubmitting } = useApplicationStore();
    const isMainland = companyBasics.jurisdiction === 'Mainland';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        updateLocation({ [e.target.name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/applications/${applicationId}/step3`;
            const res = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(location)
            });
            if (!res.ok) throw new Error("Failed to save location data");
            setStep(currentStep + 1);
        } catch (err) {
            console.error(err);
            alert("Error saving location data");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-20">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Location Requirements</h2>
                <p className="text-gray-500">Provide the commercial address or lease information for {isMainland ? 'Mainland' : 'Free Zone'}</p>
            </div>

            <div className="bg-white border border-gray-200 shadow-xl shadow-gray-200/20 rounded-2xl p-6">

                {isMainland ? (
                    <div className="space-y-6">
                        <div className="bg-[#494FBB]/5 p-4 rounded-xl border border-[#494FBB]/20">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="wait_for_ejari"
                                    checked={location.wait_for_ejari}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-[#494FBB] rounded border-gray-300 focus:ring-[#494FBB]"
                                />
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-900">Apply for Instant License</span>
                                    <span className="text-sm text-gray-500 mt-0.5">Skip Ejari requirement for the first year. We will provide a virtual location logic.</span>
                                </div>
                            </label>
                        </div>

                        {!location.wait_for_ejari && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Ejari Number (Tenancy Contract)</label>
                                <input
                                    type="text"
                                    name="ejari_number"
                                    value={location.ejari_number}
                                    onChange={handleChange}
                                    placeholder="Enter your Ejari contract number"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#494FBB]"
                                    required
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Free Zone Facility Package</label>
                            <select
                                name="package_type"
                                value={location.package_type}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#494FBB]"
                                required
                            >
                                <option value="">Select Package...</option>
                                <option value="Flexi Desk">Flexi Desk / Co-working Space</option>
                                <option value="Dedicated Office">Dedicated Physical Office</option>
                                <option value="Warehouse">Warehouse / Industrial Space</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 px-12 z-20 md:relative md:border-0 md:bg-transparent md:p-0 md:mt-8">
                <div className="flex justify-between max-w-4xl mx-auto">
                    <button type="button" onClick={() => setStep(currentStep - 1)} className="text-gray-500 font-bold hover:text-gray-900 px-4 py-3">← Back</button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#494FBB] hover:opacity-90 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#494FBB]/20 disabled:opacity-50 disabled:shadow-none"
                    >
                        {isSubmitting ? 'Saving...' : 'Save & Continue'}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </button>
                </div>
            </div>
        </form>
    );
}
