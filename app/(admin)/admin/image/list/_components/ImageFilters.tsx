'use client';

import { cn } from '@/lib/utils';
import { backgroundOptions, outputSizeOptions } from '@/lib/fakeData/image';

export interface ImageFilterState {
    search: string;
    backgroundType: string;
    outputSize: string;
}

interface ImageFiltersProps {
    filters: ImageFilterState;
    onFiltersChange: (filters: ImageFilterState) => void;
}

export default function ImageFilters({ filters, onFiltersChange }: ImageFiltersProps) {
    const handleReset = () => {
        onFiltersChange({
            search: '',
            backgroundType: '',
            outputSize: '',
        });
    };

    const hasFilters = filters.search || filters.backgroundType || filters.outputSize;

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm mb-6">
            <div className="flex flex-wrap items-center gap-4">
                {/* Search */}
                <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                            placeholder="Tìm kiếm theo tên..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Background Type */}
                <select
                    value={filters.backgroundType}
                    onChange={(e) => onFiltersChange({ ...filters, backgroundType: e.target.value })}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all min-w-[140px]"
                >
                    <option value="">Tất cả bối cảnh</option>
                    {backgroundOptions.filter(o => o.value !== 'custom').map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>

                {/* Output Size */}
                <select
                    value={filters.outputSize}
                    onChange={(e) => onFiltersChange({ ...filters, outputSize: e.target.value })}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all min-w-[120px]"
                >
                    <option value="">Tất cả kích thước</option>
                    {outputSizeOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>

                {/* Reset */}
                {hasFilters && (
                    <button
                        onClick={handleReset}
                        className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Đặt lại
                    </button>
                )}
            </div>
        </div>
    );
}
