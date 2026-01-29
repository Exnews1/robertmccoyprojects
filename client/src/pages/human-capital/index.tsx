import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import { 
  ChevronDown, 
  Home, 
  ChevronRight, 
  Scale, 
  TrendingUp, 
  Users, 
  DollarSign,
  GraduationCap,
  Shield,
  Globe,
  FileText,
  Download,
  ArrowRight,
  BookOpen,
  Target,
  BarChart3
} from "lucide-react";

interface ContentData {
  hero_section: string;
  framework_overview: string;
  military_model_summary: string;
  correctional_model_summary: string;
  mandela_rules_alignment: string;
  economic_case_summary: string;
  policy_implications: string;
  research_references_apa: string[];
}

const keyStats = [
  { value: "453", label: "Research Papers", description: "Peer-reviewed sources analyzed", icon: BookOpen },
  { value: "45pp", label: "Efficiency Gap", description: "Between military (85%) and correctional (40%) throughput", icon: TrendingUp },
  { value: "$600B", label: "Economic Potential", description: "Estimated value from closing efficiency gap over 5 years", icon: DollarSign },
  { value: "200-500%", label: "Education ROI", description: "Return on correctional education investment", icon: Target }
];

const systemComparison = [
  { metric: "Annual Throughput", military: "180,000 enlistments", correctional: "10.6M admissions" },
  { metric: "Success Rate", military: "85% completion", correctional: "40% reintegration" },
  { metric: "Education Investment", military: "$4,500/yr + GI Bill", correctional: "$0-5,000/yr" },
  { metric: "Recurrence Rate", military: "15% attrition", correctional: "60% recidivism" },
  { metric: "Public Acceptance", military: "High, bipartisan", correctional: "Low, contested" }
];

export default function HumanCapitalFramework() {
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["framework"]));

  useEffect(() => {
    fetch("/human-capital/data/Website_Content_Blocks.json")
      .then(res => res.json())
      .then(data => setContentData(data))
      .catch(err => console.error("Failed to load content:", err));
  }, []);

  const toggleSection = (section: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const sections = [
    {
      id: "framework",
      title: "The Framework: National Strength as Human Capital System",
      icon: Target,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      content: (
        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-muted/50">
            <h4 className="font-bold text-lg mb-2">Core Equation</h4>
            <p className="text-2xl font-mono text-primary mb-4">ΔH = f(E) × (1 − C)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="font-semibold">ΔH</span> = Change in human capital stock</div>
              <div><span className="font-semibold">E</span> = Investment per individual</div>
              <div><span className="font-semibold">C</span> = Friction coefficient (barriers)</div>
              <div><span className="font-semibold">f(E)</span> = Investment effectiveness function</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <h5 className="font-semibold mb-2">Human Capital Stock (H)</h5>
                <p className="text-sm text-muted-foreground">Aggregate skills, knowledge, and capabilities of the population</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h5 className="font-semibold mb-2">Institutional Throughput (T)</h5>
                <p className="text-sm text-muted-foreground">Rate at which institutions process and develop individuals</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h5 className="font-semibold mb-2">Friction Layers (C)</h5>
                <p className="text-sm text-muted-foreground">Institutional (0.20-0.30), Political (0.30-0.40), Perceptual (0.20-0.30)</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: "military",
      title: "System A: Military Human Capital Development",
      icon: Shield,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      content: (
        <div className="space-y-6">
          <p className="text-muted-foreground">The U.S. military operates the world's most successful voluntary human capital development system, serving as proof that large-scale, high-throughput education investment works.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h5 className="font-semibold mb-3 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-green-500" />
                  Programs
                </h5>
                <ul className="space-y-2 text-sm">
                  <li><span className="font-medium">Tuition Assistance (TA):</span> Up to $4,500/year for active-duty</li>
                  <li><span className="font-medium">Credential Assistance (CA):</span> Professional licenses and certifications</li>
                  <li><span className="font-medium">GI Bill:</span> $36,000+ over 36 months post-service</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h5 className="font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-green-500" />
                  Outcomes
                </h5>
                <ul className="space-y-2 text-sm">
                  <li><span className="font-medium">+1.4 years</span> education on average (Angrist, 1993)</li>
                  <li><span className="font-medium">+6%</span> earnings vs comparable non-veterans</li>
                  <li><span className="font-medium">85%</span> successful transition rate</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: "correctional",
      title: "System B: Correctional Human Capital Development",
      icon: Scale,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      content: (
        <div className="space-y-6">
          <p className="text-muted-foreground">The U.S. correctional system processes 10.6 million admissions annually—5x military enlistment—yet operates at 25% of military efficiency due to severe friction barriers.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h5 className="font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-orange-500" />
                  Current Investment
                </h5>
                <ul className="space-y-2 text-sm">
                  <li><span className="font-medium">Education:</span> $0-$5,000/year (highly variable)</li>
                  <li><span className="font-medium">BASE Costs:</span> $35,000-$70,000/year (non-negotiable)</li>
                  <li><span className="font-medium">Only 52%</span> of prisons offer high school education</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h5 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  Proven Outcomes
                </h5>
                <ul className="space-y-2 text-sm">
                  <li><span className="font-medium">-43%</span> recidivism with education (Davis et al., 2013)</li>
                  <li><span className="font-medium">+28%</span> post-release employment</li>
                  <li><span className="font-medium">200-500%</span> ROI on education investment</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: "mandela",
      title: "Global Governance: The Mandela Rules Framework",
      icon: Globe,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      content: (
        <div className="space-y-6">
          <p className="text-muted-foreground">The UN Standard Minimum Rules for the Treatment of Prisoners (Mandela Rules), adopted unanimously in 2015, establish correctional education as an international human rights obligation.</p>
          
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h5 className="font-semibold mb-2">Rule 104.1</h5>
                <p className="text-sm text-muted-foreground italic">"Every prison shall seek to provide all prisoners with access to educational programmes which are as comprehensive as possible and which meet their individual needs while taking into account their aspirations."</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h5 className="font-semibold mb-2">Rule 4.1</h5>
                <p className="text-sm text-muted-foreground italic">"The purposes of a sentence of imprisonment...can be achieved only if the period of imprisonment is used to ensure, so far as possible, the reintegration of such persons into society upon release."</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: "economic",
      title: "The Economic Case: BASE Costs and Break-Even Analysis",
      icon: DollarSign,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      content: (
        <div className="space-y-6">
          <p className="text-muted-foreground">The economic argument does not depend on moral claims. It depends on a simple fact: Containment costs are non-negotiable.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-emerald-500">$100B</p>
                <p className="text-sm text-muted-foreground">Annual containment cost</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-emerald-500">1.6pp</p>
                <p className="text-sm text-muted-foreground">Break-even threshold</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-emerald-500">13pp</p>
                <p className="text-sm text-muted-foreground">Actual empirical effect</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-emerald-500/5 border-emerald-500/20">
            <CardContent className="p-4">
              <p className="text-sm"><span className="font-semibold">Key Insight:</span> Education investment breaks even at 1.6 percentage points of recidivism reduction. Empirical effects are 8-27x larger, providing massive safety margins.</p>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <nav className="mb-8 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="text-muted-foreground hover:text-foreground flex items-center gap-1" data-testid="link-breadcrumb-home">
                <Home className="h-4 w-4" />
                Portfolio
              </Link>
            </li>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <li>
              <span className="text-foreground font-medium" aria-current="page">Human Capital Framework</span>
            </li>
          </ol>
        </nav>

        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <TrendingUp className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">Human Capital Institutional Throughput Framework</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            A Comparative Analysis of Military and Correctional Systems: Optimizing Public Infrastructure for National Strength
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge variant="outline">453 Research Papers</Badge>
            <Badge variant="outline">Systems Theory</Badge>
            <Badge variant="outline">Economic Analysis</Badge>
            <Badge variant="outline">Policy Framework</Badge>
          </div>
        </header>

        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {keyStats.map((stat, index) => (
              <Card key={index} className="text-center" data-testid={`card-stat-${index}`}>
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-foreground mb-2">{stat.label}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-1 bg-primary rounded-full shrink-0" />
                <div>
                  <h3 className="text-lg font-bold mb-2">Key Finding</h3>
                  <p className="text-muted-foreground">
                    The correctional system processes 5x more individuals than military enlistment annually, yet operates at 25% efficiency due to policy, operational, and perceptual friction barriers. Closing this gap could generate <span className="text-foreground font-semibold">$600 billion in economic value over 5 years</span>.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">System Comparison</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">Metric</th>
                      <th className="text-left p-4 font-semibold text-green-600">Military (System A)</th>
                      <th className="text-left p-4 font-semibold text-orange-600">Correctional (System B)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {systemComparison.map((row, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="p-4 font-medium">{row.metric}</td>
                        <td className="p-4 text-muted-foreground">{row.military}</td>
                        <td className="p-4 text-muted-foreground">{row.correctional}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Framework Components</h2>
          <div className="space-y-4">
            {sections.map((section) => (
              <Collapsible 
                key={section.id} 
                open={openSections.has(section.id)}
                onOpenChange={() => toggleSection(section.id)}
              >
                <Card data-testid={`section-${section.id}`}>
                  <CollapsibleTrigger asChild>
                    <button
                      className="w-full p-6 flex items-center justify-between hover-elevate rounded-lg"
                      aria-expanded={openSections.has(section.id)}
                      aria-controls={`content-${section.id}`}
                      data-testid={`button-toggle-${section.id}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${section.bgColor}`}>
                          <section.icon className={`h-5 w-5 ${section.color}`} />
                        </div>
                        <h3 className="text-lg font-semibold text-left">{section.title}</h3>
                      </div>
                      <ChevronDown 
                        className={`h-5 w-5 text-muted-foreground transition-transform ${openSections.has(section.id) ? "rotate-180" : ""}`} 
                      />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent id={`content-${section.id}`}>
                    <div className="px-6 pb-6">
                      {section.content}
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Research Figures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-4">
                <img 
                  src="/human-capital/images/Figure1_Institutional_Throughput_Flow_Model.png" 
                  alt="Institutional Throughput Flow Model showing population flow through military and correctional systems"
                  className="w-full rounded-lg mb-4"
                />
                <h4 className="font-semibold mb-2">Figure 1: Institutional Throughput Flow Model</h4>
                <p className="text-sm text-muted-foreground">Visual representation of population → institutions → investment → outcomes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <img 
                  src="/human-capital/images/Figure2_BASE_Cost_ROI_Model.png" 
                  alt="BASE Cost ROI Model showing cost structure and return on investment analysis"
                  className="w-full rounded-lg mb-4"
                />
                <h4 className="font-semibold mb-2">Figure 2: BASE vs E vs R Cost Interaction Model</h4>
                <p className="text-sm text-muted-foreground">Cost structure comparison and ROI as function of recidivism reduction</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Downloads & Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover-elevate">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-8 w-8 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1">Full Research Paper</h4>
                    <p className="text-xs text-muted-foreground mb-3">11,847 words with 60+ citations</p>
                    <a 
                      href="/human-capital/images/correctional_system_transformation.png" 
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      data-testid="link-download-paper"
                    >
                      <Download className="h-3 w-3" />
                      View Visualization
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <BarChart3 className="h-8 w-8 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1">Research Datasets</h4>
                    <p className="text-xs text-muted-foreground mb-3">30+ CSV files with source data</p>
                    <span className="text-xs text-muted-foreground">Available in data directory</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Scale className="h-8 w-8 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1">Related Research</h4>
                    <p className="text-xs text-muted-foreground mb-3">U.S. Incarceration Research Hub</p>
                    <Link 
                      href="/incarceration-research"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      data-testid="link-incarceration-hub"
                    >
                      <ArrowRight className="h-3 w-3" />
                      Explore Hub
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Key References</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Military Education</h4>
                  <ul className="text-muted-foreground space-y-1 text-xs">
                    <li>Angrist (1993) - Military education effects</li>
                    <li>Barr (2015) - Post-9/11 GI Bill outcomes</li>
                    <li>Kleykamp (2013) - Veteran employment</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Correctional Education</h4>
                  <ul className="text-muted-foreground space-y-1 text-xs">
                    <li>Davis et al. (2013) - RAND meta-analysis</li>
                    <li>Stickle & Schuster (2023) - Education ROI</li>
                    <li>Lochner & Moretti (2004) - Education and crime</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Human Capital Theory</h4>
                  <ul className="text-muted-foreground space-y-1 text-xs">
                    <li>Becker (1964, 1968) - Human capital foundations</li>
                    <li>Psacharopoulos & Patrinos (2018) - Returns to education</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">International Standards</h4>
                  <ul className="text-muted-foreground space-y-1 text-xs">
                    <li>UN Mandela Rules (2015)</li>
                    <li>UNODC Implementation Guidelines</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <footer className="text-center text-sm text-muted-foreground pt-8 border-t">
          <p>Robert McCoy | Human Capital Institutional Throughput Framework | January 2026</p>
        </footer>
      </div>
    </div>
  );
}
