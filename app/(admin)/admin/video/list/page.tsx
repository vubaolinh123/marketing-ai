'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { fakeScriptList, type ScriptListItem } from '@/lib/fakeData';
import type { ScriptFilterState } from './_components';

// Dynamic imports
const ScriptFilters = dynamic(() => import('./_components/ScriptFilters'), { ssr: false });
const ScriptCard = dynamic(() => import('./_components/ScriptCard'), { ssr: false });
const Pagination = dynamic(() => import('../../article/list/_components/Pagination'), { ssr: false });
const DeleteConfirmModal = dynamic(() => import('../../article/list/_components/DeleteConfirmModal'), { ssr: false });

const ITEMS_PER_PAGE = 12;

export default function VideoScriptListPage() {
    const [filters, setFilters] = useState<ScriptFilterState>({
        search: '',
        duration: '',
        size: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [scripts, setScripts] = useState<ScriptListItem[]>(fakeScriptList);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; script: ScriptListItem | null }>({
        isOpen: false,
        script: null,
    });

    // Filter scripts
    const filteredScripts = useMemo(() => {
        return scripts.filter(script => {
            if (filters.duration && script.duration !== filters.duration) return false;
            if (filters.size && script.size !== filters.size) return false;
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                if (
                    !script.customerName.toLowerCase().includes(searchLower) &&
                    !script.title.toLowerCase().includes(searchLower)
                ) return false;
            }
            return true;
        });
    }, [scripts, filters]);

    // Pagination
    const totalPages = Math.ceil(filteredScripts.length / ITEMS_PER_PAGE);
    const paginatedScripts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredScripts.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredScripts, currentPage]);

    // Reset to page 1 when filters change
    const handleFiltersChange = useCallback((newFilters: ScriptFilterState) => {
        setFilters(newFilters);
        setCurrentPage(1);
    }, []);

    const handleView = useCallback((id: string) => {
        alert(`Xem chi tiết kịch bản ${id} - Tính năng đang phát triển!`);
    }, []);

    const handleDelete = useCallback((id: string) => {
        const script = scripts.find(s => s.id === id);
        if (script) {
            setDeleteModal({ isOpen: true, script });
        }
    }, [scripts]);

    const confirmDelete = useCallback(() => {
        if (deleteModal.script) {
            setScripts(prev => prev.filter(s => s.id !== deleteModal.script?.id));
            setDeleteModal({ isOpen: false, script: null });
        }
    }, [deleteModal.script]);

    return (
        <div className="max-w-6xl mx-auto">
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
                            {filteredScripts.length} kịch bản được tìm thấy
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

            {/* Script Grid */}
            {paginatedScripts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedScripts.map((script, index) => (
                        <ScriptCard
                            key={script.id}
                            script={script}
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
        </div>
    );
}
