'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Clock, Building, User, Users, ChevronDown, CheckCircle2, Home, Hourglass, Zap } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

function SolutionsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedLicense, setSelectedLicense] = useState<string | null>(null);

    // Get params
    const activity = searchParams.get('activity') || 'Accounting & Bookkeeping - 6920003';
    const partners = searchParams.get('partners') || '2';
    const origin = searchParams.get('origin') || 'local';
    const entityName = searchParams.get('entityName') || 'Partnership Company';

    // Helper to format origin
    const getNationalities = (originId: string) => {
        if (originId === 'local') return 'UAE Nationals';
        if (originId === 'regional') return 'GCC Nationals';
        return 'International';
    };

    // Updated Navigation Logic: Main "Continue" button triggers the push
    const handleContinue = () => {
        if (selectedLicense) {
            // Push params + license choice
            const params = new URLSearchParams(searchParams.toString());
            params.set('license', selectedLicense);
            router.push(`/dashboard/cost-calculator/setup-choice?${params.toString()}`);
        } else {
            alert("Please select a license to continue.");
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto py-6">

                {/* Single White Card Container */}
                <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 min-h-[600px] relative">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Recommended Business Solutions</h1>
                            <p className="text-gray-500">Based on your activity and ownership structure, here are the most suitable licenses.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.back()}
                                className="bg-white border border-gray-200 px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:text-[#0F172A] hover:border-gray-300 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleContinue}
                                className={`px-8 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg ${selectedLicense ? 'bg-[#494FBB] hover:bg-[#3e44a6] text-white shadow-indigo-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}`}
                                disabled={!selectedLicense}
                            >
                                Continue
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Summary Bar */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8 flex flex-wrap gap-y-4 justify-between items-center">
                        <div className="flex items-center gap-4 text-sm">
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Activity</span>
                                <span className="font-semibold text-gray-900">{activity}</span>
                            </div>
                            <div className="w-px h-8 bg-gray-200 mx-2 hidden md:block"></div>
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Structure</span>
                                <span className="font-semibold text-gray-900">{entityName}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-xs font-medium text-gray-600">
                                {partners} Partners
                            </span>
                            <span className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-xs font-medium text-gray-600">
                                {getNationalities(origin)}
                            </span>
                        </div>
                    </div>

                    {/* License Selection Header */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 md:px-8 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:grid">
                        <div className="col-span-4 pl-3">License Type</div>
                        <div className="col-span-3 text-center">Partners</div>
                        <div className="col-span-2 text-center">Presence</div>
                        <div className="col-span-2 text-center">Time</div>
                        <div className="col-span-1 text-center">Select</div>
                    </div>

                    {/* Recommended License Card */}
                    <div
                        onClick={() => setSelectedLicense('normal-license')}
                        className={`rounded-3xl border-2 overflow-hidden mb-6 relative transition-all cursor-pointer ${selectedLicense === 'normal-license'
                            ? 'border-[#494FBB] shadow-xl shadow-indigo-50 bg-white ring-1 ring-[#494FBB]'
                            : 'border-[#494FBB]/30 hover:border-[#494FBB] bg-white'}`}
                    >
                        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

                            {/* Type */}
                            <div className="col-span-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-[#0F172A]">Normal License</h3>
                                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                                        <Zap size={10} fill="currentColor" /> Recommended
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm mb-3">All business activities included.</p>
                                <button className="text-[#494FBB] text-xs font-bold flex items-center gap-1 hover:underline">
                                    View Fees Breakdown <ChevronDown size={14} />
                                </button>
                            </div>

                            {/* Partners */}
                            <div className="col-span-3 text-center flex flex-col items-center">
                                <div className="text-[#494FBB] mb-2"><Users size={24} /></div>
                                <div className="font-bold text-gray-900 text-sm">All Nationalities</div>
                                <div className="text-xs text-gray-500 mt-0.5">1 to 50 partners</div>
                            </div>

                            {/* Presence */}
                            <div className="col-span-2 text-center flex flex-col items-center">
                                <div className="text-[#494FBB] mb-2"><Building size={24} /></div>
                                <div className="font-bold text-gray-900 text-sm">Physical Office</div>
                                <div className="text-xs text-gray-500 mt-0.5">Dubai Mainland</div>
                            </div>

                            {/* Time */}
                            <div className="col-span-2 text-center flex flex-col items-center">
                                <div className="text-[#494FBB] mb-2"><Clock size={24} /></div>
                                <div className="font-bold text-gray-900 text-sm">Processing Time</div>
                                <div className="text-xs text-gray-500 mt-0.5">3 working days</div>
                            </div>

                            {/* Action (Visual Selection) */}
                            <div className="col-span-1 flex justify-center">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedLicense === 'normal-license' ? 'border-[#494FBB] bg-[#494FBB] text-white' : 'border-gray-300'}`}>
                                    {selectedLicense === 'normal-license' && <CheckCircle2 size={16} />}
                                </div>
                            </div>

                        </div>
                    </div>


                    {/* Other Categories (Accordion style) */}
                    <div className="border border-gray-200 rounded-3xl overflow-hidden divide-y divide-gray-100">
                        {[
                            { id: 'global-trader', name: 'Global Trader License', desc: 'Restricted Activities', userType: 'UAE & GCC Only', typeIcon: User, location: 'Home Based', time: '1 working day' },
                            { id: 'sme-license', name: 'SME License', desc: 'Restricted Activities', userType: 'UAE Nationals', typeIcon: Users, location: 'Dubai Mainland', time: '1 working day' },
                            { id: 'intelaq', name: 'Intelaq License', desc: 'Home Based Business', userType: 'UAE or GCC', typeIcon: User, location: 'Home Based', time: '3 working days' },
                        ].map((lic) => (
                            <div
                                key={lic.id}
                                onClick={() => setSelectedLicense(lic.id)}
                                className={`px-6 md:px-8 py-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center hover:bg-gray-50 transition-colors cursor-pointer group ${selectedLicense === lic.id ? 'bg-indigo-50/10' : ''}`}
                            >
                                <div className="col-span-4">
                                    <h4 className={`font-bold transition-colors ${selectedLicense === lic.id ? 'text-[#494FBB]' : 'text-gray-900'}`}>{lic.name}</h4>
                                    <p className="text-xs text-gray-400 mt-1">{lic.desc}</p>
                                </div>

                                <div className="col-span-3 text-center flex flex-col items-center opacity-60">
                                    <div className="text-gray-400 mb-1"><lic.typeIcon size={18} /></div>
                                    <div className="font-medium text-gray-700 text-xs">{lic.userType}</div>
                                </div>

                                <div className="col-span-2 text-center flex flex-col items-center opacity-60">
                                    <div className="text-gray-400 mb-1"><Home size={18} /></div>
                                    <div className="font-medium text-gray-700 text-xs">{lic.location}</div>
                                </div>

                                <div className="col-span-2 text-center flex flex-col items-center opacity-60">
                                    <div className="text-gray-400 mb-1"><Hourglass size={18} /></div>
                                    <div className="font-medium text-gray-700 text-xs">{lic.time}</div>
                                </div>

                                <div className="col-span-1 flex justify-center">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedLicense === lic.id ? 'border-[#494FBB] bg-[#494FBB] text-white' : 'border-gray-200'}`}>
                                        {selectedLicense === lic.id && <CheckCircle2 size={12} />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}

export default function SolutionsPage() {
    return (
        <DashboardLayout>
            <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading recommendations...</div>}>
                <SolutionsContent />
            </Suspense>
        </DashboardLayout>
    );
}
