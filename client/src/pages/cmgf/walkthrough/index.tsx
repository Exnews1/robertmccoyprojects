import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Users, Cpu, ChevronRight, ArrowRight, Shield, CheckCircle, XCircle } from "lucide-react";
import { CMGFNav } from "@/components/cmgf-nav";
import { PersonaSelector, PersonaBanner } from "@/components/persona-selector";
import { ExplainButton } from "@/components/explain-button";

const parts = [
  {
    id: "part-a",
    label: "Part A",
    title: "Service Member Interface",
    role: "Individual Agency",
    authority: "Origin of all action",
    description: "Individuals explore futures safely, without commitment. Exploratory only—no approvals, predictions, or binding outputs.",
    icon: User,
    route: "/research/cmgf/walkthrough/part-a",
    color: "text-blue-500"
  },
  {
    id: "part-b",
    label: "Part B",
    title: "AI Mediation Framework",
    role: "Non-authoritative AI",
    authority: "Translation & Analysis",
    description: "AI performs translation, constraint detection, and pattern analysis. Advisory signals only—no autonomous action permitted.",
    icon: Cpu,
    route: "/research/cmgf/walkthrough/part-b",
    color: "text-purple-500"
  },
  {
    id: "part-c",
    label: "Part C",
    title: "Advisory & Human Review Layer",
    role: "Human Judgment",
    authority: "Human-only",
    description: "AI outputs are reviewed, contextualized, and decided upon by humans. All decisions require justification and trigger audit trails.",
    icon: Users,
    route: "/research/cmgf/walkthrough/part-c",
    color: "text-green-500"
  }
];

const compliancePoints = [
  { label: "DoD Responsible AI Principles", compliant: true },
  { label: "Federal AI Governance Requirements", compliant: true },
  { label: "Human-in-the-Loop Mandates", compliant: true },
  { label: "EO 14179 Safety Requirements", compliant: true },
  { label: "NIST AI RMF 1.0 Framework", compliant: true }
];

const prohibitions = [
  "Predictive outcome modeling",
  "Individual risk scoring",
  "Automated approvals",
  "Autonomous decision-making",
  "Individual profiling"
];

export default function Walkthrough() {
  return (
    <div className="min-h-screen bg-background">
      <CMGFNav />
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6">
        <nav className="mb-8 text-sm flex items-center flex-wrap gap-1">
          <Link href="/research" className="text-muted-foreground hover:text-primary transition-colors">
            Portfolio
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link href="/research/cmgf" className="text-muted-foreground hover:text-primary transition-colors">
            CMGF
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">Walkthrough</span>
        </nav>

        <header className="mb-12">
          <div className="text-xs text-muted-foreground mb-2">Last updated: January 2026</div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Framework Walkthrough</h1>
          <p className="text-muted-foreground max-w-3xl">
            The CMGF operates through three interconnected layers, each with distinct roles and authority boundaries. This architecture ensures human judgment is preserved at every decision point.
          </p>
        </header>

        <PersonaBanner />

        <section className="mb-12">
          <PersonaSelector />
        </section>

        <section className="mb-12">
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-6">Three-Part Architecture</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {parts.map((part) => (
              <Link key={part.id} href={part.route}>
                <Card className="h-full hover-elevate cursor-pointer group border-border/50" data-testid={`card-${part.id}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted">{part.label}</span>
                      <part.icon className={`h-5 w-5 ${part.color}`} />
                    </div>
                    <CardTitle className="text-lg">{part.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Role:</span>
                        <span className="font-medium text-foreground">{part.role}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Authority:</span>
                        <span className="font-medium text-foreground">{part.authority}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{part.description}</p>
                    <div className="flex items-center text-sm text-primary group-hover:translate-x-1 transition-transform">
                      <span>Explore</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-6">System Rigor Map</h2>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-500" />
                      Compliance Alignment
                    </h3>
                    <ExplainButton topic="CMGF Compliance Alignment" contextText="How does CMGF align with federal AI governance requirements including EO 14179 and NIST AI RMF?" />
                  </div>
                  <div className="space-y-2">
                    {compliancePoints.map((point, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-foreground">{point.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      Explicit Prohibitions
                    </h3>
                    <ExplainButton topic="CMGF Non-Use Guardrails" contextText="Why does CMGF prohibit predictive modeling, individual risk scoring, and automated approvals?" />
                  </div>
                  <div className="space-y-2">
                    {prohibitions.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  This map demonstrates compliance pressure—not capability ambition. The framework is designed to satisfy regulatory requirements while preserving individual agency and institutional accountability.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="pt-6 border-t border-border">
          <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Navigation</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/research/cmgf">
              <Button variant="outline" size="sm">CMGF Main</Button>
            </Link>
            <Link href="/research/cmgf/walkthrough/part-a">
              <Button variant="outline" size="sm">Part A: Service Member</Button>
            </Link>
            <Link href="/research/cmgf/walkthrough/part-b">
              <Button variant="outline" size="sm">Part B: AI Mediation</Button>
            </Link>
            <Link href="/research/cmgf/walkthrough/part-c">
              <Button variant="outline" size="sm">Part C: Advisory Layer</Button>
            </Link>
            <Link href="/research/cmgf/downloads">
              <Button variant="outline" size="sm">Downloads</Button>
            </Link>
            <Link href="/research/cmgf/library">
              <Button variant="outline" size="sm">Research Library</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
