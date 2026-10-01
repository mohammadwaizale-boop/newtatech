import React, { useState } from 'react';
import { ArrowRight, Terminal, Sparkles, CheckCircle2, Shield, Zap, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  onStartProject: () => void;
  onExploreWork: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartProject, onExploreWork }) => {
  const [copiedContract, setCopiedContract] = useState(false);

  const handleCopyInstall = () => {
    navigator.clipboard.writeText('npx @newtatech/pipeline init');
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2200);
  };

  return (
    <section id="hero" className="relative min-h-[92vh] pt-32 pb-20 flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Core Positioning & Headline */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Status / Trust Marker in Newta Signature Palette */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#024045]/90 border border-[#0FA4AF]/40 text-xs font-semibold text-[#AFDDE5] backdrop-blur-md shadow-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#AFDDE5] animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-[#0FA4AF]" />
              </span>
              <span className="text-white font-bold">NEWTA TECH</span>
              <span className="text-[#0FA4AF]" aria-hidden="true">•</span>
              <span className="text-[#AFDDE5]">AI &amp; SOFTWARE</span>
              <span className="text-[#0FA4AF]" aria-hidden="true">•</span>
              <span className="text-white">INNOVATION</span>
            </div>

            {/* Main Headline with Catchy Font */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] text-balance font-display">
              Building the Future with{' '}
              <span className="text-gradient-teal inline-block">AI &amp; Software.</span>
            </h1>

            {/* Supporting Subtitle */}
            <p className="text-base sm:text-lg text-[#AFDDE5] max-w-2xl leading-relaxed font-normal">
              Newta Tech builds intelligent software, AI-powered products, automation systems, and high-performance digital experiences for modern businesses.
            </p>

            {/* Interactive Engineering Callouts / Standards in Newta Palette */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono text-white">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#024045]/80 border border-[#0FA4AF]/30 min-w-0">
                <Zap className="w-4 h-4 text-[#AFDDE5] flex-shrink-0" />
                <span className="truncate sm:whitespace-normal">Sub-150ms Response</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#024045]/80 border border-[#0FA4AF]/30 min-w-0">
                <Shield className="w-4 h-4 text-[#0FA4AF] flex-shrink-0" />
                <span className="truncate sm:whitespace-normal">Zero Slop Architecture</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#024045]/80 border border-[#0FA4AF]/30 min-w-0">
                <Sparkles className="w-4 h-4 text-[#AFDDE5] flex-shrink-0" />
                <span className="truncate sm:whitespace-normal">Production-Ready AI</span>
              </div>
            </div>

            {/* CTA Button Array in Newta Palette */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onStartProject}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-[#0FA4AF] to-[#024045] hover:from-[#14B8C4] hover:to-[#0FA4AF] border border-[#AFDDE5]/40 active:scale-98 transition-all duration-200 rounded-full shadow-[0_4px_24px_rgba(15,164,175,0.45)] hover:shadow-[0_6px_32px_rgba(15,164,175,0.7)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AFDDE5] cursor-pointer group"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreWork}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#024045] hover:bg-[#03484E] border border-[#0FA4AF]/40 active:scale-98 transition-all duration-200 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 cursor-pointer"
              >
                <span>Explore Our Work</span>
              </button>
            </div>

            {/* Quick Interactive Terminal Hook */}
            <div className="pt-2">
              <div
                onClick={handleCopyInstall}
                className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#024045]/90 border border-[#0FA4AF]/30 hover:border-[#AFDDE5] text-xs font-mono text-[#AFDDE5] cursor-pointer transition-colors group"
                title="Click to copy CLI command"
              >
                <Terminal className="w-3.5 h-3.5 text-[#AFDDE5]" />
                <span className="text-white font-medium">npx @newtatech/pipeline init</span>
                <span className="text-[10px] text-[#AFDDE5]/70 group-hover:text-white transition-colors ml-2">
                  {copiedContract ? '✓ Copied' : 'Click to copy'}
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Newta Tech Styled Architecture Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-2xl bg-[#024045]/95 border border-[#0FA4AF]/40 p-6 backdrop-blur-xl shadow-2xl overflow-hidden group hover:border-[#AFDDE5]/80 transition-colors duration-300">
              
              {/* Top Bar of Card */}
              <div className="flex items-center justify-between pb-4 border-b border-[#0FA4AF]/25">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#AFDDE5]" />
                  <div className="w-3 h-3 rounded-full bg-[#0FA4AF]" />
                  <div className="w-3 h-3 rounded-full bg-[#003135] border border-[#0FA4AF]" />
                  <span className="text-[11px] font-mono text-[#AFDDE5] ml-2 font-semibold">newta-ai-runtime</span>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#0FA4AF]/20 text-[#AFDDE5] border border-[#0FA4AF]/40 font-bold">
                  ACTIVE // V2.8
                </span>
              </div>

              {/* Code / Architecture Telemetry Feed */}
              <div className="py-4 space-y-3 font-mono text-xs">
                <div className="text-white flex items-start gap-2">
                  <span className="text-[#AFDDE5]">&gt;</span>
                  <span>Engine: <span className="text-[#AFDDE5] font-bold">Multimodal Neural Orchestrator</span></span>
                </div>
                <div className="text-white flex items-start gap-2">
                  <span className="text-[#0FA4AF]">&gt;</span>
                  <span>Inference Latency: <span className="text-[#AFDDE5] font-bold">38ms [Streaming P99]</span></span>
                </div>
                <div className="text-white flex items-start gap-2">
                  <span className="text-[#AFDDE5]">&gt;</span>
                  <span>Guardrail Policy: <span className="text-white font-medium">Strict AST Type Enforcement</span></span>
                </div>
                <div className="text-white flex items-start gap-2">
                  <span className="text-[#0FA4AF]">&gt;</span>
                  <span>Autonomous Agents: <span className="text-[#AFDDE5] font-bold">Synchronized &amp; Ready</span></span>
                </div>
              </div>

              {/* Visual telemetry bar */}
              <div className="pt-3 border-t border-[#0FA4AF]/25 space-y-2">
                <div className="flex justify-between text-[11px] font-mono text-[#AFDDE5]">
                  <span>SYSTEM THROUGHPUT</span>
                  <span className="text-white font-bold">99.9% OPTIMAL</span>
                </div>
                <div className="w-full h-1.5 bg-[#003135] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#0FA4AF] via-[#AFDDE5] to-[#FFFFFF] rounded-full w-[98%]" />
                </div>
              </div>

              {/* Interactive prompt trigger */}
              <div className="mt-4 pt-4 border-t border-[#0FA4AF]/25 flex items-center justify-between">
                <span className="text-xs text-[#AFDDE5] font-sans">Turn your vision into reality</span>
                <button
                  onClick={onStartProject}
                  className="text-xs text-white hover:text-[#AFDDE5] font-bold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Build with Newta</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>

            {/* Glowing accents behind frame */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#0FA4AF]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#AFDDE5]/15 rounded-full blur-3xl pointer-events-none" />
          </div>

        </div>

        {/* Scroll indicator prompt */}
        <div className="pt-16 flex flex-col items-center justify-center text-[#AFDDE5]/70 hover:text-white transition-colors">
          <a href="#services" className="flex flex-col items-center gap-2 text-xs font-mono tracking-wider focus:outline-none">
            <span>SCROLL TO EXPLORE ARCHITECTURE</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-[#0FA4AF]" />
          </a>
        </div>
      </div>
    </section>
  );
};
