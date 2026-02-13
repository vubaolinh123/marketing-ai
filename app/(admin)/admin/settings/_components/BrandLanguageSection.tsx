'use client';

import TagsInput from './TagsInput';
import { cn } from '@/lib/utils';

interface BrandLanguageSectionProps {
    data: {
        keywords: string[];
        customerTerm: string;
        brandPronoun: string;
    };
    onChange: (data: BrandLanguageSectionProps['data']) => void;
}

const suggestedCustomerTerms = [
    'Bạn',
    'Quý khách',
    'Anh/Chị',
    'Khách hàng',
    'Thực khách',
    'Bạn bè',
];

const suggestedBrandPronouns = [
    'Mình',
    'Bên mình',
    'Chúng tôi',
    'Team',
    'Shop em',
];

const suggestedKeywords = [
    // F&B
    'Món ăn', 'Thực đơn', 'Đồ uống', 'Nguyên liệu',
    // Retail
    'Sản phẩm', 'Chất lượng', 'Giá cả', 'Khuyến mãi',
    // Service
    'Dịch vụ', 'Tư vấn', 'Hỗ trợ', 'Giải pháp',
    // Tech
    'Công nghệ', 'Phần mềm', 'Ứng dụng', 'Tiện ích',
    // Beauty
    'Làm đẹp', 'Spa', 'Chăm sóc', 'Thẩm mỹ',
    // Real Estate
    'Bất động sản', 'Căn hộ', 'Nhà phố', 'Đầu tư',
];

export default function BrandLanguageSection({ data, onChange }: BrandLanguageSectionProps) {
    const addKeyword = (keyword: string) => {
        if (!data.keywords.includes(keyword)) {
            onChange({ ...data, keywords: [...data.keywords, keyword] });
        }
    };

    return (
        <div className="space-y-6">
            {/* Keywords */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Từ khóa ngành hàng
                </label>
                <TagsInput
                    value={data.keywords}
                    onChange={(keywords) => onChange({ ...data, keywords })}
                    placeholder="Nhập từ khóa đặc trưng ngành của bạn..."
                />

                {/* Suggested Keywords */}
                <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Gợi ý nhanh:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedKeywords.map(keyword => (
                            <button
                                key={keyword}
                                type="button"
                                onClick={() => addKeyword(keyword)}
                                disabled={data.keywords.includes(keyword)}
                                className={cn(
                                    'px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                                    data.keywords.includes(keyword)
                                        ? 'border-[#F59E0B] bg-amber-50 text-[#F59E0B] cursor-not-allowed'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#F59E0B] hover:text-[#F59E0B]'
                                )}
                            >
                                {data.keywords.includes(keyword) ? '✓ ' : ''}{keyword}
                            </button>
                        ))}
                    </div>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                    Nhập các từ khóa, thuật ngữ đặc trưng trong ngành của bạn để AI hiểu và sử dụng đúng cách
                </p>
            </div>

            {/* Customer Term - Custom Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cách gọi khách hàng
                </label>
                <input
                    type="text"
                    value={data.customerTerm}
                    onChange={(e) => onChange({ ...data, customerTerm: e.target.value })}
                    placeholder="VD: Bạn, Quý khách, Anh/Chị..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                />

                {/* Suggestions */}
                <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Gợi ý nhanh:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedCustomerTerms.map(term => (
                            <button
                                key={term}
                                type="button"
                                onClick={() => onChange({ ...data, customerTerm: term })}
                                className={cn(
                                    'px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                                    data.customerTerm === term
                                        ? 'border-[#F59E0B] bg-amber-50 text-[#F59E0B]'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#F59E0B] hover:text-[#F59E0B]'
                                )}
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Brand Pronoun */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cách thương hiệu xưng hô
                </label>
                <input
                    type="text"
                    value={data.brandPronoun}
                    onChange={(e) => onChange({ ...data, brandPronoun: e.target.value })}
                    placeholder="VD: Mình, Bên mình, Chúng tôi..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                />

                <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Gợi ý nhanh:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedBrandPronouns.map((pronoun) => (
                            <button
                                key={pronoun}
                                type="button"
                                onClick={() => onChange({ ...data, brandPronoun: pronoun })}
                                className={cn(
                                    'px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                                    data.brandPronoun === pronoun
                                        ? 'border-[#F59E0B] bg-amber-50 text-[#F59E0B]'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#F59E0B] hover:text-[#F59E0B]'
                                )}
                            >
                                {pronoun}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
