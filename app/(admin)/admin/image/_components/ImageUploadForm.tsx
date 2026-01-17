'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import ImageDropzone from './ImageDropzone';
import {
    ImageGenerationInput,
    backgroundOptions,
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
    const canSubmit = data.images.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
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
                />
            </div>

            {/* Background Options */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white flex items-center justify-center text-sm font-bold">2</span>
                    Chọn bối cảnh
                </h3>
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
                        <textarea
                            value={data.customBackground}
                            onChange={(e) => onChange({ ...data, customBackground: e.target.value })}
                            placeholder="Mô tả bối cảnh bạn muốn... VD: Bàn gỗ cạnh cửa sổ với ánh nắng buổi sáng"
                            rows={3}
                            disabled={isLoading}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent resize-none transition-all"
                        />
                    </motion.div>
                )}
            </div>

            {/* Logo & Size Options */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white flex items-center justify-center text-sm font-bold">3</span>
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
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Yêu cầu thêm (tùy chọn)</label>
                    <textarea
                        value={data.additionalNotes}
                        onChange={(e) => onChange({ ...data, additionalNotes: e.target.value })}
                        placeholder="Mô tả thêm yêu cầu cho AI..."
                        rows={2}
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
                    Tạo ảnh AI
                </Button>
            </div>
        </motion.div>
    );
}
