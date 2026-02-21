import { useState, useMemo, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/queryClient";
import {
  User, Cpu, AlertTriangle, CheckCircle, Clock, Shield,
  ArrowRight, Zap, BookOpen, DollarSign, FileWarning,
  Lock, Layers, Target, TrendingUp, XCircle, Lightbulb,
  Loader2, ChevronDown, ChevronUp, Sparkles, Info
} from "lucide-react";

interface PersonaConfig {
  rank: string;
  yearsOfService: string;
  mos: string;
  careerGoal: string;
}

type MeasureStatus = "green" | "yellow" | "red";

interface ReadinessMeasure {
  dimension: string;
  status: MeasureStatus;
  label: string;
  detail: string;
}

interface PathwayResult {
  pathwayOptions: Array<{ name: string; match: string; timeframe: string }>;
  constraintRisks: Array<{ label: string; severity: "high" | "medium" | "low"; detail: string }>;
  policyFriction: Array<{ point: string; framework: string }>;
  resourcesRequired: Array<{ resource: string; status: string }>;
  readinessMeasures: ReadinessMeasure[];
  specialConsiderations: string[];
  timelineRange: string;
  cmgfLayers: Array<{ layer: string; action: string }>;
  explanation?: string;
  sources?: Array<{ id: string; title: string; year?: number; relevance?: string }>;
  generated?: boolean;
}

const RANKS = ["E-4", "E-5", "E-6", "E-7", "O-1", "O-2", "O-3"];
const YEARS = ["4", "6", "8", "10", "12", "15", "20"];
const MOS_OPTIONS = [
  { value: "logistics", label: "Logistics (88M/92A)" },
  { value: "intel", label: "Intelligence (35F/35M)" },
  { value: "comms", label: "Signal/Comms (25B/25U)" },
  { value: "combat_arms", label: "Combat Arms (11B/19D)" },
  { value: "medical", label: "Medical (68W/68C)" },
  { value: "admin", label: "Admin/HR (42A/36B)" },
];
const CAREER_GOALS = [
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "project_management", label: "Project Management" },
  { value: "healthcare_admin", label: "Healthcare Administration" },
  { value: "data_analytics", label: "Data Analytics" },
  { value: "supply_chain", label: "Supply Chain Management" },
  { value: "education", label: "Education / Training" },
];

const PATHWAY_DATA: Record<string, Record<string, PathwayResult>> = {
  logistics: {
    cybersecurity: {
      pathwayOptions: [
        { name: "CompTIA Security+ \u2192 CISSP Track", match: "72%", timeframe: "12-18 months" },
        { name: "DoD 8570 IAT Level II", match: "85%", timeframe: "6-9 months" },
        { name: "BS Cybersecurity (transfer credits)", match: "64%", timeframe: "24-36 months" },
      ],
      constraintRisks: [
        { label: "Credential completion risk", severity: "medium", detail: "Security+ requires dedicated study time that may conflict with duty schedules" },
        { label: "Experience gap", severity: "high", detail: "Logistics MOS has limited direct cyber experience; lab hours needed" },
        { label: "Clearance transfer window", severity: "low", detail: "Existing clearance may facilitate transition if timeline aligns" },
      ],
      policyFriction: [
        { point: "TA funding cap may limit concurrent certifications", framework: "DoD TA Policy" },
        { point: "Credentialing Assistance limited to approved list", framework: "Army CA Program" },
        { point: "Transition timeline must align with ETS date", framework: "TAP/SFL-TAP" },
      ],
      resourcesRequired: [
        { resource: "CompTIA Security+ voucher ($392)", status: "CA-eligible" },
        { resource: "CyberVista/Kaplan study materials", status: "TA-eligible" },
        { resource: "Practice lab environment", status: "Available via ArmyIgnitED" },
        { resource: "Career counselor coordination", status: "Required" },
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "red", label: "Significant", detail: "Non-cyber MOS requires foundational technical training before cybersecurity credentialing can begin — realistic timeline is 18-36 months for competitive readiness" },
        { dimension: "Family Impact", status: "green", label: "Low", detail: "Self-paced study paths available; no mandatory relocation for credentialing" },
        { dimension: "Transition Stress", status: "yellow", label: "Moderate", detail: "Cross-domain transition from logistics to cyber requires new technical foundations" },
        { dimension: "Domain Alignment", status: "red", label: "Low", detail: "Logistics MOS has minimal direct cybersecurity overlap; foundational networking, OS, and security concepts must be built from scratch" },
      ],
      specialConsiderations: [
        "As a non-cyber MOS, 88M/92A personnel lack the foundational IT experience that cyber-adjacent roles (25B, 35T) already possess — plan for 6-12 months of pre-certification technical study before attempting Security+ or CISSP.",
        "Logistics personnel with COMSEC or classified systems exposure may qualify for accelerated DoD 8570 credentialing — verify with unit security manager.",
        "Consider stacking CompTIA A+ and Network+ before Security+ to build the technical foundation that cyber-native MOS holders already have. This adds time but dramatically improves certification pass rates.",
      ],
      timelineRange: "6-18 months depending on pathway",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Captures MOS skills, credential inventory, career goal declaration" },
        { layer: "Part B: AI Mediation", action: "Translates 88M/92A competencies to cybersecurity domain; identifies transferable skills (risk assessment, systems monitoring, logistics chain security)" },
        { layer: "Part C: Advisory Review", action: "Human advisor validates pathway feasibility, confirms funding eligibility, reviews timeline against ETS" },
      ],
      explanation: "This analysis maps logistics MOS competencies (inventory management, supply chain security, systems monitoring) to cybersecurity credential domains. The DoD 8570 IAT Level II pathway shows highest alignment because military logistics personnel already operate within secured information systems, providing foundational cybersecurity context.",
    },
    project_management: {
      pathwayOptions: [
        { name: "PMP Certification Track", match: "91%", timeframe: "3-6 months" },
        { name: "CAPM \u2192 PMP Ladder", match: "88%", timeframe: "6-12 months" },
        { name: "MS Project Management", match: "76%", timeframe: "18-24 months" },
      ],
      constraintRisks: [
        { label: "PMP experience requirement", severity: "low", detail: "Military logistics experience typically satisfies 4,500-hour leadership requirement" },
        { label: "Study time allocation", severity: "low", detail: "Self-paced options available through credentialing assistance" },
      ],
      policyFriction: [
        { point: "PMI exam fees may exceed single CA voucher limit", framework: "Army CA Program" },
        { point: "Experience documentation requires supervisor validation", framework: "PMI Requirements" },
      ],
      resourcesRequired: [
        { resource: "PMI membership ($139/yr)", status: "Self-funded" },
        { resource: "PMP exam fee ($405)", status: "CA-eligible" },
        { resource: "Project management coursework (35 hrs)", status: "TA-eligible" },
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "green", label: "Strong", detail: "PMP achievable in 3-6 months; fast-track pathway available" },
        { dimension: "Family Impact", status: "green", label: "Low", detail: "Study-based pathway with flexible scheduling; no relocation required" },
        { dimension: "Transition Stress", status: "green", label: "Low", detail: "Logistics experience maps directly to project management; minimal retraining" },
        { dimension: "Domain Alignment", status: "green", label: "High", detail: "91% domain overlap — one of the strongest MOS-to-credential alignments" },
      ],
      specialConsiderations: [
        "Logistics E-6+ personnel typically exceed the PMP experience threshold without additional documentation — focus on obtaining supervisor endorsement letters early.",
        "PMI offers a military discount on membership and exam fees; confirm current rates through ArmyIgnitED before applying.",
      ],
      timelineRange: "3-12 months depending on pathway",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Documents logistics planning, convoy management, and resource allocation experience" },
        { layer: "Part B: AI Mediation", action: "Maps logistics competencies directly to PMI knowledge areas; high transferability score" },
        { layer: "Part C: Advisory Review", action: "Advisor confirms experience hours, validates application documentation" },
      ],
      explanation: "Logistics MOS maps directly to PMI knowledge areas with 91% domain alignment. Military logistics experience in resource planning, risk management, and multi-stakeholder coordination satisfies PMP experience requirements with minimal additional credentialing needed.",
    },
    supply_chain: {
      pathwayOptions: [
        { name: "APICS CSCP Certification", match: "94%", timeframe: "3-6 months" },
        { name: "BS Supply Chain Management", match: "82%", timeframe: "18-24 months" },
        { name: "Six Sigma Green Belt", match: "79%", timeframe: "2-4 months" },
      ],
      constraintRisks: [
        { label: "Credential alignment", severity: "low", detail: "MOS directly maps to civilian supply chain roles" },
      ],
      policyFriction: [
        { point: "APICS membership costs not covered by TA", framework: "DoD TA Policy" },
      ],
      resourcesRequired: [
        { resource: "APICS CSCP exam ($495)", status: "CA-eligible" },
        { resource: "Study materials", status: "TA-eligible" },
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "green", label: "Strong", detail: "CSCP achievable in 3-6 months; Six Sigma even faster at 2-4 months" },
        { dimension: "Family Impact", status: "green", label: "Low", detail: "Remote study options; credential portable across geographies" },
        { dimension: "Transition Stress", status: "green", label: "Low", detail: "Near-direct domain match — minimal new learning required" },
        { dimension: "Domain Alignment", status: "green", label: "Very High", detail: "94% alignment — military logistics is functionally identical to civilian supply chain" },
      ],
      specialConsiderations: [
        "This is one of the highest-alignment MOS-to-career transitions available. Consider pursuing CSCP before separation to maximize CA benefits.",
        "Defense logistics experience is highly valued in federal contracting supply chain roles — explore cleared positions that leverage both clearance and domain expertise.",
      ],
      timelineRange: "2-12 months depending on pathway",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Captures warehouse management, distribution, and inventory control experience" },
        { layer: "Part B: AI Mediation", action: "Near-direct translation of military logistics to civilian supply chain terminology" },
        { layer: "Part C: Advisory Review", action: "Advisor validates credential mapping and employer requirement alignment" },
      ],
      explanation: "Military logistics MOS provides near-direct translation to civilian supply chain management. The APICS CSCP pathway shows 94% alignment because military warehouse management, distribution operations, and inventory control map directly to APICS competency domains.",
    },
  },
  intel: {
    cybersecurity: {
      pathwayOptions: [
        { name: "CISSP Direct Track", match: "88%", timeframe: "6-12 months" },
        { name: "CEH + OSCP Track", match: "82%", timeframe: "9-15 months" },
        { name: "MS Cybersecurity", match: "75%", timeframe: "18-24 months" },
      ],
      constraintRisks: [
        { label: "Classification barrier", severity: "medium", detail: "Some experience documentation limited by classification; unclassified equivalents needed" },
        { label: "Clearance monetization window", severity: "low", detail: "Active TS/SCI significantly increases employability if transition is timely" },
      ],
      policyFriction: [
        { point: "Classified experience may not count toward civilian certification hours", framework: "ISC2 Requirements" },
        { point: "Clearance reciprocity timelines vary by agency", framework: "ODNI Policy" },
      ],
      resourcesRequired: [
        { resource: "CISSP exam fee ($749)", status: "CA-eligible" },
        { resource: "ISC2 training course", status: "TA-eligible" },
        { resource: "CPE maintenance plan", status: "Self-funded post-service" },
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "green", label: "Strong", detail: "CISSP achievable in 6-12 months; strong experience base accelerates prep" },
        { dimension: "Family Impact", status: "green", label: "Low", detail: "Study-based credentialing; high-paying cleared roles reduce financial transition stress" },
        { dimension: "Transition Stress", status: "yellow", label: "Moderate", detail: "Must navigate classification barriers in experience documentation; requires careful preparation" },
        { dimension: "Domain Alignment", status: "green", label: "High", detail: "88% alignment — intelligence analytical skills translate directly to cybersecurity threat analysis" },
      ],
      specialConsiderations: [
        "TS/SCI clearance holders have a narrow monetization window; begin employer outreach 6+ months before ETS to secure cleared cybersecurity positions.",
        "ISC2 endorsement for CISSP requires another certified professional's signature — begin networking with ISC2 members during transition preparation.",
        "Consider documenting unclassified equivalents of classified experience proactively; career counselors can help frame narratives for civilian credentialing bodies.",
      ],
      timelineRange: "6-15 months depending on pathway",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Captures SIGINT/HUMINT/GEOINT skill sets and clearance level" },
        { layer: "Part B: AI Mediation", action: "Translates intelligence analysis competencies to cybersecurity threat analysis; identifies cross-domain skills" },
        { layer: "Part C: Advisory Review", action: "Advisor manages classification-sensitive documentation; validates unclassified experience narratives" },
      ],
      explanation: "Intelligence MOS provides strong analytical foundation for cybersecurity. CISSP track shows 88% alignment due to overlap in threat analysis, risk assessment, and classified system operations. Key constraint is documentation of classified experience for civilian credential validation.",
    },
    data_analytics: {
      pathwayOptions: [
        { name: "Google Data Analytics Certificate", match: "85%", timeframe: "3-6 months" },
        { name: "MS Data Science", match: "72%", timeframe: "24-36 months" },
        { name: "Tableau + SQL Certification", match: "78%", timeframe: "4-8 months" },
      ],
      constraintRisks: [
        { label: "Technical skill gap", severity: "medium", detail: "Programming languages (Python/R) may require foundational coursework" },
      ],
      policyFriction: [
        { point: "Online certificate programs have variable TA eligibility", framework: "DoD TA Policy" },
      ],
      resourcesRequired: [
        { resource: "Coursera/Google certificate ($300)", status: "TA-eligible" },
        { resource: "Python bootcamp", status: "CA-eligible" },
        { resource: "Portfolio development tools", status: "Self-funded" },
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "green", label: "Strong", detail: "Google certificate achievable in 3-6 months with structured pacing" },
        { dimension: "Family Impact", status: "green", label: "Low", detail: "Fully remote coursework; flexible scheduling compatible with family obligations" },
        { dimension: "Transition Stress", status: "yellow", label: "Moderate", detail: "Programming skill gap requires intentional study; analytical mindset transfers well" },
        { dimension: "Domain Alignment", status: "green", label: "High", detail: "85% alignment — intelligence analysis methodology closely mirrors data analytics workflows" },
      ],
      specialConsiderations: [
        "Intelligence analysts with Python or R exposure from SIGINT tools have a significant head start — assess existing programming competency before choosing pathway.",
        "Consider building a public portfolio of analysis work using declassified or open-source datasets to demonstrate capabilities to civilian employers.",
      ],
      timelineRange: "3-18 months depending on pathway",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Documents analytical methodology, reporting, and pattern recognition experience" },
        { layer: "Part B: AI Mediation", action: "Maps intelligence analysis frameworks to data science methodologies; high analytical transferability" },
        { layer: "Part C: Advisory Review", action: "Advisor reviews civilian equivalency of classified analytical work" },
      ],
      explanation: "Intelligence analysis skills transfer strongly to data analytics. Pattern recognition, report generation, and structured analytical methodologies from intelligence work map directly to civilian data science practices.",
    },
  },
  comms: {
    cybersecurity: {
      pathwayOptions: [
        { name: "Network+ \u2192 Security+ \u2192 CySA+", match: "90%", timeframe: "9-15 months" },
        { name: "CCNA Security Track", match: "84%", timeframe: "6-12 months" },
        { name: "BS Information Technology", match: "71%", timeframe: "24-36 months" },
      ],
      constraintRisks: [
        { label: "Certification stacking", severity: "low", detail: "Signal MOS provides strong foundation; sequential cert path is natural progression" },
      ],
      policyFriction: [
        { point: "Multiple cert exams may exceed annual CA limit", framework: "Army CA Program" },
      ],
      resourcesRequired: [
        { resource: "CompTIA cert bundle ($900)", status: "Partially CA-eligible" },
        { resource: "Cisco learning subscription", status: "TA-eligible" },
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "green", label: "Strong", detail: "CCNA achievable in 6-12 months; CompTIA stack in 9-15 months" },
        { dimension: "Family Impact", status: "green", label: "Low", detail: "Study-based; high civilian demand reduces post-separation uncertainty" },
        { dimension: "Transition Stress", status: "green", label: "Low", detail: "Same domain — network operations to network security is a natural lateral move" },
        { dimension: "Domain Alignment", status: "green", label: "Very High", detail: "90% alignment — highest natural transfer rate of any MOS to cybersecurity" },
      ],
      specialConsiderations: [
        "Signal/Comms personnel often already hold Network+ or equivalent — verify existing certifications to avoid redundant credentialing and save CA funds.",
        "Consider the CySA+ pathway for a threat-analysis focus, or CCNA Security for infrastructure defense, depending on career interest within cybersecurity.",
      ],
      timelineRange: "6-15 months depending on pathway",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Captures network configuration, COMSEC, and signal operations experience" },
        { layer: "Part B: AI Mediation", action: "Direct translation of network operations to cybersecurity infrastructure defense; high domain overlap" },
        { layer: "Part C: Advisory Review", action: "Advisor validates technical depth and recommends specialization track" },
      ],
      explanation: "Signal/Comms MOS has the highest natural transfer rate to cybersecurity. Network configuration, COMSEC operations, and infrastructure management map directly to cybersecurity defense roles with 90% pathway alignment.",
    },
  },
  medical: {
    healthcare_admin: {
      pathwayOptions: [
        { name: "MHA/MPH Program", match: "86%", timeframe: "18-24 months" },
        { name: "FACHE Certification", match: "74%", timeframe: "12-18 months" },
        { name: "Healthcare Management Certificate", match: "80%", timeframe: "6-12 months" },
      ],
      constraintRisks: [
        { label: "Credential gap", severity: "medium", detail: "Administrative experience may be limited for clinical MOS; management electives needed" },
      ],
      policyFriction: [
        { point: "Graduate programs require GRE; waiver may be available for veterans", framework: "VA Education Benefits" },
        { point: "GI Bill BAH rates vary by program delivery mode", framework: "Ch. 33 Post-9/11 GI Bill" },
      ],
      resourcesRequired: [
        { resource: "Graduate program tuition", status: "GI Bill eligible" },
        { resource: "ACHE membership ($300)", status: "Self-funded" },
        { resource: "Practicum/fellowship placement", status: "Program-arranged" },
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "yellow", label: "Extended", detail: "MHA programs typically 18-24 months; certificate track faster at 6-12 months" },
        { dimension: "Family Impact", status: "yellow", label: "Moderate", detail: "Graduate programs may require practicum placements; could affect location flexibility" },
        { dimension: "Transition Stress", status: "yellow", label: "Moderate", detail: "Clinical-to-administrative shift requires developing management competencies" },
        { dimension: "Domain Alignment", status: "green", label: "High", detail: "86% alignment — healthcare system knowledge from clinical work provides strong foundation" },
      ],
      specialConsiderations: [
        "Combat medics with leadership experience (team lead, NCOIC) should emphasize supervisory roles in their application narratives — this bridges the clinical-to-admin gap.",
        "VA Medical Centers actively recruit veteran healthcare administrators; consider VA employment pipeline programs that provide administrative fellowships.",
        "ACHE offers veteran scholarship programs — apply early as these are competitive and require FACHE exam commitment.",
      ],
      timelineRange: "6-24 months depending on pathway",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Captures patient care, triage, and medical logistics experience" },
        { layer: "Part B: AI Mediation", action: "Translates combat medic competencies to healthcare management domain; identifies leadership transferability" },
        { layer: "Part C: Advisory Review", action: "Advisor validates clinical-to-administrative pathway and benefit coordination" },
      ],
      explanation: "Medical MOS clinical experience provides foundational understanding of healthcare systems. The Healthcare Management Certificate pathway (80% alignment) offers the fastest bridge from clinical to administrative roles.",
    },
  },
  combat_arms: {
    project_management: {
      pathwayOptions: [
        { name: "PMP Certification (leadership track)", match: "83%", timeframe: "6-12 months" },
        { name: "BS Organizational Leadership", match: "77%", timeframe: "24-36 months" },
        { name: "Lean Six Sigma Black Belt", match: "71%", timeframe: "6-9 months" },
      ],
      constraintRisks: [
        { label: "Technical skill translation", severity: "high", detail: "Combat arms experience requires significant reframing for civilian project contexts" },
        { label: "Education gap", severity: "medium", detail: "May need foundational business coursework before PMP eligibility" },
      ],
      policyFriction: [
        { point: "Combat experience documentation may not align with PMI knowledge areas", framework: "PMI Requirements" },
        { point: "SkillBridge availability varies by unit and deployment cycle", framework: "DoD SkillBridge" },
      ],
      resourcesRequired: [
        { resource: "PMP prep course (35 contact hours)", status: "TA-eligible" },
        { resource: "PMP exam fee ($405)", status: "CA-eligible" },
        { resource: "Leadership portfolio documentation", status: "Self-developed" },
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "yellow", label: "Moderate", detail: "6-12 months feasible but requires dedicated study alongside reframing documentation" },
        { dimension: "Family Impact", status: "yellow", label: "Moderate", detail: "Career identity shift can affect family planning; support resources recommended" },
        { dimension: "Transition Stress", status: "red", label: "High", detail: "Significant cultural and language translation required; combat identity shift is challenging" },
        { dimension: "Domain Alignment", status: "yellow", label: "Partial", detail: "83% alignment — strong leadership overlap but requires civilian business framing" },
      ],
      specialConsiderations: [
        "Combat arms veterans consistently undervalue their leadership experience in civilian contexts — structured resume workshops focusing on quantified impact (personnel managed, budget managed, mission scope) are critical.",
        "SkillBridge programs with defense contractors (Lockheed Martin, Raytheon, SAIC) specifically recruit combat arms leaders for program management roles.",
        "The transition stress for combat arms to civilian office environments is well-documented; consider veteran peer mentoring programs alongside credential pursuit.",
      ],
      timelineRange: "6-18 months depending on pathway",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Captures mission planning, team leadership, and operational coordination experience" },
        { layer: "Part B: AI Mediation", action: "Translates tactical planning to project lifecycle management; maps command experience to stakeholder management" },
        { layer: "Part C: Advisory Review", action: "Advisor bridges military-civilian language gap; validates experience narrative for civilian employers" },
      ],
      explanation: "Combat arms leadership experience translates to project management through mission planning, resource coordination, and team leadership. The primary constraint is reframing tactical experience into civilian project management terminology.",
    },
  },
  admin: {
    project_management: {
      pathwayOptions: [
        { name: "CAPM \u2192 PMP Track", match: "87%", timeframe: "6-12 months" },
        { name: "BS Business Administration", match: "81%", timeframe: "18-24 months" },
        { name: "Agile/Scrum Master", match: "75%", timeframe: "2-4 months" },
      ],
      constraintRisks: [
        { label: "Certification cost", severity: "low", detail: "Both CAPM and PMP are well within CA/TA coverage" },
      ],
      policyFriction: [
        { point: "HR experience may need reframing for project-based roles", framework: "OPM Classification" },
      ],
      resourcesRequired: [
        { resource: "PMI membership + exam ($544)", status: "CA-eligible" },
        { resource: "Agile coursework", status: "TA-eligible" },
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "green", label: "Strong", detail: "Agile/Scrum achievable in 2-4 months; CAPM-PMP ladder in 6-12 months" },
        { dimension: "Family Impact", status: "green", label: "Low", detail: "Flexible study-based pathway; PM roles widely available geographically" },
        { dimension: "Transition Stress", status: "green", label: "Low", detail: "Administrative experience translates naturally to project coordination; minimal identity shift" },
        { dimension: "Domain Alignment", status: "green", label: "High", detail: "87% alignment — personnel management and process workflows map directly to PM competencies" },
      ],
      specialConsiderations: [
        "Admin MOS personnel often overlook their proficiency with Army systems (IPPS-A, eMILPO) as transferable ERP/database experience — highlight this in resumes.",
        "Consider pursuing Agile/Scrum Master first as a fast win, then stack PMP for comprehensive project management credentialing.",
      ],
      timelineRange: "2-12 months depending on pathway",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Documents administrative processes, personnel management, and organizational workflows" },
        { layer: "Part B: AI Mediation", action: "Maps admin/HR competencies to business analysis and project coordination roles" },
        { layer: "Part C: Advisory Review", action: "Advisor confirms documentation and identifies bridging opportunities" },
      ],
      explanation: "Administrative MOS competencies in personnel management, process coordination, and organizational workflows translate directly to project management and business analysis roles with minimal additional credentialing.",
    },
  },
};

function getDefaultGoal(mos: string): string {
  const defaults: Record<string, string> = {
    logistics: "cybersecurity",
    intel: "cybersecurity",
    comms: "cybersecurity",
    combat_arms: "project_management",
    medical: "healthcare_admin",
    admin: "project_management",
  };
  return defaults[mos] || "cybersecurity";
}

function getResult(mos: string, goal: string): PathwayResult | null {
  return PATHWAY_DATA[mos]?.[goal] || null;
}

interface ConstraintState {
  shortTimeline: boolean;
  noFunding: boolean;
  noSkillBridge: boolean;
  familyRelocation: boolean;
  clearanceLapse: boolean;
}

function getConstraintAlerts(constraints: ConstraintState) {
  const alerts: Array<{ icon: typeof AlertTriangle; color: string; label: string; detail: string; framework: string }> = [];

  if (constraints.shortTimeline) {
    alerts.push(
      { icon: Clock, color: "text-red-500", label: "Credential completion risk", detail: "Less than 12 months may not allow completion of multi-step certification tracks. Pathway options may be limited to single-exam credentials.", framework: "TAP/SFL-TAP Timeline" },
      { icon: DollarSign, color: "text-orange-500", label: "Education funding conflict", detail: "TA benefits require active-duty enrollment; short timeline compresses available semesters. Post-service benefits (GI Bill) may be more appropriate.", framework: "DoD TA / Ch. 33 GI Bill" },
      { icon: Zap, color: "text-red-500", label: "Timeline compression", detail: "Accelerated pathways carry higher attrition risk. Consider credential stacking post-separation with GI Bill.", framework: "Credentialing Assistance" },
    );
  }

  if (constraints.noFunding) {
    alerts.push(
      { icon: DollarSign, color: "text-red-500", label: "No tuition assistance available", detail: "Without TA or CA, pathway costs fall to service member or post-service GI Bill. Prioritize employer-funded certifications.", framework: "DoD TA / Army CA" },
      { icon: FileWarning, color: "text-orange-500", label: "Credential access limited", detail: "Many certification prep programs require funded enrollment. Free alternatives (MOOCs, open courseware) may be available.", framework: "ArmyIgnitED" },
    );
  }

  if (constraints.noSkillBridge) {
    alerts.push(
      { icon: Lock, color: "text-orange-500", label: "No SkillBridge internship", detail: "Without SkillBridge, service member loses 6-month industry immersion opportunity. Civilian employer connections must be built independently.", framework: "DoD SkillBridge" },
      { icon: Target, color: "text-yellow-500", label: "Employer pipeline disrupted", detail: "SkillBridge provides direct employer engagement. Alternative: leverage veteran hiring programs post-separation.", framework: "VETS Program / USERRA" },
    );
  }

  if (constraints.familyRelocation) {
    alerts.push(
      { icon: AlertTriangle, color: "text-orange-500", label: "Geographic constraint", detail: "Family relocation requirements may limit program options to online-only or specific metro areas. In-person cohort programs may not be feasible.", framework: "PCS / ETS Planning" },
      { icon: BookOpen, color: "text-yellow-500", label: "Program format restriction", detail: "Prioritize nationally accredited online programs or institutions with military-friendly transfer policies.", framework: "SOC / MOU Agreements" },
    );
  }

  if (constraints.clearanceLapse) {
    alerts.push(
      { icon: Shield, color: "text-red-500", label: "Clearance monetization at risk", detail: "Security clearance has market value in cybersecurity and intelligence roles. Lapse eliminates this competitive advantage.", framework: "ODNI / DSS Policy" },
      { icon: Clock, color: "text-orange-500", label: "Transition timing critical", detail: "Must secure cleared-position employment within clearance validity window. Coordinate with transition counselor immediately.", framework: "SF-86 / eQIP Timeline" },
    );
  }

  return alerts;
}

function ArchitectureVisualization({ activeLayer }: { activeLayer: number }) {
  const layers = [
    { id: 0, label: "Part A", title: "Service Member Interface", color: "from-blue-500/20 to-blue-600/10", border: "border-blue-500/40", glow: "shadow-blue-500/20", icon: User, desc: "Input capture" },
    { id: 1, label: "Part B", title: "AI Mediation Framework", color: "from-purple-500/20 to-purple-600/10", border: "border-purple-500/40", glow: "shadow-purple-500/20", icon: Cpu, desc: "Translation & constraint binding" },
    { id: 2, label: "Part C", title: "Advisory & Human Review", color: "from-green-500/20 to-green-600/10", border: "border-green-500/40", glow: "shadow-green-500/20", icon: Shield, desc: "Human attestation" },
  ];

  return (
    <div className="flex items-center gap-2 py-4" data-testid="architecture-visualization">
      {layers.map((layer, i) => (
        <div key={layer.id} className="flex items-center gap-2 flex-1">
          <div
            className={`flex-1 p-3 rounded-lg border-2 bg-gradient-to-b transition-all duration-700 ${layer.color} ${
              activeLayer >= layer.id
                ? `${layer.border} shadow-lg ${layer.glow} scale-[1.02]`
                : "border-border/30 opacity-40 scale-100"
            }`}
            data-testid={`arch-layer-${layer.id}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <layer.icon className={`w-4 h-4 transition-all duration-700 ${activeLayer >= layer.id ? "text-foreground" : "text-muted-foreground/50"}`} />
              <span className={`text-xs font-mono font-bold transition-all duration-700 ${activeLayer >= layer.id ? "text-foreground" : "text-muted-foreground/50"}`}>{layer.label}</span>
            </div>
            <p className={`text-[10px] transition-all duration-700 ${activeLayer >= layer.id ? "text-muted-foreground" : "text-muted-foreground/30"}`}>{layer.desc}</p>
            {activeLayer === layer.id && (
              <div className="mt-2 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                <span className="text-[9px] font-mono text-primary">PROCESSING</span>
              </div>
            )}
            {activeLayer > layer.id && (
              <div className="mt-2 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-[9px] font-mono text-green-500">COMPLETE</span>
              </div>
            )}
          </div>
          {i < layers.length - 1 && (
            <div className={`flex-shrink-0 transition-all duration-500 ${activeLayer > i ? "text-primary" : "text-muted-foreground/20"}`}>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function ScenarioDemoTab() {
  const [persona, setPersona] = useState<PersonaConfig>({
    rank: "E-6",
    yearsOfService: "10",
    mos: "logistics",
    careerGoal: "cybersecurity",
  });

  const [constraints, setConstraints] = useState<ConstraintState>({
    shortTimeline: false,
    noFunding: false,
    noSkillBridge: false,
    familyRelocation: false,
    clearanceLapse: false,
  });

  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<PathwayResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeLayer, setActiveLayer] = useState(-1);
  const [revealStage, setRevealStage] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const constraintAlerts = useMemo(() => getConstraintAlerts(constraints), [constraints]);
  const activeConstraintCount = Object.values(constraints).filter(Boolean).length;

  const handleMosChange = (mos: string) => {
    setPersona(prev => ({ ...prev, mos, careerGoal: getDefaultGoal(mos) }));
    resetResult();
  };

  const resetResult = () => {
    setShowResult(false);
    setResult(null);
    setActiveLayer(-1);
    setRevealStage(0);
    setShowExplanation(false);
    setAiError(null);
  };

  const runAnalysis = async () => {
    setIsGenerating(true);
    setShowResult(true);
    setAiError(null);
    setActiveLayer(0);
    setRevealStage(0);
    setShowExplanation(false);

    const prebuilt = getResult(persona.mos, persona.careerGoal);

    if (prebuilt) {
      await new Promise(r => setTimeout(r, 600));
      setActiveLayer(1);
      await new Promise(r => setTimeout(r, 800));
      setActiveLayer(2);
      await new Promise(r => setTimeout(r, 600));
      setActiveLayer(3);
      setResult(prebuilt);
      setIsGenerating(false);
    } else {
      try {
        const mosLabel = MOS_OPTIONS.find(m => m.value === persona.mos)?.label || persona.mos;
        const goalLabel = CAREER_GOALS.find(g => g.value === persona.careerGoal)?.label || persona.careerGoal;

        setActiveLayer(0);
        await new Promise(r => setTimeout(r, 500));
        setActiveLayer(1);

        const res = await apiRequest("POST", "/api/generate-pathway", {
          rank: persona.rank,
          yearsOfService: persona.yearsOfService,
          mos: persona.mos,
          mosLabel,
          careerGoal: persona.careerGoal,
          goalLabel,
        });
        const data = await res.json();

        if (data.pathwayOptions && data.pathwayOptions.length > 0) {
          setActiveLayer(2);
          await new Promise(r => setTimeout(r, 600));
          setActiveLayer(3);
          setResult(data);
        } else {
          setAiError(data.message || "No pathway data could be generated for this combination. Try a pre-mapped scenario.");
          setActiveLayer(-1);
        }
        setIsGenerating(false);
      } catch (err) {
        setAiError("AI pathway generation is temporarily unavailable. Try a pre-mapped combination (e.g., Logistics \u2192 Cybersecurity).");
        setActiveLayer(-1);
        setIsGenerating(false);
      }
    }
  };

  useEffect(() => {
    if (result && !isGenerating) {
      const timers = [
        setTimeout(() => setRevealStage(1), 200),
        setTimeout(() => setRevealStage(2), 500),
        setTimeout(() => setRevealStage(3), 800),
        setTimeout(() => setRevealStage(4), 1100),
        setTimeout(() => setRevealStage(5), 1400),
        setTimeout(() => setRevealStage(6), 1700),
        setTimeout(() => setRevealStage(7), 2000),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [result, isGenerating]);

  useEffect(() => {
    if (result && revealStage === 1 && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result, revealStage]);

  const isPrebuilt = getResult(persona.mos, persona.careerGoal) !== null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1" data-testid="text-scenario-title">Scenario Pathway Demo</h2>
        <p className="text-sm text-muted-foreground">
          Configure a service member profile to see how the CMGF processes career transition pathways through its three architectural layers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <User className="w-4 h-4" />
              Service Member Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Rank</label>
              <Select value={persona.rank} onValueChange={v => { setPersona(p => ({ ...p, rank: v })); resetResult(); }}>
                <SelectTrigger data-testid="select-rank"><SelectValue /></SelectTrigger>
                <SelectContent>{RANKS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Years of Service</label>
              <Select value={persona.yearsOfService} onValueChange={v => { setPersona(p => ({ ...p, yearsOfService: v })); resetResult(); }}>
                <SelectTrigger data-testid="select-years"><SelectValue /></SelectTrigger>
                <SelectContent>{YEARS.map(y => <SelectItem key={y} value={y}>{y} years</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">MOS / Specialty</label>
              <Select value={persona.mos} onValueChange={handleMosChange}>
                <SelectTrigger data-testid="select-mos"><SelectValue /></SelectTrigger>
                <SelectContent>{MOS_OPTIONS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Career Goal</label>
              <Select value={persona.careerGoal} onValueChange={v => { setPersona(p => ({ ...p, careerGoal: v })); resetResult(); }}>
                <SelectTrigger data-testid="select-career-goal"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CAREER_GOALS.map(g => (
                    <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!isPrebuilt && (
              <div className="p-2 rounded-md bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-xs text-purple-300 font-medium">AI-Generated Pathway</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">This combination will be analyzed using AI grounded in 797 research sources.</p>
              </div>
            )}

            <Button
              className="w-full mt-2"
              onClick={runAnalysis}
              disabled={isGenerating}
              data-testid="button-run-scenario"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4 mr-2" />
                  Run Scenario Analysis
                </>
              )}
            </Button>

            {showResult && result && (
              <div className="p-3 rounded-md bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Active Profile:</span>{" "}
                  {persona.rank}, {persona.yearsOfService} yrs, {MOS_OPTIONS.find(m => m.value === persona.mos)?.label}
                  {" \u2192 "}{CAREER_GOALS.find(g => g.value === persona.careerGoal)?.label}
                </p>
                {result.generated && (
                  <Badge variant="outline" className="mt-1.5 text-[10px] text-purple-400 border-purple-500/30">AI-Generated</Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Pathway Outcome
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showResult && (
              <ArchitectureVisualization activeLayer={activeLayer} />
            )}

            {!showResult ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Cpu className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Configure a service member profile and click "Run Scenario Analysis" to see CMGF pathway output.</p>
                <p className="text-xs text-muted-foreground mt-2">This demonstrates bounded AI: rule-based translation, not predictive modeling.</p>
              </div>
            ) : isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-sm text-foreground font-medium">
                  {activeLayer === 0 && "Part A: Capturing service member profile..."}
                  {activeLayer === 1 && "Part B: AI Mediation — translating competencies..."}
                  {activeLayer === 2 && "Part C: Preparing advisory review output..."}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {!isPrebuilt ? "Generating pathway from 797 research sources..." : "Processing scenario..."}
                </p>
              </div>
            ) : aiError ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertTriangle className="w-10 h-10 text-orange-500/50 mb-4" />
                <p className="text-sm text-muted-foreground">{aiError}</p>
              </div>
            ) : result ? (
              <div className="space-y-5" ref={resultRef}>
                <div className={`transition-all duration-500 ${revealStage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {result.generated ? (
                      <Badge className="text-[10px] bg-purple-600/20 text-purple-300 border border-purple-500/30" data-testid="badge-ai-generated">AI-Generated &middot; Research-Grounded</Badge>
                    ) : (
                      <Badge className="text-[10px] bg-blue-600/20 text-blue-300 border border-blue-500/30" data-testid="badge-rule-based">Rule-Based &middot; Deterministic</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-3 mt-3">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Estimated Pathway Options</span>
                    <Badge variant="outline" className="text-xs ml-auto">{result.timelineRange}</Badge>
                  </div>
                  <div className="space-y-2">
                    {result.pathwayOptions.map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-md border border-border/50 bg-card" data-testid={`pathway-option-${i}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{i + 1}</div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.timeframe}</p>
                          </div>
                        </div>
                        <Badge variant={parseInt(p.match) >= 85 ? "default" : "outline"} className="text-xs">{p.match} alignment</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`transition-all duration-500 ${revealStage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-foreground">Constraint Risks Identified</span>
                  </div>
                  <div className="space-y-2">
                    {result.constraintRisks.map((r, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-md border border-border/50" data-testid={`constraint-risk-${i}`}>
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          r.severity === "high" ? "bg-red-500" : r.severity === "medium" ? "bg-orange-500" : "bg-yellow-500"
                        }`} />
                        <div>
                          <p className="text-sm font-medium text-foreground">{r.label}</p>
                          <p className="text-xs text-muted-foreground">{r.detail}</p>
                        </div>
                        <Badge variant="outline" className="text-[10px] flex-shrink-0 ml-auto">{r.severity}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`transition-all duration-500 ${revealStage >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <FileWarning className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-foreground">Policy Friction Points</span>
                  </div>
                  <div className="space-y-2">
                    {result.policyFriction.map((f, i) => (
                      <div key={i} className="flex items-start gap-3 p-2 rounded-md bg-muted/30" data-testid={`policy-friction-${i}`}>
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-foreground">{f.point}</p>
                          <p className="text-xs text-muted-foreground">{f.framework}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`transition-all duration-500 ${revealStage >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-foreground">Resources Required</span>
                    <Badge variant="outline" className="text-[10px] ml-auto" data-testid="badge-resource-source">
                      {isPrebuilt ? "Verified Data" : "AI-Estimated"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.resourcesRequired.map((r, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-md border border-border/50 text-sm" data-testid={`resource-${i}`}>
                        <span className="text-foreground text-xs">{r.resource}</span>
                        <Badge variant="outline" className="text-[10px]">{r.status}</Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-2.5 rounded-md bg-muted/30 border border-border/30" data-testid="resource-sourcing-note">
                    <div className="flex items-start gap-2">
                      <Info className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {isPrebuilt ? (
                          <>
                            <span className="font-medium text-foreground/70">Source: </span>
                            Costs and eligibility status are drawn from published fee schedules (e.g., PMI, CompTIA, ISC2) and DoD education benefit catalogs (Tuition Assistance, Credential Assistance, GI Bill) current as of 2025. Figures are approximate and may vary by location, provider, and individual eligibility.
                          </>
                        ) : (
                          <>
                            <span className="font-medium text-foreground/70">Source: </span>
                            Resources were estimated by AI based on the 797-source research library and general knowledge of credentialing bodies and DoD education programs. Costs and eligibility should be independently verified through official program websites before making financial decisions.
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {result.readinessMeasures && result.readinessMeasures.length > 0 && (
                  <div className={`transition-all duration-500 ${revealStage >= 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Readiness Assessment</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {result.readinessMeasures.map((m, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg border text-center ${
                            m.status === "green" ? "border-green-500/30 bg-green-500/5" :
                            m.status === "yellow" ? "border-yellow-500/30 bg-yellow-500/5" :
                            "border-red-500/30 bg-red-500/5"
                          }`}
                          data-testid={`readiness-measure-${i}`}
                        >
                          <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                            m.status === "green" ? "bg-green-500" :
                            m.status === "yellow" ? "bg-yellow-500" :
                            "bg-red-500"
                          }`} />
                          <p className="text-xs font-medium text-foreground mb-0.5">{m.dimension}</p>
                          <p className={`text-[11px] font-semibold ${
                            m.status === "green" ? "text-green-400" :
                            m.status === "yellow" ? "text-yellow-400" :
                            "text-red-400"
                          }`}>{m.label}</p>
                          <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{m.detail}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 pl-1">
                      These are standardized dimensional assessments based on MOS-to-credential domain mapping, not individual predictions.
                    </p>
                  </div>
                )}

                {result.specialConsiderations && result.specialConsiderations.length > 0 && (
                  <div className={`transition-all duration-500 ${revealStage >= 6 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium text-foreground">Special Considerations</span>
                      <Badge variant="outline" className="text-[10px] text-purple-400 border-purple-500/30 ml-auto">System-Generated</Badge>
                    </div>
                    <div className="space-y-2">
                      {result.specialConsiderations.map((note, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-md border border-purple-500/20 bg-purple-500/5" data-testid={`special-consideration-${i}`}>
                          <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[10px] font-bold text-purple-400">{i + 1}</span>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">{note}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 pl-1">
                      These observations are unique to this MOS/goal combination and generated from scenario-specific analysis.
                    </p>
                  </div>
                )}

                <div className={`transition-all duration-500 ${revealStage >= 7 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                  {result.explanation && (
                    <div className="mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-between"
                        onClick={() => setShowExplanation(!showExplanation)}
                        data-testid="button-toggle-explanation"
                      >
                        <div className="flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-500" />
                          <span>Why this recommendation appears</span>
                        </div>
                        {showExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                      {showExplanation && (
                        <div className="mt-2 p-4 rounded-md border border-yellow-500/20 bg-yellow-500/5" data-testid="explanation-panel">
                          <p className="text-sm text-foreground leading-relaxed">{result.explanation}</p>
                          {result.sources && result.sources.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-yellow-500/10">
                              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Grounding Sources</p>
                              <div className="space-y-1">
                                {result.sources.map((s, i) => (
                                  <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                    <Badge variant="outline" className="text-[9px] font-mono flex-shrink-0">{s.id}</Badge>
                                    <span>{s.title} {s.year ? `(${s.year})` : ""}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <p className="text-[10px] text-muted-foreground mt-3 pt-2 border-t border-yellow-500/10">
                            {result.generated
                              ? "AI-generated analysis grounded in CMGF research library. Document-sourced only \u2014 no generative interpretation beyond source content."
                              : "Rule-based analysis from curated pathway data. Deterministic output, not AI-generated."
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">CMGF Three-Layer Processing</span>
                  </div>
                  <div className="space-y-2">
                    {result.cmgfLayers.map((l, i) => (
                      <div key={i} className="p-3 rounded-md border border-primary/20 bg-primary/5" data-testid={`cmgf-layer-${i}`}>
                        <p className="text-xs font-mono uppercase tracking-wider text-primary mb-1">{l.layer}</p>
                        <p className="text-sm text-foreground">{l.action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            Constraint Detection Engine
            {activeConstraintCount > 0 && (
              <Badge variant="destructive" className="text-xs ml-2">{activeConstraintCount} active</Badge>
            )}
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Toggle conditions to see how the CMGF identifies binding constraints in real time. This demonstrates deterministic constraint logic — the core of the CMGF thesis.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[
              { key: "shortTimeline" as const, label: "Less than 12 months remaining", description: "Service member is within final year before ETS/separation" },
              { key: "noFunding" as const, label: "No tuition assistance available", description: "TA/CA benefits exhausted or unit-restricted" },
              { key: "noSkillBridge" as const, label: "SkillBridge not approved", description: "Command denied SkillBridge participation" },
              { key: "familyRelocation" as const, label: "Family relocation required", description: "Must relocate for family needs upon separation" },
              { key: "clearanceLapse" as const, label: "Security clearance lapsing", description: "Clearance will expire within transition window" },
            ].map(toggle => (
              <div
                key={toggle.key}
                className={`p-4 rounded-md border transition-all ${
                  constraints[toggle.key]
                    ? "border-orange-500/50 bg-orange-500/5"
                    : "border-border/50"
                }`}
                data-testid={`constraint-toggle-${toggle.key}`}
              >
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="text-sm font-medium text-foreground">{toggle.label}</span>
                  <Switch
                    checked={constraints[toggle.key]}
                    onCheckedChange={v => setConstraints(prev => ({ ...prev, [toggle.key]: v }))}
                    data-testid={`switch-${toggle.key}`}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{toggle.description}</p>
              </div>
            ))}
          </div>

          {activeConstraintCount > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold text-foreground">System Response: {constraintAlerts.length} constraints detected</span>
              </div>
              {constraintAlerts.map((alert, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-md border border-orange-500/30 bg-orange-500/5" data-testid={`constraint-alert-${i}`}>
                  <alert.icon className={`w-4 h-4 ${alert.color} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{alert.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{alert.detail}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] flex-shrink-0">{alert.framework}</Badge>
                </div>
              ))}
              <div className="p-3 rounded-md bg-muted/50 mt-4">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Architecture note:</span> These constraints are deterministic rule-based detections, not predictions. The CMGF identifies binding conditions from policy and timeline data — it does not score, rank, or predict individual outcomes. This is constraint binding, not risk modeling.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-10 h-10 text-green-500/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No active constraints. Toggle conditions above to see constraint detection in action.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
