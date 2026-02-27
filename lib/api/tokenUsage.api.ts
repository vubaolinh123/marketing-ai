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
    requestCount: number;
    activeUsers: number;
}

export interface TokenUsageTimelineItem {
    bucket: string;
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
    requestCount: number;
}

export interface TokenUsageTopTool {
    tool: string;
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
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
    requestCount: number;
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
    topTools: TokenUsageTopTool[];
    topUsers: TokenUsageTopUser[];
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
    requestCount: number;
    activeTools?: string[];
    lastUsedAt?: string;
}

export interface TokenUsageUsersData {
    users: TokenUsageUserRow[];
    pagination: TokenUsagePagination;
}

export const tokenUsageApi = {
    async getTokenUsageSummary(params?: TokenUsageQueryParams): Promise<ApiResponse<TokenUsageSummaryData>> {
        const response = await api.get<ApiResponse<TokenUsageSummaryData>>('/admin/token-usage/summary', { params });
        return response.data;
    },

    async getTokenUsageUsers(params?: TokenUsageUsersParams): Promise<ApiResponse<TokenUsageUsersData>> {
        const response = await api.get<ApiResponse<TokenUsageUsersData>>('/admin/token-usage/users', { params });
        return response.data;
    }
};

export default tokenUsageApi;
