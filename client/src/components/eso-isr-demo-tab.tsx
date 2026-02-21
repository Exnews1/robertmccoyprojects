import { useState, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3, Users, AlertTriangle, Shield, Target,
  FileText, Cpu, ArrowDown, Activity,
  Lock, User, RefreshCw, ListOrdered, Gauge
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";

const MOS_GROUPS = ["Logistics", "Intel/Analysis", "Signal/Comms", "Medical", "Combat Arms", "Admin/HR"];
const CAREER_GOALS = ["Cybersecurity", "Project Management", "Healthcare Administration", "Data Analytics", "Education / Training", "Business Management"];

interface EsoConstraints {
  limited_funding: boolean;
  high_staff_turnover: boolean;
  inefficient_stakeholder_communication: boolean;
  inadequate_staff_training: boolean;
  difficulty_tracking_outcomes: boolean;
  resistance_to_change: boolean;
}

interface CohortRow {
  scenario_id: string;
  rank: string;
  years_bucket: number;
  mos_group: string;
  career_goal: string;
  constraints: Record<string, boolean>;
  engine: {
    alignment: string;
    alignment_pct: number;
    tier: number;
    estimated_months_min: number;
    estimated_months_max: number;
    warnings: string[];
    policy_flags: string[];
    indicators: Record<string, string>;
  };
}

interface AggregateResult {
  population_n: number;
  demand: {
    career_goal_pct: Record<string, number>;
    mos_group_pct: Record<string, number>;
  };
  constraint_friction: {
    constraint_trigger_pct: Record<string, number>;
    policy_flag_pct: Record<string, number>;
    deployed_pct: number;
    lt_12_months_pct: number;
    no_ta_pct: number;
  };
  bottlenecks: Array<{ code: string; pct: number }>;
  advisor_load: {
    requires_human_review_pct: number;
    high_risk_cohort_pct: number;
  };
  readiness_risk: Record<string, Record<string, number>>;
}

interface RackStackItem {
  rank: number;
  id: string;
  priority_score: number;
  description: string;
  drivers: string[];
}

const WEIGHTS: Record<string, number> = {
  SM_DEPLOYED: 4,
  LT_12_MONTHS: 5,
  NO_TA: 4,
  NO_SKILLBRIDGE: 3,
  FAMILY_RELOCATION: 2,
  CLEARANCE_LAPSING: 4,
  TIER2_BARRIER: 4,
  FOUNDATION_GAP: 5,
  TA_CAP_EXCEEDED: 4,
  COOL_CAP_EXCEEDED: 4,
  TRACKING_GAP: 3,
  STAFF_TURNOVER: 3,
  STAFF_TRAINING_GAP: 3,
  COMMUNICATION_FRICTION: 2,
  CHANGE_RESISTANCE: 2,
  LIMITED_FUNDING: 4,
};

const THRESHOLDS = {
  high_risk_indicator_share: 0.25,
  requires_intervention_share: 0.35,
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateDemoCohort(n: number, seed: number = 7): CohortRow[] {
  const rand = seededRandom(seed);
  const ranks = ["E-4", "E-5", "E-6", "E-7"];
  const yosBuckets = [0, 5, 10, 15, 20];
  const rows: CohortRow[] = [];

  for (let i = 0; i < n; i++) {
    const mos = MOS_GROUPS[Math.floor(rand() * MOS_GROUPS.length)];
    const goal = CAREER_GOALS[Math.floor(rand() * CAREER_GOALS.length)];
    const rank = ranks[Math.floor(rand() * ranks.length)];
    const yos = yosBuckets[Math.floor(rand() * yosBuckets.length)];

    const constraints: Record<string, boolean> = {
      deployed: rand() < 0.14,
      lt_12_months: rand() < 0.18,
      no_ta: rand() < 0.12,
      no_skillbridge: rand() < 0.20,
      family_relocation: rand() < 0.10,
      clearance_lapsing: rand() < 0.08,
    };

    const tier = ["Cybersecurity", "Data Analytics", "Healthcare Administration"].includes(goal) ? 2 : 1;

    let alignment = "green";
    if (mos === "Combat Arms" && ["Cybersecurity", "Data Analytics"].includes(goal)) {
      alignment = "red";
    } else if (["Logistics", "Admin/HR"].includes(mos) && ["Cybersecurity", "Data Analytics"].includes(goal)) {
      alignment = "yellow";
    }

    const lvl = (pHigh: number, pMed: number = 0.45) => {
      const x = rand();
      if (x < pHigh) return "high";
      if (x < pHigh + pMed) return "medium";
      return "low";
    };

    const timeline = constraints.lt_12_months && tier === 2 ? "high" : lvl(0.14);
    const transition = lvl(constraints.deployed || tier === 2 ? 0.20 : 0.10);
    const financial = constraints.no_ta && tier === 2 ? "high" : lvl(0.16);

    const indicators: Record<string, string> = {
      "Timeline Feasibility": timeline,
      "Financial Stress": financial,
      "Transition Stress": transition,
      "Domain Alignment": alignment === "red" ? "high" : alignment === "yellow" ? "medium" : "low",
      "Family Impact": constraints.family_relocation ? "high" : lvl(0.08),
    };

    const warnings: string[] = [];
    const policy_flags: string[] = [];

    if (tier === 2) {
      warnings.push("TIER2_BARRIER");
      if (["yellow", "red"].includes(alignment) && rand() < 0.55) {
        warnings.push("FOUNDATION_GAP");
      }
    }

    if (constraints.deployed && tier === 2 && rand() < 0.35) {
      warnings.push("TRACKING_GAP");
    }

    if (constraints.no_ta && tier === 2 && rand() < 0.60) {
      warnings.push("TA_CAP_EXCEEDED");
      policy_flags.push("Credential funding friction detected (modeled).");
    }

    if (constraints.clearance_lapsing && goal === "Cybersecurity") {
      warnings.push("CLEARANCE_LAPSING");
    }

    let est_min = alignment === "green" && tier === 1 ? 3 : tier === 1 ? 6 : 9;
    if (constraints.deployed) est_min += 1;
    const est_max = est_min + (alignment !== "red" ? 3 : 9);

    rows.push({
      scenario_id: `demo-${i}-${seed}`,
      rank,
      years_bucket: yos,
      mos_group: mos,
      career_goal: goal,
      constraints,
      engine: {
        alignment,
        alignment_pct: alignment === "green" ? 88 : alignment === "yellow" ? 74 : 58,
        tier,
        estimated_months_min: est_min,
        estimated_months_max: est_max,
        warnings,
        policy_flags,
        indicators,
      },
    });
  }
  return rows;
}

function pct(x: number, n: number): number {
  return n > 0 ? Math.round((x / n) * 10000) / 10000 : 0;
}

function requiresHumanReview(row: CohortRow): boolean {
  const { engine, constraints } = row;
  if (Object.values(engine.indicators).some(v => v === "high")) return true;
  if (engine.tier >= 2 && engine.warnings.includes("FOUNDATION_GAP")) return true;
  if (constraints.lt_12_months && engine.estimated_months_min > 6) return true;
  if (constraints.clearance_lapsing && row.career_goal === "Cybersecurity") return true;
  return false;
}

function aggregate(rows: CohortRow[]): AggregateResult {
  const n = rows.length;
  const goalCounts: Record<string, number> = {};
  const mosCounts: Record<string, number> = {};
  const constraintCounts: Record<string, number> = {};
  const warningCounts: Record<string, number> = {};
  const policyFlagCounts: Record<string, number> = {};
  const riskCounters: Record<string, Record<string, number>> = {
    "Timeline Feasibility": { low: 0, medium: 0, high: 0 },
    "Financial Stress": { low: 0, medium: 0, high: 0 },
    "Transition Stress": { low: 0, medium: 0, high: 0 },
    "Domain Alignment": { low: 0, medium: 0, high: 0 },
    "Family Impact": { low: 0, medium: 0, high: 0 },
  };

  let reviewCount = 0;
  let highRiskCount = 0;
  let deployed = 0;
  let lt12 = 0;
  let noTa = 0;

  for (const r of rows) {
    goalCounts[r.career_goal] = (goalCounts[r.career_goal] || 0) + 1;
    mosCounts[r.mos_group] = (mosCounts[r.mos_group] || 0) + 1;

    for (const [k, v] of Object.entries(r.constraints)) {
      if (v) constraintCounts[k] = (constraintCounts[k] || 0) + 1;
    }

    for (const w of r.engine.warnings) {
      warningCounts[w] = (warningCounts[w] || 0) + 1;
    }

    for (const pf of r.engine.policy_flags) {
      policyFlagCounts[pf] = (policyFlagCounts[pf] || 0) + 1;
    }

    for (const [dim, level] of Object.entries(r.engine.indicators)) {
      if (riskCounters[dim]) {
        riskCounters[dim][level] = (riskCounters[dim][level] || 0) + 1;
      }
    }

    if (r.constraints.deployed) deployed++;
    if (r.constraints.lt_12_months) lt12++;
    if (r.constraints.no_ta) noTa++;

    if (requiresHumanReview(r)) reviewCount++;
    if (
      Object.values(r.engine.indicators).some(v => v === "high") ||
      (r.engine.warnings.includes("FOUNDATION_GAP") && r.engine.tier >= 2)
    ) {
      highRiskCount++;
    }
  }

  const sortedWarnings = Object.entries(warningCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

  const readinessRisk: Record<string, Record<string, number>> = {};
  for (const [dim, counter] of Object.entries(riskCounters)) {
    readinessRisk[dim] = {
      low: pct(counter.low, n),
      medium: pct(counter.medium, n),
      high: pct(counter.high, n),
    };
  }

  return {
    population_n: n,
    demand: {
      career_goal_pct: Object.fromEntries(Object.entries(goalCounts).map(([k, v]) => [k, pct(v, n)])),
      mos_group_pct: Object.fromEntries(Object.entries(mosCounts).map(([k, v]) => [k, pct(v, n)])),
    },
    constraint_friction: {
      constraint_trigger_pct: Object.fromEntries(Object.entries(constraintCounts).map(([k, v]) => [k, pct(v, n)])),
      policy_flag_pct: Object.fromEntries(Object.entries(policyFlagCounts).map(([k, v]) => [k, pct(v, n)])),
      deployed_pct: pct(deployed, n),
      lt_12_months_pct: pct(lt12, n),
      no_ta_pct: pct(noTa, n),
    },
    bottlenecks: sortedWarnings.map(([code, count]) => ({ code, pct: pct(count, n) })),
    advisor_load: {
      requires_human_review_pct: pct(reviewCount, n),
      high_risk_cohort_pct: pct(highRiskCount, n),
    },
    readiness_risk: readinessRisk,
  };
}

function rackAndStack(agg: AggregateResult, eso: EsoConstraints): RackStackItem[] {
  const w = WEIGHTS;
  const friction = agg.constraint_friction;
  const triggers = friction.constraint_trigger_pct;
  const bottlenecks = agg.bottlenecks;
  const advisor = agg.advisor_load;
  const bmap: Record<string, number> = {};
  for (const b of bottlenecks) bmap[b.code] = b.pct;

  const scoreDriver = (code: string, pctVal: number) => (w[code] || 1) * pctVal;

  const candidates: Array<{ id: string; description: string; score: number; drivers: string[] }> = [];

  const deployedPct = friction.deployed_pct;
  if (deployedPct > 0) {
    candidates.push({
      id: "DEPLOYED_ACCESS_SUPPORT",
      description: "Improve deployed learning access (testing windows, proctoring options, asynchronous study plans).",
      score: scoreDriver("SM_DEPLOYED", deployedPct),
      drivers: ["SM_DEPLOYED"],
    });
  }

  const lt12 = friction.lt_12_months_pct;
  if (lt12 > 0) {
    candidates.push({
      id: "TIMELINE_COMPRESSION_PATHS",
      description: "Prioritize short-run pathways and post-separation benefit routing when service window is <12 months.",
      score: scoreDriver("LT_12_MONTHS", lt12),
      drivers: ["LT_12_MONTHS"],
    });
  }

  const noTa = friction.no_ta_pct;
  if (noTa > 0 || eso.limited_funding) {
    let base = scoreDriver("NO_TA", noTa);
    base += (w.LIMITED_FUNDING || 1) * (eso.limited_funding ? 1.0 : 0.0);
    candidates.push({
      id: "FUNDING_FRICTION_REDUCTION",
      description: "Reduce funding friction: pre-approved credential stacks, voucher routing, and alternative pathways when TA/CA is constrained.",
      score: base,
      drivers: ["NO_TA", "LIMITED_FUNDING"],
    });
  }

  if ((bmap.FOUNDATION_GAP || 0) > 0) {
    candidates.push({
      id: "FOUNDATION_BOOTCAMP",
      description: "Add foundational on-ramps (networking/OS basics, study groups, lab access) for Tier 2 careers.",
      score: scoreDriver("FOUNDATION_GAP", bmap.FOUNDATION_GAP),
      drivers: ["FOUNDATION_GAP"],
    });
  }

  if ((bmap.TIER2_BARRIER || 0) > 0) {
    candidates.push({
      id: "TIER2_COUNSELING_PROTOCOL",
      description: "Standardize Tier 2 counseling protocol: sequencing guidance, time estimates, and experience substitution.",
      score: scoreDriver("TIER2_BARRIER", bmap.TIER2_BARRIER),
      drivers: ["TIER2_BARRIER"],
    });
  }

  if (eso.high_staff_turnover) {
    candidates.push({
      id: "CONTINUITY_PLAYBOOK",
      description: "Create an ESO continuity playbook and templated advising outputs to reduce turnover impact.",
      score: (w.STAFF_TURNOVER || 1) * 1.0,
      drivers: ["STAFF_TURNOVER"],
    });
  }

  if (eso.inadequate_staff_training) {
    candidates.push({
      id: "STAFF_TRAINING_UPGRADE",
      description: "Add staff training: policy rules, tool workflows, and advising scripts aligned to governance constraints.",
      score: (w.STAFF_TRAINING_GAP || 1) * 1.0,
      drivers: ["STAFF_TRAINING_GAP"],
    });
  }

  if (eso.inefficient_stakeholder_communication) {
    candidates.push({
      id: "STAKEHOLDER_SIGNAL_BRIDGE",
      description: "Improve stakeholder communications: shared definitions, dashboards, and standardized handoffs.",
      score: (w.COMMUNICATION_FRICTION || 1) * 1.0,
      drivers: ["COMMUNICATION_FRICTION"],
    });
  }

  if (eso.difficulty_tracking_outcomes || bmap.TRACKING_GAP) {
    let base = (w.TRACKING_GAP || 1) * (bmap.TRACKING_GAP || 0);
    if (eso.difficulty_tracking_outcomes) base += (w.TRACKING_GAP || 1) * 0.7;
    candidates.push({
      id: "OUTCOME_TRACKING_UPGRADE",
      description: "Improve outcome tracking: consistent scenario IDs, pathway tracking, and aggregate performance signals.",
      score: base,
      drivers: ["TRACKING_GAP"],
    });
  }

  if (eso.resistance_to_change) {
    candidates.push({
      id: "CHANGE_MANAGEMENT_LITE",
      description: "Use low-friction change management: small pilots, champion ESOs, and measurable wins.",
      score: (w.CHANGE_RESISTANCE || 1) * 1.0,
      drivers: ["CHANGE_RESISTANCE"],
    });
  }

  const rh = advisor.requires_human_review_pct;
  if (rh > THRESHOLDS.requires_intervention_share) {
    candidates.push({
      id: "ADVISOR_LOAD_TRIAGE",
      description: "Implement triage routing: auto-flag high-risk cases, schedule priority consults, and standardize review queues.",
      score: rh * 3.0,
      drivers: ["ADVISOR_LOAD"],
    });
  }

  candidates.sort((a, b) => b.score - a.score);

  return candidates.slice(0, 10).map((c, i) => ({
    rank: i + 1,
    id: c.id,
    priority_score: Math.round(c.score * 10000) / 10000,
    description: c.description,
    drivers: c.drivers,
  }));
}

const DRIVER_LABELS: Record<string, string> = {
  SM_DEPLOYED: "Deployed",
  LT_12_MONTHS: "< 12 Months",
  NO_TA: "No TA",
  NO_SKILLBRIDGE: "No SkillBridge",
  LIMITED_FUNDING: "Limited Funding",
  FOUNDATION_GAP: "Foundation Gap",
  TIER2_BARRIER: "Tier 2 Barrier",
  STAFF_TURNOVER: "Staff Turnover",
  STAFF_TRAINING_GAP: "Staff Training",
  COMMUNICATION_FRICTION: "Communication",
  CHANGE_RESISTANCE: "Change Resistance",
  TRACKING_GAP: "Tracking Gap",
  ADVISOR_LOAD: "Advisor Load",
  CLEARANCE_LAPSING: "Clearance Lapsing",
  TA_CAP_EXCEEDED: "TA Cap Exceeded",
};

const BOTTLENECK_LABELS: Record<string, string> = {
  TIER2_BARRIER: "Tier 2 career barrier",
  FOUNDATION_GAP: "Foundation skill gap",
  TA_CAP_EXCEEDED: "TA/CA funding exceeded",
  TRACKING_GAP: "Outcome tracking gap",
  CLEARANCE_LAPSING: "Clearance lapsing",
  COOL_CAP_EXCEEDED: "COOL cap exceeded",
};

function MetricCard({ title, icon: Icon, iconColor, children, testId }: {
  title: string;
  icon: typeof BarChart3;
  iconColor: string;
  children: React.ReactNode;
  testId?: string;
}) {
  return (
    <Card data-testid={testId}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon className={`w-4 h-4 ${iconColor}`} />
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{title}</span>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

export default function EsoIsrDemoTab() {
  const [cohortSize, setCohortSize] = useState("250");
  const [seed, setSeed] = useState(7);
  const [hasRun, setHasRun] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [esoConstraints, setEsoConstraints] = useState<EsoConstraints>({
    limited_funding: true,
    high_staff_turnover: true,
    inefficient_stakeholder_communication: true,
    inadequate_staff_training: true,
    difficulty_tracking_outcomes: true,
    resistance_to_change: true,
  });

  const activeEsoCount = Object.values(esoConstraints).filter(Boolean).length;

  const [cohort, setCohort] = useState<CohortRow[]>([]);
  const [agg, setAgg] = useState<AggregateResult | null>(null);
  const [priorities, setPriorities] = useState<RackStackItem[]>([]);

  const runDemo = useCallback(async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 400));
    const n = parseInt(cohortSize) || 250;
    const rows = generateDemoCohort(n, seed);
    const aggResult = aggregate(rows);
    const rackStack = rackAndStack(aggResult, esoConstraints);
    setCohort(rows);
    setAgg(aggResult);
    setPriorities(rackStack);
    setHasRun(true);
    setIsGenerating(false);
  }, [cohortSize, seed, esoConstraints]);

  const regenerate = useCallback(() => {
    setSeed(prev => prev + 1);
  }, []);

  const demandGoalData = useMemo(() => {
    if (!agg) return [];
    return Object.entries(agg.demand.career_goal_pct)
      .map(([name, value]) => ({ name: name.length > 18 ? name.slice(0, 16) + "…" : name, fullName: name, value: Math.round(value * 100) }))
      .sort((a, b) => b.value - a.value);
  }, [agg]);

  const demandMosData = useMemo(() => {
    if (!agg) return [];
    return Object.entries(agg.demand.mos_group_pct)
      .map(([name, value]) => ({ name, value: Math.round(value * 100) }))
      .sort((a, b) => b.value - a.value);
  }, [agg]);

  const constraintData = useMemo(() => {
    if (!agg) return [];
    const labels: Record<string, string> = {
      deployed: "Deployed",
      lt_12_months: "< 12 Months",
      no_ta: "No TA",
      no_skillbridge: "No SkillBridge",
      family_relocation: "Family Reloc.",
      clearance_lapsing: "Clearance",
    };
    return Object.entries(agg.constraint_friction.constraint_trigger_pct)
      .map(([key, value]) => ({ name: labels[key] || key, value: Math.round(value * 100) }))
      .sort((a, b) => b.value - a.value);
  }, [agg]);

  const riskRadarData = useMemo(() => {
    if (!agg) return [];
    const shortLabels: Record<string, string> = {
      "Timeline Feasibility": "Timeline",
      "Financial Stress": "Financial",
      "Transition Stress": "Transition",
      "Domain Alignment": "Domain",
      "Family Impact": "Family",
    };
    return Object.entries(agg.readiness_risk).map(([dim, levels]) => ({
      dimension: shortLabels[dim] || dim,
      high: Math.round(levels.high * 100),
      medium: Math.round(levels.medium * 100),
      low: Math.round(levels.low * 100),
    }));
  }, [agg]);

  return (
    <div className="space-y-6" data-testid="eso-isr-demo">
      <div>
        <h2 className="text-2xl font-bold" data-testid="isr-title">ESO / ISR Demo</h2>
        <p className="text-muted-foreground mt-1">
          Installation-level aggregate intelligence from de-identified advising data. This demonstrates the B → C dual-arrow architecture: 
          individual advising conversations flow to ESO review, while aggregated, de-identified patterns feed Installation Status Reports.
        </p>
      </div>

      <div className="p-3 rounded-lg border border-cyan-500/30 bg-cyan-500/5">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-cyan-500" />
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-500">De-Identified by Design</span>
        </div>
        <p className="text-xs text-muted-foreground">
          All data shown is synthetic and aggregated. No individual service member information is displayed. 
          This does not replace official ISR formats — it demonstrates how governed advising intelligence can feed institutional awareness under AR 210-14.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-4 space-y-4">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Cpu className="w-3 h-3 text-primary" />
              Configuration
            </p>

            <div>
              <label className="text-[11px] text-muted-foreground block mb-1">Cohort Size</label>
              <Select value={cohortSize} onValueChange={setCohortSize} data-testid="select-cohort-size">
                <SelectTrigger data-testid="select-cohort-size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100 scenarios</SelectItem>
                  <SelectItem value="250">250 scenarios</SelectItem>
                  <SelectItem value="500">500 scenarios</SelectItem>
                  <SelectItem value="1000">1,000 scenarios</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={runDemo}
              disabled={isGenerating}
              className="w-full"
              data-testid="button-run-isr"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Aggregating...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  {hasRun ? "Re-run Analysis" : "Generate ISR Report"}
                </>
              )}
            </Button>

            {hasRun && (
              <Button variant="outline" size="sm" onClick={regenerate} className="w-full" data-testid="button-new-seed">
                <RefreshCw className="w-3 h-3 mr-2" />
                New Cohort Seed
              </Button>
            )}

            <div className="border-t pt-3">
              <p className="text-xs font-mono uppercase tracking-wider text-amber-500 flex items-center gap-2 mb-2">
                <AlertTriangle className="w-3 h-3" />
                ESO Capacity Constraints
                {activeEsoCount > 0 && (
                  <Badge variant="destructive" className="text-[9px] ml-1">{activeEsoCount}</Badge>
                )}
              </p>
              <p className="text-[9px] text-muted-foreground mb-3">
                Installation-level conditions that affect rack-and-stack priorities.
              </p>
              <div className="space-y-2">
                {([
                  { key: "limited_funding" as const, label: "Limited funding" },
                  { key: "high_staff_turnover" as const, label: "High staff turnover" },
                  { key: "inefficient_stakeholder_communication" as const, label: "Stakeholder comm. friction" },
                  { key: "inadequate_staff_training" as const, label: "Inadequate staff training" },
                  { key: "difficulty_tracking_outcomes" as const, label: "Difficulty tracking outcomes" },
                  { key: "resistance_to_change" as const, label: "Resistance to change" },
                ] as const).map(toggle => (
                  <div key={toggle.key} className="flex items-center justify-between gap-2" data-testid={`eso-toggle-${toggle.key}`}>
                    <span className="text-[11px] text-foreground">{toggle.label}</span>
                    <Switch
                      checked={esoConstraints[toggle.key]}
                      onCheckedChange={v => setEsoConstraints(prev => ({ ...prev, [toggle.key]: v }))}
                      data-testid={`switch-eso-${toggle.key}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="flex items-center gap-1.5 mb-2">
                <ArrowDown className="w-3 h-3 text-green-500" />
                <span className="text-[9px] font-mono text-green-500">B → C INDIVIDUAL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ArrowDown className="w-3 h-3 text-cyan-500" />
                <span className="text-[9px] font-mono text-cyan-500">B → C AGGREGATE (ISR)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          {!hasRun ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Configure ESO constraints and click "Generate ISR Report" to see aggregate installation intelligence.</p>
                <p className="text-xs text-muted-foreground mt-2">Synthetic cohort data — de-identified and deterministic.</p>
              </CardContent>
            </Card>
          ) : agg && (
            <>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  {agg.population_n} scenarios
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Activity className="w-3 h-3 mr-1" />
                  {Math.round(agg.advisor_load.requires_human_review_pct * 100)}% require advisor review
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {Math.round(agg.advisor_load.high_risk_cohort_pct * 100)}% high-risk
                </Badge>
                <Badge variant="outline" className="text-xs text-cyan-500 border-cyan-500/30">
                  <Shield className="w-3 h-3 mr-1" />
                  {Math.round(agg.constraint_friction.deployed_pct * 100)}% deployed
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard title="Demand Distribution — Career Goals" icon={Target} iconColor="text-blue-500" testId="metric-demand-goals">
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={demandGoalData} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                      <XAxis type="number" tick={{ fontSize: 10 }} domain={[0, "auto"]} unit="%" />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={100} />
                      <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ fontSize: 11, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </MetricCard>

                <MetricCard title="Demand Distribution — MOS Groups" icon={Users} iconColor="text-purple-500" testId="metric-demand-mos">
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={demandMosData} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                      <XAxis type="number" tick={{ fontSize: 10 }} domain={[0, "auto"]} unit="%" />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={90} />
                      <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ fontSize: 11, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                      <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </MetricCard>

                <MetricCard title="Constraint Friction" icon={AlertTriangle} iconColor="text-orange-500" testId="metric-constraint-friction">
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={constraintData} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                      <XAxis type="number" tick={{ fontSize: 10 }} domain={[0, "auto"]} unit="%" />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={90} />
                      <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ fontSize: 11, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                      <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </MetricCard>

                <MetricCard title="Readiness Risk Distribution" icon={Gauge} iconColor="text-red-500" testId="metric-readiness-risk">
                  <ResponsiveContainer width="100%" height={180}>
                    <RadarChart data={riskRadarData} cx="50%" cy="50%" outerRadius="70%">
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
                      <PolarRadiusAxis tick={{ fontSize: 8 }} domain={[0, 100]} />
                      <Radar name="High" dataKey="high" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                      <Radar name="Medium" dataKey="medium" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} />
                      <Tooltip contentStyle={{ fontSize: 11, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                    </RadarChart>
                  </ResponsiveContainer>
                  <div className="flex items-center gap-3 mt-1 justify-center">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[9px] text-muted-foreground">High</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /><span className="text-[9px] text-muted-foreground">Medium</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-[9px] text-muted-foreground">Low</span></div>
                  </div>
                </MetricCard>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard title="Top Bottlenecks" icon={Lock} iconColor="text-red-500" testId="metric-bottlenecks">
                  <div className="space-y-2">
                    {agg.bottlenecks.map((b, i) => (
                      <div key={b.code} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-[10px] font-mono text-muted-foreground w-4">{i + 1}.</span>
                          <span className="text-[11px] text-foreground truncate">{BOTTLENECK_LABELS[b.code] || b.code}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-red-500"
                              style={{ width: `${Math.min(b.pct * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground w-10 text-right">{Math.round(b.pct * 100)}%</span>
                        </div>
                      </div>
                    ))}
                    {agg.bottlenecks.length === 0 && (
                      <p className="text-[11px] text-muted-foreground italic">No bottlenecks detected in this cohort.</p>
                    )}
                  </div>
                </MetricCard>

                <MetricCard title="Advisor Load" icon={User} iconColor="text-green-500" testId="metric-advisor-load">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-foreground">Requires human review</span>
                        <span className="text-sm font-bold text-foreground">{Math.round(agg.advisor_load.requires_human_review_pct * 100)}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${agg.advisor_load.requires_human_review_pct > THRESHOLDS.requires_intervention_share ? "bg-red-500" : "bg-amber-500"}`}
                          style={{ width: `${Math.min(agg.advisor_load.requires_human_review_pct * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-[9px] text-muted-foreground mt-1">
                        Threshold: {Math.round(THRESHOLDS.requires_intervention_share * 100)}% — {agg.advisor_load.requires_human_review_pct > THRESHOLDS.requires_intervention_share ? "EXCEEDED — triage recommended" : "within capacity"}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-foreground">High-risk cohort share</span>
                        <span className="text-sm font-bold text-foreground">{Math.round(agg.advisor_load.high_risk_cohort_pct * 100)}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${agg.advisor_load.high_risk_cohort_pct > THRESHOLDS.high_risk_indicator_share ? "bg-red-500" : "bg-green-500"}`}
                          style={{ width: `${Math.min(agg.advisor_load.high_risk_cohort_pct * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-[9px] text-muted-foreground mt-1">
                        Threshold: {Math.round(THRESHOLDS.high_risk_indicator_share * 100)}% — {agg.advisor_load.high_risk_cohort_pct > THRESHOLDS.high_risk_indicator_share ? "EXCEEDED — elevated risk" : "within expected range"}
                      </p>
                    </div>
                    <div className="p-2 rounded-md border border-muted bg-muted/30">
                      <p className="text-[9px] text-muted-foreground">
                        These thresholds represent the share of scenarios requiring advisor intervention. When exceeded, the rack-and-stack engine escalates triage routing as a priority.
                      </p>
                    </div>
                  </div>
                </MetricCard>
              </div>

              <MetricCard title="Rack and Stack — Prioritized Interventions" icon={ListOrdered} iconColor="text-primary" testId="metric-rack-stack">
                <p className="text-[10px] text-muted-foreground mb-3">
                  Ranked by deterministic priority scoring: cohort bottleneck frequency × weight + ESO capacity constraints. 
                  Higher scores indicate greater installation-level impact.
                </p>
                <div className="space-y-2">
                  {priorities.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
                      data-testid={`rack-stack-item-${item.rank}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          item.rank <= 3 ? "bg-red-500/20 text-red-500 border border-red-500/30" :
                          item.rank <= 6 ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" :
                          "bg-muted text-muted-foreground border border-border"
                        }`}>
                          {item.rank}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[10px] font-mono text-muted-foreground">{item.id}</span>
                            <Badge variant="outline" className="text-[9px] shrink-0">
                              Score: {item.priority_score.toFixed(2)}
                            </Badge>
                          </div>
                          <p className="text-[12px] text-foreground leading-relaxed">{item.description}</p>
                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            {item.drivers.map(d => (
                              <Badge key={d} variant="secondary" className="text-[8px] px-1.5 py-0">
                                {DRIVER_LABELS[d] || d}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </MetricCard>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-mono uppercase tracking-wider text-amber-500">ISR Reporting Notes</span>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-muted-foreground">
                      Aggregated outputs are de-identified and intended to support installation-level planning and reporting.
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      This does not replace official ISR formats; it demonstrates how governed advising intelligence can feed institutional awareness.
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Rack-and-stack priorities are deterministic: same inputs → same outputs. Scores are computed from cohort bottleneck frequency × policy weight + ESO capacity toggles.
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      ESO capacity constraints reflect installation-level conditions used to prioritize interventions. In real deployment these would be fed by command surveys, staffing systems, or program KPIs.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
