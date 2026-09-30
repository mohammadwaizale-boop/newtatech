import React, { useState } from 'react';
import { TECH_ECOSYSTEM } from '../../data/companyData';
import { TechItem } from '../../types';
import { Code2, Database, Cpu, Cloud, Check } from 'lucide-react';

export const TechStackSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', 'Frontend', 'Backend & Data', 'AI & Machine Intelligence', 'Cloud & Infra'];

  const filteredTech = selectedCategory === 'All'
    ? TECH_ECOSYSTEM
    : TECH_ECOSYSTEM.filter((t) => t.category === selectedCategory);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Frontend': return <Code2 className="w-3.5 h-3.5 text-[#AFDDE5]" />;
      case 'Backend & Data': return <Database className="w-3.5 h-3.5 text-[#0FA4AF]" />;
      case 'AI & Machine Intelligence': return <Cpu className="w-3.5 h-3.5 text-[#AFDDE5]" />;
      case 'Cloud & Infra': return <Cloud className="w-3.5 h-3.5 text-[#0FA4AF]" />;
      default: return <Code2 className="w-3.5 h-3.5 text-[#0FA4AF]" />;
    }
  };

  return (
    <section className="relative py-28 border-t border-[#0FA4AF]/20 bg-[#003135]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Lead */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <div className="text-xs font-mono text-[#0FA4AF] uppercase tracking-widest mb-3 font-bold">
              06 / TECHNOLOGY ECOSYSTEM
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display">
              Built With Modern Technology
            </h2>
            <p className="mt-4 text-base text-[#AFDDE5] leading-relaxed">
              We leverage modern, battle-tested tools to build fast, scalable, and resilient systems.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="mt-6 md:mt-0 flex flex-wrap gap-1.5 p-1 bg-[#024045] rounded-xl border border-[#0FA4AF]/30">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0FA4AF] text-white shadow-md font-bold'
                    : 'text-[#AFDDE5] hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTech.map((tech, idx) => (
            <div
              key={idx}
              className="group p-4 rounded-xl bg-[#024045]/90 border border-[#0FA4AF]/30 hover:border-[#AFDDE5] transition-all duration-200 hover:-translate-y-0.5 space-y-2 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white group-hover:text-[#AFDDE5] transition-colors font-display">
                  {tech.name}
                </span>
                {getCategoryIcon(tech.category)}
              </div>
              <p className="text-xs text-[#AFDDE5] font-normal leading-relaxed">
                {tech.role}
              </p>
            </div>
          ))}
        </div>

        {/* Note on technologies */}
        <div className="mt-10 p-4 rounded-xl bg-[#024045] border border-[#0FA4AF]/30 flex items-center justify-between text-xs text-[#AFDDE5]">
          <span className="font-mono text-white">
            Stack adaptability: We tailor frameworks to client constraints and latency requirements.
          </span>
          <span className="text-[#0FA4AF] font-mono hidden sm:inline font-bold">
            Zero bloat guaranteed
          </span>
        </div>

      </div>
    </section>
  );
};
