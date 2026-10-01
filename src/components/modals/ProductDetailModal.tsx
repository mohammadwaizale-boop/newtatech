import React, { useState, useEffect, useRef } from 'react';
import { ProductItem } from '../../types';
import {
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Activity,
  Layers,
  Code2,
  Terminal,
  Play,
  RotateCcw,
  Zap,
  ShieldCheck,
  Cpu,
  Server,
  Database,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Send,
  Loader2,
  MailCheck
} from 'lucide-react';

interface ProductDetailModalProps {
  product: ProductItem | null;
  initialTab?: 'demo' | 'specs' | 'waitlist';
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  initialTab = 'demo',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'demo' | 'specs' | 'waitlist'>(initialTab);

  // Sync tab if initialTab changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Waitlist form state
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Founder / Executive');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistError, setWaitlistError] = useState('');
  const [deliveryRef, setDeliveryRef] = useState<string | null>(null);
  const mountTime = useRef<number>(Date.now());

  // ----------------------------------------------------------------
  // Simulator State for NEWTA FLOW AI
  // ----------------------------------------------------------------
  const [flowPreset, setFlowPreset] = useState<'security' | 'support' | 'leads'>('security');
  const [flowRunning, setFlowRunning] = useState(false);
  const [flowStep, setFlowStep] = useState<number>(0); // 0: idle, 1: trigger, 2: router, 3: memory, 4: gate, 5: dispatch
  const [humanApproved, setHumanApproved] = useState(false);
  const [flowLogs, setFlowLogs] = useState<string[]>([]);

  // ----------------------------------------------------------------
  // Simulator State for NEWTA PULSE
  // ----------------------------------------------------------------
  const [selectedService, setSelectedService] = useState<'gateway' | 'database' | 'edge'>('gateway');
  const [isTrafficSpike, setIsTrafficSpike] = useState(false);
  const [pulseMetrics, setPulseMetrics] = useState({
    latency: 42,
    p99: 58,
    throughput: 1840,
    variance: '0.02%',
    status: 'Optimal',
  });

  // ----------------------------------------------------------------
  // Simulator State for NEWTA DEVKIT
  // ----------------------------------------------------------------
  const [devkitTab, setDevkitTab] = useState<'streaming' | 'components' | 'hooks'>('streaming');
  const [streamingActive, setStreamingActive] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [streamSpeed, setStreamSpeed] = useState(30);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // ----------------------------------------------------------------
  // Simulator State for NEWTA PORTFOLIO AI
  // ----------------------------------------------------------------
  const [portfolioRole, setPortfolioRole] = useState<'engineer' | 'ai' | 'designer'>('engineer');
  const [portfolioGenerating, setPortfolioGenerating] = useState(false);
  const [portfolioGenerated, setPortfolioGenerated] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  // ----------------------------------------------------------------
  // Flow AI runner
  // ----------------------------------------------------------------
  const runFlowSimulation = () => {
    setFlowRunning(true);
    setFlowStep(1);
    setHumanApproved(false);
    setFlowLogs([
      `[00:00.012] TRIGGER: Ingested event payload (ID: evt_${Math.random().toString(36).substring(7)})`,
    ]);

    setTimeout(() => {
      setFlowStep(2);
      setFlowLogs((prev) => [
        ...prev,
        `[00:00.048] ROUTER: Multi-model evaluation (Gemini 2.5 Flash allocated, 142 tokens)`,
      ]);
    }, 900);

    setTimeout(() => {
      setFlowStep(3);
      setFlowLogs((prev) => [
        ...prev,
        `[00:00.110] CONTEXT: Isolated vector memory verified. 0 cross-tenant bleed.`,
      ]);
    }, 1800);

    setTimeout(() => {
      setFlowStep(4);
      setFlowLogs((prev) => [
        ...prev,
        `[00:00.185] HUMAN GATE: Policy requires operator sign-off for automated deploy.`,
      ]);
    }, 2700);
  };

  const approveHumanGate = () => {
    setHumanApproved(true);
    setFlowStep(5);
    setFlowLogs((prev) => [
      ...prev,
      `[00:00.240] APPROVED: Operator verified signature. Executing zero-loss webhook.`,
      `[00:00.295] PIPELINE COMPLETED: 100% deterministic SLA achieved.`,
    ]);
    setTimeout(() => {
      setFlowRunning(false);
    }, 1200);
  };

  const resetFlowSimulation = () => {
    setFlowRunning(false);
    setFlowStep(0);
    setHumanApproved(false);
    setFlowLogs([]);
  };

  // ----------------------------------------------------------------
  // Pulse Telemetry simulation
  // ----------------------------------------------------------------
  const toggleTrafficSpike = () => {
    if (isTrafficSpike) {
      setIsTrafficSpike(false);
      setPulseMetrics({
        latency: 42,
        p99: 58,
        throughput: 1840,
        variance: '0.02%',
        status: 'Optimal',
      });
    } else {
      setIsTrafficSpike(true);
      setPulseMetrics({
        latency: 148,
        p99: 210,
        throughput: 5490,
        variance: '2.84%',
        status: 'Auto-Healing',
      });
    }
  };

  // ----------------------------------------------------------------
  // DevKit Stream simulation
  // ----------------------------------------------------------------
  const fullSampleStream = `import { useStreamingToken } from '@newta/devkit';

export function RealtimeAgent() {
  const { tokens, isStreaming, latencyBudget } = useStreamingToken({
    model: 'gemini-2.5-flash',
    backpressureLimit: 50,
  });

  return (
    <div className="agent-terminal p-4 rounded-xl bg-slate-950 font-mono">
      <div className="text-cyan-400">P95: {latencyBudget}ms</div>
      <p className="text-white">{tokens}</p>
    </div>
  );
}`;

  const triggerStreamSimulation = () => {
    if (streamingActive) return;
    setStreamingActive(true);
    setStreamedText('');
    let idx = 0;

    const interval = setInterval(() => {
      if (idx < fullSampleStream.length) {
        setStreamedText(fullSampleStream.substring(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
        setStreamingActive(false);
      }
    }, Math.max(5, streamSpeed));
  };

  const copyCodeToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // ----------------------------------------------------------------
  // Portfolio AI generation
  // ----------------------------------------------------------------
  const triggerPortfolioGeneration = () => {
    setPortfolioGenerating(true);
    setPortfolioGenerated(false);
    setTimeout(() => {
      setPortfolioGenerating(false);
      setPortfolioGenerated(true);
    }, 1200);
  };

  // ----------------------------------------------------------------
  // Waitlist Submit Handler
  // ----------------------------------------------------------------
  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setWaitlistError('Please provide a valid work email address.');
      return;
    }

    setWaitlistError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: cleanEmail,
          role,
          productId: product.id,
          productName: product.name,
          website_fax: honeypot,
          submission_elapsed_ms: Date.now() - mountTime.current,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit waitlist registration.');
      }

      setDeliveryRef(data.waitlistDetails?.referenceId || null);
      setWaitlistSubmitted(true);
    } catch (err: any) {
      console.error('Waitlist submission failed:', err);
      setWaitlistError(err?.message || 'A network error occurred. Please try again shortly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#024045] border border-[#0FA4AF]/50 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-6 sm:p-8 pb-4 border-b border-[#0FA4AF]/25 bg-gradient-to-r from-[#003135] via-[#024045] to-[#003135] relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-[#AFDDE5] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
            aria-label="Close Product View"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#003135] border border-[#0FA4AF]/40 text-[#AFDDE5] font-bold inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#AFDDE5] animate-pulse" />
              {product.status}
            </span>
            <span className="text-xs font-mono text-[#0FA4AF] uppercase tracking-wider font-bold">
              {product.category}
            </span>
            <span className="text-xs font-mono text-[#AFDDE5]/70">
              TARGET: {product.releaseWindow}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            {product.name}
          </h2>
          <p className="text-sm text-[#AFDDE5] font-medium mt-1">
            {product.tagline}
          </p>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 sm:gap-3 mt-6 border-b border-[#0FA4AF]/20 -mb-4 pb-0 text-xs font-mono">
            <button
              onClick={() => setActiveTab('demo')}
              className={`pb-3 px-3.5 font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'demo'
                  ? 'border-[#AFDDE5] text-white'
                  : 'border-transparent text-[#AFDDE5]/70 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#0FA4AF]" />
              <span>Interactive Engine &amp; Demo</span>
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 px-3.5 font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'specs'
                  ? 'border-[#AFDDE5] text-white'
                  : 'border-transparent text-[#AFDDE5]/70 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#0FA4AF]" />
              <span>Technical Specifications</span>
            </button>

            <button
              onClick={() => setActiveTab('waitlist')}
              className={`pb-3 px-3.5 font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'waitlist'
                  ? 'border-[#AFDDE5] text-white'
                  : 'border-transparent text-[#AFDDE5]/70 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0FA4AF]" />
              <span>Early Beta Access</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">

          {/* ---------------------------------------------------- */}
          {/* TAB 1: INTERACTIVE DEMO & ENGINE */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'demo' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* --- DEMO FOR NEWTA FLOW AI --- */}
              {product.id === 'newta-flow-ai' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#003135] border border-[#0FA4AF]/30">
                    <div>
                      <div className="text-xs font-mono text-[#0FA4AF] font-bold uppercase">
                        AGENTIC ORCHESTRATION PIPELINE
                      </div>
                      <div className="text-sm font-bold text-white mt-0.5">
                        Deterministic Workflow Graph Simulator
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={runFlowSimulation}
                        disabled={flowRunning}
                        className="px-4 py-2 text-xs font-bold font-mono text-white bg-gradient-to-r from-[#0FA4AF] to-[#024045] hover:from-[#14B8C4] hover:to-[#0FA4AF] border border-[#AFDDE5]/40 rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-md"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{flowRunning ? 'Executing Pipeline...' : 'Run Pipeline'}</span>
                      </button>
                      <button
                        onClick={resetFlowSimulation}
                        className="p-2 text-[#AFDDE5] hover:text-white bg-[#024045] rounded-xl border border-[#0FA4AF]/30 transition-colors"
                        title="Reset Graph"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Flow Nodes Canvas */}
                  <div className="p-6 rounded-2xl bg-[#002528] border border-[#0FA4AF]/40 relative overflow-hidden">
                    <div className="text-[11px] font-mono text-[#AFDDE5]/70 mb-4 flex items-center justify-between">
                      <span>LIVE CANVAS GRAPH</span>
                      <span className="text-emerald-400 font-bold">
                        {flowStep === 0 && 'STATUS: STANDBY'}
                        {flowStep === 1 && 'STATUS: INGESTING TRIGGER'}
                        {flowStep === 2 && 'STATUS: ROUTING LLM AGENT'}
                        {flowStep === 3 && 'STATUS: VECTOR MEMORY ISOLATION'}
                        {flowStep === 4 && 'STATUS: WAITING FOR HUMAN APPROVAL'}
                        {flowStep === 5 && 'STATUS: DEPLOYED // SUCCESS'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative z-10">
                      {/* Node 1: Trigger */}
                      <div className={`p-3.5 rounded-xl border transition-all text-xs font-mono ${
                        flowStep >= 1
                          ? 'bg-[#024045] border-[#AFDDE5] text-white shadow-[0_0_15px_rgba(15,164,175,0.4)]'
                          : 'bg-[#003135]/60 border-[#0FA4AF]/30 text-white/50'
                      }`}>
                        <div className="text-[10px] text-[#0FA4AF] font-bold">NODE 01</div>
                        <div className="font-bold text-white mt-1">Webhook Ingest</div>
                        <div className="text-[10px] text-[#AFDDE5]/80 mt-1">Event Hook</div>
                      </div>

                      {/* Node 2: Agent Router */}
                      <div className={`p-3.5 rounded-xl border transition-all text-xs font-mono ${
                        flowStep >= 2
                          ? 'bg-[#024045] border-[#AFDDE5] text-white shadow-[0_0_15px_rgba(15,164,175,0.4)]'
                          : 'bg-[#003135]/60 border-[#0FA4AF]/30 text-white/50'
                      }`}>
                        <div className="text-[10px] text-[#0FA4AF] font-bold">NODE 02</div>
                        <div className="font-bold text-white mt-1">LLM Router</div>
                        <div className="text-[10px] text-[#AFDDE5]/80 mt-1">Gemini 2.5 Flash</div>
                      </div>

                      {/* Node 3: Memory */}
                      <div className={`p-3.5 rounded-xl border transition-all text-xs font-mono ${
                        flowStep >= 3
                          ? 'bg-[#024045] border-[#AFDDE5] text-white shadow-[0_0_15px_rgba(15,164,175,0.4)]'
                          : 'bg-[#003135]/60 border-[#0FA4AF]/30 text-white/50'
                      }`}>
                        <div className="text-[10px] text-[#0FA4AF] font-bold">NODE 03</div>
                        <div className="font-bold text-white mt-1">Context Isolation</div>
                        <div className="text-[10px] text-[#AFDDE5]/80 mt-1">Zero Leak Enclave</div>
                      </div>

                      {/* Node 4: Human Gate */}
                      <div className={`p-3.5 rounded-xl border transition-all text-xs font-mono ${
                        flowStep === 4
                          ? 'bg-amber-500/20 border-amber-400 text-white animate-pulse shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                          : flowStep > 4
                            ? 'bg-[#024045] border-emerald-400 text-white'
                            : 'bg-[#003135]/60 border-[#0FA4AF]/30 text-white/50'
                      }`}>
                        <div className="text-[10px] text-amber-300 font-bold">NODE 04 (GATE)</div>
                        <div className="font-bold text-white mt-1">Human Sign-off</div>
                        <div className="text-[10px] text-[#AFDDE5]/80 mt-1">Required Gate</div>
                      </div>

                      {/* Node 5: Output */}
                      <div className={`p-3.5 rounded-xl border transition-all text-xs font-mono ${
                        flowStep >= 5
                          ? 'bg-[#024045] border-emerald-400 text-white shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                          : 'bg-[#003135]/60 border-[#0FA4AF]/30 text-white/50'
                      }`}>
                        <div className="text-[10px] text-emerald-400 font-bold">NODE 05</div>
                        <div className="font-bold text-white mt-1">Production Action</div>
                        <div className="text-[10px] text-[#AFDDE5]/80 mt-1">Audited Execution</div>
                      </div>
                    </div>

                    {/* Human Gate Intervention Panel */}
                    {flowStep === 4 && (
                      <div className="mt-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                        <div className="text-xs font-mono">
                          <div className="font-bold text-amber-300 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                            <span>HUMAN APPROVAL REQUIRED FOR DEPLOYMENT</span>
                          </div>
                          <p className="text-[11px] text-white/80 mt-0.5 font-sans">
                            Newta Flow AI enforces deterministic guardrails. Confirm execution to trigger production action.
                          </p>
                        </div>
                        <button
                          onClick={approveHumanGate}
                          className="px-5 py-2 text-xs font-bold font-mono text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 rounded-lg shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve &amp; Dispatch</span>
                        </button>
                      </div>
                    )}

                    {/* Terminal Stream Logs */}
                    <div className="mt-5 p-3.5 rounded-xl bg-[#001719] border border-[#0FA4AF]/20 font-mono text-[11px] text-[#AFDDE5] space-y-1 max-h-40 overflow-y-auto">
                      <div className="text-white/40 pb-1 border-b border-white/[0.05] text-[10px]">
                        $ newta-flow-engine --trace --deterministic
                      </div>
                      {flowLogs.length === 0 ? (
                        <div className="text-white/40 italic">Ready for execution. Click "Run Pipeline" above to test.</div>
                      ) : (
                        flowLogs.map((log, lIdx) => (
                          <div key={lIdx} className="leading-relaxed">
                            <span className="text-[#0FA4AF] font-bold">&gt;</span> {log}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* --- DEMO FOR NEWTA PULSE --- */}
              {product.id === 'newta-pulse' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#003135] border border-[#0FA4AF]/30">
                    <div>
                      <div className="text-xs font-mono text-[#0FA4AF] font-bold uppercase">
                        REAL-TIME CLOUD TELEMETRY RADAR
                      </div>
                      <div className="text-sm font-bold text-white mt-0.5">
                        Predictive Anomaly &amp; Sub-millisecond Tracing
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleTrafficSpike}
                        className={`px-4 py-2 text-xs font-bold font-mono rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-md ${
                          isTrafficSpike
                            ? 'bg-amber-500 text-black font-extrabold hover:bg-amber-400'
                            : 'bg-gradient-to-r from-[#0FA4AF] to-[#024045] hover:from-[#14B8C4] hover:to-[#0FA4AF] text-white border border-[#AFDDE5]/40'
                        }`}
                      >
                        <Activity className="w-3.5 h-3.5" />
                        <span>{isTrafficSpike ? 'Stabilize Baseline' : 'Simulate 3x Load Spike'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Telemetry Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                    <div className="p-3.5 rounded-xl bg-[#003135] border border-[#0FA4AF]/30">
                      <div className="text-[10px] text-[#AFDDE5]/70">P95 LATENCY</div>
                      <div className={`text-xl font-bold mt-1 ${isTrafficSpike ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {pulseMetrics.latency} ms
                      </div>
                      <div className="text-[10px] text-[#AFDDE5]/60 mt-0.5">SLA Target: &lt; 50ms</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#003135] border border-[#0FA4AF]/30">
                      <div className="text-[10px] text-[#AFDDE5]/70">THROUGHPUT</div>
                      <div className="text-xl font-bold text-white mt-1">
                        {pulseMetrics.throughput} <span className="text-xs font-normal text-[#AFDDE5]">req/s</span>
                      </div>
                      <div className="text-[10px] text-[#AFDDE5]/60 mt-0.5">Global Ingress</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#003135] border border-[#0FA4AF]/30">
                      <div className="text-[10px] text-[#AFDDE5]/70">VARIANCE RADAR</div>
                      <div className="text-xl font-bold text-[#AFDDE5] mt-1">
                        {pulseMetrics.variance}
                      </div>
                      <div className="text-[10px] text-[#AFDDE5]/60 mt-0.5">Heuristic Anomaly Index</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#003135] border border-[#0FA4AF]/30">
                      <div className="text-[10px] text-[#AFDDE5]/70">STATUS</div>
                      <div className={`text-xl font-bold mt-1 ${isTrafficSpike ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {pulseMetrics.status}
                      </div>
                      <div className="text-[10px] text-[#AFDDE5]/60 mt-0.5">Predictive Guard</div>
                    </div>
                  </div>

                  {/* Interactive Oscilloscope Visualization */}
                  <div className="p-5 rounded-2xl bg-[#002528] border border-[#0FA4AF]/40">
                    <div className="flex items-center justify-between text-xs font-mono mb-3">
                      <span className="text-white font-bold">ROUTE: api.newta.tech/v1/inferences</span>
                      <span className="text-[#0FA4AF]">500ms Sliding Window</span>
                    </div>

                    {/* Animated SVG Graph */}
                    <div className="h-32 w-full bg-[#001719] rounded-xl border border-[#0FA4AF]/20 relative overflow-hidden flex items-end px-2 pt-2">
                      <svg className="w-full h-full" viewBox="0 0 500 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="pulseGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0FA4AF" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#0FA4AF" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {isTrafficSpike ? (
                          <path
                            d="M0,70 Q50,65 100,75 T200,68 T280,20 T340,30 T400,25 T500,45 L500,100 L0,100 Z"
                            fill="url(#pulseGlow)"
                            className="transition-all duration-500"
                          />
                        ) : (
                          <path
                            d="M0,75 Q60,70 120,78 T240,72 T360,75 T500,70 L500,100 L0,100 Z"
                            fill="url(#pulseGlow)"
                            className="transition-all duration-500"
                          />
                        )}
                        <path
                          d={
                            isTrafficSpike
                              ? "M0,70 Q50,65 100,75 T200,68 T280,20 T340,30 T400,25 T500,45"
                              : "M0,75 Q60,70 120,78 T240,72 T360,75 T500,70"
                          }
                          fill="none"
                          stroke={isTrafficSpike ? "#F59E0B" : "#0FA4AF"}
                          strokeWidth="2.5"
                          className="transition-all duration-500"
                        />
                      </svg>
                      
                      {/* Grid overlay lines */}
                      <div className="absolute inset-0 grid grid-rows-3 pointer-events-none opacity-20">
                        <div className="border-b border-white" />
                        <div className="border-b border-white" />
                        <div className="border-b border-white" />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#AFDDE5]/80">
                      <span>Collector: Sub-millisecond Micro-Agent</span>
                      <span>Zero Overhead (0.04% CPU)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* --- DEMO FOR NEWTA DEVKIT --- */}
              {product.id === 'newta-devkit' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#003135] border border-[#0FA4AF]/30">
                    <div>
                      <div className="text-xs font-mono text-[#0FA4AF] font-bold uppercase">
                        AI-NATIVE DEVELOPER PLAYGROUND
                      </div>
                      <div className="text-sm font-bold text-white mt-0.5">
                        Streaming Token Parser &amp; TypeScript Primitives
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={triggerStreamSimulation}
                        disabled={streamingActive}
                        className="px-4 py-2 text-xs font-bold font-mono text-white bg-gradient-to-r from-[#0FA4AF] to-[#024045] hover:from-[#14B8C4] hover:to-[#0FA4AF] border border-[#AFDDE5]/40 rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-md"
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        <span>{streamingActive ? 'Streaming...' : 'Simulate Token Stream'}</span>
                      </button>
                    </div>
                  </div>

                  {/* DevKit Tabs */}
                  <div className="flex items-center gap-2 border-b border-[#0FA4AF]/20 pb-2 text-xs font-mono">
                    <button
                      onClick={() => setDevkitTab('streaming')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        devkitTab === 'streaming'
                          ? 'bg-[#0FA4AF] text-white font-bold'
                          : 'bg-[#003135] text-[#AFDDE5] hover:text-white'
                      }`}
                    >
                      Token Stream Parser
                    </button>
                    <button
                      onClick={() => setDevkitTab('hooks')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        devkitTab === 'hooks'
                          ? 'bg-[#0FA4AF] text-white font-bold'
                          : 'bg-[#003135] text-[#AFDDE5] hover:text-white'
                      }`}
                    >
                      Production Hooks
                    </button>
                    <button
                      onClick={() => setDevkitTab('components')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        devkitTab === 'components'
                          ? 'bg-[#0FA4AF] text-white font-bold'
                          : 'bg-[#003135] text-[#AFDDE5] hover:text-white'
                      }`}
                    >
                      Accessible UI Kit
                    </button>
                  </div>

                  {/* Streaming Code Viewer */}
                  {devkitTab === 'streaming' && (
                    <div className="rounded-2xl bg-[#001719] border border-[#0FA4AF]/35 p-5 font-mono text-xs relative">
                      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] text-[11px] text-[#AFDDE5]">
                        <span className="text-white font-bold">src/hooks/useStreamingAgent.ts</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[#0FA4AF]">Latency Budget: 32ms</span>
                          <button
                            onClick={() => copyCodeToClipboard(fullSampleStream, 'streaming')}
                            className="inline-flex items-center gap-1 text-[#AFDDE5] hover:text-white transition-colors"
                          >
                            {copiedCode === 'streaming' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedCode === 'streaming' ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      <pre className="mt-4 text-white/90 overflow-x-auto leading-relaxed max-h-56">
                        <code>{streamedText || fullSampleStream}</code>
                        {streamingActive && <span className="inline-block w-2 h-4 bg-[#0FA4AF] ml-1 animate-pulse" />}
                      </pre>
                    </div>
                  )}

                  {/* Hooks Tab */}
                  {devkitTab === 'hooks' && (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="p-4 rounded-xl bg-[#003135] border border-[#0FA4AF]/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">useAgentDispatch(options)</span>
                          <span className="text-[10px] text-emerald-400">Zero-allocation buffer</span>
                        </div>
                        <p className="text-[11px] text-[#AFDDE5] font-sans">
                          Dispatches state machine instructions to edge LLMs with automatic retry, timeout hedging, and deterministic fallbacks.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-[#003135] border border-[#0FA4AF]/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">useTokenBudgetGuard(limit)</span>
                          <span className="text-[10px] text-[#AFDDE5]">Client-side cost ceiling</span>
                        </div>
                        <p className="text-[11px] text-[#AFDDE5] font-sans">
                          Enforces hard client and server token budgets before issuing inferences, eliminating unexpected runaway API billing.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Components Tab */}
                  {devkitTab === 'components' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-4 rounded-xl bg-[#003135] border border-[#0FA4AF]/30 space-y-2">
                        <div className="text-[10px] text-[#0FA4AF] font-bold">COMPONENT 01</div>
                        <div className="font-bold text-white">&lt;StreamTerminal /&gt;</div>
                        <p className="text-[11px] text-[#AFDDE5] font-sans">
                          Accessible ARIA live region terminal for real-time model outputs with auto-scroll lock.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-[#003135] border border-[#0FA4AF]/30 space-y-2">
                        <div className="text-[10px] text-[#0FA4AF] font-bold">COMPONENT 02</div>
                        <div className="font-bold text-white">&lt;HumanApprovalGate /&gt;</div>
                        <p className="text-[11px] text-[#AFDDE5] font-sans">
                          Modal dialog component enforcing physical confirmation before triggering high-risk API mutations.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* --- DEMO FOR NEWTA PORTFOLIO AI --- */}
              {product.id === 'newta-portfolio-ai' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#003135] border border-[#0FA4AF]/30">
                    <div>
                      <div className="text-xs font-mono text-[#0FA4AF] font-bold uppercase">
                        AUTONOMOUS PORTFOLIO SYNTHESIZER
                      </div>
                      <div className="text-sm font-bold text-white mt-0.5">
                        Interactive Case Study &amp; Code Sandbox Builder
                      </div>
                    </div>
                    <button
                      onClick={triggerPortfolioGeneration}
                      disabled={portfolioGenerating}
                      className="px-4 py-2 text-xs font-bold font-mono text-white bg-gradient-to-r from-[#0FA4AF] to-[#024045] hover:from-[#14B8C4] hover:to-[#0FA4AF] border border-[#AFDDE5]/40 rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#AFDDE5]" />
                      <span>{portfolioGenerating ? 'Synthesizing...' : 'Synthesize Case Study'}</span>
                    </button>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#002528] border border-[#0FA4AF]/40">
                    {portfolioGenerating ? (
                      <div className="py-12 text-center space-y-3 font-mono text-xs">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0FA4AF]" />
                        <div className="text-white font-bold">Analyzing Code Repositories &amp; Architecture Specs...</div>
                        <div className="text-[#AFDDE5]">Generating deterministic edge deployment blueprint</div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-[#0FA4AF]/20 pb-3 text-xs font-mono">
                          <span className="text-white font-bold">CASE SPEC: Distributed Consensus Engine</span>
                          <span className="text-emerald-400 font-bold">100/100 Core Web Vitals</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                          <div className="p-3 rounded-lg bg-[#003135] border border-[#0FA4AF]/30">
                            <div className="text-[10px] text-[#AFDDE5]">METRIC</div>
                            <div className="text-base font-bold text-white mt-0.5">&lt; 12ms Edge TTFB</div>
                          </div>
                          <div className="p-3 rounded-lg bg-[#003135] border border-[#0FA4AF]/30">
                            <div className="text-[10px] text-[#AFDDE5]">STACK</div>
                            <div className="text-base font-bold text-white mt-0.5">React 19 + TypeScript</div>
                          </div>
                          <div className="p-3 rounded-lg bg-[#003135] border border-[#0FA4AF]/30">
                            <div className="text-[10px] text-[#AFDDE5]">DEPLOY</div>
                            <div className="text-base font-bold text-[#0FA4AF] mt-0.5">Edge CDN Global</div>
                          </div>
                        </div>
                        <p className="text-xs text-[#AFDDE5] leading-relaxed font-sans pt-1">
                          Autonomous storyboarding dynamically synthesized 4 repository commits and generated interactive sandbox previews without manual copywriting.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bottom Quick Action: Switch to Waitlist */}
              <div className="p-4 rounded-2xl bg-[#003135] border border-[#0FA4AF]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-[#AFDDE5]">
                  Ready to test <strong className="text-white">{product.name}</strong> on real engineering workloads?
                </div>
                <button
                  onClick={() => setActiveTab('waitlist')}
                  className="px-5 py-2.5 text-xs font-bold font-mono text-white bg-gradient-to-r from-[#0FA4AF] to-[#024045] hover:from-[#14B8C4] hover:to-[#0FA4AF] border border-[#AFDDE5]/40 rounded-full transition-all cursor-pointer shadow-md flex items-center gap-1.5 flex-shrink-0"
                >
                  <span>Request Private Access</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 2: TECHNICAL SPECIFICATIONS */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'specs' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h4 className="text-base font-bold text-white font-display mb-2">
                  System Architecture &amp; Capabilities
                </h4>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
                  {product.description}
                </p>
              </div>

              {/* Core Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#003135] border border-[#0FA4AF]/30 flex items-start gap-2.5 text-xs text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#0FA4AF] flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Architectural Guarantees */}
              <div className="p-5 rounded-2xl bg-[#002528] border border-[#0FA4AF]/40 space-y-3 font-mono text-xs">
                <div className="text-[#AFDDE5] font-bold uppercase text-[11px]">
                  NEWTA ENGINEERING GUARANTEES
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-[#003135] border border-[#0FA4AF]/20">
                    <div className="text-white font-bold">Zero Lock-In</div>
                    <div className="text-[11px] text-[#AFDDE5]/80 mt-1">Export pristine TypeScript, React, and Docker assets at any time.</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#003135] border border-[#0FA4AF]/20">
                    <div className="text-white font-bold">Deterministic SLA</div>
                    <div className="text-[11px] text-[#AFDDE5]/80 mt-1">Strict token budgeting and sub-50ms latency tolerances.</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#003135] border border-[#0FA4AF]/20">
                    <div className="text-white font-bold">Context Isolation</div>
                    <div className="text-[11px] text-[#AFDDE5]/80 mt-1">Customer memory enclaves are cryptographically partitioned.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 3: EARLY BETA ACCESS WAITLIST FORM */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'waitlist' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {waitlistSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#003135] border border-[#0FA4AF]/40 flex items-center justify-center mx-auto text-[#AFDDE5]">
                    <CheckCircle2 className="w-8 h-8 text-[#0FA4AF]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white font-display">
                    You’re On the Waitlist!
                  </h3>
                  <p className="text-sm text-white/90 max-w-md mx-auto leading-relaxed">
                    We’ve reserved early beta access for <span className="text-[#AFDDE5] font-mono font-bold">{email}</span> for <span className="text-white font-bold">{product.name}</span>. You will receive release milestones directly.
                  </p>
                  <div className="max-w-sm mx-auto p-3.5 rounded-xl bg-[#003135] border border-[#0FA4AF]/30 text-left font-mono text-xs space-y-1.5 text-[#AFDDE5]">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <MailCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>CONFIRMATION EMAIL DISPATCHED</span>
                    </div>
                    <p className="text-[11px] text-white/80 font-sans leading-normal pt-1">
                      A confirmation message was routed to <strong className="text-white">{email}</strong> and logged with our team (<span className="text-[#AFDDE5]">mohammadwaizale@gmail.com</span> &amp; <span className="text-[#AFDDE5]">awanareeb450@gmail.com</span>).
                    </p>
                    {deliveryRef && (
                      <div className="text-[10px] text-[#AFDDE5]/60 pt-1 font-mono">
                        REF: {deliveryRef}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-3 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#0FA4AF] to-[#024045] hover:from-[#14B8C4] hover:to-[#0FA4AF] border border-[#AFDDE5]/40 rounded-full transition-colors cursor-pointer shadow-md"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} className="space-y-4 max-w-lg mx-auto" noValidate>
                  {/* Invisible Honeypot */}
                  <div style={{ position: 'absolute', opacity: 0, zIndex: -1, pointerEvents: 'none', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
                    <label htmlFor="modal-waitlist-website-fax">Leave this field blank</label>
                    <input
                      id="modal-waitlist-website-fax"
                      type="text"
                      name="website_fax"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-bold text-white font-display">
                      Reserve Beta Token for {product.name}
                    </h3>
                    <p className="text-xs text-[#AFDDE5]">
                      Be among the first to test early developer builds and receive founding member perks.
                    </p>
                  </div>

                  {waitlistError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                      {waitlistError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-mono text-white mb-1.5 font-bold" htmlFor="modal-waitlist-email">
                      Work Email Address *
                    </label>
                    <input
                      id="modal-waitlist-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@company.com"
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-xl bg-[#003135] border border-[#0FA4AF]/40 text-sm text-white placeholder:text-[#AFDDE5]/40 focus:outline-none focus:ring-2 focus:ring-[#AFDDE5]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-white mb-1.5 font-bold" htmlFor="modal-waitlist-role">
                      Your Primary Focus
                    </label>
                    <select
                      id="modal-waitlist-role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-xl bg-[#003135] border border-[#0FA4AF]/40 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#AFDDE5]"
                    >
                      <option value="Founder / Executive" className="bg-[#003135]">Founder / Executive</option>
                      <option value="Software Engineer" className="bg-[#003135]">Software Engineer</option>
                      <option value="Product Designer" className="bg-[#003135]">Product Designer</option>
                      <option value="Agency Owner" className="bg-[#003135]">Agency Owner</option>
                      <option value="Other" className="bg-[#003135]">Other</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 text-xs font-bold text-white bg-gradient-to-r from-[#0FA4AF] to-[#024045] hover:from-[#14B8C4] hover:to-[#0FA4AF] border border-[#AFDDE5]/40 rounded-full shadow-lg shadow-[#0FA4AF]/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#AFDDE5]" />
                          <span>Reserving Beta Spot...</span>
                        </>
                      ) : (
                        <>
                          <span>Request Early Access</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-[#AFDDE5]/70 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0FA4AF]" />
                    <span>Zero spam • Dual-inbox notification active</span>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
