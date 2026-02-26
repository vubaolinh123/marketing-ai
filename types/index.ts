// User type matching backend
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'user' | 'admin';
    isActive?: boolean;
    createdAt?: Date;
}

export interface AuthState {
    user: User | null;
    effectiveUser: User | null;
    isImpersonating: boolean;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
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
    purpose: string;
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
