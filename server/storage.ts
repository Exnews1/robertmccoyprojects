import { db } from "./db";
import {
  frameworks,
  complianceItems,
  publications,
  type Framework,
  type InsertFramework,
  type ComplianceItem,
  type InsertComplianceItem,
  type Publication,
  type InsertPublication
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getFrameworks(): Promise<Framework[]>;
  getFramework(id: number): Promise<Framework | undefined>;
  createFramework(framework: InsertFramework): Promise<Framework>;
  
  getComplianceItems(frameworkId?: number): Promise<ComplianceItem[]>;
  createComplianceItem(item: InsertComplianceItem): Promise<ComplianceItem>;

  getPublications(): Promise<Publication[]>;
  createPublication(pub: InsertPublication): Promise<Publication>;
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
    return await db.select().from(publications);
  }

  async createPublication(pub: InsertPublication): Promise<Publication> {
    const [newPub] = await db.insert(publications).values(pub).returning();
    return newPub;
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
          requirement: "Section 7.2: Mandates risk assessments for high-impact AI affecting rights/safety; Prohibits opaque decisions.",
          designChoice: "Intentional non-use of predictive functions; Explicit prohibition of individual risk scoring.",
          strategicAdvantage: "Eliminates exposure to prohibited high-risk practices; Ensures full compliance with federal mandate.",
          status: "Fully Compliant",
          tags: ["Governance", "High-Impact"],
        },
        {
          frameworkId: eo.id,
          requirement: "Section 10.1: Requires auditable institutional evidence for budget reallocation.",
          designChoice: "Aggregation of de-identified feasibility signals and constraint conflicts.",
          strategicAdvantage: "Transforms anecdotal failures into auditable evidence; Justifies transition support funding.",
          status: "Fully Compliant",
          tags: ["Budget", "Evidence"],
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
          url: "#",
        },
      ]);
    }
  }
}

export const storage = new DatabaseStorage();
storage.seed();
