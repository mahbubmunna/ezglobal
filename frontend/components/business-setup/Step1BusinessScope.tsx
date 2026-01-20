'use client';

import { useBusinessSetupStore } from '@/store/businessSetupStore';
import { ChevronRight, Lock, Bot, Image as ImageIcon } from 'lucide-react';

export default function Step1BusinessScope() {
    // const { data, updateData, nextStep } = useBusinessSetupStore();

    return (
        <div className="flex flex-col lg:flex-row gap-12 text-left h-full">
            {/* Left Content */}
            <div className="flex-1 flex flex-col h-full justify-center lg:py-8 lg:pl-4">
                <div className="flex items-center justify-between mb-8">
                    <div className="text-indigo-600 font-bold">1/12</div>
                    {/* Navigation Buttons (Moved to Top) */}
                    <div className="flex gap-4">
                        <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                            <ChevronRight className="rotate-180" />
                        </button>
                        <button className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                            <ChevronRight />
                        </button>
                    </div>
                </div>

                <h2 className="text-4xl font-bold text-gray-900 mb-2">Define Your</h2>
                <h2 className="text-4xl font-bold text-indigo-600 mb-8">Business Scope</h2>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    To tailor the legal framework for your entity, we need to understand your primary and secondary operational activities.
                </p>
                <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                    Select activities that best describe what your business will be conducting. Secondary activities allow for future expansion without re-filing.
                </p>

                {/* Bottom Spacer instead of buttons */}
                <div className="mt-8"></div>
            </div>

            {/* Right Side: Placeholder Container for Screenshot */}
            <div className="flex-1 max-w-xl h-full flex flex-col">
                <div className="flex-1 bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col">
                    {/* Browser Header */}
                    <div className="bg-gray-50/50 border-b border-gray-100 p-4 flex items-center gap-4">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-1.5 text-xs text-gray-400 flex items-center gap-2">
                            <Lock size={10} />
                            secure.ezglobal.com/setup/activities
                        </div>
                    </div>

                    {/* Screenshot Placeholder Content */}
                    <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center p-8 text-center border-t border-gray-100">
                        <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-4 text-indigo-200 border-4 border-white shadow-sm">
                            <ImageIcon size={32} />
                        </div>
                        <h3 className="text-gray-400 font-medium mb-2">Screenshot Placeholder</h3>
                        <p className="text-gray-300 text-sm max-w-[200px]">
                            This area will contain the screenshot of the activity selection interface as per the design.
                        </p>
                    </div>
                </div>


            </div>
        </div>
    );
}
