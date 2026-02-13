// Marketing Plan Options and Fake Data

export const postFrequencyOptions = [
    { value: '3', label: '3 bài/tuần' },
    { value: '5', label: '5 bài/tuần' },
    { value: '7', label: '7 bài/tuần (mỗi ngày)' },
];

export const postTimeOptions = [
    { value: '08:00', label: '8:00 sáng' },
    { value: '12:00', label: '12:00 trưa' },
    { value: '18:00', label: '18:00 chiều' },
    { value: '21:00', label: '21:00 tối' },
];

export const goalOptions = [
    { value: 'engagement', label: 'Tăng tương tác' },
    { value: 'sales', label: 'Bán hàng' },
    { value: 'awareness', label: 'Nhận diện thương hiệu' },
    { value: 'traffic', label: 'Tăng traffic website' },
    { value: 'leads', label: 'Thu thập leads' },
];

export const channelOptions = [
    { value: 'facebook', label: 'Facebook', icon: '📘' },
    { value: 'instagram', label: 'Instagram', icon: '📷' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'website', label: 'Website/Blog', icon: '🌐' },
    { value: 'zalo', label: 'Zalo', icon: '💬' },
];

export interface MarketingPlanInput {
    campaignName: string;
    startDate: string;
    endDate: string;
    postsPerWeek: string;
    postTimes: string[];
    topics: string[];
    goals: string[];
    channels: string[];
    priorityProductService?: string;
    monthlyFocus?: string;
    promotions?: string;
    customerJourneyStage?: string;
    targetSegment?: string;
    strategySuggestion?: MarketingStrategySuggestion;
    notes: string;
}

export interface StrategyTopicMixItem {
    key: string;
    value: string;
}

export interface StrategyWeeklyFrameworkItem {
    week: string;
    focus: string;
    sampleExecution: string;
}

export interface MarketingStrategySuggestion {
    summary?: string;
    concept?: string;
    campaignConcept?: string;
    contentPillars?: string[];
    topicMix?: StrategyTopicMixItem[];
    recommendedChannels?: string[];
    recommendedGoals?: string[];
    weeklyFramework?: StrategyWeeklyFrameworkItem[];
    rationale?: string;
    topics?: string[];
    goals?: string[];
    channels?: string[];
}

export interface PlanPost {
    id: string;
    date: Date;
    time: string;
    topic: string;
    channel: string;
    status: 'scheduled' | 'draft' | 'published';
    // AI-enhanced fields
    contentIdea?: string;
    purpose?: string;
    postType?: 'image' | 'video' | 'story' | 'blog' | 'reel';
    suggestedHashtags?: string[];
}

export interface MarketingPlanResult {
    id: string;
    campaignName: string;
    startDate: Date;
    endDate: Date;
    posts: PlanPost[];
    totalPosts: number;
    createdAt: Date;
}

export const defaultPlanInput: MarketingPlanInput = {
    campaignName: '',
    startDate: '',
    endDate: '',
    postsPerWeek: '5',
    postTimes: ['18:00'],
    topics: [],
    goals: [],
    channels: ['facebook'],
    priorityProductService: '',
    monthlyFocus: '',
    promotions: '',
    customerJourneyStage: '',
    targetSegment: '',
    strategySuggestion: undefined,
    notes: '',
};

export const campaignThinkingSuggestions = {
    priorityProductService: [
        'Combo mới ra mắt',
        'Dịch vụ flagship',
        'Sản phẩm biên lợi nhuận cao',
        'Sản phẩm mùa vụ',
    ],
    monthlyFocus: [
        'Ra mắt - tạo nhận biết',
        'Đẩy lead và tư vấn',
        'Chốt đơn - chuyển đổi',
        'Giữ chân khách cũ',
    ],
    promotions: [
        'Giảm 20% cuối tuần',
        'Mua 2 tặng 1',
        'Freeship đơn từ 299K',
        'Voucher khách hàng mới',
    ],
    customerJourneyStage: [
        'Awareness',
        'Consideration',
        'Conversion',
        'Retention',
    ],
    targetSegment: [
        'Gen Z thành thị',
        'Nhân viên văn phòng 25-35',
        'Gia đình trẻ',
        'Khách hàng cao cấp',
    ],
};

// Generate fake plan result based on input
export function generateFakePlan(input: MarketingPlanInput): MarketingPlanResult {
    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);
    const postsPerWeek = parseInt(input.postsPerWeek);

    const posts: PlanPost[] = [];
    let currentDate = new Date(startDate);
    let postId = 1;

    while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();

        // Distribute posts across the week
        if (postsPerWeek === 7 ||
            (postsPerWeek === 5 && dayOfWeek >= 1 && dayOfWeek <= 5) ||
            (postsPerWeek === 3 && [1, 3, 5].includes(dayOfWeek))) {

            const randomTopic = input.topics[Math.floor(Math.random() * input.topics.length)] || 'Chủ đề chung';
            const randomChannel = input.channels[Math.floor(Math.random() * input.channels.length)] || 'facebook';
            const randomTime = input.postTimes[Math.floor(Math.random() * input.postTimes.length)] || '18:00';

            posts.push({
                id: `post-${postId++}`,
                date: new Date(currentDate),
                time: randomTime,
                topic: randomTopic,
                channel: randomChannel,
                status: 'scheduled',
            });
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
        id: `plan-${Date.now()}`,
        campaignName: input.campaignName,
        startDate,
        endDate,
        posts,
        totalPosts: posts.length,
        createdAt: new Date(),
    };
}

// Suggested topics
export const suggestedTopics = [
    'Giới thiệu sản phẩm',
    'Khuyến mãi',
    'Tips & Tricks',
    'Behind the scenes',
    'Testimonials',
    'Q&A',
    'Lifestyle',
    'Trending',
];

// Plan List Item for list page
export interface PlanListItem {
    id: string;
    campaignName: string;
    startDate: Date;
    endDate: Date;
    totalPosts: number;
    channels: string[];
    status: 'processing' | 'failed' | 'active' | 'completed' | 'draft';
    createdAt: Date;
}

export const statusOptions = [
    { value: 'processing', label: 'Đang xử lý', color: 'amber' },
    { value: 'failed', label: 'Thất bại', color: 'red' },
    { value: 'active', label: 'Đang chạy', color: 'green' },
    { value: 'completed', label: 'Hoàn thành', color: 'blue' },
    { value: 'draft', label: 'Nháp', color: 'gray' },
];

// Fake plan list (15 items)
const campaignNames = [
    'Chiến dịch Tết 2025',
    'Summer Sale',
    'Black Friday',
    'Khuyến mãi tháng 1',
    'Ra mắt sản phẩm mới',
    'Chiến dịch Brand Awareness',
    'Flash Sale cuối tuần',
    'Tri ân khách hàng',
];

const channelSets = [
    ['facebook', 'instagram'],
    ['facebook', 'tiktok'],
    ['instagram', 'tiktok', 'facebook'],
    ['facebook'],
    ['instagram', 'website'],
];

const statuses: ('processing' | 'failed' | 'active' | 'completed' | 'draft')[] = ['processing', 'failed', 'active', 'completed', 'draft'];

export const fakePlanList: PlanListItem[] = Array.from({ length: 15 }, (_, i) => {
    const startOffset = i * 7;
    const startDate = new Date(Date.now() - startOffset * 24 * 60 * 60 * 1000);
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    return {
        id: `plan-${i + 1}`,
        campaignName: campaignNames[i % campaignNames.length],
        startDate,
        endDate,
        totalPosts: Math.floor(Math.random() * 20) + 10,
        channels: channelSets[i % channelSets.length],
        status: statuses[i % statuses.length],
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
    };
});
