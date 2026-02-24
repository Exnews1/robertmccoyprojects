import { Link, useLocation } from "wouter";
import { Building2, FlaskConical } from "lucide-react";

export function TopNav() {
  const [location] = useLocation();

  const isResearch = location.startsWith("/research");
  const isConsulting = !isResearch;

  return (
    <div className="border-b border-border/30 bg-card/40" data-testid="top-nav">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-1 py-1.5">
          <Link href="/">
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                isConsulting
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              data-testid="topnav-consulting"
            >
              <Building2 className="w-3.5 h-3.5" />
              Consulting
            </button>
          </Link>
          <Link href="/research">
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                isResearch
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              data-testid="topnav-research"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              Research
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
