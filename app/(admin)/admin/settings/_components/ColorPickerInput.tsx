'use client';

import { cn } from '@/lib/utils';

interface ColorPickerInputProps {
    label: string;
    value: string;
    onChange: (color: string) => void;
    description?: string;
    disabled?: boolean;
}

const HEX_6_REGEX = /^#([0-9a-fA-F]{6})$/;
const HEX_3_REGEX = /^#([0-9a-fA-F]{3})$/;

function normalizeHexForColorInput(raw: string, fallback = '#ffffff') {
    const value = String(raw || '').trim();

    if (HEX_6_REGEX.test(value)) {
        return value;
    }

    const shortMatch = value.match(HEX_3_REGEX);
    if (shortMatch) {
        const [, shortHex] = shortMatch;
        return `#${shortHex
            .split('')
            .map((char) => `${char}${char}`)
            .join('')}`;
    }

    return fallback;
}

export default function ColorPickerInput({ label, value, onChange, description, disabled }: ColorPickerInputProps) {
    const pickerColor = normalizeHexForColorInput(value, '#ffffff');

    const handleHexBlur = () => {
        const normalized = normalizeHexForColorInput(value, pickerColor);
        if (normalized !== value) {
            onChange(normalized);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="flex items-center gap-3">
                <div
                    className={cn(
                        'relative w-12 h-12 rounded-xl border-2 border-gray-200 shadow-sm transition-all hover:scale-105 overflow-hidden',
                        disabled && 'opacity-50 cursor-not-allowed'
                    )}
                    style={{ backgroundColor: pickerColor }}
                >
                    <input
                        type="color"
                        value={pickerColor}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        aria-label={`${label} picker`}
                    />
                </div>

                <div className="flex-1">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={handleHexBlur}
                        placeholder="#000000"
                        disabled={disabled}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all font-mono text-sm"
                    />
                    {description && (
                        <p className="text-xs text-gray-500 mt-1">{description}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
