'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMarketingPlanById, MarketingPlan, MarketingPost } from '@/lib/api/marketingPlan.api';
import { MarketingPlanResult, PlanPost } from '@/lib/fakeData/marketing';
import PlanSummary from './PlanSummary';
import PlanCalendarView from './PlanCalendarView';
import DayPostsPanel from './DayPostsPanel';

interface PlanDetailModalProps {
    isOpen: boolean;
    planId: string | null;
    onClose: () => void;
}

// Convert API response to frontend format
function convertApiToResult(apiPlan: MarketingPlan): MarketingPlanResult {
    return {
        id: apiPlan._id || apiPlan.id || `plan-${Date.now()}`,
        campaignName: apiPlan.campaignName,
        startDate: new Date(apiPlan.startDate),
        endDate: new Date(apiPlan.endDate),
        posts: apiPlan.posts.map((post, index) => ({
            id: (post as unknown as { _id?: string })._id || `post-${index}`,
            date: new Date(post.date),
            time: post.time,
            topic: post.topic,
            channel: post.channel,
            status: post.status,
            contentIdea: post.contentIdea,
            purpose: post.purpose,
            postType: post.postType,
            suggestedHashtags: post.suggestedHashtags,
        })),
        totalPosts: apiPlan.totalPosts,
        createdAt: new Date(apiPlan.createdAt),
    };
}

export default function PlanDetailModal({ isOpen, planId, onClose }: PlanDetailModalProps) {
    const [plan, setPlan] = useState<MarketingPlanResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDay, setSelectedDay] = useState<{ date: Date; posts: PlanPost[] } | null>(null);

    // Fetch plan details when modal opens
    useEffect(() => {
        if (isOpen && planId) {
            fetchPlanDetails();
        } else {
            setPlan(null);
            setSelectedDay(null);
        }
    }, [isOpen, planId]);

    const fetchPlanDetails = async () => {
        if (!planId) return;

        setIsLoading(true);
        setError(null);

        try {
            const apiPlan = await getMarketingPlanById(planId);
            const result = convertApiToResult(apiPlan);
            setPlan(result);
        } catch (err) {
            console.error('Error fetching plan:', err);
            setError('Không thể tải chi tiết kế hoạch');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDayClick = useCallback((date: Date, posts: PlanPost[]) => {
        setSelectedDay({ date, posts });
    }, []);

    const handleCloseDayPanel = useCallback(() => {
        setSelectedDay(null);
    }, []);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-3 md:inset-6 lg:inset-8 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col border border-slate-700/80"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
                            <div>
                                <h2 className="text-xl font-bold text-slate-100 tracking-wide">
                                    Chi tiết kế hoạch Marketing
                                </h2>
                                {plan && (
                                    <p className="text-sm text-slate-300 mt-1">
                                        Nhấn vào ngày để xem toàn bộ chủ đề trong ngày đó
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2.5 rounded-xl hover:bg-slate-700 transition-colors border border-slate-600 bg-slate-800"
                            >
                                <svg className="w-5 h-5 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-auto p-6 bg-gradient-to-b from-slate-900/70 to-slate-950/80">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-10 h-10 border-3 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
                                        <p className="text-slate-300">Đang tải...</p>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="text-center">
                                        <p className="text-red-300 mb-4">{error}</p>
                                        <button
                                            onClick={fetchPlanDetails}
                                            className="px-4 py-2 bg-[#F59E0B] text-white rounded-xl hover:bg-amber-600 transition-colors"
                                        >
                                            Thử lại
                                        </button>
                                    </div>
                                </div>
                            ) : plan ? (
                                <div className="flex flex-col xl:flex-row gap-7 xl:gap-8">
                                    {/* Main content */}
                                    <div className="flex-1 min-w-0">
                                        <PlanSummary plan={plan} />
                                        <PlanCalendarView
                                            plan={plan}
                                            onDayClick={handleDayClick}
                                            selectedDate={selectedDay?.date}
                                        />
                                    </div>

                                    {/* Side panel for day posts */}
                                    <AnimatePresence>
                                        {selectedDay && (
                                            <DayPostsPanel
                                                date={selectedDay.date}
                                                posts={selectedDay.posts}
                                                onClose={handleCloseDayPanel}
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : null}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
