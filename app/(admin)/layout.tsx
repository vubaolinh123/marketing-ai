'use client';

import { useState } from 'react';
import { AdminGuard } from '@/components/auth';
import { AdminHeader, AdminSidebar } from '@/components/admin';
import MobileBottomNav from '@/components/admin/MobileBottomNav';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <AdminGuard>
            <div className="relative h-screen overflow-hidden flex flex-col bg-[radial-gradient(140%_120%_at_50%_-10%,#7FB0FF_0%,#4E86FF_35%,#1E5AEE_68%,#1039B7_100%)]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.24),transparent_34%),radial-gradient(circle_at_82%_2%,rgba(255,255,255,0.16),transparent_30%)]" />

                {/* Header - fixed at top */}
                <AdminHeader
                    onMenuClick={() => setSidebarOpen(true)}
                    isCollapsed={isCollapsed}
                    onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                />

                {/* Body - sidebar + content */}
                <div className="relative z-10 flex flex-1 overflow-hidden mt-4 md:mt-6 px-3 md:px-4 lg:px-6 pb-3 md:pb-4 lg:pb-6 gap-3 md:gap-4">
                    {/* Sidebar - sticky full height on desktop, drawer on mobile */}
                    <AdminSidebar
                        isOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                        isCollapsed={isCollapsed}
                    />

                    {/* Main Content - scrollable */}
                    <main className="flex-1 overflow-y-auto rounded-[30px] border border-white/70 bg-white/95 shadow-[0_22px_55px_rgba(8,36,126,0.24)] p-4 md:p-6 lg:p-8 pb-24 md:pb-6 lg:pb-8">
                        {children}
                    </main>
                </div>

                {/* Mobile Bottom Navigation */}
                <MobileBottomNav />
            </div>
        </AdminGuard>
    );
}


