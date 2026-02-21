import { useState, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3, Users, AlertTriangle, Shield, Target,
  FileText, Cpu, ArrowDown, Activity,
  Lock, User, RefreshCw, ListOrdered, Gauge,
  Building2, Crosshair, Layers, Zap
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";

type AggMode = "sm" | "eso" | "combined";

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

interface EsoMetrics {
  workload_pressure_index: number;
  staff_training_deficiency: number;
  funding_shortfall_exposure: number;
  coordination_complexity: number;
  tracking_continuity_risk: number;
  change_resistance_level: number;
  deployed_coordination_burden: number;
}

interface RackStackItem {
  rank: number;
  id: string;
  priority_score: number;
  description: string;
  drivers: string[];
  stream: "sm" | "eso";
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

function computeEsoMetrics(agg: AggregateResult, eso: EsoConstraints): EsoMetrics {
  const reviewPct = agg.advisor_load.requires_human_review_pct;
  const highRiskPct = agg.advisor_load.high_risk_cohort_pct;
  const deployedPct = agg.constraint_friction.deployed_pct;

  const workload = Math.min(1.0,
    reviewPct * 0.4 +
    highRiskPct * 0.3 +
    (eso.high_staff_turnover ? 0.2 : 0) +
    deployedPct * 0.1
  );

  const training = Math.min(1.0,
    (eso.inadequate_staff_training ? 0.55 : 0.1) +
    (eso.high_staff_turnover ? 0.25 : 0) +
    highRiskPct * 0.2
  );

  const funding = Math.min(1.0,
    (eso.limited_funding ? 0.45 : 0.05) +
    agg.constraint_friction.no_ta_pct * 0.35 +
    (agg.bottlenecks.find(b => b.code === "TA_CAP_EXCEEDED")?.pct || 0) * 0.2
  );

  const coordination = Math.min(1.0,
    (eso.inefficient_stakeholder_communication ? 0.40 : 0.08) +
    deployedPct * 0.25 +
    reviewPct * 0.15 +
    (eso.high_staff_turnover ? 0.15 : 0)
  );

  const tracking = Math.min(1.0,
    (eso.difficulty_tracking_outcomes ? 0.50 : 0.08) +
    (agg.bottlenecks.find(b => b.code === "TRACKING_GAP")?.pct || 0) * 0.30 +
    deployedPct * 0.15
  );

  const change = Math.min(1.0,
    (eso.resistance_to_change ? 0.55 : 0.05) +
    (eso.inefficient_stakeholder_communication ? 0.20 : 0) +
    (eso.inadequate_staff_training ? 0.15 : 0)
  );

  const deployedBurden = Math.min(1.0,
    deployedPct * 2.5 +
    (eso.difficulty_tracking_outcomes ? 0.15 : 0) +
    (eso.high_staff_turnover ? 0.10 : 0)
  );

  return {
    workload_pressure_index: Math.round(workload * 10000) / 10000,
    staff_training_deficiency: Math.round(training * 10000) / 10000,
    funding_shortfall_exposure: Math.round(funding * 10000) / 10000,
    coordination_complexity: Math.round(coordination * 10000) / 10000,
    tracking_continuity_risk: Math.round(tracking * 10000) / 10000,
    change_resistance_level: Math.round(change * 10000) / 10000,
    deployed_coordination_burden: Math.round(deployedBurden * 10000) / 10000,
  };
}

function smRackAndStack(agg: AggregateResult): RackStackItem[] {
  const w = WEIGHTS;
  const friction = agg.constraint_friction;
  const bmap: Record<string, number> = {};
  for (const b of agg.bottlenecks) bmap[b.code] = b.pct;

  const scoreDriver = (code: string, pctVal: number) => (w[code] || 1) * pctVal;
  const candidates: Array<{ id: string; description: string; score: number; drivers: string[] }> = [];

  if (friction.deployed_pct > 0) {
    candidates.push({
      id: "DEPLOYED_ACCESS_SUPPORT",
      description: "Improve deployed learning access: testing windows, proctoring options, asynchronous study plans.",
      score: scoreDriver("SM_DEPLOYED", friction.deployed_pct),
      drivers: ["SM_DEPLOYED"],
    });
  }

  if (friction.lt_12_months_pct > 0) {
    candidates.push({
      id: "TIMELINE_COMPRESSION_PATHS",
      description: "Prioritize short-run pathways and post-separation benefit routing when service window is <12 months.",
      score: scoreDriver("LT_12_MONTHS", friction.lt_12_months_pct),
      drivers: ["LT_12_MONTHS"],
    });
  }

  if (friction.no_ta_pct > 0) {
    candidates.push({
      id: "FUNDING_GAP_MITIGATION",
      description: "Route to alternative funding: COOL, scholarships, credential vouchers, employer-sponsored pathways.",
      score: scoreDriver("NO_TA", friction.no_ta_pct),
      drivers: ["NO_TA"],
    });
  }

  if ((bmap.FOUNDATION_GAP || 0) > 0) {
    candidates.push({
      id: "FOUNDATIONAL_TRAINING_ACCESS",
      description: "Provide foundational IT/domain on-ramps: networking basics, OS fundamentals, study groups, lab access.",
      score: scoreDriver("FOUNDATION_GAP", bmap.FOUNDATION_GAP),
      drivers: ["FOUNDATION_GAP"],
    });
  }

  if ((bmap.TIER2_BARRIER || 0) > 0) {
    candidates.push({
      id: "CREDENTIAL_SEQUENCING_GUIDANCE",
      description: "Standardize credential sequencing guidance: time estimates, experience substitution, pre-req mapping.",
      score: scoreDriver("TIER2_BARRIER", bmap.TIER2_BARRIER),
      drivers: ["TIER2_BARRIER"],
    });
  }

  const noSB = friction.constraint_trigger_pct?.no_skillbridge || 0;
  if (noSB > 0) {
    candidates.push({
      id: "DEPLOYMENT_COMPATIBLE_LEARNING",
      description: "Create deployment-compatible learning pathways: asynchronous modules, offline content, flexible scheduling.",
      score: scoreDriver("NO_SKILLBRIDGE", noSB),
      drivers: ["NO_SKILLBRIDGE"],
    });
  }

  const clearancePct = friction.constraint_trigger_pct?.clearance_lapsing || 0;
  if (clearancePct > 0) {
    candidates.push({
      id: "CLEARANCE_TRANSITION_PLAN",
      description: "Accelerate clearance-dependent transition planning before lapse windows.",
      score: scoreDriver("CLEARANCE_LAPSING", clearancePct),
      drivers: ["CLEARANCE_LAPSING"],
    });
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates.slice(0, 8).map((c, i) => ({
    rank: i + 1,
    id: c.id,
    priority_score: Math.round(c.score * 10000) / 10000,
    description: c.description,
    drivers: c.drivers,
    stream: "sm" as const,
  }));
}

function esoRackAndStack(agg: AggregateResult, eso: EsoConstraints, esoMetrics: EsoMetrics): RackStackItem[] {
  const w = WEIGHTS;
  const candidates: Array<{ id: string; description: string; score: number; drivers: string[] }> = [];

  if (eso.inadequate_staff_training) {
    candidates.push({
      id: "STAFF_TRAINING_IMPROVEMENT",
      description: "Upgrade staff training: policy rules, tool workflows, advising scripts aligned to governance constraints.",
      score: (w.STAFF_TRAINING_GAP || 1) * esoMetrics.staff_training_deficiency * 4.0,
      drivers: ["STAFF_TRAINING_GAP"],
    });
  }

  if (eso.difficulty_tracking_outcomes) {
    candidates.push({
      id: "OUTCOME_TRACKING_SYSTEM",
      description: "Implement consistent outcome tracking: scenario IDs, pathway tracking, aggregate performance signals.",
      score: (w.TRACKING_GAP || 1) * esoMetrics.tracking_continuity_risk * 3.5,
      drivers: ["TRACKING_GAP"],
    });
  }

  if (eso.limited_funding) {
    candidates.push({
      id: "FUNDING_ALLOCATION_ADJUSTMENT",
      description: "Adjust funding allocation: prioritize high-demand credential stacks, reduce voucher friction, partner with employers.",
      score: (w.LIMITED_FUNDING || 1) * esoMetrics.funding_shortfall_exposure * 3.5,
      drivers: ["LIMITED_FUNDING"],
    });
  }

  if (eso.inefficient_stakeholder_communication) {
    candidates.push({
      id: "COMMUNICATION_PROTOCOL_STANDARDIZATION",
      description: "Standardize communication protocols: shared definitions, dashboards, and handoff procedures across stakeholders.",
      score: (w.COMMUNICATION_FRICTION || 1) * esoMetrics.coordination_complexity * 4.0,
      drivers: ["COMMUNICATION_FRICTION"],
    });
  }

  if (eso.high_staff_turnover) {
    candidates.push({
      id: "CONTINUITY_PLAYBOOK",
      description: "Create ESO continuity playbook: templated advising outputs, knowledge base, reduced turnover impact.",
      score: (w.STAFF_TURNOVER || 1) * esoMetrics.workload_pressure_index * 4.0,
      drivers: ["STAFF_TURNOVER"],
    });
  }

  if (eso.resistance_to_change) {
    candidates.push({
      id: "CHANGE_MANAGEMENT_PROGRAM",
      description: "Implement low-friction change management: small pilots, champion ESOs, and measurable wins.",
      score: (w.CHANGE_RESISTANCE || 1) * esoMetrics.change_resistance_level * 3.0,
      drivers: ["CHANGE_RESISTANCE"],
    });
  }

  if (esoMetrics.workload_pressure_index > THRESHOLDS.requires_intervention_share) {
    candidates.push({
      id: "ADVISOR_WORKLOAD_TRIAGE",
      description: "Implement triage routing: auto-flag high-risk cases, schedule priority consults, standardize review queues.",
      score: esoMetrics.workload_pressure_index * 3.5,
      drivers: ["ADVISOR_LOAD"],
    });
  }

  if (esoMetrics.deployed_coordination_burden > 0.2) {
    candidates.push({
      id: "DEPLOYED_COORDINATION_PROTOCOL",
      description: "Establish deployed SM coordination protocol: pre-deployment planning, remote check-ins, deployment-aware scheduling.",
      score: esoMetrics.deployed_coordination_burden * 3.0,
      drivers: ["SM_DEPLOYED"],
    });
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates.slice(0, 8).map((c, i) => ({
    rank: i + 1,
    id: c.id,
    priority_score: Math.round(c.score * 10000) / 10000,
    description: c.description,
    drivers: c.drivers,
    stream: "eso" as const,
  }));
}

function combinedRackAndStack(smItems: RackStackItem[], esoItems: RackStackItem[]): RackStackItem[] {
  const all = [...smItems, ...esoItems];
  all.sort((a, b) => b.priority_score - a.priority_score);
  return all.slice(0, 12).map((c, i) => ({ ...c, rank: i + 1 }));
}

interface CrossLayerInsight {
  id: string;
  title: string;
  description: string;
  smDrivers: string[];
  esoDrivers: string[];
  severity: "high" | "medium" | "low";
}

function generateCrossLayerInsights(agg: AggregateResult, esoMetrics: EsoMetrics, eso: EsoConstraints): CrossLayerInsight[] {
  const insights: CrossLayerInsight[] = [];
  const friction = agg.constraint_friction;

  const cyberDemand = agg.demand.career_goal_pct["Cybersecurity"] || 0;
  if (cyberDemand > 0.12 && friction.no_ta_pct > 0.08 && friction.deployed_pct > 0.10) {
    insights.push({
      id: "CYBER_DEMAND_FRICTION",
      title: "High cybersecurity demand + low TA + high deployment",
      description: "Priority: remote foundational training resources, deployment-compatible study plans, and alternative credential funding to address convergent demand-constraint friction.",
      smDrivers: ["SM_DEPLOYED", "NO_TA"],
      esoDrivers: ["LIMITED_FUNDING", "TRACKING_GAP"],
      severity: "high",
    });
  }

  if (friction.deployed_pct > 0.10 && eso.high_staff_turnover) {
    insights.push({
      id: "DEPLOYED_TURNOVER_CONVERGENCE",
      title: "High deployed population + ESO staff turnover",
      description: "Deployed SMs require sustained coordination, but turnover disrupts continuity. Priority: continuity playbook with deployment-aware templates and automated check-in scheduling.",
      smDrivers: ["SM_DEPLOYED"],
      esoDrivers: ["STAFF_TURNOVER"],
      severity: "high",
    });
  }

  if (friction.lt_12_months_pct > 0.15 && esoMetrics.workload_pressure_index > 0.35) {
    insights.push({
      id: "SHORT_TIMELINE_OVERLOAD",
      title: "Short timelines + advisor overload",
      description: "Significant share has <12 months while advisor load exceeds threshold. Priority: pre-built short-pathway packages and automated triage for timeline-critical cases.",
      smDrivers: ["LT_12_MONTHS"],
      esoDrivers: ["ADVISOR_LOAD"],
      severity: "high",
    });
  }

  if (eso.inadequate_staff_training && agg.advisor_load.high_risk_cohort_pct > 0.20) {
    insights.push({
      id: "TRAINING_RISK_GAP",
      title: "Staff training deficit + high-risk cohort volume",
      description: "Inadequately trained staff handling elevated high-risk caseload. Priority: targeted training on high-risk scenario patterns and escalation protocols.",
      smDrivers: ["FOUNDATION_GAP", "TIER2_BARRIER"],
      esoDrivers: ["STAFF_TRAINING_GAP"],
      severity: "medium",
    });
  }

  if (eso.difficulty_tracking_outcomes && friction.deployed_pct > 0.08) {
    insights.push({
      id: "TRACKING_DEPLOYED_BLIND_SPOT",
      title: "Tracking gaps + deployed population",
      description: "Deployed SMs are hardest to track, and ESO already reports tracking difficulties. Priority: scenario ID persistence, automated status polling, deployment-aware tracking.",
      smDrivers: ["SM_DEPLOYED"],
      esoDrivers: ["TRACKING_GAP"],
      severity: "medium",
    });
  }

  if (eso.limited_funding && friction.no_ta_pct > 0.08) {
    insights.push({
      id: "DUAL_FUNDING_SQUEEZE",
      title: "SM funding constraints + institutional funding limits",
      description: "Both individual TA gaps and ESO budget limits converge. Priority: employer partnerships, COOL routing, and scholarship consortium agreements.",
      smDrivers: ["NO_TA"],
      esoDrivers: ["LIMITED_FUNDING"],
      severity: "medium",
    });
  }

  return insights;
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

const ESO_METRIC_LABELS: Record<keyof EsoMetrics, { label: string; description: string }> = {
  workload_pressure_index: { label: "Advisor Workload Pressure", description: "Combined caseload intensity from review volume, risk share, and staffing" },
  staff_training_deficiency: { label: "Staff Training Deficiency", description: "Gap between required and available staff competencies" },
  funding_shortfall_exposure: { label: "Funding Shortfall Exposure", description: "Risk from TA constraints, budget limits, and credential cost gaps" },
  coordination_complexity: { label: "Program Coordination Complexity", description: "Friction from deployment, comms, turnover, and review volume" },
  tracking_continuity_risk: { label: "Tracking Continuity Risk", description: "Risk of losing SM progress due to tracking gaps and deployment" },
  change_resistance_level: { label: "Change Resistance Level", description: "Institutional friction against process improvement and new tools" },
  deployed_coordination_burden: { label: "Deployed Coordination Burden", description: "Extra workload from managing deployed SM education plans" },
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

function ModeToggle({ mode, onChange }: { mode: AggMode; onChange: (m: AggMode) => void }) {
  const modes: Array<{ value: AggMode; label: string; icon: typeof Users; color: string }> = [
    { value: "sm", label: "SM Signals", icon: User, color: "text-blue-500 border-blue-500/40 bg-blue-500/10" },
    { value: "eso", label: "ESO Signals", icon: Building2, color: "text-amber-500 border-amber-500/40 bg-amber-500/10" },
    { value: "combined", label: "Combined", icon: Layers, color: "text-cyan-500 border-cyan-500/40 bg-cyan-500/10" },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-muted/30" data-testid="mode-toggle">
      {modes.map(m => {
        const active = mode === m.value;
        const MIcon = m.icon;
        return (
          <button
            key={m.value}
            onClick={() => onChange(m.value)}
            data-testid={`mode-${m.value}`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              active ? `${m.color} border shadow-sm` : "text-muted-foreground hover:text-foreground border border-transparent"
            }`}
          >
            <MIcon className="w-3.5 h-3.5" />
            {m.label}
          </button>
        );
      })}
    </div>
  );
}

export default function EsoIsrDemoTab() {
  const [cohortSize, setCohortSize] = useState("250");
  const [seed, setSeed] = useState(7);
  const [hasRun, setHasRun] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aggMode, setAggMode] = useState<AggMode>("combined");

  const [esoConstraints, setEsoConstraints] = useState<EsoConstraints>({
    limited_funding: true,
    high_staff_turnover: true,
    inefficient_stakeholder_communication: true,
    inadequate_staff_training: true,
    difficulty_tracking_outcomes: true,
    resistance_to_change: true,
  });

  const activeEsoCount = Object.values(esoConstraints).filter(Boolean).length;

  const [agg, setAgg] = useState<AggregateResult | null>(null);
  const [esoMetrics, setEsoMetrics] = useState<EsoMetrics | null>(null);
  const [smPriorities, setSmPriorities] = useState<RackStackItem[]>([]);
  const [esoPriorities, setEsoPriorities] = useState<RackStackItem[]>([]);
  const [combinedPriorities, setCombinedPriorities] = useState<RackStackItem[]>([]);
  const [crossInsights, setCrossInsights] = useState<CrossLayerInsight[]>([]);

  const runDemo = useCallback(async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 400));
    const n = parseInt(cohortSize) || 250;
    const rows = generateDemoCohort(n, seed);
    const aggResult = aggregate(rows);
    const esoM = computeEsoMetrics(aggResult, esoConstraints);
    const smRS = smRackAndStack(aggResult);
    const esoRS = esoRackAndStack(aggResult, esoConstraints, esoM);
    const combined = combinedRackAndStack(smRS, esoRS);
    const insights = generateCrossLayerInsights(aggResult, esoM, esoConstraints);

    setAgg(aggResult);
    setEsoMetrics(esoM);
    setSmPriorities(smRS);
    setEsoPriorities(esoRS);
    setCombinedPriorities(combined);
    setCrossInsights(insights);
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

  const esoRadarData = useMemo(() => {
    if (!esoMetrics) return [];
    return [
      { dimension: "Workload", value: Math.round(esoMetrics.workload_pressure_index * 100) },
      { dimension: "Training", value: Math.round(esoMetrics.staff_training_deficiency * 100) },
      { dimension: "Funding", value: Math.round(esoMetrics.funding_shortfall_exposure * 100) },
      { dimension: "Coordination", value: Math.round(esoMetrics.coordination_complexity * 100) },
      { dimension: "Tracking", value: Math.round(esoMetrics.tracking_continuity_risk * 100) },
      { dimension: "Change", value: Math.round(esoMetrics.change_resistance_level * 100) },
    ];
  }, [esoMetrics]);

  const activePriorities = aggMode === "sm" ? smPriorities : aggMode === "eso" ? esoPriorities : combinedPriorities;

  const modeLabel = aggMode === "sm" ? "Service Member Signals" : aggMode === "eso" ? "ESO / Institutional Signals" : "Combined View";
  const modeColor = aggMode === "sm" ? "text-blue-500" : aggMode === "eso" ? "text-amber-500" : "text-cyan-500";
  const modeBorderColor = aggMode === "sm" ? "border-blue-500/30" : aggMode === "eso" ? "border-amber-500/30" : "border-cyan-500/30";

  return (
    <div className="space-y-6" data-testid="eso-isr-demo">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold" data-testid="isr-title">Installation Insights</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Three-layer intelligence: Individual → Population → Institution
          </p>
        </div>
        <ModeToggle mode={aggMode} onChange={setAggMode} />
      </div>

      <div className={`p-3 rounded-lg border ${modeBorderColor} bg-card/50`}>
        <div className="flex items-center gap-2 mb-1">
          {aggMode === "sm" && <User className={`w-4 h-4 ${modeColor}`} />}
          {aggMode === "eso" && <Building2 className={`w-4 h-4 ${modeColor}`} />}
          {aggMode === "combined" && <Layers className={`w-4 h-4 ${modeColor}`} />}
          <span className={`text-xs font-mono uppercase tracking-wider ${modeColor}`}>{modeLabel}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {aggMode === "sm" && "What barriers are soldiers facing? What pathways are in demand? What constraints are blocking transition? What risk cohorts exist?"}
          {aggMode === "eso" && "Where are program resources strained? Where is staff capacity insufficient? Where are tracking gaps occurring? What organizational issues are present?"}
          {aggMode === "combined" && "Cross-layer institutional intelligence: SM demand signals + ESO capacity signals → converged priorities and actionable interventions."}
        </p>
      </div>

      <div className="p-3 rounded-lg border border-cyan-500/30 bg-cyan-500/5">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-cyan-500" />
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-500">De-Identified by Design</span>
        </div>
        <p className="text-xs text-muted-foreground">
          All data shown is synthetic and aggregated. No individual service member information is displayed.
          Individual advising data and institutional intelligence are processed in separate analytic channels to preserve governance boundaries.
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
              <div className="text-xs font-mono uppercase tracking-wider text-amber-500 flex items-center gap-2 mb-2">
                <AlertTriangle className="w-3 h-3" />
                ESO Capacity Constraints
                {activeEsoCount > 0 && (
                  <Badge variant="destructive" className="text-[9px] ml-1">{activeEsoCount}</Badge>
                )}
              </div>
              <p className="text-[9px] text-muted-foreground mb-3">
                Installation-level conditions that affect ESO metrics and rack-and-stack priorities.
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
                <ArrowDown className="w-3 h-3 text-blue-500" />
                <span className="text-[9px] font-mono text-blue-500">SM STREAM</span>
              </div>
              <div className="flex items-center gap-1.5 mb-2">
                <ArrowDown className="w-3 h-3 text-amber-500" />
                <span className="text-[9px] font-mono text-amber-500">ESO STREAM</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ArrowDown className="w-3 h-3 text-cyan-500" />
                <span className="text-[9px] font-mono text-cyan-500">COMBINED → ISR</span>
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
                <p className="text-xs text-muted-foreground mt-2">Toggle between SM, ESO, and Combined views after generation.</p>
              </CardContent>
            </Card>
          ) : agg && esoMetrics && (
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

              {(aggMode === "sm" || aggMode === "combined") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="sm-panels">
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
                              <div className="h-full rounded-full bg-red-500" style={{ width: `${Math.min(b.pct * 100, 100)}%` }} />
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
                </div>
              )}

              {(aggMode === "eso" || aggMode === "combined") && (
                <div className="space-y-4" data-testid="eso-panels">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MetricCard title="ESO Institutional Pressure Radar" icon={Building2} iconColor="text-amber-500" testId="metric-eso-radar">
                      <ResponsiveContainer width="100%" height={200}>
                        <RadarChart data={esoRadarData} cx="50%" cy="50%" outerRadius="70%">
                          <PolarGrid stroke="hsl(var(--border))" />
                          <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
                          <PolarRadiusAxis tick={{ fontSize: 8 }} domain={[0, 100]} />
                          <Radar name="Pressure %" dataKey="value" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.25} />
                          <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ fontSize: 11, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </MetricCard>

                    <MetricCard title="ESO Signal Breakdown" icon={Activity} iconColor="text-amber-500" testId="metric-eso-signals">
                      <div className="space-y-3">
                        {(Object.keys(ESO_METRIC_LABELS) as Array<keyof EsoMetrics>).map(key => {
                          const val = esoMetrics[key];
                          const meta = ESO_METRIC_LABELS[key];
                          const pctVal = Math.round(val * 100);
                          const barColor = pctVal > 60 ? "bg-red-500" : pctVal > 35 ? "bg-amber-500" : "bg-green-500";
                          return (
                            <div key={key}>
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="text-[10px] text-foreground">{meta.label}</span>
                                <span className="text-[10px] font-mono text-muted-foreground">{pctVal}%</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(pctVal, 100)}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </MetricCard>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      </div>
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
                  </div>
                </div>
              )}

              {aggMode === "combined" && (
                <MetricCard title="Cross-Layer Intelligence" icon={Zap} iconColor="text-cyan-500" testId="metric-cross-insights">
                  <p className="text-[10px] text-muted-foreground mb-3">
                    Converged signals where SM demand patterns and ESO capacity constraints create compounding institutional challenges.
                  </p>
                  {crossInsights.length === 0 && (
                    <div className="p-3 rounded-lg border border-border bg-muted/20">
                      <p className="text-[11px] text-muted-foreground italic">No cross-layer convergence detected at current thresholds. Adjust ESO constraints or cohort size to surface institutional intelligence.</p>
                    </div>
                  )}
                  <div className="space-y-3">
                    {crossInsights.map(insight => (
                      <div
                        key={insight.id}
                        className={`p-3 rounded-lg border ${
                          insight.severity === "high" ? "border-red-500/30 bg-red-500/5" :
                          insight.severity === "medium" ? "border-amber-500/30 bg-amber-500/5" :
                          "border-border bg-muted/20"
                        }`}
                        data-testid={`insight-${insight.id}`}
                      >
                        <div className="flex items-start gap-2 mb-1.5">
                          <Crosshair className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                            insight.severity === "high" ? "text-red-500" : insight.severity === "medium" ? "text-amber-500" : "text-muted-foreground"
                          }`} />
                          <div>
                            <p className="text-[12px] font-medium text-foreground">{insight.title}</p>
                            <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{insight.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 ml-5">
                          <span className="text-[8px] font-mono text-blue-500">SM:</span>
                          {insight.smDrivers.map(d => (
                            <Badge key={d} variant="secondary" className="text-[8px] px-1.5 py-0 bg-blue-500/10 text-blue-400 border-blue-500/20">
                              {DRIVER_LABELS[d] || d}
                            </Badge>
                          ))}
                          <span className="text-[8px] font-mono text-amber-500 ml-2">ESO:</span>
                          {insight.esoDrivers.map(d => (
                            <Badge key={d} variant="secondary" className="text-[8px] px-1.5 py-0 bg-amber-500/10 text-amber-400 border-amber-500/20">
                              {DRIVER_LABELS[d] || d}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </MetricCard>
              )}

              <MetricCard
                title={`Rack and Stack — ${aggMode === "sm" ? "SM" : aggMode === "eso" ? "ESO" : "Combined"} Priorities`}
                icon={ListOrdered}
                iconColor={modeColor}
                testId="metric-rack-stack"
              >
                <p className="text-[10px] text-muted-foreground mb-3">
                  {aggMode === "sm" && "Service member-facing priorities ranked by constraint frequency × policy weight. These address barriers soldiers face directly."}
                  {aggMode === "eso" && "Institutional priorities ranked by ESO capacity pressure × organizational weight. These address program and staffing challenges."}
                  {aggMode === "combined" && "Merged SM + ESO priorities ranked by score. Stream badges indicate whether each item addresses soldier barriers (SM) or institutional issues (ESO)."}
                </p>
                <div className="space-y-2">
                  {activePriorities.map((item) => (
                    <div
                      key={`${item.stream}-${item.id}`}
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
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-muted-foreground">{item.id}</span>
                              {aggMode === "combined" && (
                                <Badge
                                  variant="outline"
                                  className={`text-[8px] px-1.5 py-0 ${
                                    item.stream === "sm" ? "text-blue-500 border-blue-500/30" : "text-amber-500 border-amber-500/30"
                                  }`}
                                >
                                  {item.stream === "sm" ? "SM" : "ESO"}
                                </Badge>
                              )}
                            </div>
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
                      SM and ESO streams are processed in separate analytic channels. Combined view merges priorities to show institutional intelligence.
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Rack-and-stack priorities are deterministic: same inputs → same outputs. Scores are computed from stream-specific algorithms.
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Governance advantage: separating individual advising signals from institutional capacity signals preserves analytic boundaries while enabling cross-layer insights.
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
