import type { InsertSyntheticProfile } from "@shared/schema";

const FIRST_NAMES = ["James", "Maria", "DeShawn", "Sarah", "Carlos", "Ashley", "Marcus", "Jennifer", "David", "Tameka", "Ryan", "Priya", "Tyler", "Michelle", "Andre"];
const LAST_NAMES = ["Johnson", "Williams", "Rodriguez", "Chen", "Thompson", "Davis", "Martinez", "Anderson", "Kim", "Washington", "Garcia", "Clark", "Lee", "Taylor", "Brown"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateName(): string {
  return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
}

interface ProfileTemplate {
  profileType: string;
  rank: string;
  mos: string;
  mosLabel: string;
  yearsOfService: number;
  careerGoal: string;
  goalLabel: string;
  constraints: string[];
  credits: number;
  hasDegree: boolean;
  itExperience: boolean;
  clearanceLevel: string;
  deploymentStatus: string;
  fundingAvailable: string;
}

const PROFILE_TEMPLATES: Record<string, () => ProfileTemplate> = {
  early_career_enlisted: () => ({
    profileType: "early_career_enlisted",
    rank: pick(["E-4", "E-5"]),
    mos: "logistics",
    mosLabel: "Logistics (88M/92A)",
    yearsOfService: randomInt(3, 5),
    careerGoal: "cybersecurity",
    goalLabel: "Cybersecurity",
    constraints: ["short_timeline"],
    credits: randomInt(0, 15),
    hasDegree: false,
    itExperience: false,
    clearanceLevel: "Secret",
    deploymentStatus: "garrison",
    fundingAvailable: "full",
  }),

  mid_career_with_credits: () => ({
    profileType: "mid_career_with_credits",
    rank: pick(["E-6", "E-7"]),
    mos: "intel",
    mosLabel: "Intelligence (35F/35M)",
    yearsOfService: randomInt(8, 12),
    careerGoal: "data_analytics",
    goalLabel: "Data Analytics",
    constraints: [],
    credits: randomInt(45, 75),
    hasDegree: false,
    itExperience: true,
    clearanceLevel: "TS/SCI",
    deploymentStatus: "garrison",
    fundingAvailable: "full",
  }),

  officer_transition: () => ({
    profileType: "officer_transition",
    rank: pick(["O-2", "O-3"]),
    mos: "comms",
    mosLabel: "Signal/Comms (25B/25U)",
    yearsOfService: randomInt(6, 10),
    careerGoal: "project_management",
    goalLabel: "Project Management",
    constraints: [],
    credits: randomInt(90, 130),
    hasDegree: true,
    itExperience: true,
    clearanceLevel: "Secret",
    deploymentStatus: "garrison",
    fundingAvailable: "full",
  }),

  deployed_service_member: () => ({
    profileType: "deployed_service_member",
    rank: pick(["E-5", "E-6"]),
    mos: "medical",
    mosLabel: "Medical (68W/68C)",
    yearsOfService: randomInt(5, 8),
    careerGoal: "healthcare_admin",
    goalLabel: "Healthcare Administration",
    constraints: ["deployed", "limited_internet"],
    credits: randomInt(20, 40),
    hasDegree: false,
    itExperience: false,
    clearanceLevel: "Secret",
    deploymentStatus: "deployed",
    fundingAvailable: "limited",
  }),

  high_constraint_limited: () => ({
    profileType: "high_constraint_limited",
    rank: pick(["E-4", "E-5"]),
    mos: "combat_arms",
    mosLabel: "Combat Arms (11B/19D)",
    yearsOfService: randomInt(3, 4),
    careerGoal: "cybersecurity",
    goalLabel: "Cybersecurity",
    constraints: ["short_timeline", "no_ta_funding", "no_degree"],
    credits: randomInt(0, 6),
    hasDegree: false,
    itExperience: false,
    clearanceLevel: "Secret",
    deploymentStatus: "garrison",
    fundingAvailable: "none",
  }),
};

export const PROFILE_TYPE_LABELS: Record<string, string> = {
  early_career_enlisted: "Early Career Enlisted",
  mid_career_with_credits: "Mid-Career Enlisted with Credits",
  officer_transition: "Officer Transition",
  deployed_service_member: "Deployed Service Member",
  high_constraint_limited: "High Constraint / Funding Limited",
};

export function generateProfile(profileType: string, overrides?: Partial<InsertSyntheticProfile>): InsertSyntheticProfile {
  const templateFn = PROFILE_TEMPLATES[profileType];
  if (!templateFn) {
    throw new Error(`Unknown profile type: ${profileType}. Available: ${Object.keys(PROFILE_TEMPLATES).join(", ")}`);
  }

  const template = templateFn();
  return {
    ...template,
    name: generateName(),
    ...overrides,
  };
}

export function getAvailableProfileTypes(): Array<{ type: string; label: string }> {
  return Object.entries(PROFILE_TYPE_LABELS).map(([type, label]) => ({ type, label }));
}

export function generateRandomProfile(): InsertSyntheticProfile {
  const types = Object.keys(PROFILE_TEMPLATES);
  return generateProfile(pick(types));
}
