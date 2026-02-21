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
  Loader2, ChevronDown, ChevronUp, Sparkles, Info,
  MessageSquare, Send, Brain
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

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
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
        { name: "IT Bridge → Security+ → SOC Analyst", match: "68%", timeframe: "12-18 months" },
        { name: "CompTIA A+/Net+ → Security+ Stack", match: "74%", timeframe: "9-15 months" },
        { name: "BS Cybersecurity (transfer credits)", match: "58%", timeframe: "24-36 months" },
      ],
      constraintRisks: [
        { label: "Tier 2 occupation barrier", severity: "high", detail: "Cybersecurity is not an entry occupation — it requires foundational domains (networking, OS, systems admin) that logistics MOS does not provide" },
        { label: "Certification failure risk", severity: "high", detail: "Without prior technical exposure, Security+ pass rates drop significantly. Math/logic gaps and lack of hands-on practice are primary failure drivers" },
        { label: "Experience gap for hiring", severity: "medium", detail: "Employers expect networking knowledge, lab work, or IT help desk background. Home labs, CTF competitions, or cloud labs can substitute but require time investment" },
      ],
      policyFriction: [
        { point: "TA funding cap may not cover full credential stack (A+ → Net+ → Security+)", framework: "DoD TA Policy" },
        { point: "Credentialing Assistance limited to approved list — prerequisite certs may not qualify", framework: "Army CA Program" },
        { point: "12-18 month realistic timeline may exceed remaining service window", framework: "TAP/SFL-TAP" },
      ],
      resourcesRequired: [
        { resource: "CompTIA A+ voucher ($358)", status: "CA-eligible" },
        { resource: "CompTIA Network+ voucher ($358)", status: "CA-eligible" },
        { resource: "CompTIA Security+ voucher ($392)", status: "CA-eligible" },
        { resource: "Hands-on lab environment (TryHackMe/HackTheBox)", status: "Self-funded ($10-14/mo)" },
        { resource: "Career counselor coordination", status: "Required" },
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "red", label: "Extended", detail: "Cybersecurity is a Tier 2 occupation requiring foundational IT domains first. Realistic timeline: 12-18 months with no prior tech experience; entry SOC Analyst roles require networking + Security+ minimum" },
        { dimension: "Family Impact", status: "yellow", label: "Moderate", detail: "Extended study timeline (9-18 months) requires sustained family support; evening/weekend lab work common during credential stacking phase" },
        { dimension: "Transition Stress", status: "red", label: "High", detail: "Full domain change from logistics to cybersecurity. Must build networking, operating systems, and security fundamentals from scratch — high cognitive load and certification failure risk" },
        { dimension: "Domain Alignment", status: "red", label: "Low", detail: "Logistics MOS provides no foundational IT, networking, or systems administration experience. Prior experience alignment score: minimal. Credential relevance must be built entirely through training" },
      ],
      specialConsiderations: [
        "Cybersecurity is structurally a Tier 2/3 occupation — it depends on prior capability in IT support, networking, or systems administration. Logistics MOS (88M/92A) provides none of these foundational domains, making this a full capability-building transition rather than a credential translation.",
        "The recommended credential stack is A+ → Network+ → Security+ in sequence. Skipping foundational certs dramatically increases Security+ failure rates. Employers hiring SOC Analysts weight: networking knowledge (high), Security+ (medium-high), degree (low-medium), hands-on experience (medium).",
        "Experience substitution is available: home labs, Capture the Flag competitions, TryHackMe/HackTheBox platforms, and cloud labs all generate employability signals even without IT job history. Budget 2-4 hours/week for lab work alongside certification study.",
      ],
      timelineRange: "12-18 months (no prior IT) · 6-12 months (with IT bridge experience)",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Captures MOS skills, credential inventory, career goal declaration — flags absence of foundational IT domains" },
        { layer: "Part B: AI Mediation", action: "Classifies cybersecurity as Tier 2 occupation; identifies prerequisite domain gaps (networking, OS, security fundamentals); surfaces credential stacking sequence and experience equivalency pathways" },
        { layer: "Part C: Advisory Review", action: "Human advisor validates timeline feasibility against ETS, confirms credential stacking order, connects learner with lab resources and mentorship programs" },
      ],
      explanation: "Cybersecurity is a transition occupation, not an entry occupation — it depends on foundational domains (IT support, networking, systems admin) that logistics MOS does not provide. This analysis surfaces the structural reality: 88M/92A personnel face a full capability-building pathway requiring 12-18 months minimum. The IT Bridge pathway is recommended because it builds prerequisite knowledge before attempting cybersecurity credentialing, reducing failure risk. Entry roles (SOC Analyst, Security Technician) have specific prerequisite weights that CMGF decomposes for transparent advising.",
    },
    project_management: {
      pathwayOptions: [
        { name: "PMP Certification Track", match: "91%", timeframe: "3-6 months" },
        { name: "CAPM → PMP Ladder", match: "88%", timeframe: "6-12 months" },
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
        { name: "Security+ → CISSP → Threat Analyst", match: "88%", timeframe: "6-12 months" },
        { name: "CEH + OSCP → Penetration Tester", match: "82%", timeframe: "9-15 months" },
        { name: "CySA+ → GRC Analyst Track", match: "80%", timeframe: "4-8 months" },
      ],
      constraintRisks: [
        { label: "Classification barrier", severity: "medium", detail: "Classified experience documentation limited for civilian credentials; must prepare unclassified equivalents for ISC2/CompTIA applications" },
        { label: "Clearance monetization window", severity: "medium", detail: "TS/SCI clearance is a high-value asset in cybersecurity; narrow window to capitalize before lapse. Begin employer outreach 6+ months pre-ETS" },
        { label: "Certification cost stacking", severity: "low", detail: "CISSP ($749) + annual CPE maintenance costs are significant; plan funding across CA, TA, and self-pay" },
      ],
      policyFriction: [
        { point: "Classified experience may not count toward civilian certification hours", framework: "ISC2 Requirements" },
        { point: "Clearance reciprocity timelines vary by agency", framework: "ODNI Policy" },
        { point: "CISSP requires 5 years experience — military intelligence work qualifies but documentation is complex", framework: "ISC2 Endorsement" },
      ],
      resourcesRequired: [
        { resource: "CompTIA Security+ voucher ($392)", status: "CA-eligible" },
        { resource: "CISSP exam fee ($749)", status: "CA-eligible" },
        { resource: "ISC2 training course", status: "TA-eligible" },
        { resource: "CPE maintenance plan", status: "Self-funded post-service" },
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "green", label: "Strong", detail: "Intelligence MOS provides foundational domains (threat analysis, classified systems, risk assessment) that accelerate cybersecurity credentialing. 3-6 month transition time typical for cyber-adjacent military experience" },
        { dimension: "Family Impact", status: "green", label: "Low", detail: "Study-based credentialing; high-paying cleared cybersecurity roles ($85k-$130k+) reduce financial transition stress" },
        { dimension: "Transition Stress", status: "yellow", label: "Moderate", detail: "Must navigate classification barriers in experience documentation and build civilian employer narrative for classified analytical work" },
        { dimension: "Domain Alignment", status: "green", label: "High", detail: "88% alignment — intelligence MOS provides foundational domains (threat analysis, risk assessment, classified systems operations) that cybersecurity depends on. This is a Tier 1 → Tier 2 transition with strong prerequisite satisfaction" },
      ],
      specialConsiderations: [
        "Intelligence MOS holders have a structural advantage: cybersecurity is a Tier 2 occupation requiring foundational analytical and systems experience — intel MOS provides these prerequisites directly, unlike non-technical MOS transitions that require 6-12 months of foundational training first.",
        "Entry role targeting matters: SOC Analyst and Vulnerability Analyst roles weight networking knowledge + Security+ heavily, while GRC Analyst roles weight policy knowledge + analytical depth — intel MOS aligns more naturally with threat analysis and GRC tracks.",
        "TS/SCI clearance holders command $15k-$30k salary premiums in cybersecurity. This is a time-decaying asset — begin employer outreach and obtain Security+ before ETS to maximize the cleared-cyber pipeline.",
      ],
      timelineRange: "3-6 months (with prior clearance/experience) · 6-12 months (CISSP track)",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Captures SIGINT/HUMINT/GEOINT skill sets, clearance level, and analytical methodology experience — identifies strong foundational domain overlap" },
        { layer: "Part B: AI Mediation", action: "Classifies intel→cyber as Tier 1→2 transition with high prerequisite satisfaction; maps threat analysis, risk assessment, and classified systems operations to cybersecurity credential domains; surfaces entry role taxonomy (SOC Analyst, GRC Analyst, Threat Analyst)" },
        { layer: "Part C: Advisory Review", action: "Advisor manages classification-sensitive documentation, validates unclassified experience narratives for ISC2, and coordinates clearance monetization timeline with employer outreach" },
      ],
      explanation: "Intelligence MOS provides strong foundational domains that cybersecurity depends on as a Tier 2 occupation. Threat analysis, risk assessment, and classified system operations map directly to cybersecurity credential domains. Unlike non-technical MOS transitions requiring 12-18 months of foundational training, intel personnel can target cybersecurity roles in 3-6 months. The primary constraint is documentation of classified experience for civilian credential bodies.",
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
        { name: "Security+ → CySA+ → SOC Analyst", match: "90%", timeframe: "3-9 months" },
        { name: "CCNA Security → Network Defense", match: "88%", timeframe: "4-8 months" },
        { name: "Security+ → CISSP → Security Engineer", match: "82%", timeframe: "9-15 months" },
      ],
      constraintRisks: [
        { label: "Credential redundancy risk", severity: "low", detail: "Signal MOS may already hold Network+ or equivalent — verify existing certs before purchasing vouchers to avoid wasting CA funds" },
        { label: "Specialization choice paralysis", severity: "low", detail: "Multiple high-match pathways available (SOC, network defense, pen testing); career counselor should help narrow focus based on interest and market demand" },
        { label: "Market competition in entry roles", severity: "medium", detail: "SOC Analyst positions are competitive; hands-on lab work and CTF experience differentiate candidates beyond certifications alone" },
      ],
      policyFriction: [
        { point: "Multiple cert exams may exceed annual CA limit — prioritize Security+ first", framework: "Army CA Program" },
        { point: "CySA+ and CCNA Security may require separate funding cycles", framework: "DoD TA Policy" },
      ],
      resourcesRequired: [
        { resource: "CompTIA Security+ voucher ($392)", status: "CA-eligible" },
        { resource: "CompTIA CySA+ voucher ($392)", status: "CA-eligible" },
        { resource: "Cisco learning subscription", status: "TA-eligible" },
        { resource: "Lab environment (TryHackMe/HackTheBox)", status: "Self-funded ($10-14/mo)" },
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "green", label: "Strong", detail: "Signal/Comms MOS already possesses the foundational domains (networking, systems, COMSEC) that cybersecurity depends on. Transition time: 0-3 months for experienced personnel, 3-9 months for full credential stacking" },
        { dimension: "Family Impact", status: "green", label: "Low", detail: "Short transition timeline and high civilian demand ($55k-$80k entry, $85k-$120k mid) reduce financial uncertainty during separation" },
        { dimension: "Transition Stress", status: "green", label: "Low", detail: "Cybersecurity is a natural lateral move from network operations — same domain, adjacent capability. Minimal new foundational learning required" },
        { dimension: "Domain Alignment", status: "green", label: "Very High", detail: "90% alignment — Signal/Comms MOS provides the exact foundational domains (networking, OS, systems admin) that cybersecurity depends on as a Tier 2 occupation. This is the strongest MOS-to-cyber pipeline" },
      ],
      specialConsiderations: [
        "Signal/Comms MOS is the ideal cybersecurity feeder pipeline: networking, COMSEC, and infrastructure management are the exact foundational domains that cybersecurity depends on as a Tier 2 occupation. Where non-technical MOS holders need 12-18 months of foundational training, 25B/25U personnel can target entry cybersecurity roles in 0-3 months.",
        "Entry role targeting: SOC Analyst roles weight networking knowledge (high) and Security+ (medium-high). Signal MOS holders with Network+ already satisfy the primary prerequisite weight — Security+ alone may be sufficient for entry SOC positions.",
        "Experience substitution advantage: military network configuration, COMSEC operations, and infrastructure management count as direct experience equivalency for cybersecurity employers. Document specific systems, protocols, and operational responsibilities for resume translation.",
      ],
      timelineRange: "0-3 months (with existing certs) · 3-9 months (full credential stack)",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Captures network configuration, COMSEC, and signal operations experience — identifies strong foundational domain overlap with cybersecurity prerequisites" },
        { layer: "Part B: AI Mediation", action: "Classifies comms→cyber as lateral Tier 1→2 transition with highest prerequisite satisfaction (90%); surfaces entry role taxonomy (SOC Analyst, Network Defense, Security Engineer) with prerequisite weight matching" },
        { layer: "Part C: Advisory Review", action: "Advisor verifies existing certifications, coordinates fast-track credentialing, and connects with cleared-cyber employer pipeline" },
      ],
      explanation: "Signal/Comms MOS provides the strongest cybersecurity transition pipeline. Networking, COMSEC, and infrastructure management are the exact foundational domains cybersecurity depends on. Where non-technical MOS holders require 12-18 months of capability building, 25B/25U personnel can target SOC Analyst roles in 0-3 months. Wage mobility is strong ($55k-$80k entry → $130k+ senior).",
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
        { name: "CAPM → PMP Track", match: "87%", timeframe: "6-12 months" },
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

function EngineOutputPanel({ result, constraints, constraintAlerts, isPrebuilt }: {
  result: PathwayResult;
  constraints: ConstraintState;
  constraintAlerts: ReturnType<typeof getConstraintAlerts>;
  isPrebuilt: boolean;
}) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    pathways: true,
    readiness: true,
    constraints: false,
    policy: false,
    resources: false,
    considerations: false,
    layers: false,
  });

  const toggle = (key: string) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));

  const activeConstraintCount = Object.values(constraints).filter(Boolean).length;

  const sections = [
    {
      key: "readiness",
      icon: TrendingUp,
      iconColor: "text-primary",
      title: "Readiness Assessment",
      count: result.readinessMeasures.length,
      content: (
        <div className="grid grid-cols-2 gap-2">
          {result.readinessMeasures.map((m, i) => (
            <div
              key={i}
              className={`p-2 rounded-md border text-center ${
                m.status === "green" ? "border-green-500/30 bg-green-500/5" :
                m.status === "yellow" ? "border-yellow-500/30 bg-yellow-500/5" :
                "border-red-500/30 bg-red-500/5"
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full mx-auto mb-1 ${
                m.status === "green" ? "bg-green-500" :
                m.status === "yellow" ? "bg-yellow-500" :
                "bg-red-500"
              }`} />
              <p className="text-[10px] font-medium text-foreground">{m.dimension}</p>
              <p className={`text-[9px] font-semibold ${
                m.status === "green" ? "text-green-400" :
                m.status === "yellow" ? "text-yellow-400" :
                "text-red-400"
              }`}>{m.label}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "pathways",
      icon: Target,
      iconColor: "text-primary",
      title: "Pathway Options",
      badge: result.timelineRange,
      count: result.pathwayOptions.length,
      content: (
        <div className="space-y-1.5">
          {result.pathwayOptions.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-md border border-border/50 bg-card text-xs">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">{i + 1}</div>
                <div>
                  <p className="font-medium text-foreground text-[11px]">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.timeframe}</p>
                </div>
              </div>
              <Badge variant={parseInt(p.match) >= 85 ? "default" : "outline"} className="text-[9px]">{p.match}</Badge>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "constraints",
      icon: AlertTriangle,
      iconColor: "text-orange-500",
      title: "Constraint Risks",
      count: result.constraintRisks.length + (activeConstraintCount > 0 ? constraintAlerts.length : 0),
      content: (
        <div className="space-y-1.5">
          {result.constraintRisks.map((r, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded-md border border-border/50 text-xs">
              <div className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${
                r.severity === "high" ? "bg-red-500" : r.severity === "medium" ? "bg-orange-500" : "bg-yellow-500"
              }`} />
              <div className="min-w-0">
                <p className="font-medium text-foreground text-[11px]">{r.label}</p>
                <p className="text-[10px] text-muted-foreground">{r.detail}</p>
              </div>
            </div>
          ))}
          {activeConstraintCount > 0 && (
            <>
              <div className="border-t border-orange-500/20 pt-1.5 mt-1.5">
                <p className="text-[10px] font-mono uppercase text-orange-400 mb-1">{constraintAlerts.length} active constraint alerts</p>
              </div>
              {constraintAlerts.map((alert, i) => (
                <div key={`alert-${i}`} className="flex items-start gap-2 p-2 rounded-md border border-orange-500/30 bg-orange-500/5 text-xs">
                  <alert.icon className={`w-3 h-3 ${alert.color} flex-shrink-0 mt-0.5`} />
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-[11px]">{alert.label}</p>
                    <p className="text-[10px] text-muted-foreground">{alert.detail}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      ),
    },
    {
      key: "policy",
      icon: FileWarning,
      iconColor: "text-yellow-500",
      title: "Policy Friction",
      count: result.policyFriction.length,
      content: (
        <div className="space-y-1">
          {result.policyFriction.map((f, i) => (
            <div key={i} className="flex items-start gap-2 p-1.5 rounded-md bg-muted/30 text-xs">
              <ArrowRight className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[11px] text-foreground">{f.point}</p>
                <p className="text-[10px] text-muted-foreground">{f.framework}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "resources",
      icon: DollarSign,
      iconColor: "text-green-500",
      title: "Resources Required",
      count: result.resourcesRequired.length,
      content: (
        <div className="space-y-1">
          {result.resourcesRequired.map((r, i) => (
            <div key={i} className="flex items-center justify-between p-1.5 rounded-md border border-border/50 text-xs">
              <span className="text-foreground text-[11px]">{r.resource}</span>
              <Badge variant="outline" className="text-[9px]">{r.status}</Badge>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "considerations",
      icon: Sparkles,
      iconColor: "text-purple-400",
      title: "Special Considerations",
      count: result.specialConsiderations.length,
      content: (
        <div className="space-y-1.5">
          {result.specialConsiderations.map((note, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded-md border border-purple-500/20 bg-purple-500/5 text-xs">
              <span className="text-[10px] font-bold text-purple-400 flex-shrink-0">{i + 1}.</span>
              <p className="text-[11px] text-foreground leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "layers",
      icon: Layers,
      iconColor: "text-primary",
      title: "CMGF Three-Layer Processing",
      count: result.cmgfLayers.length,
      content: (
        <div className="space-y-1.5">
          {result.cmgfLayers.map((l, i) => (
            <div key={i} className="p-2 rounded-md border border-primary/20 bg-primary/5 text-xs">
              <p className="text-[10px] font-mono uppercase tracking-wider text-primary mb-0.5">{l.layer}</p>
              <p className="text-[11px] text-foreground">{l.action}</p>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-1" data-testid="engine-output-panel">
      <div className="flex items-center gap-2 mb-2">
        <Brain className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Engine Output — AI Input Context</span>
      </div>
      <p className="text-[10px] text-muted-foreground mb-3">
        This is the deterministic analysis the AI advisor uses to answer your questions. Everything the AI says is grounded in this data.
      </p>
      {sections.map(section => (
        <div key={section.key} className="border border-border/40 rounded-md overflow-hidden">
          <button
            className="w-full flex items-center gap-2 p-2 text-left hover:bg-muted/30 transition-colors"
            onClick={() => toggle(section.key)}
            data-testid={`toggle-section-${section.key}`}
          >
            <section.icon className={`w-3.5 h-3.5 ${section.iconColor} flex-shrink-0`} />
            <span className="text-xs font-medium text-foreground flex-1">{section.title}</span>
            <Badge variant="outline" className="text-[9px]">{section.count}</Badge>
            {expandedSections[section.key] ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
          </button>
          {expandedSections[section.key] && (
            <div className="px-2 pb-2">
              {section.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AdvisorChat({ result, persona, constraints, constraintAlerts }: {
  result: PathwayResult;
  persona: PersonaConfig;
  constraints: ConstraintState;
  constraintAlerts: ReturnType<typeof getConstraintAlerts>;
}) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const mosLabel = MOS_OPTIONS.find(m => m.value === persona.mos)?.label || persona.mos;
  const goalLabel = CAREER_GOALS.find(g => g.value === persona.careerGoal)?.label || persona.careerGoal;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    const activeConstraintCount = Object.values(constraints).filter(Boolean).length;

    const taEligible = result.resourcesRequired.filter(r => r.status.toLowerCase().includes("ta-eligible"));
    const caEligible = result.resourcesRequired.filter(r => r.status.toLowerCase().includes("ca-eligible"));
    const selfFunded = result.resourcesRequired.filter(r => r.status.toLowerCase().includes("self-funded") || r.status.toLowerCase().includes("self-pay"));

    const domainMeasure = result.readinessMeasures.find(m => m.dimension === "Domain Alignment");
    const domainStatus = domainMeasure?.status || "yellow";

    const hasFundingConstraint = constraints.noFunding;
    const hasTimelineConstraint = constraints.shortTimeline;

    const taFriction = result.policyFriction.filter(p =>
      p.point.toLowerCase().includes("ta") || p.point.toLowerCase().includes("ca") || p.point.toLowerCase().includes("tuition") || p.point.toLowerCase().includes("funding")
    );

    let educationReview = "";
    if (domainStatus === "green") {
      educationReview = `I've reviewed your documented education and military training records. Your ${mosLabel} background provides strong foundational alignment with ${goalLabel} — the system shows ${domainMeasure?.label?.toLowerCase() || "good"} domain overlap.`;
    } else if (domainStatus === "yellow") {
      educationReview = `I've reviewed your documented education and military training records. Your ${mosLabel} background gives you moderate alignment with ${goalLabel} — there are transferable skills, but some gaps the analysis has identified.`;
    } else {
      educationReview = `I've reviewed your documented education and military training records. Your ${mosLabel} background doesn't directly overlap with ${goalLabel} — the engine has identified foundational skill areas you'll need to build. This is a full capability-building transition, not a credential translation.`;
    }

    let fundingReview = "";
    if (caEligible.length > 0 || taEligible.length > 0 || selfFunded.length > 0) {
      const parts = [];
      if (caEligible.length > 0) parts.push(`**${caEligible.length}** credential${caEligible.length > 1 ? "s" : ""} eligible for Credentialing Assistance (CA)`);
      if (taEligible.length > 0) parts.push(`**${taEligible.length}** resource${taEligible.length > 1 ? "s" : ""} eligible for Tuition Assistance (TA)`);
      if (selfFunded.length > 0) parts.push(`**${selfFunded.length}** item${selfFunded.length > 1 ? "s" : ""} that would be self-funded`);
      fundingReview = `\n\nI've also looked at your available TA/CA funding options. For your recommended pathway, I'm seeing ${parts.join(", ")}.`;
      if (hasFundingConstraint) {
        fundingReview += ` However, your funding situation is flagged as constrained — we should discuss alternative funding strategies.`;
      } else if (taFriction.length > 0) {
        fundingReview += ` There ${taFriction.length === 1 ? "is" : "are"} ${taFriction.length} funding-related policy friction point${taFriction.length > 1 ? "s" : ""} worth discussing.`;
      }
    }

    let stressFactors = "";
    const familyMeasure = result.readinessMeasures.find(m => m.dimension === "Family Impact");
    const stressMeasure = result.readinessMeasures.find(m => m.dimension === "Transition Stress");
    if (familyMeasure?.status === "red" || stressMeasure?.status === "red" || (familyMeasure?.status === "yellow" && selfFunded.length > 0)) {
      stressFactors = ` The financial and time commitments involved could affect family stability — that's something I want to be upfront about.`;
    } else if (hasTimelineConstraint && selfFunded.length > 0) {
      stressFactors = ` With your compressed timeline and some out-of-pocket costs, I want to make sure we plan this carefully.`;
    }

    const readinessNote = result.readinessMeasures.some(m => m.status === "red")
      ? "I do see some areas flagged as high concern — I'd like to walk you through those. "
      : result.readinessMeasures.some(m => m.status === "yellow")
      ? "Most indicators look positive with a few moderate considerations. "
      : "Your readiness indicators are looking strong across the board. ";

    const constraintNote = activeConstraintCount > 0 ? `I also see ${activeConstraintCount} active constraint${activeConstraintCount > 1 ? "s" : ""} that we should discuss. ` : "";

    const opening: ChatMessage = {
      role: "assistant",
      content: `${educationReview}${fundingReview}${stressFactors}\n\nYour top pathway option is **${result.pathwayOptions[0]?.name}** with a ${result.pathwayOptions[0]?.match} alignment match and a projected timeframe of ${result.pathwayOptions[0]?.timeframe}.\n\n${readinessNote}${constraintNote}What would you like to explore first?`,
    };
    setChatMessages([opening]);
  }, [result, persona, constraints]);

  const sendMessageDirect = async (directMessage?: string) => {
    const userMsg = (directMessage || inputValue).trim();
    if (!userMsg || isStreaming) return;
    setInputValue("");
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsStreaming(true);

    const activeConstraintCount = Object.values(constraints).filter(Boolean).length;
    const engineOutput = {
      persona: `${persona.rank}, ${persona.yearsOfService} years, ${mosLabel}`,
      careerGoal: goalLabel,
      timelineRange: result.timelineRange,
      pathwayOptions: result.pathwayOptions,
      readinessMeasures: result.readinessMeasures,
      constraintRisks: result.constraintRisks,
      policyFriction: result.policyFriction,
      resourcesRequired: result.resourcesRequired,
      specialConsiderations: result.specialConsiderations,
      cmgfLayers: result.cmgfLayers,
      explanation: result.explanation,
      activeConstraints: activeConstraintCount > 0 ? constraintAlerts.map(a => ({
        label: a.label,
        detail: a.detail,
        framework: a.framework,
      })) : undefined,
    };

    const existingHistory = chatMessages.map(m => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch("/api/advisor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          engineOutput,
          chatHistory: existingHistory,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let buffer = "";
      let assistantContent = "";

      setChatMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.content) {
              assistantContent += event.content;
              setChatMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantContent };
                return updated;
              });
            }
            if (event.done) break;
          } catch {}
        }
      }
    } catch (error) {
      setChatMessages(prev => [
        ...prev.slice(0, -1),
        { role: "assistant", content: "I'm having trouble connecting right now. Please try again in a moment." },
      ]);
    }

    setIsStreaming(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const sendMessage = () => sendMessageDirect();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "What's my biggest risk?",
    "How should I start?",
    "Break down my TA/CA funding options",
    "What certifications first?",
  ];

  return (
    <div className="flex flex-col h-full" data-testid="advisor-chat">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">CMGF Career Advisor</p>
          <p className="text-[10px] text-muted-foreground">AI grounded in engine output — answers only from deterministic analysis</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-3 min-h-[300px] max-h-[500px] pr-1" data-testid="chat-messages">
        {chatMessages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 border border-border/50 text-foreground"
              }`}
              data-testid={`chat-message-${i}`}
            >
              {msg.content.split("\n").map((line, j) => (
                <p key={j} className={j > 0 ? "mt-2" : ""}>
                  {line.split(/(\*\*[^*]+\*\*)/).map((part, k) =>
                    part.startsWith("**") && part.endsWith("**")
                      ? <strong key={k} className="font-semibold">{part.slice(2, -2)}</strong>
                      : part
                  )}
                </p>
              ))}
              {msg.role === "assistant" && isStreaming && i === chatMessages.length - 1 && (
                <span className="inline-block w-1.5 h-4 bg-primary/50 animate-pulse ml-0.5 align-middle" />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {chatMessages.length <= 1 && (
        <div className="flex flex-wrap gap-1.5 mb-3" data-testid="suggested-questions">
          {suggestedQuestions.map((q, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              className="text-[11px] h-7 px-2.5"
              onClick={() => sendMessageDirect(q)}
              disabled={isStreaming}
              data-testid={`suggested-question-${i}`}
            >
              {q}
            </Button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your transition pathway..."
          className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          disabled={isStreaming}
          data-testid="input-chat-message"
        />
        <Button
          size="sm"
          onClick={sendMessage}
          disabled={!inputValue.trim() || isStreaming}
          data-testid="button-send-message"
        >
          {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
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
    setAiError(null);
  };

  const runAnalysis = async () => {
    setIsGenerating(true);
    setShowResult(true);
    setAiError(null);
    setActiveLayer(0);

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
        setAiError("AI pathway generation is temporarily unavailable. Try a pre-mapped combination (e.g., Logistics → Cybersecurity).");
        setActiveLayer(-1);
        setIsGenerating(false);
      }
    }
  };

  useEffect(() => {
    if (result && !isGenerating && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result, isGenerating]);

  const isPrebuilt = getResult(persona.mos, persona.careerGoal) !== null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1" data-testid="text-scenario-title">Scenario Pathway Demo</h2>
        <p className="text-sm text-muted-foreground">
          Configure a service member profile and run the analysis. The AI advisor will discuss your results using only the engine's deterministic output.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Rank</label>
              <Select value={persona.rank} onValueChange={v => { setPersona(p => ({ ...p, rank: v })); resetResult(); }}>
                <SelectTrigger data-testid="select-rank"><SelectValue /></SelectTrigger>
                <SelectContent>{RANKS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Years of Service</label>
              <Select value={persona.yearsOfService} onValueChange={v => { setPersona(p => ({ ...p, yearsOfService: v })); resetResult(); }}>
                <SelectTrigger data-testid="select-years"><SelectValue /></SelectTrigger>
                <SelectContent>{YEARS.map(y => <SelectItem key={y} value={y}>{y} years</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">MOS / Specialty</label>
              <Select value={persona.mos} onValueChange={handleMosChange}>
                <SelectTrigger data-testid="select-mos"><SelectValue /></SelectTrigger>
                <SelectContent>{MOS_OPTIONS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Career Goal</label>
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
                  <span className="text-xs text-purple-300 font-medium">AI-Generated</span>
                </div>
              </div>
            )}

            <Button
              className="w-full"
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
                  Run Scenario
                </>
              )}
            </Button>

            <div className="border-t border-border/30 pt-3 mt-2">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-orange-500" />
                Constraints
                {activeConstraintCount > 0 && (
                  <Badge variant="destructive" className="text-[9px] ml-1">{activeConstraintCount}</Badge>
                )}
              </p>
              <div className="space-y-2">
                {[
                  { key: "shortTimeline" as const, label: "< 12 months remaining" },
                  { key: "noFunding" as const, label: "No TA available" },
                  { key: "noSkillBridge" as const, label: "No SkillBridge" },
                  { key: "familyRelocation" as const, label: "Family relocation" },
                  { key: "clearanceLapse" as const, label: "Clearance lapsing" },
                ].map(toggle => (
                  <div key={toggle.key} className="flex items-center justify-between gap-2" data-testid={`constraint-toggle-${toggle.key}`}>
                    <span className="text-[11px] text-foreground">{toggle.label}</span>
                    <Switch
                      checked={constraints[toggle.key]}
                      onCheckedChange={v => setConstraints(prev => ({ ...prev, [toggle.key]: v }))}
                      data-testid={`switch-${toggle.key}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3" ref={resultRef}>
          {showResult && (
            <ArchitectureVisualization activeLayer={activeLayer} />
          )}

          {!showResult ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Cpu className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Configure a service member profile and click "Run Scenario" to see CMGF pathway output.</p>
                <p className="text-xs text-muted-foreground mt-2">This demonstrates bounded AI: rule-based translation, not predictive modeling.</p>
              </CardContent>
            </Card>
          ) : isGenerating ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-sm text-foreground font-medium">
                  {activeLayer === 0 && "Part A: Capturing service member profile..."}
                  {activeLayer === 1 && "Part B: AI Mediation — translating competencies..."}
                  {activeLayer === 2 && "Part C: Preparing advisory review output..."}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {!isPrebuilt ? "Generating pathway from 797 research sources..." : "Processing scenario..."}
                </p>
              </CardContent>
            </Card>
          ) : aiError ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <AlertTriangle className="w-10 h-10 text-orange-500/50 mb-4" />
                <p className="text-sm text-muted-foreground">{aiError}</p>
              </CardContent>
            </Card>
          ) : result ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2 order-2 lg:order-1">
                <Card className="h-full">
                  <CardContent className="pt-4 pb-3">
                    <EngineOutputPanel
                      result={result}
                      constraints={constraints}
                      constraintAlerts={constraintAlerts}
                      isPrebuilt={isPrebuilt}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-3 order-1 lg:order-2">
                <Card className="h-full">
                  <CardContent className="pt-4 pb-3">
                    <AdvisorChat
                      result={result}
                      persona={persona}
                      constraints={constraints}
                      constraintAlerts={constraintAlerts}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
