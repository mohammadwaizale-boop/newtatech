import React from 'react';
import { PRODUCTS_DATA } from '../../data/companyData';
import { ProductItem } from '../../types';
import { Sparkles, ArrowRight, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ProductsSectionProps {
  onJoinWaitlist: (product: ProductItem) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({ onJoinWaitlist }) => {
  const flagshipProduct = PRODUCTS_DATA[0]; // Nexa Portfolio AI
  const pipelineProducts = PRODUCTS_DATA.slice(1);

  return (
    <section id="products" className="relative py-28 border-t border-[#0FA4AF]/20 bg-[#003135]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono text-[#0FA4AF] uppercase tracking-widest mb-3 font-bold">
            02 / PROPRIETARY SOFTWARE
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-balance font-display">
            Products by Newta
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#AFDDE5] leading-relaxed">
            We don’t just build for businesses. We engineer proprietary digital products of our own.
          </p>
        </div>

        {/* Flagship Marquee Product: Newta Portfolio AI */}
        <div className="relative rounded-3xl bg-[#024045]/95 border border-[#0FA4AF]/40 p-8 sm:p-12 mb-12 shadow-2xl overflow-hidden group hover:border-[#AFDDE5] transition-all">
          {/* Background glow in palette */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0FA4AF]/15 rounded-full blur-3xl pointer-events-none group-hover:bg-[#0FA4AF]/25 transition-all duration-500" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              
              {/* Product Status Bar */}
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#003135] border border-[#0FA4AF]/40 text-xs font-mono font-medium text-[#AFDDE5]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#AFDDE5] animate-pulse" />
                  {flagshipProduct.status}
                </span>
                <span className="text-xs font-mono text-[#AFDDE5]/70">
                  ESTIMATED LAUNCH: {flagshipProduct.releaseWindow}
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
                  {flagshipProduct.name}
                </h3>
                <p className="mt-2 text-base text-[#AFDDE5] font-medium">
                  {flagshipProduct.tagline}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal">
                {flagshipProduct.description}
              </p>

              {/* Core Features Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {flagshipProduct.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#0FA4AF] flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Interactive Waitlist CTA */}
              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={() => onJoinWaitlist(flagshipProduct)}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 text-xs font-bold text-white bg-gradient-to-r from-[#0FA4AF] to-[#024045] hover:from-[#14B8C4] hover:to-[#0FA4AF] border border-[#AFDDE5]/40 active:scale-95 transition-all duration-200 rounded-full shadow-[0_4px_20px_rgba(15,164,175,0.45)] hover:shadow-[0_6px_28px_rgba(15,164,175,0.7)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AFDDE5] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#AFDDE5]" />
                  <span>Join Waitlist</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-xs text-[#AFDDE5]/80 font-mono">
                  Early beta access &amp; founding credits
                </span>
              </div>
            </div>

            {/* Visual Workspace Preview Box */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-[#003135] border border-[#0FA4AF]/35 p-5 shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-[#0FA4AF]/20 text-xs font-mono text-[#AFDDE5]">
                  <span className="text-[#AFDDE5] font-bold">workspace / generator</span>
                  <span className="text-[#0FA4AF]">v0.9-alpha</span>
                </div>
                
                <div className="mt-4 space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-[#024045] border border-[#0FA4AF]/30 space-y-1">
                    <div className="text-[10px] text-[#AFDDE5] uppercase font-bold">SYNTHESIS ENGINE</div>
                    <div className="text-white font-medium">Automatic Case Study Architecture</div>
                    <div className="text-[11px] text-[#AFDDE5]">Parsed: 4 Repositories &amp; 12 Live Deployments</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#024045] border border-[#0FA4AF]/30 space-y-1">
                    <div className="text-[10px] text-[#AFDDE5] uppercase font-bold">EDGE DISTRIBUTION</div>
                    <div className="text-white font-medium">Global CDN Asset Pre-rendering</div>
                    <div className="text-[11px] text-[#0FA4AF]">Score: 100/100 Core Web Vitals Guaranteed</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0FA4AF]/15 border border-[#0FA4AF]/30 space-y-1">
                    <div className="text-[10px] text-[#AFDDE5] uppercase font-bold">DEVELOPER CONTROL</div>
                    <div className="text-white font-medium">Export Clean React &amp; Tailwind Output</div>
                    <div className="text-[11px] text-[#AFDDE5]/90">Zero vendor lock-in. Full code ownership.</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Future Product Pipeline Grid */}
        <div className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white tracking-tight font-display">
              Software Pipeline In Progress
            </h3>
            <span className="text-xs font-mono text-[#AFDDE5]/80">
              Honest status • No vaporware
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pipelineProducts.map((prod) => (
              <div
                key={prod.id}
                className="rounded-2xl bg-[#024045]/90 p-6 border border-[#0FA4AF]/30 hover:border-[#AFDDE5] transition-all duration-300 flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#003135] text-[#AFDDE5] border border-[#0FA4AF]/40 font-semibold">
                      {prod.status}
                    </span>
                    <span className="text-[11px] font-mono text-[#AFDDE5]/70">
                      {prod.releaseWindow}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-1 font-display">
                    {prod.name}
                  </h4>
                  <p className="text-xs text-[#AFDDE5] font-medium mb-3">
                    {prod.tagline}
                  </p>
                  <p className="text-xs text-white/80 leading-relaxed mb-6 font-normal">
                    {prod.description}
                  </p>

                  <div className="space-y-1.5 mb-6">
                    {prod.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-[11px] text-white">
                        <span className="text-[#0FA4AF] font-bold">•</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#0FA4AF]/20 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#AFDDE5]/70">{prod.category}</span>
                  <button
                    onClick={() => onJoinWaitlist(prod)}
                    className="text-xs font-bold text-[#AFDDE5] hover:text-white transition-colors cursor-pointer"
                  >
                    Notify Me →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
