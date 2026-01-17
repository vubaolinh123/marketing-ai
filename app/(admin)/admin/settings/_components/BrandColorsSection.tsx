'use client';

import ColorPickerInput from './ColorPickerInput';

interface BrandColorsSectionProps {
    data: {
        primaryColor: string;
        backgroundColor: string;
        accentColor: string;
    };
    onChange: (data: BrandColorsSectionProps['data']) => void;
}

export default function BrandColorsSection({ data, onChange }: BrandColorsSectionProps) {
    return (
        <div className="space-y-5">
            <ColorPickerInput
                label="Màu chủ đạo (Logo)"
                value={data.primaryColor}
                onChange={(color) => onChange({ ...data, primaryColor: color })}
                description="VD: Vàng đậm / vàng bò"
            />

            <ColorPickerInput
                label="Màu nền"
                value={data.backgroundColor}
                onChange={(color) => onChange({ ...data, backgroundColor: color })}
                description="VD: Đen / nâu đậm - tạo chiều sâu"
            />

            <ColorPickerInput
                label="Màu điểm nhấn"
                value={data.accentColor}
                onChange={(color) => onChange({ ...data, accentColor: color })}
                description="VD: Xanh đậm (xanh cổ vịt)"
            />

            {/* Preview */}
            <div className="mt-6 p-4 rounded-xl border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-3">Xem trước</p>
                <div className="flex gap-3">
                    <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xs font-medium shadow-lg"
                        style={{ backgroundColor: data.primaryColor || '#F59E0B' }}
                    >
                        Chủ đạo
                    </div>
                    <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xs font-medium shadow-lg"
                        style={{ backgroundColor: data.backgroundColor || '#1a1a1a' }}
                    >
                        Nền
                    </div>
                    <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xs font-medium shadow-lg"
                        style={{ backgroundColor: data.accentColor || '#0891b2' }}
                    >
                        Điểm nhấn
                    </div>
                </div>
            </div>
        </div>
    );
}
