import { RISK_LEVELS, RISK_ORDER } from "../constants/riskLevels";
import { toPercent } from "./formatPercentage";

/** Bands a 0–1 or 0–100 score. Only used when the API sends a score and no label. */
export function riskLevelFromScore(score) {
  const pct = toPercent(score);
  if (pct === null) return null;
  if (pct >= 75) return "critical";
  if (pct >= 55) return "high";
  if (pct >= 30) return "medium";
  return "low";
}

/** Prefer the backend's own classification; fall back to banding the score. */
export function resolveRisk(input) {
  if (!input) return null;
  const key = String(input.level ?? input.risk_level ?? "").toLowerCase();
  const level = RISK_ORDER.includes(key) ? key : riskLevelFromScore(input.score ?? input.risk_score);
  return level ? { ...RISK_LEVELS[level], score: toPercent(input.score ?? input.risk_score) } : null;
}
