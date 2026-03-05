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
- **CMGFNav** (`client/src/components/cmgf-nav.tsx`): Sub-navigation within research pages using three dropdown menus (Framework, Pipeline, Walkthrough) plus a standalone prominent Signal Flow button with gold accent. Uses shadcn DropdownMenu with dark navy styling. Signal Flow is always visible and highlighted for easy access.
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
- **Reference Explorer (RAG)**: Provides grounded Q&A over the research library using OpenAI embeddings for semantic search and GPT-4o for answer generation with inline citations. Answers are strictly document-grounded.
- **Scenario Orchestration Engine (Demo Mode)**: Facilitates one-click scenario generation, analysis, and reporting for military learner profiles. It uses synthetic profiles, applies CMGF rules, and generates various HTML reports, including batch simulations for institutional intelligence. Deterministic output is returned immediately; HTML reports generate asynchronously after the response. Client shows SM Results view first for instant feedback.
- **Career Path Feasibility Advisor** (`/research/career-advisor`): A deterministic constraint-binding advisory tool that evaluates military-to-civilian transition pathways against policy, credentialing, and education authority rules. Covers 6 MOS types × 6 civilian careers with rule-specific constraint evaluations, pathway visualizations, tier tagging, and a Governance Transparency panel showing engine version, execution type, data sources consulted, and rules evaluated. All client-side logic, no API calls. Component at `client/src/pages/career-advisor.tsx`.
- **Signal Flow Animation** (`/research/signal-flow`): A cinematic HTML5 Canvas animation telling the story of the CMGF signal from individual service member to national policy scale in four acts (75 seconds). Features: title card at frame zero ("From One to the Pentagon"), large nodes (2-3x scale for conference projection), doubled label font sizes, streaming typewriter narration per act, amber/orange color palette throughout. Act I: single SM with multi-lane back-and-forth advisory, hot glowing ESO signal. Act II: hundreds of SMs at one installation, heavy AI-ESO traffic. Act III: 8 named military bases each with AI+ESO+ISR, ISR feeds converge at normalization/aggregation hub, then flow to Pentagon (upper-center, largest node). Act IV: 180+ installations, 2M+ SMs, hundreds of ESOs feeding the Pentagon with amber/orange convergence beams. Closing quote panel: "One governed signal. Millions of pathways. One national picture." Canvas fills viewport height. Includes play/pause/reset controls, fullscreen mode for conference presentation, and progress tracking. All client-side, no API calls. Component at `client/src/pages/signal-flow-animation.tsx`.
- **AI Architecture Hub** (`/research/ai`): Gateway page for all AI-related CMGF demonstrations. Links to Career Path Advisor, Signal Flow Animation, and Scenario Engine. Includes governing principles (non-negotiable constraints, human authority, transparency, policy-as-code) and compliance alignment note. Dark navy/gold aesthetic. Component at `client/src/pages/ai-architecture.tsx`.
- **ESO Pipeline Hub** (`/research/eso`): Gateway page for the end-to-end career transition pipeline. Visualizes the four pipeline stages (SM Request → Engine Analysis → ISR Queue → Audit Trail) with step-by-step cards and dual data flow explanation (individual advisory vs institutional intelligence). Dark navy/gold aesthetic. Component at `client/src/pages/eso-pipeline.tsx`.
- **SM Request → ISR Pipeline**: Implements an end-to-end career transition pipeline demonstrating the CMGF's dual data flow. It covers service member request submission, ISR advisor queue management, engine analysis, advisor actions, and an immutable audit trail.
- **API Rate Limiting**: All OpenAI-powered endpoints are protected by an in-memory rate limiter to manage costs and prevent abuse, including per-IP limits, global concurrency limits, and daily request caps.
- **Dashboard Lazy Loading**: The Executive Dashboard uses `/api/library/summary` (SQL aggregation, ~1KB) for initial metrics/charts. The full 27MB library only loads when the user clicks the Research tab (`useQuery` with `enabled` flag). This reduces initial load from ~27MB/4.6s to ~1KB/0.1s.

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