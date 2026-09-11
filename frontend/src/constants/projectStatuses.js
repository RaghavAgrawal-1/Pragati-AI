export const PROJECT_STATUSES = {
  "on track": { label: "On track", chip: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  delayed: { label: "Delayed", chip: "bg-orange-50 text-orange-800 border-orange-200" },
  stalled: { label: "Stalled", chip: "bg-red-50 text-red-800 border-red-200" },
  completed: { label: "Completed", chip: "bg-slate-100 text-slate-700 border-slate-200" },
  "not started": { label: "Not started", chip: "bg-slate-50 text-slate-600 border-slate-200" },
};

export const statusOf = (raw) =>
  PROJECT_STATUSES[String(raw ?? "").toLowerCase()] ?? { label: raw ?? "Unknown", chip: "bg-slate-50 text-slate-600 border-slate-200" };
