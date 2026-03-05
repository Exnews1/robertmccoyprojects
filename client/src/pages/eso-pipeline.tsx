import { Link } from "wouter";
import { CMGFNav } from "@/components/cmgf-nav";
import {
  UserCircle,
  ClipboardList,
  Shield,
  Rocket,
  ArrowRight,
  Users,
  FileCheck,
  ArrowDown,
} from "lucide-react";

const pipelineSteps = [
  {
    step: 1,
    href: "/research/sm-hub",
    title: "Service Member Request",
    description:
      "A service member submits a career transition request specifying their MOS, target career, education level, timeline, and funding source. This initiates the governed pipeline.",
    icon: UserCircle,
    role: "Service Member",
  },
  {
    step: 2,
    href: "/research/demo",
    title: "CMGF Engine Analysis",
    description:
      "The Scenario Orchestration Engine applies governance rules to the request — evaluating credential requirements, education authority alignment, policy constraints, and pathway feasibility. Deterministic output is returned immediately.",
    icon: Rocket,
    role: "AI Engine",
  },
  {
    step: 3,
    href: "/research/isr",
    title: "ISR Advisor Queue",
    description:
      "Engine results flow to the Institutional Summary Report queue, where an Education Services Officer reviews the analysis, exercises human judgment, and takes action — approve, defer, escalate, or return for revision.",
    icon: ClipboardList,
    role: "ESO / Advisor",
  },
  {
    step: 4,
    href: "/research/audit",
    title: "Audit Trail",
    description:
      "Every action — from initial submission through engine analysis to advisor decision — is recorded in an immutable, timestamped audit log. Full provenance for every service member interaction.",
    icon: Shield,
    role: "System",
  },
];

const dualFlows = [
  {
    icon: UserCircle,
    title: "Individual Advisory Flow",
    description:
      "SM → AI Engine → ESO → Decision. Each service member receives personalized, policy-grounded analysis reviewed by a human advisor. The AI never makes the final call.",
    color: "#c9a84c",
  },
  {
    icon: Users,
    title: "Institutional Intelligence Flow",
    description:
      "Anonymized, aggregated data from thousands of advisory interactions feeds upward through ISR normalization to inform installation-level and national-level policy decisions.",
    color: "#60a5fa",
  },
];

export default function ESOPipeline() {
  return (
    <div style={{ backgroundColor: "#0a1628" }} className="min-h-screen">
      <CMGFNav />
      <div className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
        <header className="pt-8 pb-10 border-b" style={{ borderColor: "#1e2d45" }}>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded flex items-center justify-center"
              style={{ backgroundColor: "#c9a84c20", border: "1px solid #c9a84c40" }}
            >
              <FileCheck className="w-5 h-5" style={{ color: "#c9a84c" }} />
            </div>
            <span
              className="text-xs font-mono tracking-widest uppercase"
              style={{ color: "#7a8fa8" }}
            >
              CMGF Pipeline
            </span>
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold font-serif mb-4"
            style={{ color: "#d4dbe8" }}
          >
            ESO & ISR Pipeline
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-3xl" style={{ color: "#8899b0" }}>
            The end-to-end career transition pipeline demonstrates the CMGF's dual data flow —
            individual advisory support for each service member, and anonymized institutional
            intelligence flowing upward for policy insight. Every step is governed, traceable,
            and human-reviewed.
          </p>
        </header>

        <section className="mt-10">
          <h2
            className="text-lg font-semibold font-serif mb-6"
            style={{ color: "#c9a84c" }}
            data-testid="heading-pipeline"
          >
            Pipeline Stages
          </h2>
          <div className="space-y-3">
            {pipelineSteps.map((step, idx) => (
              <div key={step.href}>
                <Link href={step.href}>
                  <div
                    className="group p-5 rounded transition-colors cursor-pointer"
                    style={{
                      backgroundColor: "#0f1f35",
                      border: "1px solid #1e2d45",
                    }}
                    data-testid={`pipeline-step-${step.step}`}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "#c9a84c40";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "#1e2d45";
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div
                          className="w-10 h-10 rounded flex items-center justify-center"
                          style={{ backgroundColor: "#c9a84c15" }}
                        >
                          <step.icon className="w-5 h-5" style={{ color: "#c9a84c" }} />
                        </div>
                        <span
                          className="text-[10px] font-mono"
                          style={{ color: "#7a8fa8" }}
                        >
                          {step.step}/4
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5">
                          <h3
                            className="text-base font-semibold"
                            style={{ color: "#d4dbe8" }}
                          >
                            {step.title}
                          </h3>
                          <span
                            className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded"
                            style={{
                              color: "#c9a84c",
                              backgroundColor: "#c9a84c15",
                              border: "1px solid #c9a84c30",
                            }}
                          >
                            {step.role}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: "#7a8fa8" }}>
                          {step.description}
                        </p>
                      </div>
                      <ArrowRight
                        className="w-4 h-4 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: "#c9a84c" }}
                      />
                    </div>
                  </div>
                </Link>
                {idx < pipelineSteps.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="w-4 h-4" style={{ color: "#334155" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2
            className="text-lg font-semibold font-serif mb-6"
            style={{ color: "#c9a84c" }}
            data-testid="heading-dual-flow"
          >
            Dual Data Flow
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {dualFlows.map((flow) => (
              <div
                key={flow.title}
                className="p-5 rounded"
                style={{
                  backgroundColor: "#0f1f35",
                  border: "1px solid #1e2d45",
                  borderTop: `3px solid ${flow.color}`,
                }}
                data-testid={`flow-${flow.title.toLowerCase().includes("individual") ? "individual" : "institutional"}`}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <flow.icon className="w-4 h-4" style={{ color: flow.color }} />
                  <h3 className="text-sm font-semibold" style={{ color: "#d4dbe8" }}>
                    {flow.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#7a8fa8" }}>
                  {flow.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div
            className="p-5 rounded"
            style={{
              backgroundColor: "#0f1f35",
              border: "1px solid #1e2d45",
              borderLeft: "3px solid #c9a84c",
            }}
            data-testid="governance-note"
          >
            <p className="text-sm leading-relaxed" style={{ color: "#8899b0" }}>
              <span style={{ color: "#c9a84c" }} className="font-semibold">
                Governance guarantee:
              </span>{" "}
              The ESO retains full decision authority at every stage. The AI engine provides
              structured analysis and constraint evaluation — it never approves, denies, or
              modifies a service member's request. Every interaction is logged with full
              provenance in the immutable audit trail.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
