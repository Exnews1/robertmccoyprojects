import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  ClipboardList,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  StickyNote,
  Loader2,
  Shield,
  Clock,
  Zap,
  Users,
  FileText,
  Activity,
} from "lucide-react";
import { CMGFNav } from "@/components/cmgf-nav";

interface IsrQueueItem {
  id: number;
  caseId: string;
  requestId: number;
  assignedTo: string | null;
  priority: string;
  status: string;
  engineOutput: string | null;
  createdAt: string;
  updatedAt: string;
  smName: string;
  smRank: string;
  smMos: string;
  smGoal: string;
  smConstraints: string[] | null;
  smNotes: string | null;
  requestStatus: string;
}

interface AuditEntry {
  id: number;
  caseId: string;
  eventType: string;
  actor: string;
  detail: string;
  payload: string | null;
  createdAt: string;
}

interface EngineResult {
  result: {
    scenarioId: string;
    outputs: {
      pathwayOptions: Array<{ name: string; match: string; timeframe: string }>;
      constraintRisks: Array<{ label: string; severity: string; detail: string }>;
      readinessMeasures: Array<{ dimension: string; status: string; label: string; detail: string }>;
      timelineRange: string;
      explanation?: string;
    };
    visualData: {
      overallFeasibility: string;
      pathwayCount: number;
      constraintCount: number;
      dataCompleteness: number;
    };
    governanceMetadata: {
      engineVersion: string;
      executionType: string;
      dataSources: string[];
      humanReviewRequired: boolean;
    };
  };
  message: string;
}

function StatusBadgeDisplay({ status }: { status: string }) {
  const config: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
    queued: { variant: "secondary", label: "Queued" },
    in_progress: { variant: "outline", label: "In Progress" },
    resolved: { variant: "default", label: "Resolved" },
    escalated: { variant: "destructive", label: "Escalated" },
  };
  const c = config[status] || { variant: "secondary" as const, label: status };
  return <Badge variant={c.variant} data-testid={`badge-status-${status}`}>{c.label}</Badge>;
}

function PriorityBadge({ priority }: { priority: string }) {
  const config: Record<string, string> = {
    high: "text-rose-300 border-rose-800/40",
    normal: "text-sky-300 border-sky-800/40",
    low: "text-muted-foreground border-border/40",
  };
  return (
    <Badge variant="outline" className={`text-[10px] ${config[priority] || config.normal}`} data-testid={`badge-priority-${priority}`}>
      {priority}
    </Badge>
  );
}

function QueueList({
  cases,
  onSelect,
}: {
  cases: IsrQueueItem[];
  onSelect: (c: IsrQueueItem) => void;
}) {
  const pending = cases.filter(c => c.status === "queued" || c.status === "in_progress");
  const completed = cases.filter(c => c.status === "resolved" || c.status === "escalated");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2" data-testid="text-isr-title">
            <ClipboardList className="w-6 h-6 text-sky-400" />
            ISR Queue — Advisor Actions
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review pending cases, run engine analysis, and take advisor actions.
          </p>
        </div>
        <Badge variant="outline" className="border-amber-800/40 text-amber-300 text-xs" data-testid="badge-demo-label">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Demonstration Data
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card data-testid="stat-total">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{cases.length}</p>
            <p className="text-xs text-muted-foreground">Total Cases</p>
          </CardContent>
        </Card>
        <Card data-testid="stat-pending">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{pending.length}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card data-testid="stat-resolved">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{completed.filter(c => c.status === "resolved").length}</p>
            <p className="text-xs text-muted-foreground">Resolved</p>
          </CardContent>
        </Card>
        <Card data-testid="stat-escalated">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-rose-400">{completed.filter(c => c.status === "escalated").length}</p>
            <p className="text-xs text-muted-foreground">Escalated</p>
          </CardContent>
        </Card>
      </div>

      {pending.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider" data-testid="text-pending-header">
            Pending Cases
          </h2>
          <div className="space-y-2">
            {pending.map(c => (
              <Card
                key={c.caseId}
                className="hover-elevate cursor-pointer"
                data-testid={`card-case-${c.caseId}`}
              >
                <CardContent className="p-4" onClick={() => onSelect(c)}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-muted-foreground">{c.caseId}</span>
                        <StatusBadgeDisplay status={c.status} />
                        <PriorityBadge priority={c.priority} />
                      </div>
                      <p className="text-sm font-medium">{c.smRank} {c.smName}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.smMos} → {c.smGoal}
                      </p>
                      {c.smConstraints && c.smConstraints.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {c.smConstraints.map((con, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] border-border/40">{con}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground/60 shrink-0">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider" data-testid="text-completed-header">
            Completed Cases
          </h2>
          <div className="space-y-2">
            {completed.map(c => (
              <Card
                key={c.caseId}
                className="hover-elevate cursor-pointer opacity-80"
                data-testid={`card-case-${c.caseId}`}
              >
                <CardContent className="p-4" onClick={() => onSelect(c)}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-muted-foreground">{c.caseId}</span>
                        <StatusBadgeDisplay status={c.status} />
                        <PriorityBadge priority={c.priority} />
                      </div>
                      <p className="text-sm font-medium">{c.smRank} {c.smName}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.smMos} → {c.smGoal}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground/60 shrink-0">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {new Date(c.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {cases.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <ClipboardList className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground" data-testid="text-empty-queue">
              No cases in the queue. Submit a request from the SM Hub to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CaseDetail({
  caseItem,
  onBack,
}: {
  caseItem: IsrQueueItem;
  onBack: () => void;
}) {
  const { toast } = useToast();
  const [rationale, setRationale] = useState("");
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const parsedEngine = caseItem.engineOutput ? JSON.parse(caseItem.engineOutput) : null;

  const { data: auditEntries, isLoading: auditLoading } = useQuery<AuditEntry[]>({
    queryKey: ["/api/audit", caseItem.caseId],
  });

  const runEngineMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/isr/run-engine", { caseId: caseItem.caseId });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Engine analysis complete", description: "Results are now available for review." });
      queryClient.invalidateQueries({ queryKey: ["/api/isr/queue"] });
    },
    onError: (err: Error) => {
      toast({ title: "Engine error", description: err.message, variant: "destructive" });
    },
  });

  const actionMutation = useMutation({
    mutationFn: async ({ actionType, rationaleText }: { actionType: string; rationaleText: string }) => {
      const res = await apiRequest("POST", "/api/isr/action", {
        caseId: caseItem.caseId,
        actionType,
        rationale: rationaleText,
        performedBy: "ESO Advisor",
      });
      return res.json();
    },
    onSuccess: (data: any) => {
      toast({ title: "Action recorded", description: data.message });
      setRationale("");
      setSelectedAction(null);
      queryClient.invalidateQueries({ queryKey: ["/api/isr/queue"] });
      queryClient.invalidateQueries({ queryKey: ["/api/audit", caseItem.caseId] });
    },
    onError: (err: Error) => {
      toast({ title: "Action failed", description: err.message, variant: "destructive" });
    },
  });

  const handleAction = (actionType: string) => {
    if (!rationale.trim()) {
      toast({ title: "Rationale required", description: "Please provide a rationale for your action.", variant: "destructive" });
      return;
    }
    actionMutation.mutate({ actionType, rationaleText: rationale });
  };

  const isActionable = caseItem.status === "queued" || caseItem.status === "in_progress";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold flex items-center gap-2 flex-wrap" data-testid="text-case-title">
            Case: {caseItem.caseId}
            <StatusBadgeDisplay status={caseItem.status} />
            <PriorityBadge priority={caseItem.priority} />
          </h2>
        </div>
        <Badge variant="outline" className="border-amber-800/40 text-amber-300 text-xs shrink-0" data-testid="badge-demo-detail">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Demonstration Data
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" />
              Service Member Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3" data-testid="section-sm-details">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground text-xs">Name</span>
                <p className="font-medium" data-testid="text-sm-name">{caseItem.smRank} {caseItem.smName}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Current MOS</span>
                <p className="font-medium" data-testid="text-sm-mos">{caseItem.smMos}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Career Goal</span>
                <p className="font-medium" data-testid="text-sm-goal">{caseItem.smGoal}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Request Status</span>
                <p className="font-medium" data-testid="text-request-status">{caseItem.requestStatus}</p>
              </div>
            </div>
            {caseItem.smConstraints && caseItem.smConstraints.length > 0 && (
              <div>
                <span className="text-muted-foreground text-xs">Constraints</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {caseItem.smConstraints.map((con, i) => (
                    <Badge key={i} variant="outline" className="text-[10px]" data-testid={`badge-constraint-${i}`}>{con}</Badge>
                  ))}
                </div>
              </div>
            )}
            {caseItem.smNotes && (
              <div>
                <span className="text-muted-foreground text-xs">Notes</span>
                <p className="text-sm mt-0.5" data-testid="text-sm-notes">{caseItem.smNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-400" />
              Case Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm" data-testid="section-case-info">
            <div>
              <span className="text-muted-foreground text-xs">Assigned To</span>
              <p>{caseItem.assignedTo || "Unassigned"}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Created</span>
              <p>{new Date(caseItem.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Updated</span>
              <p>{new Date(caseItem.updatedAt).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {!parsedEngine && isActionable && (
        <Card className="border-sky-900/30">
          <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <p className="text-sm font-medium flex items-center gap-2">
                <Zap className="w-4 h-4 text-sky-400" />
                Run Engine Analysis
              </p>
              <p className="text-xs text-muted-foreground">
                Execute the CMGF Rules Engine to generate deterministic analysis for this case.
              </p>
            </div>
            <Button
              onClick={() => runEngineMutation.mutate()}
              disabled={runEngineMutation.isPending}
              data-testid="button-run-engine"
            >
              {runEngineMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4 mr-2" />
                  Run Analysis
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {parsedEngine && (
        <EngineResultsPanel result={parsedEngine} />
      )}

      {isActionable && (
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              Advisor Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4" data-testid="section-actions">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Rationale (required for all actions)
              </label>
              <Textarea
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                placeholder="Provide rationale for your decision..."
                className="resize-none text-sm"
                rows={3}
                data-testid="input-rationale"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={() => handleAction("approve")}
                disabled={actionMutation.isPending || !rationale.trim()}
                data-testid="button-approve"
              >
                {actionMutation.isPending && selectedAction === "approve" ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                )}
                Approve
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleAction("modify")}
                disabled={actionMutation.isPending || !rationale.trim()}
                data-testid="button-modify"
              >
                {actionMutation.isPending && selectedAction === "modify" ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <StickyNote className="w-4 h-4 mr-2" />
                )}
                Modify
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleAction("escalate")}
                disabled={actionMutation.isPending || !rationale.trim()}
                data-testid="button-escalate"
              >
                {actionMutation.isPending && selectedAction === "escalate" ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                )}
                Escalate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            Audit Trail
          </CardTitle>
        </CardHeader>
        <CardContent data-testid="section-audit-trail">
          {auditLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : auditEntries && auditEntries.length > 0 ? (
            <div className="space-y-2">
              {auditEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 p-3 rounded-md bg-muted/30 text-sm"
                  data-testid={`audit-entry-${entry.id}`}
                >
                  <div className="shrink-0 mt-0.5">
                    {entry.eventType.includes("approve") && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    {entry.eventType.includes("escalate") && <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />}
                    {entry.eventType.includes("modify") && <StickyNote className="w-3.5 h-3.5 text-amber-400" />}
                    {entry.eventType.includes("engine") && <Activity className="w-3.5 h-3.5 text-sky-400" />}
                    {entry.eventType.includes("request") && <FileText className="w-3.5 h-3.5 text-muted-foreground" />}
                    {entry.eventType.includes("case") && <ClipboardList className="w-3.5 h-3.5 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-xs">{entry.actor}</span>
                      <Badge variant="outline" className="text-[9px] border-border/40">{entry.eventType}</Badge>
                      <span className="text-[10px] text-muted-foreground/60 ml-auto shrink-0">
                        {new Date(entry.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{entry.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground" data-testid="text-no-audit">No audit entries yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EngineResultsPanel({ result }: { result: any }) {
  const outputs = result.outputs || {};
  const visualData = result.visualData || {};
  const metadata = result.governanceMetadata || {};

  return (
    <div className="space-y-4">
      <Card className="border-sky-900/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            Engine Analysis Results
            <Badge variant="outline" className="text-[10px] border-sky-800/40 text-sky-300 ml-auto">
              {metadata.executionType || "deterministic"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-testid="section-engine-results">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center">
              <p className="text-lg font-bold">{visualData.overallFeasibility || "N/A"}</p>
              <p className="text-[10px] text-muted-foreground">Feasibility</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{visualData.pathwayCount || 0}</p>
              <p className="text-[10px] text-muted-foreground">Pathways</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{visualData.constraintCount || 0}</p>
              <p className="text-[10px] text-muted-foreground">Constraints</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{visualData.dataCompleteness || 0}%</p>
              <p className="text-[10px] text-muted-foreground">Data Completeness</p>
            </div>
          </div>

          {outputs.pathwayOptions && outputs.pathwayOptions.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Pathway Options</h4>
              <div className="space-y-1.5">
                {outputs.pathwayOptions.map((p: any, i: number) => (
                  <div key={i} className="flex items-center justify-between gap-2 text-sm p-2 bg-muted/20 rounded-md" data-testid={`pathway-${i}`}>
                    <span>{p.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className="text-[10px]">{p.match}</Badge>
                      <span className="text-[10px] text-muted-foreground">{p.timeframe}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {outputs.constraintRisks && outputs.constraintRisks.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Constraint Risks</h4>
              <div className="space-y-1.5">
                {outputs.constraintRisks.map((r: any, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm p-2 bg-muted/20 rounded-md" data-testid={`constraint-${i}`}>
                    <span className={`inline-block w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      r.severity === "high" ? "bg-rose-400" : r.severity === "medium" ? "bg-amber-400" : "bg-emerald-400"
                    }`} />
                    <div className="min-w-0">
                      <span className="font-medium">{r.label}</span>
                      <p className="text-xs text-muted-foreground">{r.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {outputs.readinessMeasures && outputs.readinessMeasures.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Readiness Measures</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {outputs.readinessMeasures.map((m: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm p-2 bg-muted/20 rounded-md" data-testid={`readiness-${i}`}>
                    <span className={`inline-block w-2.5 h-2.5 rounded-full shrink-0 ${
                      m.status === "green" ? "bg-emerald-400" : m.status === "yellow" ? "bg-amber-400" : "bg-rose-400"
                    }`} />
                    <div className="min-w-0">
                      <span className="text-xs font-medium">{m.dimension}</span>
                      <span className="text-[10px] text-muted-foreground ml-1">— {m.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {outputs.timelineRange && (
            <div className="text-sm">
              <span className="text-muted-foreground text-xs">Timeline Range: </span>
              <span className="font-medium">{outputs.timelineRange}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs p-2 bg-amber-950/20 rounded-md border border-amber-800/20">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-300/80 shrink-0" />
            <span className="text-amber-200/80">All outputs require human advisor review before action</span>
          </div>

          {metadata.dataSources && (
            <div className="text-xs">
              <span className="text-muted-foreground">Sources: </span>
              <span className="text-muted-foreground/70 font-mono">{metadata.dataSources.join(", ")}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function IsrQueue() {
  const [selectedCase, setSelectedCase] = useState<IsrQueueItem | null>(null);

  const { data: cases, isLoading } = useQuery<IsrQueueItem[]>({
    queryKey: ["/api/isr/queue"],
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-4 gap-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  const queueData = cases || [];

  const refreshedCase = selectedCase
    ? queueData.find(c => c.caseId === selectedCase.caseId) || selectedCase
    : null;

  return (
    <>
      <CMGFNav />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {refreshedCase ? (
          <CaseDetail
            caseItem={refreshedCase}
            onBack={() => setSelectedCase(null)}
          />
        ) : (
          <QueueList
            cases={queueData}
            onSelect={(c) => setSelectedCase(c)}
          />
        )}
      </div>
    </>
  );
}
