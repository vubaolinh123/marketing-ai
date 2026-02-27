import api, { ApiResponse, setToken, removeToken } from './api';
import type { LoginContext, LoginGeoPermissionState, LoginBrowserGeo, LoginDeviceMeta } from '@/types';

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
    loginContext?: LoginContext;
}

export interface AuthSessionItem {
    id?: string;
    _id?: string;
    sessionId?: string;
    device?: string;
    deviceName?: string;
    userAgent?: string;
    ip?: string;
    ipAddress?: string;
    location?: string;
    current?: boolean;
    isCurrent?: boolean;
    revokedAt?: string | null;
    isRevoked?: boolean;
    lastUsedAt?: string;
    lastActiveAt?: string;
    createdAt?: string;
    geoPermissionState?: LoginGeoPermissionState;
    browserGeo?: LoginBrowserGeo;
    deviceMeta?: LoginDeviceMeta;
}

export interface AuthSessionsData {
    activeSessions?: AuthSessionItem[];
    sessions?: AuthSessionItem[];
    loginHistory?: AuthSessionItem[];
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

    async getSessions(): Promise<ApiResponse<AuthSessionsData>> {
        const response = await api.get<ApiResponse<AuthSessionsData>>('/auth/sessions');
        return response.data;
    },

    async revokeSession(sessionId: string): Promise<ApiResponse<{ sessionId?: string; revoked?: boolean } | null>> {
        const response = await api.post<ApiResponse<{ sessionId?: string; revoked?: boolean } | null>>(`/auth/sessions/${sessionId}/revoke`);
        return response.data;
    },

    async revokeOtherSessions(): Promise<ApiResponse<{ revokedCount?: number } | null>> {
        const response = await api.post<ApiResponse<{ revokedCount?: number } | null>>('/auth/sessions/revoke-others');
        return response.data;
    },
};

export default authApi;
