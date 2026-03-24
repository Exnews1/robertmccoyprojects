import { useEffect, useRef, useState } from "react";
import { DemoNav } from "@/components/demo-nav";

// ── Timing ────────────────────────────────────────────────────────────────────
const DURATION     = 75;   // total loop seconds
const SHOW_START   = 45;   // light show begins
const SHOW_END     = 67;   // transition begins
const FADE_END     = 75;   // loop restarts

const ACTS = [
  {
    id: 0, label: "ACT I", title: "The Individual", start: 0, end: 9,
    desc: "A deployed SM at 0200 sends a signal. The CMGF AI engages in intense back-and-forth advisory exchange. The signal thickens and glows hot as the session produces an activity report."
  },
  {
    id: 1, label: "ACT II", title: "The Installation", start: 9, end: 18,
    desc: "Hundreds of SMs appear at a single installation, each in their own advisory session. The AI engine grows under load. The pipeline burns hot with continuous signal traffic."
  },
  {
    id: 2, label: "ACT III", title: "The Network", start: 18, end: 33,
    desc: "Eight military bases come online — Ft Liberty, Ft Cavazos, JBLM, and more. Each has its own AI engine. ISR feeds converge at the normalization hub, then flow to the Pentagon."
  },
  {
    id: 3, label: "ACT IV", title: "The Pentagon", start: 33, end: 45,
    desc: "Aggregated signals from 180+ installations feed to the Pentagon. 2,000,000+ service members, zero PII in the policy layer. The ISR sees only aggregated institutional intelligence."
  },
  {
    id: 4, label: "FINALE", title: "Light Show", start: 45, end: 67,
    desc: "A celebration of the governed signal architecture. Orbital rings, amber and gold fireworks, and particle bursts erupt across the canvas as the architecture reveals itself. Then silence — and the signal begins again."
  }
];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function drawNode(ctx: CanvasRenderingContext2D, x: number, y: number, label: string, radius = 6) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.fillStyle = "#94a3b8";
  ctx.font = "12px Inter, sans-serif";
  if (label.includes("Pentagon")) {
    ctx.textAlign = "right";
    ctx.fillText(label, x - (radius + 10), y + 5);
    ctx.textAlign = "left";
  } else {
    ctx.fillText(label, x - 10, y + (radius + 14));
  }
}

function drawSignal(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  progress: number, color: string
) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.2;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.globalAlpha = 1.0;
  ctx.beginPath();
  ctx.arc(x1 + (x2 - x1) * progress, y1 + (y2 - y1) * progress, 3, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  const p2 = (progress + 0.5) % 1;
  ctx.beginPath();
  ctx.arc(x1 + (x2 - x1) * p2, y1 + (y2 - y1) * p2, 3, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

// ── Firework burst definitions (deterministic — no random at render time) ────
const BURSTS = [
  { nx: 0.50, ny: 0.22, period: 4.2, offset: 0.0, colors: ["#f59e0b","#fbbf24","#fde68a"], count: 56, speed: 0.045, size: 0.38 },
  { nx: 0.25, ny: 0.38, period: 4.2, offset: 1.4, colors: ["#3b82f6","#60a5fa","#93c5fd"], count: 44, speed: 0.040, size: 0.30 },
  { nx: 0.75, ny: 0.32, period: 4.2, offset: 2.8, colors: ["#10b981","#34d399","#6ee7b7"], count: 48, speed: 0.042, size: 0.33 },
  { nx: 0.14, ny: 0.55, period: 5.5, offset: 0.7, colors: ["#f59e0b","#fbbf24"],          count: 36, speed: 0.038, size: 0.26 },
  { nx: 0.86, ny: 0.48, period: 5.5, offset: 2.2, colors: ["#f59e0b","#fde68a"],          count: 40, speed: 0.040, size: 0.28 },
  { nx: 0.50, ny: 0.68, period: 6.0, offset: 1.5, colors: ["#fbbf24","#fde68a","#f59e0b"], count: 52, speed: 0.044, size: 0.35 },
  { nx: 0.35, ny: 0.18, period: 5.0, offset: 3.1, colors: ["#60a5fa","#3b82f6"],          count: 38, speed: 0.038, size: 0.27 },
  { nx: 0.65, ny: 0.72, period: 5.0, offset: 4.2, colors: ["#34d399","#10b981"],          count: 42, speed: 0.041, size: 0.30 },
  // Grand finale clusters — fire faster in the second half
  { nx: 0.50, ny: 0.35, period: 2.5, offset: 10.0, colors: ["#f59e0b","#fbbf24","#fff","#fde68a"], count: 72, speed: 0.055, size: 0.48 },
  { nx: 0.30, ny: 0.50, period: 2.5, offset: 11.2, colors: ["#fde68a","#f59e0b"],          count: 56, speed: 0.048, size: 0.38 },
  { nx: 0.70, ny: 0.45, period: 2.5, offset: 12.4, colors: ["#34d399","#6ee7b7","#f59e0b"], count: 64, speed: 0.052, size: 0.42 },
];

function renderBurst(
  ctx: CanvasRenderingContext2D,
  t: number,
  bx: number,
  by: number,
  def: typeof BURSTS[0],
  width: number,
  height: number
) {
  const duration = 2.8;
  if (t < 0 || t > duration) return;

  const progress = t / duration;             // 0 → 1 over the burst lifetime
  const maxR = Math.min(width, height) * def.size;
  const alpha = 1 - progress * progress;     // quadratic fade
  const trailAlpha = alpha * 0.35;

  for (let i = 0; i < def.count; i++) {
    const angle = (i / def.count) * Math.PI * 2;
    // slight starburst variation (deterministic per-particle)
    const radiusMod = 0.85 + 0.3 * Math.abs(Math.sin(i * 1.618));
    const r = maxR * progress * def.speed * 22 * radiusMod;

    const px = bx + r * Math.cos(angle);
    const py = by + r * Math.sin(angle) + r * 0.15 * progress; // slight gravity droop

    const color = def.colors[i % def.colors.length];

    // Trail
    if (progress > 0.05) {
      const tr = r * 0.82;
      ctx.beginPath();
      ctx.moveTo(bx + tr * Math.cos(angle), by + tr * Math.sin(angle) + tr * 0.15 * progress * 0.82);
      ctx.lineTo(px, py);
      ctx.strokeStyle = color;
      ctx.globalAlpha = trailAlpha;
      ctx.lineWidth = progress < 0.3 ? 2.5 : 1.5;
      ctx.stroke();
    }

    // Head dot
    const dotR = (1 - progress * 0.6) * 2.8;
    ctx.beginPath();
    ctx.arc(px, py, dotR, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fill();
  }

  // Central flash on ignition
  if (t < 0.25) {
    const flashAlpha = (1 - t / 0.25) * 0.9;
    const flashR = maxR * 0.15 * (1 - t / 0.25);
    const grd = ctx.createRadialGradient(bx, by, 0, bx, by, flashR);
    grd.addColorStop(0, `rgba(255,255,240,${flashAlpha})`);
    grd.addColorStop(1, "transparent");
    ctx.globalAlpha = 1;
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(bx, by, flashR, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}

// ── Orbital rings ─────────────────────────────────────────────────────────────
const ORBITS = [
  { rxf: 0.40, ryf: 0.28, speed:  0.28, dotCount: 14, color: "#f59e0b", phase: 0.0,        dotSize: 2.5 },
  { rxf: 0.52, ryf: 0.38, speed: -0.18, dotCount:  9, color: "#3b82f6", phase: 1.05,       dotSize: 2.2 },
  { rxf: 0.30, ryf: 0.20, speed:  0.45, dotCount: 18, color: "#10b981", phase: 0.52,       dotSize: 1.8 },
  { rxf: 0.62, ryf: 0.44, speed: -0.32, dotCount: 11, color: "#fbbf24", phase: 2.09,       dotSize: 2.0 },
  { rxf: 0.22, ryf: 0.15, speed:  0.60, dotCount: 22, color: "#f59e0b", phase: Math.PI/4,  dotSize: 1.5 },
];

function renderOrbitals(
  ctx: CanvasRenderingContext2D,
  t: number,
  width: number,
  height: number,
  alpha: number
) {
  const cx = width / 2;
  const cy = height / 2;

  ORBITS.forEach(orb => {
    const rx = width  * orb.rxf;
    const ry = height * orb.ryf;
    const baseAngle = t * orb.speed + orb.phase;

    // Orbit ring
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.strokeStyle = orb.color;
    ctx.globalAlpha = alpha * 0.12;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Dots
    for (let i = 0; i < orb.dotCount; i++) {
      const a = baseAngle + (i / orb.dotCount) * Math.PI * 2;
      const dx = cx + rx * Math.cos(a);
      const dy = cy + ry * Math.sin(a);
      const dotAlpha = alpha * (0.4 + 0.4 * Math.sin(a + t));
      ctx.beginPath();
      ctx.arc(dx, dy, orb.dotSize, 0, Math.PI * 2);
      ctx.fillStyle = orb.color;
      ctx.globalAlpha = dotAlpha;
      ctx.fill();
    }
  });

  ctx.globalAlpha = 1;
}

// ── Ambient pulse / glow ──────────────────────────────────────────────────────
function renderAmbientGlow(
  ctx: CanvasRenderingContext2D,
  t: number,
  width: number,
  height: number,
  alpha: number
) {
  const pulse = 0.06 + 0.04 * Math.sin(t * 1.8);
  const grd = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.55);
  grd.addColorStop(0, `rgba(245,158,11,${(pulse * alpha).toFixed(3)})`);
  grd.addColorStop(0.5, `rgba(59,130,246,${(pulse * 0.4 * alpha).toFixed(3)})`);
  grd.addColorStop(1, "transparent");
  ctx.fillStyle = grd;
  ctx.globalAlpha = 1;
  ctx.fillRect(0, 0, width, height);
}

// ── Full light show renderer ───────────────────────────────────────────────────
function renderLightShow(
  ctx: CanvasRenderingContext2D,
  rawT: number,          // seconds since SHOW_START
  width: number,
  height: number
) {
  // Ramp in over first 1.5 s, ramp out over last 2 s of show
  const showLen = SHOW_END - SHOW_START;
  const masterAlpha = Math.min(1, rawT / 1.5) * Math.min(1, (showLen - rawT) / 2);

  renderAmbientGlow(ctx, rawT, width, height, masterAlpha);
  renderOrbitals(ctx, rawT, width, height, masterAlpha);

  // Firework bursts
  BURSTS.forEach(def => {
    // Only activate after a small intro delay so signal flow fades first
    if (rawT < 0.8) return;
    const effective = rawT - 0.8;
    // Only fire finale clusters if we're far enough in
    if (def.offset >= 10 && effective < 9) return;

    const phaseT = ((effective - def.offset) % def.period + def.period) % def.period;
    const bx = def.nx * width;
    const by = def.ny * height;
    renderBurst(ctx, phaseT, bx, by, def, width, height);
  });

  // Quote text
  if (rawT > 2) {
    const textAlpha = Math.min(1, (rawT - 2) / 1.5) * masterAlpha;
    ctx.globalAlpha = textAlpha;
    ctx.fillStyle = "#f59e0b";
    ctx.font = "italic 26px 'Playfair Display', serif";
    ctx.textAlign = "center";
    ctx.fillText(`\u201CFrom One to the Pentagon\u201D`, width / 2, height * 0.44);
    if (rawT > 4.5) {
      const subAlpha = Math.min(1, (rawT - 4.5) / 1.5) * masterAlpha;
      ctx.globalAlpha = subAlpha;
      ctx.fillStyle = "#94a3b8";
      ctx.font = "13px Inter, sans-serif";
      ctx.fillText("The governed signal \u2014 from individual advisory to institutional intelligence", width / 2, height * 0.44 + 38);
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = "left";
  }
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function SignalFlowAnimation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const activeAct = ACTS.find(act => time >= act.start && time < act.end) || ACTS[ACTS.length - 1];

  // ── Draw ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width  = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const dpr    = window.devicePixelRatio || 1;
    canvas.width  = width  * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    // ── Act label ─────────────────────────────────────────────────────────────
    const actTitle =
      time >= SHOW_START ? "FINALE — LIGHT SHOW" :
      time >= 33         ? "ACT IV — THE PENTAGON"    :
      time >= 18         ? "ACT III — THE NETWORK"    :
      time >= 9          ? "ACT II — THE INSTALLATION":
                           "ACT I — THE INDIVIDUAL";

    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "bold 18px 'JetBrains Mono', monospace";
    ctx.fillText(actTitle, 30, 40);

    ctx.globalCompositeOperation = "lighter";

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
    for (let y = 0; y < height; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }

    const p1 = (time % 1)   / 1;
    const p2 = (time % 1.5) / 1.5;

    // ── Signal flow (Acts I-IV) ───────────────────────────────────────────────
    if (time < SHOW_END) {
      const flowAlpha = time >= SHOW_START ? Math.max(0, 1 - (time - SHOW_START) / 1.5) : 1;
      ctx.globalAlpha = flowAlpha;

      const sms = [0.5];
      if (time >= 9) sms.push(0.3, 0.4, 0.6, 0.7);

      sms.forEach(y => {
        drawSignal(ctx, width * 0.1, height * y, width * 0.35, height * 0.5, p1, "#3b82f6");
        drawNode(ctx, width * 0.1, height * y, "SM");
      });

      drawNode(ctx, width * 0.35, height * 0.5, time < 9 ? "AI Engine" : "Installation Node");

      if (time >= 18) {
        let baseCount = 3;
        if (time >= 22) baseCount = 5;
        if (time >= 27) baseCount = 9;
        if (time >= 33) baseCount = 17;

        const hubRadius = 6 + baseCount * 1.5;

        for (let i = 0; i < baseCount; i++) {
          const yPos = height * 0.2 + ((height * 0.6 / Math.max(1, baseCount - 1)) * i);
          if (Math.abs(yPos - height * 0.5) > 20) {
            const labels = ["Ft Liberty", "Ft Cavazos", "JBLM", "Camp Humphreys", "Ramstein AB"];
            drawNode(ctx, width * 0.35, yPos, labels[i] || "");
            drawSignal(ctx, width * 0.2, yPos, width * 0.35, yPos, p1, "#3b82f6");
          }
          drawSignal(ctx, width * 0.35, yPos, width * 0.65, height * 0.5, p2, "#f59e0b");
        }

        drawNode(ctx, width * 0.65, height * 0.5, "Norm. Hub", hubRadius);
      }

      if (time >= 33) {
        drawNode(ctx, width * 0.9, height * 0.5, "The Pentagon", 12);
        for (let i = 0; i < 3; i++) {
          const thickP = ((time + i * 0.33) % 1) / 1;
          drawSignal(ctx, width * 0.65, height * 0.5, width * 0.9, height * 0.5, thickP, "#10b981");
        }
      }

      ctx.globalAlpha = 1;
    }

    // ── Light show ────────────────────────────────────────────────────────────
    if (time >= SHOW_START && time < FADE_END) {
      ctx.globalCompositeOperation = "source-over";
      renderLightShow(ctx, time - SHOW_START, width, height);
    }

    // ── Fade to black transition ───────────────────────────────────────────────
    if (time >= SHOW_END) {
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      const fadeProgress = (time - SHOW_END) / (FADE_END - SHOW_END);
      ctx.fillStyle = `rgba(5,7,10,${Math.min(1, fadeProgress * 1.1)})`;
      ctx.fillRect(0, 0, width, height);

      // "Signal begins again…" whisper
      if (fadeProgress > 0.5) {
        ctx.globalAlpha = (fadeProgress - 0.5) * 2 * 0.6;
        ctx.fillStyle = "#f59e0b";
        ctx.font = "italic 16px 'Playfair Display', serif";
        ctx.textAlign = "center";
        ctx.fillText("The signal begins again\u2026", width / 2, height / 2);
        ctx.textAlign = "left";
      }

      ctx.globalAlpha = 1;
    }

    ctx.globalCompositeOperation = "source-over";
  }, [time]);

  // ── Animation loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    const loop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      if (isPlaying) {
        setTime(prev => {
          const next = prev + delta;
          return next >= DURATION ? next % DURATION : next;
        });
      }
      animationRef.current = requestAnimationFrame(loop);
    };
    animationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTime(((e.clientX - rect.left) / rect.width) * DURATION);
  };

  return (
    <div style={{ background: "#05070a", minHeight: "100vh", color: "#e2e8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        .sf-act-card { background:rgba(15,20,35,0.6); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:1.5rem; transition:all 0.3s ease; position:relative; overflow:hidden; cursor:pointer; }
        .sf-act-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:#f59e0b; transform:scaleX(0); transform-origin:left; transition:transform 0.3s ease; }
        .sf-act-card.sf-active { background:rgba(30,41,59,0.5); border-color:rgba(255,255,255,0.15); transform:translateY(-4px); box-shadow:0 10px 30px rgba(0,0,0,0.3); }
        .sf-act-card.sf-active::before { transform:scaleX(1); }
        .sf-canvas-wrapper { position:relative; width:100%; aspect-ratio:16/9; background:linear-gradient(135deg,#0f1524 0%,#05070a 100%); border-radius:12px; overflow:hidden; box-shadow:0 0 40px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.08); margin-bottom:1.5rem; }
        .sf-progress-track { flex:1; height:6px; background:rgba(255,255,255,0.1); border-radius:3px; overflow:hidden; cursor:pointer; }
        .sf-play-btn { background:transparent; border:1px solid #f59e0b; color:#f59e0b; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s; flex-shrink:0; }
        .sf-play-btn:hover { background:rgba(245,158,11,0.2); transform:scale(1.05); }
        .sf-replay-btn { background:transparent; border:none; color:#94a3b8; cursor:pointer; transition:color 0.2s; padding:0; display:flex; align-items:center; }
        .sf-replay-btn:hover { color:#e2e8f0; }
        .sf-phase-marker { position:absolute; top:0; bottom:0; width:2px; background:rgba(245,158,11,0.35); pointer-events:none; }
      `}</style>

      <DemoNav />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "2rem" }}>
        <header style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#f59e0b", fontFamily: "'JetBrains Mono', monospace", marginBottom: "1rem" }}>
            Cinematic Visualization
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3rem", fontWeight: 400, marginBottom: "0.5rem", color: "#e2e8f0" }}>
            From One to the Pentagon
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>
            The CMGF Signal at Scale — How individual advisory sessions become privacy-safe institutional intelligence
          </p>
        </header>

        <div className="sf-canvas-wrapper">
          <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} data-testid="canvas-signal-flow" />
        </div>

        {/* Transport controls */}
        <div style={{
          display: "flex", alignItems: "center", gap: "1rem",
          background: "rgba(15,20,35,0.6)", padding: "1rem 1.5rem",
          borderRadius: "100px", backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.08)", marginBottom: "3rem"
        }}>
          <button className="sf-play-btn" onClick={() => setIsPlaying(!isPlaying)} data-testid="button-play-pause">
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          <button className="sf-replay-btn" onClick={() => setTime(0)} data-testid="button-replay">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          </button>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", minWidth: 45 }}>{formatTime(time)}</span>
            <div style={{ flex: 1, position: "relative" }}>
              <div className="sf-progress-track" onClick={handleSeek} data-testid="progress-track">
                <div style={{ height: "100%", background: "linear-gradient(to right,#f59e0b,#fbbf24)", borderRadius: 3, width: `${(time / DURATION) * 100}%`, transition: "width 0.1s linear" }} />
              </div>
              {/* Phase markers */}
              {[SHOW_START, SHOW_END].map(t => (
                <div key={t} className="sf-phase-marker" style={{ left: `${(t / DURATION) * 100}%` }} />
              ))}
            </div>
            <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", minWidth: 45 }}>{formatTime(DURATION)}</span>
          </div>
          <div style={{ fontSize: "0.85rem", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>
            {activeAct.title}
          </div>
        </div>

        {/* Act cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          {ACTS.map(act => (
            <div
              key={act.id}
              className={`sf-act-card${activeAct.id === act.id ? " sf-active" : ""}`}
              onClick={() => { setTime(act.start); setIsPlaying(true); }}
              data-testid={`act-card-${act.id}`}
            >
              <h4 style={{ fontSize: "0.75rem", color: "#f59e0b", marginBottom: "0.5rem", fontFamily: "'JetBrains Mono', monospace" }}>{act.label}</h4>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 500, marginBottom: "0.5rem", color: "#e2e8f0" }}>{act.title}</h2>
              <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "1rem", fontFamily: "'JetBrains Mono', monospace" }}>
                {formatTime(act.start)} — {formatTime(act.end)}
              </div>
              <p style={{ fontSize: "0.9rem", color: "#94a3b8", lineHeight: 1.6 }}>{act.desc}</p>
            </div>
          ))}
        </div>

        <footer style={{ textAlign: "center", padding: "2rem", color: "#94a3b8", fontSize: "0.85rem", borderTop: "1px solid rgba(255,255,255,0.08)", fontFamily: "'JetBrains Mono', monospace" }}>
          For conference use: Use fullscreen mode and press play. Signal flow builds over 45 seconds, orbital light show runs 22 seconds, then fades to black and loops — no interaction needed. Total loop: 75 seconds.
        </footer>
      </div>
    </div>
  );
}
