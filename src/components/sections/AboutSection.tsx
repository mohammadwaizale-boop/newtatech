import React from 'react';
import { ABOUT_PILLARS, COMPANY_INFO } from '../../data/companyData';
import { ShieldCheck, Cpu, Target, Compass, Terminal, CheckCircle } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative py-28 border-t border-[#0FA4AF]/20 bg-[#003135]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Lead */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono text-[#0FA4AF] uppercase tracking-widest mb-3 font-bold">
            04 / IDENTITY &amp; PHILOSOPHY
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display">
            Why Newta Tech?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#AFDDE5] leading-relaxed">
            We bridge the chasm between experimental machine intelligence and rock-solid software engineering.
          </p>
        </div>

        {/* Central Manifesto Banner */}
        <div className="relative rounded-3xl bg-[#024045]/95 border border-[#0FA4AF]/40 p-8 sm:p-12 mb-16 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-4xl space-y-6">
            <span className="text-xs font-mono text-[#0FA4AF] uppercase tracking-widest font-bold">
              THE NEWTA STANDARD
            </span>
            <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug font-display">
              “{COMPANY_INFO.motto}”
            </blockquote>
            <p className="text-base text-white/90 leading-relaxed">
              Newta Tech is founded on the conviction that artificial intelligence is only as valuable as the software systems carrying it into the real world. We reject buzzword theater and fragile demos in favor of production-grade architectures: strict type contracts, deterministic guardrails, high-concurrency databases, and intuitive interfaces.
            </p>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient-newta pointer-events-none opacity-40" />
        </div>

        {/* 4 Architectural Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ABOUT_PILLARS.map((pillar, idx) => {
            const pillarColors = ['#AFDDE5', '#0FA4AF', '#AFDDE5', '#0FA4AF'];
            const activeColor = pillarColors[idx % pillarColors.length];

            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#024045]/90 p-6 border border-[#0FA4AF]/30 hover:border-[#AFDDE5] transition-all duration-300 space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold" style={{ color: activeColor }}>
                    0{idx + 1}
                  </span>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: activeColor }} />
                </div>
                <h3 className="text-lg font-bold text-white font-display">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#AFDDE5] leading-relaxed font-normal">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Engineering Rigor & Discipline Guarantees */}
        <div className="mt-16 rounded-2xl bg-[#003135] border border-[#0FA4AF]/30 p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-[#0FA4AF]/20 mb-6">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#AFDDE5]" />
              <span className="text-xs font-mono text-[#AFDDE5] font-bold">CORE ARCHITECTURAL INVARIANTS</span>
            </div>
            <span className="text-[11px] font-mono text-[#0FA4AF] font-bold">STATUS: STRICT COMPLIANCE</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center sm:text-left">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                100%
              </div>
              <div className="text-xs text-[#AFDDE5] mt-1 font-medium">Strict Type-Safe Codebases</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#AFDDE5] font-mono tabular-nums">
                &lt; 150ms
              </div>
              <div className="text-xs text-[#AFDDE5] mt-1 font-medium">Interaction Latency Budgets</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0FA4AF] font-mono tabular-nums">
                Zero
              </div>
              <div className="text-xs text-[#AFDDE5] mt-1 font-medium">Vendor Lock-In Policy</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                Automated
              </div>
              <div className="text-xs text-[#AFDDE5] mt-1 font-medium">Continuous Integration &amp; Testing</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
