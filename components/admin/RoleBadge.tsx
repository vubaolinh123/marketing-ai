'use client';

import { cn } from '@/lib/utils';

type Role = 'admin' | 'staff' | 'user';

interface RoleBadgeProps {
    role: Role;
    size?: 'sm' | 'md';
    className?: string;
}

const ROLE_LABELS: Record<Role, string> = {
    admin: 'Admin',
    staff: 'Staff',
    user: 'User'
};

const ROLE_COLORS: Record<Role, string> = {
    admin: 'bg-violet-100 text-violet-700 border-violet-200',
    staff: 'bg-amber-100 text-amber-700 border-amber-200',
    user: 'bg-blue-100 text-blue-700 border-blue-200'
};

const ROLE_SIZES: Record<NonNullable<RoleBadgeProps['size']>, string> = {
    sm: 'text-[10px] px-2 py-1',
    md: 'text-xs px-2.5 py-1'
};

export default function RoleBadge({ role, size = 'md', className }: RoleBadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center justify-center rounded-full border font-semibold leading-none whitespace-nowrap',
                ROLE_COLORS[role],
                ROLE_SIZES[size],
                className
            )}
        >
            {ROLE_LABELS[role]}
        </span>
    );
}
