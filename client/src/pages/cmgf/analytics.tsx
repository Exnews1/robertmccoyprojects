import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3, Users, Activity, Smartphone, Clock,
  RefreshCw, Zap, MessageSquare, FileText,
  Eye, ArrowLeft, Cpu, BookOpen
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

interface AnalyticsData {
  period_hours: number;
  since: string;
  total_events: number;
  unique_sessions: number;
  event_counts: Record<string, number>;
  timeline: Array<{ bucket: string; count: number }>;
  recent_events: Array<{
    id: number;
    eventType: string;
    sessionId: string | null;
    metadata: string | null;
    userAgent: string | null;
    createdAt: string;
  }>;
}

const EVENT_LABELS: Record<string, { label: string; icon: typeof Activity; color: string }> = {
  sm_scenario_run: { label: "SM Scenario Runs", icon: Zap, color: "text-blue-500" },
  sm_scenario_view: { label: "SM Scenario Views", icon: Eye, color: "text-blue-400" },
  sm_advisor_chat: { label: "AI Advisor Chats", icon: MessageSquare, color: "text-purple-500" },
  eso_caseload_view: { label: "ESO Caseload Views", icon: Users, color: "text-green-500" },
  eso_caseload_run: { label: "ESO Caseload Runs", icon: Zap, color: "text-green-400" },
  isr_report_view: { label: "ISR Report Views", icon: FileText, color: "text-amber-500" },
  isr_report_run: { label: "ISR Report Runs", icon: Zap, color: "text-amber-400" },
  dashboard_view: { label: "Dashboard Views", icon: BarChart3, color: "text-cyan-500" },
  explorer_search: { label: "Explorer Searches", icon: BookOpen, color: "text-indigo-500" },
  page_view: { label: "Page Views", icon: Eye, color: "text-muted-foreground" },
};

function StatCard({ label, value, icon: Icon, color, subtext }: {
  label: string; value: number | string; icon: typeof Activity; color: string; subtext?: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</span>
        </div>
        <div className="text-2xl font-bold text-foreground">{typeof value === "number" ? value.toLocaleString() : value}</div>
        {subtext && <p className="text-[10px] text-muted-foreground mt-1">{subtext}</p>}
      </CardContent>
    </Card>
  );
}

function isMobile(ua: string | null): boolean {
  if (!ua) return false;
  return /mobile|android|iphone|ipad/i.test(ua);
}

export default function Analytics() {
  const [hours, setHours] = useState("24");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { data, isLoading, refetch } = useQuery<AnalyticsData>({
    queryKey: ["/api/demo-analytics", hours],
    queryFn: async () => {
      const res = await fetch(`/api/demo-analytics?hours=${hours}`);
      return res.json();
    },
    refetchInterval: autoRefresh ? 15000 : false,
  });

  const mobileCount = data?.recent_events.filter(e => isMobile(e.userAgent)).length || 0;
  const desktopCount = (data?.recent_events.length || 0) - mobileCount;
  const mobilePercent = data?.recent_events.length ? Math.round(mobileCount / data.recent_events.length * 100) : 0;

  const eventBarData = data ? Object.entries(data.event_counts)
    .map(([key, count]) => ({
      name: EVENT_LABELS[key]?.label || key,
      count,
      fill: key.startsWith("sm_") ? "#3b82f6" : key.startsWith("eso_") ? "#22c55e" : key.startsWith("isr_") ? "#f59e0b" : "#6b7280",
    }))
    .sort((a, b) => b.count - a.count) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-8 space-y-4 md:space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <a href="/research/cmgf/dashboard" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-back-dashboard">
          <ArrowLeft className="w-4 h-4" />
        </a>
        <div>
          <h1 className="text-2xl font-bold" data-testid="analytics-title">Conference Analytics</h1>
          <p className="text-muted-foreground text-sm">Live usage tracking for the CMGF demo</p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <Select value={hours} onValueChange={setHours}>
            <SelectTrigger className="w-36" data-testid="select-hours">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Last 1 hour</SelectItem>
              <SelectItem value="4">Last 4 hours</SelectItem>
              <SelectItem value="8">Last 8 hours</SelectItem>
              <SelectItem value="24">Last 24 hours</SelectItem>
              <SelectItem value="72">Last 3 days</SelectItem>
              <SelectItem value="168">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant={autoRefresh ? "default" : "outline"}
          size="sm"
          onClick={() => setAutoRefresh(!autoRefresh)}
          data-testid="button-auto-refresh"
        >
          <RefreshCw className={`w-3 h-3 mr-1.5 ${autoRefresh ? "animate-spin" : ""}`} />
          {autoRefresh ? "Live (15s)" : "Paused"}
        </Button>

        <Button variant="outline" size="sm" onClick={() => refetch()} data-testid="button-refresh">
          <RefreshCw className="w-3 h-3 mr-1.5" />
          Refresh Now
        </Button>

        {autoRefresh && (
          <Badge variant="outline" className="text-[10px] text-green-500 border-green-500/30">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
            LIVE
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground">Loading analytics...</div>
      ) : !data ? (
        <div className="text-center py-16 text-muted-foreground">No data available.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Interactions" value={data.total_events} icon={Activity} color="text-primary" subtext={`in last ${hours}h`} />
            <StatCard label="Unique Users" value={data.unique_sessions} icon={Users} color="text-blue-500" subtext="by session" />
            <StatCard
              label="Scenario Runs"
              value={(data.event_counts.sm_scenario_run || 0) + (data.event_counts.eso_caseload_run || 0) + (data.event_counts.isr_report_run || 0)}
              icon={Zap}
              color="text-amber-500"
              subtext="SM + ESO + ISR"
            />
            <StatCard label="Mobile vs Desktop" value={`${mobilePercent}% mobile`} icon={Smartphone} color="text-cyan-500" subtext={`${mobileCount} mobile / ${desktopCount} desktop`} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Activity by Type</span>
                </div>
                {eventBarData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={eventBarData} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 8 }} width={90} />
                      <Tooltip contentStyle={{ fontSize: 11, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No events recorded yet.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Activity Timeline (15-min buckets)</span>
                </div>
                {data.timeline.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={data.timeline} margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                      <XAxis dataKey="bucket" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
                      <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                      <Tooltip contentStyle={{ fontSize: 11, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No timeline data yet.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Event Breakdown</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {Object.entries(EVENT_LABELS).map(([key, meta]) => {
                  const cnt = data.event_counts[key] || 0;
                  const EIcon = meta.icon;
                  return (
                    <div key={key} className="p-2 rounded-lg border border-border bg-card/50">
                      <div className="flex items-center gap-1.5 mb-1">
                        <EIcon className={`w-3 h-3 ${meta.color}`} />
                        <span className="text-[9px] font-mono text-muted-foreground">{meta.label}</span>
                      </div>
                      <div className="text-lg font-bold text-foreground">{cnt}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Recent Events (last 50)</span>
              </div>
              <div className="space-y-1 max-h-[400px] overflow-y-auto">
                {data.recent_events.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No events recorded yet. Interact with the demo to see live data.</p>
                ) : (
                  data.recent_events.map(ev => {
                    const meta = EVENT_LABELS[ev.eventType];
                    const time = new Date(ev.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
                    const mobile = isMobile(ev.userAgent);
                    return (
                      <div key={ev.id} className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-muted/30 transition-colors" data-testid={`event-row-${ev.id}`}>
                        <span className="text-[10px] font-mono text-muted-foreground w-20 shrink-0">{time}</span>
                        <Badge variant="outline" className={`text-[8px] px-1.5 py-0 shrink-0 ${meta?.color || ""}`}>
                          {meta?.label || ev.eventType}
                        </Badge>
                        {mobile && (
                          <Smartphone className="w-3 h-3 text-cyan-500 shrink-0" />
                        )}
                        {ev.sessionId && (
                          <span className="text-[9px] font-mono text-muted-foreground truncate">{ev.sessionId.slice(0, 8)}</span>
                        )}
                        {ev.metadata && (
                          <span className="text-[9px] text-muted-foreground truncate">{ev.metadata.slice(0, 60)}</span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
