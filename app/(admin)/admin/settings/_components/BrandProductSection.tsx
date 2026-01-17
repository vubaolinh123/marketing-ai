'use client';

import TagsInput from './TagsInput';

interface BrandProductSectionProps {
    data: {
        productGroups: string[];
        strengths: string;
        suitableFor: string[];
    };
    onChange: (data: BrandProductSectionProps['data']) => void;
}

export default function BrandProductSection({ data, onChange }: BrandProductSectionProps) {
    return (
        <div className="space-y-6">
            {/* Product/Service Groups */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhóm sản phẩm / Dịch vụ chính
                </label>
                <TagsInput
                    value={data.productGroups}
                    onChange={(productGroups) => onChange({ ...data, productGroups })}
                    placeholder="Nhập sản phẩm hoặc dịch vụ và Enter..."
                />
                <p className="text-xs text-gray-500 mt-2">
                    Liệt kê các sản phẩm, dịch vụ chính mà doanh nghiệp của bạn cung cấp
                </p>
            </div>

            {/* Strengths */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Điểm mạnh / USP
                </label>
                <textarea
                    value={data.strengths}
                    onChange={(e) => onChange({ ...data, strengths: e.target.value })}
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
                    value={data.suitableFor}
                    onChange={(suitableFor) => onChange({ ...data, suitableFor })}
                    placeholder="Nhập đối tượng khách hàng mục tiêu..."
                />
                <p className="text-xs text-gray-500 mt-2">
                    Đối tượng khách hàng mục tiêu hoặc các trường hợp sử dụng phù hợp
                </p>
            </div>
        </div>
    );
}
