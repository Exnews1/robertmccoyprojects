/**
 * Meridian Industrial Group – Document Classification Engine
 * Taxonomy: MIG-REF-KM-Taxonomy-2025-001 v2.0 + MIG-SOP-KT-2025-007
 * Types: MEM FRM REF POL SOP RPT SPE CON TRN | Other → OTH
 * Subjects: KM SAF HR FIN IT LEG QA PRO ENG FAC OPS GEN
 *
 * Rules-based classifier. Production deployments call a fine-tuned LLM via API.
 */

export interface ClassificationResult {
  docType: string;      // full label (e.g. "Policy")
  typeCode: string;     // three-letter code (e.g. "POL")
  subject: string;      // full label (e.g. "Information Technology")
  subjectCode: string;  // short code (e.g. "IT")
  department: string;   // responsible department
  effectiveDate: string;
  responsibleParty: string;
  confidence: number;
  reasoning: string;
}

// ── Subject registry ──────────────────────────────────────────────────────────

interface SubjectDef {
  code: string;
  label: string;
  department: string;
  responsibleParty: string;
}

const SUBJECT_DEFS: SubjectDef[] = [
  { code: "KM",  label: "Knowledge Management",    department: "Knowledge Management Office",        responsibleParty: "Director of Information Architecture" },
  { code: "SAF", label: "Safety",                  department: "Health and Safety Division",         responsibleParty: "Safety Director" },
  { code: "HR",  label: "Human Resources",         department: "Human Resources Division",           responsibleParty: "VP of Human Resources" },
  { code: "FIN", label: "Finance",                 department: "Finance Division",                   responsibleParty: "CFO" },
  { code: "IT",  label: "Information Technology",  department: "Information Technology Division",    responsibleParty: "Chief Information Officer" },
  { code: "LEG", label: "Legal & Compliance",      department: "Legal and Compliance Division",      responsibleParty: "General Counsel" },
  { code: "QA",  label: "Quality Assurance",       department: "Operations Division",                responsibleParty: "Director of Quality Assurance" },
  { code: "PRO", label: "Procurement",             department: "Operations Division",                responsibleParty: "Director of Supply Chain" },
  { code: "ENG", label: "Engineering",             department: "Research and Development",           responsibleParty: "VP of Engineering" },
  { code: "FAC", label: "Facilities",              department: "Operations Division",                responsibleParty: "VP of Operations" },
  { code: "OPS", label: "Operations",              department: "Operations Division",                responsibleParty: "VP of Operations" },
  { code: "GEN", label: "General",                 department: "Knowledge Management Office",        responsibleParty: "Director of Information Architecture" },
];

function sub(code: string): SubjectDef { return SUBJECT_DEFS.find(s => s.code === code)!; }

// ── Helper: exact word-boundary-safe substring match ──────────────────────────
// Avoids "it" matching inside "quality", "facility", "utilization", etc.
function has(n: string, ...tokens: string[]): boolean {
  return tokens.some(t => {
    if (t.length <= 2) {
      // Short tokens: require word boundaries (surrounded by _ - or start/end)
      return new RegExp(`(^|[_\\-])${t}([_\\-]|$)`).test(n);
    }
    return n.includes(t);
  });
}

// ── Type detection (priority order matters — most specific first) ─────────────

interface TypeDef { code: string; label: string; confidence: number; reasoning: string; }

function detectType(n: string): TypeDef {
  // 1. MEM — explicit "memo" in name takes priority over training/report
  if (has(n, "memo", "memorandum"))
    return { code: "MEM", label: "Memo", confidence: 0.93,
      reasoning: "Filename contains memorandum designator consistent with internal communication or leadership directive." };

  // 2. FRM — explicit "form" keyword before training/report
  if (has(n, "form", "frm-", "checklist", "request_form", "exception_form", "application_form"))
    return { code: "FRM", label: "Form", confidence: 0.92,
      reasoning: "Filename contains form or structured data-collection template designator." };

  // 3. SOP — explicit "sop" keyword takes priority (e.g. Knowledge_Taxonomy_SOP before REF)
  if (has(n, "sop", "standard_operating", "procedure"))
    return { code: "SOP", label: "SOP", confidence: 0.92,
      reasoning: "Filename contains SOP designator consistent with step-by-step operational procedure format." };

  // 4. POL — governance policies
  if (has(n, "policy", "pol-", "acceptable_use", "data_governance", "records_retention"))
    return { code: "POL", label: "Policy", confidence: 0.92,
      reasoning: "Filename contains policy designator consistent with governance-tier documentation issued at VP level or above." };

  // 5. REF — lookup / reference resources (after SOP/POL so "taxonomy" doesn't shadow SOP)
  if (has(n, "glossary", "directory", "taxonomy", "reference", "ref-", "vendor_list", "acronym", "catalog", "index", "lookup", "approved_vendor"))
    return { code: "REF", label: "Reference", confidence: 0.91,
      reasoning: "Filename indicates lookup or reference material consistent with glossary, directory, or taxonomy documentation." };

  // 6. RPT — analytical reports (check before SPE to avoid "spec" in "specification")
  if (has(n, "report", "rpt-", "audit_report", "uptime_report", "utilization_report", "summary", "assessment_result"))
    return { code: "RPT", label: "Report", confidence: 0.89,
      reasoning: "Filename contains report or audit designator consistent with analytical output or findings documentation." };

  // 7. SPE — technical specifications
  if (has(n, "specification", "spe-", "requirement", "infrastructure_spec", "network_spec"))
    return { code: "SPE", label: "Specification", confidence: 0.90,
      reasoning: "Filename contains specification or technical requirements indicator consistent with engineering or system documentation." };

  // 8. CON — contracts and agreements
  if (has(n, "contract", "agreement", "service_level", "nda", "con-"))
    return { code: "CON", label: "Contract", confidence: 0.89,
      reasoning: "Filename indicates a contractual agreement or service-level document." };

  // 9. TRN — training and learning materials (broadest catch — last before OTH)
  if (has(n, "training", "trn-", "awareness", "orientation", "onboarding", "curriculum",
          "learning", "module", "development", "leadership_dev", "leadership_program",
          "development_program", "workshop"))
    return { code: "TRN", label: "Training", confidence: 0.90,
      reasoning: "Filename indicates instructional or training content consistent with Learning and Development materials." };

  return { code: "OTH", label: "Other", confidence: 0.65,
    reasoning: "Document does not match established Meridian classification patterns. Manual reviewer assignment recommended." };
}

// ── Subject detection (priority order matters) ────────────────────────────────

function detectSubject(n: string): { subject: SubjectDef; boost: number } {
  // KM — check first; KMS/DMS docs misclassify to HR/IT when checked later
  if (has(n, "knowledge", "taxonomy", "glossary", "dms", "document_management",
          "repository", "classification", "governance", "data_gov", "information_arch",
          "acronym", "doc_submit", "document_submission", "doc_intel", "intelligence_pilot",
          "kms", "knowledge_system"))
    return { subject: sub("KM"), boost: 0.03 };

  // SAF — use specific safety terms; avoid bare "incident" (which also describes IT sec incidents)
  if (has(n, "safety", "osha", "ppe", "jsa", "hazard", "fire_prev", "confined_space",
          "lockout", "loto", "safety_incident", "near_miss", "erp", "grinding",
          "forklift_op", "chemical_handling", "emergency_response", "safety_orient",
          "safety_audit", "q4_safety", "q3_safety", "q2_safety", "q1_safety"))
    return { subject: sub("SAF"), boost: 0.04 };

  // HR — employee-facing content (but NOT if KMS is also in name → caught above)
  if (has(n, "human_resource", "employee", "onboard", "performance_review", "disciplin",
          "travel", "talent", "handbook", "new_hire", "onboarding_form",
          "training_compliance", "annual_training", "leadership_dev",
          "manager_leadership", "leadership_development", "directory"))
    return { subject: sub("HR"), boost: 0.03 };

  // FIN — includes AR/AP sub-domains
  if (has(n, "finance", "budget", "expense", "capital_expend", "reimburs",
          "accounting", "fiscal", "invoice", "payable", "receivable", "fin-",
          "budget_realign", "budget_except", "ar_aging", "ap_aging", "aging_report",
          "collections", "revenue_recognition", "revenue", "credit_application",
          "three_way_match", "payment_terms", "accounts_payable", "accounts_receivable",
          "invoice_processing", "expense_reimb"))
    return { subject: sub("FIN"), boost: 0.03 };

  // IT — use specific IT keywords only; avoid bare "it"
  if (has(n, "cybersecurity", "cyber", "password", "vpn", "remote_access",
          "data_backup", "network", "api_integr", "incident_response", "cloud",
          "authentication", "uptime", "infrastructure", "systems_uptime", "it_system",
          "acceptable_use", "infosec", "firewall", "siem"))
    return { subject: sub("IT"), boost: 0.03 };

  // LEG
  if (has(n, "legal", "nda", "agreement", "contract", "compliance", "regulatory",
          "records_retention", "retention_policy", "retention", "disposition", "legal_hold"))
    return { subject: sub("LEG"), boost: 0.03 };

  // QA — quality and calibration
  if (has(n, "quality", "inspection", "weld", "dimensional", "ncr", "nonconform",
          "complaint", "spc", "calibration", "calibrat", "manufacturing_quality",
          "first_article", "equipment_calibr"))
    return { subject: sub("QA"), boost: 0.03 };

  // PRO
  if (has(n, "vendor", "supplier", "procurement", "purchase", "supply_chain", "pro-",
          "approved_vendor", "rfq", "sole_source", "vendor_eval", "purchase_order"))
    return { subject: sub("PRO"), boost: 0.03 };

  // ENG
  if (has(n, "engineer", "manufacturing_spec", "technical_req", "architecture",
          "api_spec", "network_spec", "network_infrastructure"))
    return { subject: sub("ENG"), boost: 0.02 };

  // OPS — includes facility relocation memos (VP of Operations comms) before bare FAC check
  if (has(n, "operation", "shift", "inventory", "production", "scheduling", "startup",
          "handover", "facility_relocation", "facility_reloc", "building_reloc", "relocation"))
    return { subject: sub("OPS"), boost: 0.02 };

  // FAC — physical facilities maintenance (bare "facil" after relocation already routed to OPS)
  if (has(n, "facil", "maintenance", "compressor", "hydraulic", "hvac", "building_maint"))
    return { subject: sub("FAC"), boost: 0.02 };

  return { subject: sub("GEN"), boost: 0.00 };
}

// ── Content-based classification (for uploaded .txt files) ───────────────────

const TYPE_CODE_MAP: Record<string, { label: string; confidence: number; reasoning: string }> = {
  MEM: { label: "Memo",          confidence: 0.97, reasoning: "Document ID header identifies this as a Meridian memorandum (MEM type code)." },
  FRM: { label: "Form",          confidence: 0.97, reasoning: "Document ID header identifies this as a Meridian form or checklist (FRM type code)." },
  REF: { label: "Reference",     confidence: 0.97, reasoning: "Document ID header identifies this as a Meridian reference document (REF type code)." },
  POL: { label: "Policy",        confidence: 0.97, reasoning: "Document ID header identifies this as a Meridian governance policy (POL type code)." },
  SOP: { label: "SOP",           confidence: 0.97, reasoning: "Document ID header identifies this as a Meridian standard operating procedure (SOP type code)." },
  RPT: { label: "Report",        confidence: 0.97, reasoning: "Document ID header identifies this as a Meridian analytical report (RPT type code)." },
  SPE: { label: "Specification", confidence: 0.97, reasoning: "Document ID header identifies this as a Meridian technical specification (SPE type code)." },
  CON: { label: "Contract",      confidence: 0.97, reasoning: "Document ID header identifies this as a Meridian contract or agreement (CON type code)." },
  TRN: { label: "Training",      confidence: 0.97, reasoning: "Document ID header identifies this as a Meridian training material (TRN type code)." },
};

function classifyFromContent(content: string, fileName: string): ClassificationResult | null {
  const excerpt = content.slice(0, 3000);

  // Primary: extract Document ID from structured header (e.g. "Document ID: MIG-MEM-FIN-Budget-Q1-2025-022")
  const docIdMatch = excerpt.match(/Document\s+(?:ID|Id|id)[:\s]+MIG-([A-Z]{2,4})-([A-Z]{2,4})-/);
  if (docIdMatch) {
    const typeCode = docIdMatch[1];
    const subjCode = docIdMatch[2];
    const typeDef = TYPE_CODE_MAP[typeCode];
    const subjDef = SUBJECT_DEFS.find(s => s.code === subjCode);
    if (typeDef && subjDef) {
      return {
        docType: typeDef.label,
        typeCode,
        subject: subjDef.label,
        subjectCode: subjCode,
        department: subjDef.department,
        effectiveDate: "",
        responsibleParty: subjDef.responsibleParty,
        confidence: 0.97,
        reasoning: typeDef.reasoning,
      };
    }
  }

  // Fallback: scan content for type-level keywords in first few lines
  const firstLines = excerpt.slice(0, 500).toLowerCase();
  if (firstLines.includes("internal memorandum") || firstLines.includes("memorandum"))
    return null; // fall through to filename + content hybrid below
  return null;
}

// ── Public API ────────────────────────────────────────────────────────────────

let seqCounter = 1;

export function classifyDocument(fileName: string, content?: string): ClassificationResult {
  // For uploaded .txt files with structured Meridian headers — use content first
  if (content && content.length > 50) {
    const fromContent = classifyFromContent(content, fileName);
    if (fromContent) return fromContent;
  }

  const n = fileName.toLowerCase();
  const typeResult = detectType(n);
  const { subject, boost } = detectSubject(n);
  const confidence = Math.min(typeResult.confidence + boost, 0.98);

  return {
    docType: typeResult.label,
    typeCode: typeResult.code,
    subject: subject.label,
    subjectCode: subject.code,
    department: subject.department,
    effectiveDate: "",
    responsibleParty: subject.responsibleParty,
    confidence,
    reasoning: typeResult.reasoning,
  };
}

export function generateStandardName(
  c: ClassificationResult,
  originalName: string,
  seq?: number
): string {
  const year = new Date().getFullYear();
  const seqStr = String(seq ?? seqCounter++).padStart(3, "0");

  const base = originalName
    .replace(/\.(pdf|docx?|xlsx?|txt|csv)$/i, "")
    .replace(/[_-]?\d{13,}/g, "")           // strip Unix ms timestamps
    .replace(/^[Mm]eridian[_-]?/i, "")       // strip "Meridian_" prefix
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .split("-")
    .filter(p => p.length > 1)               // drop single chars
    .slice(0, 5)
    .join("-")
    .toUpperCase();

  return `MIG-${c.typeCode}-${c.subjectCode}-${base}-${year}-${seqStr}`;
}
