'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useBusinessSetupStore } from '@/store/businessSetupStore';

export default function Step8BusinessName() {
    const { setStep, currentStep } = useBusinessSetupStore();
    const prevStep = () => setStep(currentStep - 1);
    return (
        <div className="flex flex-col lg:flex-row gap-16 items-start pt-4">
            {/* Left Card: Content */}
            <div className="flex-1 flex flex-col items-start pt-4">
                <h2 className="text-5xl font-bold text-[#0F172A] mb-2 leading-[1.1] tracking-tight">
                    Reserve <br />
                    Trade Name
                </h2>
                <div className="w-16 h-1.5 bg-[#0F172A] rounded-full my-8"></div>
                <div className="prose prose-lg text-gray-500 mb-12 max-w-xl font-light">
                    <p className="text-lg">
                        Provide up to 3 options for your business name. The authorities will review them regarding availability and compliance.
                    </p>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-200 w-full">
                    <button onClick={prevStep} className="flex items-center gap-2 text-gray-400 hover:text-[#0F172A] font-bold text-sm transition-colors px-2 py-2 rounded-lg hover:bg-gray-50 -ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
                        Previous Step
                    </button>
                </div>
            </div>

            {/* Right Card */}
            <div className="flex-1 flex flex-col pt-4 w-full">
                <div className="bg-white rounded-[32px] border border-gray-100 flex flex-col shadow-sm overflow-hidden min-h-[640px]">
                    {/* Browser Address Bar Mock */}
                    <div className="bg-gray-50/50 border-b border-gray-100 p-4 flex items-center gap-4">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-300"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-300"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-300"></div>
                        </div>
                        <div className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-1.5 text-[10px] text-gray-400 font-mono flex items-center justify-center gap-2">
                            ezglobal.com/setup/business-name
                        </div>
                    </div>

                    <div className="p-8">
                        <h3 className="text-lg font-bold text-[#0F172A] mb-8">Business Name Options</h3>

                        <div className="space-y-6">
                            {['Option 1', 'Option 2', 'Option 3'].map((opt, i) => (
                                <div key={i} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{opt}</div>
                                    <div className="gap-4 grid grid-cols-2">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 mb-1 block">English Name</label>
                                            <input type="text" placeholder="e.g. EZ Global" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 outline-none" />
                                        </div>
                                        <div className="text-right">
                                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Arabic Name</label>
                                            <input type="text" placeholder="مثال" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 outline-none text-right" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
