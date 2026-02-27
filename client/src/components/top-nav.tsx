import { Link, useLocation } from "wouter";
import { Building2, FlaskConical, User, Briefcase, Mail } from "lucide-react";

export function TopNav() {
  const [location] = useLocation();

  const isResearch = location.startsWith("/research");
  const isConsulting = !isResearch;

  return (
    <div className="border-b border-border/30 bg-card/40" data-testid="top-nav">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-1 py-1.5 overflow-x-auto scrollbar-hide">
          <Link href="/">
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                isConsulting && location === "/"
                  ? "bg-primary/10 text-primary"
                  : isConsulting
                  ? "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              data-testid="topnav-consulting"
            >
              <Building2 className="w-3.5 h-3.5" />
              Home
            </button>
          </Link>
          <Link href="/about">
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                location === "/about"
                  ? "bg-primary/10 text-primary"
                  : isConsulting
                  ? "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              data-testid="topnav-about"
            >
              <User className="w-3.5 h-3.5" />
              About
            </button>
          </Link>
          <Link href="/services">
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                location === "/services"
                  ? "bg-primary/10 text-primary"
                  : isConsulting
                  ? "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              data-testid="topnav-services"
            >
              <Briefcase className="w-3.5 h-3.5" />
              Services
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
          <Link href="/contact">
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                location === "/contact"
                  ? "bg-primary/10 text-primary"
                  : isConsulting
                  ? "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              data-testid="topnav-contact"
            >
              <Mail className="w-3.5 h-3.5" />
              Contact
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
