// Main API instance
export {
    default as api,
    getToken,
    setToken,
    removeToken,
    getActAsUserId,
    setActAsUserId,
    clearActAsUserId
} from './api';
export type { ApiResponse, ApiError } from './api';

// Auth API
export { authApi } from './auth.api';
export type { AuthUser, AuthMeResponse, LoginResponse, RegisterData, LoginData } from './auth.api';

// User API
export { userApi } from './user.api';
export type { UpdateProfileData, ChangePasswordData } from './user.api';

// Admin User API
export { adminUserApi } from './adminUser.api';
export type {
    AdminUser,
    AdminUsersQuery,
    AdminUsersListData,
    CreateAdminUserPayload,
    UpdateAdminUserPayload
} from './adminUser.api';

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
    GenerateIdeaInput,
    VideoConceptItem,
    VideoConceptSuggestionResponse,
    SuggestConceptsInput
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

// Marketing Plan API
export * from './marketingPlan.api';

// Token Usage API
export { tokenUsageApi } from './tokenUsage.api';
export type {
    TokenUsageGroupBy,
    TokenUsageQueryParams,
    TokenUsageTotals,
    TokenUsageTimelineItem,
    TokenUsageTopTool,
    TokenUsageTopUser,
    TokenUsagePagination,
    TokenUsageSummaryData,
    TokenUsageUsersParams,
    TokenUsageUserRow,
    TokenUsageUsersData
} from './tokenUsage.api';
