export const WARNING_TYPES = {
  cost_escalation: "Cost escalation",
  schedule_delay: "Schedule delay",
  low_progress: "Low physical progress",
  milestone_delay: "Milestone delay",
  expenditure_anomaly: "Expenditure anomaly",
  risk_increase: "Risk increase",
};

export const warningTypeLabel = (key) => WARNING_TYPES[key] ?? "Warning";
