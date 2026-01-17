'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ColorPickerInputProps {
    label: string;
    value: string;
    onChange: (color: string) => void;
    description?: string;
    disabled?: boolean;
}

export default function ColorPickerInput({ label, value, onChange, description, disabled }: ColorPickerInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={disabled}
                    className={cn(
                        'w-12 h-12 rounded-xl border-2 border-gray-200 shadow-sm transition-all hover:scale-105',
                        disabled && 'opacity-50 cursor-not-allowed'
                    )}
                    style={{ backgroundColor: value || '#ffffff' }}
                />
                <input
                    ref={inputRef}
                    type="color"
                    value={value || '#ffffff'}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className="sr-only"
                />
                <div className="flex-1">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
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
