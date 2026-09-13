import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const LABELS = {
  dashboard: "Overview", projects: "Projects", predictions: "Predictive Analytics", risk: "Risk Assessment",
  warnings: "Early Warnings", interventions: "Interventions", analytics: "Analytics",
  assistant: "Assistant", settings: "Settings", cost: "Cost", time: "Time",
  benchmark: "Benchmarking", timeline: "Timeline", performance: "Performance",
  budget: "Budget Intelligence", reports: "Reports",
};

export default function Breadcrumbs({ className = "" }) {
  const segments = useLocation().pathname.split("/").filter(Boolean);
  if (segments.length < 2) return null;

  return (
    <nav aria-label="Breadcrumb" className={`items-center gap-1 text-[11.5px] text-muted ${className}`}>
      {segments.map((seg, i) => {
        const to = `/${segments.slice(0, i + 1).join("/")}`;
        const last = i === segments.length - 1;
        const label = LABELS[seg] ?? seg.toUpperCase();
        return (
          <span key={to} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={11} className="text-muted/60" aria-hidden="true" />}
            {last ? (
              <span className="font-semibold text-ink">{label}</span>
            ) : (
              <Link to={to} className="text-muted hover:text-ink transition-colors">{label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
