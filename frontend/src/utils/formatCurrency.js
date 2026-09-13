/** Indian numbering — infrastructure costs are quoted in Crores (Cr). */
export function formatCurrency(value, { compact = true } = {}) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
  const n = Number(value);
  if (!compact) {
    return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`;
  }
  // In Pragati AI data, numbers represent Crore (Cr) amounts
  if (Math.abs(n) >= 1000) {
    return `₹${(n / 1000).toFixed(1)}K Cr`;
  }
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 1 })} Cr`;
}
