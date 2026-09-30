import React, { useState } from 'react';
import { ProductItem } from '../../types';
import { X, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface WaitlistModalProps {
  product: ProductItem | null;
  onClose: () => void;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({ product, onClose }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Founder / Executive');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please provide a valid work email.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#024045] border border-[#0FA4AF]/40 p-7 sm:p-9 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-[#AFDDE5] hover:text-white hover:bg-white/[0.08] transition-colors"
          aria-label="Close Waitlist Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#003135] border border-[#0FA4AF]/40 flex items-center justify-center mx-auto text-[#AFDDE5]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white font-display">
              You’re On the Waitlist!
            </h3>
            <p className="text-sm text-white/90 max-w-sm mx-auto leading-relaxed">
              We’ve reserved early beta access for <span className="text-[#AFDDE5] font-mono font-bold">{email}</span> for <span className="text-white font-bold">{product.name}</span>. You will receive release milestones directly.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#0FA4AF] to-[#024045] hover:from-[#14B8C4] hover:to-[#0FA4AF] border border-[#AFDDE5]/40 rounded-full transition-colors cursor-pointer shadow-md"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-2 text-xs font-mono text-[#AFDDE5] font-bold">
              <Sparkles className="w-4 h-4 text-[#0FA4AF]" />
              <span>PRIVATE ACCESS // {product.status.toUpperCase()}</span>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight font-display">
                Join {product.name} Waitlist
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-[#AFDDE5] leading-relaxed font-normal">
                {product.tagline} Be among the first to test early developer builds and receive founding member perks.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-mono text-white mb-1.5 font-bold" htmlFor="waitlist-email">
                  Work Email Address *
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#003135] border border-[#0FA4AF]/40 text-sm text-white placeholder:text-[#AFDDE5]/40 focus:outline-none focus:ring-2 focus:ring-[#AFDDE5]"
                />
                {error && <p className="mt-1 text-xs text-red-400 font-mono">{error}</p>}
              </div>

              <div>
                <label className="block text-xs font-mono text-white mb-1.5 font-bold" htmlFor="waitlist-role">
                  Your Primary Focus
                </label>
                <select
                  id="waitlist-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#003135] border border-[#0FA4AF]/40 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#AFDDE5]"
                >
                  <option value="Founder / Executive" className="bg-[#003135]">Founder / Executive</option>
                  <option value="Software Engineer" className="bg-[#003135]">Software Engineer</option>
                  <option value="Product Designer" className="bg-[#003135]">Product Designer</option>
                  <option value="Agency Owner" className="bg-[#003135]">Agency Owner</option>
                  <option value="Other" className="bg-[#003135]">Other</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 text-xs font-bold text-white bg-gradient-to-r from-[#0FA4AF] to-[#024045] hover:from-[#14B8C4] hover:to-[#0FA4AF] border border-[#AFDDE5]/40 rounded-full shadow-lg shadow-[#0FA4AF]/30 transition-all cursor-pointer"
              >
                <span>Request Early Access</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-[#AFDDE5]/70">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0FA4AF]" />
              <span>Zero spam • Unsubscribe with 1 click</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
