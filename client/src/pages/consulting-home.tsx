import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function ConsultingHome() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <Building2 className="w-12 h-12 text-primary/60" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground" data-testid="heading-consulting">
            Governed Systems Architecture
          </h1>
          <p className="text-lg text-muted-foreground" data-testid="subheading-consulting">
            Consulting Services — Coming Soon
          </p>
        </div>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Strategic consulting for organizations building AI-governed decision systems, 
              workforce transition pipelines, and compliance frameworks.
            </p>
            <div className="flex justify-center">
              <Link href="/research">
                <Button variant="outline" className="gap-2" data-testid="link-explore-research">
                  Explore Research Portfolio
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Badge variant="outline" className="text-xs text-muted-foreground/60 border-border/40" data-testid="badge-domain">
          robertmccoyprojects.com
        </Badge>
      </div>
    </div>
  );
}
