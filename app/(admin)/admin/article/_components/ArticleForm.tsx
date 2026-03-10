'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { settingsApi } from '@/lib/api';

export interface ArticleFormData {
    topic: string;
    purpose: string;
    wordCount: number;
    description: string;
    useBrandSettings: boolean;
    writingStyle: 'sales' | 'lifestyle' | 'technical' | 'balanced';
    storytellingDepth: 'low' | 'medium' | 'high';
}

const writingStyleOptions = [
    { value: 'sales' as const, label: 'Bán hàng', description: 'Nhịp nhanh, rõ ý, CTA mạnh' },
    { value: 'lifestyle' as const, label: 'Đời sống/văn hoá', description: 'Trầm, có hình ảnh, hơi thở người thật' },
    { value: 'technical' as const, label: 'Kỹ thuật', description: 'Rõ ràng, tuần tự' },
    { value: 'balanced' as const, label: 'Cân bằng', description: 'Phối hợp linh hoạt' },
];

const storytellingDepthOptions = [
    { value: 'low' as const, label: 'Thấp' },
    { value: 'medium' as const, label: 'Vừa' },
    { value: 'high' as const, label: 'Cao' },
];

// Word count options
const wordCountOptions = [
    { value: 150, label: 'Ngắn gọn (150 từ)' },
    { value: 250, label: 'Vừa phải (250 từ)' },
    { value: 400, label: 'Chi tiết (400 từ)' },
    { value: 600, label: 'Dài (600 từ)' },
];

interface ArticleFormProps {
    onSubmit: (data: ArticleFormData) => void;
    isLoading: boolean;
    submitLabel?: string;
}

export default function ArticleForm({ onSubmit, isLoading, submitLabel = 'Tạo bài viết với AI' }: ArticleFormProps) {
    const [formData, setFormData] = useState<ArticleFormData>({
        topic: '',
        purpose: '',
        wordCount: 250,
        description: '',
        useBrandSettings: false,
        writingStyle: 'balanced',
        storytellingDepth: 'medium',
    });

    // Brand settings states
    const [hasBrandSettings, setHasBrandSettings] = useState(false);
    const [loadingSettings, setLoadingSettings] = useState(true);

    // Check if user has brand settings on mount
    useEffect(() => {
        const checkSettings = async () => {
            try {
                const hasSettings = await settingsApi.checkHasBrandSettings();
                setHasBrandSettings(hasSettings);
                // Default to ON if user has brand settings
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.topic && formData.purpose && formData.description) {
            onSubmit(formData);
        }
    };

    const isValid = formData.topic && formData.purpose && formData.description.trim().length > 10;

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
                                        ? 'Áp dụng AI Settings đã thiết lập'
                                        : 'Chưa thiết lập AI Settings'}
                            </p>
                        </div>
                    </div>

                    {/* Toggle Switch */}
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, useBrandSettings: !formData.useBrandSettings })}
                        disabled={!hasBrandSettings || loadingSettings || isLoading}
                        className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2",
                            formData.useBrandSettings ? "bg-amber-500" : "bg-gray-300",
                            (!hasBrandSettings || loadingSettings) && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <span
                            className={cn(
                                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm",
                                formData.useBrandSettings ? "translate-x-6" : "translate-x-1"
                            )}
                        />
                    </button>
                </div>

                {/* Link to settings if not configured */}
                {!hasBrandSettings && !loadingSettings && (
                    <Link
                        href="/admin/settings"
                        className="mt-3 inline-flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Thiết lập thông tin thương hiệu
                    </Link>
                )}
            </motion.div>

            {/* Topic Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chủ đề bài viết
                </label>
                <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="Nhập chủ đề bạn muốn viết..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                    disabled={isLoading}
                />
            </div>

            {/* Purpose Input (free-text + optional presets) */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Mục đích bài viết
                </label>
                <textarea
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    placeholder="Ví dụ: Tăng nhận diện thương hiệu cho món mới và kéo tương tác Facebook"
                    rows={3}
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent resize-none transition-all"
                />

                <div className="mt-3 flex flex-wrap gap-2">
                    {[
                        'Tăng nhận diện thương hiệu',
                        'Thu hút khách tiềm năng',
                        'Nuôi dưỡng & giáo dục',
                        'Chuyển đổi bán hàng',
                        'Giữ chân & trung thành',
                        'Định vị thương hiệu'
                    ].map((preset) => (
                        <button
                            key={preset}
                            type="button"
                            onClick={() => setFormData({ ...formData, purpose: preset })}
                            disabled={isLoading}
                            className="px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 text-gray-700 hover:border-[#F59E0B] hover:text-[#B45309] hover:bg-amber-50 transition-all"
                        >
                            {preset}
                        </button>
                    ))}
                </div>

                <p className="mt-1 text-xs text-gray-500">
                    Bạn có thể nhập tự do theo mục tiêu content, không bị giới hạn theo danh sách có sẵn.
                </p>
            </div>

            {/* Word Count Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Độ dài bài viết (số từ)
                </label>
                <div className="space-y-3">
                    {/* Number Input */}
                    <div className="flex items-center gap-3">
                        <input
                            type="number"
                            min={50}
                            max={2000}
                            step={50}
                            value={formData.wordCount}
                            onChange={(e) => {
                                const value = parseInt(e.target.value) || 250;
                                setFormData({ ...formData, wordCount: Math.min(2000, Math.max(50, value)) });
                            }}
                            disabled={isLoading}
                            className="w-32 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 text-center font-medium focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                        />
                        <span className="text-sm text-gray-500">từ (50 - 2000)</span>
                    </div>

                    {/* Quick Select Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-gray-500 self-center mr-1">Gợi ý:</span>
                        {wordCountOptions.map((option) => (
                            <motion.button
                                key={option.value}
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setFormData({ ...formData, wordCount: option.value })}
                                disabled={isLoading}
                                className={cn(
                                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                                    formData.wordCount === option.value
                                        ? 'bg-[#F59E0B] text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                )}
                            >
                                {option.value} từ
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Writing controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phong cách viết
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {writingStyleOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setFormData({ ...formData, writingStyle: option.value })}
                                disabled={isLoading}
                                className={cn(
                                    'p-3 rounded-xl border text-left transition-all',
                                    formData.writingStyle === option.value
                                        ? 'border-[#F59E0B] bg-amber-50'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                )}
                            >
                                <p className={cn(
                                    'text-sm font-medium',
                                    formData.writingStyle === option.value ? 'text-[#B45309]' : 'text-gray-800'
                                )}>
                                    {option.label}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Độ sâu storytelling
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {storytellingDepthOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setFormData({ ...formData, storytellingDepth: option.value })}
                                disabled={isLoading}
                                className={cn(
                                    'px-3 py-2 rounded-lg text-sm font-medium border transition-all',
                                    formData.storytellingDepth === option.value
                                        ? 'bg-[#F59E0B] text-white border-[#F59E0B]'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                                )}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                        Chọn mức độ kể chuyện để AI điều chỉnh chiều sâu nội dung.
                    </p>
                </div>
            </div>

            {/* Description Textarea */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả chi tiết
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả chi tiết nội dung bạn muốn AI tạo..."
                    rows={5}
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent resize-none transition-all"
                />
                <p className="mt-1 text-xs text-gray-500">
                    Tối thiểu 10 ký tự
                </p>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={!isValid || isLoading}
                isLoading={isLoading}
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {submitLabel}
            </Button>
        </motion.form>
    );
}
