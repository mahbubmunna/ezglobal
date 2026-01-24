'use client';

import { Clock, CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';
import { useBusinessSetupStore } from '@/store/businessSetupStore';

export default function Step7InitialApproval() {
    const { setStep, currentStep } = useBusinessSetupStore();
    const prevStep = () => setStep(currentStep - 1);

    const MAIN_STEPS = [
        { label: 'Start a Business', status: 'completed' },
        { label: 'Business Details', status: 'completed' },
        { label: 'Legal Type', status: 'completed' },
        { label: 'License Details', status: 'completed' },
        { label: 'Partner Details', status: 'completed' },
        { label: 'Initial Approval Fee', status: 'active' },
        { label: 'Business Name', status: 'pending' },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-16 items-start pt-4">
            {/* Left Card: Content */}
            <div className="flex-1 flex flex-col items-start pt-4">

                {/* Title */}
                <h2 className="text-5xl font-bold text-[#0F172A] mb-2 leading-[1.1] tracking-tight">
                    Review for <br />
                    Initial <br />
                    Approval
                </h2>

                {/* Thick Divider */}
                <div className="w-16 h-1.5 bg-[#0F172A] rounded-full my-8"></div>

                {/* Description */}
                <div className="prose prose-lg text-gray-500 mb-12 max-w-xl font-light">
                    <p className="text-lg">
                        For some licenses you will require an initial approval to proceed. Initial approval certificates are also required should you wish to register a new business location (Ejari) for your business.
                    </p>
                    <p className="text-lg mt-6">
                        Please review the details. Your request will be under review and you should be updated within 72 hours.
                    </p>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-200 w-full">
                    <button onClick={prevStep} className="flex items-center gap-2 text-gray-400 hover:text-[#0F172A] font-bold text-sm transition-colors px-2 py-2 rounded-lg hover:bg-gray-50 -ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
                        Previous Step
                    </button>
                </div>
            </div>

            {/* Right Card: UI for Initial Approval Status */}
            <div className="flex-1 flex flex-col pt-4 mb-16 w-full">
                <div className="bg-white rounded-[32px] border border-gray-100 flex flex-col shadow-sm overflow-hidden min-h-[500px]">

                    {/* Browser Address Bar Mock */}
                    <div className="bg-gray-50/50 border-b border-gray-100 p-4 flex items-center gap-4">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-300"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-300"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-300"></div>
                        </div>
                        <div className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-1.5 text-[10px] text-gray-400 font-mono flex items-center justify-center gap-2">
                            ezglobal.com/setup/initial-approval
                        </div>
                    </div>

                    {/* Content Area with Sidebar */}
                    <div className="flex flex-1">
                        {/* Internal Sidebar */}
                        <div className="w-56 border-r border-gray-50 p-8 flex flex-col gap-6 hidden md:flex">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Main Steps</h4>
                            <div className="space-y-4">
                                {MAIN_STEPS.map((step, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        {step.status === 'completed' ? (
                                            <CheckCircle2 size={14} className="text-[#10B981]" />
                                        ) : step.status === 'active' ? (
                                            <div className="w-3.5 h-3.5 rounded-full bg-indigo-50 flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]"></div>
                                            </div>
                                        ) : (
                                            <Circle size={14} className="text-gray-200" />
                                        )}
                                        <span className={`text-[10px] font-bold leading-tight ${step.status === 'active' ? 'text-[#4F46E5]' :
                                            step.status === 'completed' ? 'text-[#10B981]' : 'text-gray-300'
                                            }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Main Status Area */}
                        <div className="flex-1 p-8 flex flex-col relative">
                            <h3 className="text-lg font-bold text-[#0F172A] mb-8">Initial Approval Fee</h3>

                            {/* Center Status */}
                            <div className="flex-1 flex flex-col items-center justify-center text-center -mt-10">
                                <div className="w-24 h-24 rounded-full bg-yellow-50 flex items-center justify-center mb-6 relative">
                                    <Clock size={48} className="text-yellow-500" />
                                    <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full"></div>
                                </div>
                                <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Pending Initial Approval</h2>
                                <p className="text-xs text-gray-500 max-w-[280px] leading-relaxed">
                                    Thank you for confirming the details. Your request is under review and you should be updated within 72 hours.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
