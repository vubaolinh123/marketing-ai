'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';

const tools = [
    {
        title: 'Tạo bài viết AI',
        description: 'Tự động tạo nội dung bài viết marketing chất lượng cao',
        href: '/admin/article',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
        ),
        color: 'from-amber-500 to-orange-500',
    },
    {
        title: 'Tạo ảnh AI',
        description: 'Tạo ảnh sản phẩm độc đáo cho thương hiệu',
        href: '/admin/image',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        color: 'from-orange-500 to-red-500',
    },
    {
        title: 'Kế hoạch Marketing',
        description: 'Lên lịch đăng bài tự động theo chiến lược',
        href: '/admin/marketing',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        color: 'from-yellow-500 to-amber-500',
    },
    {
        title: 'Kịch bản Video',
        description: 'Tạo kịch bản video chuyên nghiệp với AI',
        href: '/admin/video',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        ),
        color: 'from-red-500 to-pink-500',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94] as const
        }
    }
};

export default function AdminDashboard() {
    const { user } = useAuth();

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto"
        >
            {/* Welcome Header */}
            <motion.div variants={itemVariants} className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Xin chào, {user?.username}! 👋
                </h1>
                <p className="text-gray-600">
                    Chọn công cụ AI để bắt đầu tạo nội dung marketing.
                </p>
            </motion.div>

            {/* Tool Cards Grid */}
            <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                {tools.map((tool, index) => (
                    <motion.div
                        key={tool.href}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Link href={tool.href}>
                            <div className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        {tool.icon}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#F59E0B] transition-colors">
                                            {tool.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {tool.description}
                                        </p>
                                    </div>

                                    {/* Arrow */}
                                    <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                        <svg className="w-5 h-5 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>

            {/* Quick Stats */}
            <motion.div variants={itemVariants} className="mt-8">
                <div className="bg-gradient-to-r from-[#1F2937] via-[#111827] to-[#0F172A] rounded-2xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-4">Thống kê nhanh</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 rounded-xl bg-white/10">
                            <div className="text-2xl font-bold text-[#FBBF24]">0</div>
                            <div className="text-sm text-gray-300">Bài viết</div>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-white/10">
                            <div className="text-2xl font-bold text-[#FBBF24]">0</div>
                            <div className="text-sm text-gray-300">Ảnh AI</div>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-white/10">
                            <div className="text-2xl font-bold text-[#FBBF24]">0</div>
                            <div className="text-sm text-gray-300">Kế hoạch</div>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-white/10">
                            <div className="text-2xl font-bold text-[#FBBF24]">0</div>
                            <div className="text-sm text-gray-300">Video</div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
