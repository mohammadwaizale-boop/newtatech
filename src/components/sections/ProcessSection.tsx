import React, { useState } from 'react';
import { PROCESS_STEPS } from '../../data/companyData';
import { CheckCircle2, ArrowRight, Clock } from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const activeStep = PROCESS_STEPS[activeStepIndex];

  return (
    <section id="process" className="relative py-28 border-t border-[#0FA4AF]/20 bg-[#003135]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Lead */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono text-[#0FA4AF] uppercase tracking-widest mb-3 font-bold">
            05 / METHODOLOGY &amp; EXECUTION
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display">
            From Idea to Product
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#AFDDE5] leading-relaxed">
            A disciplined 5-step lifecycle designed to ship robust software without delays or architectural debt.
          </p>
        </div>

        {/* Interactive Step Navigator with Connecting Energy Line */}
        <div className="relative mb-12">
          {/* Connecting Line between steps (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-[#024045] -translate-y-1/2 z-0 rounded-full pointer-events-none">
            <div
              className="h-full bg-gradient-to-r from-[#0FA4AF] via-[#AFDDE5] to-[#FFFFFF] transition-all duration-500 rounded-full"
              style={{ width: `${(activeStepIndex / (PROCESS_STEPS.length - 1)) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 relative z-10">
            {PROCESS_STEPS.map((step, idx) => {
              const isCurrent = activeStepIndex === idx;
              const isPast = idx < activeStepIndex;
              const isLastOnMobile = idx === 4;

              return (
                <button
                  key={step.number}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-4 rounded-xl text-left transition-all duration-200 border cursor-pointer ${
                    isLastOnMobile ? 'col-span-2 sm:col-span-1' : ''
                  } ${
                    isCurrent
                      ? 'bg-[#0FA4AF] border-[#AFDDE5] shadow-lg shadow-[#0FA4AF]/30'
                      : isPast
                      ? 'bg-[#024045] border-[#0FA4AF]/40 text-white'
                      : 'bg-[#024045] border-[#0FA4AF]/20 text-[#AFDDE5] hover:border-[#AFDDE5]/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono font-bold ${isCurrent ? 'text-white' : 'text-[#AFDDE5]'}`}>
                      {step.number}
                    </span>
                    {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-[#AFDDE5]" />}
                  </div>
                  <div className="text-sm font-bold text-white tracking-tight font-display">
                    {step.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Step Deep Breakdown Card */}
        <div className="rounded-3xl bg-[#024045]/95 border border-[#0FA4AF]/40 p-8 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#003135] border border-[#0FA4AF]/40 text-[#AFDDE5] font-bold">
                  STEP {activeStep.number} OF 05
                </span>
                <span className="text-xs font-mono text-[#AFDDE5]/80 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#AFDDE5]" />
                  <span>Cadence: {activeStep.durationEstimate}</span>
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                {activeStep.title} — {activeStep.summary}
              </h3>

              <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal">
                {activeStep.description}
              </p>

              <div className="pt-4 flex items-center gap-3">
                {activeStepIndex > 0 && (
                  <button
                    onClick={() => setActiveStepIndex(activeStepIndex - 1)}
                    className="px-4 py-2 text-xs font-medium text-[#AFDDE5] hover:text-white bg-[#003135] border border-[#0FA4AF]/30 rounded-full transition-colors cursor-pointer"
                  >
                    ← Previous Phase
                  </button>
                )}
                {activeStepIndex < PROCESS_STEPS.length - 1 && (
                  <button
                    onClick={() => setActiveStepIndex(activeStepIndex + 1)}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#0FA4AF] to-[#024045] hover:from-[#14B8C4] hover:to-[#0FA4AF] border border-[#AFDDE5]/40 rounded-full shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Next Phase</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Milestones & Deliverables Panel */}
            <div className="lg:col-span-5 bg-[#003135] p-6 rounded-2xl border border-[#0FA4AF]/30">
              <h4 className="text-xs font-mono text-[#0FA4AF] uppercase tracking-wider mb-4 font-bold">
                Phase Deliverables &amp; Invariants
              </h4>
              <ul className="space-y-3">
                {activeStep.milestones.map((milestone, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-white">
                    <span className="text-[#AFDDE5] font-mono font-bold mt-0.5">0{idx + 1}.</span>
                    <span>{milestone}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
