'use client';

import { motion } from 'framer-motion';
import type { ArticleListItem } from '@/lib/fakeData';
import { fakeTopics, purposeOptions } from '@/lib/fakeData';

interface ArticleCardProps {
    article: ArticleListItem;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    index: number;
}

export default function ArticleCard({ article, onEdit, onDelete, index }: ArticleCardProps) {
    const topicLabel = fakeTopics.find(t => t.value === article.topic)?.label || article.topic;
    const purposeOption = purposeOptions.find(p => p.value === article.purpose);

    const formatDate = (date: Date) => {
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
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300 group"
        >
            <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="sm:w-48 h-32 sm:h-auto flex-shrink-0">
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {topicLabel}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            {purposeOption?.icon} {purposeOption?.label}
                        </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#F59E0B] transition-colors">
                        {article.title}
                    </h3>

                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                        {article.content}
                    </p>

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                            {formatDate(article.createdAt)}
                        </span>

                        {/* Actions */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => onEdit(article.id)}
                                className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                title="Chỉnh sửa"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => onDelete(article.id)}
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
            </div>
        </motion.div>
    );
}
