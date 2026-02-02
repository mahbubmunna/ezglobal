'use client';

import React, { useState } from 'react';
import { MapPin, Globe, Plane, ChevronDown, Plus, Minus, ArrowRight, Search, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PageTransition from '@/components/PageTransition';

export default function CostCalculatorPage() {
    const router = useRouter();
    const [activity, setActivity] = useState('');
    const [partnerCount, setPartnerCount] = useState(1);
    const [origin, setOrigin] = useState('');
    const [activityCode, setActivityCode] = useState(''); // Store code

    // Searchable Dropdown State
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activities, setActivities] = useState<any[]>([]);
    const [loadingActivities, setLoadingActivities] = useState(false);

    // Fetch Activities
    React.useEffect(() => {
        const fetchActivities = async () => {
            setLoadingActivities(true);
            try {
                const res = await fetch('/api/activities');
                if (res.ok) {
                    const data = await res.json();
                    setActivities(data);
                }
            } catch (error) {
                console.error("Failed to fetch activities", error);
            } finally {
                setLoadingActivities(false);
            }
        };
        fetchActivities();
    }, []);

    const OWNERSHIP_ORIGINS = [
        {
            id: 'local',
            title: 'Local Residents',
            description: 'UAE Nationals & Residents',
            icon: MapPin,
        },
        {
            id: 'regional',
            title: 'Regional Partners',
            description: 'GCC Nationals',
            icon: Globe,
        },
        {
            id: 'global',
            title: 'Global Entrepreneurs',
            description: 'International Investors',
            icon: Plane,
        },
    ];

    const filteredActivities = activities.filter(act =>
        act.valueEn.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleIncrement = () => setPartnerCount(prev => prev + 1);
    const handleDecrement = () => setPartnerCount(prev => (prev > 1 ? prev - 1 : 1));

    const handleContinue = () => {
        if (!activity || !origin) {
            alert("Please select business activity and ownership origin.");
            return;
        }

        const params = new URLSearchParams({
            activity, // Sending name for display
            code: activityCode, // Sending code for logic
            partners: partnerCount.toString(),
            origin,
        });

        // Small delay to allow button animation if needed, but instant is better
        router.push(`/dashboard/cost-calculator/legal-entity?${params.toString()}`);
    };

    return (
        <DashboardLayout>
            <PageTransition className="max-w-5xl mx-auto py-6">

                {/* Single White Card Container */}
                <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 relative">

                    {/* Header */}
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Launch Your Vision</h1>
                            <p className="text-gray-500">Define your venture parameters to get an estimated cost.</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <button className="bg-white border border-gray-200 px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:text-[#0F172A] hover:border-gray-300 transition-colors">
                                Back
                            </button>
                            <button
                                onClick={handleContinue}
                                className={`px-8 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg ${activity && origin ? 'bg-[#494FBB] hover:bg-[#3e44a6] text-white shadow-indigo-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}`}
                                disabled={!activity || !origin}
                            >
                                Continue
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>


                    {/* Compact Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                        {/* Left Column: Activity & Partners */}
                        <div className="space-y-8">

                            {/* Primary Business Activity (Searchable) */}
                            <div className="relative">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">
                                    Primary Business Activity
                                </label>
                                <div className="relative">
                                    <div
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-5 py-3.5 text-base text-gray-700 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                                    >
                                        <span className={activity ? 'text-[#0F172A] font-medium' : 'text-gray-400'}>
                                            {activity || (loadingActivities ? "Loading activities..." : "Select your activity...")}
                                        </span>
                                        <ChevronDown size={18} className="text-gray-400" />
                                    </div>

                                    {/* Dropdown Menu */}
                                    {isDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 max-h-60 overflow-hidden flex flex-col">
                                            <div className="p-3 border-b border-gray-50">
                                                <div className="relative">
                                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        autoFocus
                                                        type="text"
                                                        placeholder="Search activities..."
                                                        className="w-full bg-gray-50 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#494FBB]/20"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="overflow-y-auto flex-1 p-1">
                                                {filteredActivities.map((act) => (
                                                    <button
                                                        key={act.id}
                                                        onClick={() => {
                                                            setActivity(act.valueEn);
                                                            setActivityCode(act.code);
                                                            setIsDropdownOpen(false);
                                                            setSearchQuery('');
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-indigo-50 text-sm text-gray-700 hover:text-[#494FBB] flex items-center justify-between group"
                                                    >
                                                        {act.valueEn}
                                                        {activity === act.valueEn && <Check size={16} className="text-[#494FBB]" />}
                                                    </button>
                                                ))}
                                                {filteredActivities.length === 0 && (
                                                    <div className="p-4 text-center text-gray-400 text-sm">
                                                        {loadingActivities ? "Loading..." : "No results found"}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Total Founding Partners */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">
                                    Total Founding Partners
                                </label>
                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={handleDecrement}
                                        className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all ${partnerCount <= 1 ? 'border-gray-100 text-gray-300' : 'border-gray-200 text-gray-600 hover:border-[#494FBB] hover:text-[#494FBB]'}`}
                                        disabled={partnerCount <= 1}
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="text-3xl font-bold text-[#0F172A] w-10 text-center font-mono">
                                        {partnerCount}
                                    </span>
                                    <button
                                        onClick={handleIncrement}
                                        className="w-11 h-11 rounded-full border border-[#494FBB] text-[#494FBB] flex items-center justify-center hover:bg-[#494FBB] hover:text-white transition-all shadow-md shadow-indigo-100"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>

                        </div>

                        {/* Right Column: Ownership Origin */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">
                                Ownership Origin
                            </label>
                            <div className="space-y-4">
                                {OWNERSHIP_ORIGINS.map((item) => {
                                    const isSelected = origin === item.id;
                                    const Icon = item.icon;
                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => setOrigin(item.id)}
                                            className={`relative px-5 py-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-4 group ${isSelected
                                                ? 'border-[#494FBB] bg-indigo-50/10 shadow-lg shadow-indigo-50' // Removed ring-1
                                                : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isSelected ? 'bg-[#494FBB] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>
                                                <Icon size={20} />
                                            </div>
                                            <div>
                                                <h3 className={`font-bold text-sm mb-0.5 transition-colors ${isSelected ? 'text-[#494FBB]' : 'text-[#0F172A]'}`}>
                                                    {item.title}
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    {item.description}
                                                </p>
                                            </div>

                                            {/* Selection Indicator */}
                                            <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#494FBB]' : 'border-gray-200'}`}>
                                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#494FBB]" />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>

                    {/* Simple Copyright/Helper Footer */}
                    <div className="mt-12 text-center border-t border-gray-50 pt-6">
                        <p className="text-xs text-gray-400">
                            Need help deciding? Contact our support team or use Nora AI.
                        </p>
                    </div>

                </div>
            </PageTransition>
        </DashboardLayout>
    );
}
