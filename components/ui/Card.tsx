'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'gradient' | 'outline';
    hover?: boolean;
    glow?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', hover = false, glow = false, children, ...props }, ref) => {
        const baseStyles = `
      relative rounded-2xl overflow-hidden
      transition-all duration-300 ease-out
    `;

        const variants = {
            default: `
        bg-[var(--background-card)]
        border border-[var(--border)]
      `,
            glass: `
        bg-[var(--background-card)]/80
        backdrop-blur-xl
        border border-[var(--border)]
      `,
            gradient: `
        bg-gradient-to-br from-[var(--background-card)] to-[var(--background-secondary)]
        border border-[var(--border)]
      `,
            outline: `
        bg-transparent
        border border-[var(--border)]
      `,
        };

        const hoverStyles = hover
            ? `
        cursor-pointer
        hover:border-[var(--color-primary-500)]/50
        hover:shadow-lg
        hover:-translate-y-1
      `
            : '';

        const glowStyles = glow
            ? 'shadow-[0_0_30px_rgba(245,158,11,0.15)]'
            : '';

        return (
            <div
                ref={ref}
                className={cn(baseStyles, variants[variant], hoverStyles, glowStyles, className)}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

// Card Header
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> { }

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('p-6 pb-4', className)}
            {...props}
        />
    )
);

CardHeader.displayName = 'CardHeader';

// Card Title
export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> { }

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ className, ...props }, ref) => (
        <h3
            ref={ref}
            className={cn('text-xl font-semibold text-[var(--foreground)]', className)}
            {...props}
        />
    )
);

CardTitle.displayName = 'CardTitle';

// Card Description
export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> { }

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn('text-[var(--foreground-muted)] mt-1', className)}
            {...props}
        />
    )
);

CardDescription.displayName = 'CardDescription';

// Card Content
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> { }

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('p-6 pt-0', className)}
            {...props}
        />
    )
);

CardContent.displayName = 'CardContent';

// Card Footer
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> { }

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('p-6 pt-0 flex items-center gap-4', className)}
            {...props}
        />
    )
);

CardFooter.displayName = 'CardFooter';

export default Card;
