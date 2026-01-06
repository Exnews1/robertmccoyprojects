import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

async function seedDatabase() {
  const existingFrameworks = await storage.getFrameworks();
  if (existingFrameworks.length === 0) {
    const eo14110 = await storage.createFramework({
      name: "EO 14110",
      year: "2023",
      description: "Safe, Secure, and Trustworthy AI",
      icon: "fa-landmark",
    });

    const nist = await storage.createFramework({
      name: "NIST AI RMF 1.0",
      year: "2023",
      description: "Trustworthiness Framework",
      icon: "fa-shield-alt",
    });
    
    // EO 14110 Items
    await storage.createComplianceItem({
      frameworkId: eo14110.id,
      requirement: "Mandates risk assessments for high-impact AI affecting rights/safety; Prohibits opaque or rights-impacting automated decisions without safeguards.",
      designChoice: "Explicit prohibition of: Predictive outcome modeling, Individual risk scoring, Automated approvals, Optimization objectives",
      strategicAdvantage: "Eliminates exposure to prohibited high-risk practices; Ensures full compliance while preserving service-member agency and transition equity.",
      status: "Fully Compliant",
      tags: ["High-Impact", "Rights Protection"],
    });

    // NIST Items
    await storage.createComplianceItem({
      frameworkId: nist.id,
      requirement: "Emphasizes trustworthiness characteristics: Transparent, Explainable, Fair. Cautions against bias amplification and lack of human oversight.",
      designChoice: "Bounded AI limited to: Explainable translation, Rule-based signals, De-identified aggregation. Deliberate non-use of predictive functions.",
      strategicAdvantage: "Transforms ethical restraint into institutional trust; Enables safe scaling and explainable outputs that build confidence.",
      status: "Trust Building",
      tags: ["Trust Building", "Scalable"],
    });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed database on startup
  seedDatabase();

  app.get(api.frameworks.list.path, async (req, res) => {
    const frameworks = await storage.getFrameworks();
    res.json(frameworks);
  });

  app.get(api.frameworks.get.path, async (req, res) => {
    const framework = await storage.getFramework(Number(req.params.id));
    if (!framework) {
      return res.status(404).json({ message: "Framework not found" });
    }
    res.json(framework);
  });

  app.get(api.complianceItems.list.path, async (req, res) => {
    const frameworkId = req.query.frameworkId ? Number(req.query.frameworkId) : undefined;
    const items = await storage.getComplianceItems(frameworkId);
    res.json(items);
  });

  return httpServer;
}
