import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, ArrowRight, Rocket, Settings, Brain, GraduationCap } from "lucide-react";

export default function ConsultingHome() {
  return (
    <div className="min-h-[70vh]">
      <section className="py-16 md:py-24 px-6" data-testid="section-hero">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground" data-testid="heading-consulting">
            AI Governance for High-Stakes Environments
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="subheading-consulting">
            Helping public sector and aerospace organizations build accountable, human-in-the-loop systems for a new era of technology.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/services">
              <Button size="lg" className="gap-2" data-testid="button-explore-services">
                Explore Services
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

      <section className="py-8 px-6 border-y border-border/40 bg-card/30" data-testid="section-credentials">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm text-muted-foreground">
            <div className="flex items-center gap-2" data-testid="credential-aerospace">
              <Rocket className="w-4 h-4 text-primary/70" />
              <span>Aerospace & Space Systems Engineering</span>
            </div>
            <div className="flex items-center gap-2" data-testid="credential-program-mgmt">
              <Settings className="w-4 h-4 text-primary/70" />
              <span>Program Management in High-Consequence Environments</span>
            </div>
            <div className="flex items-center gap-2" data-testid="credential-governance">
              <Brain className="w-4 h-4 text-primary/70" />
              <span>AI Governance Framework Development</span>
            </div>
            <div className="flex items-center gap-2" data-testid="credential-ms">
              <GraduationCap className="w-4 h-4 text-primary/70" />
              <span>M.S. AI & Data Analytics</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6" data-testid="section-problem">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center">
            The Hardest Problems Are Never Technical. They Are Governance Problems.
          </h2>
          <p className="text-muted-foreground text-center leading-relaxed">
            For four decades, I have worked as the outsourced systems engineer and program manager that major organizations call when the problem is too complex, too specialized, or too high-stakes to solve internally. What I learned is that breakthrough technology is not the hard part. The hard part is integrating that technology into a human system safely, reliably, and accountably.
          </p>
          <p className="text-muted-foreground text-center leading-relaxed">
            I apply that same experience directly to AI governance. With an M.S. in Artificial Intelligence and Data Analytics, an MBA, and more than 40 years of systems engineering and program management experience, I help organizations cut through the hype and build AI frameworks that actually work.
          </p>
          <p className="text-muted-foreground text-center leading-relaxed font-medium">
            I am known for frank talk. The stakes are too high for anything else.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-card/30 border-t border-border/40" data-testid="section-cmgf">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <Shield className="w-10 h-10 text-primary/70" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            A Career in Systems, A Framework for Governance
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            My work is not about the hype of AI. It is about the reality of its implementation. The Credentialed Military-Civilian Governance Framework (CMGF) is the direct result of a career spent building and managing high-stakes systems. It is an operational toolkit designed to give leaders the clarity and control they need to adopt AI with confidence.
          </p>
          <Link href="/research/cmgf">
            <Button variant="outline" className="gap-2 mt-4" data-testid="button-learn-framework">
              Learn About the Framework
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-16 px-6" data-testid="section-services-preview">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center">
            How I Help
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "AI Risk & Impact Assessment",
                desc: "Inventory your organization's AI usage, identify risks, and deliver a prioritized action plan."
              },
              {
                title: "AI Policy & Procedure Drafting",
                desc: "Draft clear, actionable, and auditable AI governance policies based on the CMGF."
              },
              {
                title: "AI Literacy Training Workshop",
                desc: "1- or 2-day workshops aligned with the DOL's AI Literacy Framework (TEN 07-25)."
              },
              {
                title: "Third-Party AI Governance Audit",
                desc: "Assess the AI governance posture of your key software vendors and inherited risks."
              }
            ].map((service, i) => (
              <Card key={i} className="border-border/50 bg-card/50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-2" data-testid={`text-service-title-${i}`}>{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center pt-4">
            <Link href="/services">
              <Button variant="outline" className="gap-2" data-testid="button-view-all-services">
                View All Services
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
