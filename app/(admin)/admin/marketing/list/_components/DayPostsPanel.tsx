'use client';

import { motion } from 'framer-motion';
import { PlanPost } from '@/lib/fakeData/marketing';

interface DayPostsPanelProps {
    date: Date;
    posts: PlanPost[];
    onClose: () => void;
}

const channelLabels: Record<string, { label: string; icon: string; color: string }> = {
    facebook: { label: 'Facebook', icon: '📘', color: 'bg-blue-100 text-blue-700' },
    instagram: { label: 'Instagram', icon: '📸', color: 'bg-pink-100 text-pink-700' },
    tiktok: { label: 'TikTok', icon: '🎵', color: 'bg-gray-900 text-white' },
    website: { label: 'Website', icon: '🌐', color: 'bg-green-100 text-green-700' },
    zalo: { label: 'Zalo', icon: '💬', color: 'bg-blue-100 text-blue-700' },
};

const postTypeLabels: Record<string, { label: string; icon: string }> = {
    image: { label: 'Hình ảnh', icon: '🖼️' },
    video: { label: 'Video', icon: '🎬' },
    story: { label: 'Story', icon: '📱' },
    blog: { label: 'Blog', icon: '📝' },
    reel: { label: 'Reel', icon: '🎞️' },
};

const purposeLabels: Record<string, { label: string; color: string }> = {
    engagement: { label: 'Tương tác', color: 'text-purple-600' },
    sales: { label: 'Bán hàng', color: 'text-green-600' },
    awareness: { label: 'Nhận diện', color: 'text-blue-600' },
    traffic: { label: 'Traffic', color: 'text-orange-600' },
    leads: { label: 'Thu leads', color: 'text-cyan-600' },
};

export default function DayPostsPanel({ date, posts, onClose }: DayPostsPanelProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full lg:w-96 bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden flex-shrink-0"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                <div>
                    <h3 className="font-semibold text-gray-900">
                        {date.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h3>
                    <p className="text-sm text-gray-500">{posts.length} bài đăng</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Posts List */}
            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
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
                            className="bg-white rounded-xl p-4 shadow-sm"
                        >
                            {/* Time & Channel */}
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-medium text-gray-900">⏰ {post.time}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${channelInfo?.color || 'bg-gray-100'}`}>
                                    {channelInfo?.icon} {channelInfo?.label || post.channel}
                                </span>
                            </div>

                            {/* Topic */}
                            <h4 className="font-medium text-gray-800 mb-2">{post.topic}</h4>

                            {/* Content Idea */}
                            {post.contentIdea && (
                                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-3">
                                    <p className="text-xs text-amber-600 font-medium mb-1">💡 Ý tưởng nội dung</p>
                                    <p className="text-sm text-gray-700">{post.contentIdea}</p>
                                </div>
                            )}

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="px-2 py-1 bg-gray-100 rounded-lg">
                                    {typeInfo.icon} {typeInfo.label}
                                </span>
                                <span className={`px-2 py-1 bg-gray-100 rounded-lg ${purposeInfo.color}`}>
                                    🎯 {purposeInfo.label}
                                </span>
                            </div>

                            {/* Hashtags */}
                            {post.suggestedHashtags && post.suggestedHashtags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-3">
                                    {post.suggestedHashtags.slice(0, 5).map((tag, i) => (
                                        <span
                                            key={i}
                                            className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full"
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
