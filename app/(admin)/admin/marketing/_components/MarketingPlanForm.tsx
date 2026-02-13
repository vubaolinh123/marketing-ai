'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import TagsInput from '@/app/(admin)/admin/settings/_components/TagsInput';
import {
    campaignThinkingSuggestions,
    MarketingPlanInput,
    MarketingStrategySuggestion,
    postFrequencyOptions,
    postTimeOptions,
    goalOptions,
    channelOptions,
    suggestedTopics,
} from '@/lib/fakeData/marketing';

interface MarketingPlanFormProps {
    data: MarketingPlanInput;
    onChange: (data: MarketingPlanInput) => void;
    onSubmit: () => void;
    onSuggestStrategy?: () => void;
    strategySuggestion?: MarketingStrategySuggestion | null;
    strategyLoading?: boolean;
    onApplySuggestion?: () => void;
    isLoading?: boolean;
    useBrandSettings?: boolean;
    onBrandSettingsChange?: (value: boolean) => void;
}

export default function MarketingPlanForm({
    data,
    onChange,
    onSubmit,
    onSuggestStrategy,
    strategySuggestion,
    strategyLoading,
    onApplySuggestion,
    isLoading,
    useBrandSettings,
    onBrandSettingsChange,
}: MarketingPlanFormProps) {
    const canSubmit = data.campaignName && data.startDate && data.endDate && data.topics.length > 0 && data.channels.length > 0;
    const currentSuggestion = data.strategySuggestion || strategySuggestion || null;

    const toggleArrayItem = (field: 'postTimes' | 'goals' | 'channels', value: string) => {
        const current = data[field];
        const updated = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        onChange({ ...data, [field]: updated });
    };

    const addSuggestedTopic = (topic: string) => {
        if (!data.topics.includes(topic)) {
            onChange({ ...data, topics: [...data.topics, topic] });
        }
    };

    const applyCampaignThinkingChip = (
        field: keyof Pick<MarketingPlanInput, 'priorityProductService' | 'monthlyFocus' | 'promotions' | 'customerJourneyStage' | 'targetSegment'>,
        value: string,
    ) => {
        onChange({ ...data, [field]: value });
    };

    const updateStrategySuggestion = (next: MarketingStrategySuggestion) => {
        onChange({ ...data, strategySuggestion: next });
    };

    const updateTopicMixItem = (index: number, field: 'key' | 'value', value: string) => {
        const suggestion = currentSuggestion || {};
        const currentTopicMix = suggestion.topicMix || [];
        const nextTopicMix = currentTopicMix.map((item, i) => (
            i === index ? { ...item, [field]: value } : item
        ));
        updateStrategySuggestion({ ...suggestion, topicMix: nextTopicMix });
    };

    const updateWeeklyFrameworkItem = (index: number, field: 'week' | 'focus' | 'sampleExecution', value: string) => {
        const suggestion = currentSuggestion || {};
        const currentWeekly = suggestion.weeklyFramework || [];
        const nextWeekly = currentWeekly.map((item, i) => (
            i === index ? { ...item, [field]: value } : item
        ));
        updateStrategySuggestion({ ...suggestion, weeklyFramework: nextWeekly });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Campaign Name */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white flex items-center justify-center text-sm font-bold">1</span>
                    Thông tin chiến dịch
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên chiến dịch <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.campaignName}
                            onChange={(e) => onChange({ ...data, campaignName: e.target.value })}
                            placeholder="VD: Chiến dịch Tết 2025"
                            disabled={isLoading}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div lang="vi">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ngày bắt đầu <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={data.startDate}
                                onChange={(e) => onChange({ ...data, startDate: e.target.value })}
                                disabled={isLoading}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                            />
                        </div>
                        <div lang="vi">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ngày kết thúc <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={data.endDate}
                                onChange={(e) => onChange({ ...data, endDate: e.target.value })}
                                disabled={isLoading}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Frequency & Times */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white flex items-center justify-center text-sm font-bold">2</span>
                    Tần suất đăng bài
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Số bài/tuần</label>
                        <div className="flex flex-wrap gap-3">
                            {postFrequencyOptions.map(option => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => onChange({ ...data, postsPerWeek: option.value })}
                                    disabled={isLoading}
                                    className={cn(
                                        'px-4 py-2.5 rounded-xl border-2 font-medium transition-all',
                                        data.postsPerWeek === option.value
                                            ? 'border-[#F59E0B] bg-amber-50 text-[#F59E0B]'
                                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                    )}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Khung giờ đăng</label>
                        <div className="flex flex-wrap gap-2">
                            {postTimeOptions.map(option => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => toggleArrayItem('postTimes', option.value)}
                                    disabled={isLoading}
                                    className={cn(
                                        'px-4 py-2 rounded-full border-2 font-medium transition-all',
                                        data.postTimes.includes(option.value)
                                            ? 'border-[#F59E0B] bg-amber-50 text-[#F59E0B]'
                                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                    )}
                                >
                                    {data.postTimes.includes(option.value) && '✓ '}
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Topics */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white flex items-center justify-center text-sm font-bold">3</span>
                    Chủ đề nội dung
                </h3>

                <TagsInput
                    value={data.topics}
                    onChange={(topics) => onChange({ ...data, topics })}
                    placeholder="Nhập chủ đề và Enter..."
                    disabled={isLoading}
                />

                <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Gợi ý:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedTopics.map(topic => (
                            <button
                                key={topic}
                                type="button"
                                onClick={() => addSuggestedTopic(topic)}
                                disabled={data.topics.includes(topic) || isLoading}
                                className={cn(
                                    'px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                                    data.topics.includes(topic)
                                        ? 'border-[#F59E0B] bg-amber-50 text-[#F59E0B] cursor-not-allowed'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#F59E0B] hover:text-[#F59E0B]'
                                )}
                            >
                                {data.topics.includes(topic) ? '✓ ' : ''}{topic}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Goals & Channels */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white flex items-center justify-center text-sm font-bold">4</span>
                    Mục tiêu & Kênh đăng
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Mục tiêu</label>
                        <div className="flex flex-wrap gap-2">
                            {goalOptions.map(option => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => toggleArrayItem('goals', option.value)}
                                    disabled={isLoading}
                                    className={cn(
                                        'px-4 py-2 rounded-full border-2 font-medium transition-all',
                                        data.goals.includes(option.value)
                                            ? 'border-[#F59E0B] bg-amber-50 text-[#F59E0B]'
                                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                    )}
                                >
                                    {data.goals.includes(option.value) && '✓ '}
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Kênh đăng <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {channelOptions.map(option => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => toggleArrayItem('channels', option.value)}
                                    disabled={isLoading}
                                    className={cn(
                                        'px-4 py-2.5 rounded-xl border-2 font-medium transition-all flex items-center gap-2',
                                        data.channels.includes(option.value)
                                            ? 'border-[#F59E0B] bg-amber-50 text-[#F59E0B]'
                                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                    )}
                                >
                                    <span>{option.icon}</span>
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Campaign Thinking */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white flex items-center justify-center text-sm font-bold">5</span>
                    Campaign Thinking (tuỳ chọn)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sản phẩm/Dịch vụ ưu tiên</label>
                        <input
                            value={data.priorityProductService || ''}
                            onChange={(e) => onChange({ ...data, priorityProductService: e.target.value })}
                            placeholder="VD: Combo thịt bò nhập khẩu"
                            disabled={isLoading}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                        />
                        <div className="mt-2 flex flex-wrap gap-2">
                            {campaignThinkingSuggestions.priorityProductService.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => applyCampaignThinkingChip('priorityProductService', item)}
                                    className="px-2.5 py-1 rounded-full text-xs border border-gray-200 text-gray-700 hover:border-[#F59E0B] hover:bg-amber-50"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Trọng tâm tháng</label>
                        <input
                            value={data.monthlyFocus || ''}
                            onChange={(e) => onChange({ ...data, monthlyFocus: e.target.value })}
                            placeholder="VD: Tăng nhận diện và kéo inbox"
                            disabled={isLoading}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                        />
                        <div className="mt-2 flex flex-wrap gap-2">
                            {campaignThinkingSuggestions.monthlyFocus.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => applyCampaignThinkingChip('monthlyFocus', item)}
                                    className="px-2.5 py-1 rounded-full text-xs border border-gray-200 text-gray-700 hover:border-[#F59E0B] hover:bg-amber-50"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Chương trình khuyến mãi</label>
                        <input
                            value={data.promotions || ''}
                            onChange={(e) => onChange({ ...data, promotions: e.target.value })}
                            placeholder="VD: Giảm 20% cuối tuần"
                            disabled={isLoading}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                        />
                        <div className="mt-2 flex flex-wrap gap-2">
                            {campaignThinkingSuggestions.promotions.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => applyCampaignThinkingChip('promotions', item)}
                                    className="px-2.5 py-1 rounded-full text-xs border border-gray-200 text-gray-700 hover:border-[#F59E0B] hover:bg-amber-50"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Giai đoạn hành trình khách hàng</label>
                        <input
                            value={data.customerJourneyStage || ''}
                            onChange={(e) => onChange({ ...data, customerJourneyStage: e.target.value })}
                            placeholder="VD: Consideration"
                            disabled={isLoading}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                        />
                        <div className="mt-2 flex flex-wrap gap-2">
                            {campaignThinkingSuggestions.customerJourneyStage.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => applyCampaignThinkingChip('customerJourneyStage', item)}
                                    className="px-2.5 py-1 rounded-full text-xs border border-gray-200 text-gray-700 hover:border-[#F59E0B] hover:bg-amber-50"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phân khúc khách hàng mục tiêu</label>
                        <input
                            value={data.targetSegment || ''}
                            onChange={(e) => onChange({ ...data, targetSegment: e.target.value })}
                            placeholder="VD: Nữ văn phòng 25-35 tại HCM"
                            disabled={isLoading}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                        />
                        <div className="mt-2 flex flex-wrap gap-2">
                            {campaignThinkingSuggestions.targetSegment.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => applyCampaignThinkingChip('targetSegment', item)}
                                    className="px-2.5 py-1 rounded-full text-xs border border-gray-200 text-gray-700 hover:border-[#F59E0B] hover:bg-amber-50"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                    <Button
                        onClick={onSuggestStrategy}
                        type="button"
                        variant="secondary"
                        isLoading={strategyLoading}
                        disabled={isLoading || strategyLoading}
                    >
                        AI đề xuất chiến lược tháng
                    </Button>

                    {currentSuggestion && (
                        <Button
                            onClick={onApplySuggestion}
                            type="button"
                            variant="outline"
                            disabled={isLoading}
                        >
                            Áp dụng mix đề xuất vào form
                        </Button>
                    )}
                </div>

                {currentSuggestion && (
                    <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-4">
                        <p className="text-sm font-semibold text-blue-900">AI đề xuất chiến lược tháng (có thể chỉnh sửa)</p>

                        <div>
                            <label className="block text-xs font-semibold text-blue-700 mb-1">Summary</label>
                            <textarea
                                value={currentSuggestion.summary || ''}
                                onChange={(e) => updateStrategySuggestion({ ...currentSuggestion, summary: e.target.value })}
                                rows={2}
                                className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-blue-700 mb-1">Concept / Campaign Concept</label>
                            <input
                                value={currentSuggestion.campaignConcept || currentSuggestion.concept || ''}
                                onChange={(e) => updateStrategySuggestion({
                                    ...currentSuggestion,
                                    campaignConcept: e.target.value,
                                    concept: e.target.value,
                                })}
                                className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-blue-700 mb-1">Content Pillars</label>
                            <TagsInput
                                value={currentSuggestion.contentPillars || currentSuggestion.topics || []}
                                onChange={(value) => updateStrategySuggestion({
                                    ...currentSuggestion,
                                    contentPillars: value,
                                    topics: value,
                                })}
                                placeholder="Nhập pillar và Enter..."
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-semibold text-blue-700">Topic Mix</label>
                                <button
                                    type="button"
                                    onClick={() => updateStrategySuggestion({
                                        ...currentSuggestion,
                                        topicMix: [...(currentSuggestion.topicMix || []), { key: '', value: '' }],
                                    })}
                                    className="text-xs text-blue-700 hover:text-blue-900"
                                >
                                    + Thêm dòng
                                </button>
                            </div>

                            <div className="space-y-2">
                                {(currentSuggestion.topicMix || []).map((item, index) => (
                                    <div key={`topic-mix-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <input
                                            value={item.key}
                                            onChange={(e) => updateTopicMixItem(index, 'key', e.target.value)}
                                            placeholder="Nhóm chủ đề"
                                            className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                        <input
                                            value={item.value}
                                            onChange={(e) => updateTopicMixItem(index, 'value', e.target.value)}
                                            placeholder="Tỷ trọng / mô tả"
                                            className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-blue-700 mb-2">Recommended Channels</label>
                                <div className="flex flex-wrap gap-2">
                                    {channelOptions.map(option => {
                                        const selected = (currentSuggestion.recommendedChannels || currentSuggestion.channels || []).includes(option.value);
                                        return (
                                            <button
                                                key={`suggest-channel-${option.value}`}
                                                type="button"
                                                onClick={() => {
                                                    const current = currentSuggestion.recommendedChannels || currentSuggestion.channels || [];
                                                    const next = selected ? current.filter(v => v !== option.value) : [...current, option.value];
                                                    updateStrategySuggestion({
                                                        ...currentSuggestion,
                                                        recommendedChannels: next,
                                                        channels: next,
                                                    });
                                                }}
                                                className={cn(
                                                    'px-3 py-1.5 rounded-lg text-xs border transition-all',
                                                    selected
                                                        ? 'border-blue-500 bg-blue-100 text-blue-800'
                                                        : 'border-blue-200 bg-white text-blue-700 hover:border-blue-300'
                                                )}
                                            >
                                                {option.icon} {option.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-blue-700 mb-2">Recommended Goals</label>
                                <div className="flex flex-wrap gap-2">
                                    {goalOptions.map(option => {
                                        const selected = (currentSuggestion.recommendedGoals || currentSuggestion.goals || []).includes(option.value);
                                        return (
                                            <button
                                                key={`suggest-goal-${option.value}`}
                                                type="button"
                                                onClick={() => {
                                                    const current = currentSuggestion.recommendedGoals || currentSuggestion.goals || [];
                                                    const next = selected ? current.filter(v => v !== option.value) : [...current, option.value];
                                                    updateStrategySuggestion({
                                                        ...currentSuggestion,
                                                        recommendedGoals: next,
                                                        goals: next,
                                                    });
                                                }}
                                                className={cn(
                                                    'px-3 py-1.5 rounded-lg text-xs border transition-all',
                                                    selected
                                                        ? 'border-blue-500 bg-blue-100 text-blue-800'
                                                        : 'border-blue-200 bg-white text-blue-700 hover:border-blue-300'
                                                )}
                                            >
                                                {option.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-semibold text-blue-700">Weekly Framework</label>
                                <button
                                    type="button"
                                    onClick={() => updateStrategySuggestion({
                                        ...currentSuggestion,
                                        weeklyFramework: [
                                            ...(currentSuggestion.weeklyFramework || []),
                                            { week: '', focus: '', sampleExecution: '' },
                                        ],
                                    })}
                                    className="text-xs text-blue-700 hover:text-blue-900"
                                >
                                    + Thêm tuần
                                </button>
                            </div>

                            <div className="space-y-2">
                                {(currentSuggestion.weeklyFramework || []).map((item, index) => (
                                    <div key={`weekly-framework-${index}`} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        <input
                                            value={item.week}
                                            onChange={(e) => updateWeeklyFrameworkItem(index, 'week', e.target.value)}
                                            placeholder="Tuần"
                                            className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                        <input
                                            value={item.focus}
                                            onChange={(e) => updateWeeklyFrameworkItem(index, 'focus', e.target.value)}
                                            placeholder="Focus"
                                            className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                        <input
                                            value={item.sampleExecution}
                                            onChange={(e) => updateWeeklyFrameworkItem(index, 'sampleExecution', e.target.value)}
                                            placeholder="Sample execution"
                                            className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-blue-700 mb-1">Rationale</label>
                            <textarea
                                value={currentSuggestion.rationale || ''}
                                onChange={(e) => updateStrategySuggestion({ ...currentSuggestion, rationale: e.target.value })}
                                rows={3}
                                className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* AI Settings Toggle */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center text-sm">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </span>
                            Áp dụng AI Settings
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 ml-10">
                            Sử dụng thông tin thương hiệu đã cấu hình để tạo nội dung phù hợp hơn
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={useBrandSettings || false}
                            onChange={(e) => onBrandSettingsChange?.(e.target.checked)}
                            disabled={isLoading}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F59E0B]"></div>
                    </label>
                </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ghi chú thêm</h3>
                <textarea
                    value={data.notes}
                    onChange={(e) => onChange({ ...data, notes: e.target.value })}
                    placeholder="Yêu cầu đặc biệt cho AI..."
                    rows={3}
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent resize-none transition-all"
                />
            </div>

            {/* Submit */}
            <div className="flex justify-center">
                <Button
                    onClick={onSubmit}
                    variant="primary"
                    size="lg"
                    disabled={!canSubmit}
                    isLoading={isLoading}
                    className="min-w-[200px] shadow-xl"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Tạo kế hoạch
                </Button>
            </div>
        </motion.div>
    );
}
