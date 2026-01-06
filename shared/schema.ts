import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
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

export const publications = pgTable("publications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'Paper', 'Publication', 'Technical Report'
  url: text("url"),
  abstract: text("abstract"),
  author: text("author"),
  publishedDate: text("published_date"),
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
export const insertPublicationSchema = createInsertSchema(publications).omit({ id: true });

export type Framework = typeof frameworks.$inferSelect;
export type InsertFramework = z.infer<typeof insertFrameworkSchema>;
export type ComplianceItem = typeof complianceItems.$inferSelect;
export type InsertComplianceItem = z.infer<typeof insertComplianceItemSchema>;
export type Publication = typeof publications.$inferSelect;
export type InsertPublication = z.infer<typeof insertPublicationSchema>;
