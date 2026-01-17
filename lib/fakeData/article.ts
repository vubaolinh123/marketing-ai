// Fake data for Article AI generation

export const fakeTopics = [
    { value: 'marketing', label: 'Marketing Digital' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'ecommerce', label: 'Thương mại điện tử' },
    { value: 'branding', label: 'Xây dựng thương hiệu' },
    { value: 'content', label: 'Content Marketing' },
    { value: 'seo', label: 'SEO & SEM' },
    { value: 'product', label: 'Giới thiệu sản phẩm' },
    { value: 'event', label: 'Sự kiện & Khuyến mãi' },
];

export const purposeOptions = [
    { value: 'introduce', label: 'Giới thiệu', icon: '📢' },
    { value: 'sell', label: 'Bán hàng', icon: '🛒' },
    { value: 'share_knowledge', label: 'Chia sẻ kiến thức', icon: '📚' },
];

export interface GeneratedArticle {
    title: string;
    content: string;
    hashtags: string[];
    imageUrl?: string;
}

const fakeArticlesByPurpose: Record<string, GeneratedArticle[]> = {
    introduce: [
        {
            title: '🚀 Giới thiệu dịch vụ Marketing chuyên nghiệp',
            content: `Bạn đang tìm kiếm giải pháp Marketing hiệu quả cho doanh nghiệp?

Easy Marketing tự hào mang đến những dịch vụ Marketing Digital toàn diện, giúp thương hiệu của bạn tỏa sáng trên mọi nền tảng.

✅ Chiến lược Marketing bài bản
✅ Nội dung sáng tạo, thu hút
✅ Quảng cáo tối ưu chi phí
✅ Báo cáo minh bạch, chi tiết

Hãy để chúng tôi đồng hành cùng bạn trên con đường phát triển thương hiệu! 💪`,
            hashtags: ['#EasyMarketing', '#MarketingDigital', '#ThuongHieu', '#DoanhNghiep'],
        },
        {
            title: '✨ Khám phá dịch vụ mới từ Easy Marketing',
            content: `Chào mừng bạn đến với Easy Marketing - nơi biến ý tưởng thành hiện thực!

Chúng tôi cung cấp:
🎯 Tư vấn chiến lược Marketing
🎨 Thiết kế nội dung sáng tạo  
📊 Phân tích dữ liệu chuyên sâu
📱 Quản lý Social Media chuyên nghiệp

Liên hệ ngay để được tư vấn miễn phí!`,
            hashtags: ['#Marketing', '#DichVu', '#TuVan', '#SocialMedia'],
        },
    ],
    sell: [
        {
            title: '🔥 SALE KHỦNG - Giảm đến 50%!',
            content: `⚡ FLASH SALE CUỐI TUẦN ⚡

Chỉ trong 48 giờ, nhận ngay ưu đãi KHỦNG:

🎁 Giảm 50% gói Marketing cơ bản
🎁 Giảm 40% gói Social Media Pro
🎁 FREE tư vấn chiến lược (trị giá 5 triệu)

⏰ Thời gian có hạn - Số lượng có hạn!

👉 Inbox ngay hoặc gọi Hotline: 1900.xxxx

#FlashSale #KhuyenMai #GiamGia #Marketing`,
            hashtags: ['#FlashSale', '#KhuyenMai', '#GiamGia', '#HotDeal'],
        },
        {
            title: '🛒 Combo tiết kiệm - Mua 1 được 3!',
            content: `🌟 ƯU ĐÃI ĐẶC BIỆT 🌟

Khi đăng ký gói Marketing Pro, bạn sẽ nhận MIỄN PHÍ:

✅ Thiết kế 10 banner quảng cáo
✅ 1 tháng quản lý Fanpage
✅ Báo cáo phân tích chi tiết

💰 Tiết kiệm đến 3 TRIỆU ĐỒNG!

📞 Liên hệ ngay để nhận ưu đãi!`,
            hashtags: ['#Combo', '#UuDai', '#TietKiem', '#Marketing'],
        },
    ],
    share_knowledge: [
        {
            title: '📚 5 Bí quyết Marketing hiệu quả năm 2024',
            content: `Bạn muốn nâng cao hiệu quả Marketing? Đây là 5 tips quan trọng:

1️⃣ TẬP TRUNG VÀO GIÁ TRỊ
Hãy tạo nội dung mang lại giá trị thực sự cho khách hàng.

2️⃣ VIDEO LÀ VUA
Video ngắn đang thống trị mọi nền tảng social media.

3️⃣ CÁ NHÂN HÓA
Khách hàng muốn được đối xử như cá nhân, không phải con số.

4️⃣ ĐO LƯỜNG THƯỜNG XUYÊN
Không có dữ liệu = không có cải thiện.

5️⃣ KIÊN TRÌ
Marketing là marathon, không phải sprint.

💬 Bạn đang áp dụng bí quyết nào? Comment chia sẻ nhé!`,
            hashtags: ['#MarketingTips', '#KienThuc', '#ChiaSe', '#Marketing2024'],
        },
        {
            title: '🎓 Hướng dẫn tạo Content viral',
            content: `Làm thế nào để content của bạn viral?

📌 CÔNG THỨC VIRAL:

🔹 Emotion (Cảm xúc): Nội dung phải chạm đến cảm xúc
🔹 Timing (Thời điểm): Đăng bài đúng giờ vàng
🔹 Visual (Hình ảnh): Ấn tượng từ cái nhìn đầu tiên
🔹 CTA (Kêu gọi): Khuyến khích tương tác

Lưu lại và áp dụng ngay nhé! 🚀`,
            hashtags: ['#ContentViral', '#HuongDan', '#Tips', '#SocialMedia'],
        },
    ],
};

export const fakeImageUrls = [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
    'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800',
];

export function generateFakeArticle(purpose: string): GeneratedArticle {
    const articles = fakeArticlesByPurpose[purpose] || fakeArticlesByPurpose['introduce'];
    const randomIndex = Math.floor(Math.random() * articles.length);
    const article = { ...articles[randomIndex] };

    // Add random image for AI mode
    const imageIndex = Math.floor(Math.random() * fakeImageUrls.length);
    article.imageUrl = fakeImageUrls[imageIndex];

    return article;
}

// Article List Item for list page
export interface ArticleListItem {
    id: string;
    title: string;
    content: string;
    topic: string;
    purpose: string;
    imageUrl: string;
    hashtags: string[];
    createdAt: Date;
}

// Generate fake article list with 50 items
export const fakeArticleList: ArticleListItem[] = Array.from({ length: 50 }, (_, i) => {
    const purposes = ['introduce', 'sell', 'share_knowledge'];
    const topics = fakeTopics.map(t => t.value);
    const purpose = purposes[i % purposes.length];
    const topic = topics[i % topics.length];
    const article = fakeArticlesByPurpose[purpose][i % 2];

    return {
        id: `article-${i + 1}`,
        title: article.title,
        content: article.content,
        topic,
        purpose,
        imageUrl: fakeImageUrls[i % fakeImageUrls.length],
        hashtags: article.hashtags,
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // Days ago
    };
});

