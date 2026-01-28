import { Link } from "wouter";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, BookOpen, Users, Cpu, Library, User, ArrowRight, ChevronRight, FileText, Presentation, MessageSquare, Quote, Printer, Copy, Check, ExternalLink, Zap, Search } from "lucide-react";
import { CMGFNav } from "@/components/cmgf-nav";
import { useToast } from "@/hooks/use-toast";

const canonicalDocuments = [
  {
    id: "paper",
    title: "CMGF Research Paper",
    description: "Complete research paper with system architecture and implementation guidance",
    icon: FileText,
    href: "/attached_assets/Career_Mobility_2026__CCME_1769103378838.docx"
  }
];

const sections = [
  {
    id: "explorer",
    title: "Reference Explorer",
    description: "Semantic search over curated military career mobility research. Document-grounded discovery with no generative interpretation.",
    icon: Search,
    route: "/cmgf/explorer",
    featured: true
  },
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

const citationFormats = {
  apa: `McCoy, R. E. (2026). The future is now: A governed AI framework for military learner mobility. Career Mobility Governance Framework, v1.0. Retrieved from https://robertmccoyprojects.com/cmgf`,
  chicago: `McCoy, Robert E. "The Future Is Now: A Governed AI Framework for Military Learner Mobility." Career Mobility Governance Framework, v1.0. January 2026. https://robertmccoyprojects.com/cmgf.`,
  mla: `McCoy, Robert E. "The Future Is Now: A Governed AI Framework for Military Learner Mobility." Career Mobility Governance Framework, v1.0, Jan. 2026, robertmccoyprojects.com/cmgf.`
};

export default function CMGFRoot() {
  const { toast } = useToast();
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const handleCopyCitation = (format: keyof typeof citationFormats) => {
    navigator.clipboard.writeText(citationFormats[format]);
    setCopiedFormat(format);
    toast({
      title: "Citation copied",
      description: `${format.toUpperCase()} format copied to clipboard`,
    });
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

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

        <header className="mb-8">
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <Badge variant="outline" className="font-mono text-xs">v1.0</Badge>
            <span className="text-xs text-muted-foreground">Last updated: January 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            The Future Is Now: A Governed AI Framework for Military Learner Mobility
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-4">
            An authoritative framework addressing the structural paradox of $13.5B annual education benefits versus $140M transition-specific advising. Designed for academic, policy, and institutional audiences.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" data-testid="button-cite-work">
                  <Quote className="h-4 w-4 mr-2" />
                  Cite This Work
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Cite This Work</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {(Object.keys(citationFormats) as Array<keyof typeof citationFormats>).map((format) => (
                    <div key={format} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium uppercase">{format}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleCopyCitation(format)}
                          data-testid={`button-copy-citation-${format}`}
                        >
                          {copiedFormat === format ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md font-mono text-xs leading-relaxed">
                        {citationFormats[format]}
                      </p>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" onClick={handlePrint} data-testid="button-print">
              <Printer className="h-4 w-4 mr-2" />
              Print View
            </Button>
          </div>
        </header>

        <section className="mb-10 print:break-inside-avoid">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono uppercase tracking-wider text-primary">Executive Summary</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-foreground leading-relaxed">
                The Career Mobility Governance Framework (CMGF) proposes a bounded AI architecture for military-to-civilian career transitions. The framework addresses a critical institutional gap: while the Department of Defense invests $13.5 billion annually in education benefits, only $140 million supports transition-specific advising. This structural imbalance leaves service members navigating complex career decisions without adequate institutional support.
              </p>
              <p className="text-foreground leading-relaxed mt-3">
                CMGF introduces three non-negotiable constraints: no predictive outcome modeling, no individual risk scoring, and no automated approvals. AI operates as infrastructure—providing visibility, structure, and decision support—while human advisors and service members retain full decision authority. The framework enables institutional learning through aggregated, de-identified signals without surveillance or control of individual choices.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-10">
          <Card className="border-primary bg-gradient-to-br from-primary/15 via-primary/10 to-transparent" data-testid="card-cmgf-demo">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="text-xl font-bold text-foreground">CMGF Platform Demo</h3>
                    <Badge variant="default" className="text-xs">LIVE</Badge>
                    <Badge variant="outline" className="text-xs">NIST AI RMF 1.0</Badge>
                    <Badge variant="outline" className="text-xs">EO 14110</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Multi-module platform for military-to-civilian career transitions. Explore the Service Member Hub, AI Services layer, and Advisor Toolkit—featuring AI-powered skill translation, career pathway matching, and comprehensive transition tracking across 6 military branches.
                  </p>
                  <Button size="default" asChild data-testid="button-launch-cmgf-demo">
                    <a href="https://cmgfdemo.robertmccoyprojects.com" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Launch Demo
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

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
