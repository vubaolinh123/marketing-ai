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

            {/* Logo URL */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link Logo thương hiệu
                </label>
                <input
                    type="text"
                    value={data.logoUrl}
                    onChange={(e) => onChange({ ...data, logoUrl: e.target.value })}
                    placeholder="https://drive.google.com/... hoặc URL hình ảnh logo"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                />
                {data.logoUrl && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200 inline-block">
                        <img
                            src={data.logoUrl}
                            alt="Logo preview"
                            className="max-w-[120px] max-h-[80px] object-contain"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    </div>
                )}
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
