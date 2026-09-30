import React, { useState, useEffect } from 'react';
import { NexaLogo } from '../visual/NexaLogo';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onStartProject: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onStartProject, activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#hero', id: 'hero' },
    { label: 'Services', href: '#services', id: 'services' },
    { label: 'Products', href: '#products', id: 'products' },
    { label: 'Work', href: '#work', id: 'work' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Process', href: '#process', id: 'process' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#003135]/90 backdrop-blur-xl border-b border-[#0FA4AF]/25 shadow-[0_6px_30px_rgba(0,49,53,0.7)] py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Wordmark */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0FA4AF] rounded-lg"
            aria-label="Newta Tech Home"
          >
            <NexaLogo variant="full" size="md" glow={isScrolled} />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-[#024045]/80 border border-[#0FA4AF]/30 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#0FA4AF] text-white shadow-[0_0_15px_rgba(15,164,175,0.6)] font-bold'
                      : 'text-[#AFDDE5] hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Zone */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onStartProject}
              className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#0FA4AF] to-[#024045] hover:from-[#14B8C4] hover:to-[#0FA4AF] border border-[#AFDDE5]/40 active:scale-95 transition-all duration-200 rounded-full shadow-[0_2px_16px_rgba(15,164,175,0.4)] hover:shadow-[0_4px_24px_rgba(15,164,175,0.65)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AFDDE5] whitespace-nowrap cursor-pointer group"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onStartProject}
              className="sm:hidden px-3 py-1.5 text-xs font-bold text-white bg-[#0FA4AF] rounded-full shadow-sm"
            >
              Start
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#AFDDE5] hover:text-white hover:bg-white/[0.08] border border-[#0FA4AF]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0FA4AF]"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Animated Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#003135]/98 backdrop-blur-2xl border-b border-[#0FA4AF]/30 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#0FA4AF]/25 text-[#AFDDE5] border border-[#0FA4AF]/40 font-bold'
                      : 'text-[#AFDDE5] hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
          <div className="pt-3 border-t border-[#0FA4AF]/25">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onStartProject();
              }}
              className="w-full py-3 flex items-center justify-center gap-2 text-sm font-bold text-white bg-[#0FA4AF] hover:bg-[#14B8C4] rounded-full shadow-lg shadow-[#0FA4AF]/30"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
