import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Clock,
  User,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ArrowUpCircle,
  MessageSquare,
  Cpu,
  Inbox,
  ChevronLeft,
  Search,
} from "lucide-react";
import { CMGFNav } from "@/components/cmgf-nav";

interface IsrCaseRow {
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

const EVENT_TYPE_CONFIG: Record<string, { icon: typeof FileText; label: string; color: string }> = {
  request_submitted: { icon: Inbox, label: "Request Submitted", color: "text-blue-400" },
  case_created: { icon: FileText, label: "Case Created", color: "text-sky-400" },
  engine_analysis: { icon: Cpu, label: "Engine Analysis", color: "text-violet-400" },
  advisor_approve: { icon: CheckCircle2, label: "Approved", color: "text-emerald-400" },
  advisor_modify: { icon: MessageSquare, label: "Modified", color: "text-amber-400" },
  advisor_escalate: { icon: ArrowUpCircle, label: "Escalated", color: "text-rose-400" },
  advisor_note: { icon: MessageSquare, label: "Note Added", color: "text-muted-foreground" },
};

function getEventConfig(eventType: string) {
  return EVENT_TYPE_CONFIG[eventType] || { icon: FileText, label: eventType, color: "text-muted-foreground" };
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    queued: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    in_progress: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    resolved: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    escalated: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    pending: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  };
  return (
    <Badge variant="outline" className={`text-[10px] ${variants[status] || variants.pending}`} data-testid={`badge-status-${status}`}>
      {status.replace(/_/g, " ").toUpperCase()}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const variants: Record<string, string> = {
    high: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    normal: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    low: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  };
  return (
    <Badge variant="outline" className={`text-[10px] ${variants[priority] || variants.normal}`} data-testid={`badge-priority-${priority}`}>
      {priority.toUpperCase()}
    </Badge>
  );
}

function PayloadViewer({ payload }: { payload: string | null }) {
  if (!payload) return null;
  try {
    const parsed = JSON.parse(payload);
    return (
      <div className="mt-2 p-2 bg-muted/30 rounded-md border border-border/30" data-testid="payload-viewer">
        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1">Payload</p>
        <pre className="text-[11px] font-mono text-muted-foreground/80 whitespace-pre-wrap break-all">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      </div>
    );
  } catch {
    return null;
  }
}

function TimelineEntry({ entry, isLast }: { entry: AuditEntry; isLast: boolean }) {
  const config = getEventConfig(entry.eventType);
  const Icon = config.icon;
  const ts = new Date(entry.createdAt);
  const timeStr = ts.toLocaleString();

  return (
    <div className="flex gap-3" data-testid={`audit-entry-${entry.id}`}>
      <div className="flex flex-col items-center">
        <div className={`p-1.5 rounded-full border border-border/40 bg-card ${config.color}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        {!isLast && <div className="w-px flex-1 bg-border/30 my-1" />}
      </div>
      <div className="flex-1 pb-5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-medium ${config.color}`} data-testid="text-event-label">
            {config.label}
          </span>
          <Badge variant="outline" className="text-[9px] border-border/30 text-muted-foreground/60 font-mono">
            {entry.eventType}
          </Badge>
        </div>
        <p className="text-sm text-foreground/90 mt-1" data-testid="text-event-detail">
          {entry.detail}
        </p>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground/60">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {entry.actor}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeStr}
          </span>
        </div>
        <PayloadViewer payload={entry.payload} />
      </div>
    </div>
  );
}

function CaseSelector({
  cases,
  selectedCaseId,
  onSelect,
}: {
  cases: IsrCaseRow[];
  selectedCaseId: string | null;
  onSelect: (caseId: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm text-muted-foreground mb-1.5 block">Select a Case</label>
        <Select value={selectedCaseId || ""} onValueChange={onSelect}>
          <SelectTrigger className="w-full" data-testid="select-case">
            <SelectValue placeholder="Choose a case to view audit trail" />
          </SelectTrigger>
          <SelectContent className="max-h-[400px]">
            {cases.map((c) => (
              <SelectItem key={c.caseId} value={c.caseId}>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs">{c.caseId}</span>
                  <span className="text-muted-foreground/60">-</span>
                  <span className="text-xs">{c.smName} ({c.smRank})</span>
                  <span className="text-muted-foreground/60">-</span>
                  <span className="text-[10px] text-muted-foreground/60">{c.status}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {cases.map((c) => (
          <button
            key={c.caseId}
            onClick={() => onSelect(c.caseId)}
            className={`text-left p-3 rounded-md border transition-colors ${
              selectedCaseId === c.caseId
                ? "border-primary/50 bg-primary/5"
                : "border-border/30 hover-elevate"
            }`}
            data-testid={`button-case-${c.caseId}`}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-mono text-xs text-foreground/80 truncate">{c.caseId}</span>
              <StatusBadge status={c.status} />
            </div>
            <p className="text-sm font-medium truncate" data-testid={`text-case-name-${c.caseId}`}>{c.smName}</p>
            <p className="text-xs text-muted-foreground/70 truncate">{c.smMos} → {c.smGoal}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <PriorityBadge priority={c.priority} />
              <span className="text-[10px] text-muted-foreground/50">{c.smRank}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function AuditTrailView({ caseId, caseInfo, onBack }: { caseId: string; caseInfo: IsrCaseRow | undefined; onBack: () => void }) {
  const { data: entries, isLoading } = useQuery<AuditEntry[]>({
    queryKey: ["/api/audit", caseId],
    enabled: !!caseId,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-semibold" data-testid="text-case-id">{caseId}</h2>
            {caseInfo && <StatusBadge status={caseInfo.status} />}
            {caseInfo && <PriorityBadge priority={caseInfo.priority} />}
          </div>
          {caseInfo && (
            <p className="text-sm text-muted-foreground/70 mt-0.5">
              {caseInfo.smName} ({caseInfo.smRank}) — {caseInfo.smMos} → {caseInfo.smGoal}
            </p>
          )}
        </div>
      </div>

      {caseInfo && (
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground/60" />
              Request Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <p className="text-muted-foreground/60">Service Member</p>
                <p className="font-medium" data-testid="text-sm-name">{caseInfo.smName}</p>
              </div>
              <div>
                <p className="text-muted-foreground/60">Rank</p>
                <p className="font-medium" data-testid="text-sm-rank">{caseInfo.smRank}</p>
              </div>
              <div>
                <p className="text-muted-foreground/60">Current MOS</p>
                <p className="font-medium" data-testid="text-sm-mos">{caseInfo.smMos}</p>
              </div>
              <div>
                <p className="text-muted-foreground/60">Career Goal</p>
                <p className="font-medium" data-testid="text-sm-goal">{caseInfo.smGoal}</p>
              </div>
            </div>
            {caseInfo.smConstraints && caseInfo.smConstraints.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-muted-foreground/60 mb-1">Constraints</p>
                <div className="flex flex-wrap gap-1">
                  {caseInfo.smConstraints.map((c, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] border-border/30" data-testid={`badge-constraint-${i}`}>
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {caseInfo.smNotes && (
              <div className="mt-3">
                <p className="text-xs text-muted-foreground/60 mb-1">Notes</p>
                <p className="text-xs text-foreground/80" data-testid="text-notes">{caseInfo.smNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground/60" />
            Chronological Audit Trail
            <Badge variant="outline" className="text-[9px] ml-auto border-border/30 text-muted-foreground/50">
              APPEND-ONLY
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4" data-testid="audit-loading">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : entries && entries.length > 0 ? (
            <div data-testid="audit-timeline">
              {entries.map((entry, idx) => (
                <TimelineEntry key={entry.id} entry={entry} isLast={idx === entries.length - 1} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground/60" data-testid="audit-empty">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No audit entries found for this case</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 text-xs p-3 bg-amber-500/5 rounded-md border border-amber-500/20">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
        <span className="text-amber-300/80">
          Demonstration Data — This audit trail is generated from synthetic scenarios for framework demonstration purposes.
        </span>
      </div>
    </div>
  );
}

export default function AuditTrail() {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const { data: cases, isLoading: casesLoading } = useQuery<IsrCaseRow[]>({
    queryKey: ["/api/isr/queue"],
  });

  const selectedCaseInfo = cases?.find((c) => c.caseId === selectedCaseId);

  return (
    <>
    <CMGFNav />
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Search className="w-5 h-5 text-muted-foreground/60" />
            <Badge variant="outline" className="border-border/40 text-muted-foreground/60 text-xs">
              Governance Transparency
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" data-testid="text-audit-title">
            Audit Trail Explorer
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-lg">
            Select a case to view its complete, chronological audit trail — from initial request through final resolution.
          </p>
        </div>

        {casesLoading ? (
          <div className="space-y-3" data-testid="cases-loading">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          </div>
        ) : cases && cases.length > 0 ? (
          selectedCaseId ? (
            <AuditTrailView
              caseId={selectedCaseId}
              caseInfo={selectedCaseInfo}
              onBack={() => setSelectedCaseId(null)}
            />
          ) : (
            <CaseSelector
              cases={cases}
              selectedCaseId={selectedCaseId}
              onSelect={setSelectedCaseId}
            />
          )
        ) : (
          <Card className="border-border/40">
            <CardContent className="py-12 text-center">
              <Inbox className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-muted-foreground/60" data-testid="text-no-cases">
                No cases found. Submit a request from the SM Hub to generate audit trail data.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 flex items-center gap-2 text-xs p-3 bg-amber-500/5 rounded-md border border-amber-500/20">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
          <span className="text-amber-300/80">
            Demonstration Data — All records shown are synthetic, generated for framework demonstration purposes.
          </span>
        </div>
      </div>
    </div>
    </>
  );
}
