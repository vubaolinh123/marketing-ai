import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Token storage key
const TOKEN_KEY = 'auth_token';
const ACT_AS_USER_KEY = 'act_as_user_id';

const ACT_AS_ALLOWED_PREFIXES = [
    '/ai-settings',
    '/articles',
    '/upload',
    '/ai',
    '/video-scripts',
    '/product-images',
    '/marketing-plan'
];

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api`;

const refreshClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// API Error interface
export interface ApiError {
    success: false;
    message: string;
    statusCode?: number;
}

// API Response interface
export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data: T;
}

// Get token from localStorage
export const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
};

// Set token to localStorage
export const setToken = (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
};

// Remove token from localStorage
export const removeToken = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
};

export const getActAsUserId = (): string | null => {
    if (typeof window === 'undefined') return null;
    const value = localStorage.getItem(ACT_AS_USER_KEY);
    return value && value.trim() ? value.trim() : null;
};

export const setActAsUserId = (userId: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACT_AS_USER_KEY, userId);
};

export const clearActAsUserId = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACT_AS_USER_KEY);
};

const shouldSkipAuthRefresh = (url?: string): boolean => {
    if (!url) return false;
    return url.includes('/auth/login') ||
        url.includes('/auth/register') ||
        url.includes('/auth/refresh') ||
        url.includes('/auth/logout');
};

const isAuthRefreshRequest = (url?: string): boolean => {
    if (!url) return false;
    return url.includes('/auth/refresh');
};

const shouldAttachActAsHeader = (url?: string): boolean => {
    if (!url) return false;

    const normalizedUrl = url.startsWith('/api') ? url.slice(4) : url;
    return ACT_AS_ALLOWED_PREFIXES.some((prefix) => normalizedUrl.startsWith(prefix));
};

const requestNewAccessToken = async (): Promise<string | null> => {
    try {
        const response = await refreshClient.post<ApiResponse<{ token?: string }>>('/auth/refresh');
        return response.data?.data?.token || null;
    } catch {
        return null;
    }
};

// Create axios instance
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    // Keep a safe default for normal APIs; heavy AI endpoints should override per-request timeout.
    timeout: 60000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        const actAsUserId = getActAsUserId();
        if (actAsUserId && config.headers && shouldAttachActAsHeader(config.url)) {
            config.headers['X-Act-As-User'] = actAsUserId;
        }

        // Log request in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
            console.log(`   Token: ${token ? 'Yes (' + token.substring(0, 20) + '...)' : 'No'}`);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
    (response) => {
        // Log response in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
        }
        return response;
    },
    (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
        const status = error.response?.status;
        let message = error.response?.data?.message || 'Đã xảy ra lỗi';

        // Axios timeout/network cases often have no response payload.
        if (!error.response) {
            const rawMessage = (error.message || '').toLowerCase();
            if (error.code === 'ECONNABORTED' || rawMessage.includes('timeout')) {
                message = 'Yêu cầu xử lý quá thời gian. Hệ thống có thể vẫn đang tạo ảnh, vui lòng chờ thêm và thử lại.';
            } else if (error.message) {
                message = error.message;
            }
        }

        const isRefresh401 = status === 401 && isAuthRefreshRequest(originalRequest?.url);

        // Log error in development - more detailed
        if (process.env.NODE_ENV === 'development' && !isRefresh401) {
            console.error(`❌ Error ${status}:`, message);
            console.error('   Full error:', {
                code: error.code,
                message: error.message,
                response: error.response?.data,
                timeout: error.config?.timeout,
                request: error.request ? 'Request was made but no response received' : 'Request setup error'
            });
        }

        // Try refresh flow once when access token expired
        if (
            status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !shouldSkipAuthRefresh(originalRequest.url) &&
            !!getToken()
        ) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                refreshPromise = requestNewAccessToken()
                    .finally(() => {
                        isRefreshing = false;
                    });
            }

            return (refreshPromise || Promise.resolve(null)).then((newToken) => {
                if (newToken && originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }

                removeToken();
                clearActAsUserId();

                if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }

                return Promise.reject({
                    success: false,
                    message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
                    statusCode: 401,
                } as ApiError);
            });
        }

        // Handle specific error codes
        switch (status) {
            case 401:
                if (isAuthRefreshRequest(originalRequest?.url)) {
                    break;
                }

                // Unauthorized - Clear token and redirect to login
                removeToken();
                clearActAsUserId();
                if (typeof window !== 'undefined') {
                    // Don't redirect if already on login page
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login';
                    }
                }
                break;

            case 403:
                // Forbidden - No permission
                console.error('Không có quyền truy cập');
                break;

            case 404:
                // Not found
                console.error('Không tìm thấy tài nguyên');
                break;

            case 500:
                // Server error
                console.error('Lỗi server');
                break;
        }

        return Promise.reject({
            success: false,
            message,
            statusCode: status,
        } as ApiError);
    }
);

export default api;
