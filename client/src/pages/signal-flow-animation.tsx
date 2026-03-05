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
  drawSignalLine(ctx, x1, y1, x2, y2, color1, 0.4, 1);
  ctx.restore();
  drawSignalDot(ctx, fromX, fromY, toX, toY, p, color, 3);
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
  ctx.font = "bold 9px 'JetBrains Mono', monospace";
  const w = ctx.measureText(text).width + 20;
  const h = 22;
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

    const smX = W * 0.12;
    const smY = H * 0.5;
    const engineX = W * 0.45;
    const engineY = H * 0.5;
    const esoX = W * 0.78;
    const esoY = H * 0.5;

    const trunkStartX = engineX;
    const trunkStartY = engineY - 60;
    const normX = W * 0.45;
    const normY = H * 0.18;
    const aggX = W * 0.62;
    const aggY = H * 0.12;
    const cmdX = W * 0.75;
    const cmdY = H * 0.15;
    const pentX = W * 0.88;
    const pentY = H * 0.2;

    if (act >= 1) {
      const actT = Math.min(1, elapsed / ACT_TIMES[1]);

      const contextAppear = easeOut(Math.min(1, actT * 3));
      if (contextAppear > 0) {
        ctx.save();
        ctx.globalAlpha = contextAppear * 0.4;
        ctx.fillStyle = COLORS.textDim;
        ctx.font = "9px 'JetBrains Mono', monospace";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("0200 HRS · UNDISCLOSED LOCATION", W * 0.03, H * 0.06);
        ctx.restore();
      }

      const smAppear = easeOut(Math.min(1, actT * 4));
      if (smAppear > 0) {
        const pulse = 0.5 + 0.5 * Math.sin(elapsed * 2);
        drawGlowCircle(ctx, smX, smY, 14, COLORS.node, smAppear * pulse * 0.8);
        drawPersonIcon(ctx, smX, smY, 14, COLORS.text);
        drawLabel(ctx, "DEPLOYED SM", smX, smY + 24, COLORS.textDim, 10, smAppear);
      }

      const signalToAI = Math.max(0, Math.min(1, (actT - 0.2) / 0.15));
      if (signalToAI > 0) {
        drawSignalLine(ctx, smX, smY, engineX, engineY, COLORS.node, signalToAI, 1.5);
        if (signalToAI < 1) {
          drawSignalDot(ctx, smX, smY, engineX, engineY, easeInOut(signalToAI), COLORS.node, 4);
        }
      }

      const hexAppear = Math.max(0, Math.min(1, (actT - 0.3) / 0.1));
      if (hexAppear > 0) {
        const flashGlow = 0.3 + 0.3 * Math.sin(elapsed * 3);
        drawHexagon(ctx, engineX, engineY, 34, COLORS.engine, hexAppear * 0.3, hexAppear * flashGlow);
        drawLabel(ctx, "CMGF AI", engineX, engineY + 42, COLORS.textDim, 10, hexAppear);
        drawLabel(ctx, "ENGINE", engineX, engineY + 54, COLORS.textDim, 9, hexAppear);
      }

      const bounceStart = 0.4;
      const bounceEnd = 0.75;
      const bounceP = Math.max(0, Math.min(1, (actT - bounceStart) / (bounceEnd - bounceStart)));
      if (bounceP > 0) {
        const bounceElapsed = (actT - bounceStart) * ACT_TIMES[1];
        drawBouncingSignal(ctx, smX + 14, smY, engineX - 34, engineY, bounceElapsed, 1.8, COLORS.node, COLORS.engine, bounceP);

        const exchangeLabel = Math.max(0, Math.min(1, (bounceP - 0.3) / 0.2));
        if (exchangeLabel > 0) {
          const midX = (smX + engineX) / 2;
          const midY = smY - 30;
          drawLabel(ctx, "BACK & FORTH", midX, midY, COLORS.textDim, 8, exchangeLabel * 0.6);
          drawLabel(ctx, "ADVISORY EXCHANGE", midX, midY + 11, COLORS.textDim, 8, exchangeLabel * 0.6);
        }
      }

      const esoReportP = Math.max(0, Math.min(1, (actT - 0.78) / 0.12));
      if (esoReportP > 0) {
        drawSignalLine(ctx, engineX + 34, engineY, esoX, esoY, COLORS.node, esoReportP * 0.6, 2);
        if (esoReportP < 1) {
          drawSignalDot(ctx, engineX + 34, engineY, esoX, esoY, easeOut(esoReportP), COLORS.node, 4);
        }
      }

      const esoAppear = Math.max(0, Math.min(1, (actT - 0.88) / 0.08));
      if (esoAppear > 0) {
        drawGlowCircle(ctx, esoX, esoY, 14, COLORS.node, esoAppear * 0.6);
        drawLabel(ctx, "ESO", esoX, esoY - 24, COLORS.node, 11, esoAppear);
        drawDocIcon(ctx, esoX, esoY, 26, COLORS.node, esoAppear, esoAppear);
        drawLabel(ctx, "ACTIVITY REPORT", esoX, esoY + 20, COLORS.textDim, 8, esoAppear);
      }

      const badgeP = Math.max(0, Math.min(1, (actT - 0.92) / 0.06));
      if (badgeP > 0) {
        drawBadge(ctx, "SM SESSION COMPLETE", (smX + engineX) / 2, smY + 50, COLORS.approved, badgeP);
      }
    }

    if (act >= 2) {
      const act2Start = ACT_TIMES[1];
      const act2Dur = ACT_TIMES[2] - ACT_TIMES[1];
      const act2T = Math.min(1, (elapsed - act2Start) / act2Dur);

      const seed = 42;
      const smCount = Math.floor(lerp(1, 24, easeOut(Math.min(1, act2T * 2))));

      const smPositions: { x: number; y: number }[] = [];
      for (let i = 0; i < smCount; i++) {
        const hash = ((seed + i * 127) % 997) / 997;
        const hash2 = ((seed + i * 251) % 991) / 991;
        const nx = W * 0.03 + hash * W * 0.2;
        const ny = H * 0.12 + hash2 * H * 0.76;
        smPositions.push({ x: nx, y: ny });
      }

      for (let i = 0; i < smCount; i++) {
        const { x: nx, y: ny } = smPositions[i];
        const nodeOpacity = Math.min(1, (act2T * 2) - i / smCount * 0.5);
        if (nodeOpacity <= 0) continue;

        ctx.save();
        ctx.globalAlpha = nodeOpacity;
        const pulse = 0.4 + 0.6 * Math.sin(elapsed * 1.5 + i * 0.7);
        drawGlowCircle(ctx, nx, ny, 5, COLORS.node, pulse * 0.3);
        drawPersonIcon(ctx, nx, ny, 5, COLORS.text);

        const bounceActive = act2T > 0.15 + i * 0.02;
        if (bounceActive) {
          const bounceElapsed = elapsed - act2Start - (0.15 + i * 0.02) * act2Dur;
          if (bounceElapsed > 0) {
            drawBouncingSignal(ctx, nx + 5, ny, engineX - 34, engineY + (i - smCount / 2) * 2, bounceElapsed, 1.2 + (i % 3) * 0.3, COLORS.node, COLORS.engine, 0.5);
          }
        }
        ctx.restore();
      }

      const hexGlow = 0.4 + 0.3 * Math.sin(elapsed * 2.5);
      drawHexagon(ctx, engineX, engineY, 34, COLORS.engine, 0.35, hexGlow);
      drawLabel(ctx, "CMGF AI", engineX, engineY + 42, COLORS.textDim, 10, 1);
      drawLabel(ctx, "ENGINE", engineX, engineY + 54, COLORS.textDim, 9, 1);

      const esoReportsP = Math.max(0, Math.min(1, (act2T - 0.4) / 0.3));
      if (esoReportsP > 0) {
        const reportCount = Math.floor(esoReportsP * 6);
        for (let i = 0; i < reportCount; i++) {
          const sp = Math.max(0, Math.min(1, (esoReportsP - i * 0.12) * 4));
          if (sp > 0 && sp < 1) {
            const ty = esoY - 30 + i * 12;
            drawSignalDot(ctx, engineX + 34, engineY, esoX, ty, easeOut(sp), COLORS.node, 3);
          }
        }
        drawGlowCircle(ctx, esoX, esoY, 14, COLORS.node, esoReportsP * 0.7);
        drawLabel(ctx, "ESO", esoX, esoY - 24, COLORS.node, 11, esoReportsP);

        const docStack = Math.floor(esoReportsP * 4);
        for (let i = 0; i < docStack; i++) {
          drawDocIcon(ctx, esoX + i * 4, esoY - i * 3, 22, COLORS.node, 1, esoReportsP * 0.8);
        }
        drawLabel(ctx, "ACTIVITY REPORTS", esoX, esoY + 18, COLORS.textDim, 8, esoReportsP);
      }

      const scaleLabel = Math.max(0, Math.min(1, (act2T - 0.6) / 0.15));
      if (scaleLabel > 0) {
        drawLabel(ctx, `${smCount} ACTIVE SESSIONS`, W * 0.12, H * 0.06, COLORS.node, 9, scaleLabel * 0.6);
      }
    }

    if (act >= 3) {
      const act3Start = ACT_TIMES[2];
      const act3Dur = ACT_TIMES[3] - ACT_TIMES[2];
      const act3T = Math.min(1, (elapsed - act3Start) / act3Dur);

      const seed = 42;
      const smFade = Math.max(0, 1 - act3T * 2);
      if (smFade > 0) {
        for (let i = 0; i < 24; i++) {
          const hash = ((seed + i * 127) % 997) / 997;
          const hash2 = ((seed + i * 251) % 991) / 991;
          const nx = W * 0.03 + hash * W * 0.2;
          const ny = H * 0.12 + hash2 * H * 0.76;
          ctx.save();
          ctx.globalAlpha = smFade * 0.4;
          drawGlowCircle(ctx, nx, ny, 4, COLORS.node, 0.2);
          ctx.restore();
        }
      }

      const collectStreams = Math.max(0, Math.min(1, act3T * 2.5));
      if (collectStreams > 0) {
        const streamCount = Math.floor(collectStreams * 10);
        for (let i = 0; i < streamCount; i++) {
          const angle = (Math.PI * 0.8) + (Math.PI * 0.4 / 10) * i;
          const dist = W * 0.25;
          const sx = engineX + Math.cos(angle) * dist;
          const sy = engineY + Math.sin(angle) * dist;
          ctx.save();
          ctx.globalAlpha = collectStreams * 0.25;
          ctx.strokeStyle = COLORS.node;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(engineX, engineY);
          ctx.stroke();
          ctx.restore();
          const sp = ((elapsed * 0.8 + i * 0.3) % 1);
          drawSignalDot(ctx, sx, sy, engineX, engineY, sp, COLORS.node, 2);
        }
      }

      const hexGlow = 0.5 + 0.4 * Math.sin(elapsed * 3);
      drawHexagon(ctx, engineX, engineY, 36, COLORS.engine, 0.4, hexGlow);
      drawLabel(ctx, "CMGF AI", engineX, engineY + 44, COLORS.textDim, 10, 1);
      drawLabel(ctx, "ENGINE", engineX, engineY + 56, COLORS.textDim, 9, 1);

      const processP = Math.max(0, Math.min(1, (act3T - 0.15) / 0.15));
      if (processP > 0) {
        drawLabel(ctx, "PROCESSING COLLECTED SIGNALS", engineX, engineY - 50, COLORS.engine, 8, processP * 0.7);
      }

      const trunkP = Math.max(0, Math.min(1, (act3T - 0.3) / 0.15));
      if (trunkP > 0) {
        const trunkColor = COLORS.engine;
        drawTrunkBeam(ctx, engineX, engineY - 36, normX, normY + 15, 4 + trunkP * 3, trunkColor, trunkP * 0.7, 40);
        if (trunkP < 1) {
          drawSignalDot(ctx, engineX, engineY - 36, normX, normY + 15, easeOut(trunkP), trunkColor, 5);
        }
      }

      const normP = Math.max(0, Math.min(1, (act3T - 0.4) / 0.1));
      if (normP > 0) {
        drawProcessLabel(ctx, "NORMALIZATION", normX, normY, COLORS.engine, COLORS.bg + "e0", normP);
      }

      const normToAgg = Math.max(0, Math.min(1, (act3T - 0.5) / 0.1));
      if (normToAgg > 0) {
        const midColor = lerpColor(COLORS.engine, COLORS.pure, normToAgg * 0.3);
        drawTrunkBeam(ctx, normX + 60, normY, aggX - 40, aggY, 5 + normToAgg * 2, midColor, normToAgg * 0.7, 35);
        if (normToAgg < 1) {
          drawSignalDot(ctx, normX + 60, normY, aggX - 40, aggY, easeOut(normToAgg), midColor, 5);
        }
      }

      const aggP = Math.max(0, Math.min(1, (act3T - 0.55) / 0.1));
      if (aggP > 0) {
        drawProcessLabel(ctx, "AGGREGATION", aggX, aggY, COLORS.command, COLORS.bg + "e0", aggP);
      }

      const whiteTransition = Math.max(0, Math.min(1, (act3T - 0.65) / 0.15));
      if (whiteTransition > 0) {
        const beamColor = lerpColor(COLORS.command, COLORS.pure, whiteTransition);
        const beamWidth = 6 + whiteTransition * 6;
        drawTrunkBeam(ctx, aggX + 50, aggY, cmdX - 20, cmdY, beamWidth, beamColor, whiteTransition * 0.9, 60 * whiteTransition);

        if (whiteTransition > 0.3) {
          const privacyP = Math.min(1, (whiteTransition - 0.3) / 0.3);
          drawLabel(ctx, "PII STRIPPED", (aggX + cmdX) / 2, aggY + 20, COLORS.pure, 8, privacyP * 0.8);
          drawLabel(ctx, "PRIVACY-SAFE DATA", (aggX + cmdX) / 2, aggY + 32, COLORS.pure, 8, privacyP * 0.6);
        }
      }

      const isrP = Math.max(0, Math.min(1, (act3T - 0.82) / 0.12));
      if (isrP > 0) {
        drawGlowCircle(ctx, cmdX, cmdY, 14, COLORS.pure, isrP * 0.7);
        drawLabel(ctx, "ISR DATA", cmdX, cmdY + 20, COLORS.pure, 9, isrP);
        drawLabel(ctx, "FEED", cmdX, cmdY + 32, COLORS.pure, 9, isrP);
        drawDocIcon(ctx, cmdX, cmdY, 22, COLORS.pure, isrP, isrP);
      }
    }

    if (act >= 4) {
      const act4Start = ACT_TIMES[3];
      const act4Dur = ACT_TIMES[4] - ACT_TIMES[3];
      const act4T = Math.min(1, (elapsed - act4Start) / act4Dur);

      drawHexagon(ctx, engineX, engineY, 30, COLORS.engine, 0.25, 0.3);
      drawLabel(ctx, "CMGF AI", engineX, engineY + 38, COLORS.textDim, 9, 0.5);

      const whiteBeamToCmd = Math.max(0, Math.min(1, act4T * 3));
      if (whiteBeamToCmd > 0) {
        drawTrunkBeam(ctx, engineX, engineY - 30, cmdX, cmdY, 8, COLORS.pure, whiteBeamToCmd * 0.8, 50);
        drawGlowCircle(ctx, cmdX, cmdY, 12, COLORS.pure, whiteBeamToCmd * 0.6);
        drawLabel(ctx, "INSTALLATION", cmdX, cmdY + 20, COLORS.command, 8, whiteBeamToCmd);
        drawLabel(ctx, "COMMAND", cmdX, cmdY + 31, COLORS.command, 8, whiteBeamToCmd);
      }

      const convergeP = Math.max(0, Math.min(1, (act4T - 0.15) / 0.2));
      if (convergeP > 0) {
        for (let i = 0; i < 5; i++) {
          const sx = W * 0.25 + i * W * 0.08;
          const sy = H * 0.7 - i * H * 0.05;
          ctx.save();
          ctx.globalAlpha = convergeP * 0.3;
          ctx.strokeStyle = COLORS.pure;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.quadraticCurveTo(sx + (cmdX - sx) * 0.5, sy - 40, cmdX, cmdY);
          ctx.stroke();
          ctx.restore();
        }
      }

      const cmdToPent = Math.max(0, Math.min(1, (act4T - 0.3) / 0.2));
      if (cmdToPent > 0) {
        drawTrunkBeam(ctx, cmdX + 14, cmdY, pentX - 40, pentY, 10 * cmdToPent, COLORS.pure, cmdToPent * 0.9, 70 * cmdToPent);
        if (cmdToPent < 1) {
          drawSignalDot(ctx, cmdX + 14, cmdY, pentX - 40, pentY, easeOut(cmdToPent), COLORS.pure, 6);
        }
      }

      const pentAppear = Math.max(0, Math.min(1, (act4T - 0.45) / 0.12));
      if (pentAppear > 0) {
        const pentGlow = pentAppear * (0.5 + 0.5 * Math.sin(elapsed * 1.5));
        drawPentagon(ctx, pentX, pentY, 40, COLORS.engine, pentGlow);
        drawLabel(ctx, "DEPARTMENT OF DEFENSE", pentX, pentY + 50, COLORS.text, 9, pentAppear);
        drawLabel(ctx, "POLICY LAYER", pentX, pentY + 62, COLORS.textDim, 9, pentAppear);
      }

      const policyP = Math.max(0, Math.min(1, (act4T - 0.58) / 0.1));
      if (policyP > 0) {
        drawDocIcon(ctx, pentX, pentY, 24, COLORS.engine, policyP, policyP);
        drawLabel(ctx, "POLICY SIGNAL", pentX, pentY + 20, COLORS.engine, 8, policyP * 0.8);
      }

      const textP = Math.max(0, Math.min(1, (act4T - 0.72) / 0.12));
      if (textP > 0) {
        ctx.save();
        ctx.globalAlpha = textP;
        const panelW = W * 0.65;
        const panelH = 70;
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
        ctx.fillText("One governed signal. Thousands of pathways. One national picture.", W / 2, panelY + panelH * 0.38);
        ctx.font = "9px 'JetBrains Mono', monospace";
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

    const actLabel = ["", "ACT I — THE INDIVIDUAL", "ACT II — THE SCALE", "ACT III — THE AGGREGATION", "ACT IV — THE PENTAGON"][act];
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
            The CMGF Signal at Scale — How individual advisory sessions become privacy-safe institutional intelligence
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
                  {["Ready", "Act I — The Individual", "Act II — The Scale", "Act III — The Aggregation", "Act IV — The Pentagon"][currentAct]}
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
            { act: "Act I", title: "The Individual", time: "0:00 – 0:15", desc: "A deployed SM at 0200 sends a signal from an undisclosed location. The CMGF AI engages in back-and-forth advisory exchange, then sends an activity report to the ESO." },
            { act: "Act II", title: "The Scale", time: "0:15 – 0:30", desc: "Dozens of SMs appear simultaneously, each in their own advisory session with the AI. Each session generates an ESO activity report. No individual data reaches the ISR yet." },
            { act: "Act III", title: "The Aggregation", time: "0:30 – 0:55", desc: "The AI processes all collected signals: normalization, then aggregation. The trunk beam turns white — PII is stripped. Only privacy-safe, aggregated data becomes the ISR feed." },
            { act: "Act IV", title: "The Pentagon", time: "0:55 – 1:15", desc: "The white ISR signal flows through Installation Command to the Pentagon policy layer. No individual data crosses the privacy boundary. The ISR sees only aggregated policy signals." },
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
