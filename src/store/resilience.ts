import { create } from 'zustand';
import {
  runSentinel,
  type SentinelPayload,
  type VelocityResult,
} from '@/agents/sentinel';
import {
  MOCK_INCOME,
  MOCK_SPEND,
  MOCK_S2S,
  MOCK_GOAL,
  MOCK_RESILIENCE,
  MOCK_SHIELDS,
  MOCK_WINDFALL,
} from '@/mock/data';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Goal {
  name: string;
  emoji: string;
  target: number;
  saved: number;
  progress_pct: number;
  eta_original: string;
  eta_current: string;
  days_delayed: number;
}

export interface ShieldStatus {
  id: string;
  label: string;
  status: 'active' | 'recommended' | 'inactive';
  price_mo: number;
  trigger_reason?: string;
}

export interface ResilienceState {
  // Core S₂S metrics (Agent-2 Sentinel)
  s2s_daily: number;
  actual_daily_spend: number;
  burn_velocity: number;
  velocity_status: VelocityResult['status'];
  guardrail_active: boolean;
  guardrail_daily_cap: number;

  // Goals (Agent-3 Architect)
  goals: Goal[];

  // Shields (Agent-4 Shield)
  shields: ShieldStatus[];

  // Scores
  resilience_score: number;
  resilience_delta: number;
  resilience_buffer_rm: number;

  // Pending actions
  windfall_pending: number;
  windfall_source: string;

  // Report state
  board_report_ready: boolean;
  approved_actions: Set<string>;

  // ── Actions ──────────────────────────────────────────────────────────────────

  /** Runs Agent-2 Sentinel and updates all velocity/S₂S fields. */
  runSentinelAnalysis: (params?: Partial<SentinelRunParams>) => void;

  /** Mark a board action as approved (e.g. "approve_windfall", "approve_shield"). */
  approveAction: (actionId: string) => void;

  /** Activate a shield by ID. */
  activateShield: (shieldId: string) => void;

  /** Allocate windfall to a pocket (clears windfall_pending). */
  allocateWindfall: () => void;

  /** DEV ONLY: load mock data and mark board report ready. */
  triggerBoardMeeting: () => void;

  /** Reset approved actions (for demo replay). */
  resetApprovals: () => void;
}

interface SentinelRunParams {
  income_total: number;
  fixed_commitments: number;
  days_in_month: number;
  actual_daily_spend: number;
  weekly_spend: number;
  remaining_budget: number;
  days_remaining: number;
}

// ── Default mock Sentinel params ──────────────────────────────────────────────

const DEFAULT_SENTINEL_PARAMS: SentinelRunParams = {
  income_total: MOCK_INCOME.total,
  // Back-calculate fixed commitments so S₂S = 71:
  // fixed = income - (s2s_daily * days) = 2840 - (71 * 31) = 2840 - 2201 = 639
  fixed_commitments: 639,
  days_in_month: 31,
  actual_daily_spend: MOCK_S2S.actual_daily,
  weekly_spend: MOCK_SPEND.weekly[2].amount, // W3 = RM720 (worst week)
  remaining_budget: MOCK_S2S.week4_cap * 7,  // RM385 left for week 4
  days_remaining: 7,
};

// ── Initial shield list from mock catalog ─────────────────────────────────────

function buildShields(): ShieldStatus[] {
  return Object.entries(MOCK_SHIELDS.catalog).map(([id, meta]) => ({
    id,
    label: meta.label,
    status: meta.status,
    price_mo: meta.price_mo,
    trigger_reason: 'trigger_reason' in meta ? meta.trigger_reason : undefined,
  }));
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useResilienceStore = create<ResilienceState>((set, get) => ({
  // Initial values from mock data (matches PRD ResilienceState object)
  s2s_daily: MOCK_S2S.daily,
  actual_daily_spend: MOCK_S2S.actual_daily,
  burn_velocity: MOCK_S2S.burn_velocity,
  velocity_status: 'warning',
  guardrail_active: false,
  guardrail_daily_cap: MOCK_S2S.daily,

  goals: [
    {
      name: MOCK_GOAL.name,
      emoji: MOCK_GOAL.emoji,
      target: MOCK_GOAL.target,
      saved: MOCK_GOAL.saved,
      progress_pct: MOCK_GOAL.progress_pct,
      eta_original: MOCK_GOAL.eta_original,
      eta_current: MOCK_GOAL.eta_current,
      days_delayed: MOCK_GOAL.days_delayed,
    },
  ],

  shields: buildShields(),

  resilience_score: MOCK_RESILIENCE.score,
  resilience_delta: MOCK_RESILIENCE.delta,
  resilience_buffer_rm: MOCK_RESILIENCE.buffer_rm,

  windfall_pending: MOCK_WINDFALL.amount,
  windfall_source: MOCK_WINDFALL.source,

  board_report_ready: false,
  approved_actions: new Set<string>(),

  // ── Actions ────────────────────────────────────────────────────────────────

  runSentinelAnalysis: (params) => {
    const merged: SentinelRunParams = { ...DEFAULT_SENTINEL_PARAMS, ...params };
    const payload: SentinelPayload = runSentinel(merged);

    set({
      s2s_daily: payload.velocity.s2s_daily,
      actual_daily_spend: payload.velocity.actual_daily,
      burn_velocity: payload.velocity.burn_velocity,
      velocity_status: payload.velocity.status,
      guardrail_active: payload.guardrail_active,
      guardrail_daily_cap: payload.guardrail_daily_cap,
    });
  },

  approveAction: (actionId) => {
    const current = new Set(get().approved_actions);
    current.add(actionId);
    set({ approved_actions: current });
  },

  activateShield: (shieldId) => {
    set((state) => ({
      shields: state.shields.map((s) =>
        s.id === shieldId ? { ...s, status: 'active' } : s,
      ),
    }));
  },

  allocateWindfall: () => {
    // Windfall allocated to emergency pocket — clears pending amount
    set({ windfall_pending: 0 });
  },

  triggerBoardMeeting: () => {
    // DEV shortcut: populate full mock state and mark report ready.
    // Only used in __DEV__ demo flow.
    if (!__DEV__) return;

    const payload: SentinelPayload = runSentinel(DEFAULT_SENTINEL_PARAMS);

    set({
      s2s_daily: payload.velocity.s2s_daily,
      actual_daily_spend: payload.velocity.actual_daily,
      burn_velocity: payload.velocity.burn_velocity,
      velocity_status: payload.velocity.status,
      guardrail_active: payload.guardrail_active,
      guardrail_daily_cap: payload.guardrail_daily_cap,
      board_report_ready: true,
      approved_actions: new Set<string>(),
    });
  },

  resetApprovals: () => {
    set({ approved_actions: new Set<string>() });
  },
}));

// ── Selectors ─────────────────────────────────────────────────────────────────
// Derived reads used by UI — avoids computed logic leaking into components.

export const selectVelocityLabel = (state: ResilienceState): string => {
  const v = state.burn_velocity;
  return `${v.toFixed(1)}× S₂S`;
};

export const selectAllActionsApproved = (state: ResilienceState): boolean => {
  const required = ['approve_windfall', 'approve_goal_lock', 'approve_shield', 'approve_allowance'];
  return required.every((id) => state.approved_actions.has(id));
};

export const selectPrimaryGoal = (state: ResilienceState): Goal | undefined =>
  state.goals[0];

export const selectActiveShields = (state: ResilienceState): ShieldStatus[] =>
  state.shields.filter((s) => s.status === 'active');

export const selectRecommendedShields = (state: ResilienceState): ShieldStatus[] =>
  state.shields.filter((s) => s.status === 'recommended');
