import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Play,
  BarChart3,
  FileText,
  Layers,
  Shield,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Target,
  Zap,
  Download,
  Eye,
  Loader2,
  Sparkles,
  Activity,
  Database,
  Home,
} from "lucide-react";
import { CMGFAdvisoryNotice } from "@/components/cmgf-advisory-notice";

interface ReadinessScore {
  dimension: string;
  status: string;
  label: string;
}

interface VisualData {
  readinessScores: ReadinessScore[];
  pathwayCount: number;
  constraintCount: number;
  highRiskCount: number;
  overallFeasibility: string;
  dataCompleteness: number;
}

interface ScenarioResult {
  scenarioId: string;
  profile: any;
  inputs: {
    mos: string;
    mosLabel: string;
    careerGoal: string;
    goalLabel: string;
    rank: string;
    yearsOfService: number;
    constraints: string[];
  };
  outputs: {
    pathwayOptions: Array<{ name: string; match: string; timeframe: string }>;
    constraintRisks: Array<{ label: string; severity: string; detail: string }>;
    policyFriction: Array<{ point: string; framework: string }>;
    resourcesRequired: Array<{ resource: string; status: string }>;
    readinessMeasures: Array<{ dimension: string; status: string; label: string; detail: string }>;
    specialConsiderations: string[];
    timelineRange: string;
    explanation?: string;
  };
  explanation: string;
  visualData: VisualData;
  governanceMetadata: {
    engineVersion: string;
    executionType: string;
    dataSources: string[];
    humanReviewRequired: boolean;
    timestamp: string;
  };
  reportUrl?: string;
}

interface BatchResult {
  batchId: string;
  totalCases: number;
  completedCases: number;
  failedCases: number;
  results: ScenarioResult[];
  summary: {
    feasibilityDistribution: { high: number; moderate: number; low: number };
    averageDataCompleteness: number;
    totalHighRiskConstraints: number;
    averagePathwayCount: number;
    constraintFrequency: Array<{ label: string; count: number; percentage: number }>;
    mosDistribution: Array<{ mos: string; count: number; percentage: number }>;
    goalDistribution: Array<{ goal: string; count: number; percentage: number }>;
    readinessByDimension: Array<{ dimension: string; green: number; yellow: number; red: number }>;
  };
}

const STATUS_MESSAGES = [
  "Initializing CMGF Rules Engine...",
  "Generating synthetic service member profile...",
  "Mapping MOS competencies to career domains...",
  "Binding policy constraints (Army COOL, DoD TA)...",
  "Calculating domain alignment scores...",
  "Analyzing credential stacking sequences...",
  "Evaluating timeline feasibility...",
  "Assessing family impact indicators...",
  "Computing transition stress factors...",
  "Compiling pathway options...",
  "Generating readiness assessment...",
  "Validating deterministic outputs...",
  "Preparing advisory summary...",
];

const BATCH_MESSAGES = [
  "Initializing batch simulation engine...",
  "Generating diverse synthetic profiles...",
  "Running constraint analysis across all cases...",
  "Aggregating readiness scores...",
  "Computing institutional-level statistics...",
  "Identifying recurring constraint patterns...",
  "Building Installation Status Report data...",
  "De-identifying individual records...",
  "Compiling aggregate findings...",
  "Finalizing ISR summary...",
];

function StatusColor({ status }: { status: string }) {
  const color = status === "green" ? "bg-emerald-400/80" : status === "yellow" ? "bg-amber-400/80" : "bg-rose-400/80";
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${color}`} />;
}

function AnimatedProgress({ messages, isActive }: { messages: string[]; isActive: boolean }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setCurrentIdx(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % messages.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isActive, messages.length]);

  if (!isActive) return null;

  return (
    <div className="mt-4 space-y-3" data-testid="progress-animation">
      <div className="flex items-center gap-3">
        <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
        <span className="text-sm text-blue-300 font-mono">{messages[currentIdx]}</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-1.5">
        <div
          className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full transition-all duration-1000"
          style={{ width: `${Math.min(((currentIdx + 1) / messages.length) * 100, 95)}%` }}
        />
      </div>
    </div>
  );
}

const LIVE_RULE_STEPS = [
  { signal: "MOS Code", source: "IPPS-A", rule: "Map MOS → O*NET SOC codes", status: "reading" as const },
  { signal: "Career Goal", source: "O*NET / BLS", rule: "Validate SOC alignment & demand", status: "reading" as const },
  { signal: "Years of Service", source: "IPPS-A", rule: "Calculate remaining TA/CA eligibility window", status: "reading" as const },
  { signal: "Credential Inventory", source: "Army COOL", rule: "Check existing certs against goal requirements", status: "evaluating" as const },
  { signal: "Funding Status", source: "DoD TA Policy", rule: "Evaluate TA cap ($4,000/yr) and CA availability", status: "evaluating" as const },
  { signal: "Deployment Status", source: "Unit Records", rule: "Flag access barriers for deployed SMs", status: "evaluating" as const },
  { signal: "Domain Alignment", source: "CMGF Engine", rule: "Compute MOS→Goal skill transfer percentage", status: "evaluating" as const },
  { signal: "Constraint Density", source: "CMGF Engine", rule: "Score compounding friction factors", status: "deciding" as const },
  { signal: "Pathway Feasibility", source: "CMGF Engine", rule: "Determine timeline viability against ETS", status: "deciding" as const },
  { signal: "Human Review Gate", source: "Governance Layer", rule: "Flag for ESO/Advisor validation before action", status: "deciding" as const },
];

function LiveGovernancePanel({ isProcessing }: { isProcessing: boolean }) {
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    if (!isProcessing) {
      setActiveStep(-1);
      return;
    }
    setActiveStep(0);
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev >= LIVE_RULE_STEPS.length - 1) return prev;
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [isProcessing]);

  if (!isProcessing) return null;

  return (
    <Card className="border-sky-900/40 bg-sky-950/20" data-testid="live-governance-panel">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Shield className="w-4 h-4 text-sky-300 animate-pulse" />
          Live Governance Transparency
          <Badge className="text-[9px] bg-sky-900/40 text-sky-200 border border-sky-800/40 ml-auto">LIVE</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1" data-testid="live-rule-steps">
        <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-x-3 gap-y-0.5 text-[11px] font-mono">
          <div className="text-muted-foreground/50 font-sans text-[10px] uppercase tracking-wider pb-1">Status</div>
          <div className="text-muted-foreground/50 font-sans text-[10px] uppercase tracking-wider pb-1">Signal → Source</div>
          <div className="text-muted-foreground/50 font-sans text-[10px] uppercase tracking-wider pb-1">Rule Evaluated</div>
          <div className="text-muted-foreground/50 font-sans text-[10px] uppercase tracking-wider pb-1">Phase</div>
          {LIVE_RULE_STEPS.map((step, i) => {
            const isActive = i === activeStep;
            const isDone = i < activeStep;
            const isPending = i > activeStep;
            return (
              <div key={i} className={`contents ${isPending ? "opacity-20" : isDone ? "opacity-60" : ""}`}>
                <div className="flex items-center py-0.5">
                  {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  {isActive && <Loader2 className="w-3 h-3 text-sky-300 animate-spin" />}
                  {isPending && <div className="w-3 h-3 rounded-full border border-muted-foreground/20" />}
                </div>
                <div className={`py-0.5 ${isActive ? "text-sky-200" : "text-muted-foreground/80"}`}>
                  {step.signal} <span className="text-muted-foreground/40">←</span> {step.source}
                </div>
                <div className={`py-0.5 ${isActive ? "text-foreground/90" : "text-muted-foreground/60"}`}>
                  {step.rule}
                </div>
                <div className="py-0.5">
                  <Badge variant="outline" className={`text-[9px] ${
                    step.status === "reading" ? "border-sky-800/40 text-sky-300/70" :
                    step.status === "evaluating" ? "border-amber-800/40 text-amber-300/70" :
                    "border-emerald-800/40 text-emerald-300/70"
                  }`}>
                    {step.status === "reading" ? "READ" : step.status === "evaluating" ? "EVAL" : "DECIDE"}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 text-xs mt-3 p-2 bg-amber-950/20 rounded border border-amber-800/20">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-300/80 shrink-0" />
          <span className="text-amber-200/80">All outputs require human advisor review before action</span>
        </div>
      </CardContent>
    </Card>
  );
}

function GovernancePanel({ metadata }: { metadata: ScenarioResult["governanceMetadata"] }) {
  return (
    <Card className="border-sky-900/30 bg-sky-950/15">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Shield className="w-4 h-4 text-sky-300/80" />
          Governance Transparency
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2" data-testid="governance-panel">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Engine Version</span>
            <p className="font-mono text-sky-300/80">{metadata.engineVersion}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Execution Type</span>
            <p className="font-mono text-emerald-300/80">{metadata.executionType}</p>
          </div>
        </div>
        <div className="text-xs">
          <span className="text-muted-foreground">Data Sources Consulted</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {metadata.dataSources.map((ds, i) => (
              <Badge key={i} variant="outline" className="text-[10px] border-border/40">{ds}</Badge>
            ))}
          </div>
        </div>
        <div className="text-xs mt-1">
          <span className="text-muted-foreground">Rules Evaluated</span>
          <p className="font-mono text-muted-foreground/70 mt-0.5">
            {LIVE_RULE_STEPS.length} signals checked → {LIVE_RULE_STEPS.filter(s => s.status === "evaluating").length} rules evaluated → {LIVE_RULE_STEPS.filter(s => s.status === "deciding").length} decisions rendered
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs mt-2 p-2 bg-amber-950/20 rounded border border-amber-800/20">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-300/80 shrink-0" />
          <span className="text-amber-200/80">Human advisor review required before action</span>
        </div>
        <p className="text-[10px] text-muted-foreground/50 italic mt-1">AI explains. Rules decide.</p>
      </CardContent>
    </Card>
  );
}

export default function DemoMode() {
  const [selectedProfile, setSelectedProfile] = useState("signal_to_cyber");
  const [currentScenario, setCurrentScenario] = useState<ScenarioResult | null>(null);
  const [batchResult, setBatchResult] = useState<BatchResult | null>(null);
  const [view, setView] = useState<"control" | "scenario" | "dashboard" | "batch" | "report">("control");
  const [reportHtml, setReportHtml] = useState<string>("");
  const [batchReportHtml, setBatchReportHtml] = useState<string>("");

  const { data: profileTypes } = useQuery<Array<{ type: string; label: string; group: string; alignment: string; summary: string }>>({
    queryKey: ["/api/orchestrator/profile-types"],
  });

  const runScenarioMutation = useMutation({
    mutationFn: async (profileType: string) => {
      const res = await apiRequest("POST", "/api/orchestrator/run-scenario", {
        profileType,
        generateReport: true,
      });
      return res.json();
    },
    onSuccess: (data: ScenarioResult) => {
      setCurrentScenario(data);
      setView("scenario");
    },
  });

  const runBatchMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/orchestrator/run-batch", { count: 10 });
      return res.json();
    },
    onSuccess: (data: BatchResult) => {
      setBatchResult(data);
      setView("batch");
    },
  });

  const generateReportMutation = useMutation({
    mutationFn: async ({ scenarioId, reportType }: { scenarioId: string; reportType: string }) => {
      const res = await apiRequest("POST", "/api/reports/generate", { scenarioId, reportType });
      const data = await res.json();
      const reportRes = await fetch(data.url);
      return reportRes.text();
    },
    onSuccess: (html: string) => {
      setReportHtml(html);
      setView("report");
    },
  });

  const generateBatchReportMutation = useMutation({
    mutationFn: async (batch: BatchResult) => {
      const res = await apiRequest("POST", "/api/reports/generate-batch", {
        batchId: batch.batchId,
        totalCases: batch.totalCases,
        results: batch.results,
      });
      const data = await res.json();
      const reportRes = await fetch(data.url);
      return reportRes.text();
    },
    onSuccess: (html: string) => {
      setBatchReportHtml(html);
      setView("report");
    },
  });

  const isProcessing = runScenarioMutation.isPending || runBatchMutation.isPending || generateReportMutation.isPending || generateBatchReportMutation.isPending;

  const handleBack = useCallback(() => {
    if (view === "report" && batchResult) setView("batch");
    else if (view === "report" || view === "dashboard") setView("scenario");
    else setView("control");
  }, [view, batchResult]);

  const smViewAvailable = !!currentScenario;
  const batchViewAvailable = !!batchResult;

  const navItems: Array<{ key: typeof view; label: string; available: boolean; icon: typeof Home }> = [
    { key: "control", label: "Demo Home", available: true, icon: Home },
    { key: "scenario", label: "SM Results", available: smViewAvailable, icon: Target },
    { key: "dashboard", label: "Dashboard", available: smViewAvailable, icon: BarChart3 },
    { key: "batch", label: "ESO / ISR", available: batchViewAvailable, icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <nav className="flex items-center gap-1 mb-5 pb-3 border-b border-border/30 overflow-x-auto" data-testid="nav-demo">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = view === item.key || (view === "report" && ((item.key === "scenario" && reportHtml) || (item.key === "batch" && batchReportHtml && !reportHtml)));
            return (
              <div key={item.key} className="flex items-center shrink-0">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 mx-1" />}
                <button
                  onClick={() => item.available && setView(item.key)}
                  disabled={!item.available}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : item.available
                        ? "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        : "text-muted-foreground/30 cursor-not-allowed"
                  }`}
                  data-testid={`nav-${item.key}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              </div>
            );
          })}
          {currentScenario && (view === "scenario" || view === "dashboard" || (view === "report" && reportHtml)) && (
            <div className="ml-auto flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground/60 hidden sm:inline">{currentScenario.profile.name}</span>
              <Badge variant="outline" className="text-[10px] border-border/40 text-muted-foreground/60 font-mono">
                {currentScenario.scenarioId.slice(0, 12)}...
              </Badge>
            </div>
          )}
        </nav>

        <CMGFAdvisoryNotice />

        {view === "control" && (
          <ControlPanel
            profileTypes={profileTypes || []}
            selectedProfile={selectedProfile}
            setSelectedProfile={setSelectedProfile}
            onRunScenario={() => runScenarioMutation.mutate(selectedProfile)}
            onRunBatch={() => runBatchMutation.mutate()}
            isProcessing={isProcessing}
            isRunningScenario={runScenarioMutation.isPending}
            isRunningBatch={runBatchMutation.isPending}
          />
        )}

        {view === "scenario" && currentScenario && (
          <ScenarioView
            scenario={currentScenario}
            onShowDashboard={() => setView("dashboard")}
            onExportReport={(type: string) =>
              generateReportMutation.mutate({ scenarioId: currentScenario.scenarioId, reportType: type })
            }
            isExporting={generateReportMutation.isPending}
          />
        )}

        {view === "dashboard" && currentScenario && (
          <DashboardView scenario={currentScenario} />
        )}

        {view === "batch" && batchResult && (
          <BatchView
            batch={batchResult}
            onGenerateISR={() => generateBatchReportMutation.mutate(batchResult)}
            isGenerating={generateBatchReportMutation.isPending}
          />
        )}

        {view === "report" && (reportHtml || batchReportHtml) && (
          <ReportView
            html={reportHtml || batchReportHtml}
            scenario={reportHtml ? currentScenario : null}
            isBatchReport={!!batchReportHtml && !reportHtml}
          />
        )}
      </div>
    </div>
  );
}

function ControlPanel({
  profileTypes,
  selectedProfile,
  setSelectedProfile,
  onRunScenario,
  onRunBatch,
  isProcessing,
  isRunningScenario,
  isRunningBatch,
}: {
  profileTypes: Array<{ type: string; label: string; group: string; alignment: string; summary: string }>;
  selectedProfile: string;
  setSelectedProfile: (v: string) => void;
  onRunScenario: () => void;
  onRunBatch: () => void;
  isProcessing: boolean;
  isRunningScenario: boolean;
  isRunningBatch: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <Badge variant="outline" className="border-blue-800 text-blue-300 text-xs">Orchestration Engine</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" data-testid="text-demo-title">
          CMGF Demo Mode
        </h1>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          One-click scenario generation, analysis, and reporting.
          Governed, bounded, and deterministic.
        </p>
      </div>

      <Card className="border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            Scenario Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Select Case Study</label>
            <Select value={selectedProfile} onValueChange={setSelectedProfile}>
              <SelectTrigger className="w-full h-auto py-2" data-testid="select-profile-type">
                <SelectValue placeholder="Select a case study" />
              </SelectTrigger>
              <SelectContent className="max-h-[400px]">
                <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">Career Aligned</div>
                {profileTypes.filter(pt => pt.group === "aligned").map(pt => (
                  <SelectItem key={pt.type} value={pt.type}>
                    <div className="flex items-center gap-2">
                      <span>{pt.label}</span>
                      <span className="text-[10px] text-emerald-300 font-mono">{pt.alignment}</span>
                    </div>
                  </SelectItem>
                ))}
                <div className="px-2 py-1.5 mt-1 text-[10px] font-semibold uppercase tracking-wider text-rose-300 border-t border-border/30">Non-Aligned</div>
                {profileTypes.filter(pt => pt.group === "non_aligned").map(pt => (
                  <SelectItem key={pt.type} value={pt.type}>
                    <div className="flex items-center gap-2">
                      <span>{pt.label}</span>
                      <span className="text-[10px] text-rose-300 font-mono">{pt.alignment}</span>
                    </div>
                  </SelectItem>
                ))}
                <div className="px-2 py-1.5 mt-1 text-[10px] font-semibold uppercase tracking-wider text-amber-300 border-t border-border/30">Constrained</div>
                {profileTypes.filter(pt => pt.group === "constrained").map(pt => (
                  <SelectItem key={pt.type} value={pt.type}>
                    <div className="flex items-center gap-2">
                      <span>{pt.label}</span>
                      <span className="text-[10px] text-amber-300 font-mono">{pt.alignment}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(() => {
              const selected = profileTypes.find(pt => pt.type === selectedProfile);
              if (!selected) return null;
              return (
                <p className="text-xs text-muted-foreground/80 mt-1.5 px-1" data-testid="text-case-summary">
                  {selected.summary}
                </p>
              );
            })()}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={onRunScenario}
              disabled={isProcessing}
              className="h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              data-testid="button-generate-scenario"
            >
              {isRunningScenario ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              <div className="text-left">
                <div className="font-semibold">SM Demo</div>
                <div className="text-xs opacity-80">Individual service member analysis</div>
              </div>
            </Button>

            <Button
              onClick={onRunBatch}
              disabled={isProcessing}
              variant="outline"
              className="h-14 border-purple-800 hover:bg-purple-950/50"
              data-testid="button-batch-simulation"
            >
              {isRunningBatch ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Layers className="w-4 h-4 mr-2" />
              )}
              <div className="text-left">
                <div className="font-semibold">ESO / ISR Demo</div>
                <div className="text-xs opacity-80">Aggregated institutional analysis</div>
              </div>
            </Button>
          </div>

          <AnimatedProgress
            messages={isRunningBatch ? BATCH_MESSAGES : STATUS_MESSAGES}
            isActive={isProcessing}
          />
        </CardContent>
      </Card>

      <LiveGovernancePanel isProcessing={isProcessing} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-slate-800">
          <CardContent className="pt-4 pb-3 text-center">
            <Database className="w-5 h-5 mx-auto text-sky-300/80 mb-1" />
            <p className="text-xs text-muted-foreground">Rules Engine</p>
            <p className="text-sm font-semibold text-emerald-300">Active</p>
          </CardContent>
        </Card>
        <Card className="border-slate-800">
          <CardContent className="pt-4 pb-3 text-center">
            <Shield className="w-5 h-5 mx-auto text-amber-300/80 mb-1" />
            <p className="text-xs text-muted-foreground">Governance</p>
            <p className="text-sm font-semibold text-emerald-300">Enforced</p>
          </CardContent>
        </Card>
        <Card className="border-slate-800">
          <CardContent className="pt-4 pb-3 text-center">
            <Activity className="w-5 h-5 mx-auto text-cyan-300/80 mb-1" />
            <p className="text-xs text-muted-foreground">Execution</p>
            <p className="text-sm font-semibold text-emerald-300">Deterministic</p>
          </CardContent>
        </Card>
        <Card className="border-slate-800">
          <CardContent className="pt-4 pb-3 text-center">
            <Users className="w-5 h-5 mx-auto text-purple-300/80 mb-1" />
            <p className="text-xs text-muted-foreground">Human Review</p>
            <p className="text-sm font-semibold text-amber-300">Required</p>
          </CardContent>
        </Card>
      </div>

      <GovernancePanel metadata={{
        engineVersion: "CMGF v1.0",
        executionType: "Deterministic Rules Engine",
        dataSources: ["Army COOL Policy", "DoD TA Policy", "O*NET", "BLS", "IPPS-A", "JST"],
        humanReviewRequired: true,
        timestamp: new Date().toISOString(),
      }} />
    </div>
  );
}

function ScenarioView({
  scenario,
  onShowDashboard,
  onExportReport,
  isExporting,
}: {
  scenario: ScenarioResult;
  onShowDashboard: () => void;
  onExportReport: (type: string) => void;
  isExporting: boolean;
}) {
  const { inputs, outputs, visualData, governanceMetadata } = scenario;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold" data-testid="text-scenario-title">
            {scenario.profile.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            {inputs.rank} | {inputs.mosLabel} → {inputs.goalLabel}
          </p>
          <p className="text-xs font-mono text-sky-300/70 mt-1">{scenario.scenarioId}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={onShowDashboard} data-testid="button-show-dashboard">
            <BarChart3 className="w-3.5 h-3.5 mr-1.5" />Dashboard
          </Button>
          <Button size="sm" variant="outline" onClick={() => onExportReport("pathway")} disabled={isExporting} data-testid="button-export-sm-report">
            <FileText className="w-3.5 h-3.5 mr-1.5" />{isExporting ? "..." : "SM Report"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-slate-800">
          <CardContent className="pt-3 pb-2 text-center">
            <p className="text-xs text-muted-foreground">Feasibility</p>
            <p className={`text-lg font-bold ${visualData.overallFeasibility === "High" ? "text-emerald-300" : visualData.overallFeasibility === "Moderate" ? "text-amber-300" : "text-rose-300"}`}>
              {visualData.overallFeasibility}
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-800">
          <CardContent className="pt-3 pb-2 text-center">
            <p className="text-xs text-muted-foreground">Pathways</p>
            <p className="text-lg font-bold text-sky-300">{visualData.pathwayCount}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-800">
          <CardContent className="pt-3 pb-2 text-center">
            <p className="text-xs text-muted-foreground">Constraints</p>
            <p className="text-lg font-bold text-amber-300">{visualData.constraintCount}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-800">
          <CardContent className="pt-3 pb-2 text-center">
            <p className="text-xs text-muted-foreground">High Risk</p>
            <p className={`text-lg font-bold ${visualData.highRiskCount > 0 ? "text-rose-300" : "text-emerald-300"}`}>{visualData.highRiskCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Readiness Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2" data-testid="readiness-assessment">
            {outputs.readinessMeasures.map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded bg-card/60 border border-border/30">
                <StatusColor status={r.status} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground/90">{r.dimension}</p>
                  <p className="text-xs text-muted-foreground/80 truncate">{r.detail}</p>
                </div>
                <Badge variant="outline" className={`text-[10px] shrink-0 ${r.status === "green" ? "border-emerald-700/60 text-emerald-300" : r.status === "yellow" ? "border-amber-700/60 text-amber-300" : "border-rose-700/60 text-rose-300"}`}>
                  {r.label}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pathway Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2" data-testid="pathway-options">
            {outputs.pathwayOptions.map((p, i) => (
              <div key={i} className="p-2.5 rounded bg-card/60 border border-border/30 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground/90">{p.name}</p>
                  <p className="text-xs text-muted-foreground/80">{p.timeframe}</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <Badge className="bg-sky-900/40 text-sky-200 text-xs border border-sky-800/40">{p.match}</Badge>
                  <p className="text-[9px] text-muted-foreground/60 mt-0.5">skill match</p>
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground mt-2">
              <Clock className="w-3 h-3 inline mr-1" />
              {outputs.timelineRange}
            </p>
          </CardContent>
        </Card>
      </div>

      {outputs.constraintRisks.length > 0 && (
        <Card className="border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Constraint Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2" data-testid="constraint-analysis">
            {outputs.constraintRisks.map((c, i) => (
              <div key={i} className="p-2.5 rounded bg-card/60 border border-border/30 flex items-start gap-2">
                <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${c.severity === "high" ? "text-rose-300" : c.severity === "medium" ? "text-amber-300" : "text-emerald-300"}`} />
                <div>
                  <p className="text-sm font-medium text-foreground/90">
                    <Badge variant="outline" className={`text-[10px] mr-2 ${c.severity === "high" ? "border-rose-700/60 text-rose-300" : c.severity === "medium" ? "border-amber-700/60 text-amber-300" : "border-emerald-700/60 text-emerald-300"}`}>
                      {c.severity}
                    </Badge>
                    {c.label}
                  </p>
                  <p className="text-xs text-muted-foreground/80 mt-0.5">{c.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {outputs.explanation && (
        <Card className="border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-cyan-300/80" />
              Engine Explanation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-explanation">{outputs.explanation}</p>
          </CardContent>
        </Card>
      )}

      <GovernancePanel metadata={governanceMetadata} />
    </div>
  );
}

function DashboardView({ scenario }: { scenario: ScenarioResult }) {
  const { outputs, visualData, inputs } = scenario;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold" data-testid="text-dashboard-title">
          {scenario.profile.name} — Analysis Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">
          {inputs.rank} | {inputs.mosLabel} → {inputs.goalLabel}
        </p>
        <p className="text-xs font-mono text-sky-300/70 mt-1">{scenario.scenarioId}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {visualData.readinessScores.map((r, i) => (
          <Card key={i} className="border-slate-800">
            <CardContent className="pt-3 pb-2 text-center">
              <StatusColor status={r.status} />
              <p className="text-xs text-muted-foreground mt-1">{r.dimension}</p>
              <p className={`text-sm font-bold mt-0.5 ${r.status === "green" ? "text-emerald-300" : r.status === "yellow" ? "text-amber-300" : "text-rose-300"}`}>
                {r.label}
              </p>
            </CardContent>
          </Card>
        ))}
        <Card className="border-slate-800">
          <CardContent className="pt-3 pb-2 text-center">
            <Target className="w-4 h-4 mx-auto text-sky-300" />
            <p className="text-xs text-muted-foreground mt-1">Data Complete</p>
            <p className="text-sm font-bold text-sky-300">{visualData.dataCompleteness}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Policy Friction Points</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2" data-testid="policy-friction">
            {outputs.policyFriction.map((p, i) => (
              <div key={i} className="p-2.5 rounded bg-card/60 border border-border/30">
                <p className="text-xs text-muted-foreground/80">{p.framework}</p>
                <p className="text-sm mt-0.5 text-foreground/90">{p.point}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Resources Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2" data-testid="resources-required">
            {outputs.resourcesRequired.map((r, i) => (
              <div key={i} className="p-2.5 rounded bg-card/60 border border-border/30 flex items-center justify-between">
                <p className="text-sm text-foreground/90">{r.resource}</p>
                <Badge variant="outline" className={`text-[10px] ${r.status.includes("Self") ? "border-amber-700/60 text-amber-300" : "border-emerald-700/60 text-emerald-300"}`}>
                  {r.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {outputs.specialConsiderations.length > 0 && (
        <Card className="border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Special Considerations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2" data-testid="special-considerations">
              {outputs.specialConsiderations.map((s, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-300 mt-0.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="border-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">CMGF Architecture Layers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2" data-testid="cmgf-layers">
          {(scenario.outputs as any).cmgfLayers?.map((layer: any, i: number) => (
            <div key={i} className="p-2.5 rounded bg-card/60 border border-border/30">
              <p className="text-xs text-sky-300 font-semibold">{layer.layer}</p>
              <p className="text-sm text-muted-foreground/80 mt-0.5">{layer.action}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function BatchView({
  batch,
  onGenerateISR,
  isGenerating,
}: {
  batch: BatchResult;
  onGenerateISR: () => void;
  isGenerating: boolean;
}) {
  const { summary } = batch;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold" data-testid="text-batch-title">Batch Simulation Results</h2>
          <p className="text-sm text-muted-foreground">
            {batch.completedCases} of {batch.totalCases} cases completed
          </p>
          <p className="text-xs font-mono text-purple-300/80 mt-1">{batch.batchId}</p>
        </div>
        <Button
          onClick={onGenerateISR}
          disabled={isGenerating}
          className="bg-gradient-to-r from-purple-600 to-indigo-600"
          data-testid="button-generate-isr"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
          Generate ISR Report
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-slate-800">
          <CardContent className="pt-3 pb-2 text-center">
            <p className="text-xs text-muted-foreground">High Feasibility</p>
            <p className="text-2xl font-bold text-emerald-300">{summary.feasibilityDistribution.high}</p>
            <p className="text-xs text-muted-foreground">{Math.round(summary.feasibilityDistribution.high / batch.totalCases * 100)}%</p>
          </CardContent>
        </Card>
        <Card className="border-slate-800">
          <CardContent className="pt-3 pb-2 text-center">
            <p className="text-xs text-muted-foreground">Moderate</p>
            <p className="text-2xl font-bold text-amber-300">{summary.feasibilityDistribution.moderate}</p>
            <p className="text-xs text-muted-foreground">{Math.round(summary.feasibilityDistribution.moderate / batch.totalCases * 100)}%</p>
          </CardContent>
        </Card>
        <Card className="border-slate-800">
          <CardContent className="pt-3 pb-2 text-center">
            <p className="text-xs text-muted-foreground">Low Feasibility</p>
            <p className="text-2xl font-bold text-rose-300">{summary.feasibilityDistribution.low}</p>
            <p className="text-xs text-muted-foreground">{Math.round(summary.feasibilityDistribution.low / batch.totalCases * 100)}%</p>
          </CardContent>
        </Card>
        <Card className="border-slate-800">
          <CardContent className="pt-3 pb-2 text-center">
            <p className="text-xs text-muted-foreground">High-Risk Constraints</p>
            <p className="text-2xl font-bold text-rose-300">{summary.totalHighRiskConstraints}</p>
            <p className="text-xs text-muted-foreground">across all cases</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Top Constraint Triggers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2" data-testid="constraint-frequency">
            {summary.constraintFrequency.slice(0, 5).map((c, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded bg-card/60 border border-border/30">
                <span className="text-sm text-foreground/90">{c.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-muted/40 rounded-full h-1.5">
                    <div className="bg-rose-400/70 h-1.5 rounded-full" style={{ width: `${c.percentage}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-10 text-right">{c.percentage}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Readiness by Dimension</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2" data-testid="readiness-dimensions">
            {summary.readinessByDimension.map((d, i) => (
              <div key={i} className="p-2.5 rounded bg-card/60 border border-border/30">
                <p className="text-sm font-medium mb-1 text-foreground/90">{d.dimension}</p>
                <div className="flex gap-1.5">
                  <div className="flex items-center gap-1 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
                    <span className="text-emerald-300">{d.green}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="w-2 h-2 rounded-full bg-amber-400/80" />
                    <span className="text-amber-300">{d.yellow}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="w-2 h-2 rounded-full bg-rose-400/80" />
                    <span className="text-rose-300">{d.red}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">MOS Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2" data-testid="mos-distribution">
            {summary.mosDistribution.map((m, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-900/50">
                <span className="text-sm">{m.mos}</span>
                <Badge variant="outline" className="text-xs">{m.count} ({m.percentage}%)</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Career Goal Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2" data-testid="goal-distribution">
            {summary.goalDistribution.map((g, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-900/50">
                <span className="text-sm">{g.goal}</span>
                <Badge variant="outline" className="text-xs">{g.count} ({g.percentage}%)</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Individual Case Results</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" data-testid="individual-cases">
          {batch.results.map((r, i) => (
            <Card key={i} className="border-slate-800">
              <CardContent className="pt-3 pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{r.profile.name}</p>
                    <p className="text-xs text-muted-foreground">{r.inputs.rank} | {r.inputs.mosLabel} → {r.inputs.goalLabel}</p>
                  </div>
                  <Badge className={`text-xs ${r.visualData.overallFeasibility === "High" ? "bg-green-900/50 text-green-400" : r.visualData.overallFeasibility === "Moderate" ? "bg-yellow-900/50 text-yellow-400" : "bg-red-900/50 text-red-400"}`}>
                    {r.visualData.overallFeasibility}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportView({ html, scenario, isBatchReport }: { html: string; scenario: ScenarioResult | null; isBatchReport: boolean }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold" data-testid="text-report-title">
            {scenario ? `${scenario.profile.name} — SM Report` : isBatchReport ? "ISR Batch Report" : "Generated Report"}
          </h2>
          {scenario && (
            <>
              <p className="text-sm text-muted-foreground">
                {scenario.inputs.rank} | {scenario.inputs.mosLabel} → {scenario.inputs.goalLabel}
              </p>
              <p className="text-xs font-mono text-sky-300/70 mt-1">{scenario.scenarioId}</p>
            </>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
            setTimeout(() => URL.revokeObjectURL(url), 10000);
          }}
          data-testid="button-open-report"
        >
          <Eye className="w-3.5 h-3.5 mr-1.5" />
          Open Full View
        </Button>
      </div>
      <Card className="border-slate-800 overflow-hidden">
        <CardContent className="p-0">
          <iframe
            srcDoc={html}
            className="w-full border-0"
            style={{ minHeight: "600px" }}
            title="Generated Report"
            data-testid="iframe-report"
          />
        </CardContent>
      </Card>
    </div>
  );
}
