'use client';

import { channelOptions, statusOptions } from '@/lib/fakeData/marketing';

export interface PlanFilterState {
    search: string;
    status: string;
    channel: string;
}

interface PlanFiltersProps {
    filters: PlanFilterState;
    onFiltersChange: (filters: PlanFilterState) => void;
}

export default function PlanFilters({ filters, onFiltersChange }: PlanFiltersProps) {
    const handleReset = () => {
        onFiltersChange({
            search: '',
            status: '',
            channel: '',
        });
    };

    const hasFilters = filters.search || filters.status || filters.channel;

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
                            placeholder="Tìm theo tên chiến dịch..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Status */}
                <select
                    value={filters.status}
                    onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all min-w-[140px]"
                >
                    <option value="">Tất cả trạng thái</option>
                    {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>

                {/* Channel */}
                <select
                    value={filters.channel}
                    onChange={(e) => onFiltersChange({ ...filters, channel: e.target.value })}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all min-w-[140px]"
                >
                    <option value="">Tất cả kênh</option>
                    {channelOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.icon} {option.label}</option>
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
