import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Search, ExternalLink, FileText, AlertCircle, BookOpen, MessageSquare, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { CMGFAdvisoryNotice } from "@/components/cmgf-advisory-notice";
import { CMGFNav } from "@/components/cmgf-nav";

interface SearchResult {
  id: string;
  title: string;
  summary: string;
  year: number | null;
  documentType: string;
  sourceLabel: string | null;
  url: string | null;
  authors: string | null;
  topics: string[] | null;
  relevance: "High" | "Medium" | "Low";
}

interface AnswerSource {
  id: string;
  title: string;
}

interface AnswerResponse {
  answer: string | null;
  message?: string;
  sources: AnswerSource[];
  relatedSources: SearchResult[];
}

const exampleQueries = [
  "What is a stacked credential?",
  "How does CMGF ensure human oversight?",
  "What are the NIST AI RMF core functions?",
  "What does DOL TEN 07-25 require for AI literacy?"
];

export default function Explorer() {
  const [query, setQuery] = useState("");
  const [answerResponse, setAnswerResponse] = useState<AnswerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const response = await fetch("/api/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (response.status === 429) {
        const errData = await response.json().catch(() => ({}));
        setAnswerResponse({
          answer: null,
          message: errData.message || "Thanks for your interest! To control demo costs, this safeguard has been activated. Your access resets in about 60 seconds. For more, contact Robert McCoy via Whova or data@robertmccoyprojects.com.",
          sources: [],
          relatedSources: [],
        });
        setLoading(false);
        return;
      }
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setAnswerResponse(data);
    } catch (error) {
      console.error("Search failed:", error);
      setAnswerResponse(null);
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
      <CMGFNav />
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <nav className="mb-8 text-sm">
          <Link href="/research" className="text-muted-foreground hover:text-primary transition-colors">
            Research
          </Link>
          <ChevronRight className="inline h-4 w-4 mx-2 text-muted-foreground" />
          <Link href="/research/cmgf" className="text-muted-foreground hover:text-primary transition-colors">
            CMGF
          </Link>
          <ChevronRight className="inline h-4 w-4 mx-2 text-muted-foreground" />
          <span className="text-foreground">Reference Explorer</span>
        </nav>

        <CMGFAdvisoryNotice />

        <header className="mb-10 mt-6 text-center">
          <div className="text-xs text-muted-foreground mb-3">Last updated: March 2026</div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">CMGF Reference Explorer</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ask questions about military career mobility research. 
            Answers are grounded in curated sources with full citations.
          </p>
        </header>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="search-query" className="text-sm font-medium text-foreground">
                  Ask a question or explore a topic
                </label>
                <Textarea
                  id="search-query"
                  placeholder="Enter a question to get a grounded answer with citations..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-[100px] resize-none"
                  data-testid="textarea-search-query"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-muted-foreground">Try:</span>
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
                {loading ? "Searching..." : "Get Answer"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {searched && answerResponse && (
          <>
            {answerResponse.answer ? (
              <Card className="mb-8 border-primary/30 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">Grounded Answer</h3>
                      <p className="text-xs text-muted-foreground">
                        Based on {answerResponse.sources.length} source{answerResponse.sources.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-foreground leading-relaxed mb-4" data-testid="text-answer">
                    {answerResponse.answer}
                  </p>

                  {answerResponse.sources.length > 0 && (
                    <div className="border-t border-border/50 pt-4">
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">SOURCES CITED</h4>
                      <div className="flex flex-wrap gap-2">
                        {answerResponse.sources.map((source, idx) => (
                          <Badge key={source.id} variant="outline" className="text-xs">
                            [{idx + 1}] {source.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-8 border-amber-500/30 bg-amber-500/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-6 w-6 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">No Grounded Answer Available</h3>
                      <p className="text-sm text-muted-foreground" data-testid="text-no-answer-message">
                        {answerResponse.message || "No sources in the library directly address this question."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {answerResponse.relatedSources && answerResponse.relatedSources.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    Related Sources ({answerResponse.relatedSources.length})
                  </h2>
                </div>

                <div className="space-y-4">
                  {answerResponse.relatedSources.map((result) => (
                    <Card key={result.id} className="border-border/50" data-testid={`card-result-${result.id}`}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">{result.title}</h3>
                            {result.authors && (
                              <p className="text-xs text-muted-foreground mb-1">{result.authors}</p>
                            )}
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
                        
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-3">
                          {result.summary}
                        </p>

                        {result.topics && result.topics.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {result.topics.map((topic, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {topic.replace("Pillar ", "P")}
                              </Badge>
                            ))}
                          </div>
                        )}

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
          </>
        )}

        {searched && !answerResponse && (
          <Card className="mb-8 border-border/50">
            <CardContent className="p-6 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                Search failed. Please try again.
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-foreground mb-1">System Boundaries</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Answers are grounded only in curated library sources</li>
                  <li>Citations link claims to specific documents</li>
                  <li>No personalization or query storage</li>
                  <li>Full documents linked for deeper reading</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
