import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, BookOpen, FileText, ExternalLink, Search, Filter, Loader2, Archive } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { Publication } from "@shared/schema";
import { CMGFNav } from "@/components/cmgf-nav";

export default function Library() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const { data: publications = [], isLoading } = useQuery<Publication[]>({
    queryKey: ["/api/publications"],
  });

  const types = ["all", ...Array.from(new Set(publications.map(p => p.type)))];

  const [sortBy, setSortBy] = useState<"title" | "author">("title");

  const filtered = publications
    .filter(pub => {
      const matchesSearch = search === "" || 
        pub.title.toLowerCase().includes(search.toLowerCase()) ||
        (pub.author?.toLowerCase().includes(search.toLowerCase())) ||
        (pub.abstract?.toLowerCase().includes(search.toLowerCase()));
      const matchesFilter = filter === "all" || pub.type === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else {
        const authorA = a.author || "ZZZ";
        const authorB = b.author || "ZZZ";
        return authorA.localeCompare(authorB);
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <CMGFNav />
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-6">
        <nav className="mb-8 text-sm flex items-center flex-wrap gap-1">
          <Link href="/research" className="text-muted-foreground hover:text-primary transition-colors">
            Portfolio
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link href="/research/cmgf" className="text-muted-foreground hover:text-primary transition-colors">
            CMGF
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">Library</span>
        </nav>

        <header className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-3">Research Library</h1>
          <p className="text-muted-foreground max-w-3xl">
            Supporting materials, policy references, and academic resources for the Career Mobility Governance Framework. This collection is designed to grow as the framework evolves.
          </p>
        </header>

        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-foreground mb-2">Looking for more comprehensive research?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  The <strong>Five Pillars Reference Database</strong> contains 797 peer-reviewed sources organized by the five foundational themes of this paper:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 mb-4 ml-4">
                  <li>1. Military learner career mobility</li>
                  <li>2. Empowerment strategies and stackable pathways (CA, COOL, credential maps)</li>
                  <li>3. Tools and frameworks for career-aligned advising (interest inventories, outcome tracking)</li>
                  <li>4. Translating military experience into civilian workforce value</li>
                  <li>5. Veteran and servicemember learner voice: barriers and breakthroughs</li>
                </ul>
                <Link href="/research/cmgf/five-pillars">
                  <Button size="sm" data-testid="button-five-pillars-link">
                    Explore Five Pillars Database
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search publications..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-xs text-muted-foreground">Sort by:</span>
              <Button
                variant={sortBy === "title" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("title")}
                data-testid="button-sort-title"
              >
                Title
              </Button>
              <Button
                variant={sortBy === "author" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("author")}
                data-testid="button-sort-author"
              >
                Author
              </Button>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground self-center">Filter:</span>
            {types.map(type => (
              <Button
                key={type}
                variant={filter === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(type)}
                data-testid={`button-filter-${type}`}
              >
                {type === "all" ? "All" : type}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No publications found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              {filtered.length} publication{filtered.length !== 1 ? 's' : ''} 
              {filter !== "all" && ` in ${filter}`}
              {sortBy === "title" ? ", sorted A–Z by title" : ", sorted A–Z by author"}
            </p>
            {filtered.map((pub) => (
              <Card key={pub.id} className="border-border/50" data-testid={`card-publication-${pub.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-sm mb-1">{pub.title}</h3>
                      {pub.author && (
                        <p className="text-xs text-muted-foreground mb-1">{pub.author}</p>
                      )}
                      <div className="flex gap-3 text-xs text-muted-foreground mb-2">
                        {pub.publishedDate && <span>{pub.publishedDate}</span>}
                        {pub.type && <span className="text-primary/70">{pub.type}</span>}
                      </div>
                      {pub.abstract && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{pub.abstract}</p>
                      )}
                    </div>
                    {pub.url && (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0"
                      >
                        <Button variant="ghost" size="icon" data-testid={`button-link-${pub.id}`}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 pt-6 border-t border-border">
          <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Navigation</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/research/cmgf">
              <Button variant="outline" size="sm">CMGF Main</Button>
            </Link>
            <Link href="/research/cmgf/walkthrough">
              <Button variant="outline" size="sm">Walkthrough</Button>
            </Link>
            <Link href="/research/cmgf/downloads">
              <Button variant="outline" size="sm">Downloads</Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground/60 mb-3">Historical Archive</h3>
          <Link href="/research/cmgf/walkthrough">
            <Button variant="ghost" size="sm" className="text-muted-foreground" data-testid="button-old-walkthrough">
              <Archive className="h-3.5 w-3.5 mr-1.5" />
              Old_Walkthrough
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
