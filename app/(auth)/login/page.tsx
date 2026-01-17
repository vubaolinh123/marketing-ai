'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';

const LoginForm = dynamic(() => import('./_components/LoginForm'), {
    ssr: false,
    loading: () => (
        <div className="space-y-6 animate-pulse">
            <div className="h-12 bg-gray-100 rounded-xl" />
            <div className="h-12 bg-gray-100 rounded-xl" />
            <div className="h-12 bg-gray-100 rounded-xl" />
        </div>
    ),
});

const tools = [
    {
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
        ),
        title: 'Bài viết AI',
        color: 'from-amber-500 to-orange-500',
    },
    {
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        title: 'Ảnh AI',
        color: 'from-orange-500 to-red-500',
    },
    {
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        title: 'Kế hoạch',
        color: 'from-yellow-500 to-amber-500',
    },
    {
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        ),
        title: 'Video AI',
        color: 'from-red-500 to-pink-500',
    },
];

export default function LoginPage() {
    return (
        <section className="min-h-[calc(100vh-var(--header-height))] flex items-center justify-center py-12 px-4 bg-gradient-to-br from-[#FAFAFA] via-[#FEF3C7]/20 to-[#FFEDD5]/20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#F59E0B]/10 rounded-full blur-[150px] animate-float" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#EA580C]/10 rounded-full blur-[150px] animate-float" style={{ animationDelay: '2s' }} />

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(#18181B 1px, transparent 1px),
                           linear-gradient(90deg, #18181B 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md animate-fade-in">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-gradient-to-r from-[#F59E0B] to-[#EA580C] rounded-xl px-4 py-2 shadow-md">
                            <Image
                                src="/logo/logo.png"
                                alt="Easy Marketing"
                                width={160}
                                height={36}
                                className="h-8 w-auto"
                            />
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-[#18181B] mb-2">
                            Chào mừng trở lại 👋
                        </h1>
                        <p className="text-[#71717A]">
                            Đăng nhập để sử dụng công cụ AI
                        </p>
                    </div>

                    {/* Login Form */}
                    <LoginForm />
                </div>

                {/* Tools Preview */}
                <div className="mt-8 text-center animate-slide-up stagger-2">
                    <p className="text-sm text-[#71717A] mb-4">Công cụ AI có sẵn</p>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        {tools.map((tool, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-gray-200 shadow-sm"
                            >
                                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center text-white`}>
                                    {tool.icon}
                                </div>
                                <span className="text-sm font-medium text-[#18181B]">{tool.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
