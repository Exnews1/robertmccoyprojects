import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "wouter";
import { Play, Pause, RotateCcw, Maximize, Minimize, ChevronRight } from "lucide-react";

const COLORS = {
  bg: "#0d1117",
  node: "#fbbf24",
  engine: "#f97316",
  isr: "#94a3b8",
  command: "#d97706",
  approved: "#22c55e",
  text: "#ffffff",
  textDim: "#94a3b8",
  border: "rgba(201,168,76,0.3)",
};

const DURATION = 75;
const ACT_TIMES = [0, 12, 25, 55, 75];

interface Node {
  x: number;
  y: number;
  label: string;
  color: string;
  size: number;
  opacity: number;
  glow?: number;
}

interface Signal {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  progress: number;
  color: string;
  width: number;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function drawGlowCircle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, glow: number) {
  if (glow > 0) {
    const gradient = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 3);
    gradient.addColorStop(0, color + Math.round(glow * 60).toString(16).padStart(2, '0'));
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, r * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawHexagon(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, fillOpacity: number, glow: number) {
  const sides = 6;
  if (glow > 0) {
    const gradient = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 2.5);
    gradient.addColorStop(0, color + Math.round(glow * 50).toString(16).padStart(2, '0'));
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const px = x + r * Math.cos(angle);
    const py = y + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = color + Math.round(fillOpacity * 255).toString(16).padStart(2, '0');
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawPentagon(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, borderColor: string, glow: number) {
  const sides = 5;
  if (glow > 0) {
    const gradient = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 3);
    gradient.addColorStop(0, borderColor + Math.round(glow * 40).toString(16).padStart(2, '0'));
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, r * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI * 2 / sides) * i - Math.PI / 2;
    const px = x + r * Math.cos(angle);
    const py = y + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = COLORS.bg;
  ctx.fill();
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawLabel(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string, size: number, opacity: number) {
  if (opacity <= 0) return;
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.font = `${size}px 'JetBrains Mono', 'Courier New', monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawSignalLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, opacity: number, width: number) {
  if (opacity <= 0) return;
  ctx.save();
  ctx.globalAlpha = opacity * 0.4;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function drawSignalDot(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, progress: number, color: string, size: number) {
  if (progress < 0 || progress > 1) return;
  const x = lerp(x1, x2, progress);
  const y = lerp(y1, y2, progress);

  const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, "transparent");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, size * 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
}

function drawBadge(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string, opacity: number) {
  if (opacity <= 0) return;
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.font = "bold 9px 'JetBrains Mono', monospace";
  const w = ctx.measureText(text).width + 14;
  const h = 18;
  ctx.fillStyle = color + "30";
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x - w / 2, y - h / 2, w, h, 3);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawDocIcon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, fillProgress: number, opacity: number) {
  if (opacity <= 0) return;
  ctx.save();
  ctx.globalAlpha = opacity;
  const w = size * 0.7;
  const h = size;
  const fold = size * 0.2;

  ctx.beginPath();
  ctx.moveTo(x - w / 2, y - h / 2);
  ctx.lineTo(x + w / 2 - fold, y - h / 2);
  ctx.lineTo(x + w / 2, y - h / 2 + fold);
  ctx.lineTo(x + w / 2, y + h / 2);
  ctx.lineTo(x - w / 2, y + h / 2);
  ctx.closePath();
  ctx.fillStyle = COLORS.bg;
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const lines = Math.floor(fillProgress * 4);
  for (let i = 0; i < lines; i++) {
    const ly = y - h / 2 + fold + 6 + i * 6;
    const lw = w * 0.6 - (i % 2 === 0 ? 0 : w * 0.15);
    ctx.fillStyle = color + "80";
    ctx.fillRect(x - w / 2 + 5, ly, lw, 2);
  }

  ctx.restore();
}

function drawPersonIcon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y - size * 0.35, size * 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x, y + size * 0.1, size * 0.35, size * 0.3, 0, Math.PI, 0, true);
  ctx.fill();
}

export default function SignalFlowAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentAct, setCurrentAct] = useState(0);

  const getAct = (t: number) => {
    if (t < ACT_TIMES[1]) return 1;
    if (t < ACT_TIMES[2]) return 2;
    if (t < ACT_TIMES[3]) return 3;
    return 4;
  };

  const render = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;

    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, W, H);

    const elapsed = time;
    const act = getAct(elapsed);

    const smX = W * 0.15;
    const smY = H * 0.55;
    const engineX = W * 0.45;
    const engineY = H * 0.45;
    const esoX = W * 0.72;
    const esoY = H * 0.25;
    const isrX = W * 0.72;
    const isrY = H * 0.65;
    const cmdX = W * 0.55;
    const cmdY = H * 0.18;
    const hqX = W * 0.72;
    const hqY = H * 0.12;
    const pentX = W * 0.85;
    const pentY = H * 0.25;

    if (act >= 1) {
      const actT = Math.min(1, elapsed / ACT_TIMES[1]);

      const smAppear = easeOut(Math.min(1, actT * 4));
      if (smAppear > 0) {
        const pulse = 0.5 + 0.5 * Math.sin(elapsed * 2);
        drawGlowCircle(ctx, smX, smY, 14, COLORS.node, smAppear * pulse * 0.8);
        drawPersonIcon(ctx, smX, smY, 14, COLORS.text);
        drawLabel(ctx, "SERVICE MEMBER", smX, smY + 22, COLORS.textDim, 10, smAppear);
      }

      const signalStart = 0.25;
      const signalEnd = 0.6;
      const signalP = Math.max(0, Math.min(1, (actT - signalStart) / (signalEnd - signalStart)));
      if (signalP > 0) {
        drawSignalLine(ctx, smX, smY, engineX, engineY, COLORS.node, signalP, 1.5);
        if (signalP < 1) {
          drawSignalDot(ctx, smX, smY, engineX, engineY, easeInOut(signalP), COLORS.node, 4);
        }
      }

      const hexAppear = Math.max(0, Math.min(1, (actT - 0.5) / 0.15));
      if (hexAppear > 0) {
        const flashPhase = Math.max(0, (actT - 0.65) / 0.25);
        const flashCount = Math.floor(flashPhase * 3);
        const flashGlow = flashPhase > 0 && flashPhase < 1 ? 0.3 + 0.7 * Math.abs(Math.sin(flashCount * Math.PI)) : (flashPhase >= 1 ? 0.5 : 0.2);
        drawHexagon(ctx, engineX, engineY, 32, COLORS.engine, hexAppear * 0.3, hexAppear * flashGlow);
        drawLabel(ctx, "CMGF CONSTRAINT", engineX, engineY + 40, COLORS.textDim, 9, hexAppear);
        drawLabel(ctx, "ENGINE", engineX, engineY + 52, COLORS.textDim, 9, hexAppear);
      }

      const outputP = Math.max(0, (actT - 0.9) / 0.1);
      if (outputP > 0) {
        drawSignalLine(ctx, engineX, engineY, esoX, esoY, COLORS.node, outputP * 0.5, 1);
        drawSignalLine(ctx, engineX, engineY, isrX, isrY, COLORS.isr, outputP * 0.5, 1);
      }
    }

    if (act >= 2) {
      const act2Start = ACT_TIMES[1];
      const act2Dur = ACT_TIMES[2] - ACT_TIMES[1];
      const act2T = Math.min(1, (elapsed - act2Start) / act2Dur);

      const esoSignalP = easeOut(Math.min(1, act2T * 3));
      if (esoSignalP > 0) {
        drawSignalLine(ctx, engineX, engineY, esoX, esoY, COLORS.node, 0.6, 1.5);
        drawSignalDot(ctx, engineX, engineY, esoX, esoY, esoSignalP, COLORS.node, 4);
      }

      const esoAppear = Math.max(0, Math.min(1, (act2T - 0.25) / 0.1));
      if (esoAppear > 0) {
        drawGlowCircle(ctx, esoX, esoY, 12, COLORS.node, esoAppear * 0.6);
        drawLabel(ctx, "ESO", esoX, esoY + 18, COLORS.node, 11, esoAppear);
      }

      const returnP = Math.max(0, Math.min(1, (act2T - 0.35) / 0.25));
      if (returnP > 0) {
        drawSignalLine(ctx, esoX, esoY, smX, smY - 20, COLORS.approved, returnP * 0.5, 1);
        if (returnP < 1) {
          drawSignalDot(ctx, esoX, esoY, smX, smY - 20, easeOut(returnP), COLORS.approved, 3);
        }
      }

      const badgeP = Math.max(0, Math.min(1, (act2T - 0.6) / 0.1));
      drawBadge(ctx, "TA APPROVED", smX + 55, smY - 20, COLORS.approved, badgeP);
      drawBadge(ctx, "COOL CERTIFICATION", smX + 55, smY - 0, COLORS.node, Math.max(0, Math.min(1, (act2T - 0.65) / 0.1)));

      const isrSignalP = easeOut(Math.min(1, act2T * 2.5));
      if (isrSignalP > 0) {
        drawSignalLine(ctx, engineX, engineY, isrX, isrY, COLORS.isr, 0.5, 1.5);
        if (isrSignalP < 1) {
          drawSignalDot(ctx, engineX, engineY, isrX, isrY, isrSignalP, COLORS.isr, 4);
        }
      }

      const isrAppear = Math.max(0, Math.min(1, (act2T - 0.4) / 0.15));
      if (isrAppear > 0) {
        const fillP = Math.max(0, Math.min(1, (act2T - 0.55) / 0.3));
        drawDocIcon(ctx, isrX, isrY, 30, COLORS.isr, fillP, isrAppear);
        drawLabel(ctx, "ISR REPORT", isrX, isrY + 22, COLORS.isr, 10, isrAppear);
      }
    }

    if (act >= 3) {
      const act3Start = ACT_TIMES[2];
      const act3Dur = ACT_TIMES[3] - ACT_TIMES[2];
      const act3T = Math.min(1, (elapsed - act3Start) / act3Dur);

      const scaleReveal = easeOut(Math.min(1, act3T * 1.5));
      const nodeCount = Math.floor(lerp(1, 60, scaleReveal));
      const seed = 42;

      for (let i = 0; i < nodeCount; i++) {
        const hash = ((seed + i * 127) % 997) / 997;
        const hash2 = ((seed + i * 251) % 991) / 991;
        const nx = W * 0.05 + hash * W * 0.35;
        const ny = H * 0.15 + hash2 * H * 0.7;
        const pulse = 0.4 + 0.6 * Math.sin(elapsed * 1.5 + i * 0.5);

        if (i === 0) continue;

        ctx.globalAlpha = Math.min(1, scaleReveal * 2 - i / nodeCount);
        if (ctx.globalAlpha > 0) {
          drawGlowCircle(ctx, nx, ny, 4, COLORS.node, pulse * 0.3);

          const hx = nx + (engineX - smX) * 0.4 + hash * 30;
          const hy = ny + (engineY - smY) * 0.3 + hash2 * 20;
          drawSignalLine(ctx, nx, ny, hx, hy, COLORS.node, 0.2, 0.5);
          drawHexagon(ctx, hx, hy, 8, COLORS.engine, 0.2, pulse * 0.15);
        }
        ctx.globalAlpha = 1;
      }

      const streamP = Math.max(0, Math.min(1, (act3T - 0.3) / 0.4));
      if (streamP > 0) {
        drawGlowCircle(ctx, cmdX, cmdY, 16, COLORS.command, streamP * 0.7);
        drawLabel(ctx, "INSTALLATION", cmdX, cmdY + 24, COLORS.command, 9, streamP);
        drawLabel(ctx, "COMMAND", cmdX, cmdY + 35, COLORS.command, 9, streamP);

        for (let i = 0; i < Math.floor(streamP * 8); i++) {
          const hash = ((seed + i * 173) % 997) / 997;
          const sx = W * 0.1 + hash * W * 0.4;
          const sy = H * 0.35 + hash * H * 0.3;
          const sp = Math.max(0, Math.min(1, (streamP - i * 0.1) * 3));
          if (sp > 0) {
            ctx.save();
            ctx.globalAlpha = sp * 0.3;
            ctx.strokeStyle = COLORS.isr;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.quadraticCurveTo(sx + (cmdX - sx) * 0.5, sy - 30, cmdX, cmdY);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      const hqP = Math.max(0, Math.min(1, (act3T - 0.65) / 0.2));
      if (hqP > 0) {
        drawSignalLine(ctx, cmdX, cmdY, hqX, hqY, COLORS.command, hqP * 0.6, 2);
        if (hqP < 1) {
          drawSignalDot(ctx, cmdX, cmdY, hqX, hqY, easeOut(hqP), COLORS.command, 5);
        }
        drawGlowCircle(ctx, hqX, hqY, 14, COLORS.command, hqP * 0.5);
        drawLabel(ctx, "SERVICE BRANCH HQ", hqX, hqY + 20, COLORS.command, 9, hqP);
      }

      const riverP = Math.max(0, Math.min(1, (act3T - 0.8) / 0.2));
      if (riverP > 0) {
        const grad = ctx.createLinearGradient(hqX, hqY, pentX, pentY);
        grad.addColorStop(0, COLORS.command + "60");
        grad.addColorStop(1, COLORS.engine + "30");
        ctx.save();
        ctx.globalAlpha = riverP * 0.5;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 4 + riverP * 4;
        ctx.beginPath();
        ctx.moveTo(hqX, hqY);
        ctx.quadraticCurveTo((hqX + pentX) / 2, hqY - 10, pentX, pentY);
        ctx.stroke();
        ctx.restore();
      }
    }

    if (act >= 4) {
      const act4Start = ACT_TIMES[3];
      const act4Dur = ACT_TIMES[4] - ACT_TIMES[3];
      const act4T = Math.min(1, (elapsed - act4Start) / act4Dur);

      const convergeP = easeOut(Math.min(1, act4T * 2));
      const streamCount = Math.floor(convergeP * 12);
      for (let i = 0; i < streamCount; i++) {
        const angle = (Math.PI * 2 / 12) * i;
        const dist = W * 0.35;
        const sx = pentX + Math.cos(angle) * dist;
        const sy = pentY + Math.sin(angle) * dist;
        const sp = Math.max(0, Math.min(1, convergeP - i * 0.05));

        if (sp > 0) {
          ctx.save();
          const grad = ctx.createLinearGradient(sx, sy, pentX, pentY);
          grad.addColorStop(0, COLORS.node + "10");
          grad.addColorStop(0.5, COLORS.command + "40");
          grad.addColorStop(1, COLORS.engine + "60");
          ctx.globalAlpha = sp * 0.4;
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2 + sp * 2;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(pentX, pentY);
          ctx.stroke();
          ctx.restore();

          if (sp < 0.95) {
            drawSignalDot(ctx, sx, sy, pentX, pentY, sp, COLORS.node, 3);
          }
        }
      }

      const pentAppear = Math.max(0, Math.min(1, (act4T - 0.3) / 0.15));
      if (pentAppear > 0) {
        const pentGlow = pentAppear * (0.5 + 0.5 * Math.sin(elapsed * 1.5));
        drawPentagon(ctx, pentX, pentY, 38, COLORS.engine, pentGlow);
        drawLabel(ctx, "DEPARTMENT OF DEFENSE", pentX, pentY + 48, COLORS.text, 9, pentAppear);
        drawLabel(ctx, "POLICY LAYER", pentX, pentY + 60, COLORS.textDim, 9, pentAppear);
      }

      const docP = Math.max(0, Math.min(1, (act4T - 0.5) / 0.15));
      if (docP > 0) {
        drawDocIcon(ctx, pentX, pentY, 22, COLORS.engine, docP, docP);
        drawLabel(ctx, "POLICY SIGNAL", pentX, pentY + 18, COLORS.engine, 8, docP * 0.8);
      }

      const textP = Math.max(0, Math.min(1, (act4T - 0.7) / 0.15));
      if (textP > 0) {
        ctx.save();
        ctx.globalAlpha = textP;

        const panelW = W * 0.6;
        const panelH = 60;
        const panelX = W / 2 - panelW / 2;
        const panelY = H * 0.78;

        ctx.fillStyle = COLORS.bg + "e0";
        ctx.fillRect(panelX, panelY, panelW, panelH);
        ctx.strokeStyle = COLORS.border;
        ctx.lineWidth = 1;
        ctx.strokeRect(panelX, panelY, panelW, panelH);

        ctx.fillStyle = COLORS.text;
        ctx.font = "italic 13px 'Merriweather', Georgia, serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("One governed signal. Thousands of pathways. One national picture.", W / 2, panelY + panelH / 2);
        ctx.restore();
      }

      const fadeP = Math.max(0, Math.min(1, (act4T - 0.92) / 0.08));
      if (fadeP > 0) {
        ctx.save();
        ctx.globalAlpha = fadeP;
        ctx.fillStyle = COLORS.bg;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }
    }

    const actLabel = ["", "ACT I — THE INDIVIDUAL", "ACT II — THE RETURN LOOP", "ACT III — THE SCALE REVEAL", "ACT IV — THE PENTAGON"][act];
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = COLORS.textDim;
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(actLabel, 16, 16);
    ctx.restore();
  }, []);

  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = pausedAtRef.current + (timestamp - startTimeRef.current) / 1000;

    if (elapsed >= DURATION) {
      setPlaying(false);
      setCurrentTime(DURATION);
      setCurrentAct(4);
      render(DURATION);
      return;
    }

    setCurrentTime(elapsed);
    setCurrentAct(getAct(elapsed));
    render(elapsed);
    animRef.current = requestAnimationFrame(animate);
  }, [render]);

  const play = useCallback(() => {
    if (currentTime >= DURATION) {
      pausedAtRef.current = 0;
    }
    startTimeRef.current = 0;
    setPlaying(true);
  }, [currentTime]);

  const pause = useCallback(() => {
    pausedAtRef.current = currentTime;
    startTimeRef.current = 0;
    setPlaying(false);
    cancelAnimationFrame(animRef.current);
  }, [currentTime]);

  const reset = useCallback(() => {
    pausedAtRef.current = 0;
    startTimeRef.current = 0;
    setPlaying(false);
    setCurrentTime(0);
    setCurrentAct(0);
    cancelAnimationFrame(animRef.current);
    render(0);
  }, [render]);

  useEffect(() => {
    if (playing) {
      animRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [playing, animate]);

  useEffect(() => {
    render(0);
  }, [render]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFs);
    return () => document.removeEventListener("fullscreenchange", handleFs);
  }, []);

  const progressPct = (currentTime / DURATION) * 100;

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg, color: COLORS.text }}>
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        <nav className="mb-4 text-sm flex items-center flex-wrap gap-1">
          <Link href="/research" className="transition-colors" style={{ color: COLORS.textDim }}>
            Portfolio
          </Link>
          <ChevronRight className="h-4 w-4" style={{ color: COLORS.textDim }} />
          <Link href="/research/cmgf" className="transition-colors" style={{ color: COLORS.textDim }}>
            CMGF
          </Link>
          <ChevronRight className="h-4 w-4" style={{ color: COLORS.textDim }} />
          <span style={{ color: COLORS.text }}>Signal Flow Animation</span>
        </nav>

        <div className="text-center mb-6">
          <div className="text-[10px] font-mono tracking-[3px] uppercase mb-2" style={{ color: COLORS.node }}>
            Cinematic Visualization
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-light tracking-tight mb-2">
            From One to the Pentagon
          </h1>
          <p className="text-xs max-w-lg mx-auto" style={{ color: COLORS.textDim }}>
            The CMGF Signal at Scale — How a single service member request becomes a national policy signal
          </p>
        </div>
      </div>

      <div ref={containerRef} className="relative mx-auto" style={{ maxWidth: 1200, background: COLORS.bg }}>
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ aspectRatio: "16/9", display: "block" }}
          data-testid="canvas-animation"
        />

        <div className="absolute bottom-0 left-0 right-0 p-3" style={{ background: 'linear-gradient(transparent, rgba(13,17,23,0.95))' }}>
          <div className="flex items-center gap-3 max-w-[1100px] mx-auto">
            <button
              onClick={playing ? pause : play}
              className="flex items-center justify-center w-9 h-9 rounded-full transition-colors"
              style={{ background: 'rgba(251,191,36,0.15)', border: `1px solid ${COLORS.node}` }}
              data-testid="button-play-pause"
            >
              {playing ? <Pause className="h-4 w-4" style={{ color: COLORS.node }} /> : <Play className="h-4 w-4 ml-0.5" style={{ color: COLORS.node }} />}
            </button>

            <button
              onClick={reset}
              className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
              style={{ background: 'rgba(148,163,184,0.1)' }}
              data-testid="button-reset"
            >
              <RotateCcw className="h-3.5 w-3.5" style={{ color: COLORS.textDim }} />
            </button>

            <div className="flex-1 mx-2">
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(148,163,184,0.15)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${progressPct}%`, background: `linear-gradient(90deg, ${COLORS.node}, ${COLORS.engine})` }}
                  data-testid="progress-bar"
                />
              </div>
              <div className="flex justify-between mt-1 text-[9px] font-mono" style={{ color: COLORS.textDim }}>
                <span>{Math.floor(currentTime)}s / {DURATION}s</span>
                <span>
                  {["Ready", "Act I — The Individual", "Act II — The Return Loop", "Act III — The Scale Reveal", "Act IV — The Pentagon"][currentAct]}
                </span>
              </div>
            </div>

            <button
              onClick={toggleFullscreen}
              className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
              style={{ background: 'rgba(148,163,184,0.1)' }}
              data-testid="button-fullscreen"
            >
              {isFullscreen ? <Minimize className="h-3.5 w-3.5" style={{ color: COLORS.textDim }} /> : <Maximize className="h-3.5 w-3.5" style={{ color: COLORS.textDim }} />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { act: "Act I", title: "The Individual", time: "0:00 – 0:12", desc: "A single service member initiates a request. The governed AI evaluates it." },
            { act: "Act II", title: "The Return Loop", time: "0:12 – 0:25", desc: "The system closes the loop. The human gets an answer. The institution gets a record." },
            { act: "Act III", title: "The Scale Reveal", time: "0:25 – 0:55", desc: "Every individual transaction feeds the institutional record. Data flows upward through command structure." },
            { act: "Act IV", title: "The Pentagon", time: "0:55 – 1:15", desc: "The CMGF is not an advising tool. It is a national governance infrastructure." },
          ].map((a, i) => (
            <div key={i} className="p-4" style={{ background: 'rgba(17,34,64,0.5)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 4 }}>
              <div className="text-[9px] font-mono tracking-[2px] uppercase mb-1" style={{ color: COLORS.node }}>{a.act}</div>
              <div className="text-sm font-serif mb-1" style={{ color: COLORS.text }}>{a.title}</div>
              <div className="text-[10px] font-mono mb-2" style={{ color: COLORS.textDim }}>{a.time}</div>
              <p className="text-xs leading-relaxed" style={{ color: COLORS.textDim }}>{a.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 text-center" style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 4 }}>
          <p className="text-xs font-mono" style={{ color: COLORS.textDim }}>
            For conference use: Enter fullscreen mode and press play. The animation runs {DURATION} seconds with no interaction needed.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/research/cmgf">
            <button className="px-3 py-1.5 text-xs font-mono tracking-wide cursor-pointer transition-colors" style={{ background: 'transparent', border: '1px solid rgba(201,168,76,0.2)', color: COLORS.textDim, borderRadius: 2 }}>
              CMGF Main
            </button>
          </Link>
          <Link href="/research/career-advisor">
            <button className="px-3 py-1.5 text-xs font-mono tracking-wide cursor-pointer transition-colors" style={{ background: 'transparent', border: '1px solid rgba(201,168,76,0.2)', color: COLORS.textDim, borderRadius: 2 }}>
              Career Advisor
            </button>
          </Link>
          <Link href="/research/demo">
            <button className="px-3 py-1.5 text-xs font-mono tracking-wide cursor-pointer transition-colors" style={{ background: 'transparent', border: '1px solid rgba(201,168,76,0.2)', color: COLORS.textDim, borderRadius: 2 }}>
              Demo Mode
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
