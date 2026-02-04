# AGENTS.md - OptiTax Coding Guidelines

> **Agentic Coding Instructions** for the OptiTax repository. This file guides AI agents working on this React + TypeScript + Vite codebase.

---

## Build & Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server on port 3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |

**Note:** No test or lint scripts are currently configured in this project.

---

## Tech Stack Overview

- **Framework:** React 19.2.3 + TypeScript 5.8.2
- **Build Tool:** Vite 6.2.0 with @vitejs/plugin-react
- **Package Manager:** npm
- **AI SDK:** @google/genai (Gemini API)
- **Charts:** recharts for data visualization
- **Styling:** Tailwind CSS + custom CSS variables
- **Path Alias:** `@/` maps to project root

---

## Code Style Guidelines

### Imports
- Use **absolute imports** with `@/` alias (e.g., `import { Layout } from '@/components/Layout'`)
- Group imports: React → external libs → internal modules → types
- Use single quotes for string literals

### Types & Naming
- **Interfaces over types** for object shapes (e.g., `interface TaxData`, `interface Props`)
- PascalCase for components, interfaces, and type aliases
- camelCase for variables, functions, and props
- Descriptive names: `extractedData` not `data`, `perCeilingAvailable` not `per`

### Components
- Use `React.FC<Props>` pattern for component typing
- Destructure props in function parameters
- One component per file, named exports

### Error Handling
- Use try/catch for async operations with user-friendly error messages in French
- Set error state for UI display: `setError("Une erreur est survenue...")`
- Always clear error state before new operations: `setError(null)`

### Async Patterns
- Use `async/await` for all asynchronous operations
- Wrap file operations and API calls in Promise-based handlers
- Use `Promise.all()` for concurrent operations (e.g., multiple file conversions)

---

## Project Structure

```
/components/       # React components (Layout.tsx, TaxDashboard.tsx)
/services/          # API integration (geminiService.ts)
types.ts           # Shared TypeScript interfaces
App.tsx            # Main application component
index.tsx          # Application entry point
style.css          # Custom CSS variables and component styles
vite.config.ts     # Vite configuration with path aliases
tsconfig.json      # TypeScript configuration
```

---

## UI/Styling Conventions

- Use **Tailwind CSS** utility classes for layout and spacing
- Reference CSS variables from `style.css` for brand colors:
  - Primary: `#0A2540` (deep blue)
  - Accent: `#00D9FF` (turquoise)
  - Light: `#F8F9FA`
- French language for all user-facing text
- Custom card class: `opti-card` for branded containers

---

## Environment Variables

The app expects `GEMINI_API_KEY` in environment:
- Vite loads env vars via `loadEnv()` in `vite.config.ts`
- Exposed to client as `process.env.API_KEY` and `process.env.GEMINI_API_KEY`

---

## BMAD Framework Note

This repository contains a `_bmad/` directory with agent framework configurations. When modifying code:
- Do not modify `_bmad/` unless explicitly instructed
- The `.github/agents/` directory contains BMAD agent definitions

---

## Key Files for Context

When working on this codebase, always reference:
1. `types.ts` - Domain types for tax data structures
2. `services/geminiService.ts` - AI integration patterns
3. `App.tsx` - State management and data flow
4. `vite.config.ts` - Build configuration and aliases
