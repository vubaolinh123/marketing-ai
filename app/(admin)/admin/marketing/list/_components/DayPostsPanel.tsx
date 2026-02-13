'use client';

import { motion } from 'framer-motion';
import { PlanPost } from '@/lib/fakeData/marketing';

interface DayPostsPanelProps {
    date: Date;
    posts: PlanPost[];
    onClose: () => void;
}

const channelLabels: Record<string, { label: string; icon: string; color: string }> = {
    facebook: { label: 'Facebook', icon: '📘', color: 'bg-blue-500/20 text-blue-100 border border-blue-300/30' },
    instagram: { label: 'Instagram', icon: '📸', color: 'bg-pink-500/20 text-pink-100 border border-pink-300/30' },
    tiktok: { label: 'TikTok', icon: '🎵', color: 'bg-slate-700 text-slate-100 border border-slate-500/60' },
    website: { label: 'Website', icon: '🌐', color: 'bg-emerald-500/20 text-emerald-100 border border-emerald-300/30' },
    zalo: { label: 'Zalo', icon: '💬', color: 'bg-cyan-500/20 text-cyan-100 border border-cyan-300/30' },
};

const postTypeLabels: Record<string, { label: string; icon: string }> = {
    image: { label: 'Hình ảnh', icon: '🖼️' },
    video: { label: 'Video', icon: '🎬' },
    story: { label: 'Story', icon: '📱' },
    blog: { label: 'Blog', icon: '📝' },
    reel: { label: 'Reel', icon: '🎞️' },
};

const purposeLabels: Record<string, { label: string; color: string }> = {
    engagement: { label: 'Tương tác', color: 'text-purple-200 border-purple-300/30 bg-purple-500/20' },
    sales: { label: 'Bán hàng', color: 'text-green-200 border-green-300/30 bg-green-500/20' },
    awareness: { label: 'Nhận diện', color: 'text-blue-200 border-blue-300/30 bg-blue-500/20' },
    traffic: { label: 'Traffic', color: 'text-orange-200 border-orange-300/30 bg-orange-500/20' },
    leads: { label: 'Thu leads', color: 'text-cyan-200 border-cyan-300/30 bg-cyan-500/20' },
};

export default function DayPostsPanel({ date, posts, onClose }: DayPostsPanelProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full xl:w-[420px] bg-slate-900/95 rounded-2xl border border-slate-700 overflow-hidden flex-shrink-0 shadow-[0_10px_35px_rgba(2,6,23,0.45)]"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
                <div>
                    <h3 className="font-semibold text-slate-100 text-lg leading-tight">
                        {date.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h3>
                    <p className="text-sm text-slate-300 mt-0.5">{posts.length} bài đăng</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-slate-700 transition-colors border border-slate-600 bg-slate-800"
                >
                    <svg className="w-4 h-4 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Posts List */}
            <div className="p-4 xl:p-5 space-y-4 max-h-[64vh] overflow-y-auto bg-slate-900/50">
                {posts.map((post, index) => {
                    const channelInfo = channelLabels[post.channel];
                    const typeInfo = postTypeLabels[post.postType || 'image'];
                    const purposeInfo = purposeLabels[post.purpose || 'engagement'];

                    return (
                        <motion.div
                            key={post.id || index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-slate-800/95 rounded-xl p-5 shadow-lg border border-slate-600"
                        >
                            {/* Time & Channel */}
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-semibold text-slate-100 text-base">⏰ {post.time}</span>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${channelInfo?.color || 'bg-slate-700 text-slate-100 border border-slate-500'}`}>
                                    {channelInfo?.icon} {channelInfo?.label || post.channel}
                                </span>
                            </div>

                            {/* Topic */}
                            <h4 className="font-semibold text-slate-100 text-base leading-6 mb-2">{post.topic}</h4>

                            {/* Content Idea */}
                            {post.contentIdea && (
                                <div className="bg-amber-500/12 border border-amber-300/30 rounded-lg p-3.5 mb-3">
                                    <p className="text-xs text-amber-200 font-semibold mb-1.5">💡 Ý tưởng nội dung</p>
                                    <p className="text-sm text-slate-100 leading-6">{post.contentIdea}</p>
                                </div>
                            )}

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="px-2.5 py-1.5 bg-slate-700 border border-slate-500/70 text-slate-100 rounded-lg font-medium">
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
                                            className="text-xs text-cyan-100 bg-cyan-500/20 border border-cyan-300/30 px-2.5 py-1 rounded-full"
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
