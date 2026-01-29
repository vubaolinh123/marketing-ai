'use client';

import { motion } from 'framer-motion';
import type { ScriptListItem } from '@/lib/fakeData';
import { durationOptions, sizeOptions } from '@/lib/fakeData';

interface ScriptCardProps {
    script: ScriptListItem;
    onView: (id: string) => void;
    onDelete: (id: string) => void;
    index: number;
}

export default function ScriptCard({ script, onView, onDelete, index }: ScriptCardProps) {
    const durationLabel = durationOptions.find(d => d.value === script.duration)?.label || script.duration;
    const sizeLabel = sizeOptions.find(s => s.value === script.size)?.label || script.size;

    const formatDate = (date: Date | string) => {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(new Date(date));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-purple-200 transition-all duration-300 group"
        >
            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-purple-600 transition-colors">
                            {script.customerName}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-1">
                            {script.title}
                        </p>
                    </div>
                    <span className="flex-shrink-0 ml-3 inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-sm">
                        {script.sceneCount}
                    </span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        {durationLabel}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-700">
                        {sizeLabel}
                    </span>
                </div>

                {/* Summary */}
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {script.summary}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">
                        {formatDate(script.createdAt)}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onView(script.id)}
                            className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
                            title="Xem kịch bản"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => onDelete(script.id)}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            title="Xóa"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
