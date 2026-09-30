import React, { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollRobotCanvasProps {
  currentSection?: string;
}

export const ScrollRobotCanvas: React.FC<ScrollRobotCanvasProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hudActive, setHudActive] = useState<boolean>(true);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [telemetry, setTelemetry] = useState({
    scrollProgress: 0,
    fps: 60,
    activeMode: 'NEURAL LINK'
  });

  // Track animation state in ref to avoid re-triggering React renders
  const stateRef = useRef({
    scrollProgress: 0,
    targetScrollProgress: 0,
    mouseX: 0.5,
    mouseY: 0.5,
    targetMouseX: 0.5,
    targetMouseY: 0.5,
    isMobile: false,
    reducedMotion: false,
    hudVisible: true,
    lastFrameTime: performance.now(),
    frameCount: 0,
    fpsCounter: 60,
    time: 0
  });

  useEffect(() => {
    stateRef.current.hudVisible = hudActive;
  }, [hudActive]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => {
      setIsReducedMotion(mediaQuery.matches);
      stateRef.current.reducedMotion = mediaQuery.matches;
    };
    updateMotion();
    mediaQuery.addEventListener('change', updateMotion);
    return () => mediaQuery.removeEventListener('change', updateMotion);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Responsive setup
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
      stateRef.current.isMobile = width < 768;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Throttled scroll listener
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      ) - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;
      stateRef.current.targetScrollProgress = progress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Mouse movement with smooth damping
    const handleMouseMove = (e: MouseEvent) => {
      if (stateRef.current.isMobile || stateRef.current.reducedMotion) return;
      stateRef.current.targetMouseX = e.clientX / window.innerWidth;
      stateRef.current.targetMouseY = e.clientY / window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Particle pool
    const particleCount = stateRef.current.isMobile ? 24 : 55;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0004,
      vy: -0.0003 - Math.random() * 0.0005,
      size: 1 + Math.random() * 2,
      alpha: 0.15 + Math.random() * 0.45,
      pulseSpeed: 1 + Math.random() * 2
    }));

    // Floating UI nodes that emerge as user scrolls into Services / Products
    const uiPanels = [
      { id: 'auth', xOffset: -180, yOffset: -120, label: 'AUTH_GATEWAY // OK', val: '0.12ms' },
      { id: 'telemetry', xOffset: 160, yOffset: -60, label: 'AGENTIC_ROUTER', val: 'ACTIVE' },
      { id: 'latency', xOffset: -190, yOffset: 110, label: 'SYNAPSE_BUS', val: '60 FPS' },
      { id: 'model', xOffset: 150, yOffset: 130, label: 'TENSOR_STREAM', val: 'READY' }
    ];

    // Main 60fps render loop
    const render = (currentTime: number) => {
      const deltaTime = (currentTime - stateRef.current.lastFrameTime) / 1000;
      stateRef.current.lastFrameTime = currentTime;

      // Update FPS counter every ~30 frames
      stateRef.current.frameCount++;
      if (stateRef.current.frameCount % 30 === 0) {
        stateRef.current.fpsCounter = Math.round(1 / Math.max(deltaTime, 0.001));
        setTelemetry({
          scrollProgress: Math.round(stateRef.current.scrollProgress * 100),
          fps: Math.min(60, stateRef.current.fpsCounter),
          activeMode: stateRef.current.scrollProgress > 0.7 ? 'CORE CONVERGENCE' : stateRef.current.scrollProgress > 0.35 ? 'SYNAPSE RUNTIME' : 'NEURAL OBSERVER'
        });
      }

      stateRef.current.time += deltaTime;
      const t = stateRef.current.time;

      // Smooth scroll interpolation
      const scrollEase = stateRef.current.reducedMotion ? 1 : 0.08;
      stateRef.current.scrollProgress += (stateRef.current.targetScrollProgress - stateRef.current.scrollProgress) * scrollEase;

      // Smooth mouse interpolation
      stateRef.current.mouseX += (stateRef.current.targetMouseX - stateRef.current.mouseX) * 0.05;
      stateRef.current.mouseY += (stateRef.current.targetMouseY - stateRef.current.mouseY) * 0.05;

      const sp = stateRef.current.scrollProgress;
      const mx = (stateRef.current.mouseX - 0.5) * 2;
      const my = (stateRef.current.mouseY - 0.5) * 2;

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // ==========================================
      // LAYER 1: Deep Perspective Grid & Cosmic Starfield
      // ==========================================
      const gridYOffset = (sp * 140) % 40;
      ctx.strokeStyle = 'rgba(0, 102, 255, 0.035)';
      ctx.lineWidth = 1;

      // Perspective horizon lines
      const horizonY = height * 0.65;
      for (let y = horizonY; y < height; y += 32) {
        const adjustedY = y + gridYOffset;
        if (adjustedY < height) {
          ctx.beginPath();
          ctx.moveTo(0, adjustedY);
          ctx.lineTo(width, adjustedY);
          ctx.stroke();
        }
      }

      // Vertical converging lines
      const vanishingX = width * 0.5 + mx * 40;
      const numLines = 14;
      for (let i = 0; i <= numLines; i++) {
        const bottomX = (width / numLines) * i;
        ctx.beginPath();
        ctx.moveTo(vanishingX, horizonY);
        ctx.lineTo(bottomX, height);
        ctx.stroke();
      }

      // ==========================================
      // LAYER 2: Ambient Particle Synapse Mesh
      // ==========================================
      ctx.fillStyle = '#00D2FF';
      particles.forEach((p, idx) => {
        if (!stateRef.current.reducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -0.05) p.y = 1.05;
          if (p.x < -0.05) p.x = 1.05;
          if (p.x > 1.05) p.x = -0.05;
        }

        const px = p.x * width;
        const py = p.y * height;
        const pulse = 0.5 + Math.sin(t * p.pulseSpeed + idx) * 0.5;
        const alpha = p.alpha * pulse * (1 - sp * 0.3);

        ctx.fillStyle = `rgba(0, 210, 255, ${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Proximity lines between adjacent particles
        for (let j = idx + 1; j < Math.min(idx + 5, particles.length); j++) {
          const p2 = particles[j];
          const distSq = Math.pow((p.x - p2.x) * width, 2) + Math.pow((p.y - p2.y) * height, 2);
          if (distSq < 11000) {
            const lineAlpha = (1 - distSq / 11000) * 0.08 * (1 - sp * 0.3);
            ctx.strokeStyle = `rgba(0, 102, 255, ${lineAlpha.toFixed(3)})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(p2.x * width, p2.y * height);
            ctx.stroke();
          }
        }
      });

      // ==========================================
      // LAYER 3: CINEMATIC CYBERNETIC AI / ROBOT FIGURE
      // ==========================================
      // Position calculation based on scroll progression:
      // - Hero (sp = 0): Anchored at right-center on desktop, center-low on mobile
      // - Services (sp = 0.15 - 0.35): Slides down, rotates subtly, reveals telemetry panels
      // - Products (sp = 0.35 - 0.55): Transforms slightly, shifts deeper in z-space
      // - Process (sp = 0.55 - 0.75): Emits connecting luminous beam
      // - CTA / Footer (sp = 0.75 - 1.0): Resolves into glowing Nexa Tech ribbon core

      const isMobile = stateRef.current.isMobile;
      const baseScale = isMobile ? 0.68 : 1.0;

      // Parallax scroll tracking
      const robotScrollY = sp * height * 0.85;
      const idleBreathing = Math.sin(t * 1.2) * 4;
      const idleHeadTurn = Math.sin(t * 0.8) * 0.03 + mx * 0.05;

      // Base coordinate anchor for the AI figure
      let rx = isMobile ? width * 0.5 + mx * 10 : width * 0.72 + mx * 20;
      let ry = height * 0.44 + robotScrollY * 0.3 + idleBreathing;

      // If scrolling deep into the page, subtly shift towards center background
      if (sp > 0.4) {
        const centerShift = Math.min((sp - 0.4) / 0.4, 1);
        rx = rx * (1 - centerShift * 0.35) + (width * 0.5) * (centerShift * 0.35);
      }

      ctx.save();
      ctx.translate(rx, ry);
      ctx.scale(baseScale, baseScale);

      // Ambient Cybernetic Glow behind the AI entity
      const ambientGlow = ctx.createRadialGradient(0, -20, 20, 0, -20, 260);
      ambientGlow.addColorStop(0, 'rgba(0, 102, 255, 0.22)');
      ambientGlow.addColorStop(0.5, 'rgba(0, 210, 255, 0.06)');
      ambientGlow.addColorStop(1, 'rgba(7, 9, 14, 0)');
      ctx.fillStyle = ambientGlow;
      ctx.beginPath();
      ctx.arc(0, -20, 260, 0, Math.PI * 2);
      ctx.fill();

      // Orbital Telemetry Rings (rotate continuously)
      ctx.save();
      ctx.rotate(t * 0.15);
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([8, 14]);
      ctx.beginPath();
      ctx.arc(0, 0, 190, 0, Math.PI * 2);
      ctx.stroke();

      ctx.rotate(-t * 0.3);
      ctx.strokeStyle = 'rgba(0, 102, 255, 0.18)';
      ctx.setLineDash([4, 20]);
      ctx.beginPath();
      ctx.arc(0, 0, 215, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // ------------------------------------------
      // Robotic Chassis: Shoulders & Torso Exoskeleton
      // ------------------------------------------
      // Torso Main Plate (brushed dark graphite with titanium bevel)
      const torsoGrad = ctx.createLinearGradient(-80, 40, 80, 200);
      torsoGrad.addColorStop(0, '#151C28');
      torsoGrad.addColorStop(0.5, '#0E141E');
      torsoGrad.addColorStop(1, '#070A0F');

      ctx.fillStyle = torsoGrad;
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.25)';
      ctx.lineWidth = 1.5;

      // Chest plate polygon
      ctx.beginPath();
      ctx.moveTo(-90, 60);
      ctx.lineTo(90, 60);
      ctx.lineTo(110, 110);
      ctx.lineTo(60, 200);
      ctx.lineTo(-60, 200);
      ctx.lineTo(-110, 110);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Shoulder Armor Nodes
      ctx.fillStyle = '#1A2332';
      // Left shoulder
      ctx.beginPath();
      ctx.moveTo(-90, 60);
      ctx.lineTo(-135, 75);
      ctx.lineTo(-120, 120);
      ctx.lineTo(-90, 95);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right shoulder
      ctx.beginPath();
      ctx.moveTo(90, 60);
      ctx.lineTo(135, 75);
      ctx.lineTo(120, 120);
      ctx.lineTo(90, 95);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Mechanical Collar & Neck Joints
      ctx.fillStyle = '#0B0F16';
      ctx.strokeStyle = 'rgba(0, 102, 255, 0.35)';
      for (let i = 0; i < 4; i++) {
        const ny = 12 + i * 10;
        ctx.beginPath();
        ctx.ellipse(0, ny, 24 - i * 2, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Internal Chest AI Reactor Core (Pulsing blue light with concentric rings)
      const corePulse = 0.7 + Math.sin(t * 2.5) * 0.3;
      const coreGlow = ctx.createRadialGradient(0, 115, 4, 0, 115, 38);
      coreGlow.addColorStop(0, `rgba(0, 235, 255, ${corePulse})`);
      coreGlow.addColorStop(0.4, `rgba(0, 102, 255, ${corePulse * 0.8})`);
      coreGlow.addColorStop(1, 'rgba(0, 50, 180, 0)');

      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(0, 115, 38, 0, Math.PI * 2);
      ctx.fill();

      // Core Hexagon Housing
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let a = 0; a < 6; a++) {
        const angle = (a * Math.PI) / 3;
        const hx = Math.cos(angle) * 16;
        const hy = 115 + Math.sin(angle) * 16;
        if (a === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();

      // Circuit lines branching from reactor core
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-16, 115);
      ctx.lineTo(-50, 115);
      ctx.lineTo(-75, 140);
      ctx.moveTo(16, 115);
      ctx.lineTo(50, 115);
      ctx.lineTo(75, 140);
      ctx.moveTo(0, 131);
      ctx.lineTo(0, 175);
      ctx.stroke();

      // ------------------------------------------
      // Robotic Head & Visor (Rotates slightly with idle & mouse)
      // ------------------------------------------
      ctx.save();
      ctx.translate(0, -25);
      ctx.rotate(idleHeadTurn);

      // Skull Cranium Plate (Sleek aerodynamic titanium helmet)
      const headGrad = ctx.createLinearGradient(-35, -70, 35, 30);
      headGrad.addColorStop(0, '#1E2838');
      headGrad.addColorStop(0.6, '#111823');
      headGrad.addColorStop(1, '#090D13');

      ctx.fillStyle = headGrad;
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.3)';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(-35, -45);
      ctx.bezierCurveTo(-45, -75, 45, -75, 35, -45);
      ctx.lineTo(38, -5);
      ctx.lineTo(24, 25);
      ctx.lineTo(0, 35);
      ctx.lineTo(-24, 25);
      ctx.lineTo(-38, -5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Lateral Ear/Audio Sensors
      ctx.fillStyle = '#0F1621';
      ctx.beginPath();
      ctx.rect(-44, -22, 6, 26);
      ctx.rect(38, -22, 6, 26);
      ctx.fill();
      ctx.stroke();

      // Sleek Horizon Visor (Dark glass with scanning beam)
      ctx.fillStyle = '#060A10';
      ctx.beginPath();
      ctx.moveTo(-32, -18);
      ctx.lineTo(32, -18);
      ctx.lineTo(28, 4);
      ctx.lineTo(-28, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Horizontal Visor Scanning Light (sweeps smoothly back and forth)
      const scanX = Math.sin(t * 2.2) * 22;
      const scanGlow = ctx.createRadialGradient(scanX, -7, 1, scanX, -7, 14);
      scanGlow.addColorStop(0, '#FFFFFF');
      scanGlow.addColorStop(0.3, '#00D2FF');
      scanGlow.addColorStop(0.8, '#0052FF');
      scanGlow.addColorStop(1, 'rgba(0, 82, 255, 0)');

      ctx.fillStyle = scanGlow;
      ctx.beginPath();
      ctx.arc(scanX, -7, 14, 0, Math.PI * 2);
      ctx.fill();

      // Sharp Visor Center Beam Line
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(scanX - 12, -7);
      ctx.lineTo(scanX + 12, -7);
      ctx.stroke();

      // Subtle Forehead Status LED (slow blink)
      const ledAlpha = 0.4 + Math.sin(t * 3) * 0.4;
      ctx.fillStyle = `rgba(0, 210, 255, ${ledAlpha})`;
      ctx.beginPath();
      ctx.arc(0, -42, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // end head transform

      // ------------------------------------------
      // Floating UI Holographic Cards (Visible when scrolling past Hero)
      // ------------------------------------------
      if (sp > 0.08 && !isMobile) {
        const uiAlpha = Math.min((sp - 0.08) / 0.15, 0.85) * (1 - Math.max((sp - 0.75) / 0.25, 0));
        uiPanels.forEach((panel, pIdx) => {
          const px = panel.xOffset + Math.sin(t + pIdx) * 6;
          const py = panel.yOffset + Math.cos(t * 0.8 + pIdx) * 6;

          // Connecting laser lead line
          ctx.strokeStyle = `rgba(0, 210, 255, ${(uiAlpha * 0.25).toFixed(2)})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 4]);
          ctx.beginPath();
          ctx.moveTo(0, 80);
          ctx.lineTo(px, py);
          ctx.stroke();
          ctx.setLineDash([]);

          // Panel container
          ctx.fillStyle = `rgba(14, 20, 31, ${(uiAlpha * 0.7).toFixed(2)})`;
          ctx.strokeStyle = `rgba(0, 210, 255, ${(uiAlpha * 0.4).toFixed(2)})`;
          ctx.lineWidth = 1;

          const pw = 120;
          const ph = 36;
          ctx.beginPath();
          ctx.roundRect(px - pw / 2, py - ph / 2, pw, ph, 4);
          ctx.fill();
          ctx.stroke();

          // Text inside card
          ctx.fillStyle = `rgba(147, 197, 253, ${uiAlpha.toFixed(2)})`;
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(panel.label, px, py - 4);

          ctx.fillStyle = `rgba(0, 210, 255, ${uiAlpha.toFixed(2)})`;
          ctx.font = 'bold 10px "JetBrains Mono", monospace';
          ctx.fillText(panel.val, px, py + 10);
        });
      }

      ctx.restore(); // end robot transform

      // ==========================================
      // LAYER 4: Glowing Process Energy Beam (Connects Process steps when in view)
      // ==========================================
      if (sp > 0.52 && sp < 0.85) {
        const processProgress = Math.min(Math.max((sp - 0.52) / 0.28, 0), 1);
        const startX = rx;
        const startY = ry;
        const endY = height * 0.85;

        const pathLength = (endY - startY) * processProgress;
        ctx.strokeStyle = 'rgba(0, 210, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00D2FF';
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(
          startX - 100,
          startY + pathLength * 0.5,
          width * 0.5 + 50,
          startY + pathLength * 0.8,
          width * 0.5,
          startY + pathLength
        );
        ctx.stroke();
        ctx.shadowBlur = 0; // reset shadow
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* Background radial atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(0,102,255,0.08)_0%,rgba(7,9,14,0)_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,210,255,0.05)_0%,rgba(7,9,14,0)_50%)]" />

      {/* The 60fps dynamic canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Optional Compact Telemetry HUD Pill (clickable affordance for user control) */}
      <div className="hidden lg:flex fixed bottom-5 right-5 pointer-events-auto items-center gap-3 px-3 py-1.5 rounded-full bg-[#0E131F]/80 backdrop-blur-md border border-white/[0.08] text-xs font-mono text-slate-400 shadow-xl transition-all hover:border-blue-500/40 z-20">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        <span className="text-[11px] text-slate-300">
          SYS: <span className="text-blue-400">{telemetry.activeMode}</span>
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-[11px] tabular-nums text-slate-400">
          DEPTH: <span className="text-slate-200">{telemetry.scrollProgress}%</span>
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-[11px] tabular-nums text-emerald-400">
          {telemetry.fps} FPS
        </span>
        <button
          onClick={() => setHudActive(!hudActive)}
          aria-label={hudActive ? 'Minimize HUD' : 'Expand HUD'}
          className="ml-1 text-[10px] text-slate-500 hover:text-white transition-colors"
        >
          {hudActive ? '[-] MIN' : '[+] EXP'}
        </button>
      </div>
    </div>
  );
};
