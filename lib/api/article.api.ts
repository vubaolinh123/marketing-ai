/**
 * Article API
 * Frontend API functions for article generation and management
 */

import api from './api';

export interface ArticleFormData {
    topic: string;
    purpose: string;
    wordCount: number;
    description: string;
}

export interface GenerateArticleRequest {
    mode: 'manual' | 'ai_image';
    topic: string;
    purpose: string;
    wordCount: number;
    description: string;
    imageUrl?: string;
    imageUrls?: string[];
    useBrandSettings?: boolean;
    writingStyle?: 'sales' | 'lifestyle' | 'technical' | 'balanced';
    storytellingDepth?: 'low' | 'medium' | 'high';
    baseTitle?: string;
    baseContent?: string;
    regenerateInstruction?: string;
}

export interface GeneratedArticle {
    title: string;
    content: string;
    hashtags: string[];
    imageUrl?: string;
    imageUrls?: string[];
    imagePrompt?: string;
}

export interface Article extends GeneratedArticle {
    _id: string;
    userId: string;
    topic: string;
    purpose: string;
    imageUrls?: string[];
    status: 'processing' | 'failed' | 'draft' | 'published';
    createdAt: string;
    updatedAt: string;
}

/**
 * Generate article with AI (preview only, not saved)
 */
export async function generateArticle(data: GenerateArticleRequest): Promise<GeneratedArticle> {
    const response = await api.post('/ai/generate-article', data);
    return response.data.data;
}

/**
 * Generate and save article to database
 */
export async function generateAndSaveArticle(data: GenerateArticleRequest): Promise<{ article: Article; generated: GeneratedArticle }> {
    const response = await api.post('/ai/generate-and-save', data);
    return response.data.data;
}

/**
 * Get all articles (with pagination)
 */
export async function getArticles(params?: {
    page?: number;
    limit?: number;
    topic?: string;
    purpose?: string;
    status?: string;
    search?: string;
}): Promise<{ articles: Article[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
    const response = await api.get('/articles', { params });
    return response.data.data;
}

/**
 * Get single article by ID
 */
export async function getArticle(id: string): Promise<Article> {
    const response = await api.get(`/articles/${id}`);
    return response.data.data;
}

/**
 * Update article
 */
export async function updateArticle(id: string, data: Partial<Article>): Promise<Article> {
    const response = await api.put(`/articles/${id}`, data);
    return response.data.data;
}

/**
 * Delete article
 */
export async function deleteArticle(id: string): Promise<void> {
    await api.delete(`/articles/${id}`);
}

/**
 * Save generated article (create new)
 */
export async function saveArticle(data: {
    title: string;
    content: string;
    topic: string;
    purpose: string;
    imageUrl?: string;
    imageUrls?: string[];
    hashtags?: string[];
    status?: 'processing' | 'failed' | 'draft' | 'published';
}): Promise<Article> {
    const response = await api.post('/articles', data);
    return response.data.data;
}
