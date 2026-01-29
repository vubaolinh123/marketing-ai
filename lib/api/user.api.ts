import api, { ApiResponse } from './api';
import { AuthUser } from './auth.api';

export interface UpdateProfileData {
    name?: string;
    avatar?: string;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

// User API service
export const userApi = {
    /**
     * Get user profile
     */
    async getProfile(): Promise<ApiResponse<AuthUser>> {
        const response = await api.get<ApiResponse<AuthUser>>('/users/profile');
        return response.data;
    },

    /**
     * Update user profile
     */
    async updateProfile(data: UpdateProfileData): Promise<ApiResponse<AuthUser>> {
        const response = await api.put<ApiResponse<AuthUser>>('/users/profile', data);
        return response.data;
    },

    /**
     * Change password
     */
    async changePassword(data: ChangePasswordData): Promise<ApiResponse<null>> {
        const response = await api.put<ApiResponse<null>>('/users/change-password', data);
        return response.data;
    },
};

export default userApi;
