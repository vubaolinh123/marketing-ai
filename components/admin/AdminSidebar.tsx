'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    isCollapsed: boolean;
}

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
        label: 'Ảnh AI',
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
        label: 'Kế hoạch Marketing',
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
        label: 'Kịch bản Video',
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
        label: 'Cài đặt thương hiệu',
        href: '/admin/settings',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        label: 'Quản lý user',
        href: '/admin/users',
        requiresAdmin: true,
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5V4H2v16h5m10 0v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6m10 0H7" />
            </svg>
        ),
    },
    {
        label: 'Token usage',
        href: '/admin/token-usage',
        requiresAdmin: true,
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 14l3-3 3 2 4-5" />
            </svg>
        ),
    },
];

export default function AdminSidebar({ isOpen, onClose, isCollapsed }: AdminSidebarProps) {
    const { user } = useAuth();
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState<string[]>(['Bài viết']);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 767px)');
        const updateIsMobile = () => setIsMobile(mediaQuery.matches);

        updateIsMobile();

        mediaQuery.addEventListener('change', updateIsMobile);
        return () => mediaQuery.removeEventListener('change', updateIsMobile);
    }, []);

    const toggleExpand = (label: string) => {
        setExpandedItems(prev =>
            prev.includes(label)
                ? prev.filter(item => item !== label)
                : [...prev, label]
        );
    };

    const isItemActive = (item: MenuItem) => {
        if (item.href) {
            return pathname === item.href;
        }
        if (item.children) {
            return item.children.some(child => pathname === child.href || pathname?.startsWith(child.href + '/'));
        }
        return false;
    };

    const isChildActive = (href: string) => {
        return pathname === href || pathname?.startsWith(href + '/');
    };

    const sidebarX = isMobile && !isOpen
            ? -280
            : 0;

    const visibleMenuItems = menuItems.filter((item) => !item.requiresAdmin || user?.role === 'admin');

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-[#021448]/45 backdrop-blur-sm z-40 md:hidden"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isCollapsed ? 72 : 280,
                    x: sidebarX
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={cn(
                    'fixed md:sticky inset-y-0 left-0 top-0 z-50',
                    'h-full',
                    'bg-white/94 backdrop-blur-xl',
                    'border-r md:border border-white/70',
                    'flex flex-col',
                    'shadow-[0_22px_60px_rgba(9,37,121,0.28)]',
                    'md:rounded-[28px]',
                    // Hide on mobile by default (only show when isOpen)
                    !isOpen && 'max-md:-translate-x-full'
                )}
                style={{ width: isCollapsed ? 72 : 280 }}
            >
                {/* Mobile Close Button */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-[#E7EEFF]">
                    <span className="font-semibold text-gray-800">Menu</span>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-gray-600 hover:bg-[#EEF4FF] hover:text-gray-900 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {visibleMenuItems.map((item, index) => {
                        const isActive = isItemActive(item);
                        const isExpanded = expandedItems.includes(item.label);
                        const hasChildren = item.children && item.children.length > 0;

                        return (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                {/* Parent Item */}
                                {hasChildren ? (
                                    <button
                                        onClick={() => !isCollapsed && toggleExpand(item.label)}
                                        className={cn(
                                            'w-full group relative flex items-center gap-3 rounded-xl transition-all duration-200',
                                            isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3',
                                            isActive
                                                ? 'bg-[#FFE18A] text-[#1F2B45] shadow-[0_8px_20px_rgba(255,214,84,0.42)]'
                                                : 'text-[#24324D] hover:bg-[#EEF4FF] hover:text-[#1144C5]'
                                        )}
                                    >
                                        <motion.span
                                            whileHover={{ scale: 1.1 }}
                                            className="flex-shrink-0"
                                        >
                                            {item.icon}
                                        </motion.span>

                                        <AnimatePresence>
                                            {!isCollapsed && (
                                                <>
                                                    <motion.span
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="flex-1 font-medium text-left whitespace-nowrap text-inherit"
                                                    >
                                                        {item.label}
                                                    </motion.span>
                                                    <motion.svg
                                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </motion.svg>
                                                </>
                                            )}
                                        </AnimatePresence>

                                        {/* Tooltip when collapsed */}
                                        {isCollapsed && (
                                            <div className="absolute left-full ml-2 px-3 py-2 bg-[#1E5AEE] text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
                                                {item.label}
                                            </div>
                                        )}
                                    </button>
                                ) : (
                                    <Link
                                        href={item.href || '#'}
                                        onClick={onClose}
                                        className={cn(
                                            'group relative flex items-center gap-3 rounded-xl transition-all duration-200',
                                            isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3',
                                            isActive
                                                ? 'bg-[#FFD84D] text-[#1C2742] shadow-[0_10px_24px_rgba(255,210,66,0.45)]'
                                                : 'text-[#24324D] hover:bg-[#EEF4FF] hover:text-[#1144C5]'
                                        )}
                                    >
                                        <motion.span
                                            whileHover={{ scale: 1.1 }}
                                            className={cn(
                                                'flex-shrink-0',
                                                isActive ? 'text-[#1C2742]' : 'text-[#24324D]'
                                            )}
                                        >
                                            {item.icon}
                                        </motion.span>

                                        <AnimatePresence>
                                            {!isCollapsed && (
                                                <motion.span
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className={cn(
                                                        'font-medium whitespace-nowrap',
                                                        isActive ? 'text-[#1C2742]' : 'text-[#24324D]'
                                                    )}
                                                >
                                                    {item.label}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>

                                        {isCollapsed && (
                                            <div className="absolute left-full ml-2 px-3 py-2 bg-[#1E5AEE] text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
                                                {item.label}
                                            </div>
                                        )}
                                    </Link>
                                )}

                                {/* Children */}
                                <AnimatePresence>
                                    {hasChildren && isExpanded && !isCollapsed && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden ml-4 mt-1 space-y-1"
                                        >
                                            {item.children?.map(child => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    onClick={onClose}
                                                    className={cn(
                                                        'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200',
                                                        isChildActive(child.href)
                                                            ? 'bg-[#FFE18A] text-[#1E2A45] shadow-[0_8px_16px_rgba(255,212,72,0.35)]'
                                                            : 'hover:bg-[#EEF4FF]'
                                                    )}
                                                >
                                                    <span className={cn(
                                                        'w-1.5 h-1.5 rounded-full',
                                                        isChildActive(child.href) ? 'bg-[#1E2A45]' : 'bg-[#3C6FEA]'
                                                    )} />
                                                    <span className={cn(
                                                        'text-sm font-medium',
                                                        isChildActive(child.href) ? 'text-[#1E2A45]' : 'text-[#475569] hover:text-[#1646C7]'
                                                    )}>
                                                        {child.label}
                                                    </span>
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </nav>

                {/* Bottom decoration */}
                <div className="p-4 border-t border-[#E7EEFF]">
                    <div className={cn(
                        'rounded-2xl bg-gradient-to-r from-[#EEF4FF] to-[#FFF4CC] p-3.5 border border-[#E1EAFF]',
                        isCollapsed && 'hidden'
                    )}>
                        <p className="text-xs text-gray-600 font-medium">
                            Easy Marketing AI Tools
                        </p>
                    </div>
                </div>
            </motion.aside>
        </>
    );
}
