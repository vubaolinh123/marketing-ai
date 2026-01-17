'use client';

import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type = 'text',
            label,
            error,
            hint,
            leftIcon,
            rightIcon,
            disabled,
            ...props
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === 'password';
        const inputType = isPassword && showPassword ? 'text' : type;

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                        {label}
                    </label>
                )}
                <div
                    className={cn(
                        'relative flex items-center',
                        'rounded-xl overflow-hidden',
                        'bg-[var(--background-card)]',
                        'border transition-all duration-200',
                        isFocused
                            ? 'border-[var(--color-primary-500)] shadow-[0_0_0_3px_rgba(245,158,11,0.1)]'
                            : error
                                ? 'border-red-500'
                                : 'border-[var(--border)] hover:border-[var(--border-hover)]',
                        disabled && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    {leftIcon && (
                        <span className="pl-4 text-[var(--foreground-muted)]">
                            {leftIcon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        type={inputType}
                        className={cn(
                            'flex-1 w-full',
                            'px-4 py-3',
                            'bg-transparent',
                            'text-[var(--foreground)]',
                            'placeholder:text-[var(--foreground-muted)]',
                            'outline-none',
                            'disabled:cursor-not-allowed',
                            leftIcon && 'pl-2',
                            (rightIcon || isPassword) && 'pr-2',
                            className
                        )}
                        disabled={disabled}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="px-4 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    )}
                    {rightIcon && !isPassword && (
                        <span className="pr-4 text-[var(--foreground-muted)]">
                            {rightIcon}
                        </span>
                    )}
                </div>
                {error && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p className="mt-2 text-sm text-[var(--foreground-muted)]">{hint}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
