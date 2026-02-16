import { db } from "./db";
import {
  frameworks,
  complianceItems,
  publications,
  expertCommentary,
  libraryEntries,
  inquiries,
  siteStats,
  type Framework,
  type InsertFramework,
  type ComplianceItem,
  type InsertComplianceItem,
  type Publication,
  type InsertPublication,
  type ExpertCommentary,
  type InsertExpertCommentary,
  type LibraryEntry,
  type InsertLibraryEntry,
  type Inquiry,
  type InsertInquiry
} from "@shared/schema";
import { eq, sql } from "drizzle-orm";
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

  getLibraryEntries(): Promise<LibraryEntry[]>;
  createLibraryEntry(entry: InsertLibraryEntry): Promise<LibraryEntry>;
  updateLibraryEntryEmbedding(id: number, embedding: string): Promise<void>;
  clearLibraryEntries(): Promise<void>;
  bulkCreateLibraryEntries(entries: InsertLibraryEntry[]): Promise<number>;
  getLibraryEntriesWithoutEmbeddings(): Promise<LibraryEntry[]>;

  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getInquiries(): Promise<Inquiry[]>;

  getVisitorCount(): Promise<number>;
  incrementVisitorCount(): Promise<number>;
  getStatCount(key: string): Promise<number>;
  incrementStatCount(key: string): Promise<number>;
  getAllStats(): Promise<Record<string, number>>;
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

  async getLibraryEntries(): Promise<LibraryEntry[]> {
    return await db.select().from(libraryEntries);
  }

  async createLibraryEntry(entry: InsertLibraryEntry): Promise<LibraryEntry> {
    const [newEntry] = await db.insert(libraryEntries).values(entry).returning();
    return newEntry;
  }

  async updateLibraryEntryEmbedding(id: number, embedding: string): Promise<void> {
    await db.update(libraryEntries).set({ embedding }).where(eq(libraryEntries.id, id));
  }

  async clearLibraryEntries(): Promise<void> {
    await db.delete(libraryEntries);
  }

  async bulkCreateLibraryEntries(entries: InsertLibraryEntry[]): Promise<number> {
    if (entries.length === 0) return 0;
    const batchSize = 50;
    let inserted = 0;
    for (let i = 0; i < entries.length; i += batchSize) {
      const batch = entries.slice(i, i + batchSize);
      await db.insert(libraryEntries).values(batch).onConflictDoNothing();
      inserted += batch.length;
    }
    return inserted;
  }

  async getLibraryEntriesWithoutEmbeddings(): Promise<LibraryEntry[]> {
    return await db.select().from(libraryEntries).where(sql`embedding IS NULL`);
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const [newInquiry] = await db.insert(inquiries).values(inquiry).returning();
    return newInquiry;
  }

  async getInquiries(): Promise<Inquiry[]> {
    return await db.select().from(inquiries);
  }

  async getVisitorCount(): Promise<number> {
    const [stat] = await db.select().from(siteStats).where(eq(siteStats.key, 'visitors'));
    return stat?.value || 0;
  }

  async incrementVisitorCount(): Promise<number> {
    return this.incrementStatCount('visitors');
  }

  async getStatCount(key: string): Promise<number> {
    const [stat] = await db.select().from(siteStats).where(eq(siteStats.key, key));
    return stat?.value || 0;
  }

  async incrementStatCount(key: string): Promise<number> {
    const [existing] = await db.select().from(siteStats).where(eq(siteStats.key, key));
    if (existing) {
      const newValue = existing.value + 1;
      await db.update(siteStats).set({ value: newValue, updatedAt: new Date() }).where(eq(siteStats.key, key));
      return newValue;
    } else {
      await db.insert(siteStats).values({ key, value: 1 });
      return 1;
    }
  }

  async getAllStats(): Promise<Record<string, number>> {
    const rows = await db.select().from(siteStats);
    const result: Record<string, number> = {};
    for (const row of rows) {
      result[row.key] = row.value;
    }
    return result;
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
