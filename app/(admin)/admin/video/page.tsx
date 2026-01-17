'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { generateFakeScript, type GeneratedScript, type VideoScriptInput } from '@/lib/fakeData';

// Dynamic imports
const VideoScriptForm = dynamic(() => import('./_components/VideoScriptForm'), { ssr: false });
const ScriptLoadingAnimation = dynamic(() => import('./_components/ScriptLoadingAnimation'), { ssr: false });
const SceneTable = dynamic(() => import('./_components/SceneTable'), { ssr: false });

type Step = 'form' | 'loading' | 'result';

export default function VideoScriptPage() {
    const [step, setStep] = useState<Step>('form');
    const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);

    const handleFormSubmit = useCallback(async (data: VideoScriptInput) => {
        setStep('loading');

        // Fake AI generation delay (2 seconds)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate fake script
        const script = generateFakeScript();
        setGeneratedScript(script);
        setStep('result');
    }, []);

    const handleReset = useCallback(() => {
        setStep('form');
        setGeneratedScript(null);
    }, []);

    return (
        <div className="max-w-6xl mx-auto">
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
                                isLoading={false}
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
                                script={generatedScript}
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
