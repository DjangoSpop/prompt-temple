# Prompt Temple Product Blueprint

## Vision and Positioning
- Deliver on the promise to "democratize advanced prompt engineering" by offering AI-assisted optimization that feels instant, luxurious, and low-effort.
- Serve three primary personas: busy executives who need polished outputs, "vibe coders" who experiment with creative prompts, and teams seeking repeatable prompt playbooks.
- Anchor the experience around AI-coached prompts, multimedia explainers, and productivity hooks that provide immediate value on day one.

## Core Product Pillars

### Automated Prompt Engineering Engine
- **Technique Library:** Implement MiPRO refinement, GraphRAG synthesis, Zero-Shot Chain-of-Thought, Socratic self-questioning, GEPA, and FormatSpread as modular strategies.
- **MethodologySelector:** Service that inspects prompt intent, domain, desired format, and historical performance to auto-pick (or blend) techniques. Expose a `MethodologySelector.evaluate(context)` API that returns strategy weights and configurable parameters (temperature, depth, tool usage).
- **Optimization Loop:** Each user submission flows through:
  1. Intent detection and slot tagging (domain, tone, production format).
  2. MethodologySelector selects the ordered technique pipeline.
  3. MiPRO refinement phase edits the prompt, annotates deltas, and estimates token impact.
  4. GraphRAG synthesis injects contextual knowledge via vector index plus graph edges when beneficial.
  5. Evaluation pass runs PromptEval, self-consistency checks, and Monte Carlo sampling for high-stakes prompts.
- **Telemetry:** Store optimization metadata per prompt (techniques applied, delta score, runtime) for personalization and analytics.

### Wow Effect Generators
- **Auto Podcast Summaries:** Convert optimized prompt or storyboard into narrated audio using TTS (e.g., ElevenLabs, Azure) plus background stems. Provide streaming playback via the existing SSE layer.
- **NotebookLM-style Video Overviews:** Generate storyboard, slide deck, interactive quiz items, and visuals. Render via Next.js with a client video player (Mux or WebCodecs). Offer downloadable MP4 alongside interactive transcript.
- **Wow Meter:** Score derived from PromptEval metrics, novelty heuristics (embedding cosine distance vs. library prompts), and user feedback. Surface as badge and progress bar per prompt history.

### Productivity Integrations
- **Zapier:** Publish REST hooks (`/api/v2/integrations/zapier/...`) with signed webhooks so prompts or outputs trigger downstream automations.
- **Canva:** OAuth integration to push optimized prompts or generated assets into Canva templates.
- **Otter.ai:** Pull transcripts, auto-generate prompt sets, feed back refined notes.
- **Browser Extension:** Lightweight overlay that injects MethodologySelector recommendations on ChatGPT, Claude, Gemini. Reuse existing SSE endpoint for streaming improvements.

### Accessibility and Onboarding
- Complexity tiers (Basic, Pro, Genius) toggle visible controls and diagnostic depth. Persist tier preference in user profile store.
- Inline performance checks (PromptEval plus self-consistency) surface as color-coded chips next to the Wow Meter.
- Tiered onboarding: guided tooltips, "lazy mode" checklists, and quick wins surfaced in `/learn`.

## System Architecture Overview
- **Frontend (Next.js App Router, TS, Tailwind, Zustand):**
  - Pages `/learn`, `/optimize`, `/certificate/[id]`, `/referral` share a global layout with an SSE-connected prompt coach panel.
  - Zustand store holds session prompt state, MethodologySelector decisions, Wow Meter score, and audio/video render status.
- **Edge Gateway:** Next.js server handles auth, rate limiting, and proxies SSE streams via `/api/v2/chat/completions/`.
- **Prompt Intelligence Service (Node + LangChain):**
  - Houses technique implementations, vector store (Postgres pgvector or Pinecone), and graph database (Neo4j or open-source alternative for GraphRAG edges).
  - Provides `/optimize`, `/summaries/audio`, `/summaries/video`, `/wow-meter` endpoints.
- **Media Rendering Workers:** Queue (BullMQ backed by Redis) dispatches heavy audio and video jobs to workers (FFmpeg, TTS SDK, image compositing).
- **Integration Hub:** Distinct microservice manages third-party connectors, token storage, and webhook signing.
- **Data Stores:**
  - Postgres for prompt history, optimization metadata, subscriptions.
  - Redis for session cache and Wow Meter precomputations.
  - Object storage (S3) for audio/video artifacts.
  - Vector database plus graph store for knowledge retrieval.
- **Observability:** OpenTelemetry spans around optimization pipelines, SSE response times, and media job durations.

## Automated Prompt Engineering Implementation Plan
1. **Technique Modules:** Abstract each strategy under `src/lib/prompt-techniques/<technique>.ts` exposing a shared interface with `analyze`, `refine`, and `summarize` methods.
2. **MethodologySelector Class:** Create `src/lib/prompt-engineering/MethodologySelector.ts`. Inputs include prompt metadata, user persona, and prior outcomes. Outputs weighted technique stack plus parameter overrides. Start with rule-based heuristics, evolve into trainable model.
3. **Pipeline Orchestrator:** Implement `PromptOptimizationEngine` to execute selected techniques in order, collect deltas, and emit telemetry events consumed by the UI.
4. **GraphRAG:** Maintain document graph with nodes (documents, key concepts) and edges (similarity, authorship). Use graph traversal to fetch supporting snippets and merge into optimized prompt context.
5. **Evaluation:** Integrate PromptEval via local scoring or API. Implement self-consistency by sampling multiple completions and computing agreement metrics.

## Wow Effect Pipeline
- **Audio:** Generate script from optimized prompt, pass through TTS, layer background track, return streaming URL and downloadable asset. Provide show notes plus highlight timestamps.
- **Video:** Compose slides (SVG or Canvas) and voiceover, run FFmpeg assembly, and surface interactive sections that expand to display quiz questions.
- **UI Hooks:** `SSEChatInterface` listens for `wow_meter_update` and `media_ready` events to animate badges and reveal download buttons.

## Productivity Integrations Plan
- **Zapier:** Provide trigger (new optimized prompt), action (optimize prompt), and search (fetch library prompt). Build REST schema plus CLI manifest.
- **Canva:** After OAuth, allow pushing generated imagery or prompt text into brand templates via the Canva API. Provide asset browser within `/optimize`.
- **Otter.ai:** Scheduler pulls meeting transcripts, runs MethodologySelector to build action-item prompts, surfaces outputs in the Productivity Panel.
- **Extension:** Ship as Manifest V3 extension that injects the Prompt Temple widget. Use `postMessage` and SSE to sync with the web app when logged in.

## Accessibility and Tiered Experience
- Tier toggles adjust default MethodologySelector aggressiveness and UI density.
- `Basic`: quick optimization, Wow Meter and audio summary only.
- `Pro`: adds technique breakdown, PromptEval diagnostics, integration hooks.
- `Genius`: exposes manual technique overrides, GraphRAG editing, batch automation.
- Inline checkpoints show pass or fail for PromptEval and self-consistency (with tooltip explanations).

## UI and Component Roadmap
- `/learn`: interactive curriculum, onboarding checklists, video explainers.
- `/optimize`: core workspace with Prompt Input, Critique Panel, Wow Meter, audio/video outputs, Productivity Panel.
- `/certificate/[id]`: shareable certification (export PDF) showing completed learning paths and proficiency.
- `/referral`: referral codes and social share assets.
- **Components To Build:**
  - `PromptInput` (rich text, template selector, lazy mode toggles).
  - `CritiquePanel` (technique timeline, PromptEval status, suggestions).
  - `WowMeter` (score ring and breakdown).
  - `MediaPlayer` (audio/video tabs with streaming progress).
  - `ProductivityPanel` (integrations, automation buttons, extension status).
  - `TierSwitch` (Basic/Pro/Genius toggle with tooltips).
  - `MethodologyBreakdown` (cards showing applied techniques and rationale).

## Rollout Strategy
- **Open-Source Beta (Weeks 0-6):**
  - Ship `/optimize` with MiPRO, Zero-Shot Chain-of-Thought, and Wow Meter v1.
  - Release documentation, API schema, community prompts.
  - Gather telemetry to refine MethodologySelector heuristics.
- **Freemium Launch (Weeks 6-12):**
  - Add audio summaries, PromptEval diagnostics, limited integration triggers.
  - Implement auth, billing (Stripe), and referral program.
- **Pro Subscription (Weeks 12-20):**
  - Unlock full technique library, GraphRAG, Canva/Otter integrations.
  - Introduce team workspaces, shared libraries, certification paths.
- **Enterprise B2B (Weeks 20+):**
  - Offer SOC2 guardrails, SSO (SAML/OIDC), role-based access, private vector stores.
  - Provide admin analytics, usage quotas, custom onboarding.

## Analytics and Monetization
- Track conversion funnel (prompt optimized -> Wow Meter > 80 -> audio/video consumed -> integration configured).
- Pricing ladder: Free (Basic tier, limited monthly optimizations), Pro (all tiers and automation), Enterprise (SLA plus dedicated integrations).
- Implement credit consumption using the existing billing service, aligned with optimization cost and media render minutes.

## DevOps and QA Considerations
- CI gates: type-check, lint, vitest, Lighthouse budgets (accessibility >= 90).
- Add contract tests for SSE event schema to avoid regressions.
- Use feature flags (`env.ts`) to roll out new techniques incrementally.

## Immediate Next Steps
1. Scaffold `src/lib/prompt-engineering` with MethodologySelector, technique interfaces, and placeholder strategies.
2. Extend the SSE pipeline to emit telemetry events (`wow_meter_update`, `optimization_summary`).
3. Design `/optimize` page wireframes (Figma) and translate into Next.js components.
4. Stand up vector and graph stores in development (Docker compose services) and seed with sample corpora.
5. Package developer onboarding guide explaining open-source beta contribution workflow.
