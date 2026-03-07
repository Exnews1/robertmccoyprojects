import { Link } from "wouter";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, BookOpen, Users, Cpu, Library, User, ArrowRight, ChevronRight, FileText, Presentation, MessageSquare, Quote, Printer, Copy, Check, ExternalLink, Zap, Search, Shield, Database, BarChart3, Rocket, FileCheck, Compass, PlayCircle } from "lucide-react";
import { CMGFNav } from "@/components/cmgf-nav";
import { ExplainButton } from "@/components/explain-button";
import { useToast } from "@/hooks/use-toast";
import { useTrackEvent, useTrackClick } from "@/App";

const seriesPapers = [
  {
    id: "cmgf-01",
    number: "CMGF-01",
    title: "Executive White Paper",
    description: "Governance-first architecture for military transition advising.",
    icon: FileText,
    href: "/attached_assets/CMGF-01_White_Paper_1772413079574.docx",
    citations: {
      apa: `McCoy, R. E. (2026). Executive white paper: A governance-first architecture for military transition advising (CMGF-01). Career Mobility Governance Framework Series 2026. Retrieved from https://robertmccoyprojects.com/cmgf/series`,
      chicago: `McCoy, Robert E. "Executive White Paper: A Governance-First Architecture for Military Transition Advising." CMGF-01, Career Mobility Governance Framework Series 2026. February 2026. https://robertmccoyprojects.com/cmgf/series.`,
      mla: `McCoy, Robert E. "Executive White Paper: A Governance-First Architecture for Military Transition Advising." CMGF-01, Career Mobility Governance Framework Series 2026, Feb. 2026, robertmccoyprojects.com/cmgf/series.`
    }
  },
  {
    id: "cmgf-02",
    number: "CMGF-02",
    title: "Policy & Governance Architecture",
    description: "Authority structures, non-use guardrails, and federal AI alignment.",
    icon: Shield,
    href: "/attached_assets/CMGF-02_Policy_Governance_1772413079574.docx",
    citations: {
      apa: `McCoy, R. E. (2026). Policy & governance architecture brief: Architectural governance proof (CMGF-02). Career Mobility Governance Framework Series 2026. Retrieved from https://robertmccoyprojects.com/cmgf/series`,
      chicago: `McCoy, Robert E. "Policy & Governance Architecture Brief: Architectural Governance Proof." CMGF-02, Career Mobility Governance Framework Series 2026. February 2026. https://robertmccoyprojects.com/cmgf/series.`,
      mla: `McCoy, Robert E. "Policy & Governance Architecture Brief: Architectural Governance Proof." CMGF-02, Career Mobility Governance Framework Series 2026, Feb. 2026, robertmccoyprojects.com/cmgf/series.`
    }
  },
  {
    id: "cmgf-03",
    number: "CMGF-03",
    title: "Data Flow & Signal Provenance",
    description: "Constraint binding, authority tagging, and audit logging.",
    icon: Database,
    href: "/attached_assets/CMGF-03_Data_Flow_Signal_1772413079574.docx",
    citations: {
      apa: `McCoy, R. E. (2026). Data flow & signal provenance brief: Technical assurance documentation (CMGF-03). Career Mobility Governance Framework Series 2026. Retrieved from https://robertmccoyprojects.com/cmgf/series`,
      chicago: `McCoy, Robert E. "Data Flow & Signal Provenance Brief: Technical Assurance Documentation." CMGF-03, Career Mobility Governance Framework Series 2026. February 2026. https://robertmccoyprojects.com/cmgf/series.`,
      mla: `McCoy, Robert E. "Data Flow & Signal Provenance Brief: Technical Assurance Documentation." CMGF-03, Career Mobility Governance Framework Series 2026, Feb. 2026, robertmccoyprojects.com/cmgf/series.`
    }
  }
];

const sections = [
  {
    id: "explorer",
    title: "Reference Explorer",
    description: "Semantic search over curated military career mobility research. Document-grounded discovery with no generative interpretation.",
    icon: Search,
    route: "/research/cmgf/explorer",
    featured: true
  },
  {
    id: "engagement",
    title: "Interactive Engagement",
    description: "Explore the CMGF research paper through document-grounded inquiry and submit considered expert commentary.",
    icon: MessageSquare,
    route: "/research/cmgf/engagement"
  },
  {
    id: "downloads",
    title: "Canonical Downloads",
    description: "Research paper, conference presentation, and supplemental framework documentation.",
    icon: Download,
    route: "/research/cmgf/downloads"
  },
  {
    id: "cse",
    title: "Credential Sequencing Engine",
    description: "Binding layer demonstration: transparent, rule-based credential sequencing with data provenance and audit logging.",
    icon: Zap,
    route: "https://certdemo.robertmccoyprojects.com",
    external: true,
    featured: true
  },
  {
    id: "walkthrough",
    title: "Framework Walkthrough",
    description: "Three-part system architecture: Service Member Interface, Advisory Layer, AI Mediation.",
    icon: BookOpen,
    route: "https://cmgfdemo.robertmccoyprojects.com",
    external: true
  },
  {
    id: "library",
    title: "Research Library",
    description: "Supporting materials, policy references, and academic resources.",
    icon: Library,
    route: "/research/cmgf/library"
  },
  {
    id: "dashboard",
    title: "Executive Dashboard",
    description: "System overview with compliance metrics, research foundation stats, and architecture summary.",
    icon: BarChart3,
    route: "/research/cmgf/dashboard"
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
  useTrackEvent("cmgf_visits");
  const trackDemoLaunch = useTrackClick("demo_launches");
  const trackPaperDownload = useTrackClick("paper_downloads");

  const handleCopyCitation = (format: keyof typeof citationFormats) => {
    navigator.clipboard.writeText(citationFormats[format]);
    setCopiedFormat(format);
    toast({
      title: "Citation copied",
      description: `${format.toUpperCase()} format copied to clipboard`,
    });
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleCopySeriesCitation = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(key);
    toast({
      title: "Citation copied",
      description: `${key.split("-").pop()?.toUpperCase()} format copied to clipboard`,
    });
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <CMGFNav />
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6">
        <nav className="mb-4 text-sm">
          <Link href="/research" className="text-muted-foreground hover:text-primary transition-colors">
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
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-sm font-mono uppercase tracking-wider text-primary">Executive Summary</CardTitle>
                <ExplainButton topic="CMGF Executive Summary" contextText="What is the Career Mobility Governance Framework and what institutional gap does it address?" />
              </div>
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
          <Link href="/research/cmgf/dashboard">
            <Card className="border-border/50 hover-elevate cursor-pointer" data-testid="card-executive-dashboard">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="text-xl font-bold text-foreground">Executive Dashboard</h3>
                      <Badge variant="outline" className="text-xs">System Overview</Badge>
                    </div>
                    <p className="text-muted-foreground">
                      Compliance metrics, research foundation statistics, activity tracking, and three-layer architecture summary across the CMGF system.
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0 hidden md:block" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>

        <section className="mb-10" data-testid="section-demo-tools">
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Cpu className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-foreground">CMGF Demo Tools</CardTitle>
                  <CardDescription className="text-sm">Interactive demonstrations of the framework's architecture, pipeline, and advisory systems.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid gap-3 md:grid-cols-4">
                {[
                  { href: "/research/ai", title: "AI Architecture", desc: "Governing principles and interactive tool index", icon: Cpu, tag: "Gateway" },
                  { href: "/research/eso", title: "ESO Pipeline", desc: "End-to-end career transition pipeline stages", icon: FileCheck, tag: "Pipeline" },
                  { href: "/research/career-advisor", title: "Career Advisor", desc: "Constraint-binding pathway feasibility engine", icon: Compass, tag: "Interactive" },
                  { href: "/research/signal-flow", title: "Signal Flow", desc: "90-second cinematic signal architecture animation with fireworks finale", icon: PlayCircle, tag: "Presentation" },
                ].map((tool) => (
                  <Link key={tool.href} href={tool.href}>
                    <Card className="h-full border-border/50 hover:border-primary/40 transition-colors cursor-pointer group" data-testid={`demo-tool-${tool.href.split("/").pop()}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <tool.icon className="h-4 w-4 text-primary flex-shrink-0" />
                          <Badge variant="outline" className="text-[10px] font-mono">{tool.tag}</Badge>
                        </div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{tool.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{tool.desc}</p>
                        <div className="flex items-center text-xs text-primary group-hover:translate-x-1 transition-transform">
                          <span>Open</span>
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
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
                    <Badge variant="outline" className="text-xs">EO 14179</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Multi-module platform for military-to-civilian career transitions. Explore the Service Member Hub, AI Services layer, and Advisor Toolkit—featuring AI-powered skill translation, career pathway matching, and comprehensive transition tracking across 6 military branches.
                  </p>
                  <Button size="default" asChild data-testid="button-launch-cmgf-demo">
                    <a href="https://cmgfdemo.robertmccoyprojects.com" target="_blank" rel="noopener noreferrer" onClick={trackDemoLaunch}>
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
          <Card className="border-primary bg-gradient-to-br from-primary/15 via-primary/10 to-transparent" data-testid="card-cmgf-series">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Library className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="text-xl font-bold text-foreground">CMGF Series 2026</h3>
                    <Badge variant="default" className="text-xs">PRIMARY</Badge>
                    <Badge variant="outline" className="text-xs">3-Part Architecture</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    The authoritative three-part architectural framework: Executive White Paper, Policy & Governance Architecture Brief, and Data Flow & Signal Provenance Brief. Derived from the CMGF-00 Master Framework scholarly foundation.
                  </p>
                  <Button size="default" asChild data-testid="button-enter-series">
                    <Link href="/research/cmgf/series">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Enter Series
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-10">
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Primary Documents</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {seriesPapers.map((doc) => (
              <Card key={doc.id} className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent" data-testid={`card-canon-doc-${doc.id}`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <doc.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge variant="default" className="font-mono text-xs">{doc.number}</Badge>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" data-testid={`button-cite-canon-${doc.id}`}>
                              <Quote className="h-4 w-4 mr-2" />
                              Cite
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Cite {doc.number}: {doc.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {(["apa", "chicago", "mla"] as Array<"apa" | "chicago" | "mla">).map((format) => (
                                <div key={format} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium uppercase">{format}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleCopySeriesCitation(doc.citations[format], `${doc.id}-${format}`)}
                                      data-testid={`button-copy-cite-canon-${doc.id}-${format}`}
                                    >
                                      {copiedFormat === `${doc.id}-${format}` ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md font-mono text-xs leading-relaxed">
                                    {doc.citations[format]}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" asChild data-testid={`button-canon-download-${doc.id}`}>
                          <a href={doc.href} download onClick={trackPaperDownload}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-3 mt-4">
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent" data-testid="card-canon-doc-presentation">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Presentation className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1">CCME 2026 Presentation</h3>
                    <p className="text-sm text-muted-foreground mb-3">CMGF conference presentation — CCME 2026 Learner Track 1.</p>
                    <Button variant="outline" size="sm" asChild data-testid="button-canon-download-presentation">
                      <a href="/attached_assets/Career_Mobility_Governance_Framework__CMGF_1772415843198.pptx" download onClick={trackPaperDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Download PPTX
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50" data-testid="card-canon-doc-nist">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <ExternalLink className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1">NIST AI RMF 1.0</h3>
                    <p className="text-sm text-muted-foreground mb-3">AI Risk Management Framework — the governance standard referenced throughout CMGF.</p>
                    <Button variant="outline" size="sm" asChild data-testid="button-canon-link-nist">
                      <a href="https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View PDF
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50" data-testid="card-canon-doc-eo14179">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <ExternalLink className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1">Executive Order 14179</h3>
                    <p className="text-sm text-muted-foreground mb-3">Safe, Secure, and Trustworthy AI — the compliance baseline for CMGF.</p>
                    <Button variant="outline" size="sm" asChild data-testid="button-canon-link-eo14179">
                      <a href="https://www.federalregister.gov/documents/2023/11/01/2023-24283/safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View EO 14179
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        
        <section className="mb-12">
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-6">Sections</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {sections.map((section) => {
              const isExternal = (section as any).external;
              const cardContent = (
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
                      {isExternal && (
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground mb-4">
                      {section.description}
                    </CardDescription>
                    <div className="flex items-center text-sm text-primary group-hover:translate-x-1 transition-transform">
                      <span>{isExternal ? "Launch Demo" : "Enter"}</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              );
              
              if (isExternal) {
                return (
                  <a key={section.id} href={section.route} target="_blank" rel="noopener noreferrer">
                    {cardContent}
                  </a>
                );
              }
              
              return (
                <Link key={section.id} href={section.route}>
                  {cardContent}
                </Link>
              );
            })}
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
