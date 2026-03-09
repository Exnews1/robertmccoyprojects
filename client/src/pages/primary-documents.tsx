import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Shield, Database, Monitor, ExternalLink, Download, Quote, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTrackClick } from "@/App";

type CitationFormat = "apa" | "chicago" | "mla";

const primaryDocs = [
  {
    id: "cmgf-01",
    badge: "CMGF-01",
    title: "Executive White Paper",
    description: "Governance-first architecture for military transition advising.",
    icon: FileText,
    href: "/attached_assets/CMGF-01_White_Paper_1772413079574.docx",
    actions: "download",
    citations: {
      apa: `McCoy, R. E. (2026). Executive white paper: A governance-first architecture for military transition advising (CMGF-01). Career Mobility Governance Framework Series 2026. Retrieved from https://robertmccoyprojects.com/cmgf/series`,
      chicago: `McCoy, Robert E. "Executive White Paper: A Governance-First Architecture for Military Transition Advising." CMGF-01, Career Mobility Governance Framework Series 2026. February 2026. https://robertmccoyprojects.com/cmgf/series.`,
      mla: `McCoy, Robert E. "Executive White Paper: A Governance-First Architecture for Military Transition Advising." CMGF-01, Career Mobility Governance Framework Series 2026, Feb. 2026, robertmccoyprojects.com/cmgf/series.`
    }
  },
  {
    id: "cmgf-02",
    badge: "CMGF-02",
    title: "Policy & Governance Architecture",
    description: "Authority structures, non-use guardrails, and federal AI alignment.",
    icon: Shield,
    href: "/attached_assets/CMGF-02_Policy_Governance_1772413079574.docx",
    actions: "download",
    citations: {
      apa: `McCoy, R. E. (2026). Policy & governance architecture brief: Architectural governance proof (CMGF-02). Career Mobility Governance Framework Series 2026. Retrieved from https://robertmccoyprojects.com/cmgf/series`,
      chicago: `McCoy, Robert E. "Policy & Governance Architecture Brief: Architectural Governance Proof." CMGF-02, Career Mobility Governance Framework Series 2026. February 2026. https://robertmccoyprojects.com/cmgf/series.`,
      mla: `McCoy, Robert E. "Policy & Governance Architecture Brief: Architectural Governance Proof." CMGF-02, Career Mobility Governance Framework Series 2026, Feb. 2026, robertmccoyprojects.com/cmgf/series.`
    }
  },
  {
    id: "cmgf-03",
    badge: "CMGF-03",
    title: "Data Flow & Signal Provenance",
    description: "Constraint binding, authority tagging, and audit logging.",
    icon: Database,
    href: "/attached_assets/CMGF-03_Data_Flow_Signal_1772413079574.docx",
    actions: "download",
    citations: {
      apa: `McCoy, R. E. (2026). Data flow & signal provenance brief: Technical assurance documentation (CMGF-03). Career Mobility Governance Framework Series 2026. Retrieved from https://robertmccoyprojects.com/cmgf/series`,
      chicago: `McCoy, Robert E. "Data Flow & Signal Provenance Brief: Technical Assurance Documentation." CMGF-03, Career Mobility Governance Framework Series 2026. February 2026. https://robertmccoyprojects.com/cmgf/series.`,
      mla: `McCoy, Robert E. "Data Flow & Signal Provenance Brief: Technical Assurance Documentation." CMGF-03, Career Mobility Governance Framework Series 2026, Feb. 2026, robertmccoyprojects.com/cmgf/series.`
    }
  },
  {
    id: "ccme-2026",
    title: "CCME 2026 Presentation",
    description: "CMGF conference presentation — CCME 2026 Learner Track 1.",
    icon: Monitor,
    href: "/attached_assets/Career_Mobility_Governance_Framework__CMGF_1772415843198.pptx",
    actions: "download-pptx",
  },
  {
    id: "nist-rmf",
    title: "NIST AI RMF 1.0",
    description: "AI Risk Management Framework — the governance standard referenced throughout CMGF.",
    icon: ExternalLink,
    href: "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf",
    actions: "view-pdf",
    external: true,
  },
  {
    id: "eo-14179",
    title: "Executive Order 14179",
    description: "Safe, Secure, and Trustworthy AI — the compliance baseline for CMGF.",
    icon: ExternalLink,
    href: "https://www.federalregister.gov/documents/2023/11/01/2023-24283/safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence",
    actions: "view-eo",
    external: true,
  },
];

export default function PrimaryDocuments() {
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
    <div className="min-h-[70vh]">
      <section className="py-12 md:py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-sm font-mono uppercase tracking-[0.2em] text-muted-foreground mb-8" data-testid="heading-primary-documents">
            Primary Documents
          </h1>

          <div className="grid md:grid-cols-3 gap-5">
            {primaryDocs.map((doc) => (
              <Card key={doc.id} className="border-border bg-card" data-testid={`card-doc-${doc.id}`}>
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                      <doc.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    {doc.badge && (
                      <Badge variant="outline" className="font-mono text-[10px] tracking-wider mt-1" data-testid={`badge-${doc.id}`}>
                        {doc.badge}
                      </Badge>
                    )}
                  </div>

                  <h2 className="font-semibold text-foreground text-base mb-2 font-serif" data-testid={`title-${doc.id}`}>
                    {doc.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-5 flex-1">
                    {doc.description}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap mt-auto">
                    {doc.citations && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" data-testid={`button-cite-${doc.id}`}>
                            <Quote className="h-3.5 w-3.5 mr-1.5" />
                            Cite
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Cite {doc.badge}: {doc.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {(["apa", "chicago", "mla"] as CitationFormat[]).map((format) => (
                              <div key={format} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium uppercase">{format}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCopyCitation(doc.citations![format], `${doc.id}-${format}`)}
                                    data-testid={`button-copy-cite-${doc.id}-${format}`}
                                  >
                                    {copiedFormat === `${doc.id}-${format}` ? (
                                      <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                                <p className="text-sm text-muted-foreground bg-muted p-3 font-mono text-xs leading-relaxed">
                                  {doc.citations![format]}
                                </p>
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    {doc.actions === "download" && (
                      <Button variant="outline" size="sm" asChild data-testid={`button-download-${doc.id}`}>
                        <a href={doc.href} download onClick={trackPaperDownload}>
                          <Download className="h-3.5 w-3.5 mr-1.5" />
                          Download
                        </a>
                      </Button>
                    )}

                    {doc.actions === "download-pptx" && (
                      <Button variant="outline" size="sm" asChild data-testid={`button-download-${doc.id}`}>
                        <a href={doc.href} download onClick={trackPaperDownload}>
                          <Download className="h-3.5 w-3.5 mr-1.5" />
                          Download PPTX
                        </a>
                      </Button>
                    )}

                    {doc.actions === "view-pdf" && (
                      <Button variant="outline" size="sm" asChild data-testid={`button-view-${doc.id}`}>
                        <a href={doc.href} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                          View PDF
                        </a>
                      </Button>
                    )}

                    {doc.actions === "view-eo" && (
                      <Button variant="outline" size="sm" asChild data-testid={`button-view-${doc.id}`}>
                        <a href={doc.href} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                          View EO 14179
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
