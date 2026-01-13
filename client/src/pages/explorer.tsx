import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Search, ExternalLink, FileText, AlertCircle, BookOpen } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface SearchResult {
  id: string;
  title: string;
  summary: string;
  year: number | null;
  documentType: string;
  sourceLabel: string | null;
  url: string | null;
  relevance: "High" | "Medium" | "Low";
}

const exampleQueries = [
  "Evidence on automation and workforce transition",
  "Governance constraints in AI decision systems",
  "Military education benefit utilization",
  "Human-in-the-loop system architecture"
];

export default function Explorer() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const response = await apiRequest("POST", "/api/search", { query });
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    }
    setLoading(false);
  }

  function handleExampleClick(example: string) {
    setQuery(example);
  }

  function getRelevanceBadgeVariant(relevance: string) {
    switch (relevance) {
      case "High": return "default";
      case "Medium": return "secondary";
      default: return "outline";
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <nav className="mb-8 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            Portfolio
          </Link>
          <ChevronRight className="inline h-4 w-4 mx-2 text-muted-foreground" />
          <span className="text-foreground">Reference Explorer</span>
        </nav>

        <header className="mb-10 text-center">
          <div className="text-xs text-muted-foreground mb-3">Last updated: January 2026</div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">CMGF Reference Explorer</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Semantic search over curated military career mobility research. 
            This tool supports discovery of relevant sources. Interpretation remains with the reader.
          </p>
        </header>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="search-query" className="text-sm font-medium text-foreground">
                  Explore the research library
                </label>
                <Textarea
                  id="search-query"
                  placeholder="Enter a topic or question to explore..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-[100px] resize-none"
                  data-testid="textarea-search-query"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-muted-foreground">Examples:</span>
                {exampleQueries.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExampleClick(example)}
                    className="text-xs text-primary hover:underline cursor-pointer"
                    data-testid={`button-example-${idx}`}
                  >
                    "{example}"
                  </button>
                ))}
              </div>

              <Button 
                onClick={handleSearch} 
                disabled={loading || !query.trim()} 
                className="w-full sm:w-auto"
                data-testid="button-explore-library"
              >
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Searching..." : "Explore Library"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {searched && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                {results.length > 0 ? `${results.length} Relevant Sources` : "No Results Found"}
              </h2>
            </div>

            {results.length === 0 && (
              <Card className="border-border/50">
                <CardContent className="p-6 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No matching entries found. Try a different query or broader terms.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {results.map((result) => (
                <Card key={result.id} className="border-border/50" data-testid={`card-result-${result.id}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{result.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          {result.sourceLabel && <span>{result.sourceLabel}</span>}
                          {result.year && <span>({result.year})</span>}
                          <span className="text-muted-foreground/50">|</span>
                          <span>{result.documentType}</span>
                        </div>
                      </div>
                      <Badge variant={getRelevanceBadgeVariant(result.relevance)}>
                        {result.relevance}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {result.summary}
                    </p>

                    {result.url && (
                      <Button variant="outline" size="sm" asChild data-testid={`button-view-source-${result.id}`}>
                        <a href={result.url} target="_blank" rel="noopener noreferrer">
                          View Source
                          <ExternalLink className="h-3 w-3 ml-2" />
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-foreground mb-1">System Boundaries</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Search operates only over curated research summaries</li>
                  <li>No generative interpretation or synthesis</li>
                  <li>No personalization or query storage</li>
                  <li>Full documents linked for reader interpretation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
