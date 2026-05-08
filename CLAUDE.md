# CLAUDE.md — GX Boardroom

## Stack
- React Native (Expo) + TypeScript
- State: Zustand (ResilienceState store)
- Navigation: Expo Router (file-based)
- Backend: FastAPI (Python) — mock only for PoC
- Styling: StyleSheet only, no external UI libs

## Project Structure
src/
├── app/                  # Expo Router screens
│   ├── (tabs)/
│   │   ├── home.tsx
│   │   └── discover.tsx
│   └── boardroom/
│       ├── report.tsx    # 4-page stepper
│       └── agent/
│           ├── sentinel.tsx
│           ├── scout.tsx
│           ├── architect.tsx
│           └── shield.tsx
├── agents/               # agent logic (pure functions, no UI)
│   ├── sentinel.ts
│   ├── scout.ts
│   ├── architect.ts
│   └── shield.ts
├── store/
│   └── resilience.ts     # Zustand ResilienceState
├── components/
│   ├── boardroom/        # report cards, mascot, action buttons
│   └── transfer/         # floating sheets, breathing UI
├── mock/
│   └── data.ts           # all hardcoded demo data here
└── constants/
    └── theme.ts          # design tokens (colours, radius, spacing)

## Design Tokens (always import from constants/theme.ts, never hardcode)
bg, card, accent, accentLt, tabbar, green, red, amber — all defined there

## Conventions
- Agent logic lives in src/agents/ as pure functions that return typed payloads
- UI never calls agents directly — goes through ResilienceState store actions
- All mock data lives in src/mock/data.ts — import from there, never inline
- Components are named by feature: BoardroomBanner, AgentBox, BreathingUI
- No inline styles — StyleSheet.create() only

## Commands
npm run start          # Expo dev server
npm run type-check     # tsc --noEmit
npm run lint           # eslint

## Demo Mode
- Mock trigger button available in __DEV__ builds only
- All Rs scores, S₂S, velocity pulled from mock/data.ts
- Location multiplier: Kepong=0.7, KLCC=1.4 (hardcoded dict)

## Current Sprint
Sprint 1 — ResilienceState store + S₂S velocity engine
See GX-Boardroom-PRD.md for full spec.