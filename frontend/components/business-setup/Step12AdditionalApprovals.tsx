'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { useBusinessSetupStore } from '@/store/businessSetupStore';

export default function Step12AdditionalApprovals() {
    const { setStep, currentStep } = useBusinessSetupStore();
    const prevStep = () => setStep(currentStep - 1);

    const MAIN_STEPS = [
        { label: 'Start a Business', status: 'completed' },
        { label: 'Business Details', status: 'completed' },
        { label: 'Initial Approvals', status: 'completed' },
        { label: 'Legal Type', status: 'completed' },
        { label: 'License Details', status: 'completed' },
        { label: 'Partners', status: 'completed' },
    ];

    const OTHER_STEPS = [
        { label: 'Add. Requirements', status: 'active' },
        { label: 'Final License', status: 'pending' },
    ];

    const [openAccordion, setOpenAccordion] = useState<number | null>(0);

    return (
        <div className="flex flex-col lg:flex-row gap-16 items-start pt-4">
            {/* Left Card: Content */}
            <div className="flex-1 flex flex-col items-start pt-4">

                {/* Title */}
                <h2 className="text-5xl font-bold text-[#0F172A] mb-2 leading-[1.1] tracking-tight">
                    Additional <br />
                    Approvals
                </h2>

                {/* Thick Divider */}
                <div className="w-16 h-1.5 bg-[#0F172A] rounded-full my-8"></div>

                {/* Description */}
                <div className="prose prose-lg text-gray-500 mb-12 max-w-xl font-light">
                    <p className="text-lg">
                        For some licenses, external entities require additional approvals to operate. Submit the required documents and wait to get feedback from an agent when approved.
                    </p>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-200 w-full">
                    <button onClick={prevStep} className="flex items-center gap-2 text-gray-400 hover:text-[#0F172A] font-bold text-sm transition-colors px-2 py-2 rounded-lg hover:bg-gray-50 -ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
                        Previous Step
                    </button>
                </div>
            </div>

            {/* Right Card: UI */}
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
                            ezglobal.com/setup/additional-approvals
                        </div>
                    </div>

                    {/* Content Area with Sidebar */}
                    <div className="flex flex-1">
                        {/* Internal Sidebar */}
                        <div className="w-56 border-r border-gray-50 p-8 flex flex-col gap-8 hidden md:flex">
                            {/* Main Steps Group */}
                            <div>
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Main Steps</h4>
                                <div className="space-y-4">
                                    {MAIN_STEPS.map((step, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <CheckCircle2 size={14} className="text-[#10B981]" />
                                            <span className="text-[10px] font-bold leading-tight text-[#10B981]">
                                                {step.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Other Steps Group */}
                            <div className="border-t border-gray-100 pt-6">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Other Steps</h4>
                                <div className="space-y-4">
                                    {OTHER_STEPS.map((step, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            {step.status === 'active' ? (
                                                <div className="w-3.5 h-3.5 rounded-full bg-indigo-50 flex items-center justify-center">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]"></div>
                                                </div>
                                            ) : (
                                                <Circle size={14} className="text-gray-200" />
                                            )}
                                            <span className={`text-[10px] font-bold leading-tight ${step.status === 'active' ? 'text-[#4F46E5]' : 'text-gray-300'}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 p-8 flex flex-col relative bg-gray-50/10">
                            <h3 className="text-lg font-bold text-[#0F172A] mb-8">Additional Requirement</h3>

                            <div className="space-y-4">
                                {/* Accordion Item 1 */}
                                <div className="bg-white border hover:border-indigo-200 border-indigo-100 rounded-xl shadow-sm transition-all overflow-hidden">
                                    <button
                                        onClick={() => setOpenAccordion(openAccordion === 0 ? null : 0)}
                                        className="w-full flex items-center justify-between p-5 text-left"
                                    >
                                        <span className="text-sm font-bold text-[#0F172A]">Alan M. Coolidge</span>
                                        {openAccordion === 0 ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                                    </button>

                                    {openAccordion === 0 && (
                                        <div className="px-5 pb-6 pt-0">
                                            <div className="h-px bg-gray-50 mb-4"></div>
                                            <p className="text-xs text-gray-500 mb-6">
                                                Your Emirates ID is required for further process
                                            </p>
                                            <input
                                                type="text"
                                                placeholder="Please enter Emirates Id Number"
                                                className="w-full h-10 px-0 border-b border-gray-200 text-sm font-medium text-[#0F172A] focus:border-[#4F46E5] outline-none transition-all placeholder:text-gray-300"
                                            />
                                        </div>
                                    )}
                                    {openAccordion === 0 && (
                                        <div className="w-1 h-full absolute left-0 top-0 bg-[#4F46E5] rounded-l-xl"></div>
                                    )}
                                    {openAccordion === 0 && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#4F46E5]"></div>
                                    )}
                                    {/* Simple blue bar on left for active card */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${openAccordion === 0 ? 'bg-[#4F46E5]' : 'bg-transparent'}`}></div>
                                    {/* Wait, the above absolute positioning is relative to what? Need relative on parent */}
                                </div>

                                {/* Accordion Item 2 */}
                                <div className="bg-white border border-gray-100 rounded-xl shadow-sm transition-all overflow-hidden relative">
                                    <button
                                        onClick={() => setOpenAccordion(openAccordion === 1 ? null : 1)}
                                        className="w-full flex items-center justify-between p-5 text-left"
                                    >
                                        <span className="text-sm font-bold text-[#0F172A]">Additional Requirements</span>
                                        {openAccordion === 1 ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                                    </button>
                                    {openAccordion === 1 && (
                                        <div className="px-5 pb-6 pt-0">
                                            <div className="h-px bg-gray-50 mb-4"></div>
                                            <p className="text-xs text-gray-500">No additional requirements currently.</p>
                                        </div>
                                    )}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${openAccordion === 1 ? 'bg-[#4F46E5]' : 'bg-transparent'}`}></div>
                                </div>
                            </div>


                            {/* Footer Actions */}
                            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6 mt-auto">
                                <button className="px-5 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                                    Back
                                </button>
                                <button className="px-5 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                                    Save and exit
                                </button>
                                <Link href="/dashboard" className="px-6 py-2 rounded-lg bg-[#4F46E5] text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                                    Next
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
