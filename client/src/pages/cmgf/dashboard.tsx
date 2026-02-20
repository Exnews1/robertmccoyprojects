import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CMGFNav } from "@/components/cmgf-nav";
import {
  ChevronRight, FileText, Database, Shield, BookOpen,
  BarChart3, Users, Download, Eye, Search, Layers,
  ArrowRight, Activity, CheckCircle, XCircle, User, Cpu
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const CHART_COLORS = ["hsl(210, 70%, 50%)", "hsl(260, 50%, 55%)", "hsl(200, 70%, 50%)", "hsl(150, 50%, 45%)", "hsl(30, 70%, 50%)"];

const pillarLabels: Record<string, string> = {
  "Pillar 1: Military Learner Career Mobility": "P1: Career Mobility",
  "Pillar 2: Empowerment Strategies & Stackable Pathways": "P2: Stackable Pathways",
  "Pillar 3: ISR & AI-Assisted Career Advising": "P3: AI Career Advising",
  "Pillar 4: Translating Military Experience": "P4: Military Translation",
  "Pillar 5: Veteran & Servicemember Learner Voice": "P5: Learner Voice",
};

const architectureLayers = [
  {
    label: "Part A",
    title: "Service Member Interface",
    role: "Individual Agency",
    description: "Explore futures safely without commitment. Exploratory only.",
    icon: User,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Part B",
    title: "AI Mediation Framework",
    role: "Non-authoritative AI",
    description: "Translation, constraint detection, pattern analysis. Advisory only.",
    icon: Cpu,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    label: "Part C",
    title: "Advisory & Human Review",
    role: "Human Judgment",
    description: "All decisions require human review, justification, and audit trails.",
    icon: Users,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
];

export default function Dashboard() {
  const { data: frameworks } = useQuery<any[]>({ queryKey: ["/api/frameworks"] });
  const { data: complianceItems } = useQuery<any[]>({ queryKey: ["/api/compliance-items"] });
  const { data: publications } = useQuery<any[]>({ queryKey: ["/api/publications"] });
  const { data: library } = useQuery<any[]>({ queryKey: ["/api/library"] });
  const { data: stats } = useQuery<Record<string, number>>({ queryKey: ["/api/stats"] });

  const totalPubs = publications?.length ?? 0;
  const totalLibrary = library?.length ?? 0;
  const totalCompliance = complianceItems?.length ?? 0;
  const totalFrameworks = frameworks?.length ?? 0;

  const compliantCount = complianceItems?.filter((i: any) => i.status === "Fully Compliant").length ?? 0;
  const compliancePercent = totalCompliance > 0 ? Math.round((compliantCount / totalCompliance) * 100) : 0;

  const compliancePieData = totalCompliance > 0
    ? [
        { name: "Fully Compliant", value: compliantCount },
        { name: "Other", value: totalCompliance - compliantCount },
      ]
    : [];

  const pillarDistribution = library
    ? (() => {
        const counts: Record<string, number> = {};
        library.forEach((entry: any) => {
          if (entry.topics && Array.isArray(entry.topics)) {
            entry.topics.forEach((t: string) => {
              counts[t] = (counts[t] || 0) + 1;
            });
          }
        });
        return Object.entries(counts)
          .map(([name, count]) => ({
            name: pillarLabels[name] || name,
            fullName: name,
            count,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 7);
      })()
    : [];

  const overviewMetrics = [
    { label: "Publications", value: totalPubs, icon: FileText },
    { label: "Library Sources", value: totalLibrary, icon: Database },
    { label: "Compliance Items", value: totalCompliance, icon: Shield },
    { label: "Frameworks", value: totalFrameworks, icon: BookOpen },
  ];

  const activityMetrics = [
    { label: "Site Visits", value: stats?.root_visits ?? 0, icon: Eye },
    { label: "Demo Launches", value: stats?.demo_launches ?? 0, icon: Activity },
    { label: "Paper Downloads", value: stats?.paper_downloads ?? 0, icon: Download },
    { label: "CMGF Visits", value: stats?.cmgf_visits ?? 0, icon: Search },
  ];

  return (
    <div className="min-h-screen bg-background">
      <CMGFNav />
      <div className="max-w-6xl mx-auto px-6 py-6">
        <nav className="mb-8 text-sm flex items-center flex-wrap gap-1">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Portfolio</Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link href="/cmgf" className="text-muted-foreground hover:text-primary transition-colors">CMGF</Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">Executive Dashboard</span>
        </nav>

        <header className="mb-10">
          <Badge variant="outline" className="font-mono text-xs mb-3">Dashboard</Badge>
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-dashboard-title">Executive Dashboard</h1>
          <p className="text-muted-foreground max-w-2xl">
            Aggregate view of the Career Mobility Governance Framework system status, compliance coverage, research foundation, and activity metrics.
          </p>
        </header>

        <section className="mb-10" data-testid="section-system-overview">
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">System Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {overviewMetrics.map((m) => (
              <Card key={m.label} data-testid={`metric-${m.label.toLowerCase().replace(/\s+/g, '-')}`}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      <m.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{m.label}</span>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{m.value.toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <section data-testid="section-compliance-coverage">
            <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Compliance Coverage</h2>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-4xl font-bold text-foreground">{compliancePercent}%</p>
                    <p className="text-sm text-muted-foreground">Fully Compliant</p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{compliantCount} of {totalCompliance} items</p>
                  </div>
                </div>
                {compliancePieData.length > 0 && (
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={compliancePieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          dataKey="value"
                          strokeWidth={2}
                          stroke="hsl(var(--background))"
                        >
                          <Cell fill="hsl(150, 60%, 45%)" />
                          <Cell fill="hsl(var(--muted))" />
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "6px",
                            color: "hsl(var(--foreground))",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-foreground">EO 14110 — Safe, Secure, and Trustworthy AI</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-foreground">NIST AI RMF 1.0</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-foreground">DoD Responsible AI Principles</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section data-testid="section-research-foundation">
            <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Research Foundation</h2>
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <p className="text-4xl font-bold text-foreground">{totalLibrary.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Peer-Reviewed Sources (2015–2026)</p>
                </div>
                {pillarDistribution.length > 0 && (
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={pillarDistribution} layout="vertical" margin={{ left: 0, right: 10 }}>
                        <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={130}
                          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "6px",
                            color: "hsl(var(--foreground))",
                          }}
                        />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                          {pillarDistribution.map((_, idx) => (
                            <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>

        <section className="mb-10" data-testid="section-activity">
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">System Activity</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {activityMetrics.map((m) => (
              <Card key={m.label} data-testid={`activity-${m.label.toLowerCase().replace(/\s+/g, '-')}`}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-md bg-muted/50">
                      <m.icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{m.label}</span>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{m.value.toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-10" data-testid="section-architecture">
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Three-Layer Architecture</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {architectureLayers.map((layer) => (
              <Card key={layer.label}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-2 rounded-md ${layer.bg}`}>
                      <layer.icon className={`w-4 h-4 ${layer.color}`} />
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px]">{layer.label}</Badge>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{layer.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">Role: {layer.role}</p>
                  <p className="text-sm text-muted-foreground">{layer.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="mt-4">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                Architectural Prohibitions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  "No predictive outcome modeling",
                  "No individual risk scoring",
                  "No automated approvals",
                  "No autonomous decision-making",
                  "No individual profiling",
                ].map((p) => (
                  <div key={p} className="flex items-center gap-2 text-sm">
                    <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{p}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section data-testid="section-quick-actions">
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button asChild data-testid="button-action-walkthrough">
              <a href="https://cmgfdemo.robertmccoyprojects.com" target="_blank" rel="noopener noreferrer">
                <BookOpen className="w-4 h-4 mr-2" />
                Launch Walkthrough
              </a>
            </Button>
            <Button variant="outline" asChild data-testid="button-action-explorer">
              <Link href="/explorer">
                <Search className="w-4 h-4 mr-2" />
                Reference Explorer
              </Link>
            </Button>
            <Button variant="outline" asChild data-testid="button-action-five-pillars">
              <Link href="/cmgf/five-pillars">
                <Layers className="w-4 h-4 mr-2" />
                Five Pillars
              </Link>
            </Button>
            <Button variant="outline" asChild data-testid="button-action-series">
              <Link href="/cmgf/series">
                <FileText className="w-4 h-4 mr-2" />
                Series 2026
              </Link>
            </Button>
            <Button variant="outline" asChild data-testid="button-action-downloads">
              <Link href="/cmgf/downloads">
                <Download className="w-4 h-4 mr-2" />
                Downloads
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
