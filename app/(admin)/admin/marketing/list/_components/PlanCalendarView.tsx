'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MarketingPlanResult, PlanPost } from '@/lib/fakeData/marketing';

interface PlanCalendarViewProps {
    plan: MarketingPlanResult;
    onDayClick: (date: Date, posts: PlanPost[]) => void;
    selectedDate?: Date;
}

const channelIcons: Record<string, string> = {
    facebook: '📘',
    instagram: '📸',
    tiktok: '🎵',
    website: '🌐',
    zalo: '💬',
};

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export default function PlanCalendarView({ plan, onDayClick, selectedDate }: PlanCalendarViewProps) {
    const [currentMonth, setCurrentMonth] = useState(() => new Date(plan.startDate));

    // Group posts by date
    const postsByDate = useMemo(() => {
        const map = new Map<string, PlanPost[]>();
        plan.posts.forEach(post => {
            const dateKey = new Date(post.date).toDateString();
            if (!map.has(dateKey)) {
                map.set(dateKey, []);
            }
            map.get(dateKey)!.push(post);
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

        // Add padding for days before the 1st
        for (let i = 0; i < startPadding; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let d = 1; d <= lastDay.getDate(); d++) {
            days.push(new Date(year, month, d));
        }

        return days;
    }, [currentMonth]);

    const navigateMonth = (delta: number) => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
    };

    const isInRange = (date: Date) => {
        const start = new Date(plan.startDate);
        const end = new Date(plan.endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return date >= start && date <= end;
    };

    const isSelected = (date: Date) => {
        return selectedDate?.toDateString() === date.toDateString();
    };

    const getChannelIcon = (channel: string) => channelIcons[channel] || '📄';

    const getPrimaryPostForCell = (posts: PlanPost[]) => {
        if (!posts || posts.length === 0) return null;
        return [...posts].sort((a, b) => (a.time || '').localeCompare(b.time || ''))[0];
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden shadow-sm">
            {/* Calendar Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 rounded-xl hover:bg-gray-200 transition-colors border border-gray-200 bg-white"
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h3 className="font-semibold text-gray-900">
                    Tháng {currentMonth.getMonth() + 1}/{currentMonth.getFullYear()}
                </h3>
                <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 rounded-xl hover:bg-gray-200 transition-colors border border-gray-200 bg-white"
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                {WEEKDAYS.map(day => (
                    <div key={day} className="py-2.5 text-center text-xs font-semibold text-gray-600 border-r border-gray-200 last:border-r-0">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 auto-rows-fr">
                {calendarDays.map((date, index) => {
                    if (!date) {
                        return <div key={`empty-${index}`} className="min-h-[120px] border-r border-b border-gray-200 bg-gray-50/50" />;
                    }

                    const posts = postsByDate.get(date.toDateString()) || [];
                    const primaryPost = getPrimaryPostForCell(posts);
                    const hasPosts = posts.length > 0;
                    const inRange = isInRange(date);
                    const selected = isSelected(date);

                    return (
                        <motion.div
                            key={date.toISOString()}
                            whileHover={hasPosts ? { scale: 1.01 } : {}}
                            onClick={() => hasPosts && onDayClick(date, posts)}
                            className={cn(
                                'min-h-[120px] border-r border-b border-gray-200 p-2 transition-all flex flex-col gap-1.5',
                                hasPosts && 'cursor-pointer hover:bg-amber-50/70',
                                !inRange && 'bg-gray-50 text-gray-400',
                                selected && 'bg-amber-100/70 ring-2 ring-[#F59E0B] ring-inset'
                            )}
                        >
                            {/* Date number */}
                            <div className={cn(
                                'text-xs font-semibold',
                                date.getDay() === 0 && 'text-red-500',
                                !inRange && 'text-gray-400'
                            )}>
                                {date.getDate()}
                            </div>

                            {/* Primary topic */}
                            {hasPosts && (
                                <div className="mt-0.5 flex-1 flex flex-col gap-1">
                                    {primaryPost && (
                                        <div className="rounded-md border border-gray-200 bg-white px-1.5 py-1 shadow-sm min-h-[52px]">
                                            <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-0.5">
                                                <span>{getChannelIcon(primaryPost.channel)}</span>
                                                <span className="truncate">{primaryPost.time}</span>
                                            </div>
                                            <p className="text-[11px] leading-4 font-semibold text-gray-700 line-clamp-2">
                                                {primaryPost.topic}
                                            </p>
                                        </div>
                                    )}

                                    {posts.length > 1 && (
                                        <div className="text-[10px] text-[#EA580C] font-medium">
                                            +{posts.length - 1} nội dung
                                        </div>
                                    )}
                                </div>
                            )}

                            {!hasPosts && inRange && (
                                <div className="mt-auto text-[10px] text-gray-400">Chưa có chủ đề</div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
