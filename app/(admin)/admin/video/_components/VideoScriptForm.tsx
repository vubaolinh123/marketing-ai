'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { sizeOptions, durationOptions } from '@/lib/fakeData';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { settingsApi, videoScriptApi, GeneratedIdea, VideoConceptItem } from '@/lib/api';

export interface VideoScriptFormData {
    duration: string;
    sceneCount: number;
    size: string;
    title: string;
    videoGoal: string;
    targetAudience: string;
    featuredProductService: string;
    hasVoiceOver: boolean;
    otherRequirements: string;
    ideaMode: 'manual' | 'ai' | 'concept_suggestion';
    customIdea: string;
    selectedConceptTitle?: string;
    useBrandSettings: boolean;
}

interface VideoScriptFormProps {
    onSubmit: (data: VideoScriptFormData) => void;
    isLoading: boolean;
}

// Quick select options for scene count
const sceneCountOptions = [4, 6, 8, 10, 12];

type NormalizedGeneratedIdea = {
    hook: string;
    mainContent: string;
    callToAction: string;
    mood: string;
    summary: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> => (
    typeof value === 'object' && value !== null && !Array.isArray(value)
);

const formatKeyLabel = (key: string): string => {
    const withSpaces = key
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[_-]+/g, ' ')
        .trim();

    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
};

const normalizeIdeaField = (value: unknown): string => {
    if (value === null || value === undefined) return '';

    if (typeof value === 'string') return value.trim();
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);

    if (Array.isArray(value)) {
        return value
            .map((item) => {
                const itemText = normalizeIdeaField(item);
                if (!itemText) return '';

                const lines = itemText.split('\n');
                if (lines.length === 1) return `- ${lines[0]}`;

                return [`- ${lines[0]}`, ...lines.slice(1).map((line) => `  ${line}`)].join('\n');
            })
            .filter(Boolean)
            .join('\n');
    }

    if (isRecord(value)) {
        return Object.entries(value)
            .map(([key, nestedValue]) => {
                const nestedText = normalizeIdeaField(nestedValue);
                const label = formatKeyLabel(key);

                if (!nestedText) return `- ${label}`;

                const lines = nestedText.split('\n');
                if (lines.length === 1) return `- ${label}: ${lines[0]}`;

                return [`- ${label}:`, ...lines.map((line) => `  ${line}`)].join('\n');
            })
            .filter(Boolean)
            .join('\n');
    }

    return '';
};

const normalizeGeneratedIdea = (idea: GeneratedIdea | null | undefined): NormalizedGeneratedIdea => ({
    hook: normalizeIdeaField(idea?.hook),
    mainContent: normalizeIdeaField(idea?.mainContent),
    callToAction: normalizeIdeaField(idea?.callToAction),
    mood: normalizeIdeaField(idea?.mood),
    summary: normalizeIdeaField(idea?.summary),
});

const IdeaFieldBlock = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-1">
        <p className="text-xs font-semibold text-purple-700">{label}</p>
        {value ? (
            <pre className="whitespace-pre-wrap rounded-md border border-purple-100 bg-white/80 px-3 py-2 text-sm text-gray-700 font-sans leading-5">
                {value}
            </pre>
        ) : (
            <p className="text-sm text-gray-400">-</p>
        )}
    </div>
);



export default function VideoScriptForm({ onSubmit, isLoading }: VideoScriptFormProps) {
    const [formData, setFormData] = useState<VideoScriptFormData>({
        duration: '1 phút',
        sceneCount: 6,
        size: '',
        title: '',
        videoGoal: '',
        targetAudience: '',
        featuredProductService: '',
        hasVoiceOver: true,
        otherRequirements: '',
        ideaMode: 'ai',
        customIdea: '',
        selectedConceptTitle: '',
        useBrandSettings: false,
    });
    const [generatingIdea, setGeneratingIdea] = useState(false);
    const [generatedIdea, setGeneratedIdea] = useState<NormalizedGeneratedIdea | null>(null);
    const [suggestingConcepts, setSuggestingConcepts] = useState(false);
    const [suggestedConcepts, setSuggestedConcepts] = useState<VideoConceptItem[]>([]);
    const [selectedConceptIndex, setSelectedConceptIndex] = useState<number | null>(null);
    const [conceptSummary, setConceptSummary] = useState<string>('');
    const [recommendedApproach, setRecommendedApproach] = useState<string>('');

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

    // Check if can generate idea/concepts
    const canUseAiAssist =
        formData.useBrandSettings &&
        formData.title.trim().length > 0 &&
        formData.videoGoal.trim().length > 0 &&
        formData.targetAudience.trim().length > 0 &&
        formData.featuredProductService.trim().length > 0;

    const aiMissingRequirements = [
        !formData.useBrandSettings ? 'Bật thông tin thương hiệu' : null,
        !formData.title.trim() ? 'Tiêu đề/chủ đề video' : null,
        !formData.videoGoal.trim() ? 'Mục tiêu video' : null,
        !formData.targetAudience.trim() ? 'Đối tượng mục tiêu' : null,
        !formData.featuredProductService.trim() ? 'Sản phẩm/dịch vụ nổi bật' : null,
    ].filter(Boolean) as string[];

    const handleGenerateIdea = useCallback(async () => {
        if (!canUseAiAssist) return;

        setGeneratingIdea(true);
        setGeneratedIdea(null);
        try {
            const response = await videoScriptApi.generateIdea({
                title: formData.title,
                duration: formData.duration,
                sceneCount: formData.sceneCount,
                useBrandSettings: formData.useBrandSettings,
                videoGoal: formData.videoGoal,
                targetAudience: formData.targetAudience,
                featuredProductService: formData.featuredProductService
            });
            if (response.success && response.data) {
                const normalizedIdea = normalizeGeneratedIdea(response.data);
                const nextCustomIdea = [normalizedIdea.summary, normalizedIdea.mainContent]
                    .filter(Boolean)
                    .join('\n\n');

                setGeneratedIdea(normalizedIdea);
                // Set normalized summary/content as customIdea for the script generation
                setFormData(prev => ({ ...prev, customIdea: nextCustomIdea, selectedConceptTitle: '' }));
            }
        } catch (error) {
            console.error('Error generating idea:', error);
        } finally {
            setGeneratingIdea(false);
        }
    }, [canUseAiAssist, formData.title, formData.duration, formData.sceneCount, formData.useBrandSettings, formData.videoGoal, formData.targetAudience, formData.featuredProductService]);

    const handleSuggestConcepts = useCallback(async () => {
        if (!canUseAiAssist) return;

        setSuggestingConcepts(true);
        setSuggestedConcepts([]);
        setSelectedConceptIndex(null);
        setConceptSummary('');
        setRecommendedApproach('');

        try {
            const response = await videoScriptApi.suggestConcepts({
                title: formData.title,
                duration: formData.duration,
                sceneCount: formData.sceneCount,
                videoGoal: formData.videoGoal,
                targetAudience: formData.targetAudience,
                featuredProductService: formData.featuredProductService,
                useBrandSettings: formData.useBrandSettings,
                conceptCount: 5,
            });

            if (response.success && response.data) {
                setSuggestedConcepts(response.data.concepts || []);
                setConceptSummary(response.data.summary || '');
                setRecommendedApproach(response.data.recommendedApproach || '');
            }
        } catch (error) {
            console.error('Error suggesting concepts:', error);
        } finally {
            setSuggestingConcepts(false);
        }
    }, [canUseAiAssist, formData.title, formData.duration, formData.sceneCount, formData.videoGoal, formData.targetAudience, formData.featuredProductService, formData.useBrandSettings]);

    const applySelectedConcept = useCallback(() => {
        if (selectedConceptIndex === null) return;
        const concept = suggestedConcepts[selectedConceptIndex];
        if (!concept) return;

        const combinedIdea = [
            `Concept: ${concept.title}`,
            `Hook: ${concept.hook}`,
            `Thông điệp chính: ${concept.coreMessage}`,
            `Hướng hình ảnh: ${concept.visualDirection}`,
            `CTA: ${concept.cta}`,
            `Mood: ${concept.mood}`,
        ].join('\n');

        setFormData(prev => ({
            ...prev,
            customIdea: combinedIdea,
            selectedConceptTitle: concept.title,
        }));
    }, [selectedConceptIndex, suggestedConcepts]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (
            formData.title.trim() &&
            formData.videoGoal.trim() &&
            formData.targetAudience.trim() &&
            formData.featuredProductService.trim() &&
            (formData.customIdea.trim() || formData.selectedConceptTitle?.trim())
        ) {
            onSubmit(formData);
        }
    };

    const isValid =
        formData.title.trim() &&
        formData.videoGoal.trim() &&
        formData.targetAudience.trim() &&
        formData.featuredProductService.trim() &&
        (formData.customIdea.trim() || formData.selectedConceptTitle?.trim());

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

            {/* Row 4: Business Context */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mục tiêu video <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.videoGoal}
                        onChange={(e) => setFormData({ ...formData, videoGoal: e.target.value })}
                        placeholder="VD: Tăng nhận diện thương hiệu / chốt đơn sản phẩm mới"
                        disabled={isLoading}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Đối tượng mục tiêu <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.targetAudience}
                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                        placeholder="VD: Nữ 22-30, dân văn phòng"
                        disabled={isLoading}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sản phẩm / dịch vụ nổi bật <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.featuredProductService}
                        onChange={(e) => setFormData({ ...formData, featuredProductService: e.target.value })}
                        placeholder="VD: Combo steak signature"
                        disabled={isLoading}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Row 5: Idea Mode Selection */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tóm tắt ý tưởng kịch bản <span className="text-red-500">*</span>
                </label>

                {/* Mode Toggle */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, ideaMode: 'manual' })}
                        disabled={isLoading}
                        className={cn(
                            'px-4 py-3 rounded-xl border-2 font-medium transition-all flex items-center justify-center gap-2 text-sm',
                            formData.ideaMode === 'manual'
                                ? 'border-purple-500 bg-purple-500 text-white shadow-lg'
                                : 'border-gray-200 text-gray-500 hover:border-purple-200 bg-white'
                        )}
                    >
                        Tự nhập ý tưởng
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, ideaMode: 'ai' })}
                        disabled={isLoading}
                        className={cn(
                            'px-4 py-3 rounded-xl border-2 font-medium transition-all flex items-center justify-center gap-2 text-sm',
                            formData.ideaMode === 'ai'
                                ? 'border-purple-500 bg-purple-500 text-white shadow-lg'
                                : 'border-gray-200 text-gray-500 hover:border-purple-200 bg-white'
                        )}
                    >
                        AI tạo 1 ý tưởng nhanh
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, ideaMode: 'concept_suggestion' })}
                        disabled={isLoading}
                        className={cn(
                            'px-4 py-3 rounded-xl border-2 font-medium transition-all flex items-center justify-center gap-2 text-sm',
                            formData.ideaMode === 'concept_suggestion'
                                ? 'border-purple-500 bg-purple-500 text-white shadow-lg'
                                : 'border-gray-200 text-gray-500 hover:border-purple-200 bg-white'
                        )}
                    >
                        AI đề xuất 3-5 concept
                    </button>
                </div>

                {!canUseAiAssist && formData.ideaMode !== 'manual' && (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-700 mb-3">
                        ⚠️ Để dùng AI, vui lòng hoàn thiện: <strong>{aiMissingRequirements.join(', ')}</strong>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {formData.ideaMode === 'manual' && (
                        <motion.div
                            key="manual"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <textarea
                                value={formData.customIdea}
                                onChange={(e) => setFormData({ ...formData, customIdea: e.target.value })}
                                placeholder="Nhập tóm tắt ý tưởng kịch bản của bạn..."
                                rows={5}
                                disabled={isLoading}
                                className="w-full px-4 py-3 rounded-xl border border-purple-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none transition-all"
                            />
                        </motion.div>
                    )}

                    {formData.ideaMode === 'ai' && (
                        <motion.div
                            key="ai"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-3"
                        >
                            <button
                                type="button"
                                onClick={handleGenerateIdea}
                                disabled={isLoading || generatingIdea || !canUseAiAssist}
                                className={cn(
                                    'px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
                                    canUseAiAssist
                                        ? 'bg-white border border-purple-200 text-purple-600 hover:bg-purple-50'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                )}
                            >
                                {generatingIdea ? 'Đang tạo ý tưởng với AI...' : 'Tạo ý tưởng với AI'}
                            </button>

                            {generatedIdea && (
                                <details className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                                    <summary className="cursor-pointer text-sm font-medium text-purple-700">
                                        Xem chi tiết ý tưởng AI đã tạo
                                    </summary>
                                    <div className="mt-3 grid gap-2 text-sm">
                                        <IdeaFieldBlock label="📌 Summary" value={generatedIdea.summary} />
                                        <IdeaFieldBlock label="🎣 Hook" value={generatedIdea.hook} />
                                        <IdeaFieldBlock label="📝 Nội dung" value={generatedIdea.mainContent} />
                                        <IdeaFieldBlock label="🎯 CTA" value={generatedIdea.callToAction} />
                                        <IdeaFieldBlock label="🎭 Mood" value={generatedIdea.mood} />
                                    </div>
                                </details>
                            )}

                            <textarea
                                value={formData.customIdea}
                                onChange={(e) => setFormData({ ...formData, customIdea: e.target.value })}
                                placeholder="Tóm tắt ý tưởng kịch bản..."
                                rows={5}
                                disabled={isLoading}
                                className="w-full px-4 py-3 rounded-xl border border-purple-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none transition-all"
                            />
                        </motion.div>
                    )}

                    {formData.ideaMode === 'concept_suggestion' && (
                        <motion.div
                            key="concept"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <button
                                type="button"
                                onClick={handleSuggestConcepts}
                                disabled={isLoading || suggestingConcepts || !canUseAiAssist}
                                className={cn(
                                    'px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
                                    canUseAiAssist
                                        ? 'bg-white border border-purple-200 text-purple-600 hover:bg-purple-50'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                )}
                            >
                                {suggestingConcepts ? 'Đang tạo concept...' : 'Tạo 3-5 concept'}
                            </button>

                            {conceptSummary && (
                                <div className="p-3 rounded-lg bg-white border border-purple-100 text-sm text-gray-700">
                                    <strong>Tóm tắt:</strong> {conceptSummary}
                                </div>
                            )}
                            {recommendedApproach && (
                                <div className="p-3 rounded-lg bg-white border border-purple-100 text-sm text-gray-700">
                                    <strong>Đề xuất hướng triển khai:</strong> {recommendedApproach}
                                </div>
                            )}

                            {suggestedConcepts.length > 0 && (
                                <div className="grid grid-cols-1 gap-3">
                                    {suggestedConcepts.map((concept, index) => {
                                        const selected = selectedConceptIndex === index;
                                        return (
                                            <button
                                                key={`${concept.title}-${index}`}
                                                type="button"
                                                onClick={() => setSelectedConceptIndex(index)}
                                                className={cn(
                                                    'text-left p-4 rounded-xl border transition-all bg-white',
                                                    selected
                                                        ? 'border-purple-500 ring-2 ring-purple-200'
                                                        : 'border-gray-200 hover:border-purple-300'
                                                )}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="font-semibold text-gray-900">{concept.title}</h4>
                                                    <span className={cn(
                                                        'w-4 h-4 rounded-full border-2 mt-1 flex-shrink-0',
                                                        selected ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                                                    )} />
                                                </div>
                                                <p className="text-sm text-gray-600 mt-2"><strong>Hook:</strong> {concept.hook}</p>
                                                <p className="text-sm text-gray-600 mt-1"><strong>Core:</strong> {concept.coreMessage}</p>
                                                <p className="text-sm text-gray-600 mt-1"><strong>Visual:</strong> {concept.visualDirection}</p>
                                                <p className="text-sm text-gray-600 mt-1"><strong>CTA:</strong> {concept.cta}</p>
                                                <p className="text-sm text-gray-600 mt-1"><strong>Mood:</strong> {concept.mood}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={applySelectedConcept}
                                    disabled={selectedConceptIndex === null || isLoading}
                                    className={cn(
                                        'px-4 py-2 rounded-lg font-medium transition-all',
                                        selectedConceptIndex !== null
                                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    )}
                                >
                                    Dùng concept này
                                </button>
                                {formData.selectedConceptTitle && (
                                    <span className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded-full">
                                        Đã áp dụng: {formData.selectedConceptTitle}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">
                                    ✏️ Bạn có thể chỉnh sửa tự do sau khi áp dụng concept:
                                </label>
                                <textarea
                                    value={formData.customIdea}
                                    onChange={(e) => setFormData({ ...formData, customIdea: e.target.value })}
                                    placeholder="Tóm tắt ý tưởng kịch bản..."
                                    rows={5}
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 rounded-xl border border-purple-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none transition-all"
                                />
                            </div>
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
