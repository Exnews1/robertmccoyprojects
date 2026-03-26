import React from 'react';
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
  { label: "DOL TEN 07-25", desc: "AI Literacy Framework — mandatory for all ETA grantees", date: "Feb 2025", urgency: "Active Now", href: "#" },
  { label: "NIST AI RMF 1.0", desc: "Risk management framework for trustworthy AI systems", date: "Jan 2023", urgency: "Adopted", href: "#" },
  { label: "EO 14179", desc: "Federal policy on removing barriers to AI innovation with safeguards", date: "Jan 2025", urgency: "Active", href: "#" },
  { label: "EU AI Act", desc: "Risk-based classification with compliance deadlines approaching", date: "Aug 2024", urgency: "Phasing In", href: "#" },
];

const SERVICES = [
  { icon: Search, title: "AI Risk & Impact Assessment", summary: "Inventory AI usage, identify shadow AI, deliver a prioritized risk register.", desc: "A comprehensive audit of your current AI footprint. We evaluate existing systems against emerging frameworks like NIST AI RMF, identify unmanaged 'shadow AI' usage among staff, and deliver a prioritized risk register to guide your compliance roadmap." },
  { icon: FileText, title: "AI Policy & Procedure Drafting", summary: "Clear, actionable, auditable AI usage policies your teams can follow.", desc: "Move beyond vague 'ethical AI' statements. We draft concrete, role-specific policies and standard operating procedures (SOPs) that give your teams clear boundaries for acceptable AI usage, complete with audit trail requirements." },
  { icon: GraduationCap, title: "AI Literacy Training", summary: "DOL TEN 07-25 aligned workshops for workforce and leadership.", desc: "Structured training programs designed to meet the rigorous AI literacy requirements of DOL TEN 07-25. We provide tailored curriculums for leadership, technical staff, and general workforce to ensure organization-wide competency." },
  { icon: ShieldCheck, title: "Third-Party AI Governance Audit", summary: "Assess inherited AI risks from vendor tools and platforms.", desc: "Your vendors are introducing AI into your stack. We assess your third-party platforms to identify inherited AI risks, evaluate vendor data policies, and ensure their governance standards align with your organizational requirements." },
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

export default function EvidenceForward() {
  return (
    <div className="min-h-screen bg-[#0a1628] text-slate-100 font-['Inter']">
      {/* 1. Hero Section */}
      <section className="py-20 md:py-32 px-6 relative overflow-hidden bg-gradient-to-b from-[#0a1628] to-[#0f1d35]">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.apply/noise.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[#d4a843]" />
            <span className="text-xs font-mono uppercase tracking-[3px] text-slate-300">AI Governance Consulting</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white font-['Merriweather'] leading-tight">
            Governed AI Architecture for<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a843] to-[#b8860b]">High-Stakes Organizations</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            I help organizations build auditable AI governance frameworks — the policies, risk controls, and human-in-the-loop systems that survive federal scrutiny and earn stakeholder trust.
          </p>

          {/* Embedded Proof Strip */}
          <div className="flex flex-wrap justify-center gap-4 py-8 border-y border-white/10 mt-8 mb-8 bg-white/5 backdrop-blur-sm rounded-xl">
            {PROOF_POINTS.map((p, idx) => (
              <div key={idx} className="flex items-center gap-3 px-4 py-2">
                <span className="text-2xl font-bold text-[#d4a843]">{p.value}</span>
                <span className="text-sm font-medium text-slate-300 uppercase tracking-wider">{p.label}</span>
                {idx < PROOF_POINTS.length - 1 && <div className="hidden md:block w-px h-8 bg-white/20 ml-4"></div>}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="gap-2 bg-[#b8860b] hover:bg-[#d4a843] text-[#0a1628] font-semibold border-none text-base px-8 h-14">
              See How I Can Help
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2 border-[#b8860b] text-[#d4a843] hover:bg-[#b8860b]/10 bg-transparent text-base px-8 h-14">
              Schedule a Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Why Now */}
      <section className="py-20 px-6 bg-[#0f1d35]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-[#d4a843]" />
              <span className="text-xs font-mono uppercase tracking-[2px] text-[#d4a843]">Why Now</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-['Merriweather']">The Regulatory Landscape Is Moving</h2>
            <p className="text-slate-400 mt-4 max-w-2xl text-lg">
              Federal mandates, risk frameworks, and international regulation are creating compliance obligations that didn't exist 18 months ago.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {REGULATORY_DRIVERS.map(r => (
              <a key={r.label} href={r.href} className="block group">
                <Card className="border-white/10 bg-[#0a1628] group-hover:border-[#b8860b]/50 group-hover:bg-white/5 transition-all h-full rounded-none">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold text-white group-hover:text-[#d4a843] transition-colors">{r.label}</span>
                      <span className="text-[10px] font-mono px-2 py-1 rounded bg-[#b8860b]/20 text-[#d4a843] border border-[#b8860b]/30">{r.urgency}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed flex-grow">{r.desc}</p>
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                      <p className="text-[11px] font-mono text-slate-500">{r.date}</p>
                      <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-[#d4a843] transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Services with Hover Reveal */}
      <section className="py-20 px-6 bg-[#0a1628]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-['Merriweather']">What I Do</h2>
            <p className="text-slate-400 mt-4 max-w-2xl text-lg">Four core services designed for organizations that need governance — not just guidance.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map(s => (
              <div key={s.title} className="group relative border border-white/10 bg-[#0f1d35] hover:border-[#b8860b]/50 transition-all cursor-pointer h-[240px] overflow-hidden">
                <div className="absolute inset-0 p-8 flex flex-col justify-center transition-transform duration-500 ease-in-out group-hover:-translate-y-full">
                  <div className="w-12 h-12 rounded bg-[#b8860b]/10 flex items-center justify-center mb-6">
                    <s.icon className="w-6 h-6 text-[#d4a843]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-['Merriweather']">{s.title}</h3>
                  <p className="text-slate-300">{s.summary}</p>
                </div>
                
                <div className="absolute inset-0 p-8 bg-[#0a1628]/95 backdrop-blur flex flex-col justify-center translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0">
                  <h3 className="text-xl font-bold text-[#d4a843] mb-3 font-['Merriweather']">{s.title}</h3>
                  <p className="text-sm text-slate-200 leading-relaxed mb-6">{s.desc}</p>
                  <span className="text-xs font-mono text-[#d4a843] flex items-center gap-2 mt-auto">
                    View Service Details <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Evidence (Refocused) */}
      <section className="py-24 px-6 bg-[#0f1d35]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-['Merriweather']">Built on Evidence, Not Theory</h2>
            <p className="text-slate-400 mt-4 max-w-2xl text-lg">
              My consulting practice is backed by a structured research portfolio — including working prototypes, peer-reviewed analysis, and enterprise case studies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <button className="text-left group outline-none">
              <Card className="border-white/10 bg-[#0a1628] group-hover:border-[#b8860b]/50 group-hover:-translate-y-1 transition-all h-full rounded-none">
                <CardContent className="p-8 space-y-4">
                  <div className="w-14 h-14 bg-[#b8860b]/10 flex items-center justify-center mb-4">
                    <Scale className="w-7 h-7 text-[#d4a843]" />
                  </div>
                  <h3 className="text-xl font-bold text-white font-['Merriweather']">CMGF Research</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    A governance architecture for military career mobility — demonstrating how bounded AI, human-in-the-loop review, and institutional intelligence work in practice.
                  </p>
                  <span className="text-[11px] font-mono text-[#d4a843] flex items-center gap-2 pt-4 uppercase tracking-wider">
                    Explore Framework <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </CardContent>
              </Card>
            </button>
            <button className="text-left group outline-none">
              <Card className="border-white/10 bg-[#0a1628] group-hover:border-[#b8860b]/50 group-hover:-translate-y-1 transition-all h-full rounded-none">
                <CardContent className="p-8 space-y-4">
                  <div className="w-14 h-14 bg-[#b8860b]/10 flex items-center justify-center mb-4">
                    <Database className="w-7 h-7 text-[#d4a843]" />
                  </div>
                  <h3 className="text-xl font-bold text-white font-['Merriweather']">Enterprise AI Case Studies</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Working AI-powered document pipelines with classification, human review gates, and audit trails — built for staffing, aviation, construction, and insurance.
                  </p>
                  <span className="text-[11px] font-mono text-[#d4a843] flex items-center gap-2 pt-4 uppercase tracking-wider">
                    View Case Studies <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </CardContent>
              </Card>
            </button>
            <button className="text-left group outline-none">
              <Card className="border-white/10 bg-[#0a1628] group-hover:border-[#b8860b]/50 group-hover:-translate-y-1 transition-all h-full rounded-none">
                <CardContent className="p-8 space-y-4">
                  <div className="w-14 h-14 bg-[#b8860b]/10 flex items-center justify-center mb-4">
                    <Cpu className="w-7 h-7 text-[#d4a843]" />
                  </div>
                  <h3 className="text-xl font-bold text-white font-['Merriweather']">Research Portfolio</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    AI in education, workforce readiness, incarceration reform, and human capital systems — each backed by hundreds of peer-reviewed sources.
                  </p>
                  <span className="text-[11px] font-mono text-[#d4a843] flex items-center gap-2 pt-4 uppercase tracking-wider">
                    Browse Research <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </CardContent>
              </Card>
            </button>
          </div>
        </div>
      </section>

      {/* 5. Perspectives */}
      <section className="py-24 px-6 bg-[#0a1628]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 border-b border-white/10 pb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-['Merriweather']">Perspectives</h2>
            <p className="text-slate-400 mt-4 text-lg">Current thinking on AI governance, compliance, and institutional readiness.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PERSPECTIVES.map((p, idx) => (
              <article key={idx} className="group cursor-pointer">
                <div className="h-1 w-full bg-[#b8860b]/20 mb-6 group-hover:bg-[#d4a843] transition-colors"></div>
                <div className="mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4a843]">{p.tag}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#d4a843] transition-colors font-['Merriweather'] leading-tight">
                  {p.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {p.summary}
                </p>
                <div className="mt-6 flex items-center text-xs font-mono text-slate-500 group-hover:text-white transition-colors">
                  Read Article <ArrowRight className="w-3 h-3 ml-2" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Cross Link */}
      <section className="py-20 px-6 bg-[#0f1d35]">
        <div className="max-w-4xl mx-auto text-center p-12 border border-white/10 bg-[url('https://grainy-gradients.vercel.apply/noise.svg')] relative overflow-hidden">
          <div className="absolute inset-0 bg-[#0a1628]/80 z-0"></div>
          <div className="relative z-10 space-y-6">
            <Building2 className="w-8 h-8 text-[#d4a843] mx-auto" />
            <h2 className="text-2xl md:text-3xl font-bold text-white font-['Merriweather']">DOL TEN 07-25 Compliance</h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
              For dedicated consulting on the Department of Labor's AI Literacy Framework and WIOA grant alignment, visit the focused practice site.
            </p>
            <Button variant="outline" className="gap-2 mt-4 border-[#b8860b] text-[#d4a843] hover:bg-[#b8860b]/10 bg-transparent text-base px-6 h-12">
              theaigovernanceguy.com
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* 7. CTA */}
      <section className="py-32 px-6 bg-[#0a1628] border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white font-['Merriweather']">Ready to Talk?</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Every engagement begins with a 30-minute introductory call. No pitch deck — just a conversation about your organization's specific AI governance challenges.
          </p>
          <Button size="lg" className="gap-2 bg-[#b8860b] hover:bg-[#d4a843] text-[#0a1628] font-semibold border-none text-lg px-10 h-16 mt-8">
            Schedule a Consultation
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
