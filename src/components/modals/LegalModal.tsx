import React from 'react';
import { X, Shield } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const isPrivacy = type === 'privacy';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#024045] border border-[#0FA4AF]/40 p-7 sm:p-9 shadow-2xl max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-[#AFDDE5] hover:text-white hover:bg-white/[0.08] transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-xs font-mono text-[#AFDDE5] mb-3 font-bold">
          <Shield className="w-4 h-4 text-[#0FA4AF]" />
          <span>LEGAL COMPLIANCE // 2026 STANDARD</span>
        </div>

        <h3 className="text-2xl font-bold text-white mb-6 font-display">
          {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
        </h3>

        <div className="space-y-4 text-xs sm:text-sm text-[#AFDDE5] leading-relaxed font-sans">
          {isPrivacy ? (
            <>
              <p>
                At <strong className="text-white">Newta Tech</strong>, we take the confidentiality of your intellectual property, proprietary software requirements, and project inquiries with the utmost seriousness.
              </p>
              <h4 className="text-white font-bold pt-2">1. Information Collection &amp; Scope</h4>
              <p>
                We only collect information voluntarily submitted through our project inquiry forms and product waitlists (such as your name, corporate email address, and project brief). We do not sell, rent, or lease this data to any third party.
              </p>
              <h4 className="text-white font-bold pt-2">2. Non-Disclosure &amp; Security</h4>
              <p>
                All technical briefs and architectural discussions are treated as strictly confidential under standard bilateral non-disclosure protocols. We implement industry-standard encryption in transit and at rest.
              </p>
              <h4 className="text-white font-bold pt-2">3. Cookies &amp; Telemetry</h4>
              <p>
                Our web applications utilize essential session tokens and minimal anonymized performance metrics strictly to ensure latency budgets, prevent DDoS abuses, and maintain high service availability.
              </p>
            </>
          ) : (
            <>
              <p>
                Welcome to <strong className="text-white">Newta Tech</strong>. By accessing this website or engaging our software engineering services, you agree to these transparent terms.
              </p>
              <h4 className="text-white font-bold pt-2">1. Intellectual Property &amp; Code Ownership</h4>
              <p>
                Unless explicitly agreed otherwise in a tailored Statement of Work (SOW), clients retain full, unencumbered ownership of all custom software, bespoke codebases, database schemas, and digital assets engineered specifically for them upon completion of contractual milestones.
              </p>
              <h4 className="text-white font-bold pt-2">2. Architectural Warranties</h4>
              <p>
                We construct software using modern best practices, strict type contracts, and automated testing suites. While we guarantee adherence to agreed technical specifications, software is provided subject to mutual acceptance testing criteria.
              </p>
              <h4 className="text-white font-bold pt-2">3. Limitation of Liability</h4>
              <p>
                In no event shall Newta Tech be liable for indirect, incidental, or consequential damages resulting from third-party cloud infrastructure outages, API changes by external vendors, or external upstream interruptions.
              </p>
            </>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-[#0FA4AF]/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#0FA4AF] to-[#024045] hover:from-[#14B8C4] hover:to-[#0FA4AF] border border-[#AFDDE5]/40 rounded-full transition-colors cursor-pointer shadow-md"
          >
            Acknowledge &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
