import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, ChevronRight, ClipboardCheck, GraduationCap, Stamp, 
  ArrowRightLeft, FileText, ScrollText, Building2, BarChart3,
  TrendingDown, Scale, AlertTriangle, MessageSquare, Shield
} from "lucide-react";
import { CMGFNav } from "@/components/cmgf-nav";

const partBPages = [
  {
    id: "advisor-review",
    title: "Advisor Review Workspace",
    description: "Advisors receive AI-generated signals and apply human judgment. All interpretations are annotated with rationale for transparency and audit.",
    icon: ClipboardCheck,
    responsibilities: [
      "Receive AI signals",
      "Apply human judgment",
      "Annotate rationale"
    ]
  },
  {
    id: "educator-validation",
    title: "Educator Validation Panel",
    description: "Educators confirm academic alignment and flag institutional constraints. Ensures educational pathways are viable and appropriately matched.",
    icon: GraduationCap,
    responsibilities: [
      "Confirm academic alignment",
      "Flag institutional constraints",
      "Validate credential mapping"
    ]
  },
  {
    id: "admin-decision",
    title: "Administrator Decision Console",
    description: "Administrators execute formal decisions with required justification. Every approval triggers a complete audit trail.",
    icon: Stamp,
    responsibilities: [
      "Execute formal decisions",
      "Provide required justification",
      "Trigger audit trail"
    ]
  },
  {
    id: "handoff-prep",
    title: "Human Handoff Preparation",
    description: "Ensures all AI outputs are explainable before human review. Surfaces uncertainty and prevents automation bias in decision-making.",
    icon: ArrowRightLeft,
    responsibilities: [
      "Ensure explainability",
      "Surface uncertainty",
      "Prevent automation bias"
    ]
  },
  {
    id: "outcome-summary",
    title: "Decision Outcome Summary",
    description: "Documents all human decisions with clear attribution. Links outcomes to the signals and context that informed them.",
    icon: FileText,
    responsibilities: [
      "Document decisions",
      "Attribute to humans",
      "Link to context"
    ]
  },
  {
    id: "audit-trail",
    title: "Audit Trail & Rationale Log",
    description: "Maintains complete record of all decisions, rationales, and supporting evidence. Enables institutional accountability and process improvement.",
    icon: ScrollText,
    responsibilities: [
      "Log all decisions",
      "Record rationales",
      "Enable accountability"
    ]
  }
];

const partB1Pages = [
  {
    id: "executive-overview",
    title: "Executive Overview",
    description: "High-level system health metrics and strategic indicators. Population-level insights for leadership decision-making.",
    icon: Building2,
    metrics: ["System health", "Strategic indicators", "Population trends"]
  },
  {
    id: "bottleneck-analysis",
    title: "System Bottleneck Analysis",
    description: "Identifies friction points in transition pathways. Surfaces systemic delays and capacity constraints.",
    icon: BarChart3,
    metrics: ["Processing delays", "Capacity constraints", "Queue depths"]
  },
  {
    id: "funding-pressure",
    title: "Funding & Resource Pressure",
    description: "Aggregated view of resource utilization and funding gaps. Supports budget justification and resource allocation.",
    icon: TrendingDown,
    metrics: ["Utilization rates", "Funding gaps", "Resource allocation"]
  },
  {
    id: "review-capacity",
    title: "Human Review Load & Capacity",
    description: "Monitors advisor workload and capacity across the system. Enables proactive staffing and workload balancing.",
    icon: Users,
    metrics: ["Advisor workload", "Queue times", "Capacity ratios"]
  },
  {
    id: "policy-friction",
    title: "Policy Friction & Exceptions",
    description: "Tracks policy exception frequency and patterns. Identifies candidates for policy revision or clarification.",
    icon: Scale,
    metrics: ["Exception rates", "Policy patterns", "Revision candidates"]
  },
  {
    id: "retention-signals",
    title: "Retention & Attrition Signals",
    description: "Aggregated indicators of transition program effectiveness. No individual predictions—population-level patterns only.",
    icon: AlertTriangle,
    metrics: ["Program effectiveness", "Completion rates", "Engagement patterns"]
  },
  {
    id: "interpretive-notes",
    title: "Interpretive Notes & Human Commentary",
    description: "Space for human analysts to contextualize quantitative data. Captures institutional knowledge and qualitative insights.",
    icon: MessageSquare,
    metrics: ["Analyst notes", "Context layers", "Qualitative insights"]
  }
];

export default function PartB() {
  return (
    <div className="min-h-screen bg-background">
      <CMGFNav />
      <div className="max-w-5xl mx-auto px-6 py-6">
        <nav className="mb-8 text-sm flex items-center flex-wrap gap-1">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            Portfolio
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link href="/cmgf" className="text-muted-foreground hover:text-primary transition-colors">
            CMGF
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link href="/cmgf/walkthrough" className="text-muted-foreground hover:text-primary transition-colors">
            Walkthrough
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">Part B</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">Part B</Badge>
            <Users className="h-6 w-6 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Institutional Stewardship</h1>
          <div className="flex flex-wrap gap-4 text-sm mb-4">
            <div>
              <span className="text-muted-foreground">Role:</span>
              <span className="ml-2 font-medium text-foreground">Human Judgment & Accountability</span>
            </div>
            <div>
              <span className="text-muted-foreground">Authority:</span>
              <span className="ml-2 font-medium text-foreground">Human-only decisions</span>
            </div>
          </div>
          <p className="text-muted-foreground max-w-3xl">
            This is a <strong className="text-foreground">human workspace</strong>, not an AI workspace. 
            Part B represents formal human decision-making environments including Education Services Offices (ESO), 
            advisors, educators, and administrators. This layer receives AI-mediated signals, performs human judgment, 
            produces official outcomes, and maintains accountability.
          </p>
        </header>

        <Card className="mb-8 border-green-500/20 bg-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-green-500" />
              <h3 className="font-medium text-foreground">Design Rules</h3>
            </div>
            <ul className="text-sm text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                No predictive language
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                No automation metaphors
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Clear role separation
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Decisions explicitly attributed to humans
              </li>
            </ul>
          </CardContent>
        </Card>

        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-lg font-semibold text-foreground">ESO / Human System</h2>
            <Badge variant="outline" className="text-xs">6 Interfaces</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Human decision-making interfaces for advisors, educators, and administrators.
          </p>
          <div className="grid gap-4">
            {partBPages.map((page, index) => (
              <Card key={page.id} className="border-border/50 hover-elevate" data-testid={`card-partb-${page.id}`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <page.icon className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">B{index + 1}</span>
                        <h3 className="font-semibold text-foreground">{page.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{page.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {page.responsibilities.map((resp, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                            {resp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-semibold text-foreground">Enterprise Governance & Evidence Layer</h2>
            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">B1</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            This is <strong className="text-foreground">NOT</strong> an individual decision layer. 
            B1 exists to support policy, funding, and system design—not individuals.
          </p>

          <Card className="mb-6 border-amber-500/20 bg-amber-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-amber-600" />
                <h3 className="font-medium text-foreground">Critical Governance Constraints</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Must be explicit on every page:</p>
              <ul className="text-sm text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  No individual identifiers
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  No re-identification risk
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Population-level metrics only
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Aggregation boundary checks enforced
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {partB1Pages.map((page, index) => (
              <Card key={page.id} className="border-border/50 hover-elevate" data-testid={`card-partb1-${page.id}`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <page.icon className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">B1.{index + 1}</span>
                        <h3 className="font-semibold text-foreground">{page.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{page.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {page.metrics.map((metric, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400">
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="pt-6 border-t border-border">
          <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Navigation</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/cmgf">
              <Button variant="outline" size="sm" data-testid="link-cmgf-main">CMGF Main</Button>
            </Link>
            <Link href="/cmgf/walkthrough">
              <Button variant="outline" size="sm" data-testid="link-walkthrough">Walkthrough Overview</Button>
            </Link>
            <Link href="/cmgf/walkthrough/part-a">
              <Button variant="outline" size="sm" data-testid="link-part-a">Part A: Service Member</Button>
            </Link>
            <Link href="/cmgf/walkthrough/part-c">
              <Button variant="outline" size="sm" data-testid="link-part-c">Part C: AI Mediation</Button>
            </Link>
            <Link href="/cmgf/downloads">
              <Button variant="outline" size="sm" data-testid="link-downloads">Downloads</Button>
            </Link>
            <Link href="/cmgf/library">
              <Button variant="outline" size="sm" data-testid="link-library">Library</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
