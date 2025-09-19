# Vibe - Next.js Full-Stack Application

Vibe is a modern full-stack web application built with Next.js 15.5.3, featuring tRPC for type-safe APIs, Prisma for database management, and a comprehensive shadcn/ui component library.

**ALWAYS follow these instructions first and fallback to additional search and context gathering only when the information here is incomplete or found to be in error.**

## Working Effectively

### Initial Setup and Dependencies
Bootstrap the development environment:
- Ensure Node.js v20+ is installed: `node --version` (tested with v20.19.5)
- Ensure npm v10+ is installed: `npm --version` (tested with 10.8.2)
- **NEVER CANCEL**: `npm install` - takes 30 seconds. Set timeout to 120+ seconds.
- Create environment file: `cp .env.example .env.local` and configure DATABASE_URL

### Build Process
- **CRITICAL BUILD LIMITATION**: Build fails due to network restrictions for Google Fonts and Prisma engines
- **WORKAROUND for testing builds**:
  1. Temporarily replace `src/app/layout.tsx` with network-free version (remove Google Fonts imports)
  2. Temporarily mock Prisma client in `src/lib/prisma.ts` 
  3. Run `npm run build` - takes 20 seconds. **NEVER CANCEL**. Set timeout to 180+ seconds.
  4. Restore original files after testing
- **Production builds require**:
  - Network access to fonts.googleapis.com for Geist fonts
  - Network access to binaries.prisma.sh for Prisma engines
  - Run `npx prisma generate` before building (fails in restricted environments)

### Development Workflow
- **ALWAYS run development server**: `npm run dev` - starts in 1 second, runs on http://localhost:3000
- Development server works perfectly without network dependencies
- **NEVER CANCEL**: Allow at least 30 seconds for server startup. Set timeout to 120+ seconds.
- Linting: `npm run lint` - takes 2 seconds. **NEVER CANCEL**. Set timeout to 60+ seconds.

### Database Setup
- Requires PostgreSQL database configured via DATABASE_URL environment variable
- Schema located in `prisma/schema.prisma` (User and Post models)
- Generate Prisma client: `npx prisma generate` (requires network access)
- **Note**: Prisma client is imported but not actively used in current codebase

## Validation

### Manual Testing Requirements
After making changes, **ALWAYS validate** the application by:
1. Starting development server: `npm run dev`
2. Opening http://localhost:3000 in browser
3. Verifying tRPC functionality by checking the page displays: `{"greeting":"hello from tRPC"}`
4. Testing component changes by navigating through the UI
5. **NEVER skip validation** - the application must display the tRPC greeting to confirm proper functionality

### Pre-commit Validation
Always run before committing changes:
- `npm run lint` - must pass with no errors
- Manual browser testing as described above
- Verify development server starts without errors

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15.5.3 with App Router, React 19.1.0, TypeScript
- **API Layer**: tRPC 11.5.1 with React Query integration
- **Database**: Prisma with PostgreSQL
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Development**: Turbopack for fast builds and hot reload

### Key Directories
- `src/app/` - Next.js App Router pages and layouts
- `src/components/ui/` - shadcn/ui component library (45+ components)
- `src/trpc/` - tRPC client, server setup, and API routes
- `src/lib/` - Utility functions and shared configurations
- `prisma/` - Database schema and migrations

### Important Files
- `src/app/layout.tsx` - Root layout with font loading and tRPC provider
- `src/app/page.tsx` - Homepage with tRPC client integration
- `src/app/client.tsx` - Client-side tRPC usage example
- `src/trpc/routers/_app.ts` - Main tRPC router with hello endpoint
- `src/lib/prisma.ts` - Prisma client configuration
- `components.json` - shadcn/ui configuration

## Common Tasks

### Adding New API Endpoints
1. Create new procedures in `src/trpc/routers/_app.ts`
2. Use `baseProcedure` from `src/trpc/init.ts`
3. Example pattern: `.input(z.object({...})).query((opts) => {...})`
4. Test with development server running

### Working with Components
- All UI components available in `src/components/ui/`
- Import from `@/components/ui/[component-name]`
- Components include: Button, Card, Dialog, Form, Input, Select, and 40+ others
- Styled with Tailwind CSS using design system tokens

### Environment Configuration
Create `.env.local` with:
```
DATABASE_URL="postgresql://user:password@localhost:5432/vibe"
```

### Troubleshooting Network Issues
- **Google Fonts errors**: Comment out font imports in layout.tsx for testing
- **Prisma generation errors**: Mock the prisma client in lib/prisma.ts for build testing
- **Development always works**: Use `npm run dev` for all development and testing

## Frequently Used Commands and Outputs

### Repository Structure
```
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/ui/       # shadcn/ui components (45+ files)
│   ├── lib/                # Utilities and configurations
│   └── trpc/               # tRPC setup and routers
├── prisma/                 # Database schema
├── package.json            # Dependencies and scripts
└── .env.example           # Environment template
```

### Package.json Scripts
```json
{
  "dev": "next dev --turbopack",
  "build": "next build --turbopack", 
  "start": "next start",
  "lint": "eslint"
}
```

### Dependencies Overview
- 65 total dependencies including React, Next.js, tRPC, Prisma
- All @radix-ui components for accessible UI primitives
- Development tools: ESLint, TypeScript, Tailwind CSS

**Remember**: Development server functionality is fully validated and works perfectly. Build process requires network access workarounds in restricted environments.