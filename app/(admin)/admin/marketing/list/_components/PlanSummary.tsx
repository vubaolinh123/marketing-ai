'use client';
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
        <div className="bg-gradient-to-r from-white via-slate-50 to-blue-50/60 rounded-2xl p-5 mb-5 border border-slate-200 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Campaign Info */}
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-slate-800 mb-1 tracking-tight">{plan.campaignName}</h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200">
                            📅 {startDate.toLocaleDateString('vi-VN')} - {endDate.toLocaleDateString('vi-VN')}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200">
                            ⏱️ {durationDays} ngày
                        </span>
                    </div>
                </div>

                {/* Channels */}
                <div className="flex flex-wrap items-center gap-2">
                    {channels.map(channel => (
                        <span
                            key={channel}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white rounded-full text-sm font-medium text-slate-700 border border-slate-200"
                        >
                            {channelLabels[channel]?.icon || '📄'}
                            {channelLabels[channel]?.label || channel}
                        </span>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-200">
                <div className="text-center rounded-xl border border-blue-100 bg-blue-50/60 py-3">
                    <div className="text-2xl font-bold text-blue-600">{totalPosts}</div>
                    <div className="text-xs text-slate-500">Tổng bài đăng</div>
                </div>
                <div className="text-center rounded-xl border border-sky-100 bg-sky-50/60 py-3">
                    <div className="text-2xl font-bold text-sky-600">{scheduledPosts}</div>
                    <div className="text-xs text-slate-500">Đã lên lịch</div>
                </div>
                <div className="text-center rounded-xl border border-emerald-100 bg-emerald-50/60 py-3">
                    <div className="text-2xl font-bold text-emerald-600">{publishedPosts}</div>
                    <div className="text-xs text-slate-500">Đã đăng</div>
                </div>
            </div>

            {topTopics.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 mb-2">Chủ đề nổi bật</p>
                    <div className="flex flex-wrap gap-2">
                        {topTopics.map((topic, index) => (
                            <span
                                key={`${topic}-${index}`}
                                className="px-2.5 py-1 rounded-full bg-white text-slate-700 text-xs border border-slate-200"
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
