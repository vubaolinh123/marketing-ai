'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PlanListItem, channelOptions, statusOptions } from '@/lib/fakeData/marketing';

interface PlanCardProps {
    plan: PlanListItem;
    onView: (plan: PlanListItem) => void;
    onDuplicate: (plan: PlanListItem) => void;
    onDelete: (plan: PlanListItem) => void;
    index: number;
}

export default function PlanCard({ plan, onView, onDuplicate, onDelete, index }: PlanCardProps) {
    const statusInfo = statusOptions.find(s => s.value === plan.status);

    const getChannelIcon = (channel: string) => {
        return channelOptions.find(c => c.value === channel)?.icon || '📄';
    };

    const getStatusColor = () => {
        switch (plan.status) {
            case 'active': return 'bg-green-100 text-green-700';
            case 'completed': return 'bg-blue-100 text-blue-700';
            case 'draft': return 'bg-gray-100 text-gray-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all group"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{plan.campaignName}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {plan.startDate.toLocaleDateString('vi-VN')} - {plan.endDate.toLocaleDateString('vi-VN')}
                    </p>
                </div>
                <span className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium',
                    getStatusColor()
                )}>
                    {statusInfo?.label}
                </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-medium">{plan.totalPosts} bài</span>
                </div>
                <div className="flex items-center gap-1">
                    {plan.channels.map(channel => (
                        <span key={channel} className="text-lg" title={channel}>
                            {getChannelIcon(channel)}
                        </span>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <button
                    onClick={() => onView(plan)}
                    className="flex-1 px-3 py-2 rounded-xl bg-amber-50 text-[#F59E0B] font-medium text-sm hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Xem
                </button>
                <button
                    onClick={() => onDuplicate(plan)}
                    className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                    title="Nhân bản"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </button>
                <button
                    onClick={() => onDelete(plan)}
                    className="p-2 rounded-xl border border-gray-200 text-red-500 hover:bg-red-50 transition-colors"
                    title="Xóa"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            {/* Created date */}
            <p className="text-xs text-gray-400 mt-3 text-right">
                Tạo: {plan.createdAt.toLocaleDateString('vi-VN')}
            </p>
        </motion.div>
    );
}
