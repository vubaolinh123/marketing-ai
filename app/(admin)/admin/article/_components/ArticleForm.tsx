'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { fakeTopics, purposeOptions } from '@/lib/fakeData';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface ArticleFormData {
    topic: string;
    purpose: string;
    description: string;
}

interface ArticleFormProps {
    onSubmit: (data: ArticleFormData) => void;
    isLoading: boolean;
}

export default function ArticleForm({ onSubmit, isLoading }: ArticleFormProps) {
    const [formData, setFormData] = useState<ArticleFormData>({
        topic: '',
        purpose: '',
        description: '',
    });

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
            {/* Topic Select */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chủ đề bài viết
                </label>
                <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                    disabled={isLoading}
                >
                    <option value="">-- Chọn chủ đề --</option>
                    {fakeTopics.map((topic) => (
                        <option key={topic.value} value={topic.value}>
                            {topic.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Purpose Radio */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Mục đích bài viết
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {purposeOptions.map((option) => (
                        <motion.button
                            key={option.value}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setFormData({ ...formData, purpose: option.value })}
                            disabled={isLoading}
                            className={cn(
                                'p-4 rounded-xl border-2 transition-all duration-200 text-left',
                                formData.purpose === option.value
                                    ? 'border-[#F59E0B] bg-amber-50'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                            )}
                        >
                            <span className="text-2xl mb-2 block">{option.icon}</span>
                            <span className={cn(
                                'font-medium',
                                formData.purpose === option.value ? 'text-[#F59E0B]' : 'text-gray-700'
                            )}>
                                {option.label}
                            </span>
                        </motion.button>
                    ))}
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
                Tạo bài viết với AI
            </Button>
        </motion.form>
    );
}
