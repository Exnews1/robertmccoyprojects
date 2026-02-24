import { useEffect, useState } from "react";
import { Link } from "wouter";
import { 
  Scale, Users, MapPin, TrendingDown, BarChart3, Building2, AlertTriangle,
  FileText, Download, ChevronRight, ArrowRight, X, Percent, DollarSign,
  RefreshCw, Gavel, Shield, Globe, ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StateData {
  State: string;
  Incarceration_Rate_per_100k: number;
  Total_Imprisoned: number;
  Prison_Population_Change_2020_2024: number;
  Region: string;
  Three_Strikes_Law: string;
  Mandatory_Minimum_Drug_Laws: string;
  Death_Penalty: string;
  Three_Year_Recidivism_Rate: number;
  Cost_per_Inmate_Annual: number;
  Rehabilitation_Program_Spending_Pct: number;
  Marijuana_Legalization: string;
}

interface PartyComparison {
  red_states: { count: number; total_imprisoned: number; overall_percentage_incarcerated: number };
  blue_states: { count: number; total_imprisoned: number; overall_percentage_incarcerated: number };
  purple_states: { count: number; total_imprisoned: number; overall_percentage_incarcerated: number };
  comparison: { red_vs_blue_percent_higher: number };
  source: string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

const keyFindings = [
  { 
    stat: "2.4M", 
    label: "People Incarcerated", 
    description: "Total U.S. incarcerated population as of 2024",
    icon: Users 
  },
  { 
    stat: "0.71%", 
    label: "Of U.S. Population", 
    description: "1 in 141 Americans are currently incarcerated",
    icon: Percent 
  },
  { 
    stat: "708", 
    label: "Per 100,000 Rate", 
    description: "Highest incarceration rate in the world",
    icon: BarChart3 
  },
  { 
    stat: "#1", 
    label: "Global Ranking", 
    description: "U.S. leads the world in incarceration",
    icon: Globe 
  },
];

const demographicData = [
  { group: "Black/African American", percentage: 38.2, rate: "5.9×", color: "bg-red-500" },
  { group: "White", percentage: 37.5, rate: "1×", color: "bg-blue-500" },
  { group: "Hispanic/Latino", percentage: 21.4, rate: "2.3×", color: "bg-orange-500" },
  { group: "Other", percentage: 2.9, rate: "—", color: "bg-green-500" },
];

const resources = [
  { 
    title: "Comprehensive Report (APA Format)", 
    description: "Full research analysis with citations",
    file: "/incarceration-research/data/US_Incarceration_System_Comprehensive_Report_APA.docx",
    type: "DOCX"
  },
  { 
    title: "Incarceration Percentages Report", 
    description: "State-by-state percentage analysis",
    file: "/incarceration-research/data/INCARCERATION_PERCENTAGES_REPORT.docx",
    type: "DOCX"
  },
  { 
    title: "State Data (CSV)", 
    description: "Comprehensive state-level dataset",
    file: "/incarceration-research/data/dashboard_comprehensive_state_data.csv",
    type: "CSV"
  },
];

export default function IncarcerationResearch() {
  const [stateData, setStateData] = useState<StateData[]>([]);
  const [partyData, setPartyData] = useState<PartyComparison | null>(null);
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [regionFilter, setRegionFilter] = useState<string>("all");

  useEffect(() => {
    async function loadData() {
      try {
        const [stateResponse, partyResponse] = await Promise.all([
          fetch("/incarceration-research/data/dashboard_comprehensive_state_data.csv"),
          fetch("/incarceration-research/data/party_comparison_summary.json")
        ]);
        
        const csvText = await stateResponse.text();
        const lines = csvText.trim().split("\n");
        const headers = parseCSVLine(lines[0]);
        
        const numericFields = ["Incarceration_Rate_per_100k", "Total_Imprisoned", "Prison_Population_Change_2020_2024", 
                              "Three_Year_Recidivism_Rate", "Cost_per_Inmate_Annual", "Rehabilitation_Program_Spending_Pct"];
        
        const parsed: StateData[] = lines.slice(1).map(line => {
          const values = parseCSVLine(line);
          const obj: Record<string, string | number> = {};
          headers.forEach((header, i) => {
            const val = values[i] || '';
            if (numericFields.includes(header)) {
              obj[header] = parseFloat(val) || 0;
            } else {
              obj[header] = val;
            }
          });
          return obj as unknown as StateData;
        }).filter(d => d.State && d.State.length > 0);

        setStateData(parsed);
        
        const partyJson = await partyResponse.json();
        setPartyData(partyJson);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredStates = regionFilter === "all" 
    ? stateData 
    : stateData.filter(s => s.Region === regionFilter);

  const sortedByRate = [...filteredStates].sort((a, b) => b.Incarceration_Rate_per_100k - a.Incarceration_Rate_per_100k);
  const topStates = sortedByRate.slice(0, 10);
  const bottomStates = [...filteredStates].sort((a, b) => a.Incarceration_Rate_per_100k - b.Incarceration_Rate_per_100k).slice(0, 5);

  const regions = ["all", ...Array.from(new Set(stateData.map(s => s.Region)))].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <nav className="mb-8 text-sm">
          <Link href="/research" className="text-muted-foreground hover:text-primary transition-colors">
            Portfolio
          </Link>
          <ChevronRight className="inline h-4 w-4 mx-2 text-muted-foreground" />
          <span className="text-foreground">U.S. Incarceration Research Hub</span>
        </nav>

        <header className="mb-12 text-center">
          <div className="text-xs text-muted-foreground mb-3">Data Sources: Bureau of Justice Statistics, Prison Policy Initiative, The Sentencing Project (2024)</div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Scale className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">U.S. Incarceration Research Hub</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Comprehensive data, analysis, and insights on the American criminal justice system. 
            Evidence-based research exploring policies, demographics, and outcomes across all 50 states.
          </p>
        </header>

        <section className="mb-8">
          <Link href="/research/incarceration-research/hard-truths" data-testid="link-hard-truths">
            <Card className="hover-elevate cursor-pointer border-primary/30 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Scale className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Hard Truths of the Incarceration System</h3>
                      <p className="text-sm text-muted-foreground">
                        Evidence-based analysis from 728 scholarly papers on economics, prison life, education, and mental health
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-primary shrink-0" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>

        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {keyFindings.map((finding, index) => (
              <Card key={index} className="text-center" data-testid={`card-stat-${index}`}>
                <CardContent className="pt-6">
                  <finding.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="text-3xl font-bold text-foreground mb-1" data-testid={`text-stat-value-${index}`}>{finding.stat}</div>
                  <div className="text-sm font-medium text-foreground mb-2" data-testid={`text-stat-label-${index}`}>{finding.label}</div>
                  <p className="text-xs text-muted-foreground">{finding.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12" data-testid="section-key-findings">
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-1 bg-primary rounded-full shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    Key Findings
                  </h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>The United States has the highest incarceration rate in the world, with 708 people per 100,000 in prison</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Red (Republican) states incarcerate 16% more people than Blue (Democratic) states on average</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Louisiana has the highest rate (1.11% of population) while Minnesota has the lowest (0.38%)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>Black Americans are incarcerated at 5.9× the rate of White Americans</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>67.5% of released prisoners are re-arrested within 3 years</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Demographics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Race & Ethnicity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {demographicData.map((demo, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{demo.group}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{demo.percentage}%</span>
                        {demo.rate !== "—" && demo.rate !== "1×" && (
                          <Badge variant="secondary" className="text-xs">{demo.rate} rate</Badge>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className={`${demo.color} h-2 rounded-full`} style={{ width: `${demo.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-primary" />
                  Political Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {partyData ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-red-500/10 rounded-lg">
                        <div className="text-2xl font-bold text-red-500">{partyData.red_states.count}</div>
                        <div className="text-xs text-muted-foreground">Red States</div>
                        <div className="text-sm font-medium mt-1">{partyData.red_states.overall_percentage_incarcerated.toFixed(2)}%</div>
                      </div>
                      <div className="p-3 bg-blue-500/10 rounded-lg">
                        <div className="text-2xl font-bold text-blue-500">{partyData.blue_states.count}</div>
                        <div className="text-xs text-muted-foreground">Blue States</div>
                        <div className="text-sm font-medium mt-1">{partyData.blue_states.overall_percentage_incarcerated.toFixed(2)}%</div>
                      </div>
                      <div className="p-3 bg-purple-500/10 rounded-lg">
                        <div className="text-2xl font-bold text-purple-500">{partyData.purple_states.count}</div>
                        <div className="text-xs text-muted-foreground">Purple States</div>
                        <div className="text-sm font-medium mt-1">{partyData.purple_states.overall_percentage_incarcerated.toFixed(2)}%</div>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <div className="text-lg font-bold text-foreground">
                        Red states incarcerate {partyData.comparison.red_vs_blue_percent_higher.toFixed(1)}% more
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{partyData.source}</div>
                    </div>
                  </div>
                ) : (
                  <div className="animate-pulse space-y-4">
                    <div className="h-20 bg-muted rounded" />
                    <div className="h-12 bg-muted rounded" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">State Comparison</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filter by region:</span>
              <select 
                value={regionFilter} 
                onChange={(e) => setRegionFilter(e.target.value)}
                className="px-3 py-1.5 text-sm border rounded-md bg-background"
                data-testid="select-region-filter"
              >
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region === "all" ? "All Regions" : region}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-500">
                  <TrendingDown className="h-5 w-5 rotate-180" />
                  Highest Incarceration Rates
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="animate-pulse space-y-2">
                    {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-muted rounded" />)}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {topStates.map((state, index) => (
                      <button
                        key={state.State}
                        onClick={() => setSelectedState(state)}
                        className="w-full flex items-center justify-between p-2 rounded hover-elevate text-left"
                        data-testid={`button-state-${state.State.toLowerCase().replace(/\s/g, '-')}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-500 text-xs font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="font-medium">{state.State}</span>
                          <Badge variant="outline" className="text-xs">{state.Region}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-red-500">{state.Incarceration_Rate_per_100k}</span>
                          <span className="text-xs text-muted-foreground">per 100k</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-500">
                  <TrendingDown className="h-5 w-5" />
                  Lowest Incarceration Rates
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="animate-pulse space-y-2">
                    {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-muted rounded" />)}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {bottomStates.map((state, index) => (
                      <button
                        key={state.State}
                        onClick={() => setSelectedState(state)}
                        className="w-full flex items-center justify-between p-2 rounded hover-elevate text-left"
                        data-testid={`button-state-${state.State.toLowerCase().replace(/\s/g, '-')}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-500 text-xs font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="font-medium">{state.State}</span>
                          <Badge variant="outline" className="text-xs">{state.Region}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-green-500">{state.Incarceration_Rate_per_100k}</span>
                          <span className="text-xs text-muted-foreground">per 100k</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Resources & Downloads</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {resources.map((resource, index) => (
              <Card key={index} className="hover-elevate">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="h-8 w-8 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-1">{resource.title}</h4>
                      <p className="text-xs text-muted-foreground mb-3">{resource.description}</p>
                      <a 
                        href={resource.file} 
                        download
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        data-testid={`link-download-${resource.type.toLowerCase()}-${index}`}
                      >
                        <Download className="h-3 w-3" />
                        Download {resource.type}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Data Sources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Primary Sources</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>U.S. Census Bureau (2024)</li>
                    <li>Bureau of Justice Statistics</li>
                    <li>Prison Policy Initiative</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Research Organizations</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>The Sentencing Project</li>
                    <li>Council on Criminal Justice</li>
                    <li>Vera Institute of Justice</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Political Data</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>Ballotpedia (2024)</li>
                    <li>State election results</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Academic Sources</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>74 peer-reviewed papers</li>
                    <li>Criminal justice journals</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <footer className="text-center text-sm text-muted-foreground pt-8 border-t">
          <p>Last Updated: January 2026 | Data compiled from government agencies and peer-reviewed research</p>
        </footer>
      </div>

      <Dialog open={!!selectedState} onOpenChange={() => setSelectedState(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {selectedState?.State}
            </DialogTitle>
            <DialogDescription>
              Region: {selectedState?.Region}
            </DialogDescription>
          </DialogHeader>
          {selectedState && (
            <div className="space-y-4" data-testid="dialog-state-details">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs text-muted-foreground">Incarceration Rate</div>
                  <div className="text-xl font-bold" data-testid="text-state-rate">{selectedState.Incarceration_Rate_per_100k}</div>
                  <div className="text-xs text-muted-foreground">per 100,000</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs text-muted-foreground">Total Imprisoned</div>
                  <div className="text-xl font-bold" data-testid="text-state-total">{selectedState.Total_Imprisoned.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs text-muted-foreground">Recidivism Rate (3yr)</div>
                  <div className="text-xl font-bold" data-testid="text-state-recidivism">{selectedState.Three_Year_Recidivism_Rate}%</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs text-muted-foreground">Cost per Inmate</div>
                  <div className="text-xl font-bold" data-testid="text-state-cost">${selectedState.Cost_per_Inmate_Annual.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">annually</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Policies</h4>
                <div className="flex flex-wrap gap-2" data-testid="badges-state-policies">
                  <Badge variant={selectedState.Three_Strikes_Law === "Yes" ? "destructive" : "secondary"} data-testid="badge-three-strikes">
                    Three Strikes: {selectedState.Three_Strikes_Law}
                  </Badge>
                  <Badge variant={selectedState.Death_Penalty === "Yes" ? "destructive" : "secondary"} data-testid="badge-death-penalty">
                    Death Penalty: {selectedState.Death_Penalty}
                  </Badge>
                  <Badge variant="outline" data-testid="badge-marijuana">
                    Marijuana: {selectedState.Marijuana_Legalization}
                  </Badge>
                </div>
              </div>

              <div className="text-xs text-muted-foreground pt-2 border-t" data-testid="text-population-change">
                Population change 2020-2024: {selectedState.Prison_Population_Change_2020_2024}%
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
