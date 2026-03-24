import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { DemoNav } from "@/components/demo-nav";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const MONO = "'JetBrains Mono', monospace";

const THEME_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
  [data-mcd] { font-family: 'Inter', -apple-system, sans-serif; }
  [data-mcd="dark"]  { --bg:#060a12; --bg2:#0c1220; --card:#111827; --text:#eaf0f8; --mid:#8b9bb5; --dim:#4a5a72; --border:#1c2740; --blit:#2a3f6e; --cyan:#00d4aa; --amber:#ffb020; --sb:#06b6d4; --txn:#f59e0b; --red:#ff4d6a; --blue:#4d94ff; --green:#22c55e; --purple:#a78bfa; --chEdu:#4d94ff; --chCool:#a78bfa; --chTap:#fb923c; --chChap:#f472b6; --chCmd:#ffb020; --chVoV:#22c55e; background:#060a12; color:#eaf0f8; }
  [data-mcd="light"] { --bg:#f8fafc; --bg2:#f1f5f9; --card:#ffffff; --text:#0f172a; --mid:#475569; --dim:#64748b; --border:#e2e8f0; --blit:#cbd5e1; --cyan:#0d9488; --amber:#d97706; --sb:#0891b2; --txn:#d97706; --red:#e11d48; --blue:#2563eb; --green:#16a34a; --purple:#7c3aed; --chEdu:#2563eb; --chCool:#7c3aed; --chTap:#ea580c; --chChap:#db2777; --chCmd:#d97706; --chVoV:#16a34a; background:#f8fafc; color:#0f172a; }
  .mcd-card { background:var(--card); border:1px solid var(--border); border-radius:10px; padding:14px; }
  .mcd-ch { border-radius:8px; cursor:pointer; transition:all 0.25s; }
  @keyframes mcd-pulse { 0%,100%{opacity:1}50%{opacity:.4} }
  @keyframes mcd-in { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
  .mcd-in { animation:mcd-in 0.35s ease; }
`;

// ─── DATA ──────────────────────────────────────────────────────────────────────
const CH = {
  edu:  { label:"Education Services",      short:"ESO",  icon:"◈", v:"--chEdu",  desc:"TA approvals, degree planning, credit evaluation, institutional transfer",            signals:["TA request volume","Credit award rates","Pathway completion funnels","Funding cap exhaustion timing"],  tiers:"Tier A: GI Bill eligibility | Tier B: ACEN standards | Tier C: Transfer policies | Tier D: BLS projections" },
  cool: { label:"Credentialing (COOL/CA)", short:"COOL", icon:"◆", v:"--chCool", desc:"Certification authorization, exam scheduling, prerequisite verification",             signals:["CA authorization volume","Cert demand by MOS","Funding cap impact","Pass rate by pathway"],          tiers:"Tier A: COOL eligibility rules | Tier B: CompTIA/PMI prereqs | Tier C: Exam scheduling | Tier D: Employer cert preferences" },
  tap:  { label:"Transition (TAP)",        short:"TAP",  icon:"◇", v:"--chTap",  desc:"Separation planning, benefit transition, skills translation, career mapping",         signals:["Transition timeline events","Credential gap by MOS","Benefit transition friction","O*NET crosswalk utilization"], tiers:"Tier A: TAP requirements | Tier B: Target cert prereqs | Tier C: Gaining institution policies | Tier D: BLS/O*NET career data" },
  chap: { label:"Chaplain Services",       short:"CHAP", icon:"♦", v:"--chChap", desc:"Spiritual fitness, family readiness, morale support, crisis referral",                signals:["Support demand patterns","Deployment cycle correlation","Family readiness indicators","Referral volume trends"], tiers:"Absolute confidentiality preserved | Aggregate demand patterns only | No individual attribution" },
  cmd:  { label:"Commander Reports",       short:"CMD",  icon:"★", v:"--chCmd",  desc:"Installation readiness, resource allocation, force development, on-demand reporting", signals:["Cross-channel readiness","Resource demand vs. capacity","Operational tempo impact","Education participation rates"], tiers:"Consumes aggregate ISR from all channels | No individual SM data | Population-level patterns only" },
  vov:  { label:"Voice of Soldier/Vet",   short:"VoV",  icon:"●", v:"--chVoV",  desc:"Reported friction, learner experience, system navigation barriers, feedback",         signals:["Friction point frequency","Navigation barrier patterns","Benefit confusion indicators","Cross-channel pain points"], tiers:"SM-reported experience | Aggregated by constraint type | Informs all channel improvements" },
} as const;
type ChId = keyof typeof CH;
const CH_LIST: ChId[] = ["edu","cool","tap","chap","cmd","vov"];

const METRICS: Record<ChId,{transactions:number;pending:number;avgTime:string;topConstraint:string;funnel:string}> = {
  edu:  { transactions:1247, pending:43, avgTime:"8m",        topConstraint:"TA annual cap (38%)",                           funnel:"72% explore → 41% request → 37% approved → 29% enrolled" },
  cool: { transactions:834,  pending:28, avgTime:"12m",       topConstraint:"CA funding limit (31%)",                        funnel:"65% explore → 38% request → 34% authorized → 28% certified" },
  tap:  { transactions:412,  pending:15, avgTime:"22m",       topConstraint:"Credential gap (47%)",                          funnel:"100% mandatory → 78% engage planning → 52% actionable plan" },
  chap: { transactions:623,  pending:0,  avgTime:"N/A",       topConstraint:"Family readiness demand +34% during deployment", funnel:"Demand pattern only — no approval pipeline" },
  vov:  { transactions:891,  pending:0,  avgTime:"N/A",       topConstraint:"Benefits navigation confusion (52%)",            funnel:"Friction reports aggregated by constraint category" },
  cmd:  { transactions:156,  pending:0,  avgTime:"On-demand", topConstraint:"Cross-channel: ESO staffing vs. demand gap",     funnel:"Pulls from all channels — unified readiness view" },
};

// ─── PARTS ────────────────────────────────────────────────────────────────────
const PARTS = [
  {
    id: "a", label: "Part A", title: "Service Member Interface", role: "Individual Agency",
    icon: "◈", color: "var(--blue)",
    href: "/research/cmgf/walkthrough/part-a",
    summary: "Individuals explore career futures safely, without commitment. Exploratory sessions generate zero institutional footprint. The SM controls when — and whether — they cross from sandbox to action.",
    keyPoints: [
      "24/7 access from personal devices — no office hours required",
      "Sandbox exploration is architecturally non-reportable",
      "Full constraint binding fires — feasibility signals returned — no ISR generated",
      "SM controls the boundary between exploration and institutional action",
      "Multi-channel sandbox: education, credentialing, and transition explored privately",
    ],
    phases: [0, 1],
  },
  {
    id: "b", label: "Part B", title: "AI Mediation Framework", role: "Non-Authoritative AI",
    icon: "◆", color: "var(--purple)",
    href: "/research/cmgf/walkthrough/part-b",
    summary: "AI performs translation, constraint detection, and signal preparation. It is advisory only — no autonomous action is permitted at any layer. Every output is explainable and traceable to its authority source.",
    keyPoints: [
      "Binding layer encodes Tier A (statutory) through Tier D (labor market) authority",
      "Constraint analysis fires in both sandbox and action modes",
      "Sandbox mode: signals returned to SM — no ISR captured",
      "Action mode: transaction record generated — ISR signal enters queue",
      "De-identification firewall strips PII before any ISR data is aggregated",
    ],
    phases: [2, 3],
  },
  {
    id: "c", label: "Part C", title: "Advisory & Human Review Layer", role: "Human Judgment",
    icon: "★", color: "var(--green)",
    href: "/research/cmgf/walkthrough/part-c",
    summary: "All decisions require human action. AI outputs are reviewed, contextualized, and approved or rejected by named, credentialed operators. The ISR layer provides continuous multi-channel institutional intelligence — de-identified and aggregated.",
    keyPoints: [
      "ESO rack-and-stack: pre-assembled constraint context for every queue item",
      "Priority tiering: CRITICAL (deployed SMs with deadlines) → ROUTINE",
      "All decisions logged with justification and timestamps — immutable audit trail",
      "ISR aggregate: cross-channel patterns, no individual SM data",
      "Commander view: unified readiness picture from all channels",
    ],
    phases: [4, 5, 6],
  },
] as const;
type PartId = "a"|"b"|"c";

// ─── JOURNEY PHASES ───────────────────────────────────────────────────────────
const PHASES = [
  { id:"sandbox_edu",    part:"a", mode:"sandbox",     ch:"edu",
    title:"Sandbox: Education Exploration",
    sm:"SSG Torres — 2215 hrs, personal device",
    narrative:"SSG Torres is weighing reenlistment against pursuing a nursing degree. At 2215 after putting kids to bed, she opens CMGF and explores credential pathways. The binding layer evaluates her 68W MOS against nursing prerequisites, checks TA eligibility, maps state licensure requirements for Texas. She sees Go/Conditional/No-Go signals with full citations.",
    isrEffect:"No signal generated. This is private exploration. The ISR sees nothing. The ESO sees nothing. The rack and stack is not affected.",
    keyPoint:"The system serves the SM at the point of need — not the point of institutional convenience. 24/7 access to the full binding layer with zero institutional footprint." },
  { id:"sandbox_cool",   part:"a", mode:"sandbox",     ch:"cool",
    title:"Sandbox: Credentialing Exploration",
    sm:"SSG Torres — same session, 2230 hrs",
    narrative:"Still exploring, Torres switches to the credentialing channel. She checks whether COOL covers CompTIA Security+ as a backup pathway if nursing doesn't work out. The binding layer evaluates COOL eligibility for her MOS, checks CA funding cap status, maps prerequisite requirements. She compares two credential stacks side by side.",
    isrEffect:"Still no signal. She's crossed channels within the same sandbox session. The system tracked nothing. Two channels consulted, zero institutional footprint.",
    keyPoint:"Channel switching within sandbox is seamless. The binding layer applies the correct authority rules for each channel automatically. The SM doesn't need to know which institutional authority governs what — the tier classification handles it." },
  { id:"transaction_edu", part:"b", mode:"transaction", ch:"edu",
    title:"Action: TA Request Submitted",
    sm:"SSG Torres — next morning, 0730 hrs",
    narrative:"Torres has decided. She initiates a TA request for a pre-nursing anatomy course. The moment she clicks Submit, she crosses from sandbox to transactional. The AI proxy generates a transaction record with full constraint context: eligibility confirmed, funding cap status, institutional approval needed, prerequisite chain documented.",
    isrEffect:"SIGNAL GENERATED. Transaction enters ESO rack and stack. Priority: ROUTINE (CONUS, no deadline pressure). ESO sees: TA request with pre-assembled documentation, constraint analysis complete, ready for approval action.",
    keyPoint:"The SM controlled when to cross the boundary. The system provided clear notification that submitting the request would generate an institutional transaction. Informed consent at the architectural level." },
  { id:"transaction_cool", part:"b", mode:"transaction", ch:"cool",
    title:"Action: COOL Authorization",
    sm:"SSG Torres — 0745 hrs",
    narrative:"Torres also submits a COOL authorization request for EMT-B certification, leveraging her 68W medical training. The binding layer has already verified COOL eligibility, mapped her military medical training against EMT-B prerequisites, and confirmed CA funding availability.",
    isrEffect:"SECOND SIGNAL. Separate transaction enters the credentialing queue. Both transactions are now visible to the ESO — two items in the rack and stack, properly contextualized, ready for action.",
    keyPoint:"Two channels, two transactions, two queue entries — but the ESO sees a unified workload with constraint context pre-assembled for both. The overnight sandbox exploration that informed these requests is invisible." },
  { id:"eso_action",    part:"c", mode:"transaction", ch:"edu",
    title:"ESO Processes Queue",
    sm:"ESO perspective — 0830 hrs",
    narrative:"The ESO opens their morning queue. Torres's TA request and COOL authorization are in the stack alongside 14 other pending actions. Two DEPLOYED SMs with closing deadlines sit at CRITICAL. Torres's items are ROUTINE. Each item has pre-assembled documentation and constraint analysis.",
    isrEffect:"ESO decisions generate signal: approval rationale logged, processing time captured, constraint resolution documented. Both approval events feed the de-identification pipeline.",
    keyPoint:"The ESO spent 6 minutes on Torres's two requests because the constraint analysis was already done. Without CMGF, the same actions would require researching eligibility, checking caps, verifying prerequisites — estimated 1.5–2 hours." },
  { id:"tap_transition", part:"c", mode:"transaction", ch:"tap",
    title:"Transition Channel Activates",
    sm:"SSG Torres — 14 months later, separation window",
    narrative:"Torres enters her transition window. TAP is mandatory. But now the binding layer integrates her accumulated credential portfolio (anatomy course complete, EMT-B certified) against her target civilian career. BLS projections, O*NET crosswalks, and state-specific employer requirements are evaluated. Her credential gap is specific and actionable.",
    isrEffect:"Transition stream signal generated: credential-to-career mapping, benefit utilization summary (TA consumed, COOL utilized, remaining GI Bill eligibility), gap analysis against target occupation.",
    keyPoint:"The transition touchpoint is transformed from a generic briefing to a personalized constraint evaluation built on 14 months of transactional history. Sandbox sessions are invisible — only institutional transactions contributed." },
  { id:"isr_aggregate",  part:"c", mode:"isr",         ch:"all",
    title:"Multi-Channel ISR",
    sm:"Installation-level aggregate",
    narrative:"All channels feed the de-identification firewall simultaneously. Education, COOL, TAP, chaplain demand patterns, Voice of the Soldier feedback, and commander on-demand queries contribute to a unified installation readiness picture. Every signal is de-identified, authority-tagged, and aggregated at population level.",
    isrEffect:"FULL ISR: Funding cap exhaustion rates across the force. Credential pathway completion funnels. Deployment impact on education participation. Chaplain demand correlation with operational tempo. Cross-channel friction patterns.",
    keyPoint:"The ISR is no longer a periodic, manually assembled compliance document. It is a continuous, multi-channel, governed institutional intelligence layer." },
];

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
function Dot({ color, pulse }: { color: string; pulse?: boolean }) {
  return <div style={{ width:8, height:8, borderRadius:"50%", background:color, animation:pulse?"mcd-pulse 1.5s ease infinite":"none", flexShrink:0 }} />;
}

function Chip({ label, color, dim }: { label: string; color: string; dim?: boolean }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 8px", borderRadius:4, background:dim?color+"18":color, border:"1px solid "+color+(dim?"55":""), fontSize:10, fontWeight:700, color:dim?color:"#fff", fontFamily:MONO, letterSpacing:"0.03em", whiteSpace:"nowrap" }}>
      {label}
    </span>
  );
}

function ModeChip({ mode }: { mode: string }) {
  if (mode === "isr")         return <Chip label="ISR AGGREGATE" color="var(--amber)" />;
  if (mode === "sandbox")     return <Chip label="SANDBOX — NO SIGNAL" color="var(--sb)" />;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
      <Chip label="ACTION MODE" color="var(--txn)" />
      <Chip label="SIGNAL GENERATING" color="var(--txn)" dim />
    </span>
  );
}

function ISRBar({ id }: { id: ChId }) {
  const ch = CH[id]; const m = METRICS[id];
  const pct = (m.transactions / 1300) * 100;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
      <span style={{ fontSize:10, color:"var("+ch.v+")", width:36, fontFamily:MONO, fontWeight:700 }}>{ch.short}</span>
      <div style={{ flex:1, height:12, background:"var("+ch.v+")18", borderRadius:3, overflow:"hidden" }}>
        <div style={{ width:pct+"%", height:"100%", background:"linear-gradient(90deg,var("+ch.v+")60,var("+ch.v+"))", transition:"width 0.8s ease" }} />
      </div>
      <span style={{ fontSize:10, color:"var(--mid)", fontFamily:MONO, width:42, textAlign:"right" }}>{m.transactions.toLocaleString()}</span>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function MultiChannelDemo() {
  const [theme, setTheme] = useState<"dark"|"light">("dark");
  const [part, setPart] = useState<PartId>("a");
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [activeChannel, setActiveChannel] = useState<ChId>("edu");
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const activePart = PARTS.find(p => p.id === part)!;
  const partPhases = PHASES.filter(p => p.part === part);
  const currentPhase = partPhases[phase] ?? partPhases[0];

  // Auto-advance within part
  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setPhase(p => { if (p >= partPhases.length - 1) { setPlaying(false); return p; } return p + 1; });
      }, 6000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing, part, partPhases.length]);

  // Reset phase when part changes
  useEffect(() => { setPhase(0); setPlaying(false); }, [part]);

  const isISR = currentPhase?.mode === "isr";

  return (
    <div data-mcd={theme} style={{ minHeight:"100vh" }}>
      <style>{THEME_CSS}</style>
      <DemoNav />

      {/* ── PAGE HEADER ── */}
      <div style={{ background:"var(--bg2)", borderBottom:"1px solid var(--border)", padding:"14px 24px", position:"sticky", top:"56px", zIndex:40, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ fontSize:10, letterSpacing:"0.18em", color:"var(--cyan)", fontWeight:700, fontFamily:MONO }}>CAREER MOBILITY GOVERNANCE FRAMEWORK</div>
          <h1 style={{ fontSize:18, fontWeight:900, color:"var(--text)", marginTop:2 }}>Multi-Channel System Demonstration</h1>
          <div style={{ fontSize:11, color:"var(--dim)", marginTop:1 }}>Three-Part Architecture · Sandbox Boundary · ISR Signal Aggregation</div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button onClick={() => setTheme(t => t==="dark"?"light":"dark")} style={{ padding:"7px 12px", borderRadius:7, border:"1px solid var(--border)", background:"var(--card)", color:"var(--text)", fontSize:13, cursor:"pointer", fontFamily:MONO }} data-testid="button-theme-toggle">
            {theme==="dark"?"☀ Light":"☾ Dark"}
          </button>
          <Link href="/research/cmgf/walkthrough">
            <span style={{ padding:"7px 12px", borderRadius:7, border:"1px solid var(--border)", background:"var(--card)", color:"var(--cyan)", fontSize:11, cursor:"pointer", fontFamily:MONO, fontWeight:700, display:"inline-block" }}>
              Full Walkthrough →
            </span>
          </Link>
        </div>
      </div>

      {/* ── PART A / B / C SELECTOR ── */}
      <div style={{ padding:"24px 24px 0", background:"var(--bg)" }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", color:"var(--dim)", fontFamily:MONO, marginBottom:12 }}>THREE-PART ARCHITECTURE</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr auto 1fr", gap:12, alignItems:"stretch", marginBottom:24 }}>
          {PARTS.flatMap((p, idx) => {
            const active = part === p.id;
            const partBtn = (
              <button key={p.id} onClick={() => setPart(p.id as PartId)} style={{
                padding:"16px 18px", borderRadius:10, cursor:"pointer", textAlign:"left", transition:"all 0.2s",
                border: active ? "2px solid "+p.color : "1px solid var(--border)",
                background: active ? p.color+"12" : "var(--card)",
                outline:"none", position:"relative", overflow:"hidden",
              }} data-testid={`button-part-${p.id}`}>
                {active && <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:p.color, borderRadius:"10px 10px 0 0" }} />}
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <span style={{ fontSize:11, fontFamily:MONO, fontWeight:700, padding:"2px 7px", borderRadius:4, background:active?p.color:"var(--dim)", color:"#fff" }}>{p.label}</span>
                  <span style={{ fontSize:16, color:p.color }}>{p.icon}</span>
                </div>
                <div style={{ fontSize:14, fontWeight:800, color:active?p.color:"var(--text)", marginBottom:2 }}>{p.title}</div>
                <div style={{ fontSize:10, color:"var(--dim)", fontFamily:MONO }}>{p.role}</div>
              </button>
            );

            if (idx !== 1) return [partBtn];

            const wave2 = (
              <a key="wave2" href="/ar-621-5.pdf" target="_blank" rel="noopener noreferrer"
                style={{ textDecoration:"none", display:"flex" }}
                data-testid="link-wave2-ar621"
              >
                <div style={{
                  padding:"14px 16px", borderRadius:10, width:"100%", boxSizing:"border-box",
                  border:"2px solid var(--amber)", background:"var(--amber)10",
                  position:"relative", overflow:"hidden", cursor:"pointer",
                  display:"flex", flexDirection:"column", justifyContent:"space-between",
                  transition:"background 0.2s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,176,32,0.14)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,176,32,0.06)"; }}
                >
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"var(--amber)" }} />
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5 }}>
                      <span style={{ fontSize:9, fontFamily:MONO, fontWeight:900, padding:"2px 7px", borderRadius:3, background:"var(--amber)", color:"#000", letterSpacing:"0.08em" }}>WAVE 2</span>
                      <span style={{ fontSize:9, fontFamily:MONO, fontWeight:700, color:"var(--amber)", letterSpacing:"0.06em" }}>CHANGE</span>
                    </div>
                    <div style={{ fontSize:13, fontWeight:800, color:"var(--amber)", marginBottom:2, lineHeight:1.2 }}>AR 621-5</div>
                    <div style={{ fontSize:9, color:"var(--mid)", fontFamily:MONO, marginBottom:9 }}>Army Continuing Education System · 19 Mar 2026</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                      {[
                        { n:"01", title:"Commander Approval Required", sub:"All FTA & CA requests" },
                        { n:"02", title:"Two-Recoupment Suspension",  sub:"12-month TA/CA suspension" },
                        { n:"03", title:"Officers Removed from CA",   sub:"O1–O10 no longer eligible" },
                        { n:"04", title:"Two recoupments in same fiscal year", sub:"TA/CA suspended for 12 months" },
                      ].map(item => (
                        <div key={item.n} style={{ display:"flex", gap:7, alignItems:"flex-start" }}>
                          <span style={{ fontSize:10, fontWeight:900, color:"var(--amber)", fontFamily:MONO, flexShrink:0, marginTop:1 }}>{item.n}</span>
                          <div>
                            <div style={{ fontSize:10, fontWeight:700, color:"var(--text)", lineHeight:1.2 }}>{item.title}</div>
                            <div style={{ fontSize:9, color:"var(--dim)", fontFamily:MONO }}>{item.sub}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop:12, display:"flex", alignItems:"center", justifyContent:"center", gap:5, padding:"7px 10px", borderRadius:6, background:"var(--amber)", color:"#000" }}>
                    <span style={{ fontSize:11, fontWeight:900, fontFamily:MONO, letterSpacing:"0.06em" }}>SEE ATTACHED</span>
                    <span style={{ fontSize:14, fontWeight:900, lineHeight:1 }}>↗</span>
                  </div>
                </div>
              </a>
            );

            return [partBtn, wave2];
          })}
        </div>
      </div>

      {/* ── PART CONTENT ── */}
      <div style={{ background:"var(--bg)", padding:"0 24px 24px" }}>
        <div key={part} className="mcd-in" style={{ display:"grid", gridTemplateColumns:"240px 1fr 220px", gap:16, minHeight:"70vh" }}>

          {/* ── LEFT — channels + prohibitions ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>

            <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.1em", color:"var(--dim)", fontFamily:MONO, marginBottom:2 }}>CHANNELS</div>

            {/* Command Approval AR 621-5 block */}
            <a href="/ar-621-5.pdf" target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }} data-testid="link-cmd-approval">
              <div style={{
                padding:"12px 14px", borderRadius:9,
                border:"2px solid var(--amber)", background:"rgba(255,176,32,0.07)",
                position:"relative", overflow:"hidden", cursor:"pointer", transition:"background 0.2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,176,32,0.14)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,176,32,0.07)"; }}
              >
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"var(--amber)" }} />
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
                  <span style={{ fontSize:8, fontFamily:MONO, fontWeight:900, padding:"2px 6px", borderRadius:3, background:"var(--amber)", color:"#000", letterSpacing:"0.08em" }}>WAVE 2</span>
                  <span style={{ fontSize:8, fontFamily:MONO, fontWeight:700, color:"var(--amber)", letterSpacing:"0.06em" }}>AR 621-5</span>
                </div>
                <div style={{ fontSize:12, fontWeight:800, color:"var(--amber)", lineHeight:1.2, marginBottom:4 }}>Command Approval Required</div>
                <div style={{ fontSize:10, color:"var(--mid)", lineHeight:1.45 }}>Commander approval now required for all TA &amp; CA requests. Commander-assigned alternative serves as designatee.</div>
                <div style={{ marginTop:8, display:"inline-flex", alignItems:"center", gap:4, padding:"4px 8px", borderRadius:5, background:"var(--amber)", color:"#000" }}>
                  <span style={{ fontSize:10, fontWeight:900, fontFamily:MONO, letterSpacing:"0.05em" }}>SEE ATTACHED</span>
                  <span style={{ fontSize:11, fontWeight:900 }}>↗</span>
                </div>
              </div>
            </a>
            {CH_LIST.map(chId => {
              const ch = CH[chId];
              const m = METRICS[chId];
              const col = "var("+ch.v+")";
              const isActive = isISR || (currentPhase && (currentPhase.ch === chId || currentPhase.ch === "all"));
              const expanded = activeChannel === chId;
              return (
                <div key={chId} onClick={() => setActiveChannel(chId)} className="mcd-ch" style={{
                  border:"1.5px solid "+(isActive?col:"var(--border)"),
                  background: isActive ? col+"14" : "var(--bg2)",
                  padding: expanded?"12px 14px":"8px 12px",
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:13, color:col }}>{ch.icon}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:11, fontWeight:700, color:isActive?"var(--text)":"var(--mid)" }}>{ch.short}</div>
                    </div>
                    <span style={{ fontSize:9, color:"var(--dim)", fontFamily:MONO }}>{m.transactions}</span>
                  </div>
                  {expanded && (
                    <div style={{ marginTop:8 }}>
                      <div style={{ fontSize:10, color:"var(--mid)", lineHeight:1.4, marginBottom:4 }}>{ch.desc}</div>
                      <div style={{ fontSize:9, color:"var(--dim)", fontFamily:MONO }}>Pending: {m.pending} · Avg: {m.avgTime}</div>
                      <div style={{ fontSize:9, color:col, fontFamily:MONO, marginTop:2 }}>{m.topConstraint}</div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* De-id firewall */}
            <div style={{
              margin:"4px 0", padding:"6px 10px", borderRadius:6,
              border:"1px dashed "+(isISR||currentPhase?.mode==="transaction"?"var(--red)":"var(--border)"),
              background:(isISR||currentPhase?.mode==="transaction")?"var(--red)08":"transparent",
              display:"flex", alignItems:"center", gap:8, transition:"all 0.4s",
            }}>
              <Dot color={(isISR||currentPhase?.mode==="transaction")?"var(--red)":"var(--dim)"} pulse={isISR||currentPhase?.mode==="transaction"} />
              <span style={{ fontSize:9, fontWeight:700, color:(isISR||currentPhase?.mode==="transaction")?"var(--red)":"var(--dim)", fontFamily:MONO, letterSpacing:"0.06em" }}>DE-ID FIREWALL</span>
              <span style={{ fontSize:9, color:"var(--dim)", marginLeft:"auto" }}>{(isISR||currentPhase?.mode==="transaction")?"Active":"Standby"}</span>
            </div>

            {/* Prohibitions */}
            <div className="mcd-card" style={{ padding:"8px 10px" }}>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.1em", color:"var(--dim)", fontFamily:MONO, marginBottom:4 }}>ALWAYS ENFORCED</div>
              {["No Prediction","No Optimization","No Profiling","No Automated Decisions","Sandbox = Non-Reportable"].map(p => (
                <div key={p} style={{ fontSize:9, color:p.includes("Sandbox")?"var(--sb)":"var(--red)", fontFamily:MONO, padding:"1px 0" }}>✕ {p}</div>
              ))}
            </div>
          </div>

          {/* ── CENTER — part detail + phase narrative ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

            {/* Part description card */}
            <div style={{ padding:"18px 20px", borderRadius:10, border:"2px solid "+activePart.color+"40", background:activePart.color+"08" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10, flexWrap:"wrap" }}>
                <span style={{ fontSize:11, fontFamily:MONO, fontWeight:700, padding:"2px 8px", borderRadius:4, background:activePart.color, color:"#fff" }}>{activePart.label}</span>
                <span style={{ fontSize:15, fontWeight:800, color:activePart.color }}>{activePart.title}</span>
                <span style={{ fontSize:10, color:"var(--dim)", fontFamily:MONO }}>— {activePart.role}</span>
                <Link href={activePart.href} style={{ marginLeft:"auto" }}>
                  <span style={{ fontSize:10, color:"var(--cyan)", fontFamily:MONO, cursor:"pointer" }}>Full walkthrough →</span>
                </Link>
              </div>
              <p style={{ fontSize:12, color:"var(--mid)", lineHeight:1.7, marginBottom:12 }}>{activePart.summary}</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                {activePart.keyPoints.map((kp, i) => (
                  <div key={i} style={{ display:"flex", gap:6, alignItems:"flex-start", fontSize:11, color:"var(--mid)" }}>
                    <span style={{ color:activePart.color, fontSize:13, lineHeight:1.3, flexShrink:0 }}>·</span>
                    <span style={{ lineHeight:1.4 }}>{kp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase selector */}
            {partPhases.length > 0 && (
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.1em", color:"var(--dim)", fontFamily:MONO }}>JOURNEY PHASES — {activePart.label.toUpperCase()}</span>
                  <div style={{ flex:1 }} />
                  {playing ? (
                    <button onClick={() => setPlaying(false)} style={{ padding:"4px 10px", borderRadius:5, border:"1px solid var(--amber)", background:"var(--amber)20", color:"var(--amber)", fontSize:10, fontWeight:700, cursor:"pointer", fontFamily:MONO }}>❚❚ PAUSE</button>
                  ) : (
                    <button onClick={() => { setPhase(0); setPlaying(true); }} style={{ padding:"4px 10px", borderRadius:5, border:"1px solid var(--cyan)", background:"var(--cyan)20", color:"var(--cyan)", fontSize:10, fontWeight:700, cursor:"pointer", fontFamily:MONO }}>▶ AUTO</button>
                  )}
                </div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {partPhases.map((ph, i) => {
                    const active = i === phase;
                    const mCol = ph.mode==="sandbox"?"var(--sb)":ph.mode==="isr"?"var(--amber)":"var(--txn)";
                    return (
                      <button key={ph.id} onClick={() => { setPhase(i); setPlaying(false); }} style={{
                        flex:"1 1 0", minWidth:80, padding:"8px 10px", borderRadius:7, border:"1px solid "+(active?mCol:"var(--border)"),
                        background:active?mCol+"18":"var(--card)", cursor:"pointer", textAlign:"left", transition:"all 0.2s",
                      }} data-testid={`button-phase-${ph.id}`}>
                        <div style={{ fontSize:8, fontWeight:700, color:mCol, fontFamily:MONO, marginBottom:2 }}>
                          {ph.mode==="sandbox"?"SANDBOX":ph.mode==="isr"?"ISR":"ACTION"}
                        </div>
                        <div style={{ fontSize:10, fontWeight:active?700:400, color:active?"var(--text)":"var(--mid)", lineHeight:1.3 }}>
                          {ph.title.replace(/^(Sandbox|Action|ISR|Transition Channel|ESO|Multi-Channel): ?/,"")}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Phase narrative */}
            {currentPhase && (
              <div key={currentPhase.id} className="mcd-in">
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10, flexWrap:"wrap" }}>
                  <ModeChip mode={currentPhase.mode} />
                  {currentPhase.ch !== "all" && (
                    <Chip label={CH[currentPhase.ch as ChId]?.label ?? ""} color={"var("+CH[currentPhase.ch as ChId]?.v+")"} dim />
                  )}
                </div>
                <h2 style={{ fontSize:18, fontWeight:800, color:"var(--text)", marginBottom:3 }}>{currentPhase.title}</h2>
                <div style={{ fontSize:11, color:"var(--cyan)", fontFamily:MONO, marginBottom:14 }}>{currentPhase.sm}</div>

                <div className="mcd-card" style={{ marginBottom:12 }}>
                  <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.1em", color:"var(--dim)", fontFamily:MONO, marginBottom:6 }}>NARRATIVE</div>
                  <p style={{ fontSize:12, color:"var(--mid)", lineHeight:1.75 }}>{currentPhase.narrative}</p>
                </div>

                <div style={{
                  padding:"14px 16px", borderRadius:9, marginBottom:12,
                  background:currentPhase.mode==="sandbox"?"var(--sb)08":currentPhase.mode==="isr"?"var(--amber)08":"var(--txn)08",
                  border:"1px solid "+(currentPhase.mode==="sandbox"?"var(--sb)30":currentPhase.mode==="isr"?"var(--amber)30":"var(--txn)30"),
                }}>
                  <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.1em", fontFamily:MONO, marginBottom:5,
                    color:currentPhase.mode==="sandbox"?"var(--sb)":currentPhase.mode==="isr"?"var(--amber)":"var(--txn)" }}>
                    ISR SIGNAL EFFECT
                  </div>
                  <p style={{ fontSize:12, color:"var(--mid)", lineHeight:1.65 }}>{currentPhase.isrEffect}</p>
                </div>

                <div style={{ padding:"10px 14px", borderRadius:7, borderLeft:"3px solid var(--cyan)", background:"var(--cyan)08" }}>
                  <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.1em", color:"var(--cyan)", fontFamily:MONO, marginBottom:4 }}>KEY POINT</div>
                  <p style={{ fontSize:12, color:"var(--text)", lineHeight:1.65 }}>{currentPhase.keyPoint}</p>
                </div>

                {/* ISR Aggregate panel — shown when Part C / ISR phase */}
                {isISR && (
                  <div style={{ marginTop:16 }}>
                    <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", color:"var(--amber)", fontFamily:MONO, marginBottom:10 }}>INSTALLATION ISR — ALL CHANNELS — REAL-TIME</div>
                    <div style={{ padding:18, borderRadius:9, background:"var(--card)", border:"1px solid var(--amber)40" }}>
                      {CH_LIST.map(ch => <ISRBar key={ch} id={ch} />)}
                      <div style={{ marginTop:12, padding:"10px 12px", borderRadius:6, background:"var(--amber)08", border:"1px solid var(--amber)20" }}>
                        <div style={{ fontSize:9, fontWeight:700, color:"var(--amber)", fontFamily:MONO, marginBottom:5 }}>CROSS-CHANNEL INSIGHTS</div>
                        {[
                          "Education + Credentialing: 68% of SMs who sandbox both channels submit at least one transaction within 30 days",
                          "Chaplain demand spikes 34% within 2 weeks of deployment orders — correlates with 22% drop in education transactions",
                          "TAP credential gap severity inversely correlated with years of TA/COOL engagement during service",
                          "Voice of Soldier: \"benefits navigation confusion\" is the #1 reported friction across all channels (52%)",
                          "Commander view: ESO staffing supports 1,200 txn/month; current demand is 2,081 — 73% capacity gap",
                        ].map(insight => (
                          <div key={insight} style={{ fontSize:11, color:"var(--mid)", lineHeight:1.6, padding:"2px 0" }}>· {insight}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT — binding layer + authority tiers ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.1em", color:"var(--dim)", fontFamily:MONO }}>BINDING LAYER</div>

            <div className="mcd-card">
              <div style={{ fontSize:9, fontWeight:700, color:"var(--dim)", fontFamily:MONO, marginBottom:6 }}>CURRENT MODE</div>
              {currentPhase ? <ModeChip mode={currentPhase.mode} /> : <span style={{ fontSize:11, color:"var(--mid)" }}>Select a phase</span>}
            </div>

            <div className="mcd-card">
              <div style={{ fontSize:9, fontWeight:700, color:"var(--dim)", fontFamily:MONO, marginBottom:8 }}>AUTHORITY FLOW</div>
              {["External Sources","↓ Encoded Rules","Binding Layer","↓ Constraint Signals","Human Decision"].map((t,i) => (
                <div key={i} style={{ fontSize:10, color:t.includes("↓")?"var(--dim)":"var(--text)", padding:t.includes("↓")?"1px 0":"3px 0", fontWeight:t.includes("↓")?400:600, fontFamily:t.includes("↓")?MONO:"inherit", textAlign:t.includes("↓")?"center":"left" }}>{t}</div>
              ))}
            </div>

            <div className="mcd-card">
              <div style={{ fontSize:9, fontWeight:700, color:"var(--dim)", fontFamily:MONO, marginBottom:8 }}>AUTHORITY TIERS</div>
              {[
                { t:"A", label:"Statutory",     color:"var(--red)",    desc:"Hard constraint" },
                { t:"B", label:"Credentialing", color:"var(--amber)",  desc:"Conditional" },
                { t:"C", label:"Institutional", color:"var(--blue)",   desc:"Preference" },
                { t:"D", label:"Labor Market",  color:"var(--dim)",    desc:"Context only" },
              ].map(tier => (
                <div key={tier.t} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
                  <span style={{ fontSize:10, fontWeight:900, color:tier.color, fontFamily:MONO, width:14, textAlign:"center" }}>{tier.t}</span>
                  <span style={{ fontSize:11, color:"var(--text)", flex:1, fontWeight:600 }}>{tier.label}</span>
                  <span style={{ fontSize:9, color:"var(--dim)" }}>{tier.desc}</span>
                </div>
              ))}
            </div>

            <div style={{ padding:12, borderRadius:8, background:"var(--card)", border:"1px solid var(--amber)50" }}>
              <div style={{ fontSize:9, fontWeight:700, color:"var(--amber)", fontFamily:MONO, marginBottom:6 }}>ISR AGGREGATE</div>
              <div style={{ fontSize:22, fontWeight:900, color:"var(--amber)", letterSpacing:"-0.02em", marginBottom:2 }}>
                {Object.values(METRICS).reduce((a,m)=>a+m.transactions,0).toLocaleString()}
              </div>
              <div style={{ fontSize:9, color:"var(--dim)", marginBottom:10 }}>total transactions (30-day)</div>
              {CH_LIST.map(ch => <ISRBar key={ch} id={ch} />)}
            </div>

            <div style={{ padding:"8px 10px", borderRadius:6, border:"1px solid var(--sb)50", background:"var(--sb)08" }}>
              <div style={{ fontSize:9, fontWeight:700, color:"var(--sb)", fontFamily:MONO, marginBottom:2 }}>SANDBOX GUARANTEE</div>
              <div style={{ fontSize:9, color:"var(--mid)", lineHeight:1.5 }}>Exploration is architecturally non-reportable. ISR totals reflect Action Mode transactions only. The SM controls the boundary.</div>
            </div>

            {/* Walkthrough link */}
            <Link href={activePart.href}>
              <div style={{ padding:"10px 12px", borderRadius:8, border:"1px solid "+activePart.color+"40", background:activePart.color+"08", cursor:"pointer", textAlign:"center" }}>
                <div style={{ fontSize:9, fontWeight:700, color:activePart.color, fontFamily:MONO, marginBottom:2 }}>{activePart.label.toUpperCase()} FULL DETAIL</div>
                <div style={{ fontSize:10, color:"var(--mid)" }}>{activePart.title}</div>
                <div style={{ fontSize:9, color:activePart.color, fontFamily:MONO, marginTop:4 }}>Open walkthrough →</div>
              </div>
            </Link>
          </div>

        </div>
      </div>

      {/* ── FOOTER NAV ── */}
      <div style={{ borderTop:"1px solid var(--border)", padding:"16px 24px", background:"var(--bg2)", display:"flex", gap:12, flexWrap:"wrap", alignItems:"center" }}>
        <span style={{ fontSize:9, color:"var(--dim)", fontFamily:MONO, marginRight:4 }}>EXPLORE:</span>
        {([
          ["/research/cmgf/walkthrough","Walkthrough Index"],
          ["/research/cmgf/walkthrough/part-a","Part A: Service Member"],
          ["/research/cmgf/walkthrough/part-b","Part B: AI Mediation"],
          ["/research/cmgf/walkthrough/part-c","Part C: Advisory Layer"],
          ["/research/signal-flow","Signal Flow Animation"],
          ["/research/career-advisor","Career Path Advisor"],
        ] as [string,string][]).map(([href,label]) => (
          <Link key={href} href={href}>
            <span style={{ fontSize:11, color:"var(--cyan)", cursor:"pointer", fontFamily:MONO }}>{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
