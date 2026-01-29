// Main API instance
export { default as api, getToken, setToken, removeToken } from './api';
export type { ApiResponse, ApiError } from './api';

// Auth API
export { authApi } from './auth.api';
export type { AuthUser, LoginResponse, RegisterData, LoginData } from './auth.api';

// User API
export { userApi } from './user.api';
export type { UpdateProfileData, ChangePasswordData } from './user.api';

// Settings API
export { settingsApi } from './settings.api';
export type {
    AISettings,
    LogoSettings,
    ColorSettings,
    LanguageSettings,
    ToneSettings,
    ProductSettings,
    FacebookSettings,
    ResourceLink,
    ContextDescription,
    SettingsSection
} from './settings.api';

// Article API
export * from './article.api';

// Upload API
export * from './upload.api';

// Video Script API
export { videoScriptApi } from './videoScript.api';
export type {
    VideoScriptInput,
    VideoScript,
    SceneItem,
    VideoScriptListItem,
    GeneratedIdea,
    GenerateIdeaInput
} from './videoScript.api';

// Product Image API
export { productImageApi } from './productImage.api';
export type {
    ProductImageInput,
    ProductImage,
    ProductImageListResponse,
    ProductImageResponse,
    ProductImageListParams
} from './productImage.api';
