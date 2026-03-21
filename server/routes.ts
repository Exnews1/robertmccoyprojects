import { Express } from "express";
import { Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { insertPublicationSchema, insertExpertCommentarySchema, insertInquirySchema } from "@shared/schema";
import { ZodError } from "zod";
import { seedDatabase } from "./seed";
import { generateEmbedding, cosineSimilarity, getRelevanceLabel } from "./openai";
import { sendInquiryNotification } from "./gmail";
import OpenAI from "openai";
import { db } from "./db";
import { meridianStaging, meridianRepository, meridianAudit, meridianFinancials, insuranceStaging, insuranceRepository, insuranceAudit } from "@shared/schema";
import { classifyDocument, generateStandardName } from "./meridianClassification";
import { classifyInsuranceDocument, fallbackClassify, generateStandardInsuranceName, DOC_TYPES, POLICY_LINES } from "./insuranceClassification";
import { eq, and, desc } from "drizzle-orm";

function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim()
    .slice(0, 2000);
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private globalActive = 0;
  private dailyCount = 0;
  private dailyResetTime = Date.now();
  private lastCleanup = Date.now();

  constructor(
    private perIpLimit: number = 10,
    private windowMs: number = 60_000,
    private maxConcurrent: number = 15,
    private dailyLimit: number = 500,
  ) {
    setInterval(() => this.cleanup(), 300_000);
  }

  private getClientIp(req: any): string {
    return req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip || "unknown";
  }

  private resetDailyIfNeeded() {
    if (Date.now() - this.dailyResetTime > 86_400_000) {
      this.dailyCount = 0;
      this.dailyResetTime = Date.now();
    }
  }

  private cleanup() {
    const now = Date.now();
    const entries = Array.from(this.requests.entries());
    for (let i = 0; i < entries.length; i++) {
      const [ip, timestamps] = entries[i];
      const valid = timestamps.filter((t: number) => now - t < this.windowMs);
      if (valid.length === 0) {
        this.requests.delete(ip);
      } else {
        this.requests.set(ip, valid);
      }
    }
    this.lastCleanup = now;
  }

  check(req: any): { allowed: boolean; reason?: string; retryAfter?: number } {
    this.resetDailyIfNeeded();

    if (this.dailyCount >= this.dailyLimit) {
      return { allowed: false, reason: "Thanks for your interest! To manage demo costs, this safeguard has been activated for the day. For additional access or questions, connect with Robert McCoy via the Whova app or email data@robertmccoyprojects.com." };
    }

    if (this.globalActive >= this.maxConcurrent) {
      return { allowed: false, reason: "Thanks for your interest! The system is handling several requests right now. Please try again in a few seconds.", retryAfter: 5 };
    }

    const ip = this.getClientIp(req);
    const now = Date.now();
    const timestamps = (this.requests.get(ip) || []).filter(t => now - t < this.windowMs);

    if (timestamps.length >= this.perIpLimit) {
      const oldestInWindow = timestamps[0];
      const retryAfter = Math.ceil((this.windowMs - (now - oldestInWindow)) / 1000);
      return { allowed: false, reason: `Thanks for your interest! To control demo costs, this safeguard limits requests. Your access resets in about ${retryAfter} seconds. For more access, connect with Robert McCoy via the Whova app or email data@robertmccoyprojects.com.`, retryAfter };
    }

    timestamps.push(now);
    this.requests.set(ip, timestamps);
    this.globalActive++;
    this.dailyCount++;
    return { allowed: true };
  }

  release() {
    this.globalActive = Math.max(0, this.globalActive - 1);
  }

  getStats() {
    return { active: this.globalActive, dailyUsed: this.dailyCount, dailyLimit: this.dailyLimit };
  }
}

const aiRateLimiter = new RateLimiter(10, 60_000, 15, 500);

export async function registerRoutes(httpServer: Server, app: Express) {
  // Health check – used by AWS ALB / ECS / Docker HEALTHCHECK
  app.get("/api/health", (_req: any, res: any) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Zoho domain verification
  app.get("/zoho-domain-verification.html", (_req: any, res: any) => {
    res.type('text/html').send('90531183');
  });

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

  app.post("/api/search", async (req: any, res: any) => {
    const rateCheck = aiRateLimiter.check(req);
    if (!rateCheck.allowed) {
      return res.status(429).json({ message: rateCheck.reason, retryAfter: rateCheck.retryAfter });
    }
    try {
      const { query } = req.body;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "Query is required" });
      }

      const entries = await storage.getLibraryEntries();
      
      if (entries.length === 0) {
        return res.json({ results: [] });
      }

      const queryEmbedding = await generateEmbedding(query);

      const scoredEntries = entries
        .filter(entry => entry.embedding)
        .map(entry => {
          const entryEmbedding = JSON.parse(entry.embedding!) as number[];
          const score = cosineSimilarity(queryEmbedding, entryEmbedding);
          return { entry, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      const results = scoredEntries.map(({ entry, score }) => ({
        id: entry.entryId,
        title: entry.title,
        summary: entry.summary,
        year: entry.year,
        documentType: entry.documentType,
        sourceLabel: entry.sourceLabel,
        url: entry.url,
        relevance: getRelevanceLabel(score)
      }));

      res.json({ results });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ message: "Search failed" });
    } finally {
      aiRateLimiter.release();
    }
  });

  app.get("/api/library", async (_req: any, res: any) => {
    const entries = await storage.getLibraryEntries();
    res.json(entries);
  });

  app.get("/api/library/summary", async (_req: any, res: any) => {
    const summary = await storage.getLibrarySummary();
    res.json(summary);
  });

  // Import sources from CMGF JSON database
  app.post("/api/library/import", async (req: any, res: any) => {
    try {
      const { clearExisting = false, sources } = req.body;
      
      if (!sources || !Array.isArray(sources)) {
        return res.status(400).json({ message: "Sources array is required" });
      }

      if (clearExisting) {
        await storage.clearLibraryEntries();
      }

      // Map JSON sources to library entry format
      const entries = sources.map((source: any) => ({
        entryId: String(source.id),
        title: source.title || "Untitled",
        authors: Array.isArray(source.authors) ? source.authors.join(", ") : source.authors,
        organization: source.journal || null,
        year: source.year ? parseInt(source.year) : null,
        documentType: source.publication_type || "Journal Article",
        summary: source.abstract || `${source.title} - ${source.publication_type || "Research"}`,
        topics: source.pillars || [],
        url: source.doi ? `https://doi.org/${source.doi}` : (source.url || null),
        sourceLabel: source.journal || null,
        visibility: "public",
        embedding: null
      }));

      const inserted = await storage.bulkCreateLibraryEntries(entries);
      res.json({ success: true, imported: inserted, total: sources.length });
    } catch (error: any) {
      console.error("Import error:", error);
      res.status(500).json({ message: error?.message || "Import failed" });
    }
  });

  // Generate embeddings for entries without them (batched)
  app.post("/api/library/generate-embeddings", async (req: any, res: any) => {
    try {
      const { batchSize = 20 } = req.body;
      const entries = await storage.getLibraryEntriesWithoutEmbeddings();
      
      if (entries.length === 0) {
        return res.json({ success: true, updated: 0, remaining: 0, message: "All entries have embeddings" });
      }

      const batch = entries.slice(0, batchSize);
      let updated = 0;
      
      for (const entry of batch) {
        try {
          const textForEmbedding = entry.summary || entry.title;
          const embedding = await generateEmbedding(textForEmbedding);
          await storage.updateLibraryEntryEmbedding(entry.id, JSON.stringify(embedding));
          updated++;
        } catch (err) {
          console.error(`Failed to generate embedding for entry ${entry.id}:`, err);
        }
      }
      
      res.json({ 
        success: true, 
        updated, 
        remaining: entries.length - updated,
        message: `Generated embeddings for ${updated} entries. ${entries.length - updated} remaining.`
      });
    } catch (error: any) {
      console.error("Embedding generation error:", error);
      res.status(500).json({ message: error?.message || "Embedding generation failed" });
    }
  });

  // Regenerate embeddings for all library entries (dev only)
  app.post("/api/library/regenerate-embeddings", async (_req: any, res: any) => {
    // Only allow in development to prevent abuse/cost spikes
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({ message: "This endpoint is disabled in production" });
    }
    
    try {
      const entries = await storage.getLibraryEntries();
      let updated = 0;
      
      for (const entry of entries) {
        try {
          const embedding = await generateEmbedding(entry.summary);
          await storage.updateLibraryEntryEmbedding(entry.id, JSON.stringify(embedding));
          updated++;
        } catch (err) {
          console.error(`Failed to generate embedding for entry ${entry.id}:`, err);
        }
      }
      
      res.json({ success: true, updated, total: entries.length });
    } catch (error) {
      console.error("Embedding regeneration error:", error);
      res.status(500).json({ message: "Failed to regenerate embeddings" });
    }
  });

  // RAG-style answer endpoint with citations
  app.post("/api/answer", async (req: any, res: any) => {
    const rateCheck = aiRateLimiter.check(req);
    if (!rateCheck.allowed) {
      return res.status(429).json({ message: rateCheck.reason, retryAfter: rateCheck.retryAfter });
    }
    try {
      const { query } = req.body;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "Query is required" });
      }

      const entries = await storage.getLibraryEntries();
      
      if (entries.length === 0) {
        return res.json({ 
          answer: null, 
          message: "No sources available in the library.",
          sources: [],
          relatedSources: []
        });
      }

      const queryEmbedding = await generateEmbedding(query);

      const queryLower = query.toLowerCase();
      const scoredEntries = entries
        .filter(entry => entry.embedding)
        .map(entry => {
          const entryEmbedding = JSON.parse(entry.embedding!) as number[];
          let score = cosineSimilarity(queryEmbedding, entryEmbedding);
          
          const titleLower = (entry.title || "").toLowerCase();
          const summaryLower = (entry.summary || "").toLowerCase();
          
          if (titleLower.includes(queryLower)) score += 0.15;
          if (summaryLower.includes(queryLower)) score += 0.10;
          
          return { entry, score };
        })
        .sort((a, b) => b.score - a.score);

      const relevantSources = scoredEntries.filter(s => s.score >= 0.35).slice(0, 3);
      const relatedSources = scoredEntries.slice(0, 5);

      if (relevantSources.length === 0) {
        return res.json({
          answer: null,
          message: "No sources in the library directly address this question. Please try a different query or browse the related sources below.",
          sources: [],
          relatedSources: relatedSources.map(({ entry, score }) => ({
            id: entry.entryId,
            title: entry.title,
            summary: entry.summary,
            year: entry.year,
            documentType: entry.documentType,
            sourceLabel: entry.sourceLabel,
            url: entry.url,
            authors: entry.authors,
            topics: entry.topics,
            relevance: getRelevanceLabel(score)
          }))
        });
      }

      const sourceContext = relevantSources.map(({ entry }, idx) => 
        `[Source ${idx + 1}: "${entry.title}"]\n${entry.summary}`
      ).join("\n\n");

      const sourceList = relevantSources.map(({ entry }) => ({
        id: entry.entryId,
        title: entry.title
      }));

      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a research assistant for the Career Mobility Governance Framework (CMGF) project, which focuses on military learner career mobility and transition support. Your task is to answer questions using ONLY the provided source documents.

CMGF Five Pillars Context:
- Pillar 1: Military Learner Career Mobility
- Pillar 2: Empowerment Strategies & Stackable Pathways (credentials, micro-credentials)
- Pillar 3: ISR & AI-Assisted Career Advising (Installation Status Report, AI career guidance systems)
- Pillar 4: Translating Military Experience (skills translation, competency mapping)
- Pillar 5: Veteran & Servicemember Learner Voice

Key Acronyms:
- ISR: Installation Status Report
- ESO: Education Service Officer

Rules:
1. Answer ONLY based on information in the provided sources
2. Include inline citations like [Source 1] or [Source 2] when referencing specific information
3. If the sources don't contain enough information to fully answer the question, say so
4. Keep answers concise but informative (2-4 sentences)
5. Never make up information not found in the sources
6. Do not provide personal opinions or interpretations beyond what the sources state`
          },
          {
            role: "user",
            content: `Question: ${query}\n\nAvailable Sources:\n${sourceContext}\n\nProvide a grounded answer with citations:`
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      });

      const answer = completion.choices[0]?.message?.content || null;

      res.json({
        answer,
        sources: sourceList,
        relatedSources: relatedSources.map(({ entry, score }) => ({
          id: entry.entryId,
          title: entry.title,
          summary: entry.summary,
          year: entry.year,
          documentType: entry.documentType,
          sourceLabel: entry.sourceLabel,
          url: entry.url,
          authors: entry.authors,
          topics: entry.topics,
          relevance: getRelevanceLabel(score)
        }))
      });
    } catch (error) {
      console.error("Answer generation error:", error);
      res.status(500).json({ message: "Failed to generate answer" });
    } finally {
      aiRateLimiter.release();
    }
  });

  app.post("/api/generate-pathway", async (req: any, res: any) => {
    const rateCheck = aiRateLimiter.check(req);
    if (!rateCheck.allowed) {
      return res.status(429).json({ message: rateCheck.reason, retryAfter: rateCheck.retryAfter });
    }
    try {
      const { rank, yearsOfService, mos, mosLabel, careerGoal, goalLabel } = req.body;
      if (!mos || !careerGoal) {
        return res.status(400).json({ message: "MOS and career goal are required" });
      }

      const entries = await storage.getLibraryEntries();

      if (entries.length === 0) {
        return res.json({
          message: "No research sources available in the library. Pathway generation requires grounded research data.",
          pathwayOptions: [], constraintRisks: [], policyFriction: [], resourcesRequired: [],
          timelineRange: "N/A", cmgfLayers: [], sources: [], generated: false,
        });
      }

      const goalExpanded = (goalLabel || careerGoal).toLowerCase();
      const goalKeywords: Record<string, string> = {
        "education": "education teaching training instructor workforce development adult learning curriculum",
        "healthcare_admin": "healthcare administration hospital management public health clinical operations",
        "cybersecurity": "cybersecurity information security network defense threat analysis SOC",
        "project_management": "project management PMP leadership program coordination stakeholder",
        "data_analytics": "data analytics data science business intelligence analysis statistics",
        "supply_chain": "supply chain logistics operations management distribution inventory",
        "federal_service": "federal government civil service OPM public administration policy",
        "trade_skills": "trade skills technical vocational apprenticeship construction electrical HVAC",
      };
      const expandedGoal = goalKeywords[careerGoal] || goalExpanded;
      const searchQuery = `military ${mosLabel || mos} transition to ${expandedGoal} career pathway credentials certification veteran workforce`;

      const entriesWithEmbeddings = entries.filter(entry => entry.embedding);
      let scoredEntries: { entry: typeof entries[0]; score: number }[] = [];

      if (entriesWithEmbeddings.length > 0) {
        let queryEmbedding: number[];
        try {
          queryEmbedding = await generateEmbedding(searchQuery);
        } catch (error) {
          console.error("Embedding generation failed, falling back to keyword search:", error);
          queryEmbedding = [];
        }

        if (queryEmbedding.length > 0) {
          scoredEntries = entriesWithEmbeddings
            .map(entry => {
              const entryEmbedding = JSON.parse(entry.embedding!) as number[];
              let score = cosineSimilarity(queryEmbedding, entryEmbedding);
              const titleLower = (entry.title || "").toLowerCase();
              const summaryLower = (entry.summary || "").toLowerCase();
              const topicsLower = (entry.topics || []).join(" ").toLowerCase();
              const goalLower = goalExpanded;
              const mosLower = (mosLabel || mos).toLowerCase();
              if (titleLower.includes(goalLower) || summaryLower.includes(goalLower)) score += 0.1;
              if (titleLower.includes(mosLower) || summaryLower.includes(mosLower)) score += 0.1;
              const goalWords = expandedGoal.split(" ");
              const matchedWords = goalWords.filter((w: string) => w.length > 3 && (titleLower.includes(w) || summaryLower.includes(w) || topicsLower.includes(w)));
              score += matchedWords.length * 0.03;
              return { entry, score };
            })
            .sort((a, b) => b.score - a.score);
        }
      }

      if (scoredEntries.length === 0) {
        const goalWords = expandedGoal.split(" ").filter((w: string) => w.length > 3);
        const mosLower = (mosLabel || mos).toLowerCase();
        scoredEntries = entries
          .map(entry => {
            let score = 0;
            const titleLower = (entry.title || "").toLowerCase();
            const summaryLower = (entry.summary || "").toLowerCase();
            const topicsLower = (entry.topics || []).join(" ").toLowerCase();
            const combined = `${titleLower} ${summaryLower} ${topicsLower}`;
            for (const w of goalWords) {
              if (combined.includes(w)) score += 0.1;
            }
            if (combined.includes(mosLower)) score += 0.15;
            if (combined.includes("military") || combined.includes("veteran") || combined.includes("transition")) score += 0.05;
            if (combined.includes("career") || combined.includes("workforce")) score += 0.03;
            return { entry, score };
          })
          .filter(s => s.score > 0)
          .sort((a, b) => b.score - a.score);
      }

      let relevantSources = scoredEntries.filter(s => s.score >= 0.20);
      if (relevantSources.length === 0) {
        relevantSources = scoredEntries.slice(0, 5);
      }
      if (relevantSources.length === 0) {
        return res.json({
          message: "No research sources available for pathway generation. Try a different pairing or use a pre-mapped scenario.",
          pathwayOptions: [], constraintRisks: [], policyFriction: [], resourcesRequired: [],
          timelineRange: "N/A", cmgfLayers: [], sources: [], generated: false,
        });
      }

      const topSources = relevantSources.slice(0, 5);
      const sourceContext = topSources.map(({ entry }, idx) =>
        `[Source ${idx + 1}: "${entry.title}" (${entry.year})]\n${entry.summary}`
      ).join("\n\n");

      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are the CMGF (Career Mobility Governance Framework) pathway analysis engine. You produce structured career transition analyses for military service members.

IMPORTANT CONSTRAINTS — you are a BOUNDED AI system:
- You do NOT predict outcomes or score individuals
- You do NOT make automated decisions or approvals
- You translate military competencies to civilian credential domains using rule-based mapping
- You identify binding constraints from policy and timeline data
- All outputs require human advisory review (Part C)

Respond ONLY with valid JSON matching this exact structure:
{
  "pathwayOptions": [
    { "name": "string - credential or program name with track", "match": "string - domain alignment percentage like 85% (this is MOS-to-credential domain overlap, NOT an individual score or prediction)", "timeframe": "string - e.g. 6-12 months" }
  ],
  "constraintRisks": [
    { "label": "string - risk name", "severity": "high|medium|low", "detail": "string - explanation" }
  ],
  "policyFriction": [
    { "point": "string - the friction point", "framework": "string - policy or regulation name" }
  ],
  "resourcesRequired": [
    { "resource": "string - resource name with cost if known", "status": "string - eligibility status" }
  ],
  "readinessMeasures": [
    { "dimension": "Timeline Feasibility", "status": "green|yellow|red", "label": "string - short label like Strong, Moderate, Extended", "detail": "string - brief explanation" },
    { "dimension": "Family Impact", "status": "green|yellow|red", "label": "string", "detail": "string" },
    { "dimension": "Transition Stress", "status": "green|yellow|red", "label": "string", "detail": "string" },
    { "dimension": "Domain Alignment", "status": "green|yellow|red", "label": "string", "detail": "string" }
  ],
  "specialConsiderations": [
    "string - unique observation specific to this MOS/goal combination that wouldn't apply to other transitions"
  ],
  "timelineRange": "string - overall timeline range",
  "cmgfLayers": [
    { "layer": "Part A: Service Member Interface", "action": "string - what this layer does for this scenario" },
    { "layer": "Part B: AI Mediation Framework", "action": "string - what this layer does" },
    { "layer": "Part C: Advisory & Human Review", "action": "string - what this layer does" }
  ],
  "explanation": "string - 2-3 sentence plain-language explanation of WHY these pathways were identified, referencing the source research"
}

CYBERSECURITY STRUCTURAL REALITY — Critical domain knowledge:
- Cybersecurity is a TIER 2/3 OCCUPATION, not entry-level. It depends on foundational capability domains: IT support, networking, systems administration, programming, or military technical experience.
- For non-technical MOS (logistics, admin, medical, combat arms) targeting cybersecurity: Timeline Feasibility and Domain Alignment MUST be RED. These learners need 6-12 months of foundational training (CompTIA A+, Network+) BEFORE attempting Security+ or CISSP. Realistic total timeline: 12-18 months minimum.
- For cyber-adjacent MOS (intel, comms/signal, cyber ops): These MOS provide foundational domains directly. Timeline can be GREEN (0-6 month transition). Domain Alignment should reflect the strong prerequisite satisfaction.
- Credential weighting: In cybersecurity, certification relevance > degree relevance for early career. Primary entry credential: CompTIA Security+. Secondary: Network+, CySA+, Cisco CyberOps.
- Entry role taxonomy: SOC Analyst (most common entry — weights networking high, Security+ medium-high, degree low-medium), GRC Analyst (weights policy knowledge high, technical depth lower), Vulnerability Analyst, Security Technician, Junior Penetration Tester. Each has different prerequisite weights.
- Experience substitution: Employers accept home labs, CTF competitions, military experience, IT help desk, cloud labs as experience equivalents. Include these as pathways.
- Failure risk signals: Certification failure rates increase with no prior technical exposure, math/logic gaps, no hands-on practice, low study time. Surface these as constraint risks for non-technical MOS.
- Wage signals: Entry $55k-$80k, Mid $85k-$120k, Senior $130k+. TS/SCI clearance holders command $15k-$30k premiums.

READINESS MEASURES: Always include exactly 4 measures (Timeline Feasibility, Family Impact, Transition Stress, Domain Alignment). Status must be green, yellow, or red based on the MOS-to-credential domain mapping. These are standardized dimensional assessments, NOT individual predictions.

SPECIAL CONSIDERATIONS: Provide 2-3 unique observations specific to this exact MOS/goal combination — things that wouldn't apply to other transitions. These should be actionable, specific, and grounded in the research sources.

Provide 2-3 pathway options, 2-3 constraint risks, 2-3 policy friction points, 3-5 resources, all 4 readiness measures, 2-3 special considerations, and all 3 CMGF layers. Base your analysis on the provided research sources. Do not invent statistics or cite sources not provided.`
          },
          {
            role: "user",
            content: `Generate a CMGF pathway analysis for:
- Rank: ${rank || "E-6"}
- Years of Service: ${yearsOfService || "10"}
- MOS/Specialty: ${mosLabel || mos}
- Career Goal: ${goalLabel || careerGoal}

Research Sources:
${sourceContext}

Respond with JSON only.`
          }
        ],
        max_tokens: 2000,
        temperature: 0.4,
        response_format: { type: "json_object" }
      });

      const rawResponse = completion.choices[0]?.message?.content;
      if (!rawResponse) {
        return res.status(500).json({ message: "Failed to generate pathway analysis" });
      }

      const pathway = JSON.parse(rawResponse);

      res.json({
        ...pathway,
        sources: topSources.slice(0, 3).map(({ entry, score }) => ({
          id: entry.entryId,
          title: entry.title,
          year: entry.year,
          relevance: getRelevanceLabel(score),
        })),
        generated: true,
      });
    } catch (error) {
      console.error("Pathway generation error:", error);
      res.status(500).json({ message: "Failed to generate pathway analysis" });
    } finally {
      aiRateLimiter.release();
    }
  });

  app.post("/api/inquiries", async (req: any, res: any) => {
    try {
      const inquiry = insertInquirySchema.parse(req.body);
      const sanitized = {
        ...inquiry,
        name: sanitizeInput(inquiry.name),
        message: sanitizeInput(inquiry.message),
        organization: inquiry.organization ? sanitizeInput(inquiry.organization) : inquiry.organization,
      };
      const newInquiry = await storage.createInquiry(sanitized);
      
      sendInquiryNotification({
        name: sanitized.name,
        email: sanitized.email,
        organization: sanitized.organization,
        inquiryType: sanitized.inquiryType,
        message: sanitized.message
      }).catch(err => console.error("Email notification failed:", err));
      
      res.status(201).json({ success: true, id: newInquiry.id });
    } catch (e) {
      if (e instanceof ZodError) {
        res.status(400).json({ message: e.errors[0].message });
      } else {
        console.error("Inquiry submission error:", e);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/inquiries", async (_req: any, res: any) => {
    const inqs = await storage.getInquiries();
    res.json(inqs);
  });

  app.get("/api/visitors", async (_req: any, res: any) => {
    const count = await storage.getVisitorCount();
    res.json({ count });
  });

  app.post("/api/visitors", async (_req: any, res: any) => {
    const count = await storage.incrementVisitorCount();
    res.json({ count });
  });

  const validStatKeys = ["root_visits", "demo_launches", "paper_downloads", "cmgf_visits"];

  app.get("/api/stats", async (_req: any, res: any) => {
    const stats = await storage.getAllStats();
    res.json(stats);
  });

  app.get("/api/stats/:key", async (req: any, res: any) => {
    const { key } = req.params;
    if (!validStatKeys.includes(key)) {
      return res.status(400).json({ error: "Invalid stat key" });
    }
    const count = await storage.getStatCount(key);
    res.json({ key, count });
  });

  app.post("/api/stats/:key", async (req: any, res: any) => {
    const { key } = req.params;
    if (!validStatKeys.includes(key)) {
      return res.status(400).json({ error: "Invalid stat key" });
    }
    const count = await storage.incrementStatCount(key);
    res.json({ key, count });
  });

  const validEventTypes = [
    "sm_scenario_run", "sm_scenario_view", "sm_advisor_chat",
    "eso_caseload_view", "eso_caseload_run", "isr_report_view", "isr_report_run",
    "dashboard_view", "explorer_search", "page_view",
  ];

  app.post("/api/demo-events", async (req: any, res: any) => {
    try {
      const { eventType, sessionId, metadata } = req.body;
      if (!eventType || !validEventTypes.includes(eventType)) {
        return res.status(400).json({ error: "Invalid event type" });
      }
      const event = await storage.logDemoEvent({
        eventType,
        sessionId: sessionId || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        userAgent: req.headers["user-agent"] || null,
      });
      res.json({ id: event.id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/demo-analytics", async (req: any, res: any) => {
    try {
      const hours = parseInt(req.query.hours as string) || 24;
      const since = new Date(Date.now() - hours * 60 * 60 * 1000);
      const [counts, timeline, uniqueSessions, recentEvents] = await Promise.all([
        storage.getDemoEventCounts(since),
        storage.getDemoEventTimeline(since, 15),
        storage.getUniqueSessions(since),
        storage.getDemoEvents(since),
      ]);

      const totalEvents = Object.values(counts).reduce((a, b) => a + b, 0);

      res.json({
        period_hours: hours,
        since: since.toISOString(),
        total_events: totalEvents,
        unique_sessions: uniqueSessions,
        event_counts: counts,
        timeline,
        recent_events: recentEvents.slice(0, 50),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  const advisorOpenai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });

  app.post("/api/advisor-chat", async (req: any, res: any) => {
    const rateCheck = aiRateLimiter.check(req);
    if (!rateCheck.allowed) {
      return res.status(429).json({ error: rateCheck.reason, retryAfter: rateCheck.retryAfter });
    }
    try {
      const { message: rawMessage, engineOutput, chatHistory } = req.body;

      if (!rawMessage || !engineOutput) {
        return res.status(400).json({ error: "Message and engineOutput are required" });
      }

      const message = sanitizeInput(String(rawMessage));

      const taEligible = (engineOutput.resourcesRequired || []).filter((r: any) => r.status?.toLowerCase().includes("ta-eligible"));
      const caEligible = (engineOutput.resourcesRequired || []).filter((r: any) => r.status?.toLowerCase().includes("ca-eligible"));
      const selfFunded = (engineOutput.resourcesRequired || []).filter((r: any) => r.status?.toLowerCase().includes("self-funded") || r.status?.toLowerCase().includes("self-pay"));
      const domainMeasure = (engineOutput.readinessMeasures || []).find((r: any) => r.dimension === "Domain Alignment");
      const familyMeasure = (engineOutput.readinessMeasures || []).find((r: any) => r.dimension === "Family Impact");
      const stressMeasure = (engineOutput.readinessMeasures || []).find((r: any) => r.dimension === "Transition Stress");

      const systemPrompt = `You are a CMGF Career Transition Advisor — a knowledgeable, supportive counselor helping service members navigate military-to-civilian career transitions.

IMPORTANT RULES:
- You can ONLY discuss information that appears in the ENGINE OUTPUT below. This is your entire knowledge base for this conversation.
- Do NOT invent statistics, timelines, certifications, or costs that aren't in the engine output.
- If asked something outside the engine output, say "That's outside what our analysis covers — I'd recommend discussing that with your career counselor."
- Be conversational, warm, and encouraging — but always accurate.
- Use plain language. Avoid jargon unless explaining it.
- When referencing specific data, mention where it comes from (e.g., "Based on the alignment analysis..." or "The constraint detection shows...").
- Keep responses concise — 2-4 paragraphs maximum unless the question requires detail.

PERSONA & ADVISOR TONE:
- Speak as if you have reviewed the service member's documented training, education history, and current benefit eligibility signals. Use the word "signals" when referencing benefit status to convey institutional integration without implying direct access to live personnel systems.
- Reference TA/CA funding status naturally based on the engine output — you know what's flagged as covered and what isn't.
- When discussing financial aspects, be sensitive to family stress implications. If self-funded costs exist alongside family impact concerns, acknowledge the real-world pressure.
- Connect education gaps to specific credential recommendations from the engine output.
- If the service member asks about their education background, discuss what their MOS training provides and what civilian credential gaps exist based on the Domain Alignment and Readiness Measures.
- MOS-aligned credential exception: When a credential directly supports the service member's existing MOS (high Domain Alignment), the military may fund it as professional military education outside normal COOL/CA limits. If the engine shows green/high Domain Alignment, mention that some credentials may qualify for in-service military education funding rather than consuming CA slots. This is especially relevant when the career goal closely matches the current MOS.
- Always reinforce that these results are based on current policy constraints and typical pathway timelines, and that a human advisor will review the plan before any decisions are finalized.

ENGINE OUTPUT (This is the deterministic analysis from the CMGF Rules Engine — your ONLY source of truth):

Persona: ${engineOutput.persona || 'Not specified'}
Career Goal: ${engineOutput.careerGoal || 'Not specified'}
Timeline Range: ${engineOutput.timelineRange || 'Not specified'}

Pathway Options:
${(engineOutput.pathwayOptions || []).map((p: any) => `- ${p.name} (${p.match} match, ${p.timeframe})`).join('\n')}

Readiness Measures:
${(engineOutput.readinessMeasures || []).map((r: any) => `- ${r.dimension}: ${r.status.toUpperCase()} — ${r.label}. ${r.detail}`).join('\n')}

Constraint Risks:
${(engineOutput.constraintRisks || []).map((c: any) => `- [${c.severity.toUpperCase()}] ${c.label}: ${c.detail}`).join('\n')}

Policy Friction Points:
${(engineOutput.policyFriction || []).map((p: any) => `- ${p.point} (${p.framework})`).join('\n')}

Education & Funding Analysis:
- Domain Alignment: ${domainMeasure ? `${domainMeasure.status.toUpperCase()} — ${domainMeasure.label}. ${domainMeasure.detail}` : 'Not assessed'}
- Family Impact: ${familyMeasure ? `${familyMeasure.status.toUpperCase()} — ${familyMeasure.label}. ${familyMeasure.detail}` : 'Not assessed'}
- Transition Stress: ${stressMeasure ? `${stressMeasure.status.toUpperCase()} — ${stressMeasure.label}. ${stressMeasure.detail}` : 'Not assessed'}
- TA-Eligible Resources: ${taEligible.length > 0 ? taEligible.map((r: any) => r.resource).join(', ') : 'None identified'}
- CA-Eligible Credentials: ${caEligible.length > 0 ? caEligible.map((r: any) => r.resource).join(', ') : 'None identified'}
- Self-Funded Items: ${selfFunded.length > 0 ? selfFunded.map((r: any) => r.resource).join(', ') : 'None — all costs appear covered by TA/CA'}

Resources Required:
${(engineOutput.resourcesRequired || []).map((r: any) => `- ${r.resource}: ${r.status}`).join('\n')}

Special Considerations:
${(engineOutput.specialConsiderations || []).map((s: any) => `- ${s}`).join('\n')}

CMGF Architecture Layers:
${(engineOutput.cmgfLayers || []).map((l: any) => `- ${l.layer}: ${l.action}`).join('\n')}

Explanation: ${engineOutput.explanation || 'Not available'}

${engineOutput.activeConstraints ? `\nActive Constraint Alerts:\n${engineOutput.activeConstraints.map((a: any) => `- ${a.label}: ${a.detail} (${a.framework})`).join('\n')}` : ''}`;

      const messages: any[] = [
        { role: "system", content: systemPrompt },
      ];

      if (chatHistory && Array.isArray(chatHistory)) {
        for (const msg of chatHistory) {
          messages.push({ role: msg.role, content: msg.content });
        }
      }

      messages.push({ role: "user", content: message });

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const stream = await advisorOpenai.chat.completions.create({
        model: "gpt-5-mini",
        messages,
        stream: true,
        max_completion_tokens: 2048,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Error in advisor chat:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Failed to get response" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to get advisor response" });
      }
    } finally {
      aiRateLimiter.release();
    }
  });

  app.get("/api/ai-usage", async (_req: any, res: any) => {
    res.json(aiRateLimiter.getStats());
  });

  // ==========================================
  // ORCHESTRATION ENGINE ENDPOINTS
  // ==========================================

  app.get("/api/orchestrator/profile-types", async (_req: any, res: any) => {
    const { getAvailableProfileTypes } = await import("./orchestrator/profiles");
    res.json(getAvailableProfileTypes());
  });

  app.post("/api/orchestrator/run-scenario", async (req: any, res: any) => {
    try {
      const { profileType, overrides, generateReport: genReport } = req.body;
      if (!profileType) {
        return res.status(400).json({ error: "profileType is required" });
      }

      const { generateProfile } = await import("./orchestrator/profiles");
      const { runScenario } = await import("./orchestrator/engine");

      const profile = generateProfile(profileType, overrides || {});
      const result = await runScenario(profile);

      res.json(result);

      if (genReport) {
        try {
          const { generatePathwayReport } = await import("./orchestrator/reports");
          await generatePathwayReport(result);
        } catch (reportErr) {
          console.error("Background report generation failed:", reportErr);
        }
      }
    } catch (error: any) {
      console.error("Orchestrator error:", error);
      res.status(500).json({ error: error.message || "Scenario execution failed" });
    }
  });

  app.post("/api/orchestrator/run-batch", async (req: any, res: any) => {
    try {
      const { count, profileTypes, fixedMos, fixedGoal } = req.body;
      const { runBatch } = await import("./orchestrator/batch");

      const result = await runBatch({
        count: count || 10,
        profileTypes,
        fixedMos,
        fixedGoal,
      });

      res.json(result);
    } catch (error: any) {
      console.error("Batch simulation error:", error);
      res.status(500).json({ error: error.message || "Batch simulation failed" });
    }
  });

  app.post("/api/reports/generate", async (req: any, res: any) => {
    try {
      const { scenarioId, reportType } = req.body;
      if (!scenarioId || !reportType) {
        return res.status(400).json({ error: "scenarioId and reportType are required" });
      }

      const { getScenarioById } = await import("./orchestrator/engine");
      const scenario = await getScenarioById(scenarioId);
      if (!scenario) {
        return res.status(404).json({ error: "Scenario not found" });
      }

      const { generatePathwayReport, generateESOSummary, generateLeadershipBrief } = await import("./orchestrator/reports");

      let report;
      switch (reportType) {
        case "pathway":
          report = await generatePathwayReport(scenario);
          break;
        case "eso_summary":
          report = await generateESOSummary(scenario);
          break;
        case "leadership_brief":
          report = await generateLeadershipBrief(scenario);
          break;
        default:
          return res.status(400).json({ error: `Unknown report type: ${reportType}` });
      }

      res.json({ id: report.id, url: `/api/reports/${report.id}` });
    } catch (error: any) {
      console.error("Report generation error:", error);
      res.status(500).json({ error: error.message || "Report generation failed" });
    }
  });

  app.post("/api/reports/generate-batch", async (req: any, res: any) => {
    try {
      const { batchId, totalCases, results } = req.body;
      if (!batchId || !results) {
        return res.status(400).json({ error: "batchId and results are required" });
      }

      const { generateBatchISRReport } = await import("./orchestrator/reports");
      const report = await generateBatchISRReport({ batchId, totalCases, results });

      res.json({ id: report.id, url: `/api/reports/${report.id}` });
    } catch (error: any) {
      console.error("Batch report error:", error);
      res.status(500).json({ error: error.message || "Batch report generation failed" });
    }
  });

  app.get("/api/reports/:id", async (req: any, res: any) => {
    try {
      const { eq } = await import("drizzle-orm");
      const { generatedReports } = await import("@shared/schema");
      const { db } = await import("./db");
      const [report] = await db.select().from(generatedReports).where(eq(generatedReports.id, parseInt(req.params.id)));
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.setHeader("Content-Type", "text/html");
      res.send(report.htmlContent);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch report" });
    }
  });

  app.get("/api/orchestrator/scenarios", async (_req: any, res: any) => {
    try {
      const { listScenarios } = await import("./orchestrator/engine");
      const scenarios = await listScenarios();
      res.json(scenarios);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to list scenarios" });
    }
  });

  app.get("/api/orchestrator/scenarios/:id", async (req: any, res: any) => {
    try {
      const { getScenarioById } = await import("./orchestrator/engine");
      const scenario = await getScenarioById(req.params.id);
      if (!scenario) {
        return res.status(404).json({ error: "Scenario not found" });
      }
      res.json(scenario);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch scenario" });
    }
  });

  // ==========================================
  // SERVICE MEMBER + ISR PIPELINE ENDPOINTS
  // ==========================================

  app.post("/api/sm/request", async (req: any, res: any) => {
    try {
      const { name: rawName, rank, currentMos, currentMosLabel, goalDomain, goalLabel, constraints, notes } = req.body;
      if (!rawName || !rank || !currentMos || !goalDomain || !goalLabel) {
        return res.status(400).json({ error: "name, rank, currentMos, goalDomain, goalLabel are required" });
      }

      const name = sanitizeInput(String(rawName));
      const { serviceMemberRequests, isrCases, auditLogEntries } = await import("@shared/schema");
      const caseId = `ISR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

      const [request] = await db.insert(serviceMemberRequests).values({
        name,
        rank,
        currentMos,
        currentMosLabel: currentMosLabel || currentMos,
        goalDomain,
        goalLabel,
        constraints: constraints || [],
        notes: notes ? sanitizeInput(String(notes)) : null,
        status: "pending",
      }).returning();

      const [isrCase] = await db.insert(isrCases).values({
        caseId,
        requestId: request.id,
        priority: (constraints && constraints.length > 2) ? "high" : constraints?.length > 0 ? "normal" : "low",
        status: "queued",
      }).returning();

      await db.insert(auditLogEntries).values({
        caseId,
        eventType: "request_submitted",
        actor: name,
        detail: `Service member ${name} (${rank}) submitted career transition request: ${currentMosLabel || currentMos} → ${goalLabel}`,
        payload: JSON.stringify({ requestId: request.id, rank, currentMos, goalDomain, constraints }),
      });

      await db.insert(auditLogEntries).values({
        caseId,
        eventType: "case_created",
        actor: "CMGF System",
        detail: `ISR case ${caseId} created and queued for advisor review. Priority: ${isrCase.priority}`,
        payload: JSON.stringify({ caseId, priority: isrCase.priority }),
      });

      res.json({ request, caseId, message: "Request submitted and ISR case created" });
    } catch (error: any) {
      console.error("SM request error:", error);
      res.status(500).json({ error: "Failed to submit request" });
    }
  });

  app.get("/api/sm/requests", async (_req: any, res: any) => {
    try {
      const { serviceMemberRequests } = await import("@shared/schema");
      const { desc } = await import("drizzle-orm");
      const requests = await db.select().from(serviceMemberRequests).orderBy(desc(serviceMemberRequests.createdAt));
      res.setHeader("X-Data-Notice", "All data is synthetic. No real PII is stored or served.");
      res.json(requests);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch requests" });
    }
  });

  app.get("/api/isr/queue", async (_req: any, res: any) => {
    try {
      const { isrCases, serviceMemberRequests } = await import("@shared/schema");
      const { desc, eq } = await import("drizzle-orm");

      const cases = await db.select({
        id: isrCases.id,
        caseId: isrCases.caseId,
        requestId: isrCases.requestId,
        assignedTo: isrCases.assignedTo,
        priority: isrCases.priority,
        status: isrCases.status,
        engineOutput: isrCases.engineOutput,
        createdAt: isrCases.createdAt,
        updatedAt: isrCases.updatedAt,
        smName: serviceMemberRequests.name,
        smRank: serviceMemberRequests.rank,
        smMos: serviceMemberRequests.currentMosLabel,
        smGoal: serviceMemberRequests.goalLabel,
        smConstraints: serviceMemberRequests.constraints,
        smNotes: serviceMemberRequests.notes,
        requestStatus: serviceMemberRequests.status,
      })
      .from(isrCases)
      .innerJoin(serviceMemberRequests, eq(isrCases.requestId, serviceMemberRequests.id))
      .orderBy(desc(isrCases.createdAt));

      res.setHeader("X-Data-Notice", "All data is synthetic. No real PII is stored or served.");
      res.json(cases);
    } catch (error: any) {
      console.error("ISR queue error:", error);
      res.status(500).json({ error: "Failed to fetch ISR queue" });
    }
  });

  app.post("/api/isr/action", async (req: any, res: any) => {
    try {
      const { caseId, actionType, rationale: rawRationale, performedBy } = req.body;
      if (!caseId || !actionType || !rawRationale) {
        return res.status(400).json({ error: "caseId, actionType, and rationale are required" });
      }

      const validActions = ["approve", "modify", "escalate", "note"];
      if (!validActions.includes(actionType)) {
        return res.status(400).json({ error: `actionType must be one of: ${validActions.join(", ")}` });
      }

      const rationale = sanitizeInput(String(rawRationale));
      const { isrCases, isrActions, auditLogEntries, serviceMemberRequests } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");

      const [existingCase] = await db.select().from(isrCases).where(eq(isrCases.caseId, caseId));
      if (!existingCase) {
        return res.status(404).json({ error: "Case not found" });
      }

      const [action] = await db.insert(isrActions).values({
        caseId,
        actionType,
        rationale,
        performedBy: performedBy ? sanitizeInput(String(performedBy)) : "ESO Advisor",
      }).returning();

      const statusMap: Record<string, string> = {
        approve: "resolved",
        modify: "in_progress",
        escalate: "escalated",
        note: existingCase.status,
      };
      const newStatus = statusMap[actionType] || existingCase.status;

      await db.update(isrCases).set({
        status: newStatus,
        updatedAt: new Date(),
      }).where(eq(isrCases.caseId, caseId));

      const requestStatusMap: Record<string, string> = {
        approve: "approved",
        modify: "modified",
        escalate: "escalated",
        note: "in_review",
      };
      await db.update(serviceMemberRequests).set({
        status: requestStatusMap[actionType] || "in_review",
      }).where(eq(serviceMemberRequests.id, existingCase.requestId));

      await db.insert(auditLogEntries).values({
        caseId,
        eventType: `advisor_${actionType}`,
        actor: performedBy || "ESO Advisor",
        detail: `Advisor action: ${actionType.toUpperCase()}. Rationale: ${rationale}`,
        payload: JSON.stringify({ actionId: action.id, actionType, rationale }),
      });

      res.json({ action, newStatus, message: `Case ${actionType}d successfully` });
    } catch (error: any) {
      console.error("ISR action error:", error);
      res.status(500).json({ error: "Failed to process action" });
    }
  });

  app.get("/api/audit/:caseId", async (req: any, res: any) => {
    try {
      const { auditLogEntries } = await import("@shared/schema");
      const { eq, asc } = await import("drizzle-orm");

      const entries = await db.select().from(auditLogEntries)
        .where(eq(auditLogEntries.caseId, req.params.caseId))
        .orderBy(asc(auditLogEntries.createdAt));

      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch audit trail" });
    }
  });

  app.post("/api/isr/run-engine", async (req: any, res: any) => {
    try {
      const { caseId } = req.body;
      if (!caseId) return res.status(400).json({ error: "caseId is required" });

      const { isrCases, serviceMemberRequests, auditLogEntries } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");

      const [isrCase] = await db.select().from(isrCases).where(eq(isrCases.caseId, caseId));
      if (!isrCase) return res.status(404).json({ error: "Case not found" });

      const [request] = await db.select().from(serviceMemberRequests).where(eq(serviceMemberRequests.id, isrCase.requestId));
      if (!request) return res.status(404).json({ error: "Request not found" });

      const { generateProfile } = await import("./orchestrator/profiles");
      const { runScenario } = await import("./orchestrator/engine");

      const profile = generateProfile("signal_to_cyber", {
        name: request.name,
        rank: request.rank,
        mos: request.currentMos,
        mosLabel: request.currentMosLabel,
        careerGoal: request.goalDomain,
        goalLabel: request.goalLabel,
        constraints: request.constraints || [],
      });

      const result = await runScenario(profile);

      await db.update(isrCases).set({
        status: "in_progress",
        engineOutput: JSON.stringify(result),
        updatedAt: new Date(),
      }).where(eq(isrCases.caseId, caseId));

      await db.insert(auditLogEntries).values({
        caseId,
        eventType: "engine_analysis",
        actor: "CMGF Rules Engine",
        detail: `Deterministic analysis completed. Feasibility: ${result.visualData.overallFeasibility}. Pathways: ${result.visualData.pathwayCount}. Constraints: ${result.visualData.constraintCount}.`,
        payload: JSON.stringify({ scenarioId: result.scenarioId, feasibility: result.visualData.overallFeasibility }),
      });

      res.json({ result, message: "Engine analysis completed" });
    } catch (error: any) {
      console.error("ISR engine error:", error);
      res.status(500).json({ error: "Failed to run engine analysis" });
    }
  });

  // ── Meridian Industrial Group – Document Intelligence Demo ─────────────────

  function getMeridianSession(req: any): string | null {
    return (req.headers["x-session-id"] as string) || null;
  }

  async function addMeridianAudit(sessionId: string, actor: string, action: string, details: string) {
    await db.insert(meridianAudit).values({ sessionId, actor, action, details });
  }

  // POST /api/meridian/process – run classification on selected document keys
  app.post("/api/meridian/process", async (req, res) => {
    const sessionId = getMeridianSession(req);
    if (!sessionId) return res.status(400).json({ error: "Missing x-session-id" });

    const { documentKeys } = req.body as { documentKeys: string[] };
    if (!Array.isArray(documentKeys) || documentKeys.length === 0) {
      return res.status(400).json({ error: "documentKeys array required" });
    }

    const MERIDIAN_DOCS = getMeridianDocLibrary();

    try {
      const results = [];
      for (const key of documentKeys) {
        const doc = MERIDIAN_DOCS.find((d) => d.key === key);
        if (!doc) continue;

        const existing = await db.select().from(meridianStaging)
          .where(and(eq(meridianStaging.sessionId, sessionId), eq(meridianStaging.documentKey, key)));
        if (existing.length > 0) continue;

        const classification = classifyDocument(doc.fileName);
        const standardName = generateStandardName(classification, doc.fileName);

        const [staged] = await db.insert(meridianStaging).values({
          sessionId,
          documentKey: key,
          originalName: doc.fileName,
          standardName,
          docType: classification.docType,
          subject: classification.subject,
          department: classification.department,
          effectiveDate: classification.effectiveDate || null,
          responsibleParty: classification.responsibleParty,
          confidence: classification.confidence,
          reasoning: classification.reasoning,
          status: "pending",
        }).returning();

        await addMeridianAudit(sessionId, "System", "INGEST", `Document "${doc.fileName}" ingested from library`);
        await addMeridianAudit(sessionId, "AI Engine", "CLASSIFY", `Classified as ${classification.docType} / ${classification.subject} (${Math.round(classification.confidence * 100)}% confidence)`);
        await addMeridianAudit(sessionId, "Rules Engine", "STANDARDIZE", `Proposed name: ${standardName}`);

        results.push(staged);
      }
      res.json({ success: true, processed: results.length, data: results });
    } catch (err: any) {
      console.error("Meridian process error:", err);
      res.status(500).json({ error: "Processing failed" });
    }
  });

  // GET /api/meridian/staging
  app.get("/api/meridian/staging", async (req, res) => {
    const sessionId = getMeridianSession(req);
    if (!sessionId) return res.status(400).json({ error: "Missing x-session-id" });
    const rows = await db.select().from(meridianStaging)
      .where(and(eq(meridianStaging.sessionId, sessionId), eq(meridianStaging.status, "pending")))
      .orderBy(desc(meridianStaging.uploadedAt));
    res.json({ success: true, data: rows });
  });

  // GET /api/meridian/processed-keys – which keys are already in staging for session
  app.get("/api/meridian/processed-keys", async (req, res) => {
    const sessionId = getMeridianSession(req);
    if (!sessionId) return res.status(400).json({ error: "Missing x-session-id" });
    const rows = await db.select({ documentKey: meridianStaging.documentKey }).from(meridianStaging)
      .where(eq(meridianStaging.sessionId, sessionId));
    const repRows = await db.select({ documentKey: meridianRepository.documentKey }).from(meridianRepository)
      .where(eq(meridianRepository.sessionId, sessionId));
    const keys = Array.from(new Set([...rows.map(r => r.documentKey), ...repRows.map(r => r.documentKey)]));
    res.json({ success: true, data: keys });
  });

  // POST /api/meridian/staging/:id/approve
  app.post("/api/meridian/staging/:id/approve", async (req, res) => {
    const sessionId = getMeridianSession(req);
    if (!sessionId) return res.status(400).json({ error: "Missing x-session-id" });
    const id = parseInt(req.params.id);
    const actor = (req.body.actor as string) || "Operations Manager";

    const [doc] = await db.select().from(meridianStaging)
      .where(and(eq(meridianStaging.id, id), eq(meridianStaging.sessionId, sessionId)));
    if (!doc) return res.status(404).json({ error: "Document not found" });

    await db.insert(meridianRepository).values({
      sessionId,
      documentKey: doc.documentKey,
      originalName: doc.originalName,
      standardName: doc.standardName!,
      docType: doc.docType!,
      subject: doc.subject!,
      department: doc.department!,
      effectiveDate: doc.effectiveDate,
      responsibleParty: doc.responsibleParty,
      confidence: doc.confidence,
      approvedBy: actor,
    });

    // Also publish to the shared Meridian KMS portal
    const kmsExisting = await db.select({ id: meridianRepository.id })
      .from(meridianRepository)
      .where(and(eq(meridianRepository.sessionId, "meridian-kms-public"), eq(meridianRepository.documentKey, doc.documentKey)));
    if (kmsExisting.length === 0) {
      await db.insert(meridianRepository).values({
        sessionId: "meridian-kms-public",
        documentKey: doc.documentKey,
        originalName: doc.originalName,
        standardName: doc.standardName!,
        docType: doc.docType!,
        subject: doc.subject!,
        department: doc.department!,
        effectiveDate: doc.effectiveDate,
        responsibleParty: doc.responsibleParty,
        confidence: doc.confidence,
        approvedBy: `${actor} (via Demo Pipeline)`,
      });
    }

    await db.update(meridianStaging).set({ status: "approved", reviewedAt: new Date(), reviewedBy: actor })
      .where(eq(meridianStaging.id, id));

    await addMeridianAudit(sessionId, actor, "APPROVE", `"${doc.originalName}" approved → moved to repository as "${doc.standardName}"`);

    res.json({ success: true });
  });

  // POST /api/meridian/staging/:id/reject
  app.post("/api/meridian/staging/:id/reject", async (req, res) => {
    const sessionId = getMeridianSession(req);
    if (!sessionId) return res.status(400).json({ error: "Missing x-session-id" });
    const id = parseInt(req.params.id);
    const actor = (req.body.actor as string) || "Operations Manager";

    const [doc] = await db.select().from(meridianStaging)
      .where(and(eq(meridianStaging.id, id), eq(meridianStaging.sessionId, sessionId)));
    if (!doc) return res.status(404).json({ error: "Document not found" });

    await db.update(meridianStaging).set({ status: "rejected", reviewedAt: new Date(), reviewedBy: actor })
      .where(eq(meridianStaging.id, id));

    await addMeridianAudit(sessionId, actor, "REJECT", `"${doc.originalName}" rejected — returned to unprocessed pool`);

    res.json({ success: true });
  });

  // PUT /api/meridian/staging/:id/modify
  app.put("/api/meridian/staging/:id/modify", async (req, res) => {
    const sessionId = getMeridianSession(req);
    if (!sessionId) return res.status(400).json({ error: "Missing x-session-id" });
    const id = parseInt(req.params.id);
    const { docType, subject, department, effectiveDate, responsibleParty, actor } = req.body;

    const [doc] = await db.select().from(meridianStaging)
      .where(and(eq(meridianStaging.id, id), eq(meridianStaging.sessionId, sessionId)));
    if (!doc) return res.status(404).json({ error: "Document not found" });

    const updated: Partial<typeof doc> = {};
    if (docType) updated.docType = docType;
    if (subject) updated.subject = subject;
    if (department) updated.department = department;
    if (effectiveDate !== undefined) updated.effectiveDate = effectiveDate;
    if (responsibleParty) updated.responsibleParty = responsibleParty;

    if (Object.keys(updated).length > 0) {
      await db.update(meridianStaging).set(updated).where(eq(meridianStaging.id, id));
      await addMeridianAudit(sessionId, actor || "Analyst", "MODIFY", `"${doc.originalName}" classification modified by human reviewer`);
    }

    const [result] = await db.select().from(meridianStaging).where(eq(meridianStaging.id, id));
    res.json({ success: true, data: result });
  });

  // GET /api/meridian/repository
  app.get("/api/meridian/repository", async (req, res) => {
    const sessionId = getMeridianSession(req);
    if (!sessionId) return res.status(400).json({ error: "Missing x-session-id" });
    const rows = await db.select().from(meridianRepository)
      .where(eq(meridianRepository.sessionId, sessionId))
      .orderBy(desc(meridianRepository.approvedAt));
    res.json({ success: true, data: rows });
  });

  // GET /api/meridian/audit
  app.get("/api/meridian/audit", async (req, res) => {
    const sessionId = getMeridianSession(req);
    if (!sessionId) return res.status(400).json({ error: "Missing x-session-id" });
    const rows = await db.select().from(meridianAudit)
      .where(eq(meridianAudit.sessionId, sessionId))
      .orderBy(desc(meridianAudit.ts))
      .limit(50);
    res.json({ success: true, data: rows });
  });

  // DELETE /api/meridian/reset
  app.delete("/api/meridian/reset", async (req, res) => {
    const sessionId = getMeridianSession(req);
    if (!sessionId) return res.status(400).json({ error: "Missing x-session-id" });
    await db.delete(meridianStaging).where(eq(meridianStaging.sessionId, sessionId));
    await db.delete(meridianRepository).where(eq(meridianRepository.sessionId, sessionId));
    await db.delete(meridianAudit).where(eq(meridianAudit.sessionId, sessionId));
    // Also wipe the shared KMS portal so the next demo starts empty
    await db.delete(meridianRepository).where(eq(meridianRepository.sessionId, "meridian-kms-public"));
    res.json({ success: true, message: "Session and KMS portal reset. Ready for next demo." });
  });

  // DELETE /api/meridian/kms/reset – standalone KMS portal reset (for use from the portal itself)
  app.delete("/api/meridian/kms/reset", async (_req, res) => {
    await db.delete(meridianRepository).where(eq(meridianRepository.sessionId, "meridian-kms-public"));
    res.json({ success: true, message: "KMS portal cleared. Ready for next demo." });
  });

  // POST /api/meridian/upload – ingest an uploaded file through the classification pipeline
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (_req, file, cb) => {
      const allowed = ["text/plain", "application/pdf", "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      cb(null, allowed.includes(file.mimetype) || file.originalname.match(/\.(txt|pdf|docx?)$/i) !== null);
    },
  });

  app.post("/api/meridian/upload", upload.single("file"), async (req, res) => {
    const sessionId = getMeridianSession(req);
    if (!sessionId) return res.status(400).json({ error: "Missing x-session-id" });
    if (!req.file) return res.status(400).json({ error: "No file provided" });

    const fileName = req.file.originalname;
    const isTxt = /\.txt$/i.test(fileName);
    const content = isTxt ? req.file.buffer.toString("utf-8") : undefined;

    const uploadKey = `UPLOAD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    try {
      const classification = classifyDocument(fileName, content);
      const standardName = generateStandardName(classification, fileName);

      const [staged] = await db.insert(meridianStaging).values({
        sessionId,
        documentKey: uploadKey,
        originalName: fileName,
        standardName,
        docType: classification.docType,
        subject: classification.subject,
        department: classification.department,
        effectiveDate: classification.effectiveDate || null,
        responsibleParty: classification.responsibleParty,
        confidence: classification.confidence,
        reasoning: classification.reasoning,
        status: "pending",
      }).returning();

      await addMeridianAudit(sessionId, "Uploader", "INGEST", `Document "${fileName}" uploaded directly by user`);
      await addMeridianAudit(sessionId, "AI Engine", "CLASSIFY",
        `Classified as ${classification.docType} / ${classification.subject} (${Math.round(classification.confidence * 100)}% confidence)${content ? " — content-based" : " — filename-based"}`);
      await addMeridianAudit(sessionId, "Rules Engine", "STANDARDIZE", `Proposed name: ${standardName}`);

      res.json({ success: true, data: staged });
    } catch (err: any) {
      console.error("Meridian upload error:", err);
      res.status(500).json({ error: "Upload processing failed" });
    }
  });

  // GET /api/meridian/kms/financials?type=AR|AP
  app.get("/api/meridian/kms/financials", async (req, res) => {
    const type = req.query.type as string | undefined;
    let query = db.select().from(meridianFinancials).orderBy(desc(meridianFinancials.invoiceDate)) as any;
    if (type === "AR" || type === "AP") {
      query = db.select().from(meridianFinancials).where(eq(meridianFinancials.recordType, type)).orderBy(desc(meridianFinancials.invoiceDate));
    }
    const rows = await query;
    res.json({ success: true, data: rows });
  });

  // GET /api/meridian/kms – shared KMS portal (all approved docs in public session)
  app.get("/api/meridian/kms", async (_req, res) => {
    const rows = await db.select().from(meridianRepository)
      .where(eq(meridianRepository.sessionId, "meridian-kms-public"))
      .orderBy(desc(meridianRepository.approvedAt));
    res.json({ success: true, data: rows });
  });

  // Seed the shared KMS on startup (idempotent)
  async function seedMeridianKMS() {
    const KMS_SESSION = "meridian-kms-public";
    const existing = await db.select({ id: meridianRepository.id })
      .from(meridianRepository)
      .where(eq(meridianRepository.sessionId, KMS_SESSION));
    if (existing.length >= 29) return; // already seeded

    const docs = getMeridianDocLibrary();
    for (const doc of docs) {
      const dup = await db.select({ id: meridianRepository.id })
        .from(meridianRepository)
        .where(and(eq(meridianRepository.sessionId, KMS_SESSION), eq(meridianRepository.documentKey, doc.key)));
      if (dup.length > 0) continue;

      const classification = classifyDocument(doc.fileName);
      const standardName = generateStandardName(classification, doc.fileName);
      await db.insert(meridianRepository).values({
        sessionId: KMS_SESSION,
        documentKey: doc.key,
        originalName: doc.fileName,
        standardName,
        docType: classification.docType,
        subject: classification.subject,
        department: classification.department,
        effectiveDate: classification.effectiveDate || null,
        responsibleParty: classification.responsibleParty,
        confidence: classification.confidence,
        approvedBy: "System (Initial Seed)",
      });
    }
    console.log("[KMS] Meridian KMS seeded with", docs.length, "documents.");
  }
  seedMeridianKMS().catch(console.error);
  seedMeridianFinancials().catch(console.error);

  // ── Insurance Brokerage KMS Routes ─────────────────────────────────────────
  const AdmZip = (await import("adm-zip")).default;
  const zipUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

  function getInsuranceSession(req: any): string | null {
    return (req.headers["x-session-id"] as string) || (req.query.session_id as string) || null;
  }

  // POST /api/insurance/upload-zip – unpack ZIP, run AI classification, stage all docs
  app.post("/api/insurance/upload-zip", zipUpload.single("file"), async (req, res) => {
    const sessionId = getInsuranceSession(req);
    if (!sessionId) return res.status(400).json({ error: "Missing x-session-id header" });
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const fsp = await import("fs/promises");
    const fsMod = await import("fs");
    const pathMod = await import("path");

    // Extract ZIP in memory
    let zip: InstanceType<typeof AdmZip>;
    try {
      zip = new AdmZip(req.file.buffer);
    } catch {
      return res.status(400).json({ error: "Invalid ZIP file" });
    }

    const entries = zip.getEntries().filter(e =>
      !e.isDirectory &&
      e.entryName.toLowerCase().endsWith(".pdf") &&
      !e.entryName.startsWith("__MACOSX")
    );

    if (entries.length === 0) {
      return res.status(400).json({ error: "No PDF files found in ZIP" });
    }

    // Save PDFs to public directory so browser can view them
    const sessionDir = pathMod.join(process.cwd(), "public", "insurance-sessions", sessionId);
    await fsp.mkdir(sessionDir, { recursive: true });

    // Clear previous staging for this session
    await db.delete(insuranceStaging).where(eq(insuranceStaging.sessionId, sessionId));
    await db.delete(insuranceAudit).where(eq(insuranceAudit.sessionId, sessionId));

    // Insert all docs immediately with pending status (fast response)
    const stagedIds: { id: number; filename: string; filePath: string }[] = [];
    for (const entry of entries) {
      const filename = pathMod.basename(entry.entryName);
      const destPath = pathMod.join(sessionDir, filename);
      zip.extractEntryTo(entry, sessionDir, false, true);

      const fallback = fallbackClassify(filename);
      const filePath = `/insurance-sessions/${sessionId}/${filename}`;

      const [row] = await db.insert(insuranceStaging).values({
        sessionId,
        filename,
        filePath,
        docType: fallback.docType,
        docTypeLabel: fallback.docTypeLabel,
        lifecyclePhase: fallback.lifecyclePhase,
        policyLine: fallback.policyLine,
        policyPeriod: fallback.policyPeriod,
        namedInsured: fallback.namedInsured,
        policyNumber: fallback.policyNumber,
        carrierName: fallback.carrierName,
        premium: fallback.premium,
        claimNumber: fallback.claimNumber,
        effectiveDate: fallback.effectiveDate,
        expirationDate: fallback.expirationDate,
        confidence: fallback.confidence,
        reasoning: fallback.reasoning,
        aiStatus: "pending",
      }).returning();

      stagedIds.push({ id: row.id, filename, filePath: pathMod.join(sessionDir, filename) });
    }

    await db.insert(insuranceAudit).values({
      sessionId,
      actor: "System",
      action: "INGEST",
      details: `ZIP uploaded: ${entries.length} PDFs extracted and staged for AI classification.`,
    });

    // Respond immediately — AI classification runs in background
    res.json({ success: true, count: stagedIds.length, sessionId });

    // Background: classify each doc with real AI
    (async () => {
      let processed = 0;
      for (const { id, filename, filePath } of stagedIds) {
        try {
          const result = await classifyInsuranceDocument(filePath, filename);
          await db.update(insuranceStaging)
            .set({
              docType: result.docType,
              docTypeLabel: result.docTypeLabel,
              lifecyclePhase: result.lifecyclePhase,
              policyLine: result.policyLine,
              policyPeriod: result.policyPeriod,
              namedInsured: result.namedInsured,
              policyNumber: result.policyNumber,
              carrierName: result.carrierName,
              premium: result.premium,
              claimNumber: result.claimNumber,
              effectiveDate: result.effectiveDate,
              expirationDate: result.expirationDate,
              confidence: result.confidence,
              reasoning: result.reasoning,
              aiStatus: "classified",
            })
            .where(eq(insuranceStaging.id, id));
          processed++;
        } catch (err) {
          console.error(`[insurance] Classification failed for ${filename}:`, err);
          await db.update(insuranceStaging)
            .set({ aiStatus: "failed" })
            .where(eq(insuranceStaging.id, id));
        }
      }
      console.log(`[insurance] AI classification complete: ${processed}/${stagedIds.length} docs classified.`);
    })().catch(console.error);
  });

  // GET /api/insurance/staging
  app.get("/api/insurance/staging", async (req, res) => {
    const sessionId = getInsuranceSession(req);
    if (!sessionId) return res.status(400).json({ error: "Missing x-session-id" });
    const rows = await db.select().from(insuranceStaging)
      .where(eq(insuranceStaging.sessionId, sessionId))
      .orderBy(insuranceStaging.stagedAt);
    res.json({ success: true, data: rows });
  });

  // GET /api/insurance/batch/status – progress of AI classification
  app.get("/api/insurance/batch/status", async (req, res) => {
    const sessionId = getInsuranceSession(req);
    if (!sessionId) return res.status(400).json({ error: "Missing x-session-id" });
    const rows = await db.select({ aiStatus: insuranceStaging.aiStatus }).from(insuranceStaging)
      .where(eq(insuranceStaging.sessionId, sessionId));
    const total = rows.length;
    const classified = rows.filter(r => r.aiStatus === "classified").length;
    const failed = rows.filter(r => r.aiStatus === "failed").length;
    const pending = rows.filter(r => r.aiStatus === "pending").length;
    res.json({ success: true, total, classified, failed, pending, done: pending === 0 && total > 0 });
  });

  // PATCH /api/insurance/staging/:id – modify fields
  app.patch("/api/insurance/staging/:id", async (req, res) => {
    const sessionId = getInsuranceSession(req);
    if (!sessionId) return res.status(400).json({ error: "Missing x-session-id" });
    const id = parseInt(req.params.id);
    const allowed = ["docType", "docTypeLabel", "lifecyclePhase", "policyLine", "policyPeriod",
      "namedInsured", "policyNumber", "carrierName", "premium", "claimNumber",
      "effectiveDate", "expirationDate"];
    const updates: Record<string, string> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = sanitizeInput(String(req.body[key]));
    }
    if (Object.keys(updates).length === 0) return res.status(400).json({ error: "No valid fields" });
    await db.update(insuranceStaging).set(updates).where(eq(insuranceStaging.id, id));
    await db.insert(insuranceAudit).values({
      sessionId,
      actor: "Sr. Account Manager",
      action: "MODIFY",
      details: `Modified staging record #${id}: ${Object.keys(updates).join(", ")} updated.`,
    });
    const [updated] = await db.select().from(insuranceStaging).where(eq(insuranceStaging.id, id));
    res.json({ success: true, data: updated });
  });

  // POST /api/insurance/approve/:id
  app.post("/api/insurance/approve/:id", async (req, res) => {
    const sessionId = getInsuranceSession(req);
    if (!sessionId) return res.status(400).json({ error: "Missing x-session-id" });
    const id = parseInt(req.params.id);
    const [doc] = await db.select().from(insuranceStaging)
      .where(and(eq(insuranceStaging.id, id), eq(insuranceStaging.sessionId, sessionId)));
    if (!doc) return res.status(404).json({ error: "Not found" });

    // Count existing for this session to generate seq
    const existing = await db.select({ id: insuranceRepository.id }).from(insuranceRepository)
      .where(eq(insuranceRepository.sessionId, sessionId));
    const seq = existing.length + 1;
    const standardName = generateStandardInsuranceName({
      docType: doc.docType || "COR",
      docTypeLabel: doc.docTypeLabel || "Correspondence",
      lifecyclePhase: doc.lifecyclePhase || "",
      policyLine: doc.policyLine || "",
      policyPeriod: doc.policyPeriod || "2025-2026",
      namedInsured: doc.namedInsured || "",
      policyNumber: doc.policyNumber || "",
      carrierName: doc.carrierName || "",
      premium: doc.premium || "",
      claimNumber: doc.claimNumber || "",
      effectiveDate: doc.effectiveDate || "",
      expirationDate: doc.expirationDate || "",
      confidence: doc.confidence || 0.85,
      reasoning: doc.reasoning || "",
    }, seq);

    const [repoDoc] = await db.insert(insuranceRepository).values({
      sessionId,
      filename: doc.filename,
      filePath: doc.filePath,
      standardName,
      docType: doc.docType || "COR",
      docTypeLabel: doc.docTypeLabel || "Correspondence",
      lifecyclePhase: doc.lifecyclePhase,
      policyLine: doc.policyLine,
      policyPeriod: doc.policyPeriod,
      namedInsured: doc.namedInsured,
      policyNumber: doc.policyNumber,
      carrierName: doc.carrierName,
      premium: doc.premium,
      claimNumber: doc.claimNumber,
      effectiveDate: doc.effectiveDate,
      expirationDate: doc.expirationDate,
      confidence: doc.confidence,
      approvedBy: "Sr. Account Manager",
    }).returning();

    await db.delete(insuranceStaging).where(eq(insuranceStaging.id, id));
    await db.insert(insuranceAudit).values({
      sessionId,
      actor: "Sr. Account Manager",
      action: "APPROVE",
      details: `Approved "${doc.filename}" → filed as ${standardName} (${doc.docTypeLabel}, ${doc.policyLine || "N/A"}, ${doc.namedInsured || "Unknown"}).`,
    });

    res.json({ success: true, data: repoDoc });
  });

  // POST /api/insurance/reject/:id
  app.post("/api/insurance/reject/:id", async (req, res) => {
    const sessionId = getInsuranceSession(req);
    if (!sessionId) return res.status(400).json({ error: "Missing x-session-id" });
    const id = parseInt(req.params.id);
    const [doc] = await db.select({ filename: insuranceStaging.filename })
      .from(insuranceStaging)
      .where(and(eq(insuranceStaging.id, id), eq(insuranceStaging.sessionId, sessionId)));
    if (!doc) return res.status(404).json({ error: "Not found" });
    await db.delete(insuranceStaging).where(eq(insuranceStaging.id, id));
    await db.insert(insuranceAudit).values({
      sessionId,
      actor: "Sr. Account Manager",
      action: "REJECT",
      details: `Rejected "${doc.filename}" — returned to sender / discarded.`,
    });
    res.json({ success: true });
  });

  // GET /api/insurance/repository
  app.get("/api/insurance/repository", async (req, res) => {
    const sessionId = getInsuranceSession(req);
    if (!sessionId) return res.status(400).json({ error: "Missing x-session-id" });
    const rows = await db.select().from(insuranceRepository)
      .where(eq(insuranceRepository.sessionId, sessionId))
      .orderBy(desc(insuranceRepository.approvedAt));
    res.json({ success: true, data: rows });
  });

  // GET /api/insurance/repository/facets — distinct filter values across the whole repository
  app.get("/api/insurance/repository/facets", async (req, res) => {
    const sessionId = getInsuranceSession(req);
    if (!sessionId) return res.status(400).json({ error: "Missing x-session-id" });
    const rows = await db
      .select({
        namedInsured: insuranceRepository.namedInsured,
        policyLine: insuranceRepository.policyLine,
        lifecyclePhase: insuranceRepository.lifecyclePhase,
        policyPeriod: insuranceRepository.policyPeriod,
        docType: insuranceRepository.docType,
        docTypeLabel: insuranceRepository.docTypeLabel,
      })
      .from(insuranceRepository)
      .where(eq(insuranceRepository.sessionId, sessionId));

    const unique = <T,>(arr: (T | null)[]): T[] =>
      [...new Set(arr.filter((v): v is T => v != null))].sort() as T[];

    res.json({
      success: true,
      clients: unique(rows.map(r => r.namedInsured)),
      policyLines: unique(rows.map(r => r.policyLine)),
      lifecyclePhases: unique(rows.map(r => r.lifecyclePhase)),
      policyPeriods: unique(rows.map(r => r.policyPeriod)),
      docTypes: unique(rows.map(r => r.docType)).map(code => ({
        code,
        label: rows.find(r => r.docType === code)?.docTypeLabel || code,
      })),
    });
  });

  // GET /api/insurance/audit
  app.get("/api/insurance/audit", async (req, res) => {
    const sessionId = getInsuranceSession(req);
    if (!sessionId) return res.status(400).json({ error: "Missing x-session-id" });
    const rows = await db.select().from(insuranceAudit)
      .where(eq(insuranceAudit.sessionId, sessionId))
      .orderBy(desc(insuranceAudit.ts))
      .limit(100);
    res.json({ success: true, data: rows });
  });

  // DELETE /api/insurance/reset
  app.delete("/api/insurance/reset", async (req, res) => {
    const sessionId = getInsuranceSession(req);
    if (!sessionId) return res.status(400).json({ error: "Missing x-session-id" });
    await db.delete(insuranceStaging).where(eq(insuranceStaging.sessionId, sessionId));
    await db.delete(insuranceRepository).where(eq(insuranceRepository.sessionId, sessionId));
    await db.delete(insuranceAudit).where(eq(insuranceAudit.sessionId, sessionId));

    // Remove session PDF files
    try {
      const fsp = await import("fs/promises");
      const pathMod = await import("path");
      const sessionDir = pathMod.join(process.cwd(), "public", "insurance-sessions", sessionId);
      await fsp.rm(sessionDir, { recursive: true, force: true });
    } catch {}

    res.json({ success: true, message: "Session reset. Ready for next demo." });
  });

  return app;
}

// ── Meridian Financial Records Seeder ────────────────────────────────────────
async function seedMeridianFinancials() {
  const existing = await db.select({ id: meridianFinancials.id }).from(meridianFinancials).limit(1);
  if (existing.length > 0) return; // already seeded

  const AR_CLIENTS = [
    "Northgate Defense Systems LLC", "Caledonian Heavy Industries Corp.", "Riverside Municipal Water Authority",
    "Paramount Aerospace Solutions", "Clearwater Infrastructure Group", "Titan Energy Holdings Inc.",
    "Archway Federal Contractors LLC", "Bridgemont Industrial Partners", "Cascadia Manufacturing Inc.",
    "Capitol Systems Integration", "Lakeshore Engineering Works", "Pinnacle Construction Group",
    "Ridgeline Operations LLC", "Solaris Power Corporation", "Harborview Industrial Services",
  ];
  const AP_VENDORS = [
    "Apex Industrial Supply Co.", "Cornerstone Fabrication Ltd.", "TechVault Systems Inc.",
    "CrossPoint Transportation Inc.", "Pacific Rim Manufacturing", "Atlas Crane & Rigging Services",
    "Consolidated Safety Equipment Co.", "Premier Office Solutions Inc.", "Elevate Engineering Consultants LLC",
    "Benchmark Calibration Services", "Zenith Power & Utilities", "Onyx Material Handling Systems",
    "Summit Environmental Services", "Vector Network Solutions", "Continental Machine Parts LLC",
  ];
  const AR_DESC = [
    "Engineering Consulting — Phase I", "Industrial HVAC Integration Services", "Equipment Commissioning",
    "Safety System Certification", "Preventive Maintenance Contract", "Custom Equipment Fabrication",
    "Technical Documentation Services", "Environmental Compliance Assessment", "Process Optimization Study",
    "Facility Assessment & Planning", "Training Program Delivery", "Operations Support Services",
    "Project Management — Capital Works", "System Integration Services", "Annual Maintenance Retainer",
  ];
  const AP_DESC = [
    "Steel & Alloy Components — Production Run", "Precision Machined Parts Order", "IT Infrastructure Maintenance",
    "Freight & Logistics Services", "Calibration Equipment Rental", "Crane & Heavy Lift Services",
    "Quarterly Safety Supplies", "Office & Administrative Supplies", "Engineering Review Services",
    "Utility Services — Main Facility", "Environmental Waste Disposal", "Facility Maintenance Contract",
    "Raw Materials — Production Run", "Network Security Services", "Subcontractor Labor — Fabrication",
  ];
  const AMOUNTS = [2800, 5500, 8200, 14000, 22500, 38000, 57500, 84000, 112000, 168000, 42000, 31500, 18500, 9800, 76000, 6200, 147000, 225000, 315000, 3500];
  const PAY_METHODS: ("ACH"|"Check"|"Wire")[] = ["ACH", "Check", "Wire"];

  function isoDate(year: number, month: number, day: number): string {
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }
  function addDays(iso: string, days: number): string {
    const d = new Date(iso); d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  }
  function amt(i: number, bias: number) { return AMOUNTS[(i * 7 + bias) % AMOUNTS.length]; }

  const records: (typeof meridianFinancials.$inferInsert)[] = [];

  // ── 125 PAID AR records (2022–2025) ──────────────────────────────────────
  for (let i = 0; i < 125; i++) {
    const year = 2022 + Math.floor(i / 32);
    const month = (i * 3 % 12) + 1;
    const day = (i * 5 % 27) + 1;
    const invDate = isoDate(year, month, day);
    const dueDate = addDays(invDate, 30);
    const paidDate = addDays(dueDate, (i % 7) - 3); // paid 3 days early to 3 days late
    const method = PAY_METHODS[i % 3];
    const seq = String(i + 100).padStart(6, "0");
    records.push({
      invoiceNumber: `MIG-INV-${year}-${String(i + 1).padStart(4, "0")}`,
      recordType: "AR",
      counterparty: AR_CLIENTS[i % AR_CLIENTS.length],
      description: AR_DESC[i % AR_DESC.length],
      amount: amt(i, 0),
      invoiceDate: invDate,
      dueDate,
      status: "paid",
      paidDate,
      paymentReference: `DEP-${year}-${seq}`,
      paymentMethod: method,
    });
  }

  // ── 75 OPEN AR records (2025–2026) ───────────────────────────────────────
  for (let i = 0; i < 75; i++) {
    const year = i < 40 ? 2025 : 2026;
    const month = (i * 4 % 12) + 1;
    const day = (i * 3 % 27) + 1;
    const invDate = isoDate(year, month, day);
    records.push({
      invoiceNumber: `MIG-INV-${year}-${String(i + 201).padStart(4, "0")}`,
      recordType: "AR",
      counterparty: AR_CLIENTS[i % AR_CLIENTS.length],
      description: AR_DESC[(i + 5) % AR_DESC.length],
      amount: amt(i, 5),
      invoiceDate: invDate,
      dueDate: addDays(invDate, 30),
      status: "open",
    });
  }

  // ── 125 PAID AP records (2022–2025) ──────────────────────────────────────
  for (let i = 0; i < 125; i++) {
    const year = 2022 + Math.floor(i / 32);
    const month = (i * 5 % 12) + 1;
    const day = (i * 7 % 27) + 1;
    const invDate = isoDate(year, month, day);
    const dueDate = addDays(invDate, 45);
    const paidDate = addDays(dueDate, (i % 5) - 2);
    const method = PAY_METHODS[i % 3];
    const ref = method === "Check"
      ? `CHK-${year}-${String(i + 500).padStart(4, "0")}`
      : method === "Wire"
        ? `WIR-${year}-${String((i + 1) * 13).padStart(6, "0")}`
        : `ACH-${year}-${String((i + 1) * 17).padStart(6, "0")}`;
    records.push({
      invoiceNumber: `MIG-APV-${year}-${String(i + 1).padStart(4, "0")}`,
      recordType: "AP",
      counterparty: AP_VENDORS[i % AP_VENDORS.length],
      description: AP_DESC[i % AP_DESC.length],
      amount: amt(i, 3),
      invoiceDate: invDate,
      dueDate,
      status: "paid",
      paidDate,
      paymentReference: ref,
      paymentMethod: method,
    });
  }

  // ── 75 PENDING AP records (2025–2026) ────────────────────────────────────
  for (let i = 0; i < 75; i++) {
    const year = i < 40 ? 2025 : 2026;
    const month = (i * 6 % 12) + 1;
    const day = (i * 9 % 27) + 1;
    const invDate = isoDate(year, month, day);
    records.push({
      invoiceNumber: `MIG-APV-${year}-${String(i + 201).padStart(4, "0")}`,
      recordType: "AP",
      counterparty: AP_VENDORS[(i + 3) % AP_VENDORS.length],
      description: AP_DESC[(i + 8) % AP_DESC.length],
      amount: amt(i, 8),
      invoiceDate: invDate,
      dueDate: addDays(invDate, 45),
      status: "pending",
    });
  }

  // Batch insert in chunks of 50
  for (let i = 0; i < records.length; i += 50) {
    await db.insert(meridianFinancials).values(records.slice(i, i + 50));
  }
  console.log(`[KMS] Meridian financials seeded: ${records.length} records (200 AR + 200 AP).`);
}

// ── Meridian Document Library (29 canonical documents — latest version of each) ──
export function getMeridianDocLibrary() {
  return [
    { key: "MIG-001", fileName: "Meridian_Document_Management_System_Specification_1773678052357.txt", category: "Knowledge Management" },
    { key: "MIG-002", fileName: "Meridian_Acceptable_Use_Policy_1773678052358.pdf",                    category: "IT" },
    { key: "MIG-003", fileName: "Meridian_Acronym_Glossary_Reference_1773678052358.txt",               category: "Knowledge Management" },
    { key: "MIG-004", fileName: "Meridian_API_Integration_Specification_1773678052358.txt",            category: "IT" },
    { key: "MIG-005", fileName: "Meridian_Approved_Vendor_List_1773678052358.txt",                     category: "Procurement" },
    { key: "MIG-006", fileName: "Meridian_Budget_Exception_Request_Form_1773678052359.txt",            category: "Finance" },
    { key: "MIG-007", fileName: "Meridian_Cybersecurity_Awareness_Training_1773678052359.pdf",         category: "IT" },
    { key: "MIG-008", fileName: "Meridian_Data_Governance_Policy_v2.1_1773678303431.pdf",              category: "Knowledge Management" },
    { key: "MIG-009", fileName: "Meridian_Department_Directory_1773678052359.txt",                     category: "HR" },
    { key: "MIG-010", fileName: "Meridian_Document_Classification_Taxonomy_Reference_1773678052357.txt", category: "Knowledge Management" },
    { key: "MIG-011", fileName: "Meridian_Memo_AI_Document_Intelligence_Pilot_1773678303431.txt",      category: "Knowledge Management" },
    { key: "MIG-012", fileName: "Meridian_Memo_Annual_Training_Compliance_1773678092073.txt",          category: "HR" },
    { key: "MIG-013", fileName: "Meridian_Document_Submission_Request_Form_1773678092073.txt",         category: "Knowledge Management" },
    { key: "MIG-014", fileName: "Meridian_Equipment_Calibration_SOP_1773678092073.txt",                category: "Quality" },
    { key: "MIG-015", fileName: "Meridian_Incident_Response_SOP_1773678092073.pdf",                    category: "IT" },
    { key: "MIG-016", fileName: "Meridian_IT_Systems_Uptime_Report_Q4_1773678092074.txt",              category: "IT" },
    { key: "MIG-017", fileName: "Meridian_Knowledge_Repository_Utilization_Report_1773678092074.txt",  category: "Knowledge Management" },
    { key: "MIG-018", fileName: "Meridian_Knowledge_Taxonomy_SOP_1773678303430.pdf",                   category: "Knowledge Management" },
    { key: "MIG-019", fileName: "Meridian_Manager_Leadership_Development_1773678092072.pdf",           category: "HR" },
    { key: "MIG-020", fileName: "Meridian_Manufacturing_Quality_Specification_1773678092073.txt",      category: "Quality" },
    { key: "MIG-021", fileName: "Meridian_Network_Infrastructure_Specification_1773678256671.txt",     category: "IT" },
    { key: "MIG-022", fileName: "Meridian_New_Employee_KMS_Training_Guide_1773678303431.txt",          category: "Knowledge Management" },
    { key: "MIG-023", fileName: "Meridian_New_Hire_Onboarding_Form_1773678256669.txt",                 category: "HR" },
    { key: "MIG-024", fileName: "Meridian_Q4_Safety_Audit_Report_1773678256669.txt",                   category: "Safety" },
    { key: "MIG-025", fileName: "Meridian_Records_Retention_Policy_1773678256670.txt",                 category: "Legal" },
    { key: "MIG-026", fileName: "Meridian_Safety_Incident_Report_Form_1773678256670.txt",              category: "Safety" },
    { key: "MIG-027", fileName: "Meridian_Safety_Orientation_Training_1773678256670.txt",              category: "Safety" },
    { key: "MIG-028", fileName: "Meridian_Memo_Facility_Relocation_1773678256670.txt",                 category: "Operations" },
    { key: "MIG-029", fileName: "Meridian_Memo_Q1_Budget_Realignment_1773678256670.txt",               category: "Finance" },
    // ── Legal ─────────────────────────────────────────────────────────────────
    { key: "MIG-030", fileName: "Meridian_NDA_Mutual_Confidentiality_Agreement_1773801000001.pdf",     category: "Legal" },
    { key: "MIG-031", fileName: "Meridian_Contractor_Services_Agreement_Template_1773801000002.pdf",   category: "Legal" },
    { key: "MIG-032", fileName: "Meridian_Intellectual_Property_Assignment_Policy_1773801000003.txt",  category: "Legal" },
    { key: "MIG-033", fileName: "Meridian_Liability_Waiver_Form_1773801000004.txt",                    category: "Legal" },
    // ── Operations ────────────────────────────────────────────────────────────
    { key: "MIG-034", fileName: "Meridian_Facility_Maintenance_Schedule_SOP_1773801000005.txt",        category: "Operations" },
    { key: "MIG-035", fileName: "Meridian_Production_Floor_Startup_Procedure_1773801000006.txt",       category: "Operations" },
    { key: "MIG-036", fileName: "Meridian_Shift_Handover_Procedure_SOP_1773801000007.txt",             category: "Operations" },
    { key: "MIG-037", fileName: "Meridian_Inventory_Control_SOP_1773801000008.pdf",                    category: "Operations" },
    // ── Procurement ───────────────────────────────────────────────────────────
    { key: "MIG-038", fileName: "Meridian_Purchase_Order_Policy_1773801000009.txt",                    category: "Procurement" },
    { key: "MIG-039", fileName: "Meridian_Vendor_Evaluation_Criteria_Form_1773801000010.txt",          category: "Procurement" },
    { key: "MIG-040", fileName: "Meridian_RFQ_Standard_Template_Reference_1773801000011.pdf",          category: "Procurement" },
    { key: "MIG-041", fileName: "Meridian_Sole_Source_Justification_Form_1773801000012.txt",           category: "Procurement" },
    // ── Accounts Receivable ───────────────────────────────────────────────────
    { key: "MIG-042", fileName: "Meridian_Invoice_Processing_Policy_1773801000013.txt",                category: "Accounts Receivable" },
    { key: "MIG-043", fileName: "Meridian_Customer_Credit_Application_Form_1773801000014.pdf",         category: "Accounts Receivable" },
    { key: "MIG-044", fileName: "Meridian_AR_Aging_Report_Q4_2025_1773801000015.txt",                  category: "Accounts Receivable" },
    { key: "MIG-045", fileName: "Meridian_Collections_Procedure_SOP_1773801000016.txt",                category: "Accounts Receivable" },
    { key: "MIG-046", fileName: "Meridian_Revenue_Recognition_Policy_1773801000017.txt",               category: "Accounts Receivable" },
    // ── Accounts Payable ─────────────────────────────────────────────────────
    { key: "MIG-047", fileName: "Meridian_Accounts_Payable_Processing_SOP_1773801000018.txt",          category: "Accounts Payable" },
    { key: "MIG-048", fileName: "Meridian_Vendor_Payment_Terms_Policy_1773801000019.txt",              category: "Accounts Payable" },
    { key: "MIG-049", fileName: "Meridian_Three_Way_Match_Procedure_1773801000020.txt",                category: "Accounts Payable" },
    { key: "MIG-050", fileName: "Meridian_AP_Aging_Report_Q4_2025_1773801000021.txt",                  category: "Accounts Payable" },
    { key: "MIG-051", fileName: "Meridian_Expense_Reimbursement_Policy_1773801000022.txt",             category: "Accounts Payable" },
  ];
}
