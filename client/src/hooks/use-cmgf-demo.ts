import { useState, useEffect } from "react";

export interface ServiceMember {
  id: string;
  name: string;
  rank: string;
  branch: string;
  mos: string;
  separationDate: string;
  status: "active" | "in-review" | "completed";
  credentialMatches: number;
  careerPaths: string[];
}

export interface ReviewItem {
  id: string;
  type: "credential" | "pathway" | "exception";
  serviceMemberId: string;
  summary: string;
  priority: "high" | "medium" | "low";
  aiConfidence: number;
  assignedTo: string;
  createdAt: string;
  status: "pending" | "in-progress" | "approved" | "escalated";
}

export interface SystemMetrics {
  activeUsers: number;
  reviewQueueDepth: number;
  avgReviewTime: string;
  humanOverrideRate: number;
  credentialMatchRate: number;
  policyExceptions: number;
  systemHealth: "operational" | "degraded" | "maintenance";
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  actorType: "human" | "system";
  details: string;
  outcome: string;
}

const mockServiceMembers: ServiceMember[] = [
  {
    id: "SM-001",
    name: "SSG Martinez, Carlos",
    rank: "E-6",
    branch: "Army",
    mos: "25B - IT Specialist",
    separationDate: "2026-03-15",
    status: "active",
    credentialMatches: 12,
    careerPaths: ["Cloud Engineer", "Cybersecurity Analyst", "Network Administrator"]
  },
  {
    id: "SM-002",
    name: "PO2 Johnson, Sarah",
    rank: "E-5",
    branch: "Navy",
    mos: "HM - Hospital Corpsman",
    separationDate: "2026-04-22",
    status: "in-review",
    credentialMatches: 8,
    careerPaths: ["Registered Nurse", "EMT Supervisor", "Healthcare Administrator"]
  },
  {
    id: "SM-003",
    name: "TSgt Williams, David",
    rank: "E-6",
    branch: "Air Force",
    mos: "2A5X1 - Aerospace Maintenance",
    separationDate: "2026-02-28",
    status: "completed",
    credentialMatches: 15,
    careerPaths: ["Aircraft Mechanic", "Quality Inspector", "Maintenance Supervisor"]
  }
];

const mockReviewQueue: ReviewItem[] = [
  {
    id: "RQ-001",
    type: "credential",
    serviceMemberId: "SM-001",
    summary: "Security+ certification equivalency requires human verification",
    priority: "high",
    aiConfidence: 0.72,
    assignedTo: "Advisor Chen",
    createdAt: "2026-01-10T09:30:00Z",
    status: "pending"
  },
  {
    id: "RQ-002",
    type: "pathway",
    serviceMemberId: "SM-002",
    summary: "Non-standard credit transfer pathway identified - policy exception needed",
    priority: "medium",
    aiConfidence: 0.45,
    assignedTo: "Advisor Thompson",
    createdAt: "2026-01-10T08:15:00Z",
    status: "in-progress"
  },
  {
    id: "RQ-003",
    type: "exception",
    serviceMemberId: "SM-003",
    summary: "FAA certification bridge program outside standard mapping",
    priority: "low",
    aiConfidence: 0.88,
    assignedTo: "Advisor Chen",
    createdAt: "2026-01-09T14:45:00Z",
    status: "approved"
  }
];

const mockAuditLog: AuditLogEntry[] = [
  {
    id: "AL-001",
    timestamp: "2026-01-10T10:15:32Z",
    action: "CREDENTIAL_MATCH_GENERATED",
    actor: "CMGF-AI",
    actorType: "system",
    details: "Generated 12 credential matches for SM-001",
    outcome: "Queued for human review"
  },
  {
    id: "AL-002",
    timestamp: "2026-01-10T10:12:45Z",
    action: "PATHWAY_APPROVED",
    actor: "Advisor Chen",
    actorType: "human",
    details: "Approved cloud engineering pathway for SM-001",
    outcome: "Notified service member"
  },
  {
    id: "AL-003",
    timestamp: "2026-01-10T09:58:11Z",
    action: "HUMAN_OVERRIDE",
    actor: "Advisor Thompson",
    actorType: "human",
    details: "Overrode AI recommendation - additional context required",
    outcome: "Escalated to senior advisor"
  },
  {
    id: "AL-004",
    timestamp: "2026-01-10T09:45:00Z",
    action: "POLICY_CHECK",
    actor: "CMGF-AI",
    actorType: "system",
    details: "Verified compliance with DoD 1322.25 transition requirements",
    outcome: "Compliant"
  }
];

export function useCMGFDemo() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    activeUsers: 1847,
    reviewQueueDepth: 23,
    avgReviewTime: "4.2 min",
    humanOverrideRate: 18.3,
    credentialMatchRate: 94.7,
    policyExceptions: 7,
    systemHealth: "operational"
  });

  const [serviceMembers] = useState<ServiceMember[]>(mockServiceMembers);
  const [reviewQueue] = useState<ReviewItem[]>(mockReviewQueue);
  const [auditLog] = useState<AuditLogEntry[]>(mockAuditLog);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
        reviewQueueDepth: Math.max(15, prev.reviewQueueDepth + Math.floor(Math.random() * 3) - 1),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    serviceMembers,
    reviewQueue,
    auditLog,
    fundingGap: {
      educationBenefits: 13.5,
      transitionAdvising: 0.14,
      ratio: 96.4
    }
  };
}
