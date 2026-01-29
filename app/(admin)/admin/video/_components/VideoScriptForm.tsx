'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { sizeOptions, durationOptions } from '@/lib/fakeData';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { settingsApi, videoScriptApi, GeneratedIdea } from '@/lib/api';

export interface VideoScriptFormData {
    duration: string;
    sceneCount: number;
    size: string;
    title: string;
    hasVoiceOver: boolean;
    otherRequirements: string;
    ideaMode: 'manual' | 'ai';
    customIdea: string;
    useBrandSettings: boolean;
}

interface VideoScriptFormProps {
    onSubmit: (data: VideoScriptFormData) => void;
    isLoading: boolean;
}

// Quick select options for scene count
const sceneCountOptions = [4, 6, 8, 10, 12];



export default function VideoScriptForm({ onSubmit, isLoading }: VideoScriptFormProps) {
    const [formData, setFormData] = useState<VideoScriptFormData>({
        duration: '1 phút',
        sceneCount: 6,
        size: '',
        title: '',
        hasVoiceOver: true,
        otherRequirements: '',
        ideaMode: 'ai',
        customIdea: '',
        useBrandSettings: false,
    });
    const [generatingIdea, setGeneratingIdea] = useState(false);
    const [generatedIdea, setGeneratedIdea] = useState<GeneratedIdea | null>(null);

    // Brand settings states
    const [hasBrandSettings, setHasBrandSettings] = useState(false);
    const [loadingSettings, setLoadingSettings] = useState(true);

    // Check if user has brand settings on mount
    useEffect(() => {
        const checkSettings = async () => {
            try {
                const hasSettings = await settingsApi.checkHasBrandSettings();
                setHasBrandSettings(hasSettings);
                if (hasSettings) {
                    setFormData(prev => ({ ...prev, useBrandSettings: true }));
                }
            } catch (error) {
                console.error('Error checking brand settings:', error);
            } finally {
                setLoadingSettings(false);
            }
        };
        checkSettings();
    }, []);

    // Check if can generate idea
    const canGenerateIdea = formData.useBrandSettings && formData.title.trim().length > 0;

    const handleGenerateIdea = useCallback(async () => {
        if (!canGenerateIdea) return;

        setGeneratingIdea(true);
        setGeneratedIdea(null);
        try {
            const response = await videoScriptApi.generateIdea({
                title: formData.title,
                duration: formData.duration,
                sceneCount: formData.sceneCount,
                useBrandSettings: formData.useBrandSettings
            });
            if (response.success && response.data) {
                setGeneratedIdea(response.data);
                // Set summary as customIdea for the script generation
                setFormData(prev => ({ ...prev, customIdea: response.data.summary }));
            }
        } catch (error) {
            console.error('Error generating idea:', error);
        } finally {
            setGeneratingIdea(false);
        }
    }, [canGenerateIdea, formData.title, formData.duration, formData.sceneCount, formData.useBrandSettings]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.title) {
            onSubmit(formData);
        }
    };

    const isValid = formData.title.trim();

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* Brand Settings Toggle */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "p-4 rounded-xl border transition-all duration-300",
                    formData.useBrandSettings
                        ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300"
                        : "bg-gray-50 border-gray-200"
                )}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🏷️</span>
                        <div>
                            <p className="font-medium text-gray-800">
                                Sử dụng thông tin thương hiệu
                            </p>
                            <p className="text-xs text-gray-500">
                                {loadingSettings
                                    ? 'Đang kiểm tra...'
                                    : hasBrandSettings
                                        ? 'Bật để sử dụng AI tạo ý tưởng'
                                        : 'Chưa có thông tin thương hiệu'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {!hasBrandSettings && !loadingSettings && (
                            <Link
                                href="/admin/settings"
                                className="text-xs text-amber-600 hover:text-amber-700 underline"
                            >
                                Thiết lập ngay
                            </Link>
                        )}
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, useBrandSettings: !formData.useBrandSettings })}
                            disabled={isLoading || loadingSettings || !hasBrandSettings}
                            className={cn(
                                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                                formData.useBrandSettings ? "bg-amber-500" : "bg-gray-300",
                                (!hasBrandSettings || loadingSettings) && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <span
                                className={cn(
                                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
                                    formData.useBrandSettings ? "translate-x-6" : "translate-x-1"
                                )}
                            />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Row 1: Duration + Scene Count */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Duration - Custom Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thời lượng dự kiến
                    </label>
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            placeholder="VD: 3 phút, 5 phút..."
                            disabled={isLoading}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                        />
                        <div className="flex flex-wrap gap-2">
                            {durationOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, duration: opt.value })}
                                    disabled={isLoading}
                                    className={cn(
                                        'px-3 py-1 text-xs rounded-lg border transition-all',
                                        formData.duration === opt.value
                                            ? 'border-[#F59E0B] bg-amber-50 text-[#F59E0B]'
                                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Scene Count - Custom Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số lượng cảnh quay
                    </label>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                min={2}
                                max={20}
                                value={formData.sceneCount}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value) || 6;
                                    setFormData({ ...formData, sceneCount: Math.min(20, Math.max(2, value)) });
                                }}
                                disabled={isLoading}
                                className="w-24 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all text-center"
                            />
                            <span className="text-sm text-gray-500">cảnh (2 - 20)</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {sceneCountOptions.map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, sceneCount: opt })}
                                    disabled={isLoading}
                                    className={cn(
                                        'px-3 py-1 text-xs rounded-lg border transition-all',
                                        formData.sceneCount === opt
                                            ? 'border-[#F59E0B] bg-amber-50 text-[#F59E0B]'
                                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                    )}
                                >
                                    {opt} cảnh
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 2: Size */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kích thước video
                </label>
                <select
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                >
                    <option value="">-- Chọn --</option>
                    {sizeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {/* Row 3: Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề / Chủ đề video <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="VD: Chấm điểm các loại pasta được yêu thích nhất"
                    rows={2}
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent resize-none transition-all"
                />
            </div>

            {/* Row 4: Idea Mode Selection */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tóm tắt ý tưởng kịch bản
                </label>

                {/* Mode Toggle */}
                <div className="flex gap-3 mb-4">
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, ideaMode: 'ai' })}
                        disabled={isLoading}
                        className={cn(
                            'flex-1 px-4 py-3 rounded-xl border-2 font-medium transition-all flex items-center justify-center gap-2',
                            formData.ideaMode === 'ai'
                                ? 'border-purple-500 bg-purple-500 text-white shadow-lg'
                                : 'border-gray-200 text-gray-500 hover:border-purple-200 bg-white'
                        )}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        AI tạo ý tưởng
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, ideaMode: 'manual' })}
                        disabled={isLoading}
                        className={cn(
                            'flex-1 px-4 py-3 rounded-xl border-2 font-medium transition-all flex items-center justify-center gap-2',
                            formData.ideaMode === 'manual'
                                ? 'border-purple-500 bg-purple-500 text-white shadow-lg'
                                : 'border-gray-200 text-gray-500 hover:border-purple-200 bg-white'
                        )}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Tự nhập ý tưởng
                    </button>
                </div>

                {/* Content based on mode */}
                <AnimatePresence mode="wait">
                    {formData.ideaMode === 'ai' ? (
                        <motion.div
                            key="ai"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-3"
                        >
                            {/* Warning if cannot generate */}
                            {!canGenerateIdea && (
                                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm">
                                    {!formData.useBrandSettings ? (
                                        <p className="text-amber-700">
                                            ⚠️ Vui lòng <strong>bật &quot;Sử dụng thông tin thương hiệu&quot;</strong> ở trên để AI có thể tạo ý tưởng.
                                        </p>
                                    ) : (
                                        <p className="text-amber-700">
                                            ⚠️ Vui lòng <strong>nhập tiêu đề/chủ đề video</strong> để AI biết được nội dung cần tạo.
                                        </p>
                                    )}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleGenerateIdea}
                                disabled={isLoading || generatingIdea || !canGenerateIdea}
                                className={cn(
                                    "px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2",
                                    canGenerateIdea
                                        ? "bg-white border border-purple-200 text-purple-600 hover:bg-purple-50"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                )}
                            >
                                {generatingIdea ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Đang tạo ý tưởng với AI...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Tạo ý tưởng với AI
                                    </>
                                )}
                            </button>

                            {/* Show editable idea after AI generates */}
                            {generatedIdea && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-3"
                                >
                                    {/* Collapsible structured preview */}
                                    <details className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                                        <summary className="cursor-pointer text-sm font-medium text-purple-700 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Xem chi tiết ý tưởng AI đã tạo
                                        </summary>
                                        <div className="mt-3 grid gap-2 text-sm">
                                            <p><strong>🎣 Hook:</strong> {generatedIdea.hook}</p>
                                            <p><strong>📝 Nội dung:</strong> {generatedIdea.mainContent}</p>
                                            <p><strong>🎯 CTA:</strong> {generatedIdea.callToAction}</p>
                                            <p><strong>🎭 Mood:</strong> {generatedIdea.mood}</p>
                                        </div>
                                    </details>

                                    {/* Editable textarea */}
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">
                                            ✏️ Bạn có thể chỉnh sửa tóm tắt bên dưới:
                                        </label>
                                        <textarea
                                            value={formData.customIdea}
                                            onChange={(e) => setFormData({ ...formData, customIdea: e.target.value })}
                                            placeholder="Tóm tắt ý tưởng kịch bản..."
                                            rows={4}
                                            disabled={isLoading}
                                            className="w-full px-4 py-3 rounded-xl border border-purple-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none transition-all"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="manual"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <textarea
                                value={formData.customIdea}
                                onChange={(e) => setFormData({ ...formData, customIdea: e.target.value })}
                                placeholder="Nhập tóm tắt ý tưởng kịch bản của bạn...&#10;VD: Host ngồi tại quán, bất ngờ bị thùng carton rơi trúng đầu → tạo hook hài hước. Sau đó giới thiệu các món ăn nổi bật..."
                                rows={4}
                                disabled={isLoading}
                                className="w-full px-4 py-3 rounded-xl border border-purple-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none transition-all"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Voice Over */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voice Over
                </label>
                <div className="flex gap-4">
                    {[{ value: true, label: 'Có' }, { value: false, label: 'Không' }].map(opt => (
                        <button
                            key={String(opt.value)}
                            type="button"
                            onClick={() => setFormData({ ...formData, hasVoiceOver: opt.value })}
                            disabled={isLoading}
                            className={cn(
                                'px-6 py-2 rounded-lg border-2 font-medium transition-all',
                                formData.hasVoiceOver === opt.value
                                    ? 'border-[#F59E0B] bg-amber-50 text-[#F59E0B]'
                                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Row 6: Other Requirements */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yêu cầu khác
                </label>
                <textarea
                    value={formData.otherRequirements}
                    onChange={(e) => setFormData({ ...formData, otherRequirements: e.target.value })}
                    placeholder='VD: Mood: Năng động - vui - hơi "tấu hài nhẹ"&#10;Nhịp dụng nhanh, rõ punchline...'
                    rows={3}
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent resize-none transition-all"
                />
            </div>

            {/* Submit */}
            <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={!isValid || isLoading}
                isLoading={isLoading}
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Tạo kịch bản với AI
            </Button>
        </motion.form>
    );
}
