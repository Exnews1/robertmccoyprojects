import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  ArrowLeft, CheckCircle, ChevronRight, Shield, GraduationCap,
  Brain, Clock, Sun, Moon, Star, AlertTriangle, EyeOff, Eye,
} from "lucide-react";

const MONO = "'JetBrains Mono', monospace";
const SERIF = "Merriweather, Georgia, serif";

const THEME = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Merriweather:wght@400;700&display=swap');
  [data-bd] { font-family: 'Inter', -apple-system, sans-serif; transition: background 0.3s, color 0.3s; }
  [data-bd="dark"] {
    --bg:#060a12; --bg2:#0c1220; --card:#111827; --text:#eaf0f8;
    --mid:#8b9bb5; --dim:#4a5a72; --border:#1c2740;
    --gold:#c9a84c; --goldg:rgba(201,168,76,0.10); --goldb:rgba(201,168,76,0.25);
    --blue:#4d94ff; --blueg:rgba(77,148,255,0.10); --blueb:rgba(77,148,255,0.25);
    --green:#22c55e; --greeng:rgba(34,197,94,0.10); --greenb:rgba(34,197,94,0.25);
    --amber:#ffb020; --amberg:rgba(255,176,32,0.08); --amberb:rgba(255,176,32,0.28);
    --red:#ff4d6a; --redg:rgba(255,77,106,0.08); --redb:rgba(255,77,106,0.28);
    --purple:#a78bfa; --purpleg:rgba(167,139,250,0.08); --purpleb:rgba(167,139,250,0.25);
    background:#060a12; color:#eaf0f8;
  }
  [data-bd="light"] {
    --bg:#f1f5f9; --bg2:#e8edf4; --card:#ffffff; --text:#0f172a;
    --mid:#475569; --dim:#94a3b8; --border:#cbd5e1;
    --gold:#92681e; --goldg:rgba(146,104,30,0.07); --goldb:rgba(146,104,30,0.22);
    --blue:#1d4ed8; --blueg:rgba(29,78,216,0.07); --blueb:rgba(29,78,216,0.22);
    --green:#15803d; --greeng:rgba(21,128,61,0.07); --greenb:rgba(21,128,61,0.22);
    --amber:#b45309; --amberg:rgba(180,83,9,0.07); --amberb:rgba(180,83,9,0.25);
    --red:#dc2626; --redg:rgba(220,38,38,0.07); --redb:rgba(220,38,38,0.25);
    --purple:#7c3aed; --purpleg:rgba(124,58,237,0.07); --purpleb:rgba(124,58,237,0.22);
    background:#f1f5f9; color:#0f172a;
  }
  @keyframes bd-in    { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes bd-pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
  @keyframes bd-glow  { 0%,100%{box-shadow:0 0 0px rgba(201,168,76,0)} 50%{box-shadow:0 0 18px rgba(201,168,76,0.4)} }
  @keyframes bd-glow-r{ 0%,100%{box-shadow:0 0 0px rgba(255,77,106,0)} 50%{box-shadow:0 0 16px rgba(255,77,106,0.45)} }
  @keyframes bd-sr    { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
  @keyframes bd-sl    { from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:translateX(0)} }
  .bd-in-sm  { animation: bd-sr 0.45s ease forwards; }
  .bd-in-eso { animation: bd-sl 0.45s ease forwards; }
  .bd-in-up  { animation: bd-in 0.4s ease forwards; }
`;

const SM = {
  name: "SGT Maria T. Chen",
  rank: "E-5", mos: "68W — Health Care Specialist",
  station: "Ft. Somewhere, USA",
  credits: 54, taBalance: 3250,
};

type Readiness = "green" | "yellow" | "red";

const READINESS_CONFIG: Record<Readiness, { label: string; note: string; color: string; bg: string; border: string }> = {
  green:  { label: "HIGH PROXIMITY",    note: "Entry pathway available now — direct application or supported program eliminates major barriers.", color: "var(--green)",  bg: "var(--greeng)",  border: "var(--greenb)"  },
  yellow: { label: "MODERATE PROXIMITY", note: "Education and/or licensure required before entry. TA pathway directly applicable.", color: "var(--amber)",  bg: "var(--amberg)",  border: "var(--amberb)"  },
  red:    { label: "DISTANT PROXIMITY",  note: "Education, certification, AND real-world experience all required. Long runway.", color: "var(--red)",    bg: "var(--redg)",    border: "var(--redb)"    },
};

const CAREERS = [
  {
    id: "healthcare-admin",
    label: "Healthcare Administrator",
    icon: "🏥",
    readiness: "yellow" as Readiness,
    degree: "B.S. Healthcare Administration",
    course: { code: "HLTH 301", title: "Health Policy & Law", school: "Troy University", mouStatus: "Active DoD MOU — TA eligible", credits: 3, cost: 750, start: "April 14, 2026" },
    facts: [
      ["Funding mechanism",  "Tuition Assistance (TA) — AR 621-5 pipeline applies"],
      ["TA eligibility",     "Confirmed — $3,250 of $4,000 remaining (FY2026)"],
      ["DoD MOU status",     "Troy University — Active DoD MOU · TA-authorized institution"],
      ["Degree alignment",   "HLTH 301 (Troy Univ.) maps to declared B.S. Healthcare Admin degree plan"],
      ["MOS credit value",   "68W translates 12–18 credits toward healthcare programs"],
      ["Credential gap",     "Degree required — no separate licensure at admin level"],
      ["AR 621-5 flags",     "None identified"],
      ["Policy risk index",  "0.12 (no thresholds breached)"],
    ],
  },
  {
    id: "nurse",
    label: "Registered Nurse",
    icon: "⚕",
    readiness: "yellow" as Readiness,
    degree: "B.S. Nursing (BSN)",
    course: { code: "BIOL 220", title: "Anatomy & Physiology II", school: "American Military University", mouStatus: "Active DoD MOU — TA eligible", credits: 4, cost: 900, start: "April 14, 2026" },
    facts: [
      ["Funding mechanism",  "Tuition Assistance (TA) — AR 621-5 pipeline applies"],
      ["TA eligibility",     "Confirmed — $3,250 of $4,000 remaining (FY2026)"],
      ["DoD MOU status",     "American Military University — Active DoD MOU · TA-authorized"],
      ["Degree alignment",   "BIOL 220 (AMU) fulfills BSN science prerequisite requirement"],
      ["MOS credit value",   "68W field experience maps to clinical hour portfolio"],
      ["Credential gap",     "BSN required + NCLEX-RN licensure before practice"],
      ["AR 621-5 flags",     "None identified"],
      ["Policy risk index",  "0.14 (no thresholds breached)"],
    ],
  },
  {
    id: "police",
    label: "Police / Law Enforcement",
    icon: "🚔",
    readiness: "green" as Readiness,
    degree: "B.S. Criminal Justice (optional)",
    course: { code: "CJUS 210", title: "Criminology & Social Justice", school: "Troy University", mouStatus: "Active DoD MOU — TA eligible", credits: 3, cost: 750, start: "April 14, 2026" },
    facts: [
      ["Funding mechanism",  "Tuition Assistance (TA) — AR 621-5 pipeline applies"],
      ["TA eligibility",     "Confirmed — $3,250 of $4,000 remaining (FY2026)"],
      ["DoD MOU status",     "Troy University — Active DoD MOU · TA-authorized institution"],
      ["Degree alignment",   "CJUS 210 (Troy Univ.) strengthens application — degree not required for entry"],
      ["Entry requirement",  "Most departments: HS diploma + background check. Degree not required."],
      ["Veteran preference", "Federal and most state agencies grant veterans' preference points"],
      ["AR 621-5 flags",     "None identified"],
      ["Policy risk index",  "0.11 (no thresholds breached)"],
    ],
  },
  {
    id: "teacher",
    label: "K-12 Teacher",
    icon: "📚",
    readiness: "green" as Readiness,
    degree: "B.S. Education (or Alt. Cert. via S2T)",
    course: { code: "EDUC 301", title: "Curriculum Design & Assessment", school: "Columbia Southern University", mouStatus: "Active DoD MOU — TA eligible", credits: 3, cost: 750, start: "April 14, 2026" },
    facts: [
      ["Funding mechanism",    "Tuition Assistance (TA) — AR 621-5 pipeline applies"],
      ["TA eligibility",       "Confirmed — $3,250 of $4,000 remaining (FY2026)"],
      ["DoD MOU status",       "Columbia Southern University — Active DoD MOU · TA-authorized"],
      ["Degree alignment",     "EDUC 301 (CSU) aligns to B.S. Education degree plan"],
      ["Soldiers to Teachers", "Federal S2T program — stipends, alt. certification, state placement support"],
      ["Alt. cert. pathway",   "Most states allow military veterans to teach under emergency/alt. licensure"],
      ["MOS credit value",     "Army instructor/trainer background directly applicable to classroom"],
      ["Credential gap",       "State license required — waived or fast-tracked in many S2T partner states"],
      ["AR 621-5 flags",       "None identified"],
      ["Policy risk index",    "0.10 (no thresholds breached)"],
    ],
  },
  {
    id: "cyber",
    label: "Cybersecurity Analyst",
    icon: "🔐",
    readiness: "red" as Readiness,
    degree: "B.S. Cybersecurity",
    course: { code: "CSCI 250", title: "Network Security Fundamentals", school: "American Military University", mouStatus: "Active DoD MOU — TA eligible", credits: 3, cost: 750, start: "April 14, 2026" },
    facts: [
      ["Funding mechanism",  "Tuition Assistance (TA) — AR 621-5 pipeline applies"],
      ["TA eligibility",     "Confirmed — $3,250 of $4,000 remaining (FY2026)"],
      ["DoD MOU status",     "American Military University — Active DoD MOU · TA-authorized"],
      ["Degree alignment",   "CSCI 250 (AMU) maps to B.S. Cybersecurity core — partial alignment only"],
      ["MOS credit value",   "68W STEM credits limited; prerequisite coursework likely required"],
      ["Credential gap",     "Degree + CompTIA Security+/CISSP + demonstrated experience all required"],
      ["AR 621-5 flags",     "None identified — prerequisite gap noted for ESO awareness"],
      ["Policy risk index",  "0.31 (elevated — prerequisite gap; no policy violation)"],
    ],
  },
] as const;

const ESO = {
  name: "James R. Okafor",
  title: "Education Services Officer",
  grade: "GS-11, Civilian",
  station: "Ft. Somewhere Education Center",
  queueCount: 17,
};

const CMD = {
  name: "CPT Denise M. Flores",
  title: "Company Commander",
  unit: "HHC, 2-XX AVN, XXTH DIV",
};

function buildAiSteps(career: typeof CAREERS[number]) {
  return [
    { label: "Identity verification",   detail: "E-5 rank confirmed · DOD ID matched" },
    { label: "TA eligibility",          detail: `$${SM.taBalance.toLocaleString()} of $4,000 remaining (FY2026) — above course cost` },
    { label: "Degree-plan alignment",   detail: `${career.course.code} maps to ${career.degree}` },
    { label: "AR 621-5 compliance",     detail: "No prior recoupment events · No suspension flags" },
    { label: "DoD MOU verification",    detail: `${career.course.school} · Active DoD MOU confirmed · TA disbursement authorized` },
    { label: "Channel routing",         detail: "Standard Review — commander approval required per AR 621-5 WAVE 2" },
    { label: "Policy flags",            detail: career.id === "cyber" ? "Prerequisite gap noted — no policy violation" : "None identified" },
  ];
}

const STEPS = [
  { label: "Sandbox Exploration",       cue: "SGT Chen explores privately. AI has facts. Commander has zero visibility. No institutional footprint." },
  { label: "Official Request → Command", cue: "SGT Chen submits officially. Per AR 621-5 § 3-4, the request routes to the Commander first — not the ESO. The sandbox session is not disclosed." },
  { label: "Commander Certification",   cue: "CPT Flores certifies availability and good standing only. Scope is limited — the Commander cannot reject based on course content or career choice." },
  { label: "AI Classification",         cue: "Commander certified. Signal officially enters the CMGF pipeline. Seven checks now run on the institutional record." },
  { label: "ESO Queue",                 cue: "Verified dossier delivered to James Okafor. The educational decision belongs to the ESO." },
  { label: "Decision & Notify",         cue: "ESO adjudicates. SGT Chen is notified. Audit record created. ISR updated." },
];

export default function BridgeDemo() {
  const [theme, setTheme]           = useState<"dark"|"light">("dark");
  const [stage, setStage]           = useState(0);
  const [aiIdx, setAiIdx]           = useState(-1);
  const [aiDone, setAiDone]         = useState(false);
  const [cmdDecision, setCmdDecision] = useState<"none"|"approved"|"disapproved">("none");
  const [shadowVisible, setShadowVisible] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<typeof CAREERS[number]>(CAREERS[0]);

  const aiSteps = buildAiSteps(selectedCareer);

  useEffect(() => {
    if (stage !== 3 || cmdDecision !== "approved") return;
    setAiIdx(-1); setAiDone(false);
    let i = 0;
    const tick = () => { setAiIdx(i); i++; if (i < aiSteps.length) setTimeout(tick, 420); else setTimeout(() => setAiDone(true), 600); };
    setTimeout(tick, 300);
  }, [stage, cmdDecision]);

  const advance = () => {
    if (stage === 2) return;
    if (stage === 3 && (!aiDone || cmdDecision === "disapproved")) return;
    setStage(s => Math.min(s + 1, 5));
  };

  const handleCmdApprove = () => { setCmdDecision("approved"); setStage(3); };
  const handleCmdDisapprove = () => { setCmdDecision("disapproved"); setStage(3); };

  const reset = () => {
    setStage(0); setAiIdx(-1); setAiDone(false);
    setCmdDecision("none"); setShadowVisible(false);
    setSelectedCareer(CAREERS[0]);
  };

  const stepIdx = Math.min(stage, STEPS.length - 1);
  const advanceable = stage < 5 && stage !== 2 && !(stage === 3 && (!aiDone || cmdDecision === "disapproved"));

  const btnLabel = () => {
    if (stage === 0) return "START DEMO →";
    if (stage === 2) return "AWAITING COMMANDER…";
    if (stage === 3 && cmdDecision === "disapproved") return "REQUEST HELD";
    if (stage === 3 && !aiDone) return "AI CLASSIFYING…";
    if (stage === 5) return "COMPLETE ✓";
    return "NEXT STEP →";
  };

  return (
    <div data-bd={theme} style={{ minHeight: "100vh" }}>
      <style>{THEME}</style>

      {/* ── TOP NAV ── */}
      <div style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", padding: "11px 28px", display: "flex", alignItems: "center", gap: 16 }}>
        <Link href="/research">
          <button style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "var(--mid)", cursor: "pointer", fontSize: 12, fontFamily: MONO, letterSpacing: "0.06em" }}>
            <ArrowLeft size={13} /> RESEARCH HOME
          </button>
        </Link>
        <span style={{ color: "var(--dim)" }}>›</span>
        <span style={{ fontSize: 12, fontFamily: MONO, color: "var(--gold)", letterSpacing: "0.08em" }}>SM · ESO BRIDGE DEMO</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 10, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.08em" }}>CMGF ARCHITECTURE SERIES · 2026</span>
          <button
            onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
            data-testid="button-theme-toggle"
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 20, cursor: "pointer", fontFamily: MONO, fontSize: 11, color: "var(--mid)", letterSpacing: "0.06em", transition: "all 0.2s" }}
          >
            {theme === "dark" ? <Sun size={12} /> : <Moon size={12} />}
            {theme === "dark" ? "LIGHT" : "DARK"}
          </button>
        </div>
      </div>

      {/* ── HEADER ── */}
      <div style={{ padding: "28px 32px 20px", borderBottom: "1px solid var(--border)", background: "linear-gradient(180deg, var(--bg2) 0%, var(--bg) 100%)" }}>
        <div style={{ maxWidth: 1720, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--gold)", letterSpacing: "0.14em", marginBottom: 7 }}>CMGF · DUAL-LENS DEMONSTRATION</div>
              <h1 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, margin: 0, lineHeight: 1.2, color: "var(--text)" }}>The Request Seen Twice</h1>
              <p style={{ color: "var(--mid)", margin: "8px 0 0", fontSize: 13, lineHeight: 1.6, maxWidth: 620 }}>
                One tuition assistance request. Two communities. One AI mediation layer — and a new commander gate that determines whether the ESO ever sees the request at all.
              </p>
            </div>
            {stage > 0 && (
              <button onClick={reset} style={{ padding: "8px 16px", background: "none", border: "1px solid var(--border)", borderRadius: 6, color: "var(--mid)", fontFamily: MONO, fontSize: 11, cursor: "pointer", letterSpacing: "0.06em" }}>
                ↺ RESET
              </button>
            )}
          </div>

          {/* Step tracker */}
          <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", paddingBottom: 2 }}>
            {STEPS.map((s, i) => {
              const done = stepIdx > i;
              const active = stepIdx === i;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 5, padding: "5px 11px",
                    borderRadius: 20, fontSize: 11, fontFamily: MONO, fontWeight: 600, letterSpacing: "0.05em", whiteSpace: "nowrap", transition: "all 0.3s",
                    background: active ? (i === 3 ? "var(--amber)" : "var(--gold)") : done ? "var(--goldg)" : "transparent",
                    color: active ? "#000" : done ? "var(--gold)" : "var(--dim)",
                    border: done ? "1px solid var(--goldb)" : active && i === 3 ? "none" : "1px solid transparent",
                  }}>
                    {done ? <CheckCircle size={10} /> : <span style={{ width: 12, height: 12, borderRadius: "50%", background: active ? "#000" : "var(--dim)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: active ? (i === 3 ? "var(--amber)" : "var(--gold)") : "var(--bg)" }}>{i}</span>}
                    {s.label}
                  </div>
                  {i < STEPS.length - 1 && <ChevronRight size={13} color="var(--dim)" style={{ margin: "0 1px", flexShrink: 0 }} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── PRESENTER CUE BAR ── */}
      <div style={{ background: "rgba(201,168,76,0.05)", borderBottom: "1px solid var(--goldb)", padding: "11px 32px" }}>
        <div style={{ maxWidth: 1720, margin: "0 auto", display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--gold)", letterSpacing: "0.1em", flexShrink: 0 }}>PRESENTER CUE</div>
          <div style={{ fontSize: 13, color: "var(--mid)", flex: 1 }} className="bd-in-up" key={stage}>{STEPS[stepIdx].cue}</div>
          <button
            onClick={advance}
            disabled={!advanceable}
            data-testid="button-advance-step"
            style={{
              padding: "9px 22px", borderRadius: 7, fontFamily: MONO, fontSize: 12, fontWeight: 700, letterSpacing: "0.07em",
              cursor: advanceable ? "pointer" : "default", transition: "all 0.25s", flexShrink: 0, border: "none",
              background: advanceable ? "var(--gold)" : "var(--border)",
              color: advanceable ? "#000" : "var(--dim)", opacity: advanceable ? 1 : 0.55,
            }}
          >
            {btnLabel()}
          </button>
        </div>
      </div>

      {/* ── 5-COLUMN LAYOUT ── */}
      <div style={{ maxWidth: 1720, margin: "0 auto", padding: "24px 20px 48px", display: "grid", gridTemplateColumns: "1.1fr 0.72fr 0.82fr 1fr 0.65fr", gap: 14, alignItems: "start" }}>

        {/* ── PIPELINE BAR — spans all columns ── */}
        <div style={{ gridColumn: "1 / -1", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 16px" }}>
          <div style={{ fontSize: 8, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.1em", marginBottom: 8, textAlign: "center" }}>AR 621-5 REGULATORY SEQUENCE</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, maxWidth: 700, margin: "0 auto" }}>
            {[
              { label: "SM", active: stage >= 0, color: "var(--blue)" },
              { label: "CMD", active: stage >= 1, color: "var(--amber)" },
              { label: "AI", active: stage >= 3 && cmdDecision === "approved", color: "var(--gold)" },
              { label: "ESO", active: stage >= 4 && cmdDecision === "approved", color: "var(--green)" },
              { label: "ISR", active: stage >= 5 && cmdDecision === "approved", color: "var(--purple)" },
            ].map((node, i) => (
              <div key={node.label} style={{ display: "flex", alignItems: "center", flex: i < 4 ? "1 1 0" : "0 0 auto" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: node.active ? node.color : "var(--bg2)", border: `2px solid ${node.active ? node.color : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.4s", flexShrink: 0 }}>
                    <span style={{ fontSize: 8, fontFamily: MONO, fontWeight: 800, color: node.active ? "#000" : "var(--dim)" }}>{node.label}</span>
                  </div>
                </div>
                {i < 4 && <div style={{ flex: 1, height: 2, background: node.active ? node.color : "var(--border)", transition: "background 0.4s" }} />}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 8, fontFamily: MONO, color: "var(--dim)", textAlign: "center", marginTop: 6 }}>
            Command certifies availability · AI verifies facts · ESO adjudicates · ISR captures signal
          </div>
        </div>

        {/* ══ LEFT: SERVICE MEMBER ══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--blue)", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 2 }}>SERVICE MEMBER VIEW</div>

          {/* Profile */}
          <div style={{ background: "var(--card)", border: "1px solid var(--blueb)", borderRadius: 12, padding: 18, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--blue)", borderRadius: "12px 12px 0 0" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: "var(--blueg)", border: "1px solid var(--blueb)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <GraduationCap size={22} color="var(--blue)" />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", lineHeight: 1.2 }}>{SM.name}</div>
                <div style={{ fontSize: 11, fontFamily: MONO, color: "var(--blue)", marginTop: 2 }}>{SM.rank} · {SM.mos}</div>
                <div style={{ fontSize: 11, color: "var(--mid)" }}>{SM.station}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[["Credits Earned", SM.credits + " hrs"], ["Civilian Goal", selectedCareer.degree], ["TA Balance (FY26)", "$" + SM.taBalance.toLocaleString()], ["Status", "Active Duty"]].map(([k, v]) => (
                <div key={k} style={{ background: "var(--bg2)", borderRadius: 7, padding: "8px 10px" }}>
                  <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.08em", marginBottom: 3 }}>{k}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sandbox mode panel — stage 0 */}
          {stage === 0 && (
            <div style={{ background: "var(--card)", border: "1px solid var(--purpleb)", borderRadius: 12, padding: 18, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--purple)", borderRadius: "12px 12px 0 0" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ padding: "3px 9px", borderRadius: 20, background: "var(--purpleg)", border: "1px solid var(--purpleb)", fontSize: 9, fontFamily: MONO, fontWeight: 700, color: "var(--purple)", letterSpacing: "0.1em" }}>SANDBOX MODE</div>
                <span style={{ fontSize: 11, color: "var(--dim)" }}>Exploring — no institutional record created</span>
              </div>

              <div style={{ fontSize: 11, color: "var(--mid)", lineHeight: 1.5, marginBottom: 14 }}>
                SGT Chen selects a civilian end-state. The CMGF sandbox returns verified facts for that pathway — no commitment, no footprint.
              </div>

              {/* Career selector */}
              <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.1em", marginBottom: 8 }}>SELECT CIVILIAN END-STATE</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                {CAREERS.map(c => {
                  const rc = READINESS_CONFIG[c.readiness];
                  const isSelected = selectedCareer.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCareer(c)}
                      data-testid={`button-career-${c.id}`}
                      style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                        background: isSelected ? rc.bg : "var(--bg2)",
                        border: `1px solid ${isSelected ? rc.border : "var(--border)"}`,
                        borderRadius: 8, cursor: "pointer", textAlign: "left", transition: "all 0.2s",
                      }}
                    >
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{c.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: isSelected ? rc.color : "var(--text)" }}>{c.label}</div>
                        <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--dim)", marginTop: 1 }}>{c.degree}</div>
                      </div>
                      <div style={{
                        flexShrink: 0, padding: "2px 8px", borderRadius: 10,
                        background: rc.bg, border: `1px solid ${rc.border}`,
                        fontSize: 8, fontFamily: MONO, fontWeight: 800, color: rc.color, letterSpacing: "0.08em",
                      }}>
                        {c.readiness === "green" ? "●" : c.readiness === "yellow" ? "●" : "●"}
                        {" "}{c.readiness.toUpperCase()}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic feasibility facts */}
              {(() => {
                const rc = READINESS_CONFIG[selectedCareer.readiness];
                return (
                  <div style={{ borderRadius: 8, border: `1px solid ${rc.border}`, overflow: "hidden", marginBottom: 14 }} className="bd-in-up" key={selectedCareer.id}>
                    <div style={{ background: rc.bg, padding: "8px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18 }}>{selectedCareer.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 9, fontFamily: MONO, fontWeight: 800, color: rc.color, letterSpacing: "0.1em" }}>{rc.label}</div>
                        <div style={{ fontSize: 10, color: "var(--mid)", lineHeight: 1.4, marginTop: 2 }}>{rc.note}</div>
                      </div>
                    </div>
                    <div style={{ background: "var(--bg2)", padding: "10px 14px" }}>
                      <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.08em", marginBottom: 6 }}>SANDBOX FACTS — {selectedCareer.label.toUpperCase()}</div>
                      {selectedCareer.facts.map(([k, v]) => (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "6px 0", borderBottom: "1px solid var(--border)", gap: 12 }}>
                          <span style={{ fontSize: 10, fontFamily: MONO, color: "var(--dim)", flexShrink: 0 }}>{k}</span>
                          <span style={{ fontSize: 10, fontWeight: 600, color: "var(--text)", textAlign: "right", lineHeight: 1.3 }}>{v}</span>
                        </div>
                      ))}
                      <div style={{ marginTop: 10, padding: "6px 10px", background: rc.bg, borderRadius: 6, border: `1px solid ${rc.border}` }}>
                        <span style={{ fontSize: 10, color: rc.color, fontFamily: MONO }}>Course: {selectedCareer.course.code} — {selectedCareer.course.title} · ${selectedCareer.course.cost}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div style={{ fontSize: 11, color: "var(--dim)", fontStyle: "italic", marginBottom: 12 }}>
                No institutional record has been created. SGT Chen may exit without any consequence.
              </div>

              {/* Pipeline scope note */}
              <div style={{ background: "var(--bg2)", borderRadius: 8, padding: "9px 12px", marginBottom: 14, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--gold)", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 5 }}>WHEN THIS PIPELINE APPLIES</div>
                <div style={{ fontSize: 10, color: "var(--mid)", lineHeight: 1.6 }}>
                  <span style={{ color: "var(--green)", fontWeight: 700 }}>✓ Tuition Assistance (TA)</span> — school must hold active DoD MOU · Commander and ESO are in the chain<br />
                  <span style={{ color: "var(--green)", fontWeight: 700 }}>✓ Career Advancement (CA)</span> — same chain of authority applies<br />
                  <span style={{ color: "var(--dim)" }}>✗ VA education benefits</span> — VA-funded enrollment is outside this process · Commander and ESO have no institutional role<br />
                  <span style={{ color: "var(--dim)" }}>✗ Self-financed enrollment</span> — SM's own funds · pipeline is null · no AR 621-5 authority
                </div>
              </div>

              <button onClick={() => setStage(2)} style={{ width: "100%", padding: "11px", background: "var(--purple)", color: "#fff", border: "none", borderRadius: 8, fontFamily: MONO, fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer" }} data-testid="button-sm-proceed">
                SUBMIT OFFICIAL TA REQUEST →
              </button>
            </div>
          )}

          {/* Official request card — stage 1+ */}
          {stage >= 1 && (
            <div className="bd-in-sm" style={{ background: "var(--card)", border: `1px solid ${stage >= 4 && cmdDecision === "approved" ? "var(--greenb)" : stage >= 3 && cmdDecision === "disapproved" ? "var(--redb)" : "var(--blueb)"}`, borderRadius: 12, padding: 18, position: "relative", overflow: "hidden", transition: "border-color 0.4s" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: stage >= 4 && cmdDecision === "approved" ? "var(--green)" : stage >= 3 && cmdDecision === "disapproved" ? "var(--red)" : "var(--blue)", borderRadius: "12px 12px 0 0", transition: "background 0.4s" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.1em" }}>OFFICIAL TA REQUEST — SUBMITTED</div>
                <div style={{ padding: "2px 8px", borderRadius: 4, background: "var(--blueg)", border: "1px solid var(--blueb)", fontSize: 9, fontFamily: MONO, fontWeight: 700, color: "var(--blue)", letterSpacing: "0.08em" }}>TUITION ASSISTANCE</div>
              </div>

              {/* MOU status — hard gate */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", marginBottom: 10, background: "var(--greeng)", borderRadius: 7, border: "1px solid var(--greenb)" }}>
                <CheckCircle size={13} color="var(--green)" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.08em" }}>DoD MOU STATUS</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--green)" }}>{selectedCareer.course.mouStatus}</div>
                  <div style={{ fontSize: 9, color: "var(--dim)", marginTop: 1 }}>{selectedCareer.course.school}</div>
                </div>
              </div>

              {[["Course", `${selectedCareer.course.code} — ${selectedCareer.course.title}`], ["Credit Hours", `${selectedCareer.course.credits} hrs`], ["TA Cost", `$${selectedCareer.course.cost}`], ["Start Date", selectedCareer.course.start]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 11, fontFamily: MONO, color: "var(--dim)" }}>{k}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{v}</span>
                </div>
              ))}

              <div style={{ marginTop: 14 }}>
                {(stage === 1 || stage === 2) && (
                  <div className="bd-in-up" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "var(--amberg)", borderRadius: 8, border: "1px solid var(--amberb)" }}>
                    <Clock size={14} color="var(--amber)" style={{ animation: "bd-pulse 1.4s infinite" }} />
                    <span style={{ fontSize: 12, fontFamily: MONO, color: "var(--amber)", fontWeight: 600 }}>Pending commander availability certification…</span>
                  </div>
                )}
                {stage === 3 && cmdDecision === "approved" && !aiDone && (
                  <div className="bd-in-up" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "var(--blueg)", borderRadius: 8, border: "1px solid var(--blueb)" }}>
                    <Clock size={14} color="var(--blue)" style={{ animation: "bd-pulse 1.4s infinite" }} />
                    <span style={{ fontSize: 12, fontFamily: MONO, color: "var(--blue)", fontWeight: 600 }}>Commander certified — AI classification starting…</span>
                  </div>
                )}
                {stage >= 4 && cmdDecision === "approved" && stage < 5 && (
                  <div className="bd-in-up" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "var(--goldg)", borderRadius: 8, border: "1px solid var(--goldb)" }}>
                    <Clock size={14} color="var(--gold)" />
                    <span style={{ fontSize: 12, fontFamily: MONO, color: "var(--gold)", fontWeight: 600 }}>In ESO review queue…</span>
                  </div>
                )}
                {stage >= 3 && cmdDecision === "disapproved" && (
                  <div className="bd-in-up" style={{ display: "flex", flexDirection: "column", gap: 6, padding: "12px 14px", background: "var(--redg)", borderRadius: 8, border: "1px solid var(--redb)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <AlertTriangle size={15} color="var(--red)" />
                      <span style={{ fontSize: 12, fontFamily: MONO, fontWeight: 800, color: "var(--red)" }}>NOT CERTIFIED — REQUEST HELD</span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--mid)", lineHeight: 1.5 }}>
                      Commander determined soldier not currently available per operational requirements. This is not a content decision. Request has not reached the ESO.
                    </div>
                  </div>
                )}
                {stage === 5 && cmdDecision === "approved" && (
                  <div className="bd-in-up" style={{ display: "flex", flexDirection: "column", gap: 6, padding: "14px", background: "var(--greeng)", borderRadius: 8, border: "1px solid var(--greenb)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <CheckCircle size={16} color="var(--green)" />
                      <span style={{ fontSize: 13, fontFamily: MONO, fontWeight: 800, color: "var(--green)" }}>REQUEST APPROVED</span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--mid)", lineHeight: 1.5 }}>{selectedCareer.course.code} approved. ${selectedCareer.course.cost} TA funded. Enrollment confirmation sent to {selectedCareer.course.school}.</div>
                    <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--dim)" }}>ISR logged · Audit record created · {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Request tracker */}
          {stage >= 1 && (
            <div className="bd-in-sm" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.1em", marginBottom: 12 }}>REQUEST TRACKER</div>
              {[
                { label: "Sandbox exploration",           done: true },
                { label: "Official request → Command",    done: stage >= 1 },
                { label: "Commander availability cert.",  done: stage >= 3, warn: cmdDecision === "disapproved" },
                { label: "AI classification",             done: aiDone,     skip: cmdDecision === "disapproved" },
                { label: "ESO review",                    done: stage >= 5, skip: cmdDecision === "disapproved" },
                { label: "Decision & notification",       done: stage >= 5, skip: cmdDecision === "disapproved" },
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: i < 5 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", background: t.skip ? "var(--border)" : t.warn ? "var(--red)" : t.done ? "var(--green)" : "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.4s" }}>
                    {t.warn && !t.skip ? <AlertTriangle size={9} color="#000" /> : t.done && !t.skip ? <CheckCircle size={10} color="#000" /> : null}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: t.done ? 600 : 400, color: t.skip ? "var(--dim)" : t.warn ? "var(--red)" : t.done ? "var(--text)" : "var(--dim)", transition: "color 0.4s", textDecoration: t.skip ? "line-through" : "none" }}>{t.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ══ COLUMN 2: AR 621-5 — COMMANDER CERTIFICATION ══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "sticky", top: 20 }}>
          <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--amber)", letterSpacing: "0.12em", fontWeight: 700 }}>AR 621-5 § 3-4</div>

          <div style={{ background: "var(--card)", border: `2px solid ${stage >= 3 && cmdDecision === "disapproved" ? "var(--red)" : stage >= 2 ? "var(--amber)" : "var(--border)"}`, borderRadius: 12, padding: 14, position: "relative", overflow: "hidden", transition: "border-color 0.4s", animation: stage === 2 && cmdDecision === "none" ? "bd-glow 2s infinite" : "none" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: stage >= 2 ? (cmdDecision === "disapproved" ? "var(--red)" : stage >= 3 ? "var(--green)" : "var(--amber)") : "var(--border)", borderRadius: "12px 12px 0 0", transition: "background 0.4s" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: stage >= 2 ? "var(--amberg)" : "var(--bg2)", border: `1px solid ${stage >= 2 ? "var(--amberb)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.3s" }}>
                <Star size={14} color={stage >= 2 ? "var(--amber)" : "var(--dim)"} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontFamily: MONO, fontWeight: 700, color: stage >= 2 ? "var(--amber)" : "var(--dim)", letterSpacing: "0.06em" }}>AVAILABILITY CERTIFICATION</div>
                <div style={{ fontSize: 9, color: "var(--dim)" }}>Commander certifies readiness only</div>
              </div>
            </div>

            {stage >= 2 && (
              <div className="bd-in-up">
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text)", marginBottom: 1 }}>{CMD.name}</div>
                <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--amber)", marginBottom: 1 }}>{CMD.title}</div>
                <div style={{ fontSize: 10, color: "var(--dim)", marginBottom: 10 }}>{CMD.unit}</div>

                {cmdDecision === "none" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ background: "var(--bg2)", borderRadius: 7, padding: "7px 10px", marginBottom: 4 }}>
                      <div style={{ fontSize: 8, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.08em", marginBottom: 4 }}>CERTIFICATION SCOPE</div>
                      {["Not flagged / adverse action", "Duties permit attendance", "No TA recoupment violations", "NOT course content", "NOT career choice"].map(item => (
                        <div key={item} style={{ fontSize: 9, color: "var(--mid)", lineHeight: 1.5 }}>· {item}</div>
                      ))}
                    </div>
                    <button onClick={handleCmdApprove} data-testid="button-cmd-approve" style={{ padding: "8px", background: "var(--green)", color: "#000", border: "none", borderRadius: 7, fontFamily: MONO, fontSize: 10, fontWeight: 800, cursor: "pointer", letterSpacing: "0.06em" }}>
                      ✓ CERTIFY AVAILABLE
                    </button>
                    <button onClick={handleCmdDisapprove} data-testid="button-cmd-disapprove" style={{ padding: "8px", background: "var(--red)", color: "#fff", border: "none", borderRadius: 7, fontFamily: MONO, fontSize: 10, fontWeight: 800, cursor: "pointer", letterSpacing: "0.06em" }}>
                      ✗ NOT AVAILABLE — HOLD
                    </button>
                  </div>
                )}

                {cmdDecision === "approved" && (
                  <div className="bd-in-up" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", background: "var(--greeng)", borderRadius: 7, border: "1px solid var(--greenb)" }}>
                    <CheckCircle size={13} color="var(--green)" />
                    <span style={{ fontSize: 10, fontFamily: MONO, fontWeight: 700, color: "var(--green)" }}>CERTIFIED — RELEASED</span>
                  </div>
                )}

                {cmdDecision === "disapproved" && (
                  <div className="bd-in-up" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", background: "var(--redg)", borderRadius: 7, border: "1px solid var(--redb)" }}>
                      <AlertTriangle size={13} color="var(--red)" />
                      <span style={{ fontSize: 10, fontFamily: MONO, fontWeight: 700, color: "var(--red)" }}>NOT AVAILABLE — HELD</span>
                    </div>
                    <div style={{ fontSize: 9, color: "var(--mid)", lineHeight: 1.5, fontStyle: "italic" }}>
                      Operational readiness only. Not a content decision.
                    </div>
                  </div>
                )}
              </div>
            )}

            {stage < 2 && (
              <div style={{ fontSize: 10, color: "var(--dim)", lineHeight: 1.5 }}>
                Commander certifies availability and good standing before the request enters the education pipeline. Course content is outside command scope.
              </div>
            )}
          </div>

          {/* What commander does NOT see */}
          <div style={{ background: "var(--bg2)", borderRadius: 10, padding: "10px 12px", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 8, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.08em", marginBottom: 6 }}>COMMANDER DOES NOT SEE</div>
            {["Sandbox exploration history", "Career pathway analysis", "AI classification details", "Readiness proximity score"].map(item => (
              <div key={item} style={{ fontSize: 9, color: "var(--dim)", lineHeight: 1.6 }}>✗ {item}</div>
            ))}
          </div>

          {/* Flow status */}
          <div style={{ textAlign: "center", padding: "6px 0" }}>
            <div style={{ fontSize: 9, fontFamily: MONO, color: cmdDecision === "disapproved" ? "var(--red)" : cmdDecision === "approved" ? "var(--green)" : "var(--dim)", fontWeight: 700, letterSpacing: "0.08em" }}>
              {cmdDecision === "disapproved" ? "→ PIPELINE BLOCKED" : cmdDecision === "approved" ? "→ RELEASED TO AI" : stage >= 2 ? "AWAITING DECISION" : "AWAITING REQUEST"}
            </div>
          </div>
        </div>

        {/* ══ COLUMN 3: CMGF AI ENGINE ══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "sticky", top: 20 }}>
          <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--gold)", letterSpacing: "0.12em", fontWeight: 700 }}>CMGF AI ENGINE</div>

          {/* AI Identity Card */}
          <div style={{ background: "var(--card)", border: "1px solid var(--goldb)", borderRadius: 12, padding: 14, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--gold)", borderRadius: "12px 12px 0 0" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--goldg)", border: "1px solid var(--goldb)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, animation: (stage === 0 || (stage === 3 && cmdDecision === "approved")) ? "bd-glow 1.2s infinite" : "none" }}>
                <Brain size={17} color="var(--gold)" />
              </div>
              <div>
                <div style={{ fontSize: 11, fontFamily: MONO, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.06em" }}>NON-AUTHORITATIVE AI</div>
                <div style={{ fontSize: 9, color: "var(--dim)" }}>Facts only · No decision power</div>
              </div>
            </div>
            <div style={{ fontSize: 9, color: "var(--mid)", lineHeight: 1.5, marginBottom: 8 }}>
              {stage === 0 ? "Active in sandbox — advising SM with verified facts from DoD MOU registry, degree catalogs, and TA policy data."
                : stage < 3 ? "Awaiting commander certification before official classification can begin."
                : cmdDecision === "disapproved" ? "Pipeline blocked at command level. No official classification performed."
                : aiDone ? "Official classification complete. Verified facts forwarded to ESO."
                : "Running classification pipeline on official record…"}
            </div>
            <div style={{ background: "var(--bg2)", borderRadius: 7, padding: "6px 8px" }}>
              <div style={{ fontSize: 8, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.08em", marginBottom: 4 }}>DATA SOURCES</div>
              {["DoD MOU institution registry", "Army Ignite course catalogs", "AR 621-5 policy constraints", "TA/CA balance & cap data"].map(item => (
                <div key={item} style={{ fontSize: 9, color: "var(--mid)", lineHeight: 1.5 }}>· {item}</div>
              ))}
            </div>
          </div>

          {/* Dual-role note */}
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 8, fontFamily: MONO, color: "var(--gold)", letterSpacing: "0.08em", marginBottom: 6 }}>AI SERVES TWO ROLES</div>
            <div style={{ fontSize: 9, color: "var(--mid)", lineHeight: 1.5, marginBottom: 4 }}>
              <span style={{ fontWeight: 700, color: "var(--purple)" }}>1. Sandbox advisor</span> — talks directly to SM · no record created · no pipeline triggered
            </div>
            <div style={{ fontSize: 9, color: "var(--mid)", lineHeight: 1.5 }}>
              <span style={{ fontWeight: 700, color: "var(--gold)" }}>2. Official classifier</span> — runs only after CMD certifies · passes verified facts to ESO · constrained until gate clears
            </div>
          </div>

          {/* Classification pipeline steps */}
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.1em", marginBottom: 8 }}>CLASSIFICATION PIPELINE</div>
            {aiSteps.map((s, i) => {
              const done = aiIdx >= i; const active = aiIdx === i && !aiDone;
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, opacity: stage < 3 || cmdDecision !== "approved" ? 0.2 : 1, transition: "opacity 0.3s", marginBottom: 6 }}>
                  <div style={{ width: 13, height: 13, borderRadius: "50%", background: done ? "var(--green)" : active ? "var(--gold)" : "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, transition: "background 0.3s", animation: active ? "bd-pulse 0.8s infinite" : "none" }}>
                    {done && !active && <CheckCircle size={9} color="#000" />}
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: done ? "var(--text)" : "var(--dim)", lineHeight: 1.3 }}>{s.label}</div>
                    {done && <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--dim)", lineHeight: 1.4, marginTop: 1 }}>{s.detail}</div>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Policy verification output */}
          {aiDone && (
            <div className="bd-in-up" style={{ background: "var(--card)", border: "1px solid var(--goldb)", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--gold)", letterSpacing: "0.1em", marginBottom: 8, fontWeight: 700 }}>POLICY VERIFICATION COMPLETE</div>
              {[
                ["Policy flags", selectedCareer.id === "cyber" ? "Prereq gap (no violation)" : "None identified"],
                ["AR 621-5", "Compliant"],
                ["Risk index", selectedCareer.facts.find(f => f[0] === "Policy risk index")?.[1] ?? "—"],
                ["Routing", "→ ESO queue"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "3px 0", borderBottom: "1px solid var(--border)", gap: 6 }}>
                  <span style={{ fontSize: 9, fontFamily: MONO, color: "var(--dim)", flexShrink: 0 }}>{k}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text)", textAlign: "right" }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: 8, fontSize: 9, fontFamily: MONO, color: "var(--dim)", fontStyle: "italic" }}>
                Facts verified · No decision authority · ESO adjudication required
              </div>
            </div>
          )}
        </div>

        {/* ══ RIGHT: ESO ══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--green)", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 2 }}>ESO VIEW</div>

          {/* ESO Profile */}
          <div style={{ background: "var(--card)", border: "1px solid var(--greenb)", borderRadius: 12, padding: 18, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--green)", borderRadius: "12px 12px 0 0" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: "var(--greeng)", border: "1px solid var(--greenb)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Shield size={22} color="var(--green)" />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", lineHeight: 1.2 }}>{ESO.name}</div>
                <div style={{ fontSize: 11, fontFamily: MONO, color: "var(--green)", marginTop: 2 }}>{ESO.title}</div>
                <div style={{ fontSize: 11, color: "var(--mid)" }}>{ESO.grade} · {ESO.station}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                ["QUEUE", stage >= 4 && cmdDecision === "approved" ? ESO.queueCount + 1 : ESO.queueCount, stage >= 4 && cmdDecision === "approved" ? "var(--amber)" : "var(--text)"],
                ["AI PRE-CLEARED", 14, "var(--green)"],
                ["FLAGGED", 3, "var(--red)"],
              ].map(([k, v, c]) => (
                <div key={k as string} style={{ flex: 1, background: "var(--bg2)", borderRadius: 7, padding: "8px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--dim)", marginBottom: 3 }}>{k}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: c as string, fontFamily: MONO, transition: "color 0.4s" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ESO awaiting state */}
          {stage < 4 && cmdDecision !== "disapproved" && (
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 28, textAlign: "center" }}>
              <Clock size={28} color="var(--dim)" style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 13, fontFamily: MONO, color: "var(--dim)", marginBottom: 6 }}>
                {stage < 2 ? "Awaiting commander availability certification…"
                  : stage === 2 ? "Commander reviewing — not yet forwarded…"
                  : "Commander certified — AI classifying on record…"}
              </div>
              <div style={{ fontSize: 11, color: "var(--dim)", lineHeight: 1.5 }}>
                The ESO cannot see this request until the commander certifies availability and the pipeline completes. AR 621-5 § 3-4.
              </div>
            </div>
          )}

          {/* Disapproved — shadow signal panel */}
          {stage >= 3 && cmdDecision === "disapproved" && (
            <div className="bd-in-eso">
              <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, textAlign: "center", marginBottom: 14 }}>
                <EyeOff size={28} color="var(--dim)" style={{ marginBottom: 10 }} />
                <div style={{ fontSize: 13, fontFamily: MONO, fontWeight: 700, color: "var(--dim)", marginBottom: 6 }}>REQUEST NOT VISIBLE TO ESO</div>
                <div style={{ fontSize: 11, color: "var(--dim)", lineHeight: 1.6 }}>
                  In today's system — without CMGF — this is where the story ends for the ESO. The request simply does not exist in their view. The demand signal is invisible.
                </div>
              </div>

              {shadowVisible && (
                <div className="bd-in-up" style={{ background: "var(--card)", border: "2px dashed var(--purpleb)", borderRadius: 12, padding: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <Eye size={16} color="var(--purple)" />
                    <span style={{ fontSize: 11, fontFamily: MONO, fontWeight: 700, color: "var(--purple)", letterSpacing: "0.08em" }}>CMGF SHADOW SIGNAL — ESO VIEW</span>
                  </div>
                  <div style={{ background: "var(--bg2)", borderRadius: 8, padding: "12px 14px", marginBottom: 12 }}>
                    <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.1em", marginBottom: 8 }}>PIPELINE VISIBILITY (COUNT ONLY)</div>
                    {[["Requests entering pipeline this period", "1"], ["Acted upon at command level", "1"], ["Forwarded to ESO queue", "0"], ["Not forwarded", "1"]].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid var(--border)", fontSize: 11 }}>
                        <span style={{ color: "var(--dim)", fontFamily: MONO }}>{k}</span>
                        <span style={{ fontWeight: 700, color: "var(--text)" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--mid)", lineHeight: 1.6, marginBottom: 10 }}>
                    No identifying information is included. The ESO sees that demand entered the pipeline and was acted on at the command level — nothing more. This is suppressed demand data.
                  </div>
                  <div style={{ padding: "8px 12px", background: "var(--purpleg)", borderRadius: 7, border: "1px solid var(--purpleb)" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--purple)" }}>This is a governance design choice — not a default feature. Whether to surface this signal requires policy decision.</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Approved — ESO queue card */}
          {stage >= 4 && cmdDecision === "approved" && (
            <div className="bd-in-eso" style={{ background: "var(--card)", border: "2px solid var(--green)", borderRadius: 12, padding: 18, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--green)", borderRadius: "12px 12px 0 0" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", animation: stage < 5 ? "bd-pulse 1s infinite" : "none" }} />
                  <span style={{ fontSize: 10, fontFamily: MONO, color: "var(--green)", fontWeight: 700, letterSpacing: "0.1em" }}>NEW REQUEST — CMD APPROVED</span>
                </div>
                <span style={{ fontSize: 10, fontFamily: MONO, color: "var(--dim)" }}>AI ANALYSIS COMPLETE</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 2 }}>{SM.name}</div>
              <div style={{ fontSize: 11, fontFamily: MONO, color: "var(--mid)", marginBottom: 12 }}>{SM.rank} · {SM.mos}</div>

              {[["Requested", `${selectedCareer.course.code} — ${selectedCareer.course.title}`], ["Institution", selectedCareer.course.school], ["Cost", "$" + selectedCareer.course.cost]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 11, fontFamily: MONO, color: "var(--dim)" }}>{k}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text)" }}>{v}</span>
                </div>
              ))}

              <div style={{ background: "var(--bg2)", borderRadius: 9, padding: 12, margin: "14px 0" }}>
                <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--gold)", letterSpacing: "0.1em", marginBottom: 8 }}>VERIFIED FACTS — CMGF ENGINE</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginBottom: 10 }}>
                  {[
                    ["Eligibility", "Confirmed"],
                    ["AR 621-5 status", "Compliant"],
                    ["Risk index", selectedCareer.facts.find(f => f[0] === "Policy risk index")?.[1]?.split(" ")[0] ?? "—"],
                    ["Policy flags", selectedCareer.id === "cyber" ? "Prereq gap" : "None"],
                  ].map(([k, v]) => (
                    <div key={k} style={{ background: "var(--card)", borderRadius: 7, padding: "7px 9px" }}>
                      <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--dim)", marginBottom: 2 }}>{k}</div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: selectedCareer.id === "cyber" && k === "Policy flags" ? "var(--amber)" : "var(--text)", fontFamily: MONO }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.08em", marginBottom: 5 }}>VERIFICATION FINDINGS</div>
                {aiSteps.slice(0, 5).map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 4 }}>
                    <CheckCircle size={10} color="var(--green)" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div style={{ fontSize: 10, color: "var(--mid)", lineHeight: 1.4 }}>{s.detail}</div>
                  </div>
                ))}
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--border)", fontSize: 9, fontFamily: MONO, color: "var(--dim)", fontStyle: "italic" }}>
                  Verified facts only · No recommendation authority · ESO decision required
                </div>
              </div>

              {stage === 4 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.08em", marginBottom: 2 }}>ESO DECISION</div>
                  <button onClick={advance} data-testid="button-eso-approve" style={{ padding: "11px", background: "var(--green)", color: "#000", border: "none", borderRadius: 8, fontFamily: MONO, fontSize: 12, fontWeight: 800, letterSpacing: "0.07em", cursor: "pointer" }}>
                    ✓ APPROVE REQUEST
                  </button>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                    <button data-testid="button-eso-hold" style={{ padding: "9px", background: "none", border: "1px solid var(--border)", borderRadius: 8, fontFamily: MONO, fontSize: 11, color: "var(--mid)", cursor: "pointer" }}>REQUEST INFO</button>
                    <button data-testid="button-eso-escalate" style={{ padding: "9px", background: "none", border: "1px solid var(--amberb)", borderRadius: 8, fontFamily: MONO, fontSize: 11, color: "var(--amber)", cursor: "pointer" }}>ESCALATE</button>
                  </div>
                </div>
              )}
              {stage === 5 && (
                <div className="bd-in-up" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "var(--greeng)", borderRadius: 8, border: "1px solid var(--greenb)" }}>
                  <CheckCircle size={16} color="var(--green)" />
                  <div>
                    <div style={{ fontSize: 12, fontFamily: MONO, fontWeight: 800, color: "var(--green)" }}>APPROVED BY {ESO.name.toUpperCase()}</div>
                    <div style={{ fontSize: 10, color: "var(--mid)", marginTop: 3 }}>ISR logged · Audit record created · SM notified</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* What the ESO doesn't have to do */}
          {stage >= 4 && cmdDecision === "approved" && (
            <div className="bd-in-eso" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.1em", marginBottom: 8 }}>AI COMPLETED BEFORE ESO OPENED THIS</div>
              {[`Pulled SM's TA balance`, `Verified ${selectedCareer.course.school} DoD MOU`, "Cross-checked degree plan alignment", "Ran AR 621-5 compliance check", "Scored risk index (no recommendation)"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 5 }}>
                  <CheckCircle size={10} color="var(--green)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: "var(--mid)", lineHeight: 1.4 }}>{item}</span>
                </div>
              ))}
              <div style={{ marginTop: 8, padding: "7px 10px", background: "var(--greeng)", borderRadius: 7, border: "1px solid var(--greenb)" }}>
                <span style={{ fontSize: 10, color: "var(--green)", fontWeight: 600 }}>{ESO.name}'s job: judgment — not research.</span>
              </div>
            </div>
          )}
        </div>

        {/* ══ COLUMN 5: ISR — INSTITUTIONAL SIGNAL ══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "sticky", top: 20 }}>
          <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--purple)", letterSpacing: "0.12em", fontWeight: 700 }}>ISR</div>

          {/* ISR — Policy Intelligence */}
          <div style={{ background: "var(--card)", border: "1px solid var(--purpleb)", borderRadius: 12, padding: 14, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--purple)", borderRadius: "12px 12px 0 0" }} />
            <div style={{ fontSize: 10, fontFamily: MONO, fontWeight: 700, color: "var(--purple)", marginBottom: 6 }}>POLICY INTELLIGENCE</div>
            <div style={{ fontSize: 9, color: "var(--mid)", lineHeight: 1.5, marginBottom: 10 }}>
              Every request — approved, held, or dropped — generates de-identified signal. This data informs policy, resource allocation, and congressional reporting.
            </div>

            <div style={{ background: "var(--bg2)", borderRadius: 8, padding: "8px 10px", marginBottom: 10 }}>
              <div style={{ fontSize: 8, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.08em", marginBottom: 6 }}>DEMAND SIGNAL (AGGREGATE)</div>
              {[
                ["Total TA requests (Q2 FY26)", "247"],
                ["CMD certified", "209 (84.6%)"],
                ["CMD held (avail.)", "38 (15.4%)"],
                ["ESO approved", "194"],
                ["Bottleneck", "CMD cert. queue (avg 3.2 days)"],
                ["Top career field", "Healthcare (31%)"],
                ["Rising demand", "Cybersecurity (+42% QoQ)"],
                ["Top MOU institution", "Troy University"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 8, fontFamily: MONO, color: "var(--dim)" }}>{k}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "var(--text)" }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 8, fontFamily: MONO, color: "var(--purple)", letterSpacing: "0.08em", marginBottom: 4 }}>SUBSCRIBERS</div>
            {["Installation education command", "Army Human Resources Command", "DoD Voluntary Education (DANTES)", "Congressional reporting (NDAA §553)", "Pentagon workforce planning"].map(item => (
              <div key={item} style={{ fontSize: 9, color: "var(--mid)", lineHeight: 1.5 }}>· {item}</div>
            ))}
          </div>

          {/* Voice of the Veteran */}
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 8, fontFamily: MONO, color: "var(--purple)", letterSpacing: "0.08em", marginBottom: 6 }}>VOICE OF THE VETERAN</div>
            <div style={{ fontSize: 9, color: "var(--mid)", lineHeight: 1.5, marginBottom: 8 }}>
              Aggregated feedback from transitioned veterans feeds back into the system — what worked, what didn't, what the next generation needs to know.
            </div>
            {[
              { q: "Biggest barrier to civilian employment?", a: "Credential translation — military experience not recognized", pct: "47%" },
              { q: "Was TA/CA education useful for transition?", a: "Yes, directly applicable", pct: "62%" },
              { q: "Would a transition sandbox have helped?", a: "Strongly agree", pct: "78%" },
            ].map(item => (
              <div key={item.q} style={{ background: "var(--bg2)", borderRadius: 6, padding: "6px 8px", marginBottom: 6 }}>
                <div style={{ fontSize: 8, fontFamily: MONO, color: "var(--dim)", marginBottom: 2 }}>{item.q}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 9, color: "var(--mid)", fontWeight: 600 }}>{item.a}</span>
                  <span style={{ fontSize: 10, fontFamily: MONO, fontWeight: 800, color: "var(--purple)" }}>{item.pct}</span>
                </div>
              </div>
            ))}
            <div style={{ fontSize: 9, color: "var(--dim)", fontStyle: "italic", marginTop: 4, lineHeight: 1.4 }}>
              Wisdom from those who transitioned informs policy for those who will.
            </div>
          </div>

          {/* Live signal — what this request generated */}
          {stage >= 3 && (
            <div className="bd-in-up" style={{ background: "var(--card)", border: `1px solid ${cmdDecision === "disapproved" ? "var(--redb)" : "var(--purpleb)"}`, borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 8, fontFamily: MONO, color: "var(--purple)", letterSpacing: "0.08em", marginBottom: 6 }}>THIS REQUEST → ISR</div>
              {cmdDecision === "approved" ? (
                <>
                  {[
                    ["Signal type", "TA request — approved flow"],
                    ["Career field", selectedCareer.label],
                    ["MOU institution", selectedCareer.course.school],
                    ["Pipeline stage", stage >= 5 ? "Complete" : stage >= 4 ? "ESO queue" : "AI classifying"],
                    ["ISR record", stage >= 5 ? "Created" : "Pending"],
                    ["Transition signal", "Education-track (active)"],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", borderBottom: "1px solid var(--border)" }}>
                      <span style={{ fontSize: 8, fontFamily: MONO, color: "var(--dim)" }}>{k}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: "var(--text)" }}>{v}</span>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", background: "var(--redg)", borderRadius: 6, border: "1px solid var(--redb)", marginBottom: 6 }}>
                    <EyeOff size={11} color="var(--red)" />
                    <span style={{ fontSize: 9, fontFamily: MONO, fontWeight: 700, color: "var(--red)" }}>SUPPRESSED DEMAND</span>
                  </div>
                  <div style={{ fontSize: 9, color: "var(--mid)", lineHeight: 1.4, marginBottom: 6 }}>
                    Without CMGF: lost. No institutional record. Congress never sees the demand. TAP funding remains misaligned.
                  </div>
                  <button onClick={() => setShadowVisible(v => !v)} data-testid="button-shadow-toggle" style={{ width: "100%", padding: "6px", background: "none", border: "1px solid var(--purpleb)", borderRadius: 6, fontFamily: MONO, fontSize: 9, color: "var(--purple)", cursor: "pointer", letterSpacing: "0.06em" }}>
                    {shadowVisible ? "HIDE SHADOW SIGNAL" : "SHOW SHADOW SIGNAL →"}
                  </button>
                  {shadowVisible && (
                    <div className="bd-in-up" style={{ marginTop: 6, background: "var(--bg2)", borderRadius: 7, padding: "7px 9px", border: "1px dashed var(--purpleb)" }}>
                      <div style={{ fontSize: 8, fontFamily: MONO, color: "var(--purple)", letterSpacing: "0.08em", marginBottom: 4 }}>SHADOW SIGNAL (COUNT ONLY)</div>
                      {[["Requests entering pipeline", "1"], ["Held at command", "1"], ["Forwarded to ESO", "0"], ["Demand captured", "Yes (CMGF)"]].map(([k, v]) => (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", fontSize: 9 }}>
                          <span style={{ color: "var(--dim)", fontFamily: MONO }}>{k}</span>
                          <span style={{ fontWeight: 700, color: "var(--text)" }}>{v}</span>
                        </div>
                      ))}
                      <div style={{ fontSize: 8, color: "var(--dim)", fontStyle: "italic", marginTop: 4, lineHeight: 1.4 }}>
                        No names. Count only. But Congress and the Pentagon now know this demand exists.
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ISR not yet triggered */}
          {stage < 3 && (
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--dim)", lineHeight: 1.5 }}>
                ISR signal will be generated once the pipeline processes this request — regardless of outcome. Sandbox exploration is already generating transition-intent signal.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: "1px solid var(--border)", background: "var(--bg2)", padding: "14px 32px" }}>
        <div style={{ maxWidth: 1720, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontFamily: MONO, color: "var(--dim)" }}>Profiles: Synthetic · No real SM data represented</span>
            <span style={{ fontSize: 11, fontFamily: MONO, color: "var(--dim)" }}>AI: Non-authoritative · Human-in-the-loop required</span>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <Link href="/research/cmgf"><span style={{ fontSize: 11, fontFamily: MONO, color: "var(--blue)", cursor: "pointer" }}>CMGF Hub →</span></Link>
            <Link href="/research/career-advisor"><span style={{ fontSize: 11, fontFamily: MONO, color: "var(--blue)", cursor: "pointer" }}>Career Advisor →</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowArrow({ active, blocked, color, label }: { active: boolean; blocked?: boolean; color: string; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      <div style={{ width: 2, height: 16, background: active || blocked ? color : "var(--border)", transition: "background 0.5s" }} />
      <div style={{
        fontSize: 9, fontFamily: MONO, color: active || blocked ? color : "var(--dim)",
        padding: "3px 8px", borderRadius: 5, textAlign: "center", letterSpacing: "0.06em",
        background: active || blocked ? `color-mix(in srgb, ${color} 12%, transparent)` : "transparent",
        border: active || blocked ? `1px solid color-mix(in srgb, ${color} 30%, transparent)` : "1px solid transparent",
        transition: "all 0.4s",
      }}>
        {label}
      </div>
      <div style={{ width: 2, height: 16, background: active || blocked ? color : "var(--border)", transition: "background 0.5s" }} />
    </div>
  );
}
