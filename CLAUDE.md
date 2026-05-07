1. THE WHY (Purpose)
GX-Boardroom is an Active Financial Resilience Engine for GXBank. Its goal is to transform banking from a passive record-keeper into an agentic "Board of Advisors" that predicts and prevents "Invisible Erosion" (micro-debt) for Malaysian youth.

2. THE WHAT (Project Structure & Tech Stack)
This is a monorepo consisting of a Flutter mobile client and a FastAPI agent orchestrator.
Codebase Map
- apps/mobile/: Flutter (Dart) mobile application.
  - lib/state/: State-driven UI logic (Riverpod).
  - lib/widgets/: Modular, context-aware HUD components.
- services/orchestrator/: FastAPI (Python) Multi-Agent System.
  - agents/: Individual agent logic (Income Scout, Sentinel, etc.).
  - core/: Manager/Orchestrator and MAS routing logic.
- docs/agents/: Authoritative Agent Specs (Read these for logic implementations).

Tech Stack
Frontend: Flutter + Riverpod.
Backend: FastAPI + Redis (for real-time $S_2S$ caching).
AI: Gemini API (Zero-Data Retention).

3. THE HOW (Workflow & Verification)
Claude should use these commands to verify changes:
- Mobile: cd apps/mobile && flutter test
- Backend: cd services/orchestrator && pytest
- Linting: cd apps/mobile && flutter analyze (Do not manually fix style; use flutter format .)
- Type Check: mypy services/orchestrator

4. PROGRESSIVE DISCLOSURE (Reference Docs)
To avoid instruction bloat, Claude must read the following files before working on specific modules:
- MAS Logic: See docs/agents/orchestration.md for Manager/Routing logic.
- Safety Protocols: See docs/agents/shield_specialist.md for Scam Speed-Bump & Risk Score formulas.
- Math & Velocity: See docs/agents/sentinel_logic.md for Safe-to-Spend (S_2S) calculations.
- UI/UX: See docs/ui/mascot_states.md for Mascot sentimental/emotional triggers.

Agent Logic Summary
- Sentinel: Manages Outflow/Velocity.
- Scout: Manages Inflow/Windfalls.
- Saver: Manages Pockets/Opportunity Cost.
- Shield: Manages Risk/Insurance/Anti-Fraud.
- Mascot: The Sentimental LLM interface.
Final Note to Claude: When performing research, prioritize reading the files in docs/agents/ before suggesting architectural changes. Use existing formatting tools; do not provide style feedback.