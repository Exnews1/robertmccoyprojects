import { Express } from "express";
import { Server } from "http";
import { storage } from "./storage";
import { insertPublicationSchema, insertExpertCommentarySchema } from "@shared/schema";
import { ZodError } from "zod";
import { seedDatabase } from "./seed";

export async function registerRoutes(httpServer: Server, app: Express) {
  app.get("/api/frameworks", async (_req: any, res: any) => {
    const frameworks = await storage.getFrameworks();
    res.json(frameworks);
  });

  app.get("/api/compliance-items", async (req: any, res: any) => {
    const frameworkId = req.query.frameworkId ? parseInt(req.query.frameworkId as string) : undefined;
    const items = await storage.getComplianceItems(frameworkId);
    res.json(items);
  });

  app.get("/api/publications", async (_req: any, res: any) => {
    const publications = await storage.getPublications();
    res.json(publications);
  });

  app.post("/api/publications", async (req: any, res: any) => {
    try {
      const pub = insertPublicationSchema.parse(req.body);
      const newPub = await storage.createPublication(pub);
      res.status(201).json(newPub);
    } catch (e) {
      if (e instanceof ZodError) {
        res.status(400).json({ message: e.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.post("/api/seed", async (_req: any, res: any) => {
    try {
      await seedDatabase();
      const publications = await storage.getPublications();
      res.json({ success: true, count: publications.length });
    } catch (e: any) {
      res.status(500).json({ message: e?.message || "Seed failed" });
    }
  });

  app.post("/api/explore", async (req: any, res: any) => {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    const results = [
      {
        section: "Governance Architecture",
        excerpt: "The framework enforces three non-negotiable constraints: no predictive outcome modeling, no individual risk scoring, and no automated approvals. These constraints are architectural, not policy-based.",
        page: 12,
        reference: "Section 3.2 - Bounded AI Constraints"
      },
      {
        section: "Human-in-the-Loop Design",
        excerpt: "All recommendations require human validation before action. The system provides context and options but never directs decisions autonomously.",
        page: 18,
        reference: "Section 4.1 - Advisory Layer Architecture"
      },
      {
        section: "Institutional Learning",
        excerpt: "Aggregated, de-identified patterns inform policy refinement without compromising individual privacy or creating feedback loops that could influence individual outcomes.",
        page: 24,
        reference: "Section 5.3 - Ethical Data Aggregation"
      }
    ];

    res.json({ results });
  });

  app.post("/api/commentary", async (req: any, res: any) => {
    try {
      const commentary = insertExpertCommentarySchema.parse(req.body);
      const newCommentary = await storage.createExpertCommentary(commentary);
      res.status(201).json({ id: newCommentary.submissionId });
    } catch (e) {
      if (e instanceof ZodError) {
        res.status(400).json({ message: e.errors[0].message });
      } else {
        console.error("Commentary submission error:", e);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  return app;
}
