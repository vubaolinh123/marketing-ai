'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { PlanPost, channelOptions } from '@/lib/fakeData/marketing';

interface DayDetailModalProps {
    date: Date | null;
    posts: PlanPost[];
    onClose: () => void;
}

export default function DayDetailModal({ date, posts, onClose }: DayDetailModalProps) {
    if (!date) return null;

    const getChannelInfo = (channel: string) => {
        return channelOptions.find(c => c.value === channel) || { label: channel, icon: '📄' };
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#F59E0B] to-[#EA580C] p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {date.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </h3>
                                <p className="text-white/80 text-sm">{posts.length} bài đăng</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Posts */}
                    <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
                        {posts.map((post, index) => {
                            const channelInfo = getChannelInfo(post.channel);
                            const postTypeLabels: Record<string, string> = {
                                image: '📷 Ảnh',
                                video: '🎬 Video',
                                story: '📱 Story',
                                blog: '📝 Blog',
                                reel: '🎵 Reel'
                            };
                            const purposeLabels: Record<string, string> = {
                                engagement: 'Tăng tương tác',
                                sales: 'Bán hàng',
                                awareness: 'Nhận diện',
                                traffic: 'Traffic',
                                leads: 'Thu thập leads'
                            };

                            return (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xl flex-shrink-0">
                                            {channelInfo.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900">{post.topic}</p>
                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                <span className="text-sm text-gray-500">
                                                    🕐 {post.time}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {channelInfo.label}
                                                </span>
                                                {post.postType && (
                                                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                                        {postTypeLabels[post.postType] || post.postType}
                                                    </span>
                                                )}
                                                {post.purpose && (
                                                    <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                                                        {purposeLabels[post.purpose] || post.purpose}
                                                    </span>
                                                )}
                                            </div>

                                            {/* AI Content Idea */}
                                            {post.contentIdea && (
                                                <div className="mt-2 p-2 bg-amber-50 border border-amber-100 rounded-lg">
                                                    <p className="text-xs text-amber-600 font-medium mb-1">💡 Ý tưởng nội dung:</p>
                                                    <p className="text-sm text-gray-700">{post.contentIdea}</p>
                                                </div>
                                            )}

                                            {/* Hashtags */}
                                            {post.suggestedHashtags && post.suggestedHashtags.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {post.suggestedHashtags.slice(0, 5).map((tag, i) => (
                                                        <span
                                                            key={i}
                                                            className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                                                        >
                                                            #{tag.replace('#', '')}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium flex-shrink-0">
                                            Đã lên lịch
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
