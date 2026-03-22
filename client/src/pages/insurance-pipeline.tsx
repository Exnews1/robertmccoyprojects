import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Upload, FileText, CheckCircle, XCircle, Edit3, Eye, Loader2, RotateCcw, ChevronDown, ChevronUp, Building2, Shield, Clock, Activity, AlertTriangle, UserCheck, LogOut, Mail } from "lucide-react";

// ── Insurance taxonomy constants (mirrors server/insuranceClassification.ts) ──
const DOC_TYPES: { code: string; label: string; phase: string }[] = [
  { code: "APP", label: "Application",               phase: "Submission" },
  { code: "LRN", label: "Loss Run",                  phase: "Submission" },
  { code: "FIN", label: "Financial Statement",        phase: "Submission" },
  { code: "SOV", label: "Statement of Values",        phase: "Submission" },
  { code: "UWS", label: "Underwriting Submission",    phase: "Submission" },
  { code: "BND", label: "Binder",                     phase: "Binding & Policy" },
  { code: "DEC", label: "Declarations Page",          phase: "Binding & Policy" },
  { code: "END", label: "Endorsement",                phase: "Binding & Policy" },
  { code: "FRM", label: "Coverage Form",              phase: "Binding & Policy" },
  { code: "QTE", label: "Quote/Proposal",             phase: "Binding & Policy" },
  { code: "COI", label: "Certificate of Insurance",   phase: "Servicing" },
  { code: "AUD", label: "Audit Worksheet",            phase: "Servicing" },
  { code: "PFA", label: "Premium Finance Agreement",  phase: "Servicing" },
  { code: "CAN", label: "Cancellation Notice",        phase: "Servicing" },
  { code: "RNW", label: "Renewal Notice",             phase: "Servicing" },
  { code: "INV", label: "Invoice/Statement",          phase: "Servicing" },
  { code: "FNL", label: "First Notice of Loss",       phase: "Claims" },
  { code: "ADJ", label: "Adjuster Report",            phase: "Claims" },
  { code: "RSV", label: "Reserve Letter",             phase: "Claims" },
  { code: "STL", label: "Settlement Agreement",       phase: "Claims" },
  { code: "SUB", label: "Subrogation",                phase: "Claims" },
  { code: "SLF", label: "Surplus Lines Filing",       phase: "Compliance & Admin" },
  { code: "COM", label: "Commission Statement",       phase: "Compliance & Admin" },
  { code: "AGR", label: "Agency Agreement",           phase: "Compliance & Admin" },
  { code: "COR", label: "Correspondence",             phase: "Compliance & Admin" },
  { code: "LIC", label: "License/Certification",      phase: "Compliance & Admin" },
];

const POLICY_LINES = [
  { code: "GL",   label: "General Liability" },
  { code: "PROP", label: "Commercial Property" },
  { code: "AUTO", label: "Commercial Auto" },
  { code: "WC",   label: "Workers Compensation" },
  { code: "UMBR", label: "Umbrella/Excess" },
  { code: "EPLI", label: "Employment Practices" },
  { code: "DO",   label: "Directors & Officers" },
  { code: "CYBER",label: "Cyber Liability" },
  { code: "PL",   label: "Professional Liability" },
  { code: "BOP",  label: "Business Owners Policy" },
  { code: "BOND", label: "Surety Bond" },
  { code: "IM",   label: "Inland Marine" },
];

const LIFECYCLE_PHASES = [
  "Submission", "Binding & Policy", "Servicing", "Claims", "Compliance & Admin",
];

const POLICY_PERIODS = [
  "2020-2021","2021-2022","2022-2023","2023-2024","2024-2025","2025-2026","2026-2027",
];

const SESSION_KEY = "insurance-pipeline-session";

function genSessionId() {
  return "ins-" + Math.random().toString(36).slice(2, 10) + "-" + Date.now().toString(36);
}

type Operator = {
  operatorId: string; fullName: string; title: string;
  role: string; licenseNumber: string | null; avatarInitials: string | null;
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN:    "bg-red-900/50 text-red-300 border-red-800",
  APPROVER: "bg-violet-900/50 text-violet-300 border-violet-800",
  OPERATOR: "bg-sky-900/50 text-sky-300 border-sky-800",
  VIEWER:   "bg-slate-800 text-slate-400 border-slate-700",
};

const PHASE_COLORS: Record<string, string> = {
  "Submission":         "bg-sky-900/60 text-sky-300 border border-sky-800",
  "Binding & Policy":   "bg-violet-900/60 text-violet-300 border border-violet-800",
  "Servicing":          "bg-amber-900/60 text-amber-300 border border-amber-800",
  "Claims":             "bg-red-900/60 text-red-300 border border-red-800",
  "Compliance & Admin": "bg-emerald-900/60 text-emerald-300 border border-emerald-800",
};
const LINE_COLORS: Record<string, string> = {
  GL: "text-blue-400", PROP: "text-green-400", AUTO: "text-yellow-400",
  WC: "text-orange-400", UMBR: "text-purple-400", EPLI: "text-pink-400",
  DO: "text-indigo-400", CYBER: "text-cyan-400", PL: "text-teal-400",
  BOP: "text-lime-400", BOND: "text-amber-400", IM: "text-rose-400",
};

type StagedDoc = {
  id: number; sessionId: string; filename: string; filePath: string | null;
  docType: string | null; docTypeLabel: string | null; lifecyclePhase: string | null;
  policyLine: string | null; policyPeriod: string | null; namedInsured: string | null;
  policyNumber: string | null; carrierName: string | null; premium: string | null;
  claimNumber: string | null; effectiveDate: string | null; expirationDate: string | null;
  confidence: number | null; reasoning: string | null; aiStatus: string | null;
  stagedAt: string | null;
};
type AuditEntry = { id: number; actor: string; action: string; details: string; ts: string };

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color = pct >= 90 ? "bg-emerald-500" : pct >= 75 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-slate-400 w-8 text-right">{pct}%</span>
    </div>
  );
}

function EditModal({ doc, onClose, sessionId, operator }: { doc: StagedDoc; onClose: () => void; sessionId: string; operator: Operator | null }) {
  const qc = useQueryClient();
  const [docTypeCode, setDocTypeCode] = useState(doc.docType || "");
  const [policyLine, setPolicyLine] = useState(doc.policyLine || "");
  const [policyPeriod, setPolicyPeriod] = useState(doc.policyPeriod || "");
  const [namedInsured, setNamedInsured] = useState(doc.namedInsured || "");
  const [policyNumber, setPolicyNumber] = useState(doc.policyNumber || "");
  const [carrierName, setCarrierName] = useState(doc.carrierName || "");
  const [premium, setPremium] = useState(doc.premium || "");
  const [claimNumber, setClaimNumber] = useState(doc.claimNumber || "");
  const [effectiveDate, setEffectiveDate] = useState(doc.effectiveDate || "");
  const [expirationDate, setExpirationDate] = useState(doc.expirationDate || "");
  const [saving, setSaving] = useState(false);

  // When doc type changes, auto-fill label and phase
  const selectedDocType = DOC_TYPES.find(d => d.code === docTypeCode);

  const aiProposed = {
    docType: doc.docType || "",
    policyLine: doc.policyLine || "",
    policyPeriod: doc.policyPeriod || "",
  };

  const save = async () => {
    setSaving(true);
    try {
      await apiRequest("PATCH", `/api/insurance/staging/${doc.id}`, {
        docType: docTypeCode,
        docTypeLabel: selectedDocType?.label || doc.docTypeLabel || "",
        lifecyclePhase: selectedDocType?.phase || doc.lifecyclePhase || "",
        policyLine,
        policyPeriod,
        namedInsured,
        policyNumber,
        carrierName,
        premium,
        claimNumber,
        effectiveDate,
        expirationDate,
      }, {
        "x-session-id": sessionId,
        ...(operator ? { "x-operator-id": operator.operatorId, "x-operator-name": operator.fullName, "x-operator-role": operator.role } : {}),
      });
      qc.invalidateQueries({ queryKey: ["/api/insurance/staging", sessionId] });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const selectCls = "w-full bg-slate-800 border border-slate-600 rounded px-2 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 appearance-none cursor-pointer";
  const inputCls  = "w-full bg-slate-800 border border-slate-600 rounded px-2 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 placeholder-slate-600";
  const labelCls  = "block text-xs font-semibold text-slate-400 mb-1.5";

  const pdfSrc = doc.filePath || null;

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-3">
      <div className="bg-slate-900 border border-slate-700 rounded-lg w-full shadow-2xl flex flex-col"
           style={{ maxWidth: "min(1400px, 96vw)", height: "min(92vh, 900px)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-700 shrink-0">
          <div>
            <h3 className="font-semibold text-slate-100">Human-in-the-Loop: Modify Classification</h3>
            <p className="text-xs text-slate-500 mt-0.5">Review the source document and correct the AI's proposed classification before filing</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 text-lg px-1">✕</button>
        </div>

        {/* Filename + AI badge */}
        <div className="px-5 py-2.5 bg-slate-800/60 border-b border-slate-700 flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-400 font-mono truncate">{doc.filename}</span>
          <span className="text-xs px-2 py-0.5 rounded border bg-sky-900/50 text-sky-400 border-sky-800 shrink-0">
            AI Proposed · {doc.confidence ? Math.round(doc.confidence * 100) : "—"}% confidence
          </span>
        </div>

        {/* Body: two-panel split */}
        <div className="flex flex-1 min-h-0">

          {/* ── Left: form ── */}
          <div className="w-96 shrink-0 flex flex-col border-r border-slate-700 overflow-y-auto">
            <div className="p-5 space-y-5">

          {/* ── Section 1: Document Classification ── */}
          <div>
            <div className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="flex-1 border-t border-amber-900/60" />
              Document Classification
              <span className="flex-1 border-t border-amber-900/60" />
            </div>

            {/* Document Type — full-width dropdown grouped by phase */}
            <div className="mb-3">
              <label className={labelCls}>
                Document Type
                {aiProposed.docType && (
                  <span className="ml-2 font-normal text-sky-500">AI: {aiProposed.docType} — {DOC_TYPES.find(d => d.code === aiProposed.docType)?.label}</span>
                )}
              </label>
              <select
                value={docTypeCode}
                onChange={e => setDocTypeCode(e.target.value)}
                className={selectCls}
                data-testid="select-doc-type"
              >
                <option value="">— Select document type —</option>
                {["Submission", "Binding & Policy", "Servicing", "Claims", "Compliance & Admin"].map(phase => (
                  <optgroup key={phase} label={`── ${phase} ──`}>
                    {DOC_TYPES.filter(d => d.phase === phase).map(d => (
                      <option key={d.code} value={d.code}>{d.code} — {d.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {selectedDocType && (
                <div className="mt-1.5 flex gap-2 text-xs">
                  <span className="text-slate-500">Phase:</span>
                  <span className="text-slate-300">{selectedDocType.phase}</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Section 2: Policy Details ── */}
          <div>
            <div className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="flex-1 border-t border-amber-900/60" />
              Policy Details
              <span className="flex-1 border-t border-amber-900/60" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Policy Line dropdown */}
              <div>
                <label className={labelCls}>
                  Policy Line
                  {aiProposed.policyLine && <span className="ml-2 font-normal text-sky-500">AI: {aiProposed.policyLine}</span>}
                </label>
                <select
                  value={policyLine}
                  onChange={e => setPolicyLine(e.target.value)}
                  className={selectCls}
                  data-testid="select-policy-line"
                >
                  <option value="">— Select policy line —</option>
                  {POLICY_LINES.map(l => (
                    <option key={l.code} value={l.code}>{l.code} — {l.label}</option>
                  ))}
                </select>
              </div>

              {/* Policy Period dropdown */}
              <div>
                <label className={labelCls}>
                  Policy Period
                  {aiProposed.policyPeriod && <span className="ml-2 font-normal text-sky-500">AI: {aiProposed.policyPeriod}</span>}
                </label>
                <select
                  value={policyPeriod}
                  onChange={e => setPolicyPeriod(e.target.value)}
                  className={selectCls}
                  data-testid="select-policy-period"
                >
                  <option value="">— Select period —</option>
                  {POLICY_PERIODS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Named Insured — free text */}
              <div className="col-span-2">
                <label className={labelCls}>Named Insured (Client)</label>
                <input
                  value={namedInsured}
                  onChange={e => setNamedInsured(e.target.value)}
                  placeholder="e.g. Acme Manufacturing Inc"
                  className={inputCls}
                  data-testid="input-named-insured"
                />
              </div>

              {/* Policy Number */}
              <div>
                <label className={labelCls}>Policy Number</label>
                <input
                  value={policyNumber}
                  onChange={e => setPolicyNumber(e.target.value)}
                  placeholder="e.g. POL-GL-2025-001"
                  className={inputCls}
                  data-testid="input-policy-number"
                />
              </div>

              {/* Carrier */}
              <div>
                <label className={labelCls}>Carrier / Insurer</label>
                <input
                  value={carrierName}
                  onChange={e => setCarrierName(e.target.value)}
                  placeholder="e.g. Hartford, Travelers, Cincinnati"
                  className={inputCls}
                  data-testid="input-carrier"
                />
              </div>

              {/* Effective Date */}
              <div>
                <label className={labelCls}>Effective Date</label>
                <input
                  type="date"
                  value={effectiveDate}
                  onChange={e => setEffectiveDate(e.target.value)}
                  className={inputCls}
                  data-testid="input-effective-date"
                />
              </div>

              {/* Expiration Date */}
              <div>
                <label className={labelCls}>Expiration Date</label>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={e => setExpirationDate(e.target.value)}
                  className={inputCls}
                  data-testid="input-expiration-date"
                />
              </div>
            </div>
          </div>

          {/* ── Section 3: Financial / Claims (optional) ── */}
          <div>
            <div className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="flex-1 border-t border-amber-900/60" />
              Financial & Claims (if applicable)
              <span className="flex-1 border-t border-amber-900/60" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Premium</label>
                <input
                  value={premium}
                  onChange={e => setPremium(e.target.value)}
                  placeholder="e.g. $12,500"
                  className={inputCls}
                  data-testid="input-premium"
                />
              </div>
              <div>
                <label className={labelCls}>Claim Number</label>
                <input
                  value={claimNumber}
                  onChange={e => setClaimNumber(e.target.value)}
                  placeholder="e.g. CLM-2025-0042"
                  className={inputCls}
                  data-testid="input-claim-number"
                />
              </div>
            </div>
          </div>

          {/* Filing path preview */}
          {(namedInsured || policyLine || policyPeriod || docTypeCode) && (
            <div className="rounded-lg bg-slate-800/60 border border-slate-700 px-4 py-3">
              <div className="text-xs text-slate-500 mb-2 font-semibold">Filing Path Preview</div>
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                {[namedInsured || "Client", policyLine || "Line", policyPeriod || "Period", docTypeCode || "Type"].map((seg, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-slate-600">›</span>}
                    <span className={`px-2 py-0.5 rounded border ${seg === "Client" || seg === "Line" || seg === "Period" || seg === "Type" ? "border-slate-700 text-slate-600" : "bg-slate-700 border-slate-600 text-slate-200"}`}>
                      {seg}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
            </div>{/* /p-5 space-y-5 */}

            {/* Footer — sticky inside left panel */}
            <div className="mt-auto shrink-0 flex gap-2 justify-between items-center px-5 py-3.5 border-t border-slate-700 bg-slate-900/90">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <AlertTriangle className="h-3 w-3" />
                Save to staging first, then Approve to file
              </div>
              <div className="flex gap-2">
                <button onClick={onClose} className="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-200 border border-slate-700 rounded transition-colors">
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="px-4 py-1.5 text-sm bg-amber-700 hover:bg-amber-600 text-white rounded transition-colors disabled:opacity-50 font-medium"
                  data-testid="button-save-classification"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </div>{/* /left panel */}

          {/* ── Right: Document review panel ── */}
          <div className="flex-1 flex flex-col bg-slate-950 min-w-0 border-l border-slate-800">
            <div className="px-4 py-2 border-b border-slate-800 flex items-center gap-2 shrink-0">
              <FileText className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Document Review</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
              {pdfSrc ? (
                <>
                  {/* Document icon */}
                  <div className="w-20 h-24 bg-slate-800 border border-slate-700 rounded-sm flex flex-col items-center justify-center relative shadow-lg">
                    <div className="absolute top-0 right-0 w-5 h-5 bg-slate-950 border-l border-b border-slate-700" style={{ borderRadius: "0 0 0 4px" }} />
                    <FileText className="h-8 w-8 text-amber-500/70 mt-2" />
                  </div>

                  {/* Filename */}
                  <div className="text-center max-w-xs">
                    <div className="text-sm font-mono text-slate-300 break-all leading-relaxed">{doc.filename}</div>
                    <div className="mt-2 flex flex-wrap justify-center gap-2 text-xs">
                      {doc.docTypeLabel && <span className="px-2 py-0.5 bg-amber-900/40 border border-amber-800 text-amber-300 rounded">{doc.docTypeLabel}</span>}
                      {doc.policyLine && <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 rounded">{doc.policyLine}</span>}
                      {doc.namedInsured && <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 rounded">{doc.namedInsured}</span>}
                    </div>
                  </div>

                  {/* Open button */}
                  <a
                    href={pdfSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium rounded transition-colors shadow"
                  >
                    <FileText className="h-4 w-4" />
                    Open Document to Review ↗
                  </a>

                  <p className="text-xs text-slate-600 text-center max-w-48">
                    Opens in a new tab for full-resolution review. Return here to complete the classification.
                  </p>
                </>
              ) : (
                <>
                  <FileText className="h-12 w-12 text-slate-700" />
                  <div className="text-sm text-slate-600">No document path available</div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


function StagingCard({ doc, sessionId, onApprove, onReject, operator }: {
  doc: StagedDoc; sessionId: string; operator: Operator | null;
  onApprove: (id: number) => void; onReject: (id: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const qc = useQueryClient();

  const pending = doc.aiStatus === "pending";
  const failed = doc.aiStatus === "failed";

  const handleApprove = async () => {
    setActionLoading(true);
    try { await onApprove(doc.id); } finally { setActionLoading(false); }
  };
  const handleReject = async () => {
    setActionLoading(true);
    try { await onReject(doc.id); } finally { setActionLoading(false); }
  };

  const phaseClass = PHASE_COLORS[doc.lifecyclePhase || ""] || "bg-slate-800 text-slate-400 border border-slate-700";
  const lineColor = LINE_COLORS[doc.policyLine || ""] || "text-slate-400";

  return (
    <>
      {editing && <EditModal doc={doc} onClose={() => setEditing(false)} sessionId={sessionId} operator={operator} />}

      <div className={`bg-slate-900 border rounded-lg overflow-hidden transition-all ${pending ? "border-slate-700/50 opacity-75" : failed ? "border-red-800/60" : "border-slate-700"}`} data-testid={`card-staged-${doc.id}`}>
        {/* Top bar */}
        <div className="px-4 py-3 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded font-mono font-semibold ${phaseClass}`}>
                {doc.docType || "?"}
              </span>
              <span className="text-sm font-medium text-slate-200 truncate">{doc.docTypeLabel || "Classifying…"}</span>
              {pending && <Loader2 className="h-3.5 w-3.5 text-sky-400 animate-spin shrink-0" />}
              {failed && <span className="text-xs text-red-400">AI failed</span>}
            </div>
            <div className="text-xs text-slate-500 mt-0.5 font-mono truncate">{doc.filename}</div>
          </div>
          <button onClick={() => setExpanded(p => !p)} className="text-slate-500 hover:text-slate-300 shrink-0 mt-0.5">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {/* Meta row */}
        <div className="px-4 pb-3 flex items-center gap-4 text-xs text-slate-400 flex-wrap">
          {doc.namedInsured && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{doc.namedInsured}</span>}
          {doc.policyLine && <span className={`font-semibold ${lineColor}`}>{doc.policyLine}</span>}
          {doc.policyPeriod && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{doc.policyPeriod}</span>}
        </div>

        {/* Confidence */}
        <div className="px-4 pb-3">
          <ConfidenceBar value={doc.confidence || 0} />
        </div>

        {/* Expanded fields */}
        {expanded && (
          <div className="px-4 pb-3 border-t border-slate-800 pt-3 grid grid-cols-2 gap-2 text-xs">
            {[
              ["Policy #", doc.policyNumber], ["Carrier", doc.carrierName],
              ["Premium", doc.premium], ["Claim #", doc.claimNumber],
              ["Effective", doc.effectiveDate], ["Expiration", doc.expirationDate],
              ["Lifecycle Phase", doc.lifecyclePhase],
            ].map(([label, val]) => val ? (
              <div key={label as string}>
                <div className="text-slate-500">{label}</div>
                <div className="text-slate-300">{val}</div>
              </div>
            ) : null)}
            {doc.reasoning && (
              <div className="col-span-2">
                <div className="text-slate-500">AI Reasoning</div>
                <div className="text-slate-400 italic">{doc.reasoning}</div>
              </div>
            )}
          </div>
        )}

        {/* Action bar */}
        <div className="px-4 pb-3 flex items-center gap-2 flex-wrap">
          <a
            href={doc.filePath || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 bg-sky-900/30 border border-sky-800 px-2.5 py-1.5 rounded transition-colors"
            data-testid={`button-view-${doc.id}`}
          >
            <Eye className="h-3 w-3" /> View PDF ↗
          </a>
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 bg-amber-900/30 border border-amber-800 px-2.5 py-1.5 rounded transition-colors"
            data-testid={`button-modify-${doc.id}`}
          >
            <Edit3 className="h-3 w-3" /> Modify
          </button>
          <div className="ml-auto flex gap-1.5">
            <button
              onClick={handleReject}
              disabled={actionLoading}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 bg-red-900/30 border border-red-800 px-2.5 py-1.5 rounded transition-colors disabled:opacity-40"
              data-testid={`button-reject-${doc.id}`}
            >
              <XCircle className="h-3 w-3" /> Reject
            </button>
            <button
              onClick={handleApprove}
              disabled={actionLoading}
              className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-900/30 border border-emerald-800 px-2.5 py-1.5 rounded transition-colors disabled:opacity-40"
              data-testid={`button-approve-${doc.id}`}
            >
              <CheckCircle className="h-3 w-3" /> Approve
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function InsurancePipeline() {
  const [, setLocation] = useLocation();
  const [sessionId] = useState(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) return stored;
    const id = genSessionId();
    localStorage.setItem(SESSION_KEY, id);
    return id;
  });

  const [operator, setOperator] = useState<Operator | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    fetch("/api/insurance/auth/session")
      .then(r => {
        if (r.status === 401) {
          setLocation("/research/knowledge-systems/insurance/login?redirect=/research/knowledge-systems/insurance/demo");
          return null;
        }
        return r.json();
      })
      .then(data => {
        if (data?.operator) setOperator(data.operator);
        setAuthLoading(false);
      })
      .catch(() => setLocation("/research/knowledge-systems/insurance/login"));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/insurance/auth/logout", { method: "POST" });
    setLocation("/research/knowledge-systems/insurance/login");
  };

  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<"staging" | "repository" | "audit">("staging");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [pollingAI, setPollingAI] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const headers = {
    "x-session-id": sessionId,
    ...(operator ? { "x-operator-id": operator.operatorId, "x-operator-name": operator.fullName, "x-operator-role": operator.role } : {}),
  };

  const { data: stagingData, refetch: refetchStaging } = useQuery<{ data: StagedDoc[] }>({
    queryKey: ["/api/insurance/staging", sessionId],
    queryFn: () => fetch(`/api/insurance/staging?session_id=${sessionId}`).then(r => r.json()),
    refetchInterval: pollingAI ? 2000 : false,
  });

  const { data: batchData, refetch: refetchBatch } = useQuery<{ total: number; classified: number; pending: number; done: boolean }>({
    queryKey: ["/api/insurance/batch/status", sessionId],
    queryFn: () => fetch(`/api/insurance/batch/status?session_id=${sessionId}`).then(r => r.json()),
    refetchInterval: pollingAI ? 2000 : false,
    enabled: pollingAI,
  });

  const { data: repoData } = useQuery<{ data: any[] }>({
    queryKey: ["/api/insurance/repository", sessionId],
    queryFn: () => fetch(`/api/insurance/repository?session_id=${sessionId}`).then(r => r.json()),
    refetchInterval: pollingAI ? 3000 : false,
  });

  const { data: auditData } = useQuery<{ data: AuditEntry[] }>({
    queryKey: ["/api/insurance/audit", sessionId],
    queryFn: () => fetch(`/api/insurance/audit?session_id=${sessionId}`).then(r => r.json()),
    refetchInterval: pollingAI ? 3000 : false,
  });

  // Stop polling when AI is done
  useEffect(() => {
    if (pollingAI && batchData?.done) {
      setPollingAI(false);
    }
  }, [batchData, pollingAI]);

  const staged = stagingData?.data || [];
  const repo = repoData?.data || [];
  const audit = auditData?.data || [];

  const uploadZip = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".zip")) {
      setUploadMsg("Please upload a .zip file containing PDFs.");
      return;
    }
    setUploading(true);
    setUploadMsg("Uploading ZIP and extracting PDFs…");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/insurance/upload-zip", {
        method: "POST",
        headers: { "x-session-id": sessionId },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setUploadMsg(`${data.count} documents staged. AI classification running in background…`);
      setPollingAI(true);
      qc.invalidateQueries({ queryKey: ["/api/insurance/staging", sessionId] });
      qc.invalidateQueries({ queryKey: ["/api/insurance/audit", sessionId] });
      setActiveTab("staging");
    } catch (err: any) {
      setUploadMsg("Error: " + err.message);
    } finally {
      setUploading(false);
    }
  }, [sessionId, qc]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadZip(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadZip(file);
    e.target.value = "";
  };

  // Broadcast channel so the KMS portal tab picks up approvals instantly
  const kmsChannel = useRef<BroadcastChannel | null>(null);
  useEffect(() => {
    kmsChannel.current = new BroadcastChannel("insurance-kms-updates");
    return () => kmsChannel.current?.close();
  }, []);

  const handleApprove = async (id: number) => {
    await apiRequest("POST", `/api/insurance/approve/${id}`, {}, headers);
    qc.invalidateQueries({ queryKey: ["/api/insurance/staging", sessionId] });
    qc.invalidateQueries({ queryKey: ["/api/insurance/repository", sessionId] });
    qc.invalidateQueries({ queryKey: ["/api/insurance/audit", sessionId] });
    kmsChannel.current?.postMessage({ type: "approved", sessionId });
  };
  const handleReject = async (id: number) => {
    await apiRequest("POST", `/api/insurance/reject/${id}`, {}, headers);
    qc.invalidateQueries({ queryKey: ["/api/insurance/staging", sessionId] });
    qc.invalidateQueries({ queryKey: ["/api/insurance/audit", sessionId] });
    kmsChannel.current?.postMessage({ type: "rejected", sessionId });
  };

  const handleReset = async () => {
    await fetch(`/api/insurance/reset?session_id=${sessionId}`, { method: "DELETE", headers });
    localStorage.removeItem(SESSION_KEY);
    window.location.reload();
  };

  const pendingCount = staged.filter(d => d.aiStatus === "pending").length;
  const classifiedCount = staged.filter(d => d.aiStatus === "classified").length;
  const totalStaged = staged.length;
  const aiProgress = totalStaged > 0 ? Math.round(((totalStaged - pendingCount) / totalStaged) * 100) : 0;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Verifying session…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">

      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700 px-5 py-3.5 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/research/knowledge-systems">
            <button className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-sm mr-2">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
          </Link>
          <div className="h-4 border-l border-slate-700 mr-1" />
          <Shield className="h-5 w-5 text-amber-500" />
          <div>
            <div className="text-sm font-semibold text-slate-100">Pinnacle Insurance Group</div>
            <div className="text-xs text-amber-600 font-medium tracking-wide">OKS INSURANCE DOCUMENT INGESTION PIPELINE · AI / HUMAN-IN-THE-LOOP</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {operator && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded">
              <div className="w-5 h-5 rounded-full bg-amber-900/60 border border-amber-700 flex items-center justify-center text-xs font-bold text-amber-300">
                {operator.avatarInitials || operator.fullName.slice(0, 2)}
              </div>
              <span className="text-xs text-slate-300 font-medium">{operator.fullName}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded border font-mono ${ROLE_COLORS[operator.role] || ROLE_COLORS.VIEWER}`}>{operator.role}</span>
              <button onClick={handleLogout} className="text-slate-600 hover:text-slate-400 ml-1" title="Sign out">
                <LogOut className="h-3 w-3" />
              </button>
            </div>
          )}
          <Link href="/research/knowledge-systems/insurance">
            <button className="text-xs px-3 py-1.5 bg-amber-900/40 hover:bg-amber-900/60 border border-amber-800 text-amber-300 rounded transition-colors" data-testid="link-kms-portal">
              KMS Portal →
            </button>
          </Link>
          <button onClick={handleReset} className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 px-2 py-1.5 border border-slate-800 rounded">
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>
      </header>

      <div className="flex-1 p-5 space-y-5 max-w-7xl mx-auto w-full">

        {/* Demo arrangement notice */}
        <div className="flex items-start gap-4 bg-slate-900/70 border border-amber-800/50 rounded-lg px-5 py-4">
          <Mail className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-amber-300 mb-0.5">Guided Demo Available</div>
            <div className="text-xs text-slate-400 leading-relaxed">
              This pipeline demo requires a pre-formatted ZIP package of sample P&C insurance documents.
              To run a live walkthrough with real document ingestion, contact{" "}
              <a href="/contact" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">
                Robert McCoy
              </a>{" "}
              to arrange a session — he will provide the sample document set and guide you through the full workflow.
            </div>
          </div>
        </div>

        {/* ZIP Hopper */}
        <div
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => !uploading && fileRef.current?.click()}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragging ? "border-amber-500 bg-amber-900/10" : "border-slate-700 hover:border-slate-500 bg-slate-900/50"
          } ${uploading ? "cursor-not-allowed opacity-75" : ""}`}
          data-testid="drop-zone"
        >
          <input ref={fileRef} type="file" accept=".zip" className="hidden" onChange={onFileChange} />
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
              <div className="text-sm text-amber-400">Processing ZIP…</div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-slate-400">
                <Upload className="h-7 w-7 text-amber-600" />
                <FileText className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <div className="text-base font-semibold text-slate-200">Drop ZIP File Here or Click to Browse</div>
                <div className="text-xs text-slate-500 mt-1">Upload a .zip package of insurance documents (PDFs) · Up to 50 MB</div>
                <div className="text-xs text-amber-700 mt-1">AI will classify each document, then you review and file them</div>
              </div>
            </div>
          )}
        </div>

        {/* Upload feedback */}
        {uploadMsg && (
          <div className={`text-sm rounded px-4 py-2.5 border ${uploadMsg.startsWith("Error") ? "text-red-400 border-red-800 bg-red-900/20" : "text-sky-300 border-sky-800 bg-sky-900/20"}`}>
            {uploadMsg}
          </div>
        )}

        {/* AI classification progress bar */}
        {pollingAI && totalStaged > 0 && (
          <div className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-sky-400 animate-pulse" /> AI Classification in Progress</span>
              <span className="font-mono">{totalStaged - pendingCount} / {totalStaged}</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-600 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${aiProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats strip */}
        {totalStaged > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Staged", value: totalStaged, color: "text-slate-200" },
              { label: "AI Classified", value: classifiedCount, color: "text-sky-400" },
              { label: "Pending AI", value: pendingCount, color: "text-amber-400" },
              { label: "Filed to KMS", value: repo.length, color: "text-emerald-400" },
            ].map(s => (
              <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center">
                <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        {(totalStaged > 0 || repo.length > 0 || audit.length > 0) && (
          <div className="flex gap-1 border-b border-slate-800">
            {[
              { key: "staging", label: `Staging Queue (${totalStaged})` },
              { key: "repository", label: `Filed to KMS (${repo.length})` },
              { key: "audit", label: `Audit Log (${audit.length})` },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 text-sm transition-colors border-b-2 -mb-px ${
                  activeTab === tab.key
                    ? "text-amber-400 border-amber-500"
                    : "text-slate-500 border-transparent hover:text-slate-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Staging queue */}
        {activeTab === "staging" && staged.length > 0 && (
          <div className="space-y-3">
            {staged.map(doc => (
              <StagingCard
                key={doc.id} doc={doc} sessionId={sessionId} operator={operator}
                onApprove={handleApprove} onReject={handleReject}
              />
            ))}
          </div>
        )}

        {activeTab === "staging" && staged.length === 0 && totalStaged === 0 && (
          <div className="text-center py-16 text-slate-600">
            <Upload className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <div>Drop a ZIP file above to begin ingestion</div>
          </div>
        )}

        {activeTab === "staging" && staged.length === 0 && repo.length > 0 && (
          <div className="text-center py-8 text-slate-500 text-sm">All staged documents have been reviewed.</div>
        )}

        {/* Repository */}
        {activeTab === "repository" && (
          <div className="space-y-2">
            {repo.length === 0 ? (
              <div className="text-center py-12 text-slate-600 text-sm">No documents filed yet.</div>
            ) : repo.map((doc: any) => (
              <div key={doc.id} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-900/40 border border-emerald-800 px-1.5 py-0.5 rounded">{doc.docType}</span>
                    <span className="text-sm text-slate-200 truncate">{doc.standardName || doc.filename}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{doc.namedInsured} · {doc.policyLine} · {doc.policyPeriod}</div>
                </div>
                <div className="text-xs text-slate-500 shrink-0">{doc.approvedBy}</div>
              </div>
            ))}
          </div>
        )}

        {/* Audit log */}
        {activeTab === "audit" && (
          <div className="space-y-1.5">
            {audit.length === 0 ? (
              <div className="text-center py-12 text-slate-600 text-sm">No audit entries yet.</div>
            ) : audit.map((entry: AuditEntry) => (
              <div key={entry.id} className="bg-slate-900 border border-slate-800 rounded px-4 py-2.5 flex items-start gap-3 text-xs">
                <span className={`shrink-0 font-mono font-semibold px-1.5 py-0.5 rounded text-xs ${
                  entry.action === "APPROVE" ? "bg-emerald-900/50 text-emerald-400" :
                  entry.action === "REJECT" ? "bg-red-900/50 text-red-400" :
                  entry.action === "MODIFY" ? "bg-amber-900/50 text-amber-400" :
                  "bg-sky-900/50 text-sky-400"
                }`}>{entry.action}</span>
                <span className="text-slate-400 shrink-0">{entry.actor}</span>
                <span className="text-slate-500 flex-1">{entry.details}</span>
                <span className="text-slate-700 shrink-0 font-mono">{new Date(entry.ts).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
