'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useApplicationStore } from '@/store/applicationStore';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ApplicationWizard from '@/components/applications/ApplicationWizard';

function WizardLoader() {
    const searchParams = useSearchParams();
    const { hydrateState, setStep, resetState } = useApplicationStore();
    const [isHydrating, setIsHydrating] = useState(true);

    useEffect(() => {
        const appId = searchParams.get('appId');
        const step = searchParams.get('step');

        const fetchApplication = async () => {
            if (!appId) {
                resetState();
                setIsHydrating(false);
                return;
            }

            try {
                const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/applications/${appId}`;
                const res = await fetch(url, { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    hydrateState(data);
                    if (step) {
                        setStep(parseInt(step, 10));
                    }
                }
            } catch (err) {
                console.error("Failed to load application", err);
            } finally {
                setIsHydrating(false);
            }
        };

        fetchApplication();
    }, [searchParams, hydrateState, setStep, resetState]);

    if (isHydrating) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <span className="flex w-8 h-8 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(99,102,241,0.8)]"></span>
                    <span className="text-gray-500 font-medium">Loading Saved Application...</span>
                </div>
            </div>
        );
    }

    return <ApplicationWizard />;
}

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
                    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading Wizard...</div>}>
                        <WizardLoader />
                    </Suspense>
                </div>
            </div>
        </DashboardLayout>
    );
}
