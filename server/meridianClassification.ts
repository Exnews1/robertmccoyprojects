/**
 * Meridian Industrial Group – Document Classification Engine
 * Rules-based classifier. In production this would call GPT-4o or a fine-tuned model.
 */

export interface ClassificationResult {
  docType: string;
  subject: string;
  department: string;
  effectiveDate: string;
  responsibleParty: string;
  confidence: number;
  reasoning: string;
}

export function classifyDocument(fileName: string): ClassificationResult {
  const name = fileName.toLowerCase();

  let docType = "Other";
  let subject = "General";
  let department = "Operations";
  let confidence = 0.72;
  let effectiveDate = "";
  let responsibleParty = "";
  let reasoning = "";

  // ── Document Type Detection ────────────────────────────────────────────────
  if (name.includes("policy") || name.includes("ppm")) {
    docType = "Policy"; confidence = 0.91;
    reasoning = "Filename contains policy designator consistent with regulatory or governance-tier documentation.";
  } else if (name.includes("sop") || name.includes("standard_operating")) {
    docType = "SOP"; confidence = 0.93;
    reasoning = "Filename contains SOP designator consistent with sequential operational procedure format.";
  } else if (name.includes("procedure") || name.includes("process") || name.includes("plan") || name.includes("erp") || name.includes("jsa")) {
    docType = "Procedure"; confidence = 0.87;
    reasoning = "Filename pattern matches operational procedure or process control documentation.";
  } else if (name.includes("form") || name.includes("checklist") || name.includes("report") || name.includes("template") || name.includes("ncr") || name.includes("request")) {
    docType = "Form"; confidence = 0.89;
    reasoning = "Filename pattern matches structured input form or standardized reporting template.";
  } else if (name.includes("handbook") || name.includes("guide") || name.includes("manual")) {
    docType = "Handbook"; confidence = 0.88;
    reasoning = "Filename contains handbook or manual designator consistent with reference documentation.";
  } else if (name.includes("memo") || name.includes("memorandum") || name.includes("notice") || name.includes("bulletin")) {
    docType = "Memo"; confidence = 0.84;
    reasoning = "Filename indicates internal communication or directive correspondence format.";
  } else if (name.includes("agreement") || name.includes("contract") || name.includes("nda")) {
    docType = "Other"; confidence = 0.86;
    reasoning = "Filename indicates legal instrument — contract or agreement requiring specialized classification review.";
  } else {
    reasoning = "Document does not match established classification patterns with high confidence. Manual review recommended.";
  }

  // ── Subject + Department Detection ─────────────────────────────────────────
  if (name.includes("safety") || name.includes("osha") || name.includes("jsa") || name.includes("ppe") ||
      name.includes("fire") || name.includes("confined_space") || name.includes("lockout") || name.includes("loto") ||
      name.includes("emergency") || name.includes("erp") || name.includes("hazard")) {
    subject = "Safety"; department = "Health & Safety";
    confidence = Math.min(confidence + 0.04, 0.98);
  } else if (name.includes("hr") || name.includes("employee") || name.includes("hiring") ||
             name.includes("onboarding") || name.includes("performance") || name.includes("disciplin") ||
             name.includes("travel") || name.includes("handbook")) {
    subject = "HR"; department = "Human Resources";
    confidence = Math.min(confidence + 0.03, 0.98);
  } else if (name.includes("finance") || name.includes("budget") || name.includes("expense") ||
             name.includes("capital") || name.includes("reimburs")) {
    subject = "Finance"; department = "Finance";
  } else if (name.includes("it") || name.includes("password") || name.includes("vpn") ||
             name.includes("remote_access") || name.includes("backup") || name.includes("data_")) {
    subject = "IT"; department = "Information Technology";
  } else if (name.includes("legal") || name.includes("nda") || name.includes("agreement") ||
             name.includes("contract") || name.includes("compliance")) {
    subject = "Legal"; department = "Legal & Compliance";
  } else if (name.includes("quality") || name.includes("inspection") || name.includes("weld") ||
             name.includes("dimensional") || name.includes("ncr") || name.includes("nonconform") ||
             name.includes("complaint")) {
    subject = "Quality"; department = "Quality Assurance";
  } else if (name.includes("maintenance") || name.includes("compressor") || name.includes("hydraulic") ||
             name.includes("equipment")) {
    subject = "Maintenance"; department = "Operations";
  } else {
    subject = "Operations"; department = "Operations";
  }

  // ── Responsible Party ──────────────────────────────────────────────────────
  const partyMap: Record<string, string> = {
    "Health & Safety": "HSE Manager",
    "Human Resources": "HR Director",
    "Finance": "CFO / Finance Director",
    "Information Technology": "IT Manager",
    "Legal & Compliance": "General Counsel",
    "Quality Assurance": "Quality Manager",
    "Operations": "Operations Director",
  };
  responsibleParty = partyMap[department] || "Operations Director";

  // ── Standard Name Generation ───────────────────────────────────────────────
  return {
    docType,
    subject,
    department,
    effectiveDate,
    responsibleParty,
    confidence,
    reasoning,
  };
}

const TYPE_CODES: Record<string, string> = {
  Policy: "POL", SOP: "SOP", Procedure: "PRO", Form: "FRM",
  Handbook: "HBK", Memo: "MEM", Other: "OTH",
};
const DEPT_CODES: Record<string, string> = {
  "Health & Safety": "HSE", "Human Resources": "HR", Finance: "FIN",
  "Information Technology": "IT", "Legal & Compliance": "LGL",
  "Quality Assurance": "QA", Operations: "OPS",
};

export function generateStandardName(classification: ClassificationResult, originalName: string): string {
  const typeCode = TYPE_CODES[classification.docType] || "OTH";
  const deptCode = DEPT_CODES[classification.department] || "OPS";
  const year = new Date().getFullYear();

  const base = originalName
    .replace(/\.(pdf|docx?|xlsx?|txt)$/i, "")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .toUpperCase()
    .slice(0, 40);

  return `MIG-${typeCode}-${deptCode}-${base}-${year}-v1`;
}
