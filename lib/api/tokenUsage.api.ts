import api, { ApiResponse } from './api';

export type TokenUsageGroupBy = 'day' | 'week' | 'month';

export interface TokenUsageQueryParams {
    from?: string;
    to?: string;
    groupBy?: TokenUsageGroupBy;
    userId?: string;
}

export interface TokenUsageTotals {
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
    supplementalTokens: number;
    thoughtTokens: number;
    cachedTokens: number;
    toolUseTokens: number;
    otherKnownTokens: number;
    explainedSupplementalTokens: number;
    unexplainedTokens: number;
    requestCount: number;
    activeUsers: number;
}

export interface TokenUsageTimelineItem {
    bucket: string;
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
    supplementalTokens: number;
    thoughtTokens: number;
    cachedTokens: number;
    toolUseTokens: number;
    otherKnownTokens: number;
    explainedSupplementalTokens: number;
    unexplainedTokens: number;
    requestCount: number;
}

export interface TokenUsageTimelineByToolItem {
    bucket: string;
    tool: string;
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
    supplementalTokens: number;
    thoughtTokens: number;
    cachedTokens: number;
    toolUseTokens: number;
    otherKnownTokens: number;
    explainedSupplementalTokens: number;
    unexplainedTokens: number;
    requestCount: number;
}

export interface TokenUsageChartMeta {
    groupBy: TokenUsageGroupBy;
    bucketCount: number;
    from: string;
    to: string;
}

export interface TokenUsageTopTool {
    tool: string;
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
    supplementalTokens: number;
    thoughtTokens: number;
    cachedTokens: number;
    toolUseTokens: number;
    otherKnownTokens: number;
    explainedSupplementalTokens: number;
    unexplainedTokens: number;
    requestCount: number;
}

export interface TokenUsageTopUser {
    userId: string;
    name: string;
    email?: string;
    avatar?: string;
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
    supplementalTokens: number;
    thoughtTokens: number;
    cachedTokens: number;
    toolUseTokens: number;
    otherKnownTokens: number;
    explainedSupplementalTokens: number;
    unexplainedTokens: number;
    requestCount: number;
}

export interface TokenUsageTopFeature {
    featureKey: string;
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
    supplementalTokens: number;
    thoughtTokens: number;
    cachedTokens: number;
    toolUseTokens: number;
    otherKnownTokens: number;
    explainedSupplementalTokens: number;
    unexplainedTokens: number;
}

export interface TokenUsageDiscrepancy {
    supplementalTokens: number;
    thoughtTokens: number;
    cachedTokens: number;
    toolUseTokens: number;
    otherKnownTokens: number;
    explainedSupplementalTokens: number;
    unexplainedTokens: number;
}

export interface TokenUsagePagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface TokenUsageSummaryData {
    totals: TokenUsageTotals;
    timeline: TokenUsageTimelineItem[];
    timelineByTool: TokenUsageTimelineByToolItem[];
    topTools: TokenUsageTopTool[];
    topUsers: TokenUsageTopUser[];
    topFeatures: TokenUsageTopFeature[];
    discrepancy: TokenUsageDiscrepancy;
    chartMeta: TokenUsageChartMeta;
}

export interface TokenUsageUsersParams extends TokenUsageQueryParams {
    page?: number;
    limit?: number;
}

export interface TokenUsageUserRow {
    userId: string;
    name: string;
    email: string;
    role?: 'admin' | 'user';
    avatar?: string;
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
    supplementalTokens: number;
    thoughtTokens: number;
    cachedTokens: number;
    toolUseTokens: number;
    otherKnownTokens: number;
    explainedSupplementalTokens: number;
    unexplainedTokens: number;
    requestCount: number;
    activeTools?: string[];
    lastUsedAt?: string;
    updatedAt?: string;
}

export interface TokenUsageUsersData {
    users: TokenUsageUserRow[];
    pagination: TokenUsagePagination;
}

export interface TokenUsageDebugRecentItem {
    dateKey: string;
    userId: string;
    tool: string;
    requestCount: number;
    totalTokens: number;
    lastRequestAt?: string | null;
    updatedAt?: string | null;
    model?: string;
}

export interface TokenUsageDebugRecentData {
    limit: number;
    items: TokenUsageDebugRecentItem[];
}

export const tokenUsageApi = {
    async getTokenUsageSummary(params?: TokenUsageQueryParams): Promise<ApiResponse<TokenUsageSummaryData>> {
        const response = await api.get<ApiResponse<TokenUsageSummaryData>>('/admin/token-usage/summary', { params });
        return response.data;
    },

    async getTokenUsageUsers(params?: TokenUsageUsersParams): Promise<ApiResponse<TokenUsageUsersData>> {
        const response = await api.get<ApiResponse<TokenUsageUsersData>>('/admin/token-usage/users', { params });
        return response.data;
    },

    async getTokenUsageDebugRecent(limit = 20): Promise<ApiResponse<TokenUsageDebugRecentData>> {
        const response = await api.get<ApiResponse<TokenUsageDebugRecentData>>('/admin/token-usage/debug/recent', {
            params: { limit }
        });
        return response.data;
    }
};

export default tokenUsageApi;
