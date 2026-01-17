'use client';

import { Card, CardContent } from '@/components/ui';

const steps = [
    {
        step: '01',
        title: 'Đăng ký tài khoản',
        description: 'Tạo tài khoản miễn phí chỉ trong 30 giây. Không cần thẻ tín dụng.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
        ),
    },
    {
        step: '02',
        title: 'Thiết lập Prompt AI',
        description: 'Cấu hình prompt riêng phù hợp với thương hiệu và phong cách của bạn.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        step: '03',
        title: 'Tạo nội dung AI',
        description: 'Chọn loại nội dung cần tạo và để AI làm phần còn lại cho bạn.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
    {
        step: '04',
        title: 'Đăng & Theo dõi',
        description: 'Đăng nội dung lên các kênh và theo dõi hiệu quả qua dashboard.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
                        <span className="text-sm font-medium text-[var(--color-secondary-500)]">Cách hoạt động</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-4">
                        Bắt đầu chỉ với{' '}
                        <span className="gradient-text">4 bước đơn giản</span>
                    </h2>
                    <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
                        Không cần kỹ năng kỹ thuật. Chỉ cần đăng ký và bắt đầu tạo nội dung ngay lập tức.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
                    {steps.map((item, index) => (
                        <div key={item.step} className="relative">
                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-16 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-600)]" />
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
