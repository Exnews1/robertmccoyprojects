import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2, AlertCircle, Cpu, Activity, Users, GraduationCap, FileText, BookOpen, Award, AlertTriangle, Eye, ArrowRight, Target, MessageSquare, Layers, DollarSign, Scale, FileWarning, Presentation } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const fundingData = [
  { name: 'Education Benefits', value: 13500, label: '$13.5B', color: 'hsl(220, 70%, 55%)' },
  { name: 'Transition Advising', value: 140, label: '$140M', color: 'hsl(300, 50%, 55%)' },
];

export default function Home() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* AUTHOR & TITLE - Front and Center */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-card via-card to-fuchsia-950/20 dark:to-fuchsia-950/20 border border-fuchsia-500/30 p-8 md:p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 via-transparent to-primary/5 pointer-events-none" />
        <div className="relative z-10 text-center">
          <Badge className="bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-300 border-fuchsia-500/30 no-default-hover-elevate font-mono uppercase tracking-widest text-[10px] mb-4">
            <Award className="w-3 h-3 mr-1" /> 2026 CCME Learner Track
          </Badge>
          
          <h1 className="text-2xl md:text-4xl font-bold mb-4 text-foreground tracking-tight leading-tight">
            Career Mobility Governance Framework
          </h1>
          <h2 className="text-lg md:text-xl text-muted-foreground mb-6">
            Bounded AI for Military-to-Civilian Transition Support
          </h2>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Award className="w-5 h-5 text-fuchsia-600 dark:text-fuchsia-400" />
            <span className="text-lg font-semibold text-foreground">Robert E. McCoy</span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            MBA, M.S. AI & Data Analytics | Indiana Wesleyan University
          </p>
          <p className="text-sm mb-6">
            <a href="mailto:robert.mccoy@indwes.edu" className="text-primary hover:underline" data-testid="link-author-email">
              robert.mccoy@indwes.edu
            </a>
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="/attached_assets/Career_Mobility_2026__CCME_1769103378838.docx"
              download
              className="inline-flex items-center gap-2 px-5 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-semibold rounded-lg transition-colors"
              data-testid="hero-download-paper"
            >
              <FileText className="w-4 h-4" />
              Download Paper (DOCX)
            </a>
            <a
              href="/attached_assets/CCME_2026_1767730819889.pdf"
              download
              className="inline-flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors"
              data-testid="hero-download-presentation"
            >
              <Presentation className="w-4 h-4" />
              Download Presentation (PDF)
            </a>
          </div>
        </div>
      </section>

      {/* AUTHOR BIO */}
      <section className="relative overflow-hidden rounded-xl bg-card border border-border p-8" data-testid="section-author-bio">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Badge className="bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-300 border-fuchsia-500/30 no-default-hover-elevate font-mono uppercase tracking-widest text-[10px]">
              <Users className="w-3 h-3 mr-1" /> About the Author
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-bold text-foreground">Robert McCoy</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Robert McCoy is a lifelong servant-leader, aerospace executive, and education advocate whose career spans over five decades across military, engineering, and community leadership. With a foundation forged in both the United States Army and Navy, Robert has built a legacy of mission-driven leadership, technical excellence, and a deep commitment to empowering others through education and second chances.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                He served over 21 years in the U.S. military, including nine and a half years on active duty, holding roles as a Sonar Technician in the Navy and later as a Chief Warrant Officer and Aviator in the Army. His assignments included work on Presidential Support Staff.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Following his military service, Robert transitioned into the aerospace and defense sector, contributing to programs like the F-35 Joint Strike Fighter and NASA's Martian Lander. As Director of Operations for Belcan Corporation, he oversaw more than $42 million in annual contracts.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Today, Robert serves as the Military Partnership Executive at Indiana Wesleyan University, where he builds strategic education and workforce initiatives that connect veterans with high-demand careers in STEM, aerospace, and emerging technologies. He also serves on the board of the MidSouth Advisory Council on Military Education.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Credentials</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <GraduationCap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>M.S. Artificial Intelligence & Data Analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <GraduationCap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>MBA</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <GraduationCap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>B.S. Aeronautics</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <h4 className="text-xs font-bold text-fuchsia-600 dark:text-fuchsia-600 dark:text-fuchsia-400/80 uppercase tracking-wider mb-3">Military Service</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-fuchsia-600 dark:text-fuchsia-600 dark:text-fuchsia-400/80 mt-0.5 flex-shrink-0" />
                    <span>21+ Years Combined Service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-fuchsia-600 dark:text-fuchsia-600 dark:text-fuchsia-400/80 mt-0.5 flex-shrink-0" />
                    <span>U.S. Army Chief Warrant Officer, Aviator</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-fuchsia-600 dark:text-fuchsia-600 dark:text-fuchsia-400/80 mt-0.5 flex-shrink-0" />
                    <span>U.S. Navy Sonar Technician</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-fuchsia-600 dark:text-fuchsia-600 dark:text-fuchsia-400/80 mt-0.5 flex-shrink-0" />
                    <span>Presidential Support Staff</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-3">Current Role</h4>
                <p className="text-sm text-muted-foreground">
                  Military Partnership Executive, Indiana Wesleyan University
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* EXECUTIVE SUMMARY - Problem Bounded */}
      <section className="relative overflow-hidden rounded-xl bg-card border border-border p-8 md:p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Badge className="bg-neutral-800 text-neutral-300 border-border no-default-hover-elevate font-mono uppercase tracking-widest text-[10px]">
              <FileWarning className="w-3 h-3 mr-1" /> Executive Summary
            </Badge>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary tracking-tight">
            The Problem: Military-to-Civilian Transition at Scale
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <h3 className="text-sm font-bold text-neutral-200 uppercase tracking-wider mb-2">Scale of Challenge</h3>
                <p className="text-sm text-muted-foreground">
                  Approximately <span className="text-foreground font-semibold">150,000 service members</span> transition annually from military to civilian careers, each navigating complex credential translation, benefit utilization, and career planning decisions.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-300/80 uppercase tracking-wider mb-2">The Funding Paradox</h3>
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground font-semibold">$13.5 billion</span> spent annually on education benefits, but only <span className="text-foreground font-semibold">$140 million</span> allocated to transition-specific advising - a <span className="text-amber-600 dark:text-amber-300/80 font-bold">96:1 ratio</span> that leaves service members under-supported in translating benefits into career outcomes.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50 border border-primary/20">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Governance Gap</h3>
                <p className="text-sm text-muted-foreground">
                  GAO-24 findings identify persistent gaps in credential portability, AI literacy standards, and systematic policy feedback loops. Individual planning friction generates no institutional learning.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-fuchsia-500/30">
                <h3 className="text-sm font-bold text-fuchsia-600 dark:text-fuchsia-600 dark:text-fuchsia-400/80 uppercase tracking-wider mb-2">The Proposed Solution</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  The <span className="text-foreground font-semibold">Career Mobility Governance Framework (CMGF)</span> - a bounded AI architecture that:
                </p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 text-fuchsia-600 dark:text-fuchsia-600 dark:text-fuchsia-400/80 mt-0.5 flex-shrink-0" />
                    <span>Converts individual planning friction into auditable institutional evidence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 text-fuchsia-600 dark:text-fuchsia-600 dark:text-fuchsia-400/80 mt-0.5 flex-shrink-0" />
                    <span>Supports human advisors without displacing judgment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 text-fuchsia-600 dark:text-fuchsia-600 dark:text-fuchsia-400/80 mt-0.5 flex-shrink-0" />
                    <span>Enables policy reform through de-identified aggregation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 text-fuchsia-600 dark:text-fuchsia-600 dark:text-fuchsia-400/80 mt-0.5 flex-shrink-0" />
                    <span>Maintains full compliance with EO 14110, NIST AI RMF 1.0, GAO oversight</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">Key Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">150K+</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Annual Transitions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-fuchsia-600 dark:text-fuchsia-600 dark:text-fuchsia-400/80">96:1</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Funding Imbalance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">$13.5B</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Education Spend</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-300/80">$140M</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Advising Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FUNDING VISUALIZATION */}
      <Card id="analysis" className="high-tech-card scroll-mt-24">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Scale className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold tracking-tight">Funding Asymmetry Visualization</CardTitle>
              <p className="text-sm text-muted-foreground">The 96:1 ratio between education benefits and transition advising</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fundingData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 100, 120, 0.15)" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="rgba(200, 200, 210, 0.4)" fontSize={10} tickFormatter={(value) => `$${value >= 1000 ? (value/1000).toFixed(1) + 'B' : value + 'M'}`} />
                <YAxis type="category" dataKey="name" stroke="rgba(200, 200, 210, 0.4)" fontSize={11} width={120} />
                <Tooltip 
                  formatter={(value: number) => [`$${value >= 1000 ? (value/1000).toFixed(1) + 'B' : value + 'M'}`, 'Annual Funding']}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {fundingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Source: CMGF Paper Analysis - Education benefits dwarf transition-specific advising by nearly 100x
          </p>
        </CardContent>
      </Card>

      {/* CMGF PAPER - Featured */}
      <section className="relative overflow-hidden rounded-xl bg-card border border-border p-8 md:p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-primary/20 text-primary border-primary/40 no-default-hover-elevate font-mono uppercase tracking-widest text-[10px]">
              <FileText className="w-3 h-3 mr-1" /> 2026 CCME Learner Track 1
            </Badge>
            <Badge className="bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-600 dark:text-fuchsia-400/80 border-fuchsia-500/40 no-default-hover-elevate font-mono uppercase tracking-widest text-[10px]">
              <Cpu className="w-3 h-3 mr-1" /> Compliant by Design
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4 glow-text tracking-tight leading-tight">
            A Governed, Human-in-the-Loop AI Framework for Military Career Mobility
          </h2>
          <h3 className="text-xl md:text-2xl text-primary font-semibold mb-6 tracking-tight">
            Design, Constraints, and Ethical Tradeoffs
          </h3>
          <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-muted/50 border border-border">
            <Award className="w-8 h-8 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Robert E. McCoy, MBA, M.S. AI & Data Analytics</p>
              <p className="text-xs text-muted-foreground">Indiana Wesleyan University</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
          <Activity className="w-full h-full text-primary" />
        </div>
      </section>

      {/* BOUNDED AI CONSTRAINTS */}
      <Card className="high-tech-card border-amber-500/20 bg-amber-500/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400/80 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-sm font-bold text-amber-600 dark:text-amber-400/80 mb-2 uppercase tracking-wider">Bounded AI: What CMGF Explicitly Prohibits</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-300/80 text-xs">No Predictive Outcome Modeling</Badge>
                <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-300/80 text-xs">No Individual Risk Scoring</Badge>
                <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-300/80 text-xs">No Automated Approvals</Badge>
                <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-300/80 text-xs">No Optimization Objectives</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                CMGF is limited to explainable translation, rule-based feasibility signals, and de-identified aggregation. Built against EO 14110, NIST AI RMF 1.0, and GAO-24 oversight requirements.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SIX KEY CONTRIBUTIONS */}
      <Card className="high-tech-card">
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
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary font-mono text-xs">01</span>
                <h4 className="text-sm font-semibold">Structured Synthesis</h4>
              </div>
              <p className="text-xs text-muted-foreground">Peer-reviewed research on credential portability, career mobility, and advising effectiveness organized around CCME Track 1 elements.</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary font-mono text-xs">02</span>
                <h4 className="text-sm font-semibold">Labor Market Evidence</h4>
              </div>
              <p className="text-xs text-muted-foreground">Employers reward attestable, portable credentials and emerging AI fluency when competencies can be verified across boundaries.</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary font-mono text-xs">03</span>
                <h4 className="text-sm font-semibold">Governance Gap Diagnosis</h4>
              </div>
              <p className="text-xs text-muted-foreground">Persistent gaps preventing AI literacy and credential alignment from becoming standardized DoD policy (GAO-24 findings).</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary font-mono text-xs">04</span>
                <h4 className="text-sm font-semibold">AI-Enabled Framework</h4>
              </div>
              <p className="text-xs text-muted-foreground">Human-centered advising framework with demonstration artifacts unifying career direction, education pathways, and learner voice.</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary font-mono text-xs">05</span>
                <h4 className="text-sm font-semibold">Responsible AI Design</h4>
              </div>
              <p className="text-xs text-muted-foreground">Intentional non-use of predictive modeling, automated approvals, and risk scoring as core design mechanism for trust.</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary font-mono text-xs">06</span>
                <h4 className="text-sm font-semibold">Policy-Ready Evidence</h4>
              </div>
              <p className="text-xs text-muted-foreground">Converts individual planning friction into auditable evidence for budget reallocation and transition support reform.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CCME 2026 PRESENTATION */}
      <Card className="high-tech-card" data-testid="card-presentation">
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Presentation className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold tracking-tight">CCME 2026 Framework Components</CardTitle>
                <p className="text-sm text-muted-foreground">Military Learner Mobility and Career Alignment</p>
              </div>
            </div>
            <Badge className="bg-neutral-800 text-neutral-300 border-border no-default-hover-elevate font-mono uppercase tracking-widest text-[10px]">
              The Future Is Now: Educate, Engage, Empower
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
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
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider">AI Advisor Assistant</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-3">A bounded AI layer that supports service-member agency without displacing human judgment</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-[10px] border-border text-neutral-300">Explainable Translation</Badge>
                  <Badge variant="outline" className="text-[10px] border-border text-neutral-300">Rule-Based Signals</Badge>
                  <Badge variant="outline" className="text-[10px] border-border text-neutral-300">De-Identified Aggregation</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-fuchsia-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4 text-fuchsia-600 dark:text-fuchsia-600 dark:text-fuchsia-400/80" />
                  <h4 className="text-sm font-bold text-fuchsia-600 dark:text-fuchsia-600 dark:text-fuchsia-400/80 uppercase tracking-wider">ESO Policy Intelligence View</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Education Services Officer dashboard for institutional oversight</p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 text-fuchsia-600 dark:text-fuchsia-600 dark:text-fuchsia-400/80 mt-0.5 flex-shrink-0" />
                    <span>Aggregated, de-identified service-member signals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 text-fuchsia-600 dark:text-fuchsia-600 dark:text-fuchsia-400/80 mt-0.5 flex-shrink-0" />
                    <span>Informs education funding and credential policy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 text-fuchsia-600 dark:text-fuchsia-600 dark:text-fuchsia-400/80 mt-0.5 flex-shrink-0" />
                    <span>Observes systemic patterns, not individual plans</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider">CMGF Architecture</h4>
                </div>
                <p className="text-xs text-muted-foreground">
                  Demonstrates how individual agency and institutional accountability can coexist within a bounded, explainable, non-predictive analytics system.
                </p>
                <div className="mt-3 p-3 rounded bg-muted/50 border border-border">
                  <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                    All feasibility signals are traceable to specific policy rules
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-transparent border border-border">
            <p className="text-sm text-center font-medium">
              <span className="text-muted-foreground">Core Principle:</span>{" "}
              <span className="text-primary">Career responsibility rests with the individual</span>
              <span className="text-muted-foreground"> - career visibility and clarity are </span>
              <span className="text-primary">institutional obligations</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* FRAMEWORK PILLARS */}
      <div id="frameworks" className="grid grid-cols-1 md:grid-cols-3 gap-6 scroll-mt-24">
        <Card className="high-tech-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono text-primary flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /> Credential Portability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Military competencies translated to civilian-recognized credentials with attestable verification across institutional boundaries.</p>
          </CardContent>
        </Card>
        <Card className="high-tech-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono text-primary flex items-center gap-2">
              <Users className="w-4 h-4" /> Human-in-the-Loop
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">AI supports but never replaces human advisors. All decisions require human judgment and approval.</p>
          </CardContent>
        </Card>
        <Card className="high-tech-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono text-primary flex items-center gap-2">
              <Shield className="w-4 h-4" /> Policy Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Full alignment with EO 14110, NIST AI RMF 1.0, and GAO oversight requirements by design.</p>
          </CardContent>
        </Card>
      </div>

      {/* SYSTEM STATUS */}
      <Card className="high-tech-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-fuchsia-400/80 shadow-[0_0_8px_rgba(192,132,252,0.4)]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              CMGF Operations Center // Bounded AI Active // Human Oversight Required
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
