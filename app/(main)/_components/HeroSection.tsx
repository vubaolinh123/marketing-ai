'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';

const tools = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
        ),
        title: 'Bài viết AI',
        color: 'from-amber-500 to-orange-500',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        title: 'Ảnh AI',
        color: 'from-orange-500 to-red-500',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        title: 'Kế hoạch Marketing',
        color: 'from-yellow-500 to-amber-500',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        ),
        title: 'Kịch bản Video',
        color: 'from-red-500 to-pink-500',
    },
];

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--background)] via-[var(--background-secondary)] to-[var(--background)]">
            {/* Background Effects */}
            <div className="absolute inset-0">
                {/* Gradient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--color-primary-500)]/15 rounded-full blur-[150px] animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[var(--color-secondary-600)]/15 rounded-full blur-[150px] animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-primary-400)]/5 rounded-full blur-[100px]" />

                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px),
                             linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }}
                />

                {/* Radial Gradient Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_80%)]" />
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-[var(--color-primary-500)] opacity-40 animate-float"
                        style={{
                            left: `${10 + i * 12}%`,
                            top: `${15 + (i % 4) * 20}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${3 + i * 0.5}s`,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--background-card)] border border-[var(--border)] shadow-sm mb-8 animate-fade-in">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-[var(--foreground-muted)]">
                        ✨ Công cụ nội bộ Easy Marketing
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
                    <span className="text-[var(--foreground-muted)]">trong vài giây</span>
                </h1>

                {/* Subheading */}
                <p className="text-lg sm:text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto mb-12 animate-slide-up stagger-1">
                    Tạo bài viết, ảnh, kế hoạch marketing và kịch bản video chuyên nghiệp với sức mạnh của AI.
                </p>

                {/* CTA Button */}
                <div className="flex items-center justify-center gap-4 mb-16 animate-slide-up stagger-2">
                    <Link href="/login">
                        <Button variant="primary" size="lg" className="text-lg px-10 shadow-lg">
                            Bắt đầu ngay
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Button>
                    </Link>
                </div>

                {/* Tool Cards Preview */}
                <div className="animate-fade-in stagger-3">
                    <p className="text-sm text-[var(--foreground-muted)] mb-6">4 công cụ AI mạnh mẽ</p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {tools.map((tool, index) => (
                            <div
                                key={index}
                                className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-[var(--background-card)] border border-[var(--border)] shadow-sm hover:shadow-md hover:border-[var(--color-primary-500)]/30 transition-all duration-300"
                            >
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}>
                                    {tool.icon}
                                </div>
                                <span className="font-medium text-[var(--foreground)]">{tool.title}</span>
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
