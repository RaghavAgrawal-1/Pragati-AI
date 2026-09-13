/**
 * Risk vocabulary. Colour is never the only signal — every level also carries
 * a label and a dot, so the scale survives greyscale printing and colour
 * vision deficiency.
 */
export const RISK_LEVELS = {
  low:      { key: "low",      label: "Low",      dot: "bg-emerald-400", text: "text-emerald-400", chip: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  medium:   { key: "medium",   label: "Medium",   dot: "bg-amber-400",   text: "text-amber-400",   chip: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  high:     { key: "high",     label: "High",     dot: "bg-orange-400",  text: "text-orange-400",  chip: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  critical: { key: "critical", label: "Critical", dot: "bg-red-400",     text: "text-red-400",     chip: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export const RISK_ORDER = ["low", "medium", "high", "critical"];

export const RISK_HEX = { low: "#22C55E", medium: "#F59E0B", high: "#F97316", critical: "#EF4444" };
