/** Accepts either 0–1 or 0–100 and renders consistently. */
export function formatPercentage(value, digits = 0) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
  const n = Number(value);
  return `${(n <= 1 ? n * 100 : n).toFixed(digits)}%`;
}

export function toPercent(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return null;
  const n = Number(value);
  return n <= 1 ? n * 100 : n;
}
