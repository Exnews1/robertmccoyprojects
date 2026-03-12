import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";

// ─── CHANNEL DEFINITIONS ─────────────────────────────────────────────────────
const CHANNELS_BASE = {
  edu:  { id: "edu",  label: "Education Services",       short: "ESO",  icon: "◈", varColor: "--mcd-ch-edu",
    desc: "TA approvals, degree planning, credit evaluation, institutional transfer",
    signals: ["TA request volume", "Credit award rates", "Pathway completion funnels", "Funding cap exhaustion timing"],
    tierExamples: "Tier A: GI Bill eligibility | Tier B: ACEN standards | Tier C: Transfer policies | Tier D: BLS projections" },
  cool: { id: "cool", label: "Credentialing (COOL/CA)",  short: "COOL", icon: "◆", varColor: "--mcd-ch-cool",
    desc: "Certification authorization, exam scheduling, prerequisite verification",
    signals: ["CA authorization volume", "Cert demand by MOS", "Funding cap impact", "Pass rate by pathway"],
    tierExamples: "Tier A: COOL eligibility rules | Tier B: CompTIA/PMI prereqs | Tier C: Exam scheduling | Tier D: Employer cert preferences" },
  tap:  { id: "tap",  label: "Transition (TAP)",         short: "TAP",  icon: "◇", varColor: "--mcd-ch-tap",
    desc: "Separation planning, benefit transition, skills translation, career mapping",
    signals: ["Transition timeline events", "Credential gap frequency by MOS", "Benefit transition friction", "O*NET crosswalk utilization"],
    tierExamples: "Tier A: TAP requirements | Tier B: Target cert prereqs | Tier C: Gaining institution policies | Tier D: BLS/O*NET career data" },
  chap: { id: "chap", label: "Chaplain Services",        short: "CHAP", icon: "♦", varColor: "--mcd-ch-chap",
    desc: "Spiritual fitness, family readiness, morale support, crisis referral",
    signals: ["Support demand patterns", "Deployment cycle correlation", "Family readiness indicators", "Referral volume trends"],
    tierExamples: "Absolute confidentiality preserved | Aggregate demand patterns only | No individual attribution" },
  cmd:  { id: "cmd",  label: "Commander Reports",        short: "CMD",  icon: "★", varColor: "--mcd-ch-cmd",
    desc: "Installation readiness, resource allocation, force development, on-demand reporting",
    signals: ["Cross-channel readiness picture", "Resource demand vs. capacity", "Operational tempo impact", "Education participation rates"],
    tierExamples: "Consumes aggregate ISR from all channels | No individual SM data | Population-level patterns only" },
  vov:  { id: "vov",  label: "Voice of Soldier/Vet",     short: "VoV",  icon: "●", varColor: "--mcd-ch-vov",
    desc: "Reported friction, learner experience, system navigation barriers, feedback",
    signals: ["Friction point frequency", "Navigation barrier patterns", "Benefit confusion indicators", "Cross-channel pain points"],
    tierExamples: "SM-reported experience data | Aggregated by constraint type | Informs all other channel improvements" },
};
const CH_LIST = ["edu", "cool", "tap", "chap", "cmd", "vov"] as const;
type ChId = typeof CH_LIST[number];

const ISR_METRICS: Record<string, { transactions: number; pending: number; avgTime: string; topConstraint: string; funnel: string }> = {
  edu:  { transactions: 1247, pending: 43, avgTime: "8m",        topConstraint: "TA annual cap (38%)",                           funnel: "72% explore → 41% request → 37% approved → 29% enrolled" },
  cool: { transactions:  834, pending: 28, avgTime: "12m",       topConstraint: "CA funding limit (31%)",                        funnel: "65% explore → 38% request → 34% authorized → 28% certified" },
  tap:  { transactions:  412, pending: 15, avgTime: "22m",       topConstraint: "Credential gap (47%)",                          funnel: "100% mandatory → 78% engage planning → 52% actionable plan" },
  chap: { transactions:  623, pending:  0, avgTime: "N/A",       topConstraint: "Family readiness demand +34% during deployment", funnel: "Demand pattern only — no approval pipeline" },
  vov:  { transactions:  891, pending:  0, avgTime: "N/A",       topConstraint: "Benefits navigation confusion (52%)",            funnel: "Friction reports aggregated by constraint category" },
  cmd:  { transactions:  156, pending:  0, avgTime: "On-demand", topConstraint: "Cross-channel: ESO staffing vs. demand gap",     funnel: "Pulls from all channels — unified readiness view" },
};

const JOURNEY = [
  { id: "sandbox_edu",    title: "Sandbox: Education Exploration",    mode: "sandbox",     channel: "edu",
    sm: "SSG Torres — 2215 hrs, personal device",
    narrative: "SSG Torres is weighing reenlistment against pursuing a nursing degree. At 2215 after putting kids to bed, she opens CMGF and explores credential pathways. The binding layer evaluates her 68W MOS against nursing prerequisites, checks TA eligibility, maps state licensure requirements for Texas. She sees Go/Conditional/No-Go signals with full citations.",
    isrEffect: "No signal generated. This is private exploration. The ISR sees nothing. The ESO sees nothing. The rack and stack is not affected.",
    keyPoint: "The system serves the SM at the point of need — not the point of institutional convenience. 24/7 access to the full binding layer with zero institutional footprint." },
  { id: "sandbox_cool",   title: "Sandbox: Credentialing Exploration", mode: "sandbox",    channel: "cool",
    sm: "SSG Torres — same session, 2230 hrs",
    narrative: "Still exploring, Torres switches to the credentialing channel. She checks whether COOL covers CompTIA Security+ as a backup pathway if nursing doesn't work out. The binding layer evaluates COOL eligibility for her MOS, checks CA funding cap status, maps prerequisite requirements. She compares two credential stacks side by side.",
    isrEffect: "Still no signal. She's crossed channels within the same sandbox session. The system tracked nothing. Two channels consulted, zero institutional footprint.",
    keyPoint: "Channel switching within sandbox is seamless. The binding layer applies the correct authority rules for each channel automatically. The SM doesn't need to know which institutional authority governs what — the tier classification handles it." },
  { id: "transaction_edu", title: "Action: TA Request Submitted",     mode: "transaction", channel: "edu",
    sm: "SSG Torres — next morning, 0730 hrs",
    narrative: "Torres has decided. She initiates a TA request for a pre-nursing anatomy course. The moment she clicks Submit, she crosses from sandbox to transactional. The AI proxy generates a transaction record with full constraint context: eligibility confirmed, funding cap status, institutional approval needed, prerequisite chain documented.",
    isrEffect: "SIGNAL GENERATED. Transaction enters ESO rack and stack. Priority: ROUTINE (CONUS, no deadline pressure). ESO sees: TA request with pre-assembled documentation, constraint analysis complete, ready for approval action.",
    keyPoint: "The SM controlled when to cross the boundary. The system provided clear notification that submitting the request would generate an institutional transaction. Informed consent at the architectural level." },
  { id: "transaction_cool", title: "Action: COOL Authorization",      mode: "transaction", channel: "cool",
    sm: "SSG Torres — 0745 hrs",
    narrative: "Torres also submits a COOL authorization request for EMT-B certification, leveraging her 68W medical training. This enters the credentialing channel's transactional pipeline. The binding layer has already verified COOL eligibility, mapped her military medical training against EMT-B prerequisites, and confirmed CA funding availability.",
    isrEffect: "SECOND SIGNAL. Separate transaction enters the credentialing queue. Both transactions are now visible to the ESO — two items in the rack and stack, properly contextualized, ready for action.",
    keyPoint: "Two channels, two transactions, two queue entries — but the ESO sees a unified workload with constraint context pre-assembled for both. The overnight sandbox exploration that informed these requests is invisible." },
  { id: "eso_action",     title: "ESO Processes Queue",               mode: "transaction", channel: "edu",
    sm: "ESO perspective — 0830 hrs",
    narrative: "The ESO opens their morning queue. Torres's TA request and COOL authorization are in the stack alongside 14 other pending actions. Two DEPLOYED SMs with closing deadlines sit at CRITICAL. Torres's items are ROUTINE. Each item has pre-assembled documentation and constraint analysis.",
    isrEffect: "ESO decisions generate signal: approval rationale logged, processing time captured, constraint resolution documented. Both approval events feed the de-identification pipeline.",
    keyPoint: "The ESO spent 6 minutes on Torres's two requests because the constraint analysis was already done. Without CMGF, the same actions would require researching eligibility, checking caps, verifying prerequisites — estimated 1.5–2 hours." },
  { id: "tap_transition", title: "Transition Channel Activates",       mode: "transaction", channel: "tap",
    sm: "SSG Torres — 14 months later, separation window",
    narrative: "Torres enters her transition window. TAP is mandatory. But now the binding layer integrates her accumulated credential portfolio (anatomy course complete, EMT-B certified) against her target civilian career. BLS projections, O*NET crosswalks, and state-specific employer requirements are evaluated. Her credential gap is specific and actionable.",
    isrEffect: "Transition stream signal generated: credential-to-career mapping, benefit utilization summary (TA consumed, COOL utilized, remaining GI Bill eligibility), gap analysis against target occupation.",
    keyPoint: "The transition touchpoint is transformed from a generic briefing to a personalized constraint evaluation built on 14 months of transactional history. Sandbox sessions are invisible — only institutional transactions contributed." },
  { id: "isr_aggregate",  title: "Multi-Channel ISR",                 mode: "isr",         channel: "all",
    sm: "Installation-level aggregate",
    narrative: "All channels feed the de-identification firewall simultaneously. Education transactions, COOL authorizations, TAP touchpoints, chaplain demand patterns, Voice of the Soldier feedback, and commander on-demand queries contribute to a unified installation readiness picture. Every signal is de-identified, authority-tagged, and aggregated at population level.",
    isrEffect: "FULL ISR: Funding cap exhaustion rates across the force. Credential pathway completion funnels. Deployment impact on education participation. Chaplain demand correlation with operational tempo. Cross-channel friction patterns.",
    keyPoint: "The ISR is no longer a periodic, manually assembled compliance document. It is a continuous, multi-channel, governed institutional intelligence layer." },
];

// ─── CSS CUSTOM PROPERTIES APPROACH ─────────────────────────────────────────
// All colors live here. Changing data-theme on the root div instantly switches
// every descendant's color via CSS variable inheritance — no React re-render lag.
const THEME_CSS = `
  [data-mcd-theme] {
    font-family: 'Inter', -apple-system, sans-serif;
    min-height: 100vh;
    transition: background-color 0.25s ease, color 0.25s ease;
  }
  [data-mcd-theme="dark"] {
    --mcd-bg:          #060a12;
    --mcd-bg2:         #0c1220;
    --mcd-card:        #111827;
    --mcd-text:        #eaf0f8;
    --mcd-mid:         #8b9bb5;
    --mcd-dim:         #4a5a72;
    --mcd-border:      #1c2740;
    --mcd-border-lit:  #2a3f6e;
    --mcd-cyan:        #00d4aa;
    --mcd-amber:       #ffb020;
    --mcd-sandbox:     #06b6d4;
    --mcd-txn:         #f59e0b;
    --mcd-red:         #ff4d6a;
    --mcd-blue:        #4d94ff;
    --mcd-green:       #22c55e;
    --mcd-ch-edu:      #4d94ff;
    --mcd-ch-cool:     #a78bfa;
    --mcd-ch-tap:      #fb923c;
    --mcd-ch-chap:     #f472b6;
    --mcd-ch-cmd:      #ffb020;
    --mcd-ch-vov:      #22c55e;
    background-color: #060a12;
    color: #eaf0f8;
  }
  [data-mcd-theme="light"] {
    --mcd-bg:          #f8fafc;
    --mcd-bg2:         #f1f5f9;
    --mcd-card:        #ffffff;
    --mcd-text:        #0f172a;
    --mcd-mid:         #475569;
    --mcd-dim:         #64748b;
    --mcd-border:      #e2e8f0;
    --mcd-border-lit:  #cbd5e1;
    --mcd-cyan:        #0d9488;
    --mcd-amber:       #d97706;
    --mcd-sandbox:     #0891b2;
    --mcd-txn:         #d97706;
    --mcd-red:         #e11d48;
    --mcd-blue:        #2563eb;
    --mcd-green:       #16a34a;
    --mcd-ch-edu:      #2563eb;
    --mcd-ch-cool:     #7c3aed;
    --mcd-ch-tap:      #ea580c;
    --mcd-ch-chap:     #db2777;
    --mcd-ch-cmd:      #d97706;
    --mcd-ch-vov:      #16a34a;
    background-color: #f8fafc;
    color: #0f172a;
  }

  /* Key structural elements use CSS vars for instant theme response */
  .mcd-header  { background: var(--mcd-bg2); border-bottom: 1px solid var(--mcd-border); }
  .mcd-timeline{ background: var(--mcd-bg2); border-bottom: 1px solid var(--mcd-border); }
  .mcd-left    { background: var(--mcd-bg);  border-right: 1px solid var(--mcd-border); }
  .mcd-center  { background: var(--mcd-bg); }
  .mcd-right   { background: var(--mcd-bg);  border-left: 1px solid var(--mcd-border); }
  .mcd-card-box { background: var(--mcd-card); border: 1px solid var(--mcd-border); border-radius: 8px; padding: 12px; }
  .mcd-channel-card { border-radius: 10px; cursor: pointer; overflow: hidden; transition: all 0.3s ease; }

  /* Animations */
  @keyframes mcd-pulse { 0%,100%{opacity:1}50%{opacity:.5} }
  @keyframes mcd-slideIn { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
  .mcd-slide { animation: mcd-slideIn 0.4s ease; }
  .mcd-slide-fast { animation: mcd-slideIn 0.3s ease; }

  /* Responsive */
  @media (max-width: 900px) {
    .mcd-layout { flex-direction: column !important; }
    .mcd-left, .mcd-right { flex: none !important; width: 100% !important; max-height: 40vh; border-right: none !important; border-left: none !important; }
  }
`;

const MONO = "'JetBrains Mono', monospace";

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function Chip({ text, color, filled = false, mono = false }: { text: string; color: string; filled?: boolean; mono?: boolean }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 4,
      background: filled ? color : color + "18",
      border: "1px solid " + color + (filled ? "" : "55"),
      fontSize: 10, fontWeight: 700, color: filled ? "#fff" : color,
      fontFamily: mono ? MONO : "inherit", letterSpacing: "0.03em", whiteSpace: "nowrap",
    }}>
      {text}
    </span>
  );
}

function ModeIndicator({ mode }: { mode: string }) {
  if (mode === "isr") {
    return <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: 4, background: "var(--mcd-amber)", fontSize: 10, fontWeight: 700, color: "#fff", fontFamily: MONO, letterSpacing: "0.03em" }}>ISR AGGREGATE</span>;
  }
  const isSandbox = mode === "sandbox";
  const col = isSandbox ? "var(--mcd-sandbox)" : "var(--mcd-txn)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: col, animation: "mcd-pulse 2s ease-in-out infinite" }} />
      <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 4, background: col, fontSize: 10, fontWeight: 700, color: "#fff", fontFamily: MONO, letterSpacing: "0.03em" }}>
        {isSandbox ? "EXPLORATION MODE" : "ACTION MODE"}
      </span>
      {!isSandbox && (
        <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 4, background: "var(--mcd-txn)18", border: "1px solid var(--mcd-txn)55", fontSize: 10, fontWeight: 700, color: "var(--mcd-txn)", fontFamily: MONO }}>
          SIGNAL GENERATING
        </span>
      )}
    </div>
  );
}

function ISRBar({ chId }: { chId: ChId }) {
  const ch = CHANNELS_BASE[chId];
  const m = ISR_METRICS[chId];
  const pct = (m.transactions / 1300) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <span style={{ fontSize: 10, color: "var(" + ch.varColor + ")", width: 36, fontFamily: MONO, fontWeight: 700 }}>{ch.short}</span>
      <div style={{ flex: 1, height: 14, background: "var(" + ch.varColor + ")18", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: pct + "%", height: "100%", background: "linear-gradient(90deg, var(" + ch.varColor + ")50, var(" + ch.varColor + "))", borderRadius: 4, transition: "width 0.8s ease" }} />
      </div>
      <span style={{ fontSize: 10, color: "var(--mcd-mid)", fontFamily: MONO, width: 45, textAlign: "right" }}>{m.transactions}</span>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function MultiChannelDemo() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [viewMode, setViewMode] = useState<"guided" | "explore">("guided");
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [exploreChannel, setExploreChannel] = useState<ChId>("edu");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing && viewMode === "guided") {
      intervalRef.current = setInterval(() => {
        setPhase(p => { if (p >= JOURNEY.length - 1) { setPlaying(false); return p; } return p + 1; });
      }, 6000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, viewMode]);

  const jp = JOURNEY[phase];
  const activeChannel = viewMode === "guided" ? jp.channel : exploreChannel;
  const isISR = viewMode === "guided" && jp.mode === "isr";
  const isTxn = viewMode === "guided" && jp.mode === "transaction";

  const chColor = (id: string) => "var(" + CHANNELS_BASE[id as ChId]?.varColor + ")";

  return (
    <div data-mcd-theme={theme} style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{THEME_CSS}</style>

      {/* ── HEADER ── */}
      <div className="mcd-header" style={{
        padding: "14px 24px 12px", position: "sticky", top: "56px", zIndex: 40,
        display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <Link href="/research/cmgf">
            <span style={{ fontSize: 11, color: "var(--mcd-dim)", cursor: "pointer", fontFamily: MONO, paddingTop: 4, display: "block", whiteSpace: "nowrap", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--mcd-cyan)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--mcd-dim)")}>
              ← CMGF
            </span>
          </Link>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--mcd-cyan)", fontWeight: 700, fontFamily: MONO }}>CAREER MOBILITY GOVERNANCE FRAMEWORK</div>
            <h1 style={{ fontSize: 18, fontWeight: 900, color: "var(--mcd-text)", marginTop: 2 }}>Multi-Channel System Demonstration</h1>
            <div style={{ fontSize: 11, color: "var(--mcd-dim)", marginTop: 2 }}>Sandbox Boundary · Channel Integration · ISR Signal Aggregation</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Theme toggle — data-mcd-theme on root div switches instantly via CSS vars */}
          <button
            data-testid="button-theme-toggle"
            onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
            style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid var(--mcd-border)", background: "var(--mcd-card)", color: "var(--mcd-text)", fontSize: 14, cursor: "pointer", transition: "all 0.2s", fontFamily: MONO }}
            title="Toggle light / dark mode"
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
          <div style={{ width: 1, height: 24, background: "var(--mcd-border)" }} />
          {(["guided", "explore"] as const).map(m => (
            <button key={m} onClick={() => { setViewMode(m); setPlaying(false); }} style={{
              padding: "8px 14px", borderRadius: 8,
              border: "1px solid " + (viewMode === m ? "var(--mcd-cyan)" : "var(--mcd-border)"),
              background: viewMode === m ? "var(--mcd-cyan)" : "var(--mcd-card)",
              color: viewMode === m ? "#fff" : "var(--mcd-dim)",
              fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: MONO, textTransform: "uppercase", transition: "all 0.2s",
            }}>
              {m === "guided" ? "▶ Guided" : "◈ Explore"}
            </button>
          ))}
          {viewMode === "guided" && (
            <button onClick={() => setPlaying(p => !p)} style={{
              padding: "8px 14px", borderRadius: 8,
              border: "1px solid " + (playing ? "var(--mcd-amber)" : "var(--mcd-border)"),
              background: playing ? "var(--mcd-amber)" : "var(--mcd-card)",
              color: playing ? "#fff" : "var(--mcd-amber)",
              fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: MONO, transition: "all 0.2s",
            }}>
              {playing ? "❚❚" : "▶"} AUTO
            </button>
          )}
        </div>
      </div>

      {/* ── PHASE TIMELINE ── */}
      {viewMode === "guided" && (
        <div className="mcd-timeline" style={{ padding: "8px 24px", display: "flex", gap: 2, overflowX: "auto" }}>
          {JOURNEY.map((j, i) => {
            const isSB = j.mode === "sandbox";
            const isISRp = j.mode === "isr";
            const col = isISRp ? "var(--mcd-amber)" : isSB ? "var(--mcd-sandbox)" : "var(--mcd-txn)";
            return (
              <button key={j.id} onClick={() => { setPhase(i); setPlaying(false); }} style={{
                flex: "1 1 0", minWidth: 60, padding: "6px 4px", borderRadius: 5, border: "none",
                background: i === phase ? col + "20" : "transparent", cursor: "pointer",
                position: "relative", transition: "background 0.3s",
              }}>
                {i === phase && <div style={{ position: "absolute", bottom: 0, left: "20%", right: "20%", height: 2, background: col, borderRadius: 1 }} />}
                <div style={{ fontSize: 8, fontWeight: 700, color: col, fontFamily: MONO, opacity: i === phase ? 1 : 0.5 }}>
                  {isSB ? "SANDBOX" : isISRp ? "ISR" : "ACTION"}
                </div>
                <div style={{ fontSize: 9, color: i === phase ? "var(--mcd-text)" : "var(--mcd-dim)", fontWeight: i === phase ? 600 : 400, lineHeight: 1.2, marginTop: 2 }}>
                  {j.title.replace(/^(Sandbox|Action|ISR): ?/, "")}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── MAIN LAYOUT ── */}
      <div className="mcd-layout" style={{ display: "flex", minHeight: "calc(100vh - 200px)" }}>

        {/* LEFT — channels */}
        <div className="mcd-left" style={{ flex: "0 0 240px", padding: "12px 14px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "var(--mcd-dim)", fontFamily: MONO }}>CHANNELS</div>
          {CH_LIST.map(chId => {
            const ch = CHANNELS_BASE[chId];
            const m = ISR_METRICS[chId];
            const chCol = "var(" + ch.varColor + ")";
            const active = activeChannel === "all" || activeChannel === chId;
            const expanded = (viewMode === "explore" && exploreChannel === chId) || isISR;
            return (
              <div key={chId} onClick={() => { if (viewMode === "explore") setExploreChannel(chId); }}
                style={{
                  border: "1.5px solid " + (active ? chCol : "var(--mcd-border)"),
                  background: active ? chCol + "15" : "var(--mcd-bg2)",
                  borderRadius: 10, padding: expanded ? "14px 16px" : "10px 14px", cursor: "pointer",
                  transition: "all 0.3s ease", overflow: "hidden",
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: expanded ? 8 : 0 }}>
                  <span style={{ fontSize: 14, color: chCol }}>{ch.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: active ? "var(--mcd-text)" : "var(--mcd-mid)", flex: 1 }}>{ch.label}</span>
                  <span style={{ fontSize: 10, color: "var(--mcd-dim)", fontFamily: MONO }}>{m.transactions} txn</span>
                </div>
                {expanded && (
                  <div style={{ marginTop: 4 }}>
                    <div style={{ fontSize: 11, color: "var(--mcd-mid)", marginBottom: 6, lineHeight: 1.4 }}>{ch.desc}</div>
                    <div style={{ fontSize: 10, color: "var(--mcd-dim)", fontFamily: MONO }}>Pending: {m.pending} | Avg: {m.avgTime}</div>
                    <div style={{ fontSize: 10, color: chCol, fontFamily: MONO, marginTop: 2 }}>Top constraint: {m.topConstraint}</div>
                    <div style={{ marginTop: 6, fontSize: 9, fontWeight: 700, color: "var(--mcd-dim)", letterSpacing: "0.08em", marginBottom: 3 }}>ISR SIGNALS</div>
                    {ch.signals.map(s => <div key={s} style={{ fontSize: 10, color: "var(--mcd-mid)", padding: "1px 0" }}>· {s}</div>)}
                  </div>
                )}
              </div>
            );
          })}

          {/* Firewall divider */}
          <div style={{
            margin: "8px 0", padding: "6px 12px", borderRadius: 6,
            border: "1px dashed " + ((isISR || isTxn) ? "var(--mcd-red)" : "var(--mcd-border)"),
            background: (isISR || isTxn) ? "var(--mcd-red)08" : "transparent",
            display: "flex", alignItems: "center", gap: 8, transition: "all 0.4s",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: (isISR || isTxn) ? "var(--mcd-red)" : "var(--mcd-dim)", animation: (isISR || isTxn) ? "mcd-pulse 1.5s ease infinite" : "none" }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: (isISR || isTxn) ? "var(--mcd-red)" : "var(--mcd-dim)", fontFamily: MONO, letterSpacing: "0.06em" }}>DE-IDENTIFICATION FIREWALL</span>
            <span style={{ fontSize: 9, color: "var(--mcd-dim)", marginLeft: "auto" }}>{(isISR || isTxn) ? "Processing" : "Standing by"}</span>
          </div>

          {/* Gov constraints */}
          <div className="mcd-card-box" style={{ padding: "8px 10px" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "var(--mcd-dim)", fontFamily: MONO, marginBottom: 3 }}>ALWAYS ENFORCED</div>
            {["No Prediction", "No Optimization", "No Profiling", "No Automated Decisions", "Sandbox = Non-Reportable"].map(p => (
              <div key={p} style={{ fontSize: 9, color: p.includes("Sandbox") ? "var(--mcd-sandbox)" : "var(--mcd-red)", fontFamily: MONO, padding: "1px 0" }}>✕ {p}</div>
            ))}
          </div>
        </div>

        {/* CENTER */}
        <div className="mcd-center" style={{ flex: 1, padding: "16px 24px", overflowY: "auto", position: "relative" }}>
          {/* Watermark */}
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            fontSize: "12vw", fontWeight: 900, color: "var(--mcd-border)", opacity: 0.5,
            zIndex: 0, pointerEvents: "none", fontFamily: MONO, whiteSpace: "nowrap",
          }}>
            {activeChannel === "all" ? "ISR" : CHANNELS_BASE[activeChannel as ChId]?.short || ""}
          </div>

          {viewMode === "guided" ? (
            <div key={phase} className="mcd-slide" style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                <ModeIndicator mode={jp.mode} />
                {jp.channel !== "all" && <Chip text={CHANNELS_BASE[jp.channel as ChId]?.label || ""} color={chColor(jp.channel)} />}
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--mcd-text)", marginBottom: 4 }}>{jp.title}</h2>
              <div style={{ fontSize: 12, color: "var(--mcd-cyan)", fontFamily: MONO, marginBottom: 16 }}>{jp.sm}</div>

              <div style={{ padding: 24, borderRadius: 12, border: "1px solid var(--mcd-border)", background: "var(--mcd-card)", marginBottom: 16 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "var(--mcd-dim)", fontFamily: MONO, marginBottom: 6 }}>NARRATIVE</div>
                <p style={{ fontSize: 13, color: "var(--mcd-mid)", lineHeight: 1.7 }}>{jp.narrative}</p>
              </div>

              <div style={{
                padding: 16, borderRadius: 10, marginBottom: 16,
                background: jp.mode === "sandbox" ? "var(--mcd-sandbox)08" : jp.mode === "isr" ? "var(--mcd-amber)08" : "var(--mcd-txn)08",
                border: "1px solid " + (jp.mode === "sandbox" ? "var(--mcd-sandbox)30" : jp.mode === "isr" ? "var(--mcd-amber)30" : "var(--mcd-txn)30"),
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", fontFamily: MONO, marginBottom: 6,
                  color: jp.mode === "sandbox" ? "var(--mcd-sandbox)" : jp.mode === "isr" ? "var(--mcd-amber)" : "var(--mcd-txn)" }}>
                  ISR SIGNAL EFFECT
                </div>
                <p style={{ fontSize: 12, color: "var(--mcd-mid)", lineHeight: 1.6 }}>{jp.isrEffect}</p>
              </div>

              <div style={{ padding: "12px 16px", borderRadius: 8, borderLeft: "3px solid var(--mcd-cyan)", background: "var(--mcd-cyan)08" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "var(--mcd-cyan)", fontFamily: MONO, marginBottom: 4 }}>KEY POINT</div>
                <p style={{ fontSize: 12, color: "var(--mcd-text)", lineHeight: 1.6 }}>{jp.keyPoint}</p>
              </div>

              {isISR && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "var(--mcd-amber)", fontFamily: MONO, marginBottom: 10 }}>INSTALLATION ISR — ALL CHANNELS — REAL-TIME</div>
                  <div style={{ padding: 20, borderRadius: 10, background: "var(--mcd-card)", border: "1px solid var(--mcd-amber)" }}>
                    {CH_LIST.map(ch => <ISRBar key={ch} chId={ch} />)}
                    <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 6, background: "var(--mcd-amber)08", border: "1px solid var(--mcd-amber)20" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--mcd-amber)", fontFamily: MONO, marginBottom: 4 }}>CROSS-CHANNEL INSIGHTS</div>
                      <div style={{ fontSize: 11, color: "var(--mcd-mid)", lineHeight: 1.6 }}>
                        <div>· Education + Credentialing: 68% of SMs who sandbox both channels submit at least one transaction within 30 days</div>
                        <div>· Chaplain demand spikes 34% within 2 weeks of deployment orders — correlates with 22% drop in education transactions</div>
                        <div>· TAP credential gap severity inversely correlated with years of TA/COOL engagement during service</div>
                        <div>· Voice of Soldier: "benefits navigation confusion" is the #1 reported friction across all channels (52%)</div>
                        <div>· Commander view: ESO staffing supports 1,200 txn/month; current demand is 2,081 — 73% capacity gap</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* EXPLORE MODE */
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                {CH_LIST.map(chId => {
                  const ch = CHANNELS_BASE[chId];
                  const chCol = "var(" + ch.varColor + ")";
                  return (
                    <button key={chId} onClick={() => setExploreChannel(chId)} style={{
                      padding: "8px 14px", borderRadius: 8,
                      border: "1px solid " + (exploreChannel === chId ? chCol : "var(--mcd-border)"),
                      background: exploreChannel === chId ? chCol + "20" : "var(--mcd-card)",
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
                    }}>
                      <span style={{ fontSize: 12, color: chCol }}>{ch.icon}</span>
                      <span style={{ fontSize: 11, fontWeight: exploreChannel === chId ? 700 : 500, color: exploreChannel === chId ? chCol : "var(--mcd-mid)" }}>{ch.short}</span>
                    </button>
                  );
                })}
              </div>
              {(() => {
                const ch = CHANNELS_BASE[exploreChannel];
                const m = ISR_METRICS[exploreChannel];
                const chCol = "var(" + ch.varColor + ")";
                return (
                  <div key={exploreChannel} className="mcd-slide-fast">
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                      <span style={{ fontSize: 24, color: chCol }}>{ch.icon}</span>
                      <div>
                        <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--mcd-text)" }}>{ch.label}</h2>
                        <div style={{ fontSize: 12, color: "var(--mcd-mid)" }}>{ch.desc}</div>
                      </div>
                    </div>
                    <div style={{ padding: 16, borderRadius: 12, border: "1px solid " + chCol, background: "var(--mcd-card)", marginBottom: 14 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: chCol, fontFamily: MONO, marginBottom: 6 }}>AUTHORITY TIER EXAMPLES</div>
                      <div style={{ fontSize: 11, color: "var(--mcd-mid)", lineHeight: 1.6 }}>{ch.tierExamples}</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                      <div style={{ padding: 14, borderRadius: 10, background: "var(--mcd-card)", border: "1px solid var(--mcd-sandbox)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--mcd-sandbox)" }} />
                          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--mcd-sandbox)", fontFamily: MONO }}>SANDBOX MODE</span>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--mcd-mid)", lineHeight: 1.5 }}>SM explores this channel privately. Full constraint binding fires. Feasibility signals returned. Zero institutional footprint. No ISR signal. Non-reportable by architectural design.</div>
                      </div>
                      <div style={{ padding: 14, borderRadius: 10, background: "var(--mcd-card)", border: "1px solid var(--mcd-txn)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--mcd-txn)" }} />
                          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--mcd-txn)", fontFamily: MONO }}>ACTION MODE</span>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--mcd-mid)", lineHeight: 1.5 }}>SM initiates institutional process. Transaction record generated. Enters ESO rack and stack. ISR signal captured. Full audit trail with constraint context and authority citations.</div>
                      </div>
                    </div>
                    <div style={{ padding: 14, borderRadius: 10, background: "var(--mcd-card)", border: "1px solid var(--mcd-border)", marginBottom: 14 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "var(--mcd-dim)", fontFamily: MONO, marginBottom: 8 }}>ISR SIGNAL (30-DAY INSTALLATION AGGREGATE)</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                        <div><div style={{ fontSize: 22, fontWeight: 900, color: chCol }}>{m.transactions}</div><div style={{ fontSize: 10, color: "var(--mcd-dim)" }}>Transactions</div></div>
                        <div><div style={{ fontSize: 22, fontWeight: 900, color: m.pending > 20 ? "var(--mcd-amber)" : "var(--mcd-green)" }}>{m.pending}</div><div style={{ fontSize: 10, color: "var(--mcd-dim)" }}>Pending</div></div>
                        <div><div style={{ fontSize: 22, fontWeight: 900, color: "var(--mcd-text)" }}>{m.avgTime}</div><div style={{ fontSize: 10, color: "var(--mcd-dim)" }}>Avg Action Time</div></div>
                      </div>
                      <div style={{ marginTop: 10, fontSize: 11, color: chCol, fontFamily: MONO }}>Top constraint: {m.topConstraint}</div>
                      <div style={{ marginTop: 4, fontSize: 10, color: "var(--mcd-mid)" }}>{m.funnel}</div>
                    </div>
                    <div style={{ padding: 14, borderRadius: 10, background: "var(--mcd-card)", border: "1px solid var(--mcd-border)" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "var(--mcd-dim)", fontFamily: MONO, marginBottom: 6 }}>ISR SIGNAL TYPES FROM THIS CHANNEL</div>
                      {ch.signals.map(s => (
                        <div key={s} style={{ padding: "6px 10px", borderRadius: 5, marginBottom: 4, background: chCol + "08", border: "1px solid " + chCol + "20", fontSize: 11, color: "var(--mcd-mid)" }}>{s}</div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* RIGHT — binding layer */}
        <div className="mcd-right" style={{ flex: "0 0 220px", padding: "12px 14px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "var(--mcd-dim)", fontFamily: MONO }}>BINDING LAYER</div>

          <div className="mcd-card-box">
            <div style={{ fontSize: 9, fontWeight: 700, color: "var(--mcd-dim)", fontFamily: MONO, marginBottom: 8 }}>MODE</div>
            {viewMode === "guided" ? <ModeIndicator mode={jp.mode} /> : <div style={{ fontSize: 11, color: "var(--mcd-mid)" }}>Select a channel to explore sandbox and action modes</div>}
          </div>

          <div className="mcd-card-box">
            <div style={{ fontSize: 9, fontWeight: 700, color: "var(--mcd-dim)", fontFamily: MONO, marginBottom: 8 }}>AUTHORITY FLOW</div>
            {["External Sources", "↓ Encoded Rules", "Binding Layer", "↓ Constraint Signals", "Human Decision"].map((t, i) => (
              <div key={i} style={{
                fontSize: 10, color: t.includes("↓") ? "var(--mcd-dim)" : "var(--mcd-text)",
                padding: t.includes("↓") ? "1px 0" : "3px 0", fontWeight: t.includes("↓") ? 400 : 600,
                fontFamily: t.includes("↓") ? MONO : "inherit", textAlign: t.includes("↓") ? "center" : "left",
              }}>{t}</div>
            ))}
          </div>

          <div className="mcd-card-box">
            <div style={{ fontSize: 9, fontWeight: 700, color: "var(--mcd-dim)", fontFamily: MONO, marginBottom: 8 }}>AUTHORITY TIERS</div>
            {[
              { t: "A", label: "Statutory",    color: "var(--mcd-red)",   desc: "Hard constraint" },
              { t: "B", label: "Credentialing", color: "var(--mcd-amber)", desc: "Conditional" },
              { t: "C", label: "Institutional", color: "var(--mcd-blue)",  desc: "Preference" },
              { t: "D", label: "Labor Market",  color: "var(--mcd-dim)",   desc: "Context only" },
            ].map(tier => (
              <div key={tier.t} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 900, color: tier.color, fontFamily: MONO, width: 14, textAlign: "center" }}>{tier.t}</span>
                <span style={{ fontSize: 11, color: "var(--mcd-text)", flex: 1, fontWeight: 600 }}>{tier.label}</span>
                <span style={{ fontSize: 9, color: "var(--mcd-dim)" }}>{tier.desc}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: "12px", borderRadius: 8, background: "var(--mcd-card)", border: "1px solid var(--mcd-amber)" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "var(--mcd-amber)", fontFamily: MONO, marginBottom: 8 }}>ISR AGGREGATE</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "var(--mcd-amber)", letterSpacing: "-0.02em" }}>
              {Object.values(ISR_METRICS).reduce((a, m) => a + m.transactions, 0).toLocaleString()}
            </div>
            <div style={{ fontSize: 10, color: "var(--mcd-dim)", marginBottom: 12 }}>total transactions (30-day)</div>
            {CH_LIST.map(ch => <ISRBar key={ch} chId={ch} />)}
          </div>

          <div style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid var(--mcd-sandbox)", background: "var(--mcd-sandbox)08" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "var(--mcd-sandbox)", fontFamily: MONO, marginBottom: 2 }}>SANDBOX GUARANTEE</div>
            <div style={{ fontSize: 9, color: "var(--mcd-mid)", lineHeight: 1.4 }}>Exploration activity is architecturally non-reportable. ISR totals reflect Action Mode transactions only. The SM controls the boundary.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
