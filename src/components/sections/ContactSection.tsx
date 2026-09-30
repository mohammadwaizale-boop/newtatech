import React, { useState, useEffect } from 'react';
import { InquiryFormData } from '../../types';
import { Send, CheckCircle2, AlertCircle, Mail, MapPin, Sparkles, Settings2, Play, Check, X, Link2 } from 'lucide-react';
import { COMPANY_INFO } from '../../data/companyData';

interface ContactSectionProps {
  initialProjectType?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialProjectType = 'AI Solution' }) => {
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    company: '',
    projectType: initialProjectType,
    budgetRange: 'PKR 150,000 – 300,000',
    description: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof InquiryFormData, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [deliveryInfo, setDeliveryInfo] = useState<{ recipient: string; recipients?: string[]; messageId: string; timestamp: string; previewUrl?: string | null } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Diagnostic Test Email State
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; previewUrl?: string | null } | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configForm, setConfigForm] = useState({
    smtp_host: 'smtp.gmail.com',
    smtp_port: 587,
    smtp_user: 'mohammadwaizale@gmail.com',
    smtp_pass: '',
    company_email: 'mohammadwaizale@gmail.com, awanareeb450@gmail.com',
  });
  const [configSaveStatus, setConfigSaveStatus] = useState<string | null>(null);
  const [activeRecipients, setActiveRecipients] = useState<string[]>([
    'mohammadwaizale@gmail.com',
    'awanareeb450@gmail.com'
  ]);

  useEffect(() => {
    fetch('/api/smtp/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.recipients && Array.isArray(data.recipients)) {
            setActiveRecipients(data.recipients);
          }
          if (data.recipient) {
            setConfigForm((prev) => ({
              ...prev,
              company_email: data.recipient,
              smtp_user: data.smtp?.configuredUser || prev.smtp_user,
              smtp_host: data.smtp?.host || prev.smtp_host,
              smtp_port: data.smtp?.port || prev.smtp_port,
            }));
          }
        }
      })
      .catch((err) => console.error('Failed to load SMTP status:', err));
  }, []);

  const handleRunDiagnosticTest = async () => {
    setIsTestingEmail(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/smtp/test', { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Diagnostic test failed on mail server.');
      }
      setTestResult({
        success: true,
        message: `Accepted by mail server! Message ID: ${data.result?.messageId}`,
        previewUrl: data.result?.previewUrl || null,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Failed to dispatch test email.',
      });
    } finally {
      setIsTestingEmail(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfigSaveStatus('Validating and verifying SMTP handshake...');
    try {
      const res = await fetch('/api/smtp/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configForm),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to verify SMTP credentials.');
      }
      setConfigSaveStatus('✓ Verified! Production SMTP is now active.');
      setTimeout(() => {
        setShowConfigModal(false);
        setConfigSaveStatus(null);
      }, 1500);
    } catch (err: any) {
      setConfigSaveStatus(`Error: ${err.message}`);
    }
  };

  // Sync if initialProjectType changes from external action
  React.useEffect(() => {
    if (initialProjectType) {
      setFormData((prev) => ({ ...prev, projectType: initialProjectType }));
    }
  }, [initialProjectType]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof InquiryFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your full name.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.description.trim() || formData.description.trim().length < 10) {
      newErrors.description = 'Please describe your project (minimum 10 characters).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to dispatch inquiry to company inbox.');
      }

      setDeliveryInfo(data.deliveryDetails || null);
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Inquiry submission error:', err);
      setServerError(
        err?.message || 'A network error occurred while sending your inquiry. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectTypes = [
    'AI Solution',
    'Website',
    'SaaS Product',
    'AI Automation',
    'Custom Software',
    'Other'
  ];

  const budgetOptions = [
    'PKR 50,000 – 150,000',
    'PKR 150,000 – 300,000',
    'PKR 300,000 – 450,000',
    'PKR 450,000 – 600,000'
  ];

  return (
    <section id="contact" className="relative py-28 border-t border-[#0FA4AF]/20 bg-[#003135]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-mono text-[#0FA4AF] uppercase tracking-widest font-bold">
              07 / INITIATION &amp; SCOPING
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display">
              Start a Project
            </h2>

            <p className="text-base text-[#AFDDE5] leading-relaxed font-normal">
              Whether you are scoping an AI-powered SaaS, an intelligent automation pipeline, or a high-performance web platform, our engineering team is ready to evaluate your requirements.
            </p>

            <div className="pt-6 space-y-3 font-mono text-xs">
              {/* Linked Dual-Email Action: Email Both at once */}
              <a
                href={COMPANY_INFO.linkedMailto}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-[#024045] via-[#03484E] to-[#024045] border border-[#0FA4AF]/40 hover:border-[#AFDDE5] text-white transition-all group shadow-md"
                title="Email both engineers together (mohammadwaizale@gmail.com & awanareeb450@gmail.com)"
              >
                <div className="p-1.5 rounded-lg bg-[#003135] text-[#AFDDE5] flex-shrink-0">
                  <Link2 className="w-4 h-4 text-[#AFDDE5] group-hover:rotate-45 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wide">LINKED TEAM DISPATCH</span>
                    <span className="text-[10px] text-[#AFDDE5] bg-[#003135] px-1.5 py-0.5 rounded border border-[#0FA4AF]/40">Delivers to Both</span>
                  </div>
                  <div className="text-[11px] text-[#AFDDE5]/80 truncate font-mono mt-0.5">
                    mohammadwaizale@gmail.com + awanareeb450@gmail.com
                  </div>
                </div>
                <span className="text-[11px] text-[#AFDDE5] font-bold group-hover:translate-x-0.5 transition-transform flex-shrink-0">
                  Email Both ↗
                </span>
              </a>

              {/* Individual Direct Inboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <a
                  href={`mailto:${COMPANY_INFO.email}?cc=awanareeb450@gmail.com&subject=Project%20Inquiry%20%E2%80%94%20Newta%20Tech`}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-[#024045] border border-[#0FA4AF]/30 hover:border-[#AFDDE5] text-[#AFDDE5] hover:text-white transition-all group"
                  title="Direct to mohammadwaizale@gmail.com (CC: awanareeb450@gmail.com)"
                >
                  <Mail className="w-3.5 h-3.5 text-[#0FA4AF] group-hover:scale-110 transition-transform flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white truncate text-[11px]">{COMPANY_INFO.email}</div>
                    <div className="text-[9px] text-[#AFDDE5]">Waiz • Linked</div>
                  </div>
                </a>

                <a
                  href={`mailto:awanareeb450@gmail.com?cc=mohammadwaizale@gmail.com&subject=Project%20Inquiry%20%E2%80%94%20Newta%20Tech`}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-[#024045] border border-[#0FA4AF]/30 hover:border-[#AFDDE5] text-[#AFDDE5] hover:text-white transition-all group"
                  title="Direct to awanareeb450@gmail.com (CC: mohammadwaizale@gmail.com)"
                >
                  <Mail className="w-3.5 h-3.5 text-[#AFDDE5] group-hover:scale-110 transition-transform flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white truncate text-[11px]">awanareeb450@gmail.com</div>
                    <div className="text-[9px] text-[#AFDDE5]">Areeb • Linked</div>
                  </div>
                </a>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#024045] border border-[#0FA4AF]/30">
                <MapPin className="w-4 h-4 text-[#AFDDE5] flex-shrink-0" />
                <span className="text-white">{COMPANY_INFO.location} • Distributed Engineering</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#024045]/90 border border-[#0FA4AF]/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#AFDDE5]">
                <Sparkles className="w-4 h-4 text-[#0FA4AF]" />
                <span>Response SLA</span>
              </div>
              <p className="text-xs text-white/90 leading-relaxed font-sans">
                Every project inquiry is reviewed directly by a principal software architect. You will receive an initial feasibility review within 24 business hours.
              </p>
            </div>

            {/* Email Diagnostics & Live SMTP Test Tool */}
            <div className="p-4 rounded-2xl bg-[#024045] border border-[#0FA4AF]/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                  <Play className="w-3.5 h-3.5 text-[#AFDDE5]" />
                  <span>MAIL SERVER DIAGNOSTICS</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfigModal(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#AFDDE5] hover:text-white transition-colors cursor-pointer"
                  title="Configure SMTP Host and App Password"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  <span>SMTP Config</span>
                </button>
              </div>

              <p className="text-[11px] text-[#AFDDE5] font-sans leading-relaxed">
                Verify that your mail gateway actively transmits messages to <span className="text-white font-mono font-bold">mohammadwaizale@gmail.com</span> &amp; <span className="text-[#AFDDE5] font-mono font-bold">awanareeb450@gmail.com</span>:
              </p>

              <button
                type="button"
                onClick={handleRunDiagnosticTest}
                disabled={isTestingEmail}
                className="w-full py-2.5 px-3 rounded-xl bg-[#003135] hover:bg-[#003135]/80 border border-[#0FA4AF]/40 text-xs font-mono text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isTestingEmail ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-[#AFDDE5] border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting Test Email to Mail Server...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-[#0FA4AF] fill-current" />
                    <span>Send Real Test Email Now</span>
                  </>
                )}
              </button>

              {testResult && (
                <div className={`p-3 rounded-xl text-xs font-mono ${
                  testResult.success
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : 'bg-red-500/10 border border-red-500/30 text-red-300'
                }`}>
                  <div className="font-bold flex items-center gap-1.5">
                    {testResult.success ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                    <span>{testResult.success ? 'Server Acceptance Verified' : 'Transmission Rejected'}</span>
                  </div>
                  <div className="text-[11px] mt-1 break-words opacity-90">{testResult.message}</div>
                  {testResult.previewUrl && (
                    <div className="mt-2 pt-2 border-t border-white/[0.1]">
                      <a
                        href={testResult.previewUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-[#AFDDE5] hover:underline inline-flex items-center gap-1 font-sans text-xs font-bold"
                      >
                        <span>Inspect Delivered Message in SMTP Gateway ↗</span>
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-[#024045]/95 border border-[#0FA4AF]/40 p-7 sm:p-10 shadow-2xl relative">
              
              {isSubmitted ? (
                <div className="py-10 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-14 h-14 rounded-full bg-[#003135] border border-[#0FA4AF]/40 flex items-center justify-center mx-auto text-[#AFDDE5]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white font-display">
                    Inquiry Sent Successfully
                  </h3>
                  <p className="text-sm text-white/90 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="text-white font-bold">{formData.name}</span>. Your project brief has been transmitted via SMTP simultaneously to both linked engineering inboxes (<span className="text-[#AFDDE5] font-semibold">{deliveryInfo?.recipient || 'mohammadwaizale@gmail.com, awanareeb450@gmail.com'}</span>).
                  </p>

                  {deliveryInfo && (
                    <div className="max-w-md mx-auto p-4 rounded-xl bg-[#003135] border border-[#0FA4AF]/30 text-left font-mono text-[11px] text-white space-y-2">
                      <div className="flex justify-between items-center text-[#AFDDE5]">
                        <span>DELIVERY STATUS:</span>
                        <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">VERIFIED ON SERVER</span>
                      </div>
                      <div className="text-[#AFDDE5] space-y-1 pt-1 border-t border-[#0FA4AF]/20">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <Link2 className="w-3.5 h-3.5 text-[#0FA4AF]" />
                          <span>DISPATCHED TO BOTH INBOXES:</span>
                        </div>
                        <div className="pl-5 space-y-1">
                          <div className="text-white bg-[#024045] px-2 py-1 rounded border border-[#0FA4AF]/30 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0FA4AF]" />
                            <span>mohammadwaizale@gmail.com</span>
                          </div>
                          <div className="text-white bg-[#024045] px-2 py-1 rounded border border-[#0FA4AF]/30 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#AFDDE5]" />
                            <span>awanareeb450@gmail.com</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between text-[#AFDDE5] pt-1">
                        <span>REPLY-TO:</span>
                        <span className="text-white">{formData.email}</span>
                      </div>
                      {deliveryInfo.previewUrl && (
                        <div className="pt-2 border-t border-[#0FA4AF]/20 text-center">
                          <a
                            href={deliveryInfo.previewUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-1.5 text-xs text-[#AFDDE5] hover:text-white underline font-sans font-bold"
                          >
                            <span>View Dispatched Email in SMTP Inbox ↗</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-[#AFDDE5]">
                    A lead software architect will review your technical specifications and follow up within 24 business hours.
                  </p>

                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setDeliveryInfo(null);
                      setFormData({
                        name: '',
                        email: '',
                        company: '',
                        projectType: 'AI Solution',
                        budgetRange: 'PKR 150,000 – 300,000',
                        description: '',
                      });
                    }}
                    className="mt-4 px-6 py-2.5 text-xs font-bold text-white bg-[#0FA4AF] hover:bg-[#14B8C4] rounded-full transition-colors cursor-pointer shadow-md"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {serverError && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-red-200 mb-0.5">Transmission Error</div>
                        <div>{serverError}</div>
                        <div className="text-[11px] text-red-400/80 mt-1">Your entered form information has been preserved. Please try submitting again.</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono text-white mb-1.5 font-bold" htmlFor="inquiry-name">
                        Your Name *
                      </label>
                      <input
                        id="inquiry-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Mercer"
                        className={`w-full px-4 py-3 rounded-xl bg-[#003135] border text-sm text-white placeholder:text-[#AFDDE5]/40 focus:outline-none focus:ring-2 focus:ring-[#AFDDE5] transition-colors ${
                          errors.name ? 'border-red-500/80' : 'border-[#0FA4AF]/40'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-400 flex items-center gap-1 font-mono">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-white mb-1.5 font-bold" htmlFor="inquiry-email">
                        Work Email *
                      </label>
                      <input
                        id="inquiry-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@company.com"
                        className={`w-full px-4 py-3 rounded-xl bg-[#003135] border text-sm text-white placeholder:text-[#AFDDE5]/40 focus:outline-none focus:ring-2 focus:ring-[#AFDDE5] transition-colors ${
                          errors.email ? 'border-red-500/80' : 'border-[#0FA4AF]/40'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-400 flex items-center gap-1 font-mono">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-xs font-mono text-white mb-1.5 font-bold" htmlFor="inquiry-company">
                      Company / Organization (Optional)
                    </label>
                    <input
                      id="inquiry-company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Apex Dynamics Ltd"
                      className="w-full px-4 py-3 rounded-xl bg-[#003135] border border-[#0FA4AF]/40 text-sm text-white placeholder:text-[#AFDDE5]/40 focus:outline-none focus:ring-2 focus:ring-[#AFDDE5] transition-colors"
                    />
                  </div>

                  {/* Project Type & Budget Range */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono text-white mb-1.5 font-bold" htmlFor="inquiry-type">
                        Project Type
                      </label>
                      <select
                        id="inquiry-type"
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#003135] border border-[#0FA4AF]/40 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#AFDDE5] transition-colors"
                      >
                        {projectTypes.map((type) => (
                          <option key={type} value={type} className="bg-[#003135] text-white">
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-white mb-1.5 font-bold" htmlFor="inquiry-budget">
                        Anticipated Budget Range
                      </label>
                      <select
                        id="inquiry-budget"
                        value={formData.budgetRange}
                        onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#003135] border border-[#0FA4AF]/40 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#AFDDE5] transition-colors"
                      >
                        {budgetOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#003135] text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Project Description */}
                  <div>
                    <label className="block text-xs font-mono text-white mb-1.5 font-bold" htmlFor="inquiry-desc">
                      Project Requirements &amp; Goals *
                    </label>
                    <textarea
                      id="inquiry-desc"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Outline what you are looking to build, desired timeline, or key technical challenges..."
                      className={`w-full px-4 py-3 rounded-xl bg-[#003135] border text-sm text-white placeholder:text-[#AFDDE5]/40 focus:outline-none focus:ring-2 focus:ring-[#AFDDE5] transition-colors resize-none ${
                        errors.description ? 'border-red-500/80' : 'border-[#0FA4AF]/40'
                      }`}
                    />
                    {errors.description && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1 font-mono">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.description}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-[#0FA4AF] to-[#024045] hover:from-[#14B8C4] hover:to-[#0FA4AF] border border-[#AFDDE5]/40 active:scale-98 transition-all duration-200 rounded-full shadow-[0_4px_24px_rgba(15,164,175,0.45)] hover:shadow-[0_6px_32px_rgba(15,164,175,0.7)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AFDDE5] cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2 font-mono text-xs">
                        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        <span>DISPATCHING BRIEF...</span>
                      </span>
                    ) : (
                      <>
                        <span>Send Project Inquiry</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] font-mono text-[#AFDDE5]/70 text-center">
                    Protected by strict NDA standard • No promotional spam
                  </p>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* SMTP Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#024045] border border-[#0FA4AF]/40 p-7 sm:p-8 shadow-2xl">
            <button
              onClick={() => { setShowConfigModal(false); setConfigSaveStatus(null); }}
              className="absolute top-5 right-5 p-2 rounded-lg text-[#AFDDE5] hover:text-white hover:bg-white/[0.08] transition-colors"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-[#AFDDE5] mb-2 font-bold">
              <Settings2 className="w-4 h-4 text-[#0FA4AF]" />
              <span>PRODUCTION SMTP CREDENTIALS</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 font-display">
              Configure Production Mail Gateway
            </h3>

            <p className="text-xs text-[#AFDDE5] leading-relaxed mb-6 font-sans">
              Both partner accounts are permanently linked. Inquiries submitted via this site are automatically delivered to both <span className="text-white font-mono font-bold">mohammadwaizale@gmail.com</span> and <span className="text-white font-mono font-bold">awanareeb450@gmail.com</span>.
            </p>

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-white mb-1 font-bold">Linked Recipient Inboxes (Delivers to both)</label>
                <input
                  type="text"
                  value={configForm.company_email}
                  onChange={(e) => setConfigForm({ ...configForm, company_email: e.target.value })}
                  placeholder="mohammadwaizale@gmail.com, awanareeb450@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#003135] border border-[#0FA4AF]/40 text-white focus:outline-none focus:ring-1 focus:ring-[#AFDDE5]"
                />
                <p className="text-[10px] text-[#AFDDE5]/80 mt-1 font-sans">
                  Comma-separated list of company inboxes that will simultaneously receive incoming inquiries.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white mb-1 font-bold">SMTP Host</label>
                  <input
                    type="text"
                    value={configForm.smtp_host}
                    onChange={(e) => setConfigForm({ ...configForm, smtp_host: e.target.value })}
                    placeholder="smtp.gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#003135] border border-[#0FA4AF]/40 text-white focus:outline-none focus:ring-1 focus:ring-[#AFDDE5]"
                  />
                </div>
                <div>
                  <label className="block text-white mb-1 font-bold">SMTP Port</label>
                  <input
                    type="number"
                    value={configForm.smtp_port}
                    onChange={(e) => setConfigForm({ ...configForm, smtp_port: parseInt(e.target.value, 10) || 587 })}
                    placeholder="587"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#003135] border border-[#0FA4AF]/40 text-white focus:outline-none focus:ring-1 focus:ring-[#AFDDE5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-1 font-bold">SMTP Username / Email</label>
                <input
                  type="text"
                  value={configForm.smtp_user}
                  onChange={(e) => setConfigForm({ ...configForm, smtp_user: e.target.value })}
                  placeholder="mohammadwaizale@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#003135] border border-[#0FA4AF]/40 text-white focus:outline-none focus:ring-1 focus:ring-[#AFDDE5]"
                />
              </div>

              <div>
                <label className="block text-white mb-1 font-bold">
                  App Password / API Secret *
                </label>
                <input
                  type="password"
                  value={configForm.smtp_pass}
                  onChange={(e) => setConfigForm({ ...configForm, smtp_pass: e.target.value })}
                  placeholder="e.g. 16-character Google App Password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#003135] border border-[#0FA4AF]/40 text-white focus:outline-none focus:ring-1 focus:ring-[#AFDDE5]"
                />
                <p className="text-[10px] text-[#AFDDE5] mt-1 font-sans">
                  For Gmail: Generate a 16-character code at <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-white underline">myaccount.google.com/apppasswords</a>.
                </p>
              </div>

              {configSaveStatus && (
                <div className="p-3 rounded-xl bg-[#003135] border border-[#0FA4AF]/40 text-xs text-[#AFDDE5] font-sans">
                  {configSaveStatus}
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2 font-sans">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 text-xs text-[#AFDDE5] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#0FA4AF] to-[#024045] hover:from-[#14B8C4] hover:to-[#0FA4AF] border border-[#AFDDE5]/40 rounded-full transition-colors cursor-pointer shadow-md"
                >
                  Verify &amp; Save Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
