import dynamic from 'next/dynamic';

const Header = dynamic(() => import('@/components/layout/Header'), {
    ssr: true,
});

const Footer = dynamic(() => import('@/components/layout/Footer'), {
    ssr: true,
});

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                {children}
            </main>
            <Footer />
        </div>
    );
}
