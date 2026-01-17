import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { Metadata } from 'next';

const LoginForm = dynamic(() => import('./_components/LoginForm'), {
    ssr: false,
    loading: () => (
        <div className="space-y-6 animate-pulse">
            <div className="h-12 bg-[var(--background-card)] rounded-xl" />
            <div className="h-12 bg-[var(--background-card)] rounded-xl" />
            <div className="h-12 bg-[var(--background-card)] rounded-xl" />
        </div>
    ),
});

const LoginHero = dynamic(() => import('./_components/LoginHero'), {
    ssr: true,
});

export const metadata: Metadata = {
    title: 'Đăng nhập | AI Content Generator',
    description: 'Đăng nhập vào AI Content Generator để bắt đầu tạo nội dung thông minh với AI.',
};

export default function LoginPage() {
    return (
        <div className="min-h-screen flex">
            {/* Left Side - Hero */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-[var(--background-secondary)]">
                <LoginHero />
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-secondary-600)] flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-[var(--foreground)]">
                                AI<span className="gradient-text">Content</span>
                            </span>
                        </Link>
                    </div>

                    {/* Form Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-2">
                            Chào mừng trở lại 👋
                        </h2>
                        <p className="text-[var(--foreground-muted)]">
                            Đăng nhập để tiếp tục tạo nội dung tuyệt vời
                        </p>
                    </div>

                    {/* Login Form */}
                    <LoginForm />

                    {/* Sign Up Link */}
                    <p className="mt-8 text-center text-[var(--foreground-muted)]">
                        Chưa có tài khoản?{' '}
                        <Link
                            href="/register"
                            className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-400)] font-medium transition-colors"
                        >
                            Đăng ký ngay
                        </Link>
                    </p>

                    {/* Back to Home */}
                    <Link
                        href="/"
                        className="mt-6 flex items-center justify-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Quay lại trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
}
