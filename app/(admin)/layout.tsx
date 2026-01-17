'use client';

import { useState } from 'react';
import { AdminGuard } from '@/components/auth';
import { AdminHeader, AdminSidebar } from '@/components/admin';

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
                {/* Header - fixed */}
                <AdminHeader
                    onMenuClick={() => setSidebarOpen(true)}
                    isCollapsed={isCollapsed}
                    onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                />

                {/* Body - sidebar + content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar - full height, fixed position */}
                    <AdminSidebar
                        isOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                        isCollapsed={isCollapsed}
                    />

                    {/* Main Content - scrollable */}
                    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </AdminGuard>
    );
}
