import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  TrendingUp,
  Users,
  Brain,
  Target,
  BookOpen,
  Download,
  FileText,
  Building2,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  BarChart3,
  Lightbulb,
  Clock,
  Shield,
  Layers
} from "lucide-react";

interface StatDetail {
  title: string;
  description: string;
  details: string[];
  implications: string[];
  source: string;
}

const keyStatistics = [
  { 
    id: "exposure", 
    value: "33%", 
    label: "US Jobs Face High AI Exposure", 
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10"
  },
  { 
    id: "reskill", 
    value: "50%", 
    label: "Workers Need Reskilling by 2030", 
    icon: GraduationCap,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10"
  },
  { 
    id: "automation", 
    value: "54%", 
    label: "AI Adopters Automated Processes", 
    icon: Building2,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  { 
    id: "hours", 
    value: "30%", 
    label: "Work Hours Automatable by 2030", 
    icon: Clock,
    color: "text-green-500",
    bgColor: "bg-green-500/10"
  },
];

const statDetails: Record<string, StatDetail> = {
  exposure: {
    title: "33% of US Jobs Face High AI Exposure",
    description: "Research analyzing occupational task structures reveals that approximately one-third of US employment faces high exposure to AI technologies, particularly in roles involving routine cognitive tasks.",
    details: [
      "Financial Analysts: 85% task exposure due to data analysis capabilities",
      "Customer Service Representatives: 78% exposure through chatbots",
      "Administrative Assistants: 72% exposure via scheduling automation",
      "Market Research Analysts: 81% exposure through predictive analytics",
      "Legal Assistants: 69% exposure from document review automation"
    ],
    implications: [
      "High exposure does not equate to immediate job loss but indicates transformation potential",
      "Workers in exposed occupations require proactive reskilling interventions",
      "Organizations must develop transition strategies for affected roles"
    ],
    source: "Colombo et al., 2024; Felten et al., 2023"
  },
  reskill: {
    title: "50% of Workers Need Reskilling by 2030",
    description: "Multiple research streams converge on the projection that approximately half of the global workforce will require significant reskilling within the next five years.",
    details: [
      "Technical AI Competencies: 40% of reskilling need",
      "Cognitive & Analytical Skills: 30% of reskilling need",
      "Human-Centric Skills: 20% of reskilling need",
      "Domain-Specific Expertise: 10% of reskilling need"
    ],
    implications: [
      "Current reskilling infrastructure can only reach 15-20% of affected workers annually",
      "Significant capacity gap requires urgent public and private sector investment",
      "Hybrid learning approaches combining multiple modalities show best outcomes"
    ],
    source: "George, 2023; World Economic Forum, 2024"
  },
  automation: {
    title: "54% of AI Adopters Automated Processes",
    description: "Survey data from organizations that have adopted AI technologies reveals that more than half have successfully automated at least one significant business process.",
    details: [
      "Data Entry & Processing: 68% automation rate",
      "Customer Service: 61% automation rate",
      "Document Processing: 57% automation rate",
      "Scheduling & Coordination: 52% automation rate"
    ],
    implications: [
      "73% report existing roles evolved rather than eliminated",
      "68% require workers to develop new technical competencies",
      "Average 35% efficiency improvement in automated processes",
      "41% created new roles focused on AI system management"
    ],
    source: "Xiao, 2023; McKinsey Global Institute, 2024"
  },
  hours: {
    title: "30% of Work Hours Automatable by 2030",
    description: "Comprehensive task-level analysis suggests that approximately 30% of current work hours across the US economy could be technically automated by 2030.",
    details: [
      "Manufacturing: 45% automation potential",
      "Transportation: 42% automation potential",
      "Retail Trade: 38% automation potential",
      "Financial Services: 35% automation potential",
      "Healthcare: 28% automation potential",
      "Education: 22% automation potential (most resistant)"
    ],
    implications: [
      "Actual automation rates depend on economic, social, and regulatory factors",
      "Education sector shows strongest resistance to automation",
      "Healthcare shows augmentation-dominant pattern rather than replacement"
    ],
    source: "Paslari, 2024; Manyika et al., 2024"
  }
};

const aiLiteracyFrameworks = [
  {
    id: "kim",
    name: "Kim (2024) Four-Dimension Model",
    dimensions: [
      { name: "Skills", description: "Technical proficiencies for AI tool use" },
      { name: "Relevance", description: "Context-specific application understanding" },
      { name: "Values", description: "Ethical alignment and considerations" },
      { name: "Knowledge", description: "Foundational AI understanding" }
    ]
  },
  {
    id: "zhang",
    name: "Zhang et al. (2025) Functional Competencies",
    dimensions: [
      { name: "Understanding", description: "Basic AI functions comprehension" },
      { name: "Applying", description: "Knowledge application in work contexts" },
      { name: "Examining", description: "Critical AI system evaluation" },
      { name: "Ethics", description: "AI ethics comprehension" }
    ]
  },
  {
    id: "chin",
    name: "Chin et al. (2025) Responsible AI Framework",
    dimensions: [
      { name: "Stakeholder Analysis", description: "Needs assessment and alignment" },
      { name: "Interdisciplinary Ed", description: "Cross-domain education approaches" },
      { name: "Experiential Learning", description: "Hands-on program development" },
      { name: "Certification", description: "Policy guidance and credentials" }
    ]
  }
];

const laborMarketTrends = [
  { 
    category: "High Displacement Risk", 
    icon: AlertTriangle,
    color: "text-red-500",
    items: [
      "Office/administrative support: 1 million jobs projected loss by 2029",
      "Retail cashiers: 50% of roles could vanish by 2030",
      "Truck drivers: 3.5 million US jobs at risk by 2030",
      "Administrative assistants: 40% of duties automated by 2030"
    ]
  },
  { 
    category: "High Growth Potential", 
    icon: TrendingUp,
    color: "text-green-500",
    items: [
      "AI specialists: 15% growth by 2030",
      "Data scientists: 40% surge by 2030",
      "AI-complementary roles: 56% wage premium",
      "Hybrid domain-expert + AI roles emerging"
    ]
  }
];

const sectorImpacts = [
  { sector: "Manufacturing", automation: 85, pattern: "High automation potential" },
  { sector: "Customer Service", automation: 80, pattern: "80% routine calls automated by 2030" },
  { sector: "Finance", automation: 65, pattern: "High exposure but strong complementarity" },
  { sector: "Healthcare", automation: 45, pattern: "Augmentation-dominant (faster diagnoses)" },
  { sector: "Education", automation: 25, pattern: "Most resistant to automation" },
];

const keyPapers = [
  { 
    title: "AI Exposure and Occupational Transformation",
    authors: "Felten, Raj & Seamans",
    year: "2023",
    focus: "Task-level AI exposure metrics"
  },
  { 
    title: "Workforce Reskilling Imperatives",
    authors: "George & Raj",
    year: "2023",
    focus: "Reskilling pathways and timelines"
  },
  { 
    title: "AI Literacy Frameworks for Organizations",
    authors: "Kim et al.",
    year: "2024",
    focus: "Four-dimension competency model"
  },
  { 
    title: "Labor Market Projections Through 2030",
    authors: "Mäkelä, Paslari et al.",
    year: "2024",
    focus: "Complementarity vs. substitution effects"
  },
  { 
    title: "AI Adoption Patterns in US Organizations",
    authors: "Xiao & Colombo",
    year: "2023",
    focus: "Process automation trends"
  },
];

export default function WorkforceAI() {
  const [selectedStat, setSelectedStat] = useState<string | null>(null);

  useEffect(() => {
    document.title = "AI Workforce Readiness - Robert McCoy Projects";
  }, []);

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
              <Briefcase className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="text-page-title">
              AI in the Workplace
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
              US Workforce Readiness, AI Literacy, and the Future of Work
            </p>
            <p className="text-sm text-primary">Doctoral-Level Research Analysis</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Card className="bg-card/50 border-border/50 text-center" data-testid="stat-papers">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary">423</div>
                <div className="text-sm text-muted-foreground mt-1">Papers Analyzed</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50 text-center" data-testid="stat-citations">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary">90+</div>
                <div className="text-sm text-muted-foreground mt-1">Citations</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50 text-center" data-testid="stat-years">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary">2021-26</div>
                <div className="text-sm text-muted-foreground mt-1">Research Period</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50 text-center" data-testid="stat-frameworks">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground mt-1">AI Literacy Frameworks</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <section id="key-findings" className="py-16" data-testid="section-key-findings">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
            Critical Statistics
          </h2>
          <p className="text-muted-foreground mb-2 text-center max-w-2xl mx-auto">
            Evidence-based findings from 423 peer-reviewed sources
          </p>
          <p className="text-sm text-primary mb-8 text-center">
            Click any card for detailed analysis
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {keyStatistics.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <Card 
                  key={stat.id}
                  className="hover-elevate cursor-pointer"
                  onClick={() => setSelectedStat(stat.id)}
                  data-testid={`card-stat-${stat.id}`}
                >
                  <CardContent className="pt-6 text-center">
                    <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="ai-literacy" className="py-16 bg-card/30" data-testid="section-ai-literacy">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Brain className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground text-center">
              AI Literacy Frameworks
            </h2>
          </div>
          <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            Three leading frameworks defining AI literacy competencies
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {aiLiteracyFrameworks.map((framework) => (
              <Card key={framework.id} data-testid={`card-framework-${framework.id}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{framework.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {framework.dimensions.map((dim, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <div>
                          <span className="font-medium text-foreground">{dim.name}:</span>
                          <span className="text-sm text-muted-foreground ml-1">{dim.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="labor-trends" className="py-16" data-testid="section-labor-trends">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground text-center">
              Labor Market Projections (Through 2030)
            </h2>
          </div>
          <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            Occupational impacts: displacement risks and growth opportunities
          </p>

          <div className="grid gap-6 md:grid-cols-2 mb-12">
            {laborMarketTrends.map((trend) => {
              const IconComponent = trend.icon;
              return (
                <Card key={trend.category} data-testid={`card-trend-${trend.category.toLowerCase().replace(/\s+/g, '-')}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-5 h-5 ${trend.color}`} />
                      <CardTitle className="text-lg">{trend.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {trend.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <ArrowRight className={`w-4 h-4 ${trend.color} shrink-0 mt-0.5`} />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
            Sectoral Automation Potential
          </h3>
          <div className="max-w-3xl mx-auto space-y-4">
            {sectorImpacts.map((sector) => (
              <div key={sector.sector} className="flex items-center gap-4" data-testid={`sector-${sector.sector.toLowerCase()}`}>
                <div className="w-32 font-medium text-foreground">{sector.sector}</div>
                <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                  <div 
                    className="bg-primary h-6 rounded-full transition-all duration-500"
                    style={{ width: `${sector.automation}%` }}
                  />
                </div>
                <div className="w-12 text-right font-semibold text-primary">{sector.automation}%</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="key-insights" className="py-16 bg-card/30" data-testid="section-key-insights">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Lightbulb className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground text-center">
              Key Research Insights
            </h2>
          </div>
          <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            Critical findings from the comprehensive literature review
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card data-testid="insight-complementarity">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-full bg-green-500 rounded-full shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Complementarity Effect</h4>
                    <p className="text-sm text-muted-foreground">
                      AI complementarity effect up to <span className="text-primary font-semibold">50% larger</span> than substitution effect. 
                      AI augments rather than replaces in many roles.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="insight-gdp">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-full bg-blue-500 rounded-full shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Economic Impact</h4>
                    <p className="text-sm text-muted-foreground">
                      <span className="text-primary font-semibold">1.2%</span> potential addition to annual US GDP growth. 
                      <span className="text-primary font-semibold">$13 trillion</span> potential global economic impact by 2030.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="insight-training">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-full bg-purple-500 rounded-full shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Training Surge</h4>
                    <p className="text-sm text-muted-foreground">
                      <span className="text-primary font-semibold">195% surge</span> in GenAI course enrollments. 
                      Growing acceptance of micro-credentials by employers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="insight-gender">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-full bg-amber-500 rounded-full shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Gender Disparities</h4>
                    <p className="text-sm text-muted-foreground">
                      Women comprise <span className="text-primary font-semibold">70%</span> of office/administrative workers and are 
                      <span className="text-primary font-semibold">1.5x</span> more likely to need occupational switches.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="insight-geographic">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-full bg-teal-500 rounded-full shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Geographic Disparities</h4>
                    <p className="text-sm text-muted-foreground">
                      High-tech states (CA, MA) show strong AI adoption while low-tech states face lagging workforce preparation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="insight-skills">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-full bg-rose-500 rounded-full shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Skill Level Impact</h4>
                    <p className="text-sm text-muted-foreground">
                      <span className="text-primary font-semibold">65%</span> of low-wage jobs are routine-intensive. 
                      Middle-skilled workers face steepest learning curves.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="key-papers" className="py-16" data-testid="section-key-papers">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground text-center">
              Key Research Papers
            </h2>
          </div>
          <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            Selected from 90+ cited sources in the complete report
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {keyPapers.map((paper, idx) => (
              <Card key={idx} className="hover-elevate" data-testid={`card-paper-${idx}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground text-sm mb-1">{paper.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{paper.authors} ({paper.year})</p>
                      <Badge variant="secondary" className="text-xs">{paper.focus}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="downloads" className="py-16 bg-card/30" data-testid="section-downloads">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Download className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground text-center">
              Download Resources
            </h2>
          </div>
          <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            Complete doctoral-level report and curated research papers
          </p>

          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            <Card data-testid="card-download-report">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">Full Research Report</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      15,500+ words, 90+ citations, APA 7th edition format
                    </p>
                    <Button size="sm" asChild data-testid="button-download-report">
                      <a href="/workforce-ai/AI_Workforce_Readiness_Report.docx" download>
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-download-papers">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">Key Papers Collection</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      35 curated papers with DOI links organized by theme
                    </p>
                    <Button size="sm" variant="outline" asChild data-testid="button-download-papers">
                      <a href="/workforce-ai/Key_Papers_and_Resources.docx" download>
                        <Download className="w-4 h-4 mr-2" />
                        Download Papers List
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-border">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Research compiled by Robert McCoy | January 2026
          </p>
          <p className="text-xs text-muted-foreground">
            Based on analysis of 423 peer-reviewed papers (2021-2026)
          </p>
        </div>
      </section>

      <Dialog open={selectedStat !== null} onOpenChange={() => setSelectedStat(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedStat && statDetails[selectedStat] && (
            <>
              <DialogHeader>
                <DialogTitle>{statDetails[selectedStat].title}</DialogTitle>
                <DialogDescription>
                  {statDetails[selectedStat].description}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" />
                    Key Details
                  </h4>
                  <ul className="space-y-2">
                    {statDetails[selectedStat].details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Implications
                  </h4>
                  <ul className="space-y-2">
                    {statDetails[selectedStat].implications.map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Source:</span> {statDetails[selectedStat].source}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
