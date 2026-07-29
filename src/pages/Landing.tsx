import LandingNavbar from '@/components/layout/LandingNavbar'
import LandingFooter from '@/components/layout/LandingFooter'
import HeroSection from '@/components/landing/HeroSection'
import PartnersSection from '@/components/landing/PartnersSection'
import StatsSection from '@/components/landing/StatsSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import DemoSection from '@/components/landing/DemoSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import FaqSection from '@/components/landing/FaqSection'
import CtaSection from '@/components/landing/CtaSection'

export default function Landing() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
            {/* Subtle mesh background */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none -z-10 h-full w-full" />

            <LandingNavbar />
            <HeroSection />
            <PartnersSection />
            <StatsSection />
            <FeaturesSection />
            <HowItWorksSection />
            <DemoSection />
            <TestimonialsSection />
            <FaqSection />
            <CtaSection />
            <LandingFooter />
        </div>
    )
}