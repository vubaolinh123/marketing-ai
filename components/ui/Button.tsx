'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles = `
      relative inline-flex items-center justify-center gap-2
      font-medium rounded-full
      transition-all duration-200 ease-out
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      focus-visible:ring-offset-[var(--background)]
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-[0.98]
    `;

        const variants = {
            primary: `
        bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-600)]
        text-white
        hover:from-[var(--color-primary-400)] hover:to-[var(--color-secondary-500)]
        hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]
        focus-visible:ring-[var(--color-primary-500)]
      `,
            secondary: `
        bg-[var(--background-card)]
        text-[var(--foreground)]
        border border-[var(--border)]
        hover:bg-[var(--background-secondary)]
        hover:border-[var(--border-hover)]
        focus-visible:ring-[var(--color-gray-500)]
      `,
            outline: `
        bg-transparent
        text-[var(--color-primary-500)]
        border border-[var(--color-primary-500)]
        hover:bg-[var(--color-primary-500)]/10
        focus-visible:ring-[var(--color-primary-500)]
      `,
            ghost: `
        bg-transparent
        text-[var(--foreground-muted)]
        hover:text-[var(--foreground)]
        hover:bg-[var(--foreground)]/5
        focus-visible:ring-[var(--color-gray-500)]
      `,
        };

        const sizes = {
            sm: 'h-9 px-4 text-sm',
            md: 'h-11 px-6 text-base',
            lg: 'h-14 px-8 text-lg',
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <span className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                    <>
                        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                        {children}
                        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
