import { toPercent } from "./formatPercentage";

/** Cost growth over the approved figure, as a percentage. Null when unknowable. */
export function costEscalation(project) {
  const approved = Number(project?.approved_cost);
  const revised = Number(project?.revised_cost);
  if (!approved || !revised) return null;
  return ((revised - approved) / approved) * 100;
}

export function expenditureShare(project) {
  const revised = Number(project?.revised_cost ?? project?.approved_cost);
  const spent = Number(project?.cumulative_expenditure);
  if (!revised || spent === undefined || Number.isNaN(spent)) return null;
  return (spent / revised) * 100;
}

export function progressPercent(project) {
  return toPercent(project?.physical_progress);
}

export const projectId = (p) => p?.project_id ?? p?.id ?? p?.code;
