import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/lib/toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Content Generator | Tạo nội dung AI chuyên nghiệp",
  description: "Nền tảng tạo nội dung AI hàng đầu - Tạo bài viết, ảnh, kế hoạch marketing và kịch bản video tự động với AI.",
  keywords: ["AI", "Content Generator", "Marketing AI", "Tạo nội dung", "Automation"],
  authors: [{ name: "AI Content Team" }],
  openGraph: {
    title: "AI Content Generator",
    description: "Tạo nội dung AI chuyên nghiệp cho doanh nghiệp của bạn",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
