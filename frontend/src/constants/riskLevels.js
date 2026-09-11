/**
 * Risk vocabulary. Colour is never the only signal — every level also carries
 * a label and a dot, so the scale survives greyscale printing and colour
 * vision deficiency.
 */
export const RISK_LEVELS = {
  low: { key: "low", label: "Low", dot: "bg-risk-low", text: "text-risk-low", chip: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  medium: { key: "medium", label: "Medium", dot: "bg-risk-medium", text: "text-risk-medium", chip: "bg-amber-50 text-amber-800 border-amber-200" },
  high: { key: "high", label: "High", dot: "bg-risk-high", text: "text-risk-high", chip: "bg-orange-50 text-orange-800 border-orange-200" },
  critical: { key: "critical", label: "Critical", dot: "bg-risk-critical", text: "text-risk-critical", chip: "bg-red-50 text-red-800 border-red-200" },
};

export const RISK_ORDER = ["low", "medium", "high", "critical"];

export const RISK_HEX = { low: "#2E7D53", medium: "#B4801F", high: "#C2601F", critical: "#B3372F" };
