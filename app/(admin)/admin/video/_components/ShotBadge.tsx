'use client';

import { cn } from '@/lib/utils';
import { shotTypes } from '@/lib/fakeData';

interface ShotBadgeProps {
    shotType: string;
}

export default function ShotBadge({ shotType }: ShotBadgeProps) {
    const shot = shotTypes.find(s => s.value === shotType);
    if (!shot) return null;

    const colorClasses = {
        green: 'bg-green-100 text-green-700 border-green-200',
        yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        red: 'bg-red-100 text-red-700 border-red-200',
        gray: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    return (
        <span className={cn(
            'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
            colorClasses[shot.color as keyof typeof colorClasses]
        )}>
            {shot.label}
        </span>
    );
}
