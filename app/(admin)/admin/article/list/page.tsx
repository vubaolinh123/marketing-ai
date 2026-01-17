'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { fakeArticleList, type ArticleListItem } from '@/lib/fakeData';
import type { FilterState } from './_components';

// Dynamic imports
const ArticleFilters = dynamic(() => import('./_components/ArticleFilters'), { ssr: false });
const ArticleCard = dynamic(() => import('./_components/ArticleCard'), { ssr: false });
const Pagination = dynamic(() => import('./_components/Pagination'), { ssr: false });
const DeleteConfirmModal = dynamic(() => import('./_components/DeleteConfirmModal'), { ssr: false });

const ITEMS_PER_PAGE = 20;

export default function ArticleListPage() {
    const [filters, setFilters] = useState<FilterState>({
        topic: '',
        purpose: '',
        search: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [articles, setArticles] = useState<ArticleListItem[]>(fakeArticleList);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; article: ArticleListItem | null }>({
        isOpen: false,
        article: null,
    });

    // Filter articles
    const filteredArticles = useMemo(() => {
        return articles.filter(article => {
            if (filters.topic && article.topic !== filters.topic) return false;
            if (filters.purpose && article.purpose !== filters.purpose) return false;
            if (filters.search && !article.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
            return true;
        });
    }, [articles, filters]);

    // Pagination
    const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
    const paginatedArticles = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredArticles, currentPage]);

    // Reset to page 1 when filters change
    const handleFiltersChange = useCallback((newFilters: FilterState) => {
        setFilters(newFilters);
        setCurrentPage(1);
    }, []);

    const handleEdit = useCallback((id: string) => {
        alert(`Chức năng chỉnh sửa bài viết ${id} sẽ được phát triển!`);
    }, []);

    const handleDelete = useCallback((id: string) => {
        const article = articles.find(a => a.id === id);
        if (article) {
            setDeleteModal({ isOpen: true, article });
        }
    }, [articles]);

    const confirmDelete = useCallback(() => {
        if (deleteModal.article) {
            setArticles(prev => prev.filter(a => a.id !== deleteModal.article?.id));
            setDeleteModal({ isOpen: false, article: null });
        }
    }, [deleteModal.article]);

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
                            Danh sách bài viết
                        </h1>
                        <p className="text-gray-600">
                            {filteredArticles.length} bài viết được tìm thấy
                        </p>
                    </div>
                    <Link
                        href="/admin/article"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white font-medium shadow-lg hover:shadow-xl transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Tạo bài viết mới
                    </Link>
                </div>
            </motion.div>

            {/* Filters */}
            <ArticleFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
            />

            {/* Article List */}
            {paginatedArticles.length > 0 ? (
                <div className="space-y-4">
                    {paginatedArticles.map((article, index) => (
                        <ArticleCard
                            key={article.id}
                            article={article}
                            onEdit={handleEdit}
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                        Không tìm thấy bài viết
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Thử thay đổi bộ lọc hoặc tạo bài viết mới
                    </p>
                    <Link
                        href="/admin/article"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[#F59E0B] font-medium hover:bg-amber-50 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Tạo bài viết mới
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
                onClose={() => setDeleteModal({ isOpen: false, article: null })}
                onConfirm={confirmDelete}
                title={deleteModal.article?.title}
            />
        </div>
    );
}
