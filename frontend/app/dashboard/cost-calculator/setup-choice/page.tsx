'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Rocket, Bookmark, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PageTransition from '@/components/PageTransition';

function SetupChoiceContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [choice, setChoice] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [costResult, setCostResult] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);

    const handleStart = async () => {
        if (!choice) return;

        setIsLoading(true);
        try {
            const params = {
                activity: searchParams.get('activity'),
                partners: searchParams.get('partners'),
                origin: searchParams.get('origin'),
                entity: searchParams.get('entity'),
                license: searchParams.get('license'),
                journey: choice
            };

            const res = await fetch('/api/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
            });

            if (res.ok) {
                const data = await res.json();
                setCostResult(data);
                setShowModal(true);
            }
        } catch (error) {
            console.error("Calculation failed", error);
            alert("Failed to calculate costs. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8">
            <PageTransition>

                {/* Main Card Container */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 min-h-[500px] flex flex-col relative">

                    {/* Header Actions */}
                    <div className="absolute top-8 right-8 flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="bg-white border border-gray-200 px-5 py-2 rounded-xl font-medium text-gray-600 hover:text-[#0F172A] hover:border-gray-300 transition-colors text-sm"
                        >
                            Back
                        </button>
                    </div>

                    {/* Title Section */}
                    <div className="mb-8 mt-2">
                        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Chart Your Business Path</h1>
                        <p className="text-gray-500 text-base">Select how you would like to begin your venture in Dubai.</p>
                    </div>

                    {/* Choice Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-5xl">
                        {/* Option 1: Launch New Venture */}
                        <div
                            onClick={() => setChoice('new-business')}
                            className={`cursor-pointer rounded-2xl border-2 p-6 h-56 flex flex-col justify-between transition-all duration-300 group relative ${choice === 'new-business'
                                ? 'border-[#494FBB] shadow-lg shadow-indigo-50 ring-1 ring-[#494FBB] bg-white'
                                : 'border-gray-100 hover:border-gray-200 hover:shadow-md bg-white'
                                }`}
                        >
                            {/* Top Section */}
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-[#494FBB]">
                                    <Rocket size={24} />
                                </div>

                                {/* Radio Circle */}
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${choice === 'new-business' ? 'border-[#494FBB]' : 'border-gray-200'}`}>
                                    {choice === 'new-business' && <div className="w-3 h-3 rounded-full bg-[#494FBB]" />}
                                </div>
                            </div>

                            {/* Text Section */}
                            <div>
                                <h3 className="text-lg font-bold text-[#0F172A] mb-2">Launch a New Business Venture</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Start fresh by establishing a new company. Ideal for entrepreneurs ready to kickstart operations.
                                </p>
                            </div>
                        </div>

                        {/* Option 2: Reserve Name */}
                        <div
                            onClick={() => setChoice('reserve-name')}
                            className={`cursor-pointer rounded-2xl border-2 p-6 h-56 flex flex-col justify-between transition-all duration-300 group relative ${choice === 'reserve-name'
                                ? 'border-[#494FBB] shadow-lg shadow-indigo-50 ring-1 ring-[#494FBB] bg-white'
                                : 'border-gray-100 hover:border-gray-200 hover:shadow-md bg-white'
                                }`}
                        >
                            {/* Top Section */}
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                    <Bookmark size={24} />
                                </div>

                                {/* Radio Circle */}
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${choice === 'reserve-name' ? 'border-[#494FBB]' : 'border-gray-200'}`}>
                                    {choice === 'reserve-name' && <div className="w-3 h-3 rounded-full bg-[#494FBB]" />}
                                </div>
                            </div>

                            {/* Text Section */}
                            <div>
                                <h3 className="text-lg font-bold text-[#0F172A] mb-2">Secure a Business Name Reservation</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Not ready to launch? Reserve your trade name now to protect your brand identity.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-auto flex justify-end">
                        <button
                            onClick={handleStart}
                            disabled={!choice || isLoading}
                            className={`px-10 py-3 rounded-xl font-bold text-lg flex items-center gap-2 transition-all shadow-lg ${choice && !isLoading ? 'bg-[#494FBB] hover:bg-[#3e44a6] text-white shadow-indigo-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}`}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="animate-spin" size={20} />
                                    <span className="animate-pulse">Analyzing...</span>
                                </div>
                            ) : (
                                <>
                                    Start <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </PageTransition>

            {/* Results Modal */}
            {showModal && costResult && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Estimated Cost Breakdown</h2>
                            <p className="text-gray-500 text-sm mb-6">Based on your selections for {searchParams.get('activity')}</p>

                            <div className="space-y-4 mb-8">
                                {costResult.breakdown.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 pb-3 last:border-0">
                                        <span className="text-gray-600">{item.label}</span>
                                        <span className="font-semibold text-[#0F172A]">{item.amount.toLocaleString()} AED</span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-indigo-50 p-6 rounded-xl flex justify-between items-center mb-8">
                                <span className="text-[#494FBB] font-bold">Total Estimated Cost</span>
                                <span className="text-2xl font-bold text-[#494FBB]">{costResult.total.toLocaleString()} AED</span>
                            </div>

                            <button
                                onClick={() => router.push('/dashboard/cost-calculator')}
                                className="w-full bg-[#0F172A] text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors"
                            >
                                Close & Return
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default function SetupChoicePage() {
    return (
        <DashboardLayout>
            <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading details...</div>}>
                <SetupChoiceContent />
            </Suspense>
        </DashboardLayout>
    );
}
