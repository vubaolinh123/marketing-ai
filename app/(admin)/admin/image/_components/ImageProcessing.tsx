'use client';

import { motion } from 'framer-motion';

interface ImageProcessingProps {
    imageCount: number;
}

export default function ImageProcessing({ imageCount }: ImageProcessingProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
        >
            {/* Animated Icon */}
            <div className="relative mb-8">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="w-24 h-24 rounded-full border-4 border-gray-200 border-t-[#F59E0B]"
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <svg className="w-10 h-10 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </motion.div>
            </div>

            {/* Text */}
            <motion.h3
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-xl font-semibold text-gray-900 mb-2"
            >
                AI đang xử lý ảnh...
            </motion.h3>
            <p className="text-gray-500 mb-6">
                Đang tạo bối cảnh và ghép logo cho {imageCount} ảnh
            </p>

            {/* Progress Steps */}
            <div className="flex items-center gap-3">
                {['Phân tích', 'Tạo bối cảnh', 'Ghép logo', 'Hoàn tất'].map((step, index) => (
                    <motion.div
                        key={step}
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.3 }}
                        className="flex items-center gap-2"
                    >
                        <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                        <span className="text-sm text-gray-600">{step}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
