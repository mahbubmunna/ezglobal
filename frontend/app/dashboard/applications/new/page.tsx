'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ApplicationWizard from '@/components/applications/ApplicationWizard';

export default function NewApplicationPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!mounted || !isAuthenticated) {
        return null;
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col h-full gap-8 px-12 pt-8">
                {/* Page Header Area */}
                <div className="flex items-end justify-between">
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Applications</h4>
                        <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Business Application</h1>
                    </div>
                </div>

                {/* Main Wizard Component */}
                <div className="flex-1 min-h-0">
                    <ApplicationWizard />
                </div>
            </div>
        </DashboardLayout>
    );
}
