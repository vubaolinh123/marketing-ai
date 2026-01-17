'use client';

import Link from 'next/link';
import Image from 'next/image';

const toolLinks = [
    { label: 'Tạo bài viết AI', href: '/create-article' },
    { label: 'Tạo ảnh AI', href: '/create-image' },
    { label: 'Kế hoạch Marketing', href: '/marketing-plan' },
    { label: 'Kịch bản Video', href: '/video-script' },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#F4F4F5] border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                    {/* Brand Column */}
                    <div className="flex flex-col items-start">
                        <Link href="/" className="mb-4">
                            <div className="bg-gradient-to-r from-[#F59E0B] to-[#EA580C] rounded-lg px-4 py-2 shadow-md">
                                <Image
                                    src="/logo/logo.png"
                                    alt="Easy Marketing"
                                    width={180}
                                    height={40}
                                    className="h-9 w-auto"
                                />
                            </div>
                        </Link>
                        <p className="text-gray-600 text-sm max-w-xs">
                            Công cụ nội bộ tạo nội dung AI cho team Easy Marketing.
                        </p>
                    </div>

                    {/* Tools Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-[#EA580C] mb-4">
                            Công cụ
                        </h4>
                        <ul className="space-y-3">
                            {toolLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-600 hover:text-[#EA580C] transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-500">
                            © {currentYear} Easy Marketing. Internal use only.
                        </p>
                        <span className="text-sm text-gray-500 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Hệ thống hoạt động bình thường
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
