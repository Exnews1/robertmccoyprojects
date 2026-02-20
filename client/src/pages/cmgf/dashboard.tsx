import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CMGFNav } from "@/components/cmgf-nav";
import {
  ChevronRight, FileText, Database, Shield, BookOpen,
  BarChart3, Users, Download, Eye, Search, Layers,
  Activity, CheckCircle, XCircle, User, Cpu,
  Filter, ExternalLink, ArrowUpDown, ChevronDown, ChevronUp,
  TrendingUp, Calendar, Tag, X
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
  AreaChart, Area
} from "recharts";
import type { ComplianceItem, Framework, LibraryEntry } from "@shared/schema";

const CHART_COLORS = [
  "hsl(210, 70%, 50%)", "hsl(260, 50%, 55%)", "hsl(200, 70%, 50%)",
  "hsl(150, 50%, 45%)", "hsl(30, 70%, 50%)", "hsl(340, 60%, 50%)",
  "hsl(180, 50%, 45%)", "hsl(45, 70%, 50%)"
];

const PILLAR_SHORT: Record<string, string> = {
  "Pillar 1: Military Learner Career Mobility": "P1: Career Mobility",
  "Pillar 2: Empowerment Strategies & Stackable Pathways": "P2: Stackable Pathways",
  "Pillar 3: ISR & AI-Assisted Career Advising": "P3: AI Advising",
  "Pillar 4: Translating Military Experience": "P4: Translation",
  "Pillar 5: Veteran & Servicemember Learner Voice": "P5: Learner Voice",
};

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  borderColor: "hsl(var(--border))",
  borderRadius: "6px",
  color: "hsl(var(--foreground))",
};

export default function Dashboard() {
  const { data: frameworks, isLoading: fwLoading } = useQuery<Framework[]>({ queryKey: ["/api/frameworks"] });
  const { data: complianceItems, isLoading: ciLoading } = useQuery<ComplianceItem[]>({ queryKey: ["/api/compliance-items"] });
  const { data: library, isLoading: libLoading } = useQuery<LibraryEntry[]>({ queryKey: ["/api/library"] });
  const { data: stats } = useQuery<Record<string, number>>({ queryKey: ["/api/stats"] });

  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [pillarFilter, setPillarFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<"year" | "title">("year");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedSource, setSelectedSource] = useState<LibraryEntry | null>(null);
  const [selectedCompliance, setSelectedCompliance] = useState<ComplianceItem | null>(null);

  const isLoading = fwLoading || ciLoading || libLoading;

  const totalLibrary = library?.length ?? 0;
  const totalCompliance = complianceItems?.length ?? 0;
  const compliantCount = complianceItems?.filter(i => i.status === "Fully Compliant").length ?? 0;
  const compliancePercent = totalCompliance > 0 ? Math.round((compliantCount / totalCompliance) * 100) : 0;

  const pillarCounts = useMemo(() => {
    if (!library) return [];
    const counts: Record<string, number> = {};
    library.forEach(entry => {
      entry.topics?.forEach(t => { counts[t] = (counts[t] || 0) + 1; });
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, short: PILLAR_SHORT[name] || name, count }))
      .sort((a, b) => b.count - a.count);
  }, [library]);

  const yearDistribution = useMemo(() => {
    if (!library) return [];
    const counts: Record<number, number> = {};
    library.forEach(e => { if (e.year) counts[e.year] = (counts[e.year] || 0) + 1; });
    return Object.entries(counts)
      .map(([y, c]) => ({ year: parseInt(y), count: c }))
      .sort((a, b) => a.year - b.year);
  }, [library]);

  const typeDistribution = useMemo(() => {
    if (!library) return [];
    const counts: Record<string, number> = {};
    library.forEach(e => { counts[e.documentType] = (counts[e.documentType] || 0) + 1; });
    return Object.entries(counts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }, [library]);

  const allPillars = useMemo(() => pillarCounts.map(p => p.name), [pillarCounts]);
  const allYears = useMemo(() => yearDistribution.map(y => String(y.year)), [yearDistribution]);
  const allTypes = useMemo(() => typeDistribution.map(t => t.type), [typeDistribution]);

  const filteredLibrary = useMemo(() => {
    if (!library) return [];
    let results = [...library];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.authors?.toLowerCase().includes(q) ||
        e.summary?.toLowerCase().includes(q) ||
        e.organization?.toLowerCase().includes(q)
      );
    }
    if (pillarFilter !== "all") {
      results = results.filter(e => e.topics?.includes(pillarFilter));
    }
    if (yearFilter !== "all") {
      results = results.filter(e => String(e.year) === yearFilter);
    }
    if (typeFilter !== "all") {
      results = results.filter(e => e.documentType === typeFilter);
    }

    results.sort((a, b) => {
      if (sortField === "year") {
        const ay = a.year ?? 0, by = b.year ?? 0;
        return sortDir === "desc" ? by - ay : ay - by;
      }
      return sortDir === "desc"
        ? b.title.localeCompare(a.title)
        : a.title.localeCompare(b.title);
    });
    return results;
  }, [library, searchQuery, pillarFilter, yearFilter, typeFilter, sortField, sortDir]);

  const filteredPillarChart = useMemo(() => {
    if (pillarFilter !== "all") return pillarCounts.filter(p => p.name === pillarFilter);
    return pillarCounts;
  }, [pillarCounts, pillarFilter]);

  const filteredYearChart = useMemo(() => {
    if (yearFilter !== "all") return yearDistribution.filter(y => String(y.year) === yearFilter);
    if (pillarFilter !== "all" && library) {
      const counts: Record<number, number> = {};
      library
        .filter(e => e.topics?.includes(pillarFilter))
        .forEach(e => { if (e.year) counts[e.year] = (counts[e.year] || 0) + 1; });
      return Object.entries(counts)
        .map(([y, c]) => ({ year: parseInt(y), count: c }))
        .sort((a, b) => a.year - b.year);
    }
    return yearDistribution;
  }, [yearDistribution, yearFilter, pillarFilter, library]);

  const clearFilters = () => {
    setSearchQuery("");
    setPillarFilter("all");
    setYearFilter("all");
    setTypeFilter("all");
  };

  const hasActiveFilters = searchQuery || pillarFilter !== "all" || yearFilter !== "all" || typeFilter !== "all";

  const handleExportCSV = () => {
    const headers = ["Title", "Authors", "Year", "Type", "Topics", "URL"];
    const rows = filteredLibrary.map(e => [
      `"${(e.title || "").replace(/"/g, '""')}"`,
      `"${(e.authors || "").replace(/"/g, '""')}"`,
      e.year || "",
      e.documentType,
      `"${(e.topics || []).join("; ")}"`,
      e.url || ""
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cmgf_research_library_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSort = (field: "year" | "title") => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir(field === "year" ? "desc" : "asc");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <CMGFNav />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="space-y-4">
            <div className="h-8 w-64 bg-muted animate-pulse rounded-md" />
            <div className="h-4 w-96 bg-muted animate-pulse rounded-md" />
            <div className="grid grid-cols-4 gap-4 mt-8">
              {[1,2,3,4].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-md" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CMGFNav />
      <div className="max-w-7xl mx-auto px-6 py-6">
        <nav className="mb-6 text-sm flex items-center flex-wrap gap-1">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Portfolio</Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link href="/cmgf" className="text-muted-foreground hover:text-primary transition-colors">CMGF</Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">Executive Dashboard</span>
        </nav>

        <header className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-dashboard-title">Executive Dashboard</h1>
          <p className="text-muted-foreground">
            Interactive system overview — filter, search, drill down into compliance items and {totalLibrary.toLocaleString()} research sources.
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList data-testid="dashboard-tabs">
            <TabsTrigger value="overview" data-testid="tab-overview">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="compliance" data-testid="tab-compliance">
              <Shield className="w-4 h-4 mr-2" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="research" data-testid="tab-research">
              <Database className="w-4 h-4 mr-2" />
              Research Library
            </TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="section-overview-metrics">
              {[
                { label: "Research Sources", value: totalLibrary, icon: Database, color: "text-blue-500", bg: "bg-blue-500/10" },
                { label: "Compliance Items", value: totalCompliance, icon: Shield, color: "text-green-500", bg: "bg-green-500/10" },
                { label: "Frameworks", value: frameworks?.length ?? 0, icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10" },
                { label: "Site Visits", value: stats?.root_visits ?? 0, icon: Eye, color: "text-orange-500", bg: "bg-orange-500/10" },
              ].map(m => (
                <Card key={m.label} className="hover-elevate cursor-pointer" onClick={() => {
                  if (m.label === "Research Sources") setActiveTab("research");
                  else if (m.label === "Compliance Items") setActiveTab("compliance");
                  else if (m.label === "Frameworks") setActiveTab("compliance");
                }} data-testid={`metric-card-${m.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-md ${m.bg}`}>
                        <m.icon className={`w-4 h-4 ${m.color}`} />
                      </div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">{m.label}</span>
                    </div>
                    <p className="text-3xl font-bold text-foreground">{m.value.toLocaleString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Research by Pillar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={pillarCounts} layout="vertical" margin={{ left: 0, right: 10 }}>
                        <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis type="category" dataKey="short" width={120} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]} cursor="pointer"
                          onClick={(data: any) => { setPillarFilter(data.name); setActiveTab("research"); }}>
                          {pillarCounts.map((_, idx) => (
                            <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Click a bar to filter the Research Library by that pillar.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Publications by Year</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={yearDistribution} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="year" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area type="monotone" dataKey="count" stroke="hsl(210, 70%, 50%)" fill="hsl(210, 70%, 50%)" fillOpacity={0.15} strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Click a year below to drill into that year's sources.</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {yearDistribution.slice(-6).map(y => (
                      <Badge key={y.year} variant="outline" className="cursor-pointer text-xs"
                        onClick={() => { setYearFilter(String(y.year)); setActiveTab("research"); }}
                        data-testid={`year-chip-${y.year}`}>
                        {y.year} ({y.count})
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">System Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Site Visits", value: stats?.root_visits ?? 0, icon: Eye },
                      { label: "Demo Launches", value: stats?.demo_launches ?? 0, icon: Activity },
                      { label: "Paper Downloads", value: stats?.paper_downloads ?? 0, icon: Download },
                      { label: "CMGF Visits", value: stats?.cmgf_visits ?? 0, icon: Search },
                    ].map(m => (
                      <div key={m.label} className="text-center p-3">
                        <m.icon className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                        <p className="text-2xl font-bold text-foreground">{m.value.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Compliant", value: compliantCount },
                              { name: "Other", value: totalCompliance - compliantCount },
                            ]}
                            cx="50%" cy="50%" innerRadius={35} outerRadius={50}
                            dataKey="value" strokeWidth={2} stroke="hsl(var(--background))"
                          >
                            <Cell fill="hsl(150, 60%, 45%)" />
                            <Cell fill="hsl(var(--muted))" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-foreground">{compliancePercent}%</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    {compliantCount} of {totalCompliance} items fully compliant
                  </p>
                  <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => setActiveTab("compliance")} data-testid="button-view-compliance">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Compliance Matrix</h2>
                <p className="text-sm text-muted-foreground">{totalCompliance} items across {frameworks?.length ?? 0} frameworks</p>
              </div>
            </div>

            {frameworks?.map(fw => {
              const fwItems = complianceItems?.filter(ci => ci.frameworkId === fw.id) || [];
              return (
                <Card key={fw.id} data-testid={`compliance-framework-${fw.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-primary/10">
                          <Shield className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{fw.name}</CardTitle>
                          <p className="text-xs text-muted-foreground">{fw.year} — {fw.description}</p>
                        </div>
                      </div>
                      <Badge variant={fwItems.every(i => i.status === "Fully Compliant") ? "default" : "outline"}>
                        {fwItems.filter(i => i.status === "Fully Compliant").length}/{fwItems.length} Compliant
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {fwItems.map(item => (
                        <div
                          key={item.id}
                          className="p-4 rounded-md border border-border/50 hover-elevate cursor-pointer"
                          onClick={() => setSelectedCompliance(item)}
                          data-testid={`compliance-item-${item.id}`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                {item.status === "Fully Compliant" ? (
                                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                ) : (
                                  <Activity className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                                )}
                                <Badge variant={item.status === "Fully Compliant" ? "default" : "outline"} className="text-xs">
                                  {item.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-foreground mt-1 line-clamp-2">{item.requirement}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                          </div>
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  Architectural Prohibitions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { prohibition: "No predictive outcome modeling", rationale: "Prevents deterministic sorting of individuals based on predicted futures." },
                    { prohibition: "No individual risk scoring", rationale: "Eliminates surveillance-based classification of service members." },
                    { prohibition: "No automated approvals", rationale: "All decisions require human review and justification." },
                    { prohibition: "No autonomous decision-making", rationale: "AI serves as infrastructure, not authority." },
                    { prohibition: "No individual profiling", rationale: "Data aggregation is de-identified; no individual behavior tracking." },
                  ].map(p => (
                    <div key={p.prohibition} className="p-3 rounded-md border border-red-500/20 bg-red-500/5">
                      <div className="flex items-center gap-2 mb-1">
                        <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground">{p.prohibition}</span>
                      </div>
                      <p className="text-xs text-muted-foreground ml-6">{p.rationale}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="research" className="space-y-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Research Library</h2>
                <p className="text-sm text-muted-foreground">
                  {filteredLibrary.length.toLocaleString()} of {totalLibrary.toLocaleString()} sources
                  {hasActiveFilters && " (filtered)"}
                </p>
              </div>
              <div className="flex gap-2">
                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
                    <X className="w-3.5 h-3.5 mr-1" />
                    Clear Filters
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleExportCSV} data-testid="button-export-csv">
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Export CSV
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search titles, authors, summaries..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-9"
                      data-testid="input-search-library"
                    />
                  </div>
                  <Select value={pillarFilter} onValueChange={setPillarFilter}>
                    <SelectTrigger className="w-full md:w-52" data-testid="select-pillar-filter">
                      <Layers className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                      <SelectValue placeholder="All Pillars" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Pillars</SelectItem>
                      {allPillars.map(p => (
                        <SelectItem key={p} value={p}>{PILLAR_SHORT[p] || p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-full md:w-36" data-testid="select-year-filter">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                      <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {allYears.slice().reverse().map(y => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full md:w-44" data-testid="select-type-filter">
                      <Tag className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {allTypes.map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {hasActiveFilters && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Filtered: Pillar Distribution</p>
                    <div className="h-36">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={filteredPillarChart} layout="vertical" margin={{ left: 0, right: 10 }}>
                          <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                          <YAxis type="category" dataKey="short" width={110} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                            {filteredPillarChart.map((_, idx) => (
                              <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Filtered: Year Distribution</p>
                    <div className="h-36">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={filteredYearChart} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                          <XAxis dataKey="year" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                          <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Area type="monotone" dataKey="count" stroke="hsl(210, 70%, 50%)" fill="hsl(210, 70%, 50%)" fillOpacity={0.15} strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3">
                          <button className="flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground"
                            onClick={() => toggleSort("title")} data-testid="button-sort-title">
                            Title
                            <ArrowUpDown className="w-3 h-3" />
                          </button>
                        </th>
                        <th className="text-left p-3 hidden md:table-cell">
                          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Authors</span>
                        </th>
                        <th className="text-left p-3">
                          <button className="flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground"
                            onClick={() => toggleSort("year")} data-testid="button-sort-year">
                            Year
                            <ArrowUpDown className="w-3 h-3" />
                          </button>
                        </th>
                        <th className="text-left p-3 hidden lg:table-cell">
                          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Type</span>
                        </th>
                        <th className="text-left p-3 hidden lg:table-cell">
                          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Pillars</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLibrary.slice(0, 50).map(entry => (
                        <tr key={entry.id}
                          className="border-b border-border/30 hover-elevate cursor-pointer"
                          onClick={() => setSelectedSource(entry)}
                          data-testid={`source-row-${entry.id}`}
                        >
                          <td className="p-3">
                            <span className="text-foreground font-medium line-clamp-2">{entry.title}</span>
                          </td>
                          <td className="p-3 hidden md:table-cell">
                            <span className="text-muted-foreground line-clamp-1 text-xs">{entry.authors || "—"}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-muted-foreground">{entry.year || "—"}</span>
                          </td>
                          <td className="p-3 hidden lg:table-cell">
                            <Badge variant="outline" className="text-[10px]">{entry.documentType}</Badge>
                          </td>
                          <td className="p-3 hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {entry.topics?.slice(0, 2).map(t => (
                                <Badge key={t} variant="outline" className="text-[10px]">{PILLAR_SHORT[t] || t}</Badge>
                              ))}
                              {(entry.topics?.length ?? 0) > 2 && (
                                <Badge variant="outline" className="text-[10px]">+{(entry.topics?.length ?? 0) - 2}</Badge>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredLibrary.length > 50 && (
                  <div className="p-3 text-center border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Showing 50 of {filteredLibrary.length.toLocaleString()} results. Refine your filters to see more specific results.
                    </p>
                  </div>
                )}
                {filteredLibrary.length === 0 && (
                  <div className="p-8 text-center">
                    <Search className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No sources match your filters.</p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={clearFilters}>Clear Filters</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">Research Analytics</h2>
              <p className="text-sm text-muted-foreground">Deep analysis of the {totalLibrary.toLocaleString()}-source research foundation</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Publication Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={yearDistribution} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="year" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area type="monotone" dataKey="count" stroke="hsl(210, 70%, 50%)" fill="hsl(210, 70%, 50%)" fillOpacity={0.15} strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Source Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={typeDistribution.slice(0, 6)} cx="50%" cy="50%"
                          innerRadius={55} outerRadius={85} dataKey="count"
                          strokeWidth={2} stroke="hsl(var(--background))"
                          label={({ type, count }) => `${type}: ${count}`}
                          labelLine={false}>
                          {typeDistribution.slice(0, 6).map((_, idx) => (
                            <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Pillar Coverage Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pillarCounts.map((p, i) => {
                      const maxCount = pillarCounts[0]?.count ?? 1;
                      const pct = Math.round((p.count / maxCount) * 100);
                      return (
                        <div key={p.name}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-foreground">{p.short}</span>
                            <span className="text-xs text-muted-foreground">{p.count} sources</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 p-3 rounded-md bg-muted/50">
                    <p className="text-xs text-muted-foreground">
                      Coverage gap: {pillarCounts.length > 0
                        ? `${pillarCounts[pillarCounts.length - 1].short} has ${pillarCounts[0].count - pillarCounts[pillarCounts.length - 1].count} fewer sources than ${pillarCounts[0].short}`
                        : "No data available"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Document Type Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {typeDistribution.map(t => (
                      <div key={t.type}
                        className="flex items-center justify-between p-2 rounded-md hover-elevate cursor-pointer"
                        onClick={() => { setTypeFilter(t.type); setActiveTab("research"); }}
                        data-testid={`type-drill-${t.type.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-sm text-foreground">{t.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{t.count}</span>
                          <Badge variant="outline" className="text-[10px]">
                            {totalLibrary > 0 ? Math.round((t.count / totalLibrary) * 100) : 0}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedSource} onOpenChange={() => setSelectedSource(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" data-testid="dialog-source-detail">
          {selectedSource && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg leading-snug pr-6">{selectedSource.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {selectedSource.authors && (
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Authors</p>
                    <p className="text-sm text-foreground">{selectedSource.authors}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-4">
                  {selectedSource.year && (
                    <div>
                      <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Year</p>
                      <p className="text-sm text-foreground">{selectedSource.year}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Type</p>
                    <Badge variant="outline">{selectedSource.documentType}</Badge>
                  </div>
                  {selectedSource.organization && (
                    <div>
                      <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Source</p>
                      <p className="text-sm text-foreground">{selectedSource.organization}</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Summary</p>
                  <p className="text-sm text-foreground leading-relaxed">{selectedSource.summary}</p>
                </div>
                {selectedSource.topics && selectedSource.topics.length > 0 && (
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Pillars</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSource.topics.map(t => (
                        <Badge key={t} variant="outline">{PILLAR_SHORT[t] || t}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedSource.url && (
                  <Button variant="outline" size="sm" asChild data-testid="button-source-link">
                    <a href={selectedSource.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5 mr-1" />
                      View Source
                    </a>
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedCompliance} onOpenChange={() => setSelectedCompliance(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" data-testid="dialog-compliance-detail">
          {selectedCompliance && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg leading-snug pr-6">Compliance Item Detail</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {selectedCompliance.status === "Fully Compliant" ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Activity className="w-5 h-5 text-yellow-500" />
                  )}
                  <Badge variant={selectedCompliance.status === "Fully Compliant" ? "default" : "outline"}>
                    {selectedCompliance.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Requirement</p>
                  <p className="text-sm text-foreground leading-relaxed">{selectedCompliance.requirement}</p>
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Design Choice</p>
                  <p className="text-sm text-foreground leading-relaxed">{selectedCompliance.designChoice}</p>
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Strategic Advantage</p>
                  <p className="text-sm text-foreground leading-relaxed">{selectedCompliance.strategicAdvantage}</p>
                </div>
                {selectedCompliance.tags && selectedCompliance.tags.length > 0 && (
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCompliance.tags.map(tag => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
