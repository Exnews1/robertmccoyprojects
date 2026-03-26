import { useState, useEffect, useCallback, useRef } from "react";
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
    <div className={`flex items-center gap-3 p-4 rounded border bg-gradient-to-br transition-all duration-200 hover:shadow-sm ${color}`}>
      <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-destructive" />
      </div>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </div>
  );
}

function PrincipleCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-4 rounded border border-border bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/40 transition-all duration-200 hover:shadow-sm">
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
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif">{title}</h2>
          {badges && (
            <div className="flex flex-wrap gap-2 mt-1.5">
              {badges.map(b => <Badge key={b} variant="outline" className="text-xs font-mono">{b}</Badge>)}
            </div>
          )}
        </div>
      </div>
      <div className="space-y-3 mb-6">
        {points.map((p, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded border border-transparent hover:border-border hover:bg-card/50 transition-all duration-200">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <p className="text-muted-foreground">{p}</p>
          </div>
        ))}
      </div>
      {link && (
        external ? (
          <Button variant="outline" size="sm" className="border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all" asChild data-testid={`button-slide-link-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            <a href={link} target="_blank" rel="noopener noreferrer">
              {linkLabel || "Launch Demo"} <ExternalLink className="h-3 w-3 ml-2" />
            </a>
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all" asChild data-testid={`button-slide-link-${title.toLowerCase().replace(/\s+/g, '-')}`}>
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
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-accent/[0.04] pointer-events-none" />
        <SlideWrapper>
          <div className="text-center relative">
            <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-8 ring-1 ring-primary/20">
              <Presentation className="h-10 w-10 text-primary" />
            </div>
            <span className="text-xs font-mono uppercase tracking-[3px] text-muted-foreground mb-4 block">AI Governance Research</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground font-serif mb-4 leading-tight">
              Career Mobility Governance Framework
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-2 font-serif">Tools Overview</p>
            <div className="w-24 h-1 bg-primary mx-auto my-8 rounded-full" />
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-base md:text-lg">
              A governance-first AI architecture for military-to-civilian career transitions.
              Each tool enforces bounded constraints — AI passes verified facts only, never recommendations.
            </p>
            <div className="flex items-center justify-center gap-3 mt-10">
              <Badge variant="outline" className="font-mono text-xs px-3 py-1">NIST AI RMF 1.0</Badge>
              <Badge variant="outline" className="font-mono text-xs px-3 py-1">EO 14179</Badge>
              <Badge variant="outline" className="font-mono text-xs px-3 py-1">DOL TEN 07-25</Badge>
            </div>
          </div>
        </SlideWrapper>
      </>
    )
  },
  {
    title: "Framework Overview",
    content: (
      <SlideWrapper>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif mb-2">Framework Constraints & Principles</h2>
        <div className="w-16 h-1 bg-primary rounded-full mb-8" />
        <div className="mb-8">
          <h3 className="text-xs font-mono uppercase tracking-[2px] text-muted-foreground mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
            Three Non-Negotiable Constraints
          </h3>
          <div className="grid gap-3 md:grid-cols-3">
            <ConstraintCard icon={Shield} label="No predictive outcome modeling" color="border-destructive/30 from-destructive/5 to-transparent hover:border-destructive/50" />
            <ConstraintCard icon={Lock} label="No individual risk scoring" color="border-destructive/30 from-destructive/5 to-transparent hover:border-destructive/50" />
            <ConstraintCard icon={Users} label="No automated approvals" color="border-destructive/30 from-destructive/5 to-transparent hover:border-destructive/50" />
          </div>
        </div>
        <div>
          <h3 className="text-xs font-mono uppercase tracking-[2px] text-muted-foreground mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            Four Design Principles
          </h3>
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
        <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif mb-2">Supporting Architecture</h2>
        <div className="w-16 h-1 bg-primary rounded-full mb-8" />
        <div className="mb-8">
          <h3 className="text-xs font-mono uppercase tracking-[2px] text-muted-foreground mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            CMGF Series 2026 — Six-Brief Framework
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { num: "CMGF-01", title: "Governance Architecture" },
              { num: "CMGF-02", title: "Policy Alignment" },
              { num: "CMGF-03", title: "Data Flow" },
              { num: "CMGF-04", title: "Sandbox Design" },
              { num: "CMGF-05", title: "Credential Infrastructure" },
              { num: "CMGF-06", title: "Authority Landscape" },
            ].map(b => (
              <div key={b.num} className="flex items-center gap-3 p-4 rounded border border-border bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/40 transition-all duration-200 hover:shadow-sm">
                <Badge variant="outline" className="text-xs font-mono px-2.5 py-0.5">{b.num}</Badge>
                <span className="text-sm font-medium text-foreground">{b.title}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-mono uppercase tracking-[2px] text-muted-foreground mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            Compliance Alignment
          </h3>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="p-4 rounded border border-border bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/40 transition-all duration-200 text-center hover:shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">NIST AI RMF 1.0</p>
              <p className="text-xs text-muted-foreground mt-1">Risk management baseline</p>
            </div>
            <div className="p-4 rounded border border-border bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/40 transition-all duration-200 text-center hover:shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <FileCheck className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">EO 14179</p>
              <p className="text-xs text-muted-foreground mt-1">Federal AI policy</p>
            </div>
            <div className="p-4 rounded border border-border bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/40 transition-all duration-200 text-center hover:shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">DOL TEN 07-25</p>
              <p className="text-xs text-muted-foreground mt-1">AI literacy mandate</p>
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
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Database className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif">Enterprise KMS Case Studies</h2>
            <p className="text-xs font-mono uppercase tracking-[2px] text-muted-foreground mt-1">Production AI Pipelines</p>
          </div>
        </div>
        <div className="w-16 h-1 bg-primary rounded-full mb-6" />
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <div className="p-5 rounded border border-border bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/40 transition-all duration-200 hover:shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
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
          <div className="p-5 rounded border border-border bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/40 transition-all duration-200 hover:shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Scale className="h-5 w-5 text-primary" />
              </div>
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
        <Button variant="outline" size="sm" className="border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all" asChild data-testid="button-slide-link-kms">
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
          <span className="text-xs font-mono uppercase tracking-[3px] text-muted-foreground mb-3 block">Key Insights</span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif mb-4">Key Takeaways</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
        </div>
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="text-center p-6 rounded border border-border bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/40 transition-all duration-200 hover:shadow-sm">
            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Cpu className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-2">AI as Infrastructure</h3>
            <p className="text-sm text-muted-foreground">Never authority. AI surfaces verified facts — humans make decisions.</p>
          </div>
          <div className="text-center p-6 rounded border border-border bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/40 transition-all duration-200 hover:shadow-sm">
            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Human Decision Authority</h3>
            <p className="text-sm text-muted-foreground">Full human judgment preserved at every decision point in the pipeline.</p>
          </div>
          <div className="text-center p-6 rounded border border-border bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/40 transition-all duration-200 hover:shadow-sm">
            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Eye className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Institutional Learning</h3>
            <p className="text-sm text-muted-foreground">De-identified aggregate intelligence without surveillance or PII exposure.</p>
          </div>
        </div>
        <div className="text-center">
          <div className="w-12 h-0.5 bg-border mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Robert McCoy — AI Governance Consulting</p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" size="sm" className="border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all" asChild>
              <Link href="/contact">Contact <ArrowRight className="h-3 w-3 ml-2" /></Link>
            </Button>
            <Button variant="outline" size="sm" className="border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all" asChild>
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
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const total = slides.length;

  const transitionRef = useRef<ReturnType<typeof setTimeout>>();

  const goTo = useCallback((index: number) => {
    if (index === current || isTransitioning) return;
    if (transitionRef.current) clearTimeout(transitionRef.current);
    setDirection(index > current ? 'next' : 'prev');
    setIsTransitioning(true);
    transitionRef.current = setTimeout(() => {
      setCurrent(index);
      transitionRef.current = setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  }, [current, isTransitioning]);

  useEffect(() => {
    return () => { if (transitionRef.current) clearTimeout(transitionRef.current); };
  }, []);

  const next = useCallback(() => {
    if (current < total - 1) goTo(current + 1);
  }, [current, total, goTo]);

  const prev = useCallback(() => {
    if (current > 0) goTo(current - 1);
  }, [current, goTo]);

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

        <div className="border border-border rounded-lg overflow-hidden shadow-lg border-t-4 border-t-accent" data-testid="presentation-container">
          <div className="border-b border-border px-5 py-3 flex items-center justify-between bg-card">
            <div className="flex items-center gap-2">
              <Presentation className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{slides[current].title}</span>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono px-2 py-0.5">{current + 1} / {total}</Badge>
          </div>

          <div className="relative bg-gradient-to-br from-background via-background to-primary/[0.02] overflow-hidden">
            <div
              className="transition-all duration-300 ease-in-out"
              style={{
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning
                  ? `translateX(${direction === 'next' ? '20px' : '-20px'})`
                  : 'translateX(0)',
              }}
            >
              {slides[current].content}
            </div>
          </div>

          <div className="border-t border-border px-5 py-3 flex items-center justify-between bg-card">
            <Button
              variant="outline"
              size="sm"
              onClick={prev}
              disabled={current === 0}
              className="border-primary/20 hover:border-primary/50 hover:bg-primary/5 disabled:opacity-40 transition-all"
              data-testid="button-prev-slide"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>

            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-6 h-2.5 bg-primary"
                      : "w-2.5 h-2.5 bg-muted-foreground/20 hover:bg-primary/40"
                  }`}
                  data-testid={`slide-dot-${i}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={next}
              disabled={current === total - 1}
              className="border-primary/20 hover:border-primary/50 hover:bg-primary/5 disabled:opacity-40 transition-all"
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
