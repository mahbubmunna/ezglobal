'use client';

import { useBusinessSetupStore } from '@/store/businessSetupStore';
import Stepper from '@/components/business-setup/Stepper';
import Step1BusinessScope from '@/components/business-setup/Step1BusinessScope';

export default function BusinessSetupService() {
    const { currentStep } = useBusinessSetupStore();

    let content = null;

    switch (currentStep) {
        case 1:
            content = <Step1BusinessScope />;
            break;
        default:
            content = (
                <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl">
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900">Step {currentStep} Under Construction</h3>
                        <p className="text-gray-500">This step will be implemented soon.</p>
                    </div>
                </div>
            );
    }

    // Calc height: 100vh - Navbar(64px) - PaddingY(32px approx) -> Let's use flex-1
    return (
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden flex flex-col">
            {/* Header / Stepper Area */}
            <div className="pt-6 pb-2 px-4 md:px-8 border-b border-gray-50 flex-none">
                <div className="mb-4 px-2">
                    <h2 className="text-xl font-bold text-gray-900">Your business setup guide</h2>
                    <p className="text-sm text-gray-500">Global expansion simplified into 12 distinct steps.</p>
                </div>
                <Stepper />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 md:p-8 bg-white relative">
                <div className="h-full flex flex-col justify-center">
                    {content}
                </div>
            </div>
        </div>
    );
}
