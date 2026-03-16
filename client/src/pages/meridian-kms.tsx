import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Search, X, ChevronRight, FileText, Shield, BookOpen, ClipboardList,
  BarChart3, Code2, GraduationCap, FileSignature, Layers, Building2,
  CheckCircle2, Clock, Database, ArrowLeft, RefreshCw, ExternalLink,
  User, Calendar, Briefcase, Tag, Percent, FolderOpen, List, LayoutGrid,
  ChevronDown, Filter, Trash2, AlertTriangle, Loader2
} from "lucide-react";

type KMSDoc = {
  id: number;
  documentKey: string;
  originalName: string;
  standardName: string;
  docType: string;
  subject: string;
  department: string;
  effectiveDate: string | null;
  responsibleParty: string | null;
  confidence: number | null;
  approvedAt: string;
  approvedBy: string | null;
};

const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  "Knowledge Management": { bg: "bg-purple-950/60", text: "text-purple-300", border: "border-purple-700/60", dot: "bg-purple-400" },
  "Information Technology": { bg: "bg-violet-950/60", text: "text-violet-300", border: "border-violet-700/60", dot: "bg-violet-400" },
  "Human Resources":       { bg: "bg-blue-950/60",   text: "text-blue-300",   border: "border-blue-700/60",   dot: "bg-blue-400" },
  "Safety":                { bg: "bg-red-950/60",    text: "text-red-300",    border: "border-red-700/60",    dot: "bg-red-400" },
  "Finance":               { bg: "bg-emerald-950/60",text: "text-emerald-300",border: "border-emerald-700/60",dot: "bg-emerald-400" },
  "Quality Assurance":     { bg: "bg-cyan-950/60",   text: "text-cyan-300",   border: "border-cyan-700/60",   dot: "bg-cyan-400" },
  "Legal":                 { bg: "bg-amber-950/60",  text: "text-amber-300",  border: "border-amber-700/60",  dot: "bg-amber-400" },
  "Operations":            { bg: "bg-slate-800",     text: "text-slate-300",  border: "border-slate-600",     dot: "bg-slate-400" },
  "Procurement":           { bg: "bg-teal-950/60",   text: "text-teal-300",   border: "border-teal-700/60",   dot: "bg-teal-400" },
  "General":               { bg: "bg-gray-800",      text: "text-gray-300",   border: "border-gray-600",      dot: "bg-gray-400" },
};

const DOC_TYPE_ICONS: Record<string, any> = {
  "Policy":        Shield,
  "SOP":           ClipboardList,
  "Reference":     BookOpen,
  "Memo":          FileText,
  "Form":          Layers,
  "Report":        BarChart3,
  "Specification": Code2,
  "Training":      GraduationCap,
  "Contract":      FileSignature,
};

function getIcon(docType: string) {
  return DOC_TYPE_ICONS[docType] || FileText;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch { return iso; }
}

function formatStandardName(name: string) {
  return name.replace(/^MIG-/, "").replace(/-(\d{4})-(\d{3})$/, " · $1-$2").replace(/-/g, " ");
}

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color = pct >= 90 ? "bg-emerald-500" : pct >= 70 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-slate-300 w-8 text-right">{pct}%</span>
    </div>
  );
}

function DocCard({ doc, onClick, selected }: { doc: KMSDoc; onClick: () => void; selected: boolean }) {
  const Icon = getIcon(doc.docType);
  const colors = SUBJECT_COLORS[doc.subject] || SUBJECT_COLORS["General"];
  const displayName = formatStandardName(doc.standardName);

  return (
    <button
      onClick={onClick}
      data-testid={`card-kms-doc-${doc.id}`}
      className={`w-full text-left border rounded-lg p-4 transition-all hover:border-slate-500 hover:bg-slate-800/80 focus:outline-none focus:ring-1 focus:ring-amber-600 ${
        selected
          ? "border-amber-600 bg-slate-800/80 ring-1 ring-amber-600/30"
          : "border-slate-700 bg-slate-900/60"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded flex items-center justify-center shrink-0 ${colors.bg} ${colors.border} border`}>
          <Icon className={`h-4 w-4 ${colors.text}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span className={`text-xs px-1.5 py-0.5 rounded border font-semibold ${colors.bg} ${colors.text} ${colors.border}`}>
              {doc.docType}
            </span>
            <span className="text-xs text-slate-500 font-mono truncate">{doc.documentKey}</span>
          </div>
          <p className="text-sm font-semibold text-slate-100 leading-tight line-clamp-2">{displayName}</p>
          <p className="text-xs text-slate-500 font-mono mt-1 truncate">{doc.originalName}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Briefcase className="h-3 w-3" />{doc.department}
            </span>
            <span className="text-xs text-slate-600 flex items-center gap-1">
              <Calendar className="h-3 w-3" />{formatDate(doc.approvedAt)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function DocDetailPanel({ doc, onClose }: { doc: KMSDoc; onClose: () => void }) {
  const Icon = getIcon(doc.docType);
  const colors = SUBJECT_COLORS[doc.subject] || SUBJECT_COLORS["General"];

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-700 overflow-y-auto">
      {/* Panel header */}
      <div className="px-5 py-4 border-b border-slate-700 shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded flex items-center justify-center shrink-0 border ${colors.bg} ${colors.border}`}>
              <Icon className={`h-4 w-4 ${colors.text}`} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-mono">{doc.documentKey}</p>
              <p className="text-xs font-semibold text-slate-400">{doc.docType}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors mt-0.5"
            data-testid="button-close-doc-detail"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <h3 className="text-base font-bold text-slate-100 mt-3 leading-tight">
          {formatStandardName(doc.standardName)}
        </h3>
        <p className="text-xs text-slate-500 font-mono mt-1 break-all">{doc.originalName}</p>
      </div>

      {/* Classification metadata */}
      <div className="px-5 py-4 space-y-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Classification</p>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              <span className="text-xs text-slate-400 w-24 shrink-0">Doc Type</span>
              <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${colors.bg} ${colors.text} ${colors.border}`}>
                {doc.docType}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FolderOpen className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              <span className="text-xs text-slate-400 w-24 shrink-0">Subject</span>
              <span className={`text-xs px-2 py-0.5 rounded border ${colors.bg} ${colors.text} ${colors.border}`}>
                {doc.subject}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              <span className="text-xs text-slate-400 w-24 shrink-0">Department</span>
              <span className="text-xs text-slate-300">{doc.department}</span>
            </div>
            {doc.responsibleParty && (
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <span className="text-xs text-slate-400 w-24 shrink-0">Responsible</span>
                <span className="text-xs text-slate-300">{doc.responsibleParty}</span>
              </div>
            )}
            {doc.effectiveDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <span className="text-xs text-slate-400 w-24 shrink-0">Effective</span>
                <span className="text-xs text-slate-300">{doc.effectiveDate}</span>
              </div>
            )}
          </div>
        </div>

        {doc.confidence != null && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              <span className="flex items-center gap-1.5"><Percent className="h-3 w-3" />Classification Confidence</span>
            </p>
            <ConfidenceBar value={doc.confidence} />
            <p className="text-xs text-slate-600 mt-1">
              {doc.confidence >= 0.95 ? "Content-based — document header matched" : "Filename pattern — rules engine"}
            </p>
          </div>
        )}

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Provenance</p>
          <div className="space-y-2 bg-slate-800/60 border border-slate-700/60 rounded p-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-300">Approved</p>
                <p className="text-xs text-slate-500">{formatDate(doc.approvedAt)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <User className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-300">Approved By</p>
                <p className="text-xs text-slate-500">{doc.approvedBy || "Operations Manager"}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Standardized Name</p>
          <div className="bg-slate-800 border border-slate-700 rounded p-2.5">
            <p className="text-xs font-mono text-amber-400 break-all">{doc.standardName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MeridianKMS() {
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedDocType, setSelectedDocType] = useState("All");
  const [selectedDoc, setSelectedDoc] = useState<KMSDoc | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  const { data, isLoading, refetch, isFetching } = useQuery<{ success: boolean; data: KMSDoc[] }>({
    queryKey: ["/api/meridian/kms"],
    refetchInterval: 10000,
  });

  const handleReset = async () => {
    setResetting(true);
    await fetch("/api/meridian/kms/reset", { method: "DELETE" });
    setSelectedDoc(null);
    setSearch("");
    setSelectedSubject("All");
    setSelectedDocType("All");
    setResetConfirm(false);
    setResetting(false);
    refetch();
  };

  const docs = data?.data ?? [];

  const subjects = useMemo(() => {
    const counts: Record<string, number> = {};
    docs.forEach(d => { counts[d.subject] = (counts[d.subject] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [docs]);

  const docTypes = useMemo(() => {
    const types = [...new Set(docs.map(d => d.docType))].sort();
    return types;
  }, [docs]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return docs.filter(d => {
      const matchSearch = !q ||
        d.standardName.toLowerCase().includes(q) ||
        d.originalName.toLowerCase().includes(q) ||
        d.department.toLowerCase().includes(q) ||
        d.subject.toLowerCase().includes(q) ||
        d.docType.toLowerCase().includes(q) ||
        d.documentKey.toLowerCase().includes(q);
      const matchSubject = selectedSubject === "All" || d.subject === selectedSubject;
      const matchType = selectedDocType === "All" || d.docType === selectedDocType;
      return matchSearch && matchSubject && matchType;
    });
  }, [docs, search, selectedSubject, selectedDocType]);

  const lastUpdated = useMemo(() => {
    if (!docs.length) return null;
    return docs.reduce((latest, d) => d.approvedAt > latest ? d.approvedAt : latest, docs[0].approvedAt);
  }, [docs]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col" data-testid="page-meridian-kms">

      {/* ── Portal Header ── */}
      <header className="bg-[#0F172A] border-b border-slate-700/80 shrink-0 z-10">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 bg-amber-700 rounded flex items-center justify-center font-bold text-white text-sm font-serif">
              M
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-tight leading-none">Meridian Industrial Group</p>
              <p className="text-xs text-slate-400 leading-none mt-0.5">Knowledge Repository</p>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-lg relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search documents, departments, classifications…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-500 text-sm rounded px-3 py-1.5 pl-9 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30"
              data-testid="input-kms-search"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300" data-testid="button-clear-search">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* View toggle + refresh + reset + pipeline link */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <button
              onClick={() => setViewMode(v => v === "grid" ? "list" : "grid")}
              className="p-1.5 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
              title={viewMode === "grid" ? "Switch to list view" : "Switch to grid view"}
              data-testid="button-toggle-view"
            >
              {viewMode === "grid" ? <List className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
            </button>
            <button
              onClick={() => refetch()}
              className={`p-1.5 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors ${isFetching ? "animate-spin" : ""}`}
              title="Refresh"
              data-testid="button-refresh-kms"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <div className="w-px h-5 bg-slate-700" />

            {/* Reset for demo — confirm before wiping */}
            {resetConfirm ? (
              <div className="flex items-center gap-1.5 bg-red-950/60 border border-red-700/60 rounded px-2.5 py-1.5 animate-in fade-in duration-150">
                <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                <span className="text-xs text-red-300 font-semibold">Clear all docs?</span>
                <button
                  onClick={handleReset}
                  disabled={resetting}
                  className="text-xs font-bold text-red-300 hover:text-white bg-red-700/50 hover:bg-red-700 rounded px-2 py-0.5 transition-colors disabled:opacity-50"
                  data-testid="button-confirm-reset-kms"
                >
                  {resetting ? <Loader2 className="h-3 w-3 animate-spin inline" /> : "Confirm"}
                </button>
                <button
                  onClick={() => setResetConfirm(false)}
                  className="text-xs text-slate-500 hover:text-slate-300"
                  data-testid="button-cancel-reset-kms"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setResetConfirm(true)}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 hover:bg-red-950/30 border border-transparent hover:border-red-800/50 rounded px-2.5 py-1.5 transition-colors"
                title="Reset KMS for next demo"
                data-testid="button-reset-kms"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Reset for Demo
              </button>
            )}

            <div className="w-px h-5 bg-slate-700" />
            <Link href="/research/knowledge-systems/demo" data-testid="link-ingestion-pipeline">
              <button className="flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400 bg-amber-900/20 hover:bg-amber-900/30 border border-amber-800/50 rounded px-2.5 py-1.5 transition-colors font-semibold">
                <Database className="h-3.5 w-3.5" />
                Ingestion Pipeline
                <ExternalLink className="h-3 w-3 opacity-60" />
              </button>
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="border-t border-slate-800 bg-slate-900/40">
          <div className="max-w-screen-xl mx-auto px-6 py-2 flex items-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Database className="h-3 w-3 text-amber-600" />
              <span className="font-semibold text-slate-300">{docs.length}</span> documents
            </span>
            <span className="flex items-center gap-1.5">
              <FolderOpen className="h-3 w-3 text-slate-600" />
              <span className="font-semibold text-slate-300">{subjects.length}</span> subjects
            </span>
            <span className="flex items-center gap-1.5">
              <Tag className="h-3 w-3 text-slate-600" />
              <span className="font-semibold text-slate-300">{docTypes.length}</span> document types
            </span>
            {lastUpdated && (
              <span className="flex items-center gap-1.5 ml-auto">
                <Clock className="h-3 w-3" />
                Last updated {formatDate(lastUpdated)}
              </span>
            )}
            {filtered.length !== docs.length && (
              <span className="text-amber-500 font-semibold">{filtered.length} matching filter</span>
            )}
          </div>
        </div>
      </header>

      {/* ── Main body ── */}
      <div className="flex flex-1 max-w-screen-xl mx-auto w-full px-6 py-6 gap-6 min-h-0">

        {/* Sidebar */}
        <aside className="w-52 shrink-0 space-y-5">
          {/* Back link */}
          <Link href="/research/knowledge-systems" data-testid="link-back-knowledge-systems">
            <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
              <ArrowLeft className="h-3 w-3" /> Knowledge Systems
            </button>
          </Link>

          {/* Subject filter */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Subject</p>
            <div className="space-y-0.5">
              <button
                onClick={() => setSelectedSubject("All")}
                className={`w-full text-left flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors ${selectedSubject === "All" ? "bg-amber-700/20 text-amber-400 font-semibold" : "text-slate-400 hover:bg-slate-800 hover:text-slate-300"}`}
                data-testid="filter-subject-all"
              >
                <span>All Subjects</span>
                <span className="font-mono text-slate-500">{docs.length}</span>
              </button>
              {subjects.map(([subj, count]) => {
                const colors = SUBJECT_COLORS[subj] || SUBJECT_COLORS["General"];
                return (
                  <button
                    key={subj}
                    onClick={() => setSelectedSubject(subj)}
                    className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${selectedSubject === subj ? "bg-slate-800 text-slate-100 font-semibold" : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-300"}`}
                    data-testid={`filter-subject-${subj.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <span className={`w-2 h-2 rounded-full shrink-0 ${colors.dot}`} />
                    <span className="flex-1 truncate">{subj}</span>
                    <span className="font-mono text-slate-600 shrink-0">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Doc type filter */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Document Type</p>
            <div className="space-y-0.5">
              <button
                onClick={() => setSelectedDocType("All")}
                className={`w-full text-left flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors ${selectedDocType === "All" ? "bg-amber-700/20 text-amber-400 font-semibold" : "text-slate-400 hover:bg-slate-800 hover:text-slate-300"}`}
                data-testid="filter-doctype-all"
              >
                <span>All Types</span>
              </button>
              {docTypes.map(type => {
                const Icon = getIcon(type);
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedDocType(type)}
                    className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${selectedDocType === type ? "bg-slate-800 text-slate-100 font-semibold" : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-300"}`}
                    data-testid={`filter-doctype-${type.toLowerCase()}`}
                  >
                    <Icon className="h-3 w-3 shrink-0 text-slate-500" />
                    <span>{type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset filters */}
          {(selectedSubject !== "All" || selectedDocType !== "All" || search) && (
            <button
              onClick={() => { setSelectedSubject("All"); setSelectedDocType("All"); setSearch(""); }}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors"
              data-testid="button-reset-filters"
            >
              <X className="h-3 w-3" /> Clear all filters
            </button>
          )}
        </aside>

        {/* Document area */}
        <div className="flex flex-1 gap-4 min-w-0">

          {/* Doc grid / list */}
          <div className={`flex-1 min-w-0 ${selectedDoc ? "max-w-[60%]" : ""}`}>
            {isLoading ? (
              <div className="flex items-center justify-center py-20 text-slate-500 text-sm gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Loading repository…
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-2" data-testid="empty-state-kms">
                <Database className="h-8 w-8 opacity-30" />
                <p className="text-sm font-semibold">No documents found</p>
                {(search || selectedSubject !== "All" || selectedDocType !== "All") && (
                  <button
                    onClick={() => { setSelectedSubject("All"); setSelectedDocType("All"); setSearch(""); }}
                    className="text-xs text-amber-500 hover:text-amber-400 underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3" data-testid="grid-kms-docs">
                {filtered.map(doc => (
                  <DocCard
                    key={doc.id}
                    doc={doc}
                    onClick={() => setSelectedDoc(prev => prev?.id === doc.id ? null : doc)}
                    selected={selectedDoc?.id === doc.id}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-1.5" data-testid="list-kms-docs">
                {filtered.map(doc => {
                  const Icon = getIcon(doc.docType);
                  const colors = SUBJECT_COLORS[doc.subject] || SUBJECT_COLORS["General"];
                  return (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDoc(prev => prev?.id === doc.id ? null : doc)}
                      data-testid={`row-kms-doc-${doc.id}`}
                      className={`w-full text-left flex items-center gap-4 px-4 py-2.5 rounded border transition-all hover:border-slate-500 ${
                        selectedDoc?.id === doc.id
                          ? "border-amber-600 bg-slate-800/80"
                          : "border-slate-800 bg-slate-900/40 hover:bg-slate-800/60"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 border ${colors.bg} ${colors.border}`}>
                        <Icon className={`h-3.5 w-3.5 ${colors.text}`} />
                      </div>
                      <span className={`text-xs px-1.5 py-0.5 rounded border font-semibold shrink-0 ${colors.bg} ${colors.text} ${colors.border}`}>
                        {doc.docType}
                      </span>
                      <span className="text-sm font-semibold text-slate-200 flex-1 truncate">{formatStandardName(doc.standardName)}</span>
                      <span className="text-xs text-slate-500 shrink-0">{doc.department}</span>
                      <span className="text-xs text-slate-600 shrink-0">{formatDate(doc.approvedAt)}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selectedDoc && (
            <div className="w-80 shrink-0" data-testid="panel-doc-detail">
              <DocDetailPanel doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/40 py-3 shrink-0">
        <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-between text-xs text-slate-600">
          <span>Meridian Industrial Group — Knowledge Repository v2.0 · Governed by MIG-REF-KM-Taxonomy-2025-001</span>
          <span className="flex items-center gap-3">
            <Link href="/research/knowledge-systems" className="hover:text-slate-400 transition-colors">Case Studies</Link>
            <Link href="/research/knowledge-systems/demo" className="hover:text-slate-400 transition-colors">Ingestion Pipeline</Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
