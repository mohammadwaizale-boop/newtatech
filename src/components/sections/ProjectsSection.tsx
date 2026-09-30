import React, { useState } from 'react';
import { PROJECTS_DATA } from '../../data/companyData';
import { ProjectItem } from '../../types';
import { ArrowUpRight, Code2, Layers, Cpu, ExternalLink } from 'lucide-react';

interface ProjectsSectionProps {
  onOpenCaseStudy: (project: ProjectItem) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onOpenCaseStudy }) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const filters = ['All', 'SaaS Development', 'AI Automation', 'AI Solutions', 'Digital Product'];

  const filteredProjects = activeFilter === 'All'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter((p) => p.category === activeFilter);

  return (
    <section id="work" className="relative py-28 border-t border-[#0FA4AF]/20 bg-[#003135]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <div className="text-xs font-mono text-[#0FA4AF] uppercase tracking-widest mb-3 font-bold">
              03 / ENGINEERING SHOWCASE
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display">
              Selected Work
            </h2>
            <p className="mt-4 text-base text-[#AFDDE5] leading-relaxed">
              Real architectural blueprints, production systems, and digital platforms engineered by Newta Tech.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="mt-6 md:mt-0 flex flex-wrap gap-1.5 p-1 bg-[#024045] rounded-xl border border-[#0FA4AF]/30">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-[#0FA4AF] text-white shadow-md font-bold'
                    : 'text-[#AFDDE5] hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* 2x2 High-Impact Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative rounded-2xl bg-[#024045]/90 border border-[#0FA4AF]/30 hover:border-[#AFDDE5] transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-[0_12px_36px_rgba(15,164,175,0.25)]"
            >
              {/* Image Frame with Aspect Ratio 16:9 & Measured Contrast Scrim */}
              <div className="relative aspect-video w-full overflow-hidden bg-[#003135]">
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Measured Scrim for legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#024045] via-[#024045]/40 to-transparent" />

                {/* Category Indicator Top Left */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-[#003135]/80 backdrop-blur-md border border-[#0FA4AF]/40 text-xs font-mono text-[#AFDDE5]">
                    {project.category}
                  </span>
                </div>

                {/* Architectural Metric Badges Bottom of Image */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white">
                  {project.metrics.map((m, idx) => (
                    <div key={idx} className="bg-[#003135]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#0FA4AF]/30">
                      <span className="text-[#AFDDE5]/80 text-[10px] block">{m.label}</span>
                      <span className="text-[#AFDDE5] font-bold">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Content Area */}
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#AFDDE5] transition-colors font-display">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[#AFDDE5] leading-relaxed mb-6 font-normal">
                    {project.shortDescription}
                  </p>
                </div>

                {/* Technologies and View Case Study */}
                <div className="pt-4 border-t border-[#0FA4AF]/20 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 3).map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono text-[#AFDDE5] bg-[#003135] px-2 py-0.5 rounded border border-[#0FA4AF]/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onOpenCaseStudy(project)}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#0FA4AF] to-[#024045] hover:from-[#14B8C4] hover:to-[#0FA4AF] border border-[#AFDDE5]/40 rounded-full transition-all duration-200 cursor-pointer group/btn shadow-md"
                  >
                    <span>Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Clear realism note */}
        <div className="mt-8 text-center">
          <p className="text-xs font-mono text-[#AFDDE5]/80">
            Case studies represent architectural implementations &amp; technical blueprints engineered by Newta Tech.
          </p>
        </div>

      </div>
    </section>
  );
};
