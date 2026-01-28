import { useEffect, useState } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, Shield, Award, GraduationCap, 
  Briefcase, Building2, User, CheckCircle2, Building,
  AlertTriangle, Monitor, Globe, Bot
} from "lucide-react";
import { SiLinkedin } from "react-icons/si";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProfileData {
  profile: {
    name: string;
    roles: string[];
    positioning_statement: string;
    engagement_modes: string[];
    reading_guidance: string[];
  };
  systems_worked_inside: SystemData[];
}

interface SystemData {
  system_id: string;
  title: string;
  description: string;
  evidence_anchors: string[];
  context_organizations: string[];
  signals: string[];
}

const systemIcons: Record<string, typeof Shield> = {
  safety_critical_mechanical: AlertTriangle,
  engineering_certification: Award,
  monitoring_human_machine: Monitor,
  global_operations: Globe,
  adult_learning: GraduationCap,
  governed_ai: Bot,
  high_trust_military: Shield,
};

const systemColors: Record<string, string> = {
  safety_critical_mechanical: "#E74C3C",
  engineering_certification: "#9B59B6",
  monitoring_human_machine: "#3498DB",
  global_operations: "#F77F00",
  adult_learning: "#06A77D",
  governed_ai: "#7B68EE",
  high_trust_military: "#2C3E50",
};

export default function Profile() {
  const [systemsData, setSystemsData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/profile-data.json")
      .then((res) => res.json())
      .then((json) => {
        setSystemsData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load profile data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="link-back-portfolio">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Portfolio
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Author's Profile</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <section data-testid="section-author-bio" className="mb-16">
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-8">About the Author</h2>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-2xl font-bold text-foreground" data-testid="text-author-name">Robert E. McCoy</h3>
              <p className="text-muted-foreground leading-relaxed">
                Robert McCoy is a lifelong servant-leader, aerospace executive, and education advocate whose career spans over five decades across military, engineering, and community leadership. With a foundation forged in both the United States Army and Navy, Robert has built a legacy of mission-driven leadership, technical excellence, and a deep commitment to empowering others through education and second chances.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                He served over 21 years in the U.S. military, including nine and a half years on active duty, holding roles as a Sonar Technician in the Navy and later as a Chief Warrant Officer and Aviator in the Army. His assignments included work on Presidential Support Staff.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Following his military service, Robert transitioned into the aerospace and defense sector, contributing to programs like the F-35 Joint Strike Fighter and NASA's Martian Lander. As Director of Operations for Belcan Corporation, he oversaw more than $42 million in annual contracts.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, Robert serves as the Military Partnership Executive at Indiana Wesleyan University, where he builds strategic education and workforce initiatives that connect veterans with high-demand careers in STEM, aerospace, and emerging technologies. He also serves on the board of the MidSouth Advisory Council on Military Education.
              </p>
            </div>
            
            <div className="space-y-6">
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-primary flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Credentials
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>M.S. Artificial Intelligence & Data Analytics</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>MBA</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>B.S. Aeronautics</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-primary flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Military Service
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>21+ Years Combined Service</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>U.S. Army Chief Warrant Officer, Aviator</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>U.S. Navy Sonar Technician</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Presidential Support Staff</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-primary flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Current Role
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Military Partnership Executive</p>
                  <p className="text-primary">Indiana Wesleyan University</p>
                </CardContent>
              </Card>

              <Card className="border-primary/30 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-primary flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Advisory Roles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Board Member, MidSouth Advisory Council on Military Education</span>
                  </div>
                </CardContent>
              </Card>

              <div className="pt-2">
                <a 
                  href="https://www.linkedin.com/in/robert-mccoy-mba-9451142a0/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-linkedin"
                >
                  <SiLinkedin className="w-4 h-4" />
                  <span>LinkedIn Profile</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-muted-foreground">Loading systems profile...</div>
          </div>
        ) : systemsData ? (
          <section className="pt-8 border-t border-border" data-testid="section-systems">
            <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Systems Worked Inside</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Experience organized around the systems and contexts that shaped judgment, not job titles
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {systemsData.systems_worked_inside.map((system) => {
                const Icon = systemIcons[system.system_id] || Shield;
                const color = systemColors[system.system_id] || "#7B68EE";
                
                return (
                  <Card 
                    key={system.system_id} 
                    className="p-6 hover-elevate"
                    data-testid={`system-card-${system.system_id}`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div 
                        className="w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg leading-tight mb-1">{system.title}</h3>
                        <p className="text-sm text-muted-foreground">{system.description}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        Evidence Anchors
                      </h4>
                      <ul className="space-y-1.5">
                        {system.evidence_anchors.map((anchor, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                            <span>{anchor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        Context Organizations
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {system.context_organizations.map((org, index) => (
                          <div key={index} className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                            <Building className="w-3 h-3" />
                            {org}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        Signals
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {system.signals.map((signal, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-xs"
                            style={{ borderColor: `${color}50`, color }}
                          >
                            {signal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
