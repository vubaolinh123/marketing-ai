'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { ProductImage, getImageUrl } from '@/lib/api';

interface ImageResultProps {
    result: ProductImage;
    originalImageUrl: string;
    onReset: () => void;
    onRegenerate: () => void;
    isRegenerating?: boolean;
}

export default function ImageResult({ result, originalImageUrl, onReset, onRegenerate, isRegenerating }: ImageResultProps) {
    const [viewMode, setViewMode] = useState<'compare' | 'full'>('compare');

    const generatedUrl = result.generatedImageUrl ? getImageUrl(result.generatedImageUrl) : '';
    const isProcessing = result.status === 'processing';
    const isFailed = result.status === 'failed';

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
                                'Đã tạo ảnh AI thành công'}
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
