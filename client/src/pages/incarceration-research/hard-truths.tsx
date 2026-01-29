import { useEffect, useState } from "react";
import { Link } from "wouter";
import { 
  ChevronRight, DollarSign, Users, BookOpen, Heart, AlertTriangle,
  TrendingUp, Building2, Shield, Brain, Scale, UserX, Gavel,
  FileText, Download, ChevronDown, ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface HardTruthsData {
  project_info: {
    title: string;
    editor: string;
    research_papers: number;
    primary_sources: number;
    word_count: number;
  };
  section_1_economics: {
    title: string;
    key_statistics: Record<string, { value: string; context: string; source?: string }>;
    demographics: Record<string, { percentage: string; general_population: string; disparity: string }>;
  };
  section_2_prison_life: {
    title: string;
    prisoner_statistics: Record<string, { value: string; context: string; note?: string; source?: string }>;
    guard_statistics: Record<string, { value: string; context: string; factors?: string[]; impact?: string }>;
    daily_life: Record<string, string>;
  };
  section_3_education_entry: {
    title: string;
    education_statistics: Record<string, { value: string; context: string; source?: string }>;
    age_statistics: Record<string, { value: string; context: string; source?: string; impact?: string }>;
    pathways_to_incarceration: Record<string, string>;
  };
  section_4_rights_mental_health: {
    title: string;
    rights_statistics: Record<string, { value: string; context: string; reality?: string; effectiveness?: string; impact?: string }>;
    mental_health_crisis: Record<string, { value: string; context: string; note?: string; source?: string; factors?: string[] }>;
    prisoner_needs: { top_wishes: string[] };
    respect_dignity: Record<string, string>;
  };
  overall_themes: Record<string, { description: string; population?: string; growth?: string; black_disparity?: string; systemic_racism?: string; opportunity_cost?: string; inefficiency?: string; mental_health?: string; educational_failure?: string; violence?: string; areas?: string[] }>;
}

const sectionConfig = [
  {
    id: "economics",
    title: "Economics of Incarceration",
    icon: DollarSign,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    description: "National spending, per-prisoner costs, and the economic burden on taxpayers"
  },
  {
    id: "prison-life",
    title: "Life in Prison",
    icon: Building2,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    description: "Daily routines, gang dynamics, violence statistics, and guard interactions"
  },
  {
    id: "education",
    title: "Education & Entry Dynamics",
    icon: BookOpen,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    description: "Educational deficits, age patterns, and pathways to incarceration"
  },
  {
    id: "rights-mental-health",
    title: "Rights & Mental Health",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    description: "Prisoner rights, mental health crisis, and unmet needs"
  }
];

const keyStats = [
  { value: "$39B", label: "Annual Prison Spending", subtext: "Across 40 states (2010)", icon: DollarSign },
  { value: "790%", label: "Population Growth", subtext: "1980-2013 increase", icon: TrendingUp },
  { value: "65%", label: "Numeracy Deficit", subtext: "At/below 11-year-old level", icon: BookOpen },
  { value: "66-76%", label: "No Treatment", subtext: "Mental health needs unmet", icon: Brain },
];

export default function HardTruths() {
  const [data, setData] = useState<HardTruthsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/incarceration-research/data/hard_truths_statistics.json");
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <nav className="mb-8 text-sm flex items-center flex-wrap gap-1" aria-label="Breadcrumb">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-breadcrumb-portfolio">
            Portfolio
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Link href="/incarceration-research" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-breadcrumb-hub">
            Incarceration Research Hub
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-foreground" aria-current="page">Hard Truths</span>
        </nav>

        <header className="mb-10">
          <div className="text-xs text-muted-foreground mb-2">Research Analysis | January 2026</div>
          <div className="flex items-center gap-3 mb-4">
            <Scale className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Hard Truths of the Incarceration System</h1>
              <p className="text-sm text-muted-foreground">United States Correctional Institutions</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-3xl mb-4">
            A comprehensive, evidence-based analysis of the "down and dirty" reality of incarcerated life 
            in the United States. This research draws on 728 scholarly papers and 40 primary sources 
            to reveal the economics, conditions, and human costs of mass incarceration.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-primary/30 text-primary">
              728 Research Papers
            </Badge>
            <Badge variant="outline">
              40 Primary Sources
            </Badge>
            <Badge variant="outline">
              Edited by Robert McCoy
            </Badge>
          </div>
        </header>

        <section className="mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {keyStats.map((stat, index) => (
              <Card key={index} className="text-center" data-testid={`card-key-stat-${index}`}>
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-foreground mb-1">{stat.label}</div>
                  <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-1 bg-destructive rounded-full shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Executive Summary
                  </h3>
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      The U.S. operates the world's largest incarceration system with over <strong className="text-foreground">two million individuals</strong> confined. 
                      This analysis reveals a system characterized by <strong className="text-foreground">escalating costs</strong>, 
                      <strong className="text-foreground"> challenging conditions</strong>, <strong className="text-foreground">significant educational disadvantage</strong>, 
                      and <strong className="text-foreground">widespread unmet mental health needs</strong>.
                    </p>
                    <ul className="space-y-2 mt-4">
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                        <span>Total taxpayer cost reached <strong className="text-foreground">$39 billion</strong> across 40 states—13.9% higher than corrections budgets alone</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                        <span>Federal prison population increased <strong className="text-foreground">790%</strong> between 1980 and 2013, creating 36% overcapacity</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                        <span><strong className="text-foreground">44.3%</strong> of inmates are Black vs. 13% of general population—a 3.4x overrepresentation</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                        <span><strong className="text-foreground">66-76%</strong> of prisoners with mental health needs receive NO treatment since admission</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Four Critical Dimensions</h2>
          <div className="space-y-4">
            {sectionConfig.map((section) => {
              const isOpen = openSections[section.id] || false;
              return (
                <Collapsible key={section.id} open={isOpen} onOpenChange={() => toggleSection(section.id)}>
                  <Card className={section.borderColor}>
                    <CollapsibleTrigger asChild>
                      <button 
                        className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
                        aria-expanded={isOpen}
                        aria-controls={`content-${section.id}`}
                        data-testid={`button-toggle-${section.id}`}
                      >
                        <CardHeader className="cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${section.bgColor}`}>
                                <section.icon className={`h-5 w-5 ${section.color}`} />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{section.title}</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                              </div>
                            </div>
                            <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                          </div>
                        </CardHeader>
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent id={`content-${section.id}`}>
                      <CardContent className="pt-0">
                        {section.id === "economics" && data && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 bg-muted/50 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">National Spending</div>
                                <div className="text-2xl font-bold text-green-500">{data.section_1_economics.key_statistics.national_spending.value}</div>
                                <div className="text-sm text-muted-foreground">{data.section_1_economics.key_statistics.national_spending.context}</div>
                              </div>
                              <div className="p-4 bg-muted/50 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">Cost Per Federal Prisoner</div>
                                <div className="text-2xl font-bold text-green-500">{data.section_1_economics.key_statistics.cost_per_prisoner_federal.value}</div>
                                <div className="text-sm text-muted-foreground">{data.section_1_economics.key_statistics.cost_per_prisoner_federal.context}</div>
                              </div>
                              <div className="p-4 bg-muted/50 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">Elderly Prisoner Costs</div>
                                <div className="text-2xl font-bold text-green-500">{data.section_1_economics.key_statistics.elderly_prisoner_multiplier.value}</div>
                                <div className="text-sm text-muted-foreground">{data.section_1_economics.key_statistics.elderly_prisoner_multiplier.context}</div>
                              </div>
                              <div className="p-4 bg-muted/50 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">Population Growth</div>
                                <div className="text-2xl font-bold text-green-500">{data.section_1_economics.key_statistics.population_growth.value}</div>
                                <div className="text-sm text-muted-foreground">{data.section_1_economics.key_statistics.population_growth.context}</div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-3">Racial Demographics in Prisons</h4>
                              <div className="space-y-3">
                                {Object.entries(data.section_1_economics.demographics).map(([key, demo]) => (
                                  <div key={key}>
                                    <div className="flex justify-between mb-1">
                                      <span className="text-sm font-medium capitalize">{key.replace('_', ' ')}</span>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm">{demo.percentage} imprisoned</span>
                                        <Badge variant="secondary" className="text-xs">{demo.disparity}</Badge>
                                      </div>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                      <div className="flex-1 bg-muted rounded-full h-2">
                                        <div className="bg-red-500 h-2 rounded-full" style={{ width: demo.percentage }} />
                                      </div>
                                      <span className="text-xs text-muted-foreground w-24">vs {demo.general_population} pop.</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {section.id === "prison-life" && data && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="p-4 bg-muted/50 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">Gang Control</div>
                                <div className="text-2xl font-bold text-orange-500">{data.section_2_prison_life.prisoner_statistics.gang_control.value}</div>
                                <div className="text-sm text-muted-foreground">{data.section_2_prison_life.prisoner_statistics.gang_control.context}</div>
                              </div>
                              <div className="p-4 bg-muted/50 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">Assault Rate</div>
                                <div className="text-2xl font-bold text-orange-500">{data.section_2_prison_life.prisoner_statistics.assault_rate.value}</div>
                                <div className="text-sm text-muted-foreground">{data.section_2_prison_life.prisoner_statistics.assault_rate.context}</div>
                              </div>
                              <div className="p-4 bg-muted/50 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">Grievance Retaliation</div>
                                <div className="text-2xl font-bold text-orange-500">{data.section_2_prison_life.prisoner_statistics.grievance_retaliation.value}</div>
                                <div className="text-sm text-muted-foreground">{data.section_2_prison_life.prisoner_statistics.grievance_retaliation.context}</div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-3">Daily Life Reality</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Object.entries(data.section_2_prison_life.daily_life).map(([key, value]) => (
                                  <div key={key} className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                                    <div>
                                      <span className="font-medium capitalize">{key.replace('_', ' ')}: </span>
                                      <span className="text-muted-foreground">{value}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {section.id === "education" && data && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="p-4 bg-muted/50 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">Numeracy Deficit</div>
                                <div className="text-2xl font-bold text-blue-500">{data.section_3_education_entry.education_statistics.numeracy_deficit.value}</div>
                                <div className="text-sm text-muted-foreground">{data.section_3_education_entry.education_statistics.numeracy_deficit.context}</div>
                              </div>
                              <div className="p-4 bg-muted/50 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">Reading Deficit</div>
                                <div className="text-2xl font-bold text-blue-500">{data.section_3_education_entry.education_statistics.reading_deficit.value}</div>
                                <div className="text-sm text-muted-foreground">{data.section_3_education_entry.education_statistics.reading_deficit.context}</div>
                              </div>
                              <div className="p-4 bg-muted/50 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">Average Admission Age</div>
                                <div className="text-2xl font-bold text-blue-500">{data.section_3_education_entry.age_statistics.average_admission_age.value}</div>
                                <div className="text-sm text-muted-foreground">{data.section_3_education_entry.age_statistics.average_admission_age.context}</div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-3">Pathways to Incarceration</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Object.entries(data.section_3_education_entry.pathways_to_incarceration).map(([key, value]) => (
                                  <div key={key} className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                    <div>
                                      <span className="font-medium capitalize">{key.replace('_', ' ')}: </span>
                                      <span className="text-muted-foreground">{value}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {section.id === "rights-mental-health" && data && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="p-4 bg-muted/50 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">Mental Disorder Prevalence</div>
                                <div className="text-2xl font-bold text-red-500">{data.section_4_rights_mental_health.mental_health_crisis.prevalence.value}</div>
                                <div className="text-sm text-muted-foreground">{data.section_4_rights_mental_health.mental_health_crisis.prevalence.context}</div>
                              </div>
                              <div className="p-4 bg-muted/50 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">Treatment Gap</div>
                                <div className="text-2xl font-bold text-red-500">{data.section_4_rights_mental_health.mental_health_crisis.treatment_gap.value}</div>
                                <div className="text-sm text-muted-foreground">{data.section_4_rights_mental_health.mental_health_crisis.treatment_gap.context}</div>
                              </div>
                              <div className="p-4 bg-muted/50 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">Suicide Risk</div>
                                <div className="text-2xl font-bold text-red-500">{data.section_4_rights_mental_health.mental_health_crisis.suicide_risk.value}</div>
                                <div className="text-sm text-muted-foreground">{data.section_4_rights_mental_health.mental_health_crisis.suicide_risk.context}</div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-3">Top Prisoner Needs & Wishes</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {data.section_4_rights_mental_health.prisoner_needs.top_wishes.map((wish, index) => (
                                  <div key={index} className="flex items-start gap-2">
                                    <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-500 text-xs font-bold flex items-center justify-center shrink-0">
                                      {index + 1}
                                    </span>
                                    <span className="text-sm text-muted-foreground">{wish}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Overall Themes</h2>
          {data && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <UserX className="h-8 w-8 text-primary mb-3" />
                  <h4 className="font-bold mb-2">Mass Incarceration Crisis</h4>
                  <p className="text-sm text-muted-foreground">
                    {data.overall_themes.mass_incarceration_crisis.description}. 
                    Over {data.overall_themes.mass_incarceration_crisis.population} with {data.overall_themes.mass_incarceration_crisis.growth} increase.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Scale className="h-8 w-8 text-primary mb-3" />
                  <h4 className="font-bold mb-2">Racial Injustice</h4>
                  <p className="text-sm text-muted-foreground">
                    {data.overall_themes.racial_injustice.description}. 
                    Black Americans: {data.overall_themes.racial_injustice.black_disparity}.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <DollarSign className="h-8 w-8 text-primary mb-3" />
                  <h4 className="font-bold mb-2">Economic Burden</h4>
                  <p className="text-sm text-muted-foreground">
                    {data.overall_themes.economic_burden.description}. 
                    {data.overall_themes.economic_burden.opportunity_cost}.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Heart className="h-8 w-8 text-primary mb-3" />
                  <h4 className="font-bold mb-2">Human Cost</h4>
                  <p className="text-sm text-muted-foreground">
                    {data.overall_themes.human_cost.description}. 
                    Issues include {data.overall_themes.human_cost.mental_health}, {data.overall_themes.human_cost.educational_failure}.
                  </p>
                </CardContent>
              </Card>
              <Card className="md:col-span-2">
                <CardContent className="pt-6">
                  <Gavel className="h-8 w-8 text-primary mb-3" />
                  <h4 className="font-bold mb-2">Reform Urgency</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {data.overall_themes.reform_urgency.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {data.overall_themes.reform_urgency.areas?.map((area, i) => (
                      <Badge key={i} variant="outline">{area}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Download Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover-elevate">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-8 w-8 text-primary shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">Comprehensive Report (Word)</h4>
                    <p className="text-xs text-muted-foreground mb-3">Full 12,000-word analysis with APA7 citations</p>
                    <a 
                      href="/incarceration-research/data/US_Incarceration_Comprehensive_Report.docx" 
                      download
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      data-testid="link-download-report-docx"
                    >
                      <Download className="h-3 w-3" />
                      Download DOCX
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-8 w-8 text-primary shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">Report (HTML Version)</h4>
                    <p className="text-xs text-muted-foreground mb-3">Web-readable version of the comprehensive report</p>
                    <a 
                      href="/incarceration-research/data/US_Incarceration_Comprehensive_Report.html" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      data-testid="link-view-report-html"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View HTML
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="mt-12 pt-6 border-t border-border">
          <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Navigation</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/incarceration-research">
              <Button variant="outline" size="sm" data-testid="button-nav-hub">Incarceration Research Hub</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm" data-testid="button-nav-portfolio">Portfolio</Button>
            </Link>
          </div>
        </div>

        <footer className="mt-12 text-center text-sm text-muted-foreground pt-8 border-t">
          <p>Research compiled by Robert McCoy | 728 scholarly papers analyzed | January 2026</p>
          <p className="mt-2">Data Sources: Bureau of Justice Statistics, Academic Journals, Government Reports</p>
        </footer>
      </div>
    </div>
  );
}
