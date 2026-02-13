/**
 * Marketing Plan API
 * Frontend API functions for marketing plan generation and management
 */

import api from './api';

// =====================
// Types
// =====================

export interface MarketingPlanRequest {
    campaignName: string;
    startDate: string;
    endDate: string;
    postsPerWeek: string;
    postTimes: string[];
    topics: string[];
    goals: string[];
    channels: string[];
    priorityProductService?: string;
    monthlyFocus?: string;
    promotions?: string;
    customerJourneyStage?: string;
    targetSegment?: string;
    strategySuggestion?: MarketingStrategySuggestion;
    notes: string;
    useBrandSettings?: boolean;
}

export interface MarketingStrategySuggestion {
    summary?: string;
    concept?: string;
    campaignConcept?: string;
    contentPillars?: string[];
    topicMix?: Array<{ key: string; value: string }>;
    recommendedChannels?: string[];
    recommendedGoals?: string[];
    weeklyFramework?: Array<{ week: string; focus: string; sampleExecution: string }>;
    rationale?: string;
    topics?: string[];
    goals?: string[];
    channels?: string[];
}

export interface MarketingPost {
    _id?: string;
    date: string | Date;
    time: string;
    topic: string;
    channel: string;
    status: 'scheduled' | 'draft' | 'published';
    contentIdea?: string;
    purpose?: string;
    postType?: 'image' | 'video' | 'story' | 'blog' | 'reel';
    suggestedHashtags?: string[];
}

export interface MarketingPlan {
    _id?: string;
    id?: string;
    campaignName: string;
    startDate: string | Date;
    endDate: string | Date;
    posts: MarketingPost[];
    totalPosts: number;
    createdAt: string | Date;
    postsPerWeek?: number;
    postTimes?: string[];
    topics?: string[];
    goals?: string[];
    channels?: string[];
    priorityProductService?: string;
    monthlyFocus?: string;
    promotions?: string;
    customerJourneyStage?: string;
    targetSegment?: string;
    strategySuggestion?: MarketingStrategySuggestion;
    notes?: string;
    useBrandSettings?: boolean;
    status?: 'active' | 'completed' | 'draft';
}

export interface MarketingPlanListItem {
    _id: string;
    campaignName: string;
    startDate: string;
    endDate: string;
    totalPosts: number;
    channels: string[];
    status: 'active' | 'completed' | 'draft';
    createdAt: string;
}

// =====================
// API Functions
// =====================

/**
 * Generate marketing plan with AI
 * Note: This endpoint has extended timeout due to AI processing time
 */
export async function generateMarketingPlan(data: MarketingPlanRequest): Promise<MarketingPlan> {
    // Extended timeout for AI generation (up to 2 minutes)
    const response = await api.post('/marketing-plan/generate', data, {
        timeout: 120000  // 120 seconds
    });
    return response.data.data;
}

/**
 * Suggest monthly marketing strategy mix
 */
export async function suggestMarketingStrategy(data: MarketingPlanRequest): Promise<MarketingStrategySuggestion> {
    const response = await api.post('/marketing-plan/suggest-strategy', data, {
        timeout: 120000,
    });
    return response.data.data;
}

/**
 * Get all marketing plans (with pagination)
 */
export async function getMarketingPlans(params?: {
    page?: number;
    limit?: number;
    status?: string;
}): Promise<{
    plans: MarketingPlanListItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
    const response = await api.get('/marketing-plan', { params });
    return response.data.data;
}

/**
 * Get marketing plan by ID
 */
export async function getMarketingPlanById(id: string): Promise<MarketingPlan> {
    const response = await api.get(`/marketing-plan/${id}`);
    return response.data.data;
}

/**
 * Delete marketing plan
 */
export async function deleteMarketingPlan(id: string): Promise<void> {
    await api.delete(`/marketing-plan/${id}`);
}

/**
 * Update marketing plan status
 */
export async function updateMarketingPlanStatus(
    id: string,
    status: 'active' | 'completed' | 'draft'
): Promise<MarketingPlan> {
    const response = await api.patch(`/marketing-plan/${id}/status`, { status });
    return response.data.data;
}
