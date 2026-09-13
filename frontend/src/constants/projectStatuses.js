export const PROJECT_STATUSES = {
  "on track":    { label: "On Track",    chip: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  delayed:       { label: "Delayed",     chip: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  stalled:       { label: "Stalled",     chip: "bg-red-500/10 text-red-400 border-red-500/20" },
  stopped:       { label: "Stopped",     chip: "bg-red-500/10 text-red-400 border-red-500/20" },
  completed:     { label: "Completed",   chip: "bg-slate-500/10 text-slate-300 border-slate-500/20" },
  "not started": { label: "Not Started", chip: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
  ongoing:       { label: "Ongoing",     chip: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  running:       { label: "Running",     chip: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  "in progress": { label: "In Progress", chip: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  critical:      { label: "Critical",    chip: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export const statusOf = (raw) =>
  PROJECT_STATUSES[String(raw ?? "").toLowerCase()] ?? {
    label: raw ?? "Unknown",
    chip:  "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };
