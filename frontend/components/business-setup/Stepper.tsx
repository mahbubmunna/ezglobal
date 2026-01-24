'use client';

import { useBusinessSetupStore } from '@/store/businessSetupStore';

export default function Stepper() {
    const { currentStep, setStep } = useBusinessSetupStore();

    // Generate 12 steps
    const steps = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <div className="w-full overflow-x-auto pt-6 pb-12 px-4 scrollbar-hide">
            <div className="flex items-center justify-between min-w-[1000px] relative">

                {steps.map((step) => {
                    const isActive = step === currentStep;
                    const isCompleted = step < currentStep;

                    // Specific Logic for Lines
                    // If this step is completed, the line AFTER it should be green (unless it's the last step)
                    // If this step is active, the line BEFORE it is green.

                    return (
                        <div key={step} className="flex-1 flex flex-col items-center relative">
                            {/* Connecting Line */}
                            {step < 12 && (
                                <div className={`absolute top-[18px] left-1/2 w-full h-[3px] z-0 ${isCompleted ? 'bg-[#10B981]' : 'bg-gray-300'
                                    }`}></div>
                            )}

                            <div className="relative flex flex-col items-center z-10 px-2">
                                <button
                                    onClick={() => setStep(step)}
                                    className={`
                                        w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 relative
                                        ${isActive
                                            ? 'bg-[#4F46E5] text-white shadow-lg shadow-indigo-100 ring-4 ring-indigo-50 scale-110'
                                            : isCompleted
                                                ? 'bg-[#10B981] text-white ring-4 ring-white'
                                                : 'bg-white border-2 border-gray-200 text-gray-400'
                                        }
                                    `}
                                >
                                    {isCompleted ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    ) : (
                                        step.toString().padStart(2, '0')
                                    )}
                                </button>

                                {/* Labels */}
                                {isActive && (
                                    <span className="absolute top-12 text-[10px] font-bold text-[#4F46E5] uppercase tracking-wide whitespace-nowrap">
                                        Current
                                    </span>
                                )}
                                {isCompleted && step === 1 && ( // Just showing logic for specific labels if needed, or all completed
                                    <span className="absolute top-12 text-[10px] font-bold text-[#10B981] uppercase tracking-wide whitespace-nowrap">
                                        Step {step.toString().padStart(2, '0')}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
