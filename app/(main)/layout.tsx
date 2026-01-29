import dynamic from 'next/dynamic';

const Header = dynamic(() => import('@/components/layout/Header'), {
    ssr: true,
});

const Footer = dynamic(() => import('@/components/layout/Footer'), {
    ssr: true,
});

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
