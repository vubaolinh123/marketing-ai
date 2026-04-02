'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ImageGenerationInput, defaultImageInput, getCameraAngleLabel, normalizeAdIntensityValue } from '@/lib/fakeData/image';
import { productImageApi, ProductImage } from '@/lib/api';
import { uploadImage, uploadImages, getImageUrl } from '@/lib/api/upload.api';

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

export default function AIImagePage() {
    const [currentStep, setCurrentStep] = useState<Step>('form');
    const [formData, setFormData] = useState<ImageGenerationInput>(defaultImageInput);
    const [generatedResult, setGeneratedResult] = useState<ProductImage | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selectedAngles = formData.cameraAngles?.length > 0 ? formData.cameraAngles : ['wide'];

    const handleSubmit = useCallback(async () => {
        if (formData.images.length === 0) {
            setError('Vui lòng upload ảnh sản phẩm');
            return;
        }

        // Validate file sizes
        const oversizedFile = formData.images.find(f => f.size > 10 * 1024 * 1024);
        if (oversizedFile) {
            setError(`Ảnh "${oversizedFile.name}" vượt quá 10MB. Vui lòng chọn file nhỏ hơn 10MB.`);
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
            const isMultiRef = formData.multiReferenceMode && formData.images.length > 1;

            let primaryImageUrl: string;
            let referenceImageUrls: string[] = [];

            if (isMultiRef) {
                // Multi-reference mode: upload all images
                const uploadResult = await uploadImages(formData.images, 'ai-images');
                primaryImageUrl = uploadResult.files[0].url;
                referenceImageUrls = uploadResult.files.slice(1).map(f => f.url);
                setOriginalImageUrl(getImageUrl(primaryImageUrl));
            } else {
                // Single image mode
                const uploadedFile = await uploadImage(formData.images[0], 'ai-images');
                primaryImageUrl = uploadedFile.url;
                setOriginalImageUrl(getImageUrl(primaryImageUrl));
            }

            // Generate AI image
            const normalizedAdIntensity = normalizeAdIntensityValue(formData.adIntensity);

            const response = await productImageApi.generate({
                originalImageUrl: primaryImageUrl,
                multiReferenceMode: isMultiRef,
                referenceImageUrls: isMultiRef ? referenceImageUrls : undefined,
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
                adIntensity: normalizedAdIntensity,
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

    const handleRegenerate = useCallback(async (regenerateInstruction?: string) => {
        if (!generatedResult?._id) {
            setError('Không tìm thấy ảnh để tạo lại');
            return;
        }

        setError(null);
        setIsLoading(true);
        setCurrentStep('processing');

        try {
            const response = await productImageApi.regenerate(generatedResult._id, {
                regenerateInstruction,
            });

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
        <div className="w-[96%] max-w-[1700px] mx-auto">
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
                    title="Thông báo lỗi tạo ảnh"
                >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                    <button
                        type="button"
                        onClick={() => setError(null)}
                        title="Đóng thông báo lỗi"
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
                            <div className="flex flex-col items-center" title={step.label}>
                                <div className={cn(
                                    'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all',
                                    index <= stepIndex
                                        ? 'bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-500'
                                )}
                                title={`Bước ${index + 1}: ${step.label}`}
                                >
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

            {currentStep === 'processing' && formData.multiReferenceMode && formData.images.length > 1 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 bg-purple-50 rounded-2xl border border-purple-200 p-4"
                >
                    <p className="text-sm text-purple-700 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Chế độ multi-reference: AI đang phân tích {formData.images.length} ảnh sản phẩm để tạo ảnh chính xác nhất</span>
                    </p>
                </motion.div>
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
