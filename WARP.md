# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands and workflows

### Installation and dev server
- Install dependencies (recommended from repo root):
  - `npm install`
- Start the Vite dev server on port 8080:
  - `npm run dev`

### Build and preview
- Production build:
  - `npm run build`
- Development-mode build (uses Vite `--mode development`):
  - `npm run build:dev`
- Preview the production build locally:
  - `npm run preview`

### Linting
- Run ESLint over the TypeScript/React codebase (configured via `eslint.config.js`):
  - `npm run lint`

### Testing
- There is currently **no test script or test runner configured** in `package.json`.
- If you add a test framework (e.g. Vitest, Jest, Playwright), also add the relevant `npm` scripts and update this section with:
  - The main test command (e.g. `npm test` or `npm run test`)
  - How to run a single test file or pattern.

### Environment configuration
- Frontend behavior is controlled via Vite env vars (from `.env`, `.env.local`, or your host environment):
  - `VITE_API_URL`: Base URL for the backend API used by the AI agent (defaults to `http://localhost:8000` if unset).
  - `VITE_DEMO_MODE`: When set to `'true'`, the AI flows use local mock responses instead of hitting a real backend.
  - `VITE_CLAUDE_API_KEY`: Enables Anthropic Claude calls for off-script questions in demo mode.
  - `VITE_ANTHROPIC_BASE_URL` and `VITE_CLAUDE_MODEL`: Optional overrides for the Claude endpoint and model.
- When running purely as a frontend demo, you can typically set:
  - `VITE_DEMO_MODE=true`
  - (Optionally) `VITE_CLAUDE_API_KEY` and related Claude settings if you want real answers to open-ended questions.

## High-level architecture

### Tech stack
- Vite + React + TypeScript single-page application.
- React Router for client-side routing.
- shadcn-ui (Radix-based) components + Tailwind CSS for UI.
- TanStack Query for async data and server state (primarily around AI interactions).

### Application entry and routing
- `src/main.tsx`
  - Bootstraps the React app and renders `<App />` into `#root`.
- `src/App.tsx`
  - Wraps the app in `QueryClientProvider`, `TooltipProvider`, and global toasters.
  - Defines the main `BrowserRouter` and `Routes`:
    - `/` → `pages/Index` (Sharpei AI landing & quick actions).
    - `/dashboard`, `/companies`, `/orders`, `/contracts`, `/payments`, `/assets`, `/assets/:id`, `/merchants`, `/merchants/:id` → various line-of-business views.
    - `/checkout` and `/checkout-v2` → checkout flows.
    - `/application` → AI-guided application flow.
    - `*` → `pages/NotFound`.
- All routed pages are rendered inside `components/PageLayout`, which provides the sidebar navigation and persistent floating chat.

### Layout and shared UI
- `src/components/PageLayout.tsx`
  - Top-level layout used by most routes.
  - Provides an `AppSidebar` on the left, a sticky header with a `SidebarTrigger`, and a `main` area for page content.
  - Renders `FloatingAIChat` as a global floating assistant visible on non-root routes.
- `src/components/ui/*`
  - shadcn-style primitive components (buttons, cards, dialogs, sidebar primitives, etc.).
  - Higher-level components build on these primitives for consistent styling.

### AI and application flows

#### Core AI plumbing
- `src/services/ai/agentAPI.ts`
  - Central Axios-based client for talking to the AI backend.
  - Determines the base URL from `VITE_API_URL` (default `http://localhost:8000`).
  - Adds an auth token (from `localStorage.auth_token`) to the `Authorization` header when present.
  - Redirects to `/login` on HTTP 401 responses and clears the auth token.
  - Key methods:
    - `initialize(sessionId)` – sets up an AI session; in demo mode, returns a canned welcome message.
    - `sendMessage(sessionId, message, context?)` – main messaging entry point.
      - In demo mode, routes to `getMockResponse` instead of hitting the backend.
      - For “question-like” inputs in demo mode and when `VITE_CLAUDE_API_KEY` is set, attempts to answer via Anthropic Claude (`askClaude`).
    - `getQualificationStatus(sessionId)` and `updateCustomerData(...)` – additional backend integrations (no-ops or mock data in demo mode).
- `src/hooks/useAiAgent.ts`
  - React hook that wraps `agentAPI` into a session-bound interface.
  - Manages connection lifecycle (`initialize` on mount), loading state, last AI message, and a coarse `connectionStatus` enum.
  - Exposes `sendMessage(message, context?)` that updates React state with the latest AI response.
- `src/config/aiConfig.ts`
  - Central configuration toggles for the “application” AI experience (`enableClaudeAI`, `enableOfferEngine`, `enableQualificationFlow`, list of steps, `demoMode`).

#### AI-guided application experience
- `src/pages/ApplicationForm.tsx` (page) and `src/components/AIApplicationChat.tsx` (core implementation) form the AI-guided application flow that `/application` navigates to.
- `AIApplicationChat` responsibilities:
  - Consumes order details from `location.state` (quantity, maintenance, insurance, term, down payment) or uses sensible defaults.
  - Manages a local `sessionId` and uses `useAiAgent(sessionId)` for backend/off-script questions.
  - Maintains a rich state machine:
    - `PromptKind` union type encodes the current prompt in the flow (company info, guarantor details, offer choice, term selection, contract signature, etc.).
    - `ApplicationStep` tracks coarse phases (`info`, `documents`, `offers`, `contract`, `complete`).
  - Stores a working `UserProfile` snapshot in a ref (`workingDataRef`) and progressively enriches it as the user answers prompts.
  - Implements `askNextFrom(...)` to drive the next question based on the partial profile:
    - Drives the business application flow: company name, EIN, entity type, incorporation state, years in business, ownership %, representative, and (conditionally) guarantor info for >$50k exposures.
    - Skips some revenue questions by defaulting income when necessary to reach offers quickly.
  - Offer generation and presentation:
    - Uses `simulateResiduals` from `src/services/ai/offerEngine.ts` to estimate residual values and summary text.
    - `proposeMultipleOffers` presents the concept of financing vs. leasing and asks the user to choose or request a side-by-side comparison.
    - `proposeComparison` computes example financing vs. lease scenarios for a default term and renders a comparison view with structured cost breakdowns.
    - `proposeSelectedOffer(offerType, term)` computes a tailored offer based on income/credit-like attributes, sets `lastOffer`, and emits an `offer`-typed chat message used by `OfferCard`.
  - Contract stage:
    - `initiateContractSignature()` builds a mock DocuSign URL and emits a `contract`-typed chat message rendered via `ContractCard`.
    - On “sign” intents, emits a `completion`-typed message that displays a confirmation and summary of the selected offer.
  - Off-script questions:
    - Any message recognized as a question is sent to `agentAPI.sendMessage` with a context payload (working customer data, last offer, cart total, current prompt).
    - In demo mode + Claude key, these are routed through Anthropic with detailed domain-specific context for equipment financing.

#### Floating assistant
- `src/components/FloatingAIChat.tsx`
  - Global floating chat bubble rendered by `PageLayout`; hidden on the `/` route.
  - Manages multiple short “conversations” each with its own session id and title.
  - Uses `useAiAgent` for backend calls; passes recent conversation history as context.
  - Provides a small set of predefined questions and suggestion buttons to seed conversations.

### Commerce and checkout flows
- `src/pages/Checkout.tsx`
  - Full merchant-style checkout experience with:
    - Cash, finance, and lease tabs (all UI-only / front-end simulated).
    - Quantity, maintenance, and insurance toggles that affect a derived monthly total.
    - Lease end-of-term options explained in a side panel.
  - Primary “Apply Now” action navigates to `/application` and passes the selected configuration via React Router `state`. The AI application flow then uses this to compute cart totals and offers.
- `src/pages/CheckoutV2.tsx`
  - Alternate checkout variant with similar structure and price logic but different copy/numbers and a slightly different layout.
  - Also navigates to `/application` with its own state payload when “Apply Now” is clicked.

### Utilities and support code
- `src/services/ai/offerEngine.ts`
  - Provides `simulateResiduals(items, termMonths?)` which:
    - Applies heuristic residual percentages based on item names (e.g., different treatment for bikes, MacBooks, robots).
    - Produces per-item residuals and an aggregated residual plus a human-readable summary string.
  - Used by `AIApplicationChat` to enrich lease offers with residual explanations.
- `src/hooks/use-mobile.tsx`, `src/hooks/use-toast.ts`, `src/lib/*`
  - Miscellaneous utilities and custom hooks supporting UI and UX patterns (responsive tweaks, id generation, export helpers, general utilities).

### Deployment notes
- `README.md` assumes this project is primarily managed via Lovable (lovable.dev):
  - Local development is standard Node + npm: clone, `npm install`, `npm run dev`.
  - Lovable handles publishing and hosting; to deploy from Lovable, follow the “Share → Publish” flow described in the README.
- If deploying outside Lovable, treat this as a standard Vite React app: run `npm run build` and serve the generated `dist/` directory via your chosen static hosting solution.
