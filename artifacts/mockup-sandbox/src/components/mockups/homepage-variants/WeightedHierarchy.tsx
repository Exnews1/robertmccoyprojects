import React from "react";
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

export default function WeightedHierarchy() {
  return (
    <div className="min-h-screen text-slate-100 font-['Inter']" style={{ backgroundColor: "#0a1628" }}>
      {/* Hero Section - Spacious, large typography, credential bar */}
      <section className="py-24 md:py-32 px-6 flex flex-col items-center justify-center text-center relative" style={{ backgroundColor: "#0a1628" }}>
        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5" style={{ color: "#d4a843" }} />
            <span className="text-xs font-mono uppercase tracking-[3px] text-slate-400">AI Governance Consulting</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white font-['Merriweather'] leading-tight">
            Governed AI Architecture for<br className="hidden md:block" /> High-Stakes Organizations
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            I help organizations build auditable AI governance frameworks — the policies, risk controls, and human-in-the-loop systems that survive federal scrutiny and earn stakeholder trust.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 pb-2">
            <Button size="lg" className="gap-2 bg-[#d4a843] hover:bg-[#b8860b] text-slate-900 border-none font-semibold text-base px-8 h-14">
              See How I Can Help
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800 font-medium text-base px-8 h-14">
              Schedule a Consultation
            </Button>
          </div>
          
          {/* Horizontal credential bar */}
          <div className="pt-8 mt-8 border-t border-slate-800/60 max-w-4xl mx-auto w-full">
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-2"><span style={{ color: "#d4a843" }}>797</span> Sources</span>
              <span className="hidden sm:inline text-slate-700">•</span>
              <span className="flex items-center gap-2"><span style={{ color: "#d4a843" }}>4</span> Live Demos</span>
              <span className="hidden sm:inline text-slate-700">•</span>
              <span className="flex items-center gap-2"><span style={{ color: "#d4a843" }}>6</span> Published Briefs</span>
              <span className="hidden sm:inline text-slate-700">•</span>
              <span className="flex items-center gap-2"><span style={{ color: "#d4a843" }}>3</span> Case Studies</span>
            </div>
          </div>
        </div>
        
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-slate-800/20 blur-[120px] rounded-full pointer-events-none"></div>
      </section>

      {/* Why Now - Tighter section, smaller header */}
      <section className="py-16 px-6" style={{ backgroundColor: "#0f1d35" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4" style={{ color: "#d4a843" }} />
                <span className="text-xs font-mono uppercase tracking-[2px]" style={{ color: "#d4a843" }}>Why Now</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white font-['Merriweather']">The Regulatory Landscape Is Moving</h2>
            </div>
            <p className="text-slate-400 max-w-xl text-sm md:text-base leading-relaxed">
              Federal mandates, risk frameworks, and international regulation are creating compliance obligations that didn't exist 18 months ago.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REGULATORY_DRIVERS.map(r => (
              <a key={r.label} href={r.href} className="block group">
                <Card className="bg-[#152642] border-slate-700/50 group-hover:border-[#d4a843]/50 transition-all cursor-pointer h-full shadow-none group-hover:shadow-lg group-hover:shadow-black/20">
                  <CardContent className="p-5 flex flex-col h-full space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{r.label}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-900/30 text-amber-400 whitespace-nowrap">{r.urgency}</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed flex-grow">{r.desc}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 mt-auto">
                      <p className="text-[11px] font-mono text-slate-500">{r.date}</p>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#d4a843] transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Services - Tighter section */}
      <section className="py-16 px-6" style={{ backgroundColor: "#0a1628" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-white font-['Merriweather']">What I Do</h2>
            <p className="text-slate-400 mt-3 text-sm md:text-base">Four core services designed for organizations that need governance — not just guidance.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Search, title: "AI Risk & Impact Assessment", desc: "Inventory AI usage, identify shadow AI, deliver a prioritized risk register." },
              { icon: FileText, title: "AI Policy & Procedure Drafting", desc: "Clear, actionable, auditable AI usage policies your teams can follow." },
              { icon: GraduationCap, title: "AI Literacy Training", desc: "DOL TEN 07-25 aligned workshops for workforce and leadership." },
              { icon: ShieldCheck, title: "Third-Party AI Governance Audit", desc: "Assess inherited AI risks from vendor tools and platforms." },
            ].map(s => (
              <button key={s.title} className="text-left w-full group flex items-start gap-5 p-5 rounded-xl hover:bg-[#0f1d35] border border-transparent hover:border-slate-800 transition-all">
                <div className="w-10 h-10 rounded-lg bg-[#0f1d35] group-hover:bg-[#152642] border border-slate-800 flex items-center justify-center flex-shrink-0 transition-colors">
                  <s.icon className="w-5 h-5 text-slate-400 group-hover:text-[#d4a843] transition-colors" />
                </div>
                <div>
                  <p className="font-semibold text-slate-200 text-base mb-1 group-hover:text-white transition-colors">{s.title}</p>
                  <p className="text-sm text-slate-400 leading-relaxed mb-3">{s.desc}</p>
                  <span className="text-xs font-semibold text-[#d4a843] flex items-center gap-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    Learn More <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button variant="outline" className="gap-2 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
              Service Details & Outcomes
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Evidence - Spacious section */}
      <section className="py-24 px-6" style={{ backgroundColor: "#0f1d35" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-['Merriweather']">Built on Evidence, Not Theory</h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-base md:text-lg">
              My consulting practice is backed by a structured research portfolio — including working prototypes, peer-reviewed analysis, and enterprise case studies.
            </p>
          </div>
          
          {/* Detailed Proof Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {PROOF_POINTS.map((p, i) => (
              <div key={p.label} className="flex flex-col text-center p-6 rounded-xl bg-[#0a1628] border border-slate-800/60 shadow-lg">
                <span className="text-4xl font-bold text-white mb-2 font-serif" style={{ color: i === 0 ? "#d4a843" : "white" }}>{p.value}</span>
                <span className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">{p.label}</span>
                <span className="text-xs text-slate-500 mt-auto leading-relaxed">{p.detail}</span>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="text-left group">
              <Card className="bg-[#152642] border-slate-700/50 group-hover:border-[#d4a843]/50 transition-all h-full">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                      <Scale className="w-4 h-4 text-[#d4a843]" />
                    </div>
                    <span className="text-base font-bold text-white">CMGF Research</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">A governance architecture for military career mobility — demonstrating how bounded AI, human-in-the-loop review, and institutional intelligence work in practice.</p>
                  <span className="text-xs font-semibold text-[#d4a843] flex items-center gap-1 pt-2">Explore Framework <ArrowRight className="w-3.5 h-3.5" /></span>
                </CardContent>
              </Card>
            </button>
            <button className="text-left group">
              <Card className="bg-[#152642] border-slate-700/50 group-hover:border-[#d4a843]/50 transition-all h-full">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                      <Database className="w-4 h-4 text-[#d4a843]" />
                    </div>
                    <span className="text-base font-bold text-white">Enterprise Case Studies</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">Working AI-powered document pipelines with classification, human review gates, and audit trails — built for staffing, aviation, construction, and insurance.</p>
                  <span className="text-xs font-semibold text-[#d4a843] flex items-center gap-1 pt-2">View Case Studies <ArrowRight className="w-3.5 h-3.5" /></span>
                </CardContent>
              </Card>
            </button>
            <button className="text-left group">
              <Card className="bg-[#152642] border-slate-700/50 group-hover:border-[#d4a843]/50 transition-all h-full">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                      <Cpu className="w-4 h-4 text-[#d4a843]" />
                    </div>
                    <span className="text-base font-bold text-white">Research Portfolio</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">AI in education, workforce readiness, incarceration reform, and human capital systems — each backed by hundreds of peer-reviewed sources.</p>
                  <span className="text-xs font-semibold text-[#d4a843] flex items-center gap-1 pt-2">Browse Research <ArrowRight className="w-3.5 h-3.5" /></span>
                </CardContent>
              </Card>
            </button>
          </div>
        </div>
      </section>

      {/* Perspectives - Spacious section */}
      <section className="py-24 px-6" style={{ backgroundColor: "#0a1628" }}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-['Merriweather']">Perspectives</h2>
            <p className="text-slate-400 mt-3 text-base">Current thinking on AI governance, compliance, and institutional readiness.</p>
          </div>
          
          <div className="space-y-6">
            {PERSPECTIVES.map(p => (
              <button key={p.title} className="w-full text-left p-6 rounded-xl bg-[#0f1d35] hover:bg-[#152642] border border-slate-800/50 hover:border-slate-700 transition-all group flex flex-col md:flex-row md:items-start gap-4">
                <div className="md:w-1/4 shrink-0">
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-[#d4a843]/10 text-[#d4a843] font-medium border border-[#d4a843]/20">{p.tag}</span>
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-lg font-bold text-slate-200 group-hover:text-white mb-2 font-['Merriweather'] transition-colors">{p.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{p.summary}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-link - Tighter, focused */}
      <section className="py-16 px-6 relative overflow-hidden" style={{ backgroundColor: "#0f1d35" }}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
        <div className="max-w-3xl mx-auto text-center space-y-5 relative z-10">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#0a1628] border border-slate-700 flex items-center justify-center mb-2">
            <Building2 className="w-5 h-5 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-white font-['Merriweather']">DOL TEN 07-25 Compliance</h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            For dedicated consulting on the Department of Labor's AI Literacy Framework and WIOA grant alignment, visit the focused practice site.
          </p>
          <div className="pt-2">
            <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-600 bg-[#152642] hover:bg-slate-700 text-slate-200 hover:text-white text-sm font-medium transition-colors">
              theaigovernanceguy.com
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section - Bolder, huge padding, striking visual weight */}
      <section className="py-32 px-6" style={{ backgroundColor: "#d4a843" }}>
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-['Merriweather'] leading-tight">
            Ready to Talk Governance?
          </h2>
          <p className="text-slate-800 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Every engagement begins with a 30-minute introductory call. No pitch deck — just a conversation about your organization's specific AI governance challenges.
          </p>
          <div className="pt-6">
            <Button size="lg" className="gap-2 bg-slate-900 hover:bg-black text-white px-10 h-16 text-lg font-semibold rounded-xl shadow-xl shadow-black/20 transition-all hover:scale-105">
              Schedule a Consultation
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
