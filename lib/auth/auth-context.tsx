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
import { authApi, getToken, removeToken } from '@/lib/api';

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'ai-content-auth';

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [state, setState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
    });

    // Check for existing session on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = getToken();

                if (token) {
                    // Verify token by calling getMe API
                    const response = await authApi.getMe();

                    if (response.success && response.data) {
                        const user: User = {
                            id: response.data.id,
                            name: response.data.name,
                            email: response.data.email,
                            avatar: response.data.avatar,
                            role: response.data.role,
                        };

                        // Save to localStorage for persistence
                        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user }));

                        setState({
                            user,
                            token,
                            isAuthenticated: true,
                            isLoading: false,
                        });
                        return;
                    }
                }
            } catch (error) {
                console.error('Failed to verify auth:', error);
                // Clear invalid token
                removeToken();
                localStorage.removeItem(AUTH_STORAGE_KEY);
            }

            setState({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
            });
        };

        checkAuth();
    }, []);

    const login = useCallback(
        async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
            setState((prev) => ({ ...prev, isLoading: true }));

            try {
                const response = await authApi.login({
                    email: credentials.email,
                    password: credentials.password,
                });

                if (response.success && response.data) {
                    const user: User = {
                        id: response.data.user.id,
                        name: response.data.user.name,
                        email: response.data.user.email,
                        avatar: response.data.user.avatar,
                        role: response.data.user.role,
                    };

                    // Save user to localStorage
                    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user }));

                    setState({
                        user,
                        token: response.data.token,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    return { success: true };
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
            localStorage.removeItem(AUTH_STORAGE_KEY);
            setState({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
            });
            router.push('/login');
        }
    }, [router]);

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                logout,
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
