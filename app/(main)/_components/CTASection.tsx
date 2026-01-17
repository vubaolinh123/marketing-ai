'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';

export default function CTASection() {
    return (
        <section className="relative py-24 lg:py-32 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary-500)]/10 via-transparent to-[var(--color-secondary-600)]/10" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-primary-500)]/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-secondary-600)]/20 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-secondary-600)] p-8 md:p-12 lg:p-16">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-3xl" />

                    {/* Grid Pattern */}
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `linear-gradient(white 1px, transparent 1px),
                               linear-gradient(90deg, white 1px, transparent 1px)`,
                            backgroundSize: '40px 40px',
                        }}
                    />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                        {/* Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                                Sẵn sàng bắt đầu với{' '}
                                <span className="text-white/90">AI Content?</span>
                            </h2>
                            <p className="text-lg text-white/80 max-w-xl">
                                Tham gia cùng 10,000+ doanh nghiệp đang sử dụng AI Content Generator
                                để tạo nội dung marketing chuyên nghiệp.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/login">
                                <Button
                                    size="lg"
                                    className="bg-white text-[var(--color-primary-600)] hover:bg-white/90 hover:shadow-xl px-8 text-lg font-semibold"
                                >
                                    Dùng thử miễn phí
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="lg"
                                className="text-white hover:bg-white/10 border border-white/20 px-8 text-lg"
                            >
                                Liên hệ tư vấn
                            </Button>
                        </div>
                    </div>

                    {/* Bottom Stats */}
                    <div className="relative z-10 mt-12 pt-8 border-t border-white/20 grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">Miễn phí</div>
                            <div className="text-sm text-white/70">Dùng thử 14 ngày</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">24/7</div>
                            <div className="text-sm text-white/70">Hỗ trợ kỹ thuật</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">100%</div>
                            <div className="text-sm text-white/70">Bảo mật dữ liệu</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">∞</div>
                            <div className="text-sm text-white/70">Không giới hạn AI</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
