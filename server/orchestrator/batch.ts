import { generateProfile, generateRandomProfile } from "./profiles";
import { runScenario, type ScenarioResult } from "./engine";

function generateBatchId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BATCH-${timestamp}-${random}`;
}

export interface BatchResult {
  batchId: string;
  totalCases: number;
  completedCases: number;
  failedCases: number;
  results: ScenarioResult[];
  summary: BatchSummary;
}

export interface BatchSummary {
  feasibilityDistribution: { high: number; moderate: number; low: number };
  averageDataCompleteness: number;
  totalHighRiskConstraints: number;
  averagePathwayCount: number;
  constraintFrequency: Array<{ label: string; count: number; percentage: number }>;
  mosDistribution: Array<{ mos: string; count: number; percentage: number }>;
  goalDistribution: Array<{ goal: string; count: number; percentage: number }>;
  readinessByDimension: Array<{
    dimension: string;
    green: number;
    yellow: number;
    red: number;
  }>;
}

interface BatchOptions {
  count?: number;
  profileTypes?: string[];
  fixedMos?: string;
  fixedGoal?: string;
}

export async function runBatch(options: BatchOptions = {}): Promise<BatchResult> {
  const count = Math.min(Math.max(options.count || 10, 1), 50);
  const batchId = generateBatchId();

  const results: ScenarioResult[] = [];
  let failedCases = 0;

  for (let i = 0; i < count; i++) {
    try {
      let profile;
      if (options.profileTypes && options.profileTypes.length > 0) {
        const profileType = options.profileTypes[i % options.profileTypes.length];
        profile = generateProfile(profileType, {
          ...(options.fixedMos ? { mos: options.fixedMos } : {}),
          ...(options.fixedGoal ? { careerGoal: options.fixedGoal } : {}),
        });
      } else {
        profile = generateRandomProfile();
        if (options.fixedMos) profile.mos = options.fixedMos;
        if (options.fixedGoal) profile.careerGoal = options.fixedGoal;
      }

      const result = await runScenario(profile);
      results.push(result);
    } catch (error) {
      failedCases++;
      console.error(`Batch case ${i + 1} failed:`, error);
    }
  }

  const summary = computeBatchSummary(results);

  return {
    batchId,
    totalCases: count,
    completedCases: results.length,
    failedCases,
    results,
    summary,
  };
}

function computeBatchSummary(results: ScenarioResult[]): BatchSummary {
  const total = results.length;
  if (total === 0) {
    return {
      feasibilityDistribution: { high: 0, moderate: 0, low: 0 },
      averageDataCompleteness: 0,
      totalHighRiskConstraints: 0,
      averagePathwayCount: 0,
      constraintFrequency: [],
      mosDistribution: [],
      goalDistribution: [],
      readinessByDimension: [],
    };
  }

  const feasibility = { high: 0, moderate: 0, low: 0 };
  let totalCompleteness = 0;
  let totalHighRisk = 0;
  let totalPathways = 0;

  const constraintMap: Record<string, number> = {};
  const mosMap: Record<string, number> = {};
  const goalMap: Record<string, number> = {};
  const dimensionMap: Record<string, { green: number; yellow: number; red: number }> = {};

  for (const r of results) {
    const f = r.visualData.overallFeasibility.toLowerCase() as "high" | "moderate" | "low";
    if (feasibility[f] !== undefined) feasibility[f]++;

    totalCompleteness += r.visualData.dataCompleteness;
    totalHighRisk += r.visualData.highRiskCount;
    totalPathways += r.visualData.pathwayCount;

    for (const c of r.outputs.constraintRisks) {
      constraintMap[c.label] = (constraintMap[c.label] || 0) + 1;
    }

    mosMap[r.inputs.mosLabel] = (mosMap[r.inputs.mosLabel] || 0) + 1;
    goalMap[r.inputs.goalLabel] = (goalMap[r.inputs.goalLabel] || 0) + 1;

    for (const rm of r.outputs.readinessMeasures) {
      if (!dimensionMap[rm.dimension]) {
        dimensionMap[rm.dimension] = { green: 0, yellow: 0, red: 0 };
      }
      dimensionMap[rm.dimension][rm.status]++;
    }
  }

  return {
    feasibilityDistribution: feasibility,
    averageDataCompleteness: Math.round(totalCompleteness / total),
    totalHighRiskConstraints: totalHighRisk,
    averagePathwayCount: Math.round((totalPathways / total) * 10) / 10,
    constraintFrequency: Object.entries(constraintMap)
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({ label, count, percentage: Math.round(count / total * 100) })),
    mosDistribution: Object.entries(mosMap)
      .sort((a, b) => b[1] - a[1])
      .map(([mos, count]) => ({ mos, count, percentage: Math.round(count / total * 100) })),
    goalDistribution: Object.entries(goalMap)
      .sort((a, b) => b[1] - a[1])
      .map(([goal, count]) => ({ goal, count, percentage: Math.round(count / total * 100) })),
    readinessByDimension: Object.entries(dimensionMap)
      .map(([dimension, counts]) => ({ dimension, ...counts })),
  };
}
