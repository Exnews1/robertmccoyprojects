import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Medal, GraduationCap, Briefcase, BookOpen, Shield } from "lucide-react";

export default function ConsultingAbout() {
  return (
    <div className="min-h-[70vh]">
      <section className="py-16 px-6" data-testid="section-about-hero">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground" data-testid="heading-about">
              From the Battlefield to the Boardroom: A Career in High-Stakes Governance
            </h1>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed" data-testid="text-about-body">
            <p>
              For more than two decades, I served in the U.S. military, from active-duty Navy sonar to leading flight operations as an Army Chief Warrant Officer (CWO). In that world, clear frameworks and trusted procedures are not academic exercises — they are how you ensure mission success and bring your people home safely.
            </p>

            <p>
              When I transitioned to the private sector, I spent over a decade as a Director of Engineering Operations, managing one of the world's largest gas turbine testing programs. I saw firsthand how complex technologies are integrated into high-stakes environments. The challenge was always the same: how do you harness the power of a new technology without introducing unacceptable risk?
            </p>

            <p>
              Today, we face that same challenge with Artificial Intelligence. AI is not just another software upgrade; it is a fundamental shift in how we make decisions. And for the public sector, the military, and the organizations that serve them, the stakes could not be higher.
            </p>

            <p>
              That is why I founded this practice. My work is not about the hype of AI. It is about the reality of its implementation. It is about building the human-in-the-loop systems that ensure these powerful tools are used safely, ethically, and accountably.
            </p>

            <p>
              My experience is not in writing code. It is in writing policy. It is not in building models. It is in building trust. As an Adjunct Professor at Indiana Wesleyan University, I teach the practical skills of AI literacy. As a consultant, I help leaders build the governance structures they need to navigate this new landscape with confidence.
            </p>

            <p className="text-foreground font-medium">
              If you are a leader in a public-facing organization trying to answer the hard questions about AI, we should talk. I have been in your shoes.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 border-t border-border/40 bg-card/30" data-testid="section-credentials-detail">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-xl font-bold text-foreground">Credentials</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="border-border/50 bg-card/50">
              <CardContent className="pt-6 flex items-start gap-4">
                <Medal className="w-5 h-5 text-primary/70 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Military Service</p>
                  <p className="text-sm text-muted-foreground">21+ years — U.S. Navy (Active), U.S. Army (CWO), flight operations leadership</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="pt-6 flex items-start gap-4">
                <GraduationCap className="w-5 h-5 text-primary/70 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">M.S. AI & Data Analytics</p>
                  <p className="text-sm text-muted-foreground">Advanced study in artificial intelligence, machine learning, and data-driven decision systems</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="pt-6 flex items-start gap-4">
                <Briefcase className="w-5 h-5 text-primary/70 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">MBA</p>
                  <p className="text-sm text-muted-foreground">Business administration with focus on operations management and organizational leadership</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="pt-6 flex items-start gap-4">
                <BookOpen className="w-5 h-5 text-primary/70 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Adjunct Professor</p>
                  <p className="text-sm text-muted-foreground">Indiana Wesleyan University — AI literacy and applied data analytics</p>
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
          <h2 className="text-xl font-bold text-foreground">The CMGF: My Life's Work</h2>
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
