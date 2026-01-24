'use client';

import { motion } from 'framer-motion';

interface BrandLogoSectionProps {
    data: {
        brandName: string;
        logoUrl: string;
        brandIdentity: string;
        resourceLinks: { label: string; url: string }[];
    };
    onChange: (data: BrandLogoSectionProps['data']) => void;
}

export default function BrandLogoSection({ data, onChange }: BrandLogoSectionProps) {
    const addResourceLink = () => {
        onChange({ ...data, resourceLinks: [...data.resourceLinks, { label: '', url: '' }] });
    };

    const updateResourceLink = (index: number, field: 'label' | 'url', value: string) => {
        const updated = [...data.resourceLinks];
        updated[index] = { ...updated[index], [field]: value };
        onChange({ ...data, resourceLinks: updated });
    };

    const removeResourceLink = (index: number) => {
        onChange({ ...data, resourceLinks: data.resourceLinks.filter((_, i) => i !== index) });
    };

    return (
        <div className="space-y-6">
            {/* Brand Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên thương hiệu <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={data.brandName}
                    onChange={(e) => onChange({ ...data, brandName: e.target.value })}
                    placeholder="VD: M-Steakhouse, Cafe Milano, ABC Company..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all text-lg font-medium"
                />
            </div>

            {/* Logo Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo thương hiệu
                </label>
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                        onChange({ ...data, logoUrl: reader.result as string });
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                            className="hidden"
                            id="logo-upload"
                        />
                        <label
                            htmlFor="logo-upload"
                            className="flex-1 px-4 py-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#F59E0B] text-gray-500 hover:text-[#F59E0B] transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium">Upload Logo</span>
                        </label>
                        {data.logoUrl && (
                            <div className="relative">
                                <img
                                    src={data.logoUrl}
                                    alt="Logo preview"
                                    className="w-16 h-16 rounded-lg object-contain border border-gray-200 bg-gray-50 p-1"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => onChange({ ...data, logoUrl: '' })}
                                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-gray-500">
                        Hỗ trợ định dạng: PNG, JPG, SVG. Kích thước tối đa: 2MB
                    </p>
                </div>
            </div>

            {/* Brand Identity */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả nhận diện thương hiệu
                </label>
                <textarea
                    value={data.brandIdentity}
                    onChange={(e) => onChange({ ...data, brandIdentity: e.target.value })}
                    placeholder="Mô tả phong cách nhận diện thương hiệu của bạn...&#10;VD: Logo hiện đại, màu sắc tối giản, phong cách chuyên nghiệp"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent resize-none transition-all"
                />
            </div>

            {/* Resource Links */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Tài nguyên hình ảnh / Link tham khảo
                    </label>
                    <button
                        type="button"
                        onClick={addResourceLink}
                        className="text-sm text-[#F59E0B] hover:text-amber-600 font-medium flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Thêm link
                    </button>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                    Thêm các link hình ảnh, tài liệu tham khảo cho AI (Google Drive, Dropbox, v.v.)
                </p>
                <div className="space-y-3">
                    {data.resourceLinks.map((link, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-2"
                        >
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <input
                                    type="text"
                                    value={link.label}
                                    onChange={(e) => updateResourceLink(index, 'label', e.target.value)}
                                    placeholder="Nhãn (VD: Hình sản phẩm)"
                                    className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                                />
                                <input
                                    type="text"
                                    value={link.url}
                                    onChange={(e) => updateResourceLink(index, 'url', e.target.value)}
                                    placeholder="https://..."
                                    className="sm:col-span-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeResourceLink(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </motion.div>
                    ))}
                    {data.resourceLinks.length === 0 && (
                        <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-xl">
                            <p className="text-sm text-gray-400 mb-2">Chưa có link tài nguyên nào</p>
                            <button
                                type="button"
                                onClick={addResourceLink}
                                className="text-sm text-[#F59E0B] hover:text-amber-600 font-medium"
                            >
                                + Thêm link đầu tiên
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
