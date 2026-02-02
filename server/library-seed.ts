import { storage } from "./storage";
import { generateEmbedding } from "./openai";
import type { InsertLibraryEntry } from "@shared/schema";
import fs from "fs";
import path from "path";

interface SourceEntry {
  id: string | number;
  authors: string[] | string;
  year: string;
  title: string;
  journal: string | null;
  doi: string;
  url: string;
  abstract: string;
  publication_type: string;
  pillars: string[];
}

interface CMGFSourcesData {
  metadata: {
    total_sources: number;
  };
  sources: SourceEntry[];
}

export async function seedLibrary() {
  try {
    const existingEntries = await storage.getLibraryEntries();
    
    // If we already have the full dataset (700+ entries), skip seeding
    if (existingEntries.length >= 700) {
      console.log(`Library already has ${existingEntries.length} entries (full dataset), skipping seed.`);
      return;
    }

    // Try to load full dataset from JSON file
    const jsonPath = path.resolve(process.cwd(), 'client/public/data/cmgf-sources.json');
    
    if (!fs.existsSync(jsonPath)) {
      console.log("CMGF sources JSON file not found, skipping full library seed.");
      return;
    }

    console.log("Loading full CMGF sources database...");
    const jsonData = fs.readFileSync(jsonPath, 'utf-8');
    const data: CMGFSourcesData = JSON.parse(jsonData);
    
    if (!data.sources || !Array.isArray(data.sources)) {
      console.error("Invalid CMGF sources format");
      return;
    }

    console.log(`Found ${data.sources.length} sources to import...`);

    // Clear existing entries if we have incomplete data
    if (existingEntries.length > 0 && existingEntries.length < 700) {
      console.log(`Clearing ${existingEntries.length} incomplete entries...`);
      await storage.clearLibraryEntries();
    }

    // Map sources to library entry format
    const entries: Omit<InsertLibraryEntry, "embedding">[] = data.sources.map((source) => ({
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
      visibility: "public"
    }));

    // Bulk insert all entries
    console.log(`Inserting ${entries.length} library entries...`);
    await storage.bulkCreateLibraryEntries(entries.map(e => ({ ...e, embedding: null })));
    
    console.log(`Library seeding complete! Imported ${entries.length} sources.`);
    console.log("Note: Embeddings will be generated when needed via the generate-embeddings endpoint.");
    
  } catch (error) {
    console.error("Library seeding failed:", error);
  }
}
