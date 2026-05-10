# GX-Boardroom PRD
> Agentic financial co-pilot feature inside GXBank (Malaysian neobank). Discoverable via Discover tab → subscription card. React Native. Dark theme.

---

## Design System
```
bg:        #0E0B1E
card:      #1a1630
accent:    #7C3AED
accent-lt: #A78BFA
tabbar:    #0a0818
green:     #1D9E75 / #5DCAA5
red:       #E24B4A / #F09595
amber:     #BA7517 / #EF9F27
text:      #fff / #aaa / #666
radius:    12px cards, 8px buttons, 10px small cards
```

---

## Agent System (Hub-and-Spoke)

| ID | Name | Role | Key Output |
|----|------|------|------------|
| Agent-0 | Manager | Orchestrator | Routes payloads; synthesises Mascot dialogue |
| Agent-1 | Scout | Income/inflows | Detects windfalls (reimbursements, PTPTN); triggers allocation |
| Agent-2 | Sentinel | Transaction stream | Calculates S₂S (Safe-to-Spend); flags velocity spikes (V) |
| Agent-3 | Architect | Pockets/goals | Recalculates goal ETAs; computes opportunity cost |
| Agent-4 | Shield | Outflow metadata | Calculates Risk Score (Rs); triggers insurance/scam flows |
| Agent-5 | Mascot | UI synthesis | Converts agent outputs → sentimental narrative copy |

**ResilienceState object** (persist per user):
```json
{
  "s2s_daily": 71,
  "burn_velocity": 1.4,
  "goals": [{ "name": "Okinawa", "target": 3200, "saved": 1344, "eta": "2026-06-30" }],
  "shields": ["travel", "cyber_fraud"],
  "resilience_score": 78,
  "windfall_pending": 320
}
```

---

## Screens & Components

### 1. Discover Tab — Entry Point
- Add "AI" section between Spend and Save
- **Boardroom card**: dark purple `#2d1f5e` bg, `#5B21B6` border, "NEW" badge, `RM4.90/mo`
- Tap → subscription onboarding → unlocks all Boardroom features

---

### 2. Home — Floating Banner
Shown when monthly report is ready.
```
┌─────────────────────────────────────────┐
│ ● [pulse]  Your Board is ready          │
│            May report · 3 decisions     │  [View →]
└─────────────────────────────────────────┘
```
- Left accent border `#7C3AED`, pulsing dot animation
- Tap → Boardroom Report (4-page flow)

---

### 3. Boardroom Report (4 pages, stepper dots in header)

#### Page 1 — Executive Synthesis
- Header: "Board report · May" + 4 stepper dots
- **Mascot message card**: avatar (robot icon, purple circle) + narrative copy
  - Copy: *"Hey [name]! This month was a tug-of-war. The Scout found an extra RM400 from your internship, but the Sentinel noticed a heavy spending streak in Kepong. We're still on track for Okinawa, but we've had to tighten the guardrails for Week 4."*
- **Mood bar**: coloured segments (green = income win, purple = recovery, red = overspend, purple = guard)
- **4 stat cards** (2×2 grid): Total Income · Total Spend · Net Saved · Resilience Score
- CTA: "View agent insights →" → Page 2

#### Page 2 — Agent Insights
- 2×2 grid of tappable agent boxes
- Each box: icon · agent name · status pill · one-line insight

| Agent | Status pill | Insight |
|-------|------------|---------|
| Sentinel | ⚠️ Warning (red) | Burn rate 1.4× S₂S. Kepong spike. |
| Scout | ✅ Opportunity (green) | Windfall RM320 found. |
| Architect | 🕒 Delay (amber) | Okinawa ETA +8 days. |
| Shield | 🛡️ Protected (purple) | Travel Shield unlocked. Car risk rising. |

**Tap → Agent Detail page (back button returns to grid)**

#### Page 2a — Sentinel Detail
- Burn velocity V = 1.4×, S₂S RM71/day, actual RM99/day
- Total spend: RM2,210 (+RM410 over budget)
- Category breakdown (horizontal bars): Food/drink · Transport · Shopping · Utilities · Others
- Weekly bar chart: W1(green) W2(amber) W3(red) W4(dashed purple = guardrail active)
- Guardrail copy: "Week 4 cap: RM55/day"

#### Page 2b — Scout Detail
- Total income: RM2,840 (+16.4% vs last month)
- Stat cards: Internship RM2,120 · Windfall RM320 · Brand deals RM400
- Income pie breakdown %
- Recommendation callout (green left-border): allocate RM320 to Emergency Pocket

#### Page 2c — Architect Detail
- Goal card: Okinawa RM3,200 target, 42% progress bar, RM1,344 saved
- ETA delta: Jun 22 (original) → Jun 30 (current), shown as arrow
- Delay table: overspend +RM410 · days delayed 8 · daily rate needed RM5 · current rate RM3.20
- Recommendation callout (amber left-border): lock RM5/day auto-transfer × 14 days

#### Page 2d — Shield Detail
- Resilience buffer: RM65
- Shield list:
  - Auto-Travel Shield → Active (green)
  - Cyber Fraud Protect → Active (green)
  - Car-Resilience Shield → Recommended (amber) ← petrol +38%
- Recommendation callout (amber): "Petrol transactions +38%. Car shield from RM2.90/mo."

#### Page 3 — Action Plan
- Header: "One-tap decisions"
- **Section A — Allocation Directives**
  - [Approve] Move RM320 windfall → Emergency Pocket (Scout)
  - [Approve] Lock RM5/day → Okinawa for 14 days (Architect)
- **Section B — Protective Shields**
  - [Approve] Activate Car-Resilience Shield (Sentinel)
  - [Approve] Set Parent Allowance as recurring priority RM300/mo
- Approve button: purple → turns green "Done ✓" on tap
- When all 4 approved: show success card "Board decisions committed"

#### Page 4 — Emotional Impact
- Resilience score ring SVG: 78/100, +5 from last month
- Headline: "You are more resilient than last month."
- Projection rows (icon · label · subtext · value):
  - Okinawa readiness → 42% (Dec 2026 buffer)
  - Protection coverage → 2 active shields
  - Income trajectory → +16% → RM3,200/mo by Aug
  - Burn risk Week 4 → Guarded
- "Next board meeting: 1 Jun 2026" card
- "Back to summary" link

---

### 4. Transfer Interception Flows

#### 4a — Shield Agent (High-risk transfer)
Trigger: `Rs > 0.8` (new DuitNow recipient + large amount)

Full-screen takeover after "Review your transfer":
- Dark bg `#070514`
- **Breathing UI**: 3 concentric pulsing rings (CSS keyframes) centred, shield icon core
- Amount + recipient shown above rings
- **Context Quiz** (3 options, select one before proceeding):
  - "Paying rent / bills" / "Repaying a friend" / "I was asked to transfer this"
- Copy: "Take a breath. You're protected."
- Subtext: first-time large transfer → 24hr holding pocket earning interest
- CTAs: `[Hold it safely (24hr)]` (purple) · `[Cancel]` (dark)
- On "Hold": money goes to locked vault, show countdown card with cancel option

#### 4b — Goal Architect (Goal at risk)
Trigger: transaction pushes goal ETA back

Floating bottom sheet (dims transfer review screen behind it):
```
┌──────────────────────────────┐
│ [Goal Architect]             │
│ Spending RM200 = +10 days    │
│ until Okinawa Trip ✈         │
│ 63% there · ETA Jun 28→Jul 8 │
│ ████████░░░░ progress bar    │
│ [Ignore] [Save to Pocket] [Proceed] │
└──────────────────────────────┘
```
- "Save to Pocket" → deposits to goal pocket, cancels transfer
- "Proceed" → transfer goes through

#### 4c — Burn-Rate Sentinel (Cash flow risk)
Trigger: weekly spend > 1.5× S₂S

Floating bottom sheet (red-tinted `#1a0e10`, `#3d1a1e` border):
```
┌──────────────────────────────┐
│ [⚠ Burn Rate Sentinel]       │
│ You've spent 2.1× your       │
│ weekly pace this week.       │
│ RM89 left by Wednesday.      │
│ [Reduce to RM150] [Proceed anyway] │
└──────────────────────────────┘
```

---

## Mock Data (PoC/Demo)

```json
{
  "user": "Penny",
  "month": "May 2026",
  "income": {
    "internship": 2120,
    "windfall": 320,
    "brand_deals": 400,
    "total": 2840
  },
  "spend": {
    "total": 2210,
    "categories": {
      "food_drink": 680,
      "transport": 420,
      "shopping": 360,
      "utilities": 290,
      "others": 460
    }
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

Mock transaction for scam flow:
```json
{ "merchant": "Unknown", "amount": 2800, "duitnow_id": "NEW_RECIPIENT", "mcc": "P2P", "rs": 0.91 }
```

Demo shortcut: hardcode a "Trigger Board Meeting" button on dev builds to skip 30-day cron.

---

## On-Demand Board Session (User-Triggered)

Accessible anytime via the Boardroom card in Discover tab.
Separate from the monthly cron report — user-initiated, context-focused.

### Screen 1 — Convene prompt

Header: "Convene your board"
Subtext: "Tell your board what's on your mind. They'll analyse your finances through that lens and return a focused report."

**Quick context chips** (multi-select, at least one required to unlock CTA):

| Chip label | Context key |
|---|---|
| I just received money | `windfall` |
| I have a new goal | `goal` |
| Planning a big purchase | `buy` |
| Feeling financially stressed | `stress` |
| My income just changed | `job` |
| Just want a check-in | `check` |

- Tapping a chip auto-fills the detail text field with a contextual prompt string
- Free-text field below chips: optional, user can edit or ignore
- CTA "Convene board" disabled until ≥1 chip selected
- On tap → Screen 2

**Auto-fill strings per chip:**
```json
{
  "windfall": "I just received RM320 in reimbursements. What should I do with it?",
  "goal": "I want to start saving for a new laptop — RM2,500 target.",
  "buy": "Thinking about booking a hotel for the long weekend. Is now a good time?",
  "stress": "I've been overspending and I'm worried about next month.",
  "job": "My internship allowance increased. How should I adjust my plan?",
  "check": "Just want a quick overview of where I stand financially."
}
```

### Screen 2 — Agent processing

Header: "Board in session"

4 agent ring cards in a 2×2 grid. Each card:
- Circular SVG progress ring (fills 0→100%)
- Agent name + live status label (cycles through states as ring fills)
- Rings run concurrently with staggered starts (~300ms apart)

| Agent | Ring colour | Status label sequence |
|---|---|---|
| Sentinel | `#F09595` | Warming up → Scanning transactions → Calculating S₂S → Done |
| Scout | `#5DCAA5` | Warming up → Scanning inflows → Detecting windfall → Done |
| Architect | `#EF9F27` | Warming up → Loading goals → Modelling allocation → Done |
| Shield | `#A78BFA` | Warming up → Reviewing outflows → Assessing shields → Done |

Below grid: Mascot synthesis progress bar
- Increments as each agent completes (25% per agent)
- Status text: "X of 4 agents complete" → "Synthesising your brief..."
- Auto-advances to Screen 3 ~800ms after all 4 done

### Screen 3 — Focused report

No page stepper. Shorter than monthly report.

**Mascot brief** (top card, purple left border):
- Agent-0 constructs message using selected chip as prompt modifier
- Example for `windfall` chip: "Penny, your board pulled together a focused brief on your windfall. Here's what they found and what they recommend."

**4 agent insight cards** (2×2 grid):
- Same card format as monthly report Page 2
- Content scoped to the user's declared context, not a full monthly sweep

**Board recommendation** (bottom):
- 2 targeted approve actions based on context
- Same one-tap approve pattern as monthly Action Plan (purple → green "Done")
- No full 4-page report structure — this is a brief, not a board meeting
---

## Sprint Order

1. **Sprint 1** — ResilienceState + S₂S Velocity Engine (Agent-2)
2. **Sprint 2** — Goal Architect interruption flow (Agent-3) + floating sheet UI
3. **Sprint 3** — Boardroom Report 4-page UI + Mascot dialogue engine
4. **Sprint 4** — Shield Agent (Agent-4) + breathing UI + scam speed-bump
