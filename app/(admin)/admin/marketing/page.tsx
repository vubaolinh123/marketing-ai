'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { showSuccess, showError } from '@/lib/toast';
import {
    MarketingPlanInput,
    MarketingPlanResult,
    MarketingStrategySuggestion,
    PlanPost,
    defaultPlanInput,
} from '@/lib/fakeData/marketing';
import { generateMarketingPlan, MarketingPlan, suggestMarketingStrategy } from '@/lib/api/marketingPlan.api';

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

const toCleanString = (value: unknown): string => {
    if (typeof value === 'string') return value.trim();
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    return '';
};

const toStringArray = (value: unknown): string[] => {
    if (Array.isArray(value)) {
        return value
            .map((item) => toCleanString(item))
            .filter(Boolean);
    }

    if (typeof value === 'string') {
        return value
            .split(/[,;\n]/)
            .map((item) => item.trim())
            .filter(Boolean);
    }

    if (value && typeof value === 'object') {
        return Object.values(value as Record<string, unknown>)
            .map((item) => toCleanString(item))
            .filter(Boolean);
    }

    return [];
};

const toTopicMix = (value: unknown): Array<{ key: string; value: string }> => {
    if (Array.isArray(value)) {
        return value
            .map((item, index) => {
                if (item && typeof item === 'object') {
                    const obj = item as Record<string, unknown>;
                    const key = toCleanString(obj.key ?? obj.pillar ?? obj.topic ?? obj.name) || `Nhóm ${index + 1}`;
                    const mixValue = toCleanString(obj.value ?? obj.ratio ?? obj.percentage ?? obj.mix ?? obj.description);
                    return { key, value: mixValue };
                }

                if (typeof item === 'string') {
                    const [keyPart, ...rest] = item.split(':');
                    if (rest.length > 0) {
                        return { key: keyPart.trim(), value: rest.join(':').trim() };
                    }
                    return { key: `Nhóm ${index + 1}`, value: item.trim() };
                }

                return { key: `Nhóm ${index + 1}`, value: toCleanString(item) };
            })
            .filter((item) => item.key || item.value);
    }

    if (value && typeof value === 'object') {
        return Object.entries(value as Record<string, unknown>)
            .map(([key, mixValue]) => ({ key, value: toCleanString(mixValue) }))
            .filter((item) => item.key || item.value);
    }

    return [];
};

const toWeeklyFramework = (value: unknown): Array<{ week: string; focus: string; sampleExecution: string }> => {
    if (Array.isArray(value)) {
        return value
            .map((item, index) => {
                if (item && typeof item === 'object') {
                    const obj = item as Record<string, unknown>;
                    return {
                        week: toCleanString(obj.week ?? obj.weekLabel ?? obj.name ?? `Tuần ${index + 1}`) || `Tuần ${index + 1}`,
                        focus: toCleanString(obj.focus ?? obj.theme ?? obj.contentFocus),
                        sampleExecution: toCleanString(obj.sampleExecution ?? obj.sample ?? obj.execution ?? obj.example),
                    };
                }

                return {
                    week: `Tuần ${index + 1}`,
                    focus: toCleanString(item),
                    sampleExecution: '',
                };
            })
            .filter((item) => item.week || item.focus || item.sampleExecution);
    }

    if (value && typeof value === 'object') {
        return Object.entries(value as Record<string, unknown>)
            .map(([week, item]) => {
                if (item && typeof item === 'object') {
                    const obj = item as Record<string, unknown>;
                    return {
                        week,
                        focus: toCleanString(obj.focus ?? obj.theme ?? obj.contentFocus),
                        sampleExecution: toCleanString(obj.sampleExecution ?? obj.sample ?? obj.execution ?? obj.example),
                    };
                }

                return {
                    week,
                    focus: toCleanString(item),
                    sampleExecution: '',
                };
            })
            .filter((item) => item.week || item.focus || item.sampleExecution);
    }

    return [];
};

function normalizeStrategySuggestion(raw: unknown): MarketingStrategySuggestion {
    const suggestion = (raw || {}) as Record<string, unknown>;

    const campaignConcept = toCleanString(suggestion.campaignConcept ?? suggestion.concept);
    const contentPillars = toStringArray(suggestion.contentPillars ?? suggestion.topics);
    const recommendedChannels = toStringArray(suggestion.recommendedChannels ?? suggestion.channels);
    const recommendedGoals = toStringArray(suggestion.recommendedGoals ?? suggestion.goals);
    const topicMix = toTopicMix(suggestion.topicMix);
    const weeklyFramework = toWeeklyFramework(suggestion.weeklyFramework);
    const rationale = toCleanString(suggestion.rationale);
    const summary = toCleanString(suggestion.summary);

    return {
        summary: summary || undefined,
        concept: campaignConcept || undefined,
        campaignConcept: campaignConcept || undefined,
        contentPillars: contentPillars.length > 0 ? contentPillars : undefined,
        topicMix: topicMix.length > 0 ? topicMix : undefined,
        recommendedChannels: recommendedChannels.length > 0 ? recommendedChannels : undefined,
        recommendedGoals: recommendedGoals.length > 0 ? recommendedGoals : undefined,
        weeklyFramework: weeklyFramework.length > 0 ? weeklyFramework : undefined,
        rationale: rationale || undefined,
        topics: contentPillars.length > 0 ? contentPillars : undefined,
        channels: recommendedChannels.length > 0 ? recommendedChannels : undefined,
        goals: recommendedGoals.length > 0 ? recommendedGoals : undefined,
    };
}

export default function MarketingPlanPage() {
    const [currentStep, setCurrentStep] = useState<Step>('form');
    const [formData, setFormData] = useState<MarketingPlanInput>(defaultPlanInput);
    const [planResult, setPlanResult] = useState<MarketingPlanResult | null>(null);
    const [selectedDay, setSelectedDay] = useState<{ date: Date; posts: PlanPost[] } | null>(null);
    const [useBrandSettings, setUseBrandSettings] = useState(false);
    const [strategyLoading, setStrategyLoading] = useState(false);
    const [strategySuggestion, setStrategySuggestion] = useState<MarketingStrategySuggestion | null>(null);

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

    const handleSuggestStrategy = useCallback(async () => {
        if (!formData.campaignName || !formData.startDate || !formData.endDate) {
            showError('Vui lòng nhập tên chiến dịch, ngày bắt đầu và ngày kết thúc trước khi xin đề xuất.');
            return;
        }

        setStrategyLoading(true);
        try {
            const suggestion = await suggestMarketingStrategy({
                ...formData,
                useBrandSettings,
            });

            const normalizedSuggestion = normalizeStrategySuggestion(suggestion);

            setStrategySuggestion(normalizedSuggestion);
            setFormData((prev) => ({ ...prev, strategySuggestion: normalizedSuggestion }));
            showSuccess('Đã nhận đề xuất chiến lược tháng từ AI!');
        } catch (error: unknown) {
            console.error('Error suggesting strategy:', error);

            let errorMessage = 'Không thể lấy đề xuất chiến lược lúc này';
            if (error && typeof error === 'object') {
                const err = error as { message?: string };
                if (err.message) errorMessage = err.message;
            }

            showError(errorMessage);
        } finally {
            setStrategyLoading(false);
        }
    }, [formData, useBrandSettings]);

    const handleApplySuggestion = useCallback(() => {
        const suggestion = formData.strategySuggestion || strategySuggestion;
        if (!suggestion) return;

        setFormData((prev) => {
            const contentPillars = suggestion.contentPillars || suggestion.topics || [];
            const recommendedChannels = suggestion.recommendedChannels || suggestion.channels || [];
            const recommendedGoals = suggestion.recommendedGoals || suggestion.goals || [];
            const campaignConcept = suggestion.campaignConcept || suggestion.concept || '';

            const weeklyHighlights = (suggestion.weeklyFramework || [])
                .map((item) => {
                    const week = item.week?.trim();
                    const focus = item.focus?.trim();
                    const sampleExecution = item.sampleExecution?.trim();

                    if (!week && !focus && !sampleExecution) return '';

                    const title = week || 'Tuần';
                    const detail = [focus, sampleExecution].filter(Boolean).join(' — ');
                    return detail ? `- ${title}: ${detail}` : `- ${title}`;
                })
                .filter(Boolean);

            const notesAppend = [
                campaignConcept ? `Concept tháng: ${campaignConcept}` : '',
                suggestion.rationale ? `Rationale: ${suggestion.rationale}` : '',
                weeklyHighlights.length > 0 ? `Weekly highlights:\n${weeklyHighlights.join('\n')}` : '',
            ].filter(Boolean);

            const nextNotes = notesAppend.length > 0
                ? [prev.notes.trim(), notesAppend.join('\n\n')].filter(Boolean).join('\n\n')
                : prev.notes;

            return {
                ...prev,
                topics: contentPillars.length > 0 ? contentPillars : prev.topics,
                goals: recommendedGoals.length > 0 ? recommendedGoals : prev.goals,
                channels: recommendedChannels.length > 0 ? recommendedChannels : prev.channels,
                monthlyFocus: prev.monthlyFocus?.trim() ? prev.monthlyFocus : (campaignConcept || prev.monthlyFocus),
                notes: nextNotes,
                strategySuggestion: suggestion,
            };
        });

        showSuccess('Đã áp dụng mix chiến lược vào form.');
    }, [formData.strategySuggestion, strategySuggestion]);

    const handleReset = useCallback(() => {
        setFormData(defaultPlanInput);
        setPlanResult(null);
        setStrategySuggestion(null);
        setCurrentStep('form');
    }, []);

    const handleDayClick = useCallback((date: Date, posts: PlanPost[]) => {
        setSelectedDay({ date, posts });
    }, []);

    const stepIndex = steps.findIndex(s => s.id === currentStep);

    return (
        <div className="w-[96%] max-w-[1700px] mx-auto">
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
                    onSuggestStrategy={handleSuggestStrategy}
                    strategySuggestion={formData.strategySuggestion || strategySuggestion}
                    strategyLoading={strategyLoading}
                    onApplySuggestion={handleApplySuggestion}
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

