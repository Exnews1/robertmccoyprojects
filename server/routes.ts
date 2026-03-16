import { Express } from "express";
import { Server } from "http";
import { storage } from "./storage";
import { insertPublicationSchema, insertExpertCommentarySchema, insertInquirySchema } from "@shared/schema";
import { ZodError } from "zod";
import { seedDatabase } from "./seed";
import { generateEmbedding, cosineSimilarity, getRelevanceLabel } from "./openai";
import { sendInquiryNotification } from "./gmail";
import OpenAI from "openai";
import { db } from "./db";
import { meridianStaging, meridianRepository, meridianAudit } from "@shared/schema";
import { classifyDocument, generateStandardName } from "./meridianClassification";
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
    res.json({ success: true, message: "Session reset. All 32 documents returned to library." });
  });

  return app;
}

// ── Meridian Document Library (32 industrial documents) ─────────────────────
export function getMeridianDocLibrary() {
  return [
    { key: "MIG-001", fileName: "Employee_Handbook_2024.pdf", category: "HR" },
    { key: "MIG-002", fileName: "Safety_Policy_Lockout_Tagout_LOTO.pdf", category: "Safety" },
    { key: "MIG-003", fileName: "SOP_Forklift_Operation_Certification.pdf", category: "Operations" },
    { key: "MIG-004", fileName: "SOP_Chemical_Handling_Storage.pdf", category: "Safety" },
    { key: "MIG-005", fileName: "Emergency_Response_Procedure_ERP.pdf", category: "Safety" },
    { key: "MIG-006", fileName: "HR_Onboarding_Checklist_New_Employee.pdf", category: "HR" },
    { key: "MIG-007", fileName: "IT_Password_Security_Policy.pdf", category: "IT" },
    { key: "MIG-008", fileName: "Quality_Inspection_Form_Weld_Visual.pdf", category: "Quality" },
    { key: "MIG-009", fileName: "Maintenance_Schedule_Air_Compressor_Annual.pdf", category: "Operations" },
    { key: "MIG-010", fileName: "OSHA_Incident_Report_Form.pdf", category: "Safety" },
    { key: "MIG-011", fileName: "Finance_Expense_Reimbursement_Policy.pdf", category: "Finance" },
    { key: "MIG-012", fileName: "Legal_NDA_Contractor_Template.pdf", category: "Legal" },
    { key: "MIG-013", fileName: "Operations_Shift_Handover_SOP.pdf", category: "Operations" },
    { key: "MIG-014", fileName: "Safety_JSA_Grinding_Operations.pdf", category: "Safety" },
    { key: "MIG-015", fileName: "HR_Performance_Review_Form_2024.pdf", category: "HR" },
    { key: "MIG-016", fileName: "IT_Remote_Access_VPN_Policy.pdf", category: "IT" },
    { key: "MIG-017", fileName: "Quality_SOP_Dimensional_Inspection.pdf", category: "Quality" },
    { key: "MIG-018", fileName: "Maintenance_SOP_Hydraulic_System_Repair.pdf", category: "Operations" },
    { key: "MIG-019", fileName: "Operations_Inventory_Management_Procedure.pdf", category: "Operations" },
    { key: "MIG-020", fileName: "Safety_PPE_Requirements_Policy.pdf", category: "Safety" },
    { key: "MIG-021", fileName: "HR_Travel_Expense_Policy.pdf", category: "HR" },
    { key: "MIG-022", fileName: "Finance_Capital_Expenditure_Approval_Procedure.pdf", category: "Finance" },
    { key: "MIG-023", fileName: "Legal_Contractor_Services_Agreement.pdf", category: "Legal" },
    { key: "MIG-024", fileName: "Safety_Confined_Space_Entry_Procedure.pdf", category: "Safety" },
    { key: "MIG-025", fileName: "Operations_Production_Scheduling_SOP.pdf", category: "Operations" },
    { key: "MIG-026", fileName: "Quality_Nonconformance_Report_NCR_Form.pdf", category: "Quality" },
    { key: "MIG-027", fileName: "IT_Data_Backup_Recovery_Procedure.pdf", category: "IT" },
    { key: "MIG-028", fileName: "HR_Disciplinary_Action_Policy.pdf", category: "HR" },
    { key: "MIG-029", fileName: "Operations_Equipment_Daily_Startup_Checklist.pdf", category: "Operations" },
    { key: "MIG-030", fileName: "Finance_Budget_Approval_Procedure.pdf", category: "Finance" },
    { key: "MIG-031", fileName: "Safety_Fire_Prevention_Emergency_Plan.pdf", category: "Safety" },
    { key: "MIG-032", fileName: "Quality_Customer_Complaint_Resolution_Procedure.pdf", category: "Quality" },
  ];
}
