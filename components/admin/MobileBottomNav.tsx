'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

interface MenuItem {
    label: string;
    icon: React.ReactNode;
    href?: string;
    children?: { label: string; href: string }[];
    requiresAdmin?: boolean;
}

const menuItems: MenuItem[] = [
    {
        label: 'Bài viết',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
        ),
        children: [
            { label: 'Tạo bài viết', href: '/admin/article' },
            { label: 'Xem bài viết', href: '/admin/article/list' },
        ],
    },
    {
        label: 'Ảnh',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        children: [
            { label: 'Tạo ảnh AI', href: '/admin/image' },
            { label: 'Xem ảnh', href: '/admin/image/list' },
        ],
    },
    {
        label: 'Marketing',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        children: [
            { label: 'Tạo kế hoạch', href: '/admin/marketing' },
            { label: 'Xem kế hoạch', href: '/admin/marketing/list' },
        ],
    },
    {
        label: 'Video',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        ),
        children: [
            { label: 'Tạo kịch bản', href: '/admin/video' },
            { label: 'Xem kịch bản', href: '/admin/video/list' },
        ],
    },
    {
        label: 'Cài đặt',
        href: '/admin/settings',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        label: 'Users',
        href: '/admin/users',
        requiresAdmin: true,
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5V4H2v16h5m10 0v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6m10 0H7" />
            </svg>
        ),
    },
];

export default function MobileBottomNav() {
    const { user } = useAuth();
    const pathname = usePathname();
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

    const visibleMenuItems = menuItems.filter((item) => !item.requiresAdmin || user?.role === 'admin');

    const isItemActive = (item: MenuItem) => {
        if (item.href) {
            return pathname === item.href;
        }
        if (item.children) {
            return item.children.some(child => pathname === child.href || pathname?.startsWith(child.href + '/'));
        }
        return false;
    };

    const handleItemClick = (item: MenuItem) => {
        if (item.children) {
            setActiveSubmenu(activeSubmenu === item.label ? null : item.label);
        }
    };

    return (
        <>
            {/* Submenu Popup */}
            <AnimatePresence>
                {activeSubmenu && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-[#03164A]/38 z-40"
                            onClick={() => setActiveSubmenu(null)}
                        />

                        {/* Submenu */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="fixed bottom-24 left-3 right-3 z-50 bg-white rounded-[22px] shadow-[0_24px_60px_rgba(9,37,121,0.3)] border border-[#DCE7FF] overflow-hidden"
                        >
                            <div className="p-2">
                                <div className="px-3 py-2 text-sm font-semibold text-gray-500 border-b border-gray-100 mb-1">
                                    {activeSubmenu}
                                </div>
                                {visibleMenuItems
                                    .find(item => item.label === activeSubmenu)
                                    ?.children?.map(child => (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            onClick={() => setActiveSubmenu(null)}
                                            className={cn(
                                                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                                                pathname === child.href
                                                    ? 'bg-[#FFE18A] text-[#1F2B45]'
                                                    : 'text-[#334155] hover:bg-[#EEF4FF]'
                                            )}
                                        >
                                            <span className={cn(
                                                'w-2 h-2 rounded-full',
                                                pathname === child.href
                                                    ? 'bg-gray-900'
                                                    : 'bg-[#4A90D9]'
                                            )} />
                                            <span className="font-medium">{child.label}</span>
                                        </Link>
                                    ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Bottom Navigation Bar */}
            <nav className="md:hidden fixed bottom-3 left-3 right-3 z-50 rounded-[22px] bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_18px_45px_rgba(8,36,123,0.3)] safe-area-bottom">
                <div className="flex items-center justify-around h-16 px-2">
                    {visibleMenuItems.map((item) => {
                        const isActive = isItemActive(item);
                        const hasChildren = item.children && item.children.length > 0;

                        if (hasChildren) {
                            return (
                                <button
                                    key={item.label}
                                    onClick={() => handleItemClick(item)}
                                    className={cn(
                                        'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[60px]',
                                        isActive || activeSubmenu === item.label
                                            ? 'text-[#1E2A45]'
                                            : 'text-gray-500'
                                    )}
                                >
                                    <div className={cn(
                                        'p-1.5 rounded-lg transition-all',
                                        isActive && 'bg-[#FFE18A] shadow-[0_6px_16px_rgba(255,212,72,0.35)]'
                                    )}>
                                        {item.icon}
                                    </div>
                                    <span className="text-[10px] font-medium">{item.label}</span>
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.label}
                                href={item.href || '#'}
                                className={cn(
                                    'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[60px]',
                                    isActive
                                        ? 'text-[#1E2A45]'
                                        : 'text-gray-500'
                                )}
                            >
                                <div className={cn(
                                    'p-1.5 rounded-lg transition-all',
                                    isActive && 'bg-[#FFE18A] shadow-[0_6px_16px_rgba(255,212,72,0.35)]'
                                )}>
                                    {item.icon}
                                </div>
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
