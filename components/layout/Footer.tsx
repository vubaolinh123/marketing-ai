'use client';

import Link from 'next/link';

const footerLinks = {
    product: {
        title: 'Sản phẩm',
        links: [
            { label: 'Tạo bài viết AI', href: '/create-article' },
            { label: 'Tạo ảnh AI', href: '/create-image' },
            { label: 'Kế hoạch Marketing', href: '/marketing-plan' },
            { label: 'Kịch bản Video', href: '/video-script' },
        ],
    },
    company: {
        title: 'Công ty',
        links: [
            { label: 'Về chúng tôi', href: '/about' },
            { label: 'Blog', href: '/blog' },
            { label: 'Liên hệ', href: '/contact' },
            { label: 'Tuyển dụng', href: '/careers' },
        ],
    },
    resources: {
        title: 'Tài nguyên',
        links: [
            { label: 'Hướng dẫn', href: '/docs' },
            { label: 'API', href: '/api' },
            { label: 'Hỗ trợ', href: '/support' },
            { label: 'Cộng đồng', href: '/community' },
        ],
    },
    legal: {
        title: 'Pháp lý',
        links: [
            { label: 'Điều khoản', href: '/terms' },
            { label: 'Bảo mật', href: '/privacy' },
            { label: 'Cookie', href: '/cookies' },
        ],
    },
};

const socialLinks = [
    {
        name: 'Facebook',
        href: 'https://facebook.com',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
    },
    {
        name: 'Twitter',
        href: 'https://twitter.com',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
        ),
    },
    {
        name: 'LinkedIn',
        href: 'https://linkedin.com',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        name: 'YouTube',
        href: 'https://youtube.com',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        ),
    },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[var(--background-secondary)] border-t border-[var(--border)]">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="col-span-2 lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 group mb-6">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-secondary-600)] flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                            <span className="text-xl font-bold text-[var(--foreground)]">
                                AI<span className="gradient-text">Content</span>
                            </span>
                        </Link>
                        <p className="text-[var(--foreground-muted)] mb-6 max-w-xs">
                            Nền tảng tạo nội dung AI hàng đầu, giúp doanh nghiệp tự động hóa marketing và sáng tạo nội dung chuyên nghiệp.
                        </p>
                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-[var(--background-card)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground-muted)] hover:text-[var(--color-primary-500)] hover:border-[var(--color-primary-500)] transition-colors duration-200"
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {Object.values(footerLinks).map((section) => (
                        <div key={section.title}>
                            <h4 className="text-sm font-semibold text-[var(--foreground)] mb-4">
                                {section.title}
                            </h4>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors duration-200"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[var(--border)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-[var(--foreground-muted)]">
                            © {currentYear} AIContent. Bản quyền thuộc về chúng tôi.
                        </p>
                        <div className="flex items-center gap-6">
                            <span className="text-sm text-[var(--foreground-muted)] flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Hệ thống hoạt động bình thường
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
