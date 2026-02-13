'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { getMarketingPlans, deleteMarketingPlan, MarketingPlanListItem } from '@/lib/api/marketingPlan.api';
import { PlanFilterState } from './_components/PlanFilters';
import { showSuccess, showError } from '@/lib/toast';

// Dynamic imports
const PlanFilters = dynamic(() => import('./_components/PlanFilters'), { ssr: false });
const PlanCard = dynamic(() => import('./_components/PlanCard'), { ssr: false });
const Pagination = dynamic(() => import('@/app/(admin)/admin/article/list/_components/Pagination'), { ssr: false });
const DeleteConfirmModal = dynamic(() => import('@/app/(admin)/admin/article/list/_components/DeleteConfirmModal'), { ssr: false });
const PlanDetailModal = dynamic(() => import('./_components/PlanDetailModal'), { ssr: false });

const ITEMS_PER_PAGE = 6;

// Convert API response to PlanListItem format for components
interface PlanListItem {
    id: string;
    campaignName: string;
    startDate: Date;
    endDate: Date;
    totalPosts: number;
    channels: string[];
    status: 'processing' | 'failed' | 'active' | 'completed' | 'draft';
    createdAt: Date;
}

function convertApiToListItem(apiPlan: MarketingPlanListItem): PlanListItem {
    return {
        id: apiPlan._id,
        campaignName: apiPlan.campaignName,
        startDate: new Date(apiPlan.startDate),
        endDate: new Date(apiPlan.endDate),
        totalPosts: apiPlan.totalPosts,
        channels: apiPlan.channels,
        status: apiPlan.status,
        createdAt: new Date(apiPlan.createdAt),
    };
}

export default function MarketingListPage() {
    const [filters, setFilters] = useState<PlanFilterState>({
        search: '',
        status: '',
        channel: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [plans, setPlans] = useState<PlanListItem[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; plan: PlanListItem | null }>({
        isOpen: false,
        plan: null,
    });
    const [viewModal, setViewModal] = useState<{ isOpen: boolean; planId: string | null }>({
        isOpen: false,
        planId: null,
    });

    // Fetch plans from API
    const fetchPlans = useCallback(async (withLoading = true) => {
        if (withLoading) {
            setIsLoading(true);
        }
        try {
            const result = await getMarketingPlans({
                page: currentPage,
                limit: ITEMS_PER_PAGE,
                status: filters.status || undefined,
            });

            const convertedPlans = result.plans.map(convertApiToListItem);

            // Client-side search filter (since backend may not support it)
            const filteredPlans = convertedPlans.filter(plan => {
                if (filters.search) {
                    const searchLower = filters.search.toLowerCase();
                    if (!plan.campaignName.toLowerCase().includes(searchLower)) {
                        return false;
                    }
                }
                if (filters.channel && !plan.channels.includes(filters.channel)) {
                    return false;
                }
                return true;
            });

            setPlans(filteredPlans);
            setTotalPages(result.pagination.totalPages);
            setTotalItems(result.pagination.total);
        } catch (error) {
            console.error('Error fetching plans:', error);
            showError('Không thể tải danh sách kế hoạch');
            setPlans([]);
        } finally {
            if (withLoading) {
                setIsLoading(false);
            }
        }
    }, [currentPage, filters.status, filters.search, filters.channel]);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    useEffect(() => {
        const hasProcessingItem = plans.some((plan) => plan.status === 'processing');
        if (!hasProcessingItem) return;

        const intervalId = window.setInterval(() => {
            fetchPlans(false);
        }, 8000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [plans, fetchPlans]);

    const handleFiltersChange = useCallback((newFilters: PlanFilterState) => {
        setFilters(newFilters);
        setCurrentPage(1);
    }, []);

    const handleView = useCallback((plan: PlanListItem) => {
        // Open plan detail modal
        setViewModal({ isOpen: true, planId: plan.id });
    }, []);

    const handleDuplicate = useCallback((plan: PlanListItem) => {
        // TODO: Implement duplicate via API
        showSuccess(`Chức năng sao chép đang được phát triển`);
    }, []);

    const handleDelete = useCallback((plan: PlanListItem) => {
        setDeleteModal({ isOpen: true, plan });
    }, []);

    const confirmDelete = useCallback(async () => {
        if (deleteModal.plan) {
            try {
                await deleteMarketingPlan(deleteModal.plan.id);
                showSuccess('Đã xóa kế hoạch thành công');
                setDeleteModal({ isOpen: false, plan: null });
                // Refresh list
                fetchPlans();
            } catch (error) {
                console.error('Error deleting plan:', error);
                showError('Không thể xóa kế hoạch');
            }
        }
    }, [deleteModal.plan, fetchPlans]);

    return (
        <div className="w-[96%] max-w-[1700px] mx-auto">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Xem kế hoạch</h1>
                <p className="text-gray-600">
                    {isLoading ? 'Đang tải...' : `Danh sách ${totalItems} kế hoạch marketing`}
                </p>
            </motion.div>

            {/* Filters */}
            <PlanFilters filters={filters} onFiltersChange={handleFiltersChange} />

            {/* Loading State */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-100 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
            ) : plans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {plans.map((plan, index) => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            onView={handleView}
                            onDuplicate={handleDuplicate}
                            onDelete={handleDelete}
                            index={index}
                        />
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 bg-white rounded-2xl border border-gray-200"
                >
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 font-medium">Không tìm thấy kế hoạch nào</p>
                    <p className="text-gray-400 text-sm mt-1">Thử thay đổi bộ lọc hoặc tạo kế hoạch mới</p>
                </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* Delete Confirm Modal */}
            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                title={deleteModal.plan?.campaignName || ''}
                onConfirm={confirmDelete}
                onClose={() => setDeleteModal({ isOpen: false, plan: null })}
            />

            {/* Plan Detail Modal */}
            <PlanDetailModal
                isOpen={viewModal.isOpen}
                planId={viewModal.planId}
                onClose={() => setViewModal({ isOpen: false, planId: null })}
            />
        </div>
    );
}
