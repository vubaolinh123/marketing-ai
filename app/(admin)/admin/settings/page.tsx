'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { settingsApi } from '@/lib/api';
import { showSuccess, showError } from '@/lib/toast';

// Dynamic imports
const BrandLogoSection = dynamic(() => import('./_components/BrandLogoSection'), { ssr: false });
const BrandColorsSection = dynamic(() => import('./_components/BrandColorsSection'), { ssr: false });
const BrandLanguageSection = dynamic(() => import('./_components/BrandLanguageSection'), { ssr: false });
const BrandToneSection = dynamic(() => import('./_components/BrandToneSection'), { ssr: false });
const BrandProductSection = dynamic(() => import('./_components/BrandProductSection'), { ssr: false });
const FacebookSettingsSection = dynamic(() => import('./_components/FacebookSettingsSection'), { ssr: false });
const AIModelSettingsSection = dynamic(() => import('./_components/AIModelSettingsSection'), { ssr: false });

interface BrandData {
    logo: {
        brandName: string;
        logoUrl: string;
        brandIdentity: string;
        resourceLinks: { label: string; url: string }[];
    };
    colors: {
        primaryColor: string;
        backgroundColor: string;
        accentColor: string;
    };
    language: {
        keywords: string[];
        customerTerm: string;
        brandPronoun: string;
    };
    tone: {
        overallTone: string[];
        contextDescriptions: { context: string; description: string }[];
    };
    product: {
        productGroups: string[];
        strengths: string;
        suitableFor: string[];
    };
    facebook: {
        facebookToken: string;
    };
    aiModels: {
        textModel: string;
        visionModel: string;
        imageGenModel: string;
    };
}

interface GeminiModel {
    name?: string;
    modelId?: string;
    supportedGenerationMethods?: string[];
    displayName?: string;
    description?: string;
    deprecated?: boolean;
}

const IMAGE_GEN_EXPLICIT_IDS = new Set([
    'gemini-2.5-flash-image',
    'gemini-3-pro-image-preview',
    'gemini-2.0-flash-exp-image-generation',
]);

const normalizeModelId = (value: string) => value.replace(/^models\//, '').trim();

const getModelId = (model: GeminiModel) => normalizeModelId(model.modelId || model.name || '');

const isImageGenerationModel = (model: GeminiModel) => {
    const modelId = getModelId(model).toLowerCase();
    const methods = model.supportedGenerationMethods || [];
    const methodsText = methods.join(' ').toLowerCase();
    const metadata = [model.name, model.displayName, model.description, methodsText]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

    return (
        IMAGE_GEN_EXPLICIT_IDS.has(modelId) ||
        metadata.includes('image-generation') ||
        metadata.includes('image generation') ||
        metadata.includes('imagegen') ||
        metadata.includes('imagen') ||
        metadata.includes('generateimage') ||
        methods.some(method => ['generateImages', 'generateImage'].includes(method))
    );
};

const sanitizeModelSelection = (
    currentValue: string | undefined,
    defaultValue: string,
    allowedModelIds: Set<string>
) => {
    const normalizedCurrent = normalizeModelId(currentValue || '');
    if (!normalizedCurrent) return defaultValue;

    if (allowedModelIds.size === 0) {
        return /native-audio-dialog/i.test(normalizedCurrent) ? defaultValue : normalizedCurrent;
    }

    return allowedModelIds.has(normalizedCurrent) ? normalizedCurrent : defaultValue;
};

const pickImageGenFallback = (allowedModelIds: Set<string>) => {
    const preferredOrder = [
        'gemini-2.5-flash-image',
        'gemini-3-pro-image-preview',
        'gemini-2.0-flash-exp-image-generation',
    ];

    for (const modelId of preferredOrder) {
        if (allowedModelIds.has(modelId)) return modelId;
    }

    return defaultData.aiModels.imageGenModel;
};

const sanitizeAiModels = (incoming: Partial<BrandData['aiModels']> | undefined, models: GeminiModel[]) => {
    const textAllowed = new Set(
        models
            .filter(model => model.supportedGenerationMethods?.includes('generateContent'))
            .map(getModelId)
            .filter(Boolean)
    );

    const visionAllowed = new Set(
        models
            .filter(model => model.supportedGenerationMethods?.includes('generateContent'))
            .map(getModelId)
            .filter(Boolean)
    );

    const imageAllowed = new Set(
        models
            .filter(isImageGenerationModel)
            .map(getModelId)
            .filter(Boolean)
    );

    const imageDefault = pickImageGenFallback(imageAllowed);

    return {
        textModel: sanitizeModelSelection(incoming?.textModel, defaultData.aiModels.textModel, textAllowed),
        visionModel: sanitizeModelSelection(incoming?.visionModel, defaultData.aiModels.visionModel, visionAllowed),
        imageGenModel: sanitizeModelSelection(incoming?.imageGenModel, imageDefault, imageAllowed),
    };
};

const fetchGeminiModels = async (): Promise<GeminiModel[]> => {
    try {
        const response = await fetch('/api/gemini-models');
        const result = await response.json();

        if (!result.success || !Array.isArray(result.models)) {
            return [];
        }

        return result.models as GeminiModel[];
    } catch {
        return [];
    }
};

const defaultData: BrandData = {
    logo: {
        brandName: '',
        logoUrl: '',
        brandIdentity: '',
        resourceLinks: [],
    },
    colors: {
        primaryColor: '#F59E0B',
        backgroundColor: '#1a1a1a',
        accentColor: '#0891b2',
    },
    language: {
        keywords: [],
        customerTerm: '',
        brandPronoun: '',
    },
    tone: {
        overallTone: [],
        contextDescriptions: [],
    },
    product: {
        productGroups: [],
        strengths: '',
        suitableFor: [],
    },
    facebook: {
        facebookToken: '',
    },
    aiModels: {
        textModel: 'gemini-2.5-flash',
        visionModel: 'gemini-2.0-flash',
        imageGenModel: 'gemini-2.5-flash-image',
    },
};

const sections = [
    {
        id: 'logo',
        title: 'Logo & Tài nguyên thương hiệu',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        id: 'colors',
        title: 'Bảng màu thương hiệu',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
        ),
    },
    {
        id: 'language',
        title: 'Ngôn ngữ & Thuật ngữ',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
        ),
    },
    {
        id: 'tone',
        title: 'Giọng điệu thương hiệu',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
        ),
    },
    {
        id: 'product',
        title: 'Sản phẩm / Dịch vụ',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
    },
    {
        id: 'facebook',
        title: 'Cấu hình Facebook',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
            </svg>
        ),
    },
    {
        id: 'aiModels',
        title: 'AI Model Settings',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
];

export default function BrandSettingsPage() {
    const [data, setData] = useState<BrandData>(defaultData);
    const [expandedSections, setExpandedSections] = useState<string[]>(['logo']);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setIsLoading(true);
                const [response, availableModels] = await Promise.all([
                    settingsApi.get(),
                    fetchGeminiModels(),
                ]);

                if (response.success && response.data) {
                    const settings = response.data;
                    setData({
                        logo: {
                            brandName: settings.logo?.brandName || '',
                            logoUrl: settings.logo?.logoUrl || '',
                            brandIdentity: settings.logo?.brandIdentity || '',
                            resourceLinks: settings.logo?.resourceLinks || []
                        },
                        colors: {
                            primaryColor: settings.colors?.primaryColor || '#F59E0B',
                            backgroundColor: settings.colors?.backgroundColor || '#1a1a1a',
                            accentColor: settings.colors?.accentColor || '#0891b2'
                        },
                        language: {
                            keywords: settings.language?.keywords || [],
                            customerTerm: settings.language?.customerTerm || '',
                            brandPronoun: settings.language?.brandPronoun || ''
                        },
                        tone: {
                            overallTone: settings.tone?.overallTone || [],
                            contextDescriptions: settings.tone?.contextDescriptions || []
                        },
                        product: {
                            productGroups: settings.product?.productGroups || [],
                            strengths: settings.product?.strengths || '',
                            suitableFor: settings.product?.suitableFor || []
                        },
                        facebook: {
                            facebookToken: settings.facebook?.facebookToken || ''
                        },
                        aiModels: {
                            ...sanitizeAiModels(settings.aiModels, availableModels)
                        }
                    });
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const toggleSection = useCallback((sectionId: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    }, []);

    const handleSave = useCallback(async () => {
        setIsSaving(true);

        try {
            const response = await settingsApi.update(data);

            if (response.success) {
                showSuccess('Đã lưu cài đặt thương hiệu!');
            } else {
                showError(response.message || 'Lưu thất bại');
            }
        } catch (error: unknown) {
            console.error('Save error:', error);
            const apiError = error as { message?: string };
            showError(apiError.message || 'Đã xảy ra lỗi khi lưu');
        } finally {
            setIsSaving(false);
        }
    }, [data]);

    const renderSectionContent = (sectionId: string) => {
        switch (sectionId) {
            case 'logo':
                return (
                    <BrandLogoSection
                        data={data.logo}
                        onChange={(logoData) => setData(prev => ({ ...prev, logo: logoData }))}
                    />
                );
            case 'colors':
                return (
                    <BrandColorsSection
                        data={data.colors}
                        onChange={(colorsData) => setData(prev => ({ ...prev, colors: colorsData }))}
                    />
                );
            case 'language':
                return (
                    <BrandLanguageSection
                        data={data.language}
                        onChange={(languageData) => setData(prev => ({ ...prev, language: languageData }))}
                    />
                );
            case 'tone':
                return (
                    <BrandToneSection
                        data={data.tone}
                        onChange={(toneData) => setData(prev => ({ ...prev, tone: toneData }))}
                    />
                );
            case 'product':
                return (
                    <BrandProductSection
                        data={data.product}
                        onChange={(productData) => setData(prev => ({ ...prev, product: productData }))}
                    />
                );
            case 'facebook':
                return (
                    <FacebookSettingsSection
                        data={data.facebook}
                        onChange={(facebookData) => setData(prev => ({ ...prev, facebook: facebookData }))}
                    />
                );
            case 'aiModels':
                return (
                    <AIModelSettingsSection
                        data={data.aiModels}
                        onChange={(aiModelsData) => setData(prev => ({ ...prev, aiModels: aiModelsData }))}
                    />
                );
            default:
                return null;
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="w-[96%] max-w-[1700px] mx-auto">
                <div className="mb-8">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 w-96 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                                <div className="h-5 w-48 bg-gray-200 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-[96%] max-w-[1700px] mx-auto">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Cài đặt thương hiệu
                </h1>
                <p className="text-gray-600">
                    Thiết lập thông tin thương hiệu để AI tạo nội dung phù hợp hơn với doanh nghiệp của bạn
                </p>
            </motion.div>

            {/* Accordion Sections */}
            <div className="space-y-4 mb-8">
                {sections.map((section, index) => {
                    const isExpanded = expandedSections.includes(section.id);

                    return (
                        <motion.div
                            key={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
                        >
                            {/* Header */}
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        'w-10 h-10 rounded-xl flex items-center justify-center',
                                        isExpanded
                                            ? 'bg-gradient-to-r from-[#F59E0B] to-[#EA580C] text-white'
                                            : 'bg-gray-100 text-gray-500'
                                    )}>
                                        {section.icon}
                                    </div>
                                    <span className={cn(
                                        'font-semibold',
                                        isExpanded ? 'text-gray-900' : 'text-gray-700'
                                    )}>
                                        {section.title}
                                    </span>
                                </div>
                                <motion.svg
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-5 h-5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </motion.svg>
                            </button>

                            {/* Content */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                                            {renderSectionContent(section.id)}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {/* Save Button */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="sticky bottom-6 flex justify-center"
            >
                <Button
                    onClick={handleSave}
                    variant="primary"
                    size="lg"
                    isLoading={isSaving}
                    className="shadow-xl min-w-[200px]"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Lưu cài đặt
                </Button>
            </motion.div>
        </div>
    );
}
