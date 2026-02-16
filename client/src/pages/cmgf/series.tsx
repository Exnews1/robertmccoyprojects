import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ChevronRight, FileText, Shield, Database, ArrowRight } from "lucide-react";
import { CMGFNav } from "@/components/cmgf-nav";

const seriesDocuments = [
  {
    id: "cmgf-01",
    number: "CMGF-01",
    title: "Executive White Paper",
    subtitle: "A Governance-First Architecture for Military Transition Advising",
    description: "A strategic overview of the fragmentation challenge across the five Track 1 pillars of military learner transitions. This document introduces the governance-first architecture and explains why constrained artificial intelligence may serve as a binding layer without displacing human authority.",
    audience: "Policy Leaders, Institutional Administrators, CCME Community",
    icon: FileText,
    href: "/attached_assets/CMGF-01_Executive_White_Paper_1771199739009.docx",
    type: "DOCX"
  },
  {
    id: "cmgf-02",
    number: "CMGF-02",
    title: "Policy & Governance Architecture Brief",
    subtitle: "Architectural Governance Proof",
    description: "A formal governance reference architecture. This document details authority structures, non-use guardrails, adoption controls, and alignment with federal artificial intelligence risk management guidance.",
    audience: "Compliance Officers, Federal Program Administrators, Governance Stakeholders",
    icon: Shield,
    href: "/attached_assets/CMGF-02_Policy_Governance_Architecture_Brief_1771199739009.docx",
    type: "DOCX"
  },
  {
    id: "cmgf-03",
    number: "CMGF-03",
    title: "Data Flow & Signal Provenance Brief",
    subtitle: "Technical Assurance Documentation",
    description: "A technical assurance document. This brief describes deterministic constraint binding, authority tagging, signal provenance controls, audit logging, and enforcement of non-predictive system boundaries.",
    audience: "System Architects, Data Governance Leads, CIO-Level Review",
    icon: Database,
    href: "/attached_assets/CMGF-03_Data_Flow_Signal_Provenance_Brief_1771199739009.docx",
    type: "DOCX"
  }
];

export default function CMGFSeries() {
  return (
    <div className="min-h-screen bg-background">
      <CMGFNav />
      <div className="max-w-4xl mx-auto px-6 py-6">
        <nav className="mb-8 text-sm flex items-center flex-wrap gap-1">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            Portfolio
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link href="/cmgf" className="text-muted-foreground hover:text-primary transition-colors">
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
            The CMGF Series 2026 is a three-part architectural framework addressing fragmentation in military transition advising, credential alignment, and career mobility systems.
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
                      <Button variant="outline" size="sm" asChild data-testid={`button-download-${doc.id}`}>
                        <a href={doc.href} download>
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

        <Card className="border-border/30 bg-muted/30" data-testid="card-series-disclaimer">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-4">
              All documents are unclassified and intended for professional discussion within the Council of College and Military Educators community and related policy, education, and governance stakeholders.
            </p>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <p className="text-xs text-muted-foreground/60">
                Author: Robert E. McCoy | February 2026
              </p>
              <Link href="/cmgf">
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