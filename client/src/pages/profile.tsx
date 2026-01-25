import { useEffect, useState } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, Shield, Award, Monitor, Globe, GraduationCap, Bot, 
  Users, Building, CheckCircle2, Briefcase, MessageSquare, BookOpen,
  Cog, AlertTriangle, Eye
} from "lucide-react";
import { Card } from "@/components/ui/card";
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
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/profile-data.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load profile data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Failed to load profile data.</div>
      </div>
    );
  }

  const { profile, systems_worked_inside } = data;

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
            <Eye className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Systems Profile</span>
          </div>
        </div>
      </div>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-profile-name">
            {profile.name}
          </h1>
          
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {profile.roles.map((role, index) => (
              <Badge key={index} variant="secondary" className="text-sm px-3 py-1" data-testid={`badge-role-${index}`}>
                {role}
              </Badge>
            ))}
          </div>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed" data-testid="text-positioning">
            {profile.positioning_statement}
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {profile.engagement_modes.map((mode, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground bg-card px-4 py-2 rounded-md border border-border">
                {index === 0 && <MessageSquare className="w-4 h-4 text-primary" />}
                {index === 1 && <BookOpen className="w-4 h-4 text-primary" />}
                {index === 2 && <Cog className="w-4 h-4 text-primary" />}
                {mode}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 px-6 bg-card/50 border-y border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 text-center">
            How to Read This Profile
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {profile.reading_guidance.map((guidance, index) => (
              <div key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>{guidance}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Systems Worked Inside</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Experience organized around the systems and contexts that shaped judgment, not job titles
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {systems_worked_inside.map((system) => {
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
        </div>
      </section>

      <section className="py-16 px-6 bg-card/50 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-6">
            Interested in consulting, teaching, or systems review? Let's discuss how I can help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/#inquiry">
              <Button size="lg" data-testid="button-inquiry">
                <MessageSquare className="w-4 h-4 mr-2" />
                Submit an Inquiry
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" data-testid="button-view-portfolio">
                <Briefcase className="w-4 h-4 mr-2" />
                View Portfolio
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
