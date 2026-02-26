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
        <div className="bg-white/95 rounded-2xl border border-slate-200 overflow-hidden shadow-[0_10px_30px_rgba(15,23,42,0.1)]">
            {/* Calendar Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/70">
                <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 bg-white"
                >
                    <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h3 className="font-semibold text-slate-800 text-lg md:text-xl tracking-tight">
                    Tháng {currentMonth.getMonth() + 1}/{currentMonth.getFullYear()}
                </h3>
                <button
                    onClick={() => navigateMonth(1)}
                    className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 bg-white"
                >
                    <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80">
                {WEEKDAYS.map(day => (
                    <div key={day} className="py-3 text-center text-sm font-semibold text-slate-500 border-r border-slate-200 last:border-r-0">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 auto-rows-fr">
                {calendarDays.map((date, index) => {
                    if (!date) {
                        return <div key={`empty-${index}`} className="min-h-[130px] xl:min-h-[160px] border-r border-b border-slate-200 bg-slate-50/70" />;
                    }

                    const posts = postsByDate.get(date.toDateString()) || [];
                    const primaryPost = getPrimaryPostForCell(posts);
                    const hasPosts = posts.length > 0;
                    const inRange = isInRange(date);
                    const selected = isSelected(date);

                    return (
                        <motion.div
                            key={date.toISOString()}
                            whileHover={hasPosts ? { scale: 1.005, y: -1 } : {}}
                            onClick={() => hasPosts && onDayClick(date, posts)}
                            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                            className={cn(
                                'min-h-[130px] xl:min-h-[160px] border-r border-b border-slate-200 p-3 transition-all duration-200 flex flex-col gap-2',
                                hasPosts && 'cursor-pointer hover:bg-blue-50/80',
                                !inRange && 'bg-slate-50/80 text-slate-400',
                                inRange && 'bg-white',
                                selected && 'bg-blue-50 ring-2 ring-blue-300 ring-inset shadow-[inset_0_0_0_1px_rgba(59,130,246,0.25)]'
                            )}
                        >
                            {/* Date number */}
                            <div className={cn(
                                'text-sm font-bold',
                                date.getDay() === 0 && inRange && 'text-red-500',
                                inRange && date.getDay() !== 0 && 'text-slate-700',
                                !inRange && 'text-slate-400'
                            )}>
                                {date.getDate()}
                            </div>

                            {/* Primary topic */}
                            {hasPosts && (
                                <div className="mt-0.5 flex-1 flex flex-col gap-1.5">
                                    {primaryPost && (
                                        <div className="rounded-lg border border-blue-100 bg-blue-50/70 px-2.5 py-2 shadow-sm min-h-[66px]">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                                                <span>{getChannelIcon(primaryPost.channel)}</span>
                                                <span className="truncate">{primaryPost.time}</span>
                                            </div>
                                            <p className="text-sm leading-5 font-semibold text-slate-700 line-clamp-2">
                                                {primaryPost.topic}
                                            </p>
                                        </div>
                                    )}

                                    {posts.length > 1 && (
                                        <div className="text-xs text-blue-600 font-semibold">
                                            +{posts.length - 1} nội dung
                                        </div>
                                    )}
                                </div>
                            )}

                            {!hasPosts && inRange && (
                                <div className="mt-auto text-xs text-slate-400">Chưa có chủ đề</div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
