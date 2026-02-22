import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, GraduationCap, Award, Briefcase, Building2, Linkedin, User, Columns, BookOpen, Search, FileText, ChevronRight } from "lucide-react";

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Robert McCoy Projects</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Research and operational systems focused on human-centered governance, ethical AI design, and institutional accountability.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 flex-wrap text-sm text-muted-foreground">
            <a href="mailto:data@robertmccoyprojects.com" className="hover:text-primary transition-colors" data-testid="link-email">
              data@robertmccoyprojects.com
            </a>
            <span className="text-muted-foreground/30">|</span>
            <Link href="/profile" className="hover:text-primary transition-colors flex items-center gap-1" data-testid="link-profile">
              <User className="w-3.5 h-3.5" />
              Author's Profile
            </Link>
            <span className="text-muted-foreground/30">|</span>
            <Link href="/contact" className="hover:text-primary transition-colors" data-testid="link-contact">
              Submit Inquiry
            </Link>
          </div>
        </header>

        <section className="mb-16" data-testid="section-cmgf-hero">
          <Link href="/cmgf" data-testid="link-cmgf-main">
            <Card className="hover-elevate cursor-pointer group border-primary/30 bg-gradient-to-br from-primary/5 to-transparent overflow-visible" data-testid="card-cmgf-hero">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
                  <Shield className="h-12 w-12 text-primary" />
                  <Badge variant="secondary" className="text-xs font-mono">
                    Primary Research
                  </Badge>
                </div>
                <CardTitle className="text-2xl md:text-3xl mb-2">Career Mobility Governance Framework (CMGF)</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  A governed AI framework for military learner mobility. Human-centered system design enabling ethical, transparent, and accountable career transition support for service members.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center text-primary group-hover:translate-x-1 transition-transform">
                  <span className="font-medium">Explore CMGF</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <div className="grid gap-4 md:grid-cols-3 mt-6">
            <Link href="/cmgf/five-pillars" data-testid="link-five-pillars">
              <Card className="h-full hover-elevate cursor-pointer group border-border/50" data-testid="card-five-pillars">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Columns className="h-6 w-6 text-primary" />
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      797 Sources
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">The Five Pillars</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Evidence base supporting CMGF across career mobility, credentialing, AI advising, skills translation, and learner voice.
                  </p>
                  <div className="flex items-center text-sm text-primary group-hover:translate-x-1 transition-transform">
                    <span>View Pillars</span>
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/cmgf/library" data-testid="link-research-library">
              <Card className="h-full hover-elevate cursor-pointer group border-border/50" data-testid="card-research-library">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      67 References
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Research Library</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Complete reference list from the CMGF paper. Reports and journal articles supporting the framework.
                  </p>
                  <div className="flex items-center text-sm text-primary group-hover:translate-x-1 transition-transform">
                    <span>Browse Library</span>
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/explorer" data-testid="link-reference-explorer">
              <Card className="h-full hover-elevate cursor-pointer group border-border/50" data-testid="card-reference-explorer">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Search className="h-6 w-6 text-primary" />
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      RAG Search
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Reference Explorer</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    AI-powered Q&A grounded in Five Pillars research. Ask questions, get cited answers from 797 sources.
                  </p>
                  <div className="flex items-center text-sm text-primary group-hover:translate-x-1 transition-transform">
                    <span>Ask Questions</span>
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        <section className="mb-16" data-testid="section-ongoing-research">
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Research & Innovation Portfolio</h2>
            <Link href="/research-portfolio" data-testid="link-view-all-research">
              <Button variant="outline" size="sm">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            Additional research exploring AI governance, education futures, workforce readiness, and institutional systems analysis.
          </p>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link href="/education-ai" data-testid="link-quick-education-ai">
                  <div className="flex items-center gap-2 text-muted-foreground hover-elevate rounded px-2 py-1 -mx-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm">AI Education Futures</span>
                    <span className="text-xs text-muted-foreground/60">557 papers</span>
                  </div>
                </Link>
                <Link href="/workforce-ai" data-testid="link-quick-workforce-ai">
                  <div className="flex items-center gap-2 text-muted-foreground hover-elevate rounded px-2 py-1 -mx-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm">AI Workforce Readiness</span>
                    <span className="text-xs text-muted-foreground/60">423 papers</span>
                  </div>
                </Link>
                <Link href="/universities-ai" data-testid="link-quick-universities-ai">
                  <div className="flex items-center gap-2 text-muted-foreground hover-elevate rounded px-2 py-1 -mx-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm">AI in Universities</span>
                  </div>
                </Link>
                <Link href="/incarceration-research" data-testid="link-quick-incarceration">
                  <div className="flex items-center gap-2 text-muted-foreground hover-elevate rounded px-2 py-1 -mx-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm">Incarceration Research</span>
                    <span className="text-xs text-muted-foreground/60">728 papers</span>
                  </div>
                </Link>
                <Link href="/human-capital" data-testid="link-quick-human-capital">
                  <div className="flex items-center gap-2 text-muted-foreground hover-elevate rounded px-2 py-1 -mx-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm">Human Capital Framework</span>
                    <span className="text-xs text-muted-foreground/60">453 papers</span>
                  </div>
                </Link>
                <Link href="/ai-types" data-testid="link-quick-ai-types">
                  <div className="flex items-center gap-2 text-muted-foreground hover-elevate rounded px-2 py-1 -mx-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm">AI Types & Classifications</span>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="pt-16 border-t border-border" data-testid="section-author-bio">
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
                Today, Robert serves as the Military Partnership Executive at Indiana Wesleyan University, where he builds strategic education and workforce initiatives that connect veterans with high-demand careers in STEM, aerospace, and emerging technologies.
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

              <Card className="border-primary/30 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-primary flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Advisory Roles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Board Member, MidSouth Advisory Council on Military Education</span>
                  </div>
                </CardContent>
              </Card>

              <div className="pt-2">
                <a 
                  href="https://www.linkedin.com/in/robert-mccoy-mba-9451142a0/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-linkedin"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn Profile</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
