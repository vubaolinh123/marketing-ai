'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';

const PROMPT_STORAGE_KEY = 'ai-content-prompt';

export default function PromptForm() {
    const [prompt, setPrompt] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Load saved prompt on mount
    useEffect(() => {
        const saved = localStorage.getItem(PROMPT_STORAGE_KEY);
        if (saved) {
            setPrompt(saved);
        }
    }, []);

    const handleSave = async () => {
        setIsLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        localStorage.setItem(PROMPT_STORAGE_KEY, prompt);
        setIsSaved(true);
        setIsLoading(false);

        // Reset saved state after 3 seconds
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="space-y-6">
            {/* Prompt Textarea */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prompt cho AI
                </label>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Nhập prompt hướng dẫn AI tạo nội dung theo phong cách của bạn..."
                    rows={10}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent resize-none transition-all"
                />
                <p className="mt-2 text-sm text-gray-500">
                    Prompt này sẽ được sử dụng cho tất cả các công cụ tạo nội dung AI.
                </p>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4">
                <Button
                    onClick={handleSave}
                    variant="primary"
                    size="lg"
                    isLoading={isLoading}
                    disabled={isLoading}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Lưu cài đặt
                </Button>

                {/* Success Message */}
                {isSaved && (
                    <span className="text-green-600 text-sm flex items-center gap-2 animate-fade-in">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Đã lưu thành công!
                    </span>
                )}
            </div>
        </div>
    );
}
