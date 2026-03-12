import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, ChevronRight, FileText, Shield, Database, ArrowRight, Quote, Copy, Check, BookOpen, Layers, Link2, Compass } from "lucide-react";
import { CMGFNav } from "@/components/cmgf-nav";
import { useToast } from "@/hooks/use-toast";

const seriesDocuments = [
  {
    id: "cmgf-01",
    number: "CMGF-01",
    title: "Executive White Paper",
    subtitle: "A Governance-First Architecture for Military Transition Advising",
    description: "A strategic overview of the fragmentation challenge across the five Track 1 pillars of military learner transitions. This document introduces the governance-first architecture and explains why constrained artificial intelligence may serve as a binding layer without displacing human authority.",
    audience: "Policy Leaders, Institutional Administrators, CCME Community",
    icon: FileText,
    href: "/attached_assets/CMGF-01_White_Paper_1773312432772.docx",
    type: "DOCX",
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
    subtitle: "Architectural Governance Proof",
    description: "A formal governance reference architecture. This document details authority structures, non-use guardrails, adoption controls, and alignment with federal artificial intelligence risk management guidance.",
    audience: "Compliance Officers, Federal Program Administrators, Governance Stakeholders",
    icon: Shield,
    href: "/attached_assets/CMGF-02_Policy_Governance_1773312432773.docx",
    type: "DOCX",
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
    subtitle: "Technical Assurance Documentation",
    description: "A technical assurance document. This brief describes deterministic constraint binding, authority tagging, signal provenance controls, audit logging, and enforcement of non-predictive system boundaries.",
    audience: "System Architects, Data Governance Leads, CIO-Level Review",
    icon: Database,
    href: "/attached_assets/CMGF-03_Data_Flow_Signal_1773312432773.docx",
    type: "DOCX",
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
    subtitle: "Exploration Mode, Transaction Mode, and Institutional Signal Capture",
    description: "Documents the two-mode architecture, signal boundary enforcement, and ISR implications of CMGF's design. Establishes that sandboxing is architecturally non-reportable and that institutional signal is generated only by SM-initiated transactional actions — the essential trust model that enables 24/7 service member access.",
    audience: "System Architects, ESO Leadership, Command Education Staff, ISR Stakeholders",
    icon: Layers,
    href: "/attached_assets/CMGF-04_Sandbox_Architecture_1773317232992.docx",
    type: "DOCX",
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
    subtitle: "Deferred Architecture Components and Future Integration Pathways",
    description: "Documents three deliberately deferred components — Sovereign Credential Ledger, Credit Clearing House Partnership, and Session Continuity Architecture — explaining the rationale for each deferral, defining architectural integration points, and establishing evaluation criteria for future development.",
    audience: "System Architects, Governance Stakeholders, Future Pilot Design Teams",
    icon: Link2,
    href: "/attached_assets/CMGF-05_Credential_Infrastructure_1773317232992.docx",
    type: "DOCX",
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
    subtitle: "Institutional Stakeholders and Governance Domains That Benefit from Binding-Layer Infrastructure",
    description: "Maps the landscape of institutional authorities — including TAP, COOL, command leadership, higher education partners, workforce development, and the VA — that could benefit from CMGF's binding-layer architecture. For each domain, identifies the fragmentation problem, signal types, governance constraints, and institutional learning outputs.",
    audience: "Policy Stakeholders, Institutional Leadership, Interagency Coordination Bodies",
    icon: Compass,
    href: "/attached_assets/CMGF-06_Authority_Landscape_1773317232992.docx",
    type: "DOCX",
    citations: {
      apa: `McCoy, R. E. (2026). Potential authority landscape (CMGF-06). Career Mobility Governance Framework Series 2026. Retrieved from https://robertmccoyprojects.com/research/cmgf/series`,
      chicago: `McCoy, Robert E. "Potential Authority Landscape." CMGF-06, Career Mobility Governance Framework Series 2026. March 2026. https://robertmccoyprojects.com/research/cmgf/series.`,
      mla: `McCoy, Robert E. "Potential Authority Landscape." CMGF-06, Career Mobility Governance Framework Series 2026, Mar. 2026, robertmccoyprojects.com/research/cmgf/series.`
    }
  }
];

type CitationFormat = "apa" | "chicago" | "mla";

export default function CMGFSeries() {
  const { toast } = useToast();
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const handleCopyCitation = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    toast({
      title: "Citation copied",
      description: `${format.toUpperCase()} format copied to clipboard`,
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
          <span className="text-foreground">Series 2026</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <Badge variant="outline" className="font-mono text-xs">Series 2026</Badge>
            <span className="text-xs text-muted-foreground">February 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Career Mobility Governance Framework
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-4">
            The CMGF Series 2026 is a six-brief architectural framework addressing fragmentation in military transition advising, credential alignment, career mobility systems, and the governance infrastructure required to scale.
          </p>
          <p className="text-muted-foreground max-w-3xl mb-6">
            The framework proposes a governance-first approach to integrating artificial intelligence as constrained mediation infrastructure rather than as a predictive or decision-making authority.
          </p>
          <p className="text-sm text-muted-foreground/80 max-w-3xl">
            Each document in the series may be read independently. Together, they define a coherent model for preserving institutional authority, protecting the Voice of the Veteran, and improving transparency across complex advising ecosystems.
          </p>
        </header>

        <div className="space-y-6 mb-12">
          {seriesDocuments.map((doc, index) => (
            <Card key={doc.id} className="border-border/50" data-testid={`card-series-${doc.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <doc.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <Badge variant="default" className="font-mono text-xs">{doc.number}</Badge>
                      <span className="text-xs text-muted-foreground">{doc.type}</span>
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-1" data-testid={`title-${doc.id}`}>
                      {doc.title}
                    </h2>
                    <p className="text-sm text-muted-foreground/80 italic mb-3">{doc.subtitle}</p>
                    <p className="text-sm text-muted-foreground mb-4">{doc.description}</p>
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <span className="text-xs text-muted-foreground/60">
                        Prepared for: {doc.audience}
                      </span>
                      <div className="flex items-center gap-2 flex-wrap ml-auto">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" data-testid={`button-cite-${doc.id}`}>
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
                                      data-testid={`button-copy-cite-${doc.id}-${format}`}
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
                        <Button variant="outline" size="sm" asChild data-testid={`button-download-${doc.id}`}>
                          <a href={doc.href} download>
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

        <section className="mb-12">
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Scholarly Foundation</h2>
          <Card className="border-border/50" data-testid="card-series-cmgf-00">
            <CardContent className="p-6">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-7 w-7 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <Badge variant="outline" className="font-mono text-xs">CMGF-00</Badge>
                    <span className="text-xs text-muted-foreground">DOCX</span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-1" data-testid="title-cmgf-00">
                    Master Framework — Scholarly Foundation
                  </h2>
                  <p className="text-sm text-muted-foreground/80 italic mb-3">The Original Consolidated Research Paper</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    The full scholarly foundation for the CMGF Series 2026. This consolidated research paper provides the literature review, methodology, empirical analysis, and policy synthesis from which the six-brief architectural framework was derived. Includes 797 peer-reviewed sources, case examples, and technical appendices.
                  </p>
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <span className="text-xs text-muted-foreground/60">
                      Prepared for: CCME 2026 Learner Track 1
                    </span>
                    <div className="flex items-center gap-2 flex-wrap ml-auto">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" data-testid="button-cite-cmgf-00">
                            <Quote className="h-4 w-4 mr-2" />
                            Cite
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Cite CMGF-00: Master Framework</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {(["apa", "chicago", "mla"] as CitationFormat[]).map((format) => {
                              const citations = {
                                apa: `McCoy, R. E. (2026). Career mobility governance framework: An AI-governance framework for military transition advising (CMGF-00). A response to the 2026 CCME Learner Track 1. Retrieved from https://robertmccoyprojects.com/cmgf/series`,
                                chicago: `McCoy, Robert E. "Career Mobility Governance Framework: An AI-Governance Framework for Military Transition Advising." CMGF-00, A Response to the 2026 CCME Learner Track 1. February 2026. https://robertmccoyprojects.com/cmgf/series.`,
                                mla: `McCoy, Robert E. "Career Mobility Governance Framework: An AI-Governance Framework for Military Transition Advising." CMGF-00, A Response to the 2026 CCME Learner Track 1, Feb. 2026, robertmccoyprojects.com/cmgf/series.`
                              };
                              return (
                                <div key={format} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium uppercase">{format}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleCopyCitation(citations[format], `cmgf-00-${format}`)}
                                      data-testid={`button-copy-cite-cmgf-00-${format}`}
                                    >
                                      {copiedFormat === `cmgf-00-${format}` ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md font-mono text-xs leading-relaxed">
                                    {citations[format]}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" asChild data-testid="button-download-cmgf-00">
                        <a href="/attached_assets/CMGF-00_Framework_Research_1773312432772.docx" download>
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
        </section>

        <Card className="border-border/30 bg-muted/30" data-testid="card-series-disclaimer">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-4">
              All documents are unclassified and intended for professional discussion within the Council of College and Military Educators community and related policy, education, and governance stakeholders.
            </p>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <p className="text-xs text-muted-foreground/60">
                Author: Robert E. McCoy | February 2026
              </p>
              <Link href="/research/cmgf">
                <Button variant="ghost" size="sm" data-testid="button-back-cmgf">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  CMGF Research Hub
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}