import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cpu, ChevronRight, FileInput, AlertTriangle, Layers, Eye, Radio, Database, ArrowRightLeft, LogOut, XCircle, ExternalLink, FileCode } from "lucide-react";
import { CMGFNav } from "@/components/cmgf-nav";
import { PersonaBanner } from "@/components/persona-selector";

const pages = [
  {
    id: "normalization",
    title: "Input Normalization",
    description: "Standardize inputs from service member interface into structured formats for analysis. No interpretation or judgment applied.",
    icon: FileInput,
    demoUrl: "/demos/part-c/input-normalization.html"
  },
  {
    id: "constraint-analysis",
    title: "Constraint Analysis",
    description: "Identify conflicts between stated goals and known constraints. Surface conflicts for human review—never resolve autonomously.",
    icon: AlertTriangle,
    demoUrl: "/demos/part-c/constraint-analysis.html"
  },
  {
    id: "scenario-construction",
    title: "Scenario Construction",
    description: "Generate hypothetical pathways based on normalized inputs. All scenarios are exploratory and non-binding.",
    icon: Layers,
    demoUrl: "/demos/part-c/scenario-construction.html"
  },
  {
    id: "explainability",
    title: "Explainability Layer",
    description: "Ensure all AI outputs can be traced to inputs and rules. No black-box processing. Every output must be auditable.",
    icon: Eye,
    demoUrl: "/demos/part-c/explainability.html"
  },
  {
    id: "signal-generation",
    title: "Signal Generation",
    description: "Produce advisory signals for human reviewers. Signals are informational only—never prescriptive or directive.",
    icon: Radio,
    demoUrl: "/demos/part-c/signal-generation.html"
  },
  {
    id: "aggregation",
    title: "Aggregation Boundary Check",
    description: "Ensure population-level aggregation only. No individual profiling permitted. Data aggregation respects privacy boundaries.",
    icon: Database,
    demoUrl: "/demos/part-c/aggregation-boundary.html"
  },
  {
    id: "handoff",
    title: "Human Handoff Preparation",
    description: "Package AI outputs for human review. Surface uncertainty explicitly. Prevent automation bias through design.",
    icon: ArrowRightLeft,
    demoUrl: "/demos/part-c/human-handoff.html"
  },
  {
    id: "exit",
    title: "Exit Overview",
    description: "Clear boundary where AI processing ends and human authority begins. All subsequent decisions are human-made.",
    icon: LogOut,
    demoUrl: "/demos/part-c/exit-overview.html"
  }
];

const specSheetUrl = "/demos/part-c/spec-sheet.html";

const hardConstraints = [
  "No autonomous action",
  "No individual profiling",
  "Aggregation only at population level",
  "Advisory signals only",
  "No predictive modeling",
  "No success scoring"
];

export default function PartB() {
  return (
    <div className="min-h-screen bg-background">
      <CMGFNav />
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-6">
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

        <PersonaBanner />

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono px-2 py-1 rounded bg-purple-500/10 text-purple-500">Part B</span>
            <Cpu className="h-6 w-6 text-purple-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">AI Mediation Framework</h1>
          <div className="flex flex-wrap gap-4 text-sm mb-4">
            <div>
              <span className="text-muted-foreground">Role:</span>
              <span className="ml-2 font-medium text-foreground">Non-authoritative AI</span>
            </div>
            <div>
              <span className="text-muted-foreground">Function:</span>
              <span className="ml-2 font-medium text-foreground">Translation, Constraint Detection, Pattern Analysis</span>
            </div>
          </div>
          <p className="text-muted-foreground max-w-3xl">
            The AI layer serves as infrastructure—never authority. It performs translation, constraint detection, and pattern analysis while enforcing strict boundaries on autonomous action.
          </p>
        </header>

        <Card className="mb-8 border-red-500/20 bg-red-500/5">
          <CardContent className="p-4">
            <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Hard Constraints (System-Wide)
            </h3>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {hardConstraints.map((constraint, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <XCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                  <span className="text-foreground">{constraint}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Processing Stages</h2>
            <a 
              href={specSheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 rounded text-xs text-purple-600 dark:text-purple-400 transition-colors"
              data-testid="link-spec-sheet"
            >
              <FileCode className="h-3 w-3" />
              View AI Governance Spec Sheet
            </a>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {pages.map((page, index) => (
              <Card key={page.id} className="border-border/50" data-testid={`card-${page.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <page.icon className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">Stage {index + 1}</span>
                      </div>
                      <h3 className="font-medium text-foreground text-sm mb-1">{page.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{page.description}</p>
                      <a 
                        href={page.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs text-purple-500 hover:text-purple-600"
                        data-testid={`link-demo-${page.id}`}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Stage Demo
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Card className="mb-8 border-border/50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-3">Architectural Principle</h3>
            <p className="text-sm text-muted-foreground">
              AI in this framework is bounded by design. It cannot recommend, approve, or predict. It can only translate information, detect constraint conflicts, and generate advisory signals for human review. All outputs are explainable, auditable, and non-binding. The moment AI attempts to exceed these boundaries, the system rejects the operation.
            </p>
          </CardContent>
        </Card>

        <div className="pt-6 border-t border-border">
          <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Navigation</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/cmgf">
              <Button variant="outline" size="sm">CMGF Main</Button>
            </Link>
            <Link href="/cmgf/walkthrough">
              <Button variant="outline" size="sm">Walkthrough Overview</Button>
            </Link>
            <Link href="/cmgf/walkthrough/part-a">
              <Button variant="outline" size="sm">Part A: Service Member</Button>
            </Link>
            <Link href="/cmgf/walkthrough/part-c">
              <Button variant="outline" size="sm">Part C: Advisory Layer</Button>
            </Link>
            <Link href="/cmgf/downloads">
              <Button variant="outline" size="sm">Downloads</Button>
            </Link>
            <Link href="/cmgf/library">
              <Button variant="outline" size="sm">Library</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
