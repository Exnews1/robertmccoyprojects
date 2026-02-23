import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Send,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  FileEdit,
  Shield,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { CMGFNav } from "@/components/cmgf-nav";
import type { ServiceMemberRequest } from "@shared/schema";

const MOS_OPTIONS = [
  { value: "comms", label: "Signal/Comms (25B/25U)" },
  { value: "intel", label: "Intelligence (35F/35M)" },
  { value: "logistics", label: "Logistics (88M/92A)" },
  { value: "medical", label: "Medical (68W/68C)" },
  { value: "combat_arms", label: "Combat Arms (11B/19D)" },
];

const GOAL_OPTIONS = [
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "data_analytics", label: "Data Analytics" },
  { value: "supply_chain", label: "Supply Chain Management" },
  { value: "project_management", label: "Project Management" },
  { value: "healthcare_admin", label: "Healthcare Administration" },
];

const RANK_OPTIONS = [
  "E-3", "E-4", "E-5", "E-6", "E-7", "E-8", "E-9",
];

const CONSTRAINT_OPTIONS = [
  { id: "family_relocation", label: "Family relocation constraints" },
  { id: "deployment_risk", label: "Upcoming deployment risk" },
  { id: "funding_limited", label: "Limited funding availability" },
  { id: "time_short", label: "Short timeline to ETS" },
  { id: "no_degree", label: "No prior degree" },
  { id: "geographic", label: "Geographic limitations" },
];

function getStatusConfig(status: string) {
  switch (status) {
    case "pending":
      return { icon: Clock, color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-500/10", label: "Pending" };
    case "in_review":
      return { icon: FileEdit, color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-500/10", label: "In Review" };
    case "approved":
      return { icon: CheckCircle2, color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-500/10", label: "Approved" };
    case "modified":
      return { icon: FileEdit, color: "text-cyan-500 dark:text-cyan-400", bg: "bg-cyan-500/10", label: "Modified" };
    case "escalated":
      return { icon: ArrowUpRight, color: "text-rose-500 dark:text-rose-400", bg: "bg-rose-500/10", label: "Escalated" };
    default:
      return { icon: Clock, color: "text-muted-foreground", bg: "bg-muted/50", label: status };
  }
}

export default function SMHub() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [rank, setRank] = useState("");
  const [currentMos, setCurrentMos] = useState("");
  const [goalDomain, setGoalDomain] = useState("");
  const [selectedConstraints, setSelectedConstraints] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const { data: requests, isLoading } = useQuery<ServiceMemberRequest[]>({
    queryKey: ["/api/sm/requests"],
  });

  const submitMutation = useMutation({
    mutationFn: async (payload: {
      name: string;
      rank: string;
      currentMos: string;
      currentMosLabel: string;
      goalDomain: string;
      goalLabel: string;
      constraints: string[];
      notes: string;
    }) => {
      const res = await apiRequest("POST", "/api/sm/request", payload);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Request Submitted",
        description: `Case ${data.caseId} created and queued for advisor review.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/sm/requests"] });
      setName("");
      setRank("");
      setCurrentMos("");
      setGoalDomain("");
      setSelectedConstraints([]);
      setNotes("");
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Could not submit your request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!name || !rank || !currentMos || !goalDomain) {
      toast({
        title: "Missing Fields",
        description: "Please fill in name, rank, MOS, and goal domain.",
        variant: "destructive",
      });
      return;
    }

    const mosOption = MOS_OPTIONS.find((m) => m.value === currentMos);
    const goalOption = GOAL_OPTIONS.find((g) => g.value === goalDomain);

    submitMutation.mutate({
      name,
      rank,
      currentMos,
      currentMosLabel: mosOption?.label || currentMos,
      goalDomain,
      goalLabel: goalOption?.label || goalDomain,
      constraints: selectedConstraints,
      notes,
    });
  };

  const toggleConstraint = (id: string) => {
    setSelectedConstraints((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <>
    <CMGFNav />
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-md w-fit" data-testid="badge-demo-data">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>Demonstration Data</span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-sm-hub-title">
          Service Member Hub
        </h1>
        <p className="text-sm text-muted-foreground">
          Submit career transition requests and track their progress through the ISR pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Send className="w-4 h-4" />
                Submit New Request
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="sm-name" className="text-xs text-muted-foreground">Full Name</Label>
                <Input
                  id="sm-name"
                  placeholder="e.g. James Thompson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-testid="input-name"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Rank</Label>
                <Select value={rank} onValueChange={setRank}>
                  <SelectTrigger data-testid="select-rank">
                    <SelectValue placeholder="Select rank" />
                  </SelectTrigger>
                  <SelectContent>
                    {RANK_OPTIONS.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Current MOS</Label>
                <Select value={currentMos} onValueChange={setCurrentMos}>
                  <SelectTrigger data-testid="select-mos">
                    <SelectValue placeholder="Select MOS" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOS_OPTIONS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Goal Domain</Label>
                <Select value={goalDomain} onValueChange={setGoalDomain}>
                  <SelectTrigger data-testid="select-goal">
                    <SelectValue placeholder="Select career goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {GOAL_OPTIONS.map((g) => (
                      <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Constraints</Label>
                <div className="grid grid-cols-1 gap-2">
                  {CONSTRAINT_OPTIONS.map((c) => (
                    <div key={c.id} className="flex items-center gap-2">
                      <Checkbox
                        id={c.id}
                        checked={selectedConstraints.includes(c.id)}
                        onCheckedChange={() => toggleConstraint(c.id)}
                        data-testid={`checkbox-${c.id}`}
                      />
                      <Label htmlFor={c.id} className="text-xs cursor-pointer">{c.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sm-notes" className="text-xs text-muted-foreground">Additional Notes</Label>
                <Textarea
                  id="sm-notes"
                  placeholder="Any additional context for your advisor..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="resize-none text-sm"
                  rows={3}
                  data-testid="input-notes"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={submitMutation.isPending || !name || !rank || !currentMos || !goalDomain}
                className="w-full"
                data-testid="button-submit-request"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Request
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold" data-testid="text-requests-heading">Submitted Requests</h2>
            <Badge variant="outline" className="text-xs font-mono" data-testid="badge-request-count">
              {requests?.length || 0} total
            </Badge>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : !requests || requests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <User className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No requests submitted yet.</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Use the form to submit your first career transition request.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => {
                const statusCfg = getStatusConfig(req.status);
                const StatusIcon = statusCfg.icon;
                return (
                  <Card key={req.id} data-testid={`card-request-${req.id}`}>
                    <CardContent className="py-4 px-4 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm" data-testid={`text-request-name-${req.id}`}>
                              {req.name}
                            </span>
                            <Badge variant="outline" className="text-[10px]">
                              {req.rank}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                            <span>{req.currentMosLabel}</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className="font-medium text-foreground/80">{req.goalLabel}</span>
                          </div>
                        </div>
                        <Badge className={`shrink-0 ${statusCfg.bg} ${statusCfg.color} border-0 text-xs`} data-testid={`badge-status-${req.id}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusCfg.label}
                        </Badge>
                      </div>

                      {req.constraints && req.constraints.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          <Shield className="w-3 h-3 text-muted-foreground/50" />
                          {req.constraints.map((c) => (
                            <Badge key={c} variant="outline" className="text-[10px] border-border/40">
                              {CONSTRAINT_OPTIONS.find((co) => co.id === c)?.label || c}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {req.notes && (
                        <p className="text-xs text-muted-foreground/70 italic" data-testid={`text-notes-${req.id}`}>
                          {req.notes}
                        </p>
                      )}

                      <div className="text-[10px] text-muted-foreground/50 font-mono">
                        {req.createdAt ? new Date(req.createdAt).toLocaleString() : ""}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
