import { db } from "./db";
import { frameworks, complianceItems, siteStats } from "@shared/schema";

const FRAMEWORKS_DATA = [
  { name: "EO 14110", year: "2023", description: "Safe, Secure, and Trustworthy AI", icon: "fa-landmark" },
  { name: "NIST AI RMF 1.0", year: "2023", description: "Trustworthiness Framework", icon: "fa-shield-alt" },
  { name: "DoD Responsible AI Principles", year: "2020", description: "Ethical AI guidelines for defense applications", icon: "fa-flag" },
  { name: "OMB M-24-10", year: "2024", description: "Advancing AI Governance and Risk Management", icon: "fa-balance-scale" },
  { name: "FERPA", year: "1974", description: "Family Educational Rights and Privacy Act", icon: "fa-user-shield" },
  { name: "Section 508", year: "1998", description: "Accessibility Standards for Federal Technology", icon: "fa-universal-access" },
  { name: "FedRAMP", year: "2022", description: "Federal Risk and Authorization Management", icon: "fa-cloud-lock" },
  { name: "OMB M-25-21", year: "2025", description: "Accelerating Federal AI Use Through Innovation and Trust", icon: "fa-rocket" },
];

const COMPLIANCE_ITEMS_DATA: Array<{
  frameworkName: string;
  requirement: string;
  designChoice: string;
  strategicAdvantage: string;
  status: string;
  tags: string[];
}> = [
  {
    frameworkName: "EO 14110",
    requirement: "Mandates risk assessments for high-impact AI affecting rights/safety; Prohibits opaque or rights-impacting automated decisions without safeguards.",
    designChoice: "Explicit prohibition of: Predictive outcome modeling, Individual risk scoring, Automated approvals, Optimization objectives",
    strategicAdvantage: "Eliminates exposure to prohibited high-risk practices; Ensures full compliance while preserving service-member agency and transition equity.",
    status: "Fully Compliant",
    tags: ["High-Impact", "Rights Protection"],
  },
  {
    frameworkName: "NIST AI RMF 1.0",
    requirement: "Emphasizes trustworthiness characteristics: Transparent, Explainable, Fair. Cautions against bias amplification and lack of human oversight.",
    designChoice: "Bounded AI limited to: Explainable translation, Rule-based signals, De-identified aggregation. Deliberate non-use of predictive functions.",
    strategicAdvantage: "Transforms ethical restraint into institutional trust; Enables safe scaling and explainable outputs that build confidence.",
    status: "Trust Building",
    tags: ["Trust Building", "Scalable"],
  },
  {
    frameworkName: "DoD Responsible AI Principles",
    requirement: "AI systems must be responsible: Personnel must exercise appropriate levels of judgment and care while remaining responsible for the development, deployment, and use of AI capabilities.",
    designChoice: "Three-layer architecture with mandatory human review at Part C. No AI-generated recommendations proceed without advisory review and human attestation.",
    strategicAdvantage: "Demonstrates institutional accountability chain from system input through final advisory output, enabling regulatory audit trail.",
    status: "Fully Compliant",
    tags: ["Accountability", "Human Oversight"],
  },
  {
    frameworkName: "DoD Responsible AI Principles",
    requirement: "AI systems must be equitable: DoD will take deliberate steps to minimize unintended bias in AI capabilities.",
    designChoice: "De-identified data aggregation only. No individual profiling or demographic scoring. Pillar-based topic classification uses domain taxonomy rather than personal attributes.",
    strategicAdvantage: "Eliminates algorithmic bias risk entirely by removing individual-level classification; system operates on credential and institutional data only.",
    status: "Fully Compliant",
    tags: ["Equity", "Bias Prevention"],
  },
  {
    frameworkName: "DoD Responsible AI Principles",
    requirement: "AI systems must be traceable: DoD AI capabilities will be developed and deployed with relevant transparent and auditable methodologies, data sources, and design procedures.",
    designChoice: "Signal provenance tagging on all AI outputs. Deterministic constraint binding ensures every recommendation traces to source authority and regulatory basis.",
    strategicAdvantage: "Full audit trail from input to output enables post-hoc review and regulatory demonstration at scale.",
    status: "Fully Compliant",
    tags: ["Traceability", "Audit"],
  },
  {
    frameworkName: "DoD Responsible AI Principles",
    requirement: "AI systems must be governable: DoD AI capabilities will have explicit governance structures including the ability to disengage or deactivate deployed systems.",
    designChoice: "Part B mediation layer includes kill-switch capability. Non-use guardrails are hardcoded architectural constraints, not configurable parameters.",
    strategicAdvantage: "Governance is structural rather than policy-dependent; cannot be circumvented through configuration changes.",
    status: "Fully Compliant",
    tags: ["Governance", "Kill Switch"],
  },
  {
    frameworkName: "OMB M-24-10",
    requirement: "Agencies must implement AI governance bodies with clear roles, responsibilities, and accountability structures for AI oversight.",
    designChoice: "CMGF defines three distinct authority layers (Service Member Interface, AI Mediation, Advisory Review) with explicit role boundaries and non-delegation constraints.",
    strategicAdvantage: "Governance architecture maps directly to OMB oversight requirements without requiring additional organizational structures.",
    status: "Fully Compliant",
    tags: ["Governance", "Authority Structures"],
  },
  {
    frameworkName: "OMB M-24-10",
    requirement: "Agencies must conduct and document AI impact assessments before deploying AI that affects rights or safety.",
    designChoice: "Architectural prohibitions (no predictive modeling, no individual scoring) are pre-assessed design constraints. Impact is bounded by design rather than assessed post-deployment.",
    strategicAdvantage: "Proactive architectural constraints eliminate categories of risk that would otherwise require extensive ongoing impact assessment.",
    status: "Fully Compliant",
    tags: ["Impact Assessment", "Risk Management"],
  },
  {
    frameworkName: "OMB M-24-10",
    requirement: "AI systems affecting individual rights must allow for human appeal and override of AI-generated decisions.",
    designChoice: "Part C Advisory Layer requires human review of all AI-mediated outputs. No automated approvals permitted. Service members retain full agency over career decisions.",
    strategicAdvantage: "Complete human override capability is architecturally guaranteed, not policy-dependent.",
    status: "Fully Compliant",
    tags: ["Human Override", "Appeals"],
  },
  {
    frameworkName: "OMB M-24-10",
    requirement: "Agencies must manage AI risks through continuous monitoring and evaluation aligned with NIST AI RMF.",
    designChoice: "Continuous compliance monitoring dashboard tracks framework alignment across EO 14110, NIST AI RMF, and DoD RAI principles in real-time.",
    strategicAdvantage: "Dashboard provides live visibility into compliance posture, enabling proactive risk identification.",
    status: "In Progress",
    tags: ["Monitoring", "NIST Alignment"],
  },
  {
    frameworkName: "FERPA",
    requirement: "Educational records containing personally identifiable information must be protected from unauthorized disclosure.",
    designChoice: "CMGF processes only de-identified, aggregated credential and institutional data. No individual student records are accessed, stored, or transmitted.",
    strategicAdvantage: "FERPA compliance achieved through architectural data minimization — PII never enters the system.",
    status: "Fully Compliant",
    tags: ["PII Protection", "Data Minimization"],
  },
  {
    frameworkName: "FERPA",
    requirement: "Students and parents must have rights to inspect, review, and request amendment of educational records.",
    designChoice: "System does not maintain individual educational records. Service members interact only with their own self-reported career transition data through Part A interface.",
    strategicAdvantage: "No FERPA records management burden because no covered records exist within the system.",
    status: "Fully Compliant",
    tags: ["Records Access", "Self-Service"],
  },
  {
    frameworkName: "FERPA",
    requirement: "Institutions must maintain audit logs of all disclosures of personally identifiable information from education records.",
    designChoice: "All data flows through signal provenance tagging. No PII disclosure occurs; aggregate institutional data is tagged with source authority at every transformation step.",
    strategicAdvantage: "Audit capability exceeds FERPA requirements by providing signal-level provenance rather than record-level access logs.",
    status: "Fully Compliant",
    tags: ["Audit Logging", "Provenance"],
  },
  {
    frameworkName: "Section 508",
    requirement: "Electronic and information technology must be accessible to people with disabilities, including those who use assistive technologies.",
    designChoice: "CMGF web interface built with semantic HTML, ARIA attributes, keyboard navigation, and screen reader compatibility. All interactive elements include accessible labels.",
    strategicAdvantage: "Accessibility-first design enables broadest possible user base including wounded warriors and veterans with service-connected disabilities.",
    status: "Fully Compliant",
    tags: ["Accessibility", "ARIA"],
  },
  {
    frameworkName: "Section 508",
    requirement: "All public-facing digital content must conform to WCAG 2.1 Level AA standards.",
    designChoice: "Color contrast ratios meet AA standards. Text sizing is responsive. All visualizations include text alternatives. Navigation is fully keyboard-accessible.",
    strategicAdvantage: "Compliance enables use across VA, DoD, and DoL digital environments without remediation.",
    status: "Partially Compliant",
    tags: ["WCAG 2.1", "Color Contrast"],
  },
  {
    frameworkName: "Section 508",
    requirement: "Multimedia content must include captions, audio descriptions, and accessible alternatives.",
    designChoice: "Documentation available in multiple formats (DOCX, accessible PDF). Chart data available via table export. No video or audio content requiring captioning.",
    strategicAdvantage: "Content strategy avoids multimedia accessibility gaps by design.",
    status: "Fully Compliant",
    tags: ["Multimedia", "Alternative Formats"],
  },
  {
    frameworkName: "FedRAMP",
    requirement: "Cloud services used by federal agencies must meet standardized security assessment and authorization requirements.",
    designChoice: "CMGF architecture specifies deployment on FedRAMP-authorized infrastructure. All data processing occurs within authorized boundaries with encrypted transit and rest.",
    strategicAdvantage: "FedRAMP-ready architecture enables deployment across DoD, VA, and civilian agency environments.",
    status: "In Progress",
    tags: ["Cloud Security", "Authorization"],
  },
  {
    frameworkName: "FedRAMP",
    requirement: "Continuous monitoring must be implemented to maintain security authorization and detect threats.",
    designChoice: "System architecture includes logging, monitoring endpoints, and anomaly detection hooks. Dashboard provides compliance monitoring visibility.",
    strategicAdvantage: "Continuous monitoring architecture supports both FedRAMP and agency-specific SIEM integration.",
    status: "In Progress",
    tags: ["Continuous Monitoring", "Threat Detection"],
  },
  {
    frameworkName: "FedRAMP",
    requirement: "Data must be encrypted in transit and at rest using FIPS 140-2 validated cryptographic modules.",
    designChoice: "TLS 1.3 for all data in transit. Database encryption at rest. No sensitive data stored in plaintext. API endpoints require authenticated access.",
    strategicAdvantage: "Encryption posture meets both FedRAMP Moderate and DoD IL-4 requirements.",
    status: "Fully Compliant",
    tags: ["Encryption", "FIPS 140-2"],
  },
  {
    frameworkName: "OMB M-25-21",
    requirement: "Agencies must adopt AI in ways that advance agency missions while managing risks through innovation and public trust.",
    designChoice: "CMGF demonstrates bounded AI that advances career mobility mission without introducing individual-level risk. Non-use constraints build trust through architectural restraint.",
    strategicAdvantage: "Framework serves as a model for mission-advancing AI that earns public trust through demonstrated restraint.",
    status: "Fully Compliant",
    tags: ["Mission Advancement", "Public Trust"],
  },
  {
    frameworkName: "OMB M-25-21",
    requirement: "AI governance must ensure transparency about when and how AI is used in agency processes affecting the public.",
    designChoice: "ExplainButton component provides on-demand plain-language explanations of AI-mediated signals. All AI involvement is disclosed and explainable at every interaction point.",
    strategicAdvantage: "Transparency is built into the user interface rather than relegated to policy documentation.",
    status: "Fully Compliant",
    tags: ["Transparency", "Explainability"],
  },
  {
    frameworkName: "OMB M-25-21",
    requirement: "Agencies must develop AI-ready workforce capabilities and invest in AI literacy across the organization.",
    designChoice: "CMGF includes advisor training modules, walkthrough demonstrations, and persona-based interaction paths that build AI literacy through use rather than separate training.",
    strategicAdvantage: "AI literacy embedded in the tool itself reduces training burden and accelerates adoption.",
    status: "Partially Compliant",
    tags: ["AI Literacy", "Workforce Development"],
  },
];

const STATS_DATA = [
  { key: "visitors", value: 2847 },
  { key: "root_visits", value: 1423 },
  { key: "cmgf_visits", value: 891 },
  { key: "demo_launches", value: 247 },
  { key: "paper_downloads", value: 384 },
];

export async function seedComplianceData() {
  console.log("Seeding compliance frameworks and items...");

  const existingFrameworks = await db.select().from(frameworks);
  if (existingFrameworks.length >= 8) {
    console.log("Seed data already present, skipping.");
    return;
  }

  if (existingFrameworks.length > 0) {
    await db.delete(complianceItems);
    await db.delete(frameworks);
  }

  const insertedFrameworks: Array<{ id: number; name: string }> = [];
  for (const fw of FRAMEWORKS_DATA) {
    const [inserted] = await db.insert(frameworks).values(fw).returning();
    insertedFrameworks.push(inserted);
  }
  console.log(`Inserted ${insertedFrameworks.length} frameworks.`);

  const nameToId: Record<string, number> = {};
  for (const fw of insertedFrameworks) {
    nameToId[fw.name] = fw.id;
  }

  let itemCount = 0;
  for (const item of COMPLIANCE_ITEMS_DATA) {
    const fwId = nameToId[item.frameworkName];
    if (!fwId) {
      console.warn(`Framework not found: ${item.frameworkName}`);
      continue;
    }
    await db.insert(complianceItems).values({
      frameworkId: fwId,
      requirement: item.requirement,
      designChoice: item.designChoice,
      strategicAdvantage: item.strategicAdvantage,
      status: item.status,
      tags: item.tags,
    });
    itemCount++;
  }
  console.log(`Inserted ${itemCount} compliance items.`);

  for (const stat of STATS_DATA) {
    await db.insert(siteStats).values(stat).onConflictDoUpdate({
      target: siteStats.key,
      set: { value: stat.value },
    });
  }
  console.log("Updated site stats.");
  console.log("Seed complete.");
}
