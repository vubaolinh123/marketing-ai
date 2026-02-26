'use client';

import Link from 'next/link';

const toolLinks = [
    { label: 'Tạo bài viết AI', href: '/admin/article' },
    { label: 'Tạo ảnh AI', href: '/admin/image' },
    { label: 'Kế hoạch Marketing', href: '/admin/marketing' },
    { label: 'Kịch bản Video', href: '/admin/video' },
];

const quickLinks = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Công cụ', href: '#features' },
    { label: 'Đăng nhập', href: '/login' },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative overflow-hidden">
            {/* Background - Blue gradient like Hero */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#E0EFFF] via-[#87CEEB] to-[#4A90D9]" />

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                    backgroundImage: `linear-gradient(#fff 1px, transparent 1px),
                         linear-gradient(90deg, #fff 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-1/4 w-[300px] h-[300px] bg-white/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-[#FFD700]/15 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand Column */}
                    <div className="md:col-span-1">
                        <p className="text-gray-700 text-sm leading-relaxed mb-6">
                            Công cụ nội bộ tạo nội dung AI cho team Easy Marketing. Tự động hóa quy trình marketing với sức mạnh của trí tuệ nhân tạo.
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-green-700 font-medium">Hệ thống hoạt động bình thường</span>
                        </div>
                    </div>

                    {/* Tools Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-[#B29800] mb-6 uppercase tracking-wider">
                            Công cụ AI
                        </h4>
                        <ul className="space-y-4">
                            {toolLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-700 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2 group"
                                    >
                                        <svg
                                            className="w-4 h-4 text-[#FFD700] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                                            {link.label}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-[#B29800] mb-6 uppercase tracking-wider">
                            Liên kết nhanh
                        </h4>
                        <ul className="space-y-4">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-700 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2 group"
                                    >
                                        <svg
                                            className="w-4 h-4 text-[#FFD700] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                                            {link.label}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="relative z-10 border-t border-white/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-600">
                            © {currentYear} Easy Marketing. Internal use only.
                        </p>
                        <p className="text-sm text-gray-600">
                            Powered by <span className="text-[#B29800] font-semibold">AI Technology</span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
