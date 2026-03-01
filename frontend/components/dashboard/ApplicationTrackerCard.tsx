'use client';

import { useMemo } from 'react';

interface TrackerStatus {
    label: string;
    description: string;
    value: string;
}

export const APPLICATION_STATUSES: TrackerStatus[] = [
    { label: 'Draft', description: 'Application initiated but unfinished.', value: 'Draft' },
    { label: 'AI Review', description: 'AI validates data and extracts entities.', value: 'Submitted' },
    { label: 'Agent Review', description: 'Human compliance check.', value: 'AI_Review_Completed' },
    { label: 'Gov. Processing', description: 'Submitted to DET / Free Zone.', value: 'Human_Review_Completed' },
    { label: 'Completed', description: 'License issued securely.', value: 'Processing' }, // Final next logical is Approved
];

interface ApplicationTrackerCardProps {
    application: any;
    onClick?: () => void;
}

export default function ApplicationTrackerCard({ application, onClick }: ApplicationTrackerCardProps) {
    const statusIdx = useMemo(() => {
        if (application.status === 'Draft') return 0;
        if (application.status === 'Submitted') return 1;
        if (application.status === 'AI_Review_Completed') return 2;
        if (application.status === 'Human_Review_Completed') return 3;
        if (application.status === 'Processing') return 4;
        if (application.status === 'Approved') return 5;
        if (application.status === 'Action_Required') return -1; // Special case
        return 0;
    }, [application.status]);

    const isActionRequired = application.status === 'Action_Required';
    const isApproved = application.status === 'Approved';

    const renderProgressLine = (index: number) => {
        if (index === 4) return null; // last item has no line

        let bgColor = "bg-gray-200"; // default pending
        if (statusIdx > index) {
            bgColor = "bg-indigo-500"; // passed
        }

        return (
            <div className="flex-1 px-2">
                <div className={`h-1.5 w-full rounded-full transition-all duration-500 ${bgColor}`} />
            </div>
        );
    };

    const jurisdictionMap = application.jurisdiction === 'Free Zone'
        ? application.free_zone_name
        : 'Mainland';

    return (
        <div
            onClick={onClick}
            className={`w-full group cursor-pointer overflow-hidden rounded-3xl bg-white border transition-all duration-300 shadow-sm hover:shadow-xl ${isActionRequired ? 'border-red-200 hover:border-red-300' : 'border-gray-100 hover:border-indigo-100'}`}
        >
            <div className={`p-6 ${isActionRequired ? 'bg-red-50/30' : 'bg-gray-50/30'}`}>
                {/* Header Information */}
                <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg text-gray-900">
                                {application.trade_name_1 || "Untitled Company"}
                            </h3>
                            {isActionRequired && (
                                <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider">
                                    Action Required
                                </span>
                            )}
                            {isApproved && (
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider">
                                    Approved
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-medium">
                                {jurisdictionMap || 'N/A'}
                            </span>
                            <span>•</span>
                            <span>{application.legal_type || 'Entity Setup'}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Application ID</div>
                        <div className="font-mono text-gray-900 font-bold">#{application.id}</div>
                    </div>
                </div>

                {/* Progress Stepper */}
                <div className="w-full">
                    {!isActionRequired && !isApproved ? (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                {APPLICATION_STATUSES.map((step, idx) => {
                                    const isCurrent = statusIdx === idx;
                                    const isPassed = statusIdx > idx;

                                    let bubbleClasses = "border border-gray-200 text-gray-400 bg-white";
                                    if (isPassed) {
                                        bubbleClasses = "bg-indigo-500 text-white shadow-md shadow-indigo-200";
                                    } else if (isCurrent) {
                                        bubbleClasses = "border-2 border-indigo-500 text-indigo-600 bg-white shadow-lg shadow-indigo-100 ring-4 ring-indigo-50";
                                    }

                                    return (
                                        <div key={idx} className="flex items-center flex-1 last:flex-none relative">
                                            <div className="flex flex-col items-center group/tooltip relative">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 z-10 ${bubbleClasses}`}>
                                                    {isPassed ? '✓' : idx + 1}
                                                </div>

                                                {/* Tooltip purely for hover context */}
                                                <div className="absolute top-10 opacity-0 group-hover/tooltip:opacity-100 bg-gray-900 text-white text-xs py-1.5 px-3 rounded-lg pointer-events-none transition-opacity whitespace-nowrap z-20 shadow-xl">
                                                    <div className="font-bold">{step.label}</div>
                                                    <div className="text-gray-300 font-normal">{step.description}</div>
                                                </div>
                                            </div>
                                            {renderProgressLine(idx)}
                                        </div>
                                    );
                                })}
                                {/* Final Check mark element for 'Approved' state */}

                            </div>

                            {/* Live Current Status Label Text below */}
                            {statusIdx >= 0 && statusIdx < 5 && (
                                <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100 flex items-start gap-4 shadow-sm">
                                    <div className="mt-0.5">
                                        <span className="flex w-3 h-3 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-gray-900">Current Phase: {APPLICATION_STATUSES[statusIdx].label}</div>
                                        <div className="text-sm text-gray-500 mt-0.5">{APPLICATION_STATUSES[statusIdx].description}</div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className={`p-4 rounded-xl border flex items-center gap-4 shadow-sm ${isApproved ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl ${isApproved ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {isApproved ? '✓' : '!'}
                            </div>
                            <div>
                                <div className={`font-bold text-sm ${isApproved ? 'text-green-900' : 'text-red-900'}`}>
                                    {isApproved ? 'Application Approved!' : 'Action Required from You'}
                                </div>
                                <div className={`text-sm mt-0.5 ${isApproved ? 'text-green-700' : 'text-red-700'}`}>
                                    {isApproved
                                        ? 'Your business license has been officially issued and attached securely.'
                                        : 'Our agents have flagged missing or incomplete details in your submission.'}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
