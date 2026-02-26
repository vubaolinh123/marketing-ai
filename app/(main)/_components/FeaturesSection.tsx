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
        href: '/admin/article',
        color: 'from-[#FFD700] to-[#F5C800]',
        shadowColor: 'shadow-[#FFD700]/20',
        features: ['Chọn chủ đề & mục đích', 'Tạo ảnh AI kèm theo', 'Đăng lên Facebook tự động'],
        number: '01',
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
        href: '/admin/image',
        color: 'from-[#4A90D9] to-[#3B82F6]',
        shadowColor: 'shadow-[#3B82F6]/20',
        features: ['Upload ảnh sản phẩm gốc', 'AI ghép logo tự động', 'Tạo background bắt mắt'],
        number: '02',
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
        href: '/admin/marketing',
        color: 'from-[#FFD700] to-[#E5C000]',
        shadowColor: 'shadow-[#FFD700]/20',
        features: ['Chủ đề & ngày đăng', 'Calendar trực quan', 'Nhắc nhở tự động'],
        number: '03',
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
        href: '/admin/video',
        color: 'from-[#3B82F6] to-[#1D4ED8]',
        shadowColor: 'shadow-[#3B82F6]/20',
        features: ['Chọn tone & thời lượng', 'Có/không có người xuất hiện', 'Export kịch bản chi tiết'],
        number: '04',
    },
];

export default function FeaturesSection() {
    return (
        <section id="features" className="relative py-20 lg:py-28 overflow-hidden">
            {/* Background with gradient and pattern */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#E0EFFF] via-white to-gray-50" />

            {/* Decorative floating elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-20 h-20 bg-[#FFD700]/20 rounded-full blur-2xl animate-float" />
                <div className="absolute top-40 right-20 w-32 h-32 bg-[#3B82F6]/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-[#FFD700]/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-[#3B82F6]/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FFD700]/20 to-[#3B82F6]/20 border border-[#FFD700]/30 mb-6 animate-fade-in">
                        <svg className="w-5 h-5 text-[#E5C000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-sm font-semibold bg-gradient-to-r from-[#B29800] to-[#3B82F6] bg-clip-text text-transparent">
                            4 Công cụ AI mạnh mẽ
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 animate-slide-up">
                        Chọn công cụ <span className="text-[#FFD700]">bạn cần</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-slide-up stagger-1">
                        Tự động hóa quy trình tạo nội dung marketing với sức mạnh của trí tuệ nhân tạo
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
                                    h-full p-0 overflow-hidden
                                    group cursor-pointer
                                    animate-fade-in
                                    bg-white border-gray-100
                                    hover:border-transparent
                                    hover:shadow-2xl ${feature.shadowColor}
                                    transition-all duration-500
                                `}
                                style={{ animationDelay: `${index * 0.15}s` }}
                            >
                                <CardContent className="p-0">
                                    {/* Top gradient bar */}
                                    <div className={`h-1.5 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />

                                    <div className="p-8 relative">
                                        {/* Number badge */}
                                        <div className="absolute top-6 right-6 text-6xl font-black text-gray-100 group-hover:text-gray-200 transition-colors select-none">
                                            {feature.number}
                                        </div>

                                        {/* Icon */}
                                        <div className={`
                                            relative z-10 w-16 h-16 rounded-2xl mb-6
                                            bg-gradient-to-br ${feature.color}
                                            flex items-center justify-center text-white
                                            shadow-lg group-hover:shadow-xl
                                            group-hover:scale-110 group-hover:rotate-3
                                            transition-all duration-500
                                        `}>
                                            {feature.icon}
                                        </div>

                                        {/* Title & Description */}
                                        <h3 className="relative z-10 text-xl font-bold text-gray-900 mb-3 group-hover:text-[#B29800] transition-colors duration-300">
                                            {feature.title}
                                        </h3>
                                        <p className="relative z-10 text-gray-600 mb-6 leading-relaxed">
                                            {feature.description}
                                        </p>

                                        {/* Feature List */}
                                        <ul className="relative z-10 space-y-3">
                                            {feature.features.map((item, i) => (
                                                <li
                                                    key={i}
                                                    className="flex items-center gap-3 text-sm text-gray-600"
                                                    style={{ animationDelay: `${i * 0.1}s` }}
                                                >
                                                    <span className={`
                                                        w-6 h-6 rounded-full flex items-center justify-center shrink-0
                                                        bg-gradient-to-br ${feature.color} text-white
                                                        shadow-sm group-hover:scale-110 transition-transform duration-300
                                                    `}>
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </span>
                                                    <span className="group-hover:text-gray-900 transition-colors">
                                                        {item}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Arrow CTA */}
                                        <div className="relative z-10 mt-8 flex items-center gap-2 text-[#B29800] font-semibold">
                                            <span className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                                Khám phá ngay
                                            </span>
                                            <div className="w-10 h-10 rounded-full bg-[#FFD700]/10 flex items-center justify-center group-hover:bg-[#FFD700] transition-all duration-300">
                                                <svg
                                                    className="w-5 h-5 text-[#B29800] group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all duration-300"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 text-center animate-fade-in stagger-3">
                    <p className="text-gray-500 mb-4">Cần hỗ trợ thêm?</p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#FFD700] hover:bg-[#FFEC4D] text-gray-900 font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        Đăng nhập để bắt đầu
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
