import { storage } from "./storage";
import { generateEmbedding } from "./openai";
import type { InsertLibraryEntry } from "@shared/schema";

const sampleLibraryEntries: Omit<InsertLibraryEntry, "embedding">[] = [
  {
    entryId: "cmgf-main-2026",
    title: "A Governed, Human-in-the-Loop AI Framework for Military Career Mobility",
    authors: "Robert E. McCoy",
    organization: "Indiana Wesleyan University",
    year: 2026,
    documentType: "Research Paper",
    summary: "This paper presents the Career Mobility Governance Framework (CMGF), a bounded AI architecture designed to support military service member career transitions. The framework enforces three non-negotiable constraints: no predictive outcome modeling, no individual risk scoring, and no automated approvals. AI serves as infrastructure rather than authority, preserving human judgment in all decision pathways.",
    topics: ["AI Governance", "Military Transition", "Human-in-the-Loop", "Career Mobility"],
    url: "/attached_assets/Career_Mobility_2026__CCME_1769103378838.docx",
    sourceLabel: "CMGF Core Research",
    visibility: "public"
  },
  {
    entryId: "eo-14110-analysis",
    title: "Executive Order 14110: Safe, Secure, and Trustworthy Development and Use of AI",
    authors: "White House",
    organization: "Executive Office of the President",
    year: 2023,
    documentType: "Policy Document",
    summary: "Executive Order establishing comprehensive requirements for AI safety, security, and trustworthiness across federal agencies. Mandates risk management frameworks, bias testing, and transparency requirements for AI systems used in government contexts. Particularly relevant to systems affecting civil rights and civil liberties.",
    topics: ["AI Policy", "Federal Regulation", "AI Safety", "Government AI"],
    url: "https://www.whitehouse.gov/briefing-room/presidential-actions/2023/10/30/executive-order-on-the-safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence/",
    sourceLabel: "Federal Policy",
    visibility: "public"
  },
  {
    entryId: "nist-ai-rmf-2023",
    title: "NIST AI Risk Management Framework 1.0",
    authors: "National Institute of Standards and Technology",
    organization: "U.S. Department of Commerce",
    year: 2023,
    documentType: "Framework",
    summary: "Voluntary framework providing organizations with guidance on managing AI risks. Establishes four core functions: Govern, Map, Measure, and Manage. Emphasizes trustworthy AI characteristics including validity, reliability, safety, security, resilience, accountability, transparency, explainability, and fairness.",
    topics: ["Risk Management", "AI Governance", "Trustworthy AI", "Standards"],
    url: "https://www.nist.gov/itl/ai-risk-management-framework",
    sourceLabel: "NIST Standards",
    visibility: "public"
  },
  {
    entryId: "dod-ai-strategy-2023",
    title: "2023 DoD Data, Analytics, and AI Adoption Strategy",
    authors: "Department of Defense",
    organization: "Office of the Chief Digital and Artificial Intelligence Officer",
    year: 2023,
    documentType: "Strategy Document",
    summary: "Strategic framework outlining Department of Defense approach to responsible AI adoption. Emphasizes human-centered AI deployment, ethical considerations, and governance structures. Addresses workforce transformation, data infrastructure, and interoperability requirements for defense AI systems.",
    topics: ["DoD AI", "Military AI", "Defense Strategy", "AI Adoption"],
    url: "https://media.defense.gov/2023/Nov/02/2003333301/-1/-1/1/DOD_DATA_ANALYTICS_AI_ADOPTION_STRATEGY.PDF",
    sourceLabel: "DoD Policy",
    visibility: "public"
  },
  {
    entryId: "transition-assistance-gao",
    title: "Transitioning Veterans: DOD Needs to Improve Performance Reporting and Monitoring",
    authors: "Government Accountability Office",
    organization: "GAO",
    year: 2022,
    documentType: "Government Report",
    summary: "GAO report examining the effectiveness of the Transition Assistance Program (TAP) and identifying gaps in performance measurement. Highlights structural disconnects between education benefit investments and transition support infrastructure. Recommends improved data collection and outcome tracking for veteran transition programs.",
    topics: ["Veteran Transition", "TAP", "Performance Measurement", "DoD Programs"],
    url: "https://www.gao.gov/products/gao-22-104544",
    sourceLabel: "GAO Report",
    visibility: "public"
  },
  {
    entryId: "military-education-benefits",
    title: "Veterans Education Benefits: Additional Actions Needed to Ensure Effective Implementation",
    authors: "Government Accountability Office",
    organization: "GAO",
    year: 2023,
    documentType: "Government Report",
    summary: "Analysis of the $13.5 billion annual investment in veteran education benefits including the GI Bill, Tuition Assistance, and credentialing programs. Identifies implementation challenges and recommends improvements to benefit utilization tracking. Addresses the paradox of substantial education investment alongside underfunded transition advising.",
    topics: ["Education Benefits", "GI Bill", "Veteran Education", "Federal Investment"],
    url: "https://www.gao.gov/education-workforce-income-security",
    sourceLabel: "GAO Report",
    visibility: "public"
  },
  {
    entryId: "algorithmic-accountability",
    title: "Algorithmic Accountability: A Primer",
    authors: "Data & Society Research Institute",
    organization: "Data & Society",
    year: 2021,
    documentType: "Research Brief",
    summary: "Overview of algorithmic accountability concepts and mechanisms for ensuring AI systems remain accountable to affected populations. Discusses audit mechanisms, impact assessments, and governance structures. Provides framework for evaluating AI accountability in high-stakes decision contexts.",
    topics: ["Algorithmic Accountability", "AI Ethics", "Governance", "Impact Assessment"],
    url: "https://datasociety.net/library/algorithmic-accountability-a-primer/",
    sourceLabel: "Research Institute",
    visibility: "public"
  },
  {
    entryId: "human-oversight-ai",
    title: "Human Oversight of AI Systems: Lessons from High-Stakes Domains",
    authors: "Partnership on AI",
    organization: "Partnership on AI",
    year: 2022,
    documentType: "Research Paper",
    summary: "Examination of human oversight mechanisms in AI systems across healthcare, criminal justice, and employment domains. Identifies patterns of automation bias and proposes design interventions to maintain meaningful human control. Argues for bounded AI architectures that preserve human agency.",
    topics: ["Human Oversight", "Automation Bias", "AI Design", "High-Stakes AI"],
    url: "https://partnershiponai.org/",
    sourceLabel: "Industry Research",
    visibility: "public"
  },
  {
    entryId: "workforce-automation-impact",
    title: "The Impact of Automation on Workforce Transitions",
    authors: "Brookings Institution",
    organization: "Brookings",
    year: 2022,
    documentType: "Policy Brief",
    summary: "Analysis of automation effects on workforce displacement and transition patterns. Examines role of education and training programs in supporting worker transitions. Provides evidence base for policy interventions addressing automation-driven career disruption.",
    topics: ["Automation", "Workforce Transition", "Education Policy", "Career Disruption"],
    url: "https://www.brookings.edu/topic/automation/",
    sourceLabel: "Policy Research",
    visibility: "public"
  },
  {
    entryId: "ai-transparency-requirements",
    title: "Transparency Requirements for AI Decision Systems",
    authors: "AI Now Institute",
    organization: "NYU AI Now",
    year: 2023,
    documentType: "Policy Paper",
    summary: "Framework for AI transparency requirements in public sector applications. Proposes disclosure standards, explanation requirements, and auditability mechanisms. Addresses tension between proprietary AI systems and public accountability, with recommendations for procurement and oversight.",
    topics: ["AI Transparency", "Explainability", "Public Sector AI", "Accountability"],
    url: "https://ainowinstitute.org/",
    sourceLabel: "Academic Research",
    visibility: "public"
  }
];

export async function seedLibrary() {
  try {
    const existingEntries = await storage.getLibraryEntries();
    if (existingEntries.length > 0) {
      console.log(`Library already has ${existingEntries.length} entries, skipping seed.`);
      return;
    }

    console.log("Seeding library with sample entries...");
    
    for (const entry of sampleLibraryEntries) {
      try {
        const newEntry = await storage.createLibraryEntry({
          ...entry,
          embedding: null
        });
        
        console.log(`Created entry: ${entry.title}`);
        
        const embedding = await generateEmbedding(entry.summary);
        await storage.updateLibraryEntryEmbedding(newEntry.id, JSON.stringify(embedding));
        console.log(`  - Embedded: ${entry.entryId}`);
      } catch (error) {
        console.error(`Failed to seed entry ${entry.entryId}:`, error);
      }
    }

    console.log("Library seeding complete.");
  } catch (error) {
    console.error("Library seeding failed:", error);
  }
}
