import { Express } from "express";
import { Server } from "http";
import { storage } from "./storage";
import { insertPublicationSchema, insertExpertCommentarySchema, insertInquirySchema } from "@shared/schema";
import { ZodError } from "zod";
import { seedDatabase } from "./seed";
import { generateEmbedding, cosineSimilarity, getRelevanceLabel } from "./openai";
import { sendInquiryNotification } from "./gmail";

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

      // Score all entries
      const scoredEntries = entries
        .filter(entry => entry.embedding)
        .map(entry => {
          const entryEmbedding = JSON.parse(entry.embedding!) as number[];
          const score = cosineSimilarity(queryEmbedding, entryEmbedding);
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
            content: `You are a research assistant for the Career Mobility Governance Framework (CMGF) project. Your task is to answer questions using ONLY the provided source documents. 

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
          relevance: getRelevanceLabel(score)
        }))
      });
    } catch (error) {
      console.error("Answer generation error:", error);
      res.status(500).json({ message: "Failed to generate answer" });
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

  return app;
}
