'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';

export default function HeroSection() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                {/* Gradient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-primary-500)]/20 rounded-full blur-[120px] animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-secondary-600)]/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-primary-500)]/5 rounded-full blur-[100px]" />

                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px),
                             linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
                        backgroundSize: '80px 80px',
                    }}
                />

                {/* Radial Gradient Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_70%)]" />
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute w-2 h-2 rounded-full bg-[var(--color-primary-${400 + (i % 3) * 100})] opacity-60 animate-float`}
                        style={{
                            left: `${15 + i * 15}%`,
                            top: `${20 + (i % 3) * 25}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${3 + i * 0.5}s`,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--background-card)] border border-[var(--border)] mb-8 animate-fade-in">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-[var(--foreground-muted)]">
                        🚀 Phiên bản 2.0 - Nâng cấp AI mạnh mẽ hơn
                    </span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--foreground)] mb-6 animate-slide-up">
                    Tạo nội dung{' '}
                    <span className="relative inline-block">
                        <span className="gradient-text">Marketing AI</span>
                        <svg className="absolute -bottom-2 left-0 w-full h-3 text-[var(--color-primary-500)]/30" viewBox="0 0 200 12" preserveAspectRatio="none">
                            <path d="M0 6 Q 50 12 100 6 Q 150 0 200 6" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                    </span>
                    <br />
                    <span className="text-[var(--foreground-muted)]">chỉ trong vài giây</span>
                </h1>

                {/* Subheading */}
                <p className="text-lg sm:text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto mb-10 animate-slide-up stagger-1">
                    Nền tảng AI hàng đầu giúp doanh nghiệp tự động tạo bài viết, ảnh,
                    kế hoạch marketing và kịch bản video chuyên nghiệp.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up stagger-2">
                    <Link href="/login">
                        <Button variant="primary" size="lg" className="text-lg px-8">
                            Bắt đầu miễn phí
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Button>
                    </Link>
                    <Button variant="secondary" size="lg" className="text-lg px-8">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Xem Demo
                    </Button>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 animate-fade-in stagger-3">
                    <div className="text-center">
                        <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">10,000+</div>
                        <div className="text-sm text-[var(--foreground-muted)]">Doanh nghiệp tin dùng</div>
                    </div>
                    <div className="hidden sm:block w-px h-12 bg-[var(--border)]" />
                    <div className="text-center">
                        <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">1M+</div>
                        <div className="text-sm text-[var(--foreground-muted)]">Nội dung đã tạo</div>
                    </div>
                    <div className="hidden sm:block w-px h-12 bg-[var(--border)]" />
                    <div className="text-center">
                        <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">99.9%</div>
                        <div className="text-sm text-[var(--foreground-muted)]">Uptime đảm bảo</div>
                    </div>
                </div>

                {/* Trust Logos */}
                <div className="mt-16 pt-16 border-t border-[var(--border)] animate-fade-in stagger-4">
                    <p className="text-sm text-[var(--foreground-muted)] mb-8">
                        Được tin tưởng bởi các thương hiệu hàng đầu
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-50">
                        {['VTV', 'Vingroup', 'FPT', 'Viettel', 'VNPT'].map((brand) => (
                            <div
                                key={brand}
                                className="text-xl font-bold text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                            >
                                {brand}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 rounded-full border-2 border-[var(--border)] flex items-start justify-center p-2">
                    <div className="w-1 h-2 bg-[var(--color-primary-500)] rounded-full animate-pulse" />
                </div>
            </div>
        </section>
    );
}
