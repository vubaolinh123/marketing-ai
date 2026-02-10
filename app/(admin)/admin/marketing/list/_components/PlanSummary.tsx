'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MarketingPlanResult } from '@/lib/fakeData/marketing';

interface PlanSummaryProps {
    plan: MarketingPlanResult;
}

const channelLabels: Record<string, { label: string; icon: string }> = {
    facebook: { label: 'Facebook', icon: '📘' },
    instagram: { label: 'Instagram', icon: '📸' },
    tiktok: { label: 'TikTok', icon: '🎵' },
    website: { label: 'Website', icon: '🌐' },
    zalo: { label: 'Zalo', icon: '💬' },
};

export default function PlanSummary({ plan }: PlanSummaryProps) {
    // Get unique channels from posts
    const channels = [...new Set(plan.posts.map(p => p.channel))];

    // Calculate stats
    const totalPosts = plan.posts.length;
    const scheduledPosts = plan.posts.filter(p => p.status === 'scheduled').length;
    const publishedPosts = plan.posts.filter(p => p.status === 'published').length;

    // Duration in days
    const startDate = new Date(plan.startDate);
    const endDate = new Date(plan.endDate);
    const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    const topTopics = [...plan.posts]
        .slice(0, 3)
        .map(post => post.topic)
        .filter(Boolean);

    return (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 mb-6 border border-amber-200/60 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Campaign Info */}
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{plan.campaignName}</h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                            📅 {startDate.toLocaleDateString('vi-VN')} - {endDate.toLocaleDateString('vi-VN')}
                        </span>
                        <span className="text-gray-300">|</span>
                        <span>{durationDays} ngày</span>
                    </div>
                </div>

                {/* Channels */}
                <div className="flex items-center gap-2">
                    {channels.map(channel => (
                        <span
                            key={channel}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm"
                        >
                            {channelLabels[channel]?.icon || '📄'}
                            {channelLabels[channel]?.label || channel}
                        </span>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-amber-200/50">
                <div className="text-center">
                    <div className="text-2xl font-bold text-[#F59E0B]">{totalPosts}</div>
                    <div className="text-xs text-gray-500">Tổng bài đăng</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">{scheduledPosts}</div>
                    <div className="text-xs text-gray-500">Đã lên lịch</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{publishedPosts}</div>
                    <div className="text-xs text-gray-500">Đã đăng</div>
                </div>
            </div>

            {topTopics.length > 0 && (
                <div className="mt-4 pt-4 border-t border-amber-200/50">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Chủ đề nổi bật</p>
                    <div className="flex flex-wrap gap-2">
                        {topTopics.map((topic, index) => (
                            <span
                                key={`${topic}-${index}`}
                                className="px-2.5 py-1 rounded-full bg-white text-gray-700 text-xs border border-amber-200/70"
                            >
                                {topic}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
