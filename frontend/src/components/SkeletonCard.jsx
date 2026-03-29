import React from 'react';

export const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-pulse">
        <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-2/3 mb-4"></div>
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
        </div>
    </div>
);

export const SkeletonRow = () => (
    <div className="p-6 flex items-center justify-between animate-pulse border-b border-slate-50">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
            <div>
                <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-24"></div>
            </div>
        </div>
        <div className="h-8 bg-slate-200 rounded w-20"></div>
    </div>
);

export const SkeletonProfile = () => (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-pulse">
        <div className="h-48 bg-slate-200"></div>
        <div className="p-8">
            <div className="h-7 bg-slate-200 rounded w-1/3 mb-3"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4 mb-6"></div>
            <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        </div>
    </div>
);