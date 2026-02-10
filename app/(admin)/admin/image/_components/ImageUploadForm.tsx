'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import ImageDropzone from './ImageDropzone';
import {
    ImageGenerationInput,
    backgroundOptions,
    cameraAngleOptions,
    getCameraAngleLabel,
    logoPositionOptions,
    outputSizeOptions,
} from '@/lib/fakeData/image';

interface ImageUploadFormProps {
    data: ImageGenerationInput;
    onChange: (data: ImageGenerationInput) => void;
    onSubmit: () => void;
    isLoading?: boolean;
}

export default function ImageUploadForm({ data, onChange, onSubmit, isLoading }: ImageUploadFormProps) {
    const selectedAngles = data.cameraAngles?.length > 0 ? data.cameraAngles : ['wide'];
    const canSubmit = data.images.length > 0 && selectedAngles.length > 0;

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
                            <p className="text-sm text-gray-500">Áp dụng logo và thông tin từ AI Settings</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => onChange({ ...data, useBrandSettings: !data.useBrandSettings })}
                        disabled={isLoading}
                        className={cn(
                            'w-14 h-7 rounded-full transition-colors relative',
                            data.useBrandSettings ? 'bg-blue-500' : 'bg-gray-300'
                        )}
                    >
                        <span className={cn(
                            'absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all',
                            data.useBrandSettings ? 'left-8' : 'left-1'
                        )} />
                    </button>
                </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white flex items-center justify-center text-sm font-bold">1</span>
                    Upload ảnh sản phẩm
                </h3>
                <ImageDropzone
                    images={data.images}
                    onChange={(images) => onChange({ ...data, images })}
                    disabled={isLoading}
                    maxImages={1}
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
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent resize-none transition-all"
                        />
                    </motion.div>
                )}
            </div>

            {/* Logo & Size Options */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white flex items-center justify-center text-sm font-bold">4</span>
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
