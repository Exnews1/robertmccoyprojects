import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import {
  ArrowLeft, RefreshCw, CheckCircle, XCircle, Edit3, Save,
  Loader2, FileText, Shield, Cpu, Database, ClipboardList,
  ChevronRight, TriangleAlert, Info, Building2, Upload, X, ExternalLink, MonitorPlay,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface DocMeta {
  key: string;
  fileName: string;
  category: string;
}

interface StagedDoc {
  id: number;
  documentKey: string;
  originalName: string;
  standardName: string | null;
  docType: string | null;
  subject: string | null;
  department: string | null;
  effectiveDate: string | null;
  responsibleParty: string | null;
  confidence: number | null;
  reasoning: string | null;
  status: string | null;
  uploadedAt: string;
}

interface RepoDoc {
  id: number;
  originalName: string;
  standardName: string;
  docType: string;
  subject: string;
  department: string;
  confidence: number | null;
  approvedBy: string | null;
  approvedAt: string;
}

interface AuditEntry {
  id: number;
  ts: string;
  actor: string;
  action: string;
  details: string;
}

// ── Static doc library ───────────────────────────────────────────────────────

const LIBRARY: DocMeta[] = [
  // ── Knowledge Management ──────────────────────────────────────────────────
  { key: "MIG-001", fileName: "Meridian_Document_Management_System_Specification_1773678052357.txt", category: "Knowledge Management" },
  { key: "MIG-003", fileName: "Meridian_Acronym_Glossary_Reference_1773678052358.txt",               category: "Knowledge Management" },
  { key: "MIG-008", fileName: "Meridian_Data_Governance_Policy_v2.1_1773678303431.pdf",              category: "Knowledge Management" },
  { key: "MIG-010", fileName: "Meridian_Document_Classification_Taxonomy_Reference_1773678052357.txt", category: "Knowledge Management" },
  { key: "MIG-011", fileName: "Meridian_Memo_AI_Document_Intelligence_Pilot_1773678303431.txt",      category: "Knowledge Management" },
  { key: "MIG-013", fileName: "Meridian_Document_Submission_Request_Form_1773678092073.txt",         category: "Knowledge Management" },
  { key: "MIG-017", fileName: "Meridian_Knowledge_Repository_Utilization_Report_1773678092074.txt",  category: "Knowledge Management" },
  { key: "MIG-018", fileName: "Meridian_Knowledge_Taxonomy_SOP_1773678303430.pdf",                   category: "Knowledge Management" },
  { key: "MIG-022", fileName: "Meridian_New_Employee_KMS_Training_Guide_1773678303431.txt",          category: "Knowledge Management" },
  // ── Information Technology ────────────────────────────────────────────────
  { key: "MIG-002", fileName: "Meridian_Acceptable_Use_Policy_1773678052358.pdf",                    category: "IT" },
  { key: "MIG-004", fileName: "Meridian_API_Integration_Specification_1773678052358.txt",            category: "IT" },
  { key: "MIG-007", fileName: "Meridian_Cybersecurity_Awareness_Training_1773678052359.pdf",         category: "IT" },
  { key: "MIG-015", fileName: "Meridian_Incident_Response_SOP_1773678092073.pdf",                    category: "IT" },
  { key: "MIG-016", fileName: "Meridian_IT_Systems_Uptime_Report_Q4_1773678092074.txt",              category: "IT" },
  { key: "MIG-021", fileName: "Meridian_Network_Infrastructure_Specification_1773678256671.txt",     category: "IT" },
  // ── Human Resources ───────────────────────────────────────────────────────
  { key: "MIG-009", fileName: "Meridian_Department_Directory_1773678052359.txt",                     category: "HR" },
  { key: "MIG-012", fileName: "Meridian_Memo_Annual_Training_Compliance_1773678092073.txt",          category: "HR" },
  { key: "MIG-019", fileName: "Meridian_Manager_Leadership_Development_1773678092072.pdf",           category: "HR" },
  { key: "MIG-023", fileName: "Meridian_New_Hire_Onboarding_Form_1773678256669.txt",                 category: "HR" },
  // ── Safety ────────────────────────────────────────────────────────────────
  { key: "MIG-024", fileName: "Meridian_Q4_Safety_Audit_Report_1773678256669.txt",                   category: "Safety" },
  { key: "MIG-026", fileName: "Meridian_Safety_Incident_Report_Form_1773678256670.txt",              category: "Safety" },
  { key: "MIG-027", fileName: "Meridian_Safety_Orientation_Training_1773678256670.txt",              category: "Safety" },
  // ── Quality ───────────────────────────────────────────────────────────────
  { key: "MIG-014", fileName: "Meridian_Equipment_Calibration_SOP_1773678092073.txt",                category: "Quality" },
  { key: "MIG-020", fileName: "Meridian_Manufacturing_Quality_Specification_1773678092073.txt",      category: "Quality" },
  // ── Finance ───────────────────────────────────────────────────────────────
  { key: "MIG-006", fileName: "Meridian_Budget_Exception_Request_Form_1773678052359.txt",            category: "Finance" },
  { key: "MIG-029", fileName: "Meridian_Memo_Q1_Budget_Realignment_1773678256670.txt",               category: "Finance" },
  // ── Legal ─────────────────────────────────────────────────────────────────
  { key: "MIG-025", fileName: "Meridian_Records_Retention_Policy_1773678256670.txt",                 category: "Legal" },
  { key: "MIG-030", fileName: "Meridian_NDA_Mutual_Confidentiality_Agreement_1773801000001.pdf",     category: "Legal" },
  { key: "MIG-031", fileName: "Meridian_Contractor_Services_Agreement_Template_1773801000002.pdf",   category: "Legal" },
  { key: "MIG-032", fileName: "Meridian_Intellectual_Property_Assignment_Policy_1773801000003.txt",  category: "Legal" },
  { key: "MIG-033", fileName: "Meridian_Liability_Waiver_Form_1773801000004.txt",                    category: "Legal" },
  // ── Operations ────────────────────────────────────────────────────────────
  { key: "MIG-028", fileName: "Meridian_Memo_Facility_Relocation_1773678256670.txt",                 category: "Operations" },
  { key: "MIG-034", fileName: "Meridian_Facility_Maintenance_Schedule_SOP_1773801000005.txt",        category: "Operations" },
  { key: "MIG-035", fileName: "Meridian_Production_Floor_Startup_Procedure_1773801000006.txt",       category: "Operations" },
  { key: "MIG-036", fileName: "Meridian_Shift_Handover_Procedure_SOP_1773801000007.txt",             category: "Operations" },
  { key: "MIG-037", fileName: "Meridian_Inventory_Control_SOP_1773801000008.pdf",                    category: "Operations" },
  // ── Procurement ───────────────────────────────────────────────────────────
  { key: "MIG-005", fileName: "Meridian_Approved_Vendor_List_1773678052358.txt",                     category: "Procurement" },
  { key: "MIG-038", fileName: "Meridian_Purchase_Order_Policy_1773801000009.txt",                    category: "Procurement" },
  { key: "MIG-039", fileName: "Meridian_Vendor_Evaluation_Criteria_Form_1773801000010.txt",          category: "Procurement" },
  { key: "MIG-040", fileName: "Meridian_RFQ_Standard_Template_Reference_1773801000011.pdf",          category: "Procurement" },
  { key: "MIG-041", fileName: "Meridian_Sole_Source_Justification_Form_1773801000012.txt",           category: "Procurement" },
  // ── Accounts Receivable ───────────────────────────────────────────────────
  { key: "MIG-042", fileName: "Meridian_Invoice_Processing_Policy_1773801000013.txt",                category: "Accounts Receivable" },
  { key: "MIG-043", fileName: "Meridian_Customer_Credit_Application_Form_1773801000014.pdf",         category: "Accounts Receivable" },
  { key: "MIG-044", fileName: "Meridian_AR_Aging_Report_Q4_2025_1773801000015.txt",                  category: "Accounts Receivable" },
  { key: "MIG-045", fileName: "Meridian_Collections_Procedure_SOP_1773801000016.txt",                category: "Accounts Receivable" },
  { key: "MIG-046", fileName: "Meridian_Revenue_Recognition_Policy_1773801000017.txt",               category: "Accounts Receivable" },
  // ── Accounts Payable ─────────────────────────────────────────────────────
  { key: "MIG-047", fileName: "Meridian_Accounts_Payable_Processing_SOP_1773801000018.txt",          category: "Accounts Payable" },
  { key: "MIG-048", fileName: "Meridian_Vendor_Payment_Terms_Policy_1773801000019.txt",              category: "Accounts Payable" },
  { key: "MIG-049", fileName: "Meridian_Three_Way_Match_Procedure_1773801000020.txt",                category: "Accounts Payable" },
  { key: "MIG-050", fileName: "Meridian_AP_Aging_Report_Q4_2025_1773801000021.txt",                  category: "Accounts Payable" },
  { key: "MIG-051", fileName: "Meridian_Expense_Reimbursement_Policy_1773801000022.txt",             category: "Accounts Payable" },
];

const CATEGORIES = ["All", "Knowledge Management", "IT", "HR", "Safety", "Finance", "Quality", "Legal", "Operations", "Procurement", "Accounts Receivable", "Accounts Payable"];

const CAT_COLORS: Record<string, string> = {
  "Knowledge Management":  "bg-purple-900/60 text-purple-200 border-purple-800",
  IT:                      "bg-violet-900/60 text-violet-200 border-violet-800",
  HR:                      "bg-blue-900/60 text-blue-200 border-blue-800",
  Safety:                  "bg-red-900/60 text-red-200 border-red-800",
  Finance:                 "bg-emerald-900/60 text-emerald-200 border-emerald-800",
  Quality:                 "bg-cyan-900/60 text-cyan-200 border-cyan-800",
  Legal:                   "bg-amber-900/60 text-amber-200 border-amber-800",
  Operations:              "bg-slate-700 text-slate-200 border-slate-600",
  Procurement:             "bg-teal-900/60 text-teal-200 border-teal-800",
  "Accounts Receivable":   "bg-green-900/60 text-green-200 border-green-800",
  "Accounts Payable":      "bg-orange-900/60 text-orange-200 border-orange-800",
};

const ACTION_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  INGEST: { bg: "bg-blue-900/40", text: "text-blue-300", label: "INGEST" },
  CLASSIFY: { bg: "bg-violet-900/40", text: "text-violet-300", label: "CLASSIFY" },
  STANDARDIZE: { bg: "bg-cyan-900/40", text: "text-cyan-300", label: "NORMALIZE" },
  APPROVE: { bg: "bg-emerald-900/40", text: "text-emerald-300", label: "APPROVE" },
  REJECT: { bg: "bg-red-900/40", text: "text-red-300", label: "REJECT" },
  MODIFY: { bg: "bg-amber-900/40", text: "text-amber-300", label: "MODIFY" },
};

const DOC_TYPES = ["Policy", "SOP", "Procedure", "Form", "Handbook", "Memo", "Other"];
const SUBJECTS = ["HR", "Safety", "Finance", "IT", "Legal", "Quality", "Operations", "Maintenance", "General"];
const DEPARTMENTS = ["Human Resources", "Health & Safety", "Finance", "Information Technology", "Legal & Compliance", "Quality Assurance", "Operations"];

function genSessionId() {
  return "mig-" + Math.random().toString(36).slice(2, 10) + "-" + Date.now().toString(36);
}

// ── Confidence bar ───────────────────────────────────────────────────────────
function ConfBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color = pct >= 90 ? "bg-emerald-500" : pct >= 75 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-slate-400 w-8 text-right">{pct}%</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function KnowledgeSystemsDemo() {
  const [sessionId, setSessionId] = useState<string>("");
  const [processedKeys, setProcessedKeys] = useState<Set<string>>(new Set());
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [staging, setStaging] = useState<StagedDoc[]>([]);
  const [repository, setRepository] = useState<RepoDoc[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);

  const [rightTab, setRightTab] = useState<"repo" | "audit">("repo");
  const [processing, setProcessing] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFields, setEditFields] = useState<Partial<StagedDoc>>({});
  const [flash, setFlash] = useState<string | null>(null);

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Init session — fresh every page load so demo always starts clean
  useEffect(() => {
    const sid = genSessionId();
    setSessionId(sid);
  }, []);

  const headers = useCallback(
    () => ({ "Content-Type": "application/json", "x-session-id": sessionId }),
    [sessionId]
  );

  // Fetch helpers
  const fetchProcessedKeys = useCallback(async () => {
    if (!sessionId) return;
    const r = await fetch("/api/meridian/processed-keys", { headers: headers() });
    const d = await r.json();
    if (d.success) setProcessedKeys(new Set(d.data));
  }, [sessionId, headers]);

  const fetchStaging = useCallback(async () => {
    if (!sessionId) return;
    const r = await fetch("/api/meridian/staging", { headers: headers() });
    const d = await r.json();
    if (d.success) setStaging(d.data);
  }, [sessionId, headers]);

  const fetchRepository = useCallback(async () => {
    if (!sessionId) return;
    const r = await fetch("/api/meridian/repository", { headers: headers() });
    const d = await r.json();
    if (d.success) setRepository(d.data);
  }, [sessionId, headers]);

  const fetchAudit = useCallback(async () => {
    if (!sessionId) return;
    const r = await fetch("/api/meridian/audit", { headers: headers() });
    const d = await r.json();
    if (d.success) setAudit(d.data);
  }, [sessionId, headers]);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchProcessedKeys(), fetchStaging(), fetchRepository(), fetchAudit()]);
  }, [fetchProcessedKeys, fetchStaging, fetchRepository, fetchAudit]);

  useEffect(() => {
    if (sessionId) refreshAll();
  }, [sessionId, refreshAll]);

  // ── Actions ──────────────────────────────────────────────────────────────

  const handleProcess = async (keys: string[]) => {
    if (keys.length === 0 || processing) return;
    setProcessing(true);
    try {
      const r = await fetch("/api/meridian/process", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ documentKeys: keys }),
      });
      const d = await r.json();
      if (d.success) {
        showFlash(`${d.processed} document${d.processed !== 1 ? "s" : ""} sent to staging queue`);
        setSelectedKeys(new Set());
        await refreshAll();
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || uploading || !sessionId) return;
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      const r = await fetch("/api/meridian/upload", {
        method: "POST",
        headers: { "x-session-id": sessionId },
        body: formData,
      });
      const d = await r.json();
      if (d.success) {
        showFlash(`"${uploadFile.name}" uploaded and sent to staging queue`);
        setUploadFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        await refreshAll();
      } else {
        setUploadError(d.error || "Upload failed");
      }
    } catch {
      setUploadError("Upload failed — please try again");
    } finally {
      setUploading(false);
    }
  };

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    await fetch(`/api/meridian/staging/${id}/approve`, {
      method: "POST", headers: headers(), body: JSON.stringify({ actor: "Operations Manager" }),
    });
    showFlash("Document approved — moved to repository");
    await refreshAll();
    setActionLoading(null);
  };

  const handleReject = async (id: number) => {
    setActionLoading(id);
    await fetch(`/api/meridian/staging/${id}/reject`, {
      method: "POST", headers: headers(), body: JSON.stringify({ actor: "Operations Manager" }),
    });
    showFlash("Document rejected — returned to pool");
    await refreshAll();
    setActionLoading(null);
  };

  const handleModifySave = async (id: number) => {
    setActionLoading(id);
    await fetch(`/api/meridian/staging/${id}/modify`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({ ...editFields, actor: "Analyst" }),
    });
    showFlash("Classification updated");
    setEditingId(null);
    setEditFields({});
    await refreshAll();
    setActionLoading(null);
  };

  const handleReset = async () => {
    await fetch("/api/meridian/reset", { method: "DELETE", headers: headers() });
    setSessionId(genSessionId());
    setSelectedKeys(new Set());
    setProcessedKeys(new Set());
    setStaging([]);
    setRepository([]);
    setAudit([]);
    showFlash("Demo reset — pipeline and KMS portal cleared, ready for next demo");
  };

  function showFlash(msg: string) {
    setFlash(msg);
    setTimeout(() => setFlash(null), 3200);
  }

  // ── Selection helpers ─────────────────────────────────────────────────────
  const filteredLibrary = categoryFilter === "All"
    ? LIBRARY
    : LIBRARY.filter(d => d.category === categoryFilter);

  const availableDocs = filteredLibrary.filter(d => !processedKeys.has(d.key));

  const toggleSelect = (key: string) => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const selectAllVisible = () => {
    const available = availableDocs.map(d => d.key);
    setSelectedKeys(prev => {
      const next = new Set(prev);
      available.forEach(k => next.add(k));
      return next;
    });
  };

  const clearSelection = () => setSelectedKeys(new Set());

  const selectedAvailable = Array.from(selectedKeys).filter(k => !processedKeys.has(k));
  const allUnprocessed = LIBRARY.filter(d => !processedKeys.has(d.key)).map(d => d.key);

  // ── Repo grouped ─────────────────────────────────────────────────────────
  const repoByDept = repository.reduce<Record<string, RepoDoc[]>>((acc, doc) => {
    (acc[doc.department] = acc[doc.department] || []).push(doc);
    return acc;
  }, {});

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">

      {/* ── Header ── */}
      <header className="bg-slate-900 border-b border-slate-700 px-5 py-3.5 flex items-center justify-between sticky top-0 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/research/knowledge-systems" data-testid="link-back">
            <button className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-sm mr-2 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>
          </Link>
          <div className="w-8 h-8 bg-amber-700 rounded flex items-center justify-center shrink-0">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-widest uppercase text-slate-100 leading-none">
              OKS Bulk Document System
            </div>
            <div className="text-xs text-slate-400 tracking-wider uppercase mt-0.5">
              AI / Human-in-the-Loop Ingestion Pipeline
            </div>
          </div>
          <span className="ml-3 px-2 py-0.5 rounded text-xs font-semibold bg-amber-900/60 text-amber-300 border border-amber-700">
            DEMO MODE
          </span>
        </div>

        <div className="flex items-center gap-3">
          {flash && (
            <div className="text-xs bg-emerald-900/70 text-emerald-300 border border-emerald-700 px-3 py-1.5 rounded animate-pulse">
              {flash}
            </div>
          )}
          <div className="text-xs text-slate-500 hidden md:block">
            Session: <span className="font-mono text-slate-400">{sessionId.slice(0, 14)}…</span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1.5 rounded transition-colors"
            data-testid="button-reset"
          >
            <RefreshCw className="h-3 w-3" />
            Reset Demo
          </button>
        </div>
      </header>

      {/* ── Two-browser tip bar ── */}
      <div className="bg-amber-950/40 border-b border-amber-800/50 px-5 py-2.5 flex items-start gap-2.5 shrink-0" data-testid="bar-two-browser-tip">
        <MonitorPlay className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0">
          <span className="text-xs font-bold text-amber-400 whitespace-nowrap">Best viewed with two windows side by side:</span>
          <span className="text-xs text-slate-300">
            <span className="font-semibold text-amber-300/80">Left →</span> this pipeline &nbsp;|&nbsp;
            <span className="font-semibold text-amber-300/80">Right →</span>{" "}
            <a
              href="https://robertmccoyprojects.com/research/knowledge-systems/meridian"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 text-amber-400 hover:text-amber-300 transition-colors"
              data-testid="link-open-kms-portal"
            >
              robertmccoyprojects.com/research/knowledge-systems/meridian
            </a>
            <span className="text-slate-500 ml-1">— watch approved docs appear live</span>
          </span>
        </div>
      </div>

      {/* ── Note bar ── */}
      <div className="bg-slate-800/60 border-b border-slate-700 px-5 py-2 flex items-center gap-2 shrink-0">
        <Info className="h-3.5 w-3.5 text-amber-400 shrink-0" />
        <span className="text-xs text-slate-400">
          <span className="text-amber-400 font-semibold">Rules-based classification engine.</span>{" "}
          In production, document extraction and classification would call a fine-tuned language model via API. Select documents from the library, process them, then review AI proposals in the staging queue.
        </span>
      </div>

      {/* ── 3-panel body ── */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* ── LEFT: Document Library ── */}
        <div className="w-[38%] border-r border-slate-700 flex flex-col bg-slate-900 overflow-hidden">
          {/* Library header */}
          <div className="px-4 pt-4 pb-3 border-b border-slate-700 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-400" />
                <span className="font-semibold text-sm text-slate-100">Document Library</span>
                <span className="text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                  {LIBRARY.length - processedKeys.size} / {LIBRARY.length} available
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              These {LIBRARY.length} documents represent the output of the scan-to-queue process — raw files received from the document scanner, waiting for AI classification and human review.
            </p>

            {/* Category filter pills */}
            <div className="flex flex-wrap gap-1 mb-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  data-testid={`filter-${cat}`}
                  className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                    categoryFilter === cat
                      ? "bg-amber-700 text-white border-amber-600"
                      : "bg-slate-800 text-slate-400 border-slate-600 hover:border-slate-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Select controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={selectAllVisible}
                className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 px-2.5 py-1 rounded transition-colors"
                data-testid="button-select-all-visible"
              >
                Select visible
              </button>
              {selectedKeys.size > 0 && (
                <button
                  onClick={clearSelection}
                  className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded transition-colors"
                >
                  Clear ({selectedKeys.size})
                </button>
              )}
              <div className="ml-auto flex gap-2">
                <button
                  onClick={() => handleProcess(selectedAvailable)}
                  disabled={selectedAvailable.length === 0 || processing}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-amber-700 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded transition-colors"
                  data-testid="button-process-selected"
                >
                  {processing ? <Loader2 className="h-3 w-3 animate-spin" /> : <ChevronRight className="h-3 w-3" />}
                  Process {selectedAvailable.length > 0 ? `(${selectedAvailable.length})` : ""}
                </button>
                <button
                  onClick={() => handleProcess(allUnprocessed)}
                  disabled={allUnprocessed.length === 0 || processing}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-100 px-3 py-1.5 rounded transition-colors border border-slate-600"
                  data-testid="button-process-all"
                >
                  {processing ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                  All {allUnprocessed.length}
                </button>
              </div>
            </div>
          </div>

          {/* Doc list */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
            {filteredLibrary.length === 0 && (
              <p className="text-slate-500 text-sm text-center mt-8">No documents in this category.</p>
            )}
            {filteredLibrary.map(doc => {
              const isProcessed = processedKeys.has(doc.key);
              const isSelected = selectedKeys.has(doc.key);
              return (
                <div
                  key={doc.key}
                  onClick={() => !isProcessed && toggleSelect(doc.key)}
                  data-testid={`doc-${doc.key}`}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded border text-sm transition-colors ${
                    isProcessed
                      ? "opacity-40 cursor-not-allowed border-slate-800 bg-slate-800/20"
                      : isSelected
                        ? "border-amber-600 bg-amber-900/20 cursor-pointer"
                        : "border-slate-700 bg-slate-800/40 hover:border-slate-500 hover:bg-slate-800 cursor-pointer"
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    isProcessed ? "border-slate-600 bg-slate-700" :
                    isSelected ? "border-amber-500 bg-amber-700" : "border-slate-500"
                  }`}>
                    {isProcessed && <div className="w-2 h-2 bg-slate-500 rounded-sm" />}
                    {isSelected && !isProcessed && <CheckCircle className="h-3 w-3 text-white" />}
                  </div>
                  <span className={`flex-1 font-mono text-xs truncate ${isProcessed ? "text-slate-500" : "text-slate-200"}`}>
                    {doc.fileName}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded border shrink-0 ${CAT_COLORS[doc.category] || "bg-slate-700 text-slate-300 border-slate-600"}`}>
                    {doc.category}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ── Upload your own document ── */}
          <div className="border-t border-slate-700 px-3 py-3 shrink-0 space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
              <Upload className="h-3 w-3" /> Upload Your Own Document
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              className="hidden"
              data-testid="input-upload-file"
              onChange={e => {
                const f = e.target.files?.[0] ?? null;
                setUploadFile(f);
                setUploadError(null);
              }}
            />
            {uploadFile ? (
              <div className="flex items-center gap-2 bg-slate-800 border border-slate-600 rounded px-2.5 py-2">
                <FileText className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span className="text-xs text-slate-200 truncate flex-1 font-mono">{uploadFile.name}</span>
                <button
                  onClick={() => { setUploadFile(null); setUploadError(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                  data-testid="button-clear-upload"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 border border-dashed border-slate-600 hover:border-amber-600 hover:bg-amber-900/10 rounded px-3 py-3 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                data-testid="button-browse-upload"
              >
                <Upload className="h-3.5 w-3.5" />
                Browse or drop a file (.txt, .pdf, .docx)
              </button>
            )}
            {uploadError && (
              <p className="text-xs text-red-400 flex items-center gap-1"><TriangleAlert className="h-3 w-3" />{uploadError}</p>
            )}
            <button
              onClick={handleUpload}
              disabled={!uploadFile || uploading}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-100 px-3 py-1.5 rounded transition-colors border border-slate-600"
              data-testid="button-submit-upload"
            >
              {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
              {uploading ? "Processing…" : "Ingest into Pipeline"}
            </button>
            <p className="text-xs text-slate-600">Max 10 MB · .txt files use content-based classification</p>
          </div>
        </div>

        {/* ── MIDDLE: Staging Queue ── */}
        <div className="w-[37%] border-r border-slate-700 flex flex-col bg-slate-950 overflow-hidden">
          <div className="px-4 pt-4 pb-3 border-b border-slate-700 shrink-0 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-violet-400" />
            <span className="font-semibold text-sm text-slate-100">Staging Queue</span>
            <span className="text-xs bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
              {staging.length} pending
            </span>
            <span className="ml-1 text-xs text-slate-500">— AI proposals awaiting review</span>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {staging.length === 0 && (
              <div className="text-center mt-12 space-y-2">
                <Cpu className="h-10 w-10 text-slate-700 mx-auto" />
                <p className="text-slate-500 text-sm">No documents pending review.</p>
                <p className="text-slate-600 text-xs">Select documents from the library and click Process.</p>
              </div>
            )}
            {staging.map(doc => (
              <div
                key={doc.id}
                data-testid={`staged-${doc.id}`}
                className="border border-slate-700 rounded bg-slate-900 overflow-hidden"
              >
                {/* Doc header */}
                <div className="px-3 py-2 bg-slate-800 border-b border-slate-700 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs text-slate-400 font-mono truncate">{doc.originalName}</div>
                    {doc.standardName && (
                      <div className="text-xs text-amber-300 font-mono truncate mt-0.5">
                        → {doc.standardName}
                      </div>
                    )}
                  </div>
                  <span className="text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded border border-slate-600 shrink-0 font-mono">
                    {doc.docType}
                  </span>
                </div>

                {/* Classification fields */}
                <div className="px-3 py-2.5 space-y-2">
                  {editingId === doc.id ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-slate-500 block mb-1">Type</label>
                          <select
                            value={editFields.docType || doc.docType || ""}
                            onChange={e => setEditFields(p => ({ ...p, docType: e.target.value }))}
                            className="w-full text-xs bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-100"
                          >
                            {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 block mb-1">Subject</label>
                          <select
                            value={editFields.subject || doc.subject || ""}
                            onChange={e => setEditFields(p => ({ ...p, subject: e.target.value }))}
                            className="w-full text-xs bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-100"
                          >
                            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 block mb-1">Department</label>
                        <select
                          value={editFields.department || doc.department || ""}
                          onChange={e => setEditFields(p => ({ ...p, department: e.target.value }))}
                          className="w-full text-xs bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-100"
                        >
                          {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 block mb-1">Responsible Party</label>
                        <input
                          value={editFields.responsibleParty || doc.responsibleParty || ""}
                          onChange={e => setEditFields(p => ({ ...p, responsibleParty: e.target.value }))}
                          className="w-full text-xs bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-100"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                      <div>
                        <span className="text-slate-500">Subject</span>
                        <div className="text-slate-200 font-medium mt-0.5">{doc.subject}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Department</span>
                        <div className="text-slate-200 font-medium mt-0.5">{doc.department}</div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500">Responsible Party</span>
                        <div className="text-slate-200 font-medium mt-0.5">{doc.responsibleParty}</div>
                      </div>
                    </div>
                  )}

                  {/* Confidence */}
                  {doc.confidence != null && (
                    <div>
                      <div className="text-xs text-slate-500 mb-1">AI Confidence</div>
                      <ConfBar value={doc.confidence} />
                    </div>
                  )}

                  {/* Reasoning */}
                  {doc.reasoning && (
                    <div className="text-xs text-slate-500 italic border-l-2 border-slate-700 pl-2">
                      {doc.reasoning}
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="px-3 py-2 bg-slate-800/50 border-t border-slate-700 flex items-center gap-2">
                  {editingId === doc.id ? (
                    <>
                      <button
                        onClick={() => handleModifySave(doc.id)}
                        disabled={actionLoading === doc.id}
                        className="flex items-center gap-1 text-xs font-semibold bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-white px-3 py-1.5 rounded transition-colors"
                        data-testid={`button-save-${doc.id}`}
                      >
                        {actionLoading === doc.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                        Save
                      </button>
                      <button
                        onClick={() => { setEditingId(null); setEditFields({}); }}
                        className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1.5 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => { setEditingId(doc.id); setEditFields({}); }}
                        className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-800 px-2.5 py-1.5 rounded transition-colors"
                        data-testid={`button-edit-${doc.id}`}
                      >
                        <Edit3 className="h-3 w-3" />
                        Modify
                      </button>
                      <div className="ml-auto flex gap-1.5">
                        <button
                          onClick={() => handleReject(doc.id)}
                          disabled={actionLoading === doc.id}
                          className="flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-900/30 hover:bg-red-900/50 border border-red-800 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
                          data-testid={`button-reject-${doc.id}`}
                        >
                          {actionLoading === doc.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
                          Reject
                        </button>
                        <button
                          onClick={() => handleApprove(doc.id)}
                          disabled={actionLoading === doc.id}
                          className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-900/30 hover:bg-emerald-900/50 border border-emerald-700 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
                          data-testid={`button-approve-${doc.id}`}
                        >
                          {actionLoading === doc.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                          Approve
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Repository + Audit ── */}
        <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-slate-700 shrink-0">
            <button
              onClick={() => setRightTab("repo")}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${
                rightTab === "repo" ? "border-amber-500 text-amber-400" : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
              data-testid="tab-repository"
            >
              <Database className="h-3.5 w-3.5" />
              Repository ({repository.length})
            </button>
            <button
              onClick={() => setRightTab("audit")}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${
                rightTab === "audit" ? "border-amber-500 text-amber-400" : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
              data-testid="tab-audit"
            >
              <ClipboardList className="h-3.5 w-3.5" />
              Audit Trail ({audit.length})
            </button>
            <div className="ml-auto flex items-center pr-3">
              <a
                href="/research/knowledge-systems/meridian"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-amber-500 hover:text-amber-400 bg-amber-900/20 hover:bg-amber-900/30 border border-amber-800/50 rounded px-2.5 py-1 transition-colors"
                data-testid="link-open-kms"
              >
                <ExternalLink className="h-3 w-3" />
                Open KMS Portal
              </a>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3">

            {/* Repository tab */}
            {rightTab === "repo" && (
              <div>
                {repository.length === 0 ? (
                  <div className="text-center mt-12 space-y-2">
                    <Database className="h-10 w-10 text-slate-700 mx-auto" />
                    <p className="text-slate-500 text-sm">Repository is empty.</p>
                    <p className="text-slate-600 text-xs">Approved documents appear here organized by department.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(repoByDept).sort().map(([dept, docs]) => (
                      <div key={dept}>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                          <div className="flex-1 h-px bg-slate-700" />
                          {dept}
                          <div className="flex-1 h-px bg-slate-700" />
                        </div>
                        <div className="space-y-1.5">
                          {docs.map(doc => (
                            <div
                              key={doc.id}
                              data-testid={`repo-${doc.id}`}
                              className="border border-slate-700 rounded bg-slate-800/60 px-3 py-2"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs bg-emerald-900/50 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-mono shrink-0">
                                  {doc.docType}
                                </span>
                                <span className="text-xs text-slate-500 font-mono truncate">{doc.subject}</span>
                                {doc.confidence != null && (
                                  <span className="ml-auto text-xs text-slate-500 font-mono shrink-0">
                                    {Math.round(doc.confidence * 100)}%
                                  </span>
                                )}
                              </div>
                              <div className="text-xs font-mono text-amber-300 truncate">{doc.standardName}</div>
                              <div className="text-xs text-slate-500 mt-0.5 truncate">orig: {doc.originalName}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Audit tab */}
            {rightTab === "audit" && (
              <div>
                {audit.length === 0 ? (
                  <div className="text-center mt-12 space-y-2">
                    <ClipboardList className="h-10 w-10 text-slate-700 mx-auto" />
                    <p className="text-slate-500 text-sm">No audit events recorded.</p>
                    <p className="text-slate-600 text-xs">Every system and human action is logged here immutably.</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {audit.map(entry => {
                      const style = ACTION_STYLES[entry.action] || ACTION_STYLES["INGEST"];
                      const time = entry.ts ? new Date(entry.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "—";
                      return (
                        <div
                          key={entry.id}
                          data-testid={`audit-${entry.id}`}
                          className={`flex items-start gap-2.5 px-2.5 py-2 rounded border border-slate-700/50 ${style.bg}`}
                        >
                          <div className="flex flex-col items-center gap-0.5 shrink-0 mt-0.5">
                            <span className={`text-xs font-bold font-mono ${style.text} leading-none`}>
                              {style.label}
                            </span>
                            <span className="text-xs text-slate-600 font-mono">{time}</span>
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-semibold text-slate-400">{entry.actor}</span>
                            <p className="text-xs text-slate-300 mt-0.5 break-words">{entry.details}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Stats footer */}
          <div className="border-t border-slate-700 px-4 py-2.5 flex items-center gap-4 text-xs text-slate-500 shrink-0 bg-slate-900">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3 text-slate-600" />
              <span>Processed: <span className="text-slate-300 font-mono">{processedKeys.size}</span></span>
            </div>
            <div>Pending: <span className="text-amber-400 font-mono">{staging.length}</span></div>
            <div>Approved: <span className="text-emerald-400 font-mono">{repository.length}</span></div>
            <div className="ml-auto flex items-center gap-1 text-slate-600">
              <TriangleAlert className="h-3 w-3" />
              Rules-based engine — no API calls in demo
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
