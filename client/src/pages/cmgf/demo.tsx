import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useCMGFDemo, ServiceMember, ReviewItem, AuditLogEntry } from "@/hooks/use-cmgf-demo";
import { 
  ChevronRight, Activity, Users, Clock, Shield, Brain, 
  AlertTriangle, CheckCircle, Eye, UserCheck, FileCheck,
  TrendingUp, Gauge, Radio, CircleDot, ArrowRight,
  Lock, Unlock, History, RefreshCw, Terminal, Cpu
} from "lucide-react";

function StatusIndicator({ status }: { status: "operational" | "degraded" | "maintenance" }) {
  const colors = {
    operational: "bg-green-500 shadow-green-500/50",
    degraded: "bg-yellow-500 shadow-yellow-500/50",
    maintenance: "bg-orange-500 shadow-orange-500/50"
  };
  return (
    <div className="flex items-center gap-2 font-mono text-xs" data-testid="status-indicator">
      <span className={`w-2 h-2 rounded-full ${colors[status]} animate-pulse shadow-lg`} />
      <span className="uppercase tracking-wider text-green-400">{status}</span>
    </div>
  );
}

function MetricTile({ 
  label, 
  value, 
  icon: Icon, 
  trend,
  subtitle,
  testId,
  color = "green"
}: { 
  label: string; 
  value: string | number; 
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  subtitle?: string;
  testId?: string;
  color?: "green" | "cyan" | "amber" | "red";
}) {
  const colorClasses = {
    green: "border-green-500/30 text-green-400",
    cyan: "border-cyan-500/30 text-cyan-400",
    amber: "border-amber-500/30 text-amber-400",
    red: "border-red-500/30 text-red-400"
  };

  return (
    <div 
      className={`bg-black/50 border ${colorClasses[color]} p-4 font-mono`}
      data-testid={testId}
    >
      <div className="flex items-start justify-between mb-2">
        <Icon className={`h-4 w-4 ${colorClasses[color].split(' ')[1]}`} />
        {trend && (
          <TrendingUp className={`h-3 w-3 ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500 rotate-180" : "text-gray-500"}`} />
        )}
      </div>
      <div className={`text-2xl font-bold ${colorClasses[color].split(' ')[1]}`}>{value}</div>
      <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
      {subtitle && <div className="text-xs text-cyan-400 mt-1">{subtitle}</div>}
    </div>
  );
}

function FundingGapGauge({ education, advising, ratio }: { education: number; advising: number; ratio: number }) {
  return (
    <div className="bg-black border border-amber-500/30 p-4 font-mono" data-testid="card-funding-gap">
      <div className="flex items-center gap-2 mb-4 text-amber-400 text-sm uppercase tracking-wider">
        <Gauge className="h-4 w-4" />
        FUNDING GAP INDICATOR
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-3xl font-bold text-green-400">${education}B</div>
            <div className="text-xs text-gray-500">Education Benefits</div>
          </div>
          <div className="text-gray-600 text-lg font-bold">VS</div>
          <div className="text-right">
            <div className="text-3xl font-bold text-red-400">${advising * 1000}M</div>
            <div className="text-xs text-gray-500">Transition Advising</div>
          </div>
        </div>
        <div className="relative h-3 bg-gray-900 overflow-hidden border border-gray-800">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-600 to-green-400"
            style={{ width: `${ratio}%` }}
          />
          <div 
            className="absolute inset-y-0 right-0 bg-gradient-to-l from-red-600 to-red-400/50"
            style={{ width: `${100 - ratio}%` }}
          />
        </div>
        <div className="text-center text-xs text-gray-500">
          <span className="text-amber-400 font-bold">{ratio}:1</span> RESOURCE IMBALANCE
        </div>
      </div>
    </div>
  );
}

function ServiceMemberCard({ member, onSelect }: { member: ServiceMember; onSelect: () => void }) {
  const statusColors = {
    active: "text-cyan-400 border-cyan-500/50",
    "in-review": "text-amber-400 border-amber-500/50",
    completed: "text-green-400 border-green-500/50"
  };

  return (
    <div 
      className="bg-black/80 border border-gray-800 hover:border-cyan-500/50 p-4 cursor-pointer transition-all font-mono"
      onClick={onSelect}
      data-testid={`card-service-member-${member.id}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-cyan-400 font-bold">{member.name}</div>
          <div className="text-xs text-gray-500">{member.rank} | {member.branch}</div>
        </div>
        <span className={`text-xs px-2 py-1 border ${statusColors[member.status]} uppercase`}>
          {member.status}
        </span>
      </div>
      <div className="text-sm text-gray-400 mb-2">{member.mos}</div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">SEP: {member.separationDate}</span>
        <span className="text-green-400">{member.credentialMatches} MATCHES</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {member.careerPaths.slice(0, 2).map((path, i) => (
          <span key={i} className="text-xs px-2 py-0.5 bg-gray-900 text-gray-400 border border-gray-700">{path}</span>
        ))}
        {member.careerPaths.length > 2 && (
          <span className="text-xs px-2 py-0.5 bg-gray-900 text-gray-500">+{member.careerPaths.length - 2}</span>
        )}
      </div>
    </div>
  );
}

function ReviewQueueItem({ item, onAction }: { item: ReviewItem; onAction: () => void }) {
  const priorityColors = {
    high: "text-red-400 border-red-500/50",
    medium: "text-amber-400 border-amber-500/50",
    low: "text-green-400 border-green-500/50"
  };

  const typeIcons = {
    credential: FileCheck,
    pathway: ArrowRight,
    exception: AlertTriangle
  };

  const TypeIcon = typeIcons[item.type];

  return (
    <div className="p-3 border border-gray-800 bg-black/80 font-mono hover:border-cyan-500/30 transition-all">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 border border-gray-700 bg-gray-900 flex items-center justify-center flex-shrink-0">
          <TypeIcon className="h-4 w-4 text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 border ${priorityColors[item.priority]} uppercase`}>
              {item.priority}
            </span>
            <span className="text-xs text-gray-600">{item.id}</span>
          </div>
          <div className="text-sm text-gray-300 mb-1">{item.summary}</div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{item.assignedTo}</span>
            <div className="flex items-center gap-2">
              <span>CONF:</span>
              <span className={`${item.aiConfidence > 0.7 ? "text-green-400" : item.aiConfidence > 0.5 ? "text-amber-400" : "text-red-400"}`}>
                {(item.aiConfidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={onAction} 
          className="px-3 py-1.5 border border-cyan-500/50 text-cyan-400 text-xs uppercase hover:bg-cyan-500/10 transition-all"
          data-testid={`button-review-${item.id}`}
        >
          <Eye className="h-3 w-3 inline mr-1" />
          REVIEW
        </button>
      </div>
    </div>
  );
}

function AuditLogRow({ entry }: { entry: AuditLogEntry }) {
  const time = new Date(entry.timestamp).toLocaleTimeString();
  
  return (
    <div className="flex items-start gap-3 py-2 border-b border-gray-800/50 last:border-0 font-mono">
      <div className={`w-6 h-6 flex items-center justify-center flex-shrink-0 ${
        entry.actorType === "human" ? "text-cyan-400" : "text-purple-400"
      }`}>
        {entry.actorType === "human" ? (
          <UserCheck className="h-3 w-3" />
        ) : (
          <Brain className="h-3 w-3" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs mb-1">
          <span className="text-gray-600">{time}</span>
          <span className="text-xs px-1.5 py-0.5 border border-gray-700 text-gray-400 uppercase">{entry.action}</span>
        </div>
        <div className="text-sm text-gray-300">{entry.details}</div>
        <div className="text-xs text-gray-600 mt-1">
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
      <DialogContent className="sm:max-w-md bg-black border-cyan-500/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-cyan-400 font-mono">
            <Shield className="h-5 w-5" />
            HUMAN-IN-LOOP HANDOFF
          </DialogTitle>
          <DialogDescription className="text-gray-500 font-mono text-xs">
            Complete all verification steps before approving AI recommendations.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4 font-mono">
          <div className="flex items-start gap-3">
            <Checkbox 
              id="reviewed" 
              checked={checks.reviewed}
              onCheckedChange={(checked) => setChecks(prev => ({ ...prev, reviewed: !!checked }))}
              data-testid="checkbox-reviewed"
              className="border-cyan-500/50 data-[state=checked]:bg-cyan-500"
            />
            <label htmlFor="reviewed" className="text-sm">
              <div className="text-gray-300">AI recommendation reviewed</div>
              <div className="text-gray-600 text-xs">Verified alignment with service member goals</div>
            </label>
          </div>
          
          <div className="flex items-start gap-3">
            <Checkbox 
              id="verified" 
              checked={checks.verified}
              onCheckedChange={(checked) => setChecks(prev => ({ ...prev, verified: !!checked }))}
              data-testid="checkbox-verified"
              className="border-cyan-500/50 data-[state=checked]:bg-cyan-500"
            />
            <label htmlFor="verified" className="text-sm">
              <div className="text-gray-300">Credential mapping verified</div>
              <div className="text-gray-600 text-xs">Cross-referenced with official equivalency tables</div>
            </label>
          </div>
          
          <div className="flex items-start gap-3">
            <Checkbox 
              id="documented" 
              checked={checks.documented}
              onCheckedChange={(checked) => setChecks(prev => ({ ...prev, documented: !!checked }))}
              data-testid="checkbox-documented"
              className="border-cyan-500/50 data-[state=checked]:bg-cyan-500"
            />
            <label htmlFor="documented" className="text-sm">
              <div className="text-gray-300">Decision rationale documented</div>
              <div className="text-gray-600 text-xs">Audit trail entry prepared with justification</div>
            </label>
          </div>
          
          <div className="flex items-start gap-3">
            <Checkbox 
              id="notified" 
              checked={checks.notified}
              onCheckedChange={(checked) => setChecks(prev => ({ ...prev, notified: !!checked }))}
              data-testid="checkbox-notified"
              className="border-cyan-500/50 data-[state=checked]:bg-cyan-500"
            />
            <label htmlFor="notified" className="text-sm">
              <div className="text-gray-300">Service member notification prepared</div>
              <div className="text-gray-600 text-xs">Communication drafted with next steps</div>
            </label>
          </div>
        </div>

        <div className="border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-gray-400 font-mono">
          <div className="flex items-center gap-2 mb-1 text-amber-400">
            <Lock className="h-3 w-3" />
            <span className="uppercase tracking-wider">Governance Constraint</span>
          </div>
          <p>No automated approvals permitted. Human judgment required per CMGF Policy 3.2.1</p>
        </div>

        <DialogFooter className="gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-700 text-gray-400 text-sm font-mono hover:bg-gray-900 transition-all"
          >
            CANCEL
          </button>
          <button 
            disabled={!allChecked} 
            onClick={onClose} 
            className={`px-4 py-2 border text-sm font-mono transition-all flex items-center gap-2 ${
              allChecked 
                ? "border-green-500/50 text-green-400 hover:bg-green-500/10" 
                : "border-gray-700 text-gray-600 cursor-not-allowed"
            }`}
            data-testid="button-approve-handoff"
          >
            {allChecked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            APPROVE & LOG
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function CMGFDemo() {
  const { metrics, serviceMembers, reviewQueue, auditLog, fundingGap } = useCMGFDemo();
  const [handoffOpen, setHandoffOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("stream");

  const tabs = [
    { id: "stream", label: "SERVICE MEMBERS", icon: Users },
    { id: "review", label: "HUMAN REVIEW OPS", icon: Shield },
    { id: "ai", label: "AI MEDIATION", icon: Brain }
  ];

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/20 via-black to-black pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)`
      }} />
      
      <header className="relative border-b border-gray-800 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-500 hover:text-cyan-400 transition-colors text-xs" data-testid="link-breadcrumb-portfolio">
              PORTFOLIO
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-700" />
            <Link href="/cmgf" className="text-gray-500 hover:text-cyan-400 transition-colors text-xs" data-testid="link-breadcrumb-cmgf">
              CMGF
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-700" />
            <span className="text-cyan-400 text-xs">DEMO</span>
          </div>
          <div className="flex items-center gap-6">
            <StatusIndicator status={metrics.systemHealth} />
            <button 
              className="px-3 py-1.5 border border-gray-700 text-gray-400 text-xs uppercase hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
              data-testid="button-refresh"
            >
              <RefreshCw className="h-3 w-3 inline mr-2" />
              REFRESH
            </button>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Terminal className="h-6 w-6 text-cyan-400" />
            <h1 className="text-xl text-cyan-400 tracking-wider">CMGF MISSION CONTROL</h1>
          </div>
          <p className="text-xs text-gray-600 uppercase tracking-widest">
            Bounded AI with Human-in-the-Loop Architecture // Interactive Demo
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          <MetricTile 
            label="Active Users" 
            value={metrics.activeUsers.toLocaleString()} 
            icon={Users}
            trend="up"
            testId="metric-active-users"
            color="cyan"
          />
          <MetricTile 
            label="Review Queue" 
            value={metrics.reviewQueueDepth} 
            icon={Clock}
            subtitle={`AVG: ${metrics.avgReviewTime}`}
            testId="metric-review-queue"
            color="amber"
          />
          <MetricTile 
            label="Human Override Rate" 
            value={`${metrics.humanOverrideRate}%`} 
            icon={UserCheck}
            trend="neutral"
            testId="metric-override-rate"
            color="green"
          />
          <MetricTile 
            label="Credential Match Rate" 
            value={`${metrics.credentialMatchRate}%`} 
            icon={CheckCircle}
            trend="up"
            testId="metric-match-rate"
            color="green"
          />
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <div className="border border-gray-800 bg-black/50">
              <div className="flex border-b border-gray-800">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex-1 px-4 py-3 text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      selectedTab === tab.id 
                        ? "bg-gray-900 text-cyan-400 border-b-2 border-cyan-500" 
                        : "text-gray-500 hover:text-gray-300 hover:bg-gray-900/50"
                    }`}
                    data-testid={`tab-${tab.id}`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-4">
                {selectedTab === "stream" && (
                  <div data-testid="card-transition-cases">
                    <div className="flex items-center gap-2 mb-4 text-green-400 text-sm">
                      <CircleDot className="h-4 w-4 animate-pulse" />
                      ACTIVE TRANSITION CASES
                    </div>
                    <div className="grid gap-3">
                      {serviceMembers.map((member) => (
                        <ServiceMemberCard 
                          key={member.id} 
                          member={member}
                          onSelect={() => setHandoffOpen(true)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {selectedTab === "review" && (
                  <div className="space-y-4" data-testid="card-review-queue">
                    <div className="flex items-center gap-2 text-cyan-400 text-sm">
                      <Shield className="h-4 w-4" />
                      HUMAN REVIEW QUEUE
                    </div>
                    <div className="space-y-3">
                      {reviewQueue.map((item) => (
                        <ReviewQueueItem 
                          key={item.id} 
                          item={item}
                          onAction={() => setHandoffOpen(true)}
                        />
                      ))}
                    </div>

                    <div className="border border-amber-500/30 bg-amber-500/5 p-4" data-testid="card-governance-warning">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0" />
                        <div>
                          <div className="text-amber-400 text-sm mb-1">GOVERNANCE ENFORCEMENT ACTIVE</div>
                          <div className="text-xs text-gray-500">
                            No predictive outcome modeling. No individual risk scoring. No automated approvals.
                            All AI recommendations require human verification before action.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === "ai" && (
                  <div className="space-y-4" data-testid="card-ai-mediation">
                    <div className="flex items-center gap-2 text-purple-400 text-sm">
                      <Brain className="h-4 w-4" />
                      AI MEDIATION CONSOLE
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-green-500/20 bg-green-500/5 p-4">
                        <div className="text-xs text-green-400 mb-3 uppercase tracking-wider">Permitted Operations</div>
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
                      <div className="border border-red-500/20 bg-red-500/5 p-4">
                        <div className="text-xs text-red-400 mb-3 uppercase tracking-wider">Prohibited Operations</div>
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

                    <div className="border border-gray-800 p-4">
                      <div className="text-xs text-gray-500 mb-3 uppercase">AI Confidence Distribution</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 w-24">High (&gt;80%)</span>
                          <div className="flex-1 h-2 bg-gray-900 overflow-hidden">
                            <div className="h-full bg-green-500/50" style={{ width: "45%" }} />
                          </div>
                          <span className="text-xs text-green-400 w-12 text-right">45%</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 w-24">Medium</span>
                          <div className="flex-1 h-2 bg-gray-900 overflow-hidden">
                            <div className="h-full bg-amber-500/50" style={{ width: "35%" }} />
                          </div>
                          <span className="text-xs text-amber-400 w-12 text-right">35%</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 w-24">Low (&lt;50%)</span>
                          <div className="flex-1 h-2 bg-gray-900 overflow-hidden">
                            <div className="h-full bg-red-500/50" style={{ width: "20%" }} />
                          </div>
                          <span className="text-xs text-red-400 w-12 text-right">20%</span>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-600">
                        Low confidence items automatically escalated to human review
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-4 space-y-4">
            <FundingGapGauge 
              education={fundingGap.educationBenefits}
              advising={fundingGap.transitionAdvising}
              ratio={fundingGap.ratio}
            />

            <div className="border border-gray-800 bg-black/50 p-4" data-testid="card-audit-trail">
              <div className="flex items-center gap-2 mb-4 text-gray-400 text-sm">
                <History className="h-4 w-4" />
                AUDIT TRAIL
              </div>
              <ScrollArea className="h-64">
                <div className="pr-4">
                  {auditLog.map((entry) => (
                    <AuditLogRow key={entry.id} entry={entry} />
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="border border-cyan-500/30 bg-cyan-500/5 p-4" data-testid="card-system-principles">
              <div className="flex items-center gap-2 mb-3 text-cyan-400 text-sm">
                <Cpu className="h-4 w-4" />
                SYSTEM PRINCIPLES
              </div>
              <ul className="text-xs text-gray-400 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                  AI as infrastructure, never authority
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                  Human judgment at all decision points
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                  Transparency over optimization
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                  Full audit trail for accountability
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <HandoffModal open={handoffOpen} onClose={() => setHandoffOpen(false)} />
    </div>
  );
}
