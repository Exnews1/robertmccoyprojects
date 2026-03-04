import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CMGFNav } from "@/components/cmgf-nav";
import { CMGFAdvisoryNotice } from "@/components/cmgf-advisory-notice";
import { Link } from "wouter";
import {
  ChevronRight,
  Play,
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
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
}

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
  const styles: Record<Verdict, string> = {
    feasible: "bg-green-500/15 border-green-500 text-green-500",
    conditional: "bg-amber-500/15 border-amber-500 text-amber-500",
    infeasible: "bg-red-500/15 border-red-500 text-red-500",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wider uppercase border ${styles[verdict]}`} data-testid="badge-verdict">
      {label}
    </span>
  );
}

function ConstraintItem({ constraint }: { constraint: Constraint }) {
  const icons: Record<string, typeof CheckCircle2> = {
    met: CheckCircle2,
    unmet: XCircle,
    partial: AlertTriangle,
  };
  const colors: Record<string, string> = {
    met: "border-l-green-500 text-green-500",
    unmet: "border-l-red-500 text-red-500",
    partial: "border-l-amber-500 text-amber-500",
  };
  const Icon = icons[constraint.status];
  return (
    <div className={`flex items-start gap-3 p-3 border-l-2 ${colors[constraint.status]} bg-background/50`} data-testid={`constraint-${constraint.status}`}>
      <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
      <span className="text-xs text-foreground leading-relaxed">{constraint.text}</span>
    </div>
  );
}

function PathwayStep({ emoji, label, active, showArrow }: { emoji: string; label: string; active: boolean; showArrow: boolean }) {
  return (
    <>
      {showArrow && (
        <div className="text-amber-600 text-lg opacity-50 flex-shrink-0" aria-hidden="true" data-testid="step-arrow">
          <ArrowRight className="h-5 w-5" />
        </div>
      )}
      <div className="flex-1 min-w-[100px] text-center" data-testid="pathway-step">
        <div className={`w-11 h-11 rounded-full mx-auto mb-2 flex items-center justify-center text-lg border transition-all ${
          active
            ? "bg-amber-600/20 border-amber-600 shadow-[0_0_12px_rgba(180,83,9,0.2)]"
            : "bg-muted/30 border-border/50 opacity-50"
        }`}>
          {emoji}
        </div>
        <div className={`text-[10px] font-mono leading-snug ${active ? "text-foreground" : "text-muted-foreground"}`}>
          {label}
        </div>
      </div>
    </>
  );
}

export default function CareerAdvisor() {
  const [milOcc, setMilOcc] = useState("");
  const [civCareer, setCivCareer] = useState("");
  const [education, setEducation] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [funding, setFunding] = useState("");
  const [result, setResult] = useState<EvalResult | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

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

    setResult({
      ...evalResult,
      explanation,
      constraints,
      tiers: [...ruleTiers, "NON-PREDICTIVE", "INFORMATIONAL ONLY"],
      steps,
    });
  }, [milOcc, civCareer, education, timeLeft, funding]);

  const clearError = (field: string) => {
    setErrors(prev => ({ ...prev, [field]: false }));
  };


  return (
    <div className="min-h-screen bg-background">
      <CMGFNav />
      <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-4 md:py-6">
        <nav className="mb-6 text-sm flex items-center flex-wrap gap-1">
          <Link href="/research" className="text-muted-foreground hover:text-primary transition-colors">
            Portfolio
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link href="/research/cmgf" className="text-muted-foreground hover:text-primary transition-colors">
            CMGF
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">Career Path Advisor</span>
        </nav>

        <header className="text-center mb-10">
          <div className="text-[10px] font-mono tracking-[3px] text-amber-600 uppercase mb-3" data-testid="text-prototype-label">
            Prototype Demonstration
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-light tracking-tight text-foreground mb-3" data-testid="heading-career-advisor">
            Career Path Feasibility Advisor
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            A deterministic constraint-binding advisory tool that evaluates military-to-civilian transition pathways against policy, credentialing, and education authority rules.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-6 items-start">
          <div className="space-y-6">
            <Card className="border-border/50">
              <CardContent className="pt-6 space-y-5">
                <div className="text-[9px] font-mono tracking-[2.5px] text-amber-600 uppercase pb-3 border-b border-border/50">
                  Input Panel · Service Member Profile
                </div>

                <CMGFAdvisoryNotice />

                <div className="space-y-1.5" data-testid="field-mil-occ">
                  <Label className="text-[11px] tracking-wider uppercase text-muted-foreground">Military Occupation</Label>
                  <Select value={milOcc} onValueChange={(v) => { setMilOcc(v); clearError("milOcc"); }}>
                    <SelectTrigger className={errors.milOcc ? "border-red-500" : ""} data-testid="select-mil-occ">
                      <SelectValue placeholder="— Select MOS/Rate —" />
                    </SelectTrigger>
                    <SelectContent>
                      {MIL_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.milOcc && <p className="text-[10px] font-mono text-red-500" data-testid="error-mil-occ">Required — select a military occupation</p>}
                </div>

                <div className="space-y-1.5" data-testid="field-civ-career">
                  <Label className="text-[11px] tracking-wider uppercase text-muted-foreground">Desired Civilian Career</Label>
                  <Select value={civCareer} onValueChange={(v) => { setCivCareer(v); clearError("civCareer"); }}>
                    <SelectTrigger className={errors.civCareer ? "border-red-500" : ""} data-testid="select-civ-career">
                      <SelectValue placeholder="— Select Target Career —" />
                    </SelectTrigger>
                    <SelectContent>
                      {CIV_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.civCareer && <p className="text-[10px] font-mono text-red-500" data-testid="error-civ-career">Required — select a target civilian career</p>}
                </div>

                <div className="space-y-1.5" data-testid="field-education">
                  <Label className="text-[11px] tracking-wider uppercase text-muted-foreground">Current Education Level</Label>
                  <Select value={education} onValueChange={(v) => { setEducation(v); clearError("education"); }}>
                    <SelectTrigger className={errors.education ? "border-red-500" : ""} data-testid="select-education">
                      <SelectValue placeholder="— Select Level —" />
                    </SelectTrigger>
                    <SelectContent>
                      {EDU_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.education && <p className="text-[10px] font-mono text-red-500" data-testid="error-education">Required — select your education level</p>}
                </div>

                <div className="space-y-1.5" data-testid="field-time-left">
                  <Label className="text-[11px] tracking-wider uppercase text-muted-foreground">Time Remaining in Service</Label>
                  <Select value={timeLeft} onValueChange={(v) => { setTimeLeft(v); clearError("timeLeft"); }}>
                    <SelectTrigger className={errors.timeLeft ? "border-red-500" : ""} data-testid="select-time-left">
                      <SelectValue placeholder="— Select Timeframe —" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.timeLeft && <p className="text-[10px] font-mono text-red-500" data-testid="error-time-left">Required — select time remaining in service</p>}
                </div>

                <div className="space-y-1.5" data-testid="field-funding">
                  <Label className="text-[11px] tracking-wider uppercase text-muted-foreground">Education Funding Availability</Label>
                  <Select value={funding} onValueChange={(v) => { setFunding(v); clearError("funding"); }}>
                    <SelectTrigger className={errors.funding ? "border-red-500" : ""} data-testid="select-funding">
                      <SelectValue placeholder="— Select Funding —" />
                    </SelectTrigger>
                    <SelectContent>
                      {FUNDING_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.funding && <p className="text-[10px] font-mono text-red-500" data-testid="error-funding">Required — select funding availability</p>}
                </div>

                <Button
                  className="w-full font-mono text-xs tracking-widest uppercase"
                  onClick={runEvaluation}
                  data-testid="button-evaluate"
                >
                  <Play className="h-3.5 w-3.5 mr-2" />
                  Evaluate Pathway
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="border-border/50 min-h-[140px]">
              <CardContent className="pt-6">
                {!result ? (
                  <div className="flex items-center justify-center min-h-[100px]">
                    <p className="text-xs font-mono text-muted-foreground tracking-wide" data-testid="text-placeholder">
                      ← Complete profile and evaluate pathway
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4" data-testid="result-panel">
                    <div className="text-[9px] font-mono tracking-[2.5px] text-amber-600 uppercase pb-3 border-b border-border/50">
                      Constraint Evaluation Result
                    </div>
                    <div className="flex items-center gap-4 pb-4 border-b border-border/30 flex-wrap">
                      <VerdictBadge verdict={result.verdict} label={result.label} />
                      <h2 className="font-serif text-lg font-light text-foreground" data-testid="text-verdict-title">
                        {milLabels[milOcc]} → {civLabels[civCareer]}
                      </h2>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground" data-testid="text-explanation">
                      {result.explanation}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {result.tiers.map((t, i) => (
                        <Badge key={i} variant="outline" className="text-[9px] font-mono tracking-wider border-amber-600/30 text-amber-600/80" data-testid={`tier-badge-${i}`}>
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {result && (
              <>
                <Card className="border-border/50" data-testid="card-constraints">
                  <CardContent className="pt-6 space-y-3">
                    <div className="text-[9px] font-mono tracking-[2.5px] text-amber-600 uppercase pb-3 border-b border-border/50">
                      Constraint Evaluation · Policy Rules Applied
                    </div>
                    <div className="space-y-2">
                      {result.constraints.map((c, i) => (
                        <ConstraintItem key={i} constraint={c} />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50" data-testid="card-pathway">
                  <CardContent className="pt-6">
                    <div className="text-[9px] font-mono tracking-[2.5px] text-amber-600 uppercase pb-3 border-b border-border/50 mb-4">
                      Transition Pathway · Steps
                    </div>
                    <div className="flex items-center flex-wrap gap-2">
                      {result.steps.map((step, i) => {
                        const parts = step.split(" ");
                        const emoji = parts[0];
                        const label = parts.slice(1).join(" ");
                        const active = result.verdict !== "infeasible" || i === 0;
                        return (
                          <PathwayStep
                            key={i}
                            emoji={emoji}
                            label={label}
                            active={active}
                            showArrow={i > 0}
                          />
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            <div className="flex items-start gap-3 p-4 border border-amber-600/15 bg-card/80" data-testid="governance-notice">
              <Shield className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground leading-relaxed italic">
                <strong className="text-amber-600 not-italic">CMGF Advisory Notice</strong>
                <br /><br />
                The Career Mobility Governance Framework provides informational planning signals based on the data and inputs supplied by the user. The system compares user declared goals with publicly available policy rules, credential requirements, and labor market reference data.
                <br /><br />
                The results presented are not recommendations, predictions, or decisions. They are informational indicators designed to help users understand how their current education, experience, and credential status relate to potential career pathways.
                <br /><br />
                <strong className="text-foreground not-italic">CMGF does not determine what a user can or cannot pursue. The system has no authority to approve, deny, or restrict career choices. Final decisions remain entirely with the user and their human advisors.</strong>
                <br /><br />
                Users are encouraged to review results with qualified advisors such as Education Service Officers, institutional counselors, or credentialing authorities before making career or education decisions.
                <br /><br />
                <div className="flex flex-wrap gap-1.5 not-italic">
                  <Badge variant="outline" className="text-[9px] font-mono border-amber-600/30 text-amber-600/80">NIST AI RMF</Badge>
                  <Badge variant="outline" className="text-[9px] font-mono border-amber-600/30 text-amber-600/80">EO 14179</Badge>
                  <Badge variant="outline" className="text-[9px] font-mono border-amber-600/30 text-amber-600/80">NON-PREDICTIVE</Badge>
                  <Badge variant="outline" className="text-[9px] font-mono border-amber-600/30 text-amber-600/80">INFORMATIONAL ONLY</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-border">
          <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Navigation</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/research/cmgf">
              <Button variant="outline" size="sm">CMGF Main</Button>
            </Link>
            <Link href="/research/sm-hub">
              <Button variant="outline" size="sm">SM Request Hub</Button>
            </Link>
            <Link href="/research/demo">
              <Button variant="outline" size="sm">Demo Mode</Button>
            </Link>
            <Link href="/research/isr">
              <Button variant="outline" size="sm">ISR Queue</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
