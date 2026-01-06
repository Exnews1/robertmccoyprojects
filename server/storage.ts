import { db } from "./db";
import {
  frameworks,
  complianceItems,
  type Framework,
  type InsertFramework,
  type ComplianceItem,
  type InsertComplianceItem
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getFrameworks(): Promise<Framework[]>;
  getFramework(id: number): Promise<Framework | undefined>;
  createFramework(framework: InsertFramework): Promise<Framework>;
  
  getComplianceItems(frameworkId?: number): Promise<ComplianceItem[]>;
  createComplianceItem(item: InsertComplianceItem): Promise<ComplianceItem>;
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
}

export const storage = new DatabaseStorage();
