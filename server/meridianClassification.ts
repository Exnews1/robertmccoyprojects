/**
 * Meridian Industrial Group – Document Classification Engine
 * Taxonomy: MIG-REF-KM-Taxonomy-2025-001 v2.0
 * Naming convention: [ORG]-[TYPE]-[SUBJECT]-[YYYY]-[SEQ]
 * Types: POL SOP TRN RPT MEM SPE FRM REF | Other → OTH
 * Subjects: HR SAF FIN IT LEG OPS QA PRO KM ENG FAC GEN
 *
 * Rules-based classifier. In production, text extraction + LLM would replace
 * the keyword heuristics below.
 */

export interface ClassificationResult {
  docType: string;     // full label (e.g. "Policy")
  typeCode: string;    // three-letter code (e.g. "POL")
  subject: string;     // full label (e.g. "Information Technology")
  subjectCode: string; // short code (e.g. "IT")
  department: string;  // responsible department
  effectiveDate: string;
  responsibleParty: string;
  confidence: number;
  reasoning: string;
}

// ── Type detection ────────────────────────────────────────────────────────────

interface TypeDef { code: string; label: string; }

function detectType(name: string): { type: TypeDef; confidence: number; reasoning: string } {
  const n = name.toLowerCase();

  if (n.includes("policy") || n.includes("pol-") || n.includes("acceptable_use") || n.includes("data_governance")) {
    return {
      type: { code: "POL", label: "Policy" },
      confidence: 0.92,
      reasoning: "Filename contains policy designator or governance-tier indicator consistent with organizational policy documentation. Issued at VP level or above per taxonomy.",
    };
  }
  if (n.includes("sop") || n.includes("standard_operating") || n.includes("procedure") || n.includes("process")) {
    return {
      type: { code: "SOP", label: "SOP" },
      confidence: 0.91,
      reasoning: "Filename contains SOP designator or procedure indicator consistent with step-by-step operational instruction format.",
    };
  }
  if (n.includes("training") || n.includes("trn-") || n.includes("awareness") || n.includes("module") || n.includes("onboarding") || n.includes("curriculum")) {
    return {
      type: { code: "TRN", label: "Training" },
      confidence: 0.90,
      reasoning: "Filename indicates instructional or training content consistent with Learning and Development materials.",
    };
  }
  if (n.includes("report") || n.includes("rpt-") || n.includes("audit") || n.includes("assessment") || n.includes("analysis") || n.includes("summary")) {
    return {
      type: { code: "RPT", label: "Report" },
      confidence: 0.88,
      reasoning: "Filename contains report or audit designator consistent with analytical output or findings documentation.",
    };
  }
  if (n.includes("memo") || n.includes("mem-") || n.includes("memorandum") || n.includes("notice") || n.includes("bulletin") || n.includes("directive")) {
    return {
      type: { code: "MEM", label: "Memo" },
      confidence: 0.87,
      reasoning: "Filename indicates internal communication or leadership directive consistent with memorandum format.",
    };
  }
  if (n.includes("spec") || n.includes("spe-") || n.includes("specification") || n.includes("requirement") || n.includes("architecture") || n.includes("standard") || n.includes("integration")) {
    return {
      type: { code: "SPE", label: "Specification" },
      confidence: 0.89,
      reasoning: "Filename contains specification or technical requirements indicator consistent with engineering or system documentation.",
    };
  }
  if (n.includes("form") || n.includes("frm-") || n.includes("request") || n.includes("checklist") || n.includes("template") || n.includes("exception") || n.includes("application")) {
    return {
      type: { code: "FRM", label: "Form" },
      confidence: 0.91,
      reasoning: "Filename contains form or request indicator consistent with structured data-collection or workflow-initiation template.",
    };
  }
  if (n.includes("glossary") || n.includes("directory") || n.includes("taxonomy") || n.includes("reference") || n.includes("ref-") || n.includes("list") || n.includes("catalog") || n.includes("index") || n.includes("guide") || n.includes("lookup") || n.includes("vendor") || n.includes("acronym")) {
    return {
      type: { code: "REF", label: "Reference" },
      confidence: 0.90,
      reasoning: "Filename indicates lookup or reference material consistent with glossary, directory, or taxonomy documentation.",
    };
  }

  return {
    type: { code: "OTH", label: "Other" },
    confidence: 0.65,
    reasoning: "Document does not match established Meridian classification patterns with high confidence. Manual reviewer assignment recommended.",
  };
}

// ── Subject / Department detection ────────────────────────────────────────────

interface SubjectDef {
  code: string;
  label: string;
  department: string;
  responsibleParty: string;
}

const SUBJECTS: SubjectDef[] = [
  { code: "SAF", label: "Safety",              department: "Health and Safety Division",         responsibleParty: "Safety Director" },
  { code: "HR",  label: "Human Resources",     department: "Human Resources Division",           responsibleParty: "VP of Human Resources" },
  { code: "FIN", label: "Finance",             department: "Finance Division",                   responsibleParty: "CFO" },
  { code: "IT",  label: "Information Technology", department: "Information Technology Division", responsibleParty: "Chief Information Officer" },
  { code: "LEG", label: "Legal & Compliance",  department: "Legal and Compliance Division",      responsibleParty: "General Counsel" },
  { code: "OPS", label: "Operations",          department: "Operations Division",                responsibleParty: "VP of Operations" },
  { code: "QA",  label: "Quality Assurance",   department: "Operations Division",                responsibleParty: "Director of Quality Assurance" },
  { code: "PRO", label: "Procurement",         department: "Operations Division",                responsibleParty: "Director of Supply Chain" },
  { code: "KM",  label: "Knowledge Management",department: "Knowledge Management Office",        responsibleParty: "Director of Information Architecture" },
  { code: "ENG", label: "Engineering",         department: "Research and Development",           responsibleParty: "VP of Engineering" },
  { code: "FAC", label: "Facilities",          department: "Operations Division",                responsibleParty: "VP of Operations" },
  { code: "GEN", label: "General",             department: "Knowledge Management Office",        responsibleParty: "Director of Information Architecture" },
];

function detectSubject(name: string, typeCode: string): { subject: SubjectDef; boost: number } {
  const n = name.toLowerCase();

  if (n.includes("safety") || n.includes("osha") || n.includes("ppe") || n.includes("jsa") ||
      n.includes("hazard") || n.includes("fire") || n.includes("confined") || n.includes("lockout") ||
      n.includes("loto") || n.includes("incident") || n.includes("emergency") || n.includes("erp") ||
      n.includes("grinding") || n.includes("forklift_op") || n.includes("chemical"))
    return { subject: SUBJECTS.find(s => s.code === "SAF")!, boost: 0.04 };

  if (n.includes("hr") || n.includes("human_resource") || n.includes("employee") || n.includes("onboard") ||
      n.includes("performance") || n.includes("disciplin") || n.includes("travel") || n.includes("talent") ||
      n.includes("handbook") || n.includes("directory") || (n.includes("new_hire") && typeCode === "FRM"))
    return { subject: SUBJECTS.find(s => s.code === "HR")!, boost: 0.03 };

  if (n.includes("finance") || n.includes("budget") || n.includes("expense") || n.includes("capital") ||
      n.includes("reimburs") || n.includes("accounting") || n.includes("fiscal") || n.includes("invoice") ||
      n.includes("payable") || n.includes("fin-"))
    return { subject: SUBJECTS.find(s => s.code === "FIN")!, boost: 0.03 };

  if (n.includes("it") || n.includes("password") || n.includes("vpn") || n.includes("remote_access") ||
      n.includes("backup") || n.includes("cyber") || n.includes("network") || n.includes("data_backup") ||
      n.includes("api") || n.includes("acceptable_use") || n.includes("cloud") || n.includes("security_awareness") ||
      n.includes("infosec") || n.includes("authentication"))
    return { subject: SUBJECTS.find(s => s.code === "IT")!, boost: 0.03 };

  if (n.includes("legal") || n.includes("nda") || n.includes("agreement") || n.includes("contract") ||
      n.includes("compliance") || n.includes("gdpr") || n.includes("regulatory"))
    return { subject: SUBJECTS.find(s => s.code === "LEG")!, boost: 0.03 };

  if (n.includes("quality") || n.includes("inspection") || n.includes("weld") || n.includes("dimensional") ||
      n.includes("ncr") || n.includes("nonconform") || n.includes("complaint") || n.includes("spc"))
    return { subject: SUBJECTS.find(s => s.code === "QA")!, boost: 0.03 };

  if (n.includes("vendor") || n.includes("supplier") || n.includes("procurement") || n.includes("purchase") ||
      n.includes("supply_chain") || n.includes("pro-"))
    return { subject: SUBJECTS.find(s => s.code === "PRO")!, boost: 0.03 };

  if (n.includes("knowledge") || n.includes("taxonomy") || n.includes("glossary") || n.includes("km") ||
      n.includes("dms") || n.includes("document_management") || n.includes("repository") ||
      n.includes("classification") || n.includes("governance") || n.includes("data_gov") ||
      n.includes("information_arch") || n.includes("acronym"))
    return { subject: SUBJECTS.find(s => s.code === "KM")!, boost: 0.03 };

  if (n.includes("engineer") || n.includes("r&d") || n.includes("specification") || n.includes("technical") ||
      n.includes("architecture") || n.includes("integration") || n.includes("api"))
    return { subject: SUBJECTS.find(s => s.code === "ENG")!, boost: 0.02 };

  if (n.includes("facil") || n.includes("maintenance") || n.includes("compressor") || n.includes("hydraulic") ||
      n.includes("hvac") || n.includes("building"))
    return { subject: SUBJECTS.find(s => s.code === "FAC")!, boost: 0.02 };

  if (n.includes("operation") || n.includes("shift") || n.includes("inventory") || n.includes("production") ||
      n.includes("scheduling") || n.includes("startup") || n.includes("handover"))
    return { subject: SUBJECTS.find(s => s.code === "OPS")!, boost: 0.02 };

  return { subject: SUBJECTS.find(s => s.code === "GEN")!, boost: 0.00 };
}

// ── Public API ────────────────────────────────────────────────────────────────

let seqCounter = 1;

export function classifyDocument(fileName: string): ClassificationResult {
  const { type, confidence: baseConf, reasoning } = detectType(fileName);
  const { subject, boost } = detectSubject(fileName, type.code);
  const confidence = Math.min(baseConf + boost, 0.98);

  return {
    docType: type.label,
    typeCode: type.code,
    subject: subject.label,
    subjectCode: subject.code,
    department: subject.department,
    effectiveDate: "",
    responsibleParty: subject.responsibleParty,
    confidence,
    reasoning,
  };
}

export function generateStandardName(
  classification: ClassificationResult,
  originalName: string,
  seq?: number
): string {
  const year = new Date().getFullYear();
  const seqStr = String(seq ?? seqCounter++).padStart(3, "0");

  // Strip extension, timestamps (long numeric strings), and "Meridian_" prefix
  const base = originalName
    .replace(/\.(pdf|docx?|xlsx?|txt|csv)$/i, "")
    .replace(/[_-]?\d{13,}/g, "")          // strip Unix ms timestamps
    .replace(/^[Mm]eridian[_-]?/i, "")      // strip "Meridian_" prefix
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .split("-")
    .filter(p => p.length > 1)              // drop single chars
    .slice(0, 5)
    .join("-")
    .toUpperCase();

  return `MIG-${classification.typeCode}-${classification.subjectCode}-${base}-${year}-${seqStr}`;
}
