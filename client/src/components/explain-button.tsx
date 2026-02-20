import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Loader2, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ExplainButtonProps {
  topic: string;
  contextText?: string;
  variant?: "ghost" | "outline" | "default";
  size?: "sm" | "default" | "icon";
  className?: string;
}

interface ExplainResponse {
  answer: string | null;
  message?: string;
  sources: { id: string; title: string }[];
}

export function ExplainButton({
  topic,
  contextText,
  variant = "ghost",
  size = "sm",
  className = "",
}: ExplainButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ExplainResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleExplain() {
    setOpen(true);
    if (response) return;

    setLoading(true);
    setError(null);

    const prompt = contextText
      ? `Explain the following concept in the context of the CMGF framework: "${topic}". Additional context: ${contextText}`
      : `Explain the following concept in the context of the CMGF framework: "${topic}"`;

    try {
      const res = await apiRequest("POST", "/api/answer", { query: prompt });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError("Unable to generate explanation. Please try again.");
    }
    setLoading(false);
  }

  function handleOpenChange(v: boolean) {
    setOpen(v);
    if (!v) {
      setResponse(null);
      setError(null);
    }
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`gap-1.5 ${className}`}
        onClick={handleExplain}
        data-testid={`button-explain-${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30)}`}
      >
        <Lightbulb className="w-3.5 h-3.5" />
        <span className="text-xs">Explain This</span>
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="w-5 h-5 text-primary" />
              {topic}
            </DialogTitle>
          </DialogHeader>

          {loading && (
            <div className="flex items-center justify-center py-12" data-testid="explain-loading">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <span className="ml-3 text-sm text-muted-foreground">Generating explanation from research sources...</span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 py-6 text-sm" data-testid="explain-error">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-muted-foreground">{error}</p>
            </div>
          )}

          {response && !loading && (
            <div className="space-y-4" data-testid="explain-response">
              {response.answer ? (
                <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {response.answer}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {response.message || "No explanation available for this topic."}
                </p>
              )}

              {response.sources && response.sources.length > 0 && (
                <div className="pt-3 border-t border-border">
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Sources</p>
                  <div className="space-y-1">
                    {response.sources.map((s) => (
                      <div key={s.id} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-[9px] font-mono flex-shrink-0 mt-0.5">
                          {s.id}
                        </Badge>
                        <span>{s.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-border">
                <p className="text-[10px] text-muted-foreground">
                  Grounded in CMGF research library ({new Date().getFullYear()}). Document-sourced only — no generative interpretation.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
