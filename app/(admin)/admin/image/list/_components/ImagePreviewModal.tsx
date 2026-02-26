'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductImage, getImageUrl } from '@/lib/api';
import { backgroundOptions, getCameraAngleLabel, outputSizeOptions } from '@/lib/fakeData/image';

interface ImagePreviewModalProps {
    image: ProductImage | null;
    onClose: () => void;
    onDownload: (image: ProductImage, targetUrl?: string) => void;
}

const STABLE_DATE_PARTS_FORMATTER = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
});

const formatDateStable = (dateInput: Date | string | number) => {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const parts = STABLE_DATE_PARTS_FORMATTER.formatToParts(date);
    const day = parts.find(part => part.type === 'day')?.value;
    const month = parts.find(part => part.type === 'month')?.value;
    const year = parts.find(part => part.type === 'year')?.value;

    if (!day || !month || !year) {
        return STABLE_DATE_PARTS_FORMATTER.format(date);
    }

    return `${day}/${month}/${year}`;
};

export default function ImagePreviewModal({ image, onClose, onDownload }: ImagePreviewModalProps) {
    const generatedImages = useMemo(() => {
        if (!image) return [];

        return image.generatedImages && image.generatedImages.length > 0
            ? image.generatedImages
            : image.generatedImageUrl
                ? [{ angle: image.cameraAngles?.[0] || 'wide', imageUrl: image.generatedImageUrl, status: image.status }]
                : [];
    }, [image]);

    const coverImage = generatedImages.find(item => item.imageUrl && item.status !== 'failed') || generatedImages[0];
    const selectedFallback = coverImage?.imageUrl || coverImage?.angle || '';
    const [selectedKey, setSelectedKey] = useState('');

    useEffect(() => {
        setSelectedKey(selectedFallback);
    }, [image?._id, selectedFallback]);

    const selectedImage = useMemo(() => {
        if (!generatedImages.length) return undefined;
        return generatedImages.find(item => (item.imageUrl || item.angle || '') === selectedKey) || coverImage || generatedImages[0];
    }, [generatedImages, selectedKey, coverImage]);

    const imageUrl = selectedImage?.imageUrl ? getImageUrl(selectedImage.imageUrl) : '';

    if (!image) return null;

    const bgLabel = backgroundOptions.find(o => o.value === image.backgroundType)?.label || image.backgroundType;
    const sizeLabel = outputSizeOptions.find(o => o.value === image.outputSize)?.label || image.outputSize;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[120] flex items-start justify-center px-4 sm:px-6 pt-24 sm:pt-28 pb-6 sm:pb-8 overflow-y-auto bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-[1480px] max-h-[calc(100dvh-7.5rem)] sm:max-h-[calc(100dvh-9rem)] overflow-hidden border border-gray-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <div>
                            <h3 className="font-semibold text-gray-900">{image.title}</h3>
                            <p className="text-sm text-gray-500">
                                {formatDateStable(image.createdAt)}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Image + Info */}
                    <div className="p-4 bg-gray-50">
                        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-4">
                            <div className="space-y-4 min-w-0">
                                <div className="relative rounded-xl overflow-hidden bg-white shadow-inner min-h-[45vh] max-h-[62vh] flex items-center justify-center">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={image.title}
                                            className="max-w-full max-h-[62vh] object-contain"
                                        />
                                    ) : (
                                        <div className="py-20 text-gray-400 text-center">
                                            <svg className="w-16 h-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p>Không có ảnh</p>
                                        </div>
                                    )}
                                </div>

                                {generatedImages.length > 1 && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-600">Bộ ảnh theo góc máy</p>
                                        <div className="flex gap-3 overflow-x-auto pb-1">
                                            {generatedImages.map((item, index) => {
                                                const key = item.imageUrl || item.angle || `${index}`;
                                                const itemUrl = item.imageUrl ? getImageUrl(item.imageUrl) : '';
                                                const isActive = key === (selectedImage?.imageUrl || selectedImage?.angle || '');

                                                return (
                                                    <button
                                                        key={`${item.angle}-${index}`}
                                                        type="button"
                                                        onClick={() => setSelectedKey(key)}
                                                        className={[
                                                            'group w-[126px] min-w-[126px] rounded-lg border overflow-hidden bg-white text-left transition-all',
                                                            isActive
                                                                ? 'border-[#F59E0B] ring-2 ring-amber-200 shadow-sm'
                                                                : 'border-gray-200 hover:border-amber-300'
                                                        ].join(' ')}
                                                    >
                                                        <div className="aspect-[4/5] bg-gray-50 flex items-center justify-center">
                                                            {itemUrl ? (
                                                                <img src={itemUrl} alt={item.angle} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-xs text-gray-400 px-2 text-center">Chưa có ảnh</span>
                                                            )}
                                                        </div>
                                                        <div className="px-2 py-1.5 border-t border-gray-100">
                                                            <p className="text-[11px] font-medium text-gray-700 truncate">{getCameraAngleLabel(item.angle)}</p>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-4 h-fit space-y-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-2">Thông tin ảnh</p>
                                    <div className="grid grid-cols-1 gap-2 text-sm">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-gray-500">Ngày tạo</span>
                                            <span className="font-medium text-gray-800">{formatDateStable(image.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-gray-500">Ảnh đã tạo</span>
                                            <span className="font-medium text-gray-800">{generatedImages.length}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-gray-500">Góc đang xem</span>
                                            <span className="font-medium text-gray-800 truncate text-right max-w-[170px]">
                                                {selectedImage ? getCameraAngleLabel(selectedImage.angle) : '-'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                                        {bgLabel}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                        {sizeLabel}
                                    </span>
                                    {image.useLogo && (
                                        <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                            Có Logo
                                        </span>
                                    )}
                                    {image.usedBrandSettings && (
                                        <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                            Brand Settings
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={() => onDownload(image, selectedImage?.imageUrl)}
                                    disabled={!selectedImage?.imageUrl}
                                    className="w-full px-4 py-2 bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Tải ảnh đang xem
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            {generatedImages.length > 1 ? `${generatedImages.length} góc máy đã tạo` : '1 ảnh đã tạo'}
                        </div>
                        <button
                            onClick={() => onDownload(image, imageUrl || undefined)}
                            disabled={!imageUrl}
                            className="px-4 py-2 bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white rounded-lg font-medium flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Tải xuống
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
