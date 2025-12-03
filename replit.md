# Overview

This is a Civilization VI Companion AI application that provides real-time strategic analysis and expert coaching for Civ 6 gameplay. The system uses a "bridge" architecture where a Lua mod running inside Civ 6 exports game data to a log file, which is then watched by a Node.js bridge script running on the player's PC. The bridge forwards this data to a Replit-hosted Express server, where it's stored in memory and analyzed by an AI advisor (powered by OpenAI). The React frontend displays the game state, benchmarks, and strategic recommendations in a real-time dashboard.

The core value proposition is transforming raw game data into actionable strategic advice based on competitive multiplayer best practices, helping players learn optimal build orders, timing windows, and victory conditions without needing to memorize complex meta-strategies.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework:** React 18 with TypeScript, built using Vite  
**UI Library:** Radix UI components with shadcn/ui styling system  
**State Management:** TanStack Query (React Query) for server state synchronization  
**Styling:** Tailwind CSS with custom theming (Civ VI aesthetic - dark strategy blue backgrounds, gold accents, sci-fi HUD elements)

**Design Pattern:** Component-based architecture with separation between:
- `/components/civ/*` - Domain-specific Civilization game components (StatCard, AnalysisPanel, StrategosPanel)
- `/components/ui/*` - Generic reusable UI primitives (buttons, cards, badges)
- `/pages/*` - Route-level components
- `/lib/*` - Business logic and utilities (advisor.ts, strategyDb.ts, mockData.ts)

**Key Architectural Decision:** The frontend uses polling (3-second intervals) to fetch game state rather than relying solely on WebSockets, providing resilience against connection drops. WebSocket support exists but acts as a secondary real-time update channel. Game state is persisted to localStorage for session resilience when the Replit container restarts.

## Backend Architecture

**Framework:** Express.js with TypeScript  
**Runtime:** Node.js with ES Modules  
**Development Server:** Vite dev server in middleware mode for HMR during development  
**Production Build:** Custom esbuild bundler (script/build.ts) that creates a single-file server bundle

**Separation of Concerns:**
- `server/routes.ts` - API endpoint definitions (POST /api/gamestate, GET /api/gamestate, POST /api/ask-strategos)
- `server/storage.ts` - Data persistence abstraction (currently in-memory via MemStorage class)
- `server/static.ts` - Static file serving for production builds
- `server/vite.ts` - Vite dev server integration for development

**Key Architectural Decision:** The application uses **in-memory storage** (MemStorage) instead of database persistence for game state. This trades durability for speed—game state is volatile and resets on server restart, but retrieval is instantaneous. This is acceptable because game sessions are ephemeral and the external bridge script can easily resend data. The Drizzle/PostgreSQL setup exists in the codebase but is not currently used for game state storage.

**AI Integration:** The `/api/ask-strategos` endpoint sends game state to OpenAI's API (via Replit's AI Integrations service) with a detailed system prompt (`server/strategos_prompt.md`) that instructs the model to act as a competitive Civ VI coach. The prompt encodes meta-game knowledge like "Culture > Science in early game" and "rush Feudalism for Serfdom policy."

## Data Flow Architecture

**The Bridge Pattern:**
1. **Civ VI Lua Mod** → Writes structured JSON to Lua.log file on player's PC
2. **Node.js Bridge Script** (bridge-final.js) → Watches log file using `tail`, debounces updates, POSTs to Replit server
3. **Express Server** → Validates with Zod schema, stores in MemStorage
4. **React Frontend** → Polls server every 3 seconds, displays in UI

**Game Speed Normalization:** The advisor (client/src/lib/advisor.ts) normalizes turn numbers based on game speed multipliers (Online=1x, Standard=2x, Epic=3x, Marathon=6x) to compare player progress against fixed benchmarks designed for "Online Speed."

**Benchmarking System:** The `strategyDb.ts` file contains hardcoded turn-based benchmarks (e.g., Turn 30 should have 15 science, 40 culture) extracted from competitive multiplayer guides. The advisor compares actual yields to these targets and generates alerts/recommendations.

## External Dependencies

**Third-Party Services:**
- **Replit AI Integrations** - Provides OpenAI API access without requiring user's own API key (uses `process.env.AI_INTEGRATIONS_OPENAI_BASE_URL`)
- **Neon Database** (PostgreSQL) - Provisioned via `@neondatabase/serverless`, but not actively used for game state storage in current implementation

**Client-Side Libraries:**
- Radix UI - Accessible component primitives
- TanStack Query - Server state management
- Framer Motion - Animations for UI elements
- Wouter - Lightweight routing
- Tailwind CSS - Utility-first styling
- Lucide Icons - SVG icon library

**Server-Side Libraries:**
- Express.js - HTTP server
- Drizzle ORM - Database toolkit (configured but unused for core functionality)
- Zod - Runtime type validation for game state schema
- OpenAI SDK - AI completions
- CORS - Cross-origin resource sharing
- ws - WebSocket support

**Build Tools:**
- Vite - Frontend build tool and dev server
- esbuild - Server bundler for production
- TypeScript - Type checking across full stack
- tsx - TypeScript execution for development

**Local PC Dependencies (Bridge):**
- Node.js - Runtime for bridge script
- tail package - Log file watching
- axios - HTTP client for posting to server

**Database Schema:** Defined in `shared/schema.ts` using Drizzle ORM with PostgreSQL dialect. Schema includes gameStateSchema (Zod) for runtime validation. Migration files would be generated to `./migrations` directory via `drizzle-kit push` command, but database persistence is not currently utilized for the core game state flow.