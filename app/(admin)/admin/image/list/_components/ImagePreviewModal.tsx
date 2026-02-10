'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ProductImage, getImageUrl } from '@/lib/api';
import { backgroundOptions, getCameraAngleLabel, outputSizeOptions } from '@/lib/fakeData/image';

interface ImagePreviewModalProps {
    image: ProductImage | null;
    onClose: () => void;
    onDownload: (image: ProductImage, targetUrl?: string) => void;
}

export default function ImagePreviewModal({ image, onClose, onDownload }: ImagePreviewModalProps) {
    if (!image) return null;

    const bgLabel = backgroundOptions.find(o => o.value === image.backgroundType)?.label || image.backgroundType;
    const sizeLabel = outputSizeOptions.find(o => o.value === image.outputSize)?.label || image.outputSize;
    const generatedImages = image.generatedImages && image.generatedImages.length > 0
        ? image.generatedImages
        : image.generatedImageUrl
            ? [{ angle: image.cameraAngles?.[0] || 'wide', imageUrl: image.generatedImageUrl, status: image.status }]
            : [];

    const coverImage = generatedImages.find(item => item.imageUrl && item.status !== 'failed') || generatedImages[0];
    const imageUrl = coverImage?.imageUrl ? getImageUrl(coverImage.imageUrl) : '';
    const shouldUseWideLayout = generatedImages.length >= 4;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className={[
                        'bg-white rounded-2xl shadow-2xl w-full max-h-[92vh] overflow-hidden border border-gray-200',
                        shouldUseWideLayout ? 'max-w-[1280px]' : 'max-w-4xl'
                    ].join(' ')}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <div>
                            <h3 className="font-semibold text-gray-900">{image.title}</h3>
                            <p className="text-sm text-gray-500">
                                {new Date(image.createdAt).toLocaleDateString('vi-VN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
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

                    {/* Image */}
                    <div className="p-4 bg-gray-50 space-y-4">
                        <div className="relative rounded-xl overflow-hidden bg-white shadow-inner max-h-[60vh] flex items-center justify-center">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={image.title}
                                    className="max-w-full max-h-[60vh] object-contain"
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
                                <div className={[
                                    'grid gap-3',
                                    generatedImages.length >= 5
                                        ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-5'
                                        : generatedImages.length === 4
                                            ? 'grid-cols-2 lg:grid-cols-4'
                                            : 'grid-cols-2 md:grid-cols-3'
                                ].join(' ')}>
                                {generatedImages.map((item) => {
                                    const itemUrl = item.imageUrl ? getImageUrl(item.imageUrl) : '';
                                    return (
                                        <div key={item.angle} className="rounded-lg border border-gray-200 overflow-hidden bg-white">
                                            <div className="aspect-[4/5] bg-gray-50 flex items-center justify-center">
                                                {itemUrl ? (
                                                    <img src={itemUrl} alt={item.angle} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xs text-gray-400 px-2 text-center">Chưa có ảnh</span>
                                                )}
                                            </div>
                                            <div className="p-2 border-t border-gray-100">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="text-xs font-medium text-gray-700 truncate">{getCameraAngleLabel(item.angle)}</p>
                                                    {itemUrl && (
                                                        <button
                                                            onClick={() => onDownload(image, item.imageUrl)}
                                                            className="text-[10px] text-[#F59E0B] font-semibold hover:underline"
                                                        >
                                                            Tải
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
                                {bgLabel}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                                {sizeLabel}
                            </span>
                            {image.useLogo && (
                                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                                    Có Logo
                                </span>
                            )}
                            {image.usedBrandSettings && (
                                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                                    Brand Settings
                                </span>
                            )}
                            {generatedImages.length > 1 && (
                                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                                    {generatedImages.length} góc máy
                                </span>
                            )}
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
