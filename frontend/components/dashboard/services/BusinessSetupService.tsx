'use client';

import Link from 'next/link';
import { useBusinessSetupStore } from '@/store/businessSetupStore';
import Stepper from '@/components/business-setup/Stepper';
import Step1BusinessScope from '@/components/business-setup/Step1BusinessScope';
import Step2Partners from '@/components/business-setup/Step2Partners';
import Step3LegalStructure from '@/components/business-setup/Step3LegalStructure';
import Step4LicenseType from '@/components/business-setup/Step4LicenseType';
import Step5LicenseDetails from '@/components/business-setup/Step5LicenseDetails';
import Step6InvestorProfile from '@/components/business-setup/Step6InvestorProfile';
import Step7InitialApproval from '@/components/business-setup/Step7InitialApproval';
import Step8BusinessName from '@/components/business-setup/Step8BusinessName';
import Step9Preparation from '@/components/business-setup/Step9Preparation';
import Step10Documents from '@/components/business-setup/Step10Documents';
import Step11FinalBilling from '@/components/business-setup/Step11FinalBilling';
import Step12AdditionalApprovals from '@/components/business-setup/Step12AdditionalApprovals';

export default function BusinessSetupService() {
    const { currentStep, setStep } = useBusinessSetupStore();

    // Content selection
    let content = null;
    let stepTitle = "";

    switch (currentStep) {
        case 1:
            stepTitle = "Define Your Business Scope";
            content = <Step1BusinessScope />;
            break;
        case 2:
            stepTitle = "Initial Partner Details";
            content = <Step2Partners />;
            break;
        case 3:
            stepTitle = "Determine Legal Structure";
            content = <Step3LegalStructure />;
            break;
        case 4:
            stepTitle = "License Type";
            content = <Step4LicenseType />;
            break;
        case 5:
            stepTitle = "License Details";
            content = <Step5LicenseDetails />;
            break;
        case 6:
            stepTitle = "Investor Profile";
            content = <Step6InvestorProfile />;
            break;
        case 7:
            stepTitle = "Review for Initial Approval";
            content = <Step7InitialApproval />;
            break;
        case 8:
            stepTitle = "Reserve Trade Name";
            content = <Step8BusinessName />;
            break;
        case 9:
            stepTitle = "Approvals";
            content = <Step9Preparation />;
            break;
        case 10:
            stepTitle = "Final Review";
            content = <Step10Documents />;
            break;
        case 11:
            stepTitle = "Payments";
            content = <Step11FinalBilling />;
            break;
        case 12:
            stepTitle = "Additional Approvals";
            content = <Step12AdditionalApprovals />;
            break;
        default:
            stepTitle = "Business Setup";
            content = (
                <div className="flex items-center justify-center h-full min-h-[400px] border-2 border-dashed border-gray-200 rounded-3xl bg-white">
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900">Step {currentStep} Under Construction</h3>
                        <p className="text-gray-500">This step will be implemented soon.</p>
                    </div>
                </div>
            );
    }

    // Calculate progress
    const nextStep = () => {
        if (currentStep < 12) setStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setStep(currentStep - 1);
    };

    return (
        <div className="flex flex-col h-full gap-8 px-12 pt-8">
            {/* Page Header Row */}
            <div className="flex items-end justify-between">
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Business Setup</h4>
                    <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Step {currentStep} of 12</h1>
                </div>

                {/* Top Controls */}
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                    <div className="px-4 border-r border-gray-200">
                        <span className="text-sm font-bold text-[#494FBB]">{currentStep}</span>
                        <span className="text-sm font-medium text-gray-400"> / 12</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 disabled:opacity-50 disabled:hover:bg-transparent"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                        <button
                            onClick={nextStep}
                            disabled={currentStep === 12}
                            className="bg-[#494FBB] hover:opacity-90 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#494FBB]/20 disabled:opacity-50 disabled:shadow-none"
                        >
                            <span>Next Step</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Stepper Area */}
            <div className="w-full flex-none">
                <Stepper />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0">
                {content}
            </div>


        </div>
    );
}
