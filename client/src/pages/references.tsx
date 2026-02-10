import { useQuery } from "@tanstack/react-query";
import { Publication } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Download, ExternalLink, BookOpen, FileCode, Award, Star, Presentation } from "lucide-react";

export default function References() {
  const { data: publications, isLoading } = useQuery<Publication[]>({
    queryKey: ["/api/publications"],
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-12 w-48" />
        <div className="grid gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const sortByTitle = (a: Publication, b: Publication) => 
    a.title.localeCompare(b.title);

  const papers = (publications?.filter(p => p.type === "Paper") || []).sort(sortByTitle);
  const reports = (publications?.filter(p => p.type === "Technical Report") || []).sort(sortByTitle);
  const other = (publications?.filter(p => p.type !== "Paper" && p.type !== "Technical Report") || []).sort(sortByTitle);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Paper":
        return <FileText className="w-4 h-4" />;
      case "Technical Report":
        return <FileCode className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case "Paper":
        return "bg-primary/20 text-primary border-primary/40";
      case "Technical Report":
        return "bg-slate-500/20 text-slate-400/80 border-slate-500/40";
      default:
        return "bg-neutral-800 text-neutral-300 border-neutral-600";
    }
  };

  const renderPublication = (pub: Publication) => (
    <Card key={pub.id} className="high-tech-card" data-testid={`card-publication-${pub.id}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-start gap-3 flex-wrap">
              <Badge className={`${getTypeBadgeClass(pub.type)} no-default-hover-elevate font-mono uppercase tracking-widest text-[10px]`}>
                {getTypeIcon(pub.type)}
                <span className="ml-1">{pub.type}</span>
              </Badge>
              {pub.author && (
                <Badge variant="outline" className="text-[10px] border-primary/20 text-muted-foreground">
                  <Award className="w-3 h-3 mr-1" />
                  {pub.author}
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold text-foreground leading-tight" data-testid={`text-title-${pub.id}`}>
              {pub.title}
            </h3>
            {pub.abstract && (
              <p className="text-sm text-muted-foreground leading-relaxed">{pub.abstract}</p>
            )}
            {pub.publishedDate && (
              <p className="text-xs text-muted-foreground font-mono">
                Published: {new Date(pub.publishedDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0">
            {pub.url && (
              pub.url.startsWith('/papers/') || pub.url.endsWith('.pdf') ? (
                <Button
                  variant="default"
                  size="sm"
                  asChild
                  data-testid={`button-download-${pub.id}`}
                >
                  <a href={pub.url} download target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </a>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  data-testid={`button-view-${pub.id}`}
                >
                  <a href={pub.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Source
                  </a>
                </Button>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <section className="relative overflow-hidden rounded-xl bg-neutral-900 border border-neutral-700 p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/40 no-default-hover-elevate font-mono uppercase tracking-widest text-[10px]">
            <BookOpen className="w-3 h-3 mr-1" /> Research Library
          </Badge>
          <h1 className="text-4xl font-black mb-4 glow-text tracking-tight">
            Reference Documents
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Complete collection of research papers, technical reports, and publications supporting the Career Mobility Governance Framework.
          </p>
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary tracking-tighter">{publications?.length || 0}</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Total Documents</span>
            </div>
            <div className="w-[1px] h-10 bg-neutral-700" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary tracking-tighter">{papers.length}</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Papers</span>
            </div>
            <div className="w-[1px] h-10 bg-neutral-700" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-400/80 tracking-tighter">{reports.length}</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Technical Reports</span>
            </div>
          </div>
        </div>
      </section>

      {/* PRIMARY DOCUMENTS - Paper and Presentation */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Star className="w-5 h-5 text-slate-400/80" />
          <h2 className="text-xl font-bold tracking-tight">Primary Documents</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="high-tech-card border-primary/40" data-testid="card-primary-paper">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/20 text-primary border-primary/40 no-default-hover-elevate font-mono uppercase tracking-widest text-[10px]">
                    <FileText className="w-3 h-3 mr-1" /> CMGF Paper
                  </Badge>
                  <Badge className="bg-slate-500/20 text-slate-400/80 border-slate-500/40 no-default-hover-elevate font-mono uppercase tracking-widest text-[10px]">
                    <Star className="w-3 h-3 mr-1" /> Featured
                  </Badge>
                </div>
                <h3 className="text-lg font-bold text-foreground leading-tight">
                  A Governed, Human-in-the-Loop AI Framework for Military Career Mobility
                </h3>
                <p className="text-sm text-muted-foreground">Design, Constraints, and Ethical Tradeoffs</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Award className="w-3 h-3" />
                  <span>Robert E. McCoy, MBA, M.S. AI & Data Analytics</span>
                </div>
                <p className="text-xs text-muted-foreground">Indiana Wesleyan University</p>
                <Button
                  variant="default"
                  className="w-full mt-2"
                  asChild
                  data-testid="button-download-primary-paper"
                >
                  <a href="/attached_assets/Career_Mobility_2026__CCME_v4_1770726274664.docx" download target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Download Paper (DOCX)
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="high-tech-card border-slate-500/30" data-testid="card-primary-presentation">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-slate-500/20 text-slate-400/80 border-slate-500/40 no-default-hover-elevate font-mono uppercase tracking-widest text-[10px]">
                    <Presentation className="w-3 h-3 mr-1" /> CCME 2026
                  </Badge>
                  <Badge className="bg-neutral-800 text-neutral-300 border-neutral-600 no-default-hover-elevate font-mono uppercase tracking-widest text-[10px]">
                    <Star className="w-3 h-3 mr-1" /> Featured
                  </Badge>
                </div>
                <h3 className="text-lg font-bold text-foreground leading-tight">
                  Military Learner Mobility and Career Alignment
                </h3>
                <p className="text-sm text-muted-foreground">The Future Is Now: Educate, Engage, Empower</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Award className="w-3 h-3" />
                  <span>Robert E. McCoy, MBA, M.S. AI & Data Analytics</span>
                </div>
                <p className="text-xs text-muted-foreground">CCME 2026 Learner Track 1 Presentation</p>
                <Button
                  variant="default"
                  className="w-full mt-2 bg-slate-600 hover:bg-slate-700"
                  asChild
                  data-testid="button-download-primary-presentation"
                >
                  <a href="/attached_assets/CCME_2026_1767730819889.pdf" download target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Download Presentation (PDF)
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <Card className="high-tech-card border-border/50" data-testid="card-ref-nist">
            <CardContent className="p-6">
              <div className="space-y-3">
                <Badge className="bg-neutral-800 text-neutral-300 border-neutral-600 no-default-hover-elevate font-mono uppercase tracking-widest text-[10px]">
                  <ExternalLink className="w-3 h-3 mr-1" /> Reference Standard
                </Badge>
                <h3 className="text-lg font-bold text-foreground leading-tight">NIST AI Risk Management Framework 1.0</h3>
                <p className="text-sm text-muted-foreground">National Institute of Standards and Technology AI RMF — the governance standard referenced throughout CMGF.</p>
                <Button variant="outline" className="w-full mt-2" asChild data-testid="button-link-nist-ref">
                  <a href="https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View NIST AI RMF 1.0 (PDF)
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="high-tech-card border-border/50" data-testid="card-ref-eo14110">
            <CardContent className="p-6">
              <div className="space-y-3">
                <Badge className="bg-neutral-800 text-neutral-300 border-neutral-600 no-default-hover-elevate font-mono uppercase tracking-widest text-[10px]">
                  <ExternalLink className="w-3 h-3 mr-1" /> Executive Order
                </Badge>
                <h3 className="text-lg font-bold text-foreground leading-tight">Executive Order 14110</h3>
                <p className="text-sm text-muted-foreground">Safe, Secure, and Trustworthy Development and Use of Artificial Intelligence — the compliance baseline for CMGF.</p>
                <Button variant="outline" className="w-full mt-2" asChild data-testid="button-link-eo14110-ref">
                  <a href="https://www.federalregister.gov/documents/2023/11/01/2023-24283/safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View EO 14110
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {papers.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold tracking-tight">Research Papers</h2>
            <Badge variant="outline" className="text-xs">{papers.length}</Badge>
            <span className="text-xs text-muted-foreground">(Alphabetical)</span>
          </div>
          <div className="space-y-4">
            {papers.map(renderPublication)}
          </div>
        </section>
      )}

      {reports.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <FileCode className="w-5 h-5 text-slate-400/80" />
            <h2 className="text-xl font-bold tracking-tight">Technical Reports</h2>
            <Badge variant="outline" className="text-xs">{reports.length}</Badge>
            <span className="text-xs text-muted-foreground">(Alphabetical)</span>
          </div>
          <div className="space-y-4">
            {reports.map(renderPublication)}
          </div>
        </section>
      )}

      {other.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-neutral-400" />
            <h2 className="text-xl font-bold tracking-tight">Other Publications</h2>
            <Badge variant="outline" className="text-xs">{other.length}</Badge>
            <span className="text-xs text-muted-foreground">(Alphabetical)</span>
          </div>
          <div className="space-y-4">
            {other.map(renderPublication)}
          </div>
        </section>
      )}
    </div>
  );
}
