import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Search, Send, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { CMGFNav } from "@/components/cmgf-nav";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ExploreResult {
  section: string;
  excerpt: string;
  page: number;
  reference: string;
}

function ExploreDocumentTab() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ExploreResult[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/explore", { query });
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Explore failed:", error);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Explore the CMGF Research Corpus</h2>
        <p className="text-muted-foreground">
          This tool enables semantic exploration of the CMGF research paper and related materials. 
          Results are drawn exclusively from the published documents. Outputs are informational and non-authoritative.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="explore-query">Enter a question or topic to explore</Label>
          <Textarea
            id="explore-query"
            placeholder="e.g., Why does the framework prohibit predictive modeling?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[100px]"
            data-testid="textarea-explore-query"
          />
        </div>

        <Button onClick={handleSearch} disabled={loading || !query.trim()} data-testid="button-explore">
          <Search className="h-4 w-4 mr-2" />
          {loading ? "Exploring..." : "Explore Document"}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Results</h3>
          {results.map((r, idx) => (
            <Card key={idx} className="border-border/50" data-testid={`card-result-${idx}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">{r.section}</h4>
                    <p className="text-muted-foreground text-sm mb-2">{r.excerpt}</p>
                    <span className="text-xs text-muted-foreground/70">
                      Page {r.page} - {r.reference}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-foreground mb-1">Boundaries</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>No external knowledge</li>
                <li>No recommendations or decisions</li>
                <li>No personalization or learning</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Have a question or critique after reviewing the framework? 
        Use the <strong>"Submit Expert Commentary"</strong> tab to contribute.
      </p>
    </div>
  );
}

function ExpertCommentaryTab() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    type: "",
    category: "",
    message: "",
    name: "",
    organization: "",
    email: "",
    consent: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string | boolean) {
    setForm({ ...form, [field]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.type || !form.category || !form.message) {
      toast({
        title: "Required fields missing",
        description: "Please fill in submission type, category, and your commentary.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/commentary", form);
      const data = await response.json();
      setSubmissionId(data.id);
      setSubmitted(true);
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Thank you for your submission</h2>
          <p className="text-muted-foreground mb-4">
            Your submission ID is <strong className="text-foreground">{submissionId}</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            Submissions are reviewed by the author and are used to inform future research and refinement.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Expert Commentary Intake</h2>
        <p className="text-muted-foreground">
          This framework is presented as a conceptual reference architecture. 
          Submissions do not constitute endorsement or consensus. The AI system does not respond to or process submissions.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Submission Type *</Label>
          <Select onValueChange={(value) => update("type", value)} data-testid="select-type">
            <SelectTrigger id="type">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Question">Question</SelectItem>
              <SelectItem value="Comment">Comment</SelectItem>
              <SelectItem value="Concern / Risk">Concern / Risk</SelectItem>
              <SelectItem value="Alternative Proposal">Alternative Proposal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select onValueChange={(value) => update("category", value)} data-testid="select-category">
            <SelectTrigger id="category">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Governance & Boundaries">Governance & Boundaries</SelectItem>
              <SelectItem value="Ethics & Human-in-the-Loop">Ethics & Human-in-the-Loop</SelectItem>
              <SelectItem value="Feasibility & Implementation Reality">Feasibility & Implementation Reality</SelectItem>
              <SelectItem value="Institutional Adoption & Policy">Institutional Adoption & Policy</SelectItem>
              <SelectItem value="Service Member Experience">Service Member Experience</SelectItem>
              <SelectItem value="Data & Privacy">Data & Privacy</SelectItem>
              <SelectItem value="Evaluation & Evidence">Evaluation & Evidence</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Your considered question or commentary *</Label>
        <Textarea
          id="message"
          required
          rows={6}
          onChange={(e) => update("message", e.target.value)}
          className="min-h-[150px]"
          data-testid="textarea-message"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="name">Name (optional)</Label>
          <Input id="name" onChange={(e) => update("name", e.target.value)} data-testid="input-name" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="org">Organization / Affiliation (optional)</Label>
          <Input id="org" onChange={(e) => update("organization", e.target.value)} data-testid="input-org" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email (optional)</Label>
          <Input id="email" type="email" onChange={(e) => update("email", e.target.value)} data-testid="input-email" />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="consent"
          onCheckedChange={(checked) => update("consent", !!checked)}
          data-testid="checkbox-consent"
        />
        <Label htmlFor="consent" className="text-sm text-muted-foreground cursor-pointer">
          You may quote this submission (attribution optional) in future academic work.
        </Label>
      </div>

      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-amber-500">Privacy note:</strong> Do not include personal identifiers, 
            service member data, or sensitive operational details.
          </p>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading} data-testid="button-submit-commentary">
        <Send className="h-4 w-4 mr-2" />
        {loading ? "Submitting..." : "Submit Commentary"}
      </Button>
    </form>
  );
}

export default function Engagement() {
  return (
    <div className="min-h-screen bg-background">
      <CMGFNav />
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-6">
        <nav className="mb-8 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            Portfolio
          </Link>
          <ChevronRight className="inline h-4 w-4 mx-2 text-muted-foreground" />
          <Link href="/cmgf" className="text-muted-foreground hover:text-primary transition-colors">
            CMGF
          </Link>
          <ChevronRight className="inline h-4 w-4 mx-2 text-muted-foreground" />
          <span className="text-foreground">Interactive Engagement</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-3">Interactive Engagement</h1>
          <p className="text-muted-foreground max-w-2xl">
            Document-grounded exploration and structured expert reflection on a proposed governed AI reference architecture.
          </p>
        </header>

        <Tabs defaultValue="explore" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="explore" data-testid="tab-explore">Explore the Document</TabsTrigger>
            <TabsTrigger value="commentary" data-testid="tab-commentary">Submit Expert Commentary</TabsTrigger>
          </TabsList>
          
          <TabsContent value="explore">
            <Card>
              <CardContent className="p-6">
                <ExploreDocumentTab />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="commentary">
            <Card>
              <CardContent className="p-6">
                <ExpertCommentaryTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
