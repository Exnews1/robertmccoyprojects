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
  Award,
  ExternalLink,
  Plane,
  Thermometer,
  HardHat,
  Radio
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
    id: "prostaff",
    title: "Staffing Agency Knowledge System",
    description: "Professional staffing and workforce management solutions.",
    icon: Users,
    status: "live",
    url: "https://prostaff.robertmccoyprojects.com"
  },
  {
    id: "valley",
    title: "Non-Profit Services Knowledge System",
    description: "AI-powered knowledge system for organizational intelligence.",
    icon: Radio,
    status: "live",
    url: "https://valley.robertmccoyprojects.com"
  },
  {
    id: "construction",
    title: "Construction Company Knowledge System",
    description: "Construction project management and knowledge systems.",
    icon: HardHat,
    status: "live",
    url: "https://construction.robertmccoyprojects.com"
  },
  {
    id: "regionalfbo",
    title: "Multi-Location FBO Knowledge System",
    description: "Fixed-base operator regional aviation services and management.",
    icon: Plane,
    status: "live",
    url: "https://regionalfbo.robertmccoyprojects.com"
  },
  {
    id: "forrestfbosmall",
    title: "Single-Location FBO Knowledge System",
    description: "Small fixed-base operator aviation services.",
    icon: Plane,
    status: "live",
    url: "https://forrestfbosmall.robertmccoyprojects.com"
  },
  {
    id: "hvac",
    title: "HVAC Services Knowledge System",
    description: "Heating, ventilation, and air conditioning systems management.",
    icon: Thermometer,
    status: "live",
    url: "https://hvac.robertmccoyprojects.com"
  },
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
          Research, frameworks, and organizational knowledge systems at the intersection of AI, education, and workforce development.
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

          <div className="space-y-3">
            {researchAreas.map((area) => (
              <Link key={area.route} href={area.route}>
                {area.featured ? (
                  <Card 
                    className="hover-elevate cursor-pointer transition-all duration-300 border-fuchsia-500/30 bg-gradient-to-br from-card to-fuchsia-950/10 min-h-[264px]"
                    data-testid={`card-research-${area.route.replace(/\//g, '-')}`}
                  >
                    <CardContent className="p-5 h-full flex items-center">
                      <div className="flex items-center gap-4 w-full">
                        <div className="p-3 rounded-lg flex-shrink-0 bg-fuchsia-500/10">
                          <area.icon className="w-7 h-7 text-fuchsia-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-bold text-foreground">{area.title}</h3>
                            <Badge className="bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/40 no-default-hover-elevate text-[10px] px-2">
                              Featured
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{area.description}</p>
                          <p className="text-xs text-fuchsia-400/80 mt-2">CCME 2026 Learner Track</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-fuchsia-400 flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card 
                    className="hover-elevate cursor-pointer transition-all duration-300 border-border"
                    data-testid={`card-research-${area.route.replace(/\//g, '-')}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg flex-shrink-0 bg-muted/50">
                          <area.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-foreground truncate">{area.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">{area.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                )}
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
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Organizational Knowledge Systems Case Studies</h2>
              <p className="text-sm text-muted-foreground">Enterprise AI and data solutions</p>
            </div>
          </div>

          <div className="space-y-3">
            {knowledgeSystems.map((system) => {
              const isLive = system.status === "live";
              const cardContent = (
                <Card 
                  key={system.id}
                  className={`transition-all duration-300 ${
                    isLive 
                      ? 'hover-elevate cursor-pointer border-fuchsia-500/30 bg-gradient-to-br from-card to-fuchsia-950/10 opacity-100' 
                      : 'border-border opacity-75'
                  }`}
                  data-testid={`card-oks-${system.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${
                        isLive ? 'bg-fuchsia-500/10' : 'bg-muted/50'
                      }`}>
                        <system.icon className={`w-5 h-5 ${
                          isLive ? 'text-fuchsia-500' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-foreground truncate">{system.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">{system.description}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {isLive ? (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 no-default-hover-elevate text-[10px] px-2">
                            Live
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] border-border text-muted-foreground px-2">
                            Soon
                          </Badge>
                        )}
                        {isLive && <ExternalLink className="w-4 h-4 text-muted-foreground" />}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );

              if (isLive && system.url) {
                return (
                  <a key={system.id} href={system.url} target="_blank" rel="noopener noreferrer">
                    {cardContent}
                  </a>
                );
              }
              return cardContent;
            })}
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
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="mailto:data@robertmccoyprojects.com" 
              className="text-sm text-primary hover:underline"
              data-testid="link-contact-email"
            >
              data@robertmccoyprojects.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
