'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { getMarketingPlanById, MarketingPlan } from '@/lib/api/marketingPlan.api';
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

    const fetchPlanDetails = useCallback(async () => {
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
    }, [planId]);

    // Fetch plan details when modal opens
    useEffect(() => {
        if (isOpen && planId) {
            fetchPlanDetails();
        } else {
            setPlan(null);
            setSelectedDay(null);
        }
    }, [isOpen, planId, fetchPlanDetails]);

    const handleDayClick = useCallback((date: Date, posts: PlanPost[]) => {
        setSelectedDay({ date, posts });
    }, []);

    const handleCloseDayPanel = useCallback(() => {
        setSelectedDay(null);
    }, []);

    if (typeof window === 'undefined' || !isOpen) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/55 backdrop-blur-[3px] z-[1300]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.24, ease: 'easeOut' }}
                        className="fixed inset-5 bg-gradient-to-br from-slate-50 via-white to-blue-50/70 rounded-3xl shadow-[0_18px_45px_rgba(15,23,42,0.25)] z-[1310] overflow-hidden flex flex-col border border-slate-200"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-white via-slate-50 to-blue-50/80">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                                    Chi tiết kế hoạch Marketing
                                </h2>
                                {plan && (
                                    <p className="text-sm text-slate-500 mt-1">
                                        Nhấn vào ngày để xem toàn bộ chủ đề trong ngày đó
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 bg-white text-slate-500 hover:text-slate-700"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-h-0 p-5 md:p-6 bg-gradient-to-b from-slate-50/80 to-blue-50/40 overflow-hidden">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-10 h-10 border-4 border-blue-300 border-t-transparent rounded-full animate-spin" />
                                        <p className="text-slate-600">Đang tải...</p>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="text-center bg-white border border-red-200 rounded-2xl px-5 py-6 shadow-sm">
                                        <p className="text-red-600 mb-4">{error}</p>
                                        <button
                                            onClick={fetchPlanDetails}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                        >
                                            Thử lại
                                        </button>
                                    </div>
                                </div>
                            ) : plan ? (
                                <div className="h-full min-h-0 flex flex-col xl:flex-row gap-6 xl:gap-7">
                                    {/* Main content */}
                                    <div className="flex-1 min-w-0 space-y-5 xl:overflow-y-auto xl:pr-1">
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
                                            <div className="xl:w-[420px] xl:flex-shrink-0 xl:self-start xl:sticky xl:top-0">
                                                <DayPostsPanel
                                                    date={selectedDay.date}
                                                    posts={selectedDay.posts}
                                                    onClose={handleCloseDayPanel}
                                                />
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : null}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
