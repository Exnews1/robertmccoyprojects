import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, GraduationCap, Award, Briefcase, Factory, ExternalLink, Search } from "lucide-react";

const mainProjects = [
  {
    id: "cmgf",
    title: "Career Mobility Governance Framework (CMGF)",
    description: "A governed AI framework for military learner mobility. Human-centered system design for service member career transitions.",
    icon: Shield,
    route: "/cmgf",
    status: "Active Research",
    external: false
  },
  {
    id: "explorer",
    title: "CMGF Reference Explorer",
    description: "Semantic search over curated military career mobility research. Document-grounded discovery with no generative interpretation.",
    icon: Search,
    route: "/explorer",
    status: "Research Tool",
    external: false
  }
];

const otherProjects = [
  {
    id: "turbine",
    title: "AI Turbine Vision",
    description: "Industrial power monitoring station with real-time turbine diagnostics. AI-powered system monitoring for industrial power supply environments.",
    icon: Factory,
    route: "https://turbine.robertmccoyprojects.com",
    status: "Live Demo",
    external: true
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
          <div className="grid gap-6 md:grid-cols-2">
            {mainProjects.map((project) => (
              <Link key={project.id} href={project.route} data-testid={`link-project-${project.id}`}>
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

        <section className="mt-12">
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-6">Other Projects</h2>
          <div className="grid gap-4">
            {otherProjects.map((project) => (
              <a 
                key={project.id}
                href={project.route} 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid={`link-project-${project.id}`}
              >
                <Card className="hover-elevate cursor-pointer group border-border/50" data-testid={`card-project-${project.id}`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <project.icon className="h-6 w-6 text-muted-foreground" />
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                    <span className="text-xs font-mono px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {project.status}
                    </span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-16 pt-16 border-t border-border" data-testid="section-author-bio">
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-8">About the Author</h2>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-2xl font-bold text-foreground">Robert E. McCoy</h3>
              <p className="text-muted-foreground leading-relaxed">
                Robert McCoy is a lifelong servant-leader, aerospace executive, and education advocate whose career spans over five decades across military, engineering, and community leadership. With a foundation forged in both the United States Army and Navy, Robert has built a legacy of mission-driven leadership, technical excellence, and a deep commitment to empowering others through education and second chances.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                He served over 21 years in the U.S. military, including nine and a half years on active duty, holding roles as a Sonar Technician in the Navy and later as a Chief Warrant Officer and Aviator in the Army. His assignments included work on Presidential Support Staff.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Following his military service, Robert transitioned into the aerospace and defense sector, contributing to programs like the F-35 Joint Strike Fighter and NASA's Martian Lander. As Director of Operations for Belcan Corporation, he oversaw more than $42 million in annual contracts.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, Robert serves as the Military Partnership Executive at Indiana Wesleyan University, where he builds strategic education and workforce initiatives that connect veterans with high-demand careers in STEM, aerospace, and emerging technologies. He also serves on the board of the MidSouth Advisory Council on Military Education.
              </p>
            </div>
            
            <div className="space-y-6">
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-primary flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Credentials
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>M.S. Artificial Intelligence & Data Analytics</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>MBA</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>B.S. Aeronautics</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-primary flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Military Service
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>21+ Years Combined Service</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>U.S. Army Chief Warrant Officer, Aviator</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>U.S. Navy Sonar Technician</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Presidential Support Staff</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-primary flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Current Role
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Military Partnership Executive</p>
                  <p className="text-primary">Indiana Wesleyan University</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
