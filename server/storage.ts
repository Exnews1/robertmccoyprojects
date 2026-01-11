import { db } from "./db";
import {
  frameworks,
  complianceItems,
  publications,
  expertCommentary,
  type Framework,
  type InsertFramework,
  type ComplianceItem,
  type InsertComplianceItem,
  type Publication,
  type InsertPublication,
  type ExpertCommentary,
  type InsertExpertCommentary
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { seedPublications } from "./seed";

export interface IStorage {
  getFrameworks(): Promise<Framework[]>;
  getFramework(id: number): Promise<Framework | undefined>;
  createFramework(framework: InsertFramework): Promise<Framework>;
  
  getComplianceItems(frameworkId?: number): Promise<ComplianceItem[]>;
  createComplianceItem(item: InsertComplianceItem): Promise<ComplianceItem>;

  getPublications(): Promise<Publication[]>;
  createPublication(pub: InsertPublication): Promise<Publication>;

  createExpertCommentary(commentary: InsertExpertCommentary): Promise<ExpertCommentary>;
}

export class DatabaseStorage implements IStorage {
  async getFrameworks(): Promise<Framework[]> {
    return await db.select().from(frameworks);
  }

  async getFramework(id: number): Promise<Framework | undefined> {
    const [framework] = await db.select().from(frameworks).where(eq(frameworks.id, id));
    return framework;
  }

  async createFramework(framework: InsertFramework): Promise<Framework> {
    const [newFramework] = await db.insert(frameworks).values(framework).returning();
    return newFramework;
  }

  async getComplianceItems(frameworkId?: number): Promise<ComplianceItem[]> {
    if (frameworkId) {
      return await db.select().from(complianceItems).where(eq(complianceItems.frameworkId, frameworkId));
    }
    return await db.select().from(complianceItems);
  }

  async createComplianceItem(item: InsertComplianceItem): Promise<ComplianceItem> {
    const [newItem] = await db.insert(complianceItems).values(item).returning();
    return newItem;
  }

  async getPublications(): Promise<Publication[]> {
    try {
      const dbPubs = await db.select().from(publications);
      if (dbPubs.length > 0) {
        return dbPubs;
      }
    } catch (error) {
      console.error("Database query failed, using fallback publications");
    }
    
    // Fallback to hardcoded publications if database is empty or fails
    return seedPublications.map((pub, index) => ({
      id: index + 1,
      title: pub.title,
      type: pub.type,
      url: pub.url,
      abstract: pub.abstract,
      author: pub.author,
      publishedDate: pub.publishedDate
    }));
  }

  async createPublication(pub: InsertPublication): Promise<Publication> {
    const [newPub] = await db.insert(publications).values(pub).returning();
    return newPub;
  }

  async createExpertCommentary(commentary: InsertExpertCommentary): Promise<ExpertCommentary> {
    const submissionId = `CMGF-${Date.now().toString(36).toUpperCase()}`;
    const [newCommentary] = await db.insert(expertCommentary).values({
      ...commentary,
      submissionId,
    }).returning();
    return newCommentary;
  }

  async seed() {
    const frameworksCount = await db.select().from(frameworks);
    if (frameworksCount.length === 0) {
      const [eo] = await db.insert(frameworks).values([
        {
          name: "EO 14110",
          year: "2023",
          description: "Safe, Secure, and Trustworthy AI",
          icon: "Shield",
        },
        {
          name: "NIST AI RMF 1.0",
          year: "2023",
          description: "Trustworthiness Framework",
          icon: "Lock",
        },
      ]).returning();

      await db.insert(complianceItems).values([
        {
          frameworkId: eo.id,
          requirement: "Requirement 1.1: Intentional non-use of predictive outcome modeling, Individual risk scoring, and Automated approvals.",
          designChoice: "Non-predictive, human-governed analytics architecture.",
          strategicAdvantage: "Preserves service-member agency and institutional accountability while eliminating exposure to high-risk practices.",
          status: "Fully Compliant",
          tags: ["Ethics", "Design"],
        },
        {
          frameworkId: eo.id,
          requirement: "Requirement 2.4: Auditable institutional evidence for budget reallocation.",
          designChoice: "Aggregation of de-identified feasibility signals and recurring constraint conflicts.",
          strategicAdvantage: "Transforms anecdotal transition failures into auditable institutional evidence.",
          status: "Fully Compliant",
          tags: ["Governance", "Policy"],
        },
      ]);
    }

    const pubsCount = await db.select().from(publications);
    if (pubsCount.length === 0) {
      await db.insert(publications).values([
        {
          title: "A Governed, Human-in-the-Loop AI Framework for Military Career Mobility",
          type: "Paper",
          author: "Robert E. McCoy MBA, M.S. AI & Data Analytics",
          publishedDate: "January 2026",
          abstract: "Design, constraints, and ethical tradeoffs for military transition policy using the CMGF framework. Directly addresses the structural paradox of $13.5B annual spend vs. $140M transition support.",
          url: "/papers/CMGF_Main_Paper.pdf",
        },
      ]);
    }
  }
}

export const storage = new DatabaseStorage();
storage.seed();
