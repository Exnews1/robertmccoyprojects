import { useQuery } from "@tanstack/react-query";
import { Framework, ComplianceItem } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, Landmark, BarChart2, CheckCircle2, AlertCircle, Cpu, Activity, Zap, Users, GraduationCap, TrendingUp, FileText, BookOpen, Award, AlertTriangle, Presentation, Eye, ArrowRight, Target, MessageSquare, Layers } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const fundingAllocation = [
  { name: 'Education Benefits', total: 13500, label: '$13.5B' },
  { name: 'Transition Support', total: 140, label: '$140M' },
];

const capabilityTrend = [
  { name: 'Phase 1', compliance: 45, risk: 80 },
  { name: 'Phase 2', compliance: 65, risk: 55 },
  { name: 'Phase 3', compliance: 85, risk: 30 },
  { name: 'Phase 4', compliance: 98, risk: 5 },
];

export default function Home() {
  const { data: frameworks, isLoading: loadingFrameworks } = useQuery<Framework[]>({
    queryKey: ["/api/frameworks"],
  });

  const { data: items, isLoading: loadingItems } = useQuery<ComplianceItem[]>({
    queryKey: ["/api/compliance-items"],
  });

  if (loadingFrameworks || loadingItems) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-12 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <section className="relative overflow-hidden rounded-xl bg-slate-950 border border-primary/30 p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-primary/20 text-primary border-primary/50 no-default-hover-elevate font-mono uppercase tracking-widest text-[10px]">
              <FileText className="w-3 h-3 mr-1" /> 2026 CCME Learner Track 1
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50 no-default-hover-elevate font-mono uppercase tracking-widest text-[10px]">
              <Cpu className="w-3 h-3 mr-1" /> Compliant by Design
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 glow-text tracking-tight leading-tight">
            A Governed, Human-in-the-Loop AI Framework for Military Career Mobility
          </h1>
          <h2 className="text-xl md:text-2xl text-primary font-semibold mb-6 tracking-tight">
            Design, Constraints, and Ethical Tradeoffs
          </h2>
          <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
            <Award className="w-8 h-8 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Robert E. McCoy, MBA, M.S. AI & Data Analytics</p>
              <p className="text-xs text-muted-foreground">Indiana Wesleyan University</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed font-light max-w-3xl mb-6">
            Introducing the <span className="text-primary font-semibold">Career Mobility Governance Framework (CMGF)</span> - a bounded AI architecture that converts individual planning friction into auditable institutional evidence, enabling policy reform and budget reallocation for ~150K annual service member transitions.
          </p>
          <div className="flex flex-wrap gap-6 mt-8">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-primary tracking-tighter">150K+</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Annual Transitions</span>
            </div>
            <div className="w-[1px] h-12 bg-primary/20" />
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-primary tracking-tighter">$13.5B</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Education Spend</span>
            </div>
            <div className="w-[1px] h-12 bg-primary/20" />
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-yellow-400 tracking-tighter">$140M</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Transition Support</span>
            </div>
            <div className="w-[1px] h-12 bg-primary/20" />
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-red-400 tracking-tighter">96:1</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Funding Ratio</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <Activity className="w-full h-full text-primary" />
        </div>
      </section>

      <Card className="high-tech-card border-primary/30">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold tracking-tight" data-testid="text-key-contributions">Six Key Contributions</CardTitle>
              <p className="text-sm text-muted-foreground">What this paper contributes to the field</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary font-mono text-xs">01</span>
                <h4 className="text-sm font-semibold">Structured Synthesis</h4>
              </div>
              <p className="text-xs text-muted-foreground">Peer-reviewed research on credential portability, career mobility, and advising effectiveness organized around CCME Track 1 elements.</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary font-mono text-xs">02</span>
                <h4 className="text-sm font-semibold">Labor Market Evidence</h4>
              </div>
              <p className="text-xs text-muted-foreground">Employers reward attestable, portable credentials and emerging AI fluency when competencies can be verified across boundaries.</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary font-mono text-xs">03</span>
                <h4 className="text-sm font-semibold">Governance Gap Diagnosis</h4>
              </div>
              <p className="text-xs text-muted-foreground">Persistent gaps preventing AI literacy and credential alignment from becoming standardized DoD policy (GAO-24 findings).</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary font-mono text-xs">04</span>
                <h4 className="text-sm font-semibold">AI-Enabled Framework</h4>
              </div>
              <p className="text-xs text-muted-foreground">Human-centered advising framework with demonstration artifacts unifying career direction, education pathways, and learner voice.</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary font-mono text-xs">05</span>
                <h4 className="text-sm font-semibold">Responsible AI Design</h4>
              </div>
              <p className="text-xs text-muted-foreground">Intentional non-use of predictive modeling, automated approvals, and risk scoring as core design mechanism for trust.</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary font-mono text-xs">06</span>
                <h4 className="text-sm font-semibold">Policy-Ready Evidence</h4>
              </div>
              <p className="text-xs text-muted-foreground">Converts individual planning friction into auditable evidence for budget reallocation and transition support reform.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="high-tech-card border-yellow-500/30 bg-yellow-500/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-sm font-bold text-yellow-500 mb-2 uppercase tracking-wider">Bounded AI: What CMGF Explicitly Prohibits</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 text-xs">No Predictive Outcome Modeling</Badge>
                <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 text-xs">No Individual Risk Scoring</Badge>
                <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 text-xs">No Automated Approvals</Badge>
                <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 text-xs">No Optimization Objectives</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                CMGF is limited to explainable translation, rule-based feasibility signals, and de-identified aggregation. Built against EO 14110, NIST AI RMF 1.0, and GAO-24 oversight requirements.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="high-tech-card" data-testid="card-presentation">
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Presentation className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold tracking-tight">CCME 2026 Presentation</CardTitle>
                <p className="text-sm text-muted-foreground">Military Learner Mobility and Career Alignment</p>
              </div>
            </div>
            <Badge className="bg-primary/20 text-primary border-primary/50 no-default-hover-elevate font-mono uppercase tracking-widest text-[10px]">
              The Future Is Now: Educate, Engage, Empower
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-900 border border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider">The Core Question</h4>
                </div>
                <p className="text-sm text-foreground font-medium mb-2">What if career planning were continuous?</p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <span>Career responsibility remains with the service member - supported, not delegated</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <span>Continuous access to informed guidance, not episodic counseling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <span>Career options visible and comparable from day one of service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <span>Planning decisions revisited regularly, informed by policy and labor markets</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-slate-900 border border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider">AI Advisor Assistant</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-3">A bounded AI layer that supports service-member agency without displacing human judgment</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-[10px] border-primary/30 text-primary/80">Explainable Translation</Badge>
                  <Badge variant="outline" className="text-[10px] border-primary/30 text-primary/80">Rule-Based Signals</Badge>
                  <Badge variant="outline" className="text-[10px] border-primary/30 text-primary/80">De-Identified Aggregation</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-900 border border-green-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4 text-green-500" />
                  <h4 className="text-sm font-bold text-green-500 uppercase tracking-wider">ESO Policy Intelligence View</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Education Services Officer dashboard for institutional oversight</p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Aggregated, de-identified service-member signals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Informs education funding and credential policy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Observes systemic patterns, not individual plans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Supports upward reporting across organizational levels</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-slate-900 border border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider">CMGF Architecture</h4>
                </div>
                <p className="text-xs text-muted-foreground">
                  Demonstrates how individual agency and institutional accountability can coexist within a bounded, explainable, non-predictive analytics system.
                </p>
                <div className="mt-3 p-3 rounded bg-primary/5 border border-primary/10">
                  <p className="text-[10px] font-mono text-primary/80 uppercase tracking-wider">
                    All feasibility signals are traceable to specific policy rules and declared constraints
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-transparent border border-primary/20">
            <p className="text-sm text-center font-medium">
              <span className="text-muted-foreground">Core Principle:</span>{" "}
              <span className="text-primary">Career responsibility rests with the individual</span>
              <span className="text-muted-foreground"> - career visibility and clarity are </span>
              <span className="text-primary">institutional obligations</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="high-tech-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono text-primary flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /> CREDENTIAL_ALIGNMENT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tighter mb-1">92% MATCH</div>
            <p className="text-xs text-muted-foreground">Verification of military competencies to civilian standards.</p>
          </CardContent>
        </Card>
        <Card className="high-tech-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono text-primary flex items-center gap-2">
              <Users className="w-4 h-4" /> TRANSITION_ADVISING
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tighter mb-1">BOUNDED AI</div>
            <p className="text-xs text-muted-foreground">Non-predictive decision support for human advisors.</p>
          </CardContent>
        </Card>
        <Card className="high-tech-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono text-primary flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> ECONOMIC_RESILIENCE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tighter mb-1">SCALABLE IMPACT</div>
            <p className="text-xs text-muted-foreground">Converting friction into auditable institutional evidence.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="high-tech-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tighter">
              <Zap className="w-5 h-5 text-primary" />
              GOVERNANCE_CHALLENGES
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <h4 className="text-sm font-bold text-primary mb-1 uppercase tracking-wider">The $13.5B Paradox</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                While over $13.5B is spent annually on education benefits, less than $140M is allocated to transition-specific advising.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <h4 className="text-sm font-bold text-primary mb-1 uppercase tracking-wider">Credential Portability</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Non-portable credentials disrupt alignment across education, employment, and transition timelines.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <h4 className="text-sm font-bold text-primary mb-1 uppercase tracking-wider">AI Literacy Baseline</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Governed AI architectures improve advising clarity and institutional trust relative to autonomous systems.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="high-tech-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tighter">
              <Activity className="w-5 h-5 text-primary" />
              SYSTEM_HEARTBEAT
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">ADVISING_ACCURACY</span>
              <span className="text-xs font-mono text-primary">98.4%</span>
            </div>
            <div className="w-full bg-primary/10 h-1 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[98.4%] shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">GOVERNANCE_ALIGNMENT</span>
              <span className="text-xs font-mono text-primary">100%</span>
            </div>
            <div className="w-full bg-primary/10 h-1 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">LATENCY_VECTOR</span>
              <span className="text-xs font-mono text-primary">12MS</span>
            </div>
            <div className="w-full bg-primary/10 h-1 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[12%] shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            </div>

            <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10 flex items-center gap-3">
              <div className="animate-pulse w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em]">All Systems Nominal // Bounded AI Active</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="high-tech-card min-h-[400px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-primary" />
              CAPABILITY_EVOLUTION_VECTOR
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={capabilityTrend}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.3)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255, 255, 255, 0.3)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.9)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--primary))', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="compliance" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="high-tech-card min-h-[400px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-primary" />
              FUNDING_ASYMMETRY_ANALYSIS
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fundingAllocation} layout="vertical" margin={{ left: 20, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="rgba(255, 255, 255, 0.5)" fontSize={10} width={120} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.9)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px' }}
                  formatter={(value: number) => [`$${value >= 1000 ? (value/1000).toFixed(1) + 'B' : value + 'M'}`, 'Allocation']}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card id="analysis" className="high-tech-card">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart2 className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-black tracking-tighter">FRAMEWORK_GAP_ANALYSIS</CardTitle>
          </div>
          <p className="text-muted-foreground font-light max-w-2xl text-sm">
            Mapping technical implementation to the Career Mobility Governance Framework (CMGF) requirements.
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-primary/10 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-primary/10">
                  <TableHead className="w-[300px] font-mono text-[10px] uppercase tracking-widest py-4">REQM_ID</TableHead>
                  <TableHead className="font-mono text-[10px] uppercase tracking-widest py-4">IMPLEMENTATION</TableHead>
                  <TableHead className="font-mono text-[10px] uppercase tracking-widest py-4">IMPACT_VECTOR</TableHead>
                  <TableHead className="text-right font-mono text-[10px] uppercase tracking-widest py-4">STATUS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.map((item) => (
                  <TableRow key={item.id} className="hover:bg-primary/5 transition-colors border-primary/5">
                    <TableCell className="font-medium align-top py-6">
                      <div className="text-foreground text-sm font-semibold">{item.requirement}</div>
                      <div className="flex gap-2 mt-4">
                        {item.tags?.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[9px] px-2 py-0 border-primary/20 text-primary/70 font-mono">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="align-top py-6 text-muted-foreground text-sm leading-relaxed">{item.designChoice}</TableCell>
                    <TableCell className="align-top py-6 text-muted-foreground text-xs leading-relaxed font-light">{item.strategicAdvantage}</TableCell>
                    <TableCell className="text-right align-top py-6">
                      <div className="flex items-center justify-end gap-3">
                        <span className={`text-[10px] font-mono uppercase tracking-widest ${item.status === "Fully Compliant" ? 'text-green-400' : 'text-yellow-400'}`}>
                          {item.status}
                        </span>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.status === "Fully Compliant" ? 'bg-green-500' : 'bg-yellow-500'} shadow-[0_0_8px_currentColor]`} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
