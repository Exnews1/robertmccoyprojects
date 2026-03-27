import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, ShieldCheck, Search, FileText, GraduationCap, AlertTriangle, ExternalLink, Database, Cpu, Building2, Scale } from "lucide-react";

const PROOF_POINTS = [
  { value: "797", label: "Peer-Reviewed Sources", detail: "Indexed in the CMGF research database" },
  { value: "4", label: "Live Governance Demos", detail: "Working prototypes, not slide decks" },
  { value: "6", label: "Published Briefs", detail: "CMGF Series 2026 learner track" },
  { value: "3", label: "Industry Case Studies", detail: "Enterprise KMS pipelines with human-in-the-loop AI" },
];

const REGULATORY_DRIVERS = [
  { label: "DOL TEN 07-25", desc: "AI Literacy Framework — mandatory for all ETA grantees", date: "Feb 2025", urgency: "Active Now", href: "https://www.dol.gov/agencies/eta/advisories/ten-07-25" },
  { label: "NIST AI RMF 1.0", desc: "Risk management framework for trustworthy AI systems", date: "Jan 2023", urgency: "Adopted", href: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10" },
  { label: "EO 14179", desc: "Federal policy on removing barriers to AI innovation with safeguards", date: "Jan 2025", urgency: "Active", href: "https://www.whitehouse.gov/presidential-actions/2025/12/eliminating-state-law-obstruction-of-national-artificial-intelligence-policy/" },
  { label: "EU AI Act", desc: "Risk-based classification with compliance deadlines approaching", date: "Aug 2024", urgency: "Phasing In", href: "https://artificialintelligenceact.eu/" },
];

const PERSPECTIVES = [
  {
    title: "DOL TEN 07-25: What Grant Holders Need to Know",
    summary: "The Department of Labor now requires AI literacy alignment for every ETA-funded program. Most organizations aren't ready. Here's what compliance actually looks like.",
    tag: "Federal Policy",
  },
  {
    title: "Shadow AI Is Your Biggest Governance Gap",
    summary: "Your teams are already using AI — in drafting, analysis, and decision-support. The question isn't whether to allow it. It's whether you can see it, audit it, and govern it.",
    tag: "Risk Assessment",
  },
  {
    title: "Why 'Responsible AI' Needs an Engineer, Not a Philosopher",
    summary: "Ethical AI frameworks are necessary but insufficient. Governance requires architecture — audit trails, constraint boundaries, and human-in-the-loop enforcement built into the system.",
    tag: "Governance Architecture",
  },
];

export default function ConsultingHome() {
  return (
    <div className="min-h-[70vh]">
      <section className="py-16 md:py-24 px-6" data-testid="section-hero">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-xs font-mono uppercase tracking-[3px] text-muted-foreground">AI Governance Consulting</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-serif" data-testid="heading-consulting">
            Governed AI Architecture for<br />High-Stakes Organizations
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed" data-testid="subheading-consulting">
            I help organizations build auditable AI governance frameworks — the policies, risk controls, and human-in-the-loop systems that survive federal scrutiny and earn stakeholder trust.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/services">
              <Button size="lg" className="gap-2" data-testid="button-services">
                See How I Can Help
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="gap-2" data-testid="button-contact-hero">
                Schedule a Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 border-t border-border/40" data-testid="section-why-now">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-mono uppercase tracking-[2px] text-amber-500">Why Now</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif">The Regulatory Landscape Is Moving</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Federal mandates, risk frameworks, and international regulation are creating compliance obligations that didn't exist 18 months ago.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REGULATORY_DRIVERS.map(r => (
              <a key={r.label} href={r.href} target="_blank" rel="noopener noreferrer" className="block group">
                <Card className="border-border bg-card group-hover:border-primary/40 group-hover:shadow-md transition-all cursor-pointer h-full" data-testid={`card-regulation-${r.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  <CardContent className="pt-6 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{r.label}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-sm" style={{ background: 'rgba(180,83,9,0.15)', color: '#B45309' }}>{r.urgency}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-mono text-muted-foreground/60">{r.date}</p>
                      <ExternalLink className="w-3 h-3 text-muted-foreground/40 group-hover:text-primary/60 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 border-t border-border/40 bg-card/30" data-testid="section-services-preview">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif">What I Do</h2>
            <p className="text-muted-foreground mt-2">Four core services designed for organizations that need governance — not just guidance.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Search, title: "AI Risk & Impact Assessment", desc: "Inventory AI usage, identify shadow AI, deliver a prioritized risk register." },
              { icon: FileText, title: "AI Policy & Procedure Drafting", desc: "Clear, actionable, auditable AI usage policies your teams can follow." },
              { icon: GraduationCap, title: "AI Literacy Training", desc: "DOL TEN 07-25 aligned workshops for workforce and leadership." },
              { icon: ShieldCheck, title: "Third-Party AI Governance Audit", desc: "Assess inherited AI risks from vendor tools and platforms." },
            ].map(s => (
              <Link key={s.title} href="/services">
                <Card className="border-border bg-card hover:border-primary/40 hover:shadow-md transition-all cursor-pointer h-full" data-testid={`card-preview-${s.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <CardContent className="pt-6 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <s.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{s.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
                      <span className="text-[10px] font-mono text-primary flex items-center gap-1 mt-2">Learn More <ArrowRight className="w-3 h-3" /></span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/services">
              <Button variant="outline" className="gap-2" data-testid="button-services-detail">
                Service Details & Outcomes
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 border-t border-border/40" data-testid="section-evidence">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif">Built on Evidence, Not Theory</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              My consulting practice is backed by a structured research portfolio — including working prototypes, peer-reviewed analysis, and enterprise case studies.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {PROOF_POINTS.map(p => (
              <div key={p.label} className="text-center p-4 rounded border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all" data-testid={`proof-${p.label.toLowerCase().replace(/\s+/g, '-')}`}>
                <p className="text-3xl font-bold text-foreground">{p.value}</p>
                <p className="text-xs font-medium text-foreground/80 mt-1">{p.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{p.detail}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="https://theaigovernanceguy.com" target="_blank" rel="noopener noreferrer" className="block">
              <Card className="border-border bg-card hover:border-primary/40 hover:shadow-md transition-all cursor-pointer h-full" data-testid="card-evidence-ten">
                <CardContent className="pt-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-foreground">DOL TEN 07-25</span>
                  </div>
                  <p className="text-xs text-muted-foreground">AI literacy compliance platform for ETA grantees — policy guidance, readiness assessments, and implementation roadmaps aligned to federal mandates.</p>
                  <span className="text-[10px] font-mono text-primary flex items-center gap-1 pt-1">theaigovernanceguy.com <ExternalLink className="w-3 h-3" /></span>
                </CardContent>
              </Card>
            </a>
            <Link href="/research/cmgf">
              <Card className="border-border bg-card hover:border-primary/40 hover:shadow-md transition-all cursor-pointer h-full" data-testid="card-evidence-cmgf">
                <CardContent className="pt-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-foreground">CMGF Research</span>
                  </div>
                  <p className="text-xs text-muted-foreground">A governance architecture for military career mobility — demonstrating how bounded AI, human-in-the-loop review, and institutional intelligence work in practice.</p>
                  <span className="text-[10px] font-mono text-primary flex items-center gap-1 pt-1">Explore Framework <ArrowRight className="w-3 h-3" /></span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/research/knowledge-systems">
              <Card className="border-border bg-card hover:border-primary/40 hover:shadow-md transition-all cursor-pointer h-full" data-testid="card-evidence-kms">
                <CardContent className="pt-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-foreground">Enterprise AI Case Studies</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Working AI-powered document pipelines with classification, human review gates, and audit trails — built for staffing, aviation, construction, and insurance.</p>
                  <span className="text-[10px] font-mono text-primary flex items-center gap-1 pt-1">View Case Studies <ArrowRight className="w-3 h-3" /></span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/research/research-portfolio">
              <Card className="border-border bg-card hover:border-primary/40 hover:shadow-md transition-all cursor-pointer h-full" data-testid="card-evidence-research">
                <CardContent className="pt-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-foreground">Research Portfolio</span>
                  </div>
                  <p className="text-xs text-muted-foreground">AI in education, workforce readiness, incarceration reform, and human capital systems — each backed by hundreds of peer-reviewed sources.</p>
                  <span className="text-[10px] font-mono text-primary flex items-center gap-1 pt-1">Browse Research <ArrowRight className="w-3 h-3" /></span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 border-t border-border/40 bg-card/30" data-testid="section-perspectives">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif">Perspectives</h2>
            <p className="text-muted-foreground mt-2">Current thinking on AI governance, compliance, and institutional readiness.</p>
          </div>
          <div className="space-y-4">
            {PERSPECTIVES.map(p => (
              <div key={p.title} className="p-5 rounded border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all" data-testid={`perspective-${p.tag.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm" style={{ background: 'rgba(180,83,9,0.1)', color: '#B45309' }}>{p.tag}</span>
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 border-t border-border/40" data-testid="section-cross-link">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <Building2 className="w-6 h-6 text-primary mx-auto" />
          <h2 className="text-xl font-bold text-foreground font-serif">DOL TEN 07-25 Compliance</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            For dedicated consulting on the Department of Labor's AI Literacy Framework and WIOA grant alignment, visit the focused practice site.
          </p>
          <a href="https://theaigovernanceguy.com" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="gap-2 mt-2" data-testid="button-tagg-crosslink">
              theaigovernanceguy.com
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </a>
        </div>
      </section>

      <section className="py-12 px-6 border-t border-border/40 bg-card/30" data-testid="section-cta-final">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold text-foreground font-serif">Ready to Talk?</h2>
          <p className="text-muted-foreground">
            Every engagement begins with a 30-minute introductory call. No pitch deck — just a conversation about your organization's specific AI governance challenges.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2 mt-4" data-testid="button-cta-contact">
              Schedule a Consultation
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
