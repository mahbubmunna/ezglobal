'use client';

import { Plus, MoreHorizontal } from 'lucide-react';
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

            {/* Right Card: Partner Management */}
            <div>
                <div className="flex-1 flex flex-col w-full">
                    <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col h-full min-h-[500px] relative">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-[#0F172A]">Partner Management</h3>
                                <p className="text-gray-400 mt-1">Manage individuals and corporate partners</p>
                            </div>
                            <button className="bg-[#494FBB] hover:bg-[#3f44a5] text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-[#494FBB]/20">
                                <Plus size={16} strokeWidth={3} />
                                Add Partner
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center gap-8 border-b border-gray-100 mb-8">
                            <button className="pb-3 border-b-2 border-[#0F172A] text-[#0F172A] font-bold text-sm">
                                All Partners
                            </button>
                            <button className="pb-3 border-b-2 border-transparent text-gray-400 font-medium text-sm hover:text-gray-600 transition-colors">
                                Individual
                            </button>
                            <button className="pb-3 border-b-2 border-transparent text-gray-400 font-medium text-sm hover:text-gray-600 transition-colors">
                                Corporate
                            </button>
                        </div>

                        {/* Table Headers */}
                        <div className="grid grid-cols-12 gap-4 mb-4 px-4">
                            <div className="col-span-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">NAME / EMAIL</div>
                            <div className="col-span-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">NATIONALITY</div>
                            <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">STAKE</div>
                        </div>

                        {/* Partner List */}
                        <div className="space-y-3 mb-8">
                            {/* Partner 1 */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-6 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-[#494FBB] flex items-center justify-center font-bold text-sm">JD</div>
                                        <div>
                                            <div className="font-bold text-[#0F172A] text-sm">John Doe</div>
                                            <div className="text-gray-400 text-xs mt-0.5">john@example.com</div>
                                        </div>
                                    </div>
                                    <div className="col-span-4 text-sm font-medium text-[#0F172A]">United States</div>
                                    <div className="col-span-2 text-right font-bold text-[#494FBB]">60%</div>
                                </div>
                                <button className="ml-4 text-gray-300 hover:text-gray-600 transition-colors">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>

                            {/* Partner 2 */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-6 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">AS</div>
                                        <div>
                                            <div className="font-bold text-[#0F172A] text-sm">Amira Salem</div>
                                            <div className="text-gray-400 text-xs mt-0.5">amira.s@global.ae</div>
                                        </div>
                                    </div>
                                    <div className="col-span-4 text-sm font-medium text-[#0F172A]">UAE</div>
                                    <div className="col-span-2 text-right font-bold text-[#494FBB]">40%</div>
                                </div>
                                <button className="ml-4 text-gray-300 hover:text-gray-600 transition-colors">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Add Another Partner Placeholder */}
                        <button className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 font-medium text-sm hover:border-[#494FBB] hover:text-[#494FBB] hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2 mb-auto">
                            <Plus size={16} />
                            Add another partner to the list
                        </button>
                    </div>
                    <div className='mb-16'></div>
                </div>
            </div>
        </div>
    );
}
