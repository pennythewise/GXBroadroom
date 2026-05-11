# GX Boardroom

> **Agentic financial co-pilot for GXBank.**
> Transforms a passive ledger into a proactive Board of Advisors — deployed directly inside the app for every Malaysian youth who was never given a seat at the table.

---

## The Problem

Malaysia's youth financial crisis is not a knowledge problem. It is an **environment problem**.

Three forces are working against young Malaysians simultaneously:

**1. Scammers exploit human psychology, not technology.**
95% of online fraud in Malaysia involves authorised transactions — the victim sends the money themselves. Scammers engineer panic, excitement, and anxiety to bypass rational thinking. No firewall stops a person who believes they are doing the right thing.

**2. The commercial environment is designed to accelerate spending.**
Frictionless checkout removes the pain of paying. BNPL normalises debt for non-essentials. Social media turns peer pressure into purchase pressure. 37% of Gen Z overspend at checkout without realising it. The system is ruthlessly optimised to drain wallets — while financial tools remain entirely passive.

**3. Savings pockets are treated like fixed deposits.**
Interest is earned daily but the pocket sits silent. Users add money without being reminded of their goals. Goals are set once and forgotten. The pocket never speaks first.

Meanwhile, personalised financial advisory in Malaysia requires **RM250,000 in investable assets** just to get through the door (Maybank Premier, CIMB Preferred). The system locks out the people who need it most.

**GX Boardroom is the fix.**

---

## What It Is

GX Boardroom is a **multi-agent AI system** embedded inside GXBank. It runs five specialised agents in a hub-and-spoke architecture. Each agent monitors a slice of the user's financial life and intervenes at the exact moment it matters — not in a monthly statement, not in a chatbot, but at the **point of action**.

> Discoverable via: **Discover tab → AI → GX Boardroom** (subscription feature, RM4.90/mo)

---

## Agent Architecture

| Agent | Name | Trigger | Core Function |
|---|---|---|---|
| Agent-0 | **Manager** | Always-on | Orchestrates all agents. Synthesises outputs into Mascot dialogue. |
| Agent-1 | **Scout** | Inflow detected | Detects windfalls, reimbursements, salary. Prompts smart allocation. |
| Agent-2 | **Sentinel** | Spend event | Calculates Safe-to-Spend (S₂S). Flags velocity spikes. |
| Agent-3 | **Architect** | Add money / goal check | Reminds user of active goals. Calculates ETA impact. |
| Agent-4 | **Shield** | Send money | Calculates Risk Score (Rₛ). Intercepts suspicious transfers. |

**ResilienceState** — a single stateful object maintained per user, updated on every agent event:

```json
{
  "s2s_daily": 71,
  "burn_velocity": 1.4,
  "goals": [
    { "name": "Okinawa", "target": 3200, "saved": 1344, "eta": "2026-06-30" }
  ],
  "shields_active": ["travel", "cyber_fraud"],
  "resilience_score": 78,
  "windfall_pending": 320
}
```

---

## Features

### 1. Boardroom Report (Monthly)

Triggered by cron job (monthly) or user tap from the Home banner.
A structured **4-page report** synthesised by Agent-0:

| Page | Name | What it delivers |
|---|---|---|
| 1 | **Executive Synthesis** | Mascot reads the mood of the month in plain language. No jargon. |
| 2 | **Agent Insights** | Each agent surfaces one golden insight. Tap to drill into full analysis. |
| 3 | **Action Plan** | One-tap approve buttons. Declarative banking — no forms, no chatting. |
| 4 | **Emotional Impact** | Resilience score ring. Forward-looking projections. Future-self framing. |

> Demo shortcut: `DEV_TRIGGER=true` bypasses the 30-day cron for demo builds.

---

### 2. On-Demand Board Convention

User-initiated session. Triggered anytime from the Boardroom screen.

**Flow:**
```
Convene screen
  → user selects a context chip (multi-select) and optionally edits the auto-filled brief

Processing screen
  → 4 agent rings animate concurrently with staggered starts
  → synthesis bar fills as each agent completes

Focused report
  → Mascot brief tailored to the declared context
  → 2 targeted approve actions, no page stepper
```

**Context chips → auto-fill prompts:**

| Chip | Context Key | Auto-filled Brief |
|---|---|---|
| I just received money | `windfall` | "I just received RM320 in reimbursements. What should I do with it?" |
| I have a new goal | `goal` | "I want to start saving for a new laptop — RM2,500 target." |
| Planning a big purchase | `buy` | "Thinking about booking a hotel for the long weekend. Is now a good time?" |
| Feeling financially stressed | `stress` | "I've been overspending and I'm worried about next month." |
| My income just changed | `job` | "My internship allowance increased. How should I adjust my plan?" |
| Just want a check-in | `check` | "Just want a quick overview of where I stand financially." |

4 agents run its analysis and action plan with the new context.
Auto-navigates to focused report 800ms after all agents complete. No button tap required.

---

### 3. Send Money — Shield Interception

**Trigger:** Agent-4 calculates Rₛ > 0.8

Risk score inputs:
- First-time DuitNow recipient
- Transfer amount significantly above recent average
- Unusual time of day
- MCC mismatch or P2P to unknown payee

**Interception flow:**
```
Review transfer screen
  └─→ [Shield activates]
        └─→ Full-screen Breathing UI (CSS pulse rings, reduces panic response)
              └─→ Context Quiz (3 options, user must select before proceeding)
                    └─→ [Hold it safely] → 24hr Holding Pocket (earns 3.55% p.a.)
                          └─→ Holding confirmation (countdown timer, Cancel transfer visible)
                    └─→ [Cancel] → Transfer cancelled, Shield logs the attempt
```

> **Behavioural rationale:** Scammers engineer the panic moment. The "speed bump" floating UI is not decoration — it is a deliberate **pattern interrupt** to return the user to rational decision-making before any money moves. The holding pocket removes urgency without blocking the transfer permanently.

**Holding Pocket states:**

| State | Meaning |
|---|---|
| `HELD` | Money locked, earning interest, cancel available |
| `RELEASED` | 24hrs elapsed, transfer executes |
| `CANCELLED` | User cancelled, money returns instantly to main account |

---

### 4. Spend Money — Sentinel Interrupt

**Trigger:** Agent-2 detects a spend event exceeding 1.5× S₂S

Floating bottom sheet overlays the transaction review screen (dims background):

```
┌─────────────────────────────────────┐
│ ⚠ Burn Rate Sentinel                │
│ You've spent 2.1× your weekly pace. │
│ RM89 left by Wednesday.             │
│ [Reduce to RM150]  [Proceed anyway] │
└─────────────────────────────────────┘
```

**Additional trigger — week-ahead projection:**
If current velocity projects the user to run dry before their next income event, Sentinel prompts them to lock a portion of their current balance as a protected reserve for the following week. This is not a block — it is a choice surfaced at the moment of highest relevance.

> **Behavioural rationale:** Pattern interruption at point-of-spend. The user is not lectured — they are shown a concrete consequence (RM89 by Wednesday) and offered a smarter action (Reduce to RM150). Autonomy preserved. Awareness raised.

---

### 5. Add Money — Goal Architect Prompt

**Trigger:** Agent-3 detects an inflow event (top-up, salary, reimbursement)

Floating bottom sheet appears after add money confirmation:

```
┌─────────────────────────────────────────┐
│ 🏁 Goal Architect                       │
│ You're 63% toward Okinawa Trip ✈        │
│ Add RM200 here = ETA moves 8 days closer│
│ ████████░░░░ Jun 30 → Jun 22            │
│ [Add to Pocket]  [Skip]                 │
└─────────────────────────────────────────┘
```

> **Behavioural rationale:** Timing is everything. Prompting at add-money captures the **peak moment of financial agency**. The goal ETA shift (e.g. Jun 30 → Jun 22) makes the abstract benefit concrete and immediate. Users forget goals exist between sessions — Architect surfaces them at exactly the right moment.

---

## Behavioural Economics Layer

Every interception is designed around three psychological triggers:

| Trigger | Agent | Mechanism |
|---|---|---|
| Panic / urgency | **Shield** | Breathing UI slows arousal; holding pocket removes time pressure |
| Impulse / FOMO | **Sentinel** | Pattern interrupt with concrete consequence (days, not RM) |
| Inertia / forgetting | **Architect** | Goal reminder at peak positive moment (money just arrived) |

> The system does not block. It does not lecture. It creates a moment of sobriety and offers a smarter path — then lets the user decide.

---

## Screen Map

```
App
├── Home
│   └── Boardroom banner (report ready / floating)
├── Discover
│   └── GX Boardroom card (subscription entry)
├── Boardroom
│   ├── Monthly report (4 pages)
│   │   ├── Page 1: Executive Synthesis
│   │   ├── Page 2: Agent Insights (2×2 grid → drill-down)
│   │   │   ├── Sentinel detail
│   │   │   ├── Scout detail
│   │   │   ├── Architect detail
│   │   │   └── Shield detail
│   │   ├── Page 3: Action Plan (approve buttons)
│   │   └── Page 4: Emotional Impact (resilience ring)
│   └── On-Demand Session
│       ├── Convene screen (chips + text input)
│       ├── Processing screen (4 agent rings)
│       └── Focused report (mascot brief + actions)
├── Send Money flow
│   └── [Shield] Full-screen breathing UI → Context Quiz → Holding Pocket
├── Spend Money flow
│   └── [Sentinel] Floating sheet → reduce / proceed
└── Add Money flow
    └── [Architect] Floating sheet → add to pocket / skip
```

---

## Tech Stack

| Layer | Choice |
|---|---|
| **Mobile** | React Native (Expo) + TypeScript |
| **State** | Zustand (ResilienceState store) |
| **Navigation** | Expo Router (file-based) |
| **Animations** | Animated API (ring fills, breathing UI) |
| **Backend (PoC)** | FastAPI — mock data only |
| **Styling** | StyleSheet.create() — no external UI libs |

---

## Project Structure

```
src/
├── app/
│   ├── (tabs)/
│   │   ├── home.tsx
│   │   └── discover.tsx
│   └── boardroom/
│       ├── report.tsx            # 4-page monthly report
│       ├── convene.tsx           # On-demand: chip selector
│       ├── processing.tsx        # On-demand: agent rings
│       ├── focused-report.tsx    # On-demand: tailored output
│       └── agent/
│           ├── sentinel.tsx
│           ├── scout.tsx
│           ├── architect.tsx
│           └── shield.tsx
├── agents/                       # Pure functions, no UI
│   ├── sentinel.ts               # S₂S + velocity engine
│   ├── scout.ts                  # Windfall detection
│   ├── architect.ts              # Goal ETA recalculation
│   └── shield.ts                 # Risk score (Rₛ)
├── components/
│   ├── boardroom/
│   │   ├── AgentBox.tsx
│   │   ├── ApprovableAction.tsx
│   │   ├── MascotCard.tsx
│   │   └── ResilienceRing.tsx
│   └── transfer/
│       ├── BreathingUI.tsx
│       ├── ContextQuiz.tsx
│       ├── HoldingPocket.tsx
│       ├── SentinelSheet.tsx
│       └── ArchitectSheet.tsx
├── store/
│   └── resilience.ts             # Zustand ResilienceState
├── mock/
│   └── data.ts                   # PoC data
└── constants/
    └── theme.ts                  # Design tokens
```

---

## Design Tokens

All colours imported from `constants/theme.ts`. 

```ts
export const theme = {
  bg:       '#0E0B1E',
  card:     '#1a1630',
  accent:   '#7C3AED',
  accentLt: '#A78BFA',
  accentDm: '#2d1f5e',
  green:    '#1D9E75',
  greenLt:  '#5DCAA5',
  red:      '#E24B4A',
  redLt:    '#F09595',
  amber:    '#EF9F27',
  white:    '#FFFFFF',
  grey:     '#888888',
  greyLt:   '#bbbbbb',
  border:   '#2a2050',
}
```

---

## Mock Data (as for PoC stage)

```json
{
  "user": "Farah",
  "month": "May 2026",
  "income": { "internship": 2120, "windfall": 320, "brand_deals": 400, "total": 2840 },
  "spend": {
    "total": 2210,
    "categories": { "food_drink": 680, "transport": 420, "shopping": 360, "utilities": 290, "others": 460 }
  },
  "s2s_daily": 71,
  "burn_velocity": 1.4,
  "goal": { "name": "Okinawa", "target": 3200, "saved": 1344, "eta_original": "2026-06-22", "eta_current": "2026-06-30" },
  "resilience_score": 78,
  "resilience_delta": 5,
  "shields_active": ["travel", "cyber_fraud"],
  "location_multiplier": { "Kepong": 0.7, "KLCC": 1.4 }
}
```

High-risk transfer mock (Shield demo):

```json
{ "merchant": "Unknown", "amount": 2800, "duitnow_id": "NEW_RECIPIENT", "mcc": "P2P", "rs": 0.91 }
```

> Demo mode: Set `DEV_TRIGGER=true` in `.env` to expose a manual **"Trigger Board Meeting"** button that bypasses the 30-day cron.

---

## Sprint Order

| Sprint | Deliverable |
|---|---|
| **1** | ResilienceState Zustand store + S₂S velocity engine (Agent-2) |
| **2** | Goal Architect interrupt flow (Agent-3) + Sentinel floating sheet (Agent-2 UI) |
| **3** | Boardroom Report 4-page UI + Mascot dialogue engine (Agent-0 + Agent-5) |
| **4** | On-demand Convention flow (convene → processing → focused report) |
| **5** | Shield Agent full-screen breathing UI + holding pocket (Agent-4) |

---

## Commands

```bash
npm run start        # Expo dev server
npm run type-check   # tsc --noEmit
npm run lint         # ESLint
```

---

## References

| Stat | Source |
|---|---|
| 61% cannot raise RM1,000 emergency cash | BNM, 2024 |
| 60% of bankruptcies are young adults | Unimas Review of Accounting and Finance, 2024 |
| RM1.9B debt carried by 53,000 youths under 30 | New Straits Times, 2024 |
| RM2.8B lost to scams in 2025 | Fintech News Malaysia, 2026 |
| 95% of online fraud are authorised transactions | Fintech News Malaysia, 2026 |
| 37% of Gen Z overspend at checkout | Opinium, 2024 |
| RM250,000 investable assets for Maybank Premier advisory | Maybank Premier, 2024 |
