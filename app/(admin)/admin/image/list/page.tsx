'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { productImageApi, ProductImage, getImageUrl } from '@/lib/api';
import { ImageFilterState } from './_components/ImageFilters';

// Dynamic imports
const ImageFilters = dynamic(() => import('./_components/ImageFilters'), { ssr: false });
const ImageCard = dynamic(() => import('./_components/ImageCard'), { ssr: false });
const ImagePreviewModal = dynamic(() => import('./_components/ImagePreviewModal'), { ssr: false });
const Pagination = dynamic(() => import('@/app/(admin)/admin/article/list/_components/Pagination'), { ssr: false });
const DeleteConfirmModal = dynamic(() => import('@/app/(admin)/admin/article/list/_components/DeleteConfirmModal'), { ssr: false });

const ITEMS_PER_PAGE = 12;

export default function ImageListPage() {
    const [filters, setFilters] = useState<ImageFilterState>({
        search: '',
        backgroundType: '',
        status: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [images, setImages] = useState<ProductImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0
    });
    const [previewImage, setPreviewImage] = useState<ProductImage | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; image: ProductImage | null }>({
        isOpen: false,
        image: null,
    });

    // Fetch images from API
    const fetchImages = useCallback(async (withLoading = true) => {
        if (withLoading) {
            setIsLoading(true);
        }
        try {
            const response = await productImageApi.getAll({
                page: currentPage,
                limit: ITEMS_PER_PAGE,
                search: filters.search || undefined,
                backgroundType: filters.backgroundType || undefined,
                status: filters.status || undefined,
            });

            if (response.success) {
                setImages(response.data);
                setPagination({
                    page: response.pagination.page,
                    totalPages: response.pagination.totalPages,
                    total: response.pagination.total
                });
            }
        } catch (error) {
            console.error('Failed to fetch images:', error);
        } finally {
            if (withLoading) {
                setIsLoading(false);
            }
        }
    }, [currentPage, filters]);

    // Fetch on mount and when filters/page change
    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    useEffect(() => {
        const hasProcessingItem = images.some((image) => image.status === 'processing');
        if (!hasProcessingItem) return;

        const intervalId = window.setInterval(() => {
            fetchImages(false);
        }, 8000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [images, fetchImages]);

    const handleFiltersChange = useCallback((newFilters: ImageFilterState) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page on filter change
    }, []);

    const handleView = useCallback((image: ProductImage) => {
        setPreviewImage(image);
    }, []);

    const handleDownload = useCallback((image: ProductImage, preferredUrl?: string) => {
        if (preferredUrl) {
            window.open(getImageUrl(preferredUrl), '_blank');
            return;
        }

        const generatedImages = image.generatedImages && image.generatedImages.length > 0
            ? image.generatedImages
            : image.generatedImageUrl
                ? [{ imageUrl: image.generatedImageUrl, status: image.status }]
                : [];

        const firstSuccessful = generatedImages.find((item) => item.imageUrl && item.status !== 'failed');
        const fallback = generatedImages[0];
        const resolvedUrl = firstSuccessful?.imageUrl || fallback?.imageUrl;

        if (resolvedUrl) {
            window.open(getImageUrl(resolvedUrl), '_blank');
        }
    }, []);

    const handleDelete = useCallback((image: ProductImage) => {
        setDeleteModal({ isOpen: true, image });
    }, []);

    const confirmDelete = useCallback(async () => {
        if (deleteModal.image) {
            try {
                await productImageApi.delete(deleteModal.image._id);
                // Refresh the list
                fetchImages();
            } catch (error) {
                console.error('Failed to delete image:', error);
            } finally {
                setDeleteModal({ isOpen: false, image: null });
            }
        }
    }, [deleteModal.image, fetchImages]);

    return (
        <div className="w-[96%] max-w-[1700px] mx-auto">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Xem ảnh</h1>
                <p className="text-gray-600">
                    Danh sách {pagination.total} lượt tạo ảnh (hỗ trợ nhiều góc)
                </p>
            </motion.div>

            {/* Filters */}
            <ImageFilters filters={filters} onFiltersChange={handleFiltersChange} />

            {/* Loading State */}
            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="aspect-square rounded-xl bg-gray-200 animate-pulse"
                        />
                    ))}
                </div>
            ) : images.length > 0 ? (
                /* Image Grid */
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                    {images.map((image, index) => (
                        <ImageCard
                            key={image._id}
                            image={image}
                            onView={handleView}
                            onDownload={handleDownload}
                            onDelete={handleDelete}
                            index={index}
                        />
                    ))}
                </div>
            ) : (
                /* Empty State */
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 bg-white rounded-2xl border border-gray-200"
                >
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 font-medium">Không tìm thấy ảnh nào</p>
                    <p className="text-gray-400 text-sm mt-1">Thử thay đổi bộ lọc hoặc tạo ảnh mới</p>
                </motion.div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* Preview Modal */}
            {previewImage && (
                <ImagePreviewModal
                    image={previewImage}
                    onClose={() => setPreviewImage(null)}
                    onDownload={handleDownload}
                />
            )}

            {/* Delete Confirm Modal */}
            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                title={deleteModal.image?.title || ''}
                onConfirm={confirmDelete}
                onClose={() => setDeleteModal({ isOpen: false, image: null })}
            />
        </div>
    );
}
