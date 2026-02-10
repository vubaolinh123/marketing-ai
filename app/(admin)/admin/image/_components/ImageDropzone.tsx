'use client';

import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ImageDropzoneProps {
    images: File[];
    onChange: (files: File[]) => void;
    disabled?: boolean;
    maxImages?: number; // Default 1
}

export default function ImageDropzone({ images, onChange, disabled, maxImages = 1 }: ImageDropzoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const hasMaxImages = images.length >= maxImages;

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled || hasMaxImages) return;

        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        if (files.length > 0) {
            // Replace images (single image mode)
            onChange([files[0]]);
        }
    }, [onChange, disabled, hasMaxImages]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled || hasMaxImages) return;
        const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
        if (files.length > 0) {
            // Replace images (single image mode)
            onChange([files[0]]);
        }
        // Reset input value to allow selecting same file again
        e.target.value = '';
    }, [onChange, disabled, hasMaxImages]);

    const removeImage = useCallback((index: number) => {
        onChange(images.filter((_, i) => i !== index));
    }, [images, onChange]);

    return (
        <div className="space-y-4">
            {/* Dropzone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    'relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer',
                    isDragging
                        ? 'border-[#F59E0B] bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50',
                    disabled && 'opacity-50 cursor-not-allowed'
                )}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={disabled || hasMaxImages}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center gap-3">
                    <div className={cn(
                        'w-16 h-16 rounded-2xl flex items-center justify-center',
                        isDragging ? 'bg-[#F59E0B] text-white' : 'bg-gray-200 text-gray-500'
                    )}>
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-gray-700">
                            {isDragging ? 'Thả ảnh vào đây...' : 'Kéo thả ảnh sản phẩm vào đây'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">hoặc click để chọn file</p>
                    </div>
                    <p className="text-xs text-gray-400">PNG, JPG, WEBP (tối đa 10MB) - Chỉ 1 ảnh nguồn, AI sẽ tạo nhiều góc</p>
                </div>
            </div>

            {/* Preview Images */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((file, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white"
                        >
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                disabled={disabled}
                                className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                <p className="text-white text-xs truncate">{file.name}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
