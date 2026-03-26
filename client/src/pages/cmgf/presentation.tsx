import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft, ChevronRight, Shield, Cpu, Users, Search,
  Zap, PlayCircle, Compass, Database, Building2, ArrowRight,
  ExternalLink, Presentation, BookOpen, Scale, Lock, Eye,
  FileCheck, BarChart3, Layers
} from "lucide-react";
import { CMGFNav } from "@/components/cmgf-nav";

interface Slide {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

function SlideWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center min-h-[520px] md:min-h-[560px] p-6 md:p-10">
      <div className="w-full max-w-4xl">{children}</div>
    </div>
  );
}

function ConstraintCard({ icon: Icon, label, color }: { icon: any; label: string; color: string }) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded border ${color}`}>
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span className="text-sm font-medium text-foreground">{label}</span>
    </div>
  );
}

function PrincipleCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-4 rounded border border-border bg-card">
      <h4 className="text-sm font-bold text-foreground mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}

function ToolSlide({ icon: Icon, title, badges, points, link, linkLabel, external }: {
  icon: any; title: string; badges?: string[]; points: string[];
  link?: string; linkLabel?: string; external?: boolean;
}) {
  return (
    <SlideWrapper>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif">{title}</h2>
          {badges && (
            <div className="flex flex-wrap gap-2 mt-1">
              {badges.map(b => <Badge key={b} variant="outline" className="text-xs">{b}</Badge>)}
            </div>
          )}
        </div>
      </div>
      <div className="space-y-3 mb-6">
        {points.map((p, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <p className="text-muted-foreground">{p}</p>
          </div>
        ))}
      </div>
      {link && (
        external ? (
          <Button variant="outline" size="sm" asChild data-testid={`button-slide-link-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            <a href={link} target="_blank" rel="noopener noreferrer">
              {linkLabel || "Launch Demo"} <ExternalLink className="h-3 w-3 ml-2" />
            </a>
          </Button>
        ) : (
          <Button variant="outline" size="sm" asChild data-testid={`button-slide-link-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            <Link href={link}>
              {linkLabel || "View Demo"} <ArrowRight className="h-3 w-3 ml-2" />
            </Link>
          </Button>
        )
      )}
    </SlideWrapper>
  );
}

const slides: Slide[] = [
  {
    title: "CMGF Tools Overview",
    content: (
      <SlideWrapper>
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Presentation className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground font-serif mb-4">
            Career Mobility Governance Framework
          </h1>
          <p className="text-xl text-muted-foreground mb-2">Tools Overview</p>
          <div className="w-16 h-0.5 bg-primary mx-auto my-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A governance-first AI architecture for military-to-civilian career transitions.
            Each tool enforces bounded constraints — AI passes verified facts only, never recommendations.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Badge variant="outline">NIST AI RMF 1.0</Badge>
            <Badge variant="outline">EO 14179</Badge>
            <Badge variant="outline">DOL TEN 07-25</Badge>
          </div>
        </div>
      </SlideWrapper>
    )
  },
  {
    title: "Framework Overview",
    content: (
      <SlideWrapper>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif mb-6">Framework Constraints & Principles</h2>
        <div className="mb-8">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Three Non-Negotiable Constraints</h3>
          <div className="grid gap-3 md:grid-cols-3">
            <ConstraintCard icon={Shield} label="No predictive outcome modeling" color="border-red-500/30 bg-red-500/5" />
            <ConstraintCard icon={Lock} label="No individual risk scoring" color="border-red-500/30 bg-red-500/5" />
            <ConstraintCard icon={Users} label="No automated approvals" color="border-red-500/30 bg-red-500/5" />
          </div>
        </div>
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Four Design Principles</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <PrincipleCard title="Governance is Architecture" desc="System design enforces ethical constraints" />
            <PrincipleCard title="AI as Infrastructure" desc="Never authority, always accountable" />
            <PrincipleCard title="Human Judgment Preserved" desc="Decision authority remains with people" />
            <PrincipleCard title="Transparency Over Optimization" desc="Explainability before efficiency" />
          </div>
        </div>
      </SlideWrapper>
    )
  },
  {
    title: "Bridge Demo",
    content: (
      <ToolSlide
        icon={FileCheck}
        title="Bridge Demo"
        badges={["SM → CMD → ESO → ISR", "AR 621-5"]}
        points={[
          "End-to-end career transition pipeline demonstrating dual data flow: individual advisory and institutional intelligence.",
          "Three-persona walkthrough: SGT Maria T. Chen (SM), CPT Denise M. Flores (CMD), James R. Okafor (ESO).",
          "Commander gate enforces AR 621-5 — no request advances without commander decision.",
          "ISR column aggregates de-identified institutional signals. Zero PII crosses the firewall.",
          "Stage sequence: Sandbox → BLOCKED (awaiting CMD) → CMD Decision → ESO Queue → Final Decision."
        ]}
        link="/research/bridge-demo"
        linkLabel="View Bridge Demo"
      />
    )
  },
  {
    title: "Career Path Advisor",
    content: (
      <ToolSlide
        icon={Compass}
        title="Career Path Feasibility Advisor"
        badges={["Deterministic", "No AI Recommendation"]}
        points={[
          "Constraint-binding pathway feasibility engine — accepts MOS, target career, education level, time remaining, and funding source.",
          "Education Sandbox: evaluates school eligibility against DoD MOU list. Pipeline enforces TA/CA funding only — VA benefits and self-pay are outside scope.",
          "TAP Sandbox: GREEN / YELLOW / RED readiness system mapping MOS transferability to civilian career fields.",
          "Produces informational planning signals (scored risk index) — never recommendations.",
          "CMGF advisory notices displayed throughout confirming non-predictive, non-authoritative outputs."
        ]}
        link="/research/career-advisor"
        linkLabel="View Career Advisor"
      />
    )
  },
  {
    title: "Signal Flow Animation",
    content: (
      <ToolSlide
        icon={PlayCircle}
        title="Signal Flow Animation"
        badges={["Cinematic", "HTML5 Canvas"]}
        points={[
          "90-second visualization of CMGF signal architecture across 5 acts.",
          "Act 1 — The Individual: Single service member at 0200 starting a career query.",
          "Act 2 — The Installation: Hundreds of SMs generating concurrent signals.",
          "Act 3 — The Network: 8 military bases with cross-installation data flow.",
          "Act 4 — The Pentagon: 180+ installations, 2M+ service members, zero PII.",
          "Act 5 — Finale: The full signal architecture resolves into institutional intelligence."
        ]}
        link="/research/signal-flow"
        linkLabel="Watch Animation"
      />
    )
  },
  {
    title: "Reference Explorer",
    content: (
      <ToolSlide
        icon={Search}
        title="Reference Explorer"
        badges={["RAG", "796 Sources", "GPT-4o"]}
        points={[
          "Semantic search over curated military career mobility research library using OpenAI embeddings (text-embedding-3-small).",
          "Document-grounded answers synthesized by GPT-4o with inline citations linking claims to specific sources.",
          "No generative interpretation beyond source material — answers bounded by library contents.",
          "No personalization or query storage. Full documents linked for deeper reading.",
          "System Boundaries disclosure visible to every user, reinforcing governance constraints."
        ]}
        link="/research/cmgf/explorer"
        linkLabel="View Explorer"
      />
    )
  },
  {
    title: "Credential Sequencing Engine",
    content: (
      <ToolSlide
        icon={Zap}
        title="Credential Sequencing Engine"
        badges={["Rule-Based", "Audit Trail"]}
        points={[
          "Binding layer demonstration: transparent, rule-based credential sequencing with data provenance.",
          "Accepts career goal, existing certifications, experience level, and degree as inputs.",
          "Evaluates pathway feasibility through deterministic binding rules — no ML models.",
          "Full audit trail output showing every rule evaluation and decision point.",
          "Demonstrates that credential alignment can be governed without predictive modeling."
        ]}
        link="https://certdemo.robertmccoyprojects.com"
        linkLabel="Launch Demo"
        external
      />
    )
  },
  {
    title: "Supporting Architecture",
    content: (
      <SlideWrapper>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif mb-6">Supporting Architecture</h2>
        <div className="mb-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">CMGF Series 2026 — Six-Brief Framework</h3>
          <div className="grid gap-2 md:grid-cols-2">
            {[
              { num: "CMGF-01", title: "Governance Architecture" },
              { num: "CMGF-02", title: "Policy Alignment" },
              { num: "CMGF-03", title: "Data Flow" },
              { num: "CMGF-04", title: "Sandbox Design" },
              { num: "CMGF-05", title: "Credential Infrastructure" },
              { num: "CMGF-06", title: "Authority Landscape" },
            ].map(b => (
              <div key={b.num} className="flex items-center gap-3 p-3 rounded border border-border bg-card">
                <Badge variant="outline" className="text-xs font-mono">{b.num}</Badge>
                <span className="text-sm text-foreground">{b.title}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Compliance Alignment</h3>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="p-3 rounded border border-border bg-card text-center">
              <p className="text-sm font-medium text-foreground">NIST AI RMF 1.0</p>
              <p className="text-xs text-muted-foreground">Risk management baseline</p>
            </div>
            <div className="p-3 rounded border border-border bg-card text-center">
              <p className="text-sm font-medium text-foreground">EO 14179</p>
              <p className="text-xs text-muted-foreground">Federal AI policy</p>
            </div>
            <div className="p-3 rounded border border-border bg-card text-center">
              <p className="text-sm font-medium text-foreground">DOL TEN 07-25</p>
              <p className="text-xs text-muted-foreground">AI literacy mandate</p>
            </div>
          </div>
        </div>
      </SlideWrapper>
    )
  },
  {
    title: "Enterprise KMS Case Studies",
    content: (
      <SlideWrapper>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Database className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif">Enterprise KMS Case Studies</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <div className="p-5 rounded border border-border bg-card">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground">Meridian Industrial Group</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">AI/Human-in-the-loop document ingestion pipeline</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">GPT-4o classification with human staging review</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Shared repository portal with search and filtering</p>
              </div>
            </div>
          </div>
          <div className="p-5 rounded border border-border bg-card">
            <div className="flex items-center gap-2 mb-3">
              <Scale className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground">Insurance Brokerage</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Full P&C document management system</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">PDF classification via GPT-4o with operator auth</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Hierarchical KMS portal for approved documents</p>
              </div>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild data-testid="button-slide-link-kms">
          <Link href="/research/knowledge-systems">
            View Case Studies <ArrowRight className="h-3 w-3 ml-2" />
          </Link>
        </Button>
      </SlideWrapper>
    )
  },
  {
    title: "Summary",
    content: (
      <SlideWrapper>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif mb-4">Key Takeaways</h2>
          <div className="w-16 h-0.5 bg-primary mx-auto" />
        </div>
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="text-center p-5 rounded border border-border bg-card">
            <Cpu className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-bold text-foreground mb-1">AI as Infrastructure</h3>
            <p className="text-sm text-muted-foreground">Never authority. AI surfaces verified facts — humans make decisions.</p>
          </div>
          <div className="text-center p-5 rounded border border-border bg-card">
            <Users className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-bold text-foreground mb-1">Human Decision Authority</h3>
            <p className="text-sm text-muted-foreground">Full human judgment preserved at every decision point in the pipeline.</p>
          </div>
          <div className="text-center p-5 rounded border border-border bg-card">
            <Eye className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-bold text-foreground mb-1">Institutional Learning</h3>
            <p className="text-sm text-muted-foreground">De-identified aggregate intelligence without surveillance or PII exposure.</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Robert McCoy — AI Governance Consulting</p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/contact">Contact <ArrowRight className="h-3 w-3 ml-2" /></Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://theaigovernanceguy.com" target="_blank" rel="noopener noreferrer">
                theaigovernanceguy.com <ExternalLink className="h-3 w-3 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </SlideWrapper>
    )
  }
];

export default function CMGFPresentation() {
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  const next = useCallback(() => setCurrent(c => Math.min(c + 1, total - 1)), [total]);
  const prev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  return (
    <div className="min-h-screen bg-background">
      <CMGFNav />
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-4">
        <nav className="mb-4 text-sm">
          <Link href="/research" className="text-muted-foreground hover:text-primary transition-colors">Research</Link>
          <ChevronRight className="inline h-4 w-4 mx-2 text-muted-foreground" />
          <Link href="/research/cmgf" className="text-muted-foreground hover:text-primary transition-colors">CMGF</Link>
          <ChevronRight className="inline h-4 w-4 mx-2 text-muted-foreground" />
          <span className="text-foreground">Presentation</span>
        </nav>

        <div className="border border-border rounded-lg bg-card overflow-hidden" data-testid="presentation-container">
          <div className="border-b border-border px-4 py-2 flex items-center justify-between bg-muted/30">
            <span className="text-xs font-mono text-muted-foreground">{slides[current].title}</span>
            <span className="text-xs font-mono text-muted-foreground">{current + 1} / {total}</span>
          </div>

          <div className="relative">
            {slides[current].content}
          </div>

          <div className="border-t border-border px-4 py-3 flex items-center justify-between bg-muted/30">
            <Button
              variant="ghost"
              size="sm"
              onClick={prev}
              disabled={current === 0}
              data-testid="button-prev-slide"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>

            <div className="flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === current ? "bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  data-testid={`slide-dot-${i}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={next}
              disabled={current === total - 1}
              data-testid="button-next-slide"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-3">
          Use arrow keys or click to navigate
        </p>
      </div>
    </div>
  );
}
