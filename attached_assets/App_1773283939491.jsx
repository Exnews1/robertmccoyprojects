import React, { useEffect, useRef, useState } from 'react';

// Act Definitions based on the extracted demo
const ACTS = [
  { 
    id: 0, 
    label: "ACT I", 
    title: "The Individual", 
    start: 0, 
    end: 7.5,
    desc: "A deployed SM at 0200 sends a signal. The CMGF AI engages in intense back-and-forth advisory exchange across multiple lanes. The signal thickens and glows hot as the session produces an activity report."
  },
  { 
    id: 1, 
    label: "ACT II", 
    title: "The Installation", 
    start: 7.5, 
    end: 15,
    desc: "Hundreds of SMs appear at a single installation, each in their own advisory session. The AI engine grows under load. The pipeline burns hot with continuous signal traffic and coordination."
  },
  { 
    id: 2, 
    label: "ACT III", 
    title: "The Network", 
    start: 15, 
    end: 27.5,
    desc: "Eight military bases come online — Ft Liberty, Ft Cavazos, JBLM, and more. Each has its own AI engine. ISR feeds from each base converge at the normalization hub, then flow to the Pentagon."
  },
  { 
    id: 3, 
    label: "ACT IV", 
    title: "The Pentagon", 
    start: 27.5, 
    end: 37.5,
    desc: "Aggregated signals from 180+ installations feed to the Pentagon. 2,000,000+ service members, zero PII in the policy layer. The ISR sees only aggregated institutional intelligence."
  },
  { 
    id: 4, 
    label: "FINALE", 
    title: "Light Show", 
    start: 37.5, 
    end: 45,
    desc: "A celebration of the governed signal architecture. Amber and gold fireworks erupt across the canvas as the closing quote fades in. The animation loops continuously for conference presentation."
  }
];

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);
  const DURATION = 45;

  // Determine active act
  const activeAct = ACTS.find(act => time >= act.start && time < act.end) || ACTS[ACTS.length - 1];

  // Canvas Drawing Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    // Set actual responsive size for high DPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Act Title inside Canvas
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.font = "bold 18px 'JetBrains Mono', monospace";
      const actTitle = time >= 37.5 ? "FINALE" : 
                       time >= 27.5 ? "ACT IV — THE PENTAGON" :
                       time >= 15 ? "ACT III — THE NETWORK" :
                       time >= 7.5 ? "ACT II — THE INSTALLATION" :
                       "ACT I — THE INDIVIDUAL";
      
      ctx.fillText(actTitle, 30, 40);

      // --- Core Visual Elements ---
      ctx.globalCompositeOperation = "lighter";

      // Simple grid background
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 1;
      for(let x=0; x<width; x+=50) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,height); ctx.stroke(); }
      for(let y=0; y<height; y+=50) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(width,y); ctx.stroke(); }

      // Time-based nodes and signals
      const p1 = (time % 1) / 1; // fast ping for SM to Installation
      const p2 = (time % 1.5) / 1.5; // medium ping for Inst to Hub
      const p3 = (time % 2.25) / 2.25; // slow ping for Hub to Pentagon

      if (time < 45) { // Always draw network, even in finale
        const alpha = time >= 37.5 ? Math.max(0.1, 1 - (time - 37.5) / 2) : 1;
        ctx.globalAlpha = alpha;

        // Act 1 & 2: SMs -> Installation
        // Accumulate!
        const sms = [0.5];
        if (time >= 7.5) sms.push(0.3, 0.4, 0.6, 0.7);

        sms.forEach(y => {
          drawSignal(ctx, width * 0.1, height * y, width * 0.35, height * 0.5, p1, "#3b82f6");
          drawNode(ctx, width * 0.1, height * y, "SM");
        });

        drawNode(ctx, width * 0.35, height * 0.5, time < 7.5 ? "AI Engine" : "Installation Node");

        // Act 3 & 4: Network Feeds to Singular Hub
        if (time >= 15) {
          let baseCount = 3;
          if (time >= 20) baseCount = 5;
          if (time >= 24) baseCount = 9;
          if (time >= 27.5) baseCount = 17; // Massive network scale
          
          const hubRadius = 6 + (baseCount * 1.5); // Hub gets fatter
          
          for (let i = 0; i < baseCount; i++) {
             // Distribute bases vertically
             let yPos = height * 0.2 + ((height * 0.6 / Math.max(1, baseCount - 1)) * i);
             
             // Draw the node & input signal for other bases (skip the center one which is the main Installation Node)
             if (Math.abs(yPos - height * 0.5) > 20) {
                 const labels = ["Ft Liberty", "Ft Cavazos", "JBLM", "Camp Humphreys", "Ramstein AB"];
                 const label = labels[i] || "";
                 drawNode(ctx, width * 0.35, yPos, label);
                 drawSignal(ctx, width * 0.2, yPos, width * 0.35, yPos, p1, "#3b82f6");
             }
             
             // Signal to single Norm Hub
             drawSignal(ctx, width * 0.35, yPos, width * 0.65, height * 0.5, p2, "#f59e0b");
          }

          drawNode(ctx, width * 0.65, height * 0.5, "Norm. Hub", hubRadius);
        }

        // Act 4: Hub -> Pentagon
        if (time >= 27.5) {
          drawNode(ctx, width * 0.9, height * 0.5, "The Pentagon", 12);
          
          // Thicker, faster multiplexed feed from the massive hub
          for(let i=0; i<3; i++) {
             const thickP = ((time + i*0.33) % 1) / 1;
             drawSignal(ctx, width * 0.65, height * 0.5, width * 0.9, height * 0.5, thickP, "#10b981");
          }
        }

        ctx.globalAlpha = 1.0;
      }

      if (time >= 37.5) {
        // FINALE: Fireworks
        renderFireworks(ctx, time - 37.5, width, height);
      }
      
      ctx.globalCompositeOperation = "source-over";
    };

    render();
  }, [time]);

  // Shared Drawing Utils
  const drawNode = (ctx, x, y, label, radius = 6) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px Inter";
    if (label.includes("Pentagon")) {
      ctx.textAlign = "right";
      ctx.fillText(label, x - (radius + 10), y + 5);
      ctx.textAlign = "left";
    } else {
      ctx.fillText(label, x - 10, y + (radius + 14));
    }
  };

  const drawSignal = (ctx, x1, y1, x2, y2, progress, color) => {
    // Draw steady, faint continuous trail
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.globalAlpha = 1.0;

    // Draw active ping 1
    ctx.beginPath();
    ctx.arc(x1 + (x2 - x1) * progress, y1 + (y2 - y1) * progress, 3, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Draw active ping 2 (Continuous flow)
    const p2Offset = (progress + 0.5) % 1;
    ctx.beginPath();
    ctx.arc(x1 + (x2 - x1) * p2Offset, y1 + (y2 - y1) * p2Offset, 3, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  };

  const renderFireworks = (ctx, t, width, height) => {
    // Basic mock fireworks based on the extracted demo
    const fireworkData = [
      {x: 0.5,  y: 0.18, delay: 0.0, radius: 140},
      {x: 0.25, y: 0.35, delay: 0.6, radius: 110},
      {x: 0.75, y: 0.30, delay: 1.2, radius: 120},
      {x: 0.15, y: 0.55, delay: 1.8, radius: 100},
      {x: 0.85, y: 0.50, delay: 2.3, radius: 105},
    ];

    fireworkData.forEach((fw) => {
      if (t >= fw.delay) {
        const explosionT = t - fw.delay;
        if (explosionT < 3) {
          const alpha = 1 - (explosionT / 3);
          const r = fw.radius * (explosionT / 3);
          ctx.beginPath();
          ctx.arc(fw.x * width, fw.y * height, r, 0, Math.PI*2);
          ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    });

    // Closing Quote
    if (t > 2) {
      ctx.globalAlpha = Math.min(1, t - 2);
      ctx.fillStyle = "#f59e0b";
      ctx.font = "italic 24px 'Playfair Display'";
      ctx.textAlign = "center";
      ctx.fillText(`"From One to the Pentagon"`, width/2, height/2);
      ctx.globalAlpha = 1;
      ctx.textAlign = "left";
    }
  };

  // Animation Loop
  useEffect(() => {
    const loop = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      if (isPlaying) {
        setTime((prev) => {
          let nextTime = prev + deltaTime;
          if (nextTime >= DURATION) nextTime = nextTime % DURATION; // Smooth loop without stall
          return nextTime;
        });
      }
      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setTime(percent * DURATION);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <nav className="top-nav">
        <div className="brand">
          Robert McCoy <span>|</span> Research Portfolio
        </div>
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#" className="active font-bold text-gold">Research</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>

      <div className="sub-nav font-mono">
        <a href="#">&larr; CMGF</a>
        <a href="#">&#9881; AI Architecture</a>
        <a href="#">&#9881; Career Advisor</a>
        <a href="#" className="active">&#9654; Signal Flow</a>
      </div>

      {/* Main Content */}
      <main className="main-content">
        <header className="hero-section">
          <h3 className="text-gold font-mono">Cinematic Visualization</h3>
          <h1 className="font-serif">From One to the Pentagon</h1>
          <p>The CMGF Signal at Scale — How individual advisory sessions become privacy-safe institutional intelligence</p>
        </header>

        {/* Canvas Area */}
        <div className="canvas-wrapper">
          <canvas ref={canvasRef}></canvas>
        </div>

        {/* Enhanced Control Bar */}
        <div className="controls-bar">
          <button className="play-btn" onClick={togglePlay}>
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          <button className="replay-btn" onClick={() => setTime(0)}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          </button>
          
          <div className="progress-container">
            <div className="time-display font-mono">{formatTime(time)}</div>
            <div className="progress-track" onClick={handleSeek}>
              <div 
                className="progress-fill" 
                style={{ width: `${(time / DURATION) * 100}%` }}
              ></div>
            </div>
            <div className="time-display font-mono">{formatTime(DURATION)}</div>
          </div>
          
          <div className="font-mono text-dim" style={{fontSize: '0.85rem'}}>
            {activeAct.title}
          </div>
        </div>

        {/* Act Cards */}
        <div className="acts-grid">
          {ACTS.map((act) => (
            <div 
              key={act.id} 
              className={`act-card ${activeAct.id === act.id ? 'active' : ''}`}
              onClick={() => {
                setTime(act.start);
                setIsPlaying(true);
              }}
              style={{cursor: 'pointer'}}
            >
              <h4 className="font-mono">{act.label}</h4>
              <h2>{act.title}</h2>
              <div className="time-range">
                {formatTime(act.start)} - {formatTime(act.end)}
              </div>
              <p>{act.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer>
        For conference use: Use fullscreen mode and press play. The animation runs 45 seconds then loops automatically — no interaction needed.
      </footer>
    </div>
  );
}
