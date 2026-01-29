'use client';

import { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { fakePlanList, PlanListItem } from '@/lib/fakeData/marketing';
import { PlanFilterState } from './_components/PlanFilters';

// Dynamic imports
const PlanFilters = dynamic(() => import('./_components/PlanFilters'), { ssr: false });
const PlanCard = dynamic(() => import('./_components/PlanCard'), { ssr: false });
const Pagination = dynamic(() => import('@/app/(admin)/admin/article/list/_components/Pagination'), { ssr: false });
const DeleteConfirmModal = dynamic(() => import('@/app/(admin)/admin/article/list/_components/DeleteConfirmModal'), { ssr: false });

const ITEMS_PER_PAGE = 6;

export default function MarketingListPage() {
    const [filters, setFilters] = useState<PlanFilterState>({
        search: '',
        status: '',
        channel: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [plans, setPlans] = useState<PlanListItem[]>(fakePlanList);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; plan: PlanListItem | null }>({
        isOpen: false,
        plan: null,
    });

    // Filtered plans
    const filteredPlans = useMemo(() => {
        return plans.filter(plan => {
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                if (!plan.campaignName.toLowerCase().includes(searchLower)) {
                    return false;
                }
            }
            if (filters.status && plan.status !== filters.status) {
                return false;
            }
            if (filters.channel && !plan.channels.includes(filters.channel)) {
                return false;
            }
            return true;
        });
    }, [plans, filters]);

    // Paginated plans
    const paginatedPlans = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredPlans.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredPlans, currentPage]);

    const totalPages = Math.ceil(filteredPlans.length / ITEMS_PER_PAGE);

    const handleFiltersChange = useCallback((newFilters: PlanFilterState) => {
        setFilters(newFilters);
        setCurrentPage(1);
    }, []);

    const handleView = useCallback((plan: PlanListItem) => {
        // TODO: Navigate to plan detail
        alert(`Xem kế hoạch: ${plan.campaignName}`);
    }, []);

    const handleDuplicate = useCallback((plan: PlanListItem) => {
        const duplicated: PlanListItem = {
            ...plan,
            id: `plan-${Date.now()}`,
            campaignName: `${plan.campaignName} (Copy)`,
            status: 'draft',
            createdAt: new Date(),
        };
        setPlans(prev => [duplicated, ...prev]);
    }, []);

    const handleDelete = useCallback((plan: PlanListItem) => {
        setDeleteModal({ isOpen: true, plan });
    }, []);

    const confirmDelete = useCallback(() => {
        if (deleteModal.plan) {
            setPlans(prev => prev.filter(p => p.id !== deleteModal.plan!.id));
            setDeleteModal({ isOpen: false, plan: null });
        }
    }, [deleteModal.plan]);

    return (
        <div className="w-[95%] max-w-[1600px] mx-auto">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Xem kế hoạch</h1>
                <p className="text-gray-600">
                    Danh sách {filteredPlans.length} kế hoạch marketing
                </p>
            </motion.div>

            {/* Filters */}
            <PlanFilters filters={filters} onFiltersChange={handleFiltersChange} />

            {/* Plans Grid */}
            {paginatedPlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {paginatedPlans.map((plan, index) => (
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
        </div>
    );
}
