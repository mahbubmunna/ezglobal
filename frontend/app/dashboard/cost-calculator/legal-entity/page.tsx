'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, User, Users, Building, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PageTransition from '@/components/PageTransition';
import Loader from '@/components/Loader';

function LegalEntityContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
    const [legalTypes, setLegalTypes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Get Data from URL
    const activity = searchParams.get('activity');
    const partners = searchParams.get('partners');
    const origin = searchParams.get('origin');

    useEffect(() => {
        const fetchLegalTypes = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams({
                    partners: partners || '1',
                    origin: origin || 'local'
                });
                const res = await fetch(`/api/legal-types?${params.toString()}`);
                if (res.ok) {
                    const data = await res.json();
                    setLegalTypes(data);
                }
            } catch (error) {
                console.error("Failed to fetch legal types", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (partners && origin) {
            fetchLegalTypes();
        }
    }, [partners, origin]);

    const handleContinue = () => {
        if (selectedEntity) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('entity', selectedEntity);
            params.set('entityName', legalTypes.find(e => e.id === selectedEntity)?.valueEn || '');

            router.push(`/dashboard/cost-calculator/solutions?${params.toString()}`);
        }
    };

    // Helper to get icon
    const getIcon = (id: string) => {
        if (id.includes('sole')) return User;
        if (id.includes('partner') || id.includes('pjsc')) return Users;
        return Building;
    };

    return (
        <DashboardLayout>
            <PageTransition className="max-w-5xl mx-auto py-6">

                {/* Single White Card Container */}
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
                                <span>{origin === 'local' ? 'Local' : (origin === 'regional' ? 'GCC' : 'Global')} Origin</span>
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
                    {isLoading ? (
                        <Loader text="Finding compatible legal structures..." />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {legalTypes.map((entity) => {
                                const isSelected = selectedEntity === entity.id;
                                const Icon = getIcon(entity.id);

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

                                        <h3 className={`font-bold text-lg mb-2 leading-tight ${isSelected ? 'text-[#494FBB]' : 'text-[#0F172A]'}`}>
                                            {entity.valueEn}
                                        </h3>
                                        <p className="text-xs text-gray-400 mb-4">{entity.valueAr}</p>

                                        {/* Details List */}
                                        <div className="space-y-3 text-sm text-gray-600 flex-1">
                                            <div className="flex items-center gap-2">
                                                <Users size={14} className="text-gray-400" />
                                                <span>{entity.partners.min === entity.partners.max ? `${entity.partners.min} Partner` : `${entity.partners.min}-${entity.partners.max} Partners`}</span>
                                            </div>
                                            {entity.requiresManager && (
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 size={14} className="text-gray-400" />
                                                    <span>Manager Required</span>
                                                </div>
                                            )}
                                            {entity.conditions && (
                                                <div className="flex items-start gap-2">
                                                    <AlertCircle size={14} className="text-gray-400 mt-0.5" />
                                                    <span className="text-xs">{entity.conditions}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && legalTypes.length === 0 && (
                        <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                            <p className="text-gray-500">No matching legal entities found for these criteria.</p>
                            <button onClick={() => router.back()} className="text-[#494FBB] font-semibold mt-2 hover:underline">Go Back & Adjust</button>
                        </div>
                    )}

                </div>
            </PageTransition>
        </DashboardLayout>
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
            <Suspense fallback={<Loader text="Loading options..." />}>
                <LegalEntityContent />
            </Suspense>
        </DashboardLayout>
    );
}
