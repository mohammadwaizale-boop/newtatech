import React from 'react';
import { ProjectItem } from '../../types';
import { X, CheckCircle2, ArrowRight, ShieldCheck, Terminal, Cpu } from 'lucide-react';

interface CaseStudyModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onScopeSimilar: (projectName: string) => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ project, onClose, onScopeSimilar }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#024045] border border-[#0FA4AF]/40 p-6 sm:p-10 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-[#AFDDE5] hover:text-white hover:bg-white/[0.08] transition-colors"
          aria-label="Close Case Study"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Metadata */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#003135] border border-[#0FA4AF]/40 text-[#AFDDE5] font-bold">
              {project.category}
            </span>
            <span className="text-xs font-mono text-[#AFDDE5]/80">
              ARCHITECTURAL CASE SPECIFICATION
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            {project.title}
          </h3>
        </div>

        {/* Hero Visual Preview with Scrim */}
        <div className="relative rounded-2xl overflow-hidden aspect-video mb-8 border border-[#0FA4AF]/30">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#024045] via-transparent to-transparent" />
          
          {/* Key Metrics Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
            {project.metrics.map((m, idx) => (
              <div key={idx} className="bg-[#003135]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#0FA4AF]/30">
                <span className="text-[10px] font-mono text-[#AFDDE5]/80 block">{m.label}</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-white">{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Problem & Solution Architecture */}
        <div className="space-y-6 text-sm text-[#AFDDE5]">
          <div>
            <h4 className="text-xs font-mono text-[#AFDDE5] uppercase tracking-wider mb-2 flex items-center gap-2 font-bold">
              <Terminal className="w-3.5 h-3.5 text-[#0FA4AF]" />
              <span>The Engineering Challenge</span>
            </h4>
            <p className="leading-relaxed bg-[#003135] p-4 rounded-xl border border-[#0FA4AF]/30 text-white">
              {project.challenge}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-mono text-[#AFDDE5] uppercase tracking-wider mb-2 flex items-center gap-2 font-bold">
              <Cpu className="w-3.5 h-3.5 text-[#0FA4AF]" />
              <span>Newta Tech Architecture &amp; Solution</span>
            </h4>
            <p className="leading-relaxed bg-[#003135] p-4 rounded-xl border border-[#0FA4AF]/30 text-white">
              {project.solution}
            </p>
          </div>

          {/* Invariants & Subsystems */}
          <div>
            <h4 className="text-xs font-mono text-white uppercase tracking-wider mb-3 font-bold">
              Implementation Highlights
            </h4>
            <div className="space-y-2">
              {project.architectureDetails.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-[#003135] border border-[#0FA4AF]/30 text-xs text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#0FA4AF] flex-shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-mono text-white uppercase tracking-wider mb-2 font-bold">
              Technology Stack Deployed
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t, idx) => (
                <span key={idx} className="px-3 py-1 rounded bg-[#003135] border border-[#0FA4AF]/40 text-xs font-mono text-[#AFDDE5]">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="mt-8 pt-6 border-t border-[#0FA4AF]/30 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#AFDDE5] hover:text-white"
          >
            Close
          </button>
          <button
            onClick={() => {
              const title = project.title;
              onClose();
              onScopeSimilar(title);
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#0FA4AF] to-[#024045] hover:from-[#14B8C4] hover:to-[#0FA4AF] border border-[#AFDDE5]/40 rounded-full shadow-lg shadow-[#0FA4AF]/30 transition-all cursor-pointer"
          >
            <span>Scope a Similar Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
