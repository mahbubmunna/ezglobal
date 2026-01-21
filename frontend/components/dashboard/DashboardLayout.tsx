'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Home, Settings, LogOut, Search, FileText, BarChart2, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user, logout } = useAuthStore();
    const pathname = usePathname();

    const SIDEBAR_ITEMS = [
        { icon: Home, label: 'Home', href: '/dashboard' },
        { icon: LayoutGrid, label: 'Business Setup', href: '/dashboard/setup' },
        { icon: BarChart2, label: 'Cost Calculator', href: '/dashboard/cost-calculator' },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ];

    return (
        <div className="min-h-screen font-sans bg-[#F8F9FC] flex overflow-hidden">
            {/* Sidebar - Dark Corporate Style with Hover Expand */}
            <aside className="fixed top-0 left-0 bottom-0 w-20 hover:w-64 bg-[#0F172A] z-50 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group shadow-2xl">
                {/* Logo Area */}
                <div className="h-24 flex items-center px-5 mb-4 group-hover:px-6 transition-all">
                    <div className="flex items-center gap-4 overflow-hidden whitespace-nowrap">
                        {/* Logo Icon */}
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white flex-none hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/20">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l9 4.9V17L12 22l-9-4.9V7z" /></svg>
                        </div>
                        {/* Logo Text (Appears on Hover) */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                            <span className="text-xl font-bold text-white tracking-tight">EZ Global</span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 flex flex-col gap-4 w-full px-3">
                    {SIDEBAR_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`h-12 rounded-xl flex items-center px-3.5 transition-all duration-300 relative overflow-hidden whitespace-nowrap ${isActive
                                    ? 'bg-white/10 text-white shadow-sm'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex-none">
                                    <item.icon size={22} />
                                </div>
                                <span className="ml-4 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                                    {item.label}
                                </span>

                                {/* Active Indicator Strip */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-indigo-500 rounded-r-full"></div>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="flex flex-col gap-4 w-full px-3 py-6">
                    <button className="h-12 rounded-xl flex items-center px-3.5 text-gray-400 hover:text-white hover:bg-white/5 transition-colors overflow-hidden whitespace-nowrap">
                        <div className="flex-none">
                            <LogOut size={22} />
                        </div>
                        <span className="ml-4 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                            Logout
                        </span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-20 relative flex flex-col h-screen bg-[#F8F9FC] transition-all duration-300">
                {/* Header */}
                <header className="h-20 flex items-center justify-between px-8 flex-none bg-white border-b border-gray-100/50">

                    {/* Left: Search Bar */}
                    <div className="relative w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search for processes, documents..."
                            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-gray-100 border-none focus:bg-white focus:ring-2 focus:ring-[#494FBB] text-sm text-gray-700 placeholder-gray-400 focus:outline-none transition-all"
                        />
                    </div>

                    {/* Right: Profile */}
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col text-right">
                            <span className="text-sm font-bold text-[#0F172A]">{user?.first_name} {user?.last_name || 'Hassan'}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full p-0.5 bg-gray-100 border border-gray-200">
                            <img src={`https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=random`} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        </div>
                    </div>
                </header>

                {/* Page Content Scalable */}
                <div className="flex-1 overflow-y-auto px-12 pb-12 scrollbar-none">
                    {children}
                </div>
            </main>

            {/* Global Assistant - Nora AI */}
            <div className="fixed bottom-8 right-8 z-50">
                <button className="h-14 px-6 bg-[#0F172A] rounded-full shadow-2xl shadow-indigo-500/20 border border-gray-800 flex items-center justify-center text-white hover:scale-105 transition-all duration-300 gap-3 group">
                    <div className="relative">
                        <Sparkles size={20} className="text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                        <div className="absolute inset-0 bg-indigo-400/20 blur-lg rounded-full"></div>
                    </div>
                    <span className="font-bold text-sm tracking-wide">Ask Nora</span>
                </button>
            </div>
        </div>
    );
}
