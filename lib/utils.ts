import { type ClassValue, clsx } from 'clsx';

/**
 * Utility function to merge class names
 * Simple implementation without tailwind-merge for now
 */
export function cn(...inputs: ClassValue[]): string {
    return clsx(inputs);
}

/**
 * Format date to Vietnamese locale
 */
export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
}

/**
 * Format time to Vietnamese locale
 */
export function formatTime(date: Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

/**
 * Delay utility for animations
 */
export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate random ID
 */
export function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}
