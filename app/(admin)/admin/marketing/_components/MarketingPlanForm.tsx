'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import TagsInput from '@/app/(admin)/admin/settings/_components/TagsInput';
import {
    MarketingPlanInput,
    postFrequencyOptions,
    postTimeOptions,
    goalOptions,
    channelOptions,
    suggestedTopics,
} from '@/lib/fakeData/marketing';

interface MarketingPlanFormProps {
    data: MarketingPlanInput;
    onChange: (data: MarketingPlanInput) => void;
    onSubmit: () => void;
    isLoading?: boolean;
}

export default function MarketingPlanForm({ data, onChange, onSubmit, isLoading }: MarketingPlanFormProps) {
    const canSubmit = data.campaignName && data.startDate && data.endDate && data.topics.length > 0 && data.channels.length > 0;

    const toggleArrayItem = (field: 'postTimes' | 'goals' | 'channels', value: string) => {
        const current = data[field];
        const updated = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        onChange({ ...data, [field]: updated });
    };

    const addSuggestedTopic = (topic: string) => {
        if (!data.topics.includes(topic)) {
            onChange({ ...data, topics: [...data.topics, topic] });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Campaign Name */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white flex items-center justify-center text-sm font-bold">1</span>
                    Thông tin chiến dịch
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên chiến dịch <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.campaignName}
                            onChange={(e) => onChange({ ...data, campaignName: e.target.value })}
                            placeholder="VD: Chiến dịch Tết 2025"
                            disabled={isLoading}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div lang="vi">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ngày bắt đầu <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={data.startDate}
                                onChange={(e) => onChange({ ...data, startDate: e.target.value })}
                                disabled={isLoading}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                            />
                        </div>
                        <div lang="vi">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ngày kết thúc <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={data.endDate}
                                onChange={(e) => onChange({ ...data, endDate: e.target.value })}
                                disabled={isLoading}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Frequency & Times */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white flex items-center justify-center text-sm font-bold">2</span>
                    Tần suất đăng bài
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Số bài/tuần</label>
                        <div className="flex flex-wrap gap-3">
                            {postFrequencyOptions.map(option => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => onChange({ ...data, postsPerWeek: option.value })}
                                    disabled={isLoading}
                                    className={cn(
                                        'px-4 py-2.5 rounded-xl border-2 font-medium transition-all',
                                        data.postsPerWeek === option.value
                                            ? 'border-[#F59E0B] bg-amber-50 text-[#F59E0B]'
                                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                    )}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Khung giờ đăng</label>
                        <div className="flex flex-wrap gap-2">
                            {postTimeOptions.map(option => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => toggleArrayItem('postTimes', option.value)}
                                    disabled={isLoading}
                                    className={cn(
                                        'px-4 py-2 rounded-full border-2 font-medium transition-all',
                                        data.postTimes.includes(option.value)
                                            ? 'border-[#F59E0B] bg-amber-50 text-[#F59E0B]'
                                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                    )}
                                >
                                    {data.postTimes.includes(option.value) && '✓ '}
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Topics */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white flex items-center justify-center text-sm font-bold">3</span>
                    Chủ đề nội dung
                </h3>

                <TagsInput
                    value={data.topics}
                    onChange={(topics) => onChange({ ...data, topics })}
                    placeholder="Nhập chủ đề và Enter..."
                    disabled={isLoading}
                />

                <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Gợi ý:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedTopics.map(topic => (
                            <button
                                key={topic}
                                type="button"
                                onClick={() => addSuggestedTopic(topic)}
                                disabled={data.topics.includes(topic) || isLoading}
                                className={cn(
                                    'px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                                    data.topics.includes(topic)
                                        ? 'border-[#F59E0B] bg-amber-50 text-[#F59E0B] cursor-not-allowed'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#F59E0B] hover:text-[#F59E0B]'
                                )}
                            >
                                {data.topics.includes(topic) ? '✓ ' : ''}{topic}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Goals & Channels */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white flex items-center justify-center text-sm font-bold">4</span>
                    Mục tiêu & Kênh đăng
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Mục tiêu</label>
                        <div className="flex flex-wrap gap-2">
                            {goalOptions.map(option => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => toggleArrayItem('goals', option.value)}
                                    disabled={isLoading}
                                    className={cn(
                                        'px-4 py-2 rounded-full border-2 font-medium transition-all',
                                        data.goals.includes(option.value)
                                            ? 'border-[#F59E0B] bg-amber-50 text-[#F59E0B]'
                                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                    )}
                                >
                                    {data.goals.includes(option.value) && '✓ '}
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Kênh đăng <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {channelOptions.map(option => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => toggleArrayItem('channels', option.value)}
                                    disabled={isLoading}
                                    className={cn(
                                        'px-4 py-2.5 rounded-xl border-2 font-medium transition-all flex items-center gap-2',
                                        data.channels.includes(option.value)
                                            ? 'border-[#F59E0B] bg-amber-50 text-[#F59E0B]'
                                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                    )}
                                >
                                    <span>{option.icon}</span>
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ghi chú thêm</h3>
                <textarea
                    value={data.notes}
                    onChange={(e) => onChange({ ...data, notes: e.target.value })}
                    placeholder="Yêu cầu đặc biệt cho AI..."
                    rows={3}
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent resize-none transition-all"
                />
            </div>

            {/* Submit */}
            <div className="flex justify-center">
                <Button
                    onClick={onSubmit}
                    variant="primary"
                    size="lg"
                    disabled={!canSubmit}
                    isLoading={isLoading}
                    className="min-w-[200px] shadow-xl"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Tạo kế hoạch
                </Button>
            </div>
        </motion.div>
    );
}
