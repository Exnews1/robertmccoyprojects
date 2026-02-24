import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, ChevronRight, UserCircle, Target, Award, Calendar, Compass, BarChart3, Lightbulb, MousePointer, Headphones, ExternalLink } from "lucide-react";
import { CMGFNav } from "@/components/cmgf-nav";
import { PersonaBanner } from "@/components/persona-selector";
import { ExplainButton } from "@/components/explain-button";

const pages = [
  {
    id: "profile",
    title: "User Profile Setup",
    description: "Service members establish their baseline profile including service history, current credentials, and transition timeline.",
    icon: UserCircle,
    status: "Exploratory",
    demoUrl: "/demos/part-a/user-profile.html"
  },
  {
    id: "goals",
    title: "Goals and Constraints Input",
    description: "Capture individual aspirations, geographic preferences, family considerations, and timeline requirements.",
    icon: Target,
    status: "Exploratory",
    demoUrl: "/demos/part-a/goals-constraints.html"
  },
  {
    id: "credentials",
    title: "Credentials Assessment",
    description: "Review and translate military credentials to civilian equivalencies. Identify potential recognition gaps.",
    icon: Award,
    status: "Exploratory",
    demoUrl: "/demos/part-a/credentials.html"
  },
  {
    id: "planner",
    title: "Career and Education Planner",
    description: "Explore education pathways and career trajectories without commitment. Map potential routes to goals.",
    icon: Calendar,
    status: "Exploratory",
    demoUrl: "/demos/part-a/career-planner.html"
  },
  {
    id: "exploration",
    title: "Scenario Exploration Tools",
    description: "Generate hypothetical pathways based on stated goals and constraints. All scenarios are non-binding.",
    icon: Compass,
    status: "Exploratory",
    demoUrl: "/demos/part-a/scenario-exploration.html"
  },
  {
    id: "comparison",
    title: "Scenario Comparison",
    description: "Compare multiple pathways side-by-side. Evaluate trade-offs across time, cost, and goal alignment.",
    icon: BarChart3,
    status: "Exploratory",
    demoUrl: "/demos/part-a/scenario-comparison.html"
  },
  {
    id: "insights",
    title: "Advisory Insights",
    description: "Receive contextualized information about pathways. All insights are informational—never prescriptive.",
    icon: Lightbulb,
    status: "Exploratory",
    demoUrl: "/demos/part-a/advisory-insights.html"
  },
  {
    id: "actions",
    title: "Action Buttons and Resources",
    description: "Access to human advisors, official resources, and next steps. All actions initiated by the service member.",
    icon: MousePointer,
    status: "Exploratory",
    demoUrl: "/demos/part-a/actions-resources.html"
  },
  {
    id: "support",
    title: "Contact and Support",
    description: "Direct connections to human advisors and support resources. Technology supports—never replaces—human guidance.",
    icon: Headphones,
    status: "Exploratory",
    demoUrl: "/demos/part-a/contact-support.html"
  }
];

export default function PartA() {
  return (
    <div className="min-h-screen bg-background">
      <CMGFNav />
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-6">
        <nav className="mb-8 text-sm flex items-center flex-wrap gap-1">
          <Link href="/research" className="text-muted-foreground hover:text-primary transition-colors">
            Portfolio
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link href="/research/cmgf" className="text-muted-foreground hover:text-primary transition-colors">
            CMGF
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link href="/research/cmgf/walkthrough" className="text-muted-foreground hover:text-primary transition-colors">
            Walkthrough
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">Part A</span>
        </nav>

        <PersonaBanner />

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono px-2 py-1 rounded bg-blue-500/10 text-blue-500">Part A</span>
            <User className="h-6 w-6 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Service Member Interface</h1>
          <div className="flex flex-wrap gap-4 text-sm mb-4">
            <div>
              <span className="text-muted-foreground">Role:</span>
              <span className="ml-2 font-medium text-foreground">Individual Agency</span>
            </div>
            <div>
              <span className="text-muted-foreground">Authority:</span>
              <span className="ml-2 font-medium text-foreground">Origin of all action</span>
            </div>
          </div>
          <p className="text-muted-foreground max-w-3xl">
            This layer enables individuals to explore possible futures safely, without commitment. All interactions are exploratory—no approvals, no predictions, no binding outputs.
          </p>
        </header>

        <Card className="mb-8 border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h3 className="font-medium text-foreground">Interface Rules</h3>
              <ExplainButton topic="Service Member Interface Rules" contextText="What governance rules apply to the service member interface layer in CMGF?" />
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>All exploration is non-binding</li>
              <li>No automated approvals or decisions</li>
              <li>No predictive success modeling</li>
              <li>Individual controls all data and exploration</li>
            </ul>
          </CardContent>
        </Card>

        <section className="mb-10">
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-6">Interface Pages</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <Card key={page.id} className="border-border/50" data-testid={`card-page-${page.id}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <page.icon className="h-5 w-5 text-blue-500" />
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {page.status}
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
                    className="inline-flex items-center text-xs text-blue-500 hover:text-blue-600"
                    data-testid={`link-demo-${page.id}`}
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
            <Link href="/research/cmgf">
              <Button variant="outline" size="sm">CMGF Main</Button>
            </Link>
            <Link href="/research/cmgf/walkthrough">
              <Button variant="outline" size="sm">Walkthrough Overview</Button>
            </Link>
            <Link href="/research/cmgf/walkthrough/part-b">
              <Button variant="outline" size="sm">Part B: Advisory Layer</Button>
            </Link>
            <Link href="/research/cmgf/walkthrough/part-c">
              <Button variant="outline" size="sm">Part C: AI Mediation</Button>
            </Link>
            <Link href="/research/cmgf/downloads">
              <Button variant="outline" size="sm">Downloads</Button>
            </Link>
            <Link href="/research/cmgf/library">
              <Button variant="outline" size="sm">Library</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
