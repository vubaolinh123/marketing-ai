'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { showSuccess, showError } from '@/lib/toast';
import {
    MarketingPlanInput,
    MarketingPlanResult,
    PlanPost,
    defaultPlanInput,
} from '@/lib/fakeData/marketing';
import { generateMarketingPlan, MarketingPlan } from '@/lib/api/marketingPlan.api';

// Dynamic imports
const MarketingPlanForm = dynamic(() => import('./_components/MarketingPlanForm'), { ssr: false });
const PlanProcessing = dynamic(() => import('./_components/PlanProcessing'), { ssr: false });
const PlanCalendar = dynamic(() => import('./_components/PlanCalendar'), { ssr: false });
const DayDetailModal = dynamic(() => import('./_components/DayDetailModal'), { ssr: false });

type Step = 'form' | 'processing' | 'result';

const steps = [
    { id: 'form', label: 'Nhập thông tin' },
    { id: 'processing', label: 'AI xử lý' },
    { id: 'result', label: 'Xem kế hoạch' },
];

// Convert API MarketingPlan to frontend MarketingPlanResult format
function convertApiToResult(apiPlan: MarketingPlan): MarketingPlanResult {
    return {
        id: apiPlan._id || apiPlan.id || `plan-${Date.now()}`,
        campaignName: apiPlan.campaignName,
        startDate: new Date(apiPlan.startDate),
        endDate: new Date(apiPlan.endDate),
        posts: apiPlan.posts.map((post, index) => ({
            id: post._id || `post-${index}`,
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

export default function MarketingPlanPage() {
    const [currentStep, setCurrentStep] = useState<Step>('form');
    const [formData, setFormData] = useState<MarketingPlanInput>(defaultPlanInput);
    const [planResult, setPlanResult] = useState<MarketingPlanResult | null>(null);
    const [selectedDay, setSelectedDay] = useState<{ date: Date; posts: PlanPost[] } | null>(null);
    const [useBrandSettings, setUseBrandSettings] = useState(false);

    const handleSubmit = useCallback(async () => {
        setCurrentStep('processing');

        try {
            // Log request for debugging
            console.log('🚀 Generating marketing plan with data:', {
                ...formData,
                useBrandSettings
            });

            // Call real API
            const result = await generateMarketingPlan({
                ...formData,
                useBrandSettings
            });

            console.log('✅ Marketing plan generated:', result);

            // Convert API response to frontend format
            const planResult = convertApiToResult(result);
            setPlanResult(planResult);
            setCurrentStep('result');
            showSuccess('Tạo kế hoạch marketing thành công!');
        } catch (error: unknown) {
            console.error('Error generating marketing plan:', error);
            setCurrentStep('form');

            // Handle different error types
            let errorMessage = 'Có lỗi xảy ra khi tạo kế hoạch';

            if (error && typeof error === 'object') {
                const err = error as { statusCode?: number; message?: string };
                if (err.statusCode === 401) {
                    errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
                } else if (err.statusCode === undefined) {
                    errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra lại.';
                } else if (err.message) {
                    errorMessage = err.message;
                }
            }

            showError(errorMessage);
        }
    }, [formData, useBrandSettings]);

    const handleReset = useCallback(() => {
        setFormData(defaultPlanInput);
        setPlanResult(null);
        setCurrentStep('form');
    }, []);

    const handleDayClick = useCallback((date: Date, posts: PlanPost[]) => {
        setSelectedDay({ date, posts });
    }, []);

    const stepIndex = steps.findIndex(s => s.id === currentStep);

    return (
        <div className="w-[90%] mx-auto">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Tạo kế hoạch Marketing</h1>
                <p className="text-gray-600">
                    Lên lịch đăng bài tự động với AI
                </p>
            </motion.div>

            {/* Step Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
            >
                <div className="flex items-center justify-center">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div className={cn(
                                    'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all',
                                    index <= stepIndex
                                        ? 'bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-500'
                                )}>
                                    {index < stepIndex ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                <span className={cn(
                                    'text-sm mt-2 font-medium whitespace-nowrap',
                                    index <= stepIndex ? 'text-gray-900' : 'text-gray-400'
                                )}>
                                    {step.label}
                                </span>
                            </div>

                            {index < steps.length - 1 && (
                                <div className={cn(
                                    'w-12 sm:w-20 h-1 mx-2 sm:mx-3 rounded-full transition-all',
                                    index < stepIndex ? 'bg-[#F59E0B]' : 'bg-gray-200'
                                )} />
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Content */}
            {currentStep === 'form' && (
                <MarketingPlanForm
                    data={formData}
                    onChange={setFormData}
                    onSubmit={handleSubmit}
                    useBrandSettings={useBrandSettings}
                    onBrandSettingsChange={setUseBrandSettings}
                />
            )}

            {currentStep === 'processing' && (
                <PlanProcessing />
            )}

            {currentStep === 'result' && planResult && (
                <PlanCalendar
                    plan={planResult}
                    onDayClick={handleDayClick}
                    onReset={handleReset}
                />
            )}

            {/* Day Detail Modal */}
            {selectedDay && (
                <DayDetailModal
                    date={selectedDay.date}
                    posts={selectedDay.posts}
                    onClose={() => setSelectedDay(null)}
                />
            )}
        </div>
    );
}

