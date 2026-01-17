import dynamic from 'next/dynamic';

// Dynamic imports for code splitting and optimization
const HeroSection = dynamic(() => import('./_components/HeroSection'), {
    ssr: true,
});

const FeaturesSection = dynamic(() => import('./_components/FeaturesSection'), {
    ssr: true,
});

const HowItWorksSection = dynamic(() => import('./_components/HowItWorksSection'), {
    ssr: true,
});

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
        </>
    );
}
