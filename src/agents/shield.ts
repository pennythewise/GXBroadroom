// Agent-4: Shield — outflow metadata, Risk Score (Rs), insurance/scam flows. Sprint 4+.

export interface ShieldPayload {
  rs: number; // Risk Score 0–1; >0.8 triggers speed-bump
  recommended_shields: string[];
  trigger_reason: string;
}

export function computeRiskScore(params: {
  is_new_recipient: boolean;
  amount: number;
  mcc: string;
}): number {
  // Simplified Rs heuristic — full model in Sprint 4.
  let score = 0;
  if (params.is_new_recipient) score += 0.5;
  if (params.amount > 2000) score += 0.3;
  if (params.mcc === 'P2P') score += 0.1;
  return Math.min(1, parseFloat(score.toFixed(2)));
}

export function runShield(): ShieldPayload {
  return {
    rs: 0,
    recommended_shields: [],
    trigger_reason: '',
  };
}
