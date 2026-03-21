# CMGF Compliance Framework

## Overview

This project is a full-stack compliance framework analysis application designed to track regulatory compliance, manage publications, and visualize metrics. It provides a comprehensive dashboard for military education, criminal justice reform, and human capital development. Key features include a reference database with semantic search (RAG), a scenario orchestration engine for simulations, and an end-to-end pipeline for service member requests. The project supports research hubs for AI in Education, U.S. Incarceration, and Human Capital Institutional Throughput, leveraging peer-reviewed data to inform policy and strategy.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack React Query
- **UI Components**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS, formal dark navy/antique gold theme
- **Typography**: Merriweather (headings), Inter (body), JetBrains Mono (code)
- **Design System**: Formal/statutory aesthetic with sharp corners, flat cards, dark navy headers/footers, and antique gold accents.
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Site Structure**: Divided into "Consulting" (landing, about, services, contact) and "Research" (CMGF framework, demos, ISR pipeline, hubs).
- **Navigation**: TopNav (site-wide), CMGFNav (research sub-navigation), DemoNav (unified sub-navigation for demo/tool pages).

### Backend
- **Framework**: Express.js with TypeScript
- **Server**: Node.js HTTP server
- **API Pattern**: RESTful JSON API
- **Storage**: Abstracted via `IStorage` interface
- **Security**: Rate limiting on OpenAI endpoints, disabled `x-powered-by`, strict security headers, and input sanitization for free-text fields.

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` with Zod validation schemas.
- **Database Tables**: Includes `frameworks`, `compliance_items`, `publications`, `library_entries`, `inquiries`, `synthetic_profiles`, `scenario_runs`, `scenario_outputs`, `generated_reports`, `service_member_requests`, `isr_cases`, `isr_actions`, `audit_log_entries`, `meridian_staging`, `meridian_repository`, `meridian_audit`, `meridian_financials`, `insurance_staging`, `insurance_repository`, `insurance_audit`.

### Key Features
- **CMGF Research Hubs**: Organized hubs (e.g., AI Education Futures Hub, U.S. Incarceration Research Hub) presenting peer-reviewed data with interactive UI patterns.
- **CMGF Series 2026**: A six-brief architectural framework (CMGF-01 through CMGF-06) with CMGF-00 as the scholarly foundation.
- **Reference Explorer (RAG)**: Semantic search and Q&A over research library using OpenAI embeddings and GPT-4o, with inline citations.
- **Scenario Orchestration Engine**: One-click generation, analysis, and reporting for military learner profiles, including batch simulations.
- **Career Path Feasibility Advisor**: Deterministic advisory tool for military-to-civilian transitions, evaluating pathways against policy and credentialing rules.
- **Signal Flow Animation**: Cinematic HTML5 Canvas animation visualizing the CMGF signal from individual service member to national policy.
- **AI Architecture Hub**: Gateway page for AI-related CMGF demonstrations, outlining governing principles and compliance alignment.
- **ESO Pipeline Hub**: Visualizes the end-to-end career transition pipeline with stages like SM Request, Engine Analysis, ISR Queue, and Audit Trail.
- **SM Request → ISR Pipeline**: Implements an end-to-end career transition pipeline demonstrating dual data flow for individual advisory and institutional intelligence.
- **Meridian Industrial Group KMS Demo**: AI/Human-in-the-loop ingestion pipeline for documents, with classification, staging, and integration into a shared repository.
- **Meridian KMS Portal**: Standalone knowledge repository portal pre-seeded with documents, featuring search, filtering, and detailed document views.
- **Meridian Financial Records**: Synthetic financial records (AR/AP) displayed within the KMS portal with summary cards, sortable tables, and detailed payment chains.
- **Insurance Brokerage KMS**: Full P&C insurance brokerage document management system with ingestion pipeline (PDF classification via GPT-4o) and a hierarchical KMS portal for approved documents.

## External Dependencies

### Database
- **PostgreSQL**: Primary database.

### AI/ML Services
- **OpenAI API**: For embeddings (`text-embedding-3-small`) and RAG answer generation (`GPT-4o`).

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
- **pdf-parse**: PDF parsing.
- **adm-zip**: ZIP file handling.