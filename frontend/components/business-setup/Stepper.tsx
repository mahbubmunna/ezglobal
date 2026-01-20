'use client';

import { useBusinessSetupStore } from '@/store/businessSetupStore';
import { Flag } from 'lucide-react';

export default function Stepper() {
    const { currentStep, totalSteps, setStep } = useBusinessSetupStore();

    // Design shows 1...11 and then a Finish flag.
    const steps = Array.from({ length: 11 }, (_, i) => i + 1);

    return (
        <div className="w-full overflow-x-auto pb-6 pt-4">
            <div className="flex items-center justify-between min-w-[800px] px-2">
                {steps.map((step) => {
                    const isActive = step === currentStep;
                    const isCompleted = step < currentStep;

                    return (
                        <div key={step} className="flex-1 flex items-center relative">
                            {/* Line connecting to previous */}
                            {step > 1 && (
                                <div className={`absolute top-5 right-[50%] w-full h-[2px] ${isCompleted || isActive ? 'bg-gray-200' : 'bg-gray-100'
                                    }`}></div>
                            )}
                            {/* Line connecting to next */}
                            {step < 12 && (
                                <div className={`absolute top-5 left-[50%] w-full h-[2px] ${isCompleted ? 'bg-gray-200' : 'bg-gray-100'
                                    }`}></div>
                            )}

                            <div className="relative flex flex-col items-center justify-center w-full z-10">
                                <button
                                    onClick={() => setStep(step)}
                                    className={`
                                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200
                                        ${isActive
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110'
                                            : isCompleted
                                                ? 'bg-white border border-indigo-200 text-indigo-600'
                                                : 'bg-white border border-gray-200 text-gray-400'
                                        }
                                    `}
                                >
                                    {step}
                                </button>
                                {step === 1 && (
                                    <span className={`absolute top-12 text-xs font-medium ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>Start</span>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Finish Step (12) */}
                <div className="flex-1 flex items-center relative">
                    <div className={`absolute top-5 right-[50%] w-full h-[2px] bg-gray-100`}></div>
                    <div className="relative flex flex-col items-center justify-center w-full z-10">
                        <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 bg-white
                            ${currentStep === 12
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg'
                                : 'border-gray-200 text-gray-400'
                            }
                        `}>
                            <Flag size={18} />
                        </div>
                        <span className={`absolute top-12 text-xs font-medium ${currentStep === 12 ? 'text-indigo-600' : 'text-gray-500'}`}>Finish</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
