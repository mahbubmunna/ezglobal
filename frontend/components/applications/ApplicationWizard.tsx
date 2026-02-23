'use client';

import { useApplicationStore } from '@/store/applicationStore';
import Step1CompanyBasics from './Step1CompanyBasics';
import Step2Stakeholders from './Step2Stakeholders';
import Step3Location from './Step3Location';
import Step4UBO from './Step4UBO';
import Step5Documents from './Step5Documents';

const STEPS = [
    { id: 1, title: 'Company Basics' },
    { id: 2, title: 'Stakeholders' },
    { id: 3, title: 'Location' },
    { id: 4, title: 'UBO Declaration' },
    { id: 5, title: 'Documents' }
];

export default function ApplicationWizard() {
    const { currentStep } = useApplicationStore();

    let StepContent = null;
    switch (currentStep) {
        case 1: StepContent = <Step1CompanyBasics />; break;
        case 2: StepContent = <Step2Stakeholders />; break;
        case 3: StepContent = <Step3Location />; break;
        case 4: StepContent = <Step4UBO />; break;
        case 5: StepContent = <Step5Documents />; break;
        default: StepContent = <Step1CompanyBasics />;
    }

    return (
        <div className="flex flex-col h-full rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
            {/* Stepper Header */}
            <div className="flex border-b border-gray-100 overflow-x-auto">
                {STEPS.map((step) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    return (
                        <div
                            key={step.id}
                            className={`flex flex-col flex-1 min-w-[120px] p-4 border-b-2 transition-all ${isActive ? 'border-[#494FBB] bg-[#494FBB]/5' :
                                    isCompleted ? 'border-[#10b981] bg-white' :
                                        'border-transparent bg-gray-50'
                                }`}
                        >
                            <span className={`text-xs font-bold mb-1 ${isActive ? 'text-[#494FBB]' : isCompleted ? 'text-[#10b981]' : 'text-gray-400'}`}>
                                STEP {step.id}
                            </span>
                            <span className={`text-sm font-semibold truncate ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                {step.title}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto p-8">
                {StepContent}
            </div>
        </div>
    );
}
