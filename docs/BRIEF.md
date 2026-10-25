# Hack2Skill PromptWars • Challenge 5: Celebration & Event Planner

## Challenge Brief & Specifications
- **Objective**: Build a GenAI-powered planning assistant that helps users organize events with budgets, timelines, vendor checklists, and personalized ideas.
- **Vertical Chosen**: Indian Weddings & Celebrations.
- **Target Persona**: "A busy family member planning a multi-function Indian wedding on a fixed budget who needs clarity, not chaos."
- **Core Principle (Hybrid Architecture)**: The AI NEVER performs arithmetic, percentages, or scheduling calculations. Pure, deterministic TypeScript engines compute budget distributions and timeline critical paths. The LLM exclusively personalizes ideas, themes, vendor questions, and Plan B recovery scripts. All LLM outputs are validated against Zod schemas, with deterministic fallback templates on failure or missing API key.

## Parameters for AI Evaluation
1. **Code Quality**: Strict TypeScript, modular design, clean architecture, zero ESLint warnings.
2. **Security**: Serverless proxy, zero client-side secrets, prompt injection defense, rate limiting, zero `dangerouslySetInnerHTML`, strict CSP.
3. **Efficiency**: Initial bundle under 200 KB gzip, zero heavy media, request debouncing, session cache, hardware-aware rendering.
4. **Testing**: 80%+ coverage on domain and API, property-based sum tests, Playwright E2E test.
5. **Accessibility**: WCAG 2.2 AA compliant, 0 axe-core violations, full keyboard navigation, high contrast themes, reduced-motion safe.
6. **Problem Statement Alignment**: Persona-driven feature set, multi-day Indian functions, what-if sliders, Plan B crisis engine.
