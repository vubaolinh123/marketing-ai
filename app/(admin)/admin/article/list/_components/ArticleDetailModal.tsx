'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { generateArticle, getImageUrl, updateArticle, type Article, type GeneratedArticle } from '@/lib/api';
import toast from '@/lib/toast';

type DetailMode = 'view' | 'edit' | 'regenerate';

type WritingStyle = 'sales' | 'lifestyle' | 'technical' | 'balanced';
type StorytellingDepth = 'low' | 'medium' | 'high';

interface ArticleDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    article: Article | null;
    initialMode?: DetailMode;
    onArticleUpdated?: (article: Article) => void;
}

export default function ArticleDetailModal({
    isOpen,
    onClose,
    article,
    initialMode = 'view',
    onArticleUpdated,
}: ArticleDetailModalProps) {
    const [mode, setMode] = useState<DetailMode>('view');
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const [isSaving, setIsSaving] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [regenPreview, setRegenPreview] = useState<GeneratedArticle | null>(null);

    const [editForm, setEditForm] = useState({
        title: '',
        content: '',
        topic: '',
        purpose: '',
        hashtagsText: '',
        status: 'draft' as 'draft' | 'published',
    });

    const [regenForm, setRegenForm] = useState({
        topic: '',
        purpose: '',
        wordCount: 250,
        regenerateInstruction: '',
        writingStyle: 'balanced' as WritingStyle,
        storytellingDepth: 'medium' as StorytellingDepth,
    });

    const articleImages = useMemo(() => {
        if (!article) return [] as string[];
        if (article.imageUrls && article.imageUrls.length > 0) return article.imageUrls;
        if (article.imageUrl) return [article.imageUrl];
        return [] as string[];
    }, [article]);

    const normalizedImageUrls = useMemo(
        () => articleImages.map((img) => getImageUrl(img)),
        [articleImages]
    );

    const safeImageIndex = Math.min(selectedImageIndex, Math.max(0, normalizedImageUrls.length - 1));
    const imageUrl = normalizedImageUrls[safeImageIndex] || null;

    useEffect(() => {
        if (!isOpen || !article) return;

        setMode(initialMode);
        setCopied(false);
        setSelectedImageIndex(0);
        setRegenPreview(null);

        setEditForm({
            title: article.title || '',
            content: article.content || '',
            topic: article.topic || '',
            purpose: article.purpose || '',
            hashtagsText: (article.hashtags || []).join(' '),
            status: article.status === 'published' ? 'published' : 'draft',
        });

        setRegenForm({
            topic: article.topic || '',
            purpose: article.purpose || '',
            wordCount: Math.max(50, Math.min(2000, article.content?.split(/\s+/).filter(Boolean).length || 250)),
            regenerateInstruction: '',
            writingStyle: 'balanced',
            storytellingDepth: 'medium',
        });
    }, [isOpen, initialMode, article]);

    const parseHashtags = (value: string) => {
        return value
            .split(/[\s,]+/)
            .map((tag) => tag.trim())
            .filter(Boolean)
            .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`));
    };

    const getPurposeLabel = (purposeValue: string) => purposeValue;

    const handleCopyContent = async () => {
        if (!article) return;

        const source = mode === 'edit'
            ? {
                title: editForm.title,
                content: editForm.content,
                hashtags: parseHashtags(editForm.hashtagsText),
            }
            : mode === 'regenerate' && regenPreview
                ? {
                    title: regenPreview.title,
                    content: regenPreview.content,
                    hashtags: regenPreview.hashtags || [],
                }
                : {
                    title: article.title,
                    content: article.content,
                    hashtags: article.hashtags || [],
                };

        const textToCopy = `${source.title}\n\n${source.content}\n\n${source.hashtags.join(' ')}`;

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

    const handleDownloadImage = async (targetUrl?: string, fileIndex?: number) => {
        if (!article) return;

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

    const handleSaveEdit = async () => {
        if (!article) return;
        if (!editForm.title.trim() || !editForm.content.trim() || !editForm.topic.trim() || !editForm.purpose) {
            toast.error('Vui lòng nhập đầy đủ tiêu đề, nội dung, chủ đề và mục đích');
            return;
        }

        setIsSaving(true);
        try {
            const updated = await updateArticle(article._id, {
                title: editForm.title.trim(),
                content: editForm.content.trim(),
                topic: editForm.topic.trim(),
                purpose: editForm.purpose,
                hashtags: parseHashtags(editForm.hashtagsText),
                status: editForm.status,
            });

            onArticleUpdated?.(updated);
            toast.success('Cập nhật bài viết thành công!');
            setMode('view');
        } catch (error) {
            console.error('Failed to update article:', error);
            toast.error('Không thể cập nhật bài viết');
        } finally {
            setIsSaving(false);
        }
    };

    const handleRegenerate = async () => {
        if (!article) return;
        if (!regenForm.topic.trim() || !regenForm.purpose) {
            toast.error('Vui lòng nhập chủ đề và mục đích để tái tạo');
            return;
        }

        setIsRegenerating(true);
        try {
            const generated = await generateArticle({
                mode: 'manual',
                topic: regenForm.topic.trim(),
                purpose: regenForm.purpose,
                wordCount: Math.max(50, Math.min(2000, regenForm.wordCount || 250)),
                description: regenForm.regenerateInstruction.trim() || `Tái tạo bài viết theo mục tiêu: ${regenForm.topic.trim()}`,
                baseTitle: article.title,
                baseContent: article.content,
                regenerateInstruction: regenForm.regenerateInstruction.trim() || undefined,
                writingStyle: regenForm.writingStyle,
                storytellingDepth: regenForm.storytellingDepth,
            });
            setRegenPreview(generated);
            toast.success('Đã tái tạo nội dung!');
        } catch (error) {
            console.error('Failed to regenerate article:', error);
            toast.error('Không thể tái tạo bài viết');
        } finally {
            setIsRegenerating(false);
        }
    };

    const handleApplyRegeneratedToEdit = () => {
        if (!regenPreview) {
            toast.error('Chưa có nội dung tái tạo để áp dụng');
            return;
        }

        setEditForm((prev) => ({
            ...prev,
            title: regenPreview.title || prev.title,
            content: regenPreview.content || prev.content,
            topic: regenForm.topic,
            purpose: regenForm.purpose,
            hashtagsText: (regenPreview.hashtags || []).join(' '),
        }));
        setMode('edit');
        toast.success('Đã áp dụng bản tái tạo sang chế độ chỉnh sửa');
    };

    const handleSaveRegenerated = async () => {
        if (!article || !regenPreview) {
            toast.error('Chưa có nội dung tái tạo để lưu');
            return;
        }

        setIsSaving(true);
        try {
            const updated = await updateArticle(article._id, {
                title: regenPreview.title,
                content: regenPreview.content,
                topic: regenForm.topic.trim(),
                purpose: regenForm.purpose,
                hashtags: regenPreview.hashtags || [],
                status: article.status,
            });

            onArticleUpdated?.(updated);
            toast.success('Đã lưu bản tái tạo thành công!');
            setMode('view');
        } catch (error) {
            console.error('Failed to save regenerated article:', error);
            toast.error('Không thể lưu bản tái tạo');
        } finally {
            setIsSaving(false);
        }
    };

    if (typeof window === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && article && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[1300] bg-black/65 backdrop-blur-sm flex items-stretch justify-center p-5 overflow-hidden"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full lg:max-w-7xl xl:max-w-[1450px] mx-auto h-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#1F2937] to-[#111827] px-4 md:px-6 py-4 text-white flex-shrink-0 border-b border-white/10">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#EA580C] flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-lg font-semibold">Chi tiết bài viết</h2>
                                        <p className="text-sm text-gray-300">{formatDate(article.createdAt)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="hidden sm:flex items-center rounded-xl bg-white/10 p-1">
                                        {[
                                            { value: 'view' as const, label: 'Xem' },
                                            { value: 'edit' as const, label: 'Chỉnh sửa' },
                                            { value: 'regenerate' as const, label: 'Tái tạo' },
                                        ].map((tab) => (
                                            <button
                                                key={tab.value}
                                                onClick={() => setMode(tab.value)}
                                                className={cn(
                                                    'px-3 py-1.5 rounded-lg text-sm transition-all',
                                                    mode === tab.value
                                                        ? 'bg-white text-gray-900 font-semibold'
                                                        : 'text-gray-200 hover:text-white'
                                                )}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
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

                            <div className="sm:hidden mt-3 flex items-center rounded-xl bg-white/10 p-1">
                                {[
                                    { value: 'view' as const, label: 'Xem' },
                                    { value: 'edit' as const, label: 'Sửa' },
                                    { value: 'regenerate' as const, label: 'Tái tạo' },
                                ].map((tab) => (
                                    <button
                                        key={tab.value}
                                        onClick={() => setMode(tab.value)}
                                        className={cn(
                                            'flex-1 px-3 py-1.5 rounded-lg text-sm transition-all',
                                            mode === tab.value
                                                ? 'bg-white text-gray-900 font-semibold'
                                                : 'text-gray-200 hover:text-white'
                                        )}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] lg:divide-x lg:divide-gray-200">
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

                            {/* Right: Article + Edit + Regenerate */}
                            <div className="min-h-0 flex flex-col bg-white">
                                {mode === 'view' && (
                                    <>
                                        <div className="px-4 md:px-6 py-4 border-b border-gray-200 bg-gray-50/70">
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${article.status === 'published'
                                                    ? 'bg-green-100 text-green-700'
                                                    : article.status === 'processing'
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : article.status === 'failed'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {article.status === 'published'
                                                        ? '✅ Đã xuất bản'
                                                        : article.status === 'processing'
                                                            ? '⏳ Đang tạo'
                                                            : article.status === 'failed'
                                                                ? '❌ Thất bại'
                                                                : '📝 Nháp'}
                                                </span>
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                    {article.topic}
                                                </span>
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                                    {getPurposeLabel(article.purpose)}
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
                                    </>
                                )}

                                {mode === 'edit' && (
                                    <div className="flex-1 min-h-0 overflow-y-auto px-4 md:px-6 py-4 space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa bài viết</h3>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiêu đề</label>
                                            <input
                                                value={editForm.title}
                                                onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Chủ đề</label>
                                                <input
                                                    value={editForm.topic}
                                                    onChange={(e) => setEditForm((prev) => ({ ...prev, topic: e.target.value }))}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mục đích</label>
                                                <input
                                                    value={editForm.purpose}
                                                    onChange={(e) => setEditForm((prev) => ({ ...prev, purpose: e.target.value }))}
                                                    placeholder="Nhập mục đích tùy chỉnh..."
                                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 -mt-1">
                                            {['Brand Awareness', 'Attract Leads', 'Nurture & Educate', 'Convert / Sales', 'Retention & Loyalty', 'Brand Positioning'].map((preset) => (
                                                <button
                                                    key={preset}
                                                    type="button"
                                                    onClick={() => setEditForm((prev) => ({ ...prev, purpose: preset }))}
                                                    className="px-2.5 py-1 rounded-full text-xs border border-gray-200 text-gray-700 hover:border-amber-300 hover:bg-amber-50"
                                                >
                                                    {preset}
                                                </button>
                                            ))}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nội dung</label>
                                            <textarea
                                                value={editForm.content}
                                                onChange={(e) => setEditForm((prev) => ({ ...prev, content: e.target.value }))}
                                                rows={12}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 resize-y focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Hashtags</label>
                                                <input
                                                    value={editForm.hashtagsText}
                                                    onChange={(e) => setEditForm((prev) => ({ ...prev, hashtagsText: e.target.value }))}
                                                    placeholder="#marketing #banhang"
                                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Trạng thái</label>
                                                <select
                                                    value={editForm.status}
                                                    onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                                                >
                                                    <option value="draft">📝 Nháp</option>
                                                    <option value="published">✅ Đã xuất bản</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="pt-2 flex justify-end">
                                            <button
                                                onClick={handleSaveEdit}
                                                disabled={isSaving}
                                                className="h-11 px-5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white font-medium hover:shadow-lg transition-all disabled:opacity-60"
                                            >
                                                {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {mode === 'regenerate' && (
                                    <div className="flex-1 min-h-0 overflow-y-auto px-4 md:px-6 py-4 space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Tái tạo từ bài hiện có</h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Chủ đề</label>
                                                <input
                                                    value={regenForm.topic}
                                                    onChange={(e) => setRegenForm((prev) => ({ ...prev, topic: e.target.value }))}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mục đích</label>
                                                <input
                                                    value={regenForm.purpose}
                                                    onChange={(e) => setRegenForm((prev) => ({ ...prev, purpose: e.target.value }))}
                                                    placeholder="Nhập mục đích tái tạo..."
                                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 -mt-1">
                                            {['Brand Awareness', 'Attract Leads', 'Nurture & Educate', 'Convert / Sales', 'Retention & Loyalty', 'Brand Positioning'].map((preset) => (
                                                <button
                                                    key={preset}
                                                    type="button"
                                                    onClick={() => setRegenForm((prev) => ({ ...prev, purpose: preset }))}
                                                    className="px-2.5 py-1 rounded-full text-xs border border-gray-200 text-gray-700 hover:border-amber-300 hover:bg-amber-50"
                                                >
                                                    {preset}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số từ</label>
                                                <input
                                                    type="number"
                                                    min={50}
                                                    max={2000}
                                                    step={50}
                                                    value={regenForm.wordCount}
                                                    onChange={(e) => setRegenForm((prev) => ({
                                                        ...prev,
                                                        wordCount: Math.max(50, Math.min(2000, parseInt(e.target.value || '250', 10))),
                                                    }))}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phong cách viết</label>
                                                <select
                                                    value={regenForm.writingStyle}
                                                    onChange={(e) => setRegenForm((prev) => ({ ...prev, writingStyle: e.target.value as WritingStyle }))}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                                                >
                                                    <option value="sales">sales - Bán hàng</option>
                                                    <option value="lifestyle">lifestyle - Đời sống/văn hoá</option>
                                                    <option value="technical">technical - Kỹ thuật</option>
                                                    <option value="balanced">balanced - Cân bằng</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Storytelling</label>
                                                <select
                                                    value={regenForm.storytellingDepth}
                                                    onChange={(e) => setRegenForm((prev) => ({ ...prev, storytellingDepth: e.target.value as StorytellingDepth }))}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                                                >
                                                    <option value="low">low</option>
                                                    <option value="medium">medium</option>
                                                    <option value="high">high</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Hướng dẫn tái tạo</label>
                                            <textarea
                                                value={regenForm.regenerateInstruction}
                                                onChange={(e) => setRegenForm((prev) => ({ ...prev, regenerateInstruction: e.target.value }))}
                                                rows={4}
                                                placeholder="Ví dụ: Giữ ý chính, giọng kể gần gũi hơn, thêm CTA rõ ràng..."
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 resize-y focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                                            />
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={handleRegenerate}
                                                disabled={isRegenerating}
                                                className="h-10 px-4 rounded-lg bg-[#1F2937] text-white text-sm font-medium hover:bg-[#111827] transition-colors disabled:opacity-60"
                                            >
                                                {isRegenerating ? 'Đang tái tạo...' : 'Tạo bản mới'}
                                            </button>

                                            <button
                                                onClick={handleApplyRegeneratedToEdit}
                                                disabled={!regenPreview}
                                                className="h-10 px-4 rounded-lg border border-amber-300 text-amber-700 bg-amber-50 text-sm font-medium hover:bg-amber-100 transition-colors disabled:opacity-50"
                                            >
                                                Áp dụng sang chỉnh sửa
                                            </button>

                                            <button
                                                onClick={handleSaveRegenerated}
                                                disabled={!regenPreview || isSaving}
                                                className="h-10 px-4 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
                                            >
                                                {isSaving ? 'Đang lưu...' : 'Lưu bản tái tạo'}
                                            </button>
                                        </div>

                                        {regenPreview && (
                                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                                                <h4 className="font-semibold text-gray-900">Xem trước nội dung tái tạo</h4>
                                                <p className="font-medium text-gray-800">{regenPreview.title}</p>
                                                <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-[12]">{regenPreview.content}</p>
                                                {regenPreview.hashtags && regenPreview.hashtags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                                                        {regenPreview.hashtags.map((tag, index) => (
                                                            <span key={index} className="px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="px-4 md:px-6 py-3 border-t border-gray-200 bg-white/95 backdrop-blur flex-shrink-0">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
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
        </AnimatePresence>,
        document.body
    );
}
