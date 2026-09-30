import React from 'react';
import { ArrowRight, MessageSquare, Terminal } from 'lucide-react';

interface CtaSectionProps {
  onStartProject: () => void;
  onContactClick: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onStartProject, onContactClick }) => {
  return (
    <section className="relative py-28 border-t border-[#0FA4AF]/20 bg-[#003135] overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,164,175,0.2)_0%,rgba(0,49,53,0)_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#0FA4AF]/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#024045] border border-[#0FA4AF]/40 text-xs font-mono text-[#AFDDE5] mb-6 backdrop-blur-md shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#AFDDE5] animate-pulse" />
          <span className="font-bold">PRODUCTION-READY SYSTEMS</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight text-balance font-display">
          Have an idea?{' '}
          <span className="text-gradient-teal inline-block">Let’s build it.</span>
        </h2>

        <p className="mt-6 text-base sm:text-lg text-[#AFDDE5] max-w-2xl mx-auto leading-relaxed font-normal">
          Tell us what you’re building, and let’s turn the idea into a real digital product with Newta Tech.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartProject}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-[#0FA4AF] to-[#024045] hover:from-[#14B8C4] hover:to-[#0FA4AF] border border-[#AFDDE5]/40 active:scale-95 transition-all duration-200 rounded-full shadow-[0_4px_24px_rgba(15,164,175,0.45)] hover:shadow-[0_6px_32px_rgba(15,164,175,0.7)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AFDDE5] cursor-pointer group"
          >
            <span>Start a Project</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          <button
            onClick={onContactClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-bold text-white bg-[#024045] hover:bg-[#03484E] border border-[#0FA4AF]/40 active:scale-95 transition-all duration-200 rounded-full cursor-pointer shadow-md"
          >
            <MessageSquare className="w-4 h-4 text-[#AFDDE5]" />
            <span>Contact Newta</span>
          </button>
        </div>

      </div>
    </section>
  );
};
