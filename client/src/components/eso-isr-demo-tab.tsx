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
  Building2, Layers, Zap, BookOpen, Clock,
  GraduationCap, HelpCircle, Plane, ChevronDown, ChevronUp
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";

type ViewMode = "eso_caseload" | "isr_report";
type EnrollmentStatus = "enrolled" | "exploring" | "not_started";

const MOS_GROUPS = ["Logistics", "Intel/Analysis", "Signal/Comms", "Medical", "Combat Arms", "Admin/HR"];
const CAREER_GOALS = ["Cybersecurity", "Project Management", "Healthcare Administration", "Data Analytics", "Education / Training", "Business Management"];

const FIRST_NAMES = [
  "James", "Robert", "John", "Michael", "David", "William", "Richard", "Joseph",
  "Thomas", "Christopher", "Charles", "Daniel", "Matthew", "Anthony", "Mark",
  "Donald", "Steven", "Andrew", "Paul", "Joshua", "Kenneth", "Kevin", "Brian",
  "George", "Timothy", "Ronald", "Edward", "Jason", "Jeffrey", "Ryan",
  "Jacob", "Gary", "Nicholas", "Eric", "Jonathan", "Stephen", "Larry",
  "Justin", "Scott", "Brandon", "Benjamin", "Samuel", "Raymond", "Gregory",
  "Frank", "Alexander", "Patrick", "Jack", "Dennis", "Jerry",
  "Maria", "Jennifer", "Patricia", "Linda", "Elizabeth", "Barbara", "Susan",
  "Jessica", "Sarah", "Karen", "Lisa", "Nancy", "Betty", "Sandra",
  "Margaret", "Ashley", "Dorothy", "Kimberly", "Emily", "Donna",
  "Michelle", "Carol", "Amanda", "Melissa", "Deborah", "Stephanie", "Rebecca",
  "Sharon", "Laura", "Cynthia", "Kathleen", "Amy", "Angela", "Shirley",
  "Anna", "Brenda", "Pamela", "Emma", "Nicole", "Helen", "Samantha",
  "Katherine", "Christine", "Debra", "Rachel", "Carolyn", "Janet", "Catherine",
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
  "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
  "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres",
  "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker",
  "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts",
];

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
  name: string;
  rank: string;
  years_bucket: number;
  mos_group: string;
  career_goal: string;
  enrollment_status: EnrollmentStatus;
  days_waiting: number;
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

interface CaseloadEntry {
  rank_order: number;
  name: string;
  rank: string;
  mos_group: string;
  career_goal: string;
  enrollment_status: EnrollmentStatus;
  days_waiting: number;
  deployed: boolean;
  priority_score: number;
  flags: string[];
  needs_review: boolean;
  risk_level: "low" | "medium" | "high";
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
    const firstName = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    const name = `${lastName}, ${firstName}`;

    const mos = MOS_GROUPS[Math.floor(rand() * MOS_GROUPS.length)];
    const goal = CAREER_GOALS[Math.floor(rand() * CAREER_GOALS.length)];
    const rank = ranks[Math.floor(rand() * ranks.length)];
    const yos = yosBuckets[Math.floor(rand() * yosBuckets.length)];

    const enrollRoll = rand();
    const enrollment_status: EnrollmentStatus = enrollRoll < 0.35 ? "enrolled" : enrollRoll < 0.65 ? "exploring" : "not_started";

    const days_waiting = Math.floor(rand() * 180) + (enrollment_status === "not_started" ? 0 : 7);

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
      name,
      rank,
      years_bucket: yos,
      mos_group: mos,
      career_goal: goal,
      enrollment_status,
      days_waiting,
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

function computeRiskLevel(row: CohortRow): "low" | "medium" | "high" {
  const highCount = Object.values(row.engine.indicators).filter(v => v === "high").length;
  if (highCount >= 2 || (row.engine.warnings.includes("FOUNDATION_GAP") && row.engine.tier >= 2)) return "high";
  if (highCount >= 1 || row.engine.tier >= 2) return "medium";
  return "low";
}

function buildCaseload(rows: CohortRow[]): CaseloadEntry[] {
  const entries: CaseloadEntry[] = rows.map(row => {
    let score = 0;

    if (row.constraints.deployed) score += 30;

    score += Math.min(row.days_waiting / 3, 30);

    if (row.enrollment_status === "enrolled") score += 20;
    else if (row.enrollment_status === "exploring") score += 10;

    if (row.constraints.lt_12_months) score += 25;

    if (row.engine.tier >= 2) score += 10;

    const highIndicators = Object.values(row.engine.indicators).filter(v => v === "high").length;
    score += highIndicators * 8;

    if (row.constraints.clearance_lapsing) score += 15;
    if (row.constraints.no_ta) score += 5;

    const flags: string[] = [];
    if (row.constraints.deployed) flags.push("DEPLOYED");
    if (row.constraints.lt_12_months) flags.push("< 12 MO");
    if (row.enrollment_status === "enrolled") flags.push("IN SCHOOL");
    if (row.enrollment_status === "exploring") flags.push("EXPLORING");
    if (row.enrollment_status === "not_started") flags.push("NOT STARTED");
    if (row.constraints.clearance_lapsing) flags.push("CLEARANCE");
    if (row.constraints.no_ta) flags.push("NO TA");
    if (row.engine.warnings.includes("FOUNDATION_GAP")) flags.push("FOUNDATION GAP");

    return {
      rank_order: 0,
      name: row.name,
      rank: row.rank,
      mos_group: row.mos_group,
      career_goal: row.career_goal,
      enrollment_status: row.enrollment_status,
      days_waiting: row.days_waiting,
      deployed: row.constraints.deployed,
      priority_score: Math.round(score * 100) / 100,
      flags,
      needs_review: requiresHumanReview(row),
      risk_level: computeRiskLevel(row),
    };
  });

  entries.sort((a, b) => b.priority_score - a.priority_score);
  entries.forEach((e, i) => { e.rank_order = i + 1; });

  return entries;
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
    reviewPct * 0.4 + highRiskPct * 0.3 + (eso.high_staff_turnover ? 0.2 : 0) + deployedPct * 0.1
  );
  const training = Math.min(1.0,
    (eso.inadequate_staff_training ? 0.55 : 0.1) + (eso.high_staff_turnover ? 0.25 : 0) + highRiskPct * 0.2
  );
  const funding = Math.min(1.0,
    (eso.limited_funding ? 0.45 : 0.05) + agg.constraint_friction.no_ta_pct * 0.35 +
    (agg.bottlenecks.find(b => b.code === "TA_CAP_EXCEEDED")?.pct || 0) * 0.2
  );
  const coordination = Math.min(1.0,
    (eso.inefficient_stakeholder_communication ? 0.40 : 0.08) + deployedPct * 0.25 +
    reviewPct * 0.15 + (eso.high_staff_turnover ? 0.15 : 0)
  );
  const tracking = Math.min(1.0,
    (eso.difficulty_tracking_outcomes ? 0.50 : 0.08) +
    (agg.bottlenecks.find(b => b.code === "TRACKING_GAP")?.pct || 0) * 0.30 + deployedPct * 0.15
  );
  const change = Math.min(1.0,
    (eso.resistance_to_change ? 0.55 : 0.05) +
    (eso.inefficient_stakeholder_communication ? 0.20 : 0) + (eso.inadequate_staff_training ? 0.15 : 0)
  );
  const deployedBurden = Math.min(1.0,
    deployedPct * 2.5 + (eso.difficulty_tracking_outcomes ? 0.15 : 0) + (eso.high_staff_turnover ? 0.10 : 0)
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

function isrRackAndStack(agg: AggregateResult, eso: EsoConstraints, esoMetrics: EsoMetrics): RackStackItem[] {
  const w = WEIGHTS;
  const friction = agg.constraint_friction;
  const bmap: Record<string, number> = {};
  for (const b of agg.bottlenecks) bmap[b.code] = b.pct;

  const scoreDriver = (code: string, pctVal: number) => (w[code] || 1) * pctVal;
  const candidates: Array<{ id: string; description: string; score: number; drivers: string[] }> = [];

  if (friction.deployed_pct > 0) {
    candidates.push({
      id: "DEPLOYED_ACCESS_SUPPORT",
      description: "Improve deployed learning access (testing windows, proctoring options, asynchronous study plans).",
      score: scoreDriver("SM_DEPLOYED", friction.deployed_pct) + (esoMetrics.deployed_coordination_burden * 1.5),
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

  if (friction.no_ta_pct > 0 || eso.limited_funding) {
    let base = scoreDriver("NO_TA", friction.no_ta_pct);
    base += (w.LIMITED_FUNDING || 1) * (eso.limited_funding ? esoMetrics.funding_shortfall_exposure : 0);
    candidates.push({
      id: "FUNDING_FRICTION_REDUCTION",
      description: "Reduce funding friction: pre-approved credential stacks, voucher routing, alternative pathways when TA/CA is constrained.",
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
      score: (w.STAFF_TURNOVER || 1) * esoMetrics.workload_pressure_index * 3.5,
      drivers: ["STAFF_TURNOVER"],
    });
  }

  if (eso.inadequate_staff_training) {
    candidates.push({
      id: "STAFF_TRAINING_UPGRADE",
      description: "Add staff training: policy rules, tool workflows, and advising scripts aligned to governance constraints.",
      score: (w.STAFF_TRAINING_GAP || 1) * esoMetrics.staff_training_deficiency * 3.5,
      drivers: ["STAFF_TRAINING_GAP"],
    });
  }

  if (eso.inefficient_stakeholder_communication) {
    candidates.push({
      id: "STAKEHOLDER_SIGNAL_BRIDGE",
      description: "Improve stakeholder communications: shared definitions, dashboards, and standardized handoffs.",
      score: (w.COMMUNICATION_FRICTION || 1) * esoMetrics.coordination_complexity * 4.0,
      drivers: ["COMMUNICATION_FRICTION"],
    });
  }

  if (eso.difficulty_tracking_outcomes || bmap.TRACKING_GAP) {
    let base = (w.TRACKING_GAP || 1) * (bmap.TRACKING_GAP || 0);
    if (eso.difficulty_tracking_outcomes) base += (w.TRACKING_GAP || 1) * esoMetrics.tracking_continuity_risk;
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
      score: (w.CHANGE_RESISTANCE || 1) * esoMetrics.change_resistance_level * 3.0,
      drivers: ["CHANGE_RESISTANCE"],
    });
  }

  const rh = agg.advisor_load.requires_human_review_pct;
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

const ESO_METRIC_LABELS: Record<keyof EsoMetrics, { label: string }> = {
  workload_pressure_index: { label: "Advisor Workload Pressure" },
  staff_training_deficiency: { label: "Staff Training Deficiency" },
  funding_shortfall_exposure: { label: "Funding Shortfall Exposure" },
  coordination_complexity: { label: "Program Coordination Complexity" },
  tracking_continuity_risk: { label: "Tracking Continuity Risk" },
  change_resistance_level: { label: "Change Resistance Level" },
  deployed_coordination_burden: { label: "Deployed Coordination Burden" },
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

function ViewToggle({ mode, onChange }: { mode: ViewMode; onChange: (m: ViewMode) => void }) {
  const modes: Array<{ value: ViewMode; label: string; icon: typeof Users; color: string }> = [
    { value: "eso_caseload", label: "ESO Caseload", icon: User, color: "text-blue-500 border-blue-500/40 bg-blue-500/10" },
    { value: "isr_report", label: "ISR Report", icon: Building2, color: "text-amber-500 border-amber-500/40 bg-amber-500/10" },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-muted/30" data-testid="view-toggle">
      {modes.map(m => {
        const active = mode === m.value;
        const MIcon = m.icon;
        return (
          <button
            key={m.value}
            onClick={() => onChange(m.value)}
            data-testid={`view-${m.value}`}
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

const ENROLLMENT_CONFIG: Record<EnrollmentStatus, { label: string; icon: typeof GraduationCap; color: string; badgeClass: string }> = {
  enrolled: { label: "In School", icon: GraduationCap, color: "text-green-500", badgeClass: "bg-green-500/10 text-green-500 border-green-500/20" },
  exploring: { label: "Exploring", icon: HelpCircle, color: "text-amber-500", badgeClass: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  not_started: { label: "Not Started", icon: Clock, color: "text-muted-foreground", badgeClass: "bg-muted text-muted-foreground border-border" },
};

function CaseloadRow({ entry, expanded, onToggle }: { entry: CaseloadEntry; expanded: boolean; onToggle: () => void }) {
  const riskColor = entry.risk_level === "high" ? "text-red-500" : entry.risk_level === "medium" ? "text-amber-500" : "text-green-500";
  const riskBg = entry.risk_level === "high" ? "bg-red-500/20 border-red-500/30" : entry.risk_level === "medium" ? "bg-amber-500/20 border-amber-500/30" : "bg-green-500/20 border-green-500/30";
  const enrollCfg = ENROLLMENT_CONFIG[entry.enrollment_status];
  const EnrollIcon = enrollCfg.icon;

  return (
    <div
      className={`rounded-lg border transition-colors ${entry.deployed ? "border-cyan-500/30 bg-cyan-500/5" : "border-border bg-card"} ${entry.needs_review ? "ring-1 ring-amber-500/20" : ""}`}
      data-testid={`caseload-row-${entry.rank_order}`}
    >
      <div
        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={onToggle}
        data-testid={`caseload-toggle-${entry.rank_order}`}
      >
        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${riskBg} ${riskColor}`}>
          {entry.rank_order}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-foreground" data-testid={`caseload-name-${entry.rank_order}`}>{entry.name}</span>
            <span className="text-[10px] font-mono text-muted-foreground">{entry.rank}</span>
            {entry.deployed && (
              <Badge variant="outline" className="text-[8px] px-1.5 py-0 text-cyan-500 border-cyan-500/30">
                <Plane className="w-2.5 h-2.5 mr-0.5" />
                DEPLOYED
              </Badge>
            )}
            {entry.needs_review && (
              <Badge variant="outline" className="text-[8px] px-1.5 py-0 text-amber-500 border-amber-500/30">
                REVIEW
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[10px] text-muted-foreground">{entry.mos_group}</span>
            <span className="text-[10px] text-muted-foreground">→</span>
            <span className="text-[10px] text-foreground">{entry.career_goal}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant="outline" className={`text-[8px] px-1.5 py-0 ${enrollCfg.badgeClass}`}>
            <EnrollIcon className="w-2.5 h-2.5 mr-0.5" />
            {enrollCfg.label}
          </Badge>
          <div className="text-right">
            <div className="text-[10px] font-mono text-muted-foreground">{entry.days_waiting}d wait</div>
            <div className="text-[9px] font-mono text-muted-foreground">Score: {entry.priority_score.toFixed(1)}</div>
          </div>
          {expanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 pt-0 border-t border-border/50" data-testid={`caseload-detail-${entry.rank_order}`}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
            <div>
              <span className="text-[9px] font-mono text-muted-foreground block">Risk Level</span>
              <span className={`text-[11px] font-medium ${riskColor}`}>{entry.risk_level.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-muted-foreground block">Enrollment</span>
              <span className={`text-[11px] font-medium ${enrollCfg.color}`}>{enrollCfg.label}</span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-muted-foreground block">Wait Time</span>
              <span className="text-[11px] font-medium text-foreground">{entry.days_waiting} days</span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-muted-foreground block">Priority Score</span>
              <span className="text-[11px] font-medium text-foreground">{entry.priority_score.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {entry.flags.map(f => (
              <Badge key={f} variant="secondary" className="text-[8px] px-1.5 py-0">{f}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EsoIsrDemoTab() {
  const [cohortSize, setCohortSize] = useState("250");
  const [seed, setSeed] = useState(7);
  const [hasRun, setHasRun] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("eso_caseload");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [caseloadFilter, setCaseloadFilter] = useState<"all" | "review" | "deployed" | "enrolled" | "exploring">("all");

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
  const [caseload, setCaseload] = useState<CaseloadEntry[]>([]);
  const [priorities, setPriorities] = useState<RackStackItem[]>([]);

  const runDemo = useCallback(async () => {
    setIsGenerating(true);
    setExpandedRows(new Set());
    await new Promise(r => setTimeout(r, 400));
    const n = parseInt(cohortSize) || 250;
    const rows = generateDemoCohort(n, seed);
    const aggResult = aggregate(rows);
    const esoM = computeEsoMetrics(aggResult, esoConstraints);
    const rackStack = isrRackAndStack(aggResult, esoConstraints, esoM);
    const caseloadEntries = buildCaseload(rows);

    setAgg(aggResult);
    setEsoMetrics(esoM);
    setCaseload(caseloadEntries);
    setPriorities(rackStack);
    setHasRun(true);
    setIsGenerating(false);
  }, [cohortSize, seed, esoConstraints]);

  const regenerate = useCallback(() => {
    setSeed(prev => prev + 1);
  }, []);

  const toggleRow = useCallback((rank: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(rank)) next.delete(rank); else next.add(rank);
      return next;
    });
  }, []);

  const filteredCaseload = useMemo(() => {
    if (caseloadFilter === "all") return caseload;
    if (caseloadFilter === "review") return caseload.filter(e => e.needs_review);
    if (caseloadFilter === "deployed") return caseload.filter(e => e.deployed);
    if (caseloadFilter === "enrolled") return caseload.filter(e => e.enrollment_status === "enrolled");
    if (caseloadFilter === "exploring") return caseload.filter(e => e.enrollment_status === "exploring");
    return caseload;
  }, [caseload, caseloadFilter]);

  const caseloadStats = useMemo(() => {
    if (caseload.length === 0) return null;
    return {
      total: caseload.length,
      deployed: caseload.filter(e => e.deployed).length,
      enrolled: caseload.filter(e => e.enrollment_status === "enrolled").length,
      exploring: caseload.filter(e => e.enrollment_status === "exploring").length,
      not_started: caseload.filter(e => e.enrollment_status === "not_started").length,
      needs_review: caseload.filter(e => e.needs_review).length,
      high_risk: caseload.filter(e => e.risk_level === "high").length,
      avg_wait: Math.round(caseload.reduce((s, e) => s + e.days_waiting, 0) / caseload.length),
    };
  }, [caseload]);

  const demandGoalData = useMemo(() => {
    if (!agg) return [];
    return Object.entries(agg.demand.career_goal_pct)
      .map(([name, value]) => ({ name: name.length > 18 ? name.slice(0, 16) + "…" : name, fullName: name, value: Math.round(value * 100) }))
      .sort((a, b) => b.value - a.value);
  }, [agg]);

  const constraintData = useMemo(() => {
    if (!agg) return [];
    const labels: Record<string, string> = {
      deployed: "Deployed", lt_12_months: "< 12 Months", no_ta: "No TA",
      no_skillbridge: "No SkillBridge", family_relocation: "Family Reloc.", clearance_lapsing: "Clearance",
    };
    return Object.entries(agg.constraint_friction.constraint_trigger_pct)
      .map(([key, value]) => ({ name: labels[key] || key, value: Math.round(value * 100) }))
      .sort((a, b) => b.value - a.value);
  }, [agg]);

  const riskRadarData = useMemo(() => {
    if (!agg) return [];
    const shortLabels: Record<string, string> = {
      "Timeline Feasibility": "Timeline", "Financial Stress": "Financial",
      "Transition Stress": "Transition", "Domain Alignment": "Domain", "Family Impact": "Family",
    };
    return Object.entries(agg.readiness_risk).map(([dim, levels]) => ({
      dimension: shortLabels[dim] || dim,
      high: Math.round(levels.high * 100),
      medium: Math.round(levels.medium * 100),
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

  return (
    <div className="space-y-6" data-testid="eso-isr-demo">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold" data-testid="isr-title">Installation Insights</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            B → C dual-arrow: ESO receives individual caseload + normalized aggregate ISR report
          </p>
        </div>
        <ViewToggle mode={viewMode} onChange={setViewMode} />
      </div>

      <div className={`p-3 rounded-lg border ${viewMode === "eso_caseload" ? "border-blue-500/30" : "border-amber-500/30"} bg-card/50`}>
        <div className="flex items-center gap-2 mb-1">
          {viewMode === "eso_caseload" ? (
            <>
              <User className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-mono uppercase tracking-wider text-blue-500">ESO Service Member Caseload</span>
            </>
          ) : (
            <>
              <Building2 className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-mono uppercase tracking-wider text-amber-500">Aggregated ISR Report</span>
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {viewMode === "eso_caseload"
            ? "Named service member list ranked by service priority: deployed status, time waiting, enrollment stage, and risk indicators. This is the ESO's working queue."
            : "Normalized, de-identified aggregate intelligence. No individual names — population-level patterns for installation reporting under AR 210-14."
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-4 space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Cpu className="w-3 h-3 text-primary" />
              Configuration
            </div>

            <div>
              <label className="text-[11px] text-muted-foreground block mb-1">Cohort Size</label>
              <Select value={cohortSize} onValueChange={setCohortSize}>
                <SelectTrigger data-testid="select-cohort-size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50 scenarios</SelectItem>
                  <SelectItem value="100">100 scenarios</SelectItem>
                  <SelectItem value="250">250 scenarios</SelectItem>
                  <SelectItem value="500">500 scenarios</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={runDemo} disabled={isGenerating} className="w-full" data-testid="button-run-isr">
              {isGenerating ? (
                <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Generating...</>
              ) : (
                <><BarChart3 className="w-4 h-4 mr-2" />{hasRun ? "Re-run Analysis" : "Generate Report"}</>
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
                Installation-level conditions that affect ISR rack-and-stack priorities.
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
                <span className="text-[9px] font-mono text-blue-500">B → C INDIVIDUAL (ESO CASELOAD)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ArrowDown className="w-3 h-3 text-amber-500" />
                <span className="text-[9px] font-mono text-amber-500">B → C AGGREGATE (ISR REPORT)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          {!hasRun ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Click "Generate Report" to see the ESO's dual-channel output.</p>
                <p className="text-xs text-muted-foreground mt-2">Toggle between ESO Caseload (named list) and ISR Report (aggregate intelligence).</p>
              </CardContent>
            </Card>
          ) : viewMode === "eso_caseload" && caseloadStats ? (
            <>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  {caseloadStats.total} service members
                </Badge>
                <Badge variant="outline" className="text-xs text-cyan-500 border-cyan-500/30">
                  <Plane className="w-3 h-3 mr-1" />
                  {caseloadStats.deployed} deployed
                </Badge>
                <Badge variant="outline" className="text-xs text-green-500 border-green-500/30">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  {caseloadStats.enrolled} enrolled
                </Badge>
                <Badge variant="outline" className="text-xs text-amber-500 border-amber-500/30">
                  <HelpCircle className="w-3 h-3 mr-1" />
                  {caseloadStats.exploring} exploring
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {caseloadStats.needs_review} need review
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {caseloadStats.avg_wait}d avg wait
                </Badge>
              </div>

              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <ListOrdered className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Service Priority Queue</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-3">
                    Ranked by: deployed status (+30) → time waiting (up to +30) → enrolled (+20) / exploring (+10) → &lt;12 months (+25) → risk indicators → clearance lapsing (+15).
                    Click any row to expand details.
                  </p>

                  <div className="flex items-center gap-1.5 mb-3 flex-wrap" data-testid="caseload-filters">
                    {([
                      { key: "all" as const, label: "All", count: caseloadStats.total },
                      { key: "review" as const, label: "Need Review", count: caseloadStats.needs_review },
                      { key: "deployed" as const, label: "Deployed", count: caseloadStats.deployed },
                      { key: "enrolled" as const, label: "Enrolled", count: caseloadStats.enrolled },
                      { key: "exploring" as const, label: "Exploring", count: caseloadStats.exploring },
                    ]).map(f => (
                      <button
                        key={f.key}
                        onClick={() => setCaseloadFilter(f.key)}
                        data-testid={`filter-${f.key}`}
                        className={`text-[10px] px-2 py-1 rounded-md border transition-all ${
                          caseloadFilter === f.key
                            ? "border-primary bg-primary/10 text-primary font-medium"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        {f.label} ({f.count})
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1.5 max-h-[600px] overflow-y-auto" data-testid="caseload-list">
                    {filteredCaseload.map(entry => (
                      <CaseloadRow
                        key={entry.rank_order}
                        entry={entry}
                        expanded={expandedRows.has(entry.rank_order)}
                        onToggle={() => toggleRow(entry.rank_order)}
                      />
                    ))}
                    {filteredCaseload.length === 0 && (
                      <p className="text-[11px] text-muted-foreground italic py-4 text-center">No service members match this filter.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-mono uppercase tracking-wider text-blue-500">ESO Caseload Notes</span>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-muted-foreground">
                      This is the ESO's working list — named service members ranked by service priority for individual advising.
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Priority weighting: deployed SMs surface first (coordination burden), followed by longest-waiting, actively enrolled over exploring, and risk-flagged cases.
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Toggle to "ISR Report" to see the same population as normalized, de-identified aggregate intelligence for installation reporting.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : agg && esoMetrics ? (
            <>
              <div className="p-3 rounded-lg border border-cyan-500/30 bg-cyan-500/5">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-cyan-500" />
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-500">De-Identified by Design</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  All data below is normalized and aggregated. No individual service member names or identifiers are shown.
                  This is the same population as the ESO Caseload, presented as institutional intelligence.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  {agg.population_n} scenarios
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Activity className="w-3 h-3 mr-1" />
                  {Math.round(agg.advisor_load.requires_human_review_pct * 100)}% require review
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
                  </div>
                </MetricCard>

                <MetricCard title="ESO Institutional Pressure" icon={Building2} iconColor="text-amber-500" testId="metric-eso-radar">
                  <ResponsiveContainer width="100%" height={180}>
                    <RadarChart data={esoRadarData} cx="50%" cy="50%" outerRadius="70%">
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
                      <PolarRadiusAxis tick={{ fontSize: 8 }} domain={[0, 100]} />
                      <Radar name="Pressure %" dataKey="value" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.25} />
                      <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ fontSize: 11, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                    </RadarChart>
                  </ResponsiveContainer>
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
                            <div className="h-full rounded-full bg-red-500" style={{ width: `${Math.min(b.pct * 100, 100)}%` }} />
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground w-10 text-right">{Math.round(b.pct * 100)}%</span>
                        </div>
                      </div>
                    ))}
                    {agg.bottlenecks.length === 0 && (
                      <p className="text-[11px] text-muted-foreground italic">No bottlenecks detected.</p>
                    )}
                  </div>
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
                        Threshold: {Math.round(THRESHOLDS.requires_intervention_share * 100)}% — {agg.advisor_load.requires_human_review_pct > THRESHOLDS.requires_intervention_share ? "EXCEEDED" : "within capacity"}
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
                        Threshold: {Math.round(THRESHOLDS.high_risk_indicator_share * 100)}% — {agg.advisor_load.high_risk_cohort_pct > THRESHOLDS.high_risk_indicator_share ? "EXCEEDED" : "within range"}
                      </p>
                    </div>
                  </div>
                </MetricCard>

                <MetricCard title="Enrollment Status Distribution" icon={BookOpen} iconColor="text-green-500" testId="metric-enrollment">
                  <div className="space-y-3">
                    {caseloadStats && ([
                      { label: "Actively Enrolled", count: caseloadStats.enrolled, color: "bg-green-500", pctVal: Math.round(caseloadStats.enrolled / caseloadStats.total * 100) },
                      { label: "Exploring Options", count: caseloadStats.exploring, color: "bg-amber-500", pctVal: Math.round(caseloadStats.exploring / caseloadStats.total * 100) },
                      { label: "Not Started", count: caseloadStats.not_started, color: "bg-muted-foreground", pctVal: Math.round(caseloadStats.not_started / caseloadStats.total * 100) },
                    ]).map(s => (
                      <div key={s.label}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] text-foreground">{s.label}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">{s.pctVal}% ({s.count})</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pctVal}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </MetricCard>
              </div>

              <MetricCard title="Rack and Stack — Prioritized Interventions" icon={ListOrdered} iconColor="text-primary" testId="metric-rack-stack">
                <p className="text-[10px] text-muted-foreground mb-3">
                  Ranked by deterministic priority scoring: cohort bottleneck frequency × weight + ESO capacity constraints + institutional pressure signals.
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
                      This is the normalized, de-identified channel. The same population visible in the ESO Caseload view is aggregated here without individual names.
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Governance advantage: individual advising data (ESO Caseload) and institutional intelligence (ISR Report) are processed as separate analytic channels.
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Rack-and-stack priorities are deterministic: same inputs → same outputs.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
