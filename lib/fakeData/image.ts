// AI Image Generation Options and Fake Data

export const backgroundOptions = [
    { value: 'studio', label: '📸 Studio', description: 'Nền trắng/xám chuyên nghiệp' },
    { value: 'outdoor', label: '🌳 Outdoor', description: 'Cảnh ngoài trời tự nhiên' },
    { value: 'lifestyle', label: '👤 Lifestyle', description: 'Người đang sử dụng sản phẩm' },
    { value: 'minimal', label: '⬜ Minimal', description: 'Nền đơn sắc, tối giản' },
    { value: 'luxury', label: '✨ Luxury', description: 'Bối cảnh sang trọng, cao cấp' },
    { value: 'kitchen', label: '🍳 Kitchen', description: 'Bếp chuyên nghiệp, đồ nấu' },
    { value: 'restaurant', label: '🍽️ Restaurant', description: 'Nhà hàng, bàn tiệc' },
    { value: 'action', label: '⚡ Action', description: 'Sản phẩm đang được sử dụng' },
    { value: 'custom', label: '🎨 Tùy chỉnh', description: 'Mô tả bối cảnh sáng tạo' },
];

export const cameraAngleOptions = [
    { value: 'wide', label: '🖼️ Toàn cảnh', description: 'Lấy trọn bố cục, sản phẩm nổi bật trong không gian' },
    { value: 'medium', label: '📷 Trung cảnh', description: 'Cân bằng sản phẩm và bối cảnh xung quanh' },
    { value: 'closeup', label: '🔍 Cận cảnh', description: 'Nhấn mạnh chi tiết, chất liệu, bề mặt sản phẩm' },
    { value: 'topdown', label: '⬇️ Từ trên xuống', description: 'Góc nhìn flat-lay, phù hợp setup bàn/chụp món ăn' },
    { value: 'detail', label: '✨ Cận chi tiết', description: 'Zoom vào điểm nhấn quan trọng của sản phẩm' },
];

export const defaultCameraAngles = ['wide'];

export function getCameraAngleLabel(angle: string): string {
    return cameraAngleOptions.find(option => option.value === angle)?.label || angle;
}

export const logoPositionOptions = [
    { value: 'top-left', label: 'Góc trên trái' },
    { value: 'top-right', label: 'Góc trên phải' },
    { value: 'bottom-left', label: 'Góc dưới trái' },
    { value: 'bottom-right', label: 'Góc dưới phải' },
    { value: 'center', label: 'Chính giữa' },
    { value: 'none', label: 'Không ghép logo' },
];

export const outputSizeOptions = [
    { value: '1:1', label: '1:1', description: 'Vuông (Instagram, Facebook)' },
    { value: '4:5', label: '4:5', description: 'Dọc (Instagram Post)' },
    { value: '9:16', label: '9:16', description: 'Dọc (Story, Reels, TikTok)' },
    { value: '16:9', label: '16:9', description: 'Ngang (YouTube, Banner)' },
    { value: '3:4', label: '3:4', description: 'Dọc (Pinterest)' },
];

export interface ImageGenerationInput {
    images: File[];
    cameraAngles: string[];
    backgroundType: string;
    customBackground: string;
    useLogo: boolean;
    logoPosition: string;
    outputSize: string;
    additionalNotes: string;
    useBrandSettings: boolean;
}

export interface GeneratedImage {
    id: string;
    originalUrl: string;
    generatedUrl: string;
    cameraAngle?: string;
    backgroundType: string;
    outputSize: string;
    createdAt: Date;
}

// Fake generated images for demo
export const fakeGeneratedImages: GeneratedImage[] = [
    {
        id: '1',
        originalUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        generatedUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        backgroundType: 'minimal',
        outputSize: '1:1',
        createdAt: new Date(),
    },
    {
        id: '2',
        originalUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        generatedUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        backgroundType: 'studio',
        outputSize: '4:5',
        createdAt: new Date(),
    },
];

export const defaultImageInput: ImageGenerationInput = {
    images: [],
    cameraAngles: defaultCameraAngles,
    backgroundType: 'studio',
    customBackground: '',
    useLogo: true,
    logoPosition: 'bottom-right',
    outputSize: '1:1',
    additionalNotes: '',
    useBrandSettings: true,
};

// Image List Item for list page
export interface ImageListItem {
    id: string;
    name: string;
    originalUrl: string;
    generatedUrl: string;
    backgroundType: string;
    outputSize: string;
    hasLogo: boolean;
    createdAt: Date;
}

// Fake image list for demo (30 items)
const unsplashImages = [
    'photo-1523275335684-37898b6baf30',
    'photo-1505740420928-5e560c06d30e',
    'photo-1526170375885-4d8ecf77b99f',
    'photo-1572635196237-14b3f281503f',
    'photo-1560343090-f0409e92791a',
    'photo-1585386959984-a4155224a1ad',
    'photo-1581235720704-06d3acfcb36f',
    'photo-1542291026-7eec264c27ff',
    'photo-1553062407-98eeb64c6a62',
    'photo-1491553895911-0055uj',
];

const backgroundTypes = ['studio', 'outdoor', 'lifestyle', 'minimal', 'luxury', 'kitchen', 'restaurant', 'action'];
const outputSizes = ['1:1', '4:5', '9:16', '16:9', '3:4'];

export const fakeImageList: ImageListItem[] = Array.from({ length: 30 }, (_, i) => {
    const imageIndex = i % unsplashImages.length;
    const bgIndex = i % backgroundTypes.length;
    const sizeIndex = i % outputSizes.length;

    return {
        id: `img-${i + 1}`,
        name: `Ảnh sản phẩm ${i + 1}`,
        originalUrl: `https://images.unsplash.com/${unsplashImages[imageIndex]}?w=400`,
        generatedUrl: `https://images.unsplash.com/${unsplashImages[imageIndex]}?w=800&q=80`,
        backgroundType: backgroundTypes[bgIndex],
        outputSize: outputSizes[sizeIndex],
        hasLogo: i % 3 !== 0,
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
    };
});
