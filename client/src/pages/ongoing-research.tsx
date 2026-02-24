import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const researchProjects = [
  {
    id: "education-ai",
    title: "AI Education Futures Hub",
    description: "Evidence-based guidance for implementing AI across K-12, Higher Ed, Vocational, and Corporate learning. Analysis of 557 peer-reviewed papers with 8 implementation pathways and sector-specific guides.",
    route: "/education-ai",
    status: "Research Library",
    external: false,
    papers: 557
  },
  {
    id: "workforce-ai",
    title: "AI Workforce Readiness",
    description: "Doctoral-level analysis of AI in the workplace, US workforce readiness, and AI literacy frameworks. Comprehensive research on workforce transformation and skills development.",
    route: "/workforce-ai",
    status: "Research",
    external: false,
    papers: 423
  },
  {
    id: "universities-ai",
    title: "AI Use Cases in U.S. Universities",
    description: "Data-driven exploration of AI applications, policies, and governance frameworks across American higher education institutions.",
    route: "/universities-ai",
    status: "Analysis",
    external: false
  },
  {
    id: "ai-types",
    title: "AI Types & Classifications",
    description: "Comprehensive educational resource covering AI types by capability, functionality, and learning approach. Includes 20+ AI model explanations and selection guides.",
    route: "/ai-types",
    status: "Educational",
    external: false
  },
  {
    id: "incarceration-research",
    title: "U.S. Incarceration Research Hub",
    description: "Comprehensive data and analysis on the American criminal justice system. State-by-state comparisons, demographics, policy analysis, and 36 research datasets.",
    route: "/incarceration-research",
    status: "Research Hub",
    external: false,
    papers: 728
  },
  {
    id: "human-capital",
    title: "Human Capital Institutional Throughput",
    description: "Comparative analysis of military and correctional education systems. Evidence-based framework modeling human capital change as function of investment and friction.",
    route: "/human-capital",
    status: "Research Framework",
    external: false,
    papers: 453
  },
  {
    id: "turbine",
    title: "AI Turbine Vision",
    description: "Integrated power generation and demand management system. AI monitors turbine output while regulating a connected manufacturing/logistics facility. Real-time diagnostics and automated system regulation demonstrate closed-loop industrial AI governance.",
    route: "https://turbine.robertmccoyprojects.com",
    status: "Live Demo",
    external: true
  }
];

export default function OngoingResearch() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <Link href="/research">
          <Button variant="ghost" size="sm" className="mb-8" data-testid="button-back-home">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">Research & Innovation Portfolio</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Additional research projects exploring AI governance, education futures, workforce readiness, and institutional systems analysis.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {researchProjects.map((project, index) => {
            const numeral = (
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-600/20" data-testid={`numeral-${index + 1}`}>
                <span className="text-white font-bold text-lg font-mono">{index + 1}</span>
              </div>
            );

            return project.external ? (
              <a 
                key={project.id} 
                href={project.route} 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid={`link-project-${project.id}`}
              >
                <Card className="h-full hover-elevate cursor-pointer group border-border/50" data-testid={`card-project-${project.id}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                      {numeral}
                      <span className="text-xs font-mono px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {project.status}
                      </span>
                    </div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {project.title}
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-primary group-hover:translate-x-1 transition-transform">
                      <span>View Project</span>
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            ) : (
              <Link key={project.id} href={project.route} data-testid={`link-project-${project.id}`}>
                <Card className="h-full hover-elevate cursor-pointer group border-border/50" data-testid={`card-project-${project.id}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                      {numeral}
                      <div className="flex items-center gap-2 flex-wrap">
                        {project.papers && (
                          <span className="text-xs font-mono px-2 py-1 rounded-full bg-muted text-muted-foreground">
                            {project.papers} papers
                          </span>
                        )}
                        <span className="text-xs font-mono px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {project.status}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-primary group-hover:translate-x-1 transition-transform">
                      <span>View Project</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
