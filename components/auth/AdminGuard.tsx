'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

interface AdminGuardProps {
    children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.replace('/login');
            }
        }
    }, [isLoading, isAuthenticated, router]);

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm">Đang kiểm tra quyền truy cập...</p>
                </div>
            </div>
        );
    }

    // Not authenticated, show nothing (redirect will happen)
    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
