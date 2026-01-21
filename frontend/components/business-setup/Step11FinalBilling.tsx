'use client';

import { useBusinessSetupStore } from '@/store/businessSetupStore';

export default function Step11FinalBilling() {
    const { setStep, currentStep } = useBusinessSetupStore();
    const prevStep = () => setStep(currentStep - 1);
    return (
        <div className="flex flex-col lg:flex-row gap-16 items-start pt-4 h-full">
            <div className="flex-1 pt-4">
                <h2 className="text-5xl font-bold text-[#0F172A] mb-2">Payments</h2>
                <div className="w-16 h-1.5 bg-[#0F172A] rounded-full my-8"></div>
                <p className="mb-10 text-lg text-gray-500">Complete payment to finalize incorporation.</p>
                <div className="mt-auto pt-6 border-t border-gray-200 w-full">
                    <button onClick={prevStep} className="flex items-center gap-2 text-gray-400 hover:text-[#0F172A] font-bold text-sm transition-colors px-2 py-2 rounded-lg hover:bg-gray-50 -ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
                        Previous Step
                    </button>
                </div>
            </div>
            <div className="flex-1 bg-white rounded-[32px] border border-gray-100 h-[600px] flex items-center justify-center p-8">
                <div className="text-center">
                    <h3 className="text-xl font-bold text-[#0F172A]">Payment Gateway</h3>
                    <p className="text-gray-400 mt-2">Integration coming soon.</p>
                </div>
            </div>
        </div>
    );
}
