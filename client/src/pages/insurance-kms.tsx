import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Shield, ArrowLeft, Search, ChevronRight, FileText, X, Building2, Calendar, Tag, Percent, Hash, Truck, DollarSign, AlertCircle, ExternalLink, RefreshCw, Filter, Edit3, AlertTriangle, LogOut, History, Clock, Loader2 } from "lucide-react";

const SESSION_KEY = "insurance-pipeline-session";

type Operator = {
  operatorId: string; fullName: string; title: string; role: string;
  licenseNumber: string | null; avatarInitials: string;
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN:    "bg-red-900/50 text-red-300 border-red-700",
  APPROVER: "bg-amber-900/50 text-amber-300 border-amber-700",
  OPERATOR: "bg-sky-900/50 text-sky-300 border-sky-700",
  VIEWER:   "bg-slate-800 text-slate-400 border-slate-600",
};

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

const POLICY_PERIODS = [
  "2020-2021","2021-2022","2022-2023","2023-2024","2024-2025","2025-2026","2026-2027",
];

type RepoDoc = {
  id: number; sessionId: string; filename: string; filePath: string | null;
  standardName: string | null; docType: string; docTypeLabel: string;
  lifecyclePhase: string | null; policyLine: string | null; policyPeriod: string | null;
  namedInsured: string | null; policyNumber: string | null; carrierName: string | null;
  premium: string | null; claimNumber: string | null; effectiveDate: string | null;
  expirationDate: string | null; confidence: number | null;
  approvedAt: string | null; approvedBy: string | null;
};

type MetadataVersion = {
  id: number; fieldName: string; oldValue: string | null; newValue: string | null;
  changedBy: string | null; changedByRole: string | null; reason: string | null; createdAt: string;
};

function DocDetailPanel({ doc, sessionId, onClose, onModify }: {
  doc: RepoDoc; sessionId: string; onClose: () => void; onModify: (doc: RepoDoc) => void;
}) {
  const phaseClass = PHASE_COLORS[doc.lifecyclePhase || ""] || "bg-slate-800 text-slate-400 border-slate-700";
  const pct = doc.confidence ? Math.round(doc.confidence * 100) : 0;
  const confColor = pct >= 90 ? "bg-emerald-500" : pct >= 75 ? "bg-amber-500" : "bg-red-500";

  const { data: versionsData } = useQuery<{ data: MetadataVersion[] }>({
    queryKey: ["/api/insurance/repository", doc.id, "versions"],
    queryFn: () => fetch(`/api/insurance/repository/${doc.id}/versions`, {
      headers: { "x-session-id": sessionId },
    }).then(r => r.json()),
  });
  const versions = versionsData?.data || [];

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

          {/* HiL Modify */}
          <div className="pt-3">
            <button
              onClick={() => onModify(doc)}
              className="flex items-center gap-2 text-xs text-violet-300 hover:text-violet-100 bg-violet-900/30 border border-violet-700 px-3 py-2 rounded w-full justify-center transition-colors"
              data-testid="button-kms-modify"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Modify Record (HiL)
            </button>
          </div>

          {/* Metadata change history — always visible */}
          <div className="pt-3">
            <div className="flex items-center gap-2 mb-2">
              <History className="h-3.5 w-3.5 text-slate-500" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Change History</span>
              {versions.length > 0 && (
                <span className="text-xs font-mono bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-slate-400">{versions.length}</span>
              )}
            </div>
            {versions.length === 0 ? (
              <div className="text-xs text-slate-600 py-3 border border-slate-800 rounded bg-slate-900/50 text-center">
                No metadata changes recorded
              </div>
            ) : (
              <div className="space-y-2">
                {versions.map(v => (
                  <div key={v.id} className="bg-slate-800/40 border border-slate-700 rounded p-3 text-xs space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-violet-300 uppercase tracking-wide">{v.fieldName}</span>
                      {v.changedByRole && (
                        <span className={`px-1.5 py-0.5 rounded border font-mono text-xs ${ROLE_COLORS[v.changedByRole] || ROLE_COLORS.VIEWER}`}>{v.changedByRole}</span>
                      )}
                      {v.changedBy && <span className="text-slate-400">{v.changedBy}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="line-through text-red-400/70">{v.oldValue || "—"}</span>
                      <span className="text-slate-600">→</span>
                      <span className="text-emerald-400 font-medium">{v.newValue || "—"}</span>
                    </div>
                    {v.reason && <div className="text-slate-500 italic border-l-2 border-slate-700 pl-2">"{v.reason}"</div>}
                    <div className="flex items-center gap-1 text-slate-600">
                      <Clock className="h-3 w-3" />
                      {new Date(v.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PDF viewer toggle */}
          {doc.filePath && (
            <div className="pt-2">
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

function KmsModifyModal({ doc, onClose, sessionId, onSaved, operator }: {
  doc: RepoDoc; onClose: () => void; sessionId: string; onSaved: () => void; operator: Operator | null;
}) {
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
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedDocType = DOC_TYPES.find(d => d.code === docTypeCode);
  const docTypeChanged = docTypeCode !== doc.docType;

  const save = async () => {
    if (docTypeChanged && !reason.trim()) return;
    setSaving(true);
    try {
      await apiRequest("PATCH", `/api/insurance/repository/${doc.id}`, {
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
        reason: reason.trim() || undefined,
      }, {
        "x-session-id": sessionId,
        ...(operator ? { "x-operator-id": operator.operatorId, "x-operator-name": operator.fullName, "x-operator-role": operator.role } : {}),
      });
      qc.invalidateQueries({ queryKey: ["/api/insurance/repository", sessionId] });
      qc.invalidateQueries({ queryKey: ["/api/insurance/repository/facets", sessionId] });
      qc.invalidateQueries({ queryKey: ["/api/insurance/audit", sessionId] });
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const selectCls = "w-full bg-slate-800 border border-slate-600 rounded px-2 py-2 text-sm text-slate-100 focus:outline-none focus:border-violet-500 appearance-none cursor-pointer";
  const inputCls  = "w-full bg-slate-800 border border-slate-600 rounded px-2 py-2 text-sm text-slate-100 focus:outline-none focus:border-violet-500 placeholder-slate-600";
  const labelCls  = "block text-xs font-semibold text-slate-400 mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-3">
      <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Edit3 className="h-4 w-4 text-violet-400" />
            <span className="font-semibold text-slate-100 text-sm">Modify Filed Record</span>
            <span className="text-xs text-slate-500 font-mono ml-1">HiL Operation</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200"><X className="h-4 w-4" /></button>
        </div>

        {/* Filename strip */}
        <div className="px-5 py-2 bg-slate-800/50 border-b border-slate-800 text-xs font-mono text-slate-400 truncate shrink-0">
          {doc.standardName || doc.filename}
        </div>

        {/* Form */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Section 1 — Document Classification */}
          <div>
            <div className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="flex-1 border-t border-violet-900/60" />
              Document Classification
              <span className="flex-1 border-t border-violet-900/60" />
            </div>
            <div>
              <label className={labelCls}>Document Type</label>
              <select value={docTypeCode} onChange={e => setDocTypeCode(e.target.value)} className={selectCls} data-testid="select-kms-doc-type">
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

          {/* Section 2 — Policy Details */}
          <div>
            <div className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="flex-1 border-t border-violet-900/60" />
              Policy Details
              <span className="flex-1 border-t border-violet-900/60" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Policy Line</label>
                <select value={policyLine} onChange={e => setPolicyLine(e.target.value)} className={selectCls} data-testid="select-kms-policy-line">
                  <option value="">— Select policy line —</option>
                  {POLICY_LINES.map(l => (
                    <option key={l.code} value={l.code}>{l.code} — {l.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Policy Period</label>
                <select value={policyPeriod} onChange={e => setPolicyPeriod(e.target.value)} className={selectCls} data-testid="select-kms-policy-period">
                  <option value="">— Select period —</option>
                  {POLICY_PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Named Insured (Client)</label>
                <input value={namedInsured} onChange={e => setNamedInsured(e.target.value)} placeholder="e.g. Acme Manufacturing Inc" className={inputCls} data-testid="input-kms-named-insured" />
              </div>
              <div>
                <label className={labelCls}>Policy Number</label>
                <input value={policyNumber} onChange={e => setPolicyNumber(e.target.value)} placeholder="e.g. POL-GL-2025-001" className={inputCls} data-testid="input-kms-policy-number" />
              </div>
              <div>
                <label className={labelCls}>Carrier / Insurer</label>
                <input value={carrierName} onChange={e => setCarrierName(e.target.value)} placeholder="e.g. Hartford, Travelers" className={inputCls} data-testid="input-kms-carrier" />
              </div>
              <div>
                <label className={labelCls}>Effective Date</label>
                <input type="date" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)} className={inputCls} data-testid="input-kms-effective-date" />
              </div>
              <div>
                <label className={labelCls}>Expiration Date</label>
                <input type="date" value={expirationDate} onChange={e => setExpirationDate(e.target.value)} className={inputCls} data-testid="input-kms-expiration-date" />
              </div>
            </div>
          </div>

          {/* Section 3 — Financial / Claims */}
          <div>
            <div className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="flex-1 border-t border-violet-900/60" />
              Financial &amp; Claims (if applicable)
              <span className="flex-1 border-t border-violet-900/60" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Premium</label>
                <input value={premium} onChange={e => setPremium(e.target.value)} placeholder="e.g. $12,500" className={inputCls} data-testid="input-kms-premium" />
              </div>
              <div>
                <label className={labelCls}>Claim Number</label>
                <input value={claimNumber} onChange={e => setClaimNumber(e.target.value)} placeholder="e.g. CLM-2025-0042" className={inputCls} data-testid="input-kms-claim-number" />
              </div>
            </div>
          </div>
        </div>

        {/* Reason + Operator */}
        <div className="px-5 pb-4 space-y-3">
          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1">
              Reason for Modification {docTypeChanged && <span className="text-red-400">*</span>}
            </label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder={docTypeChanged ? "Required when reclassifying document type…" : "Optional justification for this change…"}
              rows={2}
              className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-2 text-sm text-slate-100 focus:outline-none focus:border-violet-500 placeholder-slate-600 resize-none"
              data-testid="input-kms-reason"
            />
            {docTypeChanged && !reason.trim() && (
              <div className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Reason is required when changing the document type.</div>
            )}
          </div>
          {operator && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Attributing to:</span>
              <span className="text-slate-300 font-medium">{operator.fullName}</span>
              <span className={`px-1.5 py-0.5 rounded border font-mono ${ROLE_COLORS[operator.role] || ROLE_COLORS.VIEWER}`}>{operator.role}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 flex gap-2 justify-between items-center px-5 py-3.5 border-t border-slate-700 bg-slate-900/90">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <AlertTriangle className="h-3 w-3" />
            This updates the filed record and creates an audit entry
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-200 border border-slate-700 rounded transition-colors">
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving || (docTypeChanged && !reason.trim())}
              className="px-4 py-1.5 text-sm bg-violet-700 hover:bg-violet-600 text-white rounded transition-colors disabled:opacity-50 font-medium"
              data-testid="button-kms-save-modify"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
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
  const [, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState(() => localStorage.getItem(SESSION_KEY) || "");
  const [operator, setOperator] = useState<Operator | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    fetch("/api/insurance/auth/session")
      .then(r => {
        if (r.status === 401) {
          setLocation("/research/knowledge-systems/insurance/login?redirect=/research/knowledge-systems/insurance");
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
  const [modifyDoc, setModifyDoc] = useState<RepoDoc | null>(null);

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

      {selected && (
        <DocDetailPanel
          doc={selected}
          sessionId={sessionId}
          onClose={() => setSelected(null)}
          onModify={(doc) => { setModifyDoc(doc); setSelected(null); }}
        />
      )}
      {modifyDoc && (
        <KmsModifyModal
          doc={modifyDoc}
          sessionId={sessionId}
          operator={operator}
          onClose={() => setModifyDoc(null)}
          onSaved={() => setModifyDoc(null)}
        />
      )}

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
                            <div
                              key={doc.id}
                              className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-lg overflow-hidden transition-all group"
                              data-testid={`card-doc-${doc.id}`}
                            >
                              {/* Clickable body — opens detail panel */}
                              <button
                                onClick={() => setSelected(doc)}
                                className="w-full p-3 text-left hover:bg-slate-800 transition-colors"
                                data-testid={`button-view-doc-${doc.id}`}
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
                              {/* Modify button — always visible at the card bottom */}
                              <button
                                onClick={() => setModifyDoc(doc)}
                                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-violet-400 hover:text-violet-200 hover:bg-violet-900/30 border-t border-slate-800 transition-colors"
                                data-testid={`button-modify-doc-${doc.id}`}
                              >
                                <Edit3 className="h-3 w-3" />
                                Modify
                              </button>
                            </div>
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
