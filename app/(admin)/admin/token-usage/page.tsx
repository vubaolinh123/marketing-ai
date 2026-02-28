'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import {
    tokenUsageApi,
    type TokenUsageGroupBy,
    type TokenUsageSummaryData,
    type TokenUsageTimelineItem,
    type TokenUsageTopTool,
    type TokenUsageUserRow
} from '@/lib/api';
import { showError } from '@/lib/toast';

const Pagination = dynamic(() => import('../article/list/_components/Pagination'), { ssr: false });

const USERS_PAGE_SIZE = 10;
const TIMELINE_CHART_COLORS = ['#3B82F6', '#8B5CF6', '#14B8A6', '#F97316', '#0EA5E9', '#6366F1', '#10B981', '#F59E0B'];

type TimelineMetricKey = 'totalTokens' | 'promptTokens' | 'completionTokens' | 'supplementalTokens' | 'requestCount';
type TimelineChartType = 'bar' | 'pie' | 'line';
type TimelineDisplayMode = 'overall' | 'tool';

const groupByLabels: Record<TokenUsageGroupBy, string> = {
    day: 'Ngày',
    week: 'Tuần',
    month: 'Tháng'
};

const EMPTY_SUMMARY: TokenUsageSummaryData = {
    totals: {
        totalTokens: 0,
        promptTokens: 0,
        completionTokens: 0,
        supplementalTokens: 0,
        thoughtTokens: 0,
        cachedTokens: 0,
        toolUseTokens: 0,
        otherKnownTokens: 0,
        explainedSupplementalTokens: 0,
        unexplainedTokens: 0,
        requestCount: 0,
        activeUsers: 0
    },
    timeline: [],
    timelineByTool: [],
    topTools: [],
    topUsers: [],
    topFeatures: [],
    discrepancy: {
        supplementalTokens: 0,
        thoughtTokens: 0,
        cachedTokens: 0,
        toolUseTokens: 0,
        otherKnownTokens: 0,
        explainedSupplementalTokens: 0,
        unexplainedTokens: 0
    },
    chartMeta: {
        groupBy: 'day',
        bucketCount: 0,
        from: '',
        to: ''
    }
};

const timelineMetricOptions: { key: TimelineMetricKey; label: string; shortLabel: string }[] = [
    { key: 'totalTokens', label: 'Tổng token', shortLabel: 'Tổng' },
    { key: 'promptTokens', label: 'Prompt token', shortLabel: 'Prompt' },
    { key: 'completionTokens', label: 'Completion token', shortLabel: 'Completion' },
    { key: 'supplementalTokens', label: 'Supplemental token', shortLabel: 'Supplemental' },
    { key: 'requestCount', label: 'Số request', shortLabel: 'Request' }
];

const toolSeriesConfig = [
    { id: 'article', label: 'Bài viết', color: '#3B82F6' },
    { id: 'image', label: 'Hình ảnh', color: '#8B5CF6' },
    { id: 'video', label: 'Video', color: '#F97316' },
    { id: 'marketing', label: 'Marketing', color: '#14B8A6' },
    { id: 'unknown', label: 'Khác', color: '#64748B' }
] as const;

const supplementalBuckets = [
    { key: 'thoughtTokens', label: 'Suy luận nội bộ' },
    { key: 'cachedTokens', label: 'Token từ cache' },
    { key: 'toolUseTokens', label: 'Token gọi công cụ' },
    { key: 'otherKnownTokens', label: 'Phần khác đã biết' },
    { key: 'unexplainedTokens', label: 'Chưa giải thích' }
] as const;

const toolBuckets = [
    {
        id: 'article',
        label: 'Bài viết',
        color: 'from-[#3B82F6] to-[#1D4ED8]',
        matches: ['article', 'blog', 'content']
    },
    {
        id: 'image',
        label: 'Hình ảnh',
        color: 'from-[#8B5CF6] to-[#6D28D9]',
        matches: ['image', 'photo', 'product-image', 'img']
    },
    {
        id: 'video',
        label: 'Video',
        color: 'from-[#F97316] to-[#EA580C]',
        matches: ['video', 'script']
    },
    {
        id: 'marketing',
        label: 'Marketing',
        color: 'from-[#14B8A6] to-[#0F766E]',
        matches: ['marketing', 'plan', 'campaign']
    }
] as const;

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35 }
    }
};

function getDefaultDateRange() {
    const toDateInput = (value: Date) => {
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day = String(value.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const now = new Date();
    const to = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const from = new Date(to);
    from.setDate(to.getDate() - 29);

    return {
        fromDate: toDateInput(from),
        toDate: toDateInput(to)
    };
}

function formatNumber(value: number | undefined) {
    return new Intl.NumberFormat('en-US').format(value || 0);
}

function formatShortNumber(value: number | undefined) {
    const safe = value || 0;
    if (safe >= 1_000_000) return `${(safe / 1_000_000).toFixed(1)}M`;
    if (safe >= 1_000) return `${(safe / 1_000).toFixed(1)}K`;
    return `${safe}`;
}

function formatDateTime(value?: string) {
    if (!value) return '--';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '--';
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function normalizeToolName(tool: TokenUsageTopTool) {
    return (tool.tool || '').toLowerCase().replaceAll('_', '-');
}

function getToolBucketKey(tool: TokenUsageTopTool) {
    const name = normalizeToolName(tool);
    const bucket = toolBuckets.find((item) => item.matches.some((keyword) => name.includes(keyword)));
    return bucket?.id;
}

function normalizeToolKey(value?: string) {
    return (value || 'unknown').toLowerCase().replaceAll('_', '-');
}

function resolveToolDisplay(tool: string, fallbackColorIndex = 0) {
    const normalizedTool = normalizeToolKey(tool);
    const matchedBucket = toolBuckets.find((bucket) => bucket.matches.some((keyword) => normalizedTool.includes(keyword)));
    const presetByBucket = toolSeriesConfig.find((item) => item.id === matchedBucket?.id);
    const presetDirect = toolSeriesConfig.find((item) => item.id === normalizedTool);
    const preset = presetDirect || presetByBucket;

    if (preset) {
        return {
            key: normalizedTool,
            label: preset.label,
            color: preset.color
        };
    }

    return {
        key: normalizedTool || 'unknown',
        label: tool || 'Khác',
        color: TIMELINE_CHART_COLORS[fallbackColorIndex % TIMELINE_CHART_COLORS.length]
    };
}

function getTimelineMetricValue(item: TokenUsageTimelineItem, metric: TimelineMetricKey) {
    return Number(item[metric] || 0);
}

export default function AdminTokenUsagePage() {
    const { user, isLoading: isAuthLoading } = useAuth();

    const defaults = useMemo(() => getDefaultDateRange(), []);

    const [fromDate, setFromDate] = useState(defaults.fromDate);
    const [toDate, setToDate] = useState(defaults.toDate);
    const [groupBy, setGroupBy] = useState<TokenUsageGroupBy>('month');
    const [selectedUserId, setSelectedUserId] = useState('');

    const [summary, setSummary] = useState<TokenUsageSummaryData>(EMPTY_SUMMARY);
    const [users, setUsers] = useState<TokenUsageUserRow[]>([]);
    const [isSummaryLoading, setIsSummaryLoading] = useState(true);
    const [isUsersLoading, setIsUsersLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedTimelineMetric, setSelectedTimelineMetric] = useState<TimelineMetricKey>('totalTokens');
    const [timelineChartType, setTimelineChartType] = useState<TimelineChartType>('bar');
    const [timelineDisplayMode, setTimelineDisplayMode] = useState<TimelineDisplayMode>('overall');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const hasInvalidRange = !!fromDate && !!toDate && fromDate > toDate;

    const requestParams = useMemo(() => ({
        from: fromDate || undefined,
        to: toDate || undefined,
        groupBy,
        userId: selectedUserId || undefined
    }), [fromDate, toDate, groupBy, selectedUserId]);

    const fetchSummary = useCallback(async () => {
        if (hasInvalidRange) return;

        try {
            setIsSummaryLoading(true);
            const response = await tokenUsageApi.getTokenUsageSummary(requestParams);

            if (!response.success || !response.data) {
                throw new Error(response.message || 'Không thể tải thống kê token usage');
            }

            setSummary({
                totals: {
                    ...EMPTY_SUMMARY.totals,
                    ...(response.data.totals || {})
                },
                timeline: response.data.timeline || [],
                timelineByTool: response.data.timelineByTool || [],
                topTools: response.data.topTools || [],
                topUsers: response.data.topUsers || [],
                topFeatures: response.data.topFeatures || [],
                discrepancy: {
                    ...EMPTY_SUMMARY.discrepancy,
                    ...(response.data.discrepancy || {})
                },
                chartMeta: {
                    ...EMPTY_SUMMARY.chartMeta,
                    ...(response.data.chartMeta || {})
                }
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Không thể tải thống kê token usage';
            showError(message);
            setSummary(EMPTY_SUMMARY);
        } finally {
            setIsSummaryLoading(false);
        }
    }, [hasInvalidRange, requestParams]);

    const fetchUsers = useCallback(async () => {
        if (hasInvalidRange) return;

        try {
            setIsUsersLoading(true);
            const response = await tokenUsageApi.getTokenUsageUsers({
                ...requestParams,
                page: currentPage,
                limit: USERS_PAGE_SIZE
            });

            if (!response.success || !response.data) {
                throw new Error(response.message || 'Không thể tải danh sách người dùng');
            }

            setUsers(response.data.users || []);
            setTotalPages(response.data.pagination?.totalPages || 1);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Không thể tải danh sách người dùng';
            showError(message);
            setUsers([]);
            setTotalPages(1);
        } finally {
            setIsUsersLoading(false);
        }
    }, [currentPage, hasInvalidRange, requestParams]);

    useEffect(() => {
        setCurrentPage(1);
    }, [fromDate, toDate, groupBy, selectedUserId]);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        if (!summary.timelineByTool.length && timelineDisplayMode === 'tool') {
            setTimelineDisplayMode('overall');
        }
    }, [summary.timelineByTool.length, timelineDisplayMode]);

    const handleRefresh = async () => {
        if (hasInvalidRange) {
            showError('Khoảng ngày không hợp lệ. Vui lòng kiểm tra lại.');
            return;
        }

        try {
            setIsRefreshing(true);
            await Promise.all([fetchSummary(), fetchUsers()]);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleResetFilters = () => {
        const nextDefaults = getDefaultDateRange();
        setFromDate(nextDefaults.fromDate);
        setToDate(nextDefaults.toDate);
        setGroupBy('month');
        setSelectedUserId('');
    };

    const toolDistribution = useMemo(() => {
        const distribution = toolBuckets.map((bucket) => ({
            ...bucket,
            totalTokens: 0,
            requestCount: 0
        }));

        summary.topTools.forEach((tool) => {
            const bucketKey = getToolBucketKey(tool);
            const bucket = distribution.find((item) => item.id === bucketKey);
            if (!bucket) return;

            bucket.totalTokens += tool.totalTokens || 0;
            bucket.requestCount += tool.requestCount || 0;
        });

        return distribution;
    }, [summary.topTools]);

    const maxToolTokens = useMemo(() => {
        return Math.max(...toolDistribution.map((item) => item.totalTokens || 0), 1);
    }, [toolDistribution]);

    const maxTopUserTokens = useMemo(() => {
        return Math.max(...summary.topUsers.map((item) => item.totalTokens || 0), 1);
    }, [summary.topUsers]);

    const sortedTopFeatures = useMemo(() => {
        return [...summary.topFeatures].sort((a, b) => (b.totalTokens || 0) - (a.totalTokens || 0));
    }, [summary.topFeatures]);

    const selectedTimelineMetricOption = useMemo(
        () => timelineMetricOptions.find((item) => item.key === selectedTimelineMetric) || timelineMetricOptions[0],
        [selectedTimelineMetric]
    );

    const timelineBuckets = useMemo(() => {
        if (summary.timeline.length > 0) {
            return summary.timeline.map((item) => item.bucket);
        }
        return Array.from(new Set(summary.timelineByTool.map((item) => item.bucket))).sort((a, b) => a.localeCompare(b));
    }, [summary.timeline, summary.timelineByTool]);

    const timelineOverallData = useMemo(() => {
        const timelineMap = new Map(summary.timeline.map((item) => [item.bucket, item]));

        return timelineBuckets.map((bucket) => {
            const item = timelineMap.get(bucket);
            return {
                bucket,
                value: item ? getTimelineMetricValue(item, selectedTimelineMetric) : 0
            };
        });
    }, [selectedTimelineMetric, summary.timeline, timelineBuckets]);

    const timelineTools = useMemo(() => {
        const uniqueTools = Array.from(new Set(summary.timelineByTool.map((item) => normalizeToolKey(item.tool))));
        const configuredOrder = toolSeriesConfig.map((item) => item.id);

        uniqueTools.sort((a, b) => {
            const indexA = configuredOrder.indexOf(a as (typeof toolSeriesConfig)[number]['id']);
            const indexB = configuredOrder.indexOf(b as (typeof toolSeriesConfig)[number]['id']);
            const rankA = indexA >= 0 ? indexA : 999;
            const rankB = indexB >= 0 ? indexB : 999;
            if (rankA !== rankB) return rankA - rankB;
            return a.localeCompare(b);
        });

        return uniqueTools.map((tool, index) => resolveToolDisplay(tool, index));
    }, [summary.timelineByTool]);

    const timelineByToolData = useMemo(() => {
        const seeded = timelineBuckets.map((bucket) => ({ bucket })) as Array<Record<string, number | string>>;
        const bucketMap = new Map(seeded.map((item) => [String(item.bucket), item]));

        summary.timelineByTool.forEach((item) => {
            const bucketData = bucketMap.get(item.bucket);
            if (!bucketData) return;
            const toolKey = normalizeToolKey(item.tool);
            bucketData[toolKey] = Number(item[selectedTimelineMetric] || 0);
        });

        timelineTools.forEach((tool) => {
            seeded.forEach((bucketRow) => {
                if (typeof bucketRow[tool.key] !== 'number') {
                    bucketRow[tool.key] = 0;
                }
            });
        });

        return seeded;
    }, [selectedTimelineMetric, summary.timelineByTool, timelineBuckets, timelineTools]);

    const timelinePieData = useMemo(() => {
        if (timelineDisplayMode === 'tool' && timelineTools.length > 0) {
            const totalsByTool = new Map<string, number>();

            summary.timelineByTool.forEach((item) => {
                const key = normalizeToolKey(item.tool);
                totalsByTool.set(key, (totalsByTool.get(key) || 0) + Number(item[selectedTimelineMetric] || 0));
            });

            return timelineTools.map((tool) => ({
                name: tool.label,
                value: totalsByTool.get(tool.key) || 0,
                color: tool.color
            }));
        }

        return timelineOverallData.map((item, index) => ({
            name: item.bucket,
            value: Number(item.value || 0),
            color: TIMELINE_CHART_COLORS[index % TIMELINE_CHART_COLORS.length]
        }));
    }, [selectedTimelineMetric, summary.timelineByTool, timelineDisplayMode, timelineOverallData, timelineTools]);

    const timelineChartData = timelineDisplayMode === 'tool' ? timelineByToolData : timelineOverallData;
    const timelineHasData = timelineBuckets.length > 0;
    const timelineChartMinWidth = Math.max(680, timelineBuckets.length * 72);

    if (isAuthLoading) {
        return (
            <div className="w-[96%] max-w-[1700px] mx-auto space-y-4 animate-pulse">
                <div className="h-20 rounded-2xl bg-[#EEF4FF] border border-gray-200" />
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="h-28 rounded-2xl bg-[#EEF4FF] border border-gray-200" />
                    ))}
                </div>
            </div>
        );
    }

    if (user?.role !== 'admin') {
        return (
            <div className="w-[96%] max-w-[1200px] mx-auto py-10">
                <div className="bg-white border border-red-200 text-red-600 rounded-2xl p-6">
                    Bạn không có quyền truy cập trang thống kê token usage.
                </div>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-[96%] max-w-[1700px] mx-auto"
        >
            <motion.div variants={itemVariants} className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Thống kê token Gemini</h1>
                    <p className="text-gray-600 mt-1">Theo dõi mức tiêu thụ token theo thời gian, theo tính năng và theo người dùng.</p>
                </div>

                <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={handleRefresh}
                    isLoading={isRefreshing}
                >
                    Làm mới dữ liệu
                </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-200 p-4 md:p-5 mb-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Từ ngày</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9]/30"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Đến ngày</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9]/30"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Nhóm theo</label>
                        <select
                            value={groupBy}
                            onChange={(e) => setGroupBy(e.target.value as TokenUsageGroupBy)}
                            className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9]/30"
                        >
                            <option value="day">Ngày</option>
                            <option value="week">Tuần</option>
                            <option value="month">Tháng</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Người dùng</label>
                        <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9]/30"
                        >
                            <option value="">Tất cả người dùng</option>
                            {summary.topUsers.map((item) => (
                                <option key={item.userId} value={item.userId}>
                                    {item.name} ({formatShortNumber(item.totalTokens)} tokens)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <Button
                            variant="secondary"
                            className="rounded-xl w-full"
                            onClick={handleResetFilters}
                        >
                            Đặt lại bộ lọc
                        </Button>
                    </div>
                </div>

                {hasInvalidRange && (
                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 text-red-600 px-3 py-2 text-sm">
                        Khoảng ngày không hợp lệ: ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc.
                    </div>
                )}
            </motion.div>

            <motion.div variants={itemVariants} className="bg-[#F8FBFF] border border-[#DCEAFF] rounded-2xl p-4 md:p-5 mb-6">
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Cách tính tổng token &amp; phần chênh lệch</h2>
                <div className="space-y-2 text-sm text-gray-700">
                    <p>
                        <span className="font-semibold text-gray-900">Tổng token</span> = Prompt + Completion + Supplemental
                    </p>
                    <p>
                        <span className="font-semibold text-gray-900">Supplemental</span> = Thought + Cached + ToolUse + OtherKnown + Unexplained
                    </p>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div className="rounded-xl bg-white border border-gray-200 px-3 py-2">
                        <div className="text-gray-500">Supplemental hiện có</div>
                        <div className="font-semibold text-gray-900">{isSummaryLoading ? '...' : formatNumber(summary.totals.supplementalTokens)}</div>
                    </div>
                    <div className="rounded-xl bg-white border border-gray-200 px-3 py-2">
                        <div className="text-gray-500">Phần đã giải thích</div>
                        <div className="font-semibold text-gray-900">{isSummaryLoading ? '...' : formatNumber(summary.discrepancy.explainedSupplementalTokens)}</div>
                    </div>
                    <div className="rounded-xl bg-white border border-gray-200 px-3 py-2">
                        <div className="text-gray-500">Phần chưa giải thích</div>
                        <div className="font-semibold text-amber-700">{isSummaryLoading ? '...' : formatNumber(summary.discrepancy.unexplainedTokens)}</div>
                    </div>
                    <div className="rounded-xl bg-white border border-gray-200 px-3 py-2">
                        <div className="text-gray-500">Sai lệch (Supplemental - Explained)</div>
                        <div className="font-semibold text-gray-900">
                            {isSummaryLoading
                                ? '...'
                                : formatNumber((summary.totals.supplementalTokens || 0) - (summary.discrepancy.explainedSupplementalTokens || 0))}
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
                {[
                    {
                        label: 'Tổng token',
                        value: summary.totals.totalTokens,
                        color: 'from-[#3B82F6] to-[#1D4ED8]'
                    },
                    {
                        label: 'Prompt',
                        value: summary.totals.promptTokens,
                        color: 'from-[#0EA5E9] to-[#0369A1]'
                    },
                    {
                        label: 'Completion',
                        value: summary.totals.completionTokens,
                        color: 'from-[#8B5CF6] to-[#6D28D9]'
                    },
                    {
                        label: 'Supplemental',
                        value: summary.totals.supplementalTokens,
                        color: 'from-[#7C3AED] to-[#5B21B6]'
                    },
                    {
                        label: 'Số request',
                        value: summary.totals.requestCount,
                        color: 'from-[#F97316] to-[#EA580C]'
                    },
                    {
                        label: 'Người dùng hoạt động',
                        value: summary.totals.activeUsers,
                        color: 'from-[#14B8A6] to-[#0F766E]'
                    }
                ].map((item) => (
                    <motion.div
                        key={item.label}
                        whileHover={{ y: -3 }}
                        className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm"
                    >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center mb-3 shadow-md`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-3.314 0-6 1.343-6 3v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5c0-1.657-2.686-3-6-3zm0 0V5m0 3c3.314 0 6-1.343 6-3s-2.686-3-6-3-6 1.343-6 3 2.686 3 6 3z" />
                            </svg>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                            {isSummaryLoading ? '...' : formatNumber(item.value)}
                        </div>
                        <div className="text-sm text-gray-500">{item.label}</div>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-200 p-4 md:p-5 mb-6 shadow-sm">
                <div className="text-sm font-medium text-gray-700 mb-3">Chi tiết Supplemental</div>
                <div className="flex flex-wrap gap-2">
                    {supplementalBuckets.map((bucket) => (
                        <div key={bucket.key} className="rounded-full border border-gray-200 bg-[#F7FAFF] px-3 py-1.5 text-xs text-gray-700">
                            <span className="font-medium">{bucket.label}:</span>{' '}
                            <span className="font-semibold text-gray-900">{isSummaryLoading ? '...' : formatNumber(summary.totals[bucket.key])}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
                <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Diễn biến token theo thời gian</h2>
                            <p className="text-xs text-gray-500 mt-1">
                                Nhóm theo {groupByLabels[groupBy]} • {summary.chartMeta.bucketCount || timelineBuckets.length} bucket
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <select
                                value={selectedTimelineMetric}
                                onChange={(e) => setSelectedTimelineMetric(e.target.value as TimelineMetricKey)}
                                className="h-9 rounded-lg border border-gray-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4A90D9]/30"
                            >
                                {timelineMetricOptions.map((metric) => (
                                    <option key={metric.key} value={metric.key}>{metric.label}</option>
                                ))}
                            </select>

                            <select
                                value={timelineDisplayMode}
                                onChange={(e) => setTimelineDisplayMode(e.target.value as TimelineDisplayMode)}
                                disabled={!summary.timelineByTool.length}
                                className="h-9 rounded-lg border border-gray-200 px-3 text-sm bg-white disabled:bg-gray-100 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A90D9]/30"
                            >
                                <option value="overall">Tổng theo bucket</option>
                                <option value="tool">So sánh theo tool</option>
                            </select>

                            <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
                                {([
                                    ['bar', 'Cột'],
                                    ['pie', 'Tròn'],
                                    ['line', 'Đường']
                                ] as const).map(([type, label]) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setTimelineChartType(type)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                                            timelineChartType === type
                                                ? 'bg-[#E8F1FF] text-[#1D4ED8]'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {isSummaryLoading ? (
                        <div className="h-72 rounded-2xl border border-dashed border-gray-200 bg-[#F7FAFF] animate-pulse" />
                    ) : !timelineHasData ? (
                        <div className="h-72 rounded-2xl border border-dashed border-gray-200 bg-[#F8FBFF] flex items-center justify-center text-gray-500">
                            Không có dữ liệu timeline trong khoảng thời gian này.
                        </div>
                    ) : (
                        <div className="h-[320px] overflow-x-auto">
                            <div style={{ minWidth: timelineChartType === 'pie' ? undefined : `${timelineChartMinWidth}px` }} className="h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    {timelineChartType === 'pie' ? (
                                        <PieChart>
                                            <Tooltip
                                                formatter={(value: number | string | undefined) => [formatNumber(Number(value || 0)), selectedTimelineMetricOption.label] as [string, string]}
                                            />
                                            <Legend />
                                            <Pie
                                                data={timelinePieData}
                                                dataKey="value"
                                                nameKey="name"
                                                innerRadius={60}
                                                outerRadius={110}
                                                paddingAngle={2}
                                                label={(entry) => `${entry.name}: ${formatShortNumber(Number(entry.value || 0))}`}
                                            >
                                                {timelinePieData.map((entry) => (
                                                    <Cell key={entry.name} fill={entry.color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    ) : timelineChartType === 'line' ? (
                                        <LineChart data={timelineChartData} margin={{ top: 8, right: 16, left: 4, bottom: 8 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                            <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: '#6B7280' }} />
                                            <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} tickFormatter={(value) => formatShortNumber(Number(value))} />
                                            <Tooltip formatter={(value: number | string | undefined) => [formatNumber(Number(value || 0)), selectedTimelineMetricOption.shortLabel] as [string, string]} />
                                            <Legend />
                                            {timelineDisplayMode === 'tool' ? (
                                                timelineTools.map((tool) => (
                                                    <Line
                                                        key={tool.key}
                                                        type="monotone"
                                                        dataKey={tool.key}
                                                        name={tool.label}
                                                        stroke={tool.color}
                                                        strokeWidth={2}
                                                        dot={false}
                                                    />
                                                ))
                                            ) : (
                                                <Line
                                                    type="monotone"
                                                    dataKey="value"
                                                    name={selectedTimelineMetricOption.shortLabel}
                                                    stroke="#2563EB"
                                                    strokeWidth={2.5}
                                                    dot={{ r: 3 }}
                                                />
                                            )}
                                        </LineChart>
                                    ) : (
                                        <BarChart data={timelineChartData} margin={{ top: 8, right: 16, left: 4, bottom: 8 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                            <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: '#6B7280' }} />
                                            <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} tickFormatter={(value) => formatShortNumber(Number(value))} />
                                            <Tooltip formatter={(value: number | string | undefined) => [formatNumber(Number(value || 0)), selectedTimelineMetricOption.shortLabel] as [string, string]} />
                                            <Legend />
                                            {timelineDisplayMode === 'tool' ? (
                                                timelineTools.map((tool) => (
                                                    <Bar
                                                        key={tool.key}
                                                        dataKey={tool.key}
                                                        name={tool.label}
                                                        fill={tool.color}
                                                        radius={[4, 4, 0, 0]}
                                                    />
                                                ))
                                            ) : (
                                                <Bar dataKey="value" name={selectedTimelineMetricOption.shortLabel} fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                            )}
                                        </BarChart>
                                    )}
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-5">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Phân bổ theo nhóm tính năng</h2>

                    {isSummaryLoading ? (
                        <div className="space-y-4 animate-pulse">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item}>
                                    <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                                    <div className="h-2 w-full bg-gray-100 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {toolDistribution.map((item) => {
                                const widthPercent = ((item.totalTokens || 0) / maxToolTokens) * 100;

                                return (
                                    <div key={item.id}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                            <span className="text-xs text-gray-500">{formatShortNumber(item.totalTokens)} token</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                                                style={{ width: `${widthPercent}%` }}
                                            />
                                        </div>
                                        <div className="mt-1 text-xs text-gray-500">{formatNumber(item.requestCount)} yêu cầu</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-5 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết theo API/feature</h2>

                {isSummaryLoading ? (
                    <div className="space-y-3 animate-pulse">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="h-14 rounded-xl bg-[#F6F9FF] border border-gray-100" />
                        ))}
                    </div>
                ) : sortedTopFeatures.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-[#F8FBFF] p-6 text-center text-gray-500">
                        Chưa có dữ liệu API/feature cho bộ lọc hiện tại.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[980px]">
                            <thead>
                                <tr className="bg-[#F3F8FF] text-left text-xs uppercase tracking-wide text-gray-600">
                                    <th className="px-4 py-3 font-semibold">API/Feature</th>
                                    <th className="px-4 py-3 font-semibold">Tổng</th>
                                    <th className="px-4 py-3 font-semibold">Prompt</th>
                                    <th className="px-4 py-3 font-semibold">Completion</th>
                                    <th className="px-4 py-3 font-semibold">Supplemental</th>
                                    <th className="px-4 py-3 font-semibold">Chi tiết Supplemental</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedTopFeatures.map((item, index) => (
                                    <tr key={`${item.featureKey}-${index}`} className="border-t border-gray-100 hover:bg-[#F8FBFF]">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.featureKey || '--'}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatNumber(item.totalTokens)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{formatNumber(item.promptTokens)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{formatNumber(item.completionTokens)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{formatNumber(item.supplementalTokens)}</td>
                                        <td className="px-4 py-3 text-xs text-gray-600">
                                            <div className="flex flex-wrap gap-1.5">
                                                <span className="rounded-full bg-gray-100 px-2 py-1">Thought: {formatShortNumber(item.thoughtTokens)}</span>
                                                <span className="rounded-full bg-gray-100 px-2 py-1">Cached: {formatShortNumber(item.cachedTokens)}</span>
                                                <span className="rounded-full bg-gray-100 px-2 py-1">ToolUse: {formatShortNumber(item.toolUseTokens)}</span>
                                                <span className="rounded-full bg-gray-100 px-2 py-1">Other: {formatShortNumber(item.otherKnownTokens)}</span>
                                                <span className="rounded-full bg-amber-50 text-amber-700 px-2 py-1">Unexplained: {formatShortNumber(item.unexplainedTokens)}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-5 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Người dùng tiêu thụ nhiều token</h2>

                {isSummaryLoading ? (
                    <div className="space-y-3 animate-pulse">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="h-14 rounded-xl bg-[#F6F9FF] border border-gray-100" />
                        ))}
                    </div>
                ) : summary.topUsers.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-[#F8FBFF] p-6 text-center text-gray-500">
                        Chưa có dữ liệu người dùng nổi bật cho bộ lọc hiện tại.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {summary.topUsers.slice(0, 8).map((item) => (
                            <div key={item.userId} className="rounded-xl border border-gray-100 bg-[#FAFCFF] p-3">
                                <div className="flex items-center justify-between gap-3 mb-2">
                                    <div className="min-w-0">
                                        <div className="font-medium text-gray-900 truncate">{item.name}</div>
                                        <div className="text-xs text-gray-500 truncate">{item.email || 'Không có email'}</div>
                                    </div>
                                    <div className="text-sm font-semibold text-gray-800">{formatNumber(item.totalTokens)}</div>
                                </div>
                                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-[#4A90D9] to-[#1D4ED8]"
                                        style={{ width: `${((item.totalTokens || 0) / maxTopUserTokens) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Chi tiết người dùng</h2>
                    <span className="text-sm text-gray-500">
                        {isUsersLoading ? 'Đang tải...' : `${users.length} người dùng trên trang này`}
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1280px]">
                        <thead>
                            <tr className="bg-gradient-to-r from-[#E0EFFF] to-white text-left text-xs uppercase tracking-wide text-gray-600">
                                <th className="px-4 py-3 font-semibold">Người dùng</th>
                                <th className="px-4 py-3 font-semibold">Tổng</th>
                                <th className="px-4 py-3 font-semibold">Prompt</th>
                                <th className="px-4 py-3 font-semibold">Completion</th>
                                <th className="px-4 py-3 font-semibold">Supplemental</th>
                                <th className="px-4 py-3 font-semibold">Chưa giải thích</th>
                                <th className="px-4 py-3 font-semibold">Số yêu cầu</th>
                                <th className="px-4 py-3 font-semibold">Lần dùng cuối</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isUsersLoading && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                                        Đang tải dữ liệu người dùng...
                                    </td>
                                </tr>
                            )}

                            {!isUsersLoading && users.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                                        Không có dữ liệu người dùng trong khoảng lọc hiện tại.
                                    </td>
                                </tr>
                            )}

                            {!isUsersLoading && users.map((item, index) => (
                                <motion.tr
                                    key={`${item.userId}-${index}`}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                    className="border-t border-gray-100 hover:bg-[#F8FBFF]"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-[#4A90D9]/20 text-[#1E40AF] flex items-center justify-center font-bold text-sm">
                                                {item.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{item.name || 'Người dùng không xác định'}</div>
                                                <div className="text-xs text-gray-500">{item.email || '--'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatNumber(item.totalTokens)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{formatNumber(item.promptTokens)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{formatNumber(item.completionTokens)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{formatNumber(item.supplementalTokens)}</td>
                                    <td className="px-4 py-3 text-sm text-amber-700">{formatNumber(item.unexplainedTokens)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{formatNumber(item.requestCount)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{formatDateTime(item.lastUsedAt)}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {!isUsersLoading && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </motion.div>
    );
}
