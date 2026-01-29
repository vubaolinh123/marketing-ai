'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { uploadImage, getImageUrl, api } from '@/lib/api';
import toast from '@/lib/toast';

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
    const [isUploading, setIsUploading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [uploadingResourceIndex, setUploadingResourceIndex] = useState<number | null>(null);

    const addResourceLink = () => {
        onChange({ ...data, resourceLinks: [...(data.resourceLinks || []), { label: '', url: '' }] });
    };

    const updateResourceLink = (index: number, field: 'label' | 'url', value: string) => {
        const updated = [...(data.resourceLinks || [])];
        updated[index] = { ...updated[index], [field]: value };
        onChange({ ...data, resourceLinks: updated });
    };

    const removeResourceLink = (index: number) => {
        onChange({ ...data, resourceLinks: (data.resourceLinks || []).filter((_, i) => i !== index) });
    };

    const handleLogoUpload = async (file: File) => {
        try {
            setIsUploading(true);
            const result = await uploadImage(file, 'general');
            onChange({ ...data, logoUrl: result.url });
            toast.success('Upload logo thành công!');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Lỗi khi upload logo');
        } finally {
            setIsUploading(false);
        }
    };

    // AI Recognition for brand identity
    const handleAIRecognition = async () => {
        if (!data.logoUrl) {
            toast.error('Vui lòng upload logo trước khi sử dụng tính năng này');
            return;
        }

        try {
            setIsAnalyzing(true);

            // Check if it's a URL or local path
            const isUrl = data.logoUrl.startsWith('http');
            const response = await api.post('/ai/analyze-image', {
                ...(isUrl ? { imageUrl: data.logoUrl } : { imagePath: data.logoUrl }),
                customPrompt: `Phân tích logo thương hiệu này và mô tả chi tiết:
1. Màu sắc chủ đạo và ý nghĩa
2. Hình dạng, biểu tượng trong logo
3. Phong cách thiết kế (hiện đại, cổ điển, minimalist, v.v.)
4. Cảm xúc và thông điệp mà logo truyền tải
5. Đề xuất cách sử dụng trong marketing

Trả lời ngắn gọn, súc tích, mỗi ý 1-2 câu.`
            });

            if (response.data.success) {
                onChange({ ...data, brandIdentity: response.data.data.analysis });
                toast.success('Phân tích logo thành công!');
            } else {
                toast.error('Không thể phân tích logo');
            }
        } catch (error) {
            console.error('AI Recognition error:', error);
            toast.error('Lỗi khi phân tích logo');
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Upload resource file
    const handleResourceUpload = async (index: number, file: File) => {
        try {
            setUploadingResourceIndex(index);
            const result = await uploadImage(file, 'general');
            updateResourceLink(index, 'url', result.url);
            toast.success('Upload tài nguyên thành công!');
        } catch (error) {
            console.error('Resource upload error:', error);
            toast.error('Lỗi khi upload tài nguyên');
        } finally {
            setUploadingResourceIndex(null);
        }
    };

    // Get display URL (handle both relative and absolute URLs)
    const displayLogoUrl = data.logoUrl?.startsWith('http')
        ? data.logoUrl
        : data.logoUrl
            ? getImageUrl(data.logoUrl)
            : '';

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
                                    handleLogoUpload(file);
                                }
                            }}
                            className="hidden"
                            id="logo-upload"
                            disabled={isUploading}
                        />
                        <label
                            htmlFor="logo-upload"
                            className={`flex-1 px-4 py-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#F59E0B] text-gray-500 hover:text-[#F59E0B] transition-all flex items-center justify-center gap-2 cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isUploading ? (
                                <>
                                    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="font-medium">Đang upload...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-medium">Upload Logo</span>
                                </>
                            )}
                        </label>
                        {displayLogoUrl && (
                            <div className="relative">
                                <img
                                    src={displayLogoUrl}
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
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Mô tả nhận diện thương hiệu
                    </label>
                    <button
                        type="button"
                        onClick={handleAIRecognition}
                        disabled={isAnalyzing}
                        className="text-sm bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 hover:from-purple-600 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAnalyzing ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang phân tích...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                Nhận diện bởi AI
                            </>
                        )}
                    </button>
                </div>
                <textarea
                    value={data.brandIdentity || ''}
                    onChange={(e) => onChange({ ...data, brandIdentity: e.target.value })}
                    placeholder="Mô tả phong cách nhận diện thương hiệu của bạn...&#10;VD: Logo hiện đại, màu sắc tối giản, phong cách chuyên nghiệp&#10;&#10;Hoặc bấm 'Nhận diện bởi AI' để tự động phân tích từ logo"
                    rows={5}
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
                    {(data.resourceLinks || []).map((link, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-2"
                        >
                            <div className="flex-1 space-y-2">
                                <input
                                    type="text"
                                    value={link.label}
                                    onChange={(e) => updateResourceLink(index, 'label', e.target.value)}
                                    placeholder="Nhãn (VD: Hình sản phẩm)"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={link.url}
                                        onChange={(e) => updateResourceLink(index, 'url', e.target.value)}
                                        placeholder="https://... hoặc upload file"
                                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleResourceUpload(index, file);
                                        }}
                                        className="hidden"
                                        id={`resource-upload-${index}`}
                                        disabled={uploadingResourceIndex === index}
                                    />
                                    <label
                                        htmlFor={`resource-upload-${index}`}
                                        className={`px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 flex items-center gap-1 cursor-pointer transition-all flex-shrink-0 ${uploadingResourceIndex === index ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {uploadingResourceIndex === index ? (
                                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
                                        )}
                                    </label>
                                </div>
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
        </div >
    );
}
