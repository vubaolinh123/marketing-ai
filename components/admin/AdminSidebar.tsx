'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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
        label: 'Cài Đặt Content AI',
        href: '/admin/settings',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
];

export default function AdminSidebar({ isOpen, onClose, isCollapsed }: AdminSidebarProps) {
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState<string[]>(['Bài viết']);

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

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isCollapsed ? 72 : 280,
                    x: isOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 768) ? -280 : 0
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={cn(
                    'fixed md:sticky inset-y-0 left-0 top-0 z-50',
                    'h-full',
                    'bg-gradient-to-b from-[#E0EFFF] via-[#87CEEB]/50 to-white',
                    'border-r border-[#4A90D9]/20',
                    'flex flex-col',
                    'shadow-xl',
                    // Hide on mobile by default (only show when isOpen)
                    !isOpen && 'max-md:-translate-x-full'
                )}
                style={{ width: isCollapsed ? 72 : 280 }}
            >
                {/* Mobile Close Button */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-[#4A90D9]/20">
                    <span className="font-semibold text-gray-800">Menu</span>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-gray-600 hover:bg-[#4A90D9]/10 hover:text-gray-900 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {menuItems.map((item, index) => {
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
                                                ? 'bg-[#4A90D9]/20 text-[#1D4ED8]'
                                                : 'text-gray-700 hover:bg-[#4A90D9]/10 hover:text-[#3B82F6]'
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
                                            <div className="absolute left-full ml-2 px-3 py-2 bg-[#3B82F6] text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
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
                                                ? 'bg-gradient-to-r from-[#FFD700] to-[#F5C800] text-gray-900 shadow-lg shadow-[#FFD700]/30'
                                                : 'text-gray-700 hover:bg-[#4A90D9]/10 hover:text-[#3B82F6]'
                                        )}
                                    >
                                        <motion.span
                                            whileHover={{ scale: 1.1 }}
                                            className={cn(
                                                'flex-shrink-0',
                                                isActive ? 'text-gray-900' : 'text-gray-700'
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
                                                        isActive ? 'text-gray-900' : 'text-gray-700'
                                                    )}
                                                >
                                                    {item.label}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>

                                        {isCollapsed && (
                                            <div className="absolute left-full ml-2 px-3 py-2 bg-[#3B82F6] text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
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
                                                            ? 'bg-gradient-to-r from-[#FFD700] to-[#F5C800] text-gray-900 shadow-md shadow-[#FFD700]/20'
                                                            : 'hover:bg-[#4A90D9]/10'
                                                    )}
                                                >
                                                    <span className={cn(
                                                        'w-1.5 h-1.5 rounded-full',
                                                        isChildActive(child.href) ? 'bg-gray-900' : 'bg-[#4A90D9]'
                                                    )} />
                                                    <span className={cn(
                                                        'text-sm font-medium',
                                                        isChildActive(child.href) ? 'text-gray-900' : 'text-gray-700 hover:text-[#3B82F6]'
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
                <div className="p-4 border-t border-[#4A90D9]/20">
                    <div className={cn(
                        'rounded-xl bg-gradient-to-r from-[#FFD700]/20 to-[#4A90D9]/20 p-3',
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
