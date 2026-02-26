'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui';
import { getImageUrl } from '@/lib/api';
import type { GeneratedArticle } from '@/lib/fakeData';

interface ArticlePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    article: GeneratedArticle | null;
    customImages?: string[];
}

export default function ArticlePreviewModal({
    isOpen,
    onClose,
    article,
    customImages,
}: ArticlePreviewModalProps) {
    const [copied, setCopied] = useState(false);

    if (!article) return null;

    // Transform image URLs to include backend base URL
    const transformImageUrl = (url: string) => {
        // If already a full URL (starts with http), return as-is
        if (url.startsWith('http')) return url;
        // Otherwise, prepend backend URL
        return getImageUrl(url);
    };

    const imagesToShow = customImages && customImages.length > 0
        ? customImages.map(transformImageUrl)
        : article.imageUrls && article.imageUrls.length > 0
            ? article.imageUrls.map(transformImageUrl)
        : article.imageUrl
            ? [transformImageUrl(article.imageUrl)]
            : [];

    const handleCopy = async () => {
        const textToCopy = `${article.title}\n\n${article.content}\n\n${article.hashtags.join(' ')}`;

        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-start justify-center px-2 sm:px-4 pt-24 sm:pt-28 pb-6 sm:pb-8 overflow-y-auto"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-full max-w-6xl mx-auto h-[calc(100dvh-6.5rem)] sm:h-[calc(100dvh-8.5rem)] max-h-[calc(100dvh-6.5rem)] sm:max-h-[calc(100dvh-8.5rem)] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#1F2937] to-[#111827] p-4 sm:p-6 text-white shrink-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#EA580C] flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold">Bài viết đã tạo xong!</h2>
                                        <p className="text-sm text-gray-300">Xem trước và đăng lên Facebook</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6">
                            {/* Images */}
                            {imagesToShow.length > 0 && (
                                <div className="mb-6">
                                    <div className={`grid gap-3 sm:gap-4 ${imagesToShow.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                                        {imagesToShow.map((img, index) => (
                                            <img
                                                key={index}
                                                src={img}
                                                alt={`Article image ${index + 1}`}
                                                className="w-full h-auto max-h-[60dvh] rounded-xl object-contain bg-gray-100"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Article Content */}
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {article.title}
                                </h3>
                                <div className="text-base text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
                                    {article.content}
                                </div>

                                {/* Hashtags */}
                                {article.hashtags && article.hashtags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-4">
                                        {article.hashtags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50 shrink-0">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="flex-1"
                                    onClick={handleCopy}
                                >
                                    {copied ? (
                                        <>
                                            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Đã copy!
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                            </svg>
                                            Copy bài viết
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="flex-1 !bg-[#1877F2] hover:!bg-[#166FE5]"
                                    onClick={() => alert('Tính năng đăng nhập Facebook sẽ được phát triển!')}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    Đăng lên Facebook
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
