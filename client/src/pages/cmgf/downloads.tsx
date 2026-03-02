import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, FileText, BookOpen, ChevronRight, ExternalLink, Zap, Shield, Database, Quote, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CMGFNav } from "@/components/cmgf-nav";
import { useTrackClick } from "@/App";
import { useToast } from "@/hooks/use-toast";

const seriesPapers = [
  {
    id: "cmgf-01",
    number: "CMGF-01",
    title: "Executive White Paper",
    description: "A governance-first architecture for military transition advising. Strategic overview of the fragmentation challenge and constrained AI as a binding layer.",
    type: "DOCX",
    icon: FileText,
    href: "/attached_assets/CMGF-01_White_Paper_1772413079574.docx",
    version: "v2",
    date: "March 2026",
    citations: {
      apa: `McCoy, R. E. (2026). Executive white paper: A governance-first architecture for military transition advising (CMGF-01). Career Mobility Governance Framework Series 2026. Retrieved from https://robertmccoyprojects.com/cmgf/series`,
      chicago: `McCoy, Robert E. "Executive White Paper: A Governance-First Architecture for Military Transition Advising." CMGF-01, Career Mobility Governance Framework Series 2026. February 2026. https://robertmccoyprojects.com/cmgf/series.`,
      mla: `McCoy, Robert E. "Executive White Paper: A Governance-First Architecture for Military Transition Advising." CMGF-01, Career Mobility Governance Framework Series 2026, Feb. 2026, robertmccoyprojects.com/cmgf/series.`
    }
  },
  {
    id: "cmgf-02",
    number: "CMGF-02",
    title: "Policy & Governance Architecture Brief",
    description: "Authority structures, non-use guardrails, adoption controls, and alignment with federal AI risk management guidance.",
    type: "DOCX",
    icon: Shield,
    href: "/attached_assets/CMGF-02_Policy_Governance_1772413079574.docx",
    version: "v2",
    date: "March 2026",
    citations: {
      apa: `McCoy, R. E. (2026). Policy & governance architecture brief: Architectural governance proof (CMGF-02). Career Mobility Governance Framework Series 2026. Retrieved from https://robertmccoyprojects.com/cmgf/series`,
      chicago: `McCoy, Robert E. "Policy & Governance Architecture Brief: Architectural Governance Proof." CMGF-02, Career Mobility Governance Framework Series 2026. February 2026. https://robertmccoyprojects.com/cmgf/series.`,
      mla: `McCoy, Robert E. "Policy & Governance Architecture Brief: Architectural Governance Proof." CMGF-02, Career Mobility Governance Framework Series 2026, Feb. 2026, robertmccoyprojects.com/cmgf/series.`
    }
  },
  {
    id: "cmgf-03",
    number: "CMGF-03",
    title: "Data Flow & Signal Provenance Brief",
    description: "Deterministic constraint binding, authority tagging, signal provenance controls, audit logging, and non-predictive system boundaries.",
    type: "DOCX",
    icon: Database,
    href: "/attached_assets/CMGF-03_Data_Flow_Signal_1772413079574.docx",
    version: "v2",
    date: "March 2026",
    citations: {
      apa: `McCoy, R. E. (2026). Data flow & signal provenance brief: Technical assurance documentation (CMGF-03). Career Mobility Governance Framework Series 2026. Retrieved from https://robertmccoyprojects.com/cmgf/series`,
      chicago: `McCoy, Robert E. "Data Flow & Signal Provenance Brief: Technical Assurance Documentation." CMGF-03, Career Mobility Governance Framework Series 2026. February 2026. https://robertmccoyprojects.com/cmgf/series.`,
      mla: `McCoy, Robert E. "Data Flow & Signal Provenance Brief: Technical Assurance Documentation." CMGF-03, Career Mobility Governance Framework Series 2026, Feb. 2026, robertmccoyprojects.com/cmgf/series.`
    }
  }
];

const supplementalDocuments = [
  {
    id: "cmgf-00",
    title: "CMGF-00 Master Framework — Scholarly Foundation",
    description: "The original consolidated research paper providing the scholarly foundation for the CMGF Series 2026 three-part architecture.",
    type: "DOCX",
    icon: FileText,
    href: "/attached_assets/CMGF-00_Framework_Research_1772413079575.docx",
    version: "v5",
    date: "March 2026"
  },
  {
    id: "ccme-presentation",
    title: "CCME CMGF Presentation",
    description: "Conference presentation slides for the Career Mobility Governance Framework. Prepared for the Council of College and Military Educators.",
    type: "PPTX",
    icon: BookOpen,
    href: "/attached_assets/CCME_DEMO_LEAD_1772413079574.pptx",
    version: "v2",
    date: "March 2026"
  },
  {
    id: "nist-ai-rmf",
    title: "NIST AI Risk Management Framework 1.0",
    description: "National Institute of Standards and Technology AI RMF — the governance standard referenced throughout CMGF.",
    type: "PDF",
    icon: ExternalLink,
    href: "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf",
    version: "1.0",
    date: "January 2023",
    external: true
  },
  {
    id: "eo-14110",
    title: "Executive Order 14179",
    description: "Safe, Secure, and Trustworthy Development and Use of Artificial Intelligence — the compliance baseline for CMGF.",
    type: "PDF",
    icon: ExternalLink,
    href: "https://www.federalregister.gov/documents/2023/11/01/2023-24283/safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence",
    version: "Final",
    date: "October 2023",
    external: true
  }
];

type CitationFormat = "apa" | "chicago" | "mla";

export default function Downloads() {
  const { toast } = useToast();
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const trackPaperDownload = useTrackClick("paper_downloads");
  const trackDemoLaunch = useTrackClick("demo_launches");

  const handleCopyCitation = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    toast({
      title: "Citation copied",
      description: `${format.split("-").pop()?.toUpperCase()} format copied to clipboard`,
    });
    setTimeout(() => setCopiedFormat(null), 2000);
  };
  return (
    <div className="min-h-screen bg-background">
      <CMGFNav />
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-6">
        <nav className="mb-8 text-sm flex items-center flex-wrap gap-1">
          <Link href="/research" className="text-muted-foreground hover:text-primary transition-colors">
            Portfolio
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link href="/research/cmgf" className="text-muted-foreground hover:text-primary transition-colors">
            CMGF
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">Downloads</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-3">Canonical Downloads</h1>
          <p className="text-muted-foreground">
            Authoritative documents for the Career Mobility Governance Framework. Files are versioned and immutable once published.
          </p>
        </header>

        <section className="mb-10">
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">CMGF Series 2026</h2>
          <div className="space-y-4">
            {seriesPapers.map((doc) => (
              <Card key={doc.id} className="border-primary/40 bg-gradient-to-br from-primary/5 to-transparent" data-testid={`card-download-${doc.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <doc.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Badge variant="default" className="font-mono text-xs">{doc.number}</Badge>
                            <span className="font-semibold text-foreground">{doc.title}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                          <div className="flex items-center gap-4 flex-wrap text-xs text-muted-foreground">
                            <span className="font-mono bg-muted px-2 py-0.5 rounded">{doc.type}</span>
                            <span>Version {doc.version}</span>
                            <span>{doc.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap ml-auto">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" data-testid={`button-cite-download-${doc.id}`}>
                                <Quote className="h-4 w-4 mr-2" />
                                Cite
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                              <DialogHeader>
                                <DialogTitle>Cite {doc.number}: {doc.title}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                {(["apa", "chicago", "mla"] as CitationFormat[]).map((format) => (
                                  <div key={format} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium uppercase">{format}</span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleCopyCitation(doc.citations[format], `${doc.id}-${format}`)}
                                        data-testid={`button-copy-cite-download-${doc.id}-${format}`}
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
                          <Button variant="outline" size="sm" className="flex-shrink-0" asChild data-testid={`button-download-${doc.id}`}>
                            <a href={doc.href} download onClick={trackPaperDownload}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Card className="mb-8 border-primary bg-gradient-to-br from-primary/15 via-primary/10 to-transparent" data-testid="card-cmgf-demo-downloads">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h3 className="text-lg font-bold text-foreground">CMGF Platform Demo</h3>
                  <Badge variant="default" className="text-xs">LIVE</Badge>
                  <Badge variant="outline" className="text-xs">NIST AI RMF 1.0</Badge>
                  <Badge variant="outline" className="text-xs">EO 14179</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Multi-module platform with Service Member Hub, AI Services, and Advisor Toolkit—featuring governance compliance and human-in-the-loop AI.
                </p>
                <Button size="default" asChild data-testid="button-launch-demo-downloads">
                  <a href="https://cmgfdemo.robertmccoyprojects.com" target="_blank" rel="noopener noreferrer" onClick={trackDemoLaunch}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Launch Demo
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <section>
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Supplemental Documents</h2>
          <div className="space-y-4">
            {supplementalDocuments.map((doc) => (
              <Card key={doc.id} className="border-border/50" data-testid={`card-download-${doc.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <doc.icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground mb-1">{doc.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                          <div className="flex items-center gap-4 flex-wrap text-xs text-muted-foreground">
                            <span className="font-mono bg-muted px-2 py-0.5 rounded">{doc.type}</span>
                            <span>Version {doc.version}</span>
                            <span>{doc.date}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="flex-shrink-0" asChild data-testid={`button-download-${doc.id}`}>
                          <a href={doc.href} {...((doc as any).external ? { target: "_blank", rel: "noopener noreferrer" } : { download: true })} onClick={!(doc as any).external ? trackPaperDownload : undefined}>
                            {(doc as any).external ? <ExternalLink className="h-4 w-4 mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                            {(doc as any).external ? "View" : "Download"}
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Card className="mt-8 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Document Governance</h4>
                <p className="text-sm text-muted-foreground">
                  These documents represent canonical versions of the CMGF framework. Once published, files are not modified. Future versions are released with updated version numbers and clearly labeled revision history.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Navigation</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/research/cmgf">
              <Button variant="outline" size="sm">CMGF Main</Button>
            </Link>
            <Button variant="outline" size="sm" asChild>
              <a href="https://cmgfdemo.robertmccoyprojects.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                Framework Walkthrough
              </a>
            </Button>
            <Link href="/research/cmgf/library">
              <Button variant="outline" size="sm">Research Library</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
