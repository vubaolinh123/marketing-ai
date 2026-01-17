'use client';

import Image from 'next/image';

const features = [
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

export default function LoginHero() {
    return (
        <div className="relative h-full flex flex-col justify-center p-12 overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-[#FEF3C7]/30 to-[#FFEDD5]/30">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#F59E0B]/10 rounded-full blur-[120px] animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#EA580C]/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(#18181B 1px, transparent 1px),
                           linear-gradient(90deg, #18181B 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                }}
            />

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-[#F59E0B] opacity-30 animate-float"
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
            <div className="relative z-10">
                {/* Logo */}
                <div className="mb-8 animate-fade-in">
                    <div className="bg-[#18181B] rounded-lg px-4 py-2 inline-block">
                        <Image
                            src="/logo/logo.png"
                            alt="Easy Marketing"
                            width={160}
                            height={36}
                            className="h-8 w-auto"
                        />
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-4xl lg:text-5xl font-bold text-[#18181B] mb-4 leading-tight animate-slide-up">
                    Công cụ tạo nội dung<br />
                    <span className="gradient-text">AI của Easy Marketing</span>
                </h1>
                <p className="text-lg text-[#71717A] mb-12 max-w-md animate-slide-up stagger-1">
                    Đăng nhập để sử dụng các công cụ AI tạo nội dung marketing chuyên nghiệp.
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4 animate-fade-in stagger-2">
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            className="group p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-[#F59E0B]/50 hover:shadow-lg transition-all duration-300"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform shadow-sm`}>
                                {feature.icon}
                            </div>
                            <h3 className="font-semibold text-[#18181B]">
                                {feature.title}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
