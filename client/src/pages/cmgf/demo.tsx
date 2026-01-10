import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { CMGFNav } from "@/components/cmgf-nav";
import { useCMGFDemo, ServiceMember, ReviewItem, AuditLogEntry } from "@/hooks/use-cmgf-demo";
import { 
  ChevronRight, Activity, Users, Clock, Shield, Brain, 
  AlertTriangle, CheckCircle, Eye, UserCheck, FileCheck,
  TrendingUp, Gauge, Radio, CircleDot, ArrowRight,
  Lock, Unlock, History, RefreshCw
} from "lucide-react";

function StatusIndicator({ status }: { status: "operational" | "degraded" | "maintenance" }) {
  const colors = {
    operational: "bg-green-500",
    degraded: "bg-yellow-500",
    maintenance: "bg-orange-500"
  };
  return (
    <div className="flex items-center gap-2" data-testid="status-indicator">
      <span className={`w-2 h-2 rounded-full ${colors[status]} animate-pulse`} />
      <span className="text-xs font-mono uppercase">{status}</span>
    </div>
  );
}

function MetricTile({ 
  label, 
  value, 
  icon: Icon, 
  trend,
  subtitle,
  testId
}: { 
  label: string; 
  value: string | number; 
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  subtitle?: string;
  testId?: string;
}) {
  return (
    <div className="bg-card/50 border border-border/50 rounded-lg p-4" data-testid={testId}>
      <div className="flex items-start justify-between mb-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {trend && (
          <TrendingUp className={`h-3 w-3 ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500 rotate-180" : "text-muted-foreground"}`} />
        )}
      </div>
      <div className="text-2xl font-bold text-foreground font-mono">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
      {subtitle && <div className="text-xs text-primary mt-1">{subtitle}</div>}
    </div>
  );
}

function FundingGapGauge({ education, advising, ratio }: { education: number; advising: number; ratio: number }) {
  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent" data-testid="card-funding-gap">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-mono flex items-center gap-2">
          <Gauge className="h-4 w-4" />
          FUNDING GAP INDICATOR
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-3xl font-bold text-primary font-mono">${education}B</div>
              <div className="text-xs text-muted-foreground">Education Benefits</div>
            </div>
            <div className="text-muted-foreground text-lg">vs</div>
            <div className="text-right">
              <div className="text-3xl font-bold text-destructive font-mono">${advising * 1000}M</div>
              <div className="text-xs text-muted-foreground">Transition Advising</div>
            </div>
          </div>
          <div className="relative h-4 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-primary rounded-full"
              style={{ width: `${ratio}%` }}
            />
            <div 
              className="absolute inset-y-0 right-0 bg-destructive/50 rounded-full"
              style={{ width: `${100 - ratio}%` }}
            />
          </div>
          <div className="text-center text-xs text-muted-foreground">
            <span className="text-primary font-semibold">{ratio}:1</span> resource imbalance ratio
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ServiceMemberCard({ member, onSelect }: { member: ServiceMember; onSelect: () => void }) {
  const statusColors = {
    active: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "in-review": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    completed: "bg-green-500/20 text-green-400 border-green-500/30"
  };

  return (
    <Card 
      className="hover-elevate cursor-pointer border-border/50"
      onClick={onSelect}
      data-testid={`card-service-member-${member.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="font-semibold text-foreground">{member.name}</div>
            <div className="text-xs text-muted-foreground">{member.rank} | {member.branch}</div>
          </div>
          <Badge variant="outline" className={statusColors[member.status]}>
            {member.status}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground mb-2">{member.mos}</div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Separation: {member.separationDate}</span>
          <span className="text-primary font-mono">{member.credentialMatches} matches</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {member.careerPaths.slice(0, 2).map((path, i) => (
            <Badge key={i} variant="secondary" className="text-xs">{path}</Badge>
          ))}
          {member.careerPaths.length > 2 && (
            <Badge variant="secondary" className="text-xs">+{member.careerPaths.length - 2}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewQueueItem({ item, onAction }: { item: ReviewItem; onAction: () => void }) {
  const priorityColors = {
    high: "bg-red-500/20 text-red-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    low: "bg-green-500/20 text-green-400"
  };

  const typeIcons = {
    credential: FileCheck,
    pathway: ArrowRight,
    exception: AlertTriangle
  };

  const TypeIcon = typeIcons[item.type];

  return (
    <div className="p-3 border border-border/50 rounded-lg bg-card/30 hover-elevate">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center flex-shrink-0">
          <TypeIcon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className={`${priorityColors[item.priority]} text-xs`}>
              {item.priority}
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">{item.id}</span>
          </div>
          <div className="text-sm text-foreground mb-1">{item.summary}</div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{item.assignedTo}</span>
            <div className="flex items-center gap-2">
              <span>AI Conf:</span>
              <span className={`font-mono ${item.aiConfidence > 0.7 ? "text-green-400" : item.aiConfidence > 0.5 ? "text-yellow-400" : "text-red-400"}`}>
                {(item.aiConfidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={onAction} data-testid={`button-review-${item.id}`}>
          <Eye className="h-3 w-3 mr-1" />
          Review
        </Button>
      </div>
    </div>
  );
}

function AuditLogRow({ entry }: { entry: AuditLogEntry }) {
  const time = new Date(entry.timestamp).toLocaleTimeString();
  
  return (
    <div className="flex items-start gap-3 py-2 border-b border-border/30 last:border-0">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
        entry.actorType === "human" ? "bg-blue-500/20" : "bg-purple-500/20"
      }`}>
        {entry.actorType === "human" ? (
          <UserCheck className="h-3 w-3 text-blue-400" />
        ) : (
          <Brain className="h-3 w-3 text-purple-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs mb-1">
          <span className="font-mono text-muted-foreground">{time}</span>
          <Badge variant="outline" className="text-xs">{entry.action}</Badge>
        </div>
        <div className="text-sm text-foreground">{entry.details}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {entry.actor} → {entry.outcome}
        </div>
      </div>
    </div>
  );
}

function HandoffModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [checks, setChecks] = useState({
    reviewed: false,
    verified: false,
    documented: false,
    notified: false
  });

  const allChecked = Object.values(checks).every(Boolean);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Human-in-Loop Handoff Checklist
          </DialogTitle>
          <DialogDescription>
            Complete all verification steps before approving AI-generated recommendations.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3">
            <Checkbox 
              id="reviewed" 
              checked={checks.reviewed}
              onCheckedChange={(checked) => setChecks(prev => ({ ...prev, reviewed: !!checked }))}
              data-testid="checkbox-reviewed"
            />
            <label htmlFor="reviewed" className="text-sm">
              <div className="font-medium">AI recommendation reviewed</div>
              <div className="text-muted-foreground text-xs">Verified alignment with service member goals</div>
            </label>
          </div>
          
          <div className="flex items-start gap-3">
            <Checkbox 
              id="verified" 
              checked={checks.verified}
              onCheckedChange={(checked) => setChecks(prev => ({ ...prev, verified: !!checked }))}
              data-testid="checkbox-verified"
            />
            <label htmlFor="verified" className="text-sm">
              <div className="font-medium">Credential mapping verified</div>
              <div className="text-muted-foreground text-xs">Cross-referenced with official equivalency tables</div>
            </label>
          </div>
          
          <div className="flex items-start gap-3">
            <Checkbox 
              id="documented" 
              checked={checks.documented}
              onCheckedChange={(checked) => setChecks(prev => ({ ...prev, documented: !!checked }))}
              data-testid="checkbox-documented"
            />
            <label htmlFor="documented" className="text-sm">
              <div className="font-medium">Decision rationale documented</div>
              <div className="text-muted-foreground text-xs">Audit trail entry prepared with justification</div>
            </label>
          </div>
          
          <div className="flex items-start gap-3">
            <Checkbox 
              id="notified" 
              checked={checks.notified}
              onCheckedChange={(checked) => setChecks(prev => ({ ...prev, notified: !!checked }))}
              data-testid="checkbox-notified"
            />
            <label htmlFor="notified" className="text-sm">
              <div className="font-medium">Service member notification prepared</div>
              <div className="text-muted-foreground text-xs">Communication drafted with next steps</div>
            </label>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="h-3 w-3" />
            <span className="font-semibold">Governance Constraint</span>
          </div>
          <p>No automated approvals permitted. Human judgment required for all transition recommendations per CMGF Policy 3.2.1</p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={!allChecked} onClick={onClose} data-testid="button-approve-handoff">
            {allChecked ? <Unlock className="h-4 w-4 mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
            Approve & Log
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function CMGFDemo() {
  const { metrics, serviceMembers, reviewQueue, auditLog, fundingGap } = useCMGFDemo();
  const [handoffOpen, setHandoffOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("stream");

  return (
    <div className="min-h-screen bg-background">
      <CMGFNav />
      
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="mb-4 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-breadcrumb-portfolio">
            Portfolio
          </Link>
          <ChevronRight className="inline h-4 w-4 mx-2 text-muted-foreground" />
          <Link href="/cmgf" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-breadcrumb-cmgf">
            CMGF
          </Link>
          <ChevronRight className="inline h-4 w-4 mx-2 text-muted-foreground" />
          <span className="text-foreground">Demo Interface</span>
        </nav>

        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Radio className="h-6 w-6 text-primary" />
              CMGF Mission Control
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Bounded AI with Human-in-the-Loop Architecture Demo
            </p>
          </div>
          <div className="flex items-center gap-4">
            <StatusIndicator status={metrics.systemHealth} />
            <Button variant="outline" size="sm" data-testid="button-refresh">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-4 gap-3 mb-6">
          <MetricTile 
            label="Active Users" 
            value={metrics.activeUsers.toLocaleString()} 
            icon={Users}
            trend="up"
            testId="metric-active-users"
          />
          <MetricTile 
            label="Review Queue" 
            value={metrics.reviewQueueDepth} 
            icon={Clock}
            subtitle={`Avg: ${metrics.avgReviewTime}`}
            testId="metric-review-queue"
          />
          <MetricTile 
            label="Human Override Rate" 
            value={`${metrics.humanOverrideRate}%`} 
            icon={UserCheck}
            trend="neutral"
            testId="metric-override-rate"
          />
          <MetricTile 
            label="Credential Match Rate" 
            value={`${metrics.credentialMatchRate}%`} 
            icon={CheckCircle}
            trend="up"
            testId="metric-match-rate"
          />
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="stream" className="flex items-center gap-2" data-testid="tab-stream">
                  <Users className="h-4 w-4" />
                  Service Members
                </TabsTrigger>
                <TabsTrigger value="review" className="flex items-center gap-2" data-testid="tab-review">
                  <Shield className="h-4 w-4" />
                  Human Review Ops
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center gap-2" data-testid="tab-ai">
                  <Brain className="h-4 w-4" />
                  AI Mediation
                </TabsTrigger>
              </TabsList>

              <TabsContent value="stream" className="space-y-4">
                <Card className="border-border/50" data-testid="card-transition-cases">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-mono flex items-center gap-2">
                      <CircleDot className="h-4 w-4 text-green-500" />
                      ACTIVE TRANSITION CASES
                    </CardTitle>
                    <CardDescription>
                      Service members currently in the transition pipeline
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {serviceMembers.map((member) => (
                        <ServiceMemberCard 
                          key={member.id} 
                          member={member}
                          onSelect={() => setHandoffOpen(true)}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="review" className="space-y-4">
                <Card className="border-border/50" data-testid="card-review-queue">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-mono flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      HUMAN REVIEW QUEUE
                    </CardTitle>
                    <CardDescription>
                      Items requiring human judgment before proceeding
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {reviewQueue.map((item) => (
                        <ReviewQueueItem 
                          key={item.id} 
                          item={item}
                          onAction={() => setHandoffOpen(true)}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-yellow-500/30 bg-yellow-500/5" data-testid="card-governance-warning">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-foreground text-sm mb-1">
                          Governance Enforcement Active
                        </div>
                        <div className="text-xs text-muted-foreground">
                          No predictive outcome modeling. No individual risk scoring. No automated approvals.
                          All AI recommendations require human verification before action.
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai" className="space-y-4">
                <Card className="border-border/50" data-testid="card-ai-mediation">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-mono flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-500" />
                      AI MEDIATION CONSOLE
                    </CardTitle>
                    <CardDescription>
                      Bounded AI operations with full transparency
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="text-xs text-muted-foreground mb-2">PERMITTED OPERATIONS</div>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2 text-green-400">
                            <CheckCircle className="h-3 w-3" />
                            Credential matching & discovery
                          </li>
                          <li className="flex items-center gap-2 text-green-400">
                            <CheckCircle className="h-3 w-3" />
                            Career pathway suggestions
                          </li>
                          <li className="flex items-center gap-2 text-green-400">
                            <CheckCircle className="h-3 w-3" />
                            Policy compliance checks
                          </li>
                          <li className="flex items-center gap-2 text-green-400">
                            <CheckCircle className="h-3 w-3" />
                            Document summarization
                          </li>
                        </ul>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="text-xs text-muted-foreground mb-2">PROHIBITED OPERATIONS</div>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2 text-red-400">
                            <Lock className="h-3 w-3" />
                            Predictive outcome modeling
                          </li>
                          <li className="flex items-center gap-2 text-red-400">
                            <Lock className="h-3 w-3" />
                            Individual risk scoring
                          </li>
                          <li className="flex items-center gap-2 text-red-400">
                            <Lock className="h-3 w-3" />
                            Automated approvals
                          </li>
                          <li className="flex items-center gap-2 text-red-400">
                            <Lock className="h-3 w-3" />
                            Unsupervised decisions
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="border border-border/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs font-mono text-muted-foreground">AI CONFIDENCE DISTRIBUTION</div>
                        <Badge variant="outline" className="text-xs">Last 24h</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-20">High (&gt;80%)</span>
                          <Progress value={45} className="flex-1 h-2" />
                          <span className="text-xs font-mono w-12 text-right">45%</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-20">Medium</span>
                          <Progress value={35} className="flex-1 h-2" />
                          <span className="text-xs font-mono w-12 text-right">35%</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-20">Low (&lt;50%)</span>
                          <Progress value={20} className="flex-1 h-2" />
                          <span className="text-xs font-mono w-12 text-right">20%</span>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-muted-foreground">
                        Low confidence items automatically escalated to human review
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="col-span-4 space-y-4">
            <FundingGapGauge 
              education={fundingGap.educationBenefits}
              advising={fundingGap.transitionAdvising}
              ratio={fundingGap.ratio}
            />

            <Card className="border-border/50" data-testid="card-audit-trail">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono flex items-center gap-2">
                  <History className="h-4 w-4" />
                  AUDIT TRAIL
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="pr-4">
                    {auditLog.map((entry) => (
                      <AuditLogRow key={entry.id} entry={entry} />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="border-primary/30" data-testid="card-system-principles">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">System Principles</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• AI as infrastructure, never authority</li>
                  <li>• Human judgment preserved at all decision points</li>
                  <li>• Transparency over optimization</li>
                  <li>• Full audit trail for accountability</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <HandoffModal open={handoffOpen} onClose={() => setHandoffOpen(false)} />
    </div>
  );
}
