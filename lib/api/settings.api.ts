import api, { ApiResponse } from './api';

// AI Settings types matching backend schema
export interface ResourceLink {
    label: string;
    url: string;
}

export interface ContextDescription {
    context: string;
    description: string;
}

export interface LogoSettings {
    brandName: string;
    logoUrl: string;
    brandIdentity: string;
    resourceLinks: ResourceLink[];
}

export interface ColorSettings {
    primaryColor: string;
    backgroundColor: string;
    accentColor: string;
}

export interface LanguageSettings {
    keywords: string[];
    customerTerm: string;
}

export interface ToneSettings {
    overallTone: string[];
    contextDescriptions: ContextDescription[];
}

export interface ProductSettings {
    productGroups: string[];
    strengths: string;
    suitableFor: string[];
}

export interface FacebookSettings {
    facebookToken: string;
}

export interface AIModelsSettings {
    textModel: string;
    visionModel: string;
    imageGenModel: string;
}

export interface AISettings {
    _id?: string;
    userId?: string;
    logo: LogoSettings;
    colors: ColorSettings;
    language: LanguageSettings;
    tone: ToneSettings;
    product: ProductSettings;
    facebook: FacebookSettings;
    aiModels?: AIModelsSettings;
    createdAt?: string;
    updatedAt?: string;
}

export type SettingsSection = 'logo' | 'colors' | 'language' | 'tone' | 'product' | 'facebook' | 'aiModels';

// Settings API service
export const settingsApi = {
    /**
     * Get AI settings for current user
     */
    async get(): Promise<ApiResponse<AISettings>> {
        const response = await api.get<ApiResponse<AISettings>>('/ai-settings');
        return response.data;
    },

    /**
     * Update all AI settings
     */
    async update(data: Partial<AISettings>): Promise<ApiResponse<AISettings>> {
        const response = await api.put<ApiResponse<AISettings>>('/ai-settings', data);
        return response.data;
    },

    /**
     * Update specific section of AI settings
     */
    async updateSection<T>(
        section: SettingsSection,
        data: T
    ): Promise<ApiResponse<AISettings>> {
        const response = await api.patch<ApiResponse<AISettings>>(`/ai-settings/${section}`, data);
        return response.data;
    },

    /**
     * Check if user has meaningful brand settings configured
     */
    async checkHasBrandSettings(): Promise<boolean> {
        try {
            const response = await this.get();
            const settings = response.data;
            if (!settings) return false;

            // Check if any meaningful brand data exists
            return !!(
                settings.logo?.brandName ||
                settings.logo?.brandIdentity ||
                (settings.language?.keywords && settings.language.keywords.length > 0) ||
                (settings.tone?.overallTone && settings.tone.overallTone.length > 0) ||
                (settings.product?.productGroups && settings.product.productGroups.length > 0) ||
                settings.product?.strengths
            );
        } catch {
            return false;
        }
    },
};

export default settingsApi;
