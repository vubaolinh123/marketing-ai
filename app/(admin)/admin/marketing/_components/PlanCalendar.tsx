'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { MarketingPlanResult, PlanPost, channelOptions } from '@/lib/fakeData/marketing';

interface PlanCalendarProps {
    plan: MarketingPlanResult;
    onDayClick: (date: Date, posts: PlanPost[]) => void;
    onReset: () => void;
}

export default function PlanCalendar({ plan, onDayClick, onReset }: PlanCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(() => new Date(plan.startDate));
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

    // Group posts by date string
    const postsByDate = useMemo(() => {
        const map = new Map<string, PlanPost[]>();
        plan.posts.forEach(post => {
            const key = post.date.toISOString().split('T')[0];
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(post);
        });
        return map;
    }, [plan.posts]);

    // Generate calendar days
    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startPadding = firstDay.getDay();

        const days: (Date | null)[] = [];

        // Padding for previous month
        for (let i = 0; i < startPadding; i++) {
            days.push(null);
        }

        // Days of current month
        for (let d = 1; d <= lastDay.getDate(); d++) {
            days.push(new Date(year, month, d));
        }

        return days;
    }, [currentMonth]);

    const navigateMonth = (delta: number) => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
    };

    const getChannelIcon = (channel: string) => {
        return channelOptions.find(c => c.value === channel)?.icon || '📄';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{plan.campaignName}</h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {plan.totalPosts} bài đăng • {plan.startDate.toLocaleDateString('vi-VN')} - {plan.endDate.toLocaleDateString('vi-VN')}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={cn(
                                'px-4 py-2 rounded-lg font-medium transition-all',
                                viewMode === 'calendar'
                                    ? 'bg-[#F59E0B] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            )}
                        >
                            📅 Lịch
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                'px-4 py-2 rounded-lg font-medium transition-all',
                                viewMode === 'list'
                                    ? 'bg-[#F59E0B] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            )}
                        >
                            📋 Danh sách
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar View */}
            {viewMode === 'calendar' && (
                <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => navigateMonth(-1)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {currentMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                        </h3>
                        <button
                            onClick={() => navigateMonth(1)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((date, index) => {
                            if (!date) {
                                return <div key={`empty-${index}`} className="aspect-square" />;
                            }

                            const dateKey = date.toISOString().split('T')[0];
                            const posts = postsByDate.get(dateKey) || [];
                            const hasPosts = posts.length > 0;

                            return (
                                <button
                                    key={dateKey}
                                    onClick={() => hasPosts && onDayClick(date, posts)}
                                    disabled={!hasPosts}
                                    className={cn(
                                        'aspect-square p-1 rounded-lg border transition-all relative',
                                        hasPosts
                                            ? 'bg-amber-50 border-amber-200 hover:border-[#F59E0B] cursor-pointer'
                                            : 'bg-white border-gray-100 cursor-default'
                                    )}
                                >
                                    <span className={cn(
                                        'text-sm font-medium',
                                        hasPosts ? 'text-[#F59E0B]' : 'text-gray-400'
                                    )}>
                                        {date.getDate()}
                                    </span>
                                    {hasPosts && (
                                        <div className="absolute bottom-1 left-1 right-1 flex justify-center gap-0.5">
                                            {posts.slice(0, 3).map((post, i) => (
                                                <span key={i} className="text-[10px]">
                                                    {getChannelIcon(post.channel)}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="space-y-3">
                    {plan.posts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.02 }}
                            className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-4"
                        >
                            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-2xl">
                                {getChannelIcon(post.channel)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{post.topic}</p>
                                <p className="text-sm text-gray-500">
                                    {post.date.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' })} • {post.time}
                                </p>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium hidden sm:block">
                                Đã lên lịch
                            </span>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-center gap-4">
                <Button onClick={onReset} variant="primary" size="lg">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tạo kế hoạch mới
                </Button>
            </div>
        </motion.div>
    );
}
