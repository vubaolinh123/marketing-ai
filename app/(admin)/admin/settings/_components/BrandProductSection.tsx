'use client';

import { useCallback } from 'react';
import TagsInput from './TagsInput';
import { cn } from '@/lib/utils';

interface ProductData {
    productGroups: string[];
    strengths: string;
    suitableFor: string[];
}

interface BrandProductSectionProps {
    data: ProductData;
    onChange: (data: ProductData) => void;
}

// Suggested product groups
const suggestedProductGroups = [
    'Marketing', 'Website', 'SEO', 'Quảng cáo',
    'Thiết kế', 'Phần mềm', 'Tư vấn', 'Đào tạo',
    'Sản xuất', 'Bán lẻ', 'Dịch vụ', 'F&B',
];

// Suggested target audiences
const suggestedAudiences = [
    'Doanh nghiệp nhỏ', 'Startup', 'Cá nhân', 'Gia đình',
    'Doanh nghiệp lớn', 'Freelancer', 'Học sinh/Sinh viên', 'Người cao tuổi',
];

export default function BrandProductSection({ data, onChange }: BrandProductSectionProps) {
    // Helper to get current safe data - always use latest from data prop
    const getSafeData = useCallback((): ProductData => ({
        productGroups: data.productGroups ?? [],
        suitableFor: data.suitableFor ?? [],
        strengths: data.strengths ?? ''
    }), [data]);

    // Update handlers that always get latest data
    const handleProductGroupsChange = useCallback((newProductGroups: string[]) => {
        const current = getSafeData();
        onChange({
            ...current,
            productGroups: newProductGroups
        });
    }, [onChange, getSafeData]);

    const handleSuitableForChange = useCallback((newSuitableFor: string[]) => {
        const current = getSafeData();
        onChange({
            ...current,
            suitableFor: newSuitableFor
        });
    }, [onChange, getSafeData]);

    const handleStrengthsChange = useCallback((newStrengths: string) => {
        const current = getSafeData();
        onChange({
            ...current,
            strengths: newStrengths
        });
    }, [onChange, getSafeData]);

    const addProductGroup = useCallback((group: string) => {
        const current = getSafeData();
        if (!current.productGroups.includes(group)) {
            onChange({
                ...current,
                productGroups: [...current.productGroups, group]
            });
        }
    }, [onChange, getSafeData]);

    const addAudience = useCallback((audience: string) => {
        const current = getSafeData();
        if (!current.suitableFor.includes(audience)) {
            onChange({
                ...current,
                suitableFor: [...current.suitableFor, audience]
            });
        }
    }, [onChange, getSafeData]);

    // Get current values for display
    const currentData = getSafeData();

    return (
        <div className="space-y-6">
            {/* Product/Service Groups */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhóm sản phẩm / Dịch vụ chính
                </label>
                <TagsInput
                    value={currentData.productGroups}
                    onChange={handleProductGroupsChange}
                    placeholder="Nhập sản phẩm hoặc dịch vụ và Enter..."
                />

                {/* Suggested Product Groups */}
                <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Gợi ý nhanh:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedProductGroups.map(group => (
                            <button
                                key={group}
                                type="button"
                                onClick={() => addProductGroup(group)}
                                disabled={currentData.productGroups.includes(group)}
                                className={cn(
                                    'px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                                    currentData.productGroups.includes(group)
                                        ? 'border-[#F59E0B] bg-amber-50 text-[#F59E0B] cursor-not-allowed'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#F59E0B] hover:text-[#F59E0B]'
                                )}
                            >
                                {currentData.productGroups.includes(group) ? '✓ ' : ''}{group}
                            </button>
                        ))}
                    </div>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                    Liệt kê các sản phẩm, dịch vụ chính mà doanh nghiệp của bạn cung cấp
                </p>
            </div>

            {/* Strengths */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Điểm mạnh / USP
                </label>
                <textarea
                    value={currentData.strengths}
                    onChange={(e) => handleStrengthsChange(e.target.value)}
                    placeholder="Những điểm mạnh, lợi thế cạnh tranh của doanh nghiệp bạn...&#10;VD:&#10;• Chất lượng dịch vụ hàng đầu&#10;• Đội ngũ chuyên nghiệp&#10;• Giá cả cạnh tranh"
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent resize-none transition-all"
                />
            </div>

            {/* Suitable For - Tags Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phù hợp với đối tượng
                </label>
                <TagsInput
                    value={currentData.suitableFor}
                    onChange={handleSuitableForChange}
                    placeholder="Nhập đối tượng khách hàng mục tiêu..."
                />

                {/* Suggested Audiences */}
                <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Gợi ý nhanh:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedAudiences.map(audience => (
                            <button
                                key={audience}
                                type="button"
                                onClick={() => addAudience(audience)}
                                disabled={currentData.suitableFor.includes(audience)}
                                className={cn(
                                    'px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                                    currentData.suitableFor.includes(audience)
                                        ? 'border-[#F59E0B] bg-amber-50 text-[#F59E0B] cursor-not-allowed'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#F59E0B] hover:text-[#F59E0B]'
                                )}
                            >
                                {currentData.suitableFor.includes(audience) ? '✓ ' : ''}{audience}
                            </button>
                        ))}
                    </div>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                    Đối tượng khách hàng mục tiêu hoặc các trường hợp sử dụng phù hợp
                </p>
            </div>
        </div>
    );
}
