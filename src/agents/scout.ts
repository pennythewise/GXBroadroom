// Agent-1: Scout — income and windfall detection. Sprint 2+.

export interface ScoutPayload {
  total_income: number;
  windfall_amount: number;
  windfall_source: string;
  growth_pct: number;
  recommendation: string;
}

export function runScout(): ScoutPayload {
  // Implemented in Sprint 2. Returns mock payload for now.
  return {
    total_income: 0,
    windfall_amount: 0,
    windfall_source: '',
    growth_pct: 0,
    recommendation: '',
  };
}
