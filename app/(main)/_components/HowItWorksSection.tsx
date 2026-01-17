'use client';

import { Card, CardContent } from '@/components/ui';

const steps = [
    {
        step: '01',
        title: 'Chọn công cụ',
        description: 'Chọn một trong 4 công cụ AI phù hợp với nhu cầu của bạn.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        ),
    },
    {
        step: '02',
        title: 'Nhập thông tin',
        description: 'Điền chủ đề, mục đích và các thông số cần thiết.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
        ),
    },
    {
        step: '03',
        title: 'AI tạo nội dung',
        description: 'AI sẽ tự động tạo nội dung chất lượng theo yêu cầu.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
];

export default function HowItWorksSection() {
    return (
        <section className="relative py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16 lg:mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-secondary-600)]/10 border border-[var(--color-secondary-600)]/20 mb-6">
                        <svg className="w-5 h-5 text-[var(--color-secondary-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium text-[var(--color-secondary-500)]">Cách sử dụng</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-4">
                        Chỉ cần{' '}
                        <span className="gradient-text">3 bước đơn giản</span>
                    </h2>
                    <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
                        Tạo nội dung AI nhanh chóng và dễ dàng.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {steps.map((item, index) => (
                        <div key={item.step} className="relative">
                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-16 left-[calc(50%+50px)] w-[calc(100%-100px)] h-px bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-600)]" />
                            )}

                            <Card
                                variant="default"
                                className={`
                  relative h-full text-center p-8
                  animate-fade-in
                `}
                                style={{ animationDelay: `${index * 0.15}s` }}
                            >
                                <CardContent className="p-0">
                                    {/* Step Number */}
                                    <div className="relative inline-flex mb-6">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-secondary-600)] flex items-center justify-center text-white shadow-lg">
                                            {item.icon}
                                        </div>
                                        <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[var(--background)] border-2 border-[var(--color-primary-500)] flex items-center justify-center text-sm font-bold text-[var(--color-primary-500)]">
                                            {item.step}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-[var(--foreground-muted)]">
                                        {item.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
