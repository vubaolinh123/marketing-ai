'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

// Dynamic imports
const BrandLogoSection = dynamic(() => import('./_components/BrandLogoSection'), { ssr: false });
const BrandColorsSection = dynamic(() => import('./_components/BrandColorsSection'), { ssr: false });
const BrandLanguageSection = dynamic(() => import('./_components/BrandLanguageSection'), { ssr: false });
const BrandToneSection = dynamic(() => import('./_components/BrandToneSection'), { ssr: false });
const BrandProductSection = dynamic(() => import('./_components/BrandProductSection'), { ssr: false });

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
}

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
];

export default function BrandSettingsPage() {
    const [data, setData] = useState<BrandData>(defaultData);
    const [expandedSections, setExpandedSections] = useState<string[]>(['logo']);
    const [isSaving, setIsSaving] = useState(false);

    const toggleSection = useCallback((sectionId: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    }, []);

    const handleSave = useCallback(async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        alert('Đã lưu cài đặt thương hiệu!');
    }, []);

    const renderSectionContent = (sectionId: string) => {
        switch (sectionId) {
            case 'logo':
                return (
                    <BrandLogoSection
                        data={data.logo}
                        onChange={(logoData) => setData({ ...data, logo: logoData })}
                    />
                );
            case 'colors':
                return (
                    <BrandColorsSection
                        data={data.colors}
                        onChange={(colorsData) => setData({ ...data, colors: colorsData })}
                    />
                );
            case 'language':
                return (
                    <BrandLanguageSection
                        data={data.language}
                        onChange={(languageData) => setData({ ...data, language: languageData })}
                    />
                );
            case 'tone':
                return (
                    <BrandToneSection
                        data={data.tone}
                        onChange={(toneData) => setData({ ...data, tone: toneData })}
                    />
                );
            case 'product':
                return (
                    <BrandProductSection
                        data={data.product}
                        onChange={(productData) => setData({ ...data, product: productData })}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
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
