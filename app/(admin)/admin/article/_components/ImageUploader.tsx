'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
    images: File[];
    onImagesChange: (images: File[]) => void;
}

export default function ImageUploader({ images, onImagesChange }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files).filter(file =>
            file.type.startsWith('image/')
        );

        if (files.length > 0) {
            onImagesChange([...images, ...files]);
        }
    }, [images, onImagesChange]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []).filter(file =>
            file.type.startsWith('image/')
        );

        if (files.length > 0) {
            onImagesChange([...images, ...files]);
        }
    }, [images, onImagesChange]);

    const removeImage = useCallback((index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    }, [images, onImagesChange]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
        >
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload hình ảnh
            </label>

            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    'relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200',
                    isDragging
                        ? 'border-[#F59E0B] bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                )}
            >
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center gap-3">
                    <div className={cn(
                        'w-16 h-16 rounded-full flex items-center justify-center transition-colors',
                        isDragging
                            ? 'bg-[#F59E0B] text-white'
                            : 'bg-gray-100 text-gray-400'
                    )}>
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-gray-700 font-medium">
                            Kéo thả ảnh vào đây
                        </p>
                        <p className="text-sm text-gray-500">
                            hoặc click để chọn file
                        </p>
                    </div>
                </div>
            </div>

            {/* Image Previews */}
            <AnimatePresence>
                {images.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                    >
                        {images.map((file, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative aspect-square rounded-xl overflow-hidden group"
                            >
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
