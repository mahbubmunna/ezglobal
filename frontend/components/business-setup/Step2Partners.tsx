'use client';

import { ArrowRight, ArrowLeft, Check, CornerDownRight, User } from 'lucide-react';
import { useBusinessSetupStore } from '@/store/businessSetupStore';

export default function Step2Partners() {
    const { setStep, currentStep } = useBusinessSetupStore();
    const prevStep = () => setStep(currentStep - 1);

    return (
        <div className="flex flex-col lg:flex-row gap-16 h-full items-stretch pt-4">
            {/* Left Card: Content */}
            <div className="flex-1 flex flex-col items-start pt-4">

                {/* Title */}
                <h2 className="text-5xl font-bold text-[#0F172A] mb-2 leading-[1.1] tracking-tight">
                    Initial <br />
                    Partner Details
                </h2>

                {/* Thick Divider */}
                <div className="w-16 h-1.5 bg-[#0F172A] rounded-full my-8"></div>

                {/* Description */}
                <div className="prose prose-lg text-gray-500 mb-12 max-w-xl font-light">
                    <p className="text-lg">
                        The legal framework for your entity has been tailored based on your operational activities.
                    </p>
                    <p className="text-lg mt-6">
                        Select the number and nationalities of your partners if you have any, if not skip this step. You have successfully defined the primary and secondary activities.
                    </p>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-200 w-full">
                    <button onClick={prevStep} className="flex items-center gap-2 text-gray-400 hover:text-[#0F172A] font-bold text-sm transition-colors px-2 py-2 rounded-lg hover:bg-gray-50 -ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
                        Previous Step
                    </button>
                </div>
            </div>

            {/* Right Card: Business Summary (Persistent) */}
            <div className="flex-1 flex flex-col max-w-md">
                <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col">
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-bold text-[#0F172A]">Business Summary</h3>
                        <div className="px-3 py-1 bg-green-50 text-[#10B981] text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-[#10B981] flex items-center justify-center text-white">
                                <Check size={8} strokeWidth={4} />
                            </div>
                            Verified
                        </div>
                    </div>

                    {/* Primary Activity */}
                    <div className="mb-10">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Primary Activity</h4>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#0F172A] flex items-center justify-center text-white flex-none shadow-lg shadow-[#0F172A]/20">
                                <Check size={16} />
                            </div>
                            <div>
                                <div className="font-bold text-[#0F172A] text-lg leading-tight">Software Development & Consultancy</div>
                                <div className="text-gray-400 text-xs font-mono mt-1">Class 6201 - Computer programming activities</div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Activities */}
                    <div className="flex-1">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Secondary Activities</h4>
                        <div className="space-y-6">
                            {/* Item 1 */}
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 flex-none ml-0.5">
                                    <CornerDownRight size={16} />
                                </div>
                                <div className="mt-1">
                                    <div className="font-bold text-[#0F172A] text-base leading-tight">Data Processing & Hosting</div>
                                    <div className="text-gray-400 text-xs font-mono mt-1 leading-relaxed">Class 6311 - Data processing, hosting and related</div>
                                </div>
                            </div>

                            {/* Item 2 */}
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 flex-none ml-0.5">
                                    <CornerDownRight size={16} />
                                </div>
                                <div className="mt-1">
                                    <div className="font-bold text-[#0F172A] text-base leading-tight">Business Consultancy</div>
                                    <div className="text-gray-400 text-xs font-mono mt-1 leading-relaxed">Class 7022 - Business and other management</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Meta */}
                    <div className="mt-12 pt-6 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-mono tracking-wide">
                        <div>Last saved: Just now</div>
                        <div>ID: 992-BA</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
