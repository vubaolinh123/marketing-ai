'use client';

import { motion } from 'framer-motion';

export default function GeneratingLoader() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl"
            >
                {/* AI Icon Animation */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                    {/* Outer ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#F59E0B] border-r-[#EA580C]"
                    />
                    {/* Inner ring */}
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-2 rounded-full border-4 border-transparent border-b-[#F59E0B] border-l-[#EA580C]"
                    />
                    {/* Center icon */}
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#EA580C] flex items-center justify-center">
                        <motion.svg
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="w-8 h-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </motion.svg>
                    </div>
                </div>

                {/* Text */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    AI đang tạo bài viết...
                </h3>
                <p className="text-gray-500 mb-4">
                    Vui lòng đợi trong giây lát
                </p>

                {/* Progress dots */}
                <div className="flex justify-center gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                            className="w-3 h-3 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#EA580C]"
                        />
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
