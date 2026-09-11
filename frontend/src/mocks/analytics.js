/** DEMO DATA — not real. See mocks/projects.js for the rule. */
import { MOCK_PROJECTS } from "./projects";

export const MOCK_DASHBOARD = {
  updated_at: "2026-09-11T15:30:00Z",
  kpis: {
    total_projects: 1284,
    high_risk_projects: 127,
    cost_risk_projects: 96,
    time_risk_projects: 148,
    critical_alerts: 14,
    trends: { total_projects: 2.1, high_risk_projects: 8.4, cost_risk_projects: -3.2, time_risk_projects: 5.6, critical_alerts: 12.0 },
  },
  risk_distribution: [
    { level: "low", count: 742 },
    { level: "medium", count: 415 },
    { level: "high", count: 103 },
    { level: "critical", count: 24 },
  ],
  risk_trend: [
    { period: "Apr", high: 84, critical: 12 },
    { period: "May", high: 91, critical: 14 },
    { period: "Jun", high: 88, critical: 13 },
    { period: "Jul", high: 97, critical: 18 },
    { period: "Aug", high: 109, critical: 21 },
    { period: "Sep", high: 103, critical: 24 },
  ],
  by_sector: [
    { sector: "Roads", count: 412 },
    { sector: "Railways", count: 268 },
    { sector: "Power", count: 197 },
    { sector: "Water", count: 164 },
    { sector: "Urban Transport", count: 143 },
    { sector: "Ports", count: 100 },
  ],
  by_ministry: [
    { ministry: "Road Transport", count: 398 },
    { ministry: "Railways", count: 271 },
    { ministry: "Power", count: 186 },
    { ministry: "Jal Shakti", count: 158 },
    { ministry: "Urban Affairs", count: 149 },
  ],
  cost_overview: { approved_cost: 8412000000000, revised_cost: 9187000000000, expenditure: 5940000000000 },
  critical_projects: MOCK_PROJECTS.filter((p) => ["high", "critical"].includes(p.risk.level)),
  executive_insight: null, // never fabricated — comes from the model or stays empty
};

export const MOCK_PORTFOLIO = {
  average_progress: 0.57,
  delayed_projects: 348,
  average_cost_escalation: 12.4,
  by_sector_risk: MOCK_DASHBOARD.by_sector.map((s, i) => ({ ...s, high_risk: [61, 38, 21, 19, 24, 9][i] })),
};
