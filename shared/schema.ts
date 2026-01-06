import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const frameworks = pgTable("frameworks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  year: text("year").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
});

export const complianceItems = pgTable("compliance_items", {
  id: serial("id").primaryKey(),
  frameworkId: integer("framework_id").notNull(),
  requirement: text("requirement").notNull(),
  designChoice: text("design_choice").notNull(),
  strategicAdvantage: text("strategic_advantage").notNull(),
  status: text("status").notNull(),
  tags: text("tags").array(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'publication', 'paper', 'reference'
  url: text("url").notNull(),
  description: text("description"),
  author: text("author"),
  publishedDate: timestamp("published_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const frameworksRelations = relations(frameworks, ({ many }) => ({
  complianceItems: many(complianceItems),
}));

export const complianceItemsRelations = relations(complianceItems, ({ one }) => ({
  framework: one(frameworks, {
    fields: [complianceItems.frameworkId],
    references: [frameworks.id],
  }),
}));

export const insertFrameworkSchema = createInsertSchema(frameworks).omit({ id: true });
export const insertComplianceItemSchema = createInsertSchema(complianceItems).omit({ id: true });
export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true, createdAt: true });

export type Framework = typeof frameworks.$inferSelect;
export type InsertFramework = z.infer<typeof insertFrameworkSchema>;
export type ComplianceItem = typeof complianceItems.$inferSelect;
export type InsertComplianceItem = z.infer<typeof insertComplianceItemSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

// Request types
export type CreateDocumentRequest = InsertDocument;
export type UpdateDocumentRequest = Partial<InsertDocument>;
export type DocumentResponse = Document;
