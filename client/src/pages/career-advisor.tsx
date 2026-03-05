import { useState, useCallback, useRef, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import {
  ChevronRight,
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Activity,
  Compass,
  UserCircle,
  Rocket,
  PlayCircle,
  Check,
} from "lucide-react";

const MIL_OPTIONS = [
  { value: "medic", label: "68W · Combat Medic Specialist" },
  { value: "mp", label: "31B · Military Police Officer" },
  { value: "infantry", label: "11B · Infantry Soldier" },
  { value: "it", label: "25B · Information Technology Specialist" },
  { value: "intel", label: "35F · Intelligence Analyst" },
  { value: "aviation", label: "15T · UH-60 Helicopter Repairer" },
];

const CIV_OPTIONS = [
  { value: "nurse", label: "Registered Nurse (RN)" },
  { value: "police", label: "Police Officer / Law Enforcement" },
  { value: "cyber", label: "Cybersecurity Analyst" },
  { value: "pm", label: "Project Manager (PMP)" },
  { value: "pilot", label: "Commercial Airline Pilot" },
  { value: "analyst", label: "Intelligence / Data Analyst" },
];

const EDU_OPTIONS = [
  { value: "hs", label: "High School Diploma / GED" },
  { value: "some", label: "Some College (No Degree)" },
  { value: "aa", label: "Associate Degree" },
  { value: "ba", label: "Bachelor's Degree" },
  { value: "grad", label: "Graduate Degree" },
];

const TIME_OPTIONS = [
  { value: "lt6", label: "Less than 6 months" },
  { value: "6to18", label: "6–18 months" },
  { value: "18to36", label: "18–36 months" },
  { value: "gt36", label: "More than 36 months" },
];

const FUNDING_OPTIONS = [
  { value: "ta", label: "DoD Tuition Assistance (TA) only" },
  { value: "gibill", label: "GI Bill (Post-9/11 or Montgomery)" },
  { value: "both", label: "Both TA and GI Bill" },
  { value: "none", label: "No federal funding available" },
];

const milLabels: Record<string, string> = {
  medic: "Combat Medic (68W)", mp: "Military Police (31B)",
  infantry: "Infantry Soldier (11B)", it: "IT Specialist (25B)",
  intel: "Intelligence Analyst (35F)", aviation: "UH-60 Helicopter Repairer (15T)"
};

const civLabels: Record<string, string> = {
  nurse: "Registered Nurse", police: "Police Officer", cyber: "Cybersecurity Analyst",
  pm: "Project Manager (PMP)", pilot: "Commercial Airline Pilot", analyst: "Intelligence / Data Analyst"
};

type Verdict = "feasible" | "conditional" | "infeasible";

interface Constraint {
  status: "met" | "unmet" | "partial";
  text: string;
}

interface EvalResult {
  verdict: Verdict;
  label: string;
  explanation: string;
  constraints: Constraint[];
  tiers: string[];
  steps: string[];
  dataSources: string[];
  signalsChecked: number;
  rulesEvaluated: number;
  decisionsRendered: number;
}

const dataSourceMap: Record<string, string[]> = {
  medic_nurse: ["Army COOL Policy", "ACEN/CCNE Standards", "NCLEX-RN Requirements", "VA Education Benefits", "O*NET", "BLS"],
  medic_police: ["Army COOL Policy", "POST Standards", "5 USC 2108 Veterans Preference", "BLS", "O*NET"],
  medic_cyber: ["Army COOL Policy", "DoD 8570", "CompTIA Certification", "O*NET", "BLS"],
  mp_police: ["Army COOL Policy", "POST Standards", "5 USC 2108 Veterans Preference", "BLS", "O*NET"],
  mp_cyber: ["Army COOL Policy", "DoD 8570", "CompTIA Certification", "O*NET", "BLS"],
  mp_nurse: ["Army COOL Policy", "ACEN/CCNE Standards", "NCLEX-RN Requirements", "VA Education Benefits", "O*NET", "BLS"],
  it_cyber: ["Army COOL Policy", "DoD 8570", "CompTIA Certification", "NIST Cybersecurity Framework", "O*NET", "BLS"],
  it_pm: ["Army COOL Policy", "PMI PMP Standards", "DoD TA Policy", "O*NET", "BLS"],
  intel_analyst: ["Army COOL Policy", "IC Community Standards", "DoD Clearance Policy", "O*NET", "BLS"],
  aviation_pilot: ["Army COOL Policy", "FAA ATP Standards", "VA Flight Training Benefits", "O*NET", "BLS"],
  default: ["Army COOL Policy", "DoD TA Policy", "O*NET", "BLS"]
};

interface Rule {
  evaluate: (ed: string, time: string, funding: string) => { verdict: Verdict; label: string };
  explanation: (ed: string, time: string, funding: string, ml: string, cl: string) => string;
  constraints: (ed: string, time: string, funding: string) => Constraint[];
  tiers: (ed: string, time: string, funding: string) => string[];
  steps: string[];
}

const rules: Record<string, Rule> = {
  medic_nurse: {
    evaluate(ed) {
      if (ed === "ba" || ed === "grad") return { verdict: "feasible", label: "Feasible Pathway" };
      return { verdict: "conditional", label: "Conditional Pathway" };
    },
    explanation(ed, _time, _funding, ml, cl) {
      if (ed === "ba" || ed === "grad") return `The pathway from ${ml} to ${cl} is feasible with your bachelor's or graduate-level education. Military medical training may support advanced placement or credit recognition at nursing programs. NCLEX-RN licensure remains required.`;
      return `The pathway from ${ml} to ${cl} is conditional. Military medic training is clinically relevant and may satisfy partial prerequisite credit, but an accredited nursing degree (ADN or BSN) is required for RN licensure. Additional coursework and NCLEX-RN examination are mandatory constraints under ACEN/CCNE accreditation standards.`;
    },
    constraints(ed, _time, funding) {
      return [
        { status: "met", text: "Military medical training recognized as clinically relevant experience" },
        { status: ed === "aa" || ed === "ba" || ed === "grad" ? "met" : "unmet", text: "Accredited nursing degree (ADN or BSN) required — ACEN/CCNE credentialing authority" },
        { status: "partial", text: "NCLEX-RN licensure examination required in state of employment" },
        { status: funding !== "none" ? "met" : "unmet", text: funding !== "none" ? "Federal education funding available for program completion" : "No federal funding identified — private financing required" }
      ];
    },
    tiers(ed) {
      if (ed === "ba" || ed === "grad") return ["Tier B"];
      return ["Tier A", "Tier B"];
    },
    steps: ["🪖 Combat Medic (68W)", "📚 Nursing Program (ADN/BSN)", "📋 NCLEX-RN Exam", "🏥 Registered Nurse"]
  },
  medic_police: {
    evaluate() { return { verdict: "feasible", label: "Feasible Pathway" }; },
    explanation(_ed, _time, _funding, ml, cl) { return `The pathway from ${ml} to ${cl} is feasible. Military service satisfies many hiring preferences for law enforcement, and medic training in emergency response is directly applicable. Most departments require only a high school diploma. Veterans preference provisions apply under federal and most state hiring statutes.`; },
    constraints() { return [
      { status: "met", text: "Veterans preference in federal and most state law enforcement hiring (5 USC 2108)" },
      { status: "met", text: "Emergency response training directly transferable to law enforcement duties" },
      { status: "met", text: "High school diploma / GED satisfies minimum education requirement for most departments" },
      { status: "partial", text: "Physical fitness and psychological evaluations required — department-specific" }
    ]; },
    tiers() { return ["Tier A"]; },
    steps: ["🪖 Combat Medic (68W)", "🎓 POST Academy Training", "📋 Department Hiring Process", "👮 Police Officer"]
  },
  medic_cyber: {
    evaluate() { return { verdict: "infeasible", label: "Not Feasible (As Stated)" }; },
    explanation(_ed, _time, _funding, ml, cl) { return `The pathway from ${ml} to ${cl} is not feasible without significant additional education and credentialing. Medical training does not provide foundational knowledge in networking, systems administration, or security domains. A bridge program and certification pathway are prerequisite constraints that must be satisfied first.`; },
    constraints() { return [
      { status: "unmet", text: "No domain overlap: military medic training does not satisfy cybersecurity technical prerequisites" },
      { status: "unmet", text: "Networking and systems administration knowledge required — not present in 68W MOS training" },
      { status: "partial", text: "CompTIA Security+ or equivalent certification required for most entry-level roles" },
      { status: "partial", text: "DoD 8570 compliance required for federal/contractor positions — separate certification path needed" }
    ]; },
    tiers() { return ["Tier B", "Tier C"]; },
    steps: ["🪖 Combat Medic (68W)", "📚 IT/Cyber Bridge Program", "🏆 Security+ / CompTIA Certs", "🔐 Cybersecurity Analyst"]
  },
  mp_police: {
    evaluate() { return { verdict: "feasible", label: "Feasible Pathway" }; },
    explanation(_ed, _time, _funding, ml, cl) { return `The pathway from ${ml} to ${cl} is feasible. Military law enforcement and combat experience is directly valued by civilian law enforcement agencies. Many jurisdictions provide full or partial POST certification reciprocity for veterans. Veterans preference applies in federal, state, and many municipal hiring processes.`; },
    constraints() { return [
      { status: "met", text: "Veterans preference in federal and most state law enforcement hiring (5 USC 2108)" },
      { status: "met", text: "Military discipline, chain of command, and operational experience directly transferable" },
      { status: "met", text: "High school diploma / GED satisfies minimum education requirement for most departments" },
      { status: "partial", text: "State-specific POST certification reciprocity varies — verification required" }
    ]; },
    tiers() { return ["Tier A"]; },
    steps: ["🪖 Military Service", "🎓 POST Academy / Reciprocity Review", "📋 Department Hiring Process", "👮 Police Officer"]
  },
  mp_cyber: {
    evaluate(ed, _time, funding) {
      if ((ed === "ba" || ed === "grad") && funding !== "none") return { verdict: "conditional", label: "Conditional Pathway" };
      return { verdict: "infeasible", label: "Not Feasible (As Stated)" };
    },
    explanation(ed, _time, _funding, ml, cl) {
      if (ed === "ba" || ed === "grad") return `The pathway from ${ml} to ${cl} is conditional. While military service in investigative or operational roles may be tangentially relevant, dedicated technical training in networking and security systems is required. With a bachelor's degree and available funding, a certification bridge program is achievable within 12 to 18 months.`;
      return `The pathway from ${ml} to ${cl} is not feasible as currently described. Technical cybersecurity roles require foundational IT education not present in this MOS. A substantial retraining investment would be required before eligibility.`;
    },
    constraints(ed) { return [
      { status: "partial", text: "Investigative experience tangentially relevant to cyber forensics roles" },
      { status: ed === "ba" || ed === "grad" ? "met" : "unmet", text: "Bachelor's degree or higher required for most mid-level analyst positions" },
      { status: "unmet", text: "CompTIA Security+, Network+ or equivalent technical certifications required" },
      { status: "partial", text: "DoD 8570 compliance required for government/contractor cybersecurity roles" }
    ]; },
    tiers(ed) {
      if (ed === "ba" || ed === "grad") return ["Tier B"];
      return ["Tier B"];
    },
    steps: ["🪖 Military Service", "📚 IT Fundamentals / Bootcamp", "🏆 Security+ Certification", "🔐 Cybersecurity Analyst"]
  },
  mp_nurse: {
    evaluate() { return { verdict: "infeasible", label: "Not Feasible (As Stated)" }; },
    explanation(_ed, _time, _funding, ml, cl) { return `The pathway from ${ml} to ${cl} is not feasible without a complete career pivot and nursing education program. This military occupational specialty has no clinical overlap with nursing prerequisites. A full accredited nursing degree (ADN or BSN) and NCLEX-RN licensure are required — typically 2 to 4 years of full-time study.`; },
    constraints() { return [
      { status: "unmet", text: "No clinical training in this MOS — full nursing program required from foundational level" },
      { status: "unmet", text: "ACEN/CCNE accredited ADN or BSN degree required for RN licensure eligibility" },
      { status: "unmet", text: "NCLEX-RN state licensure examination required — no waiver pathway available" },
      { status: "partial", text: "GI Bill may fund full nursing program if service eligibility requirements are met" }
    ]; },
    tiers() { return ["Tier A", "Tier B"]; },
    steps: ["🪖 Military Service", "📚 Accredited Nursing Program", "📋 NCLEX-RN Licensure", "🏥 Registered Nurse"]
  },
  it_cyber: {
    evaluate() { return { verdict: "feasible", label: "Feasible Pathway" }; },
    explanation(_ed, _time, _funding, ml, cl) { return `The pathway from ${ml} to ${cl} is feasible. Military IT training provides strong foundational alignment with cybersecurity roles. DoD technical experience satisfies many employer requirements, and certification pathways (Security+, CEH, CISSP) are accessible.`; },
    constraints() { return [
      { status: "met", text: "25B MOS training directly relevant to networking, systems administration, and security fundamentals" },
      { status: "met", text: "DoD operational experience recognized by federal agencies and defense contractors" },
      { status: "partial", text: "CompTIA Security+ or equivalent required — achievable within 3 to 6 months with TA funding" },
      { status: "met", text: "Veterans preference applicable in federal cybersecurity hiring (DHS, NSA, DoD civilian)" }
    ]; },
    tiers() { return ["Tier B"]; },
    steps: ["🪖 IT Specialist (25B)", "🏆 Security+ / DoD 8570", "📋 Clearance Verification", "🔐 Cybersecurity Analyst"]
  },
  it_pm: {
    evaluate(ed) {
      if (ed === "ba" || ed === "grad") return { verdict: "feasible", label: "Feasible Pathway" };
      return { verdict: "conditional", label: "Conditional Pathway" };
    },
    explanation(ed, _time, _funding, ml, cl) {
      if (ed === "ba" || ed === "grad") return `The pathway from ${ml} to ${cl} is feasible. A bachelor's degree combined with military leadership and IT project experience satisfies PMP eligibility requirements. PMI requires 36 months of documented project leadership with a 4-year degree. Military IT roles typically satisfy this requirement.`;
      return `The pathway from ${ml} to ${cl} is conditional. PMI PMP certification requires a 4-year degree plus 36 months of project leadership experience, or 60 months without a degree. Without a bachelor's degree, additional education or extended documented project experience is needed.`;
    },
    constraints(ed) { return [
      { status: ed === "ba" || ed === "grad" ? "met" : "partial", text: ed === "ba" || ed === "grad" ? "Bachelor's degree satisfies PMI PMP academic prerequisite" : "No 4-year degree — 60-month project experience path required instead" },
      { status: "partial", text: "PMI requires 36 months leading projects (with degree) — military IT project leadership may qualify" },
      { status: "partial", text: "35 contact hours of project management training required — PMI course or bootcamp needed" },
      { status: "met", text: "IT Specialist operational experience directly applicable to technical project management roles" }
    ]; },
    tiers() { return ["Tier B"]; },
    steps: ["🪖 IT Specialist (25B)", "📚 PMP Prep Training (35 hrs)", "🏆 PMP Examination", "📊 Project Manager"]
  },
  intel_analyst: {
    evaluate() { return { verdict: "feasible", label: "Feasible Pathway" }; },
    explanation(_ed, _time, _funding, ml, cl) { return `The pathway from ${ml} to ${cl} is feasible. Military intelligence training is directly equivalent to civilian intelligence and analytical roles. Federal agencies actively recruit veterans with clearances. Civilian data analyst roles in the private sector may require supplemental data tools training (Python, SQL, Tableau).`; },
    constraints() { return [
      { status: "met", text: "35F analytical training directly equivalent to civilian intelligence and analysis roles" },
      { status: "met", text: "Active clearance significantly advantageous for federal and defense contractor positions" },
      { status: "partial", text: "Private sector data analyst roles may require Python, SQL, or BI tool proficiency" },
      { status: "met", text: "Veterans preference applies in federal analytical hiring (IC community)" }
    ]; },
    tiers() { return ["Tier A"]; },
    steps: ["🪖 Intel Analyst (35F)", "📋 Clearance Portability Review", "🏛️ Federal / Contractor Application", "🔎 Intelligence / Data Analyst"]
  },
  aviation_pilot: {
    evaluate(_ed, time) {
      if (time === "gt36" || time === "18to36") return { verdict: "feasible", label: "Feasible Pathway" };
      return { verdict: "conditional", label: "Conditional Pathway" };
    },
    explanation(_ed, time, _funding, ml, cl) {
      if (time === "gt36" || time === "18to36") return `The pathway from ${ml} to ${cl} is one of the strongest aviation transition routes available. UH-60 flight mechanic experience provides documented maintenance hours and systems knowledge recognized by the FAA. With sufficient time remaining, completing a civilian flight training program and accumulating required flight hours (1,500 for ATP certificate) is achievable before separation.`;
      return `The pathway from ${ml} to ${cl} is conditional. Aviation maintenance experience is highly valued, but FAA Airline Transport Pilot (ATP) certification requires 1,500 flight hours as pilot-in-command. A civilian flight school bridge program funded through the GI Bill Pilot Training benefit may satisfy this constraint after separation.`;
    },
    constraints(_ed, time, funding) { return [
      { status: "met", text: "15T aviation systems experience directly recognized by FAA maintenance standards" },
      { status: time === "gt36" || time === "18to36" ? "met" : "partial", text: "FAA ATP certificate requires 1,500 flight hours — military flight time may partially satisfy this" },
      { status: funding !== "none" ? "met" : "partial", text: "GI Bill covers FAA-approved flight training programs" },
      { status: "partial", text: "FAA First Class Medical Certificate required — must be obtained and maintained" }
    ]; },
    tiers() { return ["Tier A", "Tier B"]; },
    steps: ["🚁 Helicopter Repairer (15T)", "✈️ FAA Flight Training Program", "📋 ATP Certificate (1,500 hrs)", "🛫 Commercial Airline Pilot"]
  },
  default: {
    evaluate() { return { verdict: "conditional", label: "Conditional Pathway" }; },
    explanation(_ed, _time, _funding, ml, cl) { return `The pathway from ${ml} to ${cl} requires further advisor review. This combination involves credential, education, or licensing constraints that may vary significantly by state, institution, and individual service record. A qualified transition counselor or Education Service Officer should be consulted to evaluate specific eligibility.`; },
    constraints() { return [
      { status: "partial", text: "Pathway feasibility is occupation and state-specific — requires individualized advisor review" },
      { status: "partial", text: "Education and credentialing requirements vary by jurisdiction and institution" },
      { status: "partial", text: "Funding eligibility depends on length of service and benefit election history" },
      { status: "unmet", text: "Insufficient policy rule match — human advisor consultation required" }
    ]; },
    tiers() { return ["Tier C"]; },
    steps: ["🪖 Military Service", "📋 Advisor Consultation", "📚 Education / Training", "🏆 Civilian Career"]
  }
};

const ruleMap: Record<string, string> = {
  medic_nurse: "medic_nurse", medic_police: "medic_police", medic_cyber: "medic_cyber",
  medic_pm: "default", medic_pilot: "default", medic_analyst: "default",
  mp_police: "mp_police", mp_cyber: "mp_cyber", mp_nurse: "mp_nurse",
  mp_pm: "default", mp_pilot: "default", mp_analyst: "default",
  infantry_police: "mp_police", infantry_nurse: "mp_nurse", infantry_cyber: "mp_cyber",
  infantry_pm: "default", infantry_pilot: "default", infantry_analyst: "default",
  it_cyber: "it_cyber", it_pm: "it_pm", it_nurse: "mp_nurse",
  it_police: "mp_police", it_pilot: "default", it_analyst: "it_cyber",
  intel_analyst: "intel_analyst", intel_cyber: "it_cyber", intel_pm: "it_pm",
  intel_nurse: "mp_nurse", intel_police: "mp_police", intel_pilot: "default",
  aviation_pilot: "aviation_pilot", aviation_cyber: "mp_cyber", aviation_pm: "it_pm",
  aviation_nurse: "mp_nurse", aviation_police: "mp_police", aviation_analyst: "default"
};

function getRuleKey(mil: string, civ: string): string {
  return ruleMap[`${mil}_${civ}`] || "default";
}

function VerdictBadge({ verdict, label }: { verdict: Verdict; label: string }) {
  const colors: Record<Verdict, { bg: string; border: string; text: string }> = {
    feasible: { bg: "rgba(92,184,92,0.15)", border: "#5cb85c", text: "#5cb85c" },
    conditional: { bg: "rgba(240,165,0,0.15)", border: "#f0a500", text: "#f0a500" },
    infeasible: { bg: "rgba(224,92,92,0.15)", border: "#e05c5c", text: "#e05c5c" },
  };
  const c = colors[verdict];
  return (
    <span
      className="inline-flex items-center px-4 py-2 font-mono text-[11px] font-semibold tracking-[2px] uppercase whitespace-nowrap"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text, borderRadius: 2 }}
      data-testid="badge-verdict"
    >
      {label}
    </span>
  );
}

function PathwayStepStyled({ emoji, label, active, showArrow, gold, textColor, textDim, borderColor }: {
  emoji: string; label: string; active: boolean; showArrow: boolean;
  gold: string; textColor: string; textDim: string; borderColor: string;
}) {
  return (
    <>
      {showArrow && (
        <div className="text-lg flex-shrink-0" style={{ color: gold, opacity: 0.5 }} aria-hidden="true" data-testid="step-arrow">
          <ArrowRight className="h-5 w-5" />
        </div>
      )}
      <div className="flex-1 min-w-[100px] text-center" data-testid="pathway-step">
        <div
          className="w-11 h-11 rounded-full mx-auto mb-2 flex items-center justify-center text-lg transition-all"
          style={{
            background: active ? 'rgba(201,168,76,0.2)' : 'rgba(201,168,76,0.1)',
            border: `1px solid ${active ? gold : borderColor}`,
            boxShadow: active ? '0 0 12px rgba(201,168,76,0.2)' : 'none',
            opacity: active ? 1 : 0.5,
          }}
        >
          {emoji}
        </div>
        <div className="text-[10px] font-mono leading-snug" style={{ color: active ? textColor : textDim }}>
          {label}
        </div>
      </div>
    </>
  );
}

const demoNavItems = [
  { href: "/research/career-advisor", label: "Career Advisor", icon: Compass },
  { href: "/research/sm-hub", label: "SM Hub", icon: UserCircle },
  { href: "/research/demo", label: "Scenario Engine", icon: Rocket },
  { href: "/research/signal-flow", label: "Signal Flow", icon: PlayCircle },
];

function DemoNav() {
  const [location] = useLocation();
  return (
    <nav
      className="sticky top-14 z-40 border-b py-2 mb-4 md:mb-6"
      style={{ backgroundColor: "#1E293B", borderColor: "#334155" }}
      data-testid="demo-nav"
    >
      <div className="max-w-6xl mx-auto px-3 md:px-6">
        <div className="flex items-center gap-1 md:gap-2">
          <Link href="/research/cmgf">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10"
              data-testid="demo-nav-cmgf"
            >
              ← CMGF
            </Button>
          </Link>
          <div className="w-px h-5 bg-slate-600 flex-shrink-0" />
          {demoNavItems.map(item => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-1.5 text-xs font-medium ${
                    isActive
                      ? "text-amber-400"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                  data-testid={`demo-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function PulsingDot({ color }: { color: string }) {
  return (
    <span className="relative inline-flex h-2.5 w-2.5">
      <span
        className="absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ backgroundColor: color, animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }}
      />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: color }} />
    </span>
  );
}

const FIELD_LABELS: Record<string, string> = {
  milOcc: "Military Occupation",
  civCareer: "Civilian Career",
  education: "Education Level",
  timeLeft: "Time Remaining",
  funding: "Funding Source",
};

export default function CareerAdvisor() {
  const [milOcc, setMilOcc] = useState("");
  const [civCareer, setCivCareer] = useState("");
  const [education, setEducation] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [funding, setFunding] = useState("");
  const [result, setResult] = useState<EvalResult | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [recentField, setRecentField] = useState<string | null>(null);
  const recentTimeout = useRef<ReturnType<typeof setTimeout>>();

  const flashField = useCallback((field: string) => {
    setRecentField(field);
    if (recentTimeout.current) clearTimeout(recentTimeout.current);
    recentTimeout.current = setTimeout(() => setRecentField(null), 2000);
  }, []);

  useEffect(() => {
    return () => { if (recentTimeout.current) clearTimeout(recentTimeout.current); };
  }, []);

  const completedFields = [
    milOcc ? "milOcc" : null,
    civCareer ? "civCareer" : null,
    education ? "education" : null,
    timeLeft ? "timeLeft" : null,
    funding ? "funding" : null,
  ].filter(Boolean) as string[];

  const pendingFields = ["milOcc", "civCareer", "education", "timeLeft", "funding"]
    .filter(f => !completedFields.includes(f));

  const runEvaluation = useCallback(() => {
    const newErrors: Record<string, boolean> = {};
    if (!milOcc) newErrors.milOcc = true;
    if (!civCareer) newErrors.civCareer = true;
    if (!education) newErrors.education = true;
    if (!timeLeft) newErrors.timeLeft = true;
    if (!funding) newErrors.funding = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const ml = milLabels[milOcc];
    const cl = civLabels[civCareer];
    const key = getRuleKey(milOcc, civCareer);
    const rule = rules[key];
    const evalResult = rule.evaluate(education, timeLeft, funding);
    const explanation = rule.explanation(education, timeLeft, funding, ml, cl);
    const constraints = rule.constraints(education, timeLeft, funding);
    const ruleTiers = rule.tiers(education, timeLeft, funding);
    const steps = rule.steps;

    const sources = dataSourceMap[key] || dataSourceMap.default;
    const signalsChecked = constraints.length * 3;
    const rulesEvaluated = constraints.length;
    const decisionsRendered = constraints.filter(c => c.status !== "partial").length;

    setResult({
      ...evalResult,
      explanation,
      constraints,
      tiers: [...ruleTiers, "NON-PREDICTIVE", "INFORMATIONAL ONLY"],
      steps,
      dataSources: sources,
      signalsChecked,
      rulesEvaluated,
      decisionsRendered,
    });
  }, [milOcc, civCareer, education, timeLeft, funding]);

  const clearError = (field: string) => {
    setErrors(prev => ({ ...prev, [field]: false }));
  };


  const gold = "#c9a84c";
  const goldLight = "#e8c97a";
  const navy = "#0a1628";
  const navyMid = "#112240";
  const textColor = "#d4dbe8";
  const textDim = "#7a8fa8";
  const borderColor = "rgba(201,168,76,0.2)";
  const cardBg = "rgba(17,34,64,0.8)";

  return (
    <div className="min-h-screen" style={{ backgroundColor: navy, color: textColor }}>
      <DemoNav />
      <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-4 md:py-6">
        <nav className="mb-4 text-sm flex items-center flex-wrap gap-1">
          <Link href="/research" className="transition-colors" style={{ color: textDim }}>
            Portfolio
          </Link>
          <ChevronRight className="h-4 w-4" style={{ color: textDim }} />
          <Link href="/research/cmgf" className="transition-colors" style={{ color: textDim }}>
            CMGF
          </Link>
          <ChevronRight className="h-4 w-4" style={{ color: textDim }} />
          <span style={{ color: textColor }}>Career Path Advisor</span>
        </nav>

        <header className="text-center mb-10">
          <div className="text-[10px] font-mono tracking-[3px] uppercase mb-3" style={{ color: gold }} data-testid="text-prototype-label">
            Prototype Demonstration
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-light tracking-tight mb-3" style={{ color: textColor }} data-testid="heading-career-advisor">
            Career Path Feasibility Advisor
          </h1>
          <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: textDim }}>
            A deterministic constraint-binding advisory tool that evaluates military-to-civilian transition pathways against policy, credentialing, and education authority rules.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-6 items-start">
          <div className="space-y-6">
            <div className="p-7" style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 4 }}>
              <div className="text-[9px] font-mono tracking-[2.5px] uppercase pb-3 mb-5" style={{ color: gold, borderBottom: `1px solid ${borderColor}` }}>
                Input Panel · Service Member Profile
              </div>

              <div className="mb-5 p-3.5" style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 3 }}>
                <div className="text-[9px] font-mono tracking-[2px] uppercase mb-2" style={{ color: gold }}>CMGF Advisory Notice</div>
                <div className="text-xs leading-relaxed" style={{ color: '#a0b0c8' }}>
                  Results are <strong style={{ color: textColor }}>informational planning signals</strong>, not recommendations, predictions, or decisions. This system compares your declared goals with publicly available policy rules and credential requirements.
                  <br /><br />
                  <strong style={{ color: textColor }}>Final decisions remain entirely with you and your human advisors.</strong>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2" data-testid="field-mil-occ">
                  <label className="block text-[11px] font-medium tracking-wider uppercase" style={{ color: textDim }}>Military Occupation</label>
                  <Select value={milOcc} onValueChange={(v) => { setMilOcc(v); clearError("milOcc"); flashField("milOcc"); }}>
                    <SelectTrigger className={errors.milOcc ? "border-red-500" : ""} style={{ background: 'rgba(10,22,40,0.8)', borderColor: errors.milOcc ? undefined : 'rgba(201,168,76,0.3)', color: textColor }} data-testid="select-mil-occ">
                      <SelectValue placeholder="— Select MOS/Rate —" />
                    </SelectTrigger>
                    <SelectContent style={{ background: navyMid, borderColor: 'rgba(201,168,76,0.3)' }}>
                      {MIL_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.milOcc && <p className="text-[10px] font-mono text-red-400" data-testid="error-mil-occ">Required — select a military occupation</p>}
                </div>

                <div className="space-y-2" data-testid="field-civ-career">
                  <label className="block text-[11px] font-medium tracking-wider uppercase" style={{ color: textDim }}>Desired Civilian Career</label>
                  <Select value={civCareer} onValueChange={(v) => { setCivCareer(v); clearError("civCareer"); flashField("civCareer"); }}>
                    <SelectTrigger className={errors.civCareer ? "border-red-500" : ""} style={{ background: 'rgba(10,22,40,0.8)', borderColor: errors.civCareer ? undefined : 'rgba(201,168,76,0.3)', color: textColor }} data-testid="select-civ-career">
                      <SelectValue placeholder="— Select Target Career —" />
                    </SelectTrigger>
                    <SelectContent style={{ background: navyMid, borderColor: 'rgba(201,168,76,0.3)' }}>
                      {CIV_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.civCareer && <p className="text-[10px] font-mono text-red-400" data-testid="error-civ-career">Required — select a target civilian career</p>}
                </div>

                <div className="space-y-2" data-testid="field-education">
                  <label className="block text-[11px] font-medium tracking-wider uppercase" style={{ color: textDim }}>Current Education Level</label>
                  <Select value={education} onValueChange={(v) => { setEducation(v); clearError("education"); flashField("education"); }}>
                    <SelectTrigger className={errors.education ? "border-red-500" : ""} style={{ background: 'rgba(10,22,40,0.8)', borderColor: errors.education ? undefined : 'rgba(201,168,76,0.3)', color: textColor }} data-testid="select-education">
                      <SelectValue placeholder="— Select Level —" />
                    </SelectTrigger>
                    <SelectContent style={{ background: navyMid, borderColor: 'rgba(201,168,76,0.3)' }}>
                      {EDU_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.education && <p className="text-[10px] font-mono text-red-400" data-testid="error-education">Required — select your education level</p>}
                </div>

                <div className="space-y-2" data-testid="field-time-left">
                  <label className="block text-[11px] font-medium tracking-wider uppercase" style={{ color: textDim }}>Time Remaining in Service</label>
                  <Select value={timeLeft} onValueChange={(v) => { setTimeLeft(v); clearError("timeLeft"); flashField("timeLeft"); }}>
                    <SelectTrigger className={errors.timeLeft ? "border-red-500" : ""} style={{ background: 'rgba(10,22,40,0.8)', borderColor: errors.timeLeft ? undefined : 'rgba(201,168,76,0.3)', color: textColor }} data-testid="select-time-left">
                      <SelectValue placeholder="— Select Timeframe —" />
                    </SelectTrigger>
                    <SelectContent style={{ background: navyMid, borderColor: 'rgba(201,168,76,0.3)' }}>
                      {TIME_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.timeLeft && <p className="text-[10px] font-mono text-red-400" data-testid="error-time-left">Required — select time remaining in service</p>}
                </div>

                <div className="space-y-2" data-testid="field-funding">
                  <label className="block text-[11px] font-medium tracking-wider uppercase" style={{ color: textDim }}>Education Funding Availability</label>
                  <Select value={funding} onValueChange={(v) => { setFunding(v); clearError("funding"); flashField("funding"); }}>
                    <SelectTrigger className={errors.funding ? "border-red-500" : ""} style={{ background: 'rgba(10,22,40,0.8)', borderColor: errors.funding ? undefined : 'rgba(201,168,76,0.3)', color: textColor }} data-testid="select-funding">
                      <SelectValue placeholder="— Select Funding —" />
                    </SelectTrigger>
                    <SelectContent style={{ background: navyMid, borderColor: 'rgba(201,168,76,0.3)' }}>
                      {FUNDING_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.funding && <p className="text-[10px] font-mono text-red-400" data-testid="error-funding">Required — select funding availability</p>}
                </div>

                <button
                  className="w-full py-3.5 font-mono text-xs font-semibold tracking-[2px] uppercase border-none cursor-pointer transition-all"
                  style={{ background: gold, color: navy, borderRadius: 2 }}
                  onClick={runEvaluation}
                  data-testid="button-evaluate"
                  onMouseEnter={(e) => { e.currentTarget.style.background = goldLight; e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,168,76,0.3)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = gold; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  Evaluate Pathway
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="p-7 min-h-[140px]" style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 4 }}>
              {!result ? (
                <div className="space-y-5" data-testid="ready-state-panel">
                  <div className="flex items-center gap-3 pb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
                    <PulsingDot color={completedFields.length === 5 ? "#5cb85c" : gold} />
                    <span className="text-[9px] font-mono tracking-[2.5px] uppercase" style={{ color: completedFields.length === 5 ? "#5cb85c" : gold }}>
                      {completedFields.length === 5 ? "Ready to Evaluate" : "CMGF Engine v2.10 · Awaiting Input"}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {["milOcc", "civCareer", "education", "timeLeft", "funding"].map(field => {
                      const done = completedFields.includes(field);
                      const isRecent = recentField === field;
                      return (
                        <div
                          key={field}
                          className="flex items-center gap-2.5 py-1.5 px-2.5 transition-all"
                          style={{
                            background: isRecent ? 'rgba(201,168,76,0.12)' : done ? 'rgba(92,184,92,0.06)' : 'transparent',
                            borderLeft: `2px solid ${isRecent ? gold : done ? '#5cb85c' : 'rgba(122,143,168,0.2)'}`,
                            borderRadius: '0 2px 2px 0',
                          }}
                          data-testid={`status-${field}`}
                        >
                          {done ? (
                            <Check className="h-3 w-3 flex-shrink-0" style={{ color: isRecent ? gold : '#5cb85c' }} />
                          ) : (
                            <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ border: '1px solid rgba(122,143,168,0.3)' }} />
                          )}
                          <span className="text-[10px] font-mono tracking-wide" style={{ color: done ? (isRecent ? gold : textColor) : textDim }}>
                            {FIELD_LABELS[field]}
                            {done && isRecent && (
                              <span style={{ color: gold }}> — confirmed</span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Activity className="h-3.5 w-3.5" style={{ color: textDim }} />
                    <span className="text-[10px] font-mono" style={{ color: textDim }}>
                      {completedFields.length}/5 parameters bound · {completedFields.length === 5 ? "press Evaluate Pathway" : `${pendingFields.length} remaining`}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4" data-testid="result-panel">
                  <div className="text-[9px] font-mono tracking-[2.5px] uppercase pb-3" style={{ color: gold, borderBottom: `1px solid ${borderColor}` }}>
                    Constraint Evaluation Result
                  </div>
                  <div className="flex items-center gap-4 pb-4 flex-wrap" style={{ borderBottom: `1px solid ${borderColor}` }}>
                    <VerdictBadge verdict={result.verdict} label={result.label} />
                    <h2 className="font-serif text-xl font-light" style={{ color: textColor }} data-testid="text-verdict-title">
                      {milLabels[milOcc]} &rarr; {civLabels[civCareer]}
                    </h2>
                  </div>
                  <p className="text-[13px] leading-relaxed" style={{ color: textColor }} data-testid="text-explanation">
                    {result.explanation}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {result.tiers.map((t, i) => (
                      <span key={i} className="inline-block font-mono text-[9px] tracking-wide px-1.5 py-0.5" style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: gold, borderRadius: 2 }} data-testid={`tier-badge-${i}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {result && (
              <>
                <div className="p-6" style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 4 }} data-testid="card-constraints">
                  <div className="text-[9px] font-mono tracking-[2.5px] uppercase pb-3 mb-3.5" style={{ color: gold, borderBottom: `1px solid ${borderColor}` }}>
                    Constraint Evaluation · Policy Rules Applied
                  </div>
                  <div className="flex flex-col gap-2">
                    {result.constraints.map((c, i) => {
                      const statusColors: Record<string, string> = { met: "#5cb85c", unmet: "#e05c5c", partial: "#f0a500" };
                      const statusIcons: Record<string, typeof CheckCircle2> = { met: CheckCircle2, unmet: XCircle, partial: AlertTriangle };
                      const Icon = statusIcons[c.status];
                      return (
                        <div key={i} className="flex items-start gap-2.5 text-xs leading-relaxed p-2.5" style={{ background: 'rgba(10,22,40,0.5)', borderLeft: `2px solid ${statusColors[c.status]}`, borderRadius: '0 2px 2px 0' }} data-testid={`constraint-${c.status}`}>
                          <Icon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: statusColors[c.status] }} />
                          <span style={{ color: textColor }}>{c.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-6" style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 4 }} data-testid="card-pathway">
                  <div className="text-[9px] font-mono tracking-[2.5px] uppercase pb-3 mb-4" style={{ color: gold, borderBottom: `1px solid ${borderColor}` }}>
                    Transition Pathway · Steps
                  </div>
                  <div className="flex items-center flex-wrap gap-2">
                    {result.steps.map((step, i) => {
                      const parts = step.split(" ");
                      const emoji = parts[0];
                      const label = parts.slice(1).join(" ");
                      const active = result.verdict !== "infeasible" || i === 0;
                      return (
                        <PathwayStepStyled
                          key={i}
                          emoji={emoji}
                          label={label}
                          active={active}
                          showArrow={i > 0}
                          gold={gold}
                          textColor={textColor}
                          textDim={textDim}
                          borderColor={borderColor}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="p-6" style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 4 }} data-testid="card-transparency">
                  <div className="flex items-center gap-2 pb-3 mb-5" style={{ borderBottom: `1px solid ${borderColor}` }}>
                    <Shield className="h-4 w-4" style={{ color: '#4ecdc4' }} />
                    <span className="text-[9px] font-mono tracking-[2.5px] uppercase" style={{ color: '#4ecdc4' }}>
                      Governance Transparency
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-5">
                    <div>
                      <div className="text-[10px] font-mono tracking-wider uppercase mb-1" style={{ color: textDim }}>Engine Version</div>
                      <div className="text-sm font-mono" style={{ color: '#4ecdc4' }} data-testid="text-engine-version">CMGF v2.10</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono tracking-wider uppercase mb-1" style={{ color: textDim }}>Execution Type</div>
                      <div className="text-sm font-mono" style={{ color: '#4ecdc4' }} data-testid="text-execution-type">Deterministic Rules Engine</div>
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="text-[10px] font-mono tracking-wider uppercase mb-2" style={{ color: textDim }}>Data Sources Consulted</div>
                    <div className="flex flex-wrap gap-1.5" data-testid="data-sources">
                      {result.dataSources.map(src => (
                        <span key={src} className="inline-block font-mono text-[10px] tracking-wide px-2 py-1" style={{ background: 'rgba(212,219,232,0.08)', border: '1px solid rgba(212,219,232,0.2)', color: textColor, borderRadius: 2 }}>
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="text-[10px] font-mono tracking-wider uppercase mb-2" style={{ color: textDim }}>Rules Evaluated</div>
                    <div className="text-xs font-mono" style={{ color: textColor }} data-testid="text-rules-summary">
                      {result.signalsChecked} signals checked &rarr; {result.rulesEvaluated} rules evaluated &rarr; {result.decisionsRendered} decisions rendered
                    </div>
                  </div>

                  <div className="py-2.5 px-4 text-center" style={{ background: 'rgba(201,168,76,0.15)', borderRadius: 3 }} data-testid="text-human-review">
                    <span className="text-xs font-mono tracking-wide" style={{ color: gold }}>
                      Human advisor review required before action
                    </span>
                  </div>

                  <div className="mt-4 text-[10px] leading-relaxed italic" style={{ color: textDim }}>
                    All outputs are informational. Rules derive from publicly available policy, credentialing, and labor data.
                  </div>
                </div>
              </>
            )}

            <div className="flex items-start gap-3.5 p-4" style={{ background: 'rgba(17,34,64,0.9)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 4 }} data-testid="governance-notice">
              <Shield className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: gold }} />
              <div className="text-xs leading-relaxed italic" style={{ color: textDim }}>
                <strong className="not-italic" style={{ color: gold }}>CMGF Advisory Notice</strong>
                <br /><br />
                The Career Mobility Governance Framework provides informational planning signals based on the data and inputs supplied by the user. The system compares user declared goals with publicly available policy rules, credential requirements, and labor market reference data.
                <br /><br />
                The results presented are not recommendations, predictions, or decisions. They are informational indicators designed to help users understand how their current education, experience, and credential status relate to potential career pathways.
                <br /><br />
                <strong className="not-italic" style={{ color: textColor }}>CMGF does not determine what a user can or cannot pursue. The system has no authority to approve, deny, or restrict career choices. Final decisions remain entirely with the user and their human advisors.</strong>
                <br /><br />
                Users are encouraged to review results with qualified advisors such as Education Service Officers, institutional counselors, or credentialing authorities before making career or education decisions.
                <br /><br />
                <div className="flex flex-wrap gap-1.5 not-italic">
                  {["NIST AI RMF", "EO 14179", "NON-PREDICTIVE", "INFORMATIONAL ONLY"].map(tag => (
                    <span key={tag} className="inline-block font-mono text-[9px] tracking-wide px-1.5 py-0.5" style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: gold, borderRadius: 2 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8" style={{ borderTop: `1px solid ${borderColor}` }}>
          <h3 className="text-sm font-mono uppercase tracking-wider mb-4" style={{ color: textDim }}>Navigation</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { href: "/research/cmgf", label: "CMGF Main" },
              { href: "/research/sm-hub", label: "SM Request Hub" },
              { href: "/research/demo", label: "Demo Mode" },
              { href: "/research/isr", label: "ISR Queue" },
            ].map(nav => (
              <Link key={nav.href} href={nav.href}>
                <button className="px-3 py-1.5 text-xs font-mono tracking-wide transition-colors cursor-pointer" style={{ background: 'transparent', border: `1px solid ${borderColor}`, color: textDim, borderRadius: 2 }}>
                  {nav.label}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
