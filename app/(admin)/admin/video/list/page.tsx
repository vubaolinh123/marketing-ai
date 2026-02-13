'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { videoScriptApi, VideoScriptListItem, VideoScript } from '@/lib/api';
// ScriptFilterState type
interface ScriptFilterState {
    search: string;
    duration: string;
    size: string;
}


// Dynamic imports
const ScriptFilters = dynamic(() => import('./_components/ScriptFilters'), { ssr: false });
const ScriptCard = dynamic(() => import('./_components/ScriptCard'), { ssr: false });
const Pagination = dynamic(() => import('../../article/list/_components/Pagination'), { ssr: false });
const DeleteConfirmModal = dynamic(() => import('../../article/list/_components/DeleteConfirmModal'), { ssr: false });
const ScriptViewModal = dynamic(() => import('./_components/ScriptViewModal'), { ssr: false });

const ITEMS_PER_PAGE = 12;

export default function VideoScriptListPage() {
    const [filters, setFilters] = useState<ScriptFilterState>({
        search: '',
        duration: '',
        size: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [scripts, setScripts] = useState<VideoScriptListItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; script: VideoScriptListItem | null }>({
        isOpen: false,
        script: null,
    });
    const [viewModal, setViewModal] = useState<{ isOpen: boolean; script: VideoScript | null }>({
        isOpen: false,
        script: null,
    });

    // Fetch scripts from API
    const fetchScripts = useCallback(async (withLoading = true) => {
        if (withLoading) {
            setLoading(true);
        }
        try {
            const response = await videoScriptApi.getAll({
                page: currentPage,
                limit: ITEMS_PER_PAGE,
                search: filters.search,
                duration: filters.duration,
                size: filters.size
            });
            if (response.success) {
                setScripts(response.data);
                setTotal(response.pagination.total);
            }
        } catch (error) {
            console.error('Error fetching scripts:', error);
            console.error('Lỗi khi tải danh sách kịch bản');
        } finally {
            if (withLoading) {
                setLoading(false);
            }
        }
    }, [currentPage, filters]);

    // Fetch on mount
    useEffect(() => {
        fetchScripts();
    }, [fetchScripts]);

    useEffect(() => {
        const hasProcessingItem = scripts.some((script) => script.status === 'processing');
        if (!hasProcessingItem) return;

        const intervalId = window.setInterval(() => {
            fetchScripts(false);
        }, 8000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [scripts, fetchScripts]);

    // Total pages calculation
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    // Reset to page 1 when filters change
    const handleFiltersChange = useCallback((newFilters: ScriptFilterState) => {
        setFilters(newFilters);
        setCurrentPage(1);
    }, []);

    const handleView = useCallback(async (id: string) => {
        try {
            const response = await videoScriptApi.getById(id);
            if (response.success && response.data) {
                setViewModal({ isOpen: true, script: response.data });
            }
        } catch (error) {
            console.error('Error fetching script:', error);
            console.error('Lỗi khi tải kịch bản');
        }
    }, []);

    const handleDelete = useCallback((id: string) => {
        const script = scripts.find(s => s._id === id);
        if (script) {
            setDeleteModal({ isOpen: true, script });
        }
    }, [scripts]);

    const confirmDelete = useCallback(async () => {
        if (deleteModal.script) {
            try {
                await videoScriptApi.delete(deleteModal.script._id);
                setScripts(prev => prev.filter(s => s._id !== deleteModal.script?._id));
                console.log('Đã xóa kịch bản');
            } catch (error) {
                console.error('Delete error:', error);
                console.error('Lỗi khi xóa kịch bản');
            }
            setDeleteModal({ isOpen: false, script: null });
        }
    }, [deleteModal.script]);

    return (
        <div className="w-[96%] max-w-[1700px] mx-auto">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Danh sách kịch bản
                        </h1>
                        <p className="text-gray-600">
                            {loading ? 'Đang tải...' : `${total} kịch bản được tìm thấy`}
                        </p>
                    </div>
                    <Link
                        href="/admin/video"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Tạo kịch bản mới
                    </Link>
                </div>
            </motion.div>

            {/* Filters */}
            <ScriptFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
            />

            {/* Loading State */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-48" />
                    ))}
                </div>
            ) : scripts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {scripts.map((script, index) => (
                        <ScriptCard
                            key={script._id}
                            script={{
                                id: script._id,
                                customerName: '',
                                title: script.title,
                                duration: script.duration,
                                size: script.size,
                                sceneCount: script.sceneCount,
                                status: script.status,
                                createdAt: script.createdAt
                            }}
                            onView={handleView}
                            onDelete={handleDelete}
                            index={index}
                        />
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                        Không tìm thấy kịch bản
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Thử thay đổi bộ lọc hoặc tạo kịch bản mới
                    </p>
                    <Link
                        href="/admin/video"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-purple-600 font-medium hover:bg-purple-50 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Tạo kịch bản mới
                    </Link>
                </motion.div>
            )}

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, script: null })}
                onConfirm={confirmDelete}
                title={deleteModal.script?.title}
            />

            {/* View Script Modal */}
            <ScriptViewModal
                isOpen={viewModal.isOpen}
                script={viewModal.script}
                onClose={() => setViewModal({ isOpen: false, script: null })}
            />
        </div>
    );
}
