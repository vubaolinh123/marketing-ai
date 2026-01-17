'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui';

const features = [
    {
        id: 'article',
        title: 'Tạo Bài Viết AI',
        description: 'Tự động tạo bài viết chất lượng cao với AI. Hỗ trợ đa dạng mục đích: giới thiệu, bán hàng, chia sẻ kiến thức.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
        ),
        href: '/create-article',
        color: 'from-amber-500 to-orange-500',
        bgColor: 'bg-amber-500/10',
        features: ['Chọn chủ đề & mục đích', 'Tạo ảnh AI kèm theo', 'Đăng lên Facebook tự động'],
    },
    {
        id: 'image',
        title: 'Tạo Ảnh AI',
        description: 'Tạo ảnh sản phẩm độc đáo với AI. Tự động ghép logo, tạo background chuyên nghiệp cho thương hiệu.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        href: '/create-image',
        color: 'from-orange-500 to-red-500',
        bgColor: 'bg-orange-500/10',
        features: ['Upload ảnh sản phẩm gốc', 'AI ghép logo tự động', 'Tạo background bắt mắt'],
    },
    {
        id: 'marketing',
        title: 'Kế Hoạch Marketing',
        description: 'Lên kế hoạch marketing chi tiết với AI. Calendar tự động, scheduling đăng bài thông minh.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        href: '/marketing-plan',
        color: 'from-yellow-500 to-amber-500',
        bgColor: 'bg-yellow-500/10',
        features: ['Chủ đề & ngày đăng', 'Calendar trực quan', 'Nhắc nhở tự động'],
    },
    {
        id: 'video',
        title: 'Kịch Bản Video',
        description: 'Tạo kịch bản video chuyên nghiệp. Tùy chỉnh tone, thời lượng, phong cách theo ý muốn.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        ),
        href: '/video-script',
        color: 'from-red-500 to-pink-500',
        bgColor: 'bg-red-500/10',
        features: ['Chọn tone & thời lượng', 'Có/không có người xuất hiện', 'Export kịch bản chi tiết'],
    },
];

export default function FeaturesSection() {
    return (
        <section id="features" className="relative py-24 lg:py-32">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--background-secondary)]/50 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16 lg:mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary-500)]/10 border border-[var(--color-primary-500)]/20 mb-6">
                        <svg className="w-5 h-5 text-[var(--color-primary-500)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-sm font-medium text-[var(--color-primary-500)]">Công cụ</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-4">
                        Chọn công cụ bạn cần
                    </h2>
                    <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
                        4 công cụ AI hỗ trợ tạo nội dung marketing.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <Link key={feature.id} href={feature.href}>
                            <Card
                                variant="gradient"
                                hover
                                className={`
                  h-full p-8
                  group cursor-pointer
                  animate-fade-in
                `}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <CardContent className="p-0">
                                    {/* Icon */}
                                    <div className={`
                    w-16 h-16 rounded-2xl mb-6
                    bg-gradient-to-br ${feature.color}
                    flex items-center justify-center text-white
                    shadow-lg group-hover:shadow-xl
                    group-hover:scale-110 transition-all duration-300
                  `}>
                                        {feature.icon}
                                    </div>

                                    {/* Title & Description */}
                                    <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3 group-hover:text-[var(--color-primary-500)] transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[var(--foreground-muted)] mb-6">
                                        {feature.description}
                                    </p>

                                    {/* Feature List */}
                                    <ul className="space-y-3">
                                        {feature.features.map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm text-[var(--foreground-muted)]">
                                                <span className={`
                          w-5 h-5 rounded-full flex items-center justify-center
                          bg-gradient-to-br ${feature.color} text-white
                        `}>
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Arrow */}
                                    <div className="mt-6 flex items-center gap-2 text-[var(--color-primary-500)] font-medium opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                                        <span>Khám phá ngay</span>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
