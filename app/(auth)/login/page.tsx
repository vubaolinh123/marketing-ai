'use client';

import dynamic from 'next/dynamic';

const LoginForm = dynamic(() => import('./_components/LoginForm'), {
    ssr: false,
    loading: () => (
        <div className="space-y-6 animate-pulse">
            <div className="h-12 bg-white/20 rounded-xl" />
            <div className="h-12 bg-white/20 rounded-xl" />
            <div className="h-12 bg-white/20 rounded-xl" />
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
        color: 'from-[#FFD700] to-[#F5C800]',
    },
    {
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        title: 'Ảnh AI',
        color: 'from-[#4A90D9] to-[#3B82F6]',
    },
    {
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        title: 'Kế hoạch',
        color: 'from-[#FFD700] to-[#E5C000]',
    },
    {
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        ),
        title: 'Video AI',
        color: 'from-[#3B82F6] to-[#1D4ED8]',
    },
];

export default function LoginPage() {
    return (
        <section className="min-h-dvh flex items-start sm:items-center justify-center pt-24 sm:pt-28 lg:pt-32 pb-10 sm:pb-12 px-4 relative overflow-hidden">
            {/* Blue Gradient Background - matching Hero */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#4A90D9] to-[#E0EFFF]" />

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                    backgroundImage: `linear-gradient(#fff 1px, transparent 1px),
                           linear-gradient(90deg, #fff 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-white/15 rounded-full blur-[100px] animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#FFD700]/15 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md animate-fade-in">
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8 md:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Chào mừng trở lại 👋
                        </h1>
                        <p className="text-gray-600">
                            Đăng nhập để sử dụng công cụ AI
                        </p>
                    </div>

                    {/* Login Form */}
                    <LoginForm />
                </div>

                {/* Tools Preview */}
                <div className="mt-6 sm:mt-8 text-center animate-slide-up stagger-2">
                    <p className="text-sm text-white/80 mb-4 font-medium">Công cụ AI có sẵn</p>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        {tools.map((tool, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-white/50 shadow-lg"
                            >
                                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-sm`}>
                                    {tool.icon}
                                </div>
                                <span className="text-sm font-medium text-gray-800">{tool.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
