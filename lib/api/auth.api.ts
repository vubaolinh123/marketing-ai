import api, { ApiResponse, setToken, removeToken } from './api';

// Auth response types
export interface AuthUser {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'user' | 'admin';
}

export interface AuthMeResponse extends AuthUser {
    effectiveUser?: AuthUser | null;
    isImpersonating?: boolean;
}

export interface LoginResponse {
    token: string;
    expiresIn?: number;
    rememberMe?: boolean;
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
    rememberMe?: boolean;
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
     * Refresh access token via httpOnly refresh cookie
     */
    async refresh(): Promise<ApiResponse<LoginResponse>> {
        const response = await api.post<ApiResponse<LoginResponse>>('/auth/refresh');
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
     * Logout all active sessions
     */
    async logoutAll(): Promise<void> {
        try {
            await api.post('/auth/logout-all');
        } finally {
            removeToken();
        }
    },

    /**
     * Get current user info
     */
    async getMe(): Promise<ApiResponse<AuthMeResponse>> {
        const response = await api.get<ApiResponse<AuthMeResponse>>('/auth/me');
        return response.data;
    },
};

export default authApi;
