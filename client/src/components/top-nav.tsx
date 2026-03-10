import { Link, useLocation } from "wouter";
import { Building2, FlaskConical, User, Briefcase, Mail } from "lucide-react";

export function TopNav() {
  const [location] = useLocation();

  const isResearch = location.startsWith("/research");
  const isConsulting = !isResearch;

  return (
    <div style={{ backgroundColor: '#0F172A', borderTop: '1px solid rgba(255,255,255,0.1)' }} data-testid="top-nav">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-1 py-1.5 overflow-x-auto scrollbar-hide">
          <Link href="/">
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                isConsulting && location === "/"
                  ? "text-amber-400"
                  : "text-slate-400 hover:text-white"
              }`}
              data-testid="topnav-consulting"
            >
              <Building2 className="w-3.5 h-3.5" />
              Home
            </button>
          </Link>
          <Link href="/about">
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                location === "/about"
                  ? "text-amber-400"
                  : "text-slate-400 hover:text-white"
              }`}
              data-testid="topnav-about"
            >
              <User className="w-3.5 h-3.5" />
              About
            </button>
          </Link>
          <Link href="/research">
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                isResearch
                  ? "text-amber-400"
                  : "text-slate-400 hover:text-white"
              }`}
              data-testid="topnav-research"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              Research
            </button>
          </Link>
          <Link href="/contact">
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                location === "/contact"
                  ? "text-amber-400"
                  : "text-slate-400 hover:text-white"
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
