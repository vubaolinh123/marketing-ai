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

                            return (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xl">
                                            {channelInfo.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{post.topic}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-sm text-gray-500">
                                                    🕐 {post.time}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {channelInfo.label}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
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
