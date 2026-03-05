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
  pure: "#ffffff",
};

const DURATION = 75;
const ACT_TIMES = [0, 15, 30, 55, 75];

const NARRATIONS = [
  "A service member submits a career transition request. The CMGF constraint engine evaluates it against policy rules in real time.",
  "The system returns a governed response. Tuition Assistance is approved. A COOL certification pathway is confirmed. An ISR record is generated for the institution.",
  "Across thousands of installations, the same governed process repeats. Individual signals aggregate upward through command structure without exposing any individual.",
  "The totality of the system reaches the Department of Defense as a unified policy signal. One governed architecture. National scale.",
];

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
  ctx.font = "bold 14px 'JetBrains Mono', monospace";
  const w = ctx.measureText(text).width + 20;
  const h = 26;
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

function drawBouncingSignal(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, elapsed: number, speed: number, color1: string, color2: string, opacity: number) {
  if (opacity <= 0) return;
  const cycle = (elapsed * speed) % 2;
  const forward = cycle < 1;
  const p = forward ? easeInOut(cycle) : easeInOut(cycle - 1);
  const fromX = forward ? x1 : x2;
  const fromY = forward ? y1 : y2;
  const toX = forward ? x2 : x1;
  const toY = forward ? y2 : y1;
  const color = forward ? color1 : color2;

  ctx.save();
  ctx.globalAlpha = opacity;
  drawSignalLine(ctx, x1, y1, x2, y2, color1, 0.4, 1.5);
  ctx.restore();
  drawSignalDot(ctx, fromX, fromY, toX, toY, p, color, 5);
}

function drawTrunkBeam(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, width: number, color: string, opacity: number, glowRadius: number) {
  if (opacity <= 0) return;
  ctx.save();

  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  gradient.addColorStop(0, color + Math.round(opacity * 200).toString(16).padStart(2, '0'));
  gradient.addColorStop(1, color + Math.round(opacity * 120).toString(16).padStart(2, '0'));

  if (glowRadius > 0) {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const glow = ctx.createRadialGradient(mx, my, 0, mx, my, glowRadius);
    glow.addColorStop(0, color + Math.round(opacity * 30).toString(16).padStart(2, '0'));
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(mx, my, glowRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = gradient;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.restore();
}

function drawProcessLabel(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string, bgColor: string, opacity: number) {
  if (opacity <= 0) return;
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.font = "bold 13px 'JetBrains Mono', monospace";
  const w = ctx.measureText(text).width + 24;
  const h = 28;
  ctx.fillStyle = bgColor;
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

function drawNarrationPanel(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, opacity: number, charCount: number) {
  if (opacity <= 0 || charCount <= 0) return;
  const displayText = text.substring(0, charCount);
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.font = "16px 'Inter', sans-serif";

  const words = displayText.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxW - 40) {
      if (line) lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);

  const lineHeight = 24;
  const panelH = lines.length * lineHeight + 30;
  const panelW = maxW;

  ctx.fillStyle = "#0d1117cc";
  ctx.beginPath();
  ctx.roundRect(x - panelW / 2, y, panelW, panelH, 6);
  ctx.fill();
  ctx.strokeStyle = "#fbbf2466";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = COLORS.text;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < lines.length; i++) {
    const ly = y + 15 + lineHeight * (i + 0.5);
    ctx.fillText(lines[i], x, ly);
  }
  ctx.restore();
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

    const smX = W * 0.1;
    const smY = H * 0.5;
    const engineX = W * 0.38;
    const engineY = H * 0.5;
    const esoX = W * 0.65;
    const esoY = H * 0.5;
    const pentX = W * 0.5;
    const pentY = H * 0.18;

    const hash = (i: number, s: number) => ((s + i * 127 + i * i * 13) % 997) / 997;
    const hash2 = (i: number, s: number) => ((s + i * 251 + i * i * 7) % 991) / 991;

    // ─── TITLE CARD: Visible before Act I begins animating ───
    if (elapsed < 3) {
      const titleP = elapsed < 0.5 ? elapsed / 0.5 : (elapsed < 2.5 ? 1 : 1 - (elapsed - 2.5) / 0.5);
      ctx.save();
      ctx.globalAlpha = Math.max(0, titleP);
      ctx.fillStyle = COLORS.text;
      ctx.font = "bold 28px 'Merriweather', Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("From One to the Pentagon", W / 2, H * 0.4);
      ctx.font = "16px 'Inter', sans-serif";
      ctx.fillStyle = COLORS.textDim;
      ctx.fillText("The CMGF Signal at Scale", W / 2, H * 0.4 + 40);
      ctx.restore();
    }

    // ─── ACT I: Single SM, back-and-forth with AI, thick hot signal to ESO ───
    if (act >= 1) {
      const actT = Math.min(1, elapsed / ACT_TIMES[1]);

      const contextAppear = easeOut(Math.min(1, actT * 3));
      if (contextAppear > 0) {
        ctx.save();
        ctx.globalAlpha = contextAppear * 0.4;
        ctx.fillStyle = COLORS.textDim;
        ctx.font = "14px 'JetBrains Mono', monospace";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("0200 HRS · UNDISCLOSED LOCATION", W * 0.03, H * 0.06);
        ctx.restore();
      }

      const smAppear = easeOut(Math.min(1, actT * 4));
      if (smAppear > 0) {
        const pulse = 0.5 + 0.5 * Math.sin(elapsed * 2);
        drawGlowCircle(ctx, smX, smY, 28, COLORS.node, smAppear * pulse * 0.8);
        drawPersonIcon(ctx, smX, smY, 28, COLORS.text);
        drawLabel(ctx, "DEPLOYED SM", smX, smY + 40, COLORS.textDim, 16, smAppear);
      }

      const signalToAI = Math.max(0, Math.min(1, (actT - 0.15) / 0.1));
      if (signalToAI > 0) {
        drawSignalLine(ctx, smX, smY, engineX, engineY, COLORS.node, signalToAI, 2);
        if (signalToAI < 1) {
          drawSignalDot(ctx, smX, smY, engineX, engineY, easeInOut(signalToAI), COLORS.node, 6);
        }
      }

      const hexAppear = Math.max(0, Math.min(1, (actT - 0.2) / 0.08));
      if (hexAppear > 0) {
        const flashGlow = 0.3 + 0.3 * Math.sin(elapsed * 3);
        drawHexagon(ctx, engineX, engineY, 55, COLORS.engine, hexAppear * 0.3, hexAppear * flashGlow);
        drawLabel(ctx, "CMGF AI", engineX, engineY + 65, COLORS.textDim, 16, hexAppear);
        drawLabel(ctx, "ENGINE", engineX, engineY + 82, COLORS.textDim, 14, hexAppear);
      }

      const bounceStart = 0.28;
      const bounceEnd = 0.68;
      const bounceP = Math.max(0, Math.min(1, (actT - bounceStart) / (bounceEnd - bounceStart)));
      if (bounceP > 0) {
        const bounceElapsed = (actT - bounceStart) * ACT_TIMES[1];
        for (let lane = -1; lane <= 1; lane++) {
          const yOff = lane * 14;
          const speed = 1.6 + lane * 0.3;
          const delay = Math.abs(lane) * 0.15;
          const laneP = Math.max(0, bounceP - delay);
          if (laneP > 0) {
            drawBouncingSignal(ctx, smX + 28, smY + yOff, engineX - 55, engineY + yOff, bounceElapsed, speed, COLORS.node, COLORS.engine, laneP * 0.7);
          }
        }

        const exchangeLabel = Math.max(0, Math.min(1, (bounceP - 0.2) / 0.15));
        if (exchangeLabel > 0) {
          const midX = (smX + engineX) / 2;
          drawLabel(ctx, "BACK & FORTH", midX, smY - 55, COLORS.textDim, 14, exchangeLabel * 0.6);
          drawLabel(ctx, "ADVISORY EXCHANGE", midX, smY - 38, COLORS.textDim, 14, exchangeLabel * 0.6);
        }
      }

      const esoReportP = Math.max(0, Math.min(1, (actT - 0.7) / 0.15));
      if (esoReportP > 0) {
        const hotGlow = esoReportP * (0.6 + 0.4 * Math.sin(elapsed * 4));
        const beamWidth = 3 + esoReportP * 8;
        drawTrunkBeam(ctx, engineX + 55, engineY, esoX, esoY, beamWidth, COLORS.engine, hotGlow, 40 * esoReportP);
        if (esoReportP < 1) {
          drawSignalDot(ctx, engineX + 55, engineY, esoX, esoY, easeOut(esoReportP), COLORS.engine, 7);
        }
      }

      const esoAppear = Math.max(0, Math.min(1, (actT - 0.82) / 0.08));
      if (esoAppear > 0) {
        const esoGlow = esoAppear * (0.5 + 0.5 * Math.sin(elapsed * 3));
        drawGlowCircle(ctx, esoX, esoY, 30, COLORS.node, esoGlow);
        drawLabel(ctx, "ESO", esoX, esoY - 44, COLORS.node, 18, esoAppear);
        drawDocIcon(ctx, esoX, esoY, 36, COLORS.node, esoAppear, esoAppear);
        drawLabel(ctx, "ACTIVITY REPORT", esoX, esoY + 36, COLORS.textDim, 14, esoAppear);
      }

      const esoAiBounce = Math.max(0, Math.min(1, (actT - 0.88) / 0.1));
      if (esoAiBounce > 0) {
        drawBouncingSignal(ctx, engineX + 55, engineY - 10, esoX - 30, esoY - 10, elapsed, 2.0, COLORS.engine, COLORS.node, esoAiBounce * 0.5);
        drawLabel(ctx, "ESO ↔ AI COORDINATION", (engineX + esoX) / 2, esoY + 55, COLORS.textDim, 12, esoAiBounce * 0.5);
      }

      const badgeP = Math.max(0, Math.min(1, (actT - 0.93) / 0.05));
      if (badgeP > 0) {
        drawBadge(ctx, "SM SESSION COMPLETE", (smX + engineX) / 2, smY + 75, COLORS.approved, badgeP);
      }
    }

    // ─── ACT II: Hundreds of SMs, multiple ESOs at each base, heavy traffic ───
    if (act >= 2) {
      const act2Start = ACT_TIMES[1];
      const act2Dur = ACT_TIMES[2] - ACT_TIMES[1];
      const act2T = Math.min(1, (elapsed - act2Start) / act2Dur);

      const maxSM = 150;
      const smCount = Math.floor(lerp(3, maxSM, easeOut(Math.min(1, act2T * 1.8))));

      for (let i = 0; i < smCount; i++) {
        const nx = W * 0.02 + hash(i, 42) * W * 0.22;
        const ny = H * 0.05 + hash2(i, 42) * H * 0.9;
        const nodeOpacity = Math.min(1, (act2T * 1.8) - i / maxSM * 0.3);
        if (nodeOpacity <= 0) continue;

        ctx.save();
        ctx.globalAlpha = nodeOpacity * 0.8;
        const sz = i < 20 ? 6 : (i < 60 ? 4 : 3);
        const pulse = 0.3 + 0.7 * Math.sin(elapsed * 1.2 + i * 0.4);
        drawGlowCircle(ctx, nx, ny, sz, COLORS.node, pulse * 0.2);

        if (i < 40) {
          const bounceActive = act2T > 0.1 + (i * 0.005);
          if (bounceActive) {
            const bounceElapsed = elapsed - act2Start - (0.1 + i * 0.005) * act2Dur;
            if (bounceElapsed > 0) {
              const targetY = engineY + (hash(i, 99) - 0.5) * H * 0.4;
              ctx.globalAlpha = nodeOpacity * 0.3;
              ctx.strokeStyle = COLORS.node;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(nx, ny);
              ctx.lineTo(engineX - 55, targetY);
              ctx.stroke();
              const sp = ((bounceElapsed * (0.8 + hash(i, 77) * 0.6)) % 2);
              const forward = sp < 1;
              const p = forward ? easeInOut(sp) : easeInOut(sp - 1);
              const dotColor = forward ? COLORS.node : COLORS.engine;
              const dx = forward ? lerp(nx, engineX - 55, p) : lerp(engineX - 55, nx, p);
              const dy = forward ? lerp(ny, targetY, p) : lerp(targetY, ny, p);
              drawGlowCircle(ctx, dx, dy, 3, dotColor, 0.5);
            }
          }
        } else {
          ctx.globalAlpha = nodeOpacity * 0.15;
          ctx.strokeStyle = COLORS.node;
          ctx.lineWidth = 0.3;
          ctx.beginPath();
          ctx.moveTo(nx, ny);
          ctx.lineTo(engineX - 55, engineY + (hash(i, 55) - 0.5) * H * 0.3);
          ctx.stroke();
        }
        ctx.restore();
      }

      const hexGlow = 0.5 + 0.4 * Math.sin(elapsed * 3);
      const hexSize = 55 + Math.min(12, act2T * 14);
      drawHexagon(ctx, engineX, engineY, hexSize, COLORS.engine, 0.4, hexGlow);
      drawLabel(ctx, "CMGF AI", engineX, engineY + hexSize + 12, COLORS.textDim, 16, 1);
      drawLabel(ctx, "ENGINE", engineX, engineY + hexSize + 30, COLORS.textDim, 14, 1);

      const esoReportsP = Math.max(0, Math.min(1, (act2T - 0.25) / 0.35));
      if (esoReportsP > 0) {
        const esoHotGlow = esoReportsP * (0.6 + 0.4 * Math.sin(elapsed * 4));
        const beamWidth = 4 + esoReportsP * 10;
        drawTrunkBeam(ctx, engineX + hexSize, engineY, esoX - 30, esoY, beamWidth, COLORS.engine, esoHotGlow, 60 * esoReportsP);

        for (let i = 0; i < Math.floor(esoReportsP * 4); i++) {
          const sp = ((elapsed * 1.5 + i * 0.6) % 1);
          drawSignalDot(ctx, engineX + hexSize, engineY + (i - 2) * 8, esoX - 30, esoY + (i - 2) * 5, sp, COLORS.engine, 4);
        }

        drawGlowCircle(ctx, esoX, esoY, 30, COLORS.node, esoHotGlow);
        drawLabel(ctx, "ESO", esoX, esoY - 42, COLORS.node, 18, esoReportsP);

        const docStack = Math.min(6, Math.floor(esoReportsP * 8));
        for (let i = 0; i < docStack; i++) {
          drawDocIcon(ctx, esoX + i * 4, esoY - i * 3, 24, COLORS.node, 1, esoReportsP * 0.7);
        }
        drawLabel(ctx, "ACTIVITY REPORTS", esoX, esoY + 32, COLORS.textDim, 14, esoReportsP);

        const esoAiBounce2 = Math.max(0, esoReportsP - 0.3);
        if (esoAiBounce2 > 0) {
          for (let lane = 0; lane < 3; lane++) {
            const yOff = (lane - 1) * 14;
            drawBouncingSignal(ctx, engineX + hexSize, engineY + yOff, esoX - 30, esoY + yOff, elapsed, 1.8 + lane * 0.4, COLORS.engine, COLORS.node, esoAiBounce2 * 0.4);
          }
        }
      }

      const counterP = Math.max(0, Math.min(1, (act2T - 0.3) / 0.1));
      if (counterP > 0) {
        const displayCount = Math.floor(smCount * 13);
        ctx.save();
        ctx.globalAlpha = counterP * 0.7;
        ctx.fillStyle = COLORS.node;
        ctx.font = "bold 16px 'JetBrains Mono', monospace";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(`${displayCount.toLocaleString()} ACTIVE SESSIONS`, W * 0.03, H * 0.04);
        ctx.font = "13px 'JetBrains Mono', monospace";
        ctx.fillStyle = COLORS.textDim;
        ctx.fillText("SINGLE INSTALLATION", W * 0.03, H * 0.08);
        ctx.restore();
      }
    }

    // ─── ACT III: 8 bases each with AI+ESO+ISR, ISR feeds converge to collection hub → Pentagon ───
    if (act >= 3) {
      const act3Start = ACT_TIMES[2];
      const act3Dur = ACT_TIMES[3] - ACT_TIMES[2];
      const act3T = Math.min(1, (elapsed - act3Start) / act3Dur);

      const baseCount = Math.min(8, Math.floor(act3T * 12));
      const bases: { x: number; y: number; aiX: number; esoX: number; label: string }[] = [];
      const baseNames = ["FT LIBERTY", "FT CAVAZOS", "FT MOORE", "JBLM", "FT DRUM", "FT RILEY", "FT STEWART", "FT BLISS"];

      for (let b = 0; b < baseCount; b++) {
        const row = b % 4;
        const col = Math.floor(b / 4);
        const bx = W * 0.02 + col * W * 0.16;
        const by = H * 0.12 + row * H * 0.2;
        const aix = bx + W * 0.06;
        const esox = bx + W * 0.12;
        bases.push({ x: bx, y: by, aiX: aix, esoX: esox, label: baseNames[b] });
      }

      for (let b = 0; b < bases.length; b++) {
        const base = bases[b];
        const baseP = Math.max(0, Math.min(1, (act3T * 2) - b * 0.12));
        if (baseP <= 0) continue;

        ctx.save();
        ctx.globalAlpha = baseP;

        const smPerBase = b < 3 ? 20 : 10;
        for (let i = 0; i < smPerBase; i++) {
          const sx = base.x + hash(i + b * 100, 33) * W * 0.04;
          const sy = base.y - H * 0.04 + hash2(i + b * 100, 33) * H * 0.08;
          drawGlowCircle(ctx, sx, sy, 2, COLORS.node, 0.15 + 0.2 * Math.sin(elapsed * 1.5 + i + b));
          if (i < 5) {
            ctx.globalAlpha = baseP * 0.1;
            ctx.strokeStyle = COLORS.node;
            ctx.lineWidth = 0.3;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(base.aiX, base.y);
            ctx.stroke();
            ctx.globalAlpha = baseP;
          }
        }

        const aiGlow = 0.3 + 0.4 * Math.sin(elapsed * 2.5 + b);
        drawHexagon(ctx, base.aiX, base.y, 14, COLORS.engine, 0.35, aiGlow);

        drawGlowCircle(ctx, base.esoX, base.y, 7, COLORS.node, 0.3 + 0.3 * Math.sin(elapsed * 2 + b * 0.7));

        const hotP = baseP * (0.5 + 0.5 * Math.sin(elapsed * 3 + b));
        drawTrunkBeam(ctx, base.aiX + 14, base.y, base.esoX - 7, base.y, 2 + hotP * 2.5, COLORS.engine, hotP * 0.5, 12);

        const sp1 = ((elapsed * 1.5 + b * 0.8) % 1);
        drawSignalDot(ctx, base.aiX + 14, base.y, base.esoX - 7, base.y, sp1, COLORS.engine, 2);

        drawLabel(ctx, base.label, (base.aiX + base.esoX) / 2, base.y + 18, COLORS.textDim, 9, baseP * 0.7);
        drawLabel(ctx, "AI+ESO", (base.aiX + base.esoX) / 2, base.y + 28, COLORS.engine, 7, baseP * 0.5);

        ctx.restore();
      }

      const isrFeedP = Math.max(0, Math.min(1, (act3T - 0.3) / 0.2));
      if (isrFeedP > 0) {
        for (let b = 0; b < bases.length; b++) {
          const base = bases[b];
          const sp = Math.max(0, Math.min(1, (isrFeedP - b * 0.05) * 3));
          if (sp <= 0) continue;

          const isrOutX = base.esoX + W * 0.04;
          const isrOutY = base.y;

          ctx.save();
          ctx.globalAlpha = sp * 0.6;
          drawGlowCircle(ctx, isrOutX, isrOutY, 6, COLORS.engine, 0.3 + 0.3 * Math.sin(elapsed * 2 + b));
          drawLabel(ctx, "ISR", isrOutX, isrOutY - 14, COLORS.engine, 8, sp * 0.8);
          ctx.restore();

          const beamFromEso = sp * (0.4 + 0.3 * Math.sin(elapsed * 3 + b));
          drawTrunkBeam(ctx, base.esoX + 7, base.y, isrOutX - 6, isrOutY, 2 + sp * 2.5, COLORS.engine, beamFromEso, 10);
        }
      }

      const collectX = W * 0.52;
      const collectY = H * 0.5;
      const collectP = Math.max(0, Math.min(1, (act3T - 0.45) / 0.15));
      if (collectP > 0) {
        const collectGlow = collectP * (0.4 + 0.5 * Math.sin(elapsed * 2.5));
        drawGlowCircle(ctx, collectX, collectY, 24, COLORS.engine, collectGlow);
        drawProcessLabel(ctx, "NORMALIZATION", collectX, collectY - 34, COLORS.engine, COLORS.bg + "e0", collectP);
        drawProcessLabel(ctx, "AGGREGATION", collectX, collectY + 24, COLORS.command, COLORS.bg + "e0", collectP);

        for (let b = 0; b < bases.length; b++) {
          const base = bases[b];
          const sp = Math.max(0, Math.min(1, (collectP - b * 0.04) * 3));
          if (sp <= 0) continue;

          const isrOutX = base.esoX + W * 0.04;
          const isrOutY = base.y;

          ctx.save();
          ctx.globalAlpha = sp * 0.25;
          ctx.strokeStyle = COLORS.engine;
          ctx.lineWidth = 1.5 + sp * 2;
          ctx.beginPath();
          ctx.moveTo(isrOutX, isrOutY);
          ctx.quadraticCurveTo(collectX - 30, isrOutY, collectX, collectY);
          ctx.stroke();
          ctx.restore();

          const dotP = ((elapsed * 0.7 + b * 0.3) % 1);
          const t = dotP;
          const cx = isrOutX + (collectX - isrOutX) * t;
          const cy = isrOutY + (collectY - isrOutY) * t * t;
          ctx.save();
          ctx.globalAlpha = sp * 0.5 * (1 - t * 0.4);
          drawGlowCircle(ctx, cx, cy, 3, COLORS.engine, 0.4);
          ctx.restore();
        }
      }

      const aggNodeX = W * 0.68;
      const aggNodeY = H * 0.5;
      const aggP = Math.max(0, Math.min(1, (act3T - 0.6) / 0.1));
      if (aggP > 0) {
        const beamColor = lerpColor(COLORS.engine, COLORS.command, aggP * 0.6);
        const beamWidth = 4 + aggP * 6;
        drawTrunkBeam(ctx, collectX + 24, collectY, aggNodeX - 20, aggNodeY, beamWidth, beamColor, aggP * 0.7, 35);

        for (let i = 0; i < 2; i++) {
          const sp = ((elapsed * 1.2 + i * 0.5) % 1);
          drawSignalDot(ctx, collectX + 24, collectY, aggNodeX - 20, aggNodeY, sp, beamColor, 4);
        }

        const aggGlow = aggP * (0.5 + 0.4 * Math.sin(elapsed * 2.5));
        drawGlowCircle(ctx, aggNodeX, aggNodeY, 20, COLORS.command, aggGlow);
        drawProcessLabel(ctx, "PII STRIPPED", aggNodeX, aggNodeY - 30, COLORS.node, COLORS.bg + "e0", aggP);
      }

      const whiteP = Math.max(0, Math.min(1, (act3T - 0.75) / 0.15));
      if (whiteP > 0) {
        const beamColor = lerpColor(COLORS.command, COLORS.node, whiteP);
        const wBeam = 6 + whiteP * 12;
        drawTrunkBeam(ctx, aggNodeX + 20, aggNodeY, pentX - 50, pentY, wBeam, beamColor, whiteP * 0.9, 60 * whiteP);

        for (let i = 0; i < 3; i++) {
          const sp = ((elapsed * 0.8 + i * 0.3) % 1);
          drawSignalDot(ctx, aggNodeX + 20, aggNodeY, pentX - 50, pentY, sp, beamColor, 5);
        }

        if (whiteP > 0.3) {
          const pp = (whiteP - 0.3) / 0.7;
          const midX = (aggNodeX + pentX) / 2;
          const midY = (aggNodeY + pentY) / 2;
          drawLabel(ctx, "PRIVACY-SAFE", midX, midY - 24, COLORS.node, 14, pp * 0.8);
          drawLabel(ctx, "TO PENTAGON", midX, midY - 8, COLORS.node, 14, pp * 0.6);
        }

        if (whiteP > 0.6) {
          const pentGlow = (whiteP - 0.6) * 2.5;
          drawPentagon(ctx, pentX, pentY, 50, COLORS.engine, pentGlow);
          drawLabel(ctx, "DOD", pentX, pentY + 58, COLORS.text, 14, pentGlow);
          drawLabel(ctx, "POLICY LAYER", pentX, pentY + 74, COLORS.textDim, 12, pentGlow);
        }
      }

      const counterP3 = Math.max(0, Math.min(1, (act3T - 0.2) / 0.1));
      if (counterP3 > 0) {
        const totalSM = baseCount * 2500;
        ctx.save();
        ctx.globalAlpha = counterP3 * 0.6;
        ctx.fillStyle = COLORS.node;
        ctx.font = "bold 14px 'JetBrains Mono', monospace";
        ctx.textAlign = "right";
        ctx.textBaseline = "top";
        ctx.fillText(`${baseCount} INSTALLATIONS · ${totalSM.toLocaleString()} SMs`, W * 0.97, H * 0.93);
        ctx.restore();
      }
    }

    // ─── ACT IV: Hundreds of ESOs feed, massive amber trunk, Pentagon climax ───
    if (act >= 4) {
      const act4Start = ACT_TIMES[3];
      const act4Dur = ACT_TIMES[4] - ACT_TIMES[3];
      const act4T = Math.min(1, (elapsed - act4Start) / act4Dur);

      const esoCount = Math.min(40, Math.floor(act4T * 60));
      for (let i = 0; i < esoCount; i++) {
        const ex = W * 0.03 + hash(i, 777) * W * 0.55;
        const ey = H * 0.15 + hash2(i, 777) * H * 0.75;
        const ep = Math.min(1, act4T * 3 - i * 0.04);
        if (ep <= 0) continue;

        ctx.save();
        ctx.globalAlpha = ep * 0.5;
        drawGlowCircle(ctx, ex, ey, 6, COLORS.node, 0.3 + 0.3 * Math.sin(elapsed * 1.5 + i));

        ctx.globalAlpha = ep * 0.15;
        ctx.strokeStyle = COLORS.node;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.quadraticCurveTo(ex + (pentX - ex) * 0.4, ey - 30, pentX, pentY);
        ctx.stroke();

        const sp = ((elapsed * 0.6 + i * 0.3) % 1);
        const dx = lerp(ex, pentX, sp);
        const dy = lerp(ey, pentY - 20 + sp * 20, sp);
        ctx.globalAlpha = ep * 0.4 * (1 - sp);
        drawGlowCircle(ctx, dx, dy, 3, COLORS.node, 0.5);

        ctx.restore();
      }

      const trunkConverge = Math.max(0, Math.min(1, act4T * 2.5));
      if (trunkConverge > 0) {
        for (let i = 0; i < 6; i++) {
          const angle = -Math.PI * 0.3 + (Math.PI * 0.8 / 6) * i;
          const dist = W * 0.35;
          const sx = pentX + Math.cos(angle + Math.PI) * dist;
          const sy = pentY + Math.sin(angle + Math.PI) * dist * 0.6;
          const tp = Math.max(0, Math.min(1, trunkConverge - i * 0.1));
          if (tp <= 0) continue;

          const bw = 4 + tp * 8;
          drawTrunkBeam(ctx, sx, sy, pentX - 55, pentY, bw, COLORS.engine, tp * 0.5, 50 * tp);

          for (let d = 0; d < 2; d++) {
            const dp = ((elapsed * 0.8 + i * 0.5 + d * 0.4) % 1);
            drawSignalDot(ctx, sx, sy, pentX - 55, pentY, dp, COLORS.engine, 4);
          }
        }
      }

      const pentAppear = Math.max(0, Math.min(1, (act4T - 0.25) / 0.12));
      if (pentAppear > 0) {
        const pentGlow = pentAppear * (0.5 + 0.5 * Math.sin(elapsed * 1.5));
        const pentSize = 70 + pentAppear * 10;
        drawPentagon(ctx, pentX, pentY, pentSize, COLORS.engine, pentGlow);
        drawLabel(ctx, "DEPARTMENT OF DEFENSE", pentX, pentY + pentSize + 10, COLORS.text, 16, pentAppear);
        drawLabel(ctx, "POLICY LAYER", pentX, pentY + pentSize + 28, COLORS.textDim, 14, pentAppear);
      }

      const policyP = Math.max(0, Math.min(1, (act4T - 0.4) / 0.1));
      if (policyP > 0) {
        drawDocIcon(ctx, pentX, pentY, 34, COLORS.engine, policyP, policyP);
        drawLabel(ctx, "POLICY SIGNAL", pentX, pentY + 28, COLORS.engine, 14, policyP * 0.8);
      }

      const statsP = Math.max(0, Math.min(1, (act4T - 0.45) / 0.1));
      if (statsP > 0) {
        ctx.save();
        ctx.globalAlpha = statsP * 0.6;
        ctx.fillStyle = COLORS.node;
        ctx.font = "bold 16px 'JetBrains Mono', monospace";
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.fillText("2,000,000+ SERVICE MEMBERS", W * 0.97, H * 0.9);
        ctx.font = "13px 'JetBrains Mono', monospace";
        ctx.fillStyle = COLORS.textDim;
        ctx.fillText("180+ INSTALLATIONS · ZERO PII IN POLICY LAYER", W * 0.97, H * 0.95);
        ctx.restore();
      }

      const textP = Math.max(0, Math.min(1, (act4T - 0.65) / 0.12));
      if (textP > 0) {
        ctx.save();
        ctx.globalAlpha = textP;
        const panelW = W * 0.65;
        const panelH = 90;
        const panelX = W / 2 - panelW / 2;
        const panelY = H * 0.62;
        ctx.fillStyle = COLORS.bg + "e0";
        ctx.beginPath();
        ctx.roundRect(panelX, panelY, panelW, panelH, 4);
        ctx.fill();
        ctx.strokeStyle = COLORS.border;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = COLORS.text;
        ctx.font = "italic 18px 'Merriweather', Georgia, serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("One governed signal. Millions of pathways. One national picture.", W / 2, panelY + panelH * 0.38);
        ctx.font = "13px 'JetBrains Mono', monospace";
        ctx.fillStyle = COLORS.textDim;
        ctx.fillText("No individual data crosses the privacy boundary. The ISR sees only aggregated policy signals.", W / 2, panelY + panelH * 0.7);
        ctx.restore();
      }

      const fadeP = Math.max(0, Math.min(1, (act4T - 0.93) / 0.07));
      if (fadeP > 0) {
        ctx.save();
        ctx.globalAlpha = fadeP;
        ctx.fillStyle = COLORS.bg;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }
    }

    const actLabel = ["", "ACT I — THE INDIVIDUAL", "ACT II — THE INSTALLATION", "ACT III — THE NETWORK", "ACT IV — THE PENTAGON"][act];
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = COLORS.textDim;
    ctx.font = "bold 16px 'JetBrains Mono', monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(actLabel, 20, 20);
    ctx.restore();

    // ─── STREAMING TYPEWRITER NARRATION ───
    const actIdx = act - 1;
    if (actIdx >= 0 && actIdx < 4) {
      const actStart = ACT_TIMES[actIdx];
      const actEnd = ACT_TIMES[actIdx + 1];
      const narText = NARRATIONS[actIdx];
      const timeSinceActStart = elapsed - actStart;
      const timeToActEnd = actEnd - elapsed;

      const charsPerSec = 45;
      const charCount = Math.min(narText.length, Math.floor(timeSinceActStart * charsPerSec));

      let narOpacity = 1;
      if (timeSinceActStart < 0.3) narOpacity = timeSinceActStart / 0.3;
      if (timeToActEnd < 0.5) narOpacity = Math.max(0, timeToActEnd / 0.5);

      const narX = W * 0.7;
      const narY = H * 0.08;
      const narMaxW = Math.min(W * 0.5, 500);
      drawNarrationPanel(ctx, narText, narX, narY, narMaxW, narOpacity * 0.9, charCount);
    }

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
      <div className="max-w-[1400px] mx-auto px-4 py-4">
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

        <div className="text-center mb-4">
          <div className="text-[10px] font-mono tracking-[3px] uppercase mb-2" style={{ color: COLORS.node }}>
            Cinematic Visualization
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-light tracking-tight mb-2">
            From One to the Pentagon
          </h1>
          <p className="text-xs max-w-lg mx-auto" style={{ color: COLORS.textDim }}>
            The CMGF Signal at Scale — How individual advisory sessions become privacy-safe institutional intelligence
          </p>
        </div>
      </div>

      <div ref={containerRef} className="relative w-full" style={{ background: COLORS.bg }}>
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: isFullscreen ? '100vh' : 'calc(100vh - 200px)', minHeight: 500, display: "block" }}
          data-testid="canvas-animation"
        />

        <div className="absolute bottom-0 left-0 right-0 p-3" style={{ background: 'linear-gradient(transparent, rgba(13,17,23,0.95))' }}>
          <div className="flex items-center gap-3 max-w-[1200px] mx-auto">
            <button
              onClick={playing ? pause : play}
              className="flex items-center justify-center w-10 h-10 rounded-full transition-colors"
              style={{ background: 'rgba(251,191,36,0.15)', border: `1px solid ${COLORS.node}` }}
              data-testid="button-play-pause"
            >
              {playing ? <Pause className="h-5 w-5" style={{ color: COLORS.node }} /> : <Play className="h-5 w-5 ml-0.5" style={{ color: COLORS.node }} />}
            </button>

            <button
              onClick={reset}
              className="flex items-center justify-center w-9 h-9 rounded-full transition-colors"
              style={{ background: 'rgba(148,163,184,0.1)' }}
              data-testid="button-reset"
            >
              <RotateCcw className="h-4 w-4" style={{ color: COLORS.textDim }} />
            </button>

            <div className="flex-1 mx-2">
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(148,163,184,0.15)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${progressPct}%`, background: `linear-gradient(90deg, ${COLORS.node}, ${COLORS.engine})` }}
                  data-testid="progress-bar"
                />
              </div>
              <div className="flex justify-between mt-1 text-xs font-mono" style={{ color: COLORS.textDim }}>
                <span>{Math.floor(currentTime)}s / {DURATION}s</span>
                <span>
                  {["Ready", "Act I — The Individual", "Act II — The Installation", "Act III — The Network", "Act IV — The Pentagon"][currentAct]}
                </span>
              </div>
            </div>

            <button
              onClick={toggleFullscreen}
              className="flex items-center justify-center w-9 h-9 rounded-full transition-colors"
              style={{ background: 'rgba(148,163,184,0.1)' }}
              data-testid="button-fullscreen"
            >
              {isFullscreen ? <Minimize className="h-4 w-4" style={{ color: COLORS.textDim }} /> : <Maximize className="h-4 w-4" style={{ color: COLORS.textDim }} />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { act: "Act I", title: "The Individual", time: "0:00 – 0:15", desc: "A deployed SM at 0200 sends a signal. The CMGF AI engages in intense back-and-forth advisory exchange across multiple lanes. The signal to the ESO thickens and glows hot as the session produces an activity report." },
            { act: "Act II", title: "The Installation", time: "0:15 – 0:30", desc: "Hundreds of SMs appear at a single installation, each in their own advisory session. The AI engine grows under load. The pipeline to the ESO burns hot with continuous signal traffic and coordination." },
            { act: "Act III", title: "The Network", time: "0:30 – 0:55", desc: "Eight military bases come online — Ft Liberty, Ft Cavazos, JBLM, and more. Each has its own AI engine and ESO. ISR feeds from each base converge at the normalization hub, then flow to the Pentagon." },
            { act: "Act IV", title: "The Pentagon", time: "0:55 – 1:15", desc: "Hundreds of ESOs from 180+ installations feed aggregated signals to the Pentagon. 2,000,000+ service members, zero PII in the policy layer. The ISR sees only aggregated institutional intelligence." },
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

function lerpColor(c1: string, c2: string, t: number): string {
  const r1 = parseInt(c1.slice(1, 3), 16);
  const g1 = parseInt(c1.slice(3, 5), 16);
  const b1 = parseInt(c1.slice(5, 7), 16);
  const r2 = parseInt(c2.slice(1, 3), 16);
  const g2 = parseInt(c2.slice(3, 5), 16);
  const b2 = parseInt(c2.slice(5, 7), 16);
  const r = Math.round(lerp(r1, r2, t));
  const g = Math.round(lerp(g1, g2, t));
  const b = Math.round(lerp(b1, b2, t));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
