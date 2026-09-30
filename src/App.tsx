import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { ProductsSection } from './components/sections/ProductsSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { AboutSection } from './components/sections/AboutSection';
import { ProcessSection } from './components/sections/ProcessSection';
import { TechStackSection } from './components/sections/TechStackSection';
import { CtaSection } from './components/sections/CtaSection';
import { ContactSection } from './components/sections/ContactSection';
import { InteractiveConsole } from './components/ui/InteractiveConsole';
import { WaitlistModal } from './components/modals/WaitlistModal';
import { CaseStudyModal } from './components/modals/CaseStudyModal';
import { LegalModal } from './components/modals/LegalModal';
import { ProductItem, ProjectItem } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [selectedWaitlistProduct, setSelectedWaitlistProduct] = useState<ProductItem | null>(null);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<ProjectItem | null>(null);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);
  const [contactInitialType, setContactInitialType] = useState<string>('AI Solution');

  // Track active section for navbar highlighting
  useEffect(() => {
    const sectionIds = ['hero', 'services', 'products', 'work', 'about', 'process', 'contact'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartProject = () => {
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
      // Focus the first input after a slight delay
      setTimeout(() => {
        const nameInput = document.getElementById('inquiry-name');
        nameInput?.focus();
      }, 500);
    }
  };

  const handleExploreWork = () => {
    const workEl = document.getElementById('work');
    workEl?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectServiceForInquiry = (serviceName: string) => {
    let mappedType = 'AI Solution';
    if (serviceName.toLowerCase().includes('saas')) mappedType = 'SaaS Product';
    else if (serviceName.toLowerCase().includes('web')) mappedType = 'Website';
    else if (serviceName.toLowerCase().includes('automation')) mappedType = 'AI Automation';
    else if (serviceName.toLowerCase().includes('custom')) mappedType = 'Custom Software';

    setContactInitialType(mappedType);
    handleStartProject();
  };

  const handleScopeSimilarProject = (projectName: string) => {
    setContactInitialType('Custom Software');
    handleStartProject();
  };

  return (
    <div className="relative min-h-screen bg-[#003135] text-white selection:bg-[#0FA4AF] selection:text-white">
      {/* Signature Newta Ambient Atmospheric Backdrop with 003135, 0FA4AF, and AFDDE5 */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[700px] h-[700px] bg-[#0FA4AF]/20 rounded-full blur-[150px]" />
        <div className="absolute top-1/3 -right-24 w-[600px] h-[600px] bg-[#AFDDE5]/15 rounded-full blur-[160px]" />
        <div className="absolute top-2/3 -left-20 w-[550px] h-[550px] bg-[#0FA4AF]/15 rounded-full blur-[150px]" />
        <div className="absolute -bottom-28 right-1/4 w-[750px] h-[750px] bg-[#024045]/60 rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-pattern-dots opacity-40" />
      </div>

      {/* Main Foreground Interface */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Sticky Top Navigation */}
        <Navbar
          onStartProject={handleStartProject}
          activeSection={activeSection}
        />

        {/* Main Content Layout */}
        <main className="flex-1">
          {/* Hero Section */}
          <HeroSection
            onStartProject={handleStartProject}
            onExploreWork={handleExploreWork}
          />

          {/* Capabilities & Services */}
          <ServicesSection
            onSelectServiceForInquiry={handleSelectServiceForInquiry}
          />

          {/* Products Built by Nexa */}
          <ProductsSection
            onJoinWaitlist={(prod) => setSelectedWaitlistProduct(prod)}
          />

          {/* Portfolio & Selected Work */}
          <ProjectsSection
            onOpenCaseStudy={(proj) => setSelectedCaseStudy(proj)}
          />

          {/* Why Nexa Tech & Engineering Values */}
          <AboutSection />

          {/* 5-Step Process */}
          <ProcessSection />

          {/* Technology Ecosystem */}
          <TechStackSection />

          {/* Interactive Pipeline Harness */}
          <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8">
              <div className="text-xs font-mono text-[#0FA4AF] uppercase tracking-widest mb-2 font-bold">
                TEST HARNESS &amp; BENCHMARKS
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                Simulate an Autonomous Pipeline
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#AFDDE5] leading-relaxed">
                Experience Newta Tech’s execution harness. Select a workload to evaluate latency budgets, token efficiency, and guardrail validations in real time.
              </p>
            </div>
            <InteractiveConsole />
          </section>

          {/* Large CTA Banner */}
          <CtaSection
            onStartProject={handleStartProject}
            onContactClick={handleStartProject}
          />

          {/* Project Inquiry & Scoping Form */}
          <ContactSection
            initialProjectType={contactInitialType}
          />
        </main>

        {/* Global Footer */}
        <Footer
          onOpenPrivacy={() => setLegalModalType('privacy')}
          onOpenTerms={() => setLegalModalType('terms')}
        />
      </div>

      {/* Modals */}
      <WaitlistModal
        product={selectedWaitlistProduct}
        onClose={() => setSelectedWaitlistProduct(null)}
      />

      <CaseStudyModal
        project={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
        onScopeSimilar={handleScopeSimilarProject}
      />

      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}
