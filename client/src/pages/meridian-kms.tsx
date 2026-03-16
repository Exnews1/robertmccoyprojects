import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Search, X, FileText, Shield, BookOpen, ClipboardList,
  BarChart3, Code2, GraduationCap, FileSignature, Layers,
  CheckCircle2, Clock, Database, ArrowLeft, RefreshCw, ExternalLink,
  User, Calendar, Briefcase, Tag, Percent, FolderOpen, List, LayoutGrid,
  Trash2, AlertTriangle, Loader2, DollarSign, TrendingUp, TrendingDown,
  ChevronUp, ChevronDown as ChevronDownIcon, Filter, Receipt, CreditCard, CheckCheck,
  Eye, Printer, Building2, MapPin, Lock
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

// ── Document content engine ───────────────────────────────────────────────────

function extractDocTitle(standardName: string): string {
  const parts = standardName.split("-");
  // Format: MIG-TYPE-SUBJECT-TITLE-WORDS-YEAR-SEQ
  // Drop first 3 (MIG, type code, subject code) and last 2 (year, seq)
  const raw = parts.slice(3, parts.length - 2);
  return raw.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(" ");
}

type DocSection = { heading: string; body: string[] };

function generateDocSections(doc: KMSDoc): DocSection[] {
  const title = extractDocTitle(doc.standardName);
  const dept = doc.department;
  const resp = doc.responsibleParty || "Compliance Officer";
  const subj = doc.subject;
  const intro = `This ${doc.docType.toLowerCase()} has been prepared by ${dept} in accordance with Meridian Industrial Group's operational standards and governance framework. It applies to all personnel operating within the ${subj} function and affiliated departments.`;

  switch (doc.docType) {
    case "Policy": return [
      { heading: "1. PURPOSE", body: [`This policy establishes the standards and requirements for ${title.toLowerCase()} at Meridian Industrial Group. It defines the principles, guidelines, and accountabilities necessary to maintain ${subj.toLowerCase()} compliance across all business units.`, intro] },
      { heading: "2. SCOPE", body: [`This policy applies to all Meridian Industrial Group employees, contractors, and third-party partners engaged in activities related to ${subj.toLowerCase()}. It covers all facilities, systems, and processes managed by ${dept}.`, `Exceptions to this policy must be formally approved by the ${resp} and documented in accordance with MIG exception management procedures.`] },
      { heading: "3. POLICY STATEMENT", body: [`Meridian Industrial Group is committed to maintaining the highest standards of ${title.toLowerCase()}. All personnel are required to comply with the provisions of this policy and to support its effective implementation.`, `The organization will provide adequate resources, training, and oversight mechanisms to ensure compliance. Violations of this policy may result in disciplinary action up to and including termination of employment.`] },
      { heading: "4. RESPONSIBILITIES", body: [`${resp}: Responsible for oversight, implementation, and enforcement of this policy. Ensures annual review and updates as required.`, `${dept} Manager: Ensures policy communication to all team members, monitors compliance, and reports deviations to the ${resp}.`, `All Employees: Comply with policy requirements, complete required training, and report non-compliance through appropriate channels.`] },
      { heading: "5. DEFINITIONS", body: [`${subj} — refers to all activities, processes, and systems falling under the scope of Meridian Industrial Group's ${subj.toLowerCase()} function.`, `Non-Compliance — any failure to meet the requirements established in this policy or associated procedures.`, `Responsible Party — the designated individual or team accountable for policy implementation and oversight.`] },
      { heading: "6. COMPLIANCE AND ENFORCEMENT", body: [`Compliance with this policy is mandatory for all in-scope personnel. ${dept} will conduct periodic audits to verify adherence. Audit findings are reported to senior leadership quarterly.`, `Non-compliance identified through audits, self-assessments, or incident reports will be addressed through MIG's corrective action process.`] },
      { heading: "7. REFERENCES", body: [`• MIG Enterprise Governance Framework v4.0\n• ISO 9001:2015 Quality Management System Requirements\n• MIG-POL-GEN-COMPLIANCE-POLICY\n• Applicable regulatory standards for ${subj.toLowerCase()}`] },
    ];

    case "SOP": return [
      { heading: "1. PURPOSE AND SCOPE", body: [`This Standard Operating Procedure (SOP) provides step-by-step instructions for ${title.toLowerCase()} within ${dept}. It ensures consistency, accuracy, and compliance with Meridian Industrial Group's operational standards.`, intro] },
      { heading: "2. REQUIRED RESOURCES", body: [`Personnel: Qualified staff members assigned to ${dept}, with training completion verified for this procedure.\nSystems: MIG internal systems as designated by ${resp}.\nDocuments: Associated forms, checklists, and reference materials listed in Section 7.`] },
      { heading: "3. PREREQUISITES", body: [`Prior to initiating this procedure, ensure the following conditions are met:\n• All required personnel have completed mandatory training\n• Necessary system access and authorizations are in place\n• Supporting materials and tools are available\n• Prior review of relevant policies has been completed`] },
      { heading: "4. PROCEDURE", body: [`Step 1 — Initiation: Verify all prerequisites (Section 3) are satisfied. Document start time and personnel involved in the designated log system.`, `Step 2 — Preparation: Gather all required documentation and materials. Review applicable checklists. Notify stakeholders per ${subj} communication protocols.`, `Step 3 — Execution: Perform the ${title.toLowerCase()} procedure in accordance with approved methods. Document each stage in the MIG tracking system as work progresses.`, `Step 4 — Quality Check: Upon completion, verify all steps have been executed correctly. Compare outputs against established benchmarks. Escalate deviations to ${resp} immediately.`, `Step 5 — Documentation and Close-Out: Complete all required records. File documentation in the ${subj} repository. Notify relevant stakeholders of completion.`] },
      { heading: "5. QUALITY AND CONTROL MEASURES", body: [`Periodic audits of this procedure will be conducted by ${dept} to verify compliance and effectiveness. Any process deviations or near-misses must be documented and reported to ${resp} within 24 hours.`] },
      { heading: "6. DOCUMENTATION REQUIREMENTS", body: [`All activities performed under this SOP must be documented using MIG-approved forms. Records must be retained for a minimum of seven (7) years in accordance with MIG records management policy.`] },
      { heading: "7. REFERENCES", body: [`• MIG Quality Management Policy\n• Relevant ${subj} regulatory requirements\n• ${resp} — primary contact for procedure questions\n• MIG Training Registry for prerequisite verification`] },
    ];

    case "Report": return [
      { heading: "EXECUTIVE SUMMARY", body: [`This report presents findings related to ${title.toLowerCase()} for the reporting period. Prepared by ${dept} under the direction of ${resp}, it is intended for senior leadership review.`, `Key findings indicate continued progress in ${subj.toLowerCase()} performance metrics, with specific areas identified for improvement as detailed in the recommendations section.`] },
      { heading: "BACKGROUND", body: [`${dept} conducts periodic reporting on ${subj.toLowerCase()} activities as required by MIG's governance framework. This report covers the designated period and reflects data collected through established monitoring systems.`] },
      { heading: "METHODOLOGY", body: [`Data was collected through a combination of system-generated metrics, manual reporting, and stakeholder interviews. All data sources were verified against MIG's primary records. Analysis was performed by ${dept} personnel using established analytical frameworks consistent with MIG's approved reporting standards.`] },
      { heading: "KEY FINDINGS", body: [`Finding 1: ${subj} operations met or exceeded targets in the majority of assessed categories during the reporting period.`, `Finding 2: A total of 97 data points were reviewed across all relevant ${subj.toLowerCase()} metrics, showing consistent performance compared to the prior period benchmark.`, `Finding 3: Areas requiring attention were identified in three operational categories. These are being addressed through targeted corrective actions coordinated by ${resp}.`] },
      { heading: "RECOMMENDATIONS", body: [`1. Continue current ${subj.toLowerCase()} monitoring protocols with quarterly review cadence.\n2. Implement enhanced tracking for the three identified performance gaps.\n3. Provide additional training resources for teams below target.\n4. Review and update relevant SOPs to reflect operational improvements identified during this period.`] },
      { heading: "CONCLUSION", body: [`Overall, ${dept}'s ${subj.toLowerCase()} performance remains at an acceptable level with clear pathways for continued improvement. The recommendations, when implemented, will strengthen MIG's operational posture in the ${subj.toLowerCase()} domain.`] },
    ];

    case "Training": return [
      { heading: "TRAINING OBJECTIVES", body: [`Upon completion, participants will be able to:\n• Understand the key principles of ${title.toLowerCase()} as applied to ${dept}\n• Apply established protocols and procedures in daily work\n• Identify and respond appropriately to non-compliance situations\n• Access and utilize relevant resources and support channels`] },
      { heading: "TARGET AUDIENCE", body: [`Required for all personnel in ${dept} and affiliated roles with responsibilities related to ${subj.toLowerCase()}. Prerequisite: MIG New Employee Orientation.`] },
      { heading: "MODULE 1 — FOUNDATIONS", body: [`Introduction to ${title} at Meridian Industrial Group. Covers the regulatory and policy landscape governing ${subj.toLowerCase()} activities, MIG's organizational structure, and the role of ${dept} in maintaining standards.`] },
      { heading: "MODULE 2 — CORE PROCEDURES", body: [`Covers operational procedures relevant to ${title.toLowerCase()}: step-by-step workflows, system navigation, and documentation standards. Case studies illustrating compliant and non-compliant scenarios are included for discussion.`] },
      { heading: "MODULE 3 — ROLES AND RESPONSIBILITIES", body: [`Clear delineation of responsibilities for all roles involved in ${subj.toLowerCase()} activities. ${resp} is the primary escalation contact. Participants will practice identifying the appropriate response channel for a variety of scenario types.`] },
      { heading: "ASSESSMENT", body: [`Participants must complete a competency assessment with a minimum score of 80% to receive credit. Administered through the MIG Learning Management System. Remediation is available for participants below the threshold.`] },
      { heading: "RESOURCES", body: [`• ${resp} — Subject Matter Expert\n• MIG ${subj} Policy Suite — available in the KMS portal\n• Learning Management System — completion records\n• ${dept} team — for operational questions`] },
    ];

    case "Memo": return [
      { heading: "MEMORANDUM", body: [`TO: All ${dept} Personnel and Relevant Stakeholders`, `FROM: ${resp}, ${dept}`, `DATE: ${fmtDate(doc.effectiveDate || doc.approvedAt)}`, `SUBJECT: ${title}`, `CLASSIFICATION: Internal Distribution Only`] },
      { heading: "PURPOSE", body: [`This memorandum provides guidance and updated information regarding ${title.toLowerCase()} affecting ${dept} and associated personnel. The information herein is effective immediately unless otherwise stated.`] },
      { heading: "BACKGROUND", body: [`${dept} has completed a review of current ${subj.toLowerCase()} operations and identified the following developments requiring communication to all affected parties. This memo supplements existing policy documentation and does not supersede standing governance requirements.`] },
      { heading: "DETAILS", body: [`The following changes or notifications are communicated through this memorandum:\n\n1. Updated operational guidance for ${title.toLowerCase()} activities, effective as of the date of this memo.\n2. Revised documentation requirements aligned with MIG's current governance framework.\n3. Clarification of role responsibilities as they relate to the items addressed herein.`, `Personnel with questions should contact ${resp} directly or submit inquiries through established ${dept} communication channels.`] },
      { heading: "ACTION REQUIRED", body: [`Recipients must acknowledge receipt through the MIG document management system by the date specified in the distribution notice. Any required procedural changes should be implemented immediately.`] },
    ];

    case "Reference": return [
      { heading: "OVERVIEW", body: [`This reference document provides quick-access guidance for ${title.toLowerCase()} applicable to ${dept} and affiliated functions. Designed as a working reference for day-to-day operational use.`, intro] },
      { heading: "KEY CONCEPTS AND DEFINITIONS", body: [`${subj} — All activities, systems, and resources designated under ${subj.toLowerCase()} at Meridian Industrial Group.`, `Standard Operating Environment — The approved configuration and procedural baseline for ${dept} operations.`, `Escalation Path — The defined chain of communication for issues requiring senior review, beginning with the direct supervisor and proceeding to ${resp}.`, `Compliance Indicator — Any metric or data point used to assess adherence to ${subj.toLowerCase()} requirements.`] },
      { heading: "QUICK REFERENCE — KEY CONTACTS", body: [`Primary Contact: ${resp}, ${dept}\nEscalation: ${dept} Director\nCompliance Oversight: MIG Compliance Office\nTechnology Support: IT Help Desk (ext. 5000)`] },
      { heading: "STANDARD PROCEDURES SUMMARY", body: [`Refer to the following SOPs for detailed procedural guidance:\n• Standard procedures for routine ${subj.toLowerCase()} activities\n• Escalation procedures for non-standard situations\n• Documentation and records management requirements\n• Audit and review procedures (quarterly cadence)`] },
      { heading: "APPLICABLE STANDARDS", body: [`• MIG Enterprise Governance Framework\n• ISO 9001:2015 Quality Management\n• Applicable ${subj} regulatory requirements\n• MIG Information Security Policy (where systems are involved)`] },
    ];

    case "Form": return [
      { heading: "FORM INSTRUCTIONS", body: [`Used to document ${title.toLowerCase()} activities within ${dept}. Complete all required fields (marked *) in full. Incomplete forms will be returned for correction.`, `Submit completed forms to ${resp} via the MIG document management system. Retain a copy in departmental records.`] },
      { heading: "SECTION A — IDENTIFICATION", body: [`Form Number: ________________  Date: ________________\nPrepared By: ________________  Department: ${dept}\nEvent/Activity Reference: ________________  Period Covered: ________________`] },
      { heading: "SECTION B — ACTIVITY DETAILS", body: [`1. Description of ${subj.toLowerCase()} activity or event:\n   _______________________________________________\n\n2. Personnel involved:\n   _______________________________________________\n\n3. Systems or resources utilized:\n   _______________________________________________\n\n4. Outcome or result:\n   _______________________________________________`] },
      { heading: "SECTION C — COMPLIANCE VERIFICATION", body: [`Check all applicable:\n\n☐  Activity performed in accordance with applicable SOPs\n☐  Required personnel completed prerequisite training\n☐  Documentation requirements met\n☐  No deviations from standard procedures\n☐  Deviations documented and reported (attach deviation report if applicable)`] },
      { heading: "SECTION D — AUTHORIZATION", body: [`Submitter Signature: ________________________  Date: ____________\n\nReviewed By (${resp}): ________________________  Date: ____________\n\nApproved By: ________________________  Date: ____________`] },
    ];

    case "Specification": return [
      { heading: "OVERVIEW", body: [`This specification defines the technical and operational requirements for ${title.toLowerCase()} within ${dept}. It establishes minimum acceptable standards and performance criteria that must be met.`, intro] },
      { heading: "FUNCTIONAL REQUIREMENTS", body: [`FR-001: System or process must operate within defined parameters without manual intervention under normal conditions.\nFR-002: All outputs must meet quality standards as defined by ${dept} and approved by ${resp}.\nFR-003: Logging and audit trail capabilities must be maintained per MIG records management policy.\nFR-004: Integration with existing MIG systems must be achieved without disruption to current operations.`] },
      { heading: "TECHNICAL REQUIREMENTS", body: [`TR-001: Compliance with MIG technical standards as documented in the IT Architecture Framework.\nTR-002: Security requirements aligned with MIG Information Security Policy.\nTR-003: Availability of 99.5% uptime during business hours.\nTR-004: Data retention per MIG records retention schedule (minimum 7 years for operational data).`] },
      { heading: "PERFORMANCE CRITERIA", body: [`All implementations must demonstrate:\n• Response/processing time within defined SLA thresholds\n• Error rate below 0.5% under standard operating conditions\n• Successful integration testing across all affected systems\n• Complete documentation prior to production deployment`] },
      { heading: "ACCEPTANCE CRITERIA", body: [`Implementation is complete when:\n1. All functional and technical requirements are verified through testing\n2. ${resp} has reviewed and approved test results\n3. Training is completed for all affected personnel\n4. Documentation is complete and filed in the KMS`] },
    ];

    default: return [
      { heading: "DOCUMENT OVERVIEW", body: [intro] },
      { heading: "CONTENT", body: [`This ${doc.docType.toLowerCase()} provides official guidance and information for ${title.toLowerCase()} within the scope of ${dept} at Meridian Industrial Group.`, `For questions or additional information, contact ${resp} or the ${dept} management team.`] },
    ];
  }
}

// ── Document Viewer Modal ──────────────────────────────────────────────────────

function DocumentViewerModal({ doc, onClose }: { doc: KMSDoc; onClose: () => void }) {
  const sections = generateDocSections(doc);
  const title = extractDocTitle(doc.standardName);
  const colors = SUBJECT_COLORS[doc.subject] || SUBJECT_COLORS["General"];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm overflow-y-auto py-8 px-4" onClick={e => { if (e.target === e.currentTarget) onClose(); }} data-testid="modal-document-viewer">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-2xl overflow-hidden">

        {/* Viewer controls bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${colors.bg} ${colors.text}`}>{doc.docType.charAt(0)}</div>
            <span className="text-xs text-slate-400 font-mono truncate max-w-xs">{doc.standardName}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-700 hover:bg-slate-600 rounded px-2.5 py-1 transition-colors" data-testid="button-print-doc">
              <Printer className="h-3.5 w-3.5" /> Print
            </button>
            <button onClick={onClose} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-700 hover:bg-slate-600 rounded px-2.5 py-1 transition-colors" data-testid="button-close-viewer">
              <X className="h-3.5 w-3.5" /> Close
            </button>
          </div>
        </div>

        {/* Document body — white paper */}
        <div className="bg-white text-gray-900 px-14 py-12 font-sans print:px-8">

          {/* Letterhead */}
          <div className="flex items-start justify-between pb-6 border-b-2 border-gray-800 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-amber-700 rounded flex items-center justify-center text-white text-2xl font-bold font-serif">M</div>
              <div>
                <p className="text-lg font-bold text-gray-900 tracking-tight leading-tight">Meridian Industrial Group</p>
                <p className="text-xs text-gray-500 leading-tight">Knowledge Management System</p>
                <p className="text-xs text-gray-500 leading-tight">Meridian, TX 76665 · MIG-OPS-CONTROL</p>
              </div>
            </div>
            <div className="text-right text-xs text-gray-500 space-y-0.5">
              <div className="flex items-center gap-1.5 justify-end"><Lock className="h-3 w-3" /><span className="font-semibold text-gray-700">INTERNAL USE ONLY</span></div>
              <p className="font-mono text-gray-600">{doc.standardName}</p>
              <p>Effective: {fmtDate(doc.effectiveDate || doc.approvedAt)}</p>
              <p>Rev: {doc.approvedAt?.slice(0, 4) || "2025"}.1</p>
            </div>
          </div>

          {/* Doc type badge + title */}
          <div className="mb-8">
            <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 ${
              doc.docType === "Policy" ? "bg-violet-100 text-violet-700" :
              doc.docType === "SOP" ? "bg-blue-100 text-blue-700" :
              doc.docType === "Report" ? "bg-emerald-100 text-emerald-700" :
              doc.docType === "Training" ? "bg-amber-100 text-amber-700" :
              doc.docType === "Memo" ? "bg-orange-100 text-orange-700" :
              doc.docType === "Reference" ? "bg-cyan-100 text-cyan-700" :
              doc.docType === "Form" ? "bg-gray-100 text-gray-600" :
              doc.docType === "Specification" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"
            }`}>{doc.docType}</span>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{title}</h1>
            <p className="text-sm text-gray-500 mt-1">{doc.subject} · {doc.department}</p>
          </div>

          {/* Metadata table */}
          <table className="w-full text-xs mb-10 border border-gray-200 rounded">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="px-3 py-2 bg-gray-50 font-semibold text-gray-600 w-40">Document Number</td>
                <td className="px-3 py-2 font-mono text-gray-700">{doc.standardName}</td>
                <td className="px-3 py-2 bg-gray-50 font-semibold text-gray-600 w-40">Document Type</td>
                <td className="px-3 py-2 text-gray-700">{doc.docType}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="px-3 py-2 bg-gray-50 font-semibold text-gray-600">Department</td>
                <td className="px-3 py-2 text-gray-700">{doc.department}</td>
                <td className="px-3 py-2 bg-gray-50 font-semibold text-gray-600">Subject Area</td>
                <td className="px-3 py-2 text-gray-700">{doc.subject}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="px-3 py-2 bg-gray-50 font-semibold text-gray-600">Responsible Party</td>
                <td className="px-3 py-2 text-gray-700">{doc.responsibleParty || "Compliance Officer"}</td>
                <td className="px-3 py-2 bg-gray-50 font-semibold text-gray-600">Effective Date</td>
                <td className="px-3 py-2 text-gray-700">{fmtDate(doc.effectiveDate || doc.approvedAt)}</td>
              </tr>
              <tr>
                <td className="px-3 py-2 bg-gray-50 font-semibold text-gray-600">Approved By</td>
                <td className="px-3 py-2 text-gray-700">{doc.approvedBy || "Operations Manager"}</td>
                <td className="px-3 py-2 bg-gray-50 font-semibold text-gray-600">Classification</td>
                <td className="px-3 py-2 text-gray-700">Internal Use Only</td>
              </tr>
            </tbody>
          </table>

          {/* Document sections */}
          <div className="space-y-7">
            {sections.map((section, i) => (
              <div key={i}>
                <h2 className={`text-sm font-bold uppercase tracking-wide mb-3 ${section.heading === "MEMORANDUM" ? "text-gray-900 text-base" : "text-gray-700"} ${i === 0 && doc.docType === "Memo" ? "sr-only" : ""}`}>
                  {section.heading !== "MEMORANDUM" ? section.heading : ""}
                </h2>
                {section.heading === "MEMORANDUM" ? (
                  <div className="bg-gray-50 border border-gray-200 rounded p-4 space-y-1 mb-2">
                    {section.body.map((line, j) => <p key={j} className="text-sm text-gray-700 font-semibold">{line}</p>)}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {section.body.map((para, j) => (
                      <p key={j} className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{para}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Signature block */}
          <div className="mt-12 pt-8 border-t border-gray-300">
            <div className="grid grid-cols-3 gap-8">
              {[["Prepared By", doc.department], ["Reviewed By", doc.responsibleParty || "Compliance Officer"], ["Approved By", "Operations Director"]].map(([label, role]) => (
                <div key={label}>
                  <div className="border-b border-gray-400 pb-1 mb-1.5 h-8" />
                  <p className="text-xs font-semibold text-gray-600">{label}</p>
                  <p className="text-xs text-gray-500">{role}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Date: ___________</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
            <span>Meridian Industrial Group · Knowledge Management System</span>
            <span className="font-mono">{doc.standardName} · Page 1 of 1</span>
            <span>CONFIDENTIAL — INTERNAL USE ONLY</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Doc card ──────────────────────────────────────────────────────────────────

function DocCard({ doc, onClick, selected, onOpen }: { doc: KMSDoc; onClick: () => void; selected: boolean; onOpen: () => void }) {
  const Icon = getIcon(doc.docType);
  const colors = SUBJECT_COLORS[doc.subject] || SUBJECT_COLORS["General"];
  return (
    <div className={`relative border rounded-lg transition-all hover:border-slate-500 hover:bg-slate-800/80 ${selected ? "border-amber-600 bg-slate-800/80 ring-1 ring-amber-600/30" : "border-slate-700 bg-slate-900/60"}`} data-testid={`card-kms-doc-${doc.id}`}>
      <button onClick={onClick} className="w-full text-left p-4 focus:outline-none">
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
      <div className="px-4 pb-3 flex justify-end">
        <button onClick={e => { e.stopPropagation(); onOpen(); }} className="flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-300 bg-amber-900/20 hover:bg-amber-900/40 border border-amber-800/50 rounded px-2.5 py-1 transition-colors font-semibold" data-testid={`button-open-doc-${doc.id}`}>
          <Eye className="h-3.5 w-3.5" /> Open Document
        </button>
      </div>
    </div>
  );
}

// ── Doc detail panel ──────────────────────────────────────────────────────────

function DocDetailPanel({ doc, onClose, onOpen }: { doc: KMSDoc; onClose: () => void; onOpen: () => void }) {
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
          <div className="flex items-center gap-1.5">
            <button onClick={onOpen} className="flex items-center gap-1 text-xs text-amber-500 hover:text-amber-300 bg-amber-900/20 hover:bg-amber-900/40 border border-amber-800/50 rounded px-2 py-1 transition-colors font-semibold" data-testid="button-open-from-panel"><Eye className="h-3 w-3" />Open</button>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300" data-testid="button-close-doc-detail"><X className="h-4 w-4" /></button>
          </div>
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

// ── Financial Document Viewer ─────────────────────────────────────────────────

function FinancialDocViewer({ record, onClose }: { record: FinancialRecord; onClose: () => void }) {
  const isAR = record.recordType === "AR";
  const isPaid = record.status === "paid";

  const subtotal = record.amount;
  const tax = Math.round(subtotal * 0.0875 * 100) / 100;
  const total = subtotal + tax;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm overflow-y-auto py-8 px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      data-testid="modal-financial-viewer"
    >
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden">

        {/* Controls bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${isAR ? "bg-emerald-900/60 text-emerald-400" : "bg-sky-900/60 text-sky-400"}`}>
              {isAR ? "ACCOUNTS RECEIVABLE" : "ACCOUNTS PAYABLE"}
            </span>
            <span className="text-xs text-slate-400 font-mono">{record.invoiceNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-700 hover:bg-slate-600 rounded px-2.5 py-1 transition-colors" data-testid="button-print-financial">
              <Printer className="h-3.5 w-3.5" /> Print
            </button>
            <button onClick={onClose} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-700 hover:bg-slate-600 rounded px-2.5 py-1 transition-colors" data-testid="button-close-financial-viewer">
              <X className="h-3.5 w-3.5" /> Close
            </button>
          </div>
        </div>

        {/* Document body */}
        <div className="bg-white text-gray-900 px-10 py-10 font-sans print:px-8">

          {/* Letterhead */}
          <div className="flex items-start justify-between pb-6 border-b-2 border-gray-800 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-amber-700 rounded flex items-center justify-center text-white text-2xl font-bold font-serif">M</div>
              <div>
                <p className="text-lg font-bold text-gray-900 tracking-tight leading-tight">Meridian Industrial Group</p>
                <p className="text-xs text-gray-500">Meridian, TX 76665</p>
                <p className="text-xs text-gray-500">EIN: 74-XXXXXXX · accounts@meridianig.com</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-800 tracking-tight uppercase">
                {isAR ? "Invoice" : "Payment Voucher"}
              </p>
              <p className="text-sm font-mono text-amber-700 mt-1 font-bold">{record.invoiceNumber}</p>
              <div className={`inline-block mt-2 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full ${
                isPaid ? "bg-emerald-100 text-emerald-700" :
                record.status === "open" ? "bg-amber-100 text-amber-700" :
                "bg-sky-100 text-sky-700"
              }`}>
                {record.status === "paid" ? "✓ Paid" : record.status === "open" ? "Outstanding" : "Pending"}
              </div>
            </div>
          </div>

          {/* Bill To / From */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{isAR ? "Bill To" : "Received From"}</p>
              <p className="font-bold text-gray-800">{isAR ? record.counterparty : record.counterparty}</p>
              <p className="text-sm text-gray-500 mt-0.5">{isAR ? "Accounts Payable Department" : "Accounts Receivable Department"}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{isAR ? "From" : "Payable To"}</p>
              <p className="font-bold text-gray-800">{isAR ? "Meridian Industrial Group" : record.counterparty}</p>
              <p className="text-sm text-gray-500 mt-0.5">{isAR ? "Accounts Receivable · Meridian, TX" : "Per vendor terms and contract"}</p>
            </div>
          </div>

          {/* Date details */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              ["Invoice Date", fmtDate(record.invoiceDate)],
              ["Due Date", fmtDate(record.dueDate)],
              [isPaid ? "Paid Date" : "Status", isPaid ? fmtDate(record.paidDate) : record.status.charAt(0).toUpperCase() + record.status.slice(1)],
            ].map(([label, val]) => (
              <div key={label} className="bg-gray-50 border border-gray-200 rounded p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">{val}</p>
              </div>
            ))}
          </div>

          {/* Line items */}
          <table className="w-full text-sm mb-6 border border-gray-200 rounded overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="text-left px-4 py-2.5 font-semibold">Description</th>
                <th className="text-right px-4 py-2.5 font-semibold w-32">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 text-gray-700">{record.description}</td>
                <td className="px-4 py-3 text-right font-mono text-gray-800">{fmtMoney(subtotal)}</td>
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50">
                <td className="px-4 py-3 text-gray-500 text-xs">Applicable Taxes & Fees (8.75%)</td>
                <td className="px-4 py-3 text-right font-mono text-gray-500 text-xs">{fmtMoney(tax)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-gray-900 text-white">
                <td className="px-4 py-3 font-bold text-sm">TOTAL DUE</td>
                <td className="px-4 py-3 text-right font-bold font-mono text-lg">{fmtMoney(total)}</td>
              </tr>
            </tfoot>
          </table>

          {/* Payment chain / status block */}
          {isPaid && record.paymentReference && (
            <div className="bg-emerald-50 border border-emerald-200 rounded p-4 mb-6">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <CheckCheck className="h-3.5 w-3.5" /> Chain of Evidence — Payment Confirmed
              </p>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="text-gray-500 font-semibold uppercase tracking-wide text-[10px]">{isAR ? "Deposit Reference" : "Payment Reference"}</p>
                  <p className="font-mono font-bold text-gray-800 mt-0.5">{record.paymentReference}</p>
                </div>
                {record.paymentMethod && (
                  <div>
                    <p className="text-gray-500 font-semibold uppercase tracking-wide text-[10px]">Method</p>
                    <p className="font-bold text-gray-800 mt-0.5">{record.paymentMethod}</p>
                  </div>
                )}
                {record.paidDate && (
                  <div>
                    <p className="text-gray-500 font-semibold uppercase tracking-wide text-[10px]">Cleared</p>
                    <p className="font-bold text-gray-800 mt-0.5">{fmtDate(record.paidDate)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {!isPaid && (
            <div className={`border rounded p-4 mb-6 ${record.status === "open" ? "bg-amber-50 border-amber-200" : "bg-sky-50 border-sky-200"}`}>
              <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${record.status === "open" ? "text-amber-700" : "text-sky-700"}`}>
                {isAR ? "Payment Outstanding" : "Pending Payment"}
              </p>
              <p className="text-xs text-gray-600">
                {isAR
                  ? `Please remit ${fmtMoney(total)} to Meridian Industrial Group by ${fmtDate(record.dueDate)}. Late payments are subject to a 1.5% monthly finance charge.`
                  : `This voucher is approved for payment. Remittance to ${record.counterparty} by ${fmtDate(record.dueDate)} per contract terms.`
                }
              </p>
            </div>
          )}

          {/* Remittance */}
          {isAR && (
            <div className="border border-dashed border-gray-300 rounded p-4 mb-6">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Remittance Information</p>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div><p className="font-semibold">Bank Name</p><p>First Industrial Bank of Texas</p></div>
                <div><p className="font-semibold">Routing Number</p><p>XXXXXX4219</p></div>
                <div><p className="font-semibold">Account Name</p><p>Meridian Industrial Group</p></div>
                <div><p className="font-semibold">Account Number</p><p>XXXXXXXX7841</p></div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
            <span>Meridian Industrial Group · {isAR ? "Accounts Receivable" : "Accounts Payable"}</span>
            <span className="font-mono">{record.invoiceNumber}</span>
            <span>Questions: accounts@meridianig.com</span>
          </div>
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
  const [viewingRecord, setViewingRecord] = useState<FinancialRecord | null>(null);

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
      {viewingRecord && <FinancialDocViewer record={viewingRecord} onClose={() => setViewingRecord(null)} />}
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
                <th className="px-3 py-2.5 w-12"></th>
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
                  <td className="px-3 py-2">
                    <button
                      onClick={e => { e.stopPropagation(); setViewingRecord(rec); }}
                      className="flex items-center gap-1 text-amber-500/70 hover:text-amber-400 transition-colors"
                      title="Open document"
                      data-testid={`button-open-fin-${rec.id}`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </td>
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
            <div className="flex items-center gap-2">
              <button onClick={() => setViewingRecord(selected)} className="flex items-center gap-1 text-xs text-amber-500 hover:text-amber-300 bg-amber-900/20 hover:bg-amber-900/40 border border-amber-800/50 rounded px-2 py-0.5 transition-colors font-semibold" data-testid="button-open-from-fin-panel"><Eye className="h-3 w-3" />Open Document</button>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-300"><X className="h-3.5 w-3.5" /></button>
            </div>
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
  const [viewingDoc, setViewingDoc] = useState<KMSDoc | null>(null);

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
      {viewingDoc && <DocumentViewerModal doc={viewingDoc} onClose={() => setViewingDoc(null)} />}

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
                  {filteredDocs.map(doc => <DocCard key={doc.id} doc={doc} onClick={() => setSelectedDoc(p => p?.id === doc.id ? null : doc)} selected={selectedDoc?.id === doc.id} onOpen={() => setViewingDoc(doc)} />)}
                </div>
              ) : (
                <div className="space-y-1.5" data-testid="list-kms-docs">
                  {filteredDocs.map(doc => {
                    const Icon = getIcon(doc.docType);
                    const colors = SUBJECT_COLORS[doc.subject] || SUBJECT_COLORS["General"];
                    return (
                      <div key={doc.id} className={`flex items-center gap-4 px-4 py-2.5 rounded border transition-all hover:border-slate-500 ${selectedDoc?.id === doc.id ? "border-amber-600 bg-slate-800/80" : "border-slate-800 bg-slate-900/40 hover:bg-slate-800/60"}`} data-testid={`row-kms-doc-${doc.id}`}>
                        <button onClick={() => setSelectedDoc(p => p?.id === doc.id ? null : doc)} className="flex items-center gap-4 flex-1 min-w-0 text-left focus:outline-none">
                          <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 border ${colors.bg} ${colors.border}`}><Icon className={`h-3.5 w-3.5 ${colors.text}`} /></div>
                          <span className={`text-xs px-1.5 py-0.5 rounded border font-semibold shrink-0 ${colors.bg} ${colors.text} ${colors.border}`}>{doc.docType}</span>
                          <span className="text-sm font-semibold text-slate-200 flex-1 truncate">{formatStandardName(doc.standardName)}</span>
                          <span className="text-xs text-slate-500 shrink-0">{doc.department}</span>
                          <span className="text-xs text-slate-600 shrink-0">{fmtDate(doc.approvedAt)}</span>
                        </button>
                        <button onClick={() => setViewingDoc(doc)} className="flex items-center gap-1 text-xs text-amber-500/70 hover:text-amber-400 shrink-0 transition-colors" data-testid={`button-open-list-doc-${doc.id}`} title="Open Document">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
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
              <DocDetailPanel doc={selectedDoc} onClose={() => setSelectedDoc(null)} onOpen={() => setViewingDoc(selectedDoc)} />
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
