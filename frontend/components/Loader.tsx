'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader({ text = "Loading..." }: { text?: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-100 rounded-full blur-xl animate-pulse"></div>
                <Loader2 className="w-10 h-10 text-[#494FBB] animate-spin relative z-10" />
            </div>
            <p className="mt-4 text-gray-500 font-medium text-sm animate-pulse">{text}</p>
        </div>
    );
}
