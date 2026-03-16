# CMGF Compliance Framework

## Overview

This is a full-stack compliance framework analysis application designed to track regulatory compliance items across various frameworks, manage publications, and visualize compliance metrics. It aims to provide a comprehensive dashboard for military education, criminal justice reform, and human capital development. Key capabilities include a reference database with semantic search (RAG), a scenario orchestration engine for simulations, and an end-to-end pipeline for service member requests. The project encompasses research hubs for AI in Education, U.S. Incarceration, and Human Capital Institutional Throughput, leveraging extensive peer-reviewed data to inform policy and strategy.

## User Preferences

Preferred communication style: Simple, everyday language.

## Site Structure

The site is organized into two top-level sections:
- **Consulting** (`/`, `/about`, `/services`, `/contact`): Full consulting section with hero landing, about narrative, four core services, and contact form. Contact email: robert.mccoy@thegovernanceframework.com
- **Research** (`/research/*`): All research content, CMGF framework, demo mode, ISR pipeline, etc.

Navigation:
- **TopNav** (`client/src/components/top-nav.tsx`): Site-wide navigation with Home, About, Services, Research, Contact links
- **CMGFNav** (`client/src/components/cmgf-nav.tsx`): Sub-navigation within research pages using three dropdown menus (Framework, Pipeline, Walkthrough) plus a standalone prominent Signal Flow button with gold accent. Uses shadcn DropdownMenu with dark navy styling. Used on CMGF framework pages.
- **DemoNav** (`client/src/components/demo-nav.tsx`): Unified sub-navigation shared across the five demo/tool pages: AI Architecture, ESO Pipeline, Career Advisor, Scenario Engine, Signal Flow. Includes a "← CMGF" back link. Active page highlighted in amber. Replaces the old CMGFNav + section tab bars on these pages for a cohesive demo experience.
- Consulting routes: `/`, `/about`, `/services`, `/contact`
- Research routes are prefixed with `/research` (e.g., `/research/cmgf`, `/research/demo`, `/research/sm-hub`)

### Consulting Pages
- `client/src/pages/consulting-home.tsx` — Hero, credentials bar, problem statement, CMGF methodology, services preview
- `client/src/pages/consulting-about.tsx` — Full "Why Me" narrative, credentials detail, framework overview
- `client/src/pages/consulting-services.tsx` — Four core services (Risk Assessment, Policy Drafting, AI Literacy Training, Third-Party Audit)
- `client/src/pages/consulting-contact.tsx` — Contact form (routes to robert.mccoy@thegovernanceframework.com)

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack React Query
- **UI Components**: shadcn/ui (built on Radix UI)
- **Styling**: Tailwind CSS with formal dark navy/antique gold theme
- **Typography**: Merriweather (serif headings) + Inter (body) + JetBrains Mono (code)
- **Design System**: Formal/statutory aesthetic — sharp corners (0.125rem radius), flat cards, dark navy header/footer (#0F172A) with antique gold (#B45309) accents
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Server**: Node.js HTTP server
- **API Pattern**: RESTful JSON API
- **Storage**: Abstracted via `IStorage` interface

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` with Zod validation schemas
- **Database Tables**: `frameworks`, `compliance_items`, `publications`, `library_entries`, `inquiries`, `synthetic_profiles`, `scenario_runs`, `scenario_outputs`, `generated_reports`, `service_member_requests`, `isr_cases`, `isr_actions`, `audit_log_entries`.

### Key Features
- **CMGF Research Hubs**: Five Pillars, CMGF Series 2026, AI Education Futures Hub, U.S. Incarceration Research Hub, Hard Truths of Incarceration, Human Capital Institutional Throughput Framework. These hubs organize and present data from hundreds of peer-reviewed sources using various UI patterns like accordions, search filters, and interactive visualizations.
- **CMGF Series 2026**: Now a six-brief architectural framework (CMGF-01 through CMGF-06). CMGF-00 is the scholarly foundation (v6). CMGF-01/02/03 are v3 (March 2026 timestamps: 1773312432772/1773312432773). CMGF-04 (Sandbox Architecture & ISR Signal Boundary), CMGF-05 (Credential Infrastructure, Session Continuity, and Upstream Integration), CMGF-06 (Potential Authority Landscape) are v1 (timestamp: 1773317232992). All citations updated to March 2026 and URL path `/research/cmgf/series`.
- **Reference Explorer (RAG)**: Provides grounded Q&A over the research library using OpenAI embeddings for semantic search and GPT-4o for answer generation with inline citations. Answers are strictly document-grounded.
- **Scenario Orchestration Engine (Demo Mode)**: Facilitates one-click scenario generation, analysis, and reporting for military learner profiles. It uses synthetic profiles, applies CMGF rules, and generates various HTML reports, including batch simulations for institutional intelligence. Deterministic output is returned immediately; HTML reports generate asynchronously after the response. Client shows SM Results view first for instant feedback.
- **Career Path Feasibility Advisor** (`/research/career-advisor`): A deterministic constraint-binding advisory tool that evaluates military-to-civilian transition pathways against policy, credentialing, and education authority rules. Covers 6 MOS types × 6 civilian careers with rule-specific constraint evaluations, pathway visualizations, tier tagging, and a Governance Transparency panel showing engine version, execution type, data sources consulted, and rules evaluated. Uses a simplified `DemoNav` (Career Advisor, SM Hub, Scenario Engine, Signal Flow) instead of the full CMGFNav for cleaner conference demos. Right panel features an animated ready-state with pulsing status dot, field completion checklist with micro-response flashes on each dropdown selection, and a "Ready to Evaluate" state when all 5 parameters are bound. All client-side logic, no API calls. Component at `client/src/pages/career-advisor.tsx`.
- **Signal Flow Animation** (`/research/signal-flow`): A cinematic HTML5 Canvas animation telling the story of the CMGF signal from individual service member to national policy scale in four acts plus a fireworks finale (90 seconds, auto-looping). Features: title card at frame zero ("From One to the Pentagon"), large nodes (2-3x scale for conference projection), doubled label font sizes, streaming typewriter narration per act, amber/orange color palette throughout. Act I: single SM with multi-lane back-and-forth advisory, hot glowing ESO signal. Act II: hundreds of SMs at one installation, heavy AI-ESO traffic. Act III: 8 named military bases each with AI+ESO+ISR, ISR feeds converge at normalization/aggregation hub, then flow to Pentagon (upper-center, largest node). Act IV: 180+ installations, 2M+ SMs, hundreds of ESOs feeding the Pentagon with amber/orange convergence beams. Closing quote panel: "One governed signal. Millions of pathways. One national picture." Canvas fills viewport height. Includes play/pause/reset controls, fullscreen mode for conference presentation, and progress tracking. All client-side, no API calls. Component at `client/src/pages/signal-flow-animation.tsx`.
- **AI Architecture Hub** (`/research/ai`): Gateway page for all AI-related CMGF demonstrations. Links to Career Path Advisor, Signal Flow Animation, and Scenario Engine. Includes governing principles (non-negotiable constraints, human authority, transparency, policy-as-code) and compliance alignment note. Dark navy/gold aesthetic. Component at `client/src/pages/ai-architecture.tsx`.
- **ESO Pipeline Hub** (`/research/eso`): Gateway page for the end-to-end career transition pipeline. Visualizes the four pipeline stages (SM Request → Engine Analysis → ISR Queue → Audit Trail) with step-by-step cards and dual data flow explanation (individual advisory vs institutional intelligence). Dark navy/gold aesthetic. Component at `client/src/pages/eso-pipeline.tsx`.
- **SM Request → ISR Pipeline**: Implements an end-to-end career transition pipeline demonstrating the CMGF's dual data flow. It covers service member request submission, ISR advisor queue management, engine analysis, advisor actions, and an immutable audit trail.
- **API Rate Limiting**: All OpenAI-powered endpoints are protected by an in-memory rate limiter to manage costs and prevent abuse, including per-IP limits, global concurrency limits, and daily request caps.
- **Security Headers**: Express `x-powered-by` disabled; response headers include `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy` (camera/mic/geo denied). Applied globally in `server/index.ts`.
- **Input Sanitization**: All user-input endpoints (inquiries, advisor-chat, SM requests, ISR actions) sanitize free-text fields via `sanitizeInput()` in `server/routes.ts` — strips HTML tags, `javascript:` URIs, inline event handlers, and truncates to 2000 chars.
- **Dashboard Lazy Loading**: The Executive Dashboard uses `/api/library/summary` (SQL aggregation, ~1KB) for initial metrics/charts. The full 27MB library only loads when the user clicks the Research tab (`useQuery` with `enabled` flag). This reduces initial load from ~27MB/4.6s to ~1KB/0.1s.

- **Meridian Industrial Group KMS Demo** (`/research/knowledge-systems/demo`): An interactive AI/Human-in-the-loop document processing pipeline demo. Features a three-panel layout: (1) Document Library — 29 real Meridian documents selectable individually or in bulk, PLUS a file upload section (drag/browse .txt/.pdf/.docx, max 10MB) to ingest your own documents; (2) Staging Queue — AI classification proposals (doc type, subject, department, standardized name, confidence score) with Approve / Reject / Modify actions; (3) Repository + Audit Trail — approved docs with immutable audit log. Session-scoped via UUID stored in localStorage. Reset button wipes session DB. Rules-based classification engine in `server/meridianClassification.ts` supports both filename-based and content-based classification (reads `Document ID: MIG-XXX-YYY-` headers from .txt files for 97% confidence). Backend routes at `/api/meridian/*` including `POST /api/meridian/upload` (multer memory storage). Categories: Knowledge Management (10), IT (6), HR (4), Safety (3), Finance (2), Quality (2), Legal (1), Operations (1), Procurement (1). DB tables: `meridian_staging`, `meridian_repository`, `meridian_audit`.

### Compliance Frameworks Referenced
- **EO 14179** (Executive Order 14179, 2025): Replaced EO 14110 as of March 2026 content update
- **OMB M-25-21** (2025): Replaced OMB M-24-10 as of March 2026 content update
- **NIST AI RMF 1.0**: Risk Management Framework
- **GAO-24**: Oversight requirements

### Shared Code
- The `shared/` directory contains `schema.ts` (Drizzle table definitions, inferred types) and `routes.ts` (API route definitions with Zod schemas) for type-safe contracts between frontend and backend.

## External Dependencies

### Database
- **PostgreSQL**: Primary database.

### AI/ML Services
- **OpenAI API**: Used for embeddings (text-embedding-3-small) and RAG answer generation (GPT-4o).

### UI Libraries
- **Radix UI**: Accessible UI primitives.
- **Lucide React**: Icon library.
- **Embla Carousel**: Carousel functionality.
- **Vaul**: Drawer component.
- **cmdk**: Command palette component.

### Development Tools
- **Vite**: Frontend bundling and dev server.
- **tsx**: TypeScript execution for backend development.
- **Zod**: Schema validation.
- **drizzle-zod**: Zod schema generation from Drizzle.