import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Users, 
  ClipboardCheck, 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  FileCheck,
  CheckCircle2,
  XCircle,
  Download,
  Building2,
  Scale,
  FileText,
  ExternalLink
} from "lucide-react";

interface Application {
  id: string;
  area: string;
  description: string;
  benefits: string;
  examples: string;
  icon: string;
}

interface Policy {
  level: string;
  name: string;
  year: string;
  requirements: string;
  enforcement: string;
}

interface SystemItem {
  id: string;
  category: string;
  description: string;
  examples: string;
  considerations: string;
}

interface Systems {
  prescriptive: SystemItem[];
  proscriptive: SystemItem[];
}

interface Stats {
  applicationAreas: number;
  majorPolicies: number;
  universityExamples: number;
  authoritativeSources: number;
}

const iconMap: Record<string, typeof Users> = {
  "users": Users,
  "clipboard-check": ClipboardCheck,
  "graduation-cap": GraduationCap,
  "layout-dashboard": LayoutDashboard,
  "book-open": BookOpen,
  "file-check": FileCheck,
};

export default function UniversitiesAI() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [systems, setSystems] = useState<Systems | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [policyFilter, setPolicyFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/universities-ai/data/applications.json").then(r => r.json()),
      fetch("/universities-ai/data/policies.json").then(r => r.json()),
      fetch("/universities-ai/data/systems.json").then(r => r.json()),
      fetch("/universities-ai/data/stats.json").then(r => r.json()),
    ]).then(([apps, pols, sys, st]) => {
      setApplications(apps);
      setPolicies(pols);
      setSystems(sys);
      setStats(st);
      setLoading(false);
    }).catch(err => {
      console.error("Failed to load data:", err);
      setLoading(false);
    });
  }, []);

  const filteredPolicies = policyFilter === "all" 
    ? policies 
    : policies.filter(p => p.level === policyFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/10 to-background py-16">
        <div className="max-w-6xl mx-auto px-6">
          <Link href="/" data-testid="link-back-portfolio">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Portfolio
            </Button>
          </Link>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Building2 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="text-page-title">
              AI in U.S. Higher Education
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive analysis of artificial intelligence applications, policies, and governance 
              frameworks across American universities and colleges
            </p>
          </div>

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <Card className="bg-card/50 border-border/50 text-center" data-testid="stat-applications">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary">{stats.applicationAreas}</div>
                  <div className="text-sm text-muted-foreground mt-1">AI Application Areas</div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border/50 text-center" data-testid="stat-policies">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary">{stats.majorPolicies}</div>
                  <div className="text-sm text-muted-foreground mt-1">Major Policies</div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border/50 text-center" data-testid="stat-universities">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary">{stats.universityExamples}</div>
                  <div className="text-sm text-muted-foreground mt-1">University Examples</div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border/50 text-center" data-testid="stat-sources">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary">{stats.authoritativeSources}+</div>
                  <div className="text-sm text-muted-foreground mt-1">Authoritative Sources</div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <section id="applications" className="py-16" data-testid="section-applications">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
            AI Applications in U.S. Universities
          </h2>
          <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            How American institutions leverage AI across the student lifecycle
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {applications.map((app) => {
              const IconComponent = iconMap[app.icon] || FileText;
              return (
                <Card key={app.id} className="border-border/50" data-testid={`card-app-${app.id}`}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{app.area}</CardTitle>
                    </div>
                    <CardDescription>{app.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Benefits</span>
                      <p className="text-sm text-foreground mt-1">{app.benefits}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Examples</span>
                      <p className="text-sm text-foreground mt-1">{app.examples}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="policies" className="py-16 bg-card/30" data-testid="section-policies">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
            Policies & Regulations
          </h2>
          <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            Federal, state, and institutional governance frameworks
          </p>

          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {["all", "Federal", "State", "Institutional"].map((filter) => (
              <Button
                key={filter}
                variant={policyFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setPolicyFilter(filter)}
                data-testid={`btn-filter-${filter.toLowerCase()}`}
              >
                {filter === "all" ? "All" : filter}
              </Button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse" data-testid="table-policies">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Level</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Policy/Regulation</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Year</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Key Requirements</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Enforcement</th>
                </tr>
              </thead>
              <tbody>
                {filteredPolicies.map((policy, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-muted/30" data-testid={`row-policy-${idx}`}>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={policy.level === "Federal" ? "default" : policy.level === "State" ? "secondary" : "outline"}
                      >
                        {policy.level}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{policy.name}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{policy.year}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{policy.requirements}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{policy.enforcement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {systems && (
        <section id="systems" className="py-16" data-testid="section-systems">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
              Prescriptive vs Proscriptive Systems
            </h2>
            <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
              What universities SHOULD and SHOULD NOT do with AI
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <h3 className="text-xl font-semibold text-foreground">Prescriptive (SHOULD DO)</h3>
                </div>
                <div className="space-y-4">
                  {systems.prescriptive.map((item) => (
                    <Card key={item.id} className="border-l-4 border-l-green-500 border-border/50" data-testid={`card-prescriptive-${item.id}`}>
                      <CardContent className="pt-4">
                        <h4 className="font-medium text-foreground mb-1">{item.category}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="text-muted-foreground">Examples: {item.examples}</span>
                        </div>
                        <p className="text-xs text-muted-foreground/70 mt-2 italic">{item.considerations}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-6 h-6 text-red-500" />
                  <h3 className="text-xl font-semibold text-foreground">Proscriptive (SHOULD NOT DO)</h3>
                </div>
                <div className="space-y-4">
                  {systems.proscriptive.map((item) => (
                    <Card key={item.id} className="border-l-4 border-l-red-500 border-border/50" data-testid={`card-proscriptive-${item.id}`}>
                      <CardContent className="pt-4">
                        <h4 className="font-medium text-foreground mb-1">{item.category}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="text-muted-foreground">Examples: {item.examples}</span>
                        </div>
                        <p className="text-xs text-muted-foreground/70 mt-2 italic">{item.considerations}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="resources" className="py-16 bg-card/30" data-testid="section-resources">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
            Resources & References
          </h2>
          <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            Access the full report and additional materials
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-border/50 text-center" data-testid="card-resource-report">
              <CardContent className="pt-6">
                <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-foreground mb-2">Full Report</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  APA7-formatted comprehensive analysis
                </p>
                <Badge variant="secondary">Coming Soon</Badge>
              </CardContent>
            </Card>

            <Card className="border-border/50 text-center" data-testid="card-resource-data">
              <CardContent className="pt-6">
                <LayoutDashboard className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-foreground mb-2">Data Sources</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  CSV files and structured datasets
                </p>
                <Badge variant="secondary">Available</Badge>
              </CardContent>
            </Card>

            <Card className="border-border/50 text-center" data-testid="card-resource-references">
              <CardContent className="pt-6">
                <Scale className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-foreground mb-2">Policy References</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Links to federal and state regulations
                </p>
                <Badge variant="secondary">30+ Sources</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-border/50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            Research compiled from Stanford HAI, Harvard Ethics Center, U.S. Department of Education, 
            and institutional policy documents from leading American universities.
          </p>
        </div>
      </section>
    </div>
  );
}
