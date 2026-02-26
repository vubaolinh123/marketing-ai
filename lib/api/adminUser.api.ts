import api, { ApiResponse } from './api';

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'admin' | 'user';
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface AdminUsersQuery {
    page?: number;
    limit?: number;
    role?: '' | 'admin' | 'user';
    status?: '' | 'active' | 'inactive';
    search?: string;
}

export interface AdminUsersListData {
    users: AdminUser[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    stats: {
        total: number;
        active: number;
        inactive: number;
        admins: number;
    };
}

export interface CreateAdminUserPayload {
    name: string;
    email: string;
    password: string;
    role?: 'admin' | 'user';
    isActive?: boolean;
}

export interface UpdateAdminUserPayload {
    name?: string;
    role?: 'admin' | 'user';
    isActive?: boolean;
}

export const adminUserApi = {
    async listUsers(params?: AdminUsersQuery): Promise<ApiResponse<AdminUsersListData>> {
        const response = await api.get<ApiResponse<AdminUsersListData>>('/admin/users', { params });
        return response.data;
    },

    async createUser(payload: CreateAdminUserPayload): Promise<ApiResponse<AdminUser>> {
        const response = await api.post<ApiResponse<AdminUser>>('/admin/users', payload);
        return response.data;
    },

    async updateUser(userId: string, payload: UpdateAdminUserPayload): Promise<ApiResponse<AdminUser>> {
        const response = await api.patch<ApiResponse<AdminUser>>(`/admin/users/${userId}`, payload);
        return response.data;
    },

    async deleteUser(userId: string): Promise<ApiResponse<null>> {
        const response = await api.delete<ApiResponse<null>>(`/admin/users/${userId}`);
        return response.data;
    },

    async resetUserPassword(userId: string, newPassword: string): Promise<ApiResponse<null>> {
        const response = await api.patch<ApiResponse<null>>(`/admin/users/${userId}/password`, { newPassword });
        return response.data;
    },

    async getImpersonationTargets(search = '', limit = 20): Promise<ApiResponse<AdminUser[]>> {
        const response = await api.get<ApiResponse<AdminUser[]>>('/admin/impersonation-targets', {
            params: { search, limit }
        });
        return response.data;
    }
};

export default adminUserApi;
