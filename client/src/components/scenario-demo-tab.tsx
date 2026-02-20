import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  User, Cpu, AlertTriangle, CheckCircle, Clock, Shield,
  ArrowRight, Zap, BookOpen, DollarSign, FileWarning,
  Lock, Layers, Target, TrendingUp, XCircle
} from "lucide-react";

interface PersonaConfig {
  rank: string;
  yearsOfService: string;
  mos: string;
  careerGoal: string;
}

interface PathwayResult {
  pathwayOptions: Array<{ name: string; match: string; timeframe: string }>;
  constraintRisks: Array<{ label: string; severity: "high" | "medium" | "low"; detail: string }>;
  policyFriction: Array<{ point: string; framework: string }>;
  resourcesRequired: Array<{ resource: string; status: string }>;
  timelineRange: string;
  cmgfLayers: Array<{ layer: string; action: string }>;
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
      timelineRange: "6-18 months depending on pathway",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Captures MOS skills, credential inventory, career goal declaration" },
        { layer: "Part B: AI Mediation", action: "Translates 88M/92A competencies to cybersecurity domain; identifies transferable skills (risk assessment, systems monitoring, logistics chain security)" },
        { layer: "Part C: Advisory Review", action: "Human advisor validates pathway feasibility, confirms funding eligibility, reviews timeline against ETS" },
      ],
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
      timelineRange: "3-12 months depending on pathway",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Documents logistics planning, convoy management, and resource allocation experience" },
        { layer: "Part B: AI Mediation", action: "Maps logistics competencies directly to PMI knowledge areas; high transferability score" },
        { layer: "Part C: Advisory Review", action: "Advisor confirms experience hours, validates application documentation" },
      ],
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
      timelineRange: "2-12 months depending on pathway",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Captures warehouse management, distribution, and inventory control experience" },
        { layer: "Part B: AI Mediation", action: "Near-direct translation of military logistics to civilian supply chain terminology" },
        { layer: "Part C: Advisory Review", action: "Advisor validates credential mapping and employer requirement alignment" },
      ],
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
      timelineRange: "6-15 months depending on pathway",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Captures SIGINT/HUMINT/GEOINT skill sets and clearance level" },
        { layer: "Part B: AI Mediation", action: "Translates intelligence analysis competencies to cybersecurity threat analysis; identifies cross-domain skills" },
        { layer: "Part C: Advisory Review", action: "Advisor manages classification-sensitive documentation; validates unclassified experience narratives" },
      ],
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
      timelineRange: "3-18 months depending on pathway",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Documents analytical methodology, reporting, and pattern recognition experience" },
        { layer: "Part B: AI Mediation", action: "Maps intelligence analysis frameworks to data science methodologies; high analytical transferability" },
        { layer: "Part C: Advisory Review", action: "Advisor reviews civilian equivalency of classified analytical work" },
      ],
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
      timelineRange: "6-15 months depending on pathway",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Captures network configuration, COMSEC, and signal operations experience" },
        { layer: "Part B: AI Mediation", action: "Direct translation of network operations to cybersecurity infrastructure defense; high domain overlap" },
        { layer: "Part C: Advisory Review", action: "Advisor validates technical depth and recommends specialization track" },
      ],
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
      timelineRange: "6-24 months depending on pathway",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Captures patient care, triage, and medical logistics experience" },
        { layer: "Part B: AI Mediation", action: "Translates combat medic competencies to healthcare management domain; identifies leadership transferability" },
        { layer: "Part C: Advisory Review", action: "Advisor validates clinical-to-administrative pathway and benefit coordination" },
      ],
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
      timelineRange: "6-18 months depending on pathway",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Captures mission planning, team leadership, and operational coordination experience" },
        { layer: "Part B: AI Mediation", action: "Translates tactical planning to project lifecycle management; maps command experience to stakeholder management" },
        { layer: "Part C: Advisory Review", action: "Advisor bridges military-civilian language gap; validates experience narrative for civilian employers" },
      ],
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
      timelineRange: "2-12 months depending on pathway",
      cmgfLayers: [
        { layer: "Part A: Service Member Interface", action: "Documents administrative processes, personnel management, and organizational workflows" },
        { layer: "Part B: AI Mediation", action: "Maps admin/HR competencies to business analysis and project coordination roles" },
        { layer: "Part C: Advisory Review", action: "Advisor confirms documentation and identifies bridging opportunities" },
      ],
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

function getAvailableGoals(mos: string): string[] {
  return Object.keys(PATHWAY_DATA[mos] || {});
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

  const result = useMemo(() => getResult(persona.mos, persona.careerGoal), [persona.mos, persona.careerGoal]);
  const constraintAlerts = useMemo(() => getConstraintAlerts(constraints), [constraints]);
  const activeConstraintCount = Object.values(constraints).filter(Boolean).length;

  const handleMosChange = (mos: string) => {
    const availableGoals = getAvailableGoals(mos);
    const newGoal = availableGoals.includes(persona.careerGoal) ? persona.careerGoal : getDefaultGoal(mos);
    setPersona(prev => ({ ...prev, mos, careerGoal: newGoal }));
    setShowResult(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Scenario Pathway Demo</h2>
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
              <Select value={persona.rank} onValueChange={v => { setPersona(p => ({ ...p, rank: v })); setShowResult(false); }}>
                <SelectTrigger data-testid="select-rank">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RANKS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Years of Service</label>
              <Select value={persona.yearsOfService} onValueChange={v => { setPersona(p => ({ ...p, yearsOfService: v })); setShowResult(false); }}>
                <SelectTrigger data-testid="select-years">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map(y => <SelectItem key={y} value={y}>{y} years</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">MOS / Specialty</label>
              <Select value={persona.mos} onValueChange={handleMosChange}>
                <SelectTrigger data-testid="select-mos">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOS_OPTIONS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Career Goal</label>
              <Select value={persona.careerGoal} onValueChange={v => { setPersona(p => ({ ...p, careerGoal: v })); setShowResult(false); }}>
                <SelectTrigger data-testid="select-career-goal">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CAREER_GOALS.filter(g => getAvailableGoals(persona.mos).includes(g.value)).map(g => (
                    <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full mt-2"
              onClick={() => setShowResult(true)}
              disabled={!result}
              data-testid="button-run-scenario"
            >
              <Cpu className="w-4 h-4 mr-2" />
              Run Scenario Analysis
            </Button>

            {showResult && (
              <div className="p-3 rounded-md bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Active Profile:</span>{" "}
                  {persona.rank}, {persona.yearsOfService} yrs, {MOS_OPTIONS.find(m => m.value === persona.mos)?.label}
                  {" \u2192 "}{CAREER_GOALS.find(g => g.value === persona.careerGoal)?.label}
                </p>
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
            {!showResult ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Cpu className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Configure a service member profile and click "Run Scenario Analysis" to see CMGF pathway output.</p>
                <p className="text-xs text-muted-foreground mt-2">This demonstrates bounded AI: rule-based translation, not predictive modeling.</p>
              </div>
            ) : result ? (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-3">
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
                        <Badge variant={parseInt(p.match) >= 85 ? "default" : "outline"} className="text-xs">
                          {p.match} match
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
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

                <div>
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

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-foreground">Resources Required</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.resourcesRequired.map((r, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-md border border-border/50 text-sm" data-testid={`resource-${i}`}>
                        <span className="text-foreground text-xs">{r.resource}</span>
                        <Badge variant="outline" className="text-[10px]">{r.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
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
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <XCircle className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No pathway data available for this MOS/goal combination.</p>
              </div>
            )}
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
