'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { showError, showSuccess } from '@/lib/toast';

export default function SwitchUserControl() {
    const router = useRouter();
    const {
        user,
        effectiveUser,
        isImpersonating,
        setImpersonation,
        refreshImpersonationTargets
    } = useAuth();

    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [targets, setTargets] = useState<Array<{
        id: string;
        name: string;
        email: string;
        avatar?: string;
        role: 'admin' | 'user';
        isActive?: boolean;
    }>>([]);
    const [isLoading, setIsLoading] = useState(false);

    const canSwitch = user?.role === 'admin';

    const loadTargets = async (keyword = '') => {
        if (!canSwitch) return;

        try {
            setIsLoading(true);
            const data = await refreshImpersonationTargets(keyword);
            setTargets(data);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Không thể tải danh sách user';
            showError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredTargets = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        if (!keyword) return targets;
        return targets.filter((target) =>
            target.name.toLowerCase().includes(keyword) ||
            target.email.toLowerCase().includes(keyword)
        );
    }, [targets, search]);

    const handleOpen = async () => {
        if (!canSwitch) return;
        setIsOpen(true);
        await loadTargets('');
    };

    const handleSwitch = (target: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
        role: 'admin' | 'user';
        isActive?: boolean;
    }) => {
        setImpersonation(target);
        setIsOpen(false);
        showSuccess(`Đã chuyển sang ngữ cảnh: ${target.name}`);
    };

    const handleExit = () => {
        setImpersonation(null);
        showSuccess('Đã quay lại ngữ cảnh admin');
    };

    if (!canSwitch) {
        return null;
    }

    return (
        <div className="relative">
            <div className="flex items-center gap-2">
                {isImpersonating && effectiveUser && (
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFE27A] text-[#1F2B45] shadow-[0_8px_18px_rgba(255,214,82,0.4)] animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        <span className="text-xs font-semibold">
                            Đang thao tác: {effectiveUser.name}
                        </span>
                    </div>
                )}

                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleOpen}
                    className="px-3.5 py-2 rounded-full bg-[#EEF4FF] text-[#1346C4] border border-[#D3E1FF] hover:bg-[#E3EEFF] transition-all text-sm font-semibold flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h11m0 0l-3-3m3 3l-3 3M20 17H9m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span className="hidden sm:inline">Switch user</span>
                </motion.button>

                {isImpersonating && (
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleExit}
                        className="px-3.5 py-2 rounded-full bg-[#FFD84D] text-[#1F2B45] hover:bg-[#FFE27A] transition-all text-sm font-semibold shadow-[0_10px_22px_rgba(255,210,64,0.45)]"
                    >
                        Thoát switch
                    </motion.button>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-[#03164A]/45 backdrop-blur-[2px]"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                            className="absolute right-0 top-14 z-50 w-[360px] max-w-[90vw] bg-white rounded-[24px] shadow-[0_26px_70px_rgba(9,38,122,0.32)] border border-[#DCE7FF] overflow-hidden"
                        >
                            <div className="p-4 border-b border-[#E7EEFF] bg-gradient-to-r from-[#EEF4FF] to-white">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-gray-900">Chuyển ngữ cảnh tài khoản</h3>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-1.5 rounded-md text-gray-500 hover:bg-[#EEF4FF]"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Tìm theo tên hoặc email"
                                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D7E4FF] text-sm focus:outline-none focus:ring-2 focus:ring-[#2F67F5]/35"
                                    />
                                </div>
                            </div>

                            <div className="max-h-[360px] overflow-y-auto p-2">
                                {isLoading && (
                                    <div className="p-4 text-center text-sm text-gray-500">Đang tải danh sách...</div>
                                )}

                                {!isLoading && filteredTargets.length === 0 && (
                                    <div className="p-4 text-center text-sm text-gray-500">
                                        Không tìm thấy user phù hợp.
                                    </div>
                                )}

                                {!isLoading && filteredTargets.map((target) => {
                                    const active = isImpersonating && effectiveUser?.id === target.id;
                                    return (
                                        <button
                                            key={target.id}
                                            onClick={() => handleSwitch(target)}
                                            className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all ${
                                                active
                                                    ? 'bg-[#FFE18A] border border-[#FFD95A]'
                                                    : 'hover:bg-[#EEF4FF] border border-transparent'
                                            }`}
                                        >
                                            <div className="w-9 h-9 rounded-full bg-[#EEF4FF] text-[#1E40AF] flex items-center justify-center font-bold text-sm">
                                                {target.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-gray-900 truncate">{target.name}</div>
                                                <div className="text-xs text-gray-500 truncate">{target.email}</div>
                                            </div>
                                            <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
                                                target.role === 'admin'
                                                    ? 'bg-[#EDE8FF] text-[#5D3EC4]'
                                                    : 'bg-[#E9F2FF] text-[#2E62D9]'
                                            }`}>
                                                {target.role}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="p-3 border-t border-[#E7EEFF] bg-[#F7FAFF]">
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push('/admin/users');
                                    }}
                                    className="w-full text-sm font-medium px-3 py-2 rounded-xl bg-white border border-[#D7E4FF] hover:bg-[#EEF4FF]"
                                >
                                    Mở trang quản lý người dùng
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
