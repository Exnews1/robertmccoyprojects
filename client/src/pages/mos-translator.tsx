import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, Search, Briefcase, DollarSign, TrendingUp, GraduationCap, AlertCircle, Shield } from "lucide-react";

interface CareerMatch {
  title: string;
  socCode: string;
  alignment: number;
  salary: { entry: number; median: number; senior: number };
  outlook: "Bright" | "Average" | "Below Average";
  growthRate: number;
  additionalTraining: string[];
  sharedSkills: string[];
}

interface MOSData {
  code: string;
  title: string;
  branch: string;
  careers: CareerMatch[];
}

const MOS_DATABASE: Record<string, MOSData> = {
  "11B": {
    code: "11B",
    title: "Infantryman",
    branch: "Army",
    careers: [
      {
        title: "Security Manager",
        socCode: "11-9199.02",
        alignment: 85,
        salary: { entry: 55000, median: 85000, senior: 125000 },
        outlook: "Bright",
        growthRate: 5,
        additionalTraining: ["Security+ certification", "Bachelor's degree preferred"],
        sharedSkills: ["Leadership", "Risk Assessment", "Team Management", "Security Protocols"]
      },
      {
        title: "Police Officer",
        socCode: "33-3051",
        alignment: 78,
        salary: { entry: 45000, median: 65000, senior: 95000 },
        outlook: "Average",
        growthRate: 3,
        additionalTraining: ["Police Academy", "State certification"],
        sharedSkills: ["Tactical Operations", "Crisis Response", "Physical Fitness", "Discipline"]
      },
      {
        title: "Corrections Officer",
        socCode: "33-3012",
        alignment: 72,
        salary: { entry: 40000, median: 52000, senior: 75000 },
        outlook: "Average",
        growthRate: -2,
        additionalTraining: ["State certification", "Academy training"],
        sharedSkills: ["Discipline", "Conflict Resolution", "Physical Readiness"]
      }
    ]
  },
  "15T": {
    code: "15T",
    title: "Blackhawk Helicopter Repairer",
    branch: "Army",
    careers: [
      {
        title: "Aircraft Mechanic",
        socCode: "49-3011",
        alignment: 92,
        salary: { entry: 45000, median: 72000, senior: 105000 },
        outlook: "Bright",
        growthRate: 6,
        additionalTraining: ["FAA A&P certification"],
        sharedSkills: ["Aviation Systems", "Technical Diagnostics", "Safety Procedures", "Maintenance"]
      },
      {
        title: "Airline Pilot",
        socCode: "53-2011",
        alignment: 65,
        salary: { entry: 70000, median: 226600, senior: 400000 },
        outlook: "Bright",
        growthRate: 4,
        additionalTraining: ["PPL", "CPL", "ATP", "FAA Medical"],
        sharedSkills: ["Aviation Knowledge", "Technical Operations", "Safety Protocols"]
      },
      {
        title: "Aviation Inspector",
        socCode: "53-6051",
        alignment: 88,
        salary: { entry: 50000, median: 78000, senior: 110000 },
        outlook: "Average",
        growthRate: 2,
        additionalTraining: ["FAA certification", "Inspector training"],
        sharedSkills: ["Quality Assurance", "Technical Inspection", "Documentation"]
      }
    ]
  },
  "68W": {
    code: "68W",
    title: "Combat Medic Specialist",
    branch: "Army",
    careers: [
      {
        title: "Registered Nurse",
        socCode: "29-1141",
        alignment: 80,
        salary: { entry: 63000, median: 86000, senior: 133000 },
        outlook: "Bright",
        growthRate: 6,
        additionalTraining: ["BSN degree", "NCLEX-RN"],
        sharedSkills: ["Patient Care", "Emergency Response", "Medical Procedures", "Triage"]
      },
      {
        title: "Paramedic",
        socCode: "29-2043",
        alignment: 90,
        salary: { entry: 35000, median: 51000, senior: 75000 },
        outlook: "Bright",
        growthRate: 7,
        additionalTraining: ["Paramedic certification", "State license"],
        sharedSkills: ["Emergency Medicine", "Trauma Care", "Patient Assessment"]
      },
      {
        title: "Physician Assistant",
        socCode: "29-1071",
        alignment: 70,
        salary: { entry: 95000, median: 130000, senior: 175000 },
        outlook: "Bright",
        growthRate: 28,
        additionalTraining: ["Master's degree", "PA certification"],
        sharedSkills: ["Clinical Skills", "Patient Care", "Medical Decision Making"]
      }
    ]
  },
  "25B": {
    code: "25B",
    title: "Information Technology Specialist",
    branch: "Army",
    careers: [
      {
        title: "IT Support Specialist",
        socCode: "15-1232",
        alignment: 95,
        salary: { entry: 45000, median: 60000, senior: 85000 },
        outlook: "Bright",
        growthRate: 6,
        additionalTraining: ["CompTIA A+", "Network+"],
        sharedSkills: ["Technical Support", "Network Administration", "Troubleshooting"]
      },
      {
        title: "Cybersecurity Analyst",
        socCode: "15-1212",
        alignment: 82,
        salary: { entry: 70000, median: 112000, senior: 165000 },
        outlook: "Bright",
        growthRate: 33,
        additionalTraining: ["Security+", "CISSP", "CEH"],
        sharedSkills: ["Security Protocols", "Network Defense", "Threat Analysis"]
      },
      {
        title: "Network Administrator",
        socCode: "15-1244",
        alignment: 88,
        salary: { entry: 55000, median: 90000, senior: 130000 },
        outlook: "Average",
        growthRate: 3,
        additionalTraining: ["CCNA", "Network+"],
        sharedSkills: ["Network Configuration", "System Administration", "Technical Documentation"]
      }
    ]
  },
  "HM": {
    code: "HM",
    title: "Hospital Corpsman",
    branch: "Navy",
    careers: [
      {
        title: "Licensed Practical Nurse",
        socCode: "29-2061",
        alignment: 88,
        salary: { entry: 40000, median: 55000, senior: 65000 },
        outlook: "Average",
        growthRate: 5,
        additionalTraining: ["LPN program (12 months)", "State license"],
        sharedSkills: ["Patient Care", "Medical Procedures", "Clinical Skills"]
      },
      {
        title: "Registered Nurse",
        socCode: "29-1141",
        alignment: 78,
        salary: { entry: 63000, median: 86000, senior: 133000 },
        outlook: "Bright",
        growthRate: 6,
        additionalTraining: ["BSN degree", "NCLEX-RN"],
        sharedSkills: ["Patient Care", "Emergency Response", "Medical Procedures"]
      },
      {
        title: "Medical Assistant",
        socCode: "31-9092",
        alignment: 92,
        salary: { entry: 32000, median: 42000, senior: 55000 },
        outlook: "Bright",
        growthRate: 14,
        additionalTraining: ["CMA certification"],
        sharedSkills: ["Clinical Procedures", "Patient Intake", "Administrative Tasks"]
      }
    ]
  }
};

const BRANCH_OPTIONS = [
  { value: "Army", label: "Army" },
  { value: "Navy", label: "Navy" },
  { value: "Air Force", label: "Air Force" },
  { value: "Marines", label: "Marines" },
  { value: "Coast Guard", label: "Coast Guard" },
  { value: "Space Force", label: "Space Force" }
];

const MOS_OPTIONS: Record<string, Array<{ value: string; label: string }>> = {
  "Army": [
    { value: "11B", label: "11B - Infantryman" },
    { value: "15T", label: "15T - Blackhawk Helicopter Repairer" },
    { value: "68W", label: "68W - Combat Medic Specialist" },
    { value: "25B", label: "25B - IT Specialist" }
  ],
  "Navy": [
    { value: "HM", label: "HM - Hospital Corpsman" }
  ],
  "Air Force": [],
  "Marines": [],
  "Coast Guard": [],
  "Space Force": []
};

export default function MOSTranslator() {
  const [branch, setBranch] = useState<string>("");
  const [mos, setMos] = useState<string>("");
  const [result, setResult] = useState<MOSData | null>(null);
  const [searched, setSearched] = useState(false);

  function handleSearch() {
    if (!mos) return;
    setSearched(true);
    const data = MOS_DATABASE[mos];
    setResult(data || null);
  }

  function formatSalary(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  }

  function getOutlookColor(outlook: string) {
    switch (outlook) {
      case "Bright": return "bg-green-500/10 text-green-500 border-green-500/30";
      case "Below Average": return "bg-red-500/10 text-red-500 border-red-500/30";
      default: return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30";
    }
  }

  function getAlignmentColor(alignment: number) {
    if (alignment >= 85) return "text-green-500";
    if (alignment >= 70) return "text-yellow-500";
    return "text-orange-500";
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <nav className="mb-8 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-breadcrumb-portfolio">
            Portfolio
          </Link>
          <ChevronRight className="inline h-4 w-4 mx-2 text-muted-foreground" />
          <Link href="/cmgf" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-breadcrumb-cmgf">
            CMGF
          </Link>
          <ChevronRight className="inline h-4 w-4 mx-2 text-muted-foreground" />
          <span className="text-foreground">MOS Translator</span>
        </nav>

        <header className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">MOS-to-Career Translator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Translate your Military Occupational Specialty to civilian career matches.
            See salary ranges, skill alignment, and training requirements.
          </p>
        </header>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Branch</label>
                <Select value={branch} onValueChange={(v) => { setBranch(v); setMos(""); }}>
                  <SelectTrigger data-testid="select-branch">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANCH_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">MOS/Rating</label>
                <Select value={mos} onValueChange={setMos} disabled={!branch}>
                  <SelectTrigger data-testid="select-mos">
                    <SelectValue placeholder="Select MOS" />
                  </SelectTrigger>
                  <SelectContent>
                    {(MOS_OPTIONS[branch] || []).map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                    {(MOS_OPTIONS[branch] || []).length === 0 && (
                      <SelectItem value="_none" disabled>Coming soon</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={handleSearch} 
                  disabled={!mos}
                  className="w-full"
                  data-testid="button-translate"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Translate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {searched && result && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                <Briefcase className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{result.code} - {result.title}</h2>
                <p className="text-muted-foreground">{result.branch} | {result.careers.length} civilian career matches</p>
              </div>
            </div>

            <div className="grid gap-6">
              {result.careers.map((career, idx) => (
                <Card key={idx} className="border-border/50" data-testid={`card-career-${idx}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg">{career.title}</CardTitle>
                        <p className="text-xs text-muted-foreground">SOC: {career.socCode}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getOutlookColor(career.outlook)}>
                          {career.outlook} Outlook
                        </Badge>
                        <Badge variant="outline" className={getAlignmentColor(career.alignment)}>
                          {career.alignment}% Skill Match
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          Salary Range <span className="font-normal text-xs">(BLS OEWS)</span>
                        </div>
                        <div className="text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Entry:</span>
                            <span>{formatSalary(career.salary.entry)}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-primary">
                            <span className="text-muted-foreground">Median:</span>
                            <span>{formatSalary(career.salary.median)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Senior:</span>
                            <span>{formatSalary(career.salary.senior)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <TrendingUp className="h-4 w-4" />
                          Job Growth
                        </div>
                        <p className="text-sm">
                          {career.growthRate > 0 ? `+${career.growthRate}%` : `${career.growthRate}%`} (2024-2034)
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <GraduationCap className="h-4 w-4" />
                          Additional Training
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {career.additionalTraining.map((t, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{t}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-2">Transferable Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {career.sharedSkills.map((skill, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {searched && !result && (
          <Card className="border-border/50">
            <CardContent className="p-8 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">MOS Not Found</h3>
              <p className="text-muted-foreground">
                This MOS is not yet in our database. The demo includes select Army and Navy specialties.
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="mt-8 border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-foreground mb-1">Advisory Only</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Career matches are based on skill overlap, not predictions</li>
                  <li>Salary data from BLS OEWS (May 2024), may vary by location</li>
                  <li>Discuss all career decisions with your assigned advisor</li>
                  <li>No individual risk scoring or automated recommendations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
