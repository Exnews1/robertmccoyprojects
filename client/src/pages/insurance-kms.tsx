import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Shield, ArrowLeft, Search, ChevronRight, FileText, X, Building2, Calendar, Tag, Percent, Hash, Truck, DollarSign, AlertCircle, ExternalLink, RefreshCw, Filter } from "lucide-react";

const SESSION_KEY = "insurance-pipeline-session";

const PHASE_COLORS: Record<string, string> = {
  "Submission":         "bg-sky-900/50 text-sky-300 border-sky-800",
  "Binding & Policy":   "bg-violet-900/50 text-violet-300 border-violet-800",
  "Servicing":          "bg-amber-900/50 text-amber-300 border-amber-800",
  "Claims":             "bg-red-900/50 text-red-300 border-red-800",
  "Compliance & Admin": "bg-emerald-900/50 text-emerald-300 border-emerald-800",
};

const LINE_LABELS: Record<string, string> = {
  GL: "General Liability", PROP: "Commercial Property", AUTO: "Commercial Auto",
  WC: "Workers Compensation", UMBR: "Umbrella/Excess", EPLI: "Employment Practices",
  DO: "Directors & Officers", CYBER: "Cyber Liability", PL: "Professional Liability",
  BOP: "Business Owners Policy", BOND: "Surety Bond", IM: "Inland Marine",
};

type RepoDoc = {
  id: number; sessionId: string; filename: string; filePath: string | null;
  standardName: string | null; docType: string; docTypeLabel: string;
  lifecyclePhase: string | null; policyLine: string | null; policyPeriod: string | null;
  namedInsured: string | null; policyNumber: string | null; carrierName: string | null;
  premium: string | null; claimNumber: string | null; effectiveDate: string | null;
  expirationDate: string | null; confidence: number | null;
  approvedAt: string | null; approvedBy: string | null;
};

function DocDetailPanel({ doc, onClose }: { doc: RepoDoc; onClose: () => void }) {
  const phaseClass = PHASE_COLORS[doc.lifecyclePhase || ""] || "bg-slate-800 text-slate-400 border-slate-700";
  const pct = doc.confidence ? Math.round(doc.confidence * 100) : 0;
  const confColor = pct >= 90 ? "bg-emerald-500" : pct >= 75 ? "bg-amber-500" : "bg-red-500";

  const field = (label: string, value: string | null | undefined, icon?: any) => {
    if (!value) return null;
    const Icon = icon;
    return (
      <div className="flex items-start gap-2 py-2 border-b border-slate-800">
        {Icon && <Icon className="h-3.5 w-3.5 text-slate-500 mt-0.5 shrink-0" />}
        <div className="min-w-0">
          <div className="text-xs text-slate-500">{label}</div>
          <div className="text-sm text-slate-200 break-words">{value}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-700 flex flex-col h-full overflow-y-auto">
        <div className="px-5 py-4 border-b border-slate-700 flex items-start justify-between gap-3 sticky top-0 bg-slate-900 z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${phaseClass}`}>{doc.docType}</span>
              <span className="text-sm font-semibold text-slate-100">{doc.docTypeLabel}</span>
            </div>
            <div className="text-xs text-slate-500 mt-1 font-mono truncate">{doc.standardName || doc.filename}</div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 mt-1 shrink-0"><X className="h-4 w-4" /></button>
        </div>

        <div className="p-5 space-y-1">
          {/* Confidence */}
          <div className="pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span>AI Classification Confidence</span><span className="font-mono">{pct}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${confColor}`} style={{ width: `${pct}%` }} />
            </div>
          </div>

          {field("Named Insured", doc.namedInsured, Building2)}
          {field("Policy Line", doc.policyLine ? `${doc.policyLine} — ${LINE_LABELS[doc.policyLine] || ""}` : null, Tag)}
          {field("Policy Period", doc.policyPeriod, Calendar)}
          {field("Policy Number", doc.policyNumber, Hash)}
          {field("Carrier", doc.carrierName, Truck)}
          {field("Premium", doc.premium, DollarSign)}
          {field("Claim Number", doc.claimNumber, AlertCircle)}
          {field("Effective Date", doc.effectiveDate, Calendar)}
          {field("Expiration Date", doc.expirationDate, Calendar)}
          {field("Lifecycle Phase", doc.lifecyclePhase)}
          {field("Approved By", doc.approvedBy)}
          {doc.approvedAt && field("Filed At", new Date(doc.approvedAt).toLocaleString())}

          {/* Filing path */}
          {doc.namedInsured && doc.policyLine && doc.policyPeriod && (
            <div className="pt-3 pb-2 border-b border-slate-800">
              <div className="text-xs text-slate-500 mb-1.5">Filing Path</div>
              <div className="flex items-center gap-1 text-xs flex-wrap">
                {[doc.namedInsured, doc.policyLine, doc.policyPeriod, doc.docType].map((seg, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <ChevronRight className="h-3 w-3 text-slate-600" />}
                    <span className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-slate-300">{seg}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* PDF viewer toggle */}
          {doc.filePath && (
            <div className="pt-3">
              <a
                href={doc.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 bg-amber-900/30 border border-amber-800 px-3 py-2 rounded w-full justify-center transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                Open Document ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type Facets = {
  clients: string[];
  policyLines: string[];
  lifecyclePhases: string[];
  policyPeriods: string[];
  docTypes: { code: string; label: string }[];
};

export default function InsuranceKMS() {
  const [sessionId, setSessionId] = useState(() => localStorage.getItem(SESSION_KEY) || "");

  // If another tab creates a session after this tab is already open, pick it up immediately
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === SESSION_KEY && e.newValue) setSessionId(e.newValue);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const [search, setSearch] = useState("");
  const [filterLine, setFilterLine] = useState("");
  const [filterPhase, setFilterPhase] = useState("");
  const [filterClient, setFilterClient] = useState("");
  const [selected, setSelected] = useState<RepoDoc | null>(null);

  const { data, isLoading, refetch } = useQuery<{ data: RepoDoc[] }>({
    queryKey: ["/api/insurance/repository", sessionId],
    queryFn: () => fetch(`/api/insurance/repository?session_id=${sessionId}`).then(r => r.json()),
    enabled: !!sessionId,
    refetchInterval: 3000,
  });

  const { data: facetsData, refetch: refetchFacets } = useQuery<Facets & { success: boolean }>({
    queryKey: ["/api/insurance/repository/facets", sessionId],
    queryFn: () =>
      fetch("/api/insurance/repository/facets", {
        headers: { "x-session-id": sessionId },
      }).then(r => r.json()),
    enabled: !!sessionId,
    refetchInterval: 5000,
  });

  // Listen for approvals broadcast from the pipeline tab — refetch immediately
  const channelRef = useRef<BroadcastChannel | null>(null);
  useEffect(() => {
    if (!sessionId) return;
    const ch = new BroadcastChannel("insurance-kms-updates");
    channelRef.current = ch;
    ch.onmessage = (e) => {
      if (e.data?.sessionId === sessionId) {
        refetch();
        refetchFacets();
      }
    };
    return () => ch.close();
  }, [sessionId, refetch, refetchFacets]);

  const docs = data?.data || [];

  // Filter options come from the DB facets endpoint so they always reflect what's actually stored
  const clients = facetsData?.clients ?? [...new Set(docs.map(d => d.namedInsured).filter(Boolean))].sort() as string[];
  const lines   = facetsData?.policyLines ?? [...new Set(docs.map(d => d.policyLine).filter(Boolean))].sort() as string[];
  const phases  = facetsData?.lifecyclePhases ?? [...new Set(docs.map(d => d.lifecyclePhase).filter(Boolean))].sort() as string[];

  const filtered = docs.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !q || [d.filename, d.docTypeLabel, d.namedInsured, d.policyLine, d.policyNumber, d.standardName]
      .some(v => v?.toLowerCase().includes(q));
    const matchLine = !filterLine || d.policyLine === filterLine;
    const matchPhase = !filterPhase || d.lifecyclePhase === filterPhase;
    const matchClient = !filterClient || d.namedInsured === filterClient;
    return matchSearch && matchLine && matchPhase && matchClient;
  });

  // Group by client → policy line → period → docs
  type GroupedDocs = Record<string, Record<string, Record<string, RepoDoc[]>>>;
  const grouped: GroupedDocs = {};
  for (const doc of filtered) {
    const client = doc.namedInsured || "Unknown Client";
    const line = doc.policyLine || "Unknown Line";
    const period = doc.policyPeriod || "Unknown Period";
    if (!grouped[client]) grouped[client] = {};
    if (!grouped[client][line]) grouped[client][line] = {};
    if (!grouped[client][line][period]) grouped[client][line][period] = [];
    grouped[client][line][period].push(doc);
  }

  const activeFilters = [filterLine, filterPhase, filterClient].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {selected && <DocDetailPanel doc={selected} onClose={() => setSelected(null)} />}

      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700 px-5 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link href="/research/knowledge-systems">
            <button className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-sm mr-2">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
          </Link>
          <div className="h-4 border-l border-slate-700 mr-1" />
          <Shield className="h-5 w-5 text-amber-500" />
          <div>
            <div className="text-sm font-semibold text-slate-100">Pinnacle Insurance Group — Document Repository</div>
            <div className="text-xs text-amber-600 font-medium tracking-wide">OKS INSURANCE KMS PORTAL · CLIENT &gt; POLICY LINE &gt; PERIOD &gt; DOCUMENT</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/research/knowledge-systems/insurance/demo">
            <button className="text-xs px-3 py-1.5 bg-sky-900/40 hover:bg-sky-900/60 border border-sky-800 text-sky-300 rounded" data-testid="link-pipeline">
              ← Ingestion Pipeline
            </button>
          </Link>
          <button onClick={() => refetch()} className="text-slate-500 hover:text-slate-300 p-1.5">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* Stats strip */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-5 py-2.5 flex items-center gap-6 text-xs">
        <span className="text-slate-400"><span className="text-amber-400 font-bold font-mono">{docs.length}</span> Documents Filed</span>
        <span className="text-slate-400"><span className="text-sky-400 font-bold font-mono">{clients.length}</span> Clients</span>
        <span className="text-slate-400"><span className="text-violet-400 font-bold font-mono">{lines.length}</span> Policy Lines</span>
        <span className="text-slate-400"><span className="text-emerald-400 font-bold font-mono">{filtered.length}</span> Shown</span>
        {!sessionId && (
          <span className="text-slate-600 ml-auto">
            No active session — <Link href="/research/knowledge-systems/insurance/demo"><span className="text-amber-500 hover:underline cursor-pointer">go to pipeline →</span></Link>
          </span>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar filters */}
        <aside className="w-56 shrink-0 bg-slate-900 border-r border-slate-800 p-4 space-y-4 overflow-y-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search documents…"
              className="w-full bg-slate-800 border border-slate-700 rounded pl-8 pr-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-600"
              data-testid="input-search"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2 top-2.5 text-slate-500 hover:text-slate-300">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Client filter */}
          <div>
            <div className="text-xs text-slate-500 font-semibold mb-1.5 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Client
              {clients.length > 0 && <span className="ml-auto text-slate-600 font-mono">{clients.length}</span>}
            </div>
            <select
              value={filterClient}
              onChange={e => setFilterClient(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-600"
              data-testid="select-filter-client"
            >
              <option value="">All Clients</option>
              {clients.map(c => {
                const count = docs.filter(d => d.namedInsured === c).length;
                return (
                  <option key={c} value={c}>
                    {c}{count > 0 ? ` (${count})` : ""}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Policy line filter */}
          <div>
            <div className="text-xs text-slate-500 font-semibold mb-1.5 flex items-center">
              Policy Line
              {lines.length > 0 && <span className="ml-auto text-slate-600 font-mono">{lines.length}</span>}
            </div>
            <select
              value={filterLine}
              onChange={e => setFilterLine(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-600"
              data-testid="select-filter-line"
            >
              <option value="">All Lines</option>
              {lines.map(l => {
                const count = docs.filter(d => d.policyLine === l).length;
                return (
                  <option key={l} value={l}>
                    {l} — {LINE_LABELS[l] || l}{count > 0 ? ` (${count})` : ""}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Phase filter */}
          <div>
            <div className="text-xs text-slate-500 font-semibold mb-1.5 flex items-center">
              Lifecycle Phase
              {phases.length > 0 && <span className="ml-auto text-slate-600 font-mono">{phases.length}</span>}
            </div>
            <select
              value={filterPhase}
              onChange={e => setFilterPhase(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-600"
              data-testid="select-filter-phase"
            >
              <option value="">All Phases</option>
              {phases.map(p => {
                const count = docs.filter(d => d.lifecyclePhase === p).length;
                return (
                  <option key={p} value={p}>
                    {p}{count > 0 ? ` (${count})` : ""}
                  </option>
                );
              })}
            </select>
          </div>

          {activeFilters > 0 && (
            <button
              onClick={() => { setFilterLine(""); setFilterPhase(""); setFilterClient(""); setSearch(""); }}
              className="w-full text-xs text-slate-400 hover:text-slate-200 border border-slate-700 rounded py-1.5 transition-colors"
            >
              Clear {activeFilters} filter{activeFilters > 1 ? "s" : ""}
            </button>
          )}

          {/* Legend */}
          <div className="pt-2 border-t border-slate-800">
            <div className="text-xs text-slate-600 mb-2">Lifecycle Phases</div>
            {Object.entries(PHASE_COLORS).map(([phase, cls]) => (
              <div key={phase} className="flex items-center gap-1.5 mb-1">
                <span className={`text-xs px-1 rounded border ${cls}`}>■</span>
                <span className="text-xs text-slate-500">{phase}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-5">
          {isLoading && (
            <div className="text-center py-16 text-slate-600 text-sm">Loading repository…</div>
          )}

          {!isLoading && docs.length === 0 && (
            <div className="text-center py-16">
              <FileText className="h-10 w-10 mx-auto mb-3 text-slate-700" />
              <div className="text-slate-500 text-sm">No documents filed yet.</div>
              <Link href="/research/knowledge-systems/insurance/demo">
                <button className="mt-4 text-xs px-4 py-2 bg-amber-900/40 hover:bg-amber-900/60 border border-amber-800 text-amber-300 rounded">
                  Go to Ingestion Pipeline →
                </button>
              </Link>
            </div>
          )}

          {!isLoading && docs.length > 0 && filtered.length === 0 && (
            <div className="text-center py-12 text-slate-600 text-sm">No documents match your filters.</div>
          )}

          {/* 4-level hierarchy: Client → Policy Line → Period → Documents */}
          {Object.entries(grouped).map(([client, lines]) => (
            <div key={client} className="mb-8">
              {/* Client header */}
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-4 w-4 text-amber-500" />
                <h2 className="text-base font-bold text-amber-400">{client}</h2>
                <span className="text-xs text-slate-600">
                  ({Object.values(lines).flatMap(periods => Object.values(periods).flat()).length} docs)
                </span>
              </div>

              {Object.entries(lines).map(([line, periods]) => (
                <div key={line} className="ml-4 mb-5">
                  {/* Policy line header */}
                  <div className="flex items-center gap-2 mb-3">
                    <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
                    <span className="text-sm font-semibold text-slate-300">{line}</span>
                    <span className="text-xs text-slate-600">{LINE_LABELS[line] || ""}</span>
                  </div>

                  {Object.entries(periods).map(([period, docs]) => (
                    <div key={period} className="ml-4 mb-3">
                      {/* Period header */}
                      <div className="flex items-center gap-2 mb-2">
                        <ChevronRight className="h-3 w-3 text-slate-700" />
                        <Calendar className="h-3 w-3 text-slate-600" />
                        <span className="text-xs font-medium text-slate-500 font-mono">{period}</span>
                        <span className="text-xs text-slate-700">({docs.length} docs)</span>
                      </div>

                      {/* Document cards grid */}
                      <div className="ml-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {docs.map(doc => {
                          const phaseClass = PHASE_COLORS[doc.lifecyclePhase || ""] || "bg-slate-800 text-slate-400 border-slate-700";
                          const pct = doc.confidence ? Math.round(doc.confidence * 100) : 0;
                          const confColor = pct >= 90 ? "text-emerald-400" : pct >= 75 ? "text-amber-400" : "text-red-400";
                          return (
                            <button
                              key={doc.id}
                              onClick={() => setSelected(doc)}
                              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 rounded-lg p-3 text-left transition-all group"
                              data-testid={`card-doc-${doc.id}`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-1.5">
                                <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded border ${phaseClass}`}>
                                  {doc.docType}
                                </span>
                                <span className={`text-xs font-mono ${confColor}`}>{pct}%</span>
                              </div>
                              <div className="text-xs font-medium text-slate-300 group-hover:text-slate-100 leading-tight">
                                {doc.docTypeLabel}
                              </div>
                              <div className="text-xs text-slate-600 mt-1 truncate font-mono">
                                {doc.standardName || doc.filename}
                              </div>
                              {doc.carrierName && (
                                <div className="text-xs text-slate-600 mt-0.5 truncate">{doc.carrierName}</div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
