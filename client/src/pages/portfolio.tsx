import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, BookOpen, Users } from "lucide-react";

const projects = [
  {
    id: "cmgf",
    title: "Career Mobility Governance Framework",
    description: "A governed AI framework for military learner mobility. Human-centered system design for service member career transitions.",
    icon: Shield,
    route: "/cmgf",
    status: "Active Research"
  }
];

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Robert McCoy Projects</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Research and operational systems focused on human-centered governance, ethical AI design, and institutional accountability.
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            <a href="mailto:robert.mccoy@indwes.edu" className="hover:text-primary transition-colors" data-testid="link-email">
              robert.mccoy@indwes.edu
            </a>
          </div>
        </header>

        <section>
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-8">Projects</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link key={project.id} href={project.route}>
                <Card className="h-full hover-elevate cursor-pointer group border-border/50" data-testid={`card-project-${project.id}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <project.icon className="h-8 w-8 text-primary" />
                      <span className="text-xs font-mono px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {project.status}
                      </span>
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
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
