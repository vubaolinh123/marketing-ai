'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getImageUrl, type Article } from '@/lib/api';
import toast from '@/lib/toast';

interface ArticleDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    article: Article | null;
}

export default function ArticleDetailModal({ isOpen, onClose, article }: ArticleDetailModalProps) {
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    if (!article) return null;

    const articleImages = article.imageUrls && article.imageUrls.length > 0
        ? article.imageUrls
        : article.imageUrl
            ? [article.imageUrl]
            : [];
    const normalizedImageUrls = useMemo(
        () => articleImages.map((img) => getImageUrl(img)),
        [articleImages]
    );

    const safeImageIndex = Math.min(selectedImageIndex, Math.max(0, normalizedImageUrls.length - 1));
    const imageUrl = normalizedImageUrls[safeImageIndex] || null;

    // Copy article content to clipboard
    const handleCopyContent = async () => {
        const textToCopy = `${article.title}\n\n${article.content}\n\n${article.hashtags?.join(' ') || ''}`;

        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            toast.success('Đã copy nội dung!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            toast.error('Không thể copy nội dung');
        }
    };

    // Download image
    const handleDownloadImage = async (targetUrl?: string, fileIndex?: number) => {
        const downloadUrl = targetUrl || imageUrl;

        if (!downloadUrl) {
            toast.error('Không có ảnh để tải xuống');
            return;
        }

        setDownloading(true);
        try {
            const response = await fetch(downloadUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const downloadSuffix = typeof fileIndex === 'number' ? `-${fileIndex + 1}` : '';
            a.download = `article-${article._id}${downloadSuffix}-${Date.now()}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            toast.success('Đã tải ảnh xuống!');
        } catch (err) {
            console.error('Failed to download:', err);
            toast.error('Không thể tải ảnh');
        } finally {
            setDownloading(false);
        }
    };

    // Facebook post (placeholder)
    const handlePostFacebook = () => {
        toast('🚧 Tính năng đăng Facebook đang được phát triển!', {
            icon: '📢',
            duration: 3000,
        });
    };

    const formatDate = (date: string) => {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(date));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-screen h-screen md:w-[94vw] md:h-[92vh] lg:max-w-7xl xl:max-w-[1400px] md:mx-auto md:my-6 bg-white rounded-none md:rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#1F2937] to-[#111827] px-4 md:px-6 py-4 text-white flex-shrink-0 border-b border-white/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#EA580C] flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold">Chi tiết bài viết</h2>
                                        <p className="text-sm text-gray-300">{formatDate(article.createdAt)}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors border border-white/20"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] lg:divide-x lg:divide-gray-200">
                            {/* Left: Images */}
                            <div className="min-h-0 flex flex-col bg-gray-900/95 p-3 md:p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-gray-100">Hình ảnh bài viết</h3>
                                    {normalizedImageUrls.length > 0 && (
                                        <button
                                            onClick={() => handleDownloadImage(imageUrl || undefined, safeImageIndex)}
                                            disabled={!imageUrl || downloading}
                                            className="h-9 px-3 rounded-lg bg-black/50 text-white text-sm font-medium hover:bg-black/70 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {downloading ? 'Đang tải...' : `Tải ảnh ${safeImageIndex + 1}`}
                                        </button>
                                    )}
                                </div>

                                <div className="relative flex-1 rounded-xl overflow-hidden bg-gray-800 border border-white/10 flex items-center justify-center">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={article.title}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <div className="text-center text-gray-300 px-4">
                                            <p className="text-sm">Bài viết chưa có ảnh</p>
                                        </div>
                                    )}
                                </div>

                                {normalizedImageUrls.length > 1 && (
                                    <div className="mt-3 grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-32 overflow-y-auto pr-1">
                                        {normalizedImageUrls.map((full, index) => (
                                            <div
                                                key={index}
                                                className={cn(
                                                    'group relative aspect-square rounded-md overflow-hidden border cursor-pointer transition-all',
                                                    index === safeImageIndex
                                                        ? 'border-[#F59E0B] ring-2 ring-[#F59E0B]/50'
                                                        : 'border-white/20 hover:border-white/50'
                                                )}
                                            >
                                                <button
                                                    onClick={() => setSelectedImageIndex(index)}
                                                    className="absolute inset-0"
                                                    title={`Chọn ảnh ${index + 1}`}
                                                >
                                                    <img
                                                        src={full}
                                                        alt={`Ảnh ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                                <button
                                                    onClick={() => handleDownloadImage(full, index)}
                                                    className="absolute bottom-1 right-1 h-6 w-6 rounded bg-black/60 text-white text-[10px] font-semibold hover:bg-black/80 transition"
                                                    title={`Tải ảnh ${index + 1}`}
                                                >
                                                    ↓
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right: Article text */}
                            <div className="min-h-0 flex flex-col bg-white">
                                <div className="px-4 md:px-6 py-4 border-b border-gray-200 bg-gray-50/70">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${article.status === 'published'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {article.status === 'published' ? '✅ Đã xuất bản' : '📝 Nháp'}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                            {article.topic}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                            {article.purpose}
                                        </span>
                                        {normalizedImageUrls.length > 1 && (
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                                {normalizedImageUrls.length} ảnh
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                                        {article.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-2">{formatDate(article.createdAt)}</p>
                                </div>

                                <div className="flex-1 min-h-0 overflow-y-auto px-4 md:px-6 py-4">
                                    <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {article.content}
                                    </div>

                                    {article.hashtags && article.hashtags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-gray-100">
                                            {article.hashtags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="px-4 md:px-6 py-3 border-t border-gray-200 bg-white/95 backdrop-blur flex-shrink-0">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                                {/* Copy Button */}
                                <button
                                    onClick={handleCopyContent}
                                    className="flex items-center justify-center gap-2 px-4 h-11 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
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
                                            Copy nội dung
                                        </>
                                    )}
                                </button>

                                {/* Download Button */}
                                <button
                                    onClick={() => handleDownloadImage(imageUrl || undefined, safeImageIndex)}
                                    disabled={!imageUrl || downloading}
                                    className="flex items-center justify-center gap-2 px-4 h-11 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {downloading ? (
                                        <>
                                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Đang tải...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Tải ảnh
                                        </>
                                    )}
                                </button>

                                {/* Facebook Button */}
                                <button
                                    onClick={handlePostFacebook}
                                    className="flex items-center justify-center gap-2 px-4 h-11 rounded-xl bg-[#1877F2] text-white font-medium hover:bg-[#166FE5] transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    Đăng Facebook
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
