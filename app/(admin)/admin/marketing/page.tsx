'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    MarketingPlanInput,
    MarketingPlanResult,
    PlanPost,
    defaultPlanInput,
    generateFakePlan,
} from '@/lib/fakeData/marketing';

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

export default function MarketingPlanPage() {
    const [currentStep, setCurrentStep] = useState<Step>('form');
    const [formData, setFormData] = useState<MarketingPlanInput>(defaultPlanInput);
    const [planResult, setPlanResult] = useState<MarketingPlanResult | null>(null);
    const [selectedDay, setSelectedDay] = useState<{ date: Date; posts: PlanPost[] } | null>(null);

    const handleSubmit = useCallback(async () => {
        setCurrentStep('processing');

        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Generate fake plan
        const result = generateFakePlan(formData);
        setPlanResult(result);
        setCurrentStep('result');
    }, [formData]);

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
        <div className="max-w-4xl mx-auto">
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
