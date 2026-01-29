'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadImage, generateAndSaveArticle, getImageUrl } from '@/lib/api';
import toast from '@/lib/toast';
import type { ArticleMode, ArticleFormData } from './_components';

// Dynamic imports for code splitting
const ModeSelector = dynamic(() => import('./_components/ModeSelector'), { ssr: false });
const ArticleForm = dynamic(() => import('./_components/ArticleForm'), { ssr: false });
const ImageUploader = dynamic(() => import('./_components/ImageUploader'), { ssr: false });
const GeneratingLoader = dynamic(() => import('./_components/GeneratingLoader'), { ssr: false });
const ArticlePreviewModal = dynamic(() => import('./_components/ArticlePreviewModal'), { ssr: false });

type Step = 'mode' | 'form' | 'generating' | 'preview';

interface GeneratedArticle {
    title: string;
    content: string;
    hashtags: string[];
    imageUrl?: string;
}

export default function ArticlePage() {
    const [step, setStep] = useState<Step>('mode');
    const [mode, setMode] = useState<ArticleMode | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const [generatedArticle, setGeneratedArticle] = useState<GeneratedArticle | null>(null);
    const [customImageUrls, setCustomImageUrls] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModeSelect = useCallback((selectedMode: ArticleMode) => {
        setMode(selectedMode);
        setStep('form');
    }, []);

    const handleFormSubmit = useCallback(async (formData: ArticleFormData) => {
        setStep('generating');

        try {
            let uploadedImageUrl: string | undefined;

            // Upload image if manual mode and has images
            if (mode === 'manual' && images.length > 0) {
                try {
                    toast.loading('Đang upload ảnh...', { id: 'upload' });
                    const uploadResult = await uploadImage(images[0], 'articles');
                    uploadedImageUrl = uploadResult.url;
                    setCustomImageUrls([getImageUrl(uploadResult.url)]);
                    toast.success('Upload ảnh thành công!', { id: 'upload' });
                } catch (uploadError) {
                    console.error('Upload error:', uploadError);
                    toast.error('Lỗi upload ảnh, tiếp tục tạo bài viết không có ảnh', { id: 'upload' });
                }
            }

            // Call Gemini API to generate and save article
            toast.loading('Đang tạo bài viết với AI...', { id: 'generate' });

            const result = await generateAndSaveArticle({
                mode: mode || 'ai_image',
                topic: formData.topic,
                purpose: formData.purpose,
                wordCount: formData.wordCount,
                description: formData.description,
                imageUrl: uploadedImageUrl,
                useBrandSettings: formData.useBrandSettings
            });

            // Set generated article data
            const article: GeneratedArticle = {
                title: result.generated.title,
                content: result.generated.content,
                hashtags: result.generated.hashtags || [],
                imageUrl: result.generated.imageUrl || uploadedImageUrl
            };

            setGeneratedArticle(article);

            // If AI image mode and has imageUrl, set it
            if (mode === 'ai_image' && result.generated.imageUrl) {
                setCustomImageUrls([result.generated.imageUrl]);
            }

            toast.success('Tạo bài viết thành công! 🎉', { id: 'generate' });
            setStep('preview');
            setIsModalOpen(true);

        } catch (error: unknown) {
            console.error('Generate error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Lỗi khi tạo bài viết';
            toast.error(errorMessage, { id: 'generate' });
            setStep('form');
        }
    }, [mode, images]);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleOpenModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const handleReset = useCallback(() => {
        setStep('mode');
        setMode(null);
        setImages([]);
        setGeneratedArticle(null);
        setCustomImageUrls([]);
        setIsModalOpen(false);
    }, []);

    const handleBack = useCallback(() => {
        if (step === 'form') {
            setStep('mode');
            setMode(null);
        }
    }, [step]);

    return (
        <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-4 mb-4">
                    {step !== 'mode' && step !== 'preview' && (
                        <button
                            onClick={handleBack}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Tạo bài viết AI
                        </h1>
                        <p className="text-gray-600">
                            {step === 'mode' && 'Chọn cách tạo bài viết'}
                            {step === 'form' && 'Nhập thông tin bài viết'}
                            {step === 'generating' && 'Đang tạo bài viết...'}
                            {step === 'preview' && 'Xem trước bài viết'}
                        </p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center gap-2">
                    {['mode', 'form', 'preview'].map((s, i) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${step === s || (step === 'generating' && s === 'form')
                                ? 'bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white'
                                : (step === 'preview' && s !== 'preview') || (step === 'generating' && s === 'mode')
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-500'
                                }`}>
                                {(step === 'preview' && s !== 'preview') || (step === 'generating' && s === 'mode') ? (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    i + 1
                                )}
                            </div>
                            {i < 2 && (
                                <div className={`w-12 h-1 mx-2 rounded ${(step === 'form' && s === 'mode') ||
                                    (step === 'generating' && s !== 'preview') ||
                                    step === 'preview'
                                    ? 'bg-green-500'
                                    : 'bg-gray-200'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 shadow-sm">
                <AnimatePresence mode="wait">
                    {/* Step 1: Mode Selection */}
                    {step === 'mode' && (
                        <motion.div
                            key="mode"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <ModeSelector
                                selectedMode={mode}
                                onSelectMode={handleModeSelect}
                            />
                        </motion.div>
                    )}

                    {/* Step 2: Form */}
                    {step === 'form' && (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            {/* Image Uploader (manual mode only) */}
                            {mode === 'manual' && (
                                <ImageUploader
                                    images={images}
                                    onImagesChange={setImages}
                                />
                            )}

                            {/* Article Form */}
                            <ArticleForm
                                onSubmit={handleFormSubmit}
                                isLoading={false}
                            />
                        </motion.div>
                    )}

                    {/* Step 3: Preview (after generation) */}
                    {step === 'preview' && generatedArticle && (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="text-center py-8"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Bài viết đã tạo xong!
                            </h2>
                            <p className="text-gray-500 mb-6">
                                Xem trước và đăng lên Facebook ngay
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={handleReset}
                                    className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Tạo bài mới
                                </button>
                                <button
                                    onClick={handleOpenModal}
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white font-medium hover:shadow-lg transition-all"
                                >
                                    Xem bài viết
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Generating Loader */}
            <AnimatePresence>
                {step === 'generating' && <GeneratingLoader />}
            </AnimatePresence>

            {/* Preview Modal */}
            <ArticlePreviewModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                article={generatedArticle}
                customImages={customImageUrls.length > 0 ? customImageUrls : undefined}
            />
        </div>
    );
}
