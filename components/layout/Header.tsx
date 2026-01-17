'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const navItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Công cụ', href: '#features' },
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
                    ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100'
                    : 'bg-white/80 backdrop-blur-md'
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-[var(--header-height)]">
                    {/* Logo with brand gradient background */}
                    <Link href="/" className="flex items-center">
                        <div className="bg-gradient-to-r from-[#F59E0B] to-[#EA580C] rounded-lg px-3 py-1.5 shadow-md">
                            <Image
                                src="/logo/logo.png"
                                alt="Easy Marketing"
                                width={150}
                                height={32}
                                className="h-7 w-auto"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop CTA Button - Orange/Amber gradient */}
                    <div className="hidden md:flex items-center">
                        <Link href="/login">
                            <button className="inline-flex items-center justify-center gap-2 px-6 h-10 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white font-semibold text-sm hover:from-[#FBBF24] hover:to-[#F97316] transition-all shadow-md hover:shadow-lg">
                                Đăng nhập
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
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
                    'bg-white/95 backdrop-blur-xl',
                    'border-b border-gray-100 shadow-lg',
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
                            className="block text-gray-600 hover:text-gray-900 transition-colors text-lg font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="pt-4 border-t border-gray-100">
                        <Link href="/login" className="block">
                            <button className="w-full inline-flex items-center justify-center gap-2 px-6 h-11 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white font-semibold hover:from-[#FBBF24] hover:to-[#F97316] transition-all shadow-md">
                                Đăng nhập
                            </button>
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}
