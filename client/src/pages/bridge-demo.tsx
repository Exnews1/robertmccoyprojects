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
  station: "Fort Campbell, KY",
  credits: 54, taBalance: 3250,
};

const CAREERS = [
  {
    id: "healthcare-admin",
    label: "Healthcare Administrator",
    icon: "🏥",
    degree: "B.S. Healthcare Administration",
    course: { code: "HLTH 301", title: "Health Policy & Law", school: "Troy University", credits: 3, cost: 750, start: "April 14, 2026" },
    facts: [
      ["TA eligibility",     "Confirmed — $3,250 of $4,000 remaining (FY2026)"],
      ["Degree alignment",   "HLTH 301 maps directly to declared degree plan"],
      ["MOS credit value",   "68W translates 12–18 credits toward healthcare programs"],
      ["Credential gap",     "None at course level — degree required for management roles"],
      ["AR 621-5 flags",     "None identified"],
      ["Policy risk index",  "0.12 (no thresholds breached)"],
    ],
  },
  {
    id: "nurse",
    label: "Registered Nurse",
    icon: "⚕",
    degree: "B.S. Nursing (BSN)",
    course: { code: "BIOL 220", title: "Anatomy & Physiology II", school: "American Military University", credits: 4, cost: 900, start: "April 14, 2026" },
    facts: [
      ["TA eligibility",     "Confirmed — $3,250 of $4,000 remaining (FY2026)"],
      ["Degree alignment",   "BIOL 220 fulfills BSN science prerequisite requirement"],
      ["MOS credit value",   "68W field experience maps to clinical hour portfolio"],
      ["Credential gap",     "NCLEX-RN license required post-graduation (not TA-funded)"],
      ["AR 621-5 flags",     "None identified"],
      ["Policy risk index",  "0.14 (no thresholds breached)"],
    ],
  },
  {
    id: "police",
    label: "Police / Law Enforcement",
    icon: "🚔",
    degree: "B.S. Criminal Justice",
    course: { code: "CJUS 210", title: "Criminology & Social Justice", school: "Troy University", credits: 3, cost: 750, start: "April 14, 2026" },
    facts: [
      ["TA eligibility",     "Confirmed — $3,250 of $4,000 remaining (FY2026)"],
      ["Degree alignment",   "CJUS 210 maps to B.S. Criminal Justice core requirements"],
      ["MOS credit value",   "Military police/leadership experience transferable"],
      ["Credential gap",     "State POST certification required after degree (not TA-funded)"],
      ["AR 621-5 flags",     "None identified"],
      ["Policy risk index",  "0.11 (no thresholds breached)"],
    ],
  },
  {
    id: "teacher",
    label: "K-12 Teacher",
    icon: "📚",
    degree: "B.S. Education",
    course: { code: "EDUC 301", title: "Curriculum Design & Assessment", school: "Columbia Southern University", credits: 3, cost: 750, start: "April 14, 2026" },
    facts: [
      ["TA eligibility",     "Confirmed — $3,250 of $4,000 remaining (FY2026)"],
      ["Degree alignment",   "EDUC 301 maps to B.S. Education pedagogy track"],
      ["MOS credit value",   "Army instructor/trainer roles may qualify for field experience credit"],
      ["Credential gap",     "State teaching license required after degree (state-specific)"],
      ["AR 621-5 flags",     "None identified"],
      ["Policy risk index",  "0.10 (no thresholds breached)"],
    ],
  },
  {
    id: "cyber",
    label: "Cybersecurity Analyst",
    icon: "🔐",
    degree: "B.S. Cybersecurity",
    course: { code: "CSCI 250", title: "Network Security Fundamentals", school: "American Military University", credits: 3, cost: 750, start: "April 14, 2026" },
    facts: [
      ["TA eligibility",     "Confirmed — $3,250 of $4,000 remaining (FY2026)"],
      ["Degree alignment",   "CSCI 250 maps to B.S. Cybersecurity core — partial alignment only"],
      ["MOS credit value",   "68W STEM credits limited; additional prerequisites likely required"],
      ["Credential gap",     "CompTIA Security+ recommended parallel to degree (CA-fundable)"],
      ["AR 621-5 flags",     "None identified — prerequisite gap noted for ESO awareness"],
      ["Policy risk index",  "0.31 (elevated — prerequisite gap; no policy violation)"],
    ],
  },
] as const;

const ESO = {
  name: "James R. Okafor",
  title: "Education Services Officer",
  grade: "GS-11, Civilian",
  station: "Fort Campbell Education Center",
  queueCount: 17,
};

const CMD = {
  name: "CPT Denise M. Flores",
  title: "Company Commander",
  unit: "HHC, 2-101 AVN, 101st ABN DIV",
};

function buildAiSteps(career: typeof CAREERS[number]) {
  return [
    { label: "Identity verification",   detail: "E-5 rank confirmed · DOD ID matched" },
    { label: "TA eligibility",          detail: `$${SM.taBalance.toLocaleString()} of $4,000 remaining (FY2026) — above course cost` },
    { label: "Degree-plan alignment",   detail: `${career.course.code} maps to ${career.degree}` },
    { label: "AR 621-5 compliance",     detail: "No prior recoupment events · No suspension flags" },
    { label: "Institutional check",     detail: `${career.course.school} · TA-eligible · Regionally accredited` },
    { label: "Channel routing",         detail: "Standard Review — commander approval required per AR 621-5 WAVE 2" },
    { label: "Policy flags",            detail: career.id === "cyber" ? "Prerequisite gap noted — no policy violation" : "None identified" },
  ];
}

const STEPS = [
  { label: "Sandbox Exploration",    cue: "SGT Chen is exploring privately — no institutional record, no commitment." },
  { label: "Official Request",       cue: "SGT Chen elects to cross from sandbox to official request. The signal enters the system." },
  { label: "AI Classification",      cue: "The CMGF engine runs seven checks — eligibility, compliance, risk, routing." },
  { label: "Commander Review",       cue: "AR 621-5 WAVE 2: the Commander approves or disapproves before the ESO sees anything." },
  { label: "ESO / Not Forwarded",    cue: "Approved: ESO receives the pre-analyzed request. Disapproved: request is dropped." },
  { label: "Decision & Notify",      cue: "ESO reviews and decides. SGT Chen is notified. Audit record created." },
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
    if (stage !== 2) return;
    setAiIdx(-1); setAiDone(false);
    let i = 0;
    const tick = () => { setAiIdx(i); i++; if (i < aiSteps.length) setTimeout(tick, 420); else setTimeout(() => setAiDone(true), 600); };
    setTimeout(tick, 300);
  }, [stage]);

  const advance = () => {
    if (stage === 2 && !aiDone) return;
    if (stage === 3) return;
    setStage(s => Math.min(s + 1, 5));
  };

  const handleCmdApprove = () => { setCmdDecision("approved"); setStage(4); };
  const handleCmdDisapprove = () => { setCmdDecision("disapproved"); setStage(4); };

  const reset = () => {
    setStage(0); setAiIdx(-1); setAiDone(false);
    setCmdDecision("none"); setShadowVisible(false);
    setSelectedCareer(CAREERS[0]);
  };

  const stepIdx = Math.min(stage, STEPS.length - 1);
  const advanceable = stage < 5 && stage !== 3 && !(stage === 2 && !aiDone) && !(stage === 4 && cmdDecision === "disapproved");

  const btnLabel = () => {
    if (stage === 0) return "START DEMO →";
    if (stage === 2 && !aiDone) return "AI PROCESSING…";
    if (stage === 3) return "USE COMMANDER GATE ↓";
    if (stage === 4 && cmdDecision === "disapproved") return "REQUEST DROPPED";
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
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
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
        <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", alignItems: "center", gap: 20 }}>
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

      {/* ── 3-COLUMN LAYOUT ── */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "24px 24px 48px", display: "grid", gridTemplateColumns: "1fr 220px 1fr", gap: 20, alignItems: "start" }}>

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
                {CAREERS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCareer(c)}
                    data-testid={`button-career-${c.id}`}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                      background: selectedCareer.id === c.id ? "var(--purpleg)" : "var(--bg2)",
                      border: `1px solid ${selectedCareer.id === c.id ? "var(--purpleb)" : "var(--border)"}`,
                      borderRadius: 8, cursor: "pointer", textAlign: "left", transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{c.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: selectedCareer.id === c.id ? "var(--purple)" : "var(--text)" }}>{c.label}</div>
                      <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--dim)" }}>{c.degree}</div>
                    </div>
                    {selectedCareer.id === c.id && <CheckCircle size={14} color="var(--purple)" style={{ marginLeft: "auto", flexShrink: 0 }} />}
                  </button>
                ))}
              </div>

              {/* Dynamic feasibility facts */}
              <div style={{ background: "var(--bg2)", borderRadius: 8, padding: "10px 14px", marginBottom: 14 }} className="bd-in-up" key={selectedCareer.id}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 16 }}>{selectedCareer.icon}</span>
                  <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--purple)", letterSpacing: "0.08em", fontWeight: 700 }}>SANDBOX FACTS — {selectedCareer.label.toUpperCase()}</div>
                </div>
                {selectedCareer.facts.map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "6px 0", borderBottom: "1px solid var(--border)", gap: 12 }}>
                    <span style={{ fontSize: 10, fontFamily: MONO, color: "var(--dim)", flexShrink: 0 }}>{k}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: "var(--text)", textAlign: "right", lineHeight: 1.3 }}>{v}</span>
                  </div>
                ))}
                <div style={{ marginTop: 10, padding: "6px 10px", background: "var(--purpleg)", borderRadius: 6, border: "1px solid var(--purpleb)" }}>
                  <span style={{ fontSize: 10, color: "var(--purple)", fontFamily: MONO }}>Course to request: {selectedCareer.course.code} — {selectedCareer.course.title} · ${selectedCareer.course.cost}</span>
                </div>
              </div>

              <div style={{ fontSize: 11, color: "var(--dim)", fontStyle: "italic", marginBottom: 14 }}>
                No institutional record has been created. SGT Chen may exit without any consequence.
              </div>
              <button onClick={advance} style={{ width: "100%", padding: "11px", background: "var(--purple)", color: "#fff", border: "none", borderRadius: 8, fontFamily: MONO, fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer" }} data-testid="button-sm-proceed">
                PROCEED TO OFFICIAL REQUEST →
              </button>
            </div>
          )}

          {/* Official request card — stage 1+ */}
          {stage >= 1 && (
            <div className="bd-in-sm" style={{ background: "var(--card)", border: `1px solid ${stage >= 4 && cmdDecision === "approved" ? "var(--greenb)" : stage >= 4 && cmdDecision === "disapproved" ? "var(--redb)" : "var(--blueb)"}`, borderRadius: 12, padding: 18, position: "relative", overflow: "hidden", transition: "border-color 0.4s" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: stage >= 4 && cmdDecision === "approved" ? "var(--green)" : stage >= 4 && cmdDecision === "disapproved" ? "var(--red)" : "var(--blue)", borderRadius: "12px 12px 0 0", transition: "background 0.4s" }} />
              <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.1em", marginBottom: 12 }}>OFFICIAL TA REQUEST — SUBMITTED</div>
              {[["Course", `${selectedCareer.course.code} — ${selectedCareer.course.title}`], ["Institution", selectedCareer.course.school], ["Credit Hours", selectedCareer.course.credits + " hrs"], ["Cost", "$" + selectedCareer.course.cost], ["Start Date", selectedCareer.course.start]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 11, fontFamily: MONO, color: "var(--dim)" }}>{k}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{v}</span>
                </div>
              ))}

              <div style={{ marginTop: 14 }}>
                {(stage === 1 || stage === 2) && (
                  <div className="bd-in-up" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "var(--blueg)", borderRadius: 8, border: "1px solid var(--blueb)" }}>
                    <Clock size={14} color="var(--blue)" style={{ animation: "bd-pulse 1.4s infinite" }} />
                    <span style={{ fontSize: 12, fontFamily: MONO, color: "var(--blue)", fontWeight: 600 }}>
                      {stage === 1 ? "Submitted — AI classification starting…" : "CMGF engine processing…"}
                    </span>
                  </div>
                )}
                {stage === 3 && (
                  <div className="bd-in-up" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "var(--amberg)", borderRadius: 8, border: "1px solid var(--amberb)" }}>
                    <Clock size={14} color="var(--amber)" />
                    <span style={{ fontSize: 12, fontFamily: MONO, color: "var(--amber)", fontWeight: 600 }}>Pending commander review…</span>
                  </div>
                )}
                {stage >= 4 && cmdDecision === "approved" && stage < 5 && (
                  <div className="bd-in-up" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "var(--goldg)", borderRadius: 8, border: "1px solid var(--goldb)" }}>
                    <Clock size={14} color="var(--gold)" />
                    <span style={{ fontSize: 12, fontFamily: MONO, color: "var(--gold)", fontWeight: 600 }}>In ESO review queue…</span>
                  </div>
                )}
                {stage >= 4 && cmdDecision === "disapproved" && (
                  <div className="bd-in-up" style={{ display: "flex", flexDirection: "column", gap: 6, padding: "12px 14px", background: "var(--redg)", borderRadius: 8, border: "1px solid var(--redb)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <AlertTriangle size={15} color="var(--red)" />
                      <span style={{ fontSize: 12, fontFamily: MONO, fontWeight: 800, color: "var(--red)" }}>REQUEST NOT FORWARDED</span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--mid)", lineHeight: 1.5 }}>
                      Your commander did not approve this request. It has not been submitted to the ESO. Contact your chain of command for guidance.
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
                { label: "Sandbox exploration",       done: true },
                { label: "Official request submitted", done: stage >= 1 },
                { label: "AI classification",          done: stage >= 3 },
                { label: "Commander review",           done: stage >= 4, warn: cmdDecision === "disapproved" },
                { label: "ESO review",                 done: stage >= 5, skip: cmdDecision === "disapproved" },
                { label: "Decision & notification",    done: stage >= 5, skip: cmdDecision === "disapproved" },
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

        {/* ══ CENTER: AI BRIDGE + COMMANDER GATE ══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "sticky", top: 20 }}>
          <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--gold)", letterSpacing: "0.12em", fontWeight: 700, textAlign: "center" }}>MEDIATION LAYER</div>

          {/* CMGF Engine card */}
          <div style={{ background: "var(--card)", border: "1px solid var(--goldb)", borderRadius: 12, padding: 14, textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--gold)", borderRadius: "12px 12px 0 0" }} />
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--goldg)", border: "1px solid var(--goldb)", display: "flex", alignItems: "center", justifyContent: "center", margin: "6px auto 8px", animation: stage === 2 ? "bd-glow 1.2s infinite" : "none" }}>
              <Brain size={18} color="var(--gold)" />
            </div>
            <div style={{ fontSize: 11, fontFamily: MONO, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.06em" }}>CMGF ENGINE</div>
            <div style={{ fontSize: 10, color: "var(--dim)", marginTop: 3 }}>Non-authoritative AI</div>
          </div>

          {/* Flow arrow: SM → AI */}
          <FlowArrow active={stage >= 1} color="var(--blue)" label="SM REQUEST" />

          {/* AI classification steps */}
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.1em", marginBottom: 8 }}>CLASSIFICATION PIPELINE</div>
            {aiSteps.map((s, i) => {
              const done = aiIdx >= i; const active = aiIdx === i && !aiDone;
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, opacity: stage < 2 ? 0.25 : 1, transition: "opacity 0.3s", marginBottom: 6 }}>
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

          {/* AI policy verification output — facts only, no recommendation */}
          {aiDone && (
            <div className="bd-in-up" style={{ background: "var(--card)", border: "1px solid var(--goldb)", borderRadius: 10, padding: "11px 14px" }}>
              <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--gold)", letterSpacing: "0.1em", marginBottom: 8, fontWeight: 700 }}>POLICY VERIFICATION COMPLETE</div>
              {[
                ["Policy flags", selectedCareer.id === "cyber" ? "Prerequisite gap (no violation)" : "None identified"],
                ["AR 621-5 status", "Compliant"],
                ["Risk index", selectedCareer.facts.find(f => f[0] === "Policy risk index")?.[1] ?? "—"],
                ["Routing", "→ Commander gate (WAVE 2)"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "4px 0", borderBottom: "1px solid var(--border)", gap: 8 }}>
                  <span style={{ fontSize: 9, fontFamily: MONO, color: "var(--dim)", flexShrink: 0 }}>{k}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text)", textAlign: "right" }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: 8, fontSize: 9, fontFamily: MONO, color: "var(--dim)", fontStyle: "italic" }}>
                Facts verified · No decision authority · Human adjudication required
              </div>
            </div>
          )}

          {/* Flow arrow: AI → CMD */}
          <FlowArrow active={stage >= 3} color="var(--amber)" label="→ CMD REVIEW" />

          {/* Commander gate */}
          <div style={{ background: "var(--card)", border: `2px solid ${stage >= 4 && cmdDecision === "disapproved" ? "var(--red)" : stage >= 3 ? "var(--amber)" : "var(--border)"}`, borderRadius: 12, padding: 14, position: "relative", overflow: "hidden", transition: "border-color 0.4s", animation: stage === 3 && cmdDecision === "none" ? "bd-glow 2s infinite" : "none" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: stage >= 3 ? (cmdDecision === "disapproved" ? "var(--red)" : "var(--amber)") : "var(--border)", borderRadius: "12px 12px 0 0", transition: "background 0.4s" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: stage >= 3 ? "var(--amberg)" : "var(--bg2)", border: `1px solid ${stage >= 3 ? "var(--amberb)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.3s" }}>
                <Star size={15} color={stage >= 3 ? "var(--amber)" : "var(--dim)"} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontFamily: MONO, fontWeight: 700, color: stage >= 3 ? "var(--amber)" : "var(--dim)", letterSpacing: "0.06em" }}>COMMANDER GATE</div>
                <div style={{ fontSize: 10, color: "var(--dim)" }}>AR 621-5 WAVE 2</div>
              </div>
            </div>

            {stage >= 3 && (
              <div className="bd-in-up">
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{CMD.name}</div>
                <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--amber)", marginBottom: 2 }}>{CMD.title}</div>
                <div style={{ fontSize: 10, color: "var(--dim)", marginBottom: 12 }}>{CMD.unit}</div>

                {cmdDecision === "none" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <button onClick={handleCmdApprove} data-testid="button-cmd-approve" style={{ padding: "9px", background: "var(--green)", color: "#000", border: "none", borderRadius: 7, fontFamily: MONO, fontSize: 11, fontWeight: 800, cursor: "pointer", letterSpacing: "0.06em" }}>
                      ✓ APPROVE — FORWARD TO ESO
                    </button>
                    <button onClick={handleCmdDisapprove} data-testid="button-cmd-disapprove" style={{ padding: "9px", background: "var(--red)", color: "#fff", border: "none", borderRadius: 7, fontFamily: MONO, fontSize: 11, fontWeight: 800, cursor: "pointer", letterSpacing: "0.06em" }}>
                      ✗ DISAPPROVE — DROP REQUEST
                    </button>
                  </div>
                )}

                {cmdDecision === "approved" && (
                  <div className="bd-in-up" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", background: "var(--greeng)", borderRadius: 7, border: "1px solid var(--greenb)" }}>
                    <CheckCircle size={13} color="var(--green)" />
                    <span style={{ fontSize: 11, fontFamily: MONO, fontWeight: 700, color: "var(--green)" }}>APPROVED — FORWARDED</span>
                  </div>
                )}

                {cmdDecision === "disapproved" && (
                  <div className="bd-in-up" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", background: "var(--redg)", borderRadius: 7, border: "1px solid var(--redb)" }}>
                      <AlertTriangle size={13} color="var(--red)" />
                      <span style={{ fontSize: 11, fontFamily: MONO, fontWeight: 700, color: "var(--red)" }}>DISAPPROVED — DROPPED</span>
                    </div>
                    <div style={{ fontSize: 10, color: "var(--mid)", lineHeight: 1.5 }}>
                      Request will not reach the ESO queue. Without CMGF, this creates zero institutional visibility.
                    </div>
                  </div>
                )}
              </div>
            )}

            {stage < 3 && (
              <div style={{ fontSize: 10, color: "var(--dim)", lineHeight: 1.5 }}>
                Commander must approve before the ESO can see this request. This gate is new under AR 621-5 WAVE 2.
              </div>
            )}
          </div>

          {/* Flow arrow: CMD → ESO (conditional) */}
          <FlowArrow
            active={stage >= 4 && cmdDecision === "approved"}
            blocked={stage >= 4 && cmdDecision === "disapproved"}
            color={cmdDecision === "disapproved" ? "var(--red)" : "var(--green)"}
            label={cmdDecision === "disapproved" ? "BLOCKED" : "→ ESO QUEUE"}
          />

          {/* Shadow signal note */}
          {stage >= 4 && cmdDecision === "disapproved" && (
            <div className="bd-in-up" style={{ background: "var(--bg2)", border: "1px dashed var(--border)", borderRadius: 10, padding: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
                {shadowVisible ? <Eye size={12} color="var(--purple)" /> : <EyeOff size={12} color="var(--dim)" />}
                <span style={{ fontSize: 9, fontFamily: MONO, color: "var(--purple)", letterSpacing: "0.1em", fontWeight: 700 }}>CMGF SHADOW SIGNAL</span>
              </div>
              <div style={{ fontSize: 10, color: "var(--dim)", lineHeight: 1.5, marginBottom: 8 }}>
                Without this tool: ESO sees nothing. Demand is invisible. A CMGF-informed system could log a count-only signal — no names, no details — so the institution knows demand existed.
              </div>
              <button onClick={() => setShadowVisible(v => !v)} data-testid="button-shadow-toggle" style={{ padding: "6px 12px", background: "none", border: "1px solid var(--purpleb)", borderRadius: 6, fontFamily: MONO, fontSize: 10, color: "var(--purple)", cursor: "pointer", letterSpacing: "0.06em" }}>
                {shadowVisible ? "HIDE SIGNAL" : "SHOW SHADOW SIGNAL →"}
              </button>
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
          {stage < 4 && (
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 28, textAlign: "center" }}>
              <Clock size={28} color="var(--dim)" style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 13, fontFamily: MONO, color: "var(--dim)", marginBottom: 6 }}>
                {stage < 3 ? "Awaiting classification & commander review…" : "Pending commander decision…"}
              </div>
              <div style={{ fontSize: 11, color: "var(--dim)", lineHeight: 1.5 }}>
                The ESO cannot see this request until the commander approves and forwards it. This is the WAVE 2 gate.
              </div>
            </div>
          )}

          {/* Disapproved — shadow signal panel */}
          {stage >= 4 && cmdDecision === "disapproved" && (
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
            <div className="bd-in-eso" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.1em", marginBottom: 10 }}>AI COMPLETED BEFORE ESO OPENED THIS</div>
              {["Pulled SM's TA balance from system", "Verified Troy University accreditation", "Cross-checked degree plan alignment", "Ran AR 621-5 compliance check", "Scored risk and generated recommendation"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 7 }}>
                  <CheckCircle size={11} color="var(--green)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: "var(--mid)", lineHeight: 1.4 }}>{item}</span>
                </div>
              ))}
              <div style={{ marginTop: 10, padding: "8px 12px", background: "var(--greeng)", borderRadius: 7, border: "1px solid var(--greenb)" }}>
                <span style={{ fontSize: 11, color: "var(--green)", fontWeight: 600 }}>{ESO.name}'s job: judgment — not research.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: "1px solid var(--border)", background: "var(--bg2)", padding: "14px 32px" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontFamily: MONO, color: "var(--dim)" }}>Profiles: Synthetic · No real SM data represented</span>
            <span style={{ fontSize: 11, fontFamily: MONO, color: "var(--dim)" }}>AI: Non-authoritative · Human-in-the-loop required</span>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <Link href="/research/multi-channel-demo"><span style={{ fontSize: 11, fontFamily: MONO, color: "var(--blue)", cursor: "pointer" }}>Multi-Channel Demo →</span></Link>
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
