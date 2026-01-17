'use client';

import { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { fakeImageList, ImageListItem } from '@/lib/fakeData/image';
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
        outputSize: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [images, setImages] = useState<ImageListItem[]>(fakeImageList);
    const [previewImage, setPreviewImage] = useState<ImageListItem | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; image: ImageListItem | null }>({
        isOpen: false,
        image: null,
    });

    // Filtered images
    const filteredImages = useMemo(() => {
        return images.filter(image => {
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                if (!image.name.toLowerCase().includes(searchLower)) {
                    return false;
                }
            }
            if (filters.backgroundType && image.backgroundType !== filters.backgroundType) {
                return false;
            }
            if (filters.outputSize && image.outputSize !== filters.outputSize) {
                return false;
            }
            return true;
        });
    }, [images, filters]);

    // Paginated images
    const paginatedImages = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredImages.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredImages, currentPage]);

    const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE);

    const handleFiltersChange = useCallback((newFilters: ImageFilterState) => {
        setFilters(newFilters);
        setCurrentPage(1);
    }, []);

    const handleView = useCallback((image: ImageListItem) => {
        setPreviewImage(image);
    }, []);

    const handleDownload = useCallback((image: ImageListItem) => {
        window.open(image.generatedUrl, '_blank');
    }, []);

    const handleDelete = useCallback((image: ImageListItem) => {
        setDeleteModal({ isOpen: true, image });
    }, []);

    const confirmDelete = useCallback(() => {
        if (deleteModal.image) {
            setImages(prev => prev.filter(img => img.id !== deleteModal.image!.id));
            setDeleteModal({ isOpen: false, image: null });
        }
    }, [deleteModal.image]);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Xem ảnh</h1>
                <p className="text-gray-600">
                    Danh sách {filteredImages.length} ảnh đã tạo
                </p>
            </motion.div>

            {/* Filters */}
            <ImageFilters filters={filters} onFiltersChange={handleFiltersChange} />

            {/* Image Grid */}
            {paginatedImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                    {paginatedImages.map((image, index) => (
                        <ImageCard
                            key={image.id}
                            image={image}
                            onView={handleView}
                            onDownload={handleDownload}
                            onDelete={handleDelete}
                            index={index}
                        />
                    ))}
                </div>
            ) : (
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
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
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
                title={deleteModal.image?.name || ''}
                onConfirm={confirmDelete}
                onClose={() => setDeleteModal({ isOpen: false, image: null })}
            />
        </div>
    );
}
