'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

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
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isReviewing, setIsReviewing] = useState(false);

    const triggerAIReview = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsReviewing(true);
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/applications/${application.id}/review`;
            const res = await fetch(url, { method: 'POST', credentials: 'include' });
            if (res.ok) {
                // Refresh payload by reloading or firing an event
                window.location.reload();
            } else {
                alert("Failed to start AI Review");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsReviewing(false);
        }
    };

    const statusIdx = useMemo(() => {
        if (application.status === 'Draft' || application.status === 'draft') return 0;
        if (application.status === 'Submitted' || application.status === 'submitted') return 1;
        if (application.status === 'ai_reviewing') return 1;
        if (application.status === 'ready' || application.status === 'AI_Review_Completed') return 2;
        if (application.status === 'Human_Review_Completed') return 3;
        if (application.status === 'Processing') return 4;
        if (application.status === 'Approved') return 5;
        if (application.status === 'Action_Required') return -1; // Special case
        return 0;
    }, [application.status]);

    const isActionRequired = application.status === 'Action_Required' || application.status === 'needs_fix';
    const isApproved = application.status === 'Approved' || application.status === 'approved';

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

    const handleCardClick = () => {
        if (onClick) {
            onClick();
            return;
        }
        if (application.status === 'Draft' || application.status === 'draft') {
            router.push(`/dashboard/applications/new?appId=${application.id}&step=1`);
        } else {
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <div
            onClick={handleCardClick}
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
                        <div className={`p-4 rounded-xl border flex flex-col gap-4 shadow-sm ${isApproved ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl ${isApproved ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {isApproved ? '✓' : '!'}
                                </div>
                                <div>
                                    <div className={`font-bold text-sm ${isApproved ? 'text-green-900' : 'text-red-900'}`}>
                                        {isApproved ? 'Application Approved!' : application.status === 'needs_fix' ? 'AI Review Identified Issues' : 'Action Required from You'}
                                    </div>
                                    <div className={`text-sm mt-0.5 ${isApproved ? 'text-green-700' : 'text-red-700'}`}>
                                        {isApproved
                                            ? 'Your business license has been officially issued and attached securely.'
                                            : 'Please click to view the automated feedback and fix the missing or incorrect documents.'}
                                    </div>
                                </div>
                            </div>

                            {/* Expandable AI Feedback Panel */}
                            {application.status === 'needs_fix' && isExpanded && application.ai_review_summary && (
                                <div className="mt-4 border-t border-red-100 pt-4 cursor-default" onClick={e => e.stopPropagation()}>
                                    <h4 className="font-bold text-red-900 mb-3 text-sm uppercase tracking-wider">AI Review Summary</h4>

                                    {application.ai_review_summary.missing_documents?.length > 0 && (
                                        <div className="mb-4">
                                            <div className="font-bold text-sm text-red-800 mb-2">Missing Documents:</div>
                                            <ul className="list-disc pl-5 text-sm text-red-700 space-y-1">
                                                {application.ai_review_summary.missing_documents.map((doc: string, i: number) => (
                                                    <li key={i}>{doc}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {application.ai_review_summary.document_issues?.length > 0 && (
                                        <div className="mb-4">
                                            <div className="font-bold text-sm text-red-800 mb-2">Detected File Issues:</div>
                                            <div className="space-y-3">
                                                {application.ai_review_summary.document_issues.map((issue: any, i: number) => (
                                                    <div key={i} className="bg-white p-3 rounded-lg border border-red-100">
                                                        <span className="font-bold text-xs bg-red-100 text-red-800 px-2 py-1 rounded inline-block mb-1">{issue.document_type}</span>
                                                        <div className="text-sm font-medium text-red-900 mt-1">{issue.issue}</div>
                                                        <div className="text-sm text-red-700 mt-1 flex gap-1 items-start">
                                                            <span className="font-bold">Recommendation:</span>
                                                            {issue.recommendation}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {application.ai_review_summary.general_recommendations?.length > 0 && (
                                        <div className="mb-4">
                                            <div className="font-bold text-sm text-red-800 mb-2">General Recommendations:</div>
                                            <ul className="list-disc pl-5 text-sm text-red-700 space-y-1">
                                                {application.ai_review_summary.general_recommendations.map((rec: string, i: number) => (
                                                    <li key={i}>{rec}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <button
                                        onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/applications/new?appId=${application.id}&step=5`); }}
                                        className="mt-2 text-white bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
                                    >
                                        Fix & Resubmit
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Developer debug action to test the pipeline */}
                {(!isActionRequired && !isApproved) && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            disabled={isReviewing}
                            onClick={triggerAIReview}
                            className="text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg text-xs font-bold border border-indigo-100 transition-colors disabled:opacity-50"
                        >
                            {isReviewing ? 'Running Engine...' : 'Run AI Validation Simulator'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
