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
      await db.insert(frameworks).values([
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
      ]);
    }

    const pubsCount = await db.select().from(publications);
    if (pubsCount.length === 0) {
      await db.insert(publications).values([
        {
          title: "Compliance Framework for Generative AI (CMGF)",
          type: "Paper",
          author: "Lead Researcher",
          publishedDate: "2024",
          abstract: "This paper introduces the CMGF framework, designed to ensure safety and transparency in high-impact AI systems.",
          url: "#",
        },
      ]);
    }
  }
}

export const storage = new DatabaseStorage();
storage.seed();
