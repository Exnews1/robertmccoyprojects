import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Search, FileText, GraduationCap, ShieldCheck, ExternalLink } from "lucide-react";

const services = [
  {
    icon: Search,
    title: "AI Risk & Impact Assessment",
    problem: "You know your team is using AI, but you don't know where, how, or what the risks are.",
    solution: "I provide a structured assessment to inventory your organization's AI usage, identify potential risks (operational, legal, reputational), and deliver a prioritized risk register.",
    outcome: "A clear, actionable plan to mitigate your top AI-related threats.",
    standards: ["NIST AI RMF 1.0", "EO 14179"],
  },
  {
    icon: FileText,
    title: "AI Policy & Procedure Drafting",
    problem: "Your organization needs a formal AI policy, but you don't have the time or internal expertise to create one that is both comprehensive and practical.",
    solution: "Working with your leadership, I facilitate the process of drafting a clear, actionable, and auditable AI usage policy grounded in established governance architecture.",
    outcome: "A complete, ready-to-implement AI governance policy that your employees can understand and follow.",
    standards: ["NIST AI RMF 1.0", "GAO-24 Oversight"],
  },
  {
    icon: GraduationCap,
    title: "AI Literacy Training Workshop",
    problem: "Your employees and managers need to understand the fundamentals of AI to use it responsibly, and you need to comply with the new Department of Labor mandate (TEN 07-25).",
    solution: "I deliver a 1- or 2-day on-site or virtual workshop designed for your team, directly aligned with the DOL's AI Literacy Framework.",
    outcome: "A more competent and confident workforce, and documented compliance with federal training guidelines.",
    standards: ["DOL TEN 07-25", "WIOA Compliance"],
  },
  {
    icon: ShieldCheck,
    title: "Third-Party AI Governance Audit",
    problem: "You rely on software from major vendors (e.g., Microsoft, Salesforce, Google), but you don't know what AI risks are embedded in those tools.",
    solution: "I provide an advisory service to assess the AI governance posture of your key software vendors, analyzing their terms of service, data policies, and public statements.",
    outcome: "A clear-eyed view of your inherited AI risks and strategies for managing them.",
    standards: ["NIST AI RMF 1.0", "EU AI Act"],
  }
];

export default function ConsultingServices() {
  return (
    <div className="min-h-[70vh]">
      <section className="py-16 px-6" data-testid="section-services-hero">
        <div className="max-w-4xl mx-auto space-y-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-serif" data-testid="heading-services">
            Practical Solutions for Complex AI Challenges
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four core services designed to provide immediate value and long-term stability to organizations navigating AI governance requirements.
          </p>
        </div>
      </section>

      <section className="pb-16 px-6" data-testid="section-services-list">
        <div className="max-w-4xl mx-auto space-y-8">
          {services.map((service, i) => (
            <Card key={i} className="border-border bg-card overflow-hidden" data-testid={`card-service-${i}`}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground/80 mb-1">The Problem</p>
                  <p className="text-sm text-muted-foreground">{service.problem}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground/80 mb-1">The Solution</p>
                  <p className="text-sm text-muted-foreground">{service.solution}</p>
                </div>
                <div className="border p-4" style={{ backgroundColor: 'rgba(180, 83, 9, 0.05)', borderColor: 'rgba(180, 83, 9, 0.2)' }}>
                  <p className="text-sm font-medium mb-1" style={{ color: '#B45309' }}>Outcome</p>
                  <p className="text-sm text-foreground/80">{service.outcome}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider">Aligned to:</span>
                  {service.standards.map(s => (
                    <span key={s} className="text-[9px] font-mono px-2 py-0.5 rounded-sm border border-border bg-muted/30 text-muted-foreground">{s}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-12 px-6 border-t border-border/40 bg-card/30" data-testid="section-ten-07-25">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-xl font-bold text-foreground font-serif">DOL TEN 07-25 Consulting</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            For dedicated consulting on the Department of Labor's AI Literacy Framework, WIOA grant alignment, and state workforce agency compliance, visit the focused practice site.
          </p>
          <a href="https://theaigovernanceguy.com" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="gap-2 mt-2" data-testid="button-tagg-services">
              theaigovernanceguy.com
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </a>
        </div>
      </section>

      <section className="py-12 px-6 border-t border-border/40" data-testid="section-services-cta">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold text-foreground font-serif">Ready to Get Started?</h2>
          <p className="text-muted-foreground">
            Every engagement begins with a 30-minute introductory call to understand your organization's specific challenges and determine the right path forward.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2 mt-4" data-testid="button-services-contact">
              Schedule a Consultation
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
