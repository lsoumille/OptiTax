
# AGENTS.md - OptiTax Coding Guidelines

> **Agentic Coding Instructions** for the OptiTax repository. This file guides AI agents working on this React + TypeScript + Vite + Cloudflare Workers codebase.

---

## Build & Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev environment (Vite watch + Wrangler dev server on port 8787) |
| `npm run dev:vite` | Start Vite build in watch mode only |
| `npm run dev:wrangler` | Start Wrangler dev server (with 3s delay + worker build) |
| `npm run build` | Production build (Vite + Wrangler Pages Functions) |
| `npm run build:worker` | Build Cloudflare Worker to `dist/_worker.js` |
| `npm run preview` | Preview production build locally |

**Note:** No test or lint scripts are currently configured. Add testing framework (Vitest/Jest) if implementing tests. For single test execution, configure a test runner first.

---

## Tech Stack Overview

- **Framework:** React 19.2.3 + TypeScript 5.8.2
- **Build Tool:** Vite 6.2.0 with @vitejs/plugin-react
- **Backend:** Cloudflare Pages Functions (Wrangler 3.x)
- **Package Manager:** npm
- **AI SDK:** @google/genai (Gemini API)
- **Charts:** recharts for data visualization
- **Styling:** Tailwind CSS + custom CSS variables
- **Path Alias:** `@/` maps to project root

---

## Code Style Guidelines

### Imports
- Use **absolute imports** with `@/` alias for cross-module imports (e.g., `@/components/Layout`)
- Use **relative imports** for files in the same directory (e.g., `../types`)
- Group imports: React → external libs → internal modules → types
- Use single quotes for string literals

### Types & Naming
- **Interfaces over types** for object shapes (e.g., `interface TaxData`, `interface Props`)
- PascalCase for components, interfaces, and type aliases
- camelCase for variables, functions, and props
- Descriptive names: `extractedData` not `data`, `perCeilingAvailable` not `per`
- Use explicit return types for exported functions

### Components
- Use `React.FC<Props>` pattern for component typing
- Destructure props in function parameters: `({ data }: Props)`
- One component per file with named exports
- Place components in `/components/` directory

### Functions & API
- Use `async/await` for all asynchronous operations
- Export service functions from `/services/` directory
- Use typed function parameters and return types
- Include JSDoc comments for public APIs with @param and @returns

### Error Handling
- Use try/catch for async operations with user-friendly error messages in **French**
- Set error state for UI display: `setError("Une erreur est survenue...")`
- Always clear error state before new operations: `setError(null)`
- Log errors with console.error and descriptive context

### Async Patterns
- Wrap file operations and API calls in Promise-based handlers
- Use `Promise.all()` for concurrent operations (e.g., multiple file conversions)
- Implement proper loading states with `setLoading(true/false)`

---

## Project Structure

```
/components/          # React components (Layout.tsx, TaxDashboard.tsx)
/services/            # API integration (geminiService.ts)
/functions/api/       # Cloudflare Pages Functions (chat.ts)
/types.ts             # Shared TypeScript interfaces
dist/                 # Build output (Vite + Wrangler)
App.tsx               # Main application component
index.tsx             # Application entry point
style.css             # Custom CSS variables and component styles
vite.config.ts        # Vite configuration with path aliases
tsconfig.json         # TypeScript configuration
wrangler.jsonc        # Cloudflare Wrangler configuration
```

---

## UI/Styling Conventions

- Use **Tailwind CSS** utility classes for layout and spacing
- Reference CSS variables from `style.css` for brand colors:
  - Primary: `#0A2540` (deep blue)
  - Accent: `#00D9FF` (turquoise)
  - Light: `#F8F9FA`
- **French language** for all user-facing text
- Custom card class: `opti-card` for branded containers
- Use `toLocaleString('fr-FR')` for number formatting

---

## Cloudflare Workers (Backend)

- Place API endpoints in `/functions/api/` directory
- Use `PagesFunction<Env>` type for Cloudflare Functions
- Define Env interface for environment variables (GEMINI_API_KEY, GEMINI_MODEL)
- Implement CORS headers for cross-origin requests
- Validate request bodies before processing
- Log requests with structured metadata (timestamp, duration, file count)

---

## Environment Variables

The app expects `GEMINI_API_KEY` in environment:
- Vite loads env vars via `loadEnv()` in `vite.config.ts`
- Cloudflare Workers use `context.env.GEMINI_API_KEY`
- Optional: `GEMINI_MODEL` to override default model (gemini-3-flash-preview)
- Store secrets in `.dev.vars` (copied from `.dev.vars.example`)

---

## BMAD Framework Note

This repository contains a `_bmad/` directory with agent framework configurations. When modifying code:
- Do not modify `_bmad/` unless explicitly instructed
- The `.github/agents/` directory contains BMAD agent definitions

---

## Key Files for Context

When working on this codebase, always reference:
1. `types.ts` - Domain types for tax data structures (TaxData, AnalysisResult, OptimizationSuggestion)
2. `services/geminiService.ts` - AI integration patterns with fetch API
3. `App.tsx` - State management and data flow with loading/error states
4. `functions/api/chat.ts` - Cloudflare Worker backend implementation
5. `vite.config.ts` - Build configuration and path aliases
6. `components/TaxDashboard.tsx` - Data visualization patterns with recharts

---

## Security Considerations

- Never commit API keys to version control
- Validate file sizes (10MB limit enforced in chat.ts)
- Check Content-Type headers before parsing JSON responses
- Sanitize user inputs before sending to external APIs
