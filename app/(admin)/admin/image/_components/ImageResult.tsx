'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ImageResultProps {
    originalImages: string[];
    generatedImages: string[];
    onReset: () => void;
    onRegenerate: () => void;
}

export default function ImageResult({ originalImages, generatedImages, onReset, onRegenerate }: ImageResultProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [viewMode, setViewMode] = useState<'compare' | 'grid'>('compare');

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
                    <p className="text-gray-500">Đã tạo {generatedImages.length} ảnh AI</p>
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
                        onClick={() => setViewMode('grid')}
                        className={cn(
                            'px-4 py-2 rounded-lg font-medium transition-all',
                            viewMode === 'grid'
                                ? 'bg-[#F59E0B] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                    >
                        Lưới
                    </button>
                </div>
            </div>

            {/* Compare View */}
            {viewMode === 'compare' && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Original */}
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-3">Ảnh gốc</p>
                            <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                                <img
                                    src={originalImages[selectedIndex]}
                                    alt="Original"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        {/* Generated */}
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                                Ảnh AI
                                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white text-xs">
                                    AI Generated
                                </span>
                            </p>
                            <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 relative group">
                                <img
                                    src={generatedImages[selectedIndex]}
                                    alt="Generated"
                                    className="w-full h-full object-contain"
                                />
                                <a
                                    href={generatedImages[selectedIndex]}
                                    download
                                    className="absolute bottom-3 right-3 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium text-gray-700 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Tải xuống
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Thumbnails */}
                    {generatedImages.length > 1 && (
                        <div className="flex gap-3 mt-6 justify-center">
                            {generatedImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedIndex(index)}
                                    className={cn(
                                        'w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
                                        selectedIndex === index
                                            ? 'border-[#F59E0B] shadow-lg'
                                            : 'border-gray-200 opacity-60 hover:opacity-100'
                                    )}
                                >
                                    <img
                                        src={generatedImages[index]}
                                        alt={`Thumb ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {generatedImages.map((url, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm"
                        >
                            <img
                                src={url}
                                alt={`Generated ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <a
                                    href={url}
                                    download
                                    className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Tải xuống
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-center gap-4">
                <Button onClick={onRegenerate} variant="secondary" size="lg">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Tạo lại
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
