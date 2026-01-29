import api, { ApiResponse, setToken, removeToken } from './api';

// Auth response types
export interface AuthUser {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'user' | 'admin';
}

export interface LoginResponse {
    token: string;
    user: AuthUser;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

// Auth API service
export const authApi = {
    /**
     * Register a new user
     */
    async register(data: RegisterData): Promise<ApiResponse<LoginResponse>> {
        const response = await api.post<ApiResponse<LoginResponse>>('/auth/register', data);
        if (response.data.success && response.data.data.token) {
            setToken(response.data.data.token);
        }
        return response.data;
    },

    /**
     * Login user
     */
    async login(data: LoginData): Promise<ApiResponse<LoginResponse>> {
        const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', data);
        if (response.data.success && response.data.data.token) {
            setToken(response.data.data.token);
        }
        return response.data;
    },

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        try {
            await api.post('/auth/logout');
        } finally {
            removeToken();
        }
    },

    /**
     * Get current user info
     */
    async getMe(): Promise<ApiResponse<AuthUser>> {
        const response = await api.get<ApiResponse<AuthUser>>('/auth/me');
        return response.data;
    },
};

export default authApi;
