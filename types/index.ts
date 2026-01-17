export interface User {
    id: string;
    username: string;
    email: string;
    companyName?: string;
    customPrompt?: string;
    isAdmin: boolean;
    createdAt: Date;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface Feature {
    id: string;
    title: string;
    description: string;
    icon: string;
    href: string;
    color: 'amber' | 'orange' | 'yellow';
}

export interface NavItem {
    label: string;
    href: string;
    children?: NavItem[];
}

export interface ArticleInput {
    topic: string;
    purpose: 'introduce' | 'sell' | 'share_knowledge';
    description: string;
    generateWithAI: boolean;
}

export interface ImageInput {
    description: string;
    productImage?: File;
    includeLogo: boolean;
}

export interface MarketingPlan {
    id: string;
    topic: string;
    scheduledDate: Date;
    scheduledTime: string;
    status: 'draft' | 'scheduled' | 'published';
}

export interface VideoScriptInput {
    topic: string;
    purpose: string;
    tone: 'professional' | 'casual' | 'friendly' | 'energetic';
    duration: string;
    style: string;
    hasHuman: boolean;
}

export interface VideoScript {
    id: string;
    title: string;
    scenes: VideoScene[];
    createdAt: Date;
}

export interface VideoScene {
    sceneNumber: number;
    setting: string;
    characters: string;
    action: string;
    dialogue: string;
}
