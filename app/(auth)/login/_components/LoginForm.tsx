'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Button, Input } from '@/components/ui';

export default function LoginForm() {
    const router = useRouter();
    const { login, isLoading } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const result = await login(formData);

        if (result.success) {
            router.push('/');
        } else {
            setError(result.error || 'Đã xảy ra lỗi');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-scale-in">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}

            {/* Username Input */}
            <Input
                name="username"
                label="Tên đăng nhập"
                placeholder="Nhập tên đăng nhập"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
                leftIcon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                }
                autoComplete="username"
                required
            />

            {/* Password Input */}
            <Input
                name="password"
                type="password"
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                leftIcon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                }
                autoComplete="current-password"
                required
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${rememberMe
                                ? 'bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-600)] border-transparent'
                                : 'border-[var(--border)] group-hover:border-[var(--color-primary-500)]'
                            }`}>
                            {rememberMe && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                    </div>
                    <span className="text-sm text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] transition-colors">
                        Ghi nhớ đăng nhập
                    </span>
                </label>
                <a
                    href="#"
                    className="text-sm text-[var(--color-primary-500)] hover:text-[var(--color-primary-400)] transition-colors"
                >
                    Quên mật khẩu?
                </a>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
            >
                Đăng nhập
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </Button>

            {/* Demo credentials hint */}
            <div className="p-4 rounded-xl bg-[var(--color-primary-500)]/10 border border-[var(--color-primary-500)]/20">
                <p className="text-sm text-[var(--color-primary-400)] flex items-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                        <strong>Demo:</strong> Sử dụng tài khoản <code className="px-1.5 py-0.5 rounded bg-[var(--color-primary-500)]/20">admin</code> / <code className="px-1.5 py-0.5 rounded bg-[var(--color-primary-500)]/20">admin</code>
                    </span>
                </p>
            </div>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--border)]" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-[var(--background-card)] text-[var(--foreground-muted)]">
                        hoặc đăng nhập với
                    </span>
                </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4">
                <Button type="button" variant="secondary" size="md" className="w-full">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                </Button>
                <Button type="button" variant="secondary" size="md" className="w-full">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                </Button>
            </div>
        </form>
    );
}
