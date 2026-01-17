'use client';

import TagsInput from './TagsInput';
import { cn } from '@/lib/utils';

interface BrandToneSectionProps {
    data: {
        overallTone: string[];
        contextDescriptions: { context: string; description: string }[];
    };
    onChange: (data: BrandToneSectionProps['data']) => void;
}

const suggestedTones = [
    'Chuyên nghiệp',
    'Thân thiện',
    'Chỉn chu',
    'Điềm đạm',
    'Năng động',
    'Trẻ trung',
    'Sang trọng',
    'Gần gũi',
    'Có chiều sâu',
    'Không phô trương',
    'Hài hước',
    'Nghiêm túc',
];

export default function BrandToneSection({ data, onChange }: BrandToneSectionProps) {
    const addContext = () => {
        onChange({
            ...data,
            contextDescriptions: [...data.contextDescriptions, { context: '', description: '' }],
        });
    };

    const updateContext = (index: number, field: 'context' | 'description', value: string) => {
        const updated = [...data.contextDescriptions];
        updated[index] = { ...updated[index], [field]: value };
        onChange({ ...data, contextDescriptions: updated });
    };

    const removeContext = (index: number) => {
        onChange({
            ...data,
            contextDescriptions: data.contextDescriptions.filter((_, i) => i !== index),
        });
    };

    return (
        <div className="space-y-6">
            {/* Overall Tone - Tags Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tổng thể phong cách
                </label>
                <TagsInput
                    value={data.overallTone}
                    onChange={(overallTone) => onChange({ ...data, overallTone })}
                    placeholder="Nhập phong cách giọng điệu..."
                />

                {/* Suggested Tones */}
                <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Gợi ý nhanh:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedTones.map(tone => (
                            <button
                                key={tone}
                                type="button"
                                onClick={() => {
                                    if (!data.overallTone.includes(tone)) {
                                        onChange({ ...data, overallTone: [...data.overallTone, tone] });
                                    }
                                }}
                                disabled={data.overallTone.includes(tone)}
                                className={cn(
                                    'px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
                                    data.overallTone.includes(tone)
                                        ? 'bg-amber-50 text-[#F59E0B] border-[#F59E0B] cursor-not-allowed'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#F59E0B] hover:text-[#F59E0B]'
                                )}
                            >
                                {data.overallTone.includes(tone) ? '✓ ' : '+ '}{tone}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Context-specific Descriptions */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                        Giọng điệu theo ngữ cảnh
                    </label>
                    <button
                        type="button"
                        onClick={addContext}
                        className="text-sm text-[#F59E0B] hover:text-amber-600 font-medium flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Thêm ngữ cảnh
                    </button>
                </div>

                <p className="text-xs text-gray-500 mb-3">
                    Mô tả cách AI nên viết trong từng ngữ cảnh cụ thể của doanh nghiệp bạn
                </p>

                <div className="space-y-4">
                    {data.contextDescriptions.map((item, index) => (
                        <div key={index} className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="flex-1 space-y-3">
                                    <input
                                        type="text"
                                        value={item.context}
                                        onChange={(e) => updateContext(index, 'context', e.target.value)}
                                        placeholder="Ngữ cảnh: VD: Khi giới thiệu sản phẩm, Khi tư vấn, Khi bán hàng..."
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                                    />
                                    <textarea
                                        value={item.description}
                                        onChange={(e) => updateContext(index, 'description', e.target.value)}
                                        placeholder="Mô tả cách viết: VD: Gợi mở, không ép buộc, tập trung vào lợi ích..."
                                        rows={2}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent resize-none transition-all"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeContext(index)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}

                    {data.contextDescriptions.length === 0 && (
                        <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">
                            <p className="text-sm text-gray-400 mb-2">Chưa có ngữ cảnh nào</p>
                            <button
                                type="button"
                                onClick={addContext}
                                className="text-sm text-[#F59E0B] hover:text-amber-600 font-medium"
                            >
                                + Thêm ngữ cảnh đầu tiên
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
