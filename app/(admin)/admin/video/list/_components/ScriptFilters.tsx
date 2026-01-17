'use client';

import { motion } from 'framer-motion';
import { durationOptions, sizeOptions } from '@/lib/fakeData';

export interface ScriptFilterState {
    search: string;
    duration: string;
    size: string;
}

interface ScriptFiltersProps {
    filters: ScriptFilterState;
    onFiltersChange: (filters: ScriptFilterState) => void;
}

export default function ScriptFilters({ filters, onFiltersChange }: ScriptFiltersProps) {
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
                            placeholder="Khách hàng, tiêu đề..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Duration */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Thời lượng
                    </label>
                    <select
                        value={filters.duration}
                        onChange={(e) => onFiltersChange({ ...filters, duration: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    >
                        <option value="">Tất cả</option>
                        {durationOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Size */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Kích thước
                    </label>
                    <select
                        value={filters.size}
                        onChange={(e) => onFiltersChange({ ...filters, size: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    >
                        <option value="">Tất cả</option>
                        {sizeOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Reset Button */}
                <div className="flex items-end">
                    <button
                        onClick={() => onFiltersChange({ search: '', duration: '', size: '' })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                    >
                        Xóa bộ lọc
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
