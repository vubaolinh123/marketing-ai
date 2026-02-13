/**
 * Product Image API
 * Client for product image generation endpoints
 */

import api from './api';

export interface ProductImageInput {
    originalImageUrl: string;
    backgroundType: string;
    cameraAngles?: string[];
    customBackground?: string;
    useLogo?: boolean;
    logoPosition?: string;
    outputSize?: string;
    additionalNotes?: string;
    useBrandSettings?: boolean;
    title?: string;
    usagePurpose?: string;
    displayInfo?: string;
    adIntensity?: string;
    typographyGuidance?: string;
    targetAudience?: string;
    visualStyle?: string;
    realismPriority?: string;
}

export interface ProductImage {
    generatedImages?: Array<{
        angle: string;
        imageUrl: string;
        status?: 'processing' | 'completed' | 'failed';
        errorMessage?: string;
    }>;
    _id: string;
    id: string;
    userId: string;
    title: string;
    originalImageUrl: string;
    generatedImageUrl: string;
    cameraAngles?: string[];
    backgroundType: string;
    customBackground: string;
    useLogo: boolean;
    logoPosition: string;
    outputSize: string;
    additionalNotes: string;
    usedBrandSettings: boolean;
    status: 'processing' | 'completed' | 'failed';
    errorMessage?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProductImageListResponse {
    success: boolean;
    data: ProductImage[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ProductImageResponse {
    success: boolean;
    message?: string;
    data: ProductImage;
}

export interface ProductImageListParams {
    page?: number;
    limit?: number;
    search?: string;
    backgroundType?: string;
    status?: string;
}

export const productImageApi = {
    /**
     * Generate a new product image with AI
     */
    generate: async (input: ProductImageInput): Promise<ProductImageResponse> => {
        const response = await api.post('/product-images/generate', input, {
            // Multi-angle generation can take significantly longer than default API timeout.
            timeout: 300000, // 5 minutes
        });
        return response.data;
    },

    /**
     * Regenerate an existing product image (same input, new result)
     */
    regenerate: async (id: string): Promise<ProductImageResponse> => {
        const response = await api.post(`/product-images/${id}/regenerate`, undefined, {
            timeout: 300000, // 5 minutes
        });
        return response.data;
    },

    /**
     * Get all product images for current user
     */
    getAll: async (params?: ProductImageListParams): Promise<ProductImageListResponse> => {
        const response = await api.get('/product-images', { params });
        return response.data;
    },

    /**
     * Get a single product image by ID
     */
    getById: async (id: string): Promise<ProductImageResponse> => {
        const response = await api.get(`/product-images/${id}`);
        return response.data;
    },

    /**
     * Delete a product image
     */
    delete: async (id: string): Promise<{ success: boolean; message: string }> => {
        const response = await api.delete(`/product-images/${id}`);
        return response.data;
    }
};
