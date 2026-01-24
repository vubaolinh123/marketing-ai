'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { durationOptions, sizeOptions, fakeIdeaSummaries, type VideoScriptInput } from '@/lib/fakeData';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface VideoScriptFormProps {
    onSubmit: (data: VideoScriptInput) => void;
    isLoading: boolean;
}

export default function VideoScriptForm({ onSubmit, isLoading }: VideoScriptFormProps) {
    const [formData, setFormData] = useState<VideoScriptInput>({
        duration: '',
        size: '',
        title: '',
        hasVoiceOver: true,
        otherRequirements: '',
        ideaMode: 'ai',
        customIdea: '',
    });
    const [generatingIdea, setGeneratingIdea] = useState(false);

    const handleGenerateIdea = useCallback(async () => {
        setGeneratingIdea(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const randomIdea = fakeIdeaSummaries[Math.floor(Math.random() * fakeIdeaSummaries.length)];
        setFormData(prev => ({ ...prev, customIdea: randomIdea }));
        setGeneratingIdea(false);
    }, []);

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
            {/* Row 1: Duration + Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thời lượng dự kiến
                    </label>
                    <select
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        disabled={isLoading}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                    >
                        <option value="">-- Chọn --</option>
                        {durationOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
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
            </div>

            {/* Row 2: Title */}
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

            {/* Row 3: Idea Mode Selection */}
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
                            <p className="text-sm text-gray-500">
                                AI sẽ tự động tạo ý tưởng kịch bản dựa trên thông tin bạn cung cấp, hoặc bấm nút bên dưới để xem trước.
                            </p>
                            <button
                                type="button"
                                onClick={handleGenerateIdea}
                                disabled={isLoading || generatingIdea}
                                className="px-4 py-2 rounded-lg bg-white border border-purple-200 text-purple-600 font-medium hover:bg-purple-50 transition-all flex items-center gap-2"
                            >
                                {generatingIdea ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Đang tạo...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Xem trước ý tưởng AI
                                    </>
                                )}
                            </button>
                            {formData.customIdea && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-4 rounded-xl bg-white border border-purple-200"
                                >
                                    <p className="text-sm text-gray-700 leading-relaxed">{formData.customIdea}</p>
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
                    placeholder="VD: Mood: Năng động - vui - hơi &quot;tấu hài nhẹ&quot;&#10;Nhịp dụng nhanh, rõ punchline..."
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
