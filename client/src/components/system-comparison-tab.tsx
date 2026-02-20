import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, AlertTriangle, CheckCircle, XCircle, Clock,
  Shuffle, Layers, Shield, Eye, Users, FileText, Cpu,
  Zap, Target, Lock, TrendingUp, HelpCircle
} from "lucide-react";

interface ComparisonRow {
  dimension: string;
  icon: typeof AlertTriangle;
  before: { label: string; detail: string; severity: "bad" | "warning" | "neutral" };
  after: { label: string; detail: string; severity: "good" | "better" | "neutral" };
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    dimension: "Decision Clarity",
    icon: Eye,
    before: {
      label: "Fragmented, ad hoc",
      detail: "Service members navigate 12+ disconnected systems with conflicting information. Career decisions rely on word-of-mouth and outdated pamphlets.",
      severity: "bad",
    },
    after: {
      label: "Structured, bounded",
      detail: "Three-layer architecture provides organized pathway options with constraint-aware guidance. All outputs traceable to source authority.",
      severity: "good",
    },
  },
  {
    dimension: "Timing & Sequencing",
    icon: Clock,
    before: {
      label: "Reactive, often too late",
      detail: "Many service members begin transition planning 90 days before ETS. Credential timelines frequently conflict with separation dates.",
      severity: "bad",
    },
    after: {
      label: "Proactive constraint detection",
      detail: "System identifies timeline conflicts at point of entry. Constraint binding surfaces funding, credential, and separation conflicts before commitments are made.",
      severity: "good",
    },
  },
  {
    dimension: "Resource Alignment",
    icon: Target,
    before: {
      label: "Manual discovery",
      detail: "Service members must independently research TA, CA, GI Bill, SkillBridge, VET TEC, and employer programs. Eligibility rules are opaque.",
      severity: "bad",
    },
    after: {
      label: "Automated resource mapping",
      detail: "Part B mediation layer maps available resources to pathway requirements. Eligibility status surfaced with each recommendation.",
      severity: "good",
    },
  },
  {
    dimension: "Risk Identification",
    icon: AlertTriangle,
    before: {
      label: "Invisible until failure",
      detail: "Credential gaps, funding conflicts, and timeline compression discovered only after enrollment or missed deadlines. No early warning system.",
      severity: "bad",
    },
    after: {
      label: "Pre-decisional risk surfacing",
      detail: "Deterministic constraint engine identifies all binding risks before action. Policy friction points documented with regulatory citation.",
      severity: "good",
    },
  },
  {
    dimension: "Credential Translation",
    icon: FileText,
    before: {
      label: "Manual, inconsistent",
      detail: "MOS-to-civilian skill translation depends on individual counselor knowledge. Varies dramatically by installation and availability.",
      severity: "warning",
    },
    after: {
      label: "Systematic, rule-based",
      detail: "Part B translates military competencies to civilian credential domains using standardized taxonomy. Consistent output regardless of location.",
      severity: "good",
    },
  },
  {
    dimension: "Human Oversight",
    icon: Users,
    before: {
      label: "Variable counselor access",
      detail: "TAP counselor ratios often exceed 1:400. Quality of guidance depends heavily on individual counselor expertise and availability.",
      severity: "warning",
    },
    after: {
      label: "Architecturally guaranteed",
      detail: "Part C requires human advisory review of all AI-mediated outputs. No recommendations proceed without human attestation.",
      severity: "good",
    },
  },
  {
    dimension: "Audit Trail",
    icon: Shield,
    before: {
      label: "No provenance tracking",
      detail: "Career decisions are undocumented. No way to trace what information a service member received, from whom, or when.",
      severity: "bad",
    },
    after: {
      label: "Full signal provenance",
      detail: "Every output tagged with source authority, constraint basis, and regulatory citation. Complete audit trail from input to recommendation.",
      severity: "good",
    },
  },
  {
    dimension: "AI Safety",
    icon: Lock,
    before: {
      label: "N/A — no AI in use",
      detail: "Current systems don't use AI, but also can't scale. As AI adoption grows, no governance architecture exists to constrain it.",
      severity: "neutral",
    },
    after: {
      label: "Bounded by design",
      detail: "Architectural prohibitions hardcoded: no predictive modeling, no individual scoring, no automated approvals. AI serves as infrastructure, not authority.",
      severity: "better",
    },
  },
];

const severityStyles = {
  bad: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400", icon: XCircle },
  warning: { bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400", icon: AlertTriangle },
  neutral: { bg: "bg-muted/50", border: "border-border/50", text: "text-muted-foreground", icon: HelpCircle },
  good: { bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-400", icon: CheckCircle },
  better: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", icon: TrendingUp },
};

export function SystemComparisonTab() {
  const beforeIssues = COMPARISON_DATA.filter(r => r.before.severity === "bad").length;
  const afterResolved = COMPARISON_DATA.filter(r => r.after.severity === "good" || r.after.severity === "better").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">System Comparison: Before vs After CMGF</h2>
        <p className="text-sm text-muted-foreground">
          Side-by-side analysis of the current fragmented career transition process versus the CMGF-mediated architecture.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="comparison-metrics">
        <Card data-testid="metric-disconnected-systems">
          <CardContent className="p-4 text-center">
            <Shuffle className="w-5 h-5 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground" data-testid="text-disconnected-count">12+</p>
            <p className="text-xs text-muted-foreground">Disconnected Systems (Before)</p>
          </CardContent>
        </Card>
        <Card data-testid="metric-unified-layers">
          <CardContent className="p-4 text-center">
            <Layers className="w-5 h-5 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground" data-testid="text-unified-count">3</p>
            <p className="text-xs text-muted-foreground">Unified Layers (After)</p>
          </CardContent>
        </Card>
        <Card data-testid="metric-critical-gaps">
          <CardContent className="p-4 text-center">
            <XCircle className="w-5 h-5 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground" data-testid="text-gaps-count">{beforeIssues}</p>
            <p className="text-xs text-muted-foreground">Critical Gaps (Before)</p>
          </CardContent>
        </Card>
        <Card data-testid="metric-resolved">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground" data-testid="text-resolved-count">{afterResolved}</p>
            <p className="text-xs text-muted-foreground">Resolved by CMGF (After)</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-0 items-center px-4">
          <div className="text-center">
            <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
              Current Fragmented Process
            </Badge>
          </div>
          <div className="w-8" />
          <div className="text-center">
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
              CMGF-Mediated Process
            </Badge>
          </div>
        </div>

        {COMPARISON_DATA.map((row, i) => {
          const beforeStyle = severityStyles[row.before.severity];
          const afterStyle = severityStyles[row.after.severity];
          const BeforeIcon = beforeStyle.icon;
          const AfterIcon = afterStyle.icon;

          return (
            <div key={i} data-testid={`comparison-row-${i}`}>
              <div className="flex items-center gap-2 mb-2 px-1">
                <row.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">{row.dimension}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-stretch">
                <div className={`p-4 rounded-md border ${beforeStyle.border} ${beforeStyle.bg}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <BeforeIcon className={`w-4 h-4 ${beforeStyle.text}`} />
                    <span className={`text-sm font-medium ${beforeStyle.text}`}>{row.before.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{row.before.detail}</p>
                </div>

                <div className="hidden md:flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                </div>

                <div className={`p-4 rounded-md border ${afterStyle.border} ${afterStyle.bg}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <AfterIcon className={`w-4 h-4 ${afterStyle.text}`} />
                    <span className={`text-sm font-medium ${afterStyle.text}`}>{row.after.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{row.after.detail}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Architecture Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                layer: "Part A: Service Member Interface",
                desc: "Captures career goals, credential inventory, and constraints. Service member retains full agency.",
                icon: Users,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
              },
              {
                layer: "Part B: AI Mediation Framework",
                desc: "Translates military competencies, maps resources, detects constraints. Bounded by non-use guardrails.",
                icon: Cpu,
                color: "text-purple-500",
                bg: "bg-purple-500/10",
              },
              {
                layer: "Part C: Advisory & Human Review",
                desc: "Human advisor validates all outputs. No recommendation proceeds without attestation.",
                icon: Shield,
                color: "text-green-500",
                bg: "bg-green-500/10",
              },
            ].map((l, i) => (
              <div key={i} className="p-4 rounded-md border border-border/50" data-testid={`architecture-layer-${i}`}>
                <div className={`p-2 rounded-md ${l.bg} w-fit mb-3`}>
                  <l.icon className={`w-5 h-5 ${l.color}`} />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">{l.layer}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{l.desc}</p>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-md bg-muted/50 mt-4">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Key insight:</span> The CMGF does not replace human judgment — it provides the structured information infrastructure that makes human judgment effective. The system's value comes from what it deliberately does not do: no prediction, no scoring, no autonomous decisions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
