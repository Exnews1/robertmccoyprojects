import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle, ChevronRight, Shield, GraduationCap, Brain, Clock, AlertTriangle, FileText } from "lucide-react";

const MONO = "'JetBrains Mono', monospace";
const SERIF = "Merriweather, Georgia, serif";

const THEME = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Merriweather:wght@400;700&display=swap');
  [data-bd] { font-family: 'Inter', -apple-system, sans-serif; }
  [data-bd] {
    --bg:#060a12; --bg2:#0c1220; --card:#111827; --text:#eaf0f8;
    --mid:#8b9bb5; --dim:#4a5a72; --border:#1c2740; --blit:#2a3f6e;
    --gold:#c9a84c; --goldg:rgba(201,168,76,0.12); --goldb:rgba(201,168,76,0.25);
    --blue:#4d94ff; --blueg:rgba(77,148,255,0.10); --blueb:rgba(77,148,255,0.25);
    --green:#22c55e; --greeng:rgba(34,197,94,0.10); --greenb:rgba(34,197,94,0.25);
    --amber:#ffb020; --red:#ff4d6a;
    background:#060a12; color:#eaf0f8;
  }
  @keyframes bd-in  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes bd-pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
  @keyframes bd-flow { 0%{transform:translateY(0)} 100%{transform:translateY(-60px)} }
  @keyframes bd-glow { 0%,100%{box-shadow:0 0 0px rgba(201,168,76,0)} 50%{box-shadow:0 0 18px rgba(201,168,76,0.4)} }
  @keyframes bd-slide-r { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
  @keyframes bd-slide-l { from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:translateX(0)} }
  .bd-in-sm  { animation: bd-slide-r 0.45s ease forwards; }
  .bd-in-eso { animation: bd-slide-l 0.45s ease forwards; }
  .bd-in-up  { animation: bd-in 0.4s ease forwards; }
`;

const SM_PROFILE = {
  name: "SGT Maria T. Chen",
  rank: "E-5", mos: "68W — Health Care Specialist",
  station: "Fort Campbell, KY",
  credits: 54, goal: "B.S. Healthcare Administration",
  taBalance: 3250,
  course: {
    code: "HLTH 301", title: "Health Policy & Law",
    school: "Troy University", credits: 3, cost: 750,
    start: "April 14, 2026",
  },
};

const ESO_PROFILE = {
  name: "SFC James R. Okafor",
  title: "Education Services Officer",
  station: "Fort Campbell Education Center",
  queueCount: 17,
};

const AI_STEPS = [
  { label: "Identity verification", detail: "E-5 rank confirmed · DOD ID matched" },
  { label: "TA eligibility check", detail: "$3,250 of $4,000 remaining (FY2026)" },
  { label: "Degree-plan alignment", detail: "HLTH 301 maps to B.S. Healthcare Admin — confirmed" },
  { label: "AR 621-5 compliance", detail: "No prior recoupment · No suspension flags" },
  { label: "Institutional validation", detail: "Troy University · TA-eligible · SACSCOC accredited" },
  { label: "Channel routing", detail: "ESO Standard Review — no commander escalation required" },
  { label: "Risk scoring", detail: "Risk index: 0.12 (LOW) · Recommendation: APPROVE" },
];

const STEPS = [
  { id: 0, label: "Roles Introduced",   cue: "Introduce SGT Chen and SFC Okafor — two communities, one shared event." },
  { id: 1, label: "SM Submits Request", cue: "SGT Chen submits a TA request for HLTH 301. The signal enters the system." },
  { id: 2, label: "AI Classification",  cue: "The CMGF engine runs seven checks in sequence — no human involved yet." },
  { id: 3, label: "ESO Queue Updates",  cue: "SFC Okafor's inbox updates. The AI analysis is already done when he opens it." },
  { id: 4, label: "Decision & Notify",  cue: "SFC Okafor approves. SGT Chen receives notification. The loop closes." },
];

export default function BridgeDemo() {
  const [stage, setStage] = useState(0);
  const [aiIdx, setAiIdx] = useState(-1);
  const [aiDone, setAiDone] = useState(false);
  const [esoDismissed, setEsoDismissed] = useState(false);

  useEffect(() => {
    if (stage !== 2) return;
    setAiIdx(-1);
    setAiDone(false);
    let i = 0;
    const tick = () => {
      setAiIdx(i);
      i++;
      if (i < AI_STEPS.length) {
        setTimeout(tick, 420);
      } else {
        setTimeout(() => setAiDone(true), 600);
      }
    };
    setTimeout(tick, 300);
  }, [stage]);

  const advance = () => {
    if (stage === 2 && !aiDone) return;
    setStage(s => Math.min(s + 1, 4));
  };

  const reset = () => {
    setStage(0); setAiIdx(-1); setAiDone(false); setEsoDismissed(false);
  };

  const cur = STEPS[Math.min(stage, STEPS.length - 1)];
  const advanceable = stage < 4 && (stage !== 2 || aiDone);
  const sm = SM_PROFILE;
  const eso = ESO_PROFILE;

  return (
    <div data-bd style={{ minHeight: "100vh" }}>
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
        <div style={{ marginLeft: "auto", fontSize: 10, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.08em" }}>CMGF ARCHITECTURE SERIES · 2026</div>
      </div>

      {/* ── HEADER ── */}
      <div style={{ padding: "28px 32px 20px", borderBottom: "1px solid var(--border)", background: "linear-gradient(180deg, var(--bg2) 0%, var(--bg) 100%)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--gold)", letterSpacing: "0.14em", marginBottom: 7 }}>CMGF · DUAL-LENS DEMONSTRATION</div>
              <h1 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, margin: 0, lineHeight: 1.2, color: "var(--text)" }}>The Request Seen Twice</h1>
              <p style={{ color: "var(--mid)", margin: "8px 0 0", fontSize: 13, lineHeight: 1.6, maxWidth: 580 }}>
                One tuition assistance request. Two communities. One AI mediation layer. Watch the same event through the Service Member's eyes and the ESO's eyes — simultaneously.
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
              const done = stage > i;
              const active = stage === i;
              return (
                <div key={s.id} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "5px 12px",
                    borderRadius: 20, fontSize: 11, fontFamily: MONO, fontWeight: 600, letterSpacing: "0.05em", whiteSpace: "nowrap", transition: "all 0.3s",
                    background: active ? "var(--gold)" : done ? "var(--goldg)" : "transparent",
                    color: active ? "#000" : done ? "var(--gold)" : "var(--dim)",
                    border: done ? "1px solid var(--goldb)" : "1px solid transparent",
                  }}>
                    {done ? <CheckCircle size={11} /> : <span style={{ width: 13, height: 13, borderRadius: "50%", background: active ? "#000" : "var(--dim)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: active ? "var(--gold)" : "var(--bg)" }}>{i}</span>}
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
      <div style={{ background: "rgba(201,168,76,0.06)", borderBottom: "1px solid var(--goldb)", padding: "11px 32px", display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ flex: 1, maxWidth: 1240, margin: "0 auto", display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--gold)", letterSpacing: "0.1em", flexShrink: 0 }}>PRESENTER CUE</div>
          <div style={{ fontSize: 13, color: "var(--mid)", flex: 1 }} className="bd-in-up" key={stage}>{cur.cue}</div>
          <button
            onClick={advance}
            disabled={!advanceable}
            style={{
              padding: "9px 22px", borderRadius: 7, fontFamily: MONO, fontSize: 12, fontWeight: 700, letterSpacing: "0.07em",
              cursor: advanceable ? "pointer" : "default", transition: "all 0.25s", flexShrink: 0,
              background: advanceable ? "var(--gold)" : "var(--border)",
              color: advanceable ? "#000" : "var(--dim)",
              border: "none", opacity: advanceable ? 1 : 0.5,
            }}
            data-testid="button-advance-step"
          >
            {stage === 0 ? "START DEMO →" : stage === 4 ? "COMPLETE ✓" : stage === 2 && !aiDone ? "AI PROCESSING…" : "NEXT STEP →"}
          </button>
        </div>
      </div>

      {/* ── 3-COLUMN LAYOUT ── */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 24px 48px", display: "grid", gridTemplateColumns: "1fr 200px 1fr", gap: 20, alignItems: "start" }}>

        {/* ══ LEFT: SERVICE MEMBER ══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--blue)", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 2 }}>SERVICE MEMBER VIEW</div>

          {/* Profile card */}
          <div style={{ background: "var(--card)", border: "1px solid var(--blueb)", borderRadius: 12, padding: 18, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--blue)", borderRadius: "12px 12px 0 0" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: "var(--blueg)", border: "1px solid var(--blueb)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <GraduationCap size={22} color="var(--blue)" />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", lineHeight: 1.2 }}>{sm.name}</div>
                <div style={{ fontSize: 11, fontFamily: MONO, color: "var(--blue)", marginTop: 2 }}>{sm.rank} · {sm.mos}</div>
                <div style={{ fontSize: 11, color: "var(--mid)" }}>{sm.station}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                ["Credits Earned", sm.credits + " hrs"], ["Degree Goal", sm.goal],
                ["TA Balance (FY26)", "$" + sm.taBalance.toLocaleString()], ["Status", "Active Duty"],
              ].map(([k, v]) => (
                <div key={k} style={{ background: "var(--bg2)", borderRadius: 7, padding: "8px 10px" }}>
                  <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.08em", marginBottom: 3 }}>{k}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Request card */}
          <div style={{ background: "var(--card)", border: `1px solid ${stage >= 3 && stage <= 4 ? "var(--goldb)" : "var(--blueb)"}`, borderRadius: 12, padding: 18, position: "relative", overflow: "hidden", transition: "border-color 0.4s" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: stage >= 1 ? "var(--blue)" : "var(--border)", transition: "background 0.4s", borderRadius: "12px 12px 0 0" }} />
            <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.1em", marginBottom: 12 }}>TUITION ASSISTANCE REQUEST</div>

            {[
              ["Course", `${sm.course.code} — ${sm.course.title}`],
              ["Institution", sm.course.school],
              ["Credit Hours", sm.course.credits + " hrs"],
              ["Cost", "$" + sm.course.cost],
              ["Start Date", sm.course.start],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 11, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.04em" }}>{k}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{v}</span>
              </div>
            ))}

            <div style={{ marginTop: 14 }}>
              {stage === 0 && (
                <button onClick={advance} style={{ width: "100%", padding: "11px", background: "var(--blue)", color: "#fff", border: "none", borderRadius: 8, fontFamily: MONO, fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer" }} data-testid="button-sm-submit">
                  SUBMIT REQUEST →
                </button>
              )}
              {stage === 1 && (
                <div className="bd-in-up" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(77,148,255,0.08)", borderRadius: 8, border: "1px solid var(--blueb)" }}>
                  <Clock size={14} color="var(--blue)" style={{ animation: "bd-pulse 1.4s infinite" }} />
                  <span style={{ fontSize: 12, fontFamily: MONO, color: "var(--blue)", fontWeight: 600 }}>Submitted — awaiting AI classification…</span>
                </div>
              )}
              {stage === 2 && (
                <div className="bd-in-up" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(201,168,76,0.07)", borderRadius: 8, border: "1px solid var(--goldb)" }}>
                  <Brain size={14} color="var(--gold)" style={{ animation: "bd-pulse 1s infinite" }} />
                  <span style={{ fontSize: 12, fontFamily: MONO, color: "var(--gold)", fontWeight: 600 }}>CMGF engine processing…</span>
                </div>
              )}
              {stage === 3 && (
                <div className="bd-in-up" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(201,168,76,0.07)", borderRadius: 8, border: "1px solid var(--goldb)" }}>
                  <Clock size={14} color="var(--gold)" />
                  <span style={{ fontSize: 12, fontFamily: MONO, color: "var(--gold)", fontWeight: 600 }}>In ESO review queue…</span>
                </div>
              )}
              {stage === 4 && (
                <div className="bd-in-up" style={{ display: "flex", flexDirection: "column", gap: 8, padding: "14px", background: "rgba(34,197,94,0.07)", borderRadius: 8, border: "1px solid var(--greenb)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle size={16} color="var(--green)" />
                    <span style={{ fontSize: 13, fontFamily: MONO, fontWeight: 800, color: "var(--green)" }}>REQUEST APPROVED</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--mid)", lineHeight: 1.5 }}>
                    HLTH 301 approved by SFC Okafor. $750 TA funded. Enrollment confirmation sent to Troy University.
                  </div>
                  <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--dim)" }}>
                    Approved: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · ISR logged · Audit record created
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SM status tracker */}
          {stage >= 1 && (
            <div className="bd-in-sm" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.1em", marginBottom: 12 }}>REQUEST TRACKER</div>
              {[
                { label: "Submitted", done: stage >= 1 },
                { label: "AI Classification", done: stage >= 3 },
                { label: "ESO Review", done: stage >= 4 },
                { label: "Decision & Notification", done: stage >= 4 },
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: t.done ? "var(--green)" : "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.4s" }}>
                    {t.done ? <CheckCircle size={11} color="#000" /> : <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--dim)", display: "block" }} />}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: t.done ? 600 : 400, color: t.done ? "var(--text)" : "var(--dim)", transition: "color 0.4s" }}>{t.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ══ CENTER: AI BRIDGE ══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 20 }}>
          <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--gold)", letterSpacing: "0.12em", fontWeight: 700, textAlign: "center" }}>AI MEDIATION</div>

          {/* Bridge header */}
          <div style={{ background: "var(--card)", border: "1px solid var(--goldb)", borderRadius: 12, padding: 16, textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--gold)", borderRadius: "12px 12px 0 0" }} />
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--goldg)", border: "1px solid var(--goldb)", display: "flex", alignItems: "center", justifyContent: "center", margin: "6px auto 10px", animation: stage === 2 ? "bd-glow 1.2s infinite" : "none" }}>
              <Brain size={20} color="var(--gold)" />
            </div>
            <div style={{ fontSize: 11, fontFamily: MONO, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.06em" }}>CMGF ENGINE</div>
            <div style={{ fontSize: 10, color: "var(--dim)", marginTop: 4 }}>Non-authoritative AI</div>
          </div>

          {/* Flow arrow — SM to bridge */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
            <div style={{ width: 2, height: 20, background: stage >= 1 ? "var(--blue)" : "var(--border)", transition: "background 0.5s" }} />
            <div style={{ fontSize: 10, fontFamily: MONO, color: stage >= 1 ? "var(--blue)" : "var(--dim)", padding: "4px 8px", borderRadius: 5, background: stage >= 1 ? "var(--blueg)" : "transparent", border: stage >= 1 ? "1px solid var(--blueb)" : "1px solid transparent", transition: "all 0.4s", textAlign: "center", letterSpacing: "0.06em" }}>
              SM REQUEST
            </div>
            <div style={{ width: 2, height: 20, background: stage >= 1 ? "var(--blue)" : "var(--border)", transition: "background 0.5s" }} />
          </div>

          {/* Classification steps */}
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 7 }}>
            <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.1em", marginBottom: 4 }}>CLASSIFICATION PIPELINE</div>
            {AI_STEPS.map((s, i) => {
              const done = aiIdx >= i;
              const active = aiIdx === i && !aiDone;
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7, opacity: stage < 2 ? 0.3 : 1, transition: "opacity 0.3s" }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: done ? "var(--green)" : active ? "var(--gold)" : "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, transition: "background 0.3s", animation: active ? "bd-pulse 0.8s infinite" : "none" }}>
                    {done && !active && <CheckCircle size={10} color="#000" />}
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: done ? "var(--text)" : "var(--dim)", transition: "color 0.3s", lineHeight: 1.3 }}>{s.label}</div>
                    {done && <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--dim)", lineHeight: 1.4, marginTop: 2 }}>{s.detail}</div>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Risk score — shown when done */}
          {aiDone && (
            <div className="bd-in-up" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid var(--greenb)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.1em", marginBottom: 6 }}>AI RECOMMENDATION</div>
              <div style={{ fontSize: 18, fontFamily: MONO, fontWeight: 900, color: "var(--green)", letterSpacing: "0.06em" }}>APPROVE</div>
              <div style={{ fontSize: 10, color: "var(--mid)", marginTop: 4 }}>Risk 0.12 · LOW</div>
            </div>
          )}

          {/* Flow arrow — bridge to ESO */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
            <div style={{ width: 2, height: 20, background: stage >= 3 ? "var(--green)" : "var(--border)", transition: "background 0.5s" }} />
            <div style={{ fontSize: 10, fontFamily: MONO, color: stage >= 3 ? "var(--green)" : "var(--dim)", padding: "4px 8px", borderRadius: 5, background: stage >= 3 ? "var(--greeng)" : "transparent", border: stage >= 3 ? "1px solid var(--greenb)" : "1px solid transparent", transition: "all 0.4s", textAlign: "center", letterSpacing: "0.06em" }}>
              TO ESO QUEUE
            </div>
            <div style={{ width: 2, height: 20, background: stage >= 3 ? "var(--green)" : "var(--border)", transition: "background 0.5s" }} />
          </div>

          {/* AR 621-5 compliance note */}
          <div style={{ background: "rgba(255,176,32,0.05)", border: "1px solid rgba(255,176,32,0.2)", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--amber)", letterSpacing: "0.1em", marginBottom: 4 }}>AR 621-5 WAVE 2</div>
            <div style={{ fontSize: 10, color: "var(--mid)", lineHeight: 1.5 }}>Commander approval not required — no escalation trigger on this request.</div>
          </div>
        </div>

        {/* ══ RIGHT: ESO ══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--green)", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 2 }}>ESO VIEW</div>

          {/* ESO profile */}
          <div style={{ background: "var(--card)", border: "1px solid var(--greenb)", borderRadius: 12, padding: 18, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--green)", borderRadius: "12px 12px 0 0" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: "var(--greeng)", border: "1px solid var(--greenb)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Shield size={22} color="var(--green)" />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", lineHeight: 1.2 }}>{eso.name}</div>
                <div style={{ fontSize: 11, fontFamily: MONO, color: "var(--green)", marginTop: 2 }}>{eso.title}</div>
                <div style={{ fontSize: 11, color: "var(--mid)" }}>{eso.station}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1, background: "var(--bg2)", borderRadius: 7, padding: "8px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--dim)", marginBottom: 3 }}>QUEUE</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: stage >= 3 ? "var(--amber)" : "var(--text)", fontFamily: MONO, transition: "color 0.4s" }}>
                  {stage >= 3 ? eso.queueCount + 1 : eso.queueCount}
                </div>
              </div>
              <div style={{ flex: 1, background: "var(--bg2)", borderRadius: 7, padding: "8px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--dim)", marginBottom: 3 }}>AI PRE-CLEARED</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "var(--green)", fontFamily: MONO }}>14</div>
              </div>
              <div style={{ flex: 1, background: "var(--bg2)", borderRadius: 7, padding: "8px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--dim)", marginBottom: 3 }}>FLAGGED</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "var(--red)", fontFamily: MONO }}>3</div>
              </div>
            </div>
          </div>

          {/* ESO Queue — locked until stage 3 */}
          {stage < 3 && (
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 28, textAlign: "center" }}>
              <Clock size={28} color="var(--dim)" style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 13, fontFamily: MONO, color: "var(--dim)" }}>Awaiting AI classification…</div>
              <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 6 }}>SFC Okafor's queue updates when the engine completes analysis.</div>
            </div>
          )}

          {/* New request highlight — stage 3+ */}
          {stage >= 3 && (
            <div className="bd-in-eso" style={{ background: "var(--card)", border: "2px solid var(--green)", borderRadius: 12, padding: 18, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--green)", borderRadius: "12px 12px 0 0" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", animation: stage < 4 ? "bd-pulse 1s infinite" : "none" }} />
                  <span style={{ fontSize: 10, fontFamily: MONO, color: "var(--green)", fontWeight: 700, letterSpacing: "0.1em" }}>NEW REQUEST</span>
                </div>
                <span style={{ fontSize: 10, fontFamily: MONO, color: "var(--dim)" }}>AI ANALYSIS COMPLETE</span>
              </div>

              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>{sm.name}</div>
              <div style={{ fontSize: 11, fontFamily: MONO, color: "var(--mid)", marginBottom: 12 }}>{sm.rank} · {sm.mos}</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                {[
                  ["Requested", `${sm.course.code} — ${sm.course.title}`],
                  ["Institution", sm.course.school],
                  ["Cost", "$" + sm.course.cost],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 11, fontFamily: MONO, color: "var(--dim)" }}>{k}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text)" }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* AI analysis panel */}
              <div style={{ background: "var(--bg2)", borderRadius: 9, padding: 14, marginBottom: 14 }}>
                <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--gold)", letterSpacing: "0.1em", marginBottom: 10 }}>AI PRE-ANALYSIS — CMGF ENGINE</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                  {[
                    ["Eligibility", "CONFIRMED", "var(--green)"],
                    ["Risk Score", "0.12 · LOW", "var(--green)"],
                    ["AR 621-5", "Compliant", "var(--green)"],
                    ["Recommendation", "APPROVE", "var(--green)"],
                  ].map(([k, v, c]) => (
                    <div key={k} style={{ background: "var(--card)", borderRadius: 7, padding: "8px 10px" }}>
                      <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--dim)", marginBottom: 3 }}>{k}</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: c as string, fontFamily: MONO }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.08em", marginBottom: 6 }}>SUPPORTING FINDINGS</div>
                {AI_STEPS.slice(0, 5).map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7, marginBottom: 5 }}>
                    <CheckCircle size={10} color="var(--green)" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div style={{ fontSize: 10, color: "var(--mid)", lineHeight: 1.4 }}>{s.detail}</div>
                  </div>
                ))}
              </div>

              {/* Decision controls */}
              {stage === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontSize: 10, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.08em", marginBottom: 2 }}>ESO DECISION</div>
                  <button onClick={advance} style={{ padding: "11px", background: "var(--green)", color: "#000", border: "none", borderRadius: 8, fontFamily: MONO, fontSize: 12, fontWeight: 800, letterSpacing: "0.07em", cursor: "pointer" }} data-testid="button-eso-approve">
                    ✓ APPROVE REQUEST
                  </button>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <button style={{ padding: "9px", background: "none", border: "1px solid var(--border)", borderRadius: 8, fontFamily: MONO, fontSize: 11, color: "var(--mid)", cursor: "pointer", letterSpacing: "0.06em" }} data-testid="button-eso-hold">
                      REQUEST INFO
                    </button>
                    <button style={{ padding: "9px", background: "none", border: "1px solid rgba(255,176,32,0.3)", borderRadius: 8, fontFamily: MONO, fontSize: 11, color: "var(--amber)", cursor: "pointer", letterSpacing: "0.06em" }} data-testid="button-eso-escalate">
                      ESCALATE
                    </button>
                  </div>
                </div>
              )}

              {stage === 4 && (
                <div className="bd-in-up" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "rgba(34,197,94,0.08)", borderRadius: 8, border: "1px solid var(--greenb)" }}>
                  <CheckCircle size={18} color="var(--green)" />
                  <div>
                    <div style={{ fontSize: 12, fontFamily: MONO, fontWeight: 800, color: "var(--green)" }}>APPROVED BY SFC OKAFOR</div>
                    <div style={{ fontSize: 10, color: "var(--mid)", marginTop: 3 }}>ISR logged · Audit record created · SM notified</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* What ESO DOESN'T need to do */}
          {stage >= 3 && (
            <div className="bd-in-eso" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 9, fontFamily: MONO, color: "var(--dim)", letterSpacing: "0.1em", marginBottom: 10 }}>AI COMPLETED BEFORE ESO OPENED THIS</div>
              {[
                "Pulled SM's TA balance from system", "Verified Troy University accreditation",
                "Cross-checked degree plan alignment", "Ran AR 621-5 compliance check", "Scored risk and generated recommendation",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 7 }}>
                  <CheckCircle size={11} color="var(--green)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: "var(--mid)", lineHeight: 1.4 }}>{item}</span>
                </div>
              ))}
              <div style={{ marginTop: 10, padding: "8px 12px", background: "var(--greeng)", borderRadius: 7, border: "1px solid var(--greenb)" }}>
                <span style={{ fontSize: 11, color: "var(--green)", fontWeight: 600 }}>SFC Okafor's job: judgment — not research.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── FOOTER NOTE ── */}
      <div style={{ borderTop: "1px solid var(--border)", background: "var(--bg2)", padding: "16px 32px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
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
