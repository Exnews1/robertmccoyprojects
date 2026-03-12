import { useEffect, useRef, useState } from "react";
import { DemoNav } from "@/components/demo-nav";

const ACTS = [
  {
    id: 0, label: "ACT I", title: "The Individual", start: 0, end: 7.5,
    desc: "A deployed SM at 0200 sends a signal. The CMGF AI engages in intense back-and-forth advisory exchange across multiple lanes. The signal thickens and glows hot as the session produces an activity report."
  },
  {
    id: 1, label: "ACT II", title: "The Installation", start: 7.5, end: 15,
    desc: "Hundreds of SMs appear at a single installation, each in their own advisory session. The AI engine grows under load. The pipeline burns hot with continuous signal traffic and coordination."
  },
  {
    id: 2, label: "ACT III", title: "The Network", start: 15, end: 27.5,
    desc: "Eight military bases come online — Ft Liberty, Ft Cavazos, JBLM, and more. Each has its own AI engine. ISR feeds from each base converge at the normalization hub, then flow to the Pentagon."
  },
  {
    id: 3, label: "ACT IV", title: "The Pentagon", start: 27.5, end: 37.5,
    desc: "Aggregated signals from 180+ installations feed to the Pentagon. 2,000,000+ service members, zero PII in the policy layer. The ISR sees only aggregated institutional intelligence."
  },
  {
    id: 4, label: "FINALE", title: "Light Show", start: 37.5, end: 45,
    desc: "A celebration of the governed signal architecture. Amber and gold fireworks erupt across the canvas as the closing quote fades in. The animation loops continuously for conference presentation."
  }
];

const DURATION = 45;

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

  const p2Offset = (progress + 0.5) % 1;
  ctx.beginPath();
  ctx.arc(x1 + (x2 - x1) * p2Offset, y1 + (y2 - y1) * p2Offset, 3, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function renderFireworks(ctx: CanvasRenderingContext2D, t: number, width: number, height: number) {
  const fireworkData = [
    { x: 0.5,  y: 0.18, delay: 0.0, radius: 140 },
    { x: 0.25, y: 0.35, delay: 0.6, radius: 110 },
    { x: 0.75, y: 0.30, delay: 1.2, radius: 120 },
    { x: 0.15, y: 0.55, delay: 1.8, radius: 100 },
    { x: 0.85, y: 0.50, delay: 2.3, radius: 105 },
  ];

  fireworkData.forEach((fw) => {
    if (t >= fw.delay) {
      const explosionT = t - fw.delay;
      if (explosionT < 3) {
        const alpha = 1 - explosionT / 3;
        const r = fw.radius * (explosionT / 3);
        ctx.beginPath();
        ctx.arc(fw.x * width, fw.y * height, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  });

  if (t > 2) {
    ctx.globalAlpha = Math.min(1, t - 2);
    ctx.fillStyle = "#f59e0b";
    ctx.font = "italic 24px 'Playfair Display', serif";
    ctx.textAlign = "center";
    ctx.fillText(`"From One to the Pentagon"`, width / 2, height / 2);
    ctx.globalAlpha = 1;
    ctx.textAlign = "left";
  }
}

export default function SignalFlowAnimation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const activeAct = ACTS.find(act => time >= act.start && time < act.end) || ACTS[ACTS.length - 1];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const actTitle =
      time >= 37.5 ? "FINALE" :
      time >= 27.5 ? "ACT IV — THE PENTAGON" :
      time >= 15   ? "ACT III — THE NETWORK" :
      time >= 7.5  ? "ACT II — THE INSTALLATION" :
                     "ACT I — THE INDIVIDUAL";

    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.font = "bold 18px 'JetBrains Mono', monospace";
    ctx.fillText(actTitle, 30, 40);

    ctx.globalCompositeOperation = "lighter";

    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
    for (let y = 0; y < height; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }

    const p1 = (time % 1) / 1;
    const p2 = (time % 1.5) / 1.5;

    if (time < 45) {
      const alpha = time >= 37.5 ? Math.max(0.1, 1 - (time - 37.5) / 2) : 1;
      ctx.globalAlpha = alpha;

      const sms = [0.5];
      if (time >= 7.5) sms.push(0.3, 0.4, 0.6, 0.7);

      sms.forEach(y => {
        drawSignal(ctx, width * 0.1, height * y, width * 0.35, height * 0.5, p1, "#3b82f6");
        drawNode(ctx, width * 0.1, height * y, "SM");
      });

      drawNode(ctx, width * 0.35, height * 0.5, time < 7.5 ? "AI Engine" : "Installation Node");

      if (time >= 15) {
        let baseCount = 3;
        if (time >= 20) baseCount = 5;
        if (time >= 24) baseCount = 9;
        if (time >= 27.5) baseCount = 17;

        const hubRadius = 6 + baseCount * 1.5;

        for (let i = 0; i < baseCount; i++) {
          const yPos = height * 0.2 + ((height * 0.6 / Math.max(1, baseCount - 1)) * i);

          if (Math.abs(yPos - height * 0.5) > 20) {
            const labels = ["Ft Liberty", "Ft Cavazos", "JBLM", "Camp Humphreys", "Ramstein AB"];
            const label = labels[i] || "";
            drawNode(ctx, width * 0.35, yPos, label);
            drawSignal(ctx, width * 0.2, yPos, width * 0.35, yPos, p1, "#3b82f6");
          }

          drawSignal(ctx, width * 0.35, yPos, width * 0.65, height * 0.5, p2, "#f59e0b");
        }

        drawNode(ctx, width * 0.65, height * 0.5, "Norm. Hub", hubRadius);
      }

      if (time >= 27.5) {
        drawNode(ctx, width * 0.9, height * 0.5, "The Pentagon", 12);
        for (let i = 0; i < 3; i++) {
          const thickP = ((time + i * 0.33) % 1) / 1;
          drawSignal(ctx, width * 0.65, height * 0.5, width * 0.9, height * 0.5, thickP, "#10b981");
        }
      }

      ctx.globalAlpha = 1.0;
    }

    if (time >= 37.5) {
      renderFireworks(ctx, time - 37.5, width, height);
    }

    ctx.globalCompositeOperation = "source-over";
  }, [time]);

  useEffect(() => {
    const loop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      if (isPlaying) {
        setTime(prev => {
          let next = prev + deltaTime;
          if (next >= DURATION) next = next % DURATION;
          return next;
        });
      }
      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setTime(percent * DURATION);
  };

  return (
    <div style={{ background: "#05070a", minHeight: "100vh", color: "#e2e8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        .sf-act-card { background: rgba(15,20,35,0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1.5rem; transition: all 0.3s ease; position: relative; overflow: hidden; cursor: pointer; }
        .sf-act-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:#f59e0b; transform:scaleX(0); transform-origin:left; transition:transform 0.3s ease; }
        .sf-act-card.sf-active { background: rgba(30,41,59,0.5); border-color: rgba(255,255,255,0.15); transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .sf-act-card.sf-active::before { transform: scaleX(1); }
        .sf-canvas-wrapper { position:relative; width:100%; aspect-ratio:16/9; background:linear-gradient(135deg,#0f1524 0%,#05070a 100%); border-radius:12px; overflow:hidden; box-shadow:0 0 40px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.08); margin-bottom:1.5rem; }
        .sf-progress-track { flex:1; height:6px; background:rgba(255,255,255,0.1); border-radius:3px; overflow:hidden; cursor:pointer; }
        .sf-play-btn { background:transparent; border:1px solid #f59e0b; color:#f59e0b; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s; flex-shrink:0; }
        .sf-play-btn:hover { background:rgba(245,158,11,0.2); transform:scale(1.05); }
        .sf-replay-btn { background:transparent; border:none; color:#94a3b8; cursor:pointer; transition:color 0.2s; padding:0; display:flex; align-items:center; }
        .sf-replay-btn:hover { color:#e2e8f0; }
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
            <div className="sf-progress-track" onClick={handleSeek} data-testid="progress-track">
              <div style={{ height: "100%", background: "#e2e8f0", borderRadius: 3, width: `${(time / DURATION) * 100}%`, transition: "width 0.1s linear" }} />
            </div>
            <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace", minWidth: 45 }}>{formatTime(DURATION)}</span>
          </div>
          <div style={{ fontSize: "0.85rem", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>
            {activeAct.title}
          </div>
        </div>

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
          For conference use: Use fullscreen mode and press play. The animation runs 45 seconds then loops automatically — no interaction needed.
        </footer>
      </div>
    </div>
  );
}
