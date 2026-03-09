import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, BookOpen, ExternalLink, Search, Loader2, Target, Layers, Brain, Languages, Users, ChevronDown, ChevronUp, AlertCircle, RefreshCw } from "lucide-react";
import { CMGFNav } from "@/components/cmgf-nav";
import type { LibraryEntry } from "@shared/schema";

const pillars = [
  {
    id: "pillar-1",
    number: 1,
    title: "Military Learner Career Mobility",
    shortTitle: "Career Mobility",
    description: "Research on transitions, employment outcomes, and mobility patterns for military learners entering civilian careers.",
    icon: Target,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    filterKey: "Pillar 1: Military Learner Career Mobility"
  },
  {
    id: "pillar-2",
    number: 2,
    title: "Empowerment Strategies & Stackable Pathways",
    shortTitle: "Stackable Pathways",
    description: "Studies on credential stacking, competency-based education, and micro-credential frameworks for career advancement.",
    icon: Layers,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    filterKey: "Pillar 2: Empowerment Strategies & Stackable Pathways"
  },
  {
    id: "pillar-3",
    number: 3,
    title: "ISR & AI-Assisted Career Advising",
    shortTitle: "AI Career Advising",
    description: "Research on intelligent systems for career guidance, AI ethics, and institutional student records in advising contexts.",
    icon: Brain,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    filterKey: "Pillar 3: ISR & AI-Assisted Career Advising"
  },
  {
    id: "pillar-4",
    number: 4,
    title: "Translating Military Experience",
    shortTitle: "Experience Translation",
    description: "Studies on MOS-to-civilian credential mapping, skills translation, and recognition of prior learning.",
    icon: Languages,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    filterKey: "Pillar 4: Translating Military Experience"
  },
  {
    id: "pillar-5",
    number: 5,
    title: "Veteran & Servicemember Learner Voice",
    shortTitle: "Learner Voice",
    description: "Research capturing veteran perspectives, experiences, and self-determination in educational and career contexts.",
    icon: Users,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/30",
    filterKey: "Pillar 5: Veteran & Servicemember Learner Voice"
  }
];

interface GroupedSources {
  [key: string]: LibraryEntry[];
}

export default function FivePillars() {
  const [expandedPillars, setExpandedPillars] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  function togglePillar(pillarId: string) {
    setExpandedPillars(prev => {
      const next = new Set(prev);
      if (next.has(pillarId)) {
        next.delete(pillarId);
      } else {
        next.add(pillarId);
      }
      return next;
    });
  }

  const isFiltering = search.trim().length > 0;

  // Auto-expand pillars with results when searching
  function getExpandedState(pillarId: string, hasResults: boolean) {
    if (isFiltering) {
      return hasResults;
    }
    return expandedPillars.has(pillarId);
  }

  const { data: entries = [], isLoading, isError, refetch } = useQuery<LibraryEntry[]>({
    queryKey: ["/api/library"],
  });

  const groupedByPillar: GroupedSources = {};
  pillars.forEach(p => {
    groupedByPillar[p.filterKey] = entries.filter(e => 
      e.topics?.includes(p.filterKey)
    );
  });

  const totalSources = entries.length;

  function filterSources(sources: LibraryEntry[]) {
    if (!search.trim()) return sources;
    const s = search.toLowerCase();
    return sources.filter(e =>
      e.title.toLowerCase().includes(s) ||
      e.authors?.toLowerCase().includes(s) ||
      e.summary?.toLowerCase().includes(s)
    );
  }

  // Calculate filtered counts for each pillar
  const pillarCounts = pillars.map(p => {
    const allSources = groupedByPillar[p.filterKey] || [];
    const filteredSources = filterSources(allSources);
    return {
      ...p,
      count: allSources.length,
      filteredCount: filteredSources.length
    };
  });

  const totalFilteredSources = pillarCounts.reduce((sum, p) => sum + p.filteredCount, 0);

  return (
    <div className="min-h-screen bg-background">
      <CMGFNav />
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6">
        <nav className="mb-8 text-sm flex items-center flex-wrap gap-1" aria-label="Breadcrumb">
          <Link href="/research" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-breadcrumb-portfolio">
            Portfolio
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Link href="/research/cmgf" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-breadcrumb-cmgf">
            CMGF
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-foreground" aria-current="page">Five Pillars References</span>
        </nav>

        <header className="mb-10">
          <div className="text-xs text-muted-foreground mb-2">Last updated: January 2026</div>
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">The Five Pillars: Reference Database</h1>
          </div>
          <p className="text-muted-foreground max-w-3xl mb-4">
            A comprehensive collection of {totalSources} peer-reviewed sources (2015-2026) organized by the five foundational pillars 
            of the Career Mobility Governance Framework. Each source has been vetted for academic rigor and mapped to relevant pillars.
          </p>
          <div className="flex flex-wrap gap-2">
            {pillarCounts.map(p => (
              <Badge key={p.id} variant="outline" className={`${p.borderColor} ${p.color}`}>
                Pillar {p.number}: {isFiltering ? `${p.filteredCount}/${p.count}` : `${p.count}`} sources
              </Badge>
            ))}
          </div>
        </header>

        <div className="mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, author, abstract, or pillar (e.g., ISR, career, credential)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              data-testid="input-search-pillars"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-sm"
                data-testid="button-clear-search"
              >
                Clear
              </button>
            )}
          </div>
          {isFiltering && (
            <div className="flex items-center gap-2 text-sm" data-testid="search-results-summary">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {totalFilteredSources} result{totalFilteredSources !== 1 ? 's' : ''} found
              </Badge>
              <span className="text-muted-foreground">
                for "{search}" across all pillars
              </span>
            </div>
          )}
        </div>

        {/* Show flat search results when filtering */}
        {isFiltering && totalFilteredSources > 0 && (
          <Card className="mb-6 border-primary/30" data-testid="search-results-list">
            <CardContent className="p-0">
              <div className="p-4 border-b border-border bg-primary/5">
                <h3 className="font-semibold text-foreground">Search Results</h3>
              </div>
              <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
                {entries
                  .filter(e => {
                    const s = search.toLowerCase();
                    return e.title.toLowerCase().includes(s) ||
                      e.authors?.toLowerCase().includes(s) ||
                      e.summary?.toLowerCase().includes(s);
                  })
                  .slice(0, 50)
                  .map((source) => (
                    <div 
                      key={source.id} 
                      className="p-4 hover:bg-muted/30 transition-colors"
                      data-testid={`search-result-${source.id}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground text-sm mb-1 line-clamp-2">
                            {source.title}
                          </h4>
                          {source.authors && (
                            <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
                              {source.authors}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-2">
                            {source.year && <span>{source.year}</span>}
                            {source.documentType && (
                              <>
                                <span className="text-muted-foreground/50">|</span>
                                <span>{source.documentType}</span>
                              </>
                            )}
                          </div>
                          {source.topics && source.topics.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {source.topics.map((topic, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {topic.replace("Pillar ", "P")}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        {source.url && (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0"
                          >
                            <Button variant="ghost" size="icon" data-testid={`button-result-${source.id}`}>
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                {totalFilteredSources > 50 && (
                  <div className="p-4 text-center text-sm text-muted-foreground bg-muted/20">
                    Showing 50 of {totalFilteredSources} results. Refine your search to see more specific results.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">Unable to Load Sources</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    There was a problem loading the reference database. Please try again.
                  </p>
                  <Button onClick={() => refetch()} variant="outline" size="sm" data-testid="button-retry">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : totalSources === 0 ? (
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-amber-500 mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No Sources Available</h3>
              <p className="text-muted-foreground">
                The reference database is currently empty. Sources will appear here once imported.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pillarCounts.map((pillar) => {
              const sources = filterSources(groupedByPillar[pillar.filterKey] || []);
              const hasResults = sources.length > 0;
              const isExpanded = getExpandedState(pillar.id, hasResults);
              const IconComponent = pillar.icon;
              
              return (
                <Collapsible
                  key={pillar.id}
                  open={isExpanded}
                  onOpenChange={() => togglePillar(pillar.id)}
                >
                  <Card 
                    className={`${pillar.borderColor} overflow-hidden`}
                    data-testid={`card-${pillar.id}`}
                  >
                    <CollapsibleTrigger asChild>
                      <button
                        className={`w-full text-left p-6 ${pillar.bgColor} hover-elevate transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset`}
                        aria-expanded={isExpanded}
                        aria-controls={`content-${pillar.id}`}
                        data-testid={`button-toggle-${pillar.id}`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg ${pillar.bgColor} flex items-center justify-center`}>
                              <IconComponent className={`h-5 w-5 ${pillar.color}`} />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <span className="font-mono text-sm text-muted-foreground">P{pillar.number}</span>
                                {pillar.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">{pillar.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <Badge variant="secondary">{sources.length} sources</Badge>
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent id={`content-${pillar.id}`}>
                      <CardContent className="p-0">
                        {sources.length === 0 ? (
                          <div className="p-6 text-center text-muted-foreground">
                            No sources match your search criteria.
                          </div>
                        ) : (
                          <div className="divide-y divide-border">
                            {sources.slice(0, 50).map((source) => (
                              <div 
                                key={source.id} 
                                className="p-4 hover:bg-muted/30 transition-colors"
                                data-testid={`source-${source.id}`}
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-foreground text-sm mb-1 line-clamp-2">
                                      {source.title}
                                    </h4>
                                    {source.authors && (
                                      <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
                                        {source.authors}
                                      </p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                      {source.year && <span>{source.year}</span>}
                                      {source.sourceLabel && (
                                        <>
                                          <span className="text-muted-foreground/50">|</span>
                                          <span className="italic">{source.sourceLabel}</span>
                                        </>
                                      )}
                                      {source.documentType && (
                                        <>
                                          <span className="text-muted-foreground/50">|</span>
                                          <span>{source.documentType}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  {source.url && (
                                    <a
                                      href={source.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex-shrink-0"
                                    >
                                      <Button variant="ghost" size="icon" data-testid={`button-source-${source.id}`}>
                                        <ExternalLink className="h-4 w-4" />
                                      </Button>
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                            {sources.length > 50 && (
                              <div className="p-4 text-center text-sm text-muted-foreground bg-muted/20">
                                Showing 50 of {sources.length} sources. Use search to narrow results.
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })}
          </div>
        )}

        <div className="mt-12 pt-6 border-t border-border">
          <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Navigation</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/research/cmgf">
              <Button variant="outline" size="sm" data-testid="button-nav-cmgf-main">CMGF Main</Button>
            </Link>
            <Link href="/research/cmgf/walkthrough">
              <Button variant="outline" size="sm" data-testid="button-nav-walkthrough">Framework Walkthrough</Button>
            </Link>
            <Link href="/research/explorer">
              <Button variant="outline" size="sm" data-testid="button-nav-explorer">Reference Explorer</Button>
            </Link>
            <Link href="/research/cmgf/downloads">
              <Button variant="outline" size="sm" data-testid="button-nav-downloads">Downloads</Button>
            </Link>
            <Link href="/research/cmgf/library">
              <Button variant="outline" size="sm" data-testid="button-nav-library">Research Library</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
