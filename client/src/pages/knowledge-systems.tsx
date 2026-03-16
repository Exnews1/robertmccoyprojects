import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Building2, Plane, Wind, Users, Heart, MapPin, ArrowLeft, Factory, ChevronRight } from "lucide-react";

const systems = [
  {
    title: "Construction Company Knowledge System",
    description: "Enterprise knowledge management for a construction company, covering project documentation, safety protocols, and operational procedures.",
    href: "https://construction.robertmccoyprojects.com/",
    icon: Building2,
  },
  {
    title: "Multi-Location FBO Knowledge System",
    description: "Knowledge management for a multi-location fixed-base operator, integrating operations across facilities, fuel services, and customer management.",
    href: "https://regionalfbo.robertmccoyprojects.com/",
    icon: Plane,
  },
  {
    title: "HVAC Services Knowledge System",
    description: "Operational knowledge base for an HVAC services company, covering installation procedures, maintenance schedules, and compliance documentation.",
    href: "https://hvac.robertmccoyprojects.com/",
    icon: Wind,
  },
  {
    title: "Staffing Agency Knowledge System",
    description: "Knowledge management platform for a staffing agency, organizing recruitment processes, compliance requirements, and client engagement workflows.",
    href: "https://prostaff.robertmccoyprojects.com/",
    icon: Users,
  },
  {
    title: "Non-Profit Services Knowledge System",
    description: "Enterprise knowledge management for a non-profit organization, covering program delivery, donor management, and community outreach procedures.",
    href: "https://valley.robertmccoyprojects.com/",
    icon: Heart,
  },
  {
    title: "Single-Location FBO Knowledge System",
    description: "Knowledge management for a single-location fixed-base operator, streamlining daily operations, fueling procedures, and customer service protocols.",
    href: "https://forrestfbosmall.robertmccoyprojects.com/",
    icon: MapPin,
  },
];

export default function KnowledgeSystems() {
  return (
    <div className="min-h-[70vh]">
      <section className="py-16 px-6" data-testid="section-knowledge-systems">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5" data-testid="button-back-home">
                <ArrowLeft className="h-3.5 w-3.5" />
                Home
              </Button>
            </Link>
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-serif" data-testid="heading-knowledge-systems">
              Organizational Knowledge Systems Case Studies
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A portfolio of demonstration systems built on a repeatable, governed architecture for enterprise knowledge management.
            </p>
          </div>

          {/* Meridian featured demo */}
          <div className="border border-amber-700/50 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 p-6" data-testid="card-meridian-demo">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-700 rounded flex items-center justify-center shrink-0">
                  <Factory className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-foreground text-base">Meridian Industrial Group</h2>
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-900/60 text-amber-400 border border-amber-700 font-semibold">
                      Interactive Demo
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Document Intelligence Engine — AI/Human-in-the-Loop Pipeline</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Live demonstration of governed document processing. Select from a library of 29 real Meridian documents or upload your own, run them through the AI classification engine, review proposals in the staging queue, and approve records into an organized, standardized knowledge repository — with a full immutable audit trail.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["Bulk Document Ingestion", "AI Classification", "Human Review", "Audit Trail", "Reset & Replay"].map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300 border border-slate-600">{tag}</span>
              ))}
            </div>
            <Link href="/research/knowledge-systems/demo" data-testid="button-launch-meridian">
              <Button className="mt-5 bg-amber-700 hover:bg-amber-600 text-white gap-1.5" size="sm">
                <ChevronRight className="h-3.5 w-3.5" />
                Launch Demo
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {systems.map((system, i) => (
              <Card key={i} className="border-border bg-card" data-testid={`card-knowledge-system-${i}`}>
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center mb-4 flex-shrink-0">
                    <system.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="font-semibold text-foreground text-base mb-2" data-testid={`title-knowledge-system-${i}`}>
                    {system.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-5 flex-1">
                    {system.description}
                  </p>
                  <Button variant="outline" size="sm" className="w-full" asChild data-testid={`button-visit-${i}`}>
                    <a href={system.href} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      Visit System
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
