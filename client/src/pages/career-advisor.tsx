import { useState, useCallback, useRef, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DemoNav } from "@/components/demo-nav";
import { Link } from "wouter";
import {
  ChevronRight,
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Activity,
  Check,
  GraduationCap,
  Briefcase,
  TrendingUp,
  MapPin,
  DollarSign,
  Users,
  AlertCircle,
  BarChart3,
  Clock,
  FileText,
  Sun,
  Moon,
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

type AdvisorMode = "education" | "tap";

const TAP_CAREER_FIELDS = [
  {
    field: "Healthcare",
    roles: ["Registered Nurse", "Health Administrator", "EMT / Paramedic"],
    medianSalary: "$58K–$82K",
    demandTrend: "+18% (2024–2030)",
    credentialGap: "Licensure (NCLEX, state cert)",
    veteranSuccess: "74%",
    painPoints: ["Credential transfer delays", "Clinical hour requirements", "State licensure variation"],
    tapAlignment: "HIGH",
    blsCode: "29-1141",
  },
  {
    field: "Law Enforcement / Public Safety",
    roles: ["Police Officer", "Federal Agent", "Corrections Officer"],
    medianSalary: "$52K–$78K",
    demandTrend: "+7% (2024–2030)",
    credentialGap: "POST Academy (often waived for vets)",
    veteranSuccess: "86%",
    painPoints: ["Agency-specific requirements", "Mental health screening", "Geographic preferences"],
    tapAlignment: "HIGH",
    blsCode: "33-3051",
  },
  {
    field: "Cybersecurity / IT",
    roles: ["SOC Analyst", "Penetration Tester", "Cloud Security Engineer"],
    medianSalary: "$75K–$115K",
    demandTrend: "+33% (2024–2030)",
    credentialGap: "CompTIA Security+ / CISSP / DoD 8570",
    veteranSuccess: "61%",
    painPoints: ["Certification cost", "Clearance transfer timing", "Civilian experience gap"],
    tapAlignment: "MODERATE",
    blsCode: "15-1212",
  },
  {
    field: "Project Management",
    roles: ["Project Manager (PMP)", "Operations Manager", "Program Analyst"],
    medianSalary: "$68K–$105K",
    demandTrend: "+6% (2024–2030)",
    credentialGap: "PMP Certification (PMI)",
    veteranSuccess: "72%",
    painPoints: ["PMP exam cost", "Civilian project terminology", "Industry-specific knowledge"],
    tapAlignment: "MODERATE",
    blsCode: "11-9199",
  },
  {
    field: "Skilled Trades / Logistics",
    roles: ["HVAC Technician", "Electrician", "CDL Driver", "Supply Chain"],
    medianSalary: "$45K–$72K",
    demandTrend: "+12% (2024–2030)",
    credentialGap: "Apprenticeship / trade license",
    veteranSuccess: "82%",
    painPoints: ["Union entry requirements", "Apprenticeship duration", "Regional wage variance"],
    tapAlignment: "HIGH",
    blsCode: "49-9021",
  },
];

const TAP_VETERAN_INSIGHTS = [
  { question: "What was your biggest barrier to civilian employment?", topAnswer: "Translating military experience to civilian terms", pct: "47%" },
  { question: "How long did it take to find stable employment?", topAnswer: "3–6 months after separation", pct: "38%" },
  { question: "Did TAP adequately prepare you?", topAnswer: "Partially — needed more industry-specific guidance", pct: "54%" },
  { question: "Would AI-assisted career advising have helped?", topAnswer: "Strongly agree", pct: "78%" },
  { question: "What would you tell someone about to transition?", topAnswer: "Start credentialing 18+ months before ETS", pct: "63%" },
];

const TAP_TIMELINE = [
  { phase: "24–18 months", label: "Discovery", desc: "Career exploration, salary research, credential mapping", color: "#4ecdc4" },
  { phase: "18–12 months", label: "Planning", desc: "Education pathway selection, funding application, mentor matching", color: "#c9a84c" },
  { phase: "12–6 months", label: "Preparation", desc: "Coursework, certification exams, resume development", color: "#f0a500" },
  { phase: "6–0 months", label: "Execution", desc: "Job applications, interviews, employer connections", color: "#e05c5c" },
  { phase: "Post-ETS", label: "Stabilization", desc: "Employment verification, ongoing support, outcome tracking", color: "#8b5cf6" },
];

export default function CareerAdvisor() {
  const [mode, setMode] = useState<AdvisorMode>("education");
  const [milOcc, setMilOcc] = useState("");
  const [civCareer, setCivCareer] = useState("");
  const [education, setEducation] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [funding, setFunding] = useState("");
  const [result, setResult] = useState<EvalResult | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [recentField, setRecentField] = useState<string | null>(null);
  const recentTimeout = useRef<ReturnType<typeof setTimeout>>();
  const [tapExpandedField, setTapExpandedField] = useState<string | null>(null);
  const [lightMode, setLightMode] = useState(false);

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


  const gold = lightMode ? "#8b6914" : "#c9a84c";
  const goldLight = lightMode ? "#b8892a" : "#e8c97a";
  const navy = lightMode ? "#f5f3ef" : "#0a1628";
  const navyMid = lightMode ? "#eae6df" : "#112240";
  const textColor = lightMode ? "#1a1a1a" : "#d4dbe8";
  const textDim = lightMode ? "#5a6572" : "#7a8fa8";
  const borderColor = lightMode ? "rgba(139,105,20,0.2)" : "rgba(201,168,76,0.2)";
  const cardBg = lightMode ? "rgba(255,255,255,0.85)" : "rgba(17,34,64,0.8)";
  const inputBg = lightMode ? "rgba(245,243,239,0.9)" : "rgba(10,22,40,0.8)";
  const inputBorder = lightMode ? "rgba(139,105,20,0.3)" : "rgba(201,168,76,0.3)";
  const subtleBg = lightMode ? "rgba(245,243,239,0.6)" : "rgba(10,22,40,0.5)";
  const greenCol = lightMode ? "#2d8a2d" : "#5cb85c";
  const tealCol = lightMode ? "#2a9d8f" : "#4ecdc4";
  const purpleCol = lightMode ? "#7c3aed" : "#8b5cf6";
  const purpleBg = lightMode ? "rgba(124,58,237,0.08)" : "rgba(139,92,246,0.08)";
  const purpleBorder = lightMode ? "rgba(124,58,237,0.25)" : "rgba(139,92,246,0.25)";
  const goldBg = lightMode ? "rgba(139,105,20,0.07)" : "rgba(201,168,76,0.07)";
  const goldBorder = lightMode ? "rgba(139,105,20,0.25)" : "rgba(201,168,76,0.25)";

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
          <button
            onClick={() => setLightMode(v => !v)}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono tracking-wider uppercase cursor-pointer transition-all"
            style={{ background: lightMode ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)", border: `1px solid ${borderColor}`, borderRadius: 3, color: textDim }}
            data-testid="button-light-toggle"
          >
            {lightMode ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
            {lightMode ? "Dark" : "Light"}
          </button>
        </nav>

        <header className="text-center mb-10">
          <div className="text-[10px] font-mono tracking-[3px] uppercase mb-3" style={{ color: gold }} data-testid="text-prototype-label">
            Prototype Demonstration
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-light tracking-tight mb-3" style={{ color: textColor }} data-testid="heading-career-advisor">
            Career Path Feasibility Advisor
          </h1>
          <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: textDim }}>
            {mode === "education"
              ? "A deterministic constraint-binding advisory tool that evaluates military-to-civilian transition pathways against policy, credentialing, and education authority rules."
              : "Explore career fields, salary ranges, credential requirements, and transition outcomes — informed by veteran experience and labor market data."}
          </p>

          <div className="flex justify-center mt-6" data-testid="mode-toggle">
            <div className="inline-flex rounded-sm overflow-hidden" style={{ border: `1px solid ${borderColor}` }}>
              <button
                onClick={() => setMode("education")}
                className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-mono tracking-[1.5px] uppercase transition-all cursor-pointer border-none"
                style={{
                  background: mode === "education" ? "rgba(201,168,76,0.2)" : "transparent",
                  color: mode === "education" ? gold : textDim,
                  borderRight: `1px solid ${borderColor}`,
                }}
                data-testid="button-mode-education"
              >
                <GraduationCap className="h-3.5 w-3.5" />
                Education Sandbox
              </button>
              <button
                onClick={() => setMode("tap")}
                className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-mono tracking-[1.5px] uppercase transition-all cursor-pointer border-none"
                style={{
                  background: mode === "tap" ? `${purpleCol}33` : "transparent",
                  color: mode === "tap" ? purpleCol : textDim,
                }}
                data-testid="button-mode-tap"
              >
                <Briefcase className="h-3.5 w-3.5" />
                TAP Sandbox
              </button>
            </div>
          </div>
        </header>

        {mode === "education" ? (
        <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-6 items-start">
          <div className="space-y-6">
            <div className="p-7" style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 4 }}>
              <div className="text-[9px] font-mono tracking-[2.5px] uppercase pb-3 mb-5" style={{ color: gold, borderBottom: `1px solid ${borderColor}` }}>
                Input Panel · Service Member Profile
              </div>

              <div className="mb-5 p-3.5" style={{ background: goldBg, border: `1px solid ${goldBorder}`, borderRadius: 3 }}>
                <div className="text-[9px] font-mono tracking-[2px] uppercase mb-2" style={{ color: gold }}>CMGF Advisory Notice</div>
                <div className="text-xs leading-relaxed" style={{ color: textDim }}>
                  Results are <strong style={{ color: textColor }}>informational planning signals</strong>, not recommendations, predictions, or decisions. This system compares your declared goals with publicly available policy rules and credential requirements.
                  <br /><br />
                  <strong style={{ color: textColor }}>Final decisions remain entirely with you and your human advisors.</strong>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2" data-testid="field-mil-occ">
                  <label className="block text-[11px] font-medium tracking-wider uppercase" style={{ color: textDim }}>Military Occupation</label>
                  <Select value={milOcc} onValueChange={(v) => { setMilOcc(v); clearError("milOcc"); flashField("milOcc"); }}>
                    <SelectTrigger className={errors.milOcc ? "border-red-500" : ""} style={{ background: inputBg, borderColor: errors.milOcc ? undefined : inputBorder, color: textColor }} data-testid="select-mil-occ">
                      <SelectValue placeholder="— Select MOS/Rate —" />
                    </SelectTrigger>
                    <SelectContent style={{ background: navyMid, borderColor: inputBorder }}>
                      {MIL_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.milOcc && <p className="text-[10px] font-mono text-red-400" data-testid="error-mil-occ">Required — select a military occupation</p>}
                </div>

                <div className="space-y-2" data-testid="field-civ-career">
                  <label className="block text-[11px] font-medium tracking-wider uppercase" style={{ color: textDim }}>Desired Civilian Career</label>
                  <Select value={civCareer} onValueChange={(v) => { setCivCareer(v); clearError("civCareer"); flashField("civCareer"); }}>
                    <SelectTrigger className={errors.civCareer ? "border-red-500" : ""} style={{ background: inputBg, borderColor: errors.civCareer ? undefined : inputBorder, color: textColor }} data-testid="select-civ-career">
                      <SelectValue placeholder="— Select Target Career —" />
                    </SelectTrigger>
                    <SelectContent style={{ background: navyMid, borderColor: inputBorder }}>
                      {CIV_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.civCareer && <p className="text-[10px] font-mono text-red-400" data-testid="error-civ-career">Required — select a target civilian career</p>}
                </div>

                <div className="space-y-2" data-testid="field-education">
                  <label className="block text-[11px] font-medium tracking-wider uppercase" style={{ color: textDim }}>Current Education Level</label>
                  <Select value={education} onValueChange={(v) => { setEducation(v); clearError("education"); flashField("education"); }}>
                    <SelectTrigger className={errors.education ? "border-red-500" : ""} style={{ background: inputBg, borderColor: errors.education ? undefined : inputBorder, color: textColor }} data-testid="select-education">
                      <SelectValue placeholder="— Select Level —" />
                    </SelectTrigger>
                    <SelectContent style={{ background: navyMid, borderColor: inputBorder }}>
                      {EDU_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.education && <p className="text-[10px] font-mono text-red-400" data-testid="error-education">Required — select your education level</p>}
                </div>

                <div className="space-y-2" data-testid="field-time-left">
                  <label className="block text-[11px] font-medium tracking-wider uppercase" style={{ color: textDim }}>Time Remaining in Service</label>
                  <Select value={timeLeft} onValueChange={(v) => { setTimeLeft(v); clearError("timeLeft"); flashField("timeLeft"); }}>
                    <SelectTrigger className={errors.timeLeft ? "border-red-500" : ""} style={{ background: inputBg, borderColor: errors.timeLeft ? undefined : inputBorder, color: textColor }} data-testid="select-time-left">
                      <SelectValue placeholder="— Select Timeframe —" />
                    </SelectTrigger>
                    <SelectContent style={{ background: navyMid, borderColor: inputBorder }}>
                      {TIME_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.timeLeft && <p className="text-[10px] font-mono text-red-400" data-testid="error-time-left">Required — select time remaining in service</p>}
                </div>

                <div className="space-y-2" data-testid="field-funding">
                  <label className="block text-[11px] font-medium tracking-wider uppercase" style={{ color: textDim }}>Education Funding Availability</label>
                  <Select value={funding} onValueChange={(v) => { setFunding(v); clearError("funding"); flashField("funding"); }}>
                    <SelectTrigger className={errors.funding ? "border-red-500" : ""} style={{ background: inputBg, borderColor: errors.funding ? undefined : inputBorder, color: textColor }} data-testid="select-funding">
                      <SelectValue placeholder="— Select Funding —" />
                    </SelectTrigger>
                    <SelectContent style={{ background: navyMid, borderColor: inputBorder }}>
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
                      <span key={i} className="inline-block font-mono text-[9px] tracking-wide px-1.5 py-0.5" style={{ background: goldBg, border: `1px solid ${goldBorder}`, color: gold, borderRadius: 2 }} data-testid={`tier-badge-${i}`}>
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
                        <div key={i} className="flex items-start gap-2.5 text-xs leading-relaxed p-2.5" style={{ background: subtleBg, borderLeft: `2px solid ${statusColors[c.status]}`, borderRadius: '0 2px 2px 0' }} data-testid={`constraint-${c.status}`}>
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
                    <Shield className="h-4 w-4" style={{ color: tealCol }} />
                    <span className="text-[9px] font-mono tracking-[2.5px] uppercase" style={{ color: tealCol }}>
                      Governance Transparency
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-5">
                    <div>
                      <div className="text-[10px] font-mono tracking-wider uppercase mb-1" style={{ color: textDim }}>Engine Version</div>
                      <div className="text-sm font-mono" style={{ color: tealCol }} data-testid="text-engine-version">CMGF v2.10</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono tracking-wider uppercase mb-1" style={{ color: textDim }}>Execution Type</div>
                      <div className="text-sm font-mono" style={{ color: tealCol }} data-testid="text-execution-type">Deterministic Rules Engine</div>
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="text-[10px] font-mono tracking-wider uppercase mb-2" style={{ color: textDim }}>Data Sources Consulted</div>
                    <div className="flex flex-wrap gap-1.5" data-testid="data-sources">
                      {result.dataSources.map(src => (
                        <span key={src} className="inline-block font-mono text-[10px] tracking-wide px-2 py-1" style={{ background: subtleBg, border: `1px solid ${borderColor}`, color: textColor, borderRadius: 2 }}>
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

                  <div className="py-2.5 px-4 text-center" style={{ background: goldBg, borderRadius: 3 }} data-testid="text-human-review">
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

            <div className="flex items-start gap-3.5 p-4" style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 4 }} data-testid="governance-notice">
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
                    <span key={tag} className="inline-block font-mono text-[9px] tracking-wide px-1.5 py-0.5" style={{ background: goldBg, border: `1px solid ${goldBorder}`, color: gold, borderRadius: 2 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        ) : (
          <div className="space-y-6" data-testid="tap-sandbox">
          <div className="p-5" style={{ background: purpleBg, border: `1px solid ${purpleBorder}`, borderRadius: 4 }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4" style={{ color: purpleCol }} />
              <span className="text-[10px] font-mono tracking-[2px] uppercase font-semibold" style={{ color: purpleCol }}>TAP Sandbox — Prototype Concept</span>
            </div>
            <div className="text-xs leading-relaxed" style={{ color: textDim }}>
              This sandbox demonstrates what a <strong style={{ color: textColor }}>Transition Assistance Program (TAP)</strong> advisory tool could look like within the CMGF framework. Service members approaching transition could explore career fields, salary ranges, credential requirements, and outcomes from prior cohorts — all before making official requests. <strong style={{ color: textColor }}>No data here enters the pipeline. No commander sees this. This is private exploration.</strong>
            </div>
          </div>

          <div className="p-6" style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 4 }}>
            <div className="flex items-center gap-2 pb-3 mb-4" style={{ borderBottom: `1px solid ${borderColor}` }}>
              <Clock className="h-4 w-4" style={{ color: "#4ecdc4" }} />
              <span className="text-[9px] font-mono tracking-[2.5px] uppercase" style={{ color: "#4ecdc4" }}>Transition Timeline — Recommended Phases</span>
            </div>
            <div className="flex flex-col gap-2">
              {TAP_TIMELINE.map((step, i) => (
                <div key={i} className="flex items-start gap-3 p-3" style={{ background: "rgba(10,22,40,0.5)", borderLeft: `3px solid ${step.color}`, borderRadius: "0 3px 3px 0" }}>
                  <div className="flex-shrink-0 text-center" style={{ minWidth: 80 }}>
                    <div className="text-[10px] font-mono font-bold" style={{ color: step.color }}>{step.phase}</div>
                    <div className="text-[9px] font-mono tracking-wide uppercase mt-0.5" style={{ color: textDim }}>{step.label}</div>
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: textColor }}>{step.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[9px] font-mono tracking-[2.5px] uppercase pt-2" style={{ color: purpleCol }}>Career Field Intelligence — Click to Expand</div>

          <div className="grid grid-cols-1 gap-3">
            {TAP_CAREER_FIELDS.map((career) => {
              const expanded = tapExpandedField === career.field;
              return (
                <div key={career.field} style={{ background: cardBg, border: `1px solid ${expanded ? purpleBorder : borderColor}`, borderRadius: 4, overflow: "hidden" }}>
                  <button
                    onClick={() => setTapExpandedField(expanded ? null : career.field)}
                    className="w-full flex items-center justify-between p-4 cursor-pointer border-none text-left"
                    style={{ background: "transparent" }}
                    data-testid={`tap-field-${career.field.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-4 w-4 flex-shrink-0" style={{ color: purpleCol }} />
                      <div>
                        <div className="text-sm font-medium" style={{ color: textColor }}>{career.field}</div>
                        <div className="text-[10px] font-mono" style={{ color: textDim }}>{career.roles.join(" · ")}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold" style={{ color: gold }}>{career.medianSalary}</div>
                        <div className="text-[9px] font-mono" style={{ color: career.demandTrend.includes("+3") ? "#4ecdc4" : career.demandTrend.includes("+1") ? "#c9a84c" : textDim }}>
                          {career.demandTrend}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 transition-transform" style={{ color: textDim, transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }} />
                    </div>
                  </button>

                  {expanded && (
                    <div className="px-4 pb-4 space-y-3" style={{ borderTop: `1px solid ${borderColor}` }}>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3">
                        <div className="p-2.5" style={{ background: "rgba(10,22,40,0.5)", borderRadius: 3 }}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <DollarSign className="h-3 w-3" style={{ color: gold }} />
                            <span className="text-[8px] font-mono tracking-wider uppercase" style={{ color: textDim }}>Salary Range</span>
                          </div>
                          <div className="text-sm font-mono font-bold" style={{ color: textColor }}>{career.medianSalary}</div>
                        </div>
                        <div className="p-2.5" style={{ background: "rgba(10,22,40,0.5)", borderRadius: 3 }}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <TrendingUp className="h-3 w-3" style={{ color: "#4ecdc4" }} />
                            <span className="text-[8px] font-mono tracking-wider uppercase" style={{ color: textDim }}>Demand</span>
                          </div>
                          <div className="text-sm font-mono font-bold" style={{ color: textColor }}>{career.demandTrend}</div>
                        </div>
                        <div className="p-2.5" style={{ background: "rgba(10,22,40,0.5)", borderRadius: 3 }}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <Users className="h-3 w-3" style={{ color: "#5cb85c" }} />
                            <span className="text-[8px] font-mono tracking-wider uppercase" style={{ color: textDim }}>Vet Success</span>
                          </div>
                          <div className="text-sm font-mono font-bold" style={{ color: textColor }}>{career.veteranSuccess}</div>
                        </div>
                        <div className="p-2.5" style={{ background: "rgba(10,22,40,0.5)", borderRadius: 3 }}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <BarChart3 className="h-3 w-3" style={{ color: purpleCol }} />
                            <span className="text-[8px] font-mono tracking-wider uppercase" style={{ color: textDim }}>TAP Align</span>
                          </div>
                          <div className="text-sm font-mono font-bold" style={{ color: career.tapAlignment === "HIGH" ? "#5cb85c" : "#f0a500" }}>{career.tapAlignment}</div>
                        </div>
                      </div>

                      <div className="p-3" style={{ background: "rgba(10,22,40,0.5)", borderRadius: 3 }}>
                        <div className="flex items-center gap-1.5 mb-2">
                          <FileText className="h-3 w-3" style={{ color: gold }} />
                          <span className="text-[8px] font-mono tracking-wider uppercase" style={{ color: textDim }}>Credential Gap</span>
                        </div>
                        <div className="text-xs" style={{ color: textColor }}>{career.credentialGap}</div>
                      </div>

                      <div className="p-3" style={{ background: "rgba(10,22,40,0.5)", borderRadius: 3 }}>
                        <div className="flex items-center gap-1.5 mb-2">
                          <AlertTriangle className="h-3 w-3" style={{ color: "#f0a500" }} />
                          <span className="text-[8px] font-mono tracking-wider uppercase" style={{ color: textDim }}>Known Pain Points (from veteran cohorts)</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          {career.painPoints.map(pp => (
                            <div key={pp} className="text-xs flex items-start gap-2" style={{ color: textColor }}>
                              <span style={{ color: "#f0a500" }}>·</span> {pp}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2.5" style={{ background: purpleBg, borderRadius: 3, border: `1px solid ${purpleBorder}` }}>
                        <MapPin className="h-3 w-3 flex-shrink-0" style={{ color: purpleCol }} />
                        <span className="text-[10px] font-mono" style={{ color: textDim }}>
                          BLS Occupational Code: <strong style={{ color: textColor }}>{career.blsCode}</strong> — Regional salary data available via BLS.gov
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-6" style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 4 }}>
            <div className="flex items-center gap-2 pb-3 mb-4" style={{ borderBottom: `1px solid ${borderColor}` }}>
              <Users className="h-4 w-4" style={{ color: purpleCol }} />
              <span className="text-[9px] font-mono tracking-[2.5px] uppercase" style={{ color: purpleCol }}>Voice of the Veteran — Transition Feedback</span>
            </div>
            <div className="text-xs leading-relaxed mb-4" style={{ color: textDim }}>
              Aggregated insights from veterans who completed their transition. This data feeds back into the system to inform the next generation.
            </div>
            <div className="flex flex-col gap-2">
              {TAP_VETERAN_INSIGHTS.map(item => (
                <div key={item.question} className="p-3" style={{ background: subtleBg, borderRadius: 3, borderLeft: `2px solid ${purpleBorder}` }}>
                  <div className="text-[10px] font-mono mb-1.5" style={{ color: textDim }}>{item.question}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium" style={{ color: textColor }}>{item.topAnswer}</span>
                    <span className="text-sm font-mono font-bold" style={{ color: purpleCol }}>{item.pct}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5" style={{ background: purpleBg, border: `1px solid ${purpleBorder}`, borderRadius: 4 }}>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4" style={{ color: purpleCol }} />
              <span className="text-[10px] font-mono tracking-[2px] uppercase font-semibold" style={{ color: purpleCol }}>ISR Signal from TAP Sandbox</span>
            </div>
            <div className="text-xs leading-relaxed mb-3" style={{ color: textDim }}>
              While no individual data leaves the sandbox, <strong style={{ color: textColor }}>aggregate exploration patterns generate institutional signal</strong>:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                "Career fields explored (demand forecasting)",
                "Credential gaps identified (TAP curriculum gaps)",
                "Geographic intent signals (employer matching)",
                "Timeline patterns (when SMs start planning)",
                "Funding questions (TA/CA vs GI Bill alignment)",
                "Pain point frequency (policy friction indicators)",
              ].map(item => (
                <div key={item} className="flex items-start gap-2 text-xs" style={{ color: textColor }}>
                  <TrendingUp className="h-3 w-3 flex-shrink-0 mt-0.5" style={{ color: purpleCol }} />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-3 text-[10px] font-mono italic" style={{ color: textDim }}>
              This aggregate data — subscribed to by Congress, the Pentagon, and TAP program offices — reveals suppressed demand and informs funding decisions.
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4" style={{ background: cardBg, border: `1px solid ${purpleBorder}`, borderRadius: 4 }} data-testid="tap-governance-notice">
            <Shield className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: purpleCol }} />
            <div className="text-xs leading-relaxed italic" style={{ color: textDim }}>
              <strong className="not-italic" style={{ color: purpleCol }}>TAP Sandbox Notice</strong>
              <br /><br />
              This sandbox is <strong style={{ color: textColor }}>entirely private</strong>. No data from exploration enters the official pipeline. No commander, ESO, or institutional system sees what is explored here.
              <br /><br />
              The data presented is drawn from publicly available sources: Bureau of Labor Statistics, O*NET, DoD credentialing databases, and aggregated veteran transition outcomes. Salary figures are median ranges and vary by region, experience, and employer.
              <br /><br />
              <strong className="not-italic" style={{ color: textColor }}>This is a planning tool — not a recommendation engine. Final decisions remain with the service member and their human advisors.</strong>
              <br /><br />
              <div className="flex flex-wrap gap-1.5 not-italic">
                {["PRIVATE SANDBOX", "NO PIPELINE ENTRY", "BLS DATA", "INFORMATIONAL ONLY"].map(tag => (
                  <span key={tag} className="inline-block font-mono text-[9px] tracking-wide px-1.5 py-0.5" style={{ background: purpleBg, border: `1px solid ${purpleBorder}`, color: purpleCol, borderRadius: 2 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          </div>
        )}

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
