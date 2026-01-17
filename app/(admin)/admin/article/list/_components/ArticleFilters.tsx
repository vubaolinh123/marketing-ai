'use client';

import { motion } from 'framer-motion';
import { fakeTopics, purposeOptions } from '@/lib/fakeData';

export interface FilterState {
    topic: string;
    purpose: string;
    search: string;
}

interface ArticleFiltersProps {
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
}

export default function ArticleFilters({ filters, onFiltersChange }: ArticleFiltersProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6 shadow-sm mb-6"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Tìm kiếm
                    </label>
                    <div className="relative">
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                            placeholder="Tìm theo tiêu đề..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Topic */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Chủ đề
                    </label>
                    <select
                        value={filters.topic}
                        onChange={(e) => onFiltersChange({ ...filters, topic: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                    >
                        <option value="">Tất cả chủ đề</option>
                        {fakeTopics.map((topic) => (
                            <option key={topic.value} value={topic.value}>
                                {topic.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Purpose */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Mục đích
                    </label>
                    <select
                        value={filters.purpose}
                        onChange={(e) => onFiltersChange({ ...filters, purpose: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                    >
                        <option value="">Tất cả mục đích</option>
                        {purposeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.icon} {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Reset Button */}
                <div className="flex items-end">
                    <button
                        onClick={() => onFiltersChange({ topic: '', purpose: '', search: '' })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                    >
                        Xóa bộ lọc
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
