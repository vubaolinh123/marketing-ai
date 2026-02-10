'use client';

import { motion } from 'framer-motion';
import { fakeTopics, purposeOptions } from '@/lib/fakeData';
import { getImageUrl, type Article } from '@/lib/api';

interface ArticleCardProps {
    article: Article;
    onClick: (article: Article) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    index: number;
}

export default function ArticleCard({ article, onClick, onEdit, onDelete, index }: ArticleCardProps) {
    const topicLabel = fakeTopics.find(t => t.value === article.topic)?.label || article.topic;
    const purposeOption = purposeOptions.find(p => p.value === article.purpose);

    const formatDate = (date: string) => {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(new Date(date));
    };

    const articleImages = article.imageUrls && article.imageUrls.length > 0
        ? article.imageUrls
        : article.imageUrl
            ? [article.imageUrl]
            : [];

    // Transform image URL to include backend base URL
    const imageUrl = articleImages[0] ? getImageUrl(articleImages[0]) : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onClick(article)}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300 group cursor-pointer"
        >
            <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="sm:w-48 h-32 sm:h-auto flex-shrink-0 bg-gray-100">
                    {imageUrl ? (
                        <div className="relative w-full h-full">
                            <img
                                src={imageUrl}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                            {articleImages.length > 1 && (
                                <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-black/70 text-white text-[10px] font-medium">
                                    {articleImages.length} ảnh
                                </div>
                            )}
                            {articleImages.length > 1 && (
                                <div className="absolute bottom-2 left-2 right-2 flex gap-1">
                                    {articleImages.slice(0, 3).map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={getImageUrl(img)}
                                            alt={`thumb-${idx + 1}`}
                                            className="w-8 h-8 rounded object-cover border border-white/70"
                                        />
                                    ))}
                                    {articleImages.length > 3 && (
                                        <div className="w-8 h-8 rounded bg-black/60 text-white text-[10px] flex items-center justify-center border border-white/70">
                                            +{articleImages.length - 3}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
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
                        {/* Status Badge */}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${article.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                            }`}>
                            {article.status === 'published' ? '✅ Đã xuất bản' : '📝 Nháp'}
                        </span>
                        {articleImages.length > 1 && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                {articleImages.length} ảnh
                            </span>
                        )}
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
                                onClick={(e) => { e.stopPropagation(); onEdit(article._id); }}
                                className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                title="Chỉnh sửa"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(article._id); }}
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
