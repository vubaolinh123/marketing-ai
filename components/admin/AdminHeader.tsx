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
            className="sticky top-3 md:top-4 z-40 mx-3 md:mx-4 lg:mx-6 h-[74px] rounded-[30px] bg-white/96 backdrop-blur-xl border border-white/80 shadow-[0_20px_45px_rgba(7,37,128,0.24)] flex items-center justify-between px-4 sm:px-5 lg:px-7"
        >
            {/* Left: Hamburger + Collapse Toggle + Logo */}
            <div className="flex items-center gap-3">
                {/* Mobile Hamburger */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2.5 rounded-full text-[#1B2A4A] hover:bg-[#E8F0FF] hover:text-[#0D47D9] transition-colors"
                    aria-label="Toggle menu"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Desktop Collapse Toggle */}
                <button
                    onClick={onToggleCollapse}
                    className="hidden lg:flex p-2.5 rounded-full text-[#1B2A4A] hover:bg-[#E8F0FF] hover:text-[#0D47D9] transition-colors"
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
                        <span className="text-[22px] font-extrabold tracking-wide text-[#11203D]">EASY</span>
                        <div className="bg-[#FFD84D] px-2.5 py-1 rounded-full shadow-[0_8px_20px_rgba(255,210,70,0.4)]">
                            <span className="text-xs font-bold text-gray-900">MARKETING</span>
                        </div>
                    </motion.div>
                </Link>
            </div>

            {/* Right: User Info */}
            <div className="flex items-center gap-4">
                <SwitchUserControl />

                <div className="hidden sm:flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FFD84D] flex items-center justify-center text-[#1C2742] font-bold text-sm shadow-[0_8px_16px_rgba(255,212,75,0.38)]">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-[#1F2B45] font-semibold">
                        {user?.name}
                    </span>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={logout}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold text-[#1B243B] bg-[#FFD84D] hover:bg-[#FFE37B] transition-all shadow-[0_10px_22px_rgba(255,210,64,0.45)]"
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
