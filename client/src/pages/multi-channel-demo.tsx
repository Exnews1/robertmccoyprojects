import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";

const THEMES = {
  dark: {
    bg: "#060a12", bg2: "#0c1220", card: "#111827", cardHover: "#171f30",
    border: "#1c2740", borderLit: "#2a3f6e",
    blue: "#4d94ff", cyan: "#00d4aa", amber: "#ffb020", green: "#22c55e",
    red: "#ff4d6a", purple: "#a78bfa", orange: "#fb923c", pink: "#f472b6",
    text: "#eaf0f8", mid: "#8b9bb5", dim: "#4a5a72",
    chEdu: "#4d94ff", chCool: "#a78bfa", chTap: "#fb923c",
    chChap: "#f472b6", chCmd: "#ffb020", chVoV: "#22c55e",
    sandbox: "#06b6d4", transaction: "#f59e0b",
    glassBg: "rgba(17, 24, 39, 0.6)", glassDrop: "rgba(0,0,0,0.5)"
  },
  light: {
    bg: "#f8fafc", bg2: "#f1f5f9", card: "#ffffff", cardHover: "#f8fafc",
    border: "#e2e8f0", borderLit: "#cbd5e1",
    blue: "#2563eb", cyan: "#0d9488", amber: "#d97706", green: "#16a34a",
    red: "#e11d48", purple: "#7c3aed", orange: "#ea580c", pink: "#db2777",
    text: "#0f172a", mid: "#475569", dim: "#64748b",
    chEdu: "#2563eb", chCool: "#7c3aed", chTap: "#ea580c",
    chChap: "#db2777", chCmd: "#d97706", chVoV: "#16a34a",
    sandbox: "#0891b2", transaction: "#d97706",
    glassBg: "rgba(255, 255, 255, 0.7)", glassDrop: "rgba(0,0,0,0.06)"
  }
};

type ThemeKey = keyof typeof THEMES;
type CType = typeof THEMES.dark;

const FONT = "'Inter', -apple-system, sans-serif";
const MONO = "'JetBrains Mono', monospace";

const getChannels = (C: CType) => ({
  edu: {
    id: "edu", label: "Education Services", short: "ESO", color: C.chEdu, icon: "◈",
    desc: "TA approvals, degree planning, credit evaluation, institutional transfer",
    signals: ["TA request volume", "Credit award rates", "Pathway completion funnels", "Funding cap exhaustion timing"],
    tierExamples: "Tier A: GI Bill eligibility | Tier B: ACEN standards | Tier C: Transfer policies | Tier D: BLS projections"
  },
  cool: {
    id: "cool", label: "Credentialing (COOL/CA)", short: "COOL", color: C.chCool, icon: "◆",
    desc: "Certification authorization, exam scheduling, prerequisite verification",
    signals: ["CA authorization volume", "Cert demand by MOS", "Funding cap impact", "Pass rate by pathway"],
    tierExamples: "Tier A: COOL eligibility rules | Tier B: CompTIA/PMI prereqs | Tier C: Exam scheduling | Tier D: Employer cert preferences"
  },
  tap: {
    id: "tap", label: "Transition (TAP)", short: "TAP", color: C.chTap, icon: "◇",
    desc: "Separation planning, benefit transition, skills translation, career mapping",
    signals: ["Transition timeline events", "Credential gap frequency by MOS", "Benefit transition friction", "O*NET crosswalk utilization"],
    tierExamples: "Tier A: TAP requirements | Tier B: Target cert prereqs | Tier C: Gaining institution policies | Tier D: BLS/O*NET career data"
  },
  chap: {
    id: "chap", label: "Chaplain Services", short: "CHAP", color: C.chChap, icon: "♦",
    desc: "Spiritual fitness, family readiness, morale support, crisis referral",
    signals: ["Support demand patterns", "Deployment cycle correlation", "Family readiness indicators", "Referral volume trends"],
    tierExamples: "Absolute confidentiality preserved | Aggregate demand patterns only | No individual attribution"
  },
  cmd: {
    id: "cmd", label: "Commander Reports", short: "CMD", color: C.chCmd, icon: "★",
    desc: "Installation readiness, resource allocation, force development, on-demand reporting",
    signals: ["Cross-channel readiness picture", "Resource demand vs. capacity", "Operational tempo impact", "Education participation rates"],
    tierExamples: "Consumes aggregate ISR from all channels | No individual SM data | Population-level patterns only"
  },
  vov: {
    id: "vov", label: "Voice of Soldier/Vet", short: "VoV", color: C.chVoV, icon: "●",
    desc: "Reported friction, learner experience, system navigation barriers, feedback",
    signals: ["Friction point frequency", "Navigation barrier patterns", "Benefit confusion indicators", "Cross-channel pain points"],
    tierExamples: "SM-reported experience data | Aggregated by constraint type | Informs all other channel improvements"
  },
});

const CH_LIST = ["edu", "cool", "tap", "chap", "cmd", "vov"] as const;
type ChId = typeof CH_LIST[number];

const JOURNEY = [
  {
    id: "sandbox_edu", title: "Sandbox: Education Exploration", mode: "sandbox", channel: "edu",
    sm: "SSG Torres — 2215 hrs, personal device",
    narrative: "SSG Torres is weighing reenlistment against pursuing a nursing degree. At 2215 after putting kids to bed, she opens CMGF and explores credential pathways. The binding layer evaluates her 68W MOS against nursing prerequisites, checks TA eligibility, maps state licensure requirements for Texas. She sees Go/Conditional/No-Go signals with full citations.",
    isrEffect: "No signal generated. This is private exploration. The ISR sees nothing. The ESO sees nothing. The rack and stack is not affected.",
    keyPoint: "The system serves the SM at the point of need — not the point of institutional convenience. 24/7 access to the full binding layer with zero institutional footprint.",
  },
  {
    id: "sandbox_cool", title: "Sandbox: Credentialing Exploration", mode: "sandbox", channel: "cool",
    sm: "SSG Torres — same session, 2230 hrs",
    narrative: "Still exploring, Torres switches to the credentialing channel. She checks whether COOL covers CompTIA Security+ as a backup pathway if nursing doesn't work out. The binding layer evaluates COOL eligibility for her MOS, checks CA funding cap status, maps prerequisite requirements. She compares two credential stacks side by side.",
    isrEffect: "Still no signal. She's crossed channels within the same sandbox session. The system tracked nothing. Two channels consulted, zero institutional footprint.",
    keyPoint: "Channel switching within sandbox is seamless. The binding layer applies the correct authority rules for each channel automatically. The SM doesn't need to know which institutional authority governs what — the tier classification handles it.",
  },
  {
    id: "transaction_edu", title: "Action: TA Request Submitted", mode: "transaction", channel: "edu",
    sm: "SSG Torres — next morning, 0730 hrs",
    narrative: "Torres has decided. She initiates a TA request for a pre-nursing anatomy course. The moment she clicks Submit, she crosses from sandbox to transactional. The AI proxy generates a transaction record with full constraint context: eligibility confirmed, funding cap status, institutional approval needed, prerequisite chain documented.",
    isrEffect: "SIGNAL GENERATED. Transaction enters ESO rack and stack. Priority: ROUTINE (CONUS, no deadline pressure). ESO sees: TA request with pre-assembled documentation, constraint analysis complete, ready for approval action.",
    keyPoint: "The SM controlled when to cross the boundary. The system provided clear notification that submitting the request would generate an institutional transaction. Informed consent at the architectural level.",
  },
  {
    id: "transaction_cool", title: "Action: COOL Authorization", mode: "transaction", channel: "cool",
    sm: "SSG Torres — 0745 hrs",
    narrative: "Torres also submits a COOL authorization request for EMT-B certification, leveraging her 68W medical training. This enters the credentialing channel's transactional pipeline. The binding layer has already verified COOL eligibility, mapped her military medical training against EMT-B prerequisites, and confirmed CA funding availability.",
    isrEffect: "SECOND SIGNAL. Separate transaction enters the credentialing queue. Both transactions are now visible to the ESO — two items in the rack and stack, properly contextualized, ready for action.",
    keyPoint: "Two channels, two transactions, two queue entries — but the ESO sees a unified workload with constraint context pre-assembled for both. The overnight sandbox exploration that informed these requests is invisible.",
  },
  {
    id: "eso_action", title: "ESO Processes Queue", mode: "transaction", channel: "edu",
    sm: "ESO perspective — 0830 hrs",
    narrative: "The ESO opens their morning queue. Torres's TA request and COOL authorization are in the stack alongside 14 other pending actions from across the caseload. Two DEPLOYED SMs with closing deadlines sit at CRITICAL. Torres's items are ROUTINE. The ESO works the queue top-down: CRITICAL first, then HIGH, then ROUTINE. Each item has pre-assembled documentation and constraint analysis.",
    isrEffect: "ESO decisions generate signal: approval rationale logged, processing time captured, constraint resolution documented. Both approval events feed the de-identification pipeline.",
    keyPoint: "The ESO spent 6 minutes on Torres's two requests because the constraint analysis was already done. Without CMGF, the same actions would require researching eligibility, checking funding caps, verifying prerequisites, and assembling documentation — estimated 1.5-2 hours.",
  },
  {
    id: "tap_transition", title: "Transition Channel Activates", mode: "transaction", channel: "tap",
    sm: "SSG Torres — 14 months later, separation window",
    narrative: "Torres enters her transition window. TAP is mandatory — this is an institutional touchpoint regardless of CMGF. But now the binding layer integrates her accumulated credential portfolio (anatomy course complete, EMT-B certified) against her target civilian career. BLS projections, O*NET crosswalks, and state-specific employer requirements are evaluated. Her credential gap is specific and actionable.",
    isrEffect: "Transition stream signal generated: credential-to-career mapping, benefit utilization summary (TA consumed, COOL utilized, remaining GI Bill eligibility), gap analysis against target occupation.",
    keyPoint: "The transition touchpoint is transformed from a generic briefing to a personalized constraint evaluation built on 14 months of transactional history. The sandbox sessions that informed her early planning are still invisible — only institutional transactions contributed.",
  },
  {
    id: "isr_aggregate", title: "Multi-Channel ISR", mode: "isr", channel: "all",
    sm: "Installation-level aggregate",
    narrative: "All channels feed the de-identification firewall simultaneously. Education transactions, COOL authorizations, TAP touchpoints, chaplain demand patterns, Voice of the Soldier feedback, and commander on-demand queries all contribute to a unified installation readiness picture. Every signal is de-identified, authority-tagged, and aggregated at population level.",
    isrEffect: "FULL ISR: Funding cap exhaustion rates across the force. Credential pathway completion funnels. Deployment impact on education participation. Chaplain demand correlation with operational tempo. Cross-channel friction patterns. Transition readiness indicators for the separating population. All real-time. All on-demand.",
    keyPoint: "The ISR is no longer a periodic, manually assembled compliance document. It is a continuous, multi-channel, governed institutional intelligence layer. The commander sees installation readiness across every SM-facing channel in a single view.",
  },
];

const ISR_METRICS: Record<string, { transactions: number; pending: number; avgTime: string; topConstraint: string; funnel: string }> = {
  edu: { transactions: 1247, pending: 43, avgTime: "8m", topConstraint: "TA annual cap (38%)", funnel: "72% explore → 41% request → 37% approved → 29% enrolled" },
  cool: { transactions: 834, pending: 28, avgTime: "12m", topConstraint: "CA funding limit (31%)", funnel: "65% explore → 38% request → 34% authorized → 28% certified" },
  tap: { transactions: 412, pending: 15, avgTime: "22m", topConstraint: "Credential gap (47%)", funnel: "100% mandatory → 78% engage planning → 52% actionable plan" },
  chap: { transactions: 623, pending: 0, avgTime: "N/A", topConstraint: "Family readiness demand +34% during deployment cycle", funnel: "Demand pattern only — no approval pipeline" },
  vov: { transactions: 891, pending: 0, avgTime: "N/A", topConstraint: "Benefits navigation confusion (52%)", funnel: "Friction reports aggregated by constraint category" },
  cmd: { transactions: 156, pending: 0, avgTime: "On-demand", topConstraint: "Cross-channel: ESO staffing vs. demand gap", funnel: "Pulls from all channels — unified readiness view" },
};

function BadgeTag({ text, color, filled = false, mono = false }: { text: string; color: string; filled?: boolean; mono?: boolean }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 4,
      background: filled ? color : `${color}15`, border: `1px solid ${color}${filled ? "" : "40"}`,
      fontSize: 10, fontWeight: 700, color: filled ? "#fff" : color,
      fontFamily: mono ? MONO : FONT, letterSpacing: "0.03em", whiteSpace: "nowrap",
    }}>
      {text}
    </span>
  );
}

function ModeIndicator({ mode, C }: { mode: string; C: CType }) {
  if (mode === "isr") return <BadgeTag text="ISR AGGREGATE" color={C.amber} filled />;
  const isSandbox = mode === "sandbox";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        width: 10, height: 10, borderRadius: "50%",
        background: isSandbox ? C.sandbox : C.transaction,
        boxShadow: `0 0 10px ${isSandbox ? C.sandbox : C.transaction}50`,
        animation: "mcd-pulse 2s ease-in-out infinite",
      }} />
      <BadgeTag text={isSandbox ? "EXPLORATION MODE" : "ACTION MODE"} color={isSandbox ? C.sandbox : C.transaction} filled />
      {!isSandbox && <BadgeTag text="SIGNAL GENERATING" color={C.transaction} mono />}
    </div>
  );
}

function ChannelTab({ ch, active, onClick, C }: { ch: ChId; active: boolean; onClick: () => void; C: CType }) {
  const CHANNELS = getChannels(C);
  const c = CHANNELS[ch];
  return (
    <button onClick={onClick} style={{
      padding: "8px 14px", borderRadius: 8, border: `1px solid ${active ? c.color : C.border}`,
      background: active ? `${c.color}18` : "transparent", cursor: "pointer",
      display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
    }}>
      <span style={{ fontSize: 12, color: active ? c.color : C.dim }}>{c.icon}</span>
      <span style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: active ? c.color : C.mid }}>{c.short}</span>
    </button>
  );
}

function ChannelCard({ chId, active, expanded, onClick, C }: { chId: ChId; active: boolean; expanded: boolean; onClick: () => void; C: CType }) {
  const CHANNELS = getChannels(C);
  const ch = CHANNELS[chId];
  const m = ISR_METRICS[chId];
  return (
    <div onClick={onClick} style={{
      background: active ? `${ch.color}12` : C.bg2,
      border: `1.5px solid ${active ? ch.color : C.border}`,
      borderRadius: 10, padding: expanded ? "14px 16px" : "10px 14px", cursor: "pointer",
      transition: "all 0.3s ease", overflow: "hidden",
      boxShadow: active ? `0 0 20px ${ch.color}10` : "none",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: expanded ? 8 : 0 }}>
        <span style={{ fontSize: 14, color: ch.color }}>{ch.icon}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: active ? C.text : C.mid, flex: 1 }}>{ch.label}</span>
        {m && <span style={{ fontSize: 10, color: C.dim, fontFamily: MONO }}>{m.transactions} txn</span>}
      </div>
      {expanded && (
        <div style={{ marginTop: 4 }}>
          <div style={{ fontSize: 11, color: C.mid, marginBottom: 6, lineHeight: 1.4 }}>{ch.desc}</div>
          {m && (
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ fontSize: 10, color: C.dim, fontFamily: MONO }}>Pending: {m.pending} | Avg action: {m.avgTime}</div>
              <div style={{ fontSize: 10, color: ch.color, fontFamily: MONO }}>Top constraint: {m.topConstraint}</div>
              <div style={{ fontSize: 10, color: C.dim, lineHeight: 1.3 }}>Funnel: {m.funnel}</div>
            </div>
          )}
          <div style={{ marginTop: 6 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: C.dim, letterSpacing: "0.08em", marginBottom: 3 }}>ISR SIGNALS</div>
            {ch.signals.map(s => (
              <div key={s} style={{ fontSize: 10, color: C.mid, padding: "1px 0" }}>· {s}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ISRBar({ chId, C }: { chId: ChId; C: CType }) {
  const CHANNELS = getChannels(C);
  const ch = CHANNELS[chId];
  const m = ISR_METRICS[chId];
  const pct = (m.transactions / 1300) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <span style={{ fontSize: 10, color: ch.color, width: 36, fontFamily: MONO, fontWeight: 700 }}>{ch.short}</span>
      <div style={{ flex: 1, height: 14, background: `${ch.color}10`, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${ch.color}40, ${ch.color})`, borderRadius: 4, transition: "width 0.8s ease" }} />
      </div>
      <span style={{ fontSize: 10, color: C.mid, fontFamily: MONO, width: 45, textAlign: "right" }}>{m.transactions}</span>
    </div>
  );
}

function FirewallDivider({ active, C }: { active: boolean; C: CType }) {
  return (
    <div style={{
      margin: "12px 0", padding: "6px 12px", borderRadius: 6,
      border: `1px dashed ${active ? C.red + "60" : C.border}`,
      background: active ? `${C.red}06` : "transparent",
      display: "flex", alignItems: "center", gap: 8, transition: "all 0.4s",
    }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: active ? C.red : C.dim, animation: active ? "mcd-pulse 1.5s ease infinite" : "none" }} />
      <span style={{ fontSize: 10, fontWeight: 700, color: active ? C.red : C.dim, fontFamily: MONO, letterSpacing: "0.06em" }}>DE-IDENTIFICATION FIREWALL</span>
      <span style={{ fontSize: 9, color: C.dim, marginLeft: "auto" }}>{active ? "Processing aggregate signal" : "Standing by"}</span>
    </div>
  );
}

function GovConstraints({ C }: { C: CType }) {
  return (
    <div style={{ padding: "8px 10px", borderRadius: 6, background: C.card, border: `1px solid ${C.border}` }}>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: C.dim, fontFamily: MONO, marginBottom: 3 }}>ALWAYS ENFORCED</div>
      {["No Prediction", "No Optimization", "No Profiling", "No Automated Decisions", "Sandbox = Non-Reportable"].map(p => (
        <div key={p} style={{ fontSize: 9, color: p.includes("Sandbox") ? C.sandbox : C.red, fontFamily: MONO, padding: "1px 0" }}>✕ {p}</div>
      ))}
    </div>
  );
}

export default function MultiChannelDemo() {
  const [theme, setTheme] = useState<ThemeKey>("dark");
  const [viewMode, setViewMode] = useState<"guided" | "explore">("guided");
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [exploreChannel, setExploreChannel] = useState<ChId>("edu");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const C = THEMES[theme];
  const CHANNELS = getChannels(C);

  useEffect(() => {
    if (playing && viewMode === "guided") {
      intervalRef.current = setInterval(() => {
        setPhase(p => {
          if (p >= JOURNEY.length - 1) { setPlaying(false); return p; }
          return p + 1;
        });
      }, 6000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, viewMode]);

  const jp = JOURNEY[phase];
  const activeChannel = viewMode === "guided" ? jp.channel : exploreChannel;
  const isISR = viewMode === "guided" && jp.mode === "isr";

  // key={theme} forces the browser to re-parse all CSS classes when theme changes
  const dynamicStyles = `
    @keyframes mcd-pulse { 0%,100%{opacity:1;filter:brightness(1)}50%{opacity:.6;filter:brightness(0.8)} }
    @keyframes mcd-slideIn { from{opacity:0;transform:translateY(16px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)} }
    .mcd-slide { animation: mcd-slideIn 0.4s ease; }
    .mcd-slide-fast { animation: mcd-slideIn 0.3s ease; }
    @media (max-width: 900px) {
      .mcd-layout { flex-direction: column !important; }
      .mcd-side { flex: none !important; width: 100% !important; border-bottom: 1px solid ${C.border}; border-right: none !important; border-left: none !important; height: auto !important; max-height: 40vh; }
    }
  `;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: FONT }}>
      {/* key={theme} ensures CSS re-parses completely on theme change */}
      <style key={theme}>{dynamicStyles}</style>

      {/* HEADER — sticks below the site header */}
      <div style={{
        padding: "14px 24px 12px",
        borderBottom: `1px solid ${C.border}`,
        background: C.bg2,
        position: "sticky", top: "56px", zIndex: 40,
        display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <Link href="/research/cmgf">
            <span
              style={{ fontSize: 11, color: C.dim, cursor: "pointer", fontFamily: MONO, paddingTop: 4, display: "block", whiteSpace: "nowrap", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.cyan)}
              onMouseLeave={e => (e.currentTarget.style.color = C.dim)}
            >
              ← CMGF
            </span>
          </Link>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.18em", color: C.cyan, fontWeight: 700, fontFamily: MONO }}>CAREER MOBILITY GOVERNANCE FRAMEWORK</div>
            <h1 style={{ fontSize: 18, fontWeight: 900, color: C.text, marginTop: 2 }}>Multi-Channel System Demonstration</h1>
            <div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>Sandbox Boundary · Channel Integration · ISR Signal Aggregation</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, color: C.dim, fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <div style={{ width: 1, height: 24, background: C.border, margin: "0 4px" }} />
          {(["guided", "explore"] as const).map(m => (
            <button key={m} onClick={() => { setViewMode(m); setPlaying(false); }} style={{
              padding: "8px 16px", borderRadius: 8,
              border: "1px solid " + (viewMode === m ? C.cyan : C.border),
              background: viewMode === m ? C.cyan + "15" : C.card,
              color: viewMode === m ? C.cyan : C.dim, fontSize: 11, fontWeight: 700,
              cursor: "pointer", fontFamily: MONO, textTransform: "uppercase", transition: "all 0.2s",
            }}>
              {m === "guided" ? "▶ Guided" : "◈ Explore"}
            </button>
          ))}
          {viewMode === "guided" && (
            <button onClick={() => setPlaying(!playing)} style={{
              padding: "8px 16px", borderRadius: 8,
              border: "1px solid " + (playing ? C.amber : C.amber + "40"),
              background: playing ? C.amber + "15" : C.card,
              color: C.amber, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: MONO,
              boxShadow: playing ? "0 0 12px " + C.amber + "30" : "none", transition: "all 0.2s",
            }}>
              {playing ? "❚❚" : "▶"} AUTO
            </button>
          )}
        </div>
      </div>

      {/* GUIDED MODE: Phase Timeline */}
      {viewMode === "guided" && (
        <div style={{ padding: "8px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 2, overflowX: "auto", background: C.bg2 }}>
          {JOURNEY.map((j, i) => {
            const isSB = j.mode === "sandbox";
            const isISRPhase = j.mode === "isr";
            const modeColor = isISRPhase ? C.amber : isSB ? C.sandbox : C.transaction;
            return (
              <button key={j.id} onClick={() => { setPhase(i); setPlaying(false); }} style={{
                flex: "1 1 0", minWidth: 60, padding: "6px 4px", borderRadius: 5, border: "none",
                background: i === phase ? `${modeColor}15` : "transparent", cursor: "pointer",
                position: "relative", transition: "background 0.3s",
              }}>
                {i === phase && <div style={{ position: "absolute", bottom: 0, left: "20%", right: "20%", height: 2, background: modeColor, borderRadius: 1 }} />}
                <div style={{ fontSize: 8, fontWeight: 700, color: modeColor, fontFamily: MONO, opacity: i === phase ? 1 : 0.5 }}>
                  {isSB ? "SANDBOX" : isISRPhase ? "ISR" : "ACTION"}
                </div>
                <div style={{ fontSize: 9, color: i === phase ? C.text : C.dim, fontWeight: i === phase ? 600 : 400, lineHeight: 1.2, marginTop: 2 }}>
                  {j.title.replace(/^(Sandbox|Action|ISR): ?/, "")}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* MAIN LAYOUT */}
      <div className="mcd-layout" style={{ display: "flex", minHeight: "calc(100vh - 200px)" }}>

        {/* LEFT PANEL */}
        <div className="mcd-side" style={{
          flex: "0 0 240px", padding: "12px 14px", borderRight: `1px solid ${C.border}`,
          overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, background: C.bg,
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: C.dim, fontFamily: MONO }}>CHANNELS</div>
          {CH_LIST.map(ch => (
            <ChannelCard key={ch} chId={ch}
              active={activeChannel === "all" || activeChannel === ch}
              expanded={(viewMode === "explore" && exploreChannel === ch) || isISR}
              onClick={() => { if (viewMode === "explore") setExploreChannel(ch); }}
              C={C}
            />
          ))}
          <FirewallDivider active={isISR || (viewMode === "guided" && jp.mode === "transaction")} C={C} />
          <GovConstraints C={C} />
        </div>

        {/* CENTER */}
        <div style={{ flex: 1, padding: "16px 24px", overflowY: "auto", position: "relative", background: C.bg }}>
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            fontSize: "12vw", fontWeight: 900, color: C.border, opacity: theme === "dark" ? 0.3 : 0.4,
            zIndex: 0, pointerEvents: "none", fontFamily: MONO, whiteSpace: "nowrap",
          }}>
            {activeChannel === "all" ? "ISR" : CHANNELS[activeChannel as ChId]?.short || ""}
          </div>

          {viewMode === "guided" ? (
            <div key={phase} className="mcd-slide" style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                <ModeIndicator mode={jp.mode} C={C} />
                {jp.channel !== "all" && (
                  <BadgeTag text={CHANNELS[jp.channel as ChId]?.label || ""} color={CHANNELS[jp.channel as ChId]?.color || C.dim} />
                )}
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 4 }}>{jp.title}</h2>
              <div style={{ fontSize: 12, color: C.cyan, fontFamily: MONO, marginBottom: 16 }}>{jp.sm}</div>

              <div style={{
                padding: 24, borderRadius: 12, border: `1px solid ${C.border}`,
                background: C.card, marginBottom: 16, boxShadow: `0 8px 32px ${C.glassDrop}`
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: C.dim, fontFamily: MONO, marginBottom: 6 }}>NARRATIVE</div>
                <p style={{ fontSize: 13, color: C.mid, lineHeight: 1.7 }}>{jp.narrative}</p>
              </div>

              <div style={{
                padding: 16, borderRadius: 10,
                background: jp.mode === "sandbox" ? `${C.sandbox}06` : jp.mode === "isr" ? `${C.amber}06` : `${C.transaction}06`,
                border: `1px solid ${jp.mode === "sandbox" ? C.sandbox + "25" : jp.mode === "isr" ? C.amber + "25" : C.transaction + "25"}`,
                marginBottom: 16,
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", fontFamily: MONO, marginBottom: 6, color: jp.mode === "sandbox" ? C.sandbox : jp.mode === "isr" ? C.amber : C.transaction }}>
                  ISR SIGNAL EFFECT
                </div>
                <p style={{ fontSize: 12, color: C.mid, lineHeight: 1.6 }}>{jp.isrEffect}</p>
              </div>

              <div style={{ padding: "12px 16px", borderRadius: 8, borderLeft: `3px solid ${C.cyan}`, background: `${C.cyan}06` }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: C.cyan, fontFamily: MONO, marginBottom: 4 }}>KEY POINT</div>
                <p style={{ fontSize: 12, color: C.text, lineHeight: 1.6 }}>{jp.keyPoint}</p>
              </div>

              {isISR && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: C.amber, fontFamily: MONO, marginBottom: 10 }}>
                    INSTALLATION ISR — ALL CHANNELS — REAL-TIME
                  </div>
                  <div style={{ padding: 20, borderRadius: 10, background: C.card, border: `1px solid ${C.amber}40`, boxShadow: `0 8px 32px ${C.glassDrop}` }}>
                    {CH_LIST.map(ch => <ISRBar key={ch} chId={ch} C={C} />)}
                    <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 6, background: `${C.amber}08`, border: `1px solid ${C.amber}15` }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.amber, fontFamily: MONO, marginBottom: 4 }}>CROSS-CHANNEL INSIGHTS</div>
                      <div style={{ fontSize: 11, color: C.mid, lineHeight: 1.6 }}>
                        <div>· Education + Credentialing: 68% of SMs who sandbox both channels submit at least one transaction within 30 days</div>
                        <div>· Chaplain demand spikes 34% within 2 weeks of deployment orders — correlates with 22% drop in education transactions</div>
                        <div>· TAP credential gap severity inversely correlated with years of TA/COOL engagement during service</div>
                        <div>· Voice of Soldier: "benefits navigation confusion" is the #1 reported friction across all channels (52%)</div>
                        <div>· Commander view: ESO staffing supports 1,200 transactions/month; current demand is 2,081 — 73% capacity gap</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                {CH_LIST.map(ch => (
                  <ChannelTab key={ch} ch={ch} active={exploreChannel === ch} onClick={() => setExploreChannel(ch)} C={C} />
                ))}
              </div>
              {(() => {
                const ch = CHANNELS[exploreChannel];
                const m = ISR_METRICS[exploreChannel];
                return (
                  <div key={exploreChannel} className="mcd-slide-fast">
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                      <span style={{ fontSize: 24, color: ch.color }}>{ch.icon}</span>
                      <div>
                        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{ch.label}</h2>
                        <div style={{ fontSize: 12, color: C.mid }}>{ch.desc}</div>
                      </div>
                    </div>
                    <div style={{ padding: 16, borderRadius: 12, border: `1px solid ${ch.color}30`, background: C.card, marginBottom: 14 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: ch.color, fontFamily: MONO, marginBottom: 6 }}>AUTHORITY TIER EXAMPLES</div>
                      <div style={{ fontSize: 11, color: C.mid, lineHeight: 1.6 }}>{ch.tierExamples}</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                      <div style={{ padding: 14, borderRadius: 10, background: C.card, border: `1px solid ${C.sandbox}25` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.sandbox }} />
                          <span style={{ fontSize: 11, fontWeight: 700, color: C.sandbox, fontFamily: MONO }}>SANDBOX MODE</span>
                        </div>
                        <div style={{ fontSize: 11, color: C.mid, lineHeight: 1.5 }}>SM explores this channel privately. Full constraint binding fires. Feasibility signals returned. Zero institutional footprint. No ISR signal. Non-reportable by architectural design.</div>
                      </div>
                      <div style={{ padding: 14, borderRadius: 10, background: C.card, border: `1px solid ${C.transaction}25` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.transaction }} />
                          <span style={{ fontSize: 11, fontWeight: 700, color: C.transaction, fontFamily: MONO }}>ACTION MODE</span>
                        </div>
                        <div style={{ fontSize: 11, color: C.mid, lineHeight: 1.5 }}>SM initiates institutional process. Transaction record generated. Enters ESO rack and stack. ISR signal captured. Full audit trail with constraint context and authority citations.</div>
                      </div>
                    </div>
                    <div style={{ padding: 14, borderRadius: 10, background: C.card, border: `1px solid ${C.border}`, marginBottom: 14 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: C.dim, fontFamily: MONO, marginBottom: 8 }}>ISR SIGNAL (30-DAY INSTALLATION AGGREGATE)</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                        <div>
                          <div style={{ fontSize: 22, fontWeight: 900, color: ch.color }}>{m.transactions}</div>
                          <div style={{ fontSize: 10, color: C.dim }}>Transactions</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 22, fontWeight: 900, color: m.pending > 20 ? C.amber : C.green }}>{m.pending}</div>
                          <div style={{ fontSize: 10, color: C.dim }}>Pending</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 22, fontWeight: 900, color: C.text }}>{m.avgTime}</div>
                          <div style={{ fontSize: 10, color: C.dim }}>Avg Action Time</div>
                        </div>
                      </div>
                      <div style={{ marginTop: 10, fontSize: 11, color: ch.color, fontFamily: MONO }}>Top constraint: {m.topConstraint}</div>
                      <div style={{ marginTop: 4, fontSize: 10, color: C.mid }}>{m.funnel}</div>
                    </div>
                    <div style={{ padding: 14, borderRadius: 10, background: C.card, border: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: C.dim, fontFamily: MONO, marginBottom: 6 }}>ISR SIGNAL TYPES FROM THIS CHANNEL</div>
                      {ch.signals.map(s => (
                        <div key={s} style={{ padding: "6px 10px", borderRadius: 5, marginBottom: 4, background: `${ch.color}06`, border: `1px solid ${ch.color}10`, fontSize: 11, color: C.mid }}>{s}</div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="mcd-side" style={{
          flex: "0 0 220px", padding: "12px 14px", borderLeft: `1px solid ${C.border}`,
          overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, background: C.bg,
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: C.dim, fontFamily: MONO }}>BINDING LAYER</div>

          <div style={{ padding: "12px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: C.dim, fontFamily: MONO, marginBottom: 8 }}>MODE</div>
            {viewMode === "guided" ? (
              <ModeIndicator mode={jp.mode} C={C} />
            ) : (
              <div style={{ fontSize: 11, color: C.mid }}>Select a channel to explore sandbox and action modes</div>
            )}
          </div>

          <div style={{ padding: "12px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: C.dim, fontFamily: MONO, marginBottom: 8 }}>AUTHORITY FLOW</div>
            {["External Sources", "↓ Encoded Rules", "Binding Layer", "↓ Constraint Signals", "Human Decision"].map((t, i) => (
              <div key={i} style={{
                fontSize: 10, color: t.includes("↓") ? C.dim : C.text,
                padding: t.includes("↓") ? "1px 0" : "3px 0",
                fontWeight: t.includes("↓") ? 400 : 600,
                fontFamily: t.includes("↓") ? MONO : FONT,
                textAlign: t.includes("↓") ? "center" : "left",
              }}>{t}</div>
            ))}
          </div>

          <div style={{ padding: "12px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: C.dim, fontFamily: MONO, marginBottom: 8 }}>AUTHORITY TIERS</div>
            {[
              { t: "A", label: "Statutory", color: C.red, desc: "Hard constraint" },
              { t: "B", label: "Credentialing", color: C.amber, desc: "Conditional" },
              { t: "C", label: "Institutional", color: C.blue, desc: "Preference" },
              { t: "D", label: "Labor Market", color: C.dim, desc: "Context only" },
            ].map(tier => (
              <div key={tier.t} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 900, color: tier.color, fontFamily: MONO, width: 14, textAlign: "center" }}>{tier.t}</span>
                <span style={{ fontSize: 11, color: C.text, flex: 1, fontWeight: 600 }}>{tier.label}</span>
                <span style={{ fontSize: 9, color: C.dim }}>{tier.desc}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: "12px", borderRadius: 8, background: C.card, border: `1px solid ${C.amber}40` }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: C.amber, fontFamily: MONO, marginBottom: 8 }}>ISR AGGREGATE</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: C.amber, letterSpacing: "-0.02em" }}>
              {Object.values(ISR_METRICS).reduce((a, m) => a + m.transactions, 0).toLocaleString()}
            </div>
            <div style={{ fontSize: 10, color: C.dim, marginBottom: 12 }}>total transactions (30-day)</div>
            {CH_LIST.map(ch => <ISRBar key={ch} chId={ch} C={C} />)}
          </div>

          <div style={{ padding: "8px 10px", borderRadius: 6, border: `1px solid ${C.sandbox}25`, background: `${C.sandbox}06` }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: C.sandbox, fontFamily: MONO, marginBottom: 2 }}>SANDBOX GUARANTEE</div>
            <div style={{ fontSize: 9, color: C.mid, lineHeight: 1.4 }}>Exploration activity is architecturally non-reportable. ISR totals reflect Action Mode transactions only. The SM controls the boundary.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
