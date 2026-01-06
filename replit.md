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