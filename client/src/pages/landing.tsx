import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Building2, 
  ArrowRight, 
  FileText, 
  Users, 
  Cpu, 
  Database,
  Shield,
  Layers,
  Network,
  Brain,
  Workflow,
  GraduationCap,
  Award
} from "lucide-react";

const researchAreas = [
  {
    title: "Career Mobility Governance Framework",
    description: "Bounded AI for military-to-civilian transition support. CCME 2026 Learner Track research.",
    route: "/cmgf",
    icon: Shield,
    featured: true
  },
  {
    title: "Five Pillars Reference Database",
    description: "797 peer-reviewed sources organized by CMGF pillars for military learner career mobility.",
    route: "/cmgf/five-pillars",
    icon: BookOpen
  },
  {
    title: "Publications & References",
    description: "Research papers, technical reports, and policy analyses.",
    route: "/references",
    icon: FileText
  },
  {
    title: "Ongoing Research",
    description: "Additional research projects including AI Education, Incarceration Research, and Human Capital frameworks.",
    route: "/ongoing-research",
    icon: Layers
  }
];

const knowledgeSystems = [
  {
    id: "document-intelligence",
    title: "Document Intelligence",
    description: "AI-powered document analysis, extraction, and knowledge discovery.",
    icon: FileText,
    status: "coming-soon"
  },
  {
    id: "process-automation",
    title: "Process Automation",
    description: "Workflow optimization and intelligent process automation solutions.",
    icon: Workflow,
    status: "coming-soon"
  },
  {
    id: "knowledge-graphs",
    title: "Knowledge Graphs",
    description: "Semantic relationship mapping and organizational knowledge networks.",
    icon: Network,
    status: "coming-soon"
  },
  {
    id: "decision-support",
    title: "Decision Support Systems",
    description: "Data-driven decision frameworks and analytics platforms.",
    icon: Brain,
    status: "coming-soon"
  },
  {
    id: "data-integration",
    title: "Data Integration",
    description: "Enterprise data unification and interoperability solutions.",
    icon: Database,
    status: "coming-soon"
  },
  {
    id: "ai-governance",
    title: "AI Governance",
    description: "Responsible AI implementation and compliance frameworks.",
    icon: Shield,
    status: "coming-soon"
  }
];

export default function Landing() {
  return (
    <div className="p-8 space-y-12 max-w-7xl mx-auto">
      
      {/* Header Section */}
      <section className="text-center space-y-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Award className="w-8 h-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Robert McCoy Projects
          </h1>
        </div>
        
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">M.S. AI & Data Analytics</span>
          </div>
          <span className="text-muted-foreground hidden md:inline">|</span>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">MBA</span>
          </div>
          <span className="text-muted-foreground hidden md:inline">|</span>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-fuchsia-500" />
            <span className="text-sm text-muted-foreground">21+ Years Military Service</span>
          </div>
        </div>

        <p className="text-muted-foreground max-w-2xl mx-auto">
          Research, frameworks, and knowledge systems at the intersection of AI, education, and workforce development.
        </p>
      </section>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Research Column */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Research</h2>
              <p className="text-sm text-muted-foreground">Academic research and policy frameworks</p>
            </div>
          </div>

          <div className="space-y-4">
            {researchAreas.map((area) => (
              <Link key={area.route} href={area.route}>
                <Card 
                  className={`hover-elevate cursor-pointer transition-all duration-300 ${
                    area.featured 
                      ? 'border-fuchsia-500/30 bg-gradient-to-br from-card to-fuchsia-950/10' 
                      : 'border-border'
                  }`}
                  data-testid={`card-research-${area.route.replace(/\//g, '-')}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${
                        area.featured ? 'bg-fuchsia-500/10' : 'bg-muted/50'
                      }`}>
                        <area.icon className={`w-5 h-5 ${
                          area.featured ? 'text-fuchsia-500' : 'text-primary'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-bold text-foreground">{area.title}</h3>
                          {area.featured && (
                            <Badge className="bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/40 no-default-hover-elevate text-[9px]">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{area.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Organizational Knowledge Systems Column */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="p-2 bg-fuchsia-500/10 rounded-lg">
              <Building2 className="w-6 h-6 text-fuchsia-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Organizational Knowledge Systems</h2>
              <p className="text-sm text-muted-foreground">Enterprise AI and data solutions</p>
            </div>
          </div>

          <div className="space-y-4">
            {knowledgeSystems.map((system) => (
              <Card 
                key={system.id}
                className="border-border opacity-75"
                data-testid={`card-oks-${system.id}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-muted/50 flex-shrink-0">
                      <system.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-foreground">{system.title}</h3>
                        <Badge variant="outline" className="text-[9px] border-border text-muted-foreground">
                          Coming Soon
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{system.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Author Section */}
      <section className="pt-8 border-t border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-muted/50 rounded-full">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Robert E. McCoy</h3>
              <p className="text-sm text-muted-foreground">Military Partnership Executive, Indiana Wesleyan University</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="mailto:robert.mccoy@indwes.edu" 
              className="text-sm text-primary hover:underline"
              data-testid="link-contact-email"
            >
              robert.mccoy@indwes.edu
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
