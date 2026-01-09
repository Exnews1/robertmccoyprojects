import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Presentation, BookOpen, ChevronRight, ExternalLink } from "lucide-react";
import { CMGFNav } from "@/components/cmgf-nav";

const documents = [
  {
    id: "paper",
    title: "CMGF Research Paper",
    description: "Complete research paper detailing the Career Mobility Governance Framework. Includes system architecture, ethical constraints, and implementation guidance.",
    type: "PDF",
    icon: FileText,
    href: "/attached_assets/Career_Mobility_2026__CCME_1767988417551.pdf",
    version: "1.0",
    date: "January 2026"
  },
  {
    id: "presentation",
    title: "CCME 2026 Conference Presentation",
    description: "Presented at the Council of College and Military Educators 2026 Learner Track. Addresses bounded AI governance for military-to-civilian transitions.",
    type: "PDF",
    icon: Presentation,
    href: "/attached_assets/CCME_2026_1767730819889.pdf",
    version: "1.0",
    date: "January 2026"
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

        <div className="space-y-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="border-border/50" data-testid={`card-download-${doc.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <doc.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{doc.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="font-mono bg-muted px-2 py-0.5 rounded">{doc.type}</span>
                          <span>Version {doc.version}</span>
                          <span>{doc.date}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="flex-shrink-0" asChild data-testid={`button-download-${doc.id}`}>
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
            <Link href="/cmgf/walkthrough">
              <Button variant="outline" size="sm">Framework Walkthrough</Button>
            </Link>
            <Link href="/cmgf/walkthrough/part-a">
              <Button variant="outline" size="sm">Part A</Button>
            </Link>
            <Link href="/cmgf/walkthrough/part-b">
              <Button variant="outline" size="sm">Part B</Button>
            </Link>
            <Link href="/cmgf/walkthrough/part-c">
              <Button variant="outline" size="sm">Part C</Button>
            </Link>
            <Link href="/cmgf/library">
              <Button variant="outline" size="sm">Research Library</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
