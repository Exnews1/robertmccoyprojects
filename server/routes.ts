import { Express } from "express";
import { Server } from "http";
import { storage } from "./storage";
import { insertPublicationSchema, insertExpertCommentarySchema, insertInquirySchema } from "@shared/schema";
import { ZodError } from "zod";
import { seedDatabase } from "./seed";
import { generateEmbedding, cosineSimilarity, getRelevanceLabel } from "./openai";
import { sendInquiryNotification } from "./gmail";
import OpenAI from "openai";

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
    try {
      const { query } = req.body;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "Query is required" });
      }

      const entries = await storage.getLibraryEntries();
      
      if (entries.length === 0) {
        return res.json({ results: [] });
      }

      let queryEmbedding: number[];
      try {
        queryEmbedding = await generateEmbedding(query);
      } catch (error) {
        console.error("Embedding generation failed:", error);
        return res.status(500).json({ message: "Search temporarily unavailable" });
      }

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
    }
  });

  app.get("/api/library", async (_req: any, res: any) => {
    const entries = await storage.getLibraryEntries();
    res.json(entries);
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

      let queryEmbedding: number[];
      try {
        queryEmbedding = await generateEmbedding(query);
      } catch (error) {
        console.error("Embedding generation failed:", error);
        return res.status(500).json({ message: "Search temporarily unavailable" });
      }

      // Score all entries with hybrid approach (semantic + keyword/topic matching)
      const queryLower = query.toLowerCase();
      const scoredEntries = entries
        .filter(entry => entry.embedding)
        .map(entry => {
          const entryEmbedding = JSON.parse(entry.embedding!) as number[];
          let score = cosineSimilarity(queryEmbedding, entryEmbedding);
          
          // Boost score for keyword matches in title or summary (not topics/pillar names)
          const titleLower = (entry.title || "").toLowerCase();
          const summaryLower = (entry.summary || "").toLowerCase();
          
          if (titleLower.includes(queryLower)) score += 0.15;
          if (summaryLower.includes(queryLower)) score += 0.10;
          
          return { entry, score };
        })
        .sort((a, b) => b.score - a.score);

      // Get top relevant sources (score >= 0.35)
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

      // Build context from relevant sources for LLM
      const sourceContext = relevantSources.map(({ entry }, idx) => 
        `[Source ${idx + 1}: "${entry.title}"]\n${entry.summary}`
      ).join("\n\n");

      const sourceList = relevantSources.map(({ entry }) => ({
        id: entry.entryId,
        title: entry.title
      }));

      // Use OpenAI to generate a grounded answer
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
    }
  });

  app.post("/api/generate-pathway", async (req: any, res: any) => {
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

      let queryEmbedding: number[];
      try {
        queryEmbedding = await generateEmbedding(searchQuery);
      } catch (error) {
        console.error("Embedding generation failed:", error);
        return res.status(500).json({ message: "AI service temporarily unavailable" });
      }

      const scoredEntries = entries
        .filter(entry => entry.embedding)
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
    }
  });

  app.post("/api/inquiries", async (req: any, res: any) => {
    try {
      const inquiry = insertInquirySchema.parse(req.body);
      const newInquiry = await storage.createInquiry(inquiry);
      
      sendInquiryNotification({
        name: inquiry.name,
        email: inquiry.email,
        organization: inquiry.organization,
        inquiryType: inquiry.inquiryType,
        message: inquiry.message
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

  const advisorOpenai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });

  app.post("/api/advisor-chat", async (req: any, res: any) => {
    try {
      const { message, engineOutput, chatHistory } = req.body;

      if (!message || !engineOutput) {
        return res.status(400).json({ error: "Message and engineOutput are required" });
      }

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
        max_completion_tokens: 8192,
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
    }
  });

  return app;
}
