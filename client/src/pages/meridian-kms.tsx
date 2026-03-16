import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Search, X, FileText, Shield, BookOpen, ClipboardList,
  BarChart3, Code2, GraduationCap, FileSignature, Layers,
  CheckCircle2, Clock, Database, ArrowLeft, RefreshCw, ExternalLink,
  User, Calendar, Briefcase, Tag, Percent, FolderOpen, List, LayoutGrid,
  Trash2, AlertTriangle, Loader2, DollarSign, TrendingUp, TrendingDown,
  ChevronUp, ChevronDown as ChevronDownIcon, Filter, Receipt, CreditCard, CheckCheck
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

type KMSDoc = {
  id: number; documentKey: string; originalName: string; standardName: string;
  docType: string; subject: string; department: string; effectiveDate: string | null;
  responsibleParty: string | null; confidence: number | null;
  approvedAt: string; approvedBy: string | null;
};

type FinancialRecord = {
  id: number; invoiceNumber: string; recordType: string; counterparty: string;
  description: string; amount: number; invoiceDate: string; dueDate: string;
  status: string; paidDate: string | null; paymentReference: string | null;
  paymentMethod: string | null; notes: string | null; createdAt: string;
};

// ── Styling maps ─────────────────────────────────────────────────────────────

const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  "Knowledge Management": { bg: "bg-purple-950/60", text: "text-purple-300", border: "border-purple-700/60", dot: "bg-purple-400" },
  "Information Technology": { bg: "bg-violet-950/60", text: "text-violet-300", border: "border-violet-700/60", dot: "bg-violet-400" },
  "Human Resources":       { bg: "bg-blue-950/60",   text: "text-blue-300",   border: "border-blue-700/60",   dot: "bg-blue-400" },
  "Safety":                { bg: "bg-red-950/60",    text: "text-red-300",    border: "border-red-700/60",    dot: "bg-red-400" },
  "Finance":               { bg: "bg-emerald-950/60",text: "text-emerald-300",border: "border-emerald-700/60",dot: "bg-emerald-400" },
  "Quality Assurance":     { bg: "bg-cyan-950/60",   text: "text-cyan-300",   border: "border-cyan-700/60",   dot: "bg-cyan-400" },
  "Legal & Compliance":    { bg: "bg-amber-950/60",  text: "text-amber-300",  border: "border-amber-700/60",  dot: "bg-amber-400" },
  "Operations":            { bg: "bg-slate-800",     text: "text-slate-300",  border: "border-slate-600",     dot: "bg-slate-400" },
  "Procurement":           { bg: "bg-teal-950/60",   text: "text-teal-300",   border: "border-teal-700/60",   dot: "bg-teal-400" },
  "General":               { bg: "bg-gray-800",      text: "text-gray-300",   border: "border-gray-600",      dot: "bg-gray-400" },
};

const DOC_TYPE_ICONS: Record<string, any> = {
  "Policy": Shield, "SOP": ClipboardList, "Reference": BookOpen, "Memo": FileText,
  "Form": Layers, "Report": BarChart3, "Specification": Code2, "Training": GraduationCap,
  "Contract": FileSignature,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getIcon(docType: string) { return DOC_TYPE_ICONS[docType] || FileText; }

function fmtDate(iso: string | null | undefined) {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return iso; }
}

function fmtMoney(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function getYear(iso: string) { return iso ? iso.slice(0, 4) : ""; }

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

function StatusBadge({ status }: { status: string }) {
  if (status === "paid")    return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-700/60 font-semibold"><CheckCheck className="h-3 w-3" />Paid</span>;
  if (status === "open")    return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-700/60 font-semibold"><Clock className="h-3 w-3" />Open</span>;
  if (status === "pending") return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-sky-950/60 text-sky-400 border border-sky-700/60 font-semibold"><Clock className="h-3 w-3" />Pending</span>;
  return <span className="text-xs text-slate-500">{status}</span>;
}

function PayMethodBadge({ method }: { method: string | null }) {
  if (!method) return <span className="text-slate-600">—</span>;
  const cls: Record<string, string> = {
    ACH:   "bg-blue-950/40 text-blue-400 border-blue-700/50",
    Check: "bg-slate-800 text-slate-400 border-slate-600",
    Wire:  "bg-violet-950/40 text-violet-400 border-violet-700/50",
  };
  return <span className={`text-xs px-1.5 py-0.5 rounded border font-mono ${cls[method] || "bg-slate-800 text-slate-400 border-slate-600"}`}>{method}</span>;
}

// ── Doc card ──────────────────────────────────────────────────────────────────

function DocCard({ doc, onClick, selected }: { doc: KMSDoc; onClick: () => void; selected: boolean }) {
  const Icon = getIcon(doc.docType);
  const colors = SUBJECT_COLORS[doc.subject] || SUBJECT_COLORS["General"];
  return (
    <button onClick={onClick} data-testid={`card-kms-doc-${doc.id}`}
      className={`w-full text-left border rounded-lg p-4 transition-all hover:border-slate-500 hover:bg-slate-800/80 focus:outline-none focus:ring-1 focus:ring-amber-600 ${selected ? "border-amber-600 bg-slate-800/80 ring-1 ring-amber-600/30" : "border-slate-700 bg-slate-900/60"}`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded flex items-center justify-center shrink-0 ${colors.bg} ${colors.border} border`}>
          <Icon className={`h-4 w-4 ${colors.text}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span className={`text-xs px-1.5 py-0.5 rounded border font-semibold ${colors.bg} ${colors.text} ${colors.border}`}>{doc.docType}</span>
            <span className="text-xs text-slate-500 font-mono truncate">{doc.documentKey}</span>
          </div>
          <p className="text-sm font-semibold text-slate-100 leading-tight line-clamp-2">{formatStandardName(doc.standardName)}</p>
          <p className="text-xs text-slate-500 font-mono mt-1 truncate">{doc.originalName}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-slate-500 flex items-center gap-1"><Briefcase className="h-3 w-3" />{doc.department}</span>
            <span className="text-xs text-slate-600 flex items-center gap-1"><Calendar className="h-3 w-3" />{fmtDate(doc.approvedAt)}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

// ── Doc detail panel ──────────────────────────────────────────────────────────

function DocDetailPanel({ doc, onClose }: { doc: KMSDoc; onClose: () => void }) {
  const Icon = getIcon(doc.docType);
  const colors = SUBJECT_COLORS[doc.subject] || SUBJECT_COLORS["General"];
  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-700 overflow-y-auto">
      <div className="px-5 py-4 border-b border-slate-700 shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded flex items-center justify-center shrink-0 border ${colors.bg} ${colors.border}`}><Icon className={`h-4 w-4 ${colors.text}`} /></div>
            <div><p className="text-xs text-slate-500 font-mono">{doc.documentKey}</p><p className="text-xs font-semibold text-slate-400">{doc.docType}</p></div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300" data-testid="button-close-doc-detail"><X className="h-4 w-4" /></button>
        </div>
        <h3 className="text-base font-bold text-slate-100 mt-3 leading-tight">{formatStandardName(doc.standardName)}</h3>
        <p className="text-xs text-slate-500 font-mono mt-1 break-all">{doc.originalName}</p>
      </div>
      <div className="px-5 py-4 space-y-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Classification</p>
          <div className="space-y-2.5">
            {[["Doc Type", doc.docType, Tag], ["Subject", doc.subject, FolderOpen], ["Department", doc.department, Briefcase]].map(([label, val, Icon]: any) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <span className="text-xs text-slate-400 w-24 shrink-0">{label}</span>
                <span className="text-xs text-slate-300">{val}</span>
              </div>
            ))}
            {doc.responsibleParty && <div className="flex items-center gap-2"><User className="h-3.5 w-3.5 text-slate-500 shrink-0" /><span className="text-xs text-slate-400 w-24 shrink-0">Responsible</span><span className="text-xs text-slate-300">{doc.responsibleParty}</span></div>}
          </div>
        </div>
        {doc.confidence != null && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2"><span className="flex items-center gap-1.5"><Percent className="h-3 w-3" />Confidence</span></p>
            <ConfidenceBar value={doc.confidence} />
            <p className="text-xs text-slate-600 mt-1">{doc.confidence >= 0.95 ? "Content-based classification" : "Filename-based classification"}</p>
          </div>
        )}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Provenance</p>
          <div className="space-y-2 bg-slate-800/60 border border-slate-700/60 rounded p-3">
            <div className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" /><div><p className="text-xs font-semibold text-slate-300">Approved</p><p className="text-xs text-slate-500">{fmtDate(doc.approvedAt)}</p></div></div>
            <div className="flex items-start gap-2"><User className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" /><div><p className="text-xs font-semibold text-slate-300">Approved By</p><p className="text-xs text-slate-500">{doc.approvedBy || "Operations Manager"}</p></div></div>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Standardized Name</p>
          <div className="bg-slate-800 border border-slate-700 rounded p-2.5"><p className="text-xs font-mono text-amber-400 break-all">{doc.standardName}</p></div>
        </div>
      </div>
    </div>
  );
}

// ── Financial table ───────────────────────────────────────────────────────────

type SortKey = "invoiceDate" | "dueDate" | "amount" | "counterparty" | "status";

function FinancialTable({ records, type }: { records: FinancialRecord[]; type: "AR" | "AP" }) {
  const [sortKey, setSortKey] = useState<SortKey>("invoiceDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<FinancialRecord | null>(null);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  const sorted = useMemo(() => [...records].sort((a, b) => {
    let va: any = a[sortKey], vb: any = b[sortKey];
    if (sortKey === "amount") { va = a.amount; vb = b.amount; }
    if (typeof va === "string" && typeof vb === "string") va = va.toLowerCase(), vb = vb.toLowerCase();
    const cmp = va < vb ? -1 : va > vb ? 1 : 0;
    return sortDir === "asc" ? cmp : -cmp;
  }), [records, sortKey, sortDir]);

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <span className="text-slate-700 ml-1">↕</span>;
    return sortDir === "asc" ? <ChevronUp className="h-3 w-3 inline ml-0.5 text-amber-400" /> : <ChevronDownIcon className="h-3 w-3 inline ml-0.5 text-amber-400" />;
  }

  const paid = records.filter(r => r.status === "paid");
  const open = records.filter(r => r.status !== "paid");
  const paidTotal = paid.reduce((s, r) => s + r.amount, 0);
  const openTotal = open.reduce((s, r) => s + r.amount, 0);

  const isAR = type === "AR";

  return (
    <div className="flex flex-col gap-4">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-950/30 border border-emerald-700/40 rounded-lg p-3">
          <p className="text-xs text-emerald-500 font-semibold uppercase tracking-wide">{isAR ? "Collected" : "Paid"}</p>
          <p className="text-xl font-bold text-emerald-400 mt-1">{fmtMoney(paidTotal)}</p>
          <p className="text-xs text-slate-500 mt-0.5">{paid.length} invoices</p>
        </div>
        <div className={`border rounded-lg p-3 ${isAR ? "bg-amber-950/30 border-amber-700/40" : "bg-sky-950/30 border-sky-700/40"}`}>
          <p className={`text-xs font-semibold uppercase tracking-wide ${isAR ? "text-amber-500" : "text-sky-500"}`}>{isAR ? "Outstanding" : "Pending"}</p>
          <p className={`text-xl font-bold mt-1 ${isAR ? "text-amber-400" : "text-sky-400"}`}>{fmtMoney(openTotal)}</p>
          <p className="text-xs text-slate-500 mt-0.5">{open.length} invoices</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Total Volume</p>
          <p className="text-xl font-bold text-slate-200 mt-1">{fmtMoney(paidTotal + openTotal)}</p>
          <p className="text-xs text-slate-500 mt-0.5">{records.length} total records</p>
        </div>
      </div>

      {/* Table */}
      <div className="border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-800/80 border-b border-slate-700 text-slate-400">
                <th className="text-left px-3 py-2.5 font-semibold cursor-pointer hover:text-slate-200 whitespace-nowrap" onClick={() => handleSort("invoiceDate")}>
                  {isAR ? "Invoice #" : "Voucher #"}
                </th>
                <th className="text-left px-3 py-2.5 font-semibold cursor-pointer hover:text-slate-200 whitespace-nowrap" onClick={() => handleSort("counterparty")}>
                  {isAR ? "Client" : "Vendor"}<SortIcon k="counterparty" />
                </th>
                <th className="text-left px-3 py-2.5 font-semibold">Description</th>
                <th className="text-right px-3 py-2.5 font-semibold cursor-pointer hover:text-slate-200 whitespace-nowrap" onClick={() => handleSort("amount")}>
                  Amount<SortIcon k="amount" />
                </th>
                <th className="text-left px-3 py-2.5 font-semibold cursor-pointer hover:text-slate-200 whitespace-nowrap" onClick={() => handleSort("invoiceDate")}>
                  Invoice Date<SortIcon k="invoiceDate" />
                </th>
                <th className="text-left px-3 py-2.5 font-semibold cursor-pointer hover:text-slate-200 whitespace-nowrap" onClick={() => handleSort("dueDate")}>
                  Due Date<SortIcon k="dueDate" />
                </th>
                <th className="text-left px-3 py-2.5 font-semibold cursor-pointer hover:text-slate-200 whitespace-nowrap" onClick={() => handleSort("status")}>
                  Status<SortIcon k="status" />
                </th>
                <th className="text-left px-3 py-2.5 font-semibold whitespace-nowrap">{isAR ? "Deposit Ref" : "Payment Ref"}</th>
                {!isAR && <th className="text-left px-3 py-2.5 font-semibold">Method</th>}
              </tr>
            </thead>
            <tbody>
              {sorted.map((rec, idx) => (
                <tr
                  key={rec.id}
                  onClick={() => setSelected(sel => sel?.id === rec.id ? null : rec)}
                  data-testid={`row-fin-${rec.id}`}
                  className={`border-b border-slate-800 cursor-pointer transition-colors ${
                    selected?.id === rec.id ? "bg-amber-900/10 border-amber-800/40" :
                    idx % 2 === 0 ? "bg-slate-900/20 hover:bg-slate-800/40" : "hover:bg-slate-800/40"
                  }`}
                >
                  <td className="px-3 py-2 font-mono text-amber-400/80 whitespace-nowrap">{rec.invoiceNumber}</td>
                  <td className="px-3 py-2 text-slate-300 max-w-[180px] truncate">{rec.counterparty}</td>
                  <td className="px-3 py-2 text-slate-400 max-w-[200px] truncate">{rec.description}</td>
                  <td className="px-3 py-2 text-right font-mono font-semibold text-slate-200 whitespace-nowrap">{fmtMoney(rec.amount)}</td>
                  <td className="px-3 py-2 text-slate-400 whitespace-nowrap">{fmtDate(rec.invoiceDate)}</td>
                  <td className="px-3 py-2 text-slate-400 whitespace-nowrap">{fmtDate(rec.dueDate)}</td>
                  <td className="px-3 py-2 whitespace-nowrap"><StatusBadge status={rec.status} /></td>
                  <td className="px-3 py-2 font-mono text-slate-500 whitespace-nowrap">{rec.paymentReference || "—"}</td>
                  {!isAR && <td className="px-3 py-2"><PayMethodBadge method={rec.paymentMethod} /></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expanded detail row */}
      {selected && (
        <div className="border border-amber-700/40 bg-amber-900/10 rounded-lg p-4 text-xs space-y-2" data-testid="panel-financial-detail">
          <div className="flex items-center justify-between mb-1">
            <p className="font-bold text-amber-400 font-mono">{selected.invoiceNumber}</p>
            <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-300"><X className="h-3.5 w-3.5" /></button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div><p className="text-slate-500 uppercase tracking-wide text-[10px] font-semibold">{isAR ? "Client" : "Vendor"}</p><p className="text-slate-200 mt-0.5">{selected.counterparty}</p></div>
            <div><p className="text-slate-500 uppercase tracking-wide text-[10px] font-semibold">Description</p><p className="text-slate-200 mt-0.5">{selected.description}</p></div>
            <div><p className="text-slate-500 uppercase tracking-wide text-[10px] font-semibold">Amount</p><p className="text-slate-200 mt-0.5 font-mono font-bold text-sm">{fmtMoney(selected.amount)}</p></div>
            <div><p className="text-slate-500 uppercase tracking-wide text-[10px] font-semibold">Status</p><div className="mt-0.5"><StatusBadge status={selected.status} /></div></div>
            <div><p className="text-slate-500 uppercase tracking-wide text-[10px] font-semibold">Invoice Date</p><p className="text-slate-200 mt-0.5">{fmtDate(selected.invoiceDate)}</p></div>
            <div><p className="text-slate-500 uppercase tracking-wide text-[10px] font-semibold">Due Date</p><p className="text-slate-200 mt-0.5">{fmtDate(selected.dueDate)}</p></div>
            {selected.paidDate && <div><p className="text-slate-500 uppercase tracking-wide text-[10px] font-semibold">Paid Date</p><p className="text-emerald-400 mt-0.5">{fmtDate(selected.paidDate)}</p></div>}
            {selected.paymentReference && <div><p className="text-slate-500 uppercase tracking-wide text-[10px] font-semibold">Chain of Evidence</p><p className="text-slate-200 font-mono mt-0.5">{selected.paymentReference}</p></div>}
            {selected.paymentMethod && <div><p className="text-slate-500 uppercase tracking-wide text-[10px] font-semibold">Payment Method</p><div className="mt-0.5"><PayMethodBadge method={selected.paymentMethod} /></div></div>}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Portal ───────────────────────────────────────────────────────────────

type Section = "documents" | "ar" | "ap";

export default function MeridianKMS() {
  const [section, setSection] = useState<Section>("documents");
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedDocType, setSelectedDocType] = useState("All");
  const [selectedDoc, setSelectedDoc] = useState<KMSDoc | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [yearFilter, setYearFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  const { data: docsData, isLoading: docsLoading, refetch: refetchDocs, isFetching: docsFetching } = useQuery<{ success: boolean; data: KMSDoc[] }>({
    queryKey: ["/api/meridian/kms"],
    refetchInterval: 10000,
  });
  const { data: arData, isLoading: arLoading } = useQuery<{ success: boolean; data: FinancialRecord[] }>({
    queryKey: ["/api/meridian/kms/financials?type=AR"],
    refetchInterval: false,
  });
  const { data: apData, isLoading: apLoading } = useQuery<{ success: boolean; data: FinancialRecord[] }>({
    queryKey: ["/api/meridian/kms/financials?type=AP"],
    refetchInterval: false,
  });

  const docs = docsData?.data ?? [];
  const arRecords = arData?.data ?? [];
  const apRecords = apData?.data ?? [];

  const handleReset = async () => {
    setResetting(true);
    await fetch("/api/meridian/kms/reset", { method: "DELETE" });
    setSelectedDoc(null); setSearch(""); setSelectedSubject("All"); setSelectedDocType("All");
    setResetConfirm(false); setResetting(false); refetchDocs();
  };

  // Available years across all data
  const docYears = useMemo(() => [...new Set(docs.map(d => d.approvedAt.slice(0, 4)))].sort().reverse(), [docs]);
  const finYears = useMemo(() => {
    const all = [...arRecords, ...apRecords].map(r => r.invoiceDate.slice(0, 4));
    return [...new Set(all)].sort().reverse();
  }, [arRecords, apRecords]);

  const subjects = useMemo(() => {
    const counts: Record<string, number> = {};
    docs.forEach(d => { counts[d.subject] = (counts[d.subject] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [docs]);

  const docTypes = useMemo(() => [...new Set(docs.map(d => d.docType))].sort(), [docs]);

  const filteredDocs = useMemo(() => {
    const q = search.toLowerCase();
    return docs.filter(d => {
      const matchSearch = !q || d.standardName.toLowerCase().includes(q) || d.originalName.toLowerCase().includes(q) || d.department.toLowerCase().includes(q) || d.subject.toLowerCase().includes(q) || d.docType.toLowerCase().includes(q) || d.documentKey.toLowerCase().includes(q);
      const matchSubject = selectedSubject === "All" || d.subject === selectedSubject;
      const matchType = selectedDocType === "All" || d.docType === selectedDocType;
      const matchYear = yearFilter === "All" || d.approvedAt.startsWith(yearFilter);
      return matchSearch && matchSubject && matchType && matchYear;
    });
  }, [docs, search, selectedSubject, selectedDocType, yearFilter]);

  const filteredAR = useMemo(() => {
    return arRecords.filter(r => {
      const matchYear = yearFilter === "All" || r.invoiceDate.startsWith(yearFilter);
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      const matchSearch = !search || r.counterparty.toLowerCase().includes(search.toLowerCase()) || r.invoiceNumber.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
      return matchYear && matchStatus && matchSearch;
    });
  }, [arRecords, yearFilter, statusFilter, search]);

  const filteredAP = useMemo(() => {
    return apRecords.filter(r => {
      const matchYear = yearFilter === "All" || r.invoiceDate.startsWith(yearFilter);
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      const matchSearch = !search || r.counterparty.toLowerCase().includes(search.toLowerCase()) || r.invoiceNumber.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
      return matchYear && matchStatus && matchSearch;
    });
  }, [apRecords, yearFilter, statusFilter, search]);

  const lastUpdated = useMemo(() => {
    if (!docs.length) return null;
    return docs.reduce((l, d) => d.approvedAt > l ? d.approvedAt : l, docs[0].approvedAt);
  }, [docs]);

  const activeYears = section === "documents" ? docYears : finYears;
  const activeStatusOptions = section === "ar" ? ["All", "paid", "open"] : section === "ap" ? ["All", "paid", "pending"] : [];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col" data-testid="page-meridian-kms">

      {/* ── Header ── */}
      <header className="bg-[#0F172A] border-b border-slate-700/80 shrink-0 z-10">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 bg-amber-700 rounded flex items-center justify-center font-bold text-white text-sm font-serif">M</div>
            <div>
              <p className="text-sm font-bold text-white tracking-tight leading-none">Meridian Industrial Group</p>
              <p className="text-xs text-slate-400 leading-none mt-0.5">Knowledge Repository</p>
            </div>
          </div>

          <div className="flex-1 max-w-lg relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
            <input type="text" placeholder="Search documents, invoices, vendors, clients…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-500 text-sm rounded px-3 py-1.5 pl-9 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30"
              data-testid="input-kms-search" />
            {search && <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300" data-testid="button-clear-search"><X className="h-3.5 w-3.5" /></button>}
          </div>

          <div className="flex items-center gap-2 ml-auto shrink-0">
            {section === "documents" && (
              <button onClick={() => setViewMode(v => v === "grid" ? "list" : "grid")} className="p-1.5 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors" title={viewMode === "grid" ? "List view" : "Grid view"} data-testid="button-toggle-view">
                {viewMode === "grid" ? <List className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
              </button>
            )}
            <button onClick={() => refetchDocs()} className={`p-1.5 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors ${docsFetching ? "animate-spin" : ""}`} title="Refresh" data-testid="button-refresh-kms">
              <RefreshCw className="h-4 w-4" />
            </button>
            <div className="w-px h-5 bg-slate-700" />
            {resetConfirm ? (
              <div className="flex items-center gap-1.5 bg-red-950/60 border border-red-700/60 rounded px-2.5 py-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                <span className="text-xs text-red-300 font-semibold">Clear all docs?</span>
                <button onClick={handleReset} disabled={resetting} className="text-xs font-bold text-red-300 hover:text-white bg-red-700/50 hover:bg-red-700 rounded px-2 py-0.5 transition-colors disabled:opacity-50" data-testid="button-confirm-reset-kms">
                  {resetting ? <Loader2 className="h-3 w-3 animate-spin inline" /> : "Confirm"}
                </button>
                <button onClick={() => setResetConfirm(false)} className="text-xs text-slate-500 hover:text-slate-300" data-testid="button-cancel-reset-kms"><X className="h-3.5 w-3.5" /></button>
              </div>
            ) : (
              <button onClick={() => setResetConfirm(true)} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 hover:bg-red-950/30 border border-transparent hover:border-red-800/50 rounded px-2.5 py-1.5 transition-colors" title="Reset KMS for next demo" data-testid="button-reset-kms">
                <Trash2 className="h-3.5 w-3.5" /> Reset for Demo
              </button>
            )}
            <div className="w-px h-5 bg-slate-700" />
            <Link href="/research/knowledge-systems/demo" data-testid="link-ingestion-pipeline">
              <button className="flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400 bg-amber-900/20 hover:bg-amber-900/30 border border-amber-800/50 rounded px-2.5 py-1.5 transition-colors font-semibold">
                <Database className="h-3.5 w-3.5" />Ingestion Pipeline<ExternalLink className="h-3 w-3 opacity-60" />
              </button>
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="border-t border-slate-800 bg-slate-900/40">
          <div className="max-w-screen-xl mx-auto px-6 py-2 flex items-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><Database className="h-3 w-3 text-amber-600" /><span className="font-semibold text-slate-300">{docs.length}</span> documents</span>
            <span className="flex items-center gap-1.5"><TrendingUp className="h-3 w-3 text-emerald-600" /><span className="font-semibold text-slate-300">{arRecords.length}</span> AR records</span>
            <span className="flex items-center gap-1.5"><TrendingDown className="h-3 w-3 text-sky-600" /><span className="font-semibold text-slate-300">{apRecords.length}</span> AP records</span>
            {lastUpdated && <span className="flex items-center gap-1.5 ml-auto"><Clock className="h-3 w-3" />Last updated {fmtDate(lastUpdated)}</span>}
          </div>
        </div>

        {/* Section nav */}
        <div className="border-t border-slate-800 bg-slate-900/20">
          <div className="max-w-screen-xl mx-auto px-6 flex items-center gap-0">
            {([
              { id: "documents", label: "Document Library", icon: FolderOpen, count: docs.length },
              { id: "ar", label: "Accounts Receivable", icon: TrendingUp, count: arRecords.length },
              { id: "ap", label: "Accounts Payable", icon: TrendingDown, count: apRecords.length },
            ] as { id: Section; label: string; icon: any; count: number }[]).map(tab => (
              <button key={tab.id} onClick={() => setSection(tab.id)} data-testid={`tab-section-${tab.id}`}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors ${section === tab.id ? "border-amber-500 text-amber-400" : "border-transparent text-slate-500 hover:text-slate-300"}`}>
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
                <span className={`text-xs font-mono ${section === tab.id ? "text-amber-500" : "text-slate-600"}`}>{tab.count}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main body ── */}
      <div className="flex flex-1 max-w-screen-xl mx-auto w-full px-6 py-6 gap-6 min-h-0">

        {/* Sidebar */}
        <aside className="w-52 shrink-0 space-y-5">
          <Link href="/research/knowledge-systems" data-testid="link-back-knowledge-systems">
            <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"><ArrowLeft className="h-3 w-3" /> Knowledge Systems</button>
          </Link>

          {/* Year filter */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5"><Calendar className="h-3 w-3" />Year</p>
            <div className="space-y-0.5">
              <button onClick={() => setYearFilter("All")} className={`w-full text-left flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors ${yearFilter === "All" ? "bg-amber-700/20 text-amber-400 font-semibold" : "text-slate-400 hover:bg-slate-800 hover:text-slate-300"}`} data-testid="filter-year-all">
                All Years
              </button>
              {activeYears.map(y => (
                <button key={y} onClick={() => setYearFilter(y)} className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${yearFilter === y ? "bg-slate-800 text-slate-100 font-semibold" : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-300"}`} data-testid={`filter-year-${y}`}>
                  <span className="w-2 h-2 rounded-full bg-amber-600/60 shrink-0" />
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* Status filter (financial sections only) */}
          {section !== "documents" && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5"><Filter className="h-3 w-3" />Status</p>
              <div className="space-y-0.5">
                {activeStatusOptions.map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)} className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors capitalize ${statusFilter === s ? "bg-amber-700/20 text-amber-400 font-semibold" : "text-slate-400 hover:bg-slate-800 hover:text-slate-300"}`} data-testid={`filter-status-${s}`}>
                    {s === "All" ? "All Status" : <StatusBadge status={s} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subject filter (documents section only) */}
          {section === "documents" && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Subject</p>
              <div className="space-y-0.5">
                <button onClick={() => setSelectedSubject("All")} className={`w-full text-left flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors ${selectedSubject === "All" ? "bg-amber-700/20 text-amber-400 font-semibold" : "text-slate-400 hover:bg-slate-800 hover:text-slate-300"}`} data-testid="filter-subject-all">
                  <span>All Subjects</span><span className="font-mono text-slate-500">{docs.length}</span>
                </button>
                {subjects.map(([subj, count]) => {
                  const colors = SUBJECT_COLORS[subj] || SUBJECT_COLORS["General"];
                  return (
                    <button key={subj} onClick={() => setSelectedSubject(subj)} className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${selectedSubject === subj ? "bg-slate-800 text-slate-100 font-semibold" : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-300"}`} data-testid={`filter-subject-${subj.toLowerCase().replace(/\s+/g, "-")}`}>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${colors.dot}`} /><span className="flex-1 truncate">{subj}</span><span className="font-mono text-slate-600 shrink-0">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Doc type filter (documents section only) */}
          {section === "documents" && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Document Type</p>
              <div className="space-y-0.5">
                <button onClick={() => setSelectedDocType("All")} className={`w-full text-left flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors ${selectedDocType === "All" ? "bg-amber-700/20 text-amber-400 font-semibold" : "text-slate-400 hover:bg-slate-800 hover:text-slate-300"}`} data-testid="filter-doctype-all">All Types</button>
                {docTypes.map(type => {
                  const Icon = getIcon(type);
                  return <button key={type} onClick={() => setSelectedDocType(type)} className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${selectedDocType === type ? "bg-slate-800 text-slate-100 font-semibold" : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-300"}`} data-testid={`filter-doctype-${type.toLowerCase()}`}><Icon className="h-3 w-3 shrink-0 text-slate-500" /><span>{type}</span></button>;
                })}
              </div>
            </div>
          )}

          {/* Reset filters */}
          {(selectedSubject !== "All" || selectedDocType !== "All" || search || yearFilter !== "All" || statusFilter !== "All") && (
            <button onClick={() => { setSelectedSubject("All"); setSelectedDocType("All"); setSearch(""); setYearFilter("All"); setStatusFilter("All"); }} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors" data-testid="button-reset-filters">
              <X className="h-3 w-3" /> Clear all filters
            </button>
          )}
        </aside>

        {/* Main content */}
        <div className="flex flex-1 gap-4 min-w-0">
          <div className={`flex-1 min-w-0 ${selectedDoc && section === "documents" ? "max-w-[60%]" : ""}`}>

            {/* ── Documents section ── */}
            {section === "documents" && (
              docsLoading ? (
                <div className="flex items-center justify-center py-20 text-slate-500 text-sm gap-2"><RefreshCw className="h-4 w-4 animate-spin" />Loading…</div>
              ) : filteredDocs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-2" data-testid="empty-state-kms"><Database className="h-8 w-8 opacity-30" /><p className="text-sm font-semibold">No documents found</p></div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3" data-testid="grid-kms-docs">
                  {filteredDocs.map(doc => <DocCard key={doc.id} doc={doc} onClick={() => setSelectedDoc(p => p?.id === doc.id ? null : doc)} selected={selectedDoc?.id === doc.id} />)}
                </div>
              ) : (
                <div className="space-y-1.5" data-testid="list-kms-docs">
                  {filteredDocs.map(doc => {
                    const Icon = getIcon(doc.docType);
                    const colors = SUBJECT_COLORS[doc.subject] || SUBJECT_COLORS["General"];
                    return (
                      <button key={doc.id} onClick={() => setSelectedDoc(p => p?.id === doc.id ? null : doc)} data-testid={`row-kms-doc-${doc.id}`}
                        className={`w-full text-left flex items-center gap-4 px-4 py-2.5 rounded border transition-all hover:border-slate-500 ${selectedDoc?.id === doc.id ? "border-amber-600 bg-slate-800/80" : "border-slate-800 bg-slate-900/40 hover:bg-slate-800/60"}`}>
                        <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 border ${colors.bg} ${colors.border}`}><Icon className={`h-3.5 w-3.5 ${colors.text}`} /></div>
                        <span className={`text-xs px-1.5 py-0.5 rounded border font-semibold shrink-0 ${colors.bg} ${colors.text} ${colors.border}`}>{doc.docType}</span>
                        <span className="text-sm font-semibold text-slate-200 flex-1 truncate">{formatStandardName(doc.standardName)}</span>
                        <span className="text-xs text-slate-500 shrink-0">{doc.department}</span>
                        <span className="text-xs text-slate-600 shrink-0">{fmtDate(doc.approvedAt)}</span>
                      </button>
                    );
                  })}
                </div>
              )
            )}

            {/* ── AR section ── */}
            {section === "ar" && (
              arLoading ? <div className="flex items-center justify-center py-20 text-slate-500 text-sm gap-2"><RefreshCw className="h-4 w-4 animate-spin" />Loading AR records…</div>
              : <div data-testid="section-ar"><FinancialTable records={filteredAR} type="AR" /></div>
            )}

            {/* ── AP section ── */}
            {section === "ap" && (
              apLoading ? <div className="flex items-center justify-center py-20 text-slate-500 text-sm gap-2"><RefreshCw className="h-4 w-4 animate-spin" />Loading AP records…</div>
              : <div data-testid="section-ap"><FinancialTable records={filteredAP} type="AP" /></div>
            )}
          </div>

          {/* Doc detail panel */}
          {selectedDoc && section === "documents" && (
            <div className="w-80 shrink-0" data-testid="panel-doc-detail">
              <DocDetailPanel doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/40 py-3 shrink-0">
        <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-between text-xs text-slate-600">
          <span>Meridian Industrial Group — Knowledge Repository v2.0 · MIG-REF-KM-Taxonomy-2025-001</span>
          <span className="flex items-center gap-3">
            <Link href="/research/knowledge-systems" className="hover:text-slate-400 transition-colors">Case Studies</Link>
            <Link href="/research/knowledge-systems/demo" className="hover:text-slate-400 transition-colors">Ingestion Pipeline</Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
