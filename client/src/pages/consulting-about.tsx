import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Medal, GraduationCap, Briefcase, BookOpen, Shield, Rocket, Settings, Users } from "lucide-react";

export default function ConsultingAbout() {
  return (
    <div className="min-h-[70vh]">
      <section className="py-16 px-6" data-testid="section-about-hero">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-serif" data-testid="heading-about">
              A Career in High-Stakes Systems
            </h1>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed" data-testid="text-about-body">
            <p>
              I have spent my career solving hard problems in environments where failure is not an option. As an outsourced systems engineer and program manager, my job has been to provide the specialized expertise that major aerospace and defense organizations need to manage their most critical projects.
            </p>

            <p>
              My work has included program management for interplanetary space systems, systems engineering for advanced military aircraft, and full-lifecycle engineering for one of the world's most widely deployed gas turbine engines. I have run multiple engineering offices providing outsourced services to major aerospace OEMs, established a Greenfield engineering operation internationally, and have spent decades writing, negotiating, and delivering against complex Statements of Work. I understand outsourcing from both sides of the table.
            </p>

            <p>
              This experience has taught me a fundamental truth: the success of any complex system hinges on its governance. The technology is only as good as the human framework that directs it.
            </p>

            <p>
              Today, I apply that same systems-thinking approach to the challenge of Artificial Intelligence. As an Adjunct Professor at Indiana Wesleyan University, a board member for the Mid-South ACME, and an active participant in the CCME, my focus is on building the practical, auditable governance frameworks that organizations need to thrive in the age of AI. My career as a systems engineer has been the proving ground, and my military service as a CWO provided the foundational discipline for this work.
            </p>

            <p className="text-foreground font-medium">
              If you are a leader facing a complex systems challenge, we speak the same language.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 border-t border-border/40 bg-card/30" data-testid="section-credentials-detail">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Medal className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Experience & Credentials</h2>
              <p className="text-sm text-muted-foreground">Career milestones and professional qualifications</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="border-border bg-card">
              <CardContent className="pt-6 flex items-start gap-4">
                <Rocket className="w-5 h-5 text-primary/70 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Aerospace & Space Systems</p>
                  <p className="text-sm text-muted-foreground">Program management for interplanetary systems, military aircraft, and gas turbine engines</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="pt-6 flex items-start gap-4">
                <Settings className="w-5 h-5 text-primary/70 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Engineering Operations</p>
                  <p className="text-sm text-muted-foreground">Multiple engineering offices, outsourced services to major OEMs, international Greenfield operations</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="pt-6 flex items-start gap-4">
                <Medal className="w-5 h-5 text-primary/70 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Military Service (CWO)</p>
                  <p className="text-sm text-muted-foreground">U.S. Navy and U.S. Army — foundational discipline in high-stakes operational environments</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="pt-6 flex items-start gap-4">
                <GraduationCap className="w-5 h-5 text-primary/70 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">M.S. AI & Data Analytics</p>
                  <p className="text-sm text-muted-foreground">Advanced study in artificial intelligence, machine learning, and data-driven decision systems</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="pt-6 flex items-start gap-4">
                <BookOpen className="w-5 h-5 text-primary/70 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Adjunct Professor</p>
                  <p className="text-sm text-muted-foreground">Indiana Wesleyan University — AI literacy and applied data analytics</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="pt-6 flex items-start gap-4">
                <Users className="w-5 h-5 text-primary/70 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Professional Affiliations</p>
                  <p className="text-sm text-muted-foreground">Board Member, Mid-South ACME; Active Participant, CCME</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 px-6" data-testid="section-framework">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <Shield className="w-8 h-8 text-primary/70" />
          </div>
          <h2 className="text-xl font-bold text-foreground font-serif">The CMGF: Systems Thinking Applied to AI Governance</h2>
          <p className="text-muted-foreground leading-relaxed">
            The Credentialed Military-Civilian Governance Framework (CMGF) is the product of decades of operational experience distilled into a structured, repeatable methodology for responsible AI governance. It is backed by 797 peer-reviewed sources and has been presented at national conferences.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/research/cmgf">
              <Button variant="outline" className="gap-2" data-testid="button-about-framework">
                Explore the Research
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="gap-2" data-testid="button-about-contact">
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
