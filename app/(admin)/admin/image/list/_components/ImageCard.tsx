'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ProductImage, getImageUrl } from '@/lib/api';
import { backgroundOptions, getCameraAngleLabel, outputSizeOptions } from '@/lib/fakeData/image';

interface ImageCardProps {
    image: ProductImage;
    onView: (image: ProductImage) => void;
    onDownload: (image: ProductImage, targetUrl?: string) => void;
    onDelete: (image: ProductImage) => void;
    index: number;
}

export default function ImageCard({ image, onView, onDownload, onDelete, index }: ImageCardProps) {
    const bgLabel = backgroundOptions.find(o => o.value === image.backgroundType)?.label || image.backgroundType;
    const sizeLabel = outputSizeOptions.find(o => o.value === image.outputSize)?.label || image.outputSize;
    const generatedImages = image.generatedImages && image.generatedImages.length > 0
        ? image.generatedImages
        : image.generatedImageUrl
            ? [{ angle: image.cameraAngles?.[0] || 'wide', imageUrl: image.generatedImageUrl, status: image.status }]
            : [];

    const successfulImages = generatedImages.filter(item => item.imageUrl && item.status !== 'failed');
    const coverImage = successfulImages[0] || generatedImages[0];
    const imageUrl = coverImage?.imageUrl ? getImageUrl(coverImage.imageUrl) : '';
    const totalAngles = (image.cameraAngles && image.cameraAngles.length > 0)
        ? image.cameraAngles.length
        : generatedImages.length;
    const isProcessing = image.status === 'processing';
    const isFailed = image.status === 'failed';
    const isStale = !!image.isProcessingStale;
    const isLikelyRunning = !!image.isLikelyRunning;

    const showOverlayActions = !!imageUrl;
    const statusText = isProcessing
        ? (isStale ? 'Đang xử lý quá lâu' : 'Đang xử lý')
        : isFailed
            ? 'Lỗi'
            : 'Logo ✓';

    const statusClassName = isProcessing
        ? (isStale ? 'bg-orange-100/95 text-orange-700' : 'bg-yellow-100/90 text-yellow-700')
        : isFailed
            ? 'bg-red-100/90 text-red-700'
            : image.useLogo
                ? 'bg-white/90 text-gray-700'
                : 'hidden';

    const heartbeatLabel = image.processingLastHeartbeatAt || image.processingHeartbeatAt;
    const lastHeartbeatText = heartbeatLabel
        ? new Date(heartbeatLabel).toLocaleTimeString('vi-VN')
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all"
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={image.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        {isProcessing ? (
                            <div className="text-center">
                                <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-2" />
                                <p className="text-xs">Đang xử lý...</p>
                            </div>
                        ) : (
                            <p className="text-xs">Không có ảnh</p>
                        )}
                    </div>
                )}

                {/* Hover Overlay */}
                {showOverlayActions && (
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
                            onClick={() => onDownload(image, coverImage?.imageUrl)}
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
                )}

                {/* Always-available delete button (including no-image processing cards) */}
                {!showOverlayActions && (
                    <button
                        onClick={() => onDelete(image)}
                        className="absolute top-2 left-2 p-2 bg-red-500/95 rounded-lg text-white hover:bg-red-600 transition-colors shadow"
                        title={isLikelyRunning ? 'Hủy tiến trình & xóa' : 'Xóa'}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}

                {/* Status Badge */}
                <div className={cn(
                    'absolute top-2 right-2 px-2 py-1 backdrop-blur-sm rounded-full text-xs font-medium',
                    statusClassName
                )}>
                    {statusText}
                </div>

                {totalAngles > 1 && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-amber-100/90 text-amber-700 rounded-full text-xs font-medium">
                        {totalAngles} góc
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-3">
                <h4 className="font-medium text-gray-900 truncate text-sm">{image.title}</h4>
                {isProcessing && (
                    <p className={cn(
                        'mt-1 text-xs',
                        isStale ? 'text-orange-600' : 'text-amber-600'
                    )}>
                        {isStale
                            ? 'Tiến trình có dấu hiệu bị kẹt, bạn có thể xóa hoặc tạo lại.'
                            : 'Ảnh đang được xử lý ở backend...'}
                        {lastHeartbeatText ? ` (cập nhật cuối: ${lastHeartbeatText})` : ''}
                    </p>
                )}
                {isFailed && image.errorMessage && (
                    <p className="mt-1 text-xs text-red-600 line-clamp-2">{image.errorMessage}</p>
                )}
                {generatedImages.length > 0 && (
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                        {generatedImages.slice(0, 2).map(item => (
                            <span
                                key={item.angle}
                                className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-medium"
                            >
                                {getCameraAngleLabel(item.angle)}
                            </span>
                        ))}
                        {generatedImages.length > 2 && (
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium">
                                +{generatedImages.length - 2}
                            </span>
                        )}
                    </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                        {bgLabel}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                        {sizeLabel}
                    </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                    {new Date(image.createdAt).toLocaleDateString('vi-VN')}
                </p>
            </div>
        </motion.div>
    );
}
