'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

const navItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Tính năng', href: '#features' },
    { label: 'Bảng giá', href: '#pricing' },
    { label: 'Liên hệ', href: '#contact' },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50',
                'transition-all duration-300',
                isScrolled
                    ? 'bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]'
                    : 'bg-transparent'
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-[var(--header-height)]">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-secondary-600)] flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-shadow duration-300">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-secondary-600)] rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                        </div>
                        <span className="text-xl font-bold text-[var(--foreground)]">
                            AI<span className="gradient-text">Content</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors duration-200 text-sm font-medium"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/login">
                            <Button variant="ghost" size="sm">
                                Đăng nhập
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="primary" size="sm">
                                Bắt đầu ngay
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-white/5 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={cn(
                    'md:hidden',
                    'absolute top-full left-0 right-0',
                    'bg-[var(--background)]/95 backdrop-blur-xl',
                    'border-b border-[var(--border)]',
                    'transition-all duration-300 ease-out',
                    isMobileMenuOpen
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-4 pointer-events-none'
                )}
            >
                <nav className="px-4 py-6 space-y-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="block text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors text-lg font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="pt-4 border-t border-[var(--border)] space-y-3">
                        <Link href="/login" className="block">
                            <Button variant="outline" size="md" className="w-full">
                                Đăng nhập
                            </Button>
                        </Link>
                        <Link href="/login" className="block">
                            <Button variant="primary" size="md" className="w-full">
                                Bắt đầu ngay
                            </Button>
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}
