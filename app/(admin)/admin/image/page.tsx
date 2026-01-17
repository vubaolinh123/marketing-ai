'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ImageGenerationInput, defaultImageInput } from '@/lib/fakeData/image';

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
    const [originalImages, setOriginalImages] = useState<string[]>([]);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);

    const handleSubmit = useCallback(async () => {
        setCurrentStep('processing');

        // Convert files to URLs for preview
        const originals = formData.images.map(file => URL.createObjectURL(file));
        setOriginalImages(originals);

        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Fake generated images (using same images with different styling for demo)
        const generated = [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
            'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
        ].slice(0, formData.images.length);

        setGeneratedImages(generated);
        setCurrentStep('result');
    }, [formData]);

    const handleReset = useCallback(() => {
        setFormData(defaultImageInput);
        setOriginalImages([]);
        setGeneratedImages([]);
        setCurrentStep('form');
    }, []);

    const handleRegenerate = useCallback(async () => {
        setCurrentStep('processing');
        await new Promise(resolve => setTimeout(resolve, 2000));
        setCurrentStep('result');
    }, []);

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
                />
            )}

            {currentStep === 'processing' && (
                <ImageProcessing imageCount={formData.images.length} />
            )}

            {currentStep === 'result' && (
                <ImageResult
                    originalImages={originalImages}
                    generatedImages={generatedImages}
                    onReset={handleReset}
                    onRegenerate={handleRegenerate}
                />
            )}
        </div>
    );
}
