'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui';
import { getImageUrl, postArticleToFacebook, settingsApi, type GeneratedArticle } from '@/lib/api';
import toast from '@/lib/toast';

type PreviewArticle = GeneratedArticle & {
    articleId?: string;
};

interface ArticlePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    article: PreviewArticle | null;
    customImages?: string[];
}

const extractErrorMessage = (error: unknown, fallback: string) => {
    if (!error || typeof error !== 'object') return fallback;

    const candidate = error as {
        message?: string;
        response?: { data?: { message?: string } };
    };

    return candidate.response?.data?.message || candidate.message || fallback;
};

export default function ArticlePreviewModal({
    isOpen,
    onClose,
    article,
    customImages,
}: ArticlePreviewModalProps) {
    const [copied, setCopied] = useState(false);
    const [isPostingFacebook, setIsPostingFacebook] = useState(false);
    const [isLoadingSettings, setIsLoadingSettings] = useState(false);
    const [isFacebookReady, setIsFacebookReady] = useState(false);
    const [facebookPageName, setFacebookPageName] = useState('');
    const [hasFetchedFacebookSettings, setHasFetchedFacebookSettings] = useState(false);
    const [isFacebookOptionsOpen, setIsFacebookOptionsOpen] = useState(false);
    const [selectedFacebookImageUrls, setSelectedFacebookImageUrls] = useState<string[]>([]);

    useEffect(() => {
        if (!isOpen || hasFetchedFacebookSettings) return;

        const loadSettings = async () => {
            setIsLoadingSettings(true);
            try {
                const response = await settingsApi.get();
                const facebook = response.data?.facebook;
                const hasToken = Boolean(facebook?.facebookToken?.trim());
                const hasPage = Boolean(facebook?.facebookPageId?.trim());

                setIsFacebookReady(hasToken && hasPage);
                setFacebookPageName(facebook?.facebookPageName || '');
            } catch {
                setIsFacebookReady(false);
                setFacebookPageName('');
            } finally {
                setHasFetchedFacebookSettings(true);
                setIsLoadingSettings(false);
            }
        };

        loadSettings();
    }, [isOpen, hasFetchedFacebookSettings]);

    const disabledReason = useMemo(() => {
        if (!article?.articleId) return 'Bài viết chưa được lưu, không thể đăng Facebook';
        if (!isFacebookReady) return 'Chưa cấu hình Facebook token trong Cài đặt';
        return '';
    }, [article?.articleId, isFacebookReady]);

    const articleImageSources = useMemo(() => {
        if (!article) return [] as string[];
        if (article.imageUrls && article.imageUrls.length > 0) return article.imageUrls;
        if (article.imageUrl) return [article.imageUrl];
        return [] as string[];
    }, [article]);

    useEffect(() => {
        if (!isOpen) {
            setIsFacebookOptionsOpen(false);
            return;
        }

        setIsFacebookOptionsOpen(false);
        setSelectedFacebookImageUrls(articleImageSources);
    }, [isOpen, articleImageSources]);

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

    const facebookPreviewImageUrls = articleImageSources.map((imageUrl) => ({
        originalUrl: imageUrl,
        previewUrl: transformImageUrl(imageUrl),
    }));

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

    const handleOpenFacebookOptions = () => {
        if (!article.articleId) {
            toast.error('Bài viết chưa được lưu, không thể đăng Facebook');
            return;
        }

        if (!isFacebookReady) {
            toast.error('Chưa cấu hình Facebook token trong Cài đặt');
            return;
        }

        setSelectedFacebookImageUrls(articleImageSources);
        setIsFacebookOptionsOpen(true);
    };

    const handleToggleFacebookImage = (targetUrl: string) => {
        setSelectedFacebookImageUrls((prev) => (
            prev.includes(targetUrl)
                ? prev.filter((url) => url !== targetUrl)
                : [...prev, targetUrl]
        ));
    };

    const handleSubmitFacebookPost = async (selectedImageUrls: string[], postType: 'text' | 'images') => {
        if (!article.articleId) {
            toast.error('Bài viết chưa được lưu, không thể đăng Facebook');
            return;
        }

        if (!isFacebookReady) {
            toast.error('Chưa cấu hình Facebook token trong Cài đặt');
            return;
        }

        const payload = { selectedImageUrls };
        const imageCount = selectedImageUrls.length;

        setIsPostingFacebook(true);
        try {
            const result = await postArticleToFacebook(article.articleId, payload);
            const pageName = result.pageName || facebookPageName || 'Fanpage';
            const postId = result.postId ? ` • Post ID: ${result.postId}` : '';
            if (postType === 'text') {
                toast.success(`Đăng Facebook chỉ text thành công lên ${pageName}${postId}`);
            } else {
                toast.success(`Đăng Facebook với ${imageCount} ảnh thành công lên ${pageName}${postId}`);
            }
            setIsFacebookOptionsOpen(false);
        } catch (error) {
            const fallbackMessage = postType === 'text'
                ? 'Không thể đăng bài chỉ text lên Facebook'
                : `Không thể đăng bài với ${imageCount} ảnh lên Facebook`;
            toast.error(extractErrorMessage(error, fallbackMessage));
        } finally {
            setIsPostingFacebook(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-stretch justify-center p-0 sm:p-2 md:p-5 overflow-hidden"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-white w-full max-w-6xl mx-auto h-full max-h-[100dvh] sm:max-h-[96dvh] rounded-none sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
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
                                    onClick={handleOpenFacebookOptions}
                                    isLoading={isPostingFacebook}
                                    disabled={isLoadingSettings || !!disabledReason}
                                    title={disabledReason || undefined}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    {disabledReason === 'Chưa cấu hình Facebook token trong Cài đặt'
                                        ? 'Chưa cấu hình Facebook token trong Cài đặt'
                                        : 'Đăng lên Facebook'}
                                </Button>
                            </div>
                            {disabledReason && (
                                <p className="mt-2 text-xs text-amber-700">
                                    {disabledReason}
                                </p>
                            )}
                        </div>

                        <AnimatePresence>
                            {isFacebookOptionsOpen && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-30 bg-black/55 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6"
                                    onClick={() => !isPostingFacebook && setIsFacebookOptionsOpen(false)}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 18, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 18, scale: 0.98 }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full max-w-3xl rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden max-h-[90dvh] sm:max-h-[85dvh] flex flex-col"
                                    >
                                        <div className="px-5 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Đăng Facebook - Chọn hình ảnh</h3>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Chọn ảnh muốn đăng cùng nội dung, hoặc chọn đăng chỉ text.
                                            </p>
                                        </div>

                                        <div className="px-3 sm:px-5 md:px-6 py-4 flex-1 min-h-0 overflow-y-auto overscroll-contain space-y-4">
                                            {facebookPreviewImageUrls.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {facebookPreviewImageUrls.map((item, index) => {
                                                        const isSelected = selectedFacebookImageUrls.includes(item.originalUrl);
                                                        return (
                                                            <button
                                                                key={`${item.originalUrl}-${index}`}
                                                                type="button"
                                                                onClick={() => handleToggleFacebookImage(item.originalUrl)}
                                                                className={`relative text-left rounded-xl border overflow-hidden transition-all ${isSelected
                                                                    ? 'border-[#1877F2] ring-2 ring-[#1877F2]/35'
                                                                    : 'border-gray-200 hover:border-gray-300'
                                                                    }`}
                                                            >
                                                                <img
                                                                    src={item.previewUrl}
                                                                    alt={`Ảnh bài viết ${index + 1}`}
                                                                    className="w-full h-44 object-cover bg-gray-100"
                                                                />
                                                                <div className="absolute top-2 right-2">
                                                                    <span className={`inline-flex items-center justify-center h-6 min-w-6 px-1 rounded-full text-xs font-semibold ${isSelected
                                                                        ? 'bg-[#1877F2] text-white'
                                                                        : 'bg-black/60 text-white'
                                                                        }`}>
                                                                        {isSelected ? '✓' : index + 1}
                                                                    </span>
                                                                </div>
                                                                <div className="px-3 py-2 text-xs text-gray-600 bg-white">
                                                                    {isSelected ? 'Đã chọn đăng ảnh này' : 'Bấm để chọn ảnh này'}
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-sm text-gray-600 text-center">
                                                    Bài viết hiện không có ảnh. Bạn vẫn có thể đăng chỉ text.
                                                </div>
                                            )}
                                        </div>

                                        <div className="px-5 sm:px-6 py-4 border-t border-gray-200 bg-white">
                                            <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                                                <p className="text-sm text-gray-600">
                                                    Đã chọn <span className="font-semibold text-gray-900">{selectedFacebookImageUrls.length}</span> ảnh
                                                </p>
                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        size="md"
                                                        onClick={() => handleSubmitFacebookPost([], 'text')}
                                                        isLoading={isPostingFacebook}
                                                    >
                                                        Đăng chỉ text
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="primary"
                                                        size="md"
                                                        className="!bg-[#1877F2] hover:!bg-[#166FE5]"
                                                        onClick={() => {
                                                            if (selectedFacebookImageUrls.length === 0) {
                                                                toast.error('Vui lòng chọn ít nhất 1 ảnh hoặc dùng nút Đăng chỉ text');
                                                                return;
                                                            }
                                                            handleSubmitFacebookPost(selectedFacebookImageUrls, 'images');
                                                        }}
                                                        isLoading={isPostingFacebook}
                                                    >
                                                        Đăng với ảnh đã chọn
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
