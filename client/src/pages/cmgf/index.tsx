import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, BookOpen, Users, Cpu, Library, User, ArrowRight, ChevronRight, FileText, Presentation, MessageSquare } from "lucide-react";
import { CMGFNav } from "@/components/cmgf-nav";

const canonicalDocuments = [
  {
    id: "paper",
    title: "CMGF Research Paper",
    description: "Complete research paper with system architecture and implementation guidance",
    icon: FileText,
    href: "/attached_assets/Career_Mobility_2026__CCME_1767988417551.pdf"
  },
  {
    id: "presentation",
    title: "CCME 2026 Presentation",
    description: "Conference presentation on bounded AI governance",
    icon: Presentation,
    href: "/attached_assets/CCME_2026_1767730819889.pdf"
  }
];

const sections = [
  {
    id: "engagement",
    title: "Interactive Engagement",
    description: "Explore the CMGF research paper through document-grounded inquiry and submit considered expert commentary.",
    icon: MessageSquare,
    route: "/cmgf/engagement"
  },
  {
    id: "downloads",
    title: "Canonical Downloads",
    description: "Research paper, conference presentation, and supplemental framework documentation.",
    icon: Download,
    route: "/cmgf/downloads"
  },
  {
    id: "walkthrough",
    title: "Framework Walkthrough",
    description: "Three-part system architecture: Service Member Interface, Advisory Layer, AI Mediation.",
    icon: BookOpen,
    route: "/cmgf/walkthrough"
  },
  {
    id: "library",
    title: "Research Library",
    description: "Supporting materials, policy references, and academic resources.",
    icon: Library,
    route: "/cmgf/library"
  }
];

export default function CMGFRoot() {
  return (
    <div className="min-h-screen bg-background">
      <CMGFNav />
      <div className="max-w-6xl mx-auto px-6 py-6">
        <nav className="mb-8 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            Portfolio
          </Link>
          <ChevronRight className="inline h-4 w-4 mx-2 text-muted-foreground" />
          <span className="text-foreground">CMGF</span>
        </nav>

        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            The Future Is Now: A Governed AI Framework for Military Learner Mobility
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            An authoritative framework addressing the structural paradox of $13.5B annual education benefits versus $140M transition-specific advising. Designed for academic, policy, and institutional audiences.
          </p>
        </header>

        <section className="mb-10">
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Download Research Documents</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {canonicalDocuments.map((doc) => (
              <Card key={doc.id} className="border-primary/20 bg-primary/5" data-testid={`card-canon-doc-${doc.id}`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <doc.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                      <Button variant="default" size="sm" asChild data-testid={`button-canon-download-${doc.id}`}>
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

        <section className="mb-12">
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-6">Overview</h2>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-foreground leading-relaxed">
                  The Career Mobility Governance Framework (CMGF) addresses a critical institutional gap: while the Department of Defense invests substantially in education benefits, the infrastructure supporting career transitions remains structurally underfunded. This framework provides a bounded, human-in-the-loop AI architecture that preserves individual agency while enabling institutional learning.
                </p>
                <p className="text-foreground leading-relaxed mt-4">
                  The system enforces three non-negotiable constraints: no predictive outcome modeling, no individual risk scoring, and no automated approvals. AI serves as infrastructure—never as authority.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-6">Sections</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {sections.map((section) => (
              <Link key={section.id} href={section.route}>
                <Card 
                  className={`h-full hover-elevate cursor-pointer group ${
                    (section as any).featured 
                      ? "border-primary/50 bg-gradient-to-br from-primary/10 to-transparent" 
                      : "border-border/50"
                  }`} 
                  data-testid={`card-section-${section.id}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <section.icon className={`h-6 w-6 ${(section as any).featured ? "text-primary" : "text-primary"} mb-2`} />
                      {(section as any).featured && (
                        <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">NEW</span>
                      )}
                    </div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground mb-4">
                      {section.description}
                    </CardDescription>
                    <div className="flex items-center text-sm text-primary group-hover:translate-x-1 transition-transform">
                      <span>{(section as any).featured ? "Launch Demo" : "Enter"}</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-6">Design Principles</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Governance is Architecture", desc: "System design enforces ethical constraints" },
              { title: "AI as Infrastructure", desc: "Never authority, always accountable" },
              { title: "Human Judgment Preserved", desc: "Decision authority remains with people" },
              { title: "Transparency Over Optimization", desc: "Explainability before efficiency" }
            ].map((principle, i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-4">
                  <h4 className="font-medium text-foreground text-sm mb-1">{principle.title}</h4>
                  <p className="text-xs text-muted-foreground">{principle.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
