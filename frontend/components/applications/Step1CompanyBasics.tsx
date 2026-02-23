'use client';

import { useState, useEffect } from 'react';
import { useApplicationStore } from '@/store/applicationStore';

interface Activity {
    code: string;
    valueEn: string;
    valueAr: string;
    id: number;
}

export default function Step1CompanyBasics() {
    const {
        companyBasics, updateCompanyBasics,
        applicationId, setApplicationId,
        currentStep, setStep, isSubmitting, setIsSubmitting
    } = useApplicationStore();
    const [activitiesDb, setActivitiesDb] = useState<Activity[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        fetch('/activities.json')
            .then(res => res.json())
            .then(json => {
                if (json.data) setActivitiesDb(json.data);
            })
            .catch(err => console.error("Failed to load activities", err));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        updateCompanyBasics({ [e.target.name]: e.target.value });
    };

    const toggleActivity = (code: string) => {
        const newActivities = companyBasics.activities.includes(code)
            ? companyBasics.activities.filter(a => a !== code)
            : [...companyBasics.activities, code];
        updateCompanyBasics({ activities: newActivities });
    };

    const filteredActivities = activitiesDb.filter(a =>
        a.valueEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.code.includes(searchTerm)
    ).slice(0, 50);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const url = applicationId
                ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/applications/${applicationId}/step1`
                : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/applications/`;

            const method = applicationId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(companyBasics)
            });

            if (!res.ok) throw new Error("Failed to save data");
            const data = await res.json();

            if (!applicationId) setApplicationId(data.id);
            setStep(currentStep + 1);
        } catch (err) {
            console.error(err);
            alert("Error saving data");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-20">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Basics</h2>
                <p className="text-gray-500">Define the core attributes of your business entity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Jurisdiction</label>
                    <select
                        name="jurisdiction"
                        value={companyBasics.jurisdiction}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#494FBB] focus:border-transparent transition-all"
                        required
                    >
                        <option value="Mainland">Mainland</option>
                        <option value="Free Zone">Free Zone</option>
                    </select>
                </div>

                {companyBasics.jurisdiction === 'Free Zone' && (
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Free Zone Authority</label>
                        <select
                            name="free_zone_name"
                            value={companyBasics.free_zone_name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#494FBB] focus:border-transparent transition-all"
                            required
                        >
                            <option value="">Select Free Zone...</option>
                            <option value="DMCC">DMCC (Dubai Multi Commodities Centre)</option>
                            <option value="IFZA">IFZA (International Free Zone Authority)</option>
                            <option value="JAFZA">JAFZA (Jebel Ali Free Zone)</option>
                            <option value="DIFC">DIFC (Dubai International Financial Centre)</option>
                        </select>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Legal Type</label>
                    <select
                        name="legal_type"
                        value={companyBasics.legal_type}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#494FBB] focus:border-transparent transition-all"
                        required
                    >
                        <option value="">Select Option...</option>
                        <option value="LLC">Limited Liability Company (LLC)</option>
                        <option value="Sole Establishment">Sole Establishment</option>
                        <option value="Civil Company">Civil Company</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">License Type</label>
                    <select
                        name="license_type"
                        value={companyBasics.license_type}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#494FBB] focus:border-transparent transition-all"
                        required
                    >
                        <option value="">Select Option...</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Professional">Professional</option>
                        <option value="Industrial">Industrial</option>
                    </select>
                </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Trade Name Options</h3>
                <p className="text-sm text-gray-500 mb-4">Mainland requires 3 distinct name options in order of preference.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Option 1 (Preferred)</label>
                        <input type="text" name="trade_name_1" value={companyBasics.trade_name_1} onChange={handleChange} placeholder="e.g. Blue Sky Tech" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200" required />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Option 2</label>
                        <input type="text" name="trade_name_2" value={companyBasics.trade_name_2} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200" required={companyBasics.jurisdiction === 'Mainland'} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Option 3</label>
                        <input type="text" name="trade_name_3" value={companyBasics.trade_name_3} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200" required={companyBasics.jurisdiction === 'Mainland'} />
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-gray-100 relative">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Business Activities</h3>
                <p className="text-sm text-gray-500 mb-4">Search and select the ISIC codes for your operations.</p>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search activities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsDropdownOpen(true)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#494FBB]"
                    />

                    {isDropdownOpen && searchTerm && (
                        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                            {filteredActivities.length > 0 ? filteredActivities.map(a => (
                                <div
                                    key={a.code}
                                    onClick={() => toggleActivity(a.code)}
                                    className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-0 ${companyBasics.activities.includes(a.code) ? 'bg-[#494FBB]/5' : ''}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">{a.valueEn}</span>
                                        <span className="text-xs text-gray-400 font-mono">{a.code}</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-4 text-center text-sm text-gray-500">No activities found</div>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {companyBasics.activities.map(code => {
                        const act = activitiesDb.find(a => a.code === code);
                        return (
                            <div key={code} className="inline-flex items-center gap-2 bg-[#494FBB]/10 text-[#494FBB] px-3 py-1.5 rounded-lg text-sm font-medium border border-[#494FBB]/20">
                                <span>{act ? act.valueEn : code}</span>
                                <button type="button" onClick={() => toggleActivity(code)} className="hover:text-red-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 px-12 z-20 md:relative md:border-0 md:bg-transparent md:p-0 md:mt-8">
                <div className="flex justify-between max-w-4xl mx-auto">
                    <div />
                    <button
                        type="submit"
                        disabled={isSubmitting || companyBasics.activities.length === 0}
                        className="bg-[#494FBB] hover:opacity-90 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#494FBB]/20 disabled:opacity-50 disabled:shadow-none"
                    >
                        {isSubmitting ? 'Saving...' : 'Save & Continue'}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            {/* Click outside overlay */}
            {isDropdownOpen && <div className="fixed inset-0 z-0" onClick={() => setIsDropdownOpen(false)} />}
        </form>
    );
}
