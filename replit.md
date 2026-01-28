# CMGF Compliance Framework

## Overview

This is a full-stack compliance framework analysis application built with React and Express. It provides a dashboard for tracking regulatory compliance items across multiple frameworks, managing publications, and visualizing compliance metrics. The application features a high-tech dark mode UI with a sidebar navigation system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state caching and synchronization
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom dark theme configuration and CSS variables
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers

The frontend follows a component-based architecture with pages in `client/src/pages/`, reusable components in `client/src/components/`, and custom hooks in `client/src/hooks/`. Path aliases are configured (`@/` for client source, `@shared/` for shared code).

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Server**: Node.js HTTP server with development support via tsx
- **Build**: Vite for frontend bundling, esbuild for server bundling
- **API Pattern**: RESTful JSON API endpoints prefixed with `/api/`

The server uses a storage abstraction pattern (`IStorage` interface in `server/storage.ts`) to decouple business logic from database operations. Routes are registered in `server/routes.ts`.

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` - contains table definitions, relations, and Zod validation schemas
- **Migrations**: Managed via `drizzle-kit push` command

Database tables:
- `frameworks` - Compliance framework definitions
- `compliance_items` - Individual compliance requirements linked to frameworks
- `publications` - Research papers and publications
- `library_entries` - Research library with semantic embeddings for RAG search
- `inquiries` - Professional inquiry form submissions

### Reference Explorer (RAG Feature)
The Reference Explorer at `/explorer` provides grounded Q&A over the research library:
- **Semantic Search**: Uses OpenAI embeddings (text-embedding-3-small) for similarity matching
- **RAG Answer Generation**: GPT-4o generates answers strictly from library sources with inline citations
- **Relevance Threshold**: Only sources with score >= 0.35 are used for answer generation
- **Bounded AI**: Answers are document-grounded only, no generative interpretation beyond source content
- **Endpoints**:
  - `POST /api/answer` - Returns grounded answer + cited sources + related sources
  - `POST /api/search` - Returns simple semantic search results (legacy)
  - `POST /api/library/regenerate-embeddings` - Dev only, regenerates all embeddings

### AI Education Futures Hub
The AI Education Hub at `/education-ai` provides evidence-based guidance for AI implementation in education:
- **Research Base**: Built on analysis of 557 peer-reviewed papers (2020-2026)
- **8 Implementation Pathways**: Pedagogical, Technology, Assessment, Governance, Equity, Infrastructure, Stakeholders, Outcomes
- **4 Sector Guides**: K-12, Higher Ed, Vocational, Corporate learning
- **Static Data Files** (in `client/public/education-ai/data/`):
  - `adoption-data.json` - Market data, sector adoption rates, regional statistics
  - `pathways.json` - Detailed implementation pathway definitions
  - `case-studies.json` - Real-world AI education case studies
- **Research Visualizations** (in `client/public/education-ai/images/`):
  - `ai_education_adoption_trends.png` - Global adoption trends 2020-2026
  - `ai_education_mind_map.png` - Pathways mind map
  - `ai_education_regional_perspectives.png` - Regional adoption data
  - `ai_education_technology_details.png` - Technology adoption patterns
  - `ai_education_decision_tree.png` - Implementation decision tree

### U.S. Incarceration Research Hub
The Incarceration Research Hub at `/incarceration-research` provides comprehensive U.S. criminal justice system data analysis:
- **Key Statistics**: 2.4M incarcerated, 708 per 100k rate (highest globally), 67.5% recidivism
- **Demographics Analysis**: Race/ethnicity breakdowns showing disparate impact (Black 5.9× White rate)
- **Political Analysis**: Red vs Blue state comparison (16% higher incarceration in Republican states)
- **State Comparison**: Interactive lists of highest/lowest incarceration states with region filtering
- **State Detail Dialog**: Click any state to view detailed policies (Three Strikes, Death Penalty, Marijuana)
- **Static Data Files** (in `client/public/incarceration-research/data/`):
  - 36 CSV files with comprehensive state-level data
  - 19 JSON files including party_comparison_summary.json
  - dashboard_comprehensive_state_data.csv - Main state comparison data
- **CSV Parsing**: Uses custom parseCSVLine function to handle quoted fields correctly
- **Design Pattern**: Uses inner div accent strips instead of border-l on rounded Cards

### Shared Code
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts` - Drizzle table definitions and inferred TypeScript types
- `routes.ts` - API route definitions with Zod schemas for type-safe API contracts

## External Dependencies

### Database
- **PostgreSQL**: Primary database accessed via `DATABASE_URL` environment variable
- **Connection**: Uses `pg` Pool with Drizzle ORM wrapper

### UI Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Lucide React**: Icon library (replaces FontAwesome per requirements)
- **Embla Carousel**: Carousel functionality
- **Vaul**: Drawer component
- **cmdk**: Command palette component

### Development Tools
- **Vite**: Frontend dev server with HMR
- **Replit Plugins**: Runtime error overlay, cartographer, and dev banner for Replit environment
- **tsx**: TypeScript execution for development

### Form & Validation
- **Zod**: Schema validation used throughout for API contracts and form validation
- **drizzle-zod**: Generates Zod schemas from Drizzle table definitions