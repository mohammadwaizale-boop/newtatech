import React from 'react';
import { NexaLogo } from '../visual/NexaLogo';
import { Github, Linkedin, Twitter, Instagram, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenTerms }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Services', href: '#services' },
    { label: 'Products', href: '#products' },
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Process', href: '#process' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="relative border-t border-[#0FA4AF]/25 bg-[#002528] text-[#AFDDE5] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#0FA4AF]/20">
          
          {/* Brand info */}
          <div className="md:col-span-5 space-y-4">
            <a href="#hero" className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0FA4AF] rounded-lg">
              <NexaLogo variant="full" size="md" />
            </a>
            <p className="text-xs font-mono text-[#0FA4AF] tracking-wider font-bold">
              AI • SOFTWARE • DIGITAL PRODUCTS
            </p>
            <p className="text-sm text-white/90 max-w-sm leading-relaxed font-normal">
              Newta Tech builds intelligent software, SaaS products, automation systems, and digital experiences for the next generation of businesses.
            </p>
            <div className="flex flex-col gap-2 pt-1 text-xs font-mono">
              <a
                href="mailto:mohammadwaizale@gmail.com,awanareeb450@gmail.com?cc=awanareeb450@gmail.com&subject=Project%20Inquiry%20%E2%80%94%20Newta%20Tech"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#024045] border border-[#0FA4AF]/40 text-[#AFDDE5] hover:text-white hover:border-[#AFDDE5] transition-colors w-fit group shadow-sm"
                title="Send email to both mohammadwaizale@gmail.com and awanareeb450@gmail.com"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#AFDDE5] animate-pulse" />
                <span className="font-bold">Email Both Engineers</span>
                <span className="text-[10px] text-[#0FA4AF] group-hover:translate-x-0.5 transition-transform">↗</span>
              </a>
              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 text-[11px] text-[#AFDDE5]">
                <a
                  href="mailto:mohammadwaizale@gmail.com?cc=awanareeb450@gmail.com&subject=Project%20Inquiry%20%E2%80%94%20Newta%20Tech"
                  className="hover:text-white transition-colors flex items-center gap-1.5 break-all"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0FA4AF] flex-shrink-0" />
                  <span>mohammadwaizale@gmail.com</span>
                </a>
                <span className="hidden sm:inline text-[#0FA4AF] flex-shrink-0">•</span>
                <a
                  href="mailto:awanareeb450@gmail.com?cc=mohammadwaizale@gmail.com&subject=Project%20Inquiry%20%E2%80%94%20Newta%20Tech"
                  className="hover:text-white transition-colors flex items-center gap-1.5 break-all"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#AFDDE5] flex-shrink-0" />
                  <span>awanareeb450@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono text-white uppercase tracking-wider font-bold">
              Sitemap Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-white text-[#AFDDE5] transition-colors py-1 font-medium"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Socials & Studio */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono text-white uppercase tracking-wider font-bold">
              Network &amp; Code
            </h4>
            <div className="flex items-center gap-2.5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer noopener"
                className="p-2.5 rounded-xl bg-[#024045] border border-[#0FA4AF]/30 text-[#AFDDE5] hover:text-white hover:border-[#AFDDE5] transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer noopener"
                className="p-2.5 rounded-xl bg-[#024045] border border-[#0FA4AF]/30 text-[#AFDDE5] hover:text-white hover:border-[#AFDDE5] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer noopener"
                className="p-2.5 rounded-xl bg-[#024045] border border-[#0FA4AF]/30 text-[#AFDDE5] hover:text-white hover:border-[#AFDDE5] transition-colors"
                aria-label="X / Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer noopener"
                className="p-2.5 rounded-xl bg-[#024045] border border-[#0FA4AF]/30 text-[#AFDDE5] hover:text-white hover:border-[#AFDDE5] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[11px] font-mono text-[#AFDDE5]/80 pt-1">
              Engineering Studio • Worldwide Availability
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#AFDDE5]/80">
          <div>
            © 2026 Newta Tech. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-white text-[#AFDDE5] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={onOpenTerms}
              className="hover:text-white text-[#AFDDE5] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-[#024045] border border-[#0FA4AF]/30 hover:text-white hover:border-[#AFDDE5] transition-colors"
              aria-label="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
