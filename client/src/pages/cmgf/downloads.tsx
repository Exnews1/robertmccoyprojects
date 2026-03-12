import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, FileText, BookOpen, ChevronRight, ExternalLink, Zap, Shield, Database, Quote, Copy, Check, Rocket, Layers, Link2, Compass } from "lucide-react";
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
    href: "/attached_assets/CMGF-01_White_Paper_1773312432772.docx",
    version: "v3",
    date: "March 2026",
    citations: {
      apa: `McCoy, R. E. (2026). Executive white paper: A governance-first architecture for military transition advising (CMGF-01). Career Mobility Governance Framework Series 2026. Retrieved from https://robertmccoyprojects.com/research/cmgf/series`,
      chicago: `McCoy, Robert E. "Executive White Paper: A Governance-First Architecture for Military Transition Advising." CMGF-01, Career Mobility Governance Framework Series 2026. March 2026. https://robertmccoyprojects.com/research/cmgf/series.`,
      mla: `McCoy, Robert E. "Executive White Paper: A Governance-First Architecture for Military Transition Advising." CMGF-01, Career Mobility Governance Framework Series 2026, Mar. 2026, robertmccoyprojects.com/research/cmgf/series.`
    }
  },
  {
    id: "cmgf-02",
    number: "CMGF-02",
    title: "Policy & Governance Architecture Brief",
    description: "Authority structures, non-use guardrails, adoption controls, and alignment with federal AI risk management guidance.",
    type: "DOCX",
    icon: Shield,
    href: "/attached_assets/CMGF-02_Policy_Governance_1773312432773.docx",
    version: "v3",
    date: "March 2026",
    citations: {
      apa: `McCoy, R. E. (2026). Policy & governance architecture brief: Architectural governance proof (CMGF-02). Career Mobility Governance Framework Series 2026. Retrieved from https://robertmccoyprojects.com/research/cmgf/series`,
      chicago: `McCoy, Robert E. "Policy & Governance Architecture Brief: Architectural Governance Proof." CMGF-02, Career Mobility Governance Framework Series 2026. March 2026. https://robertmccoyprojects.com/research/cmgf/series.`,
      mla: `McCoy, Robert E. "Policy & Governance Architecture Brief: Architectural Governance Proof." CMGF-02, Career Mobility Governance Framework Series 2026, Mar. 2026, robertmccoyprojects.com/research/cmgf/series.`
    }
  },
  {
    id: "cmgf-03",
    number: "CMGF-03",
    title: "Data Flow & Signal Provenance Brief",
    description: "Deterministic constraint binding, authority tagging, signal provenance controls, audit logging, and non-predictive system boundaries.",
    type: "DOCX",
    icon: Database,
    href: "/attached_assets/CMGF-03_Data_Flow_Signal_1773312432773.docx",
    version: "v3",
    date: "March 2026",
    citations: {
      apa: `McCoy, R. E. (2026). Data flow & signal provenance brief: Technical assurance documentation (CMGF-03). Career Mobility Governance Framework Series 2026. Retrieved from https://robertmccoyprojects.com/research/cmgf/series`,
      chicago: `McCoy, Robert E. "Data Flow & Signal Provenance Brief: Technical Assurance Documentation." CMGF-03, Career Mobility Governance Framework Series 2026. March 2026. https://robertmccoyprojects.com/research/cmgf/series.`,
      mla: `McCoy, Robert E. "Data Flow & Signal Provenance Brief: Technical Assurance Documentation." CMGF-03, Career Mobility Governance Framework Series 2026, Mar. 2026, robertmccoyprojects.com/research/cmgf/series.`
    }
  },
  {
    id: "cmgf-04",
    number: "CMGF-04",
    title: "Sandbox Architecture & ISR Signal Boundary",
    description: "Two-mode architecture, signal boundary enforcement, and ISR implications. Establishes that sandbox exploration is architecturally non-reportable and that institutional signal is generated only by SM-initiated transactional actions.",
    type: "DOCX",
    icon: Layers,
    href: "/attached_assets/CMGF-04_Sandbox_Architecture_1773317232992.docx",
    version: "v1",
    date: "March 2026",
    citations: {
      apa: `McCoy, R. E. (2026). Sandbox architecture & ISR signal boundary (CMGF-04). Career Mobility Governance Framework Series 2026. Retrieved from https://robertmccoyprojects.com/research/cmgf/series`,
      chicago: `McCoy, Robert E. "Sandbox Architecture & ISR Signal Boundary." CMGF-04, Career Mobility Governance Framework Series 2026. March 2026. https://robertmccoyprojects.com/research/cmgf/series.`,
      mla: `McCoy, Robert E. "Sandbox Architecture & ISR Signal Boundary." CMGF-04, Career Mobility Governance Framework Series 2026, Mar. 2026, robertmccoyprojects.com/research/cmgf/series.`
    }
  },
  {
    id: "cmgf-05",
    number: "CMGF-05",
    title: "Credential Infrastructure, Session Continuity, and Upstream Integration",
    description: "Documents three deferred architecture components — Sovereign Credential Ledger, Credit Clearing House Partnership, and Session Continuity Architecture — with integration points and evaluation criteria for each.",
    type: "DOCX",
    icon: Link2,
    href: "/attached_assets/CMGF-05_Credential_Infrastructure_1773317232992.docx",
    version: "v1",
    date: "March 2026",
    citations: {
      apa: `McCoy, R. E. (2026). Credential infrastructure, session continuity, and upstream integration (CMGF-05). Career Mobility Governance Framework Series 2026. Retrieved from https://robertmccoyprojects.com/research/cmgf/series`,
      chicago: `McCoy, Robert E. "Credential Infrastructure, Session Continuity, and Upstream Integration." CMGF-05, Career Mobility Governance Framework Series 2026. March 2026. https://robertmccoyprojects.com/research/cmgf/series.`,
      mla: `McCoy, Robert E. "Credential Infrastructure, Session Continuity, and Upstream Integration." CMGF-05, Career Mobility Governance Framework Series 2026, Mar. 2026, robertmccoyprojects.com/research/cmgf/series.`
    }
  },
  {
    id: "cmgf-06",
    number: "CMGF-06",
    title: "Potential Authority Landscape",
    description: "Maps institutional authorities that could benefit from CMGF's binding-layer architecture. For each domain, identifies the fragmentation problem, signal types, governance constraints, and institutional learning outputs.",
    type: "DOCX",
    icon: Compass,
    href: "/attached_assets/CMGF-06_Authority_Landscape_1773317232992.docx",
    version: "v1",
    date: "March 2026",
    citations: {
      apa: `McCoy, R. E. (2026). Potential authority landscape (CMGF-06). Career Mobility Governance Framework Series 2026. Retrieved from https://robertmccoyprojects.com/research/cmgf/series`,
      chicago: `McCoy, Robert E. "Potential Authority Landscape." CMGF-06, Career Mobility Governance Framework Series 2026. March 2026. https://robertmccoyprojects.com/research/cmgf/series.`,
      mla: `McCoy, Robert E. "Potential Authority Landscape." CMGF-06, Career Mobility Governance Framework Series 2026, Mar. 2026, robertmccoyprojects.com/research/cmgf/series.`
    }
  }
];

const supplementalDocuments = [
  {
    id: "cmgf-00",
    title: "CMGF-00 Master Framework — Scholarly Foundation",
    description: "The original consolidated research paper providing the scholarly foundation for the CMGF Series 2026 six-brief architecture.",
    type: "DOCX",
    icon: FileText,
    href: "/attached_assets/CMGF-00_Framework_Research_1773312432772.docx",
    version: "v6",
    date: "March 2026"
  },
  {
    id: "ccme-presentation",
    title: "CCME CMGF Presentation",
    description: "Conference presentation slides for the Career Mobility Governance Framework. Prepared for the Council of College and Military Educators.",
    type: "PPTX",
    icon: BookOpen,
    href: "/attached_assets/Career_Mobility_Governance_Framework__CMGF_1772415843198.pptx",
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
    id: "eo-14179",
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
            <Link href="/research/cmgf/library">
              <Button variant="outline" size="sm">Research Library</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
