'use client';

import { useState, useRef, useEffect } from 'react';

// Types
interface GeminiModel {
    name: string;
    modelId?: string;
    displayName: string;
    description: string;
    supportedGenerationMethods: string[];
    deprecated?: boolean;
}

interface AIModelsData {
    textModel: string;
    visionModel: string;
    imageGenModel: string;
}

interface AIModelSettingsSectionProps {
    data: AIModelsData;
    onChange: (data: AIModelsData) => void;
}

type TaskType = 'text' | 'vision' | 'imageGen';

const EXPLICIT_IMAGE_GEN_MODEL_IDS = new Set([
    'gemini-2.5-flash-image',
    'gemini-3-pro-image-preview',
    'gemini-2.0-flash-exp-image-generation',
]);

const normalizeModelId = (value: string) => value.replace(/^models\//, '').trim();

const getModelId = (model: Pick<GeminiModel, 'name' | 'modelId'>) => {
    return normalizeModelId(model.modelId || model.name || '');
};

const isImageGenerationModel = (model: GeminiModel) => {
    const modelId = getModelId(model).toLowerCase();
    const methods = model.supportedGenerationMethods || [];
    const methodsText = methods.join(' ').toLowerCase();
    const metadata = [model.name, model.displayName, model.description, methodsText]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

    return (
        EXPLICIT_IMAGE_GEN_MODEL_IDS.has(modelId) ||
        metadata.includes('image-generation') ||
        metadata.includes('image generation') ||
        metadata.includes('imagegen') ||
        metadata.includes('imagen') ||
        metadata.includes('generateimage') ||
        methods.some(method => ['generateImages', 'generateImage'].includes(method))
    );
};

// Model Recommendations Data
const MODEL_RECOMMENDATIONS = {
    text: [
        {
            model_name: "Gemini 2.5 Flash",
            model_id: "gemini-2.5-flash",
            performance: "High Speed & Balanced",
            token_cost: "Low",
            best_for: "Chatbot CSKH, Xử lý văn bản số lượng lớn, Tóm tắt nội dung dài",
            speed: "Very Fast",
            recommended: true
        },
        {
            model_name: "Gemini 2.5 Pro",
            model_id: "gemini-2.5-pro",
            performance: "Extreme High (Reasoning)",
            token_cost: "Very High",
            best_for: "Lập trình phức tạp, Viết sáng tạo, Logic, Toán học",
            speed: "Medium"
        },
        {
            model_name: "Gemini 2.5 Flash-Lite",
            model_id: "gemini-2.5-flash-lite",
            performance: "Efficient",
            token_cost: "Lowest",
            best_for: "Phân loại tin nhắn, Spam filter, Tác vụ cực đơn giản",
            speed: "Ultra Fast"
        }
    ],
    vision: [
        {
            model_name: "Gemini 2.5 Flash",
            model_id: "gemini-2.5-flash",
            performance: "Fast Vision",
            best_for: "OCR (Đọc chữ hóa đơn/CCCD), Nhận diện vật thể nhanh",
            note: "Recommended cho đa số tác vụ Vision",
            recommended: true
        },
        {
            model_name: "Gemini 2.5 Pro",
            model_id: "gemini-2.5-pro",
            performance: "Deep Detail Vision",
            best_for: "Phân tích biểu đồ y tế, Bản vẽ kỹ thuật, Soi chi tiết nhỏ"
        }
    ],
    imageGen: [
        {
            model_name: "Gemini 2.5 Flash Image",
            model_id: "gemini-2.5-flash-image",
            performance: "High Quality & Fast",
            best_for: "Ảnh marketing, sản phẩm, social post chất lượng cao",
            cost: "Medium",
            speed: "Fast",
            badge: "Xịn",
            note: "Khuyến nghị mặc định cho chất lượng/chi phí cân bằng",
            recommended: true
        },
        {
            model_name: "Gemini 3 Pro Image (Preview)",
            model_id: "gemini-3-pro-image-preview",
            performance: "Premium Quality",
            best_for: "Visual cao cấp, concept sáng tạo, campaign quan trọng",
            cost: "High",
            speed: "Medium",
            badge: "Preview",
            note: "Model preview cho chất lượng cao nhất, dùng khi cần output premium"
        },
        {
            model_name: "Gemini 2.0 Flash Image (Stable)",
            model_id: "gemini-2.0-flash-exp-image-generation",
            performance: "Stable & Efficient",
            best_for: "Khối lượng lớn, luồng ổn định, fallback an toàn",
            cost: "Low",
            speed: "Very Fast",
            badge: "Ổn định",
            note: "Fallback khi model mới chưa khả dụng"
        }
    ]
};

export default function AIModelSettingsSection({ data, onChange }: AIModelSettingsSectionProps) {
    // Cached models per task type
    const [modelCache, setModelCache] = useState<Record<TaskType, GeminiModel[]>>({
        text: [],
        vision: [],
        imageGen: []
    });

    // Loading state per task type
    const [loadingStates, setLoadingStates] = useState<Record<TaskType, boolean>>({
        text: false,
        vision: false,
        imageGen: false
    });

    // Open dropdown state
    const [openDropdown, setOpenDropdown] = useState<TaskType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [inlineError, setInlineError] = useState<Record<TaskType, string | null>>({
        text: null,
        vision: null,
        imageGen: null,
    });

    // Refs for click outside detection
    const dropdownRefs = useRef<Record<TaskType, HTMLDivElement | null>>({
        text: null,
        vision: null,
        imageGen: null
    });

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openDropdown) {
                const ref = dropdownRefs.current[openDropdown];
                if (ref && !ref.contains(event.target as Node)) {
                    setOpenDropdown(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDropdown]);

    // Fetch models from Next.js API route
    const fetchModels = async (taskType: TaskType): Promise<GeminiModel[]> => {
        if (modelCache[taskType].length > 0) {
            return modelCache[taskType];
        }

        try {
            setLoadingStates(prev => ({ ...prev, [taskType]: true }));
            setError(null);

            const response = await fetch('/api/gemini-models');
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Lỗi khi lấy danh sách models');
            }

            const models: GeminiModel[] = result.models;

            let filteredModels: GeminiModel[] = [];

            switch (taskType) {
                case 'text':
                case 'vision':
                    filteredModels = models.filter(m =>
                        m.supportedGenerationMethods?.includes('generateContent')
                    );
                    break;
                case 'imageGen':
                    filteredModels = models.filter(m =>
                        isImageGenerationModel(m)
                    );
                    break;
            }

            setModelCache(prev => ({ ...prev, [taskType]: filteredModels }));
            return filteredModels;
        } catch (err) {
            console.error('Failed to fetch models:', err);
            setError(err instanceof Error ? err.message : 'Lỗi kết nối');
            return [];
        } finally {
            setLoadingStates(prev => ({ ...prev, [taskType]: false }));
        }
    };

    const refreshModels = async (taskType: TaskType, e: React.MouseEvent) => {
        e.stopPropagation();
        setModelCache(prev => ({ ...prev, [taskType]: [] }));
        await fetchModels(taskType);
    };

    const toggleDropdown = async (taskType: TaskType) => {
        setInlineError(prev => ({ ...prev, [taskType]: null }));
        if (openDropdown === taskType) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(taskType);
            await fetchModels(taskType);
        }
    };

    const selectModel = (taskType: TaskType, modelId: string, fieldKey: keyof AIModelsData) => {
        setInlineError(prev => ({ ...prev, [taskType]: null }));
        onChange({ ...data, [fieldKey]: modelId });
        setOpenDropdown(null);
    };

    const getDisplayName = (taskType: TaskType, value: string) => {
        if (!value) return 'Chọn model...';
        const models = modelCache[taskType];
        const model = models.find(m => getModelId(m) === value);
        return model?.displayName || value;
    };

    const applyRecommendation = async (
        taskType: TaskType,
        fieldKey: keyof AIModelsData,
        modelId: string
    ) => {
        setInlineError(prev => ({ ...prev, [taskType]: null }));
        const normalizedModelId = normalizeModelId(modelId);
        const models = await fetchModels(taskType);
        const hasModel = models.some(model => getModelId(model) === normalizedModelId);

        if (!hasModel) {
            setInlineError(prev => ({
                ...prev,
                [taskType]: `Model "${normalizedModelId}" hiện không có trong danh sách khả dụng.`,
            }));
            return;
        }

        onChange({ ...data, [fieldKey]: normalizedModelId });
    };

    const renderRecommendations = (taskType: TaskType, fieldKey: keyof AIModelsData) => {
        const recs = MODEL_RECOMMENDATIONS[taskType];
        const currentValue = data[fieldKey];

        return (
            <div className="flex flex-wrap gap-2 mt-2">
                {recs.map((rec) => {
                    const isActive = currentValue === rec.model_id;
                    return (
                        <button
                            key={rec.model_id}
                            type="button"
                            onClick={() => applyRecommendation(taskType, fieldKey, rec.model_id)}
                            className={`group relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isActive
                                ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-400'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            title={rec.best_for}
                        >
                            <span className="flex items-center gap-1.5">
                                {rec.recommended && (
                                    <span className="text-amber-500">⭐</span>
                                )}
                                {rec.model_name}
                                {'badge' in rec && (
                                    <span className="px-1.5 py-0.5 rounded bg-gray-200 text-[10px] text-gray-700">
                                        {rec.badge}
                                    </span>
                                )}
                            </span>

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 max-w-xs">
                                <div className="font-medium mb-1">{rec.model_name}</div>
                                <div className="text-gray-300 text-[10px] space-y-0.5">
                                    <div>📊 {rec.performance}</div>
                                    <div>✨ {rec.best_for}</div>
                                    {'token_cost' in rec && <div>💰 Token: {rec.token_cost}</div>}
                                    {'cost' in rec && <div>💰 Cost: {rec.cost}</div>}
                                    {'speed' in rec && <div>⚡ {rec.speed}</div>}
                                    {'note' in rec && <div>📝 {rec.note}</div>}
                                </div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                            </div>
                        </button>
                    );
                })}

                {inlineError[taskType] && (
                    <p className="w-full text-xs text-red-600">{inlineError[taskType]}</p>
                )}
            </div>
        );
    };

    const renderModelSelect = (
        taskType: TaskType,
        label: string,
        value: string,
        fieldKey: keyof AIModelsData,
        icon: React.ReactNode,
        openUpward: boolean = false
    ) => {
        const models = modelCache[taskType];
        const isLoading = loadingStates[taskType];
        const isOpen = openDropdown === taskType;
        const selectedModelInvalid = Boolean(
            value && models.length > 0 && !models.some(model => getModelId(model) === value)
        );

        return (
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {icon}
                        <label className="block text-sm font-medium text-gray-700">
                            {label}
                        </label>
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedModelInvalid && (
                            <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-medium">
                                Model hiện tại không khả dụng
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={(e) => refreshModels(taskType, e)}
                            disabled={isLoading}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                            title="Làm mới danh sách"
                        >
                            <svg
                                className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Quick Recommendations */}
                {renderRecommendations(taskType, fieldKey)}

                {/* Custom Dropdown */}
                <div
                    ref={(el) => { dropdownRefs.current[taskType] = el; }}
                    className="relative"
                >
                    <button
                        type="button"
                        onClick={() => toggleDropdown(taskType)}
                        className={`w-full px-4 py-2.5 rounded-xl border bg-white text-left flex items-center justify-between transition-all text-sm ${isOpen
                            ? 'border-[#F59E0B] ring-2 ring-[#F59E0B]/20'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <span className={value ? 'text-gray-800' : 'text-gray-400 truncate pr-2'}>
                            {value ? getDisplayName(taskType, value) : 'Hoặc chọn model khác...'}
                        </span>
                        <div className="flex items-center gap-2">
                            {isLoading ? (
                                <svg className="w-4 h-4 animate-spin text-[#F59E0B]" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                            ) : (
                                <svg
                                    className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            )}
                        </div>
                    </button>

                    {isOpen && (
                        <div className={`absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden ${openUpward ? 'bottom-full mb-1' : 'top-full mt-1'
                            }`}>
                            <div className="max-h-48 overflow-y-auto">
                                {isLoading && models.length === 0 ? (
                                    <div className="px-4 py-3 text-center text-gray-500 text-sm">
                                        <svg className="w-4 h-4 animate-spin mx-auto mb-1 text-[#F59E0B]" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                        </svg>
                                        Đang tải...
                                    </div>
                                ) : models.length === 0 ? (
                                    <div className="px-4 py-3 text-center text-gray-500 text-sm">
                                        Không có model nào
                                    </div>
                                ) : (
                                    models.map((model) => {
                                        const modelId = getModelId(model);
                                        const isSelected = value === modelId;

                                        return (
                                            <button
                                                key={model.name}
                                                type="button"
                                                onClick={() => selectModel(taskType, modelId, fieldKey)}
                                                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${isSelected ? 'bg-amber-50 text-amber-700' : 'text-gray-700'
                                                    }`}
                                            >
                                                <span className="truncate pr-2">
                                                    {model.displayName || modelId}
                                                </span>
                                                {isSelected && (
                                                    <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                    {error}
                </div>
            )}

            {/* Text Generation Model */}
            {renderModelSelect(
                'text',
                'Text Generation Model',
                data.textModel || '',
                'textModel',
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )}

            {/* Vision Model */}
            {renderModelSelect(
                'vision',
                'Vision Model (Phân tích ảnh)',
                data.visionModel || '',
                'visionModel',
                <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            )}

            {/* Image Generation Model - open upward */}
            {renderModelSelect(
                'imageGen',
                'Image Generation Model',
                data.imageGenModel || '',
                'imageGenModel',
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>,
                true
            )}
        </div>
    );
}
