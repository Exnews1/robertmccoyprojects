import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function ConsultingHome() {
  return (
    <div className="min-h-[70vh]">
      <section className="py-16 md:py-24 px-6" data-testid="section-hero">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-serif" data-testid="heading-consulting">
            A Research & Project Portfolio
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="subheading-consulting">
            Applied research in AI governance, institutional systems architecture, and career mobility frameworks for high-stakes environments.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/research/cmgf">
              <Button size="lg" className="gap-2" data-testid="button-cmgf-demo">
                CMGF Demonstration
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/research/research-portfolio">
              <Button size="lg" variant="outline" className="gap-2" data-testid="button-other-research">
                Other Research
              </Button>
            </Link>
            <Link href="/research/knowledge-systems">
              <Button size="lg" variant="outline" className="gap-2" data-testid="button-knowledge-systems">
                Knowledge Systems
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
