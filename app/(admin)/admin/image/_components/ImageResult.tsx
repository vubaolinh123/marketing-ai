'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { ProductImage, getImageUrl } from '@/lib/api';
import { getCameraAngleLabel } from '@/lib/fakeData/image';

interface ImageResultProps {
    result: ProductImage;
    originalImageUrl: string;
    selectedAngles: string[];
    onReset: () => void;
    onRegenerate: () => void;
    isRegenerating?: boolean;
}

export default function ImageResult({ result, originalImageUrl, selectedAngles, onReset, onRegenerate, isRegenerating }: ImageResultProps) {
    const [viewMode, setViewMode] = useState<'compare' | 'full'>('compare');
    const [activeAngle, setActiveAngle] = useState<string>(selectedAngles[0] || 'wide');

    const normalizedGeneratedImages = result.generatedImages && result.generatedImages.length > 0
        ? result.generatedImages
        : [{
            angle: selectedAngles[0] || 'wide',
            imageUrl: result.generatedImageUrl || '',
            status: result.status,
            errorMessage: result.errorMessage
        }];

    const generatedByAngle = normalizedGeneratedImages.find((item) => item.angle === activeAngle)
        || normalizedGeneratedImages[0];

    const generatedUrl = generatedByAngle?.imageUrl ? getImageUrl(generatedByAngle.imageUrl) : '';
    const successfulCount = normalizedGeneratedImages.filter(item => item.imageUrl && item.status !== 'failed').length;
    const isProcessing = result.status === 'processing';
    const hasPartialFailure = normalizedGeneratedImages.some(item => item.status === 'failed');
    const isFailed = result.status === 'failed' && successfulCount === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Kết quả</h2>
                    <p className="text-gray-500">
                        {isProcessing ? 'Đang xử lý...' :
                            isFailed ? 'Lỗi tạo ảnh' :
                                hasPartialFailure
                                    ? `Đã tạo ${successfulCount}/${normalizedGeneratedImages.length} ảnh (một số góc lỗi)`
                                    :
                                `Đã tạo ${successfulCount}/${normalizedGeneratedImages.length} ảnh AI`}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('compare')}
                        className={cn(
                            'px-4 py-2 rounded-lg font-medium transition-all',
                            viewMode === 'compare'
                                ? 'bg-[#F59E0B] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                    >
                        So sánh
                    </button>
                    <button
                        onClick={() => setViewMode('full')}
                        className={cn(
                            'px-4 py-2 rounded-lg font-medium transition-all',
                            viewMode === 'full'
                                ? 'bg-[#F59E0B] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                    >
                        Toàn màn hình
                    </button>
                </div>
            </div>

            {/* Error State */}
            {isFailed && result.errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    <p className="font-medium">Lỗi: {result.errorMessage}</p>
                </div>
            )}

            {/* Angle tabs */}
            {normalizedGeneratedImages.length > 1 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                    <p className="text-sm text-gray-500 mb-3">Góc máy đã tạo</p>
                    <div className="flex flex-wrap gap-2">
                        {normalizedGeneratedImages.map((item) => (
                            <button
                                key={item.angle}
                                type="button"
                                onClick={() => setActiveAngle(item.angle)}
                                className={cn(
                                    'px-3 py-1.5 rounded-full text-sm border transition-all',
                                    activeAngle === item.angle
                                        ? 'border-[#F59E0B] bg-amber-50 text-[#F59E0B]'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                )}
                            >
                                {getCameraAngleLabel(item.angle)}
                                {item.status === 'failed' && ' • Lỗi'}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Multi preview grid */}
            {normalizedGeneratedImages.length > 1 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-600 mb-4">Tất cả ảnh đã tạo</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {normalizedGeneratedImages.map((item) => {
                            const url = item.imageUrl ? getImageUrl(item.imageUrl) : '';
                            const isItemFailed = item.status === 'failed';
                            return (
                                <div
                                    key={item.angle}
                                    className={cn(
                                        'rounded-xl border overflow-hidden bg-gray-50',
                                        activeAngle === item.angle ? 'border-[#F59E0B]' : 'border-gray-200'
                                    )}
                                >
                                    <div className="aspect-square bg-white flex items-center justify-center">
                                        {url ? (
                                            <img src={url} alt={item.angle} className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="text-center text-gray-400 px-4">
                                                <p className="text-sm">{isItemFailed ? 'Tạo ảnh thất bại' : 'Chưa có ảnh'}</p>
                                                {item.errorMessage && <p className="text-xs mt-1">{item.errorMessage}</p>}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 border-t border-gray-200 bg-white">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs font-medium text-gray-700">{getCameraAngleLabel(item.angle)}</span>
                                            {url && (
                                                <a
                                                    href={url}
                                                    download
                                                    className="text-xs text-[#F59E0B] hover:underline"
                                                >
                                                    Tải xuống
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Compare View */}
            {viewMode === 'compare' && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Original */}
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-3">Ảnh gốc</p>
                            <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                                <img
                                    src={originalImageUrl}
                                    alt="Original"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        {/* Generated */}
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                                Ảnh AI
                                <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700">
                                    {getCameraAngleLabel(generatedByAngle?.angle || activeAngle)}
                                </span>
                                <span className={cn(
                                    'px-2 py-0.5 rounded-full text-white text-xs',
                                    isProcessing ? 'bg-yellow-500' :
                                        isFailed ? 'bg-red-500' :
                                            'bg-gradient-to-r from-[#F59E0B] to-[#EA580C]'
                                )}>
                                    {isProcessing ? 'Processing' : isFailed ? 'Failed' : 'AI Generated'}
                                </span>
                            </p>
                            <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 relative group">
                                {generatedUrl ? (
                                    <>
                                        <img
                                            src={generatedUrl}
                                            alt="Generated"
                                            className="w-full h-full object-contain"
                                        />
                                        <a
                                            href={generatedUrl}
                                            download
                                            className="absolute bottom-3 right-3 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium text-gray-700 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Tải xuống
                                        </a>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        {isProcessing ? (
                                            <div className="text-center">
                                                <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-2" />
                                                <p>Đang xử lý...</p>
                                            </div>
                                        ) : (
                                            <p>Không có ảnh</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Image Info */}
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-gray-500">Bối cảnh</p>
                            <p className="font-medium text-gray-900 capitalize">{result.backgroundType}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-gray-500">Kích thước</p>
                            <p className="font-medium text-gray-900">{result.outputSize}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-gray-500">Logo</p>
                            <p className="font-medium text-gray-900">{result.useLogo ? result.logoPosition : 'Không'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-gray-500">Brand Settings</p>
                            <p className="font-medium text-gray-900">{result.usedBrandSettings ? 'Có' : 'Không'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 col-span-2 md:col-span-4">
                            <p className="text-gray-500">Góc đã chọn</p>
                            <p className="font-medium text-gray-900">
                                {(result.cameraAngles && result.cameraAngles.length > 0 ? result.cameraAngles : selectedAngles)
                                    .map(getCameraAngleLabel)
                                    .join(', ')}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Full View */}
            {viewMode === 'full' && generatedUrl && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="relative group max-w-3xl mx-auto">
                        <img
                            src={generatedUrl}
                            alt="Generated"
                            className="w-full rounded-xl"
                        />
                        <a
                            href={generatedUrl}
                            download
                            className="absolute bottom-4 right-4 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium text-gray-700 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Tải xuống
                        </a>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-center gap-4">
                <Button
                    onClick={onRegenerate}
                    variant="secondary"
                    size="lg"
                    disabled={isRegenerating}
                >
                    {isRegenerating ? (
                        <>
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                            Đang tạo lại...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Tạo lại
                        </>
                    )}
                </Button>
                <Button onClick={onReset} variant="primary" size="lg">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tạo ảnh mới
                </Button>
            </div>
        </motion.div>
    );
}
