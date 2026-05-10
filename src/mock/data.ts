// All hardcoded demo/PoC data lives here. Never inline in components.

export const MOCK_USER = {
  name: 'Farah',
  month: 'May 2026',
  monthShort: 'May',
  year: 2026,
};

export const MOCK_INCOME = {
  internship: 2120,
  windfall: 320,
  brand_deals: 400,
  total: 2840,
  prev_month_total: 2440,
  growth_pct: 16.4,
};

export const MOCK_SPEND = {
  total: 2210,
  budget: 1800,
  over_budget: 410,
  categories: {
    food_drink: 680,
    transport: 420,
    shopping: 360,
    utilities: 290,
    others: 460,
  },
  weekly: [
    { week: 'W1', amount: 420, status: 'green' as const },
    { week: 'W2', amount: 510, status: 'amber' as const },
    { week: 'W3', amount: 720, status: 'red' as const },
    { week: 'W4', amount: 560, status: 'guardrail' as const },
  ],
};

export const MOCK_S2S = {
  daily: 71,         // Safe-to-Spend per day (RM)
  actual_daily: 99,  // what she's actually spending per day
  burn_velocity: 1.4,
  week4_cap: 55,     // guardrail daily cap
};

export const MOCK_GOAL = {
  name: 'Okinawa',
  emoji: '✈️',
  target: 3200,
  saved: 1344,
  progress_pct: 42,
  eta_original: '2026-06-22',
  eta_current: '2026-06-30',
  days_delayed: 8,
  daily_rate_needed: 5,
  daily_rate_current: 3.2,
};

export const MOCK_RESILIENCE = {
  score: 78,
  prev_score: 73,
  delta: 5,
  buffer_rm: 65,
  next_board_date: '2026-06-01',
};

export const MOCK_SHIELDS = {
  active: ['travel', 'cyber_fraud'] as string[],
  recommended: ['car_resilience'],
  catalog: {
    travel: { label: 'Auto-Travel Shield', price_mo: 0, status: 'active' as const },
    cyber_fraud: { label: 'Cyber Fraud Protect', price_mo: 0, status: 'active' as const },
    car_resilience: {
      label: 'Car-Resilience Shield',
      price_mo: 2.9,
      status: 'recommended' as const,
      trigger_reason: 'Petrol transactions +38%',
    },
  },
};

export const MOCK_WINDFALL = {
  amount: 320,
  source: 'internship',
  recommended_pocket: 'emergency',
};

// Location spend multipliers for velocity adjustment
export const LOCATION_MULTIPLIER: Record<string, number> = {
  Kepong: 0.7,
  KLCC: 1.4,
};

// Mock high-risk transaction for scam speed-bump flow (Sprint 4)
export const MOCK_SCAM_TX = {
  merchant: 'Unknown',
  amount: 2800,
  duitnow_id: 'NEW_RECIPIENT',
  mcc: 'P2P',
  rs: 0.91,
};

// Mock transaction that triggers Goal Architect sheet (Sprint 2)
export const MOCK_GOAL_TX = {
  amount: 200,
  merchant: 'Shopee',
  goal_impact_days: 10,
  eta_before: '2026-06-28',
  eta_after: '2026-07-08',
  progress_pct: 63,
};

// Mascot narrative for Page 1 of Boardroom Report (Sprint 3)
export const MOCK_POCKETS = {
  totalBalance: 5250,
  items: [
    { id: 'holding', name: 'Holding Pocket', balance: 5000, type: 'holding' },
    { id: 'invest',  name: 'Invest',         balance: 250,  type: 'invest'  },
    { id: 'holiday', name: 'Holiday',         balance: 0,    type: 'holiday' },
  ],
};

export const MOCK_MASCOT_COPY =
  `Hey ${MOCK_USER.name}! This month was a tug-of-war. The Scout found an extra RM400 from your internship, ` +
  `but the Sentinel noticed a heavy spending streak in Kepong. We're still on track for ${MOCK_GOAL.name}, ` +
  `but we've had to tighten the guardrails for Week 4.`;

export const MOCK_FOCUSED_BRIEF = {
  mascotQuote:
    `Farah, your board pulled together a focused brief on your windfall. ` +
    `Here's what they found and what they recommend.`,
  agents: [
    {
      id: 'sentinel',
      label: 'Sentinel',
      badge: 'Warning',
      badgeType: 'warning' as const,
      text: `Burn rate still 1.4× — windfall won't fix the velocity.`,
    },
    {
      id: 'scout',
      label: 'Scout',
      badge: 'Opportunity',
      badgeType: 'opportunity' as const,
      text: `RM320 windfall confirmed. Unallocated.`,
    },
    {
      id: 'architect',
      label: 'Architect',
      badge: 'Delay',
      badgeType: 'delay' as const,
      text: `Windfall to goal = recover 8-day Okinawa delay.`,
    },
    {
      id: 'shield',
      label: 'Shield',
      badge: 'Protected',
      badgeType: 'protected' as const,
      text: `Travel shield active. No new risks detected.`,
    },
  ],
  recommendations: [
    {
      id: 'rec1',
      title: 'Allocate RM200 → Okinawa goal',
      subtitle: 'Architect · recovers the delay',
      action: 'approve' as const,
    },
    {
      id: 'rec2',
      title: 'Move RM120 → Emergency Pocket',
      subtitle: 'Scout · rest of windfall',
      action: 'approve' as const,
    },
    {
      id: 'rec3',
      title: 'Get Travel Insurance',
      subtitle: 'Shield · protect your trip',
      action: 'explore' as const,
    },
  ],
};
