'use client';

import { motion } from 'framer-motion';
import { PlanPost } from '@/lib/fakeData/marketing';

interface DayPostsPanelProps {
    date: Date;
    posts: PlanPost[];
    onClose: () => void;
}

const channelLabels: Record<string, { label: string; icon: string; color: string }> = {
    facebook: { label: 'Facebook', icon: '📘', color: 'bg-blue-100 text-blue-700 border border-blue-200' },
    instagram: { label: 'Instagram', icon: '📸', color: 'bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200' },
    tiktok: { label: 'TikTok', icon: '🎵', color: 'bg-slate-100 text-slate-700 border border-slate-200' },
    website: { label: 'Website', icon: '🌐', color: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
    zalo: { label: 'Zalo', icon: '💬', color: 'bg-cyan-100 text-cyan-700 border border-cyan-200' },
};

const postTypeLabels: Record<string, { label: string; icon: string }> = {
    image: { label: 'Hình ảnh', icon: '🖼️' },
    video: { label: 'Video', icon: '🎬' },
    story: { label: 'Story', icon: '📱' },
    blog: { label: 'Blog', icon: '📝' },
    reel: { label: 'Reel', icon: '🎞️' },
};

const purposeLabels: Record<string, { label: string; color: string }> = {
    engagement: { label: 'Tương tác', color: 'text-violet-700 border-violet-200 bg-violet-50' },
    sales: { label: 'Bán hàng', color: 'text-green-700 border-green-200 bg-green-50' },
    awareness: { label: 'Nhận diện', color: 'text-blue-700 border-blue-200 bg-blue-50' },
    traffic: { label: 'Traffic', color: 'text-amber-700 border-amber-200 bg-amber-50' },
    leads: { label: 'Thu leads', color: 'text-cyan-700 border-cyan-200 bg-cyan-50' },
};

export default function DayPostsPanel({ date, posts, onClose }: DayPostsPanelProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full bg-white/95 rounded-2xl border border-slate-200 overflow-hidden flex-shrink-0 shadow-[0_10px_30px_rgba(15,23,42,0.12)]"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                <div>
                    <h3 className="font-semibold text-slate-800 text-lg leading-tight capitalize">
                        {date.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">{posts.length} bài đăng</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200 bg-white text-slate-500 hover:text-slate-700"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Posts List */}
            <div className="p-4 xl:p-5 space-y-3.5 max-h-[calc(100vh-280px)] xl:max-h-[calc(100vh-300px)] overflow-y-auto bg-gradient-to-b from-white to-slate-50/70">
                {posts.map((post, index) => {
                    const channelInfo = channelLabels[post.channel];
                    const typeInfo = postTypeLabels[post.postType || 'image'];
                    const purposeInfo = purposeLabels[post.purpose || 'engagement'];

                    return (
                        <motion.div
                            key={post.id || index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03, duration: 0.2 }}
                            className="bg-white rounded-xl p-4 shadow-sm border border-slate-200"
                        >
                            {/* Time & Channel */}
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-semibold text-slate-700 text-base">⏰ {post.time}</span>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${channelInfo?.color || 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                                    {channelInfo?.icon} {channelInfo?.label || post.channel}
                                </span>
                            </div>

                            {/* Topic */}
                            <h4 className="font-semibold text-slate-800 text-base leading-6 mb-2">{post.topic}</h4>

                            {/* Content Idea */}
                            {post.contentIdea && (
                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3.5 mb-3">
                                    <p className="text-xs text-blue-700 font-semibold mb-1.5">💡 Ý tưởng nội dung</p>
                                    <p className="text-sm text-slate-700 leading-6">{post.contentIdea}</p>
                                </div>
                            )}

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg font-medium">
                                    {typeInfo.icon} {typeInfo.label}
                                </span>
                                <span className={`px-2.5 py-1.5 rounded-lg border font-medium ${purposeInfo.color}`}>
                                    🎯 {purposeInfo.label}
                                </span>
                            </div>

                            {/* Hashtags */}
                            {post.suggestedHashtags && post.suggestedHashtags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-3.5">
                                    {post.suggestedHashtags.slice(0, 5).map((tag, i) => (
                                        <span
                                            key={i}
                                            className="text-xs text-cyan-700 bg-cyan-50 border border-cyan-100 px-2.5 py-1 rounded-full"
                                        >
                                            #{tag.replace(/^#/, '')}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
