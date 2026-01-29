'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { getArticles, deleteArticle, type Article } from '@/lib/api';
import toast from '@/lib/toast';
import type { FilterState } from './_components';

// Dynamic imports
const ArticleFilters = dynamic(() => import('./_components/ArticleFilters'), { ssr: false });
const ArticleCard = dynamic(() => import('./_components/ArticleCard'), { ssr: false });
const Pagination = dynamic(() => import('./_components/Pagination'), { ssr: false });
const DeleteConfirmModal = dynamic(() => import('./_components/DeleteConfirmModal'), { ssr: false });
const ArticleDetailModal = dynamic(() => import('./_components/ArticleDetailModal'), { ssr: false });

const ITEMS_PER_PAGE = 10;

export default function ArticleListPage() {
    const [filters, setFilters] = useState<FilterState>({
        topic: '',
        purpose: '',
        status: '',
        search: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [articles, setArticles] = useState<Article[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; article: Article | null }>({
        isOpen: false,
        article: null,
    });
    const [detailModal, setDetailModal] = useState<{ isOpen: boolean; article: Article | null }>({
        isOpen: false,
        article: null,
    });

    // Fetch articles from API
    const fetchArticles = useCallback(async () => {
        setIsLoading(true);
        try {
            const params: Record<string, string | number> = {
                page: currentPage,
                limit: ITEMS_PER_PAGE,
            };

            if (filters.topic) params.topic = filters.topic;
            if (filters.purpose) params.purpose = filters.purpose;
            if (filters.status) params.status = filters.status;
            if (filters.search) params.search = filters.search;

            const result = await getArticles(params);
            setArticles(result.articles);
            setTotalPages(result.pagination.totalPages);
            setTotalCount(result.pagination.total);
        } catch (error) {
            console.error('Failed to fetch articles:', error);
            toast.error('Không thể tải danh sách bài viết');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, filters]);

    // Fetch articles on mount and when filters/page change
    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    // Reset to page 1 when filters change
    const handleFiltersChange = useCallback((newFilters: FilterState) => {
        setFilters(newFilters);
        setCurrentPage(1);
    }, []);

    // Open detail modal when clicking on card
    const handleCardClick = useCallback((article: Article) => {
        setDetailModal({ isOpen: true, article });
    }, []);

    const handleEdit = useCallback((id: string) => {
        alert(`Chức năng chỉnh sửa bài viết ${id} sẽ được phát triển!`);
    }, []);

    const handleDelete = useCallback((id: string) => {
        const article = articles.find(a => a._id === id);
        if (article) {
            setDeleteModal({ isOpen: true, article });
        }
    }, [articles]);

    const confirmDelete = useCallback(async () => {
        if (deleteModal.article) {
            try {
                await deleteArticle(deleteModal.article._id);
                toast.success('Xóa bài viết thành công!');
                // Refresh the list
                fetchArticles();
            } catch (error) {
                console.error('Failed to delete article:', error);
                toast.error('Không thể xóa bài viết');
            }
            setDeleteModal({ isOpen: false, article: null });
        }
    }, [deleteModal.article, fetchArticles]);

    // Loading skeleton
    const LoadingSkeleton = () => (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                    <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-48 h-32 bg-gray-200" />
                        <div className="flex-1 p-4 space-y-3">
                            <div className="flex gap-2">
                                <div className="h-5 w-20 bg-gray-200 rounded-full" />
                                <div className="h-5 w-24 bg-gray-200 rounded-full" />
                            </div>
                            <div className="h-5 w-3/4 bg-gray-200 rounded" />
                            <div className="h-4 w-full bg-gray-200 rounded" />
                            <div className="h-4 w-2/3 bg-gray-200 rounded" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="w-[95%] max-w-[1600px] mx-auto">
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
                            {isLoading ? 'Đang tải...' : `${totalCount} bài viết được tìm thấy`}
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
            {isLoading ? (
                <LoadingSkeleton />
            ) : articles.length > 0 ? (
                <div className="space-y-4">
                    {articles.map((article, index) => (
                        <ArticleCard
                            key={article._id}
                            article={article}
                            onClick={handleCardClick}
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
            {!isLoading && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, article: null })}
                onConfirm={confirmDelete}
                title={deleteModal.article?.title}
            />

            {/* Article Detail Modal */}
            <ArticleDetailModal
                isOpen={detailModal.isOpen}
                onClose={() => setDetailModal({ isOpen: false, article: null })}
                article={detailModal.article}
            />
        </div>
    );
}
