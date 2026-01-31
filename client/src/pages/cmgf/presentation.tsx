import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Layers, 
  Shield, 
  Users, 
  AlertTriangle,
  Network,
  FileText,
  UserCheck,
  XCircle,
  Eye,
  Clock,
  ArrowRight
} from "lucide-react";

interface Slide {
  id: number;
  title: string;
  thesis: string;
  content: React.ReactNode;
  speakerNotes: string;
  quoteReady?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "The Integration Gap",
    thesis: "Military transition struggles not because programs are weak, but because decision signals across strong programs are fragmented.",
    content: (
      <div className="space-y-8">
        <div className="grid grid-cols-5 gap-3">
          {["TAP", "SkillBridge", "COOL", "VETS", "GI Bill"].map((program) => (
            <div key={program} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
              <div className="text-sm font-medium text-slate-300">{program}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <AlertTriangle className="w-12 h-12 text-amber-500" />
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 text-center">
          <div className="text-lg font-medium text-amber-400">Decision Point</div>
          <div className="text-sm text-slate-400 mt-2">Fragmented signals at the moment of choice</div>
        </div>
        <div className="text-center text-slate-400 text-sm">
          Strong programs. Weak coordination. No integrated signal.
        </div>
      </div>
    ),
    speakerNotes: "Each transition program—TAP, SkillBridge, COOL, VETS, GI Bill—operates effectively within its domain. The problem is not program quality. The problem is that at the moment a service member makes a career decision, these programs cannot speak to each other. Decision signals fragment precisely when integration matters most.",
    quoteReady: "Strong programs. Weak coordination. No integrated signal."
  },
  {
    id: 2,
    title: "Research Convergence",
    thesis: "Five independent research domains all converge on the same integration gap at decision time.",
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-3">
          {[
            { pillar: "Pillar 1", name: "Career Mobility Outcomes", sources: 174, color: "bg-blue-500" },
            { pillar: "Pillar 2", name: "Pathways & Credentials", sources: 222, color: "bg-emerald-500" },
            { pillar: "Pillar 3", name: "AI-Assisted Advising Tools", sources: 217, color: "bg-purple-500" },
            { pillar: "Pillar 4", name: "Skills Translation", sources: 166, color: "bg-orange-500" },
            { pillar: "Pillar 5", name: "Veteran Learner Voice", sources: 188, color: "bg-rose-500" }
          ].map((item) => (
            <div key={item.pillar} className="flex items-center gap-4 bg-slate-800/30 rounded-lg p-3">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <div className="flex-1">
                <span className="text-xs text-slate-500 font-mono">{item.pillar}</span>
                <div className="text-sm font-medium text-slate-200">{item.name}</div>
              </div>
              <Badge variant="secondary" className="text-xs">{item.sources} sources</Badge>
            </div>
          ))}
        </div>
        <div className="flex justify-center py-2">
          <ArrowRight className="w-6 h-6 text-primary rotate-90" />
        </div>
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-center">
          <div className="text-sm font-medium text-primary">797 peer-reviewed sources</div>
          <div className="text-xs text-slate-400 mt-1">All pointing to the same systems gap</div>
        </div>
      </div>
    ),
    speakerNotes: "We synthesized 797 peer-reviewed sources across five research domains. Each domain—mobility outcomes, credentialing pathways, AI advising, skills translation, and learner voice—independently identifies the same structural problem: lack of signal integration at decision time. This is not coincidence. This is convergent evidence.",
    quoteReady: "797 sources. Five domains. One convergent finding."
  },
  {
    id: 3,
    title: "The Systems Insight",
    thesis: "The solution is not a new program. It is a governed signal-integration infrastructure layer.",
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-5">
            <XCircle className="w-6 h-6 text-red-400 mb-3" />
            <div className="text-sm font-medium text-red-400 mb-2">NOT the solution</div>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>Another standalone program</li>
              <li>Replace existing systems</li>
              <li>New data collection</li>
              <li>Centralized control</li>
            </ul>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-5">
            <Layers className="w-6 h-6 text-emerald-400 mb-3" />
            <div className="text-sm font-medium text-emerald-400 mb-2">THE solution</div>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>Infrastructure layer</li>
              <li>Connect existing programs</li>
              <li>Integrate existing signals</li>
              <li>Preserve autonomy</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 text-center">
          <div className="text-lg font-bold text-foreground mb-1">The Binder Layer</div>
          <div className="text-sm text-slate-400">Governed infrastructure that binds existing systems without replacing them</div>
        </div>
      </div>
    ),
    speakerNotes: "The research does not call for another program to compete with existing ones. It calls for infrastructure—a governed layer that binds existing programs together. We call this the Binder Layer. It does not replace anything. It enables existing programs to function as a coordinated ecosystem.",
    quoteReady: "Not a new program. Infrastructure that binds."
  },
  {
    id: 4,
    title: "Trust Constraints",
    thesis: "AI must be framed strictly as infrastructure, not automation. Human decision authority is preserved at all times.",
    content: (
      <div className="space-y-5">
        <div className="text-center mb-6">
          <Shield className="w-10 h-10 text-primary mx-auto mb-2" />
          <div className="text-sm font-medium text-primary">Non-Negotiable Governance Constraints</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: XCircle, label: "No predictive outcome scoring", color: "text-red-400" },
            { icon: XCircle, label: "No individual risk scoring", color: "text-red-400" },
            { icon: XCircle, label: "No automated approvals", color: "text-red-400" },
            { icon: XCircle, label: "No surveillance framing", color: "text-red-400" },
            { icon: XCircle, label: "No 'AI replaces humans'", color: "text-red-400" },
            { icon: UserCheck, label: "Human authority preserved", color: "text-emerald-400" }
          ].map((constraint, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-800/30 rounded-lg p-3">
              <constraint.icon className={`w-4 h-4 ${constraint.color} flex-shrink-0`} />
              <span className="text-xs text-slate-300">{constraint.label}</span>
            </div>
          ))}
        </div>
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-center mt-4">
          <div className="text-sm text-slate-300">AI enables <span className="text-primary font-medium">population-level learning</span></div>
          <div className="text-xs text-slate-500 mt-1">Never individual prediction</div>
        </div>
      </div>
    ),
    speakerNotes: "Before any technology discussion, governance constraints must be absolute and visible. No predictive scoring of individuals. No risk labels. No automated decisions. No surveillance. Human decision authority is never delegated to the system. AI operates only to support population-level pattern recognition—never to predict individual outcomes.",
    quoteReady: "Governance first. Technology second. Always."
  },
  {
    id: 5,
    title: "The Binder Layer Concept",
    thesis: "CMGF is a governed signal-integration infrastructure that allows existing programs to function as a coordinated ecosystem.",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-5 gap-2 text-center">
          {["TAP", "SkillBridge", "COOL", "VA", "DoL"].map((sys) => (
            <div key={sys} className="bg-slate-700/50 rounded p-2 text-xs text-slate-400">{sys}</div>
          ))}
        </div>
        <div className="flex justify-center">
          <div className="w-px h-6 bg-slate-600" />
        </div>
        <div className="bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 border border-primary/40 rounded-xl p-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Layers className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold text-foreground">CMGF / Binder Layer</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-800/50 rounded p-2 text-slate-400">Signal Integration</div>
            <div className="bg-slate-800/50 rounded p-2 text-slate-400">Governance Engine</div>
            <div className="bg-slate-800/50 rounded p-2 text-slate-400">Decision Support</div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-px h-6 bg-slate-600" />
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
            <Users className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <div className="text-xs text-slate-400">Service Members</div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <UserCheck className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <div className="text-xs text-slate-400">Advisors</div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
            <Network className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <div className="text-xs text-slate-400">Institutions</div>
          </div>
        </div>
      </div>
    ),
    speakerNotes: "The Binder Layer sits between existing systems and human decision-makers. It integrates signals from TAP, SkillBridge, COOL, VA, and DoL programs. It provides governed decision support to service members, advisors, and partner institutions. Nothing is replaced. Everything is connected.",
    quoteReady: "The Binder Layer: infrastructure that connects, not software that replaces."
  },
  {
    id: 6,
    title: "Research-to-Platform Mapping",
    thesis: "Every platform capability maps directly to a research-validated need from the Five Pillars.",
    content: (
      <div className="space-y-3">
        {[
          { research: "Career mobility outcomes vary by pathway clarity", platform: "Pathway Visibility Dashboard", pillar: 1 },
          { research: "Stackable credentials increase completion rates", platform: "Credential Stacking Engine", pillar: 2 },
          { research: "AI advising improves when bounded by governance", platform: "Governed AI Advisory Module", pillar: 3 },
          { research: "Skills translation fails without context mapping", platform: "MOS-to-Civilian Translator", pillar: 4 },
          { research: "Learner voice data improves system design", platform: "Feedback Integration Loop", pillar: 5 }
        ].map((item, i) => (
          <div key={i} className="flex items-stretch gap-3">
            <div className="flex-1 bg-slate-800/30 rounded-lg p-3 border-l-2 border-blue-500">
              <div className="text-xs text-slate-500 mb-1">Research Finding (Pillar {item.pillar})</div>
              <div className="text-xs text-slate-300">{item.research}</div>
            </div>
            <div className="flex items-center">
              <ArrowRight className="w-4 h-4 text-slate-600" />
            </div>
            <div className="flex-1 bg-primary/10 rounded-lg p-3 border-l-2 border-primary">
              <div className="text-xs text-slate-500 mb-1">Platform Capability</div>
              <div className="text-xs text-primary font-medium">{item.platform}</div>
            </div>
          </div>
        ))}
      </div>
    ),
    speakerNotes: "This is not speculative design. Every platform capability maps directly to a research-validated finding. Pathway dashboards address mobility outcome research. Credential stacking addresses pathway research. Governed AI addresses advising research. Skills translation addresses MOS mapping research. Feedback loops address learner voice research. Research grounds every feature.",
    quoteReady: "Every feature traces back to peer-reviewed evidence."
  },
  {
    id: 7,
    title: "Human Workflow Preserved",
    thesis: "The system supports decisions. It never makes them. Human authority remains absolute.",
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-3">
              <Network className="w-8 h-8 text-slate-400" />
            </div>
            <div className="text-xs text-slate-500">System</div>
            <div className="text-sm text-slate-300 mt-1">Surfaces options</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
              <UserCheck className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-xs text-slate-500">Advisor</div>
            <div className="text-sm text-slate-300 mt-1">Reviews & recommends</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center mb-3">
              <Users className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="text-xs text-slate-500">Service Member</div>
            <div className="text-sm text-slate-300 mt-1">Decides & acts</div>
          </div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-center">
          <div className="text-sm font-medium text-emerald-400">Human Decision Authority</div>
          <div className="text-xs text-slate-400 mt-1">The system informs. Humans decide. Always.</div>
        </div>
      </div>
    ),
    speakerNotes: "The workflow is explicit. The system surfaces options and patterns. The advisor reviews, contextualizes, and recommends. The service member decides and acts. At no point does the system make a decision. At no point is human judgment bypassed. The system is decision support infrastructure—never decision automation.",
    quoteReady: "The system informs. Humans decide. Always."
  },
  {
    id: 8,
    title: "What This Is NOT",
    thesis: "Explicit boundaries define what CMGF will never become.",
    content: (
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Predictive scoring system", desc: "No individual outcome predictions" },
          { label: "Surveillance infrastructure", desc: "No tracking or monitoring of individuals" },
          { label: "Automated decision engine", desc: "No approvals or denials by algorithm" },
          { label: "Replacement for advisors", desc: "Humans remain essential to the workflow" },
          { label: "Centralized control system", desc: "Distributed authority, not consolidation" },
          { label: "Commercial AI product", desc: "Institutional infrastructure, not software for sale" }
        ].map((item, i) => (
          <div key={i} className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-red-400">{item.label}</div>
                <div className="text-xs text-slate-500 mt-1">{item.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
    speakerNotes: "These boundaries are architectural, not aspirational. CMGF will never score individuals. It will never automate decisions. It will never replace human advisors. It will never become surveillance. These constraints are not limitations—they are the foundation of institutional trust.",
    quoteReady: "Boundaries are not limitations. They are the foundation of trust."
  },
  {
    id: 9,
    title: "What You Are About to See",
    thesis: "A governed demonstration of the Binder Layer concept in operational form.",
    content: (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <Eye className="w-10 h-10 text-primary mx-auto mb-2" />
          <div className="text-sm text-slate-400">Live Platform Demonstration</div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-slate-800/30 border-slate-700 p-4">
            <Users className="w-6 h-6 text-emerald-400 mb-2" />
            <div className="text-sm font-medium text-foreground">Service Member Hub</div>
            <div className="text-xs text-slate-400 mt-1">Pathway exploration, credential tracking, decision support</div>
          </Card>
          <Card className="bg-slate-800/30 border-slate-700 p-4">
            <Shield className="w-6 h-6 text-blue-400 mb-2" />
            <div className="text-sm font-medium text-foreground">AI Services</div>
            <div className="text-xs text-slate-400 mt-1">Governed AI with audit trails, bounded responses</div>
          </Card>
          <Card className="bg-slate-800/30 border-slate-700 p-4">
            <UserCheck className="w-6 h-6 text-purple-400 mb-2" />
            <div className="text-sm font-medium text-foreground">Advisor Toolkit</div>
            <div className="text-xs text-slate-400 mt-1">Population insights, workflow support, human override</div>
          </Card>
        </div>
        <div className="flex justify-center gap-3 flex-wrap">
          <Badge variant="outline">NIST AI RMF 1.0 Compliant</Badge>
          <Badge variant="outline">EO 14110 Aligned</Badge>
          <Badge variant="outline">Human-in-the-Loop</Badge>
        </div>
      </div>
    ),
    speakerNotes: "The demonstration you are about to see is not a prototype. It is a working implementation of the Binder Layer concept. You will see the Service Member Hub, governed AI services with full audit capability, and the Advisor Toolkit. All modules comply with NIST AI RMF 1.0 and Executive Order 14110 requirements.",
    quoteReady: "Not a prototype. A working implementation of governed infrastructure."
  },
  {
    id: 10,
    title: "Why Now",
    thesis: "The convergence of research, policy, and technology makes this infrastructure not just possible, but inevitable.",
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
            <FileText className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-sm font-medium text-foreground">Research Ready</div>
            <div className="text-xs text-slate-400 mt-1">797 sources point to the same integration gap</div>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-center">
            <Shield className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-sm font-medium text-foreground">Policy Ready</div>
            <div className="text-xs text-slate-400 mt-1">NIST RMF, EO 14110, GAO guidance align</div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
            <Network className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-sm font-medium text-foreground">Tech Ready</div>
            <div className="text-xs text-slate-400 mt-1">Governed AI infrastructure is now achievable</div>
          </div>
        </div>
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 text-center">
          <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
          <div className="text-lg font-bold text-foreground mb-2">The Moment of Convergence</div>
          <div className="text-sm text-slate-400 max-w-md mx-auto">
            Research, policy, and technology have aligned. The question is no longer whether this infrastructure will exist, but who will build it responsibly.
          </div>
        </div>
      </div>
    ),
    speakerNotes: "This is not speculative. Research has identified the problem. Policy frameworks now exist to govern AI responsibly. Technology has matured to enable governed infrastructure. These three pillars have converged. The Binder Layer is not experimental—it is inevitable infrastructure. The only question is whether it will be built with governance from the start.",
    quoteReady: "The question is not whether. The question is who builds it responsibly."
  }
];

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(false);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="h-screen flex flex-col">
        <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-4">
            <Link href="/cmgf/downloads">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" data-testid="button-back-downloads">
                <Home className="w-4 h-4 mr-2" />
                Downloads
              </Button>
            </Link>
            <div className="h-4 w-px bg-slate-700" />
            <span className="text-sm text-slate-500">CMGF / The Binder Layer</span>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowNotes(!showNotes)}
              className={showNotes ? "text-primary" : "text-slate-400"}
              data-testid="button-toggle-notes"
            >
              Speaker Notes {showNotes ? "ON" : "OFF"}
            </Button>
            <span className="text-sm text-slate-500">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden">
          <div className={`flex-1 flex flex-col transition-all ${showNotes ? 'pr-80' : ''}`}>
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="w-full max-w-4xl">
                <div className="mb-8">
                  <Badge variant="secondary" className="mb-4 text-xs">
                    Slide {slide.id} of {slides.length}
                  </Badge>
                  <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="text-slide-title">
                    {slide.title}
                  </h1>
                  <p className="text-lg text-slate-400" data-testid="text-slide-thesis">
                    {slide.thesis}
                  </p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8" data-testid="container-slide-content">
                  {slide.content}
                </div>
                {slide.quoteReady && (
                  <div className="mt-6 text-center">
                    <blockquote className="text-lg italic text-primary/80">
                      "{slide.quoteReady}"
                    </blockquote>
                  </div>
                )}
              </div>
            </div>

            <footer className="flex items-center justify-between px-8 py-4 border-t border-slate-800 bg-slate-900/30">
              <Button 
                variant="outline" 
                onClick={prevSlide} 
                disabled={currentSlide === 0}
                className="border-slate-700 text-slate-300"
                data-testid="button-prev-slide"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <div className="flex gap-1">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === currentSlide ? 'bg-primary' : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                    data-testid={`button-slide-dot-${i}`}
                  />
                ))}
              </div>
              <Button 
                variant="outline" 
                onClick={nextSlide} 
                disabled={currentSlide === slides.length - 1}
                className="border-slate-700 text-slate-300"
                data-testid="button-next-slide"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </footer>
          </div>

          {showNotes && (
            <aside className="w-80 border-l border-slate-800 bg-slate-900/50 p-6 overflow-y-auto fixed right-0 top-14 bottom-0">
              <h3 className="text-sm font-mono uppercase tracking-wider text-slate-500 mb-4">Speaker Notes</h3>
              <p className="text-sm text-slate-300 leading-relaxed" data-testid="text-speaker-notes">
                {slide.speakerNotes}
              </p>
            </aside>
          )}
        </main>
      </div>
    </div>
  );
}
