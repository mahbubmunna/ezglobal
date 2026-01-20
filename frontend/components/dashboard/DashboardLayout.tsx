'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, User, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user, logout } = useAuthStore();
    const pathname = usePathname();

    return (
        <div className="min-h-screen font-sans bg-gray-50/50">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-16">
                <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-12">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                                E
                            </div>
                            <span className="text-xl font-bold tracking-tight">
                                <span className="text-gray-900">EZ</span>Global
                            </span>
                        </Link>
                    </div>

                    {/* Right: Menu */}
                    <div className="flex items-center gap-6">
                        <Link
                            href="/dashboard"
                            className={`text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            Overview
                        </Link>

                        <div className="relative group">
                            <button className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                                Services
                                <ChevronDown size={16} />
                            </button>

                            {/* Dropdown */}
                            <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right p-2 z-50">
                                <Link
                                    href="/dashboard/setup"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        <Globe size={16} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Business Setup</div>
                                        <div className="text-xs text-gray-500">Start your journey</div>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div className="w-px h-6 bg-gray-200 mx-2"></div>

                        <button className="text-gray-400 hover:text-gray-600">
                            <Globe size={20} />
                        </button>

                        <div className="flex items-center gap-2 pl-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                                {/* Placeholder Avatar */}
                                <img src={`https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=indigo&color=fff`} alt="Profile" />
                            </div>
                            <div className="hidden md:flex items-center gap-1.5 text-sm font-medium text-gray-700 cursor-pointer">
                                {user?.first_name} {user?.last_name}
                                <ChevronDown size={14} className="text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-24 pb-12 px-6 max-w-[1400px] mx-auto min-h-screen">
                {children}
            </main>

            {/* Assistant Widget (Floating Global) */}
            <div className="fixed bottom-8 right-8 z-50">
                <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                    </div>
                    <div className="text-left">
                        <div className="text-xs font-bold text-gray-900">Ask Nora AI</div>
                        <div className="text-[10px] text-gray-500">I can help you choose</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
