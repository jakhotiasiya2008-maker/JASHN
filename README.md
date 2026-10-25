# 💍 Jashn — AI Indian Wedding Planner
> **Mathematical Precision Meets Cultural Splendor.**  
> Built for **Hack2Skill PromptWars • Challenge 5: Celebration & Event Planner**.

[![CI Status](https://github.com/your-username/jashn/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/jashn/actions/workflows/ci.yml)
[![WCAG 2.2 AA Compliant](https://img.shields.io/badge/A11y-WCAG%202.2%20AA-success)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Coverage](https://img.shields.io/badge/Coverage-98.01%25%20Domain%20%7C%2081.19%25%20API-brightgreen)](https://github.com/your-username/jashn)
[![Zero Math Hallucination](https://img.shields.io/badge/Architecture-Hybrid%20Deterministic-blueviolet)](https://github.com/your-username/jashn)
[![Bundle Size](https://img.shields.io/badge/Bundle-51.5%20KB%20gzip-informational)](https://github.com/your-username/jashn)

---

## 🎯 1. Problem Statement, Vertical & Target Persona

### The Challenge
Planning a traditional Indian wedding is notorious for its overwhelming complexity. Spanning 3 to 5 multi-day ceremonies (Haldi, Mehendi, Sangeet, Vedic Pheras, Grand Reception), families juggle dozens of volatile vendors, emotional extended family negotiations, and strict cultural rituals. 

Generic AI chatbots and planning spreadsheets fail because:
1. **LLM Arithmetic Hallucinations**: Standard GenAI chatbots invent impossible budgets that do not sum to the total and drift when guest counts change.
2. **Generic Western Templates**: Generic tools lack Indian wedding concepts like Muhurat lead times, Haldi marigold sourcing, Mehendi artist staffing ratios, or sound curfew (10 PM rule) negotiations.
3. **No Crisis Recovery**: When torrential rain hits an open lawn or 150 uninvited guests arrive, planners need immediate tactical playbooks, not polite conversation.

### Our Vertical & Persona
- **Vertical**: Multi-Day Indian Celebrations & Weddings.
- **Target Persona**: *"A busy elder sibling or family coordinator planning a 300+ guest, multi-function Indian wedding on a fixed INR budget who needs clarity, not chaos."*

---

## 📋 2. Requirement-to-Feature Traceability Matrix

| Challenge Brief Requirement | Jashn Feature Delivering It | Underlying Engine / Mechanism |
| :--- | :--- | :--- |
| **Intelligent Event Budgets** | **Hare-Niemeyer Budget Engine** (`/budget`) | Pure TypeScript engine implementing Hamilton-Hare largest-remainder rounding; ₹0 drift, 10% contingency cushion, per-guest metrics, category locking. |
| **Interactive Event Timelines** | **Critical-Path Milestone Roadmap** (`/timeline`) | Backward scheduling from muhurat date; longest DAG critical-path detection, overdue/at-risk indicators, dynamic compression for tight timelines. |
| **Vendor Checklists & Vetting** | **Vendor Red Flag & Negotiation Playbook** (`/vendors`) | Category-specific checklists with Indian wedding questions, contract loopholes, red flags to avoid, and circular progress tracking. |
| **Personalized Event Ideas** | **Gemini Cultural Personalization** (`/ideas`) | Schema-validated AI generation of bespoke palettes, mandap concepts, signature royal feasts, and Sangeet ideas matching vibe and budget. |
| **Unplanned Crisis Handling** | **Tactical Plan B Mode** (`/planb`) | Scenario crisis simulator with 1–4 hour immediate actions, 24-hour steps, budget impact, and copyable WhatsApp vendor scripts. |
| **Shareable Event Export** | **Multi-Format Export Suite** (`/export`) | RFC 5545 `.ics` Apple/Google calendar generation, ink-saving print CSS layout, and WhatsApp formatted broadcast summaries. |

---

## ⚙️ 3. Core Philosophy: Why Hybrid Deterministic + GenAI?

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CORE ARCHITECTURAL RULE                       │
│                                                                        │
│   "The LLM NEVER computes arithmetic, percentages, or scheduling.    │
│    Deterministic, unit-tested TypeScript engines compute all math.    │
│    The LLM ONLY generates cultural personalization and explanations." │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Deterministic Guarantees**: Arithmetic, lead-time offsets, and dependency order are mathematical problems. Offloading them to an LLM produces hallucinations. In Jashn, 100% of allocations are calculated by pure TypeScript engines with 98%+ test coverage.
2. **Schema-Enforced Personalization**: All GenAI outputs (personalization, trade-offs, Plan B) are strictly validated against runtime **Zod schemas**. If the LLM generates malformed JSON, fails validation, or the API key is absent, Jashn automatically falls back to rich, curated deterministic templates.
3. **The App Always Works**: Even offline, rate-limited, or without a configured API key, Jashn delivers 100% functionality with zero downtime or broken screens.

---

## 🏛️ 4. System Architecture & Data Flow

```mermaid
flowchart TD
    User["User Client (Browser)"] --> Wizard["Intake Wizard (5 Steps)"]
    Wizard --> Store["Zustand Global Store (Versioned State)"]

    subgraph Deterministic Engines ["Deterministic TypeScript Engines (Pure Domain)"]
        Store --> BudgetEng["Budget Engine (Hare-Niemeyer Quotas)"]
        Store --> TimelineEng["Timeline Engine (DAG Critical Path)"]
        Store --> VendorEng["Vendor Engine (Playbook & Progress)"]
    end

    subgraph Serverless Proxy ["Serverless Security Proxy (/api)"]
        Store -.-> ClientAPI["apiClient.ts (Debounced + SessionCache)"]
        ClientAPI --> Proxy["Vercel Serverless Function"]
        Proxy --> RateLimiter["Token-Bucket Rate Limiter"]
        RateLimiter --> InjectionDef["XML Sanitizer & Prompt Defense"]
        InjectionDef --> Gemini["Gemini REST API"]
    end

    Gemini --> ZodVal["Zod Schema Validator"]
    ZodVal -- "Valid" --> Dash["Interactive Dashboard"]
    ZodVal -- "Fail / Timeout / No Key" --> FallbackEng["Deterministic Fallback Engine"]
    FallbackEng --> Dash

    BudgetEng --> Dash
    TimelineEng --> Dash
    VendorEng --> Dash

    Dash --> ExportSuite["Export Suite (.ics, Print, WhatsApp)"]
    Dash --> LocalStorage["localStorage (Validated on Load)"]
```

---

## 📐 5. Key Domain Assumptions & Presets

- **Currency & Scale**: Indian Rupee (INR ₹), formatted in Lakhs (L) and Crores (Cr). Default budget is ₹25,00,000 for 300 guests.
- **Category Preset Weights**:
  - `Venue & Banquet`: 24% (Metros: +3%, Tier 3: -3%, High guests: +2%)
  - `Catering & Feast`: 26% (High guests: +3%, Small: -3%)
  - `Decor & Florals`: 13%
  - `Safety Cushion & Contingency`: Hard-coded 10% reserve for last-minute emergencies
  - `Photography & Cinematography`: 9%
  - `Bridal & Groom Attire`: 8%
  - `Music, DJ & Entertainment`: 4%
  - `Invitations & Mithai Gifting`: 2%
  - `Guest Accommodation & Cabs`: 3% (Destination weddings: +8%)
  - `Vedic Rituals & Samagri`: 1%
- **Timeline Milestones**: Lead times based on auspicious Indian wedding seasons (standard 36-week cycle). If wedding date is under 90 days away, the engine activates **Compressed Mode**, compressing lead times proportionally while strictly enforcing predecessor dependency order.

---

## 🔒 6. Security (Scored Explicitly)

- **Server-Side API Key Only**: The `GEMINI_API_KEY` is never bundled into the client bundle or tracked in git. All requests pass through `/api` serverless proxy functions.
- **Strict Prompt-Injection Defense**: User input strings are escaped and isolated within delimited `<user_data>...</user_data>` XML blocks. The system instructions explicitly order the LLM to ignore any instructions inside user data tags.
- **Strict Zero `dangerouslySetInnerHTML` Policy**: All text is rendered via React safe string encoding to eliminate XSS vectors.
- **Rate Limiting**: In-memory token bucket rate limiter protects API proxy endpoints (HTTP 429 when threshold exceeded).
- **Security Headers (`vercel.json`)**:
  - `Content-Security-Policy`: Strict policy restricting script and connect origins.
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY` (anti-clickjacking)
  - `Permissions-Policy`: `camera=(), microphone=(self), geolocation=()`
- **Local-First Privacy**: No user planning data is harvested; state is persisted locally and validated via Zod on load. See [SECURITY.md](SECURITY.md) for full audit details.

---

## ♿ 7. Accessibility (WCAG 2.2 AA Compliant)

- **Automated Axe-Core Audits**: Verified with `vitest-axe` with **0 violations** across Landing, Wizard, and Dashboard views.
- **Semantic HTML & Landmarks**: Proper `<header role="banner">`, `<main id="main-content" role="main">`, `<footer role="contentinfo">`, `<table aria-label="...">`.
- **Keyboard Navigation**: Full keyboard navigation across tabs (`ArrowRight`, `ArrowLeft`, `Home`, `End`), sliders (`aria-valuemin`, `aria-valuemax`, `aria-valuenow`), modal dialogs with focus trap and Esc key support.
- **Accessible Text Alternatives**: Interactive SVG donut chart includes an instant toggle to a WCAG-compliant accessible data table.
- **Color Contrast & Themes**: Contrast-verified across all 4 switchable luxury themes (`Royal Gold`, `Pastel Floral`, `Midnight Sangeet`, `Ivory Minimal`).
- **Reduced Motion Support**: Global `@media (prefers-reduced-motion: reduce)` automatically disables or sets all animations to 0.001ms.

---

## ⚡ 8. Performance & Efficiency

- **Initial Bundle Size**: **~51.5 KB gzip** (well below the 200 KB competition ceiling).
- **Zero Heavy Image/Video Assets**: Built 100% using inline SVGs, CSS aurora gradients, and procedural canvas particles.
- **Custom Zero-Dependency Confetti**: Custom 80-line canvas confetti engine replacing bloated external canvas libraries.
- **Session Cache & Request Debouncing**: User slider changes are debounced (450ms) with `AbortController` cancellation; past trade-off evaluations are hashed and cached in `sessionStorage` for instant replay.
- **Hardware-Aware Rendering**: Particle counts drop from 80 to 40 on low-concurrency devices (`navigator.hardwareConcurrency < 4`).

---

## 🧪 9. Testing & Quality Assurance

- **45 Automated Unit, Domain & Integration Tests** passing with 100% success.
- **Domain Coverage**: **98.01%** statement coverage on `src/domain/`.
- **API Proxy Coverage**: **81.19%** statement coverage on `api/`.
- **Property-Based Testing**: 100-iteration randomized fuzzing test verifying Hare-Niemeyer exact sum equality down to ₹0 drift.
- **End-to-End Test**: Playwright test suite (`tests/e2e/flow.spec.ts`) validating full wizard completion, dashboard exploration, slider manipulation, and export.

```bash
# Run unit & domain tests
npm test

# Run tests with coverage breakdown
npm run test:coverage

# Run Playwright E2E test
npm run test:e2e
```

---

## 🚀 10. Local Setup & Quickstart

### Prerequisites
- Node.js 18+ (tested on Node v20 & v24)
- npm 9+

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/jashn.git
cd jashn

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Run development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts
- `npm run dev`: Starts Vite local dev server.
- `npm run build`: Typechecks and bundles production assets in `dist/`.
- `npm run lint`: Runs ESLint with zero-warning threshold.
- `npm run typecheck`: Runs strict TypeScript compiler (`tsc --noEmit`).
- `npm test`: Runs Vitest test runner.
- `npm run test:coverage`: Generates v8 coverage table.
- `npm run test:e2e`: Runs Playwright happy-path end-to-end flow.

---

## 📁 11. Project Architecture & File Hierarchy

```
JASHN/
├── .github/workflows/ci.yml       # GitHub Actions CI (lint, typecheck, test, build)
├── api/                           # Vercel serverless proxy functions
│   ├── _utils.ts                  # Rate limiter, prompt injection defense, Gemini caller
│   ├── ideas.ts                   # /api/ideas endpoint
│   ├── planb.ts                   # /api/planb endpoint
│   └── tradeoff.ts                # /api/tradeoff endpoint
├── src/
│   ├── domain/                    # Pure deterministic logic (Zero React dependencies)
│   │   ├── budget.ts              # Hare-Niemeyer budget allocation engine
│   │   ├── timeline.ts            # DAG critical-path backwards timeline engine
│   │   ├── vendors.ts             # Vendor red flags, questions & metrics engine
│   │   ├── fallbacks.ts           # Deterministic cultural fallback templates
│   │   ├── constants.ts           # Domain constants (Zero magic numbers)
│   │   ├── schemas.ts             # Zod runtime schemas
│   │   └── types.ts               # Shared domain interfaces
│   ├── features/                  # Feature-driven UI modules
│   │   ├── landing/               # Hero, value props, feature pillars
│   │   ├── wizard/                # 5-step intake wizard with voice input
│   │   ├── dashboard/             # Overview tab, what-if sliders, countdown
│   │   ├── budget/                # Interactive SVG donut chart, accessible table
│   │   ├── timeline/              # Chronological milestone roadmap & risk fixes
│   │   ├── vendors/               # Negotiation checklist, progress ring
│   │   ├── ideas/                 # AI moodboard, signature feast, entertainment
│   │   ├── planb/                 # Emergency scenario recovery simulator
│   │   └── export/                # .ics calendar generator, print CSS, WhatsApp
│   ├── components/ui/             # Design system primitives
│   │   ├── AuroraBackground.tsx   # GPU-accelerated ambient aurora background
│   │   ├── Mandala.tsx            # Procedurally generated rotating SVG mandala
│   │   ├── Button.tsx             # 44px accessible luxury button
│   │   ├── GlassCard.tsx          # Glassmorphic card with subtle 3D hover
│   │   ├── Slider.tsx             # ARIA-accessible slider
│   │   ├── Tabs.tsx               # ARIA tablist with arrow key navigation
│   │   ├── ThemeSwitcher.tsx      # 4 luxury theme selector
│   │   ├── CountUp.tsx            # Animated count-up numbers
│   │   ├── TypewriterText.tsx     # Progressive AI text reveal
│   │   ├── Toast.tsx              # Toast notifications container
│   │   └── SkipLink.tsx           # Skip-to-content accessibility link
│   ├── lib/                       # Utilities & client integrations
│   │   ├── store.ts               # Zustand state store with auto-persistence
│   │   ├── storage.ts             # Versioned localStorage with Zod validation
│   │   ├── apiClient.ts           # Fetch client with hash caching & AbortController
│   │   ├── confetti.ts            # Custom tiny canvas confetti burst (no library)
│   │   └── speech.ts              # Web Speech API voice input helper
│   ├── styles/globals.css         # Design tokens, 4 themes, print CSS, reduced-motion
│   ├── App.tsx                    # Root application component
│   └── main.tsx                   # React 18 bootstrap
├── tests/                         # Test suites
│   ├── a11y/a11y.test.tsx         # Axe-core automated WCAG 2.2 AA tests
│   ├── api/api.test.ts            # Proxy, rate limiter & injection tests
│   ├── domain/                    # Budget, timeline, vendors & schema tests
│   ├── features/features.test.tsx # Wizard to dashboard integration test
│   └── e2e/flow.spec.ts           # Playwright end-to-end happy path
├── vercel.json                    # Strict CSP, security headers & deployment config
├── SECURITY.md                    # Threat model & security policy
└── package.json
```

---

## 🔮 12. Limitations & Future Roadmap

- **Multi-Currency Conversion**: Currently locked to INR (₹) with Lakhs/Crores notation; future releases will support USD ($), GBP (£), and AED (د.إ) for NRI diaspora weddings.
- **Collaborative Real-Time Editing**: Currently local-first via `localStorage`; future roadmap includes multi-user WebSocket rooms with conflict-free replicated data types (CRDTs).
- **Direct WhatsApp Bot Webhooks**: Future iteration can integrate WhatsApp Cloud API to automatically send RSVP nudges directly to guest phone numbers.

---

## 📜 License
Developed with pride for **Hack2Skill PromptWars 2026**. Licensed under the MIT License.
