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

export interface ProfileTypeInfo {
  type: string;
  label: string;
  group: "aligned" | "non_aligned" | "constrained";
  alignment: string;
  summary: string;
}

const PROFILE_TEMPLATES: Record<string, () => ProfileTemplate> = {
  signal_to_cyber: () => ({
    profileType: "signal_to_cyber",
    rank: pick(["E-5", "E-6"]),
    mos: "comms",
    mosLabel: "Signal/Comms (25B/25U)",
    yearsOfService: randomInt(5, 8),
    careerGoal: "cybersecurity",
    goalLabel: "Cybersecurity",
    constraints: [],
    credits: randomInt(30, 60),
    hasDegree: false,
    itExperience: true,
    clearanceLevel: "Secret",
    deploymentStatus: "garrison",
    fundingAvailable: "full",
  }),

  intel_to_data: () => ({
    profileType: "intel_to_data",
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

  logistics_to_supply: () => ({
    profileType: "logistics_to_supply",
    rank: pick(["E-5", "E-6"]),
    mos: "logistics",
    mosLabel: "Logistics (88M/92A)",
    yearsOfService: randomInt(6, 10),
    careerGoal: "supply_chain",
    goalLabel: "Supply Chain Management",
    constraints: [],
    credits: randomInt(30, 60),
    hasDegree: false,
    itExperience: false,
    clearanceLevel: "Secret",
    deploymentStatus: "garrison",
    fundingAvailable: "full",
  }),

  officer_to_pm: () => ({
    profileType: "officer_to_pm",
    rank: pick(["O-2", "O-3"]),
    mos: "comms",
    mosLabel: "Signal/Comms (25A/25B)",
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

  medical_to_health_admin: () => ({
    profileType: "medical_to_health_admin",
    rank: pick(["E-5", "E-6"]),
    mos: "medical",
    mosLabel: "Medical (68W/68C)",
    yearsOfService: randomInt(5, 8),
    careerGoal: "healthcare_admin",
    goalLabel: "Healthcare Administration",
    constraints: [],
    credits: randomInt(20, 40),
    hasDegree: false,
    itExperience: false,
    clearanceLevel: "Secret",
    deploymentStatus: "garrison",
    fundingAvailable: "full",
  }),

  logistics_to_cyber: () => ({
    profileType: "logistics_to_cyber",
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

  combat_to_cyber: () => ({
    profileType: "combat_to_cyber",
    rank: pick(["E-4", "E-5"]),
    mos: "combat_arms",
    mosLabel: "Combat Arms (11B/19D)",
    yearsOfService: randomInt(3, 5),
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

  deployed_medic: () => ({
    profileType: "deployed_medic",
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

  combat_to_pm_no_funding: () => ({
    profileType: "combat_to_pm_no_funding",
    rank: pick(["E-4", "E-5"]),
    mos: "combat_arms",
    mosLabel: "Combat Arms (11B/19D)",
    yearsOfService: randomInt(3, 4),
    careerGoal: "project_management",
    goalLabel: "Project Management",
    constraints: ["short_timeline", "no_ta_funding"],
    credits: randomInt(0, 12),
    hasDegree: false,
    itExperience: false,
    clearanceLevel: "Secret",
    deploymentStatus: "garrison",
    fundingAvailable: "none",
  }),
};

const PROFILE_TYPE_INFO: ProfileTypeInfo[] = [
  {
    type: "signal_to_cyber",
    label: "Signal → Cybersecurity",
    group: "aligned",
    alignment: "90%",
    summary: "Strongest MOS-to-cyber pipeline. Lateral move with existing network ops foundation.",
  },
  {
    type: "intel_to_data",
    label: "Intel → Data Analytics",
    group: "aligned",
    alignment: "85%",
    summary: "Intel analysis maps directly to data science methodology. TS/SCI clearance asset.",
  },
  {
    type: "logistics_to_supply",
    label: "Logistics → Supply Chain",
    group: "aligned",
    alignment: "94%",
    summary: "Near-direct domain match. One of the highest alignment transitions available.",
  },
  {
    type: "officer_to_pm",
    label: "Signal Officer → Project Management",
    group: "aligned",
    alignment: "84%",
    summary: "Technical program management experience transfers directly to PMP certification.",
  },
  {
    type: "medical_to_health_admin",
    label: "Medic → Healthcare Admin",
    group: "aligned",
    alignment: "86%",
    summary: "Clinical experience provides strong healthcare systems foundation for MHA/FACHE track.",
  },
  {
    type: "logistics_to_cyber",
    label: "Logistics → Cybersecurity",
    group: "non_aligned",
    alignment: "68%",
    summary: "Cross-domain transition. No IT foundation — requires full credential build (A+ → Net+ → Sec+).",
  },
  {
    type: "combat_to_cyber",
    label: "Combat Arms → Cybersecurity",
    group: "non_aligned",
    alignment: "45%",
    summary: "Hardest transition in CMGF. Zero technical foundation + no funding + short timeline.",
  },
  {
    type: "deployed_medic",
    label: "Deployed Medic → Healthcare Admin",
    group: "constrained",
    alignment: "86%",
    summary: "Good alignment but deployment + limited internet create access barriers.",
  },
  {
    type: "combat_to_pm_no_funding",
    label: "Combat Arms → PM (No Funding)",
    group: "constrained",
    alignment: "78%",
    summary: "Moderate alignment but no TA funding and short timeline compound the transition.",
  },
];

export const PROFILE_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  PROFILE_TYPE_INFO.map(p => [p.type, p.label])
);

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

export function getAvailableProfileTypes(): ProfileTypeInfo[] {
  return PROFILE_TYPE_INFO;
}

export function generateRandomProfile(): InsertSyntheticProfile {
  const types = Object.keys(PROFILE_TEMPLATES);
  return generateProfile(pick(types));
}
