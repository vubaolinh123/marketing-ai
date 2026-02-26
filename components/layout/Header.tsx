'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

const navItems = [
    { label: 'Trang chủ', href: '/', isActive: true },
    { label: 'Công cụ', href: '#features', isActive: false },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated, isLoading } = useAuth();

    const ctaHref = !isLoading && isAuthenticated ? '/admin' : '/login';
    const ctaLabel = !isLoading && isAuthenticated ? 'Admin' : 'Đăng nhập';

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
                'py-4'
            )}
        >
            {/* Pill Container - Centered */}
            <div className="max-w-5xl mx-auto px-4">
                <div
                    className={cn(
                        'flex items-center justify-between',
                        'h-16 px-4 lg:px-6',
                        'rounded-full',
                        'bg-white/95 backdrop-blur-xl',
                        'border border-gray-200',
                        'shadow-lg',
                        'transition-all duration-300',
                        isScrolled && 'shadow-xl'
                    )}
                >
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center shrink-0" aria-label="EASY Marketing Home">
                        <div className="rounded-lg bg-white/70 px-1.5 py-1 ring-1 ring-gray-100">
                            <Image
                                src="/logo/logo.png"
                                alt="EASY Marketing"
                                width={2048}
                                height={386}
                                priority
                                className="h-6 w-auto sm:h-7 lg:h-8 select-none drop-shadow-[0_1px_1px_rgba(17,32,61,0.08)]"
                                sizes="(max-width: 640px) 128px, (max-width: 1024px) 148px, 170px"
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation - Pill Style */}
                    <nav className="hidden md:flex items-center">
                        <div className="flex items-center bg-gray-100 rounded-full px-1 py-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'px-5 py-2 rounded-full text-sm font-medium transition-all duration-200',
                                        item.isActive
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </nav>

                    {/* Desktop CTA Button - Yellow with arrow */}
                    <div className="hidden md:flex items-center">
                        <Link href={ctaHref}>
                            <button className="inline-flex items-center justify-center gap-2 px-5 h-10 rounded-full bg-[#FFD700] hover:bg-[#FFEC4D] text-gray-900 font-semibold text-sm transition-all shadow-md hover:shadow-lg">
                                {ctaLabel}
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 17L17 7M17 7H7M17 7V17"
                                    />
                                </svg>
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
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

            {/* Mobile Menu - Slide down */}
            <div
                className={cn(
                    'md:hidden',
                    'absolute top-full left-0 right-0 mt-2',
                    'px-4',
                    'transition-all duration-300 ease-out',
                    isMobileMenuOpen
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-4 pointer-events-none'
                )}
            >
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                    <nav className="p-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'block px-4 py-3 rounded-xl text-base font-medium transition-colors',
                                    item.isActive
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                )}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="pt-2 border-t border-gray-100">
                            <Link
                                href={ctaHref}
                                className="block"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <button className="w-full inline-flex items-center justify-center gap-2 px-6 h-12 rounded-xl bg-[#FFD700] hover:bg-[#FFEC4D] text-gray-900 font-semibold transition-all shadow-md">
                                    {ctaLabel}
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 17L17 7M17 7H7M17 7V17"
                                        />
                                    </svg>
                                </button>
                            </Link>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}
