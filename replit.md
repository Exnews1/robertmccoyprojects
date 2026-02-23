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

### Five Pillars Reference Database
The Five Pillars page at `/cmgf/five-pillars` organizes 797 peer-reviewed sources by CMGF pillar:
- **Pillar 1**: Military Learner Career Mobility (174 sources)
- **Pillar 2**: Empowerment Strategies & Stackable Pathways (222 sources)
- **Pillar 3**: ISR & AI-Assisted Career Advising (217 sources)
- **Pillar 4**: Translating Military Experience (166 sources)
- **Pillar 5**: Veteran & Servicemember Learner Voice (188 sources)
- **Features**: Accessible accordion UI, search filtering, external DOI links
- **Data Source**: library_entries table with topics array containing pillar assignments

### CMGF Series 2026
The CMGF Series page at `/cmgf/series` presents the three-part architectural framework:
- **CMGF-01**: Executive White Paper — strategic overview of fragmentation and governance-first architecture
- **CMGF-02**: Policy & Governance Architecture Brief — authority structures, non-use guardrails, federal AI alignment
- **CMGF-03**: Data Flow & Signal Provenance Brief — deterministic constraint binding, authority tagging, audit logging
- **Downloads**: All three DOCX files available for download
- **Navigation**: Linked from CMGF nav bar, CMGF index sections grid

### Reference Explorer (RAG Feature)
The Reference Explorer at `/explorer` provides grounded Q&A over the research library:
- **Semantic Search**: Uses OpenAI embeddings (text-embedding-3-small) for similarity matching
- **RAG Answer Generation**: GPT-4o generates answers strictly from library sources with inline citations
- **Relevance Threshold**: Only sources with score >= 0.35 are used for answer generation
- **Bounded AI**: Answers are document-grounded only, no generative interpretation beyond source content
- **Source Database**: 797 peer-reviewed sources (2015-2026) with embeddings for semantic search
- **Endpoints**:
  - `POST /api/answer` - Returns grounded answer + cited sources + related sources
  - `POST /api/search` - Returns simple semantic search results (legacy)
  - `GET /api/library` - Returns all library entries
  - `POST /api/library/import` - Bulk import sources from JSON
  - `POST /api/library/generate-embeddings` - Generate embeddings for entries without them
  - `POST /api/library/regenerate-embeddings` - Dev only, regenerates all embeddings

### Scenario Orchestration Engine (Demo Mode)
The Demo Mode page at `/demo` provides one-click scenario generation, analysis, and reporting:
- **Orchestration Modules** (in `server/orchestrator/`):
  - `profiles.ts` - 5 synthetic profile templates with realistic variability
  - `engine.ts` - Core orchestration: generates profiles, runs CMGF rules engine, stores results
  - `reports.ts` - 3 report templates (Pathway Report, ESO Summary, Leadership Brief) + ISR batch report
  - `batch.ts` - Multi-case simulation (10-50 cases) with aggregate statistics
- **Profile Types**: Early Career Enlisted, Mid-Career with Credits, Officer Transition, Deployed SM, High Constraint/Funding Limited
- **Constraint Modifiers**: Short timeline, no TA funding, deployed, no degree — dynamically adjust outputs
- **Report Generation**: HTML reports with governance footer ("AI explains. Rules decide.")
- **ISR Foundation**: Batch simulation aggregates de-identified data for institutional-level intelligence
- **Database Tables**: `synthetic_profiles`, `scenario_runs`, `scenario_outputs`, `generated_reports`
- **Governance Panel**: Shows engine version, data sources, execution type, human review requirement
- **Endpoints**:
  - `GET /api/orchestrator/profile-types` - Available profile templates
  - `POST /api/orchestrator/run-scenario` - Single scenario orchestration
  - `POST /api/orchestrator/run-batch` - Multi-case batch simulation
  - `POST /api/reports/generate` - Generate report from scenario
  - `POST /api/reports/generate-batch` - Generate ISR batch report
  - `GET /api/reports/:id` - Retrieve generated HTML report
  - `GET /api/orchestrator/scenarios` - List past scenario runs
  - `GET /api/orchestrator/scenarios/:id` - Get specific scenario with output

### API Rate Limiting & Cost Protection
All OpenAI-powered endpoints are protected by an in-memory rate limiter (class `RateLimiter` in `server/routes.ts`):
- **Per-IP limit**: 10 requests per 60 seconds
- **Global concurrency**: Max 15 simultaneous AI requests
- **Daily cap**: 500 total AI requests per server restart cycle
- **Cleanup**: Old IP entries purged every 5 minutes to prevent memory leaks
- **Protected endpoints**: `/api/search`, `/api/answer`, `/api/generate-pathway`, `/api/advisor-chat`
- **Monitoring**: `GET /api/ai-usage` returns `{ active, dailyUsed, dailyLimit }`
- **Frontend handling**: All AI-consuming components handle 429 responses with user-friendly messages
- **Token limit**: Advisor chat capped at 2048 completion tokens (reduced from 8192)

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
  - hard_truths_statistics.json - Key statistics for Hard Truths page
- **CSV Parsing**: Uses custom parseCSVLine function to handle quoted fields correctly
- **Design Pattern**: Uses inner div accent strips instead of border-l on rounded Cards

### Hard Truths of the Incarceration System
The Hard Truths page at `/incarceration-research/hard-truths` provides evidence-based analysis from 728 scholarly papers:
- **Research Base**: Analysis of 728 peer-reviewed papers and 40 primary sources (2015-2026)
- **4 Major Sections**: Collapsible accordion UI with color-coded themes
  - **Economics** (green): $39B annual spending, 790% population growth since 1970, cost per prisoner analysis
  - **Prison Life** (orange): Violence statistics, solitary confinement data, PREA implementation
  - **Education & Entry** (blue): 65% numeracy deficit, high school completion rates, GED completion analysis
  - **Rights & Mental Health** (red): 66-76% untreated mental illness, recidivism rates, post-release challenges
- **Data Visualization**: Key statistics displayed with colored accent cards
- **Navigation**: Bidirectional linking with main Incarceration Research Hub
- **Accessibility**: Collapsible sections with ARIA attributes, data-testid for testing

### Human Capital Institutional Throughput Framework
The Human Capital Framework page at `/human-capital` provides comparative analysis of military and correctional education systems:
- **Research Base**: Analysis of 453 peer-reviewed papers across military education, correctional education, human capital economics, and institutional systems
- **Core Framework**: ΔH = f(E) × (1 − C) equation modeling human capital change as function of investment and friction
- **Key Findings**: 45pp efficiency gap between military (85% throughput) and correctional (40% throughput) systems, $600B potential economic value
- **5 Collapsible Sections**: Framework, Military System A, Correctional System B, Mandela Rules, Economic Case
- **System Comparison Table**: Side-by-side metrics for throughput, success rates, investment levels
- **Research Figures**: Institutional Throughput Flow Model, BASE Cost ROI Model
- **Static Data Files** (in `client/public/human-capital/`):
  - `data/Website_Content_Blocks.json` - Content blocks for page sections
  - `images/Figure1_Institutional_Throughput_Flow_Model.png` - Flow diagram
  - `images/Figure2_BASE_Cost_ROI_Model.png` - Cost/ROI analysis
  - 30+ CSV research data files

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