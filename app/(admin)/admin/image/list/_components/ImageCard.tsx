'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ImageListItem, backgroundOptions, outputSizeOptions } from '@/lib/fakeData/image';

interface ImageCardProps {
    image: ImageListItem;
    onView: (image: ImageListItem) => void;
    onDownload: (image: ImageListItem) => void;
    onDelete: (image: ImageListItem) => void;
    index: number;
}

export default function ImageCard({ image, onView, onDownload, onDelete, index }: ImageCardProps) {
    const bgLabel = backgroundOptions.find(o => o.value === image.backgroundType)?.label || image.backgroundType;
    const sizeLabel = outputSizeOptions.find(o => o.value === image.outputSize)?.label || image.outputSize;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all"
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                    src={image.generatedUrl}
                    alt={image.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                        onClick={() => onView(image)}
                        className="p-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        title="Xem"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onDownload(image)}
                        className="p-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        title="Tải xuống"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onDelete(image)}
                        className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors"
                        title="Xóa"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>

                {/* Logo Badge */}
                {image.hasLogo && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                        Logo ✓
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-3">
                <h4 className="font-medium text-gray-900 truncate text-sm">{image.name}</h4>
                <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                        {bgLabel}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                        {sizeLabel}
                    </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                    {image.createdAt.toLocaleDateString('vi-VN')}
                </p>
            </div>
        </motion.div>
    );
}
