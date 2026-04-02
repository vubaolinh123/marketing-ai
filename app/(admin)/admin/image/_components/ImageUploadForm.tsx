'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { settingsApi } from '@/lib/api';
import ImageDropzone from './ImageDropzone';
import {
    adIntensitySuggestions,
    ImageGenerationInput,
    backgroundOptions,
    cameraAngleOptions,
    displayInfoSuggestions,
    getCameraAngleLabel,
    logoPositionOptions,
    outputSizeOptions,
    realismPrioritySuggestions,
    targetAudienceSuggestions,
    typographyGuidanceSuggestions,
    usagePurposeSuggestions,
    visualStyleSuggestions,
} from '@/lib/fakeData/image';

interface ImageUploadFormProps {
    data: ImageGenerationInput;
    onChange: (data: ImageGenerationInput) => void;
    onSubmit: () => void;
    isLoading?: boolean;
}

export default function ImageUploadForm({ data, onChange, onSubmit, isLoading }: ImageUploadFormProps) {
    const [hasBrandSettings, setHasBrandSettings] = useState(false);
    const [loadingSettings, setLoadingSettings] = useState(true);

    useEffect(() => {
        const checkSettings = async () => {
            try {
                const hasSettings = await settingsApi.checkHasBrandSettings();
                setHasBrandSettings(hasSettings);

                if (!hasSettings && data.useBrandSettings) {
                    onChange({ ...data, useBrandSettings: false });
                }

                if (hasSettings && !data.useBrandSettings) {
                    onChange({ ...data, useBrandSettings: true });
                }
            } catch (error) {
                console.error('Error checking brand settings:', error);
            } finally {
                setLoadingSettings(false);
            }
        };

        checkSettings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const selectedAngles = data.cameraAngles?.length > 0 ? data.cameraAngles : ['wide'];
    const hasCustomBackgroundError = data.backgroundType === 'custom' && !data.customBackground.trim();
    const canSubmit = data.images.length > 0 && selectedAngles.length > 0 && !hasCustomBackgroundError;

    const toggleCameraAngle = (angle: string) => {
        const currentAngles = data.cameraAngles || [];
        const exists = currentAngles.includes(angle);
        const nextAngles = exists
            ? currentAngles.filter((item) => item !== angle)
            : [...currentAngles, angle];

        onChange({
            ...data,
            cameraAngles: nextAngles.length > 0 ? nextAngles : ['wide']
        });
    };

    const renderSuggestionChips = (
        field: 'usagePurpose' | 'displayInfo' | 'adIntensity' | 'typographyGuidance' | 'targetAudience' | 'visualStyle' | 'realismPriority',
        suggestions: string[],
        currentValue?: string,
    ) => (
        <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((suggestion) => {
                const isSelected = (currentValue || '').trim().toLowerCase() === suggestion.trim().toLowerCase();
                return (
                    <button
                        key={`${String(field)}-${suggestion}`}
                        type="button"
                        onClick={() => onChange({ ...data, [field]: suggestion })}
                        disabled={isLoading}
                        className={cn(
                            'px-2.5 py-1 rounded-full text-xs border transition-all',
                            isSelected
                                ? 'border-[#F59E0B] bg-amber-50 text-[#B45309]'
                                : 'border-gray-200 text-gray-600 hover:border-[#F59E0B] hover:bg-amber-50'
                        )}
                    >
                        {suggestion}
                    </button>
                );
            })}
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Brand Settings Toggle */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Sử dụng thông tin thương hiệu</p>
                            <p className="text-sm text-gray-500">
                                {loadingSettings
                                    ? 'Đang kiểm tra AI Settings...'
                                    : hasBrandSettings
                                        ? 'Áp dụng logo và thông tin từ AI Settings'
                                        : 'Chưa có AI Settings để áp dụng'}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => onChange({ ...data, useBrandSettings: !data.useBrandSettings })}
                        disabled={isLoading || loadingSettings || !hasBrandSettings}
                        className={cn(
                            'w-14 h-7 rounded-full transition-colors relative',
                            data.useBrandSettings ? 'bg-blue-500' : 'bg-gray-300',
                            (!hasBrandSettings || loadingSettings) && 'opacity-60 cursor-not-allowed'
                        )}
                    >
                        <span className={cn(
                            'absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all',
                            data.useBrandSettings ? 'left-8' : 'left-1'
                        )} />
                    </button>
                </div>

                {!hasBrandSettings && !loadingSettings && (
                    <Link
                        href="/admin/settings"
                        className="mt-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        Thiết lập AI Settings
                    </Link>
                )}
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white flex items-center justify-center text-sm font-bold">1</span>
                    Upload ảnh sản phẩm
                </h3>

                {/* Multi-reference mode toggle */}
                <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">Upload nhiều ảnh sản phẩm</p>
                                <p className="text-xs text-gray-500">Upload tối đa 5 ảnh từ nhiều góc để AI hiểu rõ sản phẩm hơn</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                const newMode = !data.multiReferenceMode;
                                onChange({
                                    ...data,
                                    multiReferenceMode: newMode,
                                    // When switching from multi to single, keep only first image
                                    images: !newMode && data.images.length > 1 ? [data.images[0]] : data.images
                                });
                            }}
                            disabled={isLoading}
                            className={cn(
                                'w-12 h-6 rounded-full transition-colors relative flex-shrink-0',
                                data.multiReferenceMode ? 'bg-purple-500' : 'bg-gray-300'
                            )}
                        >
                            <span className={cn(
                                'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all',
                                data.multiReferenceMode ? 'left-7' : 'left-1'
                            )} />
                        </button>
                    </div>

                    {data.multiReferenceMode && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3"
                        >
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-start gap-2">
                                <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <div>
                                    <p className="font-medium">Upload nhiều ảnh có thể làm giảm chất lượng đầu ra ảnh so với sản phẩm gốc</p>
                                    <p className="mt-1 text-xs text-amber-700">
                                        Để có kết quả tốt nhất, hãy upload ảnh từ nhiều góc khác nhau (trước, sau, bên, trên) với chất lượng cao và ánh sáng đồng đều.
                                        Ảnh đầu tiên sẽ được dùng làm ảnh chính (primary reference).
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                <ImageDropzone
                    images={data.images}
                    onChange={(images) => onChange({ ...data, images })}
                    disabled={isLoading}
                    maxImages={data.multiReferenceMode ? 5 : 1}
                />
            </div>

            {/* Background Options */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white flex items-center justify-center text-sm font-bold">2</span>
                    Chọn góc máy
                </h3>
                <p className="text-sm text-gray-500 mb-4">Bạn có thể chọn nhiều góc. Mỗi góc sẽ tạo ra 1 ảnh riêng.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {cameraAngleOptions.map(option => {
                        const isSelected = selectedAngles.includes(option.value);

                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => toggleCameraAngle(option.value)}
                                disabled={isLoading}
                                className={cn(
                                    'p-4 rounded-xl border-2 text-left transition-all',
                                    isSelected
                                        ? 'border-[#F59E0B] bg-amber-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                )}
                            >
                                <p className={cn(
                                    'font-medium',
                                    isSelected ? 'text-[#F59E0B]' : 'text-gray-700'
                                )}>
                                    {option.label}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                    <span className="font-medium">Đã chọn {selectedAngles.length} góc:</span>{' '}
                    {selectedAngles.map(getCameraAngleLabel).join(', ')}
                </div>
            </div>

            {/* Background Options */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white flex items-center justify-center text-sm font-bold">3</span>
                    Chọn bối cảnh / Tình huống
                </h3>
                <p className="text-sm text-gray-500 mb-4">AI sẽ biến đổi sản phẩm vào bối cảnh mới - không chỉ thay background</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {backgroundOptions.map(option => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange({ ...data, backgroundType: option.value })}
                            disabled={isLoading}
                            className={cn(
                                'p-4 rounded-xl border-2 text-left transition-all',
                                data.backgroundType === option.value
                                    ? 'border-[#F59E0B] bg-amber-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            )}
                        >
                            <p className={cn(
                                'font-medium',
                                data.backgroundType === option.value ? 'text-[#F59E0B]' : 'text-gray-700'
                            )}>
                                {option.label}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                        </button>
                    ))}
                </div>

                {data.backgroundType === 'custom' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4"
                    >
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-3 text-sm text-amber-800">
                            <span className="font-medium">💡 Mẹo:</span> Mô tả chi tiết tình huống bạn muốn. VD: "Miếng thịt bò đang được đầu bếp mặc áo trắng rán trên chảo gang, khói bốc lên, nhà hàng sang trọng"
                        </div>
                        <textarea
                            value={data.customBackground}
                            onChange={(e) => onChange({ ...data, customBackground: e.target.value })}
                            placeholder="Mô tả CHI TIẾT tình huống bạn muốn AI tạo ra...&#10;VD: Miếng thịt đang được nướng trên vỉ than hồng, khói bay lên, đầu bếp đang lật thịt..."
                            rows={4}
                            disabled={isLoading}
                            className={cn(
                                'w-full px-4 py-3 rounded-xl border bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent resize-none transition-all',
                                hasCustomBackgroundError
                                    ? 'border-red-300 focus:ring-red-300'
                                    : 'border-gray-200 focus:ring-[#F59E0B]'
                            )}
                        />
                        <p className={cn('mt-1 text-xs', hasCustomBackgroundError ? 'text-red-600' : 'text-gray-500')}>
                            {hasCustomBackgroundError
                                ? 'Vui lòng nhập mô tả background tùy chỉnh trước khi tạo ảnh.'
                                : 'Mô tả càng cụ thể (bối cảnh, ánh sáng, đạo cụ), kết quả càng sát ý.'}
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Creative Direction */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white flex items-center justify-center text-sm font-bold">4</span>
                    Định hướng sáng tạo (tuỳ chọn)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Mục đích sử dụng ảnh</label>
                        <input
                            value={data.usagePurpose || ''}
                            onChange={(e) => onChange({ ...data, usagePurpose: e.target.value })}
                            placeholder="VD: Quảng cáo chuyển đổi cho Facebook"
                            disabled={isLoading}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                        />
                        {renderSuggestionChips('usagePurpose', usagePurposeSuggestions, data.usagePurpose)}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Thông tin hiển thị trên ảnh</label>
                        <input
                            value={data.displayInfo || ''}
                            onChange={(e) => onChange({ ...data, displayInfo: e.target.value })}
                            placeholder="VD: Tên sản phẩm + ưu đãi 20%"
                            disabled={isLoading}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                        />
                        {renderSuggestionChips('displayInfo', displayInfoSuggestions, data.displayInfo)}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Mức độ quảng cáo (ad intensity)</label>
                        <input
                            value={data.adIntensity || ''}
                            onChange={(e) => onChange({ ...data, adIntensity: e.target.value })}
                            placeholder="VD: low / medium / high hoặc mô tả riêng"
                            disabled={isLoading}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                        />
                        {renderSuggestionChips('adIntensity', adIntensitySuggestions, data.adIntensity)}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Hướng dẫn typography</label>
                        <input
                            value={data.typographyGuidance || ''}
                            onChange={(e) => onChange({ ...data, typographyGuidance: e.target.value })}
                            placeholder="VD: Headline đậm, dễ đọc trên mobile"
                            disabled={isLoading}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                        />
                        {renderSuggestionChips('typographyGuidance', typographyGuidanceSuggestions, data.typographyGuidance)}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Tệp khách hàng mục tiêu</label>
                        <input
                            value={data.targetAudience || ''}
                            onChange={(e) => onChange({ ...data, targetAudience: e.target.value })}
                            placeholder="VD: Nữ 23-32, nhân viên văn phòng"
                            disabled={isLoading}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                        />
                        {renderSuggestionChips('targetAudience', targetAudienceSuggestions, data.targetAudience)}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phong cách thị giác</label>
                        <input
                            value={data.visualStyle || ''}
                            onChange={(e) => onChange({ ...data, visualStyle: e.target.value })}
                            placeholder="VD: Luxury editorial, contrast cao"
                            disabled={isLoading}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                        />
                        {renderSuggestionChips('visualStyle', visualStyleSuggestions, data.visualStyle)}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Ưu tiên độ chân thực</label>
                        <input
                            value={data.realismPriority || ''}
                            onChange={(e) => onChange({ ...data, realismPriority: e.target.value })}
                            placeholder="VD: high / balanced / stylized hoặc mô tả riêng"
                            disabled={isLoading}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                        />
                        {renderSuggestionChips('realismPriority', realismPrioritySuggestions, data.realismPriority)}
                    </div>
                </div>
            </div>

            {/* Logo & Size Options */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white flex items-center justify-center text-sm font-bold">5</span>
                    Tùy chọn khác
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Logo Toggle */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium text-gray-700">Ghép logo thương hiệu</label>
                            <button
                                type="button"
                                onClick={() => onChange({ ...data, useLogo: !data.useLogo })}
                                disabled={isLoading}
                                className={cn(
                                    'w-12 h-6 rounded-full transition-colors relative',
                                    data.useLogo ? 'bg-[#F59E0B]' : 'bg-gray-200'
                                )}
                            >
                                <span className={cn(
                                    'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all',
                                    data.useLogo ? 'left-7' : 'left-1'
                                )} />
                            </button>
                        </div>

                        {data.useLogo && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <label className="text-xs text-gray-500 mb-2 block">Vị trí logo</label>
                                <div className="flex flex-wrap gap-2">
                                    {logoPositionOptions.map(option => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => onChange({ ...data, logoPosition: option.value })}
                                            disabled={isLoading}
                                            className={cn(
                                                'px-3 py-1.5 rounded-full text-sm border transition-all',
                                                data.logoPosition === option.value
                                                    ? 'border-[#F59E0B] bg-amber-50 text-[#F59E0B]'
                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            )}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Output Size */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">Kích thước output</label>
                        <div className="flex flex-wrap gap-2">
                            {outputSizeOptions.map(option => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => onChange({ ...data, outputSize: option.value })}
                                    disabled={isLoading}
                                    className={cn(
                                        'px-3 py-2 rounded-xl border-2 transition-all',
                                        data.outputSize === option.value
                                            ? 'border-[#F59E0B] bg-amber-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    )}
                                >
                                    <span className={cn(
                                        'font-medium',
                                        data.outputSize === option.value ? 'text-[#F59E0B]' : 'text-gray-700'
                                    )}>
                                        {option.label}
                                    </span>
                                    <p className="text-xs text-gray-500">{option.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Additional Notes */}
                <div className="mt-6">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Chi tiết bổ sung (tuỳ chọn)</label>
                    <textarea
                        value={data.additionalNotes}
                        onChange={(e) => onChange({ ...data, additionalNotes: e.target.value })}
                        placeholder="Thêm chi tiết cho AI...&#10;VD: Thêm người phụ nữ đang cắt thịt, ánh đèn vàng ấm, có lọ hoa hồng trên bàn..."
                        rows={3}
                        disabled={isLoading}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent resize-none transition-all"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
                <Button
                    onClick={onSubmit}
                    variant="primary"
                    size="lg"
                    disabled={!canSubmit}
                    isLoading={isLoading}
                    className="min-w-[200px] shadow-xl"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Tạo {selectedAngles.length} ảnh
                </Button>
            </div>
        </motion.div>
    );
}
