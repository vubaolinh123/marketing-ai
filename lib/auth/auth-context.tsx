'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import type { User, AuthState, LoginCredentials } from '@/types';
import {
    authApi,
    adminUserApi,
    getToken,
    removeToken,
    getActAsUserId,
    setActAsUserId,
    clearActAsUserId
} from '@/lib/api';

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string; user?: User }>;
    logout: () => void;
    setImpersonation: (user: User | null) => void;
    refreshImpersonationTargets: (search?: string) => Promise<User[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'ai-content-auth';
const REFRESH_HINT_KEY = 'ai-content-refresh-hint';

type StoredAuthPayload = {
    user?: User | null;
    effectiveUser?: User | null;
};

function normalizeUserPayload(data?: {
    id?: string;
    _id?: string;
    name?: string;
    email?: string;
    avatar?: string;
    role?: 'admin' | 'user';
} | null): User | null {
    if (!data) return null;

    const id = data.id || data._id;
    if (!id) return null;

    return {
        id,
        name: data.name || '',
        email: data.email || '',
        avatar: data.avatar,
        role: data.role || 'user'
    };
}

function saveAuthToStorage(payload: StoredAuthPayload) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
}

function setRefreshHint() {
    localStorage.setItem(REFRESH_HINT_KEY, '1');
}

function hasRefreshHint(): boolean {
    return localStorage.getItem(REFRESH_HINT_KEY) === '1';
}

function clearRefreshHint() {
    localStorage.removeItem(REFRESH_HINT_KEY);
}

function readAuthFromStorage(): StoredAuthPayload {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return {};

    try {
        return JSON.parse(raw) as StoredAuthPayload;
    } catch {
        return {};
    }
}

function clearAuthStorage() {
    removeToken();
    clearActAsUserId();
    clearRefreshHint();
    localStorage.removeItem(AUTH_STORAGE_KEY);
}

function getErrorStatusCode(error: unknown): number | undefined {
    if (!error || typeof error !== 'object') return undefined;

    const withStatus = error as { statusCode?: number; response?: { status?: number } };
    if (typeof withStatus.statusCode === 'number') {
        return withStatus.statusCode;
    }

    if (typeof withStatus.response?.status === 'number') {
        return withStatus.response.status;
    }

    return undefined;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [state, setState] = useState<AuthState>({
        user: null,
        effectiveUser: null,
        isImpersonating: false,
        token: null,
        isAuthenticated: false,
        isLoading: true,
    });

    // Check for existing session on mount
    useEffect(() => {
        const checkAuth = async () => {
            let hadAuthBefore = false;

            const setUnauthenticatedState = () => {
                setState({
                    user: null,
                    effectiveUser: null,
                    isImpersonating: false,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
            };

            try {
                const token = getToken();
                const refreshHint = hasRefreshHint();
                hadAuthBefore = !!token || refreshHint;

                if (token) {
                    // Verify token by calling getMe API
                    const response = await authApi.getMe();

                    if (response.success && response.data) {
                        const user = normalizeUserPayload(response.data);
                        const savedAuth = readAuthFromStorage();

                        const apiEffective = normalizeUserPayload(response.data.effectiveUser);
                        let effectiveUser = apiEffective;

                        if (!effectiveUser) {
                            const actAsUserId = getActAsUserId();
                            if (actAsUserId && user?.role === 'admin') {
                                effectiveUser = savedAuth.effectiveUser && savedAuth.effectiveUser.id === actAsUserId
                                    ? savedAuth.effectiveUser
                                    : null;
                            }
                        }

                        const isImpersonating = !!effectiveUser && user?.role === 'admin';

                        saveAuthToStorage({ user, effectiveUser });
                        setRefreshHint();

                        if (!isImpersonating) {
                            clearActAsUserId();
                        }

                        setState({
                            user,
                            effectiveUser,
                            isImpersonating,
                            token,
                            isAuthenticated: true,
                            isLoading: false,
                        });
                        return;
                    }
                }

                if (!hadAuthBefore) {
                    setUnauthenticatedState();
                    return;
                }

                // Try refresh cookie when access token missing/expired
                const refreshResponse = await authApi.refresh();
                if (refreshResponse.success && refreshResponse.data) {
                    const user = normalizeUserPayload(refreshResponse.data.user);

                    if (!user) {
                        throw new Error('Phản hồi refresh không hợp lệ');
                    }

                    saveAuthToStorage({ user, effectiveUser: null });
                    setRefreshHint();

                    setState({
                        user,
                        effectiveUser: null,
                        isImpersonating: false,
                        token: refreshResponse.data.token,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    return;
                }

                clearAuthStorage();

                if (hadAuthBefore && typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                    router.push('/login');
                }
            } catch (error) {
                const statusCode = getErrorStatusCode(error);
                const isExpectedBootstrap401 = statusCode === 401;

                if (!isExpectedBootstrap401) {
                    console.error('Failed to verify auth:', error);
                }

                clearAuthStorage();

                if (hadAuthBefore && typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                    router.push('/login');
                }
            }

            setUnauthenticatedState();
        };

        checkAuth();
    }, [router]);

    const login = useCallback(
        async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string; user?: User }> => {
            setState((prev) => ({ ...prev, isLoading: true }));

            try {
                const response = await authApi.login({
                    email: credentials.email,
                    password: credentials.password,
                    rememberMe: !!credentials.rememberMe,
                    loginContext: credentials.loginContext
                });

                if (response.success && response.data) {
                    const user = normalizeUserPayload(response.data.user);

                    if (!user) {
                        throw new Error('Phản hồi đăng nhập không hợp lệ');
                    }

                    clearActAsUserId();
                    setRefreshHint();
                    saveAuthToStorage({ user, effectiveUser: null });

                    setState({
                        user,
                        effectiveUser: null,
                        isImpersonating: false,
                        token: response.data.token,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    return { success: true, user };
                }

                setState((prev) => ({ ...prev, isLoading: false }));
                return {
                    success: false,
                    error: response.message || 'Đăng nhập thất bại',
                };
            } catch (error: unknown) {
                setState((prev) => ({ ...prev, isLoading: false }));

                const apiError = error as { message?: string };
                return {
                    success: false,
                    error: apiError.message || 'Email hoặc mật khẩu không đúng',
                };
            }
        },
        []
    );

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearAuthStorage();
            setState({
                user: null,
                effectiveUser: null,
                isImpersonating: false,
                token: null,
                isAuthenticated: false,
                isLoading: false,
            });
            router.push('/login');
        }
    }, [router]);

    const setImpersonation = useCallback((user: User | null) => {
        setState((prev) => {
            if (!prev.user || prev.user.role !== 'admin') {
                return prev;
            }

            const nextIsImpersonating = !!user;
            if (nextIsImpersonating) {
                setActAsUserId(user.id);
            } else {
                clearActAsUserId();
            }

            const nextState: AuthState = {
                ...prev,
                effectiveUser: user,
                isImpersonating: nextIsImpersonating
            };

            saveAuthToStorage({
                user: prev.user,
                effectiveUser: user
            });

            return nextState;
        });
    }, []);

    const refreshImpersonationTargets = useCallback(async (search = ''): Promise<User[]> => {
        const response = await adminUserApi.getImpersonationTargets(search, 20);
        const targets = Array.isArray(response.data) ? response.data : [];

        return targets.map((item) => ({
            id: item.id,
            name: item.name,
            email: item.email,
            avatar: item.avatar,
            role: item.role,
            isActive: item.isActive,
            createdAt: item.createdAt ? new Date(item.createdAt) : undefined
        }));
    }, []);

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                logout,
                setImpersonation,
                refreshImpersonationTargets,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
