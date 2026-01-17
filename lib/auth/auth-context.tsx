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

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fake credentials for demo
const FAKE_CREDENTIALS = {
    username: 'admin',
    password: 'admin',
};

// Fake user data
const FAKE_USER: User = {
    id: '1',
    username: 'admin',
    email: 'admin@aicontent.vn',
    companyName: 'AI Content Generator',
    customPrompt: 'Bạn là trợ lý AI chuyên nghiệp trong lĩnh vực marketing...',
    createdAt: new Date(),
};

const AUTH_STORAGE_KEY = 'ai-content-auth';

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    // Check for existing session on mount
    useEffect(() => {
        const checkAuth = () => {
            try {
                const stored = localStorage.getItem(AUTH_STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed.user) {
                        setState({
                            user: parsed.user,
                            isAuthenticated: true,
                            isLoading: false,
                        });
                        return;
                    }
                }
            } catch (error) {
                console.error('Failed to parse auth state:', error);
                localStorage.removeItem(AUTH_STORAGE_KEY);
            }

            setState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
        };

        checkAuth();
    }, []);

    const login = useCallback(
        async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
            setState((prev) => ({ ...prev, isLoading: true }));

            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Check credentials
            if (
                credentials.username === FAKE_CREDENTIALS.username &&
                credentials.password === FAKE_CREDENTIALS.password
            ) {
                const authData = { user: FAKE_USER };
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));

                setState({
                    user: FAKE_USER,
                    isAuthenticated: true,
                    isLoading: false,
                });

                return { success: true };
            }

            setState((prev) => ({ ...prev, isLoading: false }));
            return {
                success: false,
                error: 'Tên đăng nhập hoặc mật khẩu không đúng',
            };
        },
        []
    );

    const logout = useCallback(() => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        });
        router.push('/login');
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
