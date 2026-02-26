'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';
import SwitchUserControl from './SwitchUserControl';

interface AdminHeaderProps {
    onMenuClick: () => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export default function AdminHeader({ onMenuClick, isCollapsed, onToggleCollapse }: AdminHeaderProps) {
    const { user, logout } = useAuth();

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="h-16 bg-gradient-to-r from-[#4A90D9] via-[#3B82F6] to-[#4A90D9] border-b border-white/20 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40 shadow-lg"
        >
            {/* Left: Hamburger + Collapse Toggle + Logo */}
            <div className="flex items-center gap-3">
                {/* Mobile Hamburger */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                    aria-label="Toggle menu"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Desktop Collapse Toggle */}
                <button
                    onClick={onToggleCollapse}
                    className="hidden lg:flex p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                    aria-label="Toggle sidebar"
                >
                    <motion.div
                        animate={{ rotate: isCollapsed ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </motion.div>
                </button>

                {/* Logo */}
                <Link href="/admin" className="flex items-center">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-2"
                    >
                        <span className="text-xl font-bold text-white">EASY</span>
                        <div className="bg-[#FFD700] px-2 py-1 rounded shadow-md">
                            <span className="text-xs font-bold text-gray-900">MARKETING</span>
                        </div>
                    </motion.div>
                </Link>
            </div>

            {/* Right: User Info */}
            <div className="flex items-center gap-4">
                <SwitchUserControl />

                <div className="hidden sm:flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FFD700] flex items-center justify-center text-gray-900 font-bold text-sm shadow-lg">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-white font-medium">
                        {user?.name}
                    </span>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden sm:inline">Đăng xuất</span>
                </motion.button>
            </div>
        </motion.header>
    );
}
