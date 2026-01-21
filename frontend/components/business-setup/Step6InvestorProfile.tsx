'use client';

import { useState } from 'react';
import { X, ChevronDown, Upload, FileText } from 'lucide-react';
import { useBusinessSetupStore } from '@/store/businessSetupStore';

export default function Step6InvestorProfile() {
    const { setStep, currentStep } = useBusinessSetupStore();
    const prevStep = () => setStep(currentStep - 1);
    return (
        <div className="flex flex-col lg:flex-row gap-16 items-start pt-4">
            {/* Left Card: Content */}
            <div className="flex-1 flex flex-col items-start pt-4">

                {/* Title */}
                <h2 className="text-5xl font-bold text-[#0F172A] mb-2 leading-[1.1] tracking-tight">
                    Investor <br />
                    Profile
                </h2>

                {/* Thick Divider */}
                <div className="w-16 h-1.5 bg-[#0F172A] rounded-full my-8"></div>

                {/* Description */}
                <div className="prose prose-lg text-gray-500 mb-12 max-w-xl font-light">
                    <p className="text-lg">
                        Enter the respective details of each of your partners. Please ensure all residency and address details are accurate as per your official documents.
                    </p>
                    <p className="text-lg mt-6">
                        You will need to provide the Emirate, Area, Makani number, and building details. Don't forget to upload a Non-Objection Certificate (NOC) if required for your profile.
                    </p>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-200 w-full">
                    <button onClick={prevStep} className="flex items-center gap-2 text-gray-400 hover:text-[#0F172A] font-bold text-sm transition-colors px-2 py-2 rounded-lg hover:bg-gray-50 -ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
                        Previous Step
                    </button>
                </div>
            </div>

            {/* Right Card: UI for Investor Profile Form */}
            <div className="flex-1 flex flex-col mb-16 pt-4 w-full">
                <div className="bg-white rounded-[32px] border border-gray-100 flex flex-col shadow-sm overflow-hidden min-h-[640px]">

                    {/* Browser Address Bar Mock */}
                    <div className="bg-gray-50/50 border-b border-gray-100 p-4 flex items-center gap-4">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-300"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-300"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-300"></div>
                        </div>
                        <div className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-1.5 text-[10px] text-gray-400 font-mono flex items-center justify-center gap-2">
                            ezglobal.com/setup/partner-details/investor-profile
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-8">
                        {/* Card Wrapper for Profile */}
                        <div className="rounded-2xl border border-gray-100 shadow-sm p-6 bg-white relative">
                            {/* Close Icon (Mock) */}
                            <button className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>

                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">INVESTOR PROFILE</h3>
                            <h2 className="text-xl font-bold text-[#0F172A] mb-8">Laura A. Gambon</h2>

                            <div className="space-y-6">
                                {/* Row 1 */}
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Emirate*</label>
                                        <div className="relative">
                                            <select className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-medium text-[#0F172A] focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all appearance-none bg-white">
                                                <option>Dubai</option>
                                                <option>Abu Dhabi</option>
                                            </select>
                                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Area (Optional)</label>
                                        <div className="relative">
                                            <select className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-medium text-[#0F172A] focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all appearance-none bg-white">
                                                <option>Al Barsha</option>
                                                <option>Jumeirah</option>
                                            </select>
                                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Row 2 */}
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Makani (Optional)</label>
                                        <input
                                            type="text"
                                            defaultValue="39402 85932"
                                            className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-medium text-[#0F172A] focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Villa / Apartment Number (Optional)</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Address"
                                            className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-medium text-[#0F172A] focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* Row 3 */}
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Building Number (Optional)</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Address"
                                            className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-medium text-[#0F172A] focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all placeholder:text-gray-400"
                                        />
                                    </div>
                                    <div className="flex-1"></div>
                                </div>

                                {/* Upload Section */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Non-Objection Certificate (NOC)</label>
                                    <div className="border border-gray-100 rounded-xl bg-gray-50/50 p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                                                <FileText size={18} />
                                            </div>
                                            <div className="text-xs font-medium text-gray-500">Upload Document</div>
                                        </div>
                                        <button className="flex items-center gap-1 text-[10px] font-bold text-[#4F46E5] bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
                                            Click to upload
                                            <Upload size={10} />
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2">File name should not contain special characters. Max file size 8MB. Supported formats: PDF, PNG, JPG.</p>
                                </div>

                                {/* Footer Actions */}
                                <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-[#4F46E5] transition-colors"></div>
                                        <span className="text-xs font-medium text-gray-500 group-hover:text-gray-700">Manager (Optional)</span>
                                    </label>

                                    <div className="flex gap-3">
                                        <button className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                                            Back
                                        </button>
                                        <button className="px-6 py-2 rounded-lg bg-[#0F172A] text-white text-xs font-bold hover:bg-black transition-colors shadow-lg shadow-gray-200">
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
