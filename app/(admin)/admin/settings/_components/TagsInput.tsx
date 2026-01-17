'use client';

import { useState, useCallback, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TagsInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    disabled?: boolean;
}

export default function TagsInput({ value, onChange, placeholder = 'Nhập và Enter...', disabled }: TagsInputProps) {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            if (!value.includes(inputValue.trim())) {
                onChange([...value, inputValue.trim()]);
            }
            setInputValue('');
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            onChange(value.slice(0, -1));
        }
    }, [inputValue, value, onChange]);

    const removeTag = useCallback((tagToRemove: string) => {
        onChange(value.filter(tag => tag !== tagToRemove));
    }, [value, onChange]);

    return (
        <div className={cn(
            'min-h-[48px] px-3 py-2 rounded-xl border border-gray-200 bg-white flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-[#F59E0B] focus-within:border-transparent transition-all',
            disabled && 'opacity-50 cursor-not-allowed'
        )}>
            <AnimatePresence>
                {value.map(tag => (
                    <motion.span
                        key={tag}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-sm font-medium"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            disabled={disabled}
                            className="w-4 h-4 rounded-full hover:bg-amber-200 flex items-center justify-center transition-colors"
                        >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </motion.span>
                ))}
            </AnimatePresence>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={value.length === 0 ? placeholder : ''}
                disabled={disabled}
                className="flex-1 min-w-[120px] outline-none text-gray-800 placeholder-gray-400 bg-transparent"
            />
        </div>
    );
}
