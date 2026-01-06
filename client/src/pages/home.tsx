import { useQuery } from "@tanstack/react-query";
import { Framework, ComplianceItem } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, Landmark, BarChart2, CheckCircle2, AlertCircle, Cpu, Activity, Zap, Users, GraduationCap, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const mockChartData = [
  { name: 'Q1', value: 45, risk: 60 },
  { name: 'Q2', value: 55, risk: 50 },
  { name: 'Q3', value: 75, risk: 35 },
  { name: 'Q4', value: 85, risk: 20 },
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
        <div className="relative z-10 max-w-3xl">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/50 no-default-hover-elevate font-mono uppercase tracking-widest text-[10px]">
            <Cpu className="w-3 h-3 mr-1" /> Human-in-the-Loop Governance
          </Badge>
          <h2 className="text-6xl font-black mb-6 glow-text tracking-tighter leading-[0.9]">
            GOVERNED AI FOR <br/>
            <span className="text-primary italic">MILITARY MOBILITY</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed font-light max-w-xl">
            A Response to the 2026 CCME Learner Track. Design, Constraints, and Ethical Tradeoffs 
            for the next generation of military-to-civilian transition systems.
          </p>
          <div className="flex gap-4 mt-8">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-primary tracking-tighter">150K+</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Annual Transitions</span>
            </div>
            <div className="w-[1px] h-10 bg-primary/20 mx-2" />
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-primary tracking-tighter">$13.5B</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Education Spend</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <Activity className="w-full h-full text-primary" />
        </div>
      </section>

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
              SYSTEM_CAPABILITY_VECTOR
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
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
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="high-tech-card min-h-[400px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-primary" />
              RISK_MITIGATION_ANALYSIS
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.3)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255, 255, 255, 0.3)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.9)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px' }}
                />
                <Bar dataKey="risk" fill="rgba(239, 68, 68, 0.6)" radius={[4, 4, 0, 0]} />
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
