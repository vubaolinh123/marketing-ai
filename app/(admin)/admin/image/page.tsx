'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ImageGenerationInput, defaultImageInput, getCameraAngleLabel } from '@/lib/fakeData/image';
import { productImageApi, ProductImage } from '@/lib/api';
import { uploadImage, getImageUrl } from '@/lib/api/upload.api';

// Dynamic imports
const ImageUploadForm = dynamic(() => import('./_components/ImageUploadForm'), { ssr: false });
const ImageProcessing = dynamic(() => import('./_components/ImageProcessing'), { ssr: false });
const ImageResult = dynamic(() => import('./_components/ImageResult'), { ssr: false });

type Step = 'form' | 'processing' | 'result';

const steps = [
    { id: 'form', label: 'Upload ảnh' },
    { id: 'processing', label: 'AI xử lý' },
    { id: 'result', label: 'Kết quả' },
];

export default function AIImagePage() {
    const [currentStep, setCurrentStep] = useState<Step>('form');
    const [formData, setFormData] = useState<ImageGenerationInput>(defaultImageInput);
    const [generatedResult, setGeneratedResult] = useState<ProductImage | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selectedAngles = formData.cameraAngles?.length > 0 ? formData.cameraAngles : ['wide'];

    const extractErrorMessage = (err: unknown, fallback: string) => {
        if (!err || typeof err !== 'object') {
            return fallback;
        }

        const candidate = err as {
            message?: string;
            statusCode?: number;
            response?: { data?: { message?: string } };
        };

        if (candidate.response?.data?.message) {
            return candidate.response.data.message;
        }

        if (candidate.message) {
            return candidate.statusCode ? `${candidate.message} (Mã lỗi: ${candidate.statusCode})` : candidate.message;
        }

        return fallback;
    };

    const handleSubmit = useCallback(async () => {
        if (formData.images.length === 0) {
            setError('Vui lòng upload ảnh sản phẩm');
            return;
        }

        if (formData.images[0].size > 10 * 1024 * 1024) {
            setError('Ảnh vượt quá 10MB. Vui lòng chọn file nhỏ hơn 10MB.');
            return;
        }

        if (!selectedAngles.length) {
            setError('Vui lòng chọn ít nhất 1 góc máy');
            return;
        }

        if (formData.backgroundType === 'custom' && !formData.customBackground.trim()) {
            setError('Vui lòng nhập mô tả background tùy chỉnh');
            return;
        }

        setError(null);
        setIsLoading(true);
        setCurrentStep('processing');

        try {
            // Step 1: Upload the image first
            const uploadedFile = await uploadImage(formData.images[0], 'ai-images');
            const imageUrl = uploadedFile.url;
            setOriginalImageUrl(getImageUrl(imageUrl));

            // Step 2: Generate AI image
            const response = await productImageApi.generate({
                originalImageUrl: imageUrl,
                backgroundType: formData.backgroundType,
                cameraAngles: selectedAngles,
                customBackground: formData.customBackground,
                useLogo: formData.useLogo,
                logoPosition: formData.logoPosition,
                outputSize: formData.outputSize,
                additionalNotes: formData.additionalNotes,
                useBrandSettings: formData.useBrandSettings,
                usagePurpose: formData.usagePurpose,
                displayInfo: formData.displayInfo,
                adIntensity: formData.adIntensity,
                typographyGuidance: formData.typographyGuidance,
                targetAudience: formData.targetAudience,
                visualStyle: formData.visualStyle,
                realismPriority: formData.realismPriority,
            });

            if (response.success && response.data) {
                setGeneratedResult(response.data);
                setCurrentStep('result');
            } else {
                throw new Error(response.message || 'Lỗi khi tạo ảnh AI');
            }
        } catch (err: unknown) {
            console.error('Generate error:', err);
            const errorMessage = extractErrorMessage(err, 'Lỗi khi tạo ảnh AI');
            setError(errorMessage);
            setCurrentStep('form');
        } finally {
            setIsLoading(false);
        }
    }, [formData, selectedAngles]);

    const handleReset = useCallback(() => {
        setFormData(defaultImageInput);
        setGeneratedResult(null);
        setOriginalImageUrl('');
        setError(null);
        setCurrentStep('form');
    }, []);

    const handleRegenerate = useCallback(async () => {
        if (!generatedResult?._id) {
            setError('Không tìm thấy ảnh để tạo lại');
            return;
        }

        setError(null);
        setIsLoading(true);
        setCurrentStep('processing');

        try {
            const response = await productImageApi.regenerate(generatedResult._id);

            if (response.success && response.data) {
                setGeneratedResult(response.data);
                setCurrentStep('result');
            } else {
                throw new Error(response.message || 'Lỗi khi tạo lại ảnh AI');
            }
        } catch (err: unknown) {
            console.error('Regenerate error:', err);
            const errorMessage = extractErrorMessage(err, 'Lỗi khi tạo lại ảnh AI');
            setError(errorMessage);
            setCurrentStep('result'); // Go back to result to show error
        } finally {
            setIsLoading(false);
        }
    }, [generatedResult]);

    const stepIndex = steps.findIndex(s => s.id === currentStep);

    return (
        <div className="max-w-5xl mx-auto">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Tạo ảnh AI</h1>
                <p className="text-gray-600">
                    Upload ảnh sản phẩm → AI tạo bối cảnh đẹp và ghép logo thương hiệu
                </p>
            </motion.div>

            {/* Error Alert */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3"
                >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                    <button
                        onClick={() => setError(null)}
                        className="ml-auto text-red-500 hover:text-red-700"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </motion.div>
            )}

            {/* Step Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
            >
                <div className="flex items-center justify-center">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div className={cn(
                                    'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all',
                                    index <= stepIndex
                                        ? 'bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-500'
                                )}>
                                    {index < stepIndex ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                <span className={cn(
                                    'text-sm mt-2 font-medium',
                                    index <= stepIndex ? 'text-gray-900' : 'text-gray-400'
                                )}>
                                    {step.label}
                                </span>
                            </div>

                            {index < steps.length - 1 && (
                                <div className={cn(
                                    'w-20 h-1 mx-3 rounded-full transition-all',
                                    index < stepIndex ? 'bg-[#F59E0B]' : 'bg-gray-200'
                                )} />
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Content */}
            {currentStep === 'form' && (
                <ImageUploadForm
                    data={formData}
                    onChange={setFormData}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />
            )}

            {currentStep === 'processing' && (
                <ImageProcessing imageCount={selectedAngles.length} />
            )}

            {currentStep === 'result' && generatedResult && (
                <ImageResult
                    result={generatedResult}
                    originalImageUrl={originalImageUrl}
                    selectedAngles={selectedAngles}
                    onReset={handleReset}
                    onRegenerate={handleRegenerate}
                    isRegenerating={isLoading}
                />
            )}

            {currentStep === 'processing' && selectedAngles.length > 1 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 bg-white rounded-2xl border border-gray-200 p-4"
                >
                    <p className="text-sm text-gray-600 mb-3">Đang tạo theo góc đã chọn:</p>
                    <div className="flex flex-wrap gap-2">
                        {selectedAngles.map((angle) => (
                            <span
                                key={angle}
                                className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium"
                            >
                                {getCameraAngleLabel(angle)}
                            </span>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
