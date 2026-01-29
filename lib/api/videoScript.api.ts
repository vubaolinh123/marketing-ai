import api, { ApiResponse } from './api';

// Types
export interface VideoScriptInput {
    title: string;
    duration?: string;
    sceneCount?: number;
    size?: string;
    hasVoiceOver?: boolean;
    otherRequirements?: string;
    ideaMode?: 'manual' | 'ai';
    customIdea?: string;
    useBrandSettings?: boolean;
}

export interface SceneItem {
    sceneNumber: number;
    location: string;
    shotType: string;
    description: string;
    voiceOver: string;
    source: string;
    note: string;
}

export interface VideoScript {
    _id: string;
    userId: string;
    title: string;
    duration: string;
    size: string;
    hasVoiceOver: boolean;
    summary: string;
    scenes: SceneItem[];
    otherRequirements: string;
    ideaMode: 'manual' | 'ai';
    status: 'draft' | 'completed';
    sceneCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface VideoScriptListItem {
    _id: string;
    title: string;
    duration: string;
    size: string;
    summary: string;
    sceneCount: number;
    status: string;
    createdAt: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Generated idea structure from AI
export interface GeneratedIdea {
    hook: string;
    mainContent: string;
    callToAction: string;
    mood: string;
    summary: string;
}

// Input for generate idea
export interface GenerateIdeaInput {
    title: string;
    duration?: string;
    sceneCount?: number;
    useBrandSettings: boolean;
}

// API functions
export const videoScriptApi = {
    /**
     * Generate video script with AI
     */
    async generate(input: VideoScriptInput): Promise<ApiResponse<VideoScript>> {
        const response = await api.post<ApiResponse<VideoScript>>('/video-scripts/generate', input);
        return response.data;
    },

    /**
     * Generate video idea with AI
     */
    async generateIdea(input: GenerateIdeaInput): Promise<ApiResponse<GeneratedIdea>> {
        const response = await api.post<ApiResponse<GeneratedIdea>>('/video-scripts/generate-idea', input);
        return response.data;
    },

    /**
     * Get all scripts for current user
     */
    async getAll(params?: {
        page?: number;
        limit?: number;
        search?: string;
        duration?: string;
        size?: string;
    }): Promise<PaginatedResponse<VideoScriptListItem>> {
        const response = await api.get<PaginatedResponse<VideoScriptListItem>>('/video-scripts', { params });
        return response.data;
    },

    /**
     * Get single script by ID
     */
    async getById(id: string): Promise<ApiResponse<VideoScript>> {
        const response = await api.get<ApiResponse<VideoScript>>(`/video-scripts/${id}`);
        return response.data;
    },

    /**
     * Update script
     */
    async update(id: string, data: Partial<VideoScript>): Promise<ApiResponse<VideoScript>> {
        const response = await api.put<ApiResponse<VideoScript>>(`/video-scripts/${id}`, data);
        return response.data;
    },

    /**
     * Delete script
     */
    async delete(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`/video-scripts/${id}`);
        return response.data;
    },

    /**
     * Export script to Excel - triggers download
     */
    async exportToExcel(id: string): Promise<void> {
        const response = await api.get(`/video-scripts/${id}/export-excel`, {
            responseType: 'blob'
        });

        // Create download link
        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // Get filename from header or use default
        const contentDisposition = response.headers['content-disposition'];
        let filename = `kich-ban-${Date.now()}.xlsx`;
        if (contentDisposition) {
            const match = contentDisposition.match(/filename="?(.+)"?/);
            if (match) filename = decodeURIComponent(match[1]);
        }

        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }
};

export default videoScriptApi;
