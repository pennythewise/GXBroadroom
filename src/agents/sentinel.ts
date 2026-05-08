// Agent-2: Sentinel — transaction stream analysis and S₂S velocity engine.
// Pure functions only. No UI, no store imports.

import { LOCATION_MULTIPLIER } from '@/mock/data';

export interface S2SInputs {
  income_total: number;
  fixed_commitments: number; // rent, subscriptions, recurring bills
  days_in_month: number;
}

export interface VelocityResult {
  s2s_daily: number;
  actual_daily: number;
  burn_velocity: number;
  status: 'normal' | 'warning' | 'critical';
}

export interface SpendSpikeResult {
  location: string;
  multiplier: number;
  adjusted_spend: number;
  is_spike: boolean;
}

export interface WeeklyBurnResult {
  weekly_spend: number;
  s2s_weekly: number;
  velocity_weekly: number;
  exceeds_threshold: boolean; // true when velocity > 1.5 — triggers Sentinel sheet
}

export interface SentinelPayload {
  velocity: VelocityResult;
  weekly_burn: WeeklyBurnResult;
  guardrail_active: boolean;
  guardrail_daily_cap: number;
}

// S₂S = (income − fixed_commitments) / days_in_month
export function computeS2S({ income_total, fixed_commitments, days_in_month }: S2SInputs): number {
  const discretionary = income_total - fixed_commitments;
  return Math.max(0, Math.round(discretionary / days_in_month));
}

// Burn velocity = actual_daily_spend / s2s_daily
// status thresholds: <1.0 normal, 1.0–1.5 warning, >1.5 critical
export function computeBurnVelocity(actual_daily: number, s2s_daily: number): VelocityResult {
  const burn_velocity = s2s_daily > 0 ? actual_daily / s2s_daily : 0;
  let status: VelocityResult['status'] = 'normal';
  if (burn_velocity >= 1.5) status = 'critical';
  else if (burn_velocity >= 1.0) status = 'warning';

  return {
    s2s_daily,
    actual_daily,
    burn_velocity: parseFloat(burn_velocity.toFixed(2)),
    status,
  };
}

// Adjust a raw spend amount for location-based multiplier (Kepong 0.7, KLCC 1.4)
export function adjustForLocation(raw_spend: number, location: string): SpendSpikeResult {
  const multiplier = LOCATION_MULTIPLIER[location] ?? 1.0;
  const adjusted_spend = raw_spend * multiplier;
  return {
    location,
    multiplier,
    adjusted_spend: parseFloat(adjusted_spend.toFixed(2)),
    is_spike: multiplier > 1.2,
  };
}

// Weekly burn check — triggers Transfer Interception sheet when velocity > 1.5
export function computeWeeklyBurn(
  weekly_spend: number,
  s2s_daily: number,
): WeeklyBurnResult {
  const s2s_weekly = s2s_daily * 7;
  const velocity_weekly = s2s_weekly > 0 ? weekly_spend / s2s_weekly : 0;

  return {
    weekly_spend,
    s2s_weekly,
    velocity_weekly: parseFloat(velocity_weekly.toFixed(2)),
    exceeds_threshold: velocity_weekly > 1.5,
  };
}

// Guardrail cap = reduce daily limit to prevent further overspend.
// Cap = remaining_budget / days_remaining
export function computeGuardrailCap(
  remaining_budget: number,
  days_remaining: number,
): number {
  if (days_remaining <= 0) return 0;
  return Math.floor(remaining_budget / days_remaining);
}

// Top-level function: runs full Sentinel analysis for the current month.
// Called by the store action — returns a typed SentinelPayload.
export function runSentinel(params: {
  income_total: number;
  fixed_commitments: number;
  days_in_month: number;
  actual_daily_spend: number;
  weekly_spend: number;
  remaining_budget: number;
  days_remaining: number;
}): SentinelPayload {
  const s2s_daily = computeS2S({
    income_total: params.income_total,
    fixed_commitments: params.fixed_commitments,
    days_in_month: params.days_in_month,
  });

  const velocity = computeBurnVelocity(params.actual_daily_spend, s2s_daily);

  const weekly_burn = computeWeeklyBurn(params.weekly_spend, s2s_daily);

  // Guardrail activates when overall burn is at warning+ level (≥1.0× S₂S).
  // The Transfer sheet's stricter 1.5× threshold is separate (weekly_burn.exceeds_threshold).
  const guardrail_active = velocity.status !== 'normal' || weekly_burn.exceeds_threshold;
  const guardrail_daily_cap = guardrail_active
    ? computeGuardrailCap(params.remaining_budget, params.days_remaining)
    : s2s_daily;

  return {
    velocity,
    weekly_burn,
    guardrail_active,
    guardrail_daily_cap,
  };
}
