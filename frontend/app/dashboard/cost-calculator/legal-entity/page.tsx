'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, User, Users, Building, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const LEGAL_ENTITIES = [
    {
        id: 'sole-establishment',
        name: 'Sole Establishment',
        stakeholders: '1 Shareholder',
        stakeholder_type: 'Individual',
        eligibility: 'All Nationalities',
        manager: 'Owner is Manager',
        liability: 'Unlimited Liability',
        icon: User,
    },
    {
        id: 'llc-so',
        name: 'LLC - SO (Single Owner)',
        stakeholders: '1 Shareholder',
        stakeholder_type: 'Corporate / Individual',
        eligibility: 'All Nationalities',
        manager: 'Manager Required',
        liability: 'Limited Liability',
        icon: Building,
    },
    {
        id: 'pjsc',
        name: 'Private Joint Stock Company',
        stakeholders: 'Min. 2 Shareholders',
        stakeholder_type: 'Corporate / Individual',
        eligibility: 'All Nationalities',
        manager: 'Board of Directors',
        liability: 'Limited Liability',
        icon: Users,
    }
];

function LegalEntityContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

    // Get Data from URL
    const activity = searchParams.get('activity');
    const partners = searchParams.get('partners');
    const origin = searchParams.get('origin');

    const handleContinue = () => {
        if (selectedEntity) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('entity', selectedEntity);
            params.set('entityName', LEGAL_ENTITIES.find(e => e.id === selectedEntity)?.name || '');

            router.push(`/dashboard/cost-calculator/solutions?${params.toString()}`);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-6">

            {/* Single Card Container */}
            <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 min-h-[600px] relative">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Choose Your Legal Entity</h1>

                        {/* Summary of Selection */}
                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg w-fit mt-2 border border-gray-100">
                            <span className="font-medium text-gray-700">{activity}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>{partners} Partners</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>{origin === 'local' ? 'Local' : 'Global'} Origin</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="bg-white border border-gray-200 px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:text-[#0F172A] hover:border-gray-300 transition-colors"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleContinue}
                            disabled={!selectedEntity}
                            className={`px-8 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg ${selectedEntity ? 'bg-[#494FBB] hover:bg-[#3e44a6] text-white shadow-indigo-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}`}
                        >
                            Continue
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-700 text-sm mb-8 items-start">
                    <Info size={18} className="mt-0.5 flex-none" />
                    <p>
                        Based on your selection of <strong>{partnerCountToText(partners)}</strong> and <strong>{originToText(origin)}</strong>,
                        these are the compatible legal structures in Dubai.
                    </p>
                </div>

                {/* Grid of Choices */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {LEGAL_ENTITIES.map((entity) => {
                        const isSelected = selectedEntity === entity.id;
                        const Icon = entity.icon;

                        return (
                            <div
                                key={entity.id}
                                onClick={() => setSelectedEntity(entity.id)}
                                className={`cursor-pointer rounded-2xl border-2 p-6 transition-all duration-200 relative group flex flex-col h-full ${isSelected
                                    ? 'border-[#494FBB] bg-indigo-50/20 shadow-xl shadow-indigo-100'
                                    : 'border-gray-100 hover:border-gray-200 hover:shadow-md bg-white'
                                    }`}
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${isSelected ? 'bg-[#494FBB] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                        <Icon size={24} />
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#494FBB]' : 'border-gray-200'}`}>
                                        {isSelected && <div className="w-3 h-3 rounded-full bg-[#494FBB]" />}
                                    </div>
                                </div>

                                <h3 className={`font-bold text-lg mb-4 ${isSelected ? 'text-[#494FBB]' : 'text-[#0F172A]'}`}>
                                    {entity.name}
                                </h3>

                                {/* Details List */}
                                <div className="space-y-3 text-sm text-gray-600 flex-1">
                                    <div className="flex items-center gap-2">
                                        <Users size={14} className="text-gray-400" />
                                        <span>{entity.stakeholders}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-gray-400" />
                                        <span>{entity.manager}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AlertCircle size={14} className="text-gray-400" />
                                        <span>{entity.liability}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Collapsible Sections - "Not Applicable" */}
                <div className="border-t border-gray-100 pt-6">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Other Legal Forms (Not Applicable)</h4>
                    <div className="flex flex-wrap gap-3">
                        {['Public Joint Stock', 'Civil Company', 'Branch of Foreign Company'].map((name) => (
                            <div key={name} className="px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-400 border border-transparent hover:border-gray-200 transition-colors cursor-not-allowed select-none">
                                {name}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

// Helpers
const partnerCountToText = (p: string | null) => (p === '1' ? '1 Partner' : `${p || 2} Partners`);
const originToText = (o: string | null) => {
    if (o === 'local') return 'Local Residents';
    if (o === 'regional') return 'Regional Partners';
    return 'Global Model';
};

export default function LegalEntityPage() {
    return (
        <DashboardLayout>
            <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading options...</div>}>
                <LegalEntityContent />
            </Suspense>
        </DashboardLayout>
    );
}
