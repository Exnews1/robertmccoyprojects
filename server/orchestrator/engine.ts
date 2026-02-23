import { db } from "../db";
import { syntheticProfiles, scenarioRuns, scenarioOutputs } from "@shared/schema";
import type { InsertSyntheticProfile, SyntheticProfile, ScenarioRun, ScenarioOutput } from "@shared/schema";
import { eq } from "drizzle-orm";

interface ReadinessMeasure {
  dimension: string;
  status: "green" | "yellow" | "red";
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
}

const PATHWAY_DATA: Record<string, Record<string, PathwayResult>> = {
  logistics: {
    cybersecurity: {
      pathwayOptions: [
        { name: "IT Bridge → Security+ → SOC Analyst", match: "68%", timeframe: "12-18 months" },
        { name: "CompTIA A+/Net+ → Security+ Stack", match: "74%", timeframe: "9-15 months" },
        { name: "BS Cybersecurity (transfer credits)", match: "58%", timeframe: "24-36 months" },
      ],
      constraintRisks: [
        { label: "Tier 2 occupation barrier", severity: "high", detail: "Cybersecurity requires foundational IT domains that logistics MOS does not provide" },
        { label: "Certification failure risk", severity: "high", detail: "Without prior technical exposure, Security+ pass rates drop significantly" },
        { label: "Experience gap for hiring", severity: "medium", detail: "Employers expect networking knowledge and IT help desk background" },
      ],
      policyFriction: [
        { point: "Army COOL limits funding to 1 credential per year — sequencing required", framework: "Army COOL Policy" },
        { point: "Total credential cost approaches Army COOL lifetime cap ($4,000)", framework: "Army COOL Policy" },
        { point: "TA annual cap ($4,000) does not cover certification vouchers", framework: "DoD TA Policy" },
      ],
      resourcesRequired: [
        { resource: "CompTIA A+ voucher ($358)", status: "CA-eligible" },
        { resource: "CompTIA Network+ voucher ($358)", status: "CA-eligible" },
        { resource: "CompTIA Security+ voucher ($392)", status: "CA-eligible" },
        { resource: "Hands-on lab environment", status: "Self-funded ($10-14/mo)" },
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "red", label: "Extended", detail: "Cybersecurity is a Tier 2 occupation requiring foundational IT domains first. Realistic: 12-18 months" },
        { dimension: "Family Impact", status: "yellow", label: "Moderate", detail: "Extended study timeline requires sustained family support" },
        { dimension: "Transition Stress", status: "red", label: "High", detail: "Full domain change from logistics to cybersecurity" },
        { dimension: "Domain Alignment", status: "red", label: "Low", detail: "Logistics MOS provides no foundational IT, networking, or systems administration experience" },
      ],
      specialConsiderations: [
        "Cybersecurity is structurally a Tier 2/3 occupation — depends on prior capability in IT support, networking, or systems administration.",
        "Recommended credential stack: A+ → Network+ → Security+ in sequence.",
      ],
      timelineRange: "12-18 months (no prior IT) · 6-12 months (with IT bridge)",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Captures MOS skills, credential inventory, career goal — flags absence of foundational IT domains" },
        { layer: "Part B: AI Mediation", action: "Classifies cybersecurity as Tier 2; identifies prerequisite domain gaps; surfaces credential stacking sequence" },
        { layer: "Part C: Advisory Review", action: "Human advisor validates timeline feasibility against ETS, confirms credential stacking order" },
      ],
      explanation: "Cybersecurity is a transition occupation requiring foundational domains that logistics MOS does not provide. Full capability-building pathway requiring 12-18 months minimum.",
    },
    project_management: {
      pathwayOptions: [
        { name: "PMP Certification Track", match: "91%", timeframe: "3-6 months" },
        { name: "CAPM → PMP Ladder", match: "88%", timeframe: "6-12 months" },
        { name: "MS Project Management", match: "76%", timeframe: "18-24 months" },
      ],
      constraintRisks: [
        { label: "PMP experience requirement", severity: "low", detail: "Military logistics experience typically satisfies 4,500-hour requirement" },
      ],
      policyFriction: [
        { point: "PMI exam fees may exceed single CA voucher limit", framework: "Army CA Program" },
      ],
      resourcesRequired: [
        { resource: "PMP exam fee ($405)", status: "CA-eligible" },
        { resource: "Project management coursework (35 hrs)", status: "TA-eligible" },
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "green", label: "Strong", detail: "PMP achievable in 3-6 months" },
        { dimension: "Family Impact", status: "green", label: "Low", detail: "Study-based pathway with flexible scheduling" },
        { dimension: "Transition Stress", status: "green", label: "Low", detail: "Logistics maps directly to project management" },
        { dimension: "Domain Alignment", status: "green", label: "High", detail: "91% domain overlap" },
      ],
      specialConsiderations: ["Logistics E-6+ personnel typically exceed PMP experience threshold."],
      timelineRange: "3-12 months depending on pathway",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Documents logistics planning and resource allocation experience" },
        { layer: "Part B: AI Mediation", action: "Maps logistics competencies to PMI knowledge areas; high transferability" },
        { layer: "Part C: Advisory Review", action: "Advisor confirms experience hours and validates documentation" },
      ],
      explanation: "Logistics MOS maps directly to PMI knowledge areas with 91% domain alignment.",
    },
    supply_chain: {
      pathwayOptions: [
        { name: "APICS CSCP Certification", match: "94%", timeframe: "3-6 months" },
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
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "green", label: "Strong", detail: "CSCP achievable in 3-6 months" },
        { dimension: "Family Impact", status: "green", label: "Low", detail: "Remote study options" },
        { dimension: "Transition Stress", status: "green", label: "Low", detail: "Near-direct domain match" },
        { dimension: "Domain Alignment", status: "green", label: "Very High", detail: "94% alignment" },
      ],
      specialConsiderations: ["One of the highest-alignment MOS-to-career transitions available."],
      timelineRange: "2-12 months depending on pathway",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Captures warehouse management and distribution experience" },
        { layer: "Part B: AI Mediation", action: "Near-direct translation of military logistics to civilian supply chain" },
        { layer: "Part C: Advisory Review", action: "Advisor validates credential mapping" },
      ],
      explanation: "Military logistics MOS provides near-direct translation to civilian supply chain management with 94% alignment.",
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
        { label: "Classification barrier", severity: "medium", detail: "Classified experience documentation limited for civilian credentials" },
        { label: "Clearance monetization window", severity: "medium", detail: "TS/SCI clearance is a time-decaying asset — begin employer outreach 6+ months pre-ETS" },
      ],
      policyFriction: [
        { point: "CISSP exam fee ($749) consumes significant CA budget", framework: "Army COOL Policy" },
        { point: "Army COOL limits to 1 credential per year", framework: "Army COOL Policy" },
      ],
      resourcesRequired: [
        { resource: "CompTIA Security+ voucher ($392)", status: "CA-eligible" },
        { resource: "CISSP exam fee ($749)", status: "CA-eligible" },
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "green", label: "Strong", detail: "Intel MOS provides foundational domains that accelerate cybersecurity credentialing" },
        { dimension: "Family Impact", status: "green", label: "Low", detail: "High-paying cleared roles ($85k-$130k+) reduce financial stress" },
        { dimension: "Transition Stress", status: "yellow", label: "Moderate", detail: "Must navigate classification barriers in documentation" },
        { dimension: "Domain Alignment", status: "green", label: "High", detail: "88% alignment — threat analysis, risk assessment map directly" },
      ],
      specialConsiderations: ["Intel MOS has structural advantage: cybersecurity prerequisites are already satisfied."],
      timelineRange: "3-6 months (with clearance) · 6-12 months (CISSP track)",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Captures SIGINT/HUMINT skill sets, clearance level, analytical methodology" },
        { layer: "Part B: AI Mediation", action: "Classifies intel→cyber as Tier 1→2 transition with high prerequisite satisfaction" },
        { layer: "Part C: Advisory Review", action: "Advisor manages classification-sensitive documentation" },
      ],
      explanation: "Intelligence MOS provides strong foundational domains for cybersecurity with 88% alignment.",
    },
    data_analytics: {
      pathwayOptions: [
        { name: "Google Data Analytics Certificate", match: "85%", timeframe: "3-6 months" },
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
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "green", label: "Strong", detail: "Google certificate achievable in 3-6 months" },
        { dimension: "Family Impact", status: "green", label: "Low", detail: "Fully remote coursework" },
        { dimension: "Transition Stress", status: "yellow", label: "Moderate", detail: "Programming skill gap requires study" },
        { dimension: "Domain Alignment", status: "green", label: "High", detail: "85% alignment — intel analysis mirrors data analytics" },
      ],
      specialConsiderations: ["Intel analysts with Python exposure from SIGINT tools have a significant head start."],
      timelineRange: "3-18 months depending on pathway",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Documents analytical methodology and pattern recognition" },
        { layer: "Part B: AI Mediation", action: "Maps intel analysis frameworks to data science methodologies" },
        { layer: "Part C: Advisory Review", action: "Advisor reviews civilian equivalency of classified work" },
      ],
      explanation: "Intelligence analysis skills transfer strongly to data analytics with 85% alignment.",
    },
  },
  comms: {
    cybersecurity: {
      pathwayOptions: [
        { name: "Security+ → CySA+ → SOC Analyst", match: "90%", timeframe: "3-9 months" },
        { name: "CCNA Security → Network Defense", match: "88%", timeframe: "4-8 months" },
      ],
      constraintRisks: [
        { label: "Credential redundancy", severity: "low", detail: "Signal MOS may already hold Network+ — verify existing certs" },
      ],
      policyFriction: [
        { point: "Army COOL limits to 1 credential per year", framework: "Army COOL Policy" },
      ],
      resourcesRequired: [
        { resource: "CompTIA Security+ voucher ($392)", status: "CA-eligible" },
        { resource: "CompTIA CySA+ voucher ($392)", status: "CA-eligible" },
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "green", label: "Strong", detail: "Signal MOS already possesses foundational domains. Transition: 0-3 months experienced, 3-9 months full stack" },
        { dimension: "Family Impact", status: "green", label: "Low", detail: "Short timeline and high civilian demand" },
        { dimension: "Transition Stress", status: "green", label: "Low", detail: "Natural lateral move from network operations" },
        { dimension: "Domain Alignment", status: "green", label: "Very High", detail: "90% alignment — strongest MOS-to-cyber pipeline" },
      ],
      specialConsiderations: ["Signal/Comms MOS is the ideal cybersecurity feeder pipeline."],
      timelineRange: "0-3 months (with certs) · 3-9 months (full stack)",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Captures network configuration, COMSEC, signal operations experience" },
        { layer: "Part B: AI Mediation", action: "Classifies comms→cyber as lateral Tier 1→2 transition with highest satisfaction (90%)" },
        { layer: "Part C: Advisory Review", action: "Advisor verifies existing certs and coordinates fast-track credentialing" },
      ],
      explanation: "Signal/Comms MOS provides the strongest cybersecurity transition pipeline with 90% alignment.",
    },
    project_management: {
      pathwayOptions: [
        { name: "PMP Certification Track", match: "84%", timeframe: "3-6 months" },
        { name: "Agile/Scrum Master Certification", match: "80%", timeframe: "2-4 months" },
      ],
      constraintRisks: [
        { label: "Experience documentation", severity: "low", detail: "Signal operations management satisfies PMP experience requirements" },
      ],
      policyFriction: [
        { point: "PMP exam fees covered by CA", framework: "Army CA Program" },
      ],
      resourcesRequired: [
        { resource: "PMP exam fee ($405)", status: "CA-eligible" },
        { resource: "35-hour PM coursework", status: "TA-eligible" },
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "green", label: "Strong", detail: "PMP achievable in 3-6 months" },
        { dimension: "Family Impact", status: "green", label: "Low", detail: "Self-paced study pathway" },
        { dimension: "Transition Stress", status: "green", label: "Low", detail: "Technical project management experience transfers directly" },
        { dimension: "Domain Alignment", status: "green", label: "High", detail: "84% alignment — signal ops management maps to PM" },
      ],
      specialConsiderations: ["Signal officers often manage multi-million dollar technology programs — direct PM equivalency."],
      timelineRange: "2-6 months",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Documents signal project management and technology coordination" },
        { layer: "Part B: AI Mediation", action: "Maps signal operations management to PMI knowledge areas" },
        { layer: "Part C: Advisory Review", action: "Advisor validates experience documentation" },
      ],
      explanation: "Signal/Comms operations management maps strongly to project management with 84% alignment.",
    },
  },
  medical: {
    healthcare_admin: {
      pathwayOptions: [
        { name: "Healthcare Management Certificate", match: "80%", timeframe: "6-12 months" },
        { name: "MHA/MPH Program", match: "86%", timeframe: "18-24 months" },
        { name: "FACHE Certification", match: "74%", timeframe: "12-18 months" },
      ],
      constraintRisks: [
        { label: "Credential gap", severity: "medium", detail: "Administrative experience may be limited for clinical MOS" },
      ],
      policyFriction: [
        { point: "Graduate programs require GRE; waiver may be available", framework: "VA Education Benefits" },
      ],
      resourcesRequired: [
        { resource: "Graduate program tuition", status: "GI Bill eligible" },
        { resource: "ACHE membership ($300)", status: "Self-funded" },
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "yellow", label: "Extended", detail: "MHA programs 18-24 months; certificate track 6-12 months" },
        { dimension: "Family Impact", status: "yellow", label: "Moderate", detail: "Practicum placements may affect location" },
        { dimension: "Transition Stress", status: "yellow", label: "Moderate", detail: "Clinical-to-administrative shift" },
        { dimension: "Domain Alignment", status: "green", label: "High", detail: "86% alignment — healthcare system knowledge strong foundation" },
      ],
      specialConsiderations: ["VA Medical Centers actively recruit veteran healthcare administrators."],
      timelineRange: "6-24 months depending on pathway",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Captures patient care, triage, and medical logistics experience" },
        { layer: "Part B: AI Mediation", action: "Translates combat medic competencies to healthcare management domain" },
        { layer: "Part C: Advisory Review", action: "Advisor validates clinical-to-administrative pathway" },
      ],
      explanation: "Medical MOS clinical experience provides foundational understanding of healthcare systems with 86% alignment.",
    },
    nursing: {
      pathwayOptions: [
        { name: "LPN Bridge → RN (ADN Program)", match: "88%", timeframe: "12-18 months" },
        { name: "BSN Program (GI Bill)", match: "92%", timeframe: "24-36 months" },
        { name: "Accelerated BSN (2nd degree)", match: "85%", timeframe: "12-16 months" },
      ],
      constraintRisks: [
        { label: "Licensure requirements", severity: "medium", detail: "NCLEX-RN exam required regardless of military medical experience" },
        { label: "Clinical hour requirements", severity: "medium", detail: "Nursing programs require 500-800 clinical hours — military experience may partially satisfy" },
        { label: "Program admission competitiveness", severity: "medium", detail: "ADN/BSN programs have limited seats; military medics have strong applications" },
      ],
      policyFriction: [
        { point: "BSN programs fully eligible for Post-9/11 GI Bill", framework: "Ch. 33 Post-9/11 GI Bill" },
        { point: "Some states accept military medical training for LPN licensure", framework: "State Nursing Boards" },
        { point: "CCNE-accredited programs required for VA education benefits", framework: "VA Education Benefits" },
      ],
      resourcesRequired: [
        { resource: "Nursing program tuition ($8,000-$40,000)", status: "GI Bill eligible" },
        { resource: "NCLEX-RN exam fee ($200)", status: "Self-funded" },
        { resource: "Clinical supplies and uniforms ($500-$800)", status: "Self-funded" },
        { resource: "Background check and drug screening ($100-$200)", status: "Self-funded" },
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "yellow", label: "Moderate", detail: "ADN 12-18 months; BSN 24-36 months. Military medic experience accelerates clinical learning" },
        { dimension: "Family Impact", status: "yellow", label: "Moderate", detail: "Clinical rotations require schedule flexibility; may include nights/weekends" },
        { dimension: "Transition Stress", status: "green", label: "Low", detail: "Combat medic skills translate directly to nursing clinical competencies" },
        { dimension: "Domain Alignment", status: "green", label: "Very High", detail: "88% alignment — trauma care, patient assessment, medication administration directly transferable" },
      ],
      specialConsiderations: [
        "68W combat medics perform many tasks equivalent to LPN/RN scope of practice — strongest clinical feeder MOS.",
        "Several states (CA, TX, FL) have military-to-nursing bridge programs specifically for 68-series MOS.",
        "VA hospitals actively recruit veteran nurses — preference in hiring for veteran status.",
      ],
      timelineRange: "12-36 months depending on pathway",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Captures trauma care, triage, medication administration, patient monitoring experience" },
        { layer: "Part B: AI Mediation", action: "Maps 68W/68C competencies to nursing curriculum requirements; identifies transferable clinical hours" },
        { layer: "Part C: Advisory Review", action: "Advisor coordinates with state nursing board for military credit evaluation and program selection" },
      ],
      explanation: "Medical MOS provides the strongest clinical foundation for nursing with 88% alignment. Combat medic experience directly translates to nursing competencies.",
    },
    teaching: {
      pathwayOptions: [
        { name: "Alternative Teaching Certificate (Health Science)", match: "76%", timeframe: "6-12 months" },
        { name: "M.Ed. Health Education", match: "72%", timeframe: "18-24 months" },
        { name: "CTE Health Occupations Instructor", match: "82%", timeframe: "3-6 months" },
      ],
      constraintRisks: [
        { label: "State licensure variability", severity: "medium", detail: "Teaching certification requirements vary by state — some accept military experience for alternative certification" },
        { label: "Content area limitations", severity: "low", detail: "Medical MOS qualifies for health science and CTE health occupations — strongest content match" },
      ],
      policyFriction: [
        { point: "Alternative certification programs eligible for GI Bill in most states", framework: "Ch. 33 Post-9/11 GI Bill" },
        { point: "Troops to Teachers program provides $5,000 stipend for high-need subjects", framework: "Troops to Teachers" },
        { point: "CTE instructor certification may waive student teaching requirement", framework: "State CTE Boards" },
      ],
      resourcesRequired: [
        { resource: "Alternative certification program ($3,000-$8,000)", status: "GI Bill eligible" },
        { resource: "Praxis exam fee ($130-$170)", status: "Self-funded" },
        { resource: "State teaching license application ($75-$150)", status: "Self-funded" },
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "green", label: "Strong", detail: "CTE pathway achievable in 3-6 months; alternative cert 6-12 months" },
        { dimension: "Family Impact", status: "green", label: "Low", detail: "Teaching careers offer schedule predictability and geographic flexibility" },
        { dimension: "Transition Stress", status: "yellow", label: "Moderate", detail: "Classroom management is new domain but medical training/mentoring experience transfers" },
        { dimension: "Domain Alignment", status: "green", label: "High", detail: "82% alignment for CTE Health Occupations — direct subject matter expertise" },
      ],
      specialConsiderations: [
        "Medical MOS personnel are highly valued as CTE Health Occupations instructors at high schools and community colleges.",
        "Troops to Teachers program provides financial support and mentoring for transitioning military to teaching.",
        "Health science teaching is a high-need area in most states — expedited certification available.",
      ],
      timelineRange: "3-24 months depending on pathway",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Captures clinical training experience, mentoring history, and medical instruction background" },
        { layer: "Part B: AI Mediation", action: "Maps medical competencies to CTE health science content standards; identifies Troops to Teachers eligibility" },
        { layer: "Part C: Advisory Review", action: "Advisor coordinates with state education board for alternative certification pathway" },
      ],
      explanation: "Medical MOS provides strong content expertise for health science teaching with 82% CTE alignment. Troops to Teachers program offers additional support.",
    },
  },
  combat_arms: {
    cybersecurity: {
      pathwayOptions: [
        { name: "IT Fundamentals → CompTIA A+ → Security+", match: "45%", timeframe: "18-24 months" },
        { name: "Cybersecurity Bootcamp + Internship", match: "52%", timeframe: "12-18 months" },
        { name: "BS Cybersecurity (GI Bill)", match: "40%", timeframe: "36-48 months" },
      ],
      constraintRisks: [
        { label: "Complete domain change", severity: "high", detail: "Combat Arms provides zero IT/networking foundational training — this is a full rebuild transition" },
        { label: "Certification failure risk", severity: "high", detail: "Without any technical baseline, Security+ pass rates are below 50% on first attempt" },
        { label: "Employment timeline", severity: "high", detail: "Minimum 12-18 months before employability in entry-level IT/cyber roles" },
      ],
      policyFriction: [
        { point: "Full credential stack requires 3+ years of CA funding — exceeds typical remaining service time", framework: "Army COOL Policy" },
        { point: "No TA funding available in this scenario", framework: "DoD TA Policy" },
        { point: "GI Bill may be only viable funding path for degree program", framework: "Ch. 33 Post-9/11 GI Bill" },
      ],
      resourcesRequired: [
        { resource: "CompTIA ITF+ voucher ($130)", status: "Self-funded" },
        { resource: "CompTIA A+ voucher ($358)", status: "Self-funded" },
        { resource: "CompTIA Security+ voucher ($392)", status: "Self-funded" },
        { resource: "Lab environment", status: "Self-funded ($10-14/mo)" },
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "red", label: "Critical", detail: "Short timeline + zero IT foundation = high risk. Minimum 18 months to entry-level competency" },
        { dimension: "Family Impact", status: "red", label: "High", detail: "Extended transition period with uncertain income during training phase" },
        { dimension: "Transition Stress", status: "red", label: "Very High", detail: "Complete occupational domain change with no transferable technical skills" },
        { dimension: "Domain Alignment", status: "red", label: "Very Low", detail: "45% alignment — combat arms provides leadership and discipline but zero technical foundation" },
      ],
      specialConsiderations: [
        "This is the hardest transition scenario in the CMGF framework — it demonstrates why governed AI must be transparent about structural barriers.",
        "Without TA funding, the service member must self-fund all credentials or rely entirely on GI Bill for degree pathway.",
        "Advisory recommendation: Consider alternative career goals with higher domain alignment (law enforcement, private security, logistics).",
      ],
      timelineRange: "18-48 months depending on pathway",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Captures combat arms skills — flags complete absence of IT/technical domains" },
        { layer: "Part B: AI Mediation", action: "Classifies combat→cyber as full domain change; surfaces maximum constraint density and funding barriers" },
        { layer: "Part C: Advisory Review", action: "Human advisor required to validate realistic expectations and explore alternative career goals" },
      ],
      explanation: "Combat Arms to Cybersecurity represents the highest-constraint transition — zero technical foundation, no TA funding, and short timeline create compounding barriers.",
    },
    project_management: {
      pathwayOptions: [
        { name: "PMP via military leadership experience", match: "78%", timeframe: "4-8 months" },
        { name: "CAPM → PMP Ladder", match: "72%", timeframe: "8-14 months" },
      ],
      constraintRisks: [
        { label: "Documentation challenge", severity: "medium", detail: "Must translate tactical leadership into PMI project language" },
      ],
      policyFriction: [
        { point: "PMI exam fees may need self-funding without TA", framework: "Army CA Program" },
      ],
      resourcesRequired: [
        { resource: "PMP exam fee ($405)", status: "Self-funded" },
        { resource: "35-hour PM course", status: "Self-funded or GI Bill" },
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "yellow", label: "Moderate", detail: "Leadership experience translates but documentation effort needed" },
        { dimension: "Family Impact", status: "green", label: "Low", detail: "Self-paced study pathway" },
        { dimension: "Transition Stress", status: "yellow", label: "Moderate", detail: "Military leadership translates but PM methodology is new" },
        { dimension: "Domain Alignment", status: "yellow", label: "Moderate", detail: "78% alignment — leadership transferable, technical PM methodology new" },
      ],
      specialConsiderations: ["Infantry leaders managing platoon-level operations often exceed PMP experience hour requirements."],
      timelineRange: "4-14 months",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Captures tactical leadership, operations planning, resource management" },
        { layer: "Part B: AI Mediation", action: "Maps combat leadership competencies to PMI process groups" },
        { layer: "Part C: Advisory Review", action: "Advisor translates military operations terminology to PM documentation" },
      ],
      explanation: "Combat Arms leadership provides transferable project management skills but requires methodology training.",
    },
    teaching: {
      pathwayOptions: [
        { name: "Alternative Teaching Certificate (Secondary)", match: "72%", timeframe: "6-12 months" },
        { name: "Troops to Teachers → STEM/History", match: "78%", timeframe: "6-18 months" },
        { name: "M.A.T. Secondary Education (GI Bill)", match: "68%", timeframe: "18-24 months" },
      ],
      constraintRisks: [
        { label: "Content area selection", severity: "medium", detail: "Must identify teachable content area — history, JROTC, physical education, and leadership are strongest matches" },
        { label: "Classroom management adjustment", severity: "medium", detail: "Military command authority does not transfer to classroom — pedagogical training required" },
        { label: "Salary expectations", severity: "medium", detail: "Teaching salaries ($40k-$60k) may represent significant pay reduction from military compensation" },
      ],
      policyFriction: [
        { point: "Troops to Teachers provides $5,000 stipend for high-need subjects (STEM, SPED)", framework: "Troops to Teachers" },
        { point: "JROTC instructor positions may bypass state certification entirely", framework: "JROTC Instructor Program" },
        { point: "Alternative certification accepted in 48 states for career changers", framework: "State Education Boards" },
      ],
      resourcesRequired: [
        { resource: "Alternative certification program ($3,000-$8,000)", status: "GI Bill eligible" },
        { resource: "Praxis Core + Subject exam fees ($200-$300)", status: "Self-funded" },
        { resource: "State teaching license ($75-$150)", status: "Self-funded" },
        { resource: "Background check ($50-$100)", status: "Self-funded" },
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "green", label: "Strong", detail: "JROTC immediate; alternative cert 6-12 months; M.A.T. 18-24 months" },
        { dimension: "Family Impact", status: "green", label: "Low", detail: "Teaching offers schedule stability, summers off, and geographic flexibility" },
        { dimension: "Transition Stress", status: "yellow", label: "Moderate", detail: "Leadership skills transfer but classroom pedagogy is a new skillset" },
        { dimension: "Domain Alignment", status: "yellow", label: "Moderate", detail: "72% alignment — leadership and discipline transfer strongly; pedagogy is new" },
      ],
      specialConsiderations: [
        "JROTC instructor positions are the fastest path — no state teaching certification required, military experience is the credential.",
        "Combat arms NCOs are highly recruited for JROTC programs at high schools nationwide.",
        "Troops to Teachers program provides mentoring, financial support, and job placement assistance.",
        "Physical education and health are additional high-alignment content areas for combat arms MOS.",
      ],
      timelineRange: "0 months (JROTC) to 24 months (M.A.T.)",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Captures leadership training, mentoring experience, physical fitness instruction, and operations planning" },
        { layer: "Part B: AI Mediation", action: "Maps combat leadership to teaching competencies; identifies JROTC eligibility and Troops to Teachers qualification" },
        { layer: "Part C: Advisory Review", action: "Advisor evaluates content area options and coordinates with Troops to Teachers regional office" },
      ],
      explanation: "Combat Arms MOS provides strong leadership and mentoring skills for teaching. JROTC is the fastest path with zero additional certification required.",
    },
  },
  admin: {
    project_management: {
      pathwayOptions: [
        { name: "PMP Certification Track", match: "85%", timeframe: "3-6 months" },
        { name: "SHRM-CP + PMP Dual Track", match: "82%", timeframe: "6-12 months" },
      ],
      constraintRisks: [
        { label: "Specialization choice", severity: "low", detail: "HR/Admin can pursue PM or HR management — both are strong matches" },
      ],
      policyFriction: [
        { point: "Both SHRM and PMI exams eligible for CA funding", framework: "Army COOL Policy" },
      ],
      resourcesRequired: [
        { resource: "PMP exam fee ($405)", status: "CA-eligible" },
        { resource: "PM coursework", status: "TA-eligible" },
      ],
      readinessMeasures: [
        { dimension: "Timeline Feasibility", status: "green", label: "Strong", detail: "PMP achievable in 3-6 months with admin experience" },
        { dimension: "Family Impact", status: "green", label: "Low", detail: "Self-paced, location flexible" },
        { dimension: "Transition Stress", status: "green", label: "Low", detail: "Administrative processes transfer directly" },
        { dimension: "Domain Alignment", status: "green", label: "High", detail: "85% alignment — HR/admin maps strongly to PM" },
      ],
      specialConsiderations: ["42A personnel manage complex personnel actions that directly parallel PM workflows."],
      timelineRange: "3-12 months",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Documents HR management, personnel actions, administrative processes" },
        { layer: "Part B: AI Mediation", action: "Maps admin competencies to PMI knowledge areas and SHRM body of knowledge" },
        { layer: "Part C: Advisory Review", action: "Advisor validates experience hours and certification pathway" },
      ],
      explanation: "Admin/HR MOS provides strong alignment with project management at 85%.",
    },
  },
};

function applyConstraintModifiers(result: PathwayResult, profile: InsertSyntheticProfile): PathwayResult {
  const modified = JSON.parse(JSON.stringify(result)) as PathwayResult;
  const constraints = profile.constraints || [];

  if (constraints.includes("short_timeline")) {
    modified.constraintRisks.push({
      label: "Short timeline pressure",
      severity: "high",
      detail: `Only ${profile.yearsOfService} years of service — limited time remaining for credential stacking before ETS`,
    });
    const timeline = modified.readinessMeasures.find(r => r.dimension === "Timeline Feasibility");
    if (timeline && timeline.status === "green") {
      timeline.status = "yellow";
      timeline.label = "Compressed";
      timeline.detail += " — shortened by limited remaining service time";
    }
  }

  if (constraints.includes("no_ta_funding") || profile.fundingAvailable === "none") {
    modified.constraintRisks.push({
      label: "No TA funding available",
      severity: "high",
      detail: "Tuition Assistance not available — must self-fund or use GI Bill for all training costs",
    });
    modified.resourcesRequired = modified.resourcesRequired.map(r => ({
      ...r,
      status: r.status.includes("TA-eligible") ? "Self-funded (no TA)" : r.status,
    }));
  }

  if (constraints.includes("deployed") || profile.deploymentStatus === "deployed") {
    modified.constraintRisks.push({
      label: "Currently deployed",
      severity: "high",
      detail: "Active deployment limits access to testing centers, internet-based training, and career counselor coordination",
    });
    modified.readinessMeasures.forEach(r => {
      if (r.dimension === "Timeline Feasibility" && r.status !== "red") {
        r.status = "yellow";
        r.detail += " — deployment may extend timeline by 3-6 months";
      }
    });
  }

  if (constraints.includes("no_degree") && !profile.hasDegree) {
    modified.constraintRisks.push({
      label: "No bachelor's degree",
      severity: "medium",
      detail: "Some employer positions and advanced certifications require a bachelor's degree minimum",
    });
  }

  if (profile.credits && profile.credits > 30) {
    modified.specialConsiderations.push(
      `${profile.credits} college credits completed — evaluate transfer applicability for degree pathways`
    );
  }

  if (profile.clearanceLevel === "TS/SCI") {
    modified.specialConsiderations.push(
      "TS/SCI clearance is a high-value asset — commands $15k-$30k salary premium in applicable fields. Time-decaying; begin employer outreach 6+ months pre-ETS."
    );
  }

  return modified;
}

function generateScenarioId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CMGF-${timestamp}-${random}`;
}

export interface ScenarioResult {
  scenarioId: string;
  profile: SyntheticProfile;
  inputs: {
    mos: string;
    mosLabel: string;
    careerGoal: string;
    goalLabel: string;
    rank: string;
    yearsOfService: number;
    constraints: string[];
  };
  outputs: PathwayResult;
  explanation: string;
  visualData: {
    readinessScores: Array<{ dimension: string; status: string; label: string }>;
    pathwayCount: number;
    constraintCount: number;
    highRiskCount: number;
    overallFeasibility: string;
    dataCompleteness: number;
  };
  governanceMetadata: {
    engineVersion: string;
    executionType: string;
    dataSources: string[];
    humanReviewRequired: boolean;
    timestamp: string;
  };
}

export async function runScenario(profileData: InsertSyntheticProfile): Promise<ScenarioResult> {
  const [profile] = await db.insert(syntheticProfiles).values(profileData).returning();

  const scenarioId = generateScenarioId();

  const [run] = await db.insert(scenarioRuns).values({
    scenarioId,
    profileId: profile.id,
    status: "running",
    inputs: JSON.stringify({
      mos: profile.mos,
      careerGoal: profile.careerGoal,
      rank: profile.rank,
      yearsOfService: profile.yearsOfService,
      constraints: profile.constraints,
    }),
  }).returning();

  let engineOutput: PathwayResult;
  const mosData = PATHWAY_DATA[profile.mos];
  if (mosData && mosData[profile.careerGoal]) {
    engineOutput = applyConstraintModifiers(mosData[profile.careerGoal], profileData);
  } else {
    engineOutput = generateFallbackOutput(profileData);
  }

  const explanation = engineOutput.explanation || "Analysis complete. See pathway options and constraint assessment.";

  const highRiskCount = engineOutput.constraintRisks.filter(r => r.severity === "high").length;
  const greenCount = engineOutput.readinessMeasures.filter(r => r.status === "green").length;
  const totalMeasures = engineOutput.readinessMeasures.length;
  const overallFeasibility = greenCount >= 3 ? "High" : greenCount >= 2 ? "Moderate" : highRiskCount >= 2 ? "Low" : "Moderate";

  const dataFields = [profile.mos, profile.careerGoal, profile.rank, profile.yearsOfService, profile.clearanceLevel, profile.credits];
  const dataCompleteness = Math.round((dataFields.filter(Boolean).length / dataFields.length) * 100);

  const visualData = {
    readinessScores: engineOutput.readinessMeasures.map(r => ({
      dimension: r.dimension,
      status: r.status,
      label: r.label,
    })),
    pathwayCount: engineOutput.pathwayOptions.length,
    constraintCount: engineOutput.constraintRisks.length,
    highRiskCount,
    overallFeasibility,
    dataCompleteness,
  };

  await db.insert(scenarioOutputs).values({
    scenarioRunId: run.id,
    engineOutput: JSON.stringify(engineOutput),
    explanation,
    visualData: JSON.stringify(visualData),
  });

  await db.update(scenarioRuns)
    .set({ status: "complete", completedAt: new Date() })
    .where(eq(scenarioRuns.id, run.id));

  return {
    scenarioId,
    profile,
    inputs: {
      mos: profile.mos,
      mosLabel: profile.mosLabel,
      careerGoal: profile.careerGoal,
      goalLabel: profile.goalLabel,
      rank: profile.rank,
      yearsOfService: profile.yearsOfService,
      constraints: profile.constraints || [],
    },
    outputs: engineOutput,
    explanation,
    visualData,
    governanceMetadata: {
      engineVersion: "CMGF v1.0",
      executionType: "Deterministic Rules Engine",
      dataSources: ["Army COOL Policy", "DoD TA Policy", "O*NET", "BLS", "IPPS-A", "JST"],
      humanReviewRequired: true,
      timestamp: new Date().toISOString(),
    },
  };
}

function generateFallbackOutput(profile: InsertSyntheticProfile): PathwayResult {
  return {
    pathwayOptions: [
      { name: "General Career Transition Assessment", match: "60%", timeframe: "6-12 months" },
      { name: "Skills-Based Credential Mapping", match: "55%", timeframe: "3-9 months" },
    ],
    constraintRisks: [
      { label: "Limited pathway mapping", severity: "medium", detail: "This MOS-to-career combination does not have a pre-built pathway in the current engine. General assessment applied." },
    ],
    policyFriction: [
      { point: "Verify credential eligibility with career counselor", framework: "General Advisory" },
    ],
    resourcesRequired: [
      { resource: "Career transition counseling", status: "Required" },
      { resource: "Skills assessment evaluation", status: "Required" },
    ],
    readinessMeasures: [
      { dimension: "Timeline Feasibility", status: "yellow", label: "Assessment Needed", detail: "Timeline depends on specific credential requirements for target career" },
      { dimension: "Family Impact", status: "yellow", label: "Variable", detail: "Impact depends on training duration and format" },
      { dimension: "Transition Stress", status: "yellow", label: "Moderate", detail: "Standard career transition stress expected" },
      { dimension: "Domain Alignment", status: "yellow", label: "Partial", detail: "Alignment assessment requires detailed MOS-to-career skill mapping" },
    ],
    specialConsiderations: [
      "This combination requires individualized assessment — consult with your Education Service Officer for detailed pathway planning.",
    ],
    timelineRange: "3-12 months (varies by specific pathway)",
    cmgfLayers: [
      { layer: "Part A: Service Member Interface", action: "Captures MOS skills inventory and career goal declaration" },
      { layer: "Part B: AI Mediation", action: "Applies general transition assessment — detailed mapping pending" },
      { layer: "Part C: Advisory Review", action: "Human advisor required for individualized pathway development" },
    ],
    explanation: "This MOS-to-career combination requires individualized assessment. The CMGF engine provides general guidance while recommending human advisor consultation for detailed pathway planning.",
  };
}

export async function getScenarioById(scenarioId: string): Promise<ScenarioResult | null> {
  const [run] = await db.select().from(scenarioRuns).where(eq(scenarioRuns.scenarioId, scenarioId));
  if (!run) return null;

  const [profile] = run.profileId
    ? await db.select().from(syntheticProfiles).where(eq(syntheticProfiles.id, run.profileId))
    : [null];
  if (!profile) return null;

  const [output] = await db.select().from(scenarioOutputs).where(eq(scenarioOutputs.scenarioRunId, run.id));
  if (!output) return null;

  const engineOutput = JSON.parse(output.engineOutput || "{}");
  const visualData = JSON.parse(output.visualData || "{}");

  return {
    scenarioId: run.scenarioId,
    profile,
    inputs: {
      mos: profile.mos,
      mosLabel: profile.mosLabel,
      careerGoal: profile.careerGoal,
      goalLabel: profile.goalLabel,
      rank: profile.rank,
      yearsOfService: profile.yearsOfService,
      constraints: profile.constraints || [],
    },
    outputs: engineOutput,
    explanation: output.explanation || "",
    visualData,
    governanceMetadata: {
      engineVersion: "CMGF v1.0",
      executionType: "Deterministic Rules Engine",
      dataSources: ["Army COOL Policy", "DoD TA Policy", "O*NET", "BLS", "IPPS-A", "JST"],
      humanReviewRequired: true,
      timestamp: run.createdAt?.toISOString() || new Date().toISOString(),
    },
  };
}

export async function listScenarios(): Promise<Array<{ scenarioId: string; status: string; profileType: string; createdAt: Date | null }>> {
  const runs = await db.select().from(scenarioRuns).orderBy(scenarioRuns.id);
  const result = [];
  for (const run of runs) {
    let profileType = "unknown";
    if (run.profileId) {
      const [p] = await db.select().from(syntheticProfiles).where(eq(syntheticProfiles.id, run.profileId));
      if (p) profileType = p.profileType;
    }
    result.push({
      scenarioId: run.scenarioId,
      status: run.status,
      profileType,
      createdAt: run.createdAt,
    });
  }
  return result;
}
