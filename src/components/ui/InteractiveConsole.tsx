import React, { useState } from 'react';
import { Terminal, Play, RotateCcw, CheckCircle2, Cpu, Shield, ArrowRight } from 'lucide-react';

export const InteractiveConsole: React.FC = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<'agent' | 'rag' | 'saas'>('agent');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([
    'System ready. Select a workload pipeline and initiate execution test.'
  ]);
  const [metrics, setMetrics] = useState<{ latency: string; tokens: number; status: string }>({
    latency: '0ms',
    tokens: 0,
    status: 'IDLE'
  });

  const workflows = {
    agent: {
      name: 'Agentic Workflow Router',
      desc: 'Autonomous multi-step pipeline with tool calling & error fallback',
      steps: [
        '[0.01s] Validating input against strict TypeScript schema...',
        '[0.03s] Dispatching intent classification to Gemini 2.5 Flash model...',
        '[0.08s] Executed tool call: queryEnterpriseDatabase(tenant_id: "nx_948")',
        '[0.12s] Guardrail evaluation passed. Output generated with 0% hallucinations.'
      ],
      latency: '118ms',
      tokens: 342
    },
    rag: {
      name: 'Semantic RAG Synthesizer',
      desc: 'Vector retrieval with hybrid keyword re-ranking and streaming chunks',
      steps: [
        '[0.01s] Embedding query text via text-embedding-004...',
        '[0.02s] Vector distance cosine search across 85,000 document nodes...',
        '[0.05s] Re-ranking top 5 relevant context documents with Cross-Encoder...',
        '[0.09s] Streaming synthesized response with verified citation anchors.'
      ],
      latency: '94ms',
      tokens: 618
    },
    saas: {
      name: 'High-Concurrency Event Worker',
      desc: 'Tenant telemetry batching with Redis queue and PostgreSQL partitioning',
      steps: [
        '[0.01s] Ingested 1,200 audit events from edge gateway...',
        '[0.02s] Validating tenant RLS keys & cryptographic signatures...',
        '[0.04s] Bulk upsert into partitioned PostgreSQL table...',
        '[0.06s] Emitted Webhook event to subscribed client endpoints.'
      ],
      latency: '62ms',
      tokens: 120
    }
  };

  const handleRun = () => {
    setIsRunning(true);
    setLogs(['[0.00s] Initializing execution harness...']);
    setMetrics({ latency: 'Running...', tokens: 0, status: 'PROCESSING' });

    const activeWorkflow = workflows[selectedWorkflow];
    activeWorkflow.steps.forEach((step, idx) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, step]);
        if (idx === activeWorkflow.steps.length - 1) {
          setIsRunning(false);
          setMetrics({
            latency: activeWorkflow.latency,
            tokens: activeWorkflow.tokens,
            status: 'COMPLETED'
          });
        }
      }, (idx + 1) * 280);
    });
  };

  const handleReset = () => {
    setIsRunning(false);
    setLogs(['System reset. Ready for next simulation.']);
    setMetrics({ latency: '0ms', tokens: 0, status: 'IDLE' });
  };

  return (
    <div className="rounded-3xl bg-[#024045]/95 border border-[#0FA4AF]/40 p-6 sm:p-8 font-mono text-xs shadow-2xl">
      {/* Console Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0FA4AF]/30">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-[#AFDDE5]" />
          <span className="text-white font-bold tracking-tight">
            NEWTA_RUNTIME // INTERACTIVE PIPELINE HARNESS
          </span>
        </div>

        {/* Workflow Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#003135] rounded-xl border border-[#0FA4AF]/30">
          <button
            onClick={() => { setSelectedWorkflow('agent'); handleReset(); }}
            className={`px-3 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer ${
              selectedWorkflow === 'agent' ? 'bg-[#0FA4AF] text-white font-bold shadow-sm' : 'text-[#AFDDE5] hover:text-white'
            }`}
          >
            Multi-Agent
          </button>
          <button
            onClick={() => { setSelectedWorkflow('rag'); handleReset(); }}
            className={`px-3 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer ${
              selectedWorkflow === 'rag' ? 'bg-[#0FA4AF] text-white font-bold shadow-sm' : 'text-[#AFDDE5] hover:text-white'
            }`}
          >
            Semantic RAG
          </button>
          <button
            onClick={() => { setSelectedWorkflow('saas'); handleReset(); }}
            className={`px-3 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer ${
              selectedWorkflow === 'saas' ? 'bg-[#0FA4AF] text-white font-bold shadow-sm' : 'text-[#AFDDE5] hover:text-white'
            }`}
          >
            SaaS Worker
          </button>
        </div>
      </div>

      {/* Description & Action Trigger */}
      <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-white font-display font-bold text-base">
            {workflows[selectedWorkflow].name}
          </div>
          <p className="text-[#AFDDE5] font-sans text-xs mt-0.5">
            {workflows[selectedWorkflow].desc}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-[#0FA4AF] to-[#024045] hover:from-[#14B8C4] hover:to-[#0FA4AF] border border-[#AFDDE5]/40 disabled:opacity-50 text-white rounded-full transition-all cursor-pointer font-bold shadow-md"
          >
            <Play className="w-3 h-3 fill-current text-[#AFDDE5]" />
            <span>{isRunning ? 'Executing...' : 'Run Simulation'}</span>
          </button>
          <button
            onClick={handleReset}
            disabled={isRunning}
            className="p-2 text-[#AFDDE5] hover:text-white rounded-full border border-[#0FA4AF]/30 hover:bg-[#003135] transition-colors cursor-pointer"
            title="Reset Console"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log Output Terminal Window */}
      <div className="rounded-2xl bg-[#003135] border border-[#0FA4AF]/35 p-4 min-h-[140px] max-h-[220px] overflow-y-auto space-y-1.5 text-white">
        {logs.map((log, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="text-[#0FA4AF] select-none font-bold">&gt;</span>
            <span className={log.includes('passed') || log.includes('Emitted') ? 'text-[#AFDDE5] font-semibold' : ''}>
              {log}
            </span>
          </div>
        ))}
      </div>

      {/* Live Telemetry Row */}
      <div className="mt-4 pt-4 border-t border-[#0FA4AF]/30 grid grid-cols-3 gap-2 text-center text-[11px]">
        <div className="p-2.5 rounded-xl bg-[#003135] border border-[#0FA4AF]/30">
          <span className="text-[#AFDDE5]/80 block">PIPELINE STATUS</span>
          <span className={`font-bold ${metrics.status === 'COMPLETED' ? 'text-emerald-400' : 'text-[#AFDDE5]'}`}>
            {metrics.status}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#003135] border border-[#0FA4AF]/30">
          <span className="text-[#AFDDE5]/80 block">END-TO-END LATENCY</span>
          <span className="text-white font-bold">{metrics.latency}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#003135] border border-[#0FA4AF]/30">
          <span className="text-[#AFDDE5]/80 block">TOKEN CONSUMPTION</span>
          <span className="text-[#AFDDE5] font-bold">{metrics.tokens} tokens</span>
        </div>
      </div>
    </div>
  );
};
