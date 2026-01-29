/**
 * Upload API
 * Frontend API functions for file uploads
 */

import api from './api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface UploadedFile {
    filename: string;
    originalname: string;
    url: string;
    size: number;
    mimetype: string;
}

export type UploadFolder = 'general' | 'articles' | 'ai-images';

/**
 * Upload single image
 */
export async function uploadImage(file: File, folder: UploadFolder = 'general'): Promise<UploadedFile> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post(`/upload/image/${folder}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data.data;
}

/**
 * Upload multiple images
 */
export async function uploadImages(files: File[], folder: UploadFolder = 'general'): Promise<{ files: UploadedFile[]; count: number }> {
    const formData = new FormData();
    files.forEach(file => {
        formData.append('images', file);
    });

    const response = await api.post(`/upload/images/${folder}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data.data;
}

/**
 * Delete image
 */
export async function deleteImage(filename: string, folder: UploadFolder = 'general'): Promise<void> {
    await api.delete(`/upload/image/${folder}/${filename}`);
}

/**
 * Get full URL for uploaded image
 */
export function getImageUrl(path: string): string {
    if (path.startsWith('http')) {
        return path;
    }
    return `${API_BASE_URL}${path}`;
}

/**
 * Get available upload folders
 */
export async function getUploadFolders(): Promise<{ folders: string[]; paths: Record<string, string> }> {
    const response = await api.get('/upload/folders');
    return response.data.data;
}
