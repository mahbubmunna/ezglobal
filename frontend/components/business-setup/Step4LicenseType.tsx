'use client';

import { useState } from 'react';
import { Users, Building, MapPin, Home } from 'lucide-react';
import { useBusinessSetupStore } from '@/store/businessSetupStore';

export default function Step4LicenseType() {
    const { setStep, currentStep } = useBusinessSetupStore();
    const prevStep = () => setStep(currentStep - 1);
    const [selectedType, setSelectedType] = useState('SME');

    const LICENSE_TYPES = [
        {
            id: 'DED',
            label: 'DED Trader',
            subtitle: 'Restricted Activities',
            partners: { icon: Users, text: 'Citizens & Residents' },
            workplace: { icon: Home, text: 'Home Location' },
            location: { icon: MapPin, text: 'Dubai' },
            privileges: null,
            badge: 'Available for citizens and residents freelancers in Dubai'
        },
        {
            id: 'SME',
            label: 'SME License',
            subtitle: 'Restricted Activities',
            partners: { icon: Users, text: 'UAE & GCC' },
            workplace: { icon: Building, text: 'Physical Location' },
            location: { icon: MapPin, text: 'Dubai' },
            privileges: 'The UAE national owner can hire 3 employees and pay the basic fees only for visa insurance.',
            badge: null
        },
        {
            id: 'Normal',
            label: 'Normal License',
            subtitle: 'All Business Activities',
            partners: { icon: Users, text: 'All Nationalities' },
            workplace: { icon: Building, text: 'Physical Location' },
            location: { icon: MapPin, text: 'Dubai' },
            privileges: null,
            badge: null
        },
        {
            id: 'Intelaq',
            label: 'Intelaq License',
            subtitle: 'Restricted Activities',
            partners: { icon: Users, text: 'UAE & GCC' },
            workplace: { icon: Home, text: 'Home Location' },
            location: { icon: MapPin, text: 'Dubai' },
            privileges: null,
            badge: null
        }
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-16 items-start pt-4">
            {/* Left Card: Content */}
            <div className="flex-1 flex flex-col items-start pt-4">

                {/* Title */}
                <h2 className="text-5xl font-bold text-[#0F172A] mb-2 leading-[1.1] tracking-tight">
                    License <br />
                    Type
                </h2>

                {/* Thick Divider */}
                <div className="w-16 h-1.5 bg-[#0F172A] rounded-full my-8"></div>

                {/* Description */}
                <div className="prose prose-lg text-gray-500 mb-12 max-w-xl font-light">
                    <p className="text-lg">
                        Compare and select the license type that is most suitable for you. If you notice a license type is not available to you, it means that you are not applicable to select them based on your previous selections.
                    </p>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-200 w-full">
                    <button onClick={prevStep} className="flex items-center gap-2 text-gray-400 hover:text-[#0F172A] font-bold text-sm transition-colors px-2 py-2 rounded-lg hover:bg-gray-50 -ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
                        Previous Step
                    </button>
                </div>
            </div>

            {/* Right Card: UI for Selection */}
            <div className="flex-1 flex flex-col mb-16 pt-4 w-full">
                <div className="bg-white rounded-[32px] border border-gray-100 flex flex-col shadow-sm overflow-hidden min-h-[640px]">

                    {/* Browser Address Bar Mock */}
                    <div className="bg-gray-50/50 border-b border-gray-100 p-4 flex items-center gap-4">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-300"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-300"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-300"></div>
                        </div>
                        <div className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-1.5 text-[10px] text-gray-400 font-mono flex items-center justify-center gap-2">
                            ezglobal.com/setup/license-type
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-8">
                        {/* Header - Aligned with Columns */}
                        <div className="flex items-center justify-between mb-8 px-5">
                            <h3 className="text-lg font-bold text-[#0F172A]">Start License Type</h3>
                            <div className="flex items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest flex-none">
                                <span className="w-16 text-center">Partners</span>
                                <span className="w-20 text-center">Workplace</span>
                                <span className="w-16 text-center">Location</span>
                            </div>
                        </div>

                        {/* List */}
                        <div className="space-y-4">
                            {LICENSE_TYPES.map((type) => {
                                const isSelected = selectedType === type.id;
                                return (
                                    <div
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        className={`group relative rounded-2xl border transition-all cursor-pointer overflow-hidden
                                            ${isSelected
                                                ? 'bg-indigo-50/30 border-[#4F46E5] shadow-lg shadow-indigo-100/50'
                                                : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                                            }
                                        `}
                                    >
                                        <div className="p-5 flex items-start justify-between relative z-10">
                                            {/* Left Side: Radio + Label + Subtitle */}
                                            <div className="flex gap-4 flex-1 min-w-0 pr-4">
                                                {/* Radio Circle */}
                                                <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-none
                                                     ${isSelected ? 'border-[#4F46E5]' : 'border-gray-200 group-hover:border-gray-300'}
                                                 `}>
                                                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#4F46E5]"></div>}
                                                </div>

                                                <div className="flex flex-col min-w-0">
                                                    <span className={`font-bold text-sm truncate ${isSelected ? 'text-[#0F172A]' : 'text-gray-600'}`}>
                                                        {type.label}
                                                    </span>
                                                    <span className={`text-xs mt-1 ${isSelected ? 'text-indigo-600' : 'text-gray-400'}`}>
                                                        {type.subtitle}
                                                    </span>

                                                    {/* Badges/Privileges for Selected Item */}
                                                    {isSelected && type.badge && (
                                                        <div className="mt-4 bg-gray-100/80 text-gray-500 text-[10px] p-3 rounded-lg leading-relaxed">
                                                            {type.badge}
                                                        </div>
                                                    )}
                                                    {isSelected && type.privileges && (
                                                        <div className="mt-4">
                                                            <span className="text-[10px] font-bold text-[#4F46E5] uppercase tracking-wider mb-1 block">Privileges</span>
                                                            <p className="text-[10px] text-indigo-800 leading-relaxed max-w-[200px]">
                                                                {type.privileges}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right Side: 3 Icon Columns */}
                                            <div className="flex items-start gap-6 flex-none pt-1">
                                                {/* Partners */}
                                                <div className="w-16 flex flex-col items-center text-center gap-2">
                                                    <type.partners.icon size={16} className={isSelected ? 'text-[#4F46E5]' : 'text-gray-300'} />
                                                    <span className="text-[9px] font-medium text-gray-500 leading-tight">{type.partners.text}</span>
                                                </div>

                                                {/* Workplace */}
                                                <div className="w-20 flex flex-col items-center text-center gap-2">
                                                    <type.workplace.icon size={16} className={isSelected ? 'text-[#4F46E5]' : 'text-gray-300'} />
                                                    <span className="text-[9px] font-medium text-gray-500 leading-tight">{type.workplace.text}</span>
                                                </div>

                                                {/* Location */}
                                                <div className="w-16 flex flex-col items-center text-center gap-2">
                                                    <type.location.icon size={16} className={isSelected ? 'text-[#4F46E5]' : 'text-gray-300'} />
                                                    <span className="text-[9px] font-medium text-gray-500 leading-tight">{type.location.text}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Left Stick Accent */}
                                        {isSelected && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-[#4F46E5] rounded-r-full"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
