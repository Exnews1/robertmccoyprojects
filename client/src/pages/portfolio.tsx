import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, BookOpen, Users, GraduationCap, Award, Briefcase, Download, FileText, Presentation } from "lucide-react";

const featuredDocuments = [
  {
    id: "paper",
    title: "CMGF Research Paper",
    description: "Complete framework paper with system architecture and implementation guidance",
    icon: FileText,
    href: "/attached_assets/Career_Mobility_2026__CCME_1767988417551.pdf"
  },
  {
    id: "presentation",
    title: "CCME 2026 Presentation",
    description: "Conference presentation on bounded AI governance for military transitions",
    icon: Presentation,
    href: "/attached_assets/CCME_2026_1767730819889.pdf"
  }
];

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

        <section className="mb-12">
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-6">Featured Documents</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {featuredDocuments.map((doc) => (
              <Card key={doc.id} className="border-border/50 border-primary/20 bg-primary/5" data-testid={`card-featured-doc-${doc.id}`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <doc.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                      <Button variant="default" size="sm" asChild data-testid={`button-download-${doc.id}`}>
                        <a href={doc.href} download>
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

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
