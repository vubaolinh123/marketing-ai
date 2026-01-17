'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ImageListItem, backgroundOptions, outputSizeOptions } from '@/lib/fakeData/image';

interface ImagePreviewModalProps {
    image: ImageListItem | null;
    onClose: () => void;
    onDownload: (image: ImageListItem) => void;
}

export default function ImagePreviewModal({ image, onClose, onDownload }: ImagePreviewModalProps) {
    if (!image) return null;

    const bgLabel = backgroundOptions.find(o => o.value === image.backgroundType)?.label || image.backgroundType;
    const sizeLabel = outputSizeOptions.find(o => o.value === image.outputSize)?.label || image.outputSize;

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
                    className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <div>
                            <h3 className="font-semibold text-gray-900">{image.name}</h3>
                            <p className="text-sm text-gray-500">
                                {image.createdAt.toLocaleDateString('vi-VN', {
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
                    <div className="p-4 bg-gray-50">
                        <div className="relative rounded-xl overflow-hidden bg-white shadow-inner max-h-[60vh] flex items-center justify-center">
                            <img
                                src={image.generatedUrl}
                                alt={image.name}
                                className="max-w-full max-h-[60vh] object-contain"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
                                {bgLabel}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                                {sizeLabel}
                            </span>
                            {image.hasLogo && (
                                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                                    Có Logo
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => onDownload(image)}
                            className="px-4 py-2 bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white rounded-lg font-medium flex items-center gap-2 hover:shadow-lg transition-all"
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
