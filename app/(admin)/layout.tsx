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
            <div className="h-screen flex flex-col bg-[#F8FAFC]">
                {/* Header - fixed at top */}
                <AdminHeader
                    onMenuClick={() => setSidebarOpen(true)}
                    isCollapsed={isCollapsed}
                    onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                />

                {/* Body - sidebar + content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar - sticky full height on desktop, drawer on mobile */}
                    <AdminSidebar
                        isOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                        isCollapsed={isCollapsed}
                    />

                    {/* Main Content - scrollable */}
                    <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 md:pb-6 lg:pb-8 overflow-y-auto">
                        {children}
                    </main>
                </div>

                {/* Mobile Bottom Navigation */}
                <MobileBottomNav />
            </div>
        </AdminGuard>
    );
}


