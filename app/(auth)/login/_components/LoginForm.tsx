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
            router.push('/admin');
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
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-3 animate-scale-in">
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

            {/* Remember Me */}
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
                            ? 'bg-gradient-to-r from-[#F59E0B] to-[#EA580C] border-transparent'
                            : 'border-gray-300 group-hover:border-[#F59E0B]'
                            }`}>
                            {rememberMe && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                    </div>
                    <span className="text-sm text-[#71717A] group-hover:text-[#18181B] transition-colors">
                        Ghi nhớ đăng nhập
                    </span>
                </label>
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
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-sm text-amber-700 flex items-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                        <strong>Demo:</strong> Tài khoản <code className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">admin</code> / <code className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">admin</code>
                    </span>
                </p>
            </div>
        </form>
    );
}
