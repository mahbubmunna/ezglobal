'use client';

import { useState } from 'react';
import { Pencil, ChevronDown, Check } from 'lucide-react';
import { useBusinessSetupStore } from '@/store/businessSetupStore';

export default function Step5LicenseDetails() {
    const { setStep, currentStep } = useBusinessSetupStore();
    const prevStep = () => setStep(currentStep - 1);
    return (
        <div className="flex flex-col lg:flex-row gap-16 items-start pt-4">
            {/* Left Card: Content */}
            <div className="flex-1 flex flex-col items-start pt-4">

                {/* Title */}
                <h2 className="text-5xl font-bold text-[#0F172A] mb-2 leading-[1.1] tracking-tight">
                    License <br />
                    Details
                </h2>

                {/* Thick Divider */}
                <div className="w-16 h-1.5 bg-[#0F172A] rounded-full my-8"></div>

                {/* Description */}
                <div className="prose prose-lg text-gray-500 mb-12 max-w-xl font-light">
                    <p className="text-lg">
                        Please provide the necessary details to complete your license profile. This includes verifying your contact information and defining your company's operational parameters such as duration and quorum requirements.
                    </p>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-200 w-full">
                    <button onClick={prevStep} className="flex items-center gap-2 text-gray-400 hover:text-[#0F172A] font-bold text-sm transition-colors px-2 py-2 rounded-lg hover:bg-gray-50 -ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
                        Previous Step
                    </button>
                </div>
            </div>

            {/* Right Card: UI for License Profile Form */}
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
                            ezglobal.com/setup/license-details
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-8">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-[#0F172A]">License Profile</h3>
                            <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                                <Pencil size={14} />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="space-y-6">

                            {/* Email */}
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Company Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        defaultValue="a.coolidge@email.com"
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-medium text-[#0F172A] focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all placeholder:text-gray-300"
                                    />
                                    <button className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3 bg-indigo-50 text-[#4F46E5] text-[10px] font-bold rounded-lg hover:bg-indigo-100 transition-colors">
                                        GET OTP
                                    </button>
                                </div>
                            </div>

                            {/* Mobile */}
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Company Mobile Number</label>
                                <div className="flex gap-3">
                                    <button className="h-12 w-20 px-3 rounded-xl border border-gray-200 flex items-center justify-between text-sm font-medium text-[#0F172A] hover:bg-gray-50 transition-colors">
                                        {/* Minimal Flag Representation */}
                                        <div className="flex items-center gap-1">
                                            <div className="h-4 w-0.5 bg-green-500 rounded-full"></div>
                                            <div className="h-4 w-0.5 bg-red-500 rounded-full"></div>
                                        </div>
                                        <ChevronDown size={14} className="text-gray-400" />
                                    </button>
                                    <div className="relative flex-1">
                                        <input
                                            type="tel"
                                            defaultValue="50 123 4567"
                                            className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-medium text-[#0F172A] focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all placeholder:text-gray-300"
                                        />
                                        <button className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3 bg-indigo-50 text-[#4F46E5] text-[10px] font-bold rounded-lg hover:bg-indigo-100 transition-colors">
                                            GET OTP
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Row 1: Duration & Tenure */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Company Duration (Year)</label>
                                    <input
                                        type="number"
                                        defaultValue="99"
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-medium text-[#0F172A] focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Director Tenure</label>
                                    <input
                                        type="number"
                                        defaultValue="5"
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-medium text-[#0F172A] focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Row 2: Authority & Quorum 1 */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Dispute Settlement Authority</label>
                                    <div className="relative">
                                        <select className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-medium text-[#0F172A] focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all appearance-none bg-white">
                                            <option>Dubai Court</option>
                                            <option>DIFC Court</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Required Quorum For Decisions</label>
                                    <input
                                        type="number"
                                        defaultValue="75"
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-medium text-[#0F172A] focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Row 3: Quorum 2 & 3 */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Quorum To Dismiss Director</label>
                                    <input
                                        type="number"
                                        defaultValue="75"
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-medium text-[#0F172A] focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Quorum To Modify MOA</label>
                                    <input
                                        type="number"
                                        defaultValue="75"
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-medium text-[#0F172A] focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Row 4: Quorum 4 */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Quorum To Liquidate</label>
                                    <input
                                        type="number"
                                        defaultValue="75"
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-medium text-[#0F172A] focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all"
                                    />
                                </div>
                                <div className="flex-1">
                                    {/* Spacer */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
