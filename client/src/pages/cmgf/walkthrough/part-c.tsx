import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, ChevronRight, ClipboardCheck, GraduationCap, Stamp, 
  ArrowRightLeft, FileText, ScrollText, Building2, BarChart3,
  TrendingDown, Scale, AlertTriangle, MessageSquare, Shield, ExternalLink
} from "lucide-react";
import { CMGFNav } from "@/components/cmgf-nav";
import { PersonaBanner } from "@/components/persona-selector";

const partCPages = [
  {
    id: "advisor-review",
    title: "Advisor Review Workspace",
    description: "Advisors receive AI-generated signals and apply human judgment. All interpretations are annotated with rationale for transparency and audit.",
    icon: ClipboardCheck,
    responsibilities: [
      "Receive AI signals",
      "Apply human judgment",
      "Annotate rationale"
    ],
    demoUrl: "/demos/part-b/advisor-review.html"
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
    ],
    demoUrl: "/demos/part-b/educator-validation.html"
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
    ],
    demoUrl: "/demos/part-b/admin-decision.html"
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
    ],
    demoUrl: "/demos/part-b/handoff-prep.html"
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
    ],
    demoUrl: "/demos/part-b/outcome-summary.html"
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
    ],
    demoUrl: "/demos/part-b/audit-trail.html"
  }
];

const partC1Pages = [
  {
    id: "executive-overview",
    title: "Executive Overview",
    description: "High-level system health metrics and strategic indicators. Population-level insights for leadership decision-making.",
    icon: Building2,
    metrics: ["System health", "Strategic indicators", "Population trends"],
    demoUrl: "/demos/part-b1/executive-overview.html"
  },
  {
    id: "bottleneck-analysis",
    title: "System Bottleneck Analysis",
    description: "Identifies friction points in transition pathways. Surfaces systemic delays and capacity constraints.",
    icon: BarChart3,
    metrics: ["Processing delays", "Capacity constraints", "Queue depths"],
    demoUrl: "/demos/part-b1/system-bottleneck.html"
  },
  {
    id: "funding-pressure",
    title: "Funding & Resource Pressure",
    description: "Aggregated view of resource utilization and funding gaps. Supports budget justification and resource allocation.",
    icon: TrendingDown,
    metrics: ["Utilization rates", "Funding gaps", "Resource allocation"],
    demoUrl: "/demos/part-b1/funding-pressure.html"
  },
  {
    id: "review-capacity",
    title: "Human Review Load & Capacity",
    description: "Monitors advisor workload and capacity across the system. Enables proactive staffing and workload balancing.",
    icon: Users,
    metrics: ["Advisor workload", "Queue times", "Capacity ratios"],
    demoUrl: "/demos/part-b1/human-review.html"
  },
  {
    id: "policy-friction",
    title: "Policy Friction & Exceptions",
    description: "Tracks policy exception frequency and patterns. Identifies candidates for policy revision or clarification.",
    icon: Scale,
    metrics: ["Exception rates", "Policy patterns", "Revision candidates"],
    demoUrl: "/demos/part-b1/policy-friction.html"
  },
  {
    id: "retention-signals",
    title: "Retention & Attrition Signals",
    description: "Aggregated indicators of transition program effectiveness. No individual predictions—population-level patterns only.",
    icon: AlertTriangle,
    metrics: ["Program effectiveness", "Completion rates", "Engagement patterns"],
    demoUrl: "/demos/part-b1/retention-signals.html"
  },
  {
    id: "interpretive-notes",
    title: "Interpretive Notes & Human Commentary",
    description: "Space for human analysts to contextualize quantitative data. Captures institutional knowledge and qualitative insights.",
    icon: MessageSquare,
    metrics: ["Analyst notes", "Context layers", "Qualitative insights"],
    demoUrl: "/demos/part-b1/interpretive-notes.html"
  }
];

export default function PartC() {
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
          <span className="text-foreground">Part C</span>
        </nav>

        <PersonaBanner />

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">Part C</Badge>
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
            Part C represents formal human decision-making environments including Education Services Offices (ESO), 
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
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-6">ESO / Human System (6 Interfaces)</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {partCPages.map((page, index) => (
              <Card key={page.id} className="border-border/50" data-testid={`card-partc-${page.id}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <page.icon className="h-5 w-5 text-green-500" />
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      C{index + 1}
                    </span>
                  </div>
                  <CardTitle className="text-base">{page.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{page.description}</p>
                  <a 
                    href={page.demoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-green-500 hover:text-green-600"
                    data-testid={`demo-c-${page.id}`}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Interface Demo
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Enterprise Governance Layer (C1 — 7 Interfaces)</h2>
          
          <Card className="mb-6 border-amber-500/20 bg-amber-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-amber-600" />
                <h3 className="font-medium text-foreground text-sm">Critical Constraints</h3>
              </div>
              <ul className="text-xs text-muted-foreground grid grid-cols-2 md:grid-cols-4 gap-2">
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
                  Population-level only
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Aggregation enforced
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {partC1Pages.map((page, index) => (
              <Card key={page.id} className="border-border/50" data-testid={`card-partc1-${page.id}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <page.icon className="h-5 w-5 text-amber-600" />
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">
                      C1.{index + 1}
                    </span>
                  </div>
                  <CardTitle className="text-base">{page.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{page.description}</p>
                  <a 
                    href={page.demoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-amber-600 hover:text-amber-700"
                    data-testid={`demo-${page.id}`}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Interface Demo
                  </a>
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
            <Link href="/cmgf/walkthrough/part-b">
              <Button variant="outline" size="sm" data-testid="link-part-b">Part B: AI Mediation</Button>
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
