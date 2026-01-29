'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { videoScriptApi, VideoScript } from '@/lib/api';
import toast from '@/lib/toast';
import type { VideoScriptFormData } from './_components/VideoScriptForm';

// Dynamic imports
const VideoScriptForm = dynamic(() => import('./_components/VideoScriptForm'), { ssr: false });
const ScriptLoadingAnimation = dynamic(() => import('./_components/ScriptLoadingAnimation'), { ssr: false });
const SceneTable = dynamic(() => import('./_components/SceneTable'), { ssr: false });

type Step = 'form' | 'loading' | 'result';

export default function VideoScriptPage() {
    const [step, setStep] = useState<Step>('form');
    const [generatedScript, setGeneratedScript] = useState<VideoScript | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFormSubmit = useCallback(async (data: VideoScriptFormData) => {
        setStep('loading');
        setIsLoading(true);

        try {
            const response = await videoScriptApi.generate({
                title: data.title,
                duration: data.duration,
                sceneCount: data.sceneCount,
                size: data.size,
                hasVoiceOver: data.hasVoiceOver,
                otherRequirements: data.otherRequirements,
                ideaMode: data.ideaMode,
                customIdea: data.customIdea,
                useBrandSettings: data.useBrandSettings
            });

            if (response.success && response.data) {
                setGeneratedScript(response.data);
                setStep('result');
                toast.success('Tạo kịch bản thành công!');
            } else {
                throw new Error(response.message || 'Lỗi không xác định');
            }
        } catch (error: unknown) {
            console.error('Generate script error:', error);
            const message = error instanceof Error ? error.message : 'Lỗi khi tạo kịch bản';
            toast.error(message);
            setStep('form');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleReset = useCallback(() => {
        setStep('form');
        setGeneratedScript(null);
    }, []);

    return (
        <div className="w-[95%] max-w-[1600px] mx-auto">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-4 mb-4">
                    {step === 'result' && (
                        <button
                            onClick={handleReset}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Tạo kịch bản Video AI
                        </h1>
                        <p className="text-gray-600">
                            {step === 'form' && 'Nhập thông tin để AI tạo kịch bản video'}
                            {step === 'loading' && 'Đang tạo kịch bản...'}
                            {step === 'result' && 'Kịch bản đã được tạo thành công'}
                        </p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center gap-2">
                    {['form', 'result'].map((s, i) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${step === s || (step === 'loading' && s === 'form')
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                : step === 'result' && s === 'form'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-500'
                                }`}>
                                {step === 'result' && s === 'form' ? (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    i + 1
                                )}
                            </div>
                            {i < 1 && (
                                <div className={`w-12 h-1 mx-2 rounded ${step === 'result' || step === 'loading'
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
                    {step === 'form' && (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <VideoScriptForm
                                onSubmit={handleFormSubmit}
                                isLoading={isLoading}
                            />
                        </motion.div>
                    )}

                    {step === 'result' && generatedScript && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <SceneTable
                                script={{
                                    summary: generatedScript.summary,
                                    scenes: generatedScript.scenes.map(scene => ({
                                        id: scene.sceneNumber,
                                        location: scene.location,
                                        shotType: scene.shotType,
                                        description: scene.description,
                                        voiceOver: scene.voiceOver,
                                        source: scene.source,
                                        note: scene.note
                                    }))
                                }}
                                onReset={handleReset}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Loading Animation */}
            <AnimatePresence>
                {step === 'loading' && <ScriptLoadingAnimation />}
            </AnimatePresence>
        </div>
    );
}
