import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ChevronRight, ClipboardCheck, GraduationCap, Stamp, ArrowRightLeft } from "lucide-react";
import { CMGFNav } from "@/components/cmgf-nav";

const pages = [
  {
    id: "advisor-review",
    title: "B1. Advisor Review Workspace",
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
    title: "B2. Educator Validation Panel",
    description: "Educators confirm academic alignment and flag institutional constraints. Ensures educational pathways are viable and appropriately matched.",
    icon: GraduationCap,
    responsibilities: [
      "Confirm academic alignment",
      "Flag institutional constraints",
      "Validate credential mapping"
    ]
  },
  {
    id: "admin-approval",
    title: "B3. Administrative Approval Interface",
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
    title: "B4. Human Handoff Preparation",
    description: "Ensures all AI outputs are explainable before human review. Surfaces uncertainty and prevents automation bias in decision-making.",
    icon: ArrowRightLeft,
    responsibilities: [
      "Ensure explainability",
      "Surface uncertainty",
      "Prevent automation bias"
    ]
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
            <span className="text-xs font-mono px-2 py-1 rounded bg-green-500/10 text-green-500">Part B</span>
            <Users className="h-6 w-6 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Advisory & Human Review Layer</h1>
          <div className="flex flex-wrap gap-4 text-sm mb-4">
            <div>
              <span className="text-muted-foreground">Role:</span>
              <span className="ml-2 font-medium text-foreground">Human Judgment and Accountability</span>
            </div>
            <div>
              <span className="text-muted-foreground">Authority:</span>
              <span className="ml-2 font-medium text-foreground">Human-only</span>
            </div>
          </div>
          <p className="text-muted-foreground max-w-3xl">
            This layer ensures all AI outputs are reviewed, contextualized, and decided upon by humans. No AI approvals. No success predictions. All actions are logged for institutional accountability.
          </p>
        </header>

        <Card className="mb-8 border-green-500/20 bg-green-500/5">
          <CardContent className="p-4">
            <h3 className="font-medium text-foreground mb-2">Layer Rules</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>No AI approvals permitted</li>
              <li>No success prediction allowed</li>
              <li>All actions logged for audit</li>
              <li>Human judgment required at every decision point</li>
            </ul>
          </CardContent>
        </Card>

        <section className="mb-10">
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-6">Review Interfaces</h2>
          <div className="space-y-4">
            {pages.map((page) => (
              <Card key={page.id} className="border-border/50" data-testid={`card-${page.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <page.icon className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">{page.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{page.description}</p>
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
              <Button variant="outline" size="sm">Part C: AI Mediation</Button>
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
