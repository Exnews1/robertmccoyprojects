import { Link } from "wouter";
import { CMGFNav } from "@/components/cmgf-nav";
import {
  Compass,
  PlayCircle,
  Rocket,
  Shield,
  Cpu,
  ArrowRight,
  Lock,
  Scale,
  Eye,
} from "lucide-react";

const tools = [
  {
    href: "/research/career-advisor",
    title: "Career Path Feasibility Advisor",
    description:
      "Deterministic constraint-binding engine evaluating military-to-civilian transitions against policy, credentialing, and education authority rules. 36 pathway combinations with tier tagging and governance transparency.",
    icon: Compass,
    tag: "Interactive Tool",
  },
  {
    href: "/research/signal-flow",
    title: "Signal Flow Animation",
    description:
      "75-second cinematic visualization of the CMGF signal architecture — from a single service member advisory session to 2M+ profiles feeding the Pentagon. Four acts, conference-optimized.",
    icon: PlayCircle,
    tag: "Presentation",
  },
  {
    href: "/research/demo",
    title: "Scenario Orchestration Engine",
    description:
      "One-click scenario generation applying CMGF governance rules to synthetic military learner profiles. Produces deterministic analysis with asynchronous HTML report generation.",
    icon: Rocket,
    tag: "Simulation",
  },
];

const principles = [
  {
    icon: Lock,
    title: "Non-Negotiable Constraints",
    text: "No predictive modeling. No individual risk scoring. No automated approvals. The AI operates within hard boundaries that cannot be overridden.",
  },
  {
    icon: Scale,
    title: "Human Authority Preserved",
    text: "AI generates structured decision support — the ESO retains full approval authority. Every recommendation is traceable to policy and data sources.",
  },
  {
    icon: Eye,
    title: "Transparency Over Optimization",
    text: "Every engine output includes governance metadata: version, execution type, rules evaluated, and data sources consulted. No black boxes.",
  },
  {
    icon: Shield,
    title: "Policy-as-Code",
    text: "Federal regulations (EO 14179, NIST AI RMF 1.0, OMB M-25-21) are encoded as executable constraints, not guidelines. Compliance is structural.",
  },
];

export default function AIArchitecture() {
  return (
    <div style={{ backgroundColor: "#0a1628" }} className="min-h-screen">
      <CMGFNav />
      <div className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
        <div className="flex items-center gap-0 mt-6 mb-6 border-b" style={{ borderColor: "#1e2d45" }} data-testid="cmgf-section-tabs">
          <Link href="/research/cmgf">
            <button
              className="px-4 py-2.5 text-sm font-medium border-b-2 border-transparent transition-colors"
              style={{ color: "#7a8fa8" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#d4dbe8"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#7a8fa8"; }}
              data-testid="tab-cmgf"
            >
              CMGF Framework
            </button>
          </Link>
          <Link href="/research/ai">
            <button
              className="px-4 py-2.5 text-sm font-medium border-b-2"
              style={{ color: "#d4dbe8", borderColor: "#c9a84c" }}
              data-testid="tab-ai"
            >
              AI Architecture
            </button>
          </Link>
          <Link href="/research/eso">
            <button
              className="px-4 py-2.5 text-sm font-medium border-b-2 border-transparent transition-colors"
              style={{ color: "#7a8fa8" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#d4dbe8"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#7a8fa8"; }}
              data-testid="tab-eso"
            >
              ESO Pipeline
            </button>
          </Link>
          <Link href="/research/career-advisor">
            <button
              className="px-4 py-2.5 text-sm font-medium border-b-2 border-transparent transition-colors"
              style={{ color: "#7a8fa8" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#d4dbe8"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#7a8fa8"; }}
              data-testid="tab-career-advisor"
            >
              Career Advisor
            </button>
          </Link>
        </div>

        <header className="pb-10 border-b" style={{ borderColor: "#1e2d45" }}>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded flex items-center justify-center"
              style={{ backgroundColor: "#c9a84c20", border: "1px solid #c9a84c40" }}
            >
              <Cpu className="w-5 h-5" style={{ color: "#c9a84c" }} />
            </div>
            <span
              className="text-xs font-mono tracking-widest uppercase"
              style={{ color: "#7a8fa8" }}
            >
              CMGF Architecture
            </span>
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold font-serif mb-4"
            style={{ color: "#d4dbe8" }}
          >
            AI Architecture
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-3xl" style={{ color: "#8899b0" }}>
            The CMGF treats AI as governed infrastructure — not an autonomous agent. Every
            component operates within bounded constraints derived from federal policy, producing
            transparent, traceable, and human-reviewable outputs. These tools demonstrate the
            architecture in action.
          </p>
        </header>

        <section className="mt-10">
          <h2
            className="text-lg font-semibold font-serif mb-6"
            style={{ color: "#c9a84c" }}
            data-testid="heading-tools"
          >
            Interactive Demonstrations
          </h2>
          <div className="grid gap-4">
            {tools.map((tool) => (
              <Link key={tool.href} href={tool.href}>
                <div
                  className="group p-5 rounded transition-colors cursor-pointer"
                  style={{
                    backgroundColor: "#0f1f35",
                    border: "1px solid #1e2d45",
                  }}
                  data-testid={`card-${tool.href.split("/").pop()}`}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#c9a84c40";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#1e2d45";
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded flex-shrink-0 flex items-center justify-center mt-0.5"
                      style={{ backgroundColor: "#c9a84c15" }}
                    >
                      <tool.icon className="w-5 h-5" style={{ color: "#c9a84c" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <h3
                          className="text-base font-semibold"
                          style={{ color: "#d4dbe8" }}
                        >
                          {tool.title}
                        </h3>
                        <span
                          className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded"
                          style={{
                            color: "#c9a84c",
                            backgroundColor: "#c9a84c15",
                            border: "1px solid #c9a84c30",
                          }}
                        >
                          {tool.tag}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "#7a8fa8" }}>
                        {tool.description}
                      </p>
                    </div>
                    <ArrowRight
                      className="w-4 h-4 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: "#c9a84c" }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2
            className="text-lg font-semibold font-serif mb-6"
            style={{ color: "#c9a84c" }}
            data-testid="heading-principles"
          >
            Governing Principles
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {principles.map((p) => (
              <div
                key={p.title}
                className="p-5 rounded"
                style={{
                  backgroundColor: "#0f1f35",
                  border: "1px solid #1e2d45",
                }}
                data-testid={`principle-${p.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <p.icon className="w-4 h-4" style={{ color: "#c9a84c" }} />
                  <h3 className="text-sm font-semibold" style={{ color: "#d4dbe8" }}>
                    {p.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#7a8fa8" }}>
                  {p.text}
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
            data-testid="compliance-note"
          >
            <p className="text-sm leading-relaxed" style={{ color: "#8899b0" }}>
              <span style={{ color: "#c9a84c" }} className="font-semibold">
                Compliance alignment:
              </span>{" "}
              All AI components in the CMGF are designed against Executive Order 14179 (2025),
              NIST AI Risk Management Framework 1.0, and OMB M-25-21. The architecture enforces
              these standards structurally — compliance is not a checklist but the system's
              operating logic.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
