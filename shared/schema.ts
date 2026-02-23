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

export const expertCommentary = pgTable("expert_commentary", {
  id: serial("id").primaryKey(),
  submissionId: text("submission_id").notNull(),
  type: text("type").notNull(),
  category: text("category").notNull(),
  message: text("message").notNull(),
  name: text("name"),
  organization: text("organization"),
  email: text("email"),
  consent: boolean("consent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const libraryEntries = pgTable("library_entries", {
  id: serial("id").primaryKey(),
  entryId: text("entry_id").notNull().unique(),
  title: text("title").notNull(),
  authors: text("authors"),
  organization: text("organization"),
  year: integer("year"),
  documentType: text("document_type").notNull(),
  summary: text("summary").notNull(),
  topics: text("topics").array(),
  url: text("url"),
  sourceLabel: text("source_label"),
  visibility: text("visibility").default("public"),
  embedding: text("embedding"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  organization: text("organization"),
  inquiryType: text("inquiry_type").notNull(),
  message: text("message").notNull(),
  status: text("status").default("unread"),
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
export const insertPublicationSchema = createInsertSchema(publications).omit({ id: true });
export const insertExpertCommentarySchema = createInsertSchema(expertCommentary).omit({ id: true, submissionId: true, createdAt: true });
export const insertLibraryEntrySchema = createInsertSchema(libraryEntries).omit({ id: true, createdAt: true });
export const insertInquirySchema = createInsertSchema(inquiries).omit({ id: true, status: true, createdAt: true });

export type Framework = typeof frameworks.$inferSelect;
export type InsertFramework = z.infer<typeof insertFrameworkSchema>;
export type ComplianceItem = typeof complianceItems.$inferSelect;
export type InsertComplianceItem = z.infer<typeof insertComplianceItemSchema>;
export type Publication = typeof publications.$inferSelect;
export type InsertPublication = z.infer<typeof insertPublicationSchema>;
export type ExpertCommentary = typeof expertCommentary.$inferSelect;
export type InsertExpertCommentary = z.infer<typeof insertExpertCommentarySchema>;
export type LibraryEntry = typeof libraryEntries.$inferSelect;
export type InsertLibraryEntry = z.infer<typeof insertLibraryEntrySchema>;
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;

export const demoEvents = pgTable("demo_events", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  sessionId: text("session_id"),
  metadata: text("metadata"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDemoEventSchema = createInsertSchema(demoEvents).omit({ id: true, createdAt: true });
export type DemoEvent = typeof demoEvents.$inferSelect;
export type InsertDemoEvent = z.infer<typeof insertDemoEventSchema>;

// Site analytics
export const siteStats = pgTable("site_stats", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: integer("value").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type SiteStats = typeof siteStats.$inferSelect;

// Orchestration system tables
export const syntheticProfiles = pgTable("synthetic_profiles", {
  id: serial("id").primaryKey(),
  profileType: text("profile_type").notNull(),
  name: text("name").notNull(),
  rank: text("rank").notNull(),
  mos: text("mos").notNull(),
  mosLabel: text("mos_label").notNull(),
  yearsOfService: integer("years_of_service").notNull(),
  careerGoal: text("career_goal").notNull(),
  goalLabel: text("goal_label").notNull(),
  constraints: text("constraints").array(),
  credits: integer("credits").default(0),
  hasDegree: boolean("has_degree").default(false),
  itExperience: boolean("it_experience").default(false),
  clearanceLevel: text("clearance_level"),
  deploymentStatus: text("deployment_status").default("garrison"),
  fundingAvailable: text("funding_available").default("full"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const scenarioRuns = pgTable("scenario_runs", {
  id: serial("id").primaryKey(),
  scenarioId: text("scenario_id").notNull().unique(),
  profileId: integer("profile_id"),
  status: text("status").notNull().default("pending"),
  inputs: text("inputs"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const scenarioOutputs = pgTable("scenario_outputs", {
  id: serial("id").primaryKey(),
  scenarioRunId: integer("scenario_run_id").notNull(),
  engineOutput: text("engine_output"),
  explanation: text("explanation"),
  visualData: text("visual_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const generatedReports = pgTable("generated_reports", {
  id: serial("id").primaryKey(),
  scenarioRunId: integer("scenario_run_id"),
  batchId: text("batch_id"),
  reportType: text("report_type").notNull(),
  title: text("title").notNull(),
  content: text("content"),
  htmlContent: text("html_content"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSyntheticProfileSchema = createInsertSchema(syntheticProfiles).omit({ id: true, createdAt: true });
export const insertScenarioRunSchema = createInsertSchema(scenarioRuns).omit({ id: true, createdAt: true, completedAt: true });
export const insertScenarioOutputSchema = createInsertSchema(scenarioOutputs).omit({ id: true, createdAt: true });
export const insertGeneratedReportSchema = createInsertSchema(generatedReports).omit({ id: true, createdAt: true });

export type SyntheticProfile = typeof syntheticProfiles.$inferSelect;
export type InsertSyntheticProfile = z.infer<typeof insertSyntheticProfileSchema>;
export type ScenarioRun = typeof scenarioRuns.$inferSelect;
export type InsertScenarioRun = z.infer<typeof insertScenarioRunSchema>;
export type ScenarioOutput = typeof scenarioOutputs.$inferSelect;
export type InsertScenarioOutput = z.infer<typeof insertScenarioOutputSchema>;
export type GeneratedReport = typeof generatedReports.$inferSelect;
export type InsertGeneratedReport = z.infer<typeof insertGeneratedReportSchema>;

export * from "./models/chat";
