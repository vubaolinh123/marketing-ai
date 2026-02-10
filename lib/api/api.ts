import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Token storage key
const TOKEN_KEY = 'auth_token';

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

// Create axios instance
const api: AxiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api`,
    // Keep a safe default for normal APIs; heavy AI endpoints should override per-request timeout.
    timeout: 60000,
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

        // Log error in development - more detailed
        if (process.env.NODE_ENV === 'development') {
            console.error(`❌ Error ${status}:`, message);
            console.error('   Full error:', {
                code: error.code,
                message: error.message,
                response: error.response?.data,
                timeout: error.config?.timeout,
                request: error.request ? 'Request was made but no response received' : 'Request setup error'
            });
        }

        // Handle specific error codes
        switch (status) {
            case 401:
                // Unauthorized - Clear token and redirect to login
                removeToken();
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
