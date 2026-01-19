'use client';

import Link from 'next/link';
import { Moon, Bot } from 'lucide-react';
import React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="relative min-h-screen w-full font-sans text-gray-900 overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("/auth_background.jpg")',
                }}
            >
                {/* Overlay for better text contrast */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12 backdrop-blur-sm bg-black/10 border-b border-white/10">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-2xl font-bold text-white tracking-tight">
                        <span className="text-indigo-400">EZ</span>Global
                    </Link>
                    <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-200">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <Link href="/services" className="hover:text-white transition-colors">Services</Link>
                        <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">

                    <Link
                        href="/register/step-1"
                        className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-full transition-all shadow-lg shadow-orange-500/20"
                    >
                        Setup a Company
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex flex-col items-center justify-center lg:justify-start lg:items-center lg:pl-32 min-h-[calc(100vh-80px)] p-4 lg:flex-row">

                {/* Content Card (Passed as child) */}
                <div className="w-full max-w-[420px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 sm:p-10 animate-in fade-in zoom-in duration-500">
                    {children}
                </div>
            </main>

            {/* Assistant Widget */}
            <div className="fixed bottom-6 right-6 z-50">
                <button className="group flex items-center gap-3 bg-white rounded-full p-2 pr-6 shadow-xl hover:shadow-2xl transition-all border border-gray-100 hover:border-gray-200">
                    <div className="bg-indigo-600 p-2.5 rounded-full text-white shadow-lg group-hover:bg-indigo-700 transition-colors">
                        <Bot size={24} />
                    </div>
                    <div className="text-left">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Assistant</div>
                        <div className="text-sm font-bold text-gray-900 leading-none">Nora AI</div>
                    </div>
                </button>
            </div>
        </div>
    );
}
