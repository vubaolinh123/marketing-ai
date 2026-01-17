'use client';

export default function LoginHero() {
    const features = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
            title: 'Tạo bài viết AI',
            description: 'Tự động tạo nội dung chất lượng cao',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            title: 'Tạo ảnh AI',
            description: 'Ảnh độc đáo cho thương hiệu',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            title: 'Lên kế hoạch Marketing',
            description: 'Calendar và scheduling tự động',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            ),
            title: 'Kịch bản Video',
            description: 'Script video chuyên nghiệp',
        },
    ];

    return (
        <div className="relative h-full flex flex-col justify-center p-12 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-500)]/20 via-transparent to-[var(--color-secondary-600)]/20" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary-500)]/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-secondary-600)]/50 to-transparent" />

            {/* Animated Circles */}
            <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-[var(--color-primary-500)]/10 blur-3xl animate-float" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-[var(--color-secondary-600)]/10 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `linear-gradient(var(--color-primary-500) 1px, transparent 1px),
                           linear-gradient(90deg, var(--color-primary-500) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-secondary-600)] flex items-center justify-center animate-pulse-glow">
                            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                    <span className="text-2xl font-bold text-[var(--foreground)]">
                        AI<span className="gradient-text">Content</span>
                    </span>
                </div>

                {/* Heading */}
                <h1 className="text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-4 leading-tight">
                    Tạo nội dung<br />
                    <span className="gradient-text">thông minh hơn</span>
                </h1>
                <p className="text-lg text-[var(--foreground-muted)] mb-12 max-w-md">
                    Nền tảng AI hàng đầu giúp doanh nghiệp tự động hóa content marketing, tiết kiệm thời gian và tăng hiệu quả.
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            className={`
                p-4 rounded-xl
                bg-[var(--background-card)]/50 backdrop-blur-sm
                border border-[var(--border)]
                hover:border-[var(--color-primary-500)]/50
                transition-all duration-300
                animate-fade-in
              `}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary-500)]/20 to-[var(--color-secondary-600)]/20 flex items-center justify-center text-[var(--color-primary-500)] mb-3">
                                {feature.icon}
                            </div>
                            <h3 className="font-semibold text-[var(--foreground)] mb-1">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-[var(--foreground-muted)]">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-8 mt-12 pt-8 border-t border-[var(--border)]">
                    <div>
                        <div className="text-2xl font-bold gradient-text">10K+</div>
                        <div className="text-sm text-[var(--foreground-muted)]">Người dùng</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold gradient-text">1M+</div>
                        <div className="text-sm text-[var(--foreground-muted)]">Nội dung tạo</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold gradient-text">99%</div>
                        <div className="text-sm text-[var(--foreground-muted)]">Hài lòng</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
