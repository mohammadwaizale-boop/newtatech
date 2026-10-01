import React, { useState } from 'react';
import { SERVICES_DATA } from '../../data/companyData';
import { ServiceItem } from '../../types';
import { Cpu, Layers, Globe, Zap, Terminal, Sparkles, ArrowRight, X, CheckCircle2 } from 'lucide-react';

interface ServicesSectionProps {
  onSelectServiceForInquiry: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForInquiry }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-[#AFDDE5]" />;
      case 'Layers': return <Layers className="w-5 h-5 text-[#0FA4AF]" />;
      case 'Globe': return <Globe className="w-5 h-5 text-[#AFDDE5]" />;
      case 'Zap': return <Zap className="w-5 h-5 text-[#0FA4AF]" />;
      case 'Terminal': return <Terminal className="w-5 h-5 text-[#AFDDE5]" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-[#0FA4AF]" />;
      default: return <Cpu className="w-5 h-5 text-[#0FA4AF]" />;
    }
  };

  return (
    <section id="services" className="relative py-28 border-t border-[#0FA4AF]/20 bg-[#003135]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono text-[#0FA4AF] uppercase tracking-widest mb-3 font-bold">
            01 / CAPABILITIES &amp; ENGINEERING
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-balance font-display">
            What We Build
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#AFDDE5] leading-relaxed">
            From AI-powered experiences to scalable software, Newta Tech turns ambitious ideas into real digital products.
          </p>
        </div>

        {/* 6-Service Grid with Newta Palette Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_DATA.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelectedService(service)}
              className="group relative rounded-2xl bg-[#024045]/90 p-7 border border-[#0FA4AF]/30 hover:border-[#AFDDE5] transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_12px_36px_rgba(15,164,175,0.25)] cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Natural editorial numbering & icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-xl bg-[#003135] border border-[#0FA4AF]/40 group-hover:scale-105 group-hover:border-[#AFDDE5] transition-all duration-300">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="text-xs font-mono font-bold text-[#AFDDE5]/70 group-hover:text-[#AFDDE5] transition-colors">
                    {service.number}
                  </span>
                </div>

                {/* Service Title */}
                <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-[#AFDDE5] transition-colors font-display">
                  {service.title}
                </h3>

                {/* Short Description */}
                <p className="text-sm text-[#AFDDE5] leading-relaxed mb-6 font-normal">
                  {service.shortDescription}
                </p>

                {/* Key Deliverables bullets */}
                <ul className="space-y-2 mb-6">
                  {service.deliverables.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-white">
                      <span className="text-[#0FA4AF] font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Footer: Tech tags + view architecture button */}
              <div className="pt-4 border-t border-[#0FA4AF]/20 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#AFDDE5]/80">
                  <span>{service.techStack[0]}</span>
                  <span className="text-[#0FA4AF]">/</span>
                  <span>{service.techStack[1]}</span>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#AFDDE5] group-hover:text-white transition-colors"
                >
                  <span>Specs</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Subtle Corner Glow Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#0FA4AF]/20 to-transparent rounded-tr-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

      </div>

      {/* Deep Service Architectural Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#024045] border border-[#0FA4AF]/50 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-5 right-5 p-2 rounded-lg text-[#AFDDE5] hover:text-white hover:bg-white/[0.08] transition-colors"
              aria-label="Close Service Details"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-[#003135] border border-[#0FA4AF]/40">
                {getIcon(selectedService.iconName)}
              </div>
              <div>
                <span className="text-xs font-mono text-[#0FA4AF] font-bold">
                  SERVICE SPECIFICATION // {selectedService.number}
                </span>
                <h3 className="text-2xl font-bold text-white font-display">
                  {selectedService.title}
                </h3>
              </div>
            </div>

            {/* Full Architectural Overview */}
            <div className="space-y-6 text-sm text-[#AFDDE5]">
              <p className="leading-relaxed text-white">
                {selectedService.fullDescription}
              </p>

              {/* Core Deliverables */}
              <div>
                <h4 className="text-xs font-mono text-[#AFDDE5] uppercase tracking-wider mb-3 font-bold">
                  Scope of Delivery
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedService.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-[#003135] border border-[#0FA4AF]/30 text-xs text-white">
                      <CheckCircle2 className="w-4 h-4 text-[#0FA4AF] flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Architectural Subsystems */}
              <div>
                <h4 className="text-xs font-mono text-[#AFDDE5] uppercase tracking-wider mb-3 font-bold">
                  Architectural Foundation
                </h4>
                <div className="space-y-2">
                  {selectedService.architecturalComponents.map((comp, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[#003135] border border-[#0FA4AF]/30 text-xs font-mono text-[#AFDDE5] flex items-center gap-2">
                      <span className="text-[#0FA4AF] font-bold">&gt;</span>
                      <span className="text-white">{comp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack Matrix */}
              <div>
                <h4 className="text-xs font-mono text-[#AFDDE5] uppercase tracking-wider mb-2 font-bold">
                  Primary Technology Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedService.techStack.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-md bg-[#003135] border border-[#0FA4AF]/40 text-xs font-mono text-white">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Action Footer */}
            <div className="mt-8 pt-6 border-t border-[#0FA4AF]/30 flex items-center justify-between">
              <button
                onClick={() => setSelectedService(null)}
                className="px-4 py-2 text-xs font-medium text-[#AFDDE5] hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const serviceTitle = selectedService.title;
                  setSelectedService(null);
                  onSelectServiceForInquiry(serviceTitle);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#0FA4AF] to-[#024045] hover:from-[#14B8C4] hover:to-[#0FA4AF] border border-[#AFDDE5]/40 rounded-full shadow-[0_0_20px_rgba(15,164,175,0.4)] transition-all cursor-pointer"
              >
                <span>Request {selectedService.title}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
