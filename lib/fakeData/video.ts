// Fake data for Video Script AI generation

export const durationOptions = [
    { value: '30 giây', label: '30 giây' },
    { value: '1 phút', label: '1 phút' },
    { value: '2 phút', label: '2 phút' },
    { value: '3 phút', label: '3 phút' },
    { value: '5 phút', label: '5 phút' },
];

export const sizeOptions = [
    { value: 'vertical', label: 'Dọc (Reels/TikTok)' },
    { value: 'horizontal', label: 'Ngang (YouTube)' },
    { value: 'square', label: 'Vuông (Facebook/Instagram)' },
];

export const shotTypes = [
    { value: 'goc_trung', label: 'Góc trung', color: 'green' },
    { value: 'can_canh', label: 'Cận cảnh', color: 'yellow' },
    { value: 'goc_rong', label: 'Góc rộng', color: 'red' },
    { value: 'overlay', label: 'Overlay', color: 'gray' },
];

export const fakeIdeaSummaries = [
    'Host đang ngồi tại bàn thì bất ngờ bị thùng carton rơi trúng đầu → tạo tình huống hài hước. Host trực tiếp nói với camera, giới thiệu video review món ăn.',
    'Video mở đầu với cảnh toàn cảnh cửa hàng lung linh ban đêm → thu hút sự chú ý. Các cảnh tiếp theo tập trung vào món ăn và phản hồi khách hàng.',
    'Bắt đầu bằng câu hỏi gây tò mò: "Bạn có biết món này đang viral trên TikTok?" → dẫn dắt người xem qua từng phân cảnh giới thiệu.',
];

export interface VideoScriptInput {
    duration: string;
    size: string;
    title: string;
    hasVoiceOver: boolean;
    otherRequirements: string;
    ideaMode: 'manual' | 'ai';
    customIdea: string;
}

export interface SceneItem {
    id: number;
    location: string;
    shotType: string;
    description: string;
    voiceOver: string;
    source: string;
    note: string;
}

export interface GeneratedScript {
    summary: string;
    scenes: SceneItem[];
}

// Fake script responses
const fakeScripts: GeneratedScript[] = [
    {
        summary: 'Host đang ngồi tại bàn thì bất ngờ bị thùng carton rơi trúng đầu → tạo tình huống hài hước, gây tò mò và dẫn dắt người xem ở lại. Host trực tiếp nói với camera, giới thiệu video chấm điểm các món mì Ý bán chạy nhất tại M-Steakhouse.',
        scenes: [
            {
                id: 1,
                location: 'Bàn ăn M-Steak',
                shotType: 'goc_trung',
                description: 'Host đang ngồi tại bàn. Một bạn nhân viên từ ngoài khung hình ném thùng carton trúng đầu host.',
                voiceOver: 'Không thoại (sound effect "bốp")',
                source: 'Quay mới',
                note: 'HOOK - tạo loop với cảnh cuối',
            },
            {
                id: 2,
                location: 'Bàn ăn',
                shotType: 'can_canh',
                description: 'Host nhìn thẳng camera, biểu cảm bất ngờ.',
                voiceOver: 'Host: "Bạn đang đợi cái hộp rơi vào đầu mình à?"',
                source: 'Quay mới',
                note: 'Giữ nhịp nhanh',
            },
            {
                id: 3,
                location: 'Bàn ăn',
                shotType: 'goc_trung',
                description: 'Trên bàn bày sẵn 4 đĩa pasta.',
                voiceOver: 'Host: "Còn mình thì đang chờ để chấm điểm các loại mì Ý được gọi nhiều nhất tại M-Steakhouse."',
                source: 'Quay mới',
                note: 'Chạy text: Chấm điểm Pasta',
            },
            {
                id: 4,
                location: 'Bàn ăn',
                shotType: 'can_canh',
                description: 'Host cầm điện thoại lướt feedback, giơ tay like.',
                voiceOver: 'Voice: "Từ khi menu mì Ý của M-Steakhouse được nâng cấp cả chất lượng lẫn trình bày, tụi mình nhận được rất nhiều phản hồi tích cực."',
                source: 'Quay + thu âm',
                note: '',
            },
            {
                id: 5,
                location: 'Overlay',
                shotType: 'overlay',
                description: 'Pop-up feedback lần lượt xuất hiện.',
                voiceOver: '"Giá mềm" - "Món chất lượng" - "Bài trí đẹp" - "Phục vụ nhanh"',
                source: 'Dựng',
                note: 'Pop-up động',
            },
            {
                id: 6,
                location: 'Bàn ăn',
                shotType: 'goc_trung',
                description: 'Host đang tay giới thiệu 4 món trên bàn.',
                voiceOver: 'Host: "Và đây chính là 4 loại mì Ý mà M-Steakhouse tự tin giới thiệu đến bạn."',
                source: 'Quay mới',
                note: '',
            },
        ],
    },
    {
        summary: 'Video giới thiệu sản phẩm mới với phong cách năng động, nhịp nhanh. Sử dụng nhiều góc quay đa dạng kết hợp với voice over chuyên nghiệp.',
        scenes: [
            {
                id: 1,
                location: 'Không gian cửa hàng',
                shotType: 'goc_rong',
                description: 'Cảnh toàn cảnh cửa hàng từ ngoài nhìn vào, đèn sáng ấm áp.',
                voiceOver: 'Voice: "Chào mừng bạn đến với không gian ẩm thực sang trọng..."',
                source: 'Quay mới',
                note: 'Mở màn ấn tượng',
            },
            {
                id: 2,
                location: 'Quầy bar',
                shotType: 'can_canh',
                description: 'Bartender pha chế đồ uống, động tác điêu luyện.',
                voiceOver: 'Voice: "Nơi mỗi món ăn là một tác phẩm nghệ thuật..."',
                source: 'Quay mới',
                note: 'Slow motion',
            },
            {
                id: 3,
                location: 'Bếp mở',
                shotType: 'goc_trung',
                description: 'Đầu bếp đang hoàn thiện món ăn, khói bay nhẹ.',
                voiceOver: '',
                source: 'Quay mới',
                note: 'Focus vào món ăn',
            },
            {
                id: 4,
                location: 'Bàn khách',
                shotType: 'can_canh',
                description: 'Khách thưởng thức món ăn với biểu cảm hài lòng.',
                voiceOver: 'Voice: "Đến và trải nghiệm ngay hôm nay!"',
                source: 'Quay mới',
                note: 'CTA cuối video',
            },
        ],
    },
];

export function generateFakeScript(): GeneratedScript {
    const randomIndex = Math.floor(Math.random() * fakeScripts.length);
    return fakeScripts[randomIndex];
}

// Script List Item for list page
export interface ScriptListItem {
    id: string;
    customerName: string;
    title: string;
    duration: string;
    size: string;
    sceneCount: number;
    summary?: string;
    status?: 'processing' | 'failed' | 'draft' | 'completed';
    createdAt: Date | string;
}

// Generate fake script list
const customerNames = ['M-Steakhouse', 'Cafe Milano', 'Sushi House', 'Pizza Express', 'BBQ Garden', 'Tea House', 'Burger King', 'Pho 24'];
const titles = [
    'Chấm điểm các loại pasta được yêu thích nhất',
    'Review món mới ra mắt mùa hè',
    'Trải nghiệm không gian sang trọng',
    'Top 5 món best seller',
    'Behind the scenes - Bếp trưởng làm món signature',
    'Khách hàng nói gì về chúng tôi?',
    'Combo tiết kiệm cuối tuần',
    'Grand opening chi nhánh mới',
];

export const fakeScriptList: ScriptListItem[] = Array.from({ length: 35 }, (_, i) => {
    const durations = ['15s', '30s', '1p', '2p'];
    const sizes = ['vertical', 'horizontal', 'square'];

    return {
        id: `script-${i + 1}`,
        customerName: customerNames[i % customerNames.length],
        title: titles[i % titles.length],
        duration: durations[i % durations.length],
        size: sizes[i % sizes.length],
        sceneCount: Math.floor(Math.random() * 6) + 4,
        summary: fakeIdeaSummaries[i % fakeIdeaSummaries.length],
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
    };
});

