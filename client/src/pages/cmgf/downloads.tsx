import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, BookOpen, ChevronRight, ExternalLink, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CMGFNav } from "@/components/cmgf-nav";

const documents = [
  {
    id: "paper",
    title: "CMGF Paper Consolidated",
    description: "Original consolidated research paper — now superseded by the CMGF Series 2026 three-part architecture. Retained as a reference artifact.",
    type: "DOCX",
    icon: FileText,
    href: "/attached_assets/Career_Mobility_2026__CCME_v4_1770726274664.docx",
    version: "v4",
    date: "February 2026"
  },
  {
    id: "ccme-presentation",
    title: "CCME CMGF Presentation",
    description: "Conference presentation slides for the Career Mobility Governance Framework. Prepared for the Council of College and Military Educators.",
    type: "PDF",
    icon: BookOpen,
    href: "/attached_assets/CCME-CMGF_1770017672179.pdf",
    version: "v1",
    date: "February 2026"
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
    title: "Executive Order 14110",
    description: "Safe, Secure, and Trustworthy Development and Use of Artificial Intelligence — the compliance baseline for CMGF.",
    type: "PDF",
    icon: ExternalLink,
    href: "https://www.federalregister.gov/documents/2023/11/01/2023-24283/safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence",
    version: "Final",
    date: "October 2023",
    external: true
  }
];

export default function Downloads() {
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
          <span className="text-foreground">Downloads</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-3">Canonical Downloads</h1>
          <p className="text-muted-foreground">
            Authoritative documents for the Career Mobility Governance Framework. Files are versioned and immutable once published.
          </p>
        </header>

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
                  <Badge variant="outline" className="text-xs">EO 14110</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Multi-module platform with Service Member Hub, AI Services, and Advisor Toolkit—featuring governance compliance and human-in-the-loop AI.
                </p>
                <Button size="default" asChild data-testid="button-launch-demo-downloads">
                  <a href="https://cmgfdemo.robertmccoyprojects.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Launch Demo
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="border-border/50" data-testid={`card-download-${doc.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <doc.icon className="h-6 w-6 text-primary" />
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
                          <a href={doc.href} {...((doc as any).external ? { target: "_blank", rel: "noopener noreferrer" } : { download: true })}>
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
            <Link href="/cmgf">
              <Button variant="outline" size="sm">CMGF Main</Button>
            </Link>
            <Button variant="outline" size="sm" asChild>
              <a href="https://cmgfdemo.robertmccoyprojects.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                Framework Walkthrough
              </a>
            </Button>
            <Link href="/cmgf/library">
              <Button variant="outline" size="sm">Research Library</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
